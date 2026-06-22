# Chapter 5: การเชื่อมต่อสัญญาณดิจิทัลและแอนะล็อก
## Digital & Analog I/O Interfacing

> บทนี้จะพาทำความเข้าใจวิธีที่ไมโครคอนโทรลเลอร์ (Microcontroller) "คุยกับโลกภายนอก" ผ่านสัญญาณไฟฟ้า ทั้งแบบดิจิทัล (Digital) ที่มีแค่ เปิด/ปิด และแบบแอนะล็อก (Analog) ที่มีค่าต่อเนื่อง เราจะฝึกบน ESP32 ผ่าน Wokwi Simulator เป็นหลัก

---

## 5.1 Digital I/O: ลอจิก HIGH/LOW

### 5.1.1 ระดับแรงดันของ ESP32

ESP32 ทำงานที่แรงดันลอจิก **3.3 V** ซึ่งแตกต่างจาก Arduino Uno ที่ใช้ 5 V

| สถานะลอจิก | ระดับแรงดัน ESP32 | ความหมาย |
|---|---|---|
| **HIGH** (1) | ≈ 3.3 V | เปิด / จริง (True) |
| **LOW** (0) | ≈ 0 V (GND) | ปิด / เท็จ (False) |

ขา GPIO (General Purpose Input/Output) แต่ละขาสามารถตั้งเป็น **INPUT** (รับสัญญาณเข้า) หรือ **OUTPUT** (ส่งสัญญาณออก) ได้ผ่านฟังก์ชัน `pinMode()`

### 5.1.2 ปัญหาสัญญาณลอย (Floating) และ Pull-up / Pull-down

เมื่อตั้งขาเป็น `INPUT` แล้วไม่ได้ต่อวงจรภายนอกให้ครบ ขานั้นจะอยู่ในสถานะ **ลอย (Floating)** คือแรงดันไม่แน่นอน อาจอ่านได้ทั้ง HIGH และ LOW สุ่ม ๆ ทำให้โปรแกรมทำงานผิดพลาด

**วิธีแก้:** ใช้ตัวต้านทาน Pull-up หรือ Pull-down

- **Pull-up**: ต่อตัวต้านทานจากขา GPIO ไปยัง 3.3 V → สถานะปกติเป็น HIGH, กดปุ่มแล้วเป็น LOW
- **Pull-down**: ต่อตัวต้านทานจากขา GPIO ไปยัง GND → สถานะปกติเป็น LOW, กดปุ่มแล้วเป็น HIGH

ESP32 มี **ตัวต้านทาน Pull-up ภายใน (Internal Pull-up)** ในตัว ใช้งานได้ง่ายโดยตั้ง `pinMode(pin, INPUT_PULLUP)` โดยไม่ต้องต่อตัวต้านทานภายนอก

> 💡 **เคล็ดลับ:** เมื่อใช้ `INPUT_PULLUP` กับปุ่มกด สถานะจะ **กลับด้าน** — ปุ่มไม่ถูกกด = HIGH, ปุ่มถูกกด = LOW เพราะปุ่มจะดึงสัญญาณลง GND

### 5.1.3 ตัวอย่างโค้ด: อ่านปุ่มกดเปิด-ปิด LED

```cpp
// อ่านปุ่มกด (Push Button) ด้วย INPUT_PULLUP แล้วสั่งเปิด-ปิด LED
// ทดสอบบน Wokwi: ESP32 + LED + Push Button

const int BUTTON_PIN = 14;   // ขาที่ต่อปุ่มกด
const int LED_PIN    = 27;   // ขาที่ต่อ LED

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP); // เปิด pull-up ภายใน
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);

  if (buttonState == LOW) {        // กดปุ่ม → LOW (เพราะ pull-up)
    digitalWrite(LED_PIN, HIGH);   // เปิด LED
    Serial.println("Button PRESSED → LED ON");
  } else {
    digitalWrite(LED_PIN, LOW);    // ปิด LED
  }
  delay(50); // หน่วงเวลาเล็กน้อยป้องกันสัญญาณกระเด้ง (debounce)
}
```

