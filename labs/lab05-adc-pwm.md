# 🔬 Lab 5: ADC และ PWM

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**เครื่องมือ:** ESP32 บน Wokwi Simulator  
**เวลา:** 3 ชั่วโมง

---

## วัตถุประสงค์

- อธิบายหลักการทำงานของ ADC (Analog-to-Digital Converter) แบบ 12-bit บน ESP32 ได้
- อ่านค่าแอนะล็อกจากโพเทนชิออมิเตอร์ (Potentiometer) และ LDR (Light Dependent Resistor) ด้วยฟังก์ชัน `analogRead()` ได้
- คำนวณแปลงค่า ADC เป็นแรงดันไฟฟ้า (Voltage) ได้อย่างถูกต้อง
- ควบคุมความสว่าง LED และมุมเซอร์โวมอเตอร์ด้วยสัญญาณ PWM โดยใช้ฟังก์ชัน `map()` ได้

---

## ส่วนที่ 1: อ่านค่า ADC จากโพเทนชิออมิเตอร์ (30 นาที)

### ความรู้พื้นฐาน

ESP32 มี ADC แบบ 12-bit หมายความว่าค่าที่อ่านได้อยู่ในช่วง **0–4095**  
- ค่า 0 = แรงดัน 0V  
- ค่า 4095 = แรงดัน 3.3V  
- สูตรแปลงค่า: `แรงดัน (V) = (ค่า ADC / 4095.0) × 3.3`

### ขั้นตอนปฏิบัติ

