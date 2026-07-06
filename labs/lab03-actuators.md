# 🔬 Lab 3: ควบคุมตัวกระทำ (Actuators)

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1
**เครื่องมือ:** Tinkercad Circuits Simulator + Arduino Uno DevKit V1
**เวลา:** 3 ชั่วโมง

---

## วัตถุประสงค์

- อธิบายหลักการทำงานของตัวกระทำ (Actuator) ประเภทต่าง ๆ ได้แก่ LED, Buzzer, Relay และ Servo Motor
- เขียนโปรแกรม Arduino Uno เพื่อควบคุมเอาต์พุตดิจิทัล (Digital Output) ด้วยฟังก์ชัน `digitalWrite()` และ PWM
- ออกแบบรูปแบบการกระพริบ LED (Blink Pattern) และสร้างเสียงแจ้งเตือนด้วย Buzzer ได้
- ควบคุม Servo Motor SG90 ให้หมุนไปยังมุมที่กำหนดผ่านไลบรารี Servo.h มาตรฐาน

---

## ส่วนที่ 1: ควบคุม LED หลายดวง — ไฟกระพริบรูปแบบ (30 นาที)

### ความรู้เบื้องต้น

LED เป็นตัวกระทำพื้นฐานที่สุด ทำงานผ่าน `digitalWrite(pin, HIGH/LOW)` โดยต่อตัวต้านทาน (Resistor) 220Ω อนุกรมเพื่อจำกัดกระแส

### ขั้นตอนปฏิบัติ