---

## 5.2 ADC (Analog-to-Digital Converter)

### 5.2.1 หลักการทำงาน: สุ่มตัวอย่างและควอนไทซ์

สัญญาณแอนะล็อก (เช่น แรงดันจากเซ็นเซอร์อุณหภูมิ) เป็นค่าต่อเนื่อง แต่ไมโครคอนโทรลเลอร์เข้าใจแค่ตัวเลขดิจิทัล จึงต้องมีกระบวนการ **ADC** ที่ทำ 2 ขั้นตอน:

1. **สุ่มตัวอย่าง (Sampling)** — อ่านค่าแรงดันณ ช่วงเวลาหนึ่ง
2. **ควอนไทซ์ (Quantization)** — ปัดค่าแรงดันให้เป็นจำนวนเต็มที่ใกล้เคียงที่สุดตามจำนวนบิต

### 5.2.2 ความละเอียดบิตของ ESP32

ESP32 มี ADC ความละเอียด **12 บิต (12-bit)** หมายความว่า:

- จำนวนระดับ = 2¹² = **4,096 ระดับ** (ค่า 0 ถึง 4,095)
- ช่วงแรงดันอ้างอิง (Reference Voltage) ≈ 0 – 3.3 V

| พารามิเตอร์ | Arduino Uno | ESP32 |
|---|---|---|
| ความละเอียด ADC | 10 บิต (0–1023) | 12 บิต (0–4095) |
| แรงดันอ้างอิง | 5.0 V | 3.3 V |
| ความละเอียดต่อขั้น | ≈ 4.88 mV | ≈ 0.81 mV |

### 5.2.3 สูตรแปลงค่า ADC เป็นแรงดัน

```
V_actual = (ADC_value / ADC_max) × V_ref
```

สำหรับ ESP32:

```
V_actual = (ADC_value / 4095.0) × 3.3
```

ตัวอย่าง: อ่านค่าได้ 2048 → แรงดัน ≈ (2048 / 4095) × 3.3 ≈ **1.65 V**

### 5.2.4 ตัวอย่างโค้ด: อ่านค่าจาก Potentiometer

```cpp
// อ่านค่า Potentiometer ผ่าน ADC แล้วแปลงเป็นแรงดัน
// Wokwi: ESP32 + Potentiometer ต่อขา GPIO 34

const int POT_PIN = 34;  // ขา ADC (GPIO 34 เป็น input-only)

void setup() {
  Serial.begin(115200);
  // ขา ADC ไม่ต้องตั้ง pinMode เป็น INPUT ก็ได้ (เป็นค่าปริยาย)
}

void loop() {
  int adcValue = analogRead(POT_PIN);  // อ่านค่า 0–4095

  // แปลงเป็นแรงดัน (V)
  float voltage = (adcValue / 4095.0) * 3.3;

  Serial.print("ADC: ");
  Serial.print(adcValue);
  Serial.print("  |  Voltage: ");
  Serial.print(voltage, 2);  // แสดง 2 ตำแหน่งทศนิยม
  Serial.println(" V");

  delay(500);
}
```

> 💡 **หมายเหตุสำคัญ:** บน ESP32 ขา GPIO 34, 35, 36 และ 39 เป็นขา **input-only** ไม่สามารถตั้งเป็น OUTPUT ได้ แต่เหมาะสำหรับอ่าน ADC เพราะไม่มีวงจรภายในรบกวน

---

## 5.3 PWM (Pulse Width Modulation)

### 5.3.1 หลักการ Duty Cycle และความถี่

PWM คือเทคนิคสร้างสัญญาณดิจิทัลที่ **สลับ HIGH/LOW อย่างรวดเร็ว** เพื่อจำลองค่าแอนะล็อก โดยมีพารามิเตอร์สำคัญ 2 ตัว:

- **Duty Cycle** — สัดส่วนเวลาที่สัญญาณเป็น HIGH ต่อคาบเวลา (Period) หนึ่งรอบ หน่วยเป็น `%`
  - 0% = ปิดตลอด, 50% = เปิดครึ่งปิดครึ่ง, 100% = เปิดตลอด
- **ความถี่ (Frequency)** — จำนวนรอบต่อวินาที (Hz) สำหรับ LED ทั่วไปใช้ 5,000 Hz ก็เพียงพอ

### 5.3.2 PWM บน ESP32: LEDC API

ESP32 ไม่มีฟังก์ชัน `analogWrite()` แบบ Arduino Uno โดยตรง แต่ใช้ **LEDC (LED Control)** ที่ยืดหยุ่นกว่า:

```
ledcAttach(pin, freq, resolution)   // ผูกขา GPIO กับ PWM
ledcWrite(pin, dutyCycle)           // กำหนดค่า duty cycle
```

ค่าความละเอียด (Resolution) กำหนดช่วงค่า duty cycle เช่น:
- 8 บิต → ค่า 0–255
- 10 บิต → ค่า 0–1023

### 5.3.3 ตัวอย่างโค้ด: หรี่ไฟ LED ด้วย PWM

```cpp
// หรี่ไฟ LED แบบ Fade In / Fade Out ด้วย PWM
// Wokwi: ESP32 + LED ต่อขา GPIO 16

const int LED_PIN   = 16;
const int PWM_FREQ  = 5000;  // ความถี่ 5 kHz
const int PWM_RES   = 8;     // ความละเอียด 8 บิต (0–255)

void setup() {
  ledcAttach(LED_PIN, PWM_FREQ, PWM_RES);
}

void loop() {
  // Fade In: เพิ่มความสว่างจาก 0 ถึง 255
  for (int duty = 0; duty <= 255; duty += 5) {
    ledcWrite(LED_PIN, duty);
    delay(20);
  }

  // Fade Out: ลดความสว่างจาก 255 ถึง 0
  for (int duty = 255; duty >= 0; duty -= 5) {
    ledcWrite(LED_PIN, duty);
    delay(20);
  }
}
```

### 5.3.4 การควบคุมเซอร์โวมอเตอร์ (Servo Motor)

เซอร์โวมอเตอร์ทั่วไปรับสัญญาณ PWM ความถี่ **50 Hz** โดยความกว้างพัลส์ (Pulse Width) กำหนดมุม:

- **1 ms** (duty ≈ 5%) → มุม 0°
- **1.5 ms** (duty ≈ 7.5%) → มุม 90°
- **2 ms** (duty ≈ 10%) → มุม 180°

ใน Wokwi สามารถใช้ไลบรารี `ESP32Servo.h` เพื่อสั่งมุมได้ง่ายผ่าน `servo.write(angle)`

---

## 5.4 การปรับขนาดสัญญาณด้วย `map()` และการ Calibrate

### 5.4.1 ฟังก์ชัน map()

ฟังก์ชัน `map()` ช่วย **แปลงค่าจากช่วงหนึ่งไปอีกช่วงหนึ่ง** แบบเชิงเส้น (Linear):

```
output = map(value, fromLow, fromHigh, toLow, toHigh);
```

ตัวอย่างการใช้งาน:

```
int adcVal = analogRead(34);              // 0–4095
int pwmVal = map(adcVal, 0, 4095, 0, 255); // แปลงเป็น 0–255 สำหรับ PWM 8-bit
```

### 5.4.2 การ Calibrate เซ็นเซอร์

เซ็นเซอร์จริงไม่ได้ให้ค่า 0 ที่จุดต่ำสุดหรือ 4095 ที่จุดสูงสุดเสมอไป ควร **สอบเทียบ (Calibrate)** ก่อนใช้งาน:

