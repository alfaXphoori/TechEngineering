#include "mock_arduino.h"

MockSerial Serial;

// การนิยามสถานะใน FSM ด้วย enum class ป้องกันปัญหาระดับประเภทข้อมูล
enum class State {
    IDLE,
    PUMPING,
    COOLDOWN_DELAY,
    FAULT
};

// พินกำหนดอินพุต/เอาต์พุตของระบบ
const uint8_t TEMP_PIN = 34;      // ขาอินพุตแอนะล็อกเชื่อมกับเซ็นเซอร์วัดอุณหภูมิ (ADC1)
const uint8_t PUMP_PIN = 25;      // ขาสั่งงานรีเลย์ควบคุมปั๊มน้ำระบายความร้อน
const uint8_t BUZZER_PIN = 26;    // ขาสั่งการบัซเซอร์สัญญาณเตือนภัย (Siren)
const uint8_t RESET_BTN_PIN = 14;  // ขาต่อปุ่มกด Reset (วงจรดึง Pull-up ภายใน, กดปุ่ม = LOW)

// ค่าเกณฑ์และค่าทางวิศวกรรม
const double TEMP_PUMP_ON = 80.0;   // อุณหภูมิสั่งเริ่มปั๊มน้ำ (°C)
const double TEMP_PUMP_OFF = 60.0;  // อุณหภูมิสั่งเริ่มหยุดปั๊ม (°C)
const double TEMP_CRITICAL = 95.0;  // อุณหภูมิวิกฤต บังคับเข้าสู่ FAULT (°C)
const double TEMP_SAFE_RESET = 70.0;// อุณหภูมิปลอดภัยที่ยินยอมให้เริ่มทำงานใหม่หลังเคลียร์ FAULT (°C)

const unsigned long COOLDOWN_DURATION = 10000; // ระยะเวลาชะลอการปิดปั๊ม 10 วินาที (10,000 ms)
const unsigned long DEBOUNCE_DELAY = 50;       // เวลาการกรองปุ่มกดหน้าสัมผัส 50 ms

// ตัวแปรควบคุมระบบ
State currentState = State::IDLE;
unsigned long cooldownStart = 0;

// ตัวแปรกองสัญญาณปุ่มกด (Debounce variables)
int lastButtonState = HIGH;      // หน้าสัมผัสปกติเนื่องจาก Pull-up
int buttonState = HIGH;          // สถานะปุ่มคัดกรองแล้ว
unsigned long lastDebounceTime = 0; 

// ฟังก์ชันแปลงสัญญาณ ADC และตรวจสอบสถานะเซ็นเซอร์ (Failsafe)
// ส่งค่ากลับเป็น true หากเซ็นเซอร์ปกติ และเก็บอุณหภูมิในพารามิเตอร์อ้างอิง tempCelsius
bool readTemperature(double &tempCelsius) {
    int rawAdc = analogRead(TEMP_PIN); // อ่านค่าขนาด 12-bit (0 - 4095)
    
    // ตรวจสอบความปลอดภัยเซ็นเซอร์ (Open / Short circuit checking)
    // สำหรับ ESP32 ADC ที่แรงดันสูงสุด 3.1V หากสายขาดหรือชอร์ต แรงดันไฟฟ้าจะกระโดดขอบวงจร
    if (rawAdc < 50 || rawAdc > 4050) {
        return false; // เกิดปัญหาที่ตัวอุปกรณ์วัดค่า
    }
    
    // คำนวณแปลงค่าดิบตามข้อมูลผู้ผลิต:
    // แรงดันเซ็นเซอร์: Vout = (10mV/C) * T + 500mV -> Vout (mV) = 10 * T + 500
    // แรงดันรับเข้า ESP32: V_adc (mV) = rawAdc * (3100.0 / 4095.0)
    double vAdcMv = ((double)rawAdc * 3100.0) / 4095.0;
    tempCelsius = (vAdcMv - 500.0) / 10.0;
    return true; // การวัดค่าเสร็จสมบูรณ์
}

// ฟังก์ชันพิมพ์บันทึกการเปลี่ยนผ่านสถานะการทำงานออก Serial Monitor
const char* stateToString(State s) {
    switch (s) {
        case State::IDLE: return "IDLE";
        case State::PUMPING: return "PUMPING";
        case State::COOLDOWN_DELAY: return "COOLDOWN_DELAY";
        case State::FAULT: return "FAULT";
    }
    return "UNKNOWN";
}

void transitionTo(State newState) {
    Serial.print("[FSM] Transition: ");
    Serial.print(stateToString(currentState));
    Serial.print(" -> ");
    Serial.println(stateToString(newState));
    currentState = newState;
}