1. เปิด [Tinkercad Circuits](https://www.tinkercad.com/) แล้วสร้างโปรเจกต์ใหม่ เลือกบอร์ด **Arduino Uno R3**
2. ต่อวงจร LED 3 ดวงที่ขา Pin 2, Pin 3 และ Pin 4 ของ Arduino Uno (ต่อตัวต้านทาน Resistor 220Ω อนุกรมกันกระแสเกินทุกดวง)
3. อัปโหลดโค้ดต่อไปนี้แล้วสังเกตพฤติกรรม

```cpp
// Lab3-Part1: LED Chaser Pattern
const int ledPins[] = {2, 3, 4}; // ต่อ LED เข้า Pin 2, 3, 4
const int numLeds = 3;

void setup() {
  for (int i = 0; i < numLeds; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
}

void loop() {
  // ไล่ไฟจากซ้ายไปขวา (Chaser Pattern)
  for (int i = 0; i < numLeds; i++) {
    digitalWrite(ledPins[i], HIGH);
    delay(300);
    digitalWrite(ledPins[i], LOW);
  }
  // ไล่ไฟกลับจากขวาไปซ้าย
  for (int i = numLeds - 2; i >= 1; i--) {
    digitalWrite(ledPins[i], HIGH);
    delay(300);
    digitalWrite(ledPins[i], LOW);
  }
}
```

4. ทดลองเปลี่ยนค่า `delay()` เป็น 100, 500 และ 1000 มิลลิวินาที แล้วบันทึกผล

### ตารางบันทึกผล — ส่วนที่ 1

| ค่า delay (ms) | พฤติกรรมที่สังเกตได้ | ความเร็วรู้สึก (เร็ว/ปานกลาง/ช้า) |
|:-:|---|:-:|
| 100 | | |
| 300 | | |
| 500 | | |
| 1000 | | |

---

## ส่วนที่ 2: ขับบัซเซอร์สร้างเสียงแจ้งเตือน (25 นาที)

### ความรู้เบื้องต้น

Piezo Buzzer แบบ Active ให้เสียงเมื่อจ่ายไฟ แบบ Passive ต้องสร้างสัญญาณความถี่ด้วยฟังก์ชัน `tone(pin, frequency, duration)`

### ขั้นตอนปฏิบัติ

1. เพิ่ม **Piezo (บัซเซอร์)** ในวงจร Tinkercad ต่อที่ขา Pin 8
2. อัปโหลดโค้ดสร้างเสียงแจ้งเตือน 3 รูปแบบ

```cpp
// Lab3-Part2: Buzzer Alert Patterns
const int buzzerPin = 8; // ต่อขาบวกบัซเซอร์เข้า Pin 8

void beepShort() {
  tone(buzzerPin, 1000, 200);  // 1000 Hz, 200 ms
  delay(300);
}

void beepLong() {
  tone(buzzerPin, 800, 600);   // 800 Hz, 600 ms
  delay(700);
}

void beepSOS() {
  // S: จุด 3 ครั้ง
  for (int i = 0; i < 3; i++) { tone(buzzerPin, 1200, 150); delay(250); }
  delay(300);
  // O: ขีด 3 ครั้ง
  for (int i = 0; i < 3; i++) { tone(buzzerPin, 1200, 400); delay(500); }
  delay(300);
  // S: จุด 3 ครั้ง
  for (int i = 0; i < 3; i++) { tone(buzzerPin, 1200, 150); delay(250); }
}

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  beepShort(); beepShort(); beepShort();
  delay(1000);
  beepLong(); beepLong();
  delay(1000);
  beepSOS();
  delay(3000);
}
```

3. ทดลองเปลี่ยนความถี่ (frequency) และบันทึกเสียงที่ได้ยิน

### ตารางบันทึกผล — ส่วนที่ 2

| ความถี่ (Hz) | ระยะเวลา (ms) | ลักษณะเสียงที่ได้ยิน |
|:-:|:-:|---|
| 500 | 200 | |
| 1000 | 200 | |
| 2000 | 200 | |
| 4000 | 200 | |

---

## ส่วนที่ 3: ควบคุมรีเลย์เปิด-ปิดโหลด (25 นาที)

### ความรู้เบื้องต้น

รีเลย์ (Relay) ทำหน้าที่เป็นสวิตช์ทางอิเล็กทรอนิกส์ ใช้สัญญาณดิจิทัลจากไมโครคอนโทรลเลอร์ควบคุมการเปิด-ปิดโหลดที่ใช้ไฟฟ้าสูงกว่า เช่น หลอดไฟ AC หรือปั๊มน้ำ ใน Tinkercad Circuits จะใช้ Relay Module จำลอง

### ขั้นตอนปฏิบัติ

1. เพิ่ม **Relay (SPDT)** ใน Tinkercad ต่อขาสัญญาณทริกเกอร์เข้าที่ Pin 7, ขดลวดต่อ VCC 5V และ GND
2. ต่อ LED อีก 1 ดวง (จำลองเป็นโหลด) ที่ฝั่ง NO (Normally Open) ของรีเลย์
3. อัปโหลดโค้ดควบคุมการเปิด-ปิด

```cpp
// Lab3-Part3: Relay ON/OFF Control
const int relayPin = 7; // ต่อพินทริกเกอร์รีเลย์ที่ Pin 7

void setup() {
  Serial.begin(9600); // ตั้งค่าความเร็วสื่อสาร 9600 Baud
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW);  // เริ่มต้นปิด
  Serial.println("Relay Control Ready");
}

void loop() {
  Serial.println("Relay ON  -> โหลดทำงาน");
  digitalWrite(relayPin, HIGH);
  delay(3000);

  Serial.println("Relay OFF -> โหลดหยุด");
  digitalWrite(relayPin, LOW);
  delay(3000);
}
```

4. สังเกตเสียง "คลิก" ของรีเลย์ (ในของจริง) และสถานะ LED ที่ต่ออยู่ฝั่ง NO
5. ทดลองเปลี่ยนเวลาเปิด-ปิด แล้วบันทึกผล

### ตารางบันทึกผล — ส่วนที่ 3

| เวลาเปิด (ms) | เวลาปิด (ms) | พฤติกรรม LED (โหลด) | ค่าที่อ่านได้จาก Serial Monitor |
|:-:|:-:|---|---|
| 3000 | 3000 | | |
| 1000 | 1000 | | |
| 5000 | 2000 | | |

---

## ส่วนที่ 4: ขับเซอร์โวมอเตอร์ SG90 ตามมุม (30 นาที)

### ความรู้เบื้องต้น

Servo Motor SG90 หมุนได้ 0°–180° ควบคุมด้วยสัญญาณ PWM ใช้ไลบรารี `Servo.h` บน Arduino Uno

### ขั้นตอนปฏิบัติ

1. เพิ่ม **Micro Servo** ใน Tinkercad ต่อสายสัญญาณ (ส้ม/เหลือง) ที่ Pin 9, สายไฟสีแดงที่ 5V และสายสีน้ำตาลที่ GND
2. ไลบรารี: ใน Tinkercad ไลบรารี `<Servo.h>` พร้อมใช้งานโดยตรงไม่ต้องติดตั้งเพิ่ม
3. อัปโหลดโค้ดควบคุมมุม

```cpp
// Lab3-Part4: Servo Angle Control
#include <Servo.h>

Servo myServo;
const int servoPin = 9; // ใช้ Pin 9 ของ Arduino Uno

void setup() {
  Serial.begin(9600); // ตั้งค่าความเร็วสื่อสาร 9600 Baud
  myServo.attach(servoPin);  // พัลส์ 500-2400 µs
  Serial.println("Servo Ready");
}

void loop() {
  // กวาดจาก 0 ถึง 180 องศา
  for (int angle = 0; angle <= 180; angle += 30) {
    myServo.write(angle);
    Serial.print("Angle: ");
    Serial.println(angle);
    delay(1000);
  }
  delay(2000);
  // กลับไป 0 องศา
  myServo.write(0);
  Serial.println("Reset to 0");
  delay(2000);
}
```

4. สังเกตมุมการหมุนของ Servo ในหน้าจำลอง Tinkercad Circuits แล้วบันทึกผล

### ตารางบันทึกผล — ส่วนที่ 4

| มุมที่สั่ง (องศา) | มุมที่สังเกตได้ใน Tinkercad | ทิศทางการหมุน (CW/CCW) |
|:-:|:-:|:-:|
| 0 | | |
| 30 | | |
| 60 | | |
| 90 | | |
| 120 | | |
| 150 | | |
| 180 | | |

---

## แบบฝึกหัดท้ายใบงาน

1. **ท้าทาย:** เขียนโปรแกรมรวมทุกส่วน — เมื่อกดปุ่ม (Push Button) ครั้งที่ 1: ไฟ LED ไล่สว่าง, ครั้งที่ 2: Buzzer ส่งเสียง, ครั้งที่ 3: Relay เปิดโหลด, ครั้งที่ 4: Servo หมุนไป 90° แล้ววนกลับ
2. จงอธิบายความแตกต่างระหว่าง `digitalWrite()` กับ `analogWrite()` (PWM) ในบริบทของการควบคุม LED
3. ถ้าต้องการให้ Buzzer เล่นเสียงโน้ต Do-Re-Mi (C4-D4-E4) ต้องใช้ความถี่เท่าไร? (ค้นหาจากตาราง Note Frequency)
4. ในงานวิศวกรรมเครื่องกลจริง รีเลย์ใช้งานร่วมกับอุปกรณ์ใดบ้าง? ยกตัวอย่าง 2 กรณี

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จะแจ้งในห้องเรียน)**

สิ่งที่ต้องส่ง:
1. **ลิงก์โปรเจกต์ Tinkercad Circuits** ทั้ง 4 ส่วน (หรือรวมเป็นโปรเจกต์เดียว)
2. **ภาพหน้าจอ (Screenshot)** แสดงผลการทำงานของแต่ละส่วน
3. **ตารางบันทึกผล** ที่กรอกครบทุกช่อง
4. **คำตอบแบบฝึกหัด** ข้อ 1–4
5. **โค้ดแบบฝึกหัดข้อ 1** (ถ้าทำได้)

### Checklist ก่อนส่ง

- [ ] ลิงก์ Tinkercad Circuits เปิดได้และวงจรทำงานถูกต้อง
- [ ] ตารางบันทึกผลกรอกครบทุกส่วน (ส่วนที่ 1–4)
- [ ] ภาพหน้าจอแสดงผลลัพธ์ชัดเจน
- [ ] ตอบแบบฝึกหัดครบทุกข้อ
- [ ] โค้ดมีคอมเมนต์ (Comment) อธิบายการทำงานเป็นภาษาไทย
- [ ] ระบุชื่อ-นามสกุล รหัสนักศึกษา และกลุ่มเรียน