1. วัดค่า ADC ที่สภาวะต่ำสุด → เก็บเป็น `sensorMin`
2. วัดค่า ADC ที่สภาวะสูงสุด → เก็บเป็น `sensorMax`
3. ใช้ `map(adcVal, sensorMin, sensorMax, 0, 255)` เพื่อให้ครอบคลุมช่วงจริง
4. ใช้ `constrain(result, 0, 255)` เพื่อป้องกันค่าเกินขอบเขต

> 💡 **ทำไมต้อง constrain?** เพราะ `map()` ไม่ได้จำกัดค่าผลลัพธ์ให้อยู่ในช่วง ถ้าค่าอินพุตเกินช่วง `fromLow–fromHigh` ผลลัพธ์ก็จะเกินช่วง `toLow–toHigh` ตามไปด้วย

---

## 5.5 ตัวอย่างรวม: อ่าน LDR ปรับความสว่าง LED อัตโนมัติ

โจทย์: ใช้ **LDR (Light Dependent Resistor)** ตรวจวัดแสง แล้วปรับความสว่าง LED ให้ **สว่างขึ้นเมื่อแสงน้อย** และ **หรี่ลงเมื่อแสงมาก** (เหมือนไฟถนนอัตโนมัติ)

### วงจรบน Wokwi

- LDR + ตัวต้านทาน 10 kΩ ต่อแบบ Voltage Divider ที่ขา **GPIO 34**
- LED ต่อผ่านตัวต้านทาน 220 Ω ที่ขา **GPIO 16**

### โค้ดเต็ม

```cpp
// ระบบปรับแสง LED อัตโนมัติตามแสงแวดล้อม
// Wokwi: ESP32 + LDR (voltage divider) + LED

const int LDR_PIN = 34;   // ขา ADC สำหรับ LDR
const int LED_PIN = 16;   // ขา PWM สำหรับ LED

// ค่า Calibration (ปรับตามเซ็นเซอร์จริง)
const int LDR_MIN = 200;   // ค่า ADC เมื่อมืดสนิท
const int LDR_MAX = 3800;  // ค่า ADC เมื่อสว่างจ้า

const int PWM_FREQ = 5000;
const int PWM_RES  = 8;    // 0–255

void setup() {
  Serial.begin(115200);
  ledcAttach(LED_PIN, PWM_FREQ, PWM_RES);
  Serial.println("=== Auto Light System ===");
}

void loop() {
  int ldrValue = analogRead(LDR_PIN);

  // แปลงค่า LDR → ค่า PWM (กลับด้าน: แสงน้อย = LED สว่างมาก)
  int brightness = map(ldrValue, LDR_MIN, LDR_MAX, 255, 0);
  brightness = constrain(brightness, 0, 255);  // จำกัดขอบเขต

  ledcWrite(LED_PIN, brightness);

  // แปลงค่า ADC เป็นแรงดันเพื่อแสดงผล
  float voltage = (ldrValue / 4095.0) * 3.3;

  Serial.print("LDR ADC: ");
  Serial.print(ldrValue);
  Serial.print("  |  V: ");
  Serial.print(voltage, 2);
  Serial.print(" V  |  LED Brightness: ");
  Serial.print(brightness);
  Serial.print("/255 (");
  Serial.print((brightness * 100) / 255);
  Serial.println("%)");

  delay(200);
}
```

**อธิบายการทำงาน:**

1. `analogRead()` อ่านค่าแรงดันจาก LDR ผ่าน ADC 12-bit
2. `map()` แปลงค่าจากช่วง calibrate ไปเป็น 0–255 แบบ **กลับด้าน** (ค่า ADC สูง = แสงมาก → LED หรี่)
3. `constrain()` ป้องกันค่าหลุดขอบเขต
4. `ledcWrite()` ส่งสัญญาณ PWM ไปที่ LED

> 💡 **ลองเอง:** ใน Wokwi ให้คลิกที่ตัว LDR แล้วเลื่อนแถบ slider เพื่อจำลองแสงน้อย/มาก จะเห็น LED เปลี่ยนความสว่างตามแบบเรียลไทม์