void setup() {
    Serial.begin(115200);
    
    pinMode(PUMP_PIN, OUTPUT);
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(RESET_BTN_PIN, INPUT_PULLUP);
    
    // ตั้งค่าความปลอดภัยล่วงหน้า
    digitalWrite(PUMP_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    
    Serial.println("[SYSTEM] Boiler Cooling Pump Controller Initialized.");
}

void loop() {
    double currentTemp = 0.0;
    bool isSensorHealthy = readTemperature(currentTemp);
    
    // -------------------------------------------------------------
    // กลไกคัดกรองหน้าสัมผัสสวิตช์ปุ่มกด (Software Debounce)
    // -------------------------------------------------------------
    int currentBtnReading = digitalRead(RESET_BTN_PIN);
    bool isResetActivated = false;
    
    if (currentBtnReading != lastButtonState) {
        lastDebounceTime = millis(); // เริ่มนับเวลาใหม่เมื่อพบการแกว่ง
    }
    
    if ((millis() - lastDebounceTime) > DEBOUNCE_DELAY) {
        if (currentBtnReading != buttonState) {
            buttonState = currentBtnReading;
            if (buttonState == LOW) { // กดปุ่มทำงาน (ลอจิกเป็น LOW เนื่องจากวงจร Pull-up)
                isResetActivated = true;
            }
        }
    }
    lastButtonState = currentBtnReading;
    
    // -------------------------------------------------------------
    // ส่วนประมวลผลเงื่อนไขสถานะ (Finite State Machine Execution)
    // -------------------------------------------------------------
    switch (currentState) {
        case State::IDLE:
            digitalWrite(PUMP_PIN, LOW);
            digitalWrite(BUZZER_PIN, LOW);
            
            if (!isSensorHealthy) {
                Serial.println("[CRITICAL] Sensor fault detected in IDLE!");
                transitionTo(State::FAULT);
            } else if (currentTemp > TEMP_PUMP_ON) {
                Serial.print("[TEMP ALERT] Temp: ");
                Serial.print(currentTemp);
                Serial.println(" C. Starting cooling.");
                transitionTo(State::PUMPING);
            }
            break;
            
        case State::PUMPING:
            digitalWrite(PUMP_PIN, HIGH); // สั่งปั๊มทำงานระบายความร้อน
            digitalWrite(BUZZER_PIN, LOW);
            
            if (!isSensorHealthy) {
                Serial.println("[CRITICAL] Sensor fault detected during PUMPING!");
                transitionTo(State::FAULT);
            } else if (currentTemp > TEMP_CRITICAL) {
                Serial.print("[CRITICAL] Boiler temperature exceeded threshold: ");
                Serial.print(currentTemp);
                Serial.println(" C!");
                transitionTo(State::FAULT);
            } else if (currentTemp < TEMP_PUMP_OFF) {
                Serial.print("[TEMP OK] Temp fell to ");
                Serial.print(currentTemp);
                Serial.println(" C. Entering post-cooling.");
                cooldownStart = millis(); // บันทึกเวลาก่อนหน่วงสถานะ
                transitionTo(State::COOLDOWN_DELAY);
            }
            break;
            
        case State::COOLDOWN_DELAY:
            digitalWrite(PUMP_PIN, HIGH); // ปั๊มรันต่อไปในระดับหน่วงเวลา
            digitalWrite(BUZZER_PIN, LOW);
            
            if (!isSensorHealthy) {
                Serial.println("[CRITICAL] Sensor fault detected in COOLDOWN!");
                transitionTo(State::FAULT);
            } else if (currentTemp > TEMP_CRITICAL) {
                Serial.println("[CRITICAL] Temperature spikes during COOLDOWN!");
                transitionTo(State::FAULT);
            } else if (currentTemp > TEMP_PUMP_ON) {
                // หากอุณหภูมิกลับขึ้นสูงก่อนชะลอเวลาสิ้นสุด ให้กระโดดไปรันเต็มตัวใหม่
                Serial.println("[WARN] Temperature rose again. Returning to PUMPING.");
                transitionTo(State::PUMPING);
            } else if (millis() - cooldownStart >= COOLDOWN_DURATION) {
                Serial.println("[INFO] Post-cooling finished. Pump stopped.");
                transitionTo(State::IDLE);
            }
            break;
            
        case State::FAULT:
            // โหมดความปลอดภัยสูงสุด: เปิดปั๊มเพื่อลดอุณหภูมิ, ส่งสัญญาณเตือน
            digitalWrite(PUMP_PIN, HIGH);
            digitalWrite(BUZZER_PIN, HIGH);
            
            // รอรับสัญญาณการกู้คืนเครื่องจากวิศวกรผู้ควบคุม
            if (isResetActivated) {
                if (!isSensorHealthy) {
                    Serial.println("[RESET REJECTED] Cannot reset system: Sensor is still faulty!");
                } else if (currentTemp >= TEMP_SAFE_RESET) {
                    Serial.print("[RESET REJECTED] Temperature is still unsafe (");
                    Serial.print(currentTemp);
                    Serial.print(" C >= ");
                    Serial.print(TEMP_SAFE_RESET);
                    Serial.println(" C)");
                } else {
                    Serial.println("[SYSTEM RESET] Fault cleared. System returning to IDLE.");
                    transitionTo(State::IDLE);
                }
            }
            break;
    }
}

int main() {
    setup();
    loop();
    return 0;
}
