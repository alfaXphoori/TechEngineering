# 🔬 Lab 11: เชื่อมต่อคลาวด์ Blynk

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1

---

## วัตถุประสงค์

1. เพื่อให้นักศึกษาสามารถสมัครและใช้งานแพลตฟอร์มคลาวด์ Blynk (blynk.io) เบื้องต้นได้
2. เพื่อให้นักศึกษาสามารถกำหนดค่า Template, Device และ Datastream บน Blynk ได้
3. เพื่อให้นักศึกษาสามารถเขียนโปรแกรม ESP32 บน Wokwi เพื่อส่งข้อมูลเซนเซอร์ (DHT22) ขึ้นคลาวด์ได้
4. เพื่อให้นักศึกษาสามารถสร้าง Web Dashboard เพื่อแสดงผลข้อมูลแบบเรียลไทม์ได้

---

## ส่วนที่ 1: การเตรียมความพร้อมบน Blynk Cloud (30 นาที)

ในส่วนนี้เราจะสร้างโปรเจกต์บน Blynk Cloud เพื่อรับข้อมูลจาก ESP32

1. ไปที่เว็บไซต์ [Blynk.io](https://blynk.io/) และทำการสมัครสมาชิก (Sign Up) หรือเข้าสู่ระบบ (Log In)
2. เมื่อเข้าสู่ระบบแล้ว ให้ไปที่เมนู **Templates** (แถบด้านซ้าย) แล้วคลิก **+ New Template**
3. ตั้งชื่อ Template เช่น `ESP32_Weather` เลือก Hardware เป็น **ESP32** และ Connection Type เป็น **WiFi** จากนั้นคลิก **Done**
4. ในหน้า Template ให้ไปที่แท็บ **Datastreams** เพื่อสร้างช่องทางการรับส่งข้อมูล:
   * คลิก **+ New Datastream** -> **Virtual Pin**
   * **Datastream 1:** ตั้งชื่อ `Temperature`, PIN `V0`, Data Type `Double`, Units `Celsius`, Min `0`, Max `100` -> คลิก **Create**
   * **Datastream 2:** ตั้งชื่อ `Humidity`, PIN `V1`, Data Type `Double`, Units `%`, Min `0`, Max `100` -> คลิก **Create**
5. ไปที่แท็บ **Web Dashboard** เพื่อสร้างหน้าปัดแสดงผล:
   * ลากวิดเจ็ต **Gauge** มาวาง 2 อัน
   * ตั้งค่า Gauge ตัวที่ 1 ให้เชื่อมกับ Datastream `V0 (Temperature)`
   * ตั้งค่า Gauge ตัวที่ 2 ให้เชื่อมกับ Datastream `V1 (Humidity)`
   * คลิก **Save** ที่มุมขวาบน
6. นำ Template ไปสร้างเป็นอุปกรณ์จริง โดยไปที่เมนู **Search** (ไอคอนแว่นขยาย) -> **+ New Device** -> **From template**
7. เลือก Template `ESP32_Weather` ที่เราสร้างไว้ แล้วตั้งชื่ออุปกรณ์ (เช่น `MyESP32`) -> คลิก **Create**
8. **สำคัญมาก:** ระบบจะแสดงหน้าต่าง Device Info ซึ่งมีข้อมูล **Firmware Configuration** ให้คัดลอกข้อมูลบรรทัดที่ขึ้นต้นด้วย `#define BLYNK_TEMPLATE_ID`, `#define BLYNK_TEMPLATE_NAME` และ `#define BLYNK_AUTH_TOKEN` เก็บไว้ใน Notepad เพื่อใช้เขียนโปรแกรมในส่วนถัดไป

---

## ส่วนที่ 2: การต่อวงจรและเตรียม Wokwi (15 นาที)

1. เปิดเว็บไซต์ [Wokwi](https://wokwi.com/) สร้างโปรเจกต์ใหม่ เลือกบอร์ด **ESP32**
2. เพิ่มอุปกรณ์และต่อวงจรดังนี้:
   * เซนเซอร์ **DHT22** จำนวน 1 ตัว
   * ขา `VCC` ของ DHT22 ต่อกับ `3.3V` ของ ESP32
   * ขา `GND` ของ DHT22 ต่อกับ `GND` ของ ESP32
   * ขา `SDA` (ข้อมูล) ของ DHT22 ต่อกับขา `D15` ของ ESP32
3. ติดตั้งไลบรารีที่จำเป็น:
   * ไปที่แท็บ **Library Manager** (ไอคอนหนังสือ)
   * ค้นหาและเพิ่ม `Blynk`
   * ค้นหาและเพิ่ม `DHT sensor library for ESPx`

---

## ส่วนที่ 3: การเขียนโปรแกรมส่งข้อมูลขึ้น Blynk (45 นาที)

1. คัดลอกโค้ดด้านล่างไปวางใน `sketch.ino`
2. **แก้ไขข้อมูล 3 บรรทัดแรก** ให้เป็นค่าที่ได้จากหน้า Device Info ของ Blynk (ที่ให้เก็บไว้ในส่วนที่ 1)

```cpp
// นำข้อมูลจาก Blynk มาวางแทนที่ 3 บรรทัดนี้
#define BLYNK_TEMPLATE_ID "TMPLxxxxxx"
#define BLYNK_TEMPLATE_NAME "ESP32_Weather"
#define BLYNK_AUTH_TOKEN "YourAuthTokenHere"

// กำหนดให้ Blynk พิมพ์ข้อความลง Serial Monitor เพื่อดูสถานะ
#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>
#include "DHTesp.h"

// การตั้งค่า WiFi สำหรับ Wokwi
char ssid[] = "Wokwi-GUEST";
char pass[] = "";

// กำหนดขาของ DHT22
const int DHT_PIN = 15;
DHTesp dht;

// สร้างออบเจกต์ Timer สำหรับส่งข้อมูลเป็นระยะ
BlynkTimer timer;

// ฟังก์ชันสำหรับอ่านและส่งข้อมูล
void sendSensor()
{
  TempAndHumidity  data = dht.getTempAndHumidity();

  if (isnan(data.temperature) || isnan(data.humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  Serial.print("Temperature: ");
  Serial.print(data.temperature);
  Serial.print(" °C\tHumidity: ");
  Serial.print(data.humidity);
  Serial.println(" %");

  // ส่งข้อมูลไปยัง Blynk Cloud ตาม Virtual Pin ที่ตั้งไว้
  Blynk.virtualWrite(V0, data.temperature);
  Blynk.virtualWrite(V1, data.humidity);
}

void setup()
{
  Serial.begin(115200);
  
  // เริ่มต้นการทำงานของ DHT22
  dht.setup(DHT_PIN, DHTesp::DHT22_DEF);

  Serial.println("Connecting to Blynk...");
  // เริ่มต้นการเชื่อมต่อ Blynk
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);

  // ตั้งค่าให้ฟังก์ชัน sendSensor ทำงานทุกๆ 2000 มิลลิวินาที (2 วินาที)
  // ห้ามใช้ delay() ใน loop() เมื่อใช้ Blynk
  timer.setInterval(2000L, sendSensor);
}

void loop()
{
  // รันระบบของ Blynk และ Timer
  Blynk.run();
  timer.run();
}
```

3. กดปุ่ม **Start Simulation** (เครื่องหมาย Play) บน Wokwi
4. สังเกตที่ Serial Monitor จะต้องขึ้นข้อความว่าเชื่อมต่อ WiFi และ Blynk สำเร็จ และแสดงค่าอุณหภูมิตามด้วยความชื้น
5. กลับไปที่หน้าเว็บไซต์ Blynk (แท็บ Web Dashboard) สังเกตเข็มของ Gauge ว่าขยับตามค่าจำลองใน Wokwi หรือไม่ (สามารถคลิกที่ตัว DHT22 ใน Wokwi เพื่อเลื่อนแถบปรับค่าอุณหภูมิและความชื้นจำลองได้)

---

## ส่วนที่ 4: บันทึกผลการทดลอง (15 นาที)

ให้ทำการปรับค่าเซนเซอร์ DHT22 บน Wokwi จำนวน 3 ครั้งแตกต่างกัน รอประมาณ 2-3 วินาที แล้วบันทึกค่าที่ปรากฏใน Serial Monitor เทียบกับค่าที่แสดงผลบน Web Dashboard ของ Blynk

| ครั้งที่ | อุณหภูมิ Wokwi (°C) | อุณหภูมิ Blynk V0 (°C) | ความชื้น Wokwi (%) | ความชื้น Blynk V1 (%) | สถานะการอัปเดต (ทันที/ล่าช้า) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

---

## คำถามท้ายใบงาน

1. ในระบบ IoT โค้ดที่ใช้เชื่อมต่อกับ Blynk มีการใช้ `BlynkTimer` แทนการใช้ `delay()` ใน `loop()` นักศึกษาคิดว่าเพราะเหตุใดจึงไม่ควรใช้คำสั่ง `delay()` ในโปรแกรมที่ต้องเชื่อมต่อกับแพลตฟอร์มคลาวด์ตลอดเวลา?
*(ตอบ: .................................................................................................... )*

2. หากต้องการเพิ่มเซนเซอร์วัดแสงเพื่อส่งข้อมูลไปยัง Blynk นักศึกษาจะต้องตั้งค่า Datastream บนเว็บไซต์เพิ่มเติมอย่างไร และต้องเพิ่มโค้ดบรรทัดใดเพื่อส่งข้อมูล?
*(ตอบ: .................................................................................................... )*

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: [ลิงก์ฟอร์มส่งงานของรายวิชา]

### Checklist ก่อนส่ง
- [ ] กรอกข้อมูลรหัสนักศึกษาและชื่อ-นามสกุลในฟอร์มครบถ้วน
- [ ] แนบลิงก์โปรเจกต์ Wokwi (ที่บันทึกและรันได้ปกติ)
- [ ] แนบภาพถ่ายหน้าจอ (Screenshot) ที่แสดงผล Web Dashboard ของ Blynk คู่กับหน้าจอ Wokwi
- [ ] ตอบคำถามท้ายใบงานและกรอกตารางบันทึกผลเรียบร้อยแล้ว