---

## สรุปประจำบท

| หัวข้อ | ฟังก์ชันหลัก | ข้อควรจำ |
|---|---|---|
| Digital Input | `digitalRead()` + `INPUT_PULLUP` | ระวังสัญญาณ Floating, กดปุ่ม = LOW เมื่อใช้ pull-up |
| Digital Output | `digitalWrite()` | HIGH = 3.3 V, LOW = 0 V |
| ADC (อ่านค่าแอนะล็อก) | `analogRead()` | ESP32 = 12-bit (0–4095), ขา 34/35/36/39 เป็น input-only |
| PWM (สร้างสัญญาณแอนะล็อก) | `ledcAttach()` + `ledcWrite()` | กำหนด freq & resolution ก่อนใช้งาน |
| ปรับขนาดค่า | `map()` + `constrain()` | ควร calibrate ค่า min/max จากเซ็นเซอร์จริง |

**หลักคิดสำคัญ:** ไมโครคอนโทรลเลอร์พูดภาษาดิจิทัล (0 กับ 1) แต่โลกจริงเป็นแอนะล็อก — ADC เป็น "หู" ที่ฟังโลกจริง และ PWM เป็น "ปาก" ที่พูดกลับไปหาโลกจริง

---

## แบบฝึกหัดท้ายบท

**ข้อ 1:** จงอธิบายว่าปัญหา "สัญญาณลอย (Floating)" คืออะไร เกิดขึ้นเมื่อใด และแก้ไขได้อย่างไร

**ข้อ 2:** ESP32 มี ADC ความละเอียด 12 บิต ถ้าอ่านค่าได้ 3072 จงคำนวณแรงดันจริง (V) ที่ขา ADC วัดได้ (แสดงวิธีทำ)

**ข้อ 3:** สัญญาณ PWM ที่มี duty cycle 75% หมายความว่าอย่างไร? ถ้าใช้ resolution 8 บิต ค่า duty ที่ต้องใส่ใน `ledcWrite()` เท่ากับเท่าไร?

**ข้อ 4:** จงเขียนโค้ดบน ESP32 ที่อ่านค่า Potentiometer จากขา GPIO 34 แล้วแสดงค่าแรงดัน (V) ทาง Serial Monitor ทุก 1 วินาที

**ข้อ 5:** ฟังก์ชัน `map(1500, 0, 4095, 0, 255)` จะได้ผลลัพธ์ประมาณเท่าไร? จงคำนวณ

**ข้อ 6:** เมื่อใช้ `INPUT_PULLUP` กับปุ่มกด เหตุใดเมื่อกดปุ่มจึงอ่านได้ค่า LOW แทนที่จะเป็น HIGH? จงอธิบายพร้อมวาดแผนภาพวงจรอย่างง่าย

**ข้อ 7 (ประยุกต์):** จงเขียนโค้ดระบบพัดลมอัตโนมัติ โดยใช้เซ็นเซอร์อุณหภูมิ (NTC Thermistor) ต่อที่ขา GPIO 35 อ่านค่า ADC แล้วแปลงเป็นอุณหภูมิ จากนั้นควบคุมความเร็วพัดลม (จำลองด้วย LED PWM ที่ขา GPIO 25): อุณหภูมิต่ำ = พัดลมหมุนช้า, อุณหภูมิสูง = พัดลมหมุนเร็ว

**ข้อ 8 (ท้าทาย):** ระบบ Smart Street Light: ใช้ LDR ตรวจแสง + ปุ่มกด Manual Override — ถ้ากดปุ่ม ให้บังคับ LED สว่าง 100% โดยไม่สนแสงแวดล้อม ถ้าปล่อยปุ่ม ให้กลับมาปรับอัตโนมัติตามค่า LDR จงเขียนโค้ดเต็มพร้อมระบุขาที่ใช้