1. เปิด [Wokwi Simulator](https://wokwi.com/) แล้วสร้างโปรเจกต์ใหม่ เลือกบอร์ด **ESP32**
2. เพิ่มอุปกรณ์ **Potentiometer** แล้วต่อวงจรดังนี้:
   - ขา VCC → 3V3 ของ ESP32
   - ขา GND → GND ของ ESP32
   - ขา SIG (ขากลาง) → GPIO **34** ของ ESP32
3. อัปโหลดโค้ดด้านล่าง แล้วกด ▶ เพื่อรันจำลอง

```cpp
const int POT_PIN = 34;  // ขาอ่านค่าโพเทนชิออมิเตอร์

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);  // ตั้งความละเอียด 12-bit (ค่าเริ่มต้นของ ESP32)
  Serial.println("=== Lab 5: ADC & PWM ===");
}

void loop() {
  int adcValue = analogRead(POT_PIN);
  float voltage = (adcValue / 4095.0) * 3.3;

  Serial.print("ADC: ");
  Serial.print(adcValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 2);
  Serial.println(" V");

  delay(500);
}
```

4. หมุนโพเทนชิออมิเตอร์ไปตำแหน่งต่าง ๆ แล้วบันทึกผลลงตาราง

### ตารางบันทึกผล

| ตำแหน่งโพเทนฯ | ค่า ADC (0–4095) | แรงดันที่คำนวณ (V) | แรงดันจาก Serial (V) |
|:-:|:-:|:-:|:-:|
| 0% (หมุนซ้ายสุด) | | | |
| 25% | | | |
| 50% | | | |
| 75% | | | |
| 100% (หมุนขวาสุด) | | | |

---

## ส่วนที่ 2: อ่านค่า LDR เซนเซอร์แสง (20 นาที)

### ขั้นตอนปฏิบัติ

1. เพิ่มอุปกรณ์ **Photoresistor (LDR)** ในวงจรเดิม ต่อแบบวงจรแบ่งแรงดัน (Voltage Divider):
   - LDR ขาหนึ่ง → 3V3
   - LDR ขาอีกด้าน → GPIO **35** และต่อตัวต้านทาน 10kΩ ลง GND
2. แก้ไขโค้ดเพิ่มการอ่านค่า LDR:

```cpp
const int POT_PIN = 34;
const int LDR_PIN = 35;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
}

void loop() {
  int potValue = analogRead(POT_PIN);
  int ldrValue = analogRead(LDR_PIN);

  float potVoltage = (potValue / 4095.0) * 3.3;
  float ldrVoltage = (ldrValue / 4095.0) * 3.3;

  Serial.print("POT: ");
  Serial.print(potValue);
  Serial.print(" (");
  Serial.print(potVoltage, 2);
  Serial.print("V) | LDR: ");
  Serial.print(ldrValue);
  Serial.print(" (");
  Serial.print(ldrVoltage, 2);
  Serial.println("V)");

  delay(500);
}
```

3. คลิกที่ LDR ใน Wokwi แล้วเลื่อนปรับค่าแสง สังเกตค่าที่เปลี่ยนแปลง

### บันทึกผล

| ระดับแสง | ค่า ADC ของ LDR | แรงดัน (V) |
|:-:|:-:|:-:|
| มืด (ค่าต่ำสุด) | | |
| แสงปานกลาง | | |
| สว่าง (ค่าสูงสุด) | | |

---

## ส่วนที่ 3: ควบคุมความสว่าง LED ด้วย PWM (30 นาที)

### ความรู้พื้นฐาน

PWM (Pulse Width Modulation) คือการสร้างสัญญาณพัลส์ที่ปรับ Duty Cycle ได้  
ฟังก์ชัน `analogWrite()` บน ESP32 (Arduino Core 3.x) รับค่า **0–255**  
ใช้ `map(value, fromLow, fromHigh, toLow, toHigh)` เพื่อแปลงช่วงค่า

### ขั้นตอนปฏิบัติ

1. เพิ่ม **LED** พร้อมตัวต้านทาน 220Ω ต่อที่ GPIO **16**
2. อัปโหลดโค้ดด้านล่าง — โพเทนชิออมิเตอร์จะควบคุมความสว่างของ LED

```cpp
const int POT_PIN = 34;
const int LED_PIN = 16;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int potValue = analogRead(POT_PIN);

  // แปลงค่า ADC 0-4095 เป็น PWM 0-255
  int pwmValue = map(potValue, 0, 4095, 0, 255);

  analogWrite(LED_PIN, pwmValue);

  Serial.print("ADC: ");
  Serial.print(potValue);
  Serial.print(" -> PWM: ");
  Serial.println(pwmValue);

  delay(100);
}
```

3. หมุนโพเทนชิออมิเตอร์ แล้วสังเกตความสว่างของ LED ที่เปลี่ยนแปลง

### บันทึกผล

| ค่า ADC | ค่า PWM (0–255) | ความสว่าง LED |
|:-:|:-:|:-:|
| 0 | | ดับ / สลัว / สว่าง |
| ~1000 | | ดับ / สลัว / สว่าง |
| ~2000 | | ดับ / สลัว / สว่าง |
| ~3000 | | ดับ / สลัว / สว่าง |
| 4095 | | ดับ / สลัว / สว่าง |

---

## ส่วนที่ 4: ควบคุมมุมเซอร์โวมอเตอร์ (30 นาที)

### ขั้นตอนปฏิบัติ

1. เพิ่ม **Servo Motor** ต่อที่ GPIO **18** (สาย Signal สีส้ม, VCC สีแดง → 5V, GND สีน้ำตาล → GND)
2. เพิ่มไลบรารี: ใน Wokwi เปิดไฟล์ `libraries.txt` แล้วเพิ่มบรรทัด `ESP32Servo`
3. อัปโหลดโค้ด — ค่าจาก LDR จะกำหนดมุมเซอร์โว

```cpp
#include <ESP32Servo.h>

const int LDR_PIN   = 35;
const int LED_PIN   = 16;
const int SERVO_PIN = 18;

Servo myServo;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  pinMode(LED_PIN, OUTPUT);
  myServo.attach(SERVO_PIN);
}

void loop() {
  int ldrValue = analogRead(LDR_PIN);

  // แปลงค่า LDR → ความสว่าง LED
  int brightness = map(ldrValue, 0, 4095, 0, 255);
  analogWrite(LED_PIN, brightness);

  // แปลงค่า LDR → มุมเซอร์โว (0-180 องศา)
  int angle = map(ldrValue, 0, 4095, 0, 180);
  myServo.write(angle);

  Serial.print("LDR: ");
  Serial.print(ldrValue);
  Serial.print(" | LED PWM: ");
  Serial.print(brightness);
  Serial.print(" | Servo: ");
  Serial.print(angle);
  Serial.println(" deg");

  delay(200);
}
```

4. ปรับค่าแสงของ LDR แล้วสังเกตมุมเซอร์โวและความสว่าง LED

### บันทึกผล

| ระดับแสง | ค่า ADC | มุมเซอร์โว (°) | ค่า PWM LED |
|:-:|:-:|:-:|:-:|
| มืด | | | |
| ปานกลาง | | | |
| สว่าง | | | |

---

## แบบฝึกหัดท้ายใบงาน

1. ESP32 มี ADC กี่บิต? ค่าที่อ่านได้อยู่ในช่วงเท่าใด?

   **คำตอบ:** ____________________________________________________________

2. ถ้าอ่านค่า ADC ได้ 2048 แรงดันที่คำนวณได้คือเท่าไร? แสดงวิธีคิด

   **คำตอบ:** ____________________________________________________________

3. ฟังก์ชัน `map(1500, 0, 4095, 0, 255)` จะให้ค่าผลลัพธ์ประมาณเท่าไร?

   **คำตอบ:** ____________________________________________________________

4. ถ้าต้องการให้เซอร์โวหมุนจาก 0° เมื่อสว่างมาก ไปเป็น 180° เมื่อมืด (กลับทิศ) ควรแก้โค้ดส่วนใดอย่างไร?

   **คำตอบ:** ____________________________________________________________

5. จงยกตัวอย่างการประยุกต์ใช้ ADC + PWM ในงานวิศวกรรมเครื่องกลมา 2 ตัวอย่าง

   **คำตอบ:** ____________________________________________________________

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: *[ลิงก์จะแจ้งใน Google Classroom]*

**สิ่งที่ต้องส่ง:**
1. ภาพหน้าจอ (Screenshot) ของวงจรจาก Wokwi พร้อม Serial Monitor — ทุกส่วน
2. ลิงก์โปรเจกต์ Wokwi (กด Share → Copy Link) ของส่วนที่ 4
3. ตารางบันทึกผลทั้งหมด (ถ่ายรูปหรือพิมพ์ลงฟอร์ม)
4. คำตอบแบบฝึกหัด 5 ข้อ

### Checklist ก่อนส่ง

- [ ] ภาพหน้าจอวงจร Wokwi ครบทุกส่วน (ส่วนที่ 1–4)
- [ ] ลิงก์ Wokwi ของส่วนที่ 4 เปิดได้และรันได้
- [ ] ตารางบันทึกผลครบทุกตาราง (4 ตาราง)
- [ ] คำตอบแบบฝึกหัดครบ 5 ข้อ พร้อมแสดงวิธีคิด
- [ ] ชื่อ-รหัสนักศึกษา ระบุในฟอร์มเรียบร้อย
