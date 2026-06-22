# 🔬 Lab 6: ระบบควบคุมอัตโนมัติ (เซนเซอร์ → ตัวกระทำ)

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**เครื่องมือ:** ESP32 บน Wokwi Simulator  
**เวลารวม:** ประมาณ 90 นาที

---

## วัตถุประสงค์

- อ่านค่าอุณหภูมิและความชื้นจากเซนเซอร์ DHT22 แล้วแสดงผลผ่าน Serial Monitor ได้
- เขียนตรรกะ if-else เพื่อควบคุมรีเลย์ (Relay) สั่งเปิด-ปิดพัดลมตามเงื่อนไขอุณหภูมิได้
- อ่านค่าแสงจาก LDR (Light Dependent Resistor) แล้วควบคุม LED อัตโนมัติได้
- รวมเซนเซอร์หลายตัวเข้าด้วยกันเป็นระบบควบคุมอัตโนมัติอย่างง่ายได้

---

## ส่วนที่ 1: อ่านค่า DHT22 แสดงผล Serial (20 นาที)

### แนวคิด

DHT22 เป็นเซนเซอร์วัดอุณหภูมิ (Temperature) และความชื้นสัมพัทธ์ (Relative Humidity) ส่งข้อมูลแบบดิจิทัลผ่านสายสัญญาณเส้นเดียว (One-Wire Protocol)

### การต่อวงจร (Wokwi)

| อุปกรณ์ | ขา (Pin) | เชื่อมต่อกับ ESP32 |
|---------|----------|-------------------|
| DHT22 — VCC | VCC | 3.3V |
| DHT22 — DATA | DATA | GPIO 15 |
| DHT22 — GND | GND | GND |

### ขั้นตอน

1. เปิด [Wokwi](https://wokwi.com/) แล้วสร้างโปรเจกต์ใหม่ เลือกบอร์ด **ESP32**
2. เพิ่มอุปกรณ์ DHT22 จากเมนูด้านซ้าย แล้วต่อสายตามตารางด้านบน
3. ในไฟล์ `libraries.txt` ของ Wokwi ให้เพิ่มบรรทัด: `DHT sensor library`
4. อัปโหลดโค้ดด้านล่างแล้วกด ▶️ Run

```cpp
#include "DHT.h"

#define DHTPIN 15
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  Serial.println("=== DHT22 Sensor Ready ===");
}

void loop() {
  float temp = dht.readTemperature();    // องศาเซลเซียส
  float humi = dht.readHumidity();       // %RH

  if (isnan(temp) || isnan(humi)) {
    Serial.println("ERROR: อ่านค่าเซนเซอร์ไม่ได้!");
    delay(2000);
    return;
  }

  Serial.print("อุณหภูมิ: ");
  Serial.print(temp);
  Serial.print(" °C  |  ความชื้น: ");
  Serial.print(humi);
  Serial.println(" %");
  delay(2000);
}
```

### ✏️ บันทึกผลการทดลอง ส่วนที่ 1

สังเกต Serial Monitor แล้วจดค่าลงตาราง (Wokwi สามารถปรับค่า DHT22 ได้โดยคลิกที่ตัวเซนเซอร์):

| ครั้งที่ | อุณหภูมิ (°C) | ความชื้น (%) |
|---------|--------------|-------------|
| 1       |              |             |
| 2       |              |             |
| 3       |              |             |

---

## ส่วนที่ 2: ควบคุมพัดลมด้วยรีเลย์ตามอุณหภูมิ (30 นาที)

### แนวคิด

ใช้ตรรกะ if-else ตรวจสอบค่าอุณหภูมิ — หากเกินค่าที่กำหนด (Threshold) ให้สั่งเปิดรีเลย์ (จำลองการเปิดพัดลม) หากต่ำกว่าให้ปิด

### การต่อวงจรเพิ่มเติม

| อุปกรณ์ | ขา (Pin) | เชื่อมต่อกับ ESP32 |
|---------|----------|-------------------|
| Relay — Signal | IN | GPIO 26 |
| Relay — VCC | VCC | 5V (VIN) |
| Relay — GND | GND | GND |
| LED สีแดง (จำลองพัดลม) | Anode (+) | ต่อผ่าน Relay COM-NO |

> 💡 **หมายเหตุ:** ใน Wokwi ให้ใช้ LED สีแดงต่อผ่านตัวต้านทาน 220Ω แทนมอเตอร์พัดลมจริง เพื่อสังเกตสถานะเปิด/ปิด

### ขั้นตอน

1. เพิ่ม Relay Module และ LED สีแดงในวงจรเดิม
2. แก้ไขโค้ดเป็นดังนี้:

```cpp
#include "DHT.h"

#define DHTPIN    15
#define DHTTYPE   DHT22
#define RELAY_PIN 26
#define TEMP_THRESHOLD 30.0   // เกณฑ์อุณหภูมิ (°C)

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);  // เริ่มต้นปิดรีเลย์
  dht.begin();
  Serial.println("=== Auto Fan Control Ready ===");
}

void loop() {
  float temp = dht.readTemperature();
  float humi = dht.readHumidity();

  if (isnan(temp) || isnan(humi)) {
    Serial.println("ERROR: อ่านค่าไม่ได้");
    delay(2000);
    return;
  }

  Serial.print("Temp: ");
  Serial.print(temp);
  Serial.print(" °C | Humi: ");
  Serial.print(humi);
  Serial.print(" % | พัดลม: ");

  if (temp > TEMP_THRESHOLD) {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("เปิด ✅");
  } else {
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("ปิด ❌");
  }
  delay(2000);
}
```

3. กด Run แล้วคลิกที่ DHT22 เพื่อปรับอุณหภูมิให้สูง/ต่ำกว่า 30 °C สังเกตสถานะรีเลย์และ LED

### ✏️ บันทึกผลการทดลอง ส่วนที่ 2

ปรับค่าอุณหภูมิบน Wokwi แล้วบันทึกผล:

| อุณหภูมิตั้ง (°C) | เกินเกณฑ์? (ใช่/ไม่) | สถานะรีเลย์ (HIGH/LOW) | LED ติด? |
|-------------------|----------------------|------------------------|----------|
| 25                |                      |                        |          |
| 30                |                      |                        |          |
| 35                |                      |                        |          |
| 40                |                      |                        |          |

---

## ส่วนที่ 3: เพิ่ม LDR ควบคุมไฟอัตโนมัติ (25 นาที)

### แนวคิด

LDR เป็นตัวต้านทานที่เปลี่ยนค่าตามแสง — แสงมากความต้านทานต่ำ แสงน้อยความต้านทานสูง อ่านค่าผ่านขา Analog ของ ESP32 (ค่า 0–4095) แล้วใช้ควบคุม LED (จำลองหลอดไฟ)

### การต่อวงจรเพิ่มเติม

| อุปกรณ์ | ขา (Pin) | เชื่อมต่อกับ ESP32 |
|---------|----------|-------------------|
| LDR — ขาที่ 1 | — | 3.3V |
| LDR — ขาที่ 2 | — | GPIO 34 + ตัวต้านทาน 10kΩ ลง GND |
| LED สีเหลือง (ไฟส่องสว่าง) | Anode (+) | GPIO 27 (ผ่าน R 220Ω) |

### ขั้นตอน

1. เพิ่ม LDR, ตัวต้านทาน 10kΩ, LED สีเหลือง และตัวต้านทาน 220Ω ในวงจรเดิม
2. เพิ่มส่วนโค้ด LDR เข้าไปในโปรแกรมหลัก:

```cpp
#include "DHT.h"

#define DHTPIN         15
#define DHTTYPE        DHT22
#define RELAY_PIN      26
#define LDR_PIN        34
#define LIGHT_LED_PIN  27
#define TEMP_THRESHOLD 30.0
#define LDR_THRESHOLD  1000   // ค่าแสงต่ำ = มืด

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LIGHT_LED_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LIGHT_LED_PIN, LOW);
  dht.begin();
  Serial.println("=== Smart Control System Ready ===");
}

void loop() {
  // --- อ่าน DHT22 ---
  float temp = dht.readTemperature();
  float humi = dht.readHumidity();

  // --- อ่าน LDR ---
  int ldrValue = analogRead(LDR_PIN);

  if (isnan(temp) || isnan(humi)) {
    Serial.println("ERROR: DHT22 อ่านค่าไม่ได้");
    delay(2000);
    return;
  }

  // --- แสดงผล ---
  Serial.print("Temp: ");
  Serial.print(temp);
  Serial.print(" °C | Humi: ");
  Serial.print(humi);
  Serial.print(" % | LDR: ");
  Serial.print(ldrValue);

  // --- ควบคุมพัดลม ---
  if (temp > TEMP_THRESHOLD) {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.print(" | Fan: ON");
  } else {
    digitalWrite(RELAY_PIN, LOW);
    Serial.print(" | Fan: OFF");
  }

  // --- ควบคุมไฟ ---
  if (ldrValue < LDR_THRESHOLD) {
    digitalWrite(LIGHT_LED_PIN, HIGH);   // มืด → เปิดไฟ
    Serial.println(" | Light: ON");
  } else {
    digitalWrite(LIGHT_LED_PIN, LOW);    // สว่าง → ปิดไฟ
    Serial.println(" | Light: OFF");
  }

  delay(2000);
}
```

3. ทดสอบโดยปรับค่า LDR บน Wokwi (คลิกที่ LDR แล้วเลื่อนแถบแสง) พร้อมกับปรับอุณหภูมิ DHT22

### ✏️ บันทึกผลการทดลอง ส่วนที่ 3

| สถานการณ์ | อุณหภูมิ (°C) | ค่า LDR | พัดลม (ON/OFF) | ไฟ (ON/OFF) |
|-----------|--------------|---------|---------------|-------------|
| ร้อน + มืด | 35 |  500    |               |             |
| ร้อน + สว่าง | 35 | 2500  |               |             |
| เย็น + มืด | 25 | 500     |               |             |
| เย็น + สว่าง | 25 | 2500  |               |             |

---

## ส่วนที่ 4: แบบฝึกหัดและคำถาม (15 นาที)

1. ถ้าต้องการเปลี่ยนเกณฑ์อุณหภูมิจาก 30 °C เป็น 28 °C ต้องแก้ไขโค้ดบรรทัดใด?

   > คำตอบ: _______________________________________________

2. ค่า `LDR_THRESHOLD` ตั้งไว้ที่ 1000 หมายความว่าอย่างไร? ถ้าเปลี่ยนเป็น 2000 ผลลัพธ์จะต่างจากเดิมอย่างไร?

   > คำตอบ: _______________________________________________

3. ถ้าต้องการเพิ่มเงื่อนไข: "เมื่อความชื้นต่ำกว่า 40% ให้เปิด LED สีน้ำเงิน (GPIO 25)" จงเขียนส่วนโค้ดเพิ่มเติม:

   ```cpp
   // เขียนโค้ดที่นี่



   ```

4. จากระบบที่สร้างใน Lab นี้ จงยกตัวอย่างการประยุกต์ใช้ในงานวิศวกรรมเครื่องกลจริง 1 ตัวอย่าง พร้อมอธิบายสั้น ๆ

   > คำตอบ: _______________________________________________

5. **ท้าทาย (Challenge):** แก้ไขโค้ดให้พัดลมเปิด-ปิดแบบ Hysteresis คือ เปิดเมื่อ temp > 32 °C แต่ปิดเมื่อ temp < 28 °C (ไม่ใช่ค่าเดียวกัน) เพื่อป้องกันพัดลมกระพริบ ลิงก์ Wokwi ของโปรเจกต์ที่แก้ไข:

   > ลิงก์: _______________________________________________

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จะแจ้งใน Google Classroom)**

สิ่งที่ต้องส่ง:
1. ลิงก์โปรเจกต์ Wokwi (กด Share → Copy Link) ของส่วนที่ 3 (ระบบรวม)
2. ภาพหน้าจอ (Screenshot) ของ Serial Monitor แสดงผลทั้ง 4 สถานการณ์
3. คำตอบแบบฝึกหัดข้อ 1–5

### Checklist ก่อนส่ง

- [ ] วงจรบน Wokwi ทำงานได้โดยไม่มี Error
- [ ] Serial Monitor แสดงค่าอุณหภูมิ ความชื้น และค่า LDR ถูกต้อง
- [ ] พัดลม (รีเลย์) เปิด-ปิดตามเงื่อนไขอุณหภูมิ
- [ ] LED ไฟส่องสว่างเปิด-ปิดตามเงื่อนไขแสง LDR
- [ ] ตารางบันทึกผล ส่วนที่ 1–3 กรอกครบถ้วน
- [ ] คำตอบแบบฝึกหัดข้อ 1–5 ครบทุกข้อ
- [ ] ลิงก์ Wokwi เปิดได้และตั้งค่าเป็น Public
