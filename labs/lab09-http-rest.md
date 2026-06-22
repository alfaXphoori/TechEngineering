# 🔬 Lab 9: ส่งข้อมูลด้วย HTTP/REST (JSON)

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**เครื่องมือ:** ESP32 บน Wokwi Simulator, ArduinoJson Library  
**ระยะเวลา:** ประมาณ 90 นาที

---

## วัตถุประสงค์

- อธิบายหลักการสื่อสารแบบ HTTP GET และ HTTP POST ในบริบท IoT ได้
- สร้างข้อมูล JSON (payload) ด้วยไลบรารี ArduinoJson บน ESP32 ได้
- ส่งค่าเซนเซอร์ไปยัง endpoint ทดสอบ (เช่น httpbin.org) แล้ววิเคราะห์ response code ได้
- ประยุกต์ใช้ HTTP/REST เพื่อส่งข้อมูลจากอุปกรณ์ IoT ไปยังเซิร์ฟเวอร์ได้

---

## ส่วนที่ 1: ทำความเข้าใจ HTTP Request/Response (15 นาที)

HTTP (HyperText Transfer Protocol) เป็นโปรโตคอลพื้นฐานของเว็บ ในงาน IoT เราใช้มันส่งข้อมูลจากบอร์ดไปยังเซิร์ฟเวอร์

| คำศัพท์ | ความหมาย |
|---|---|
| **GET** | ร้องขอข้อมูลจากเซิร์ฟเวอร์ (ไม่ส่ง body) |
| **POST** | ส่งข้อมูลไปยังเซิร์ฟเวอร์ (มี body เช่น JSON) |
| **Status Code** | รหัสตอบกลับ เช่น `200` = สำเร็จ, `404` = ไม่พบ |
| **JSON** | รูปแบบข้อมูลยอดนิยม เช่น `{"temp": 25.5}` |
| **Endpoint** | URL ปลายทางที่เราส่งข้อมูลไป |

### ขั้นตอน

1. เปิดโปรเจกต์ใหม่บน [wokwi.com](https://wokwi.com) เลือกบอร์ด **ESP32**
2. ศึกษาโครงสร้าง HTTP Request ด้านล่าง แล้วตอบคำถาม

```
POST /post HTTP/1.1
Host: httpbin.org
Content-Type: application/json

{"sensor":"dht22","temp":28.3,"humid":65}
```

**คำถามก่อนลงมือ:**

| # | คำถาม | คำตอบของคุณ |
|---|---|---|
| 1.1 | Method ที่ใช้คือ GET หรือ POST? | |
| 1.2 | Content-Type บอกอะไรกับเซิร์ฟเวอร์? | |
| 1.3 | ถ้าเซิร์ฟเวอร์ตอบ Status Code `200` หมายความว่าอะไร? | |

---

## ส่วนที่ 2: HTTP GET — อ่านข้อมูลจากเซิร์ฟเวอร์ (20 นาที)

### ขั้นตอน

1. สร้างโปรเจกต์ ESP32 ใหม่บน Wokwi
2. คัดลอกโค้ดด้านล่างไปวางในไฟล์ `sketch.ino`
3. กดรันและสังเกตผลลัพธ์ใน Serial Monitor

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

// Wokwi จำลอง Wi-Fi ให้อัตโนมัติ
const char* ssid = "Wokwi-GUEST";
const char* password = "";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("กำลังเชื่อมต่อ Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nเชื่อมต่อสำเร็จ! IP: " + WiFi.localIP().toString());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // GET request ไปยัง httpbin.org
    http.begin("https://httpbin.org/get?sensor=dht22&temp=27");
    int httpCode = http.GET();

    Serial.printf("HTTP GET Status Code: %d\n", httpCode);

    if (httpCode == 200) {
      String response = http.getString();
      Serial.println("Response (100 ตัวอักษรแรก):");
      Serial.println(response.substring(0, 100));
    } else {
      Serial.println("เกิดข้อผิดพลาด!");
    }

    http.end();
  }
  delay(10000); // รอ 10 วินาที
}
```

4. บันทึกผลลัพธ์จาก Serial Monitor

| รอบที่ | Status Code | ข้อมูลที่ได้รับ (สรุปสั้น ๆ) |
|---|---|---|
| 1 | | |
| 2 | | |

---

## ส่วนที่ 3: สร้าง JSON ด้วย ArduinoJson (20 นาที)

### ขั้นตอน

1. เพิ่มไลบรารี `ArduinoJson` ในไฟล์ `diagram.json` ของ Wokwi โดยเพิ่มส่วน libraries:

```json
{
  "version": 1,
  "author": "Student",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": 0 }
  ],
  "connections": [],
  "dependencies": {
    "bblanchon/ArduinoJson": "^7"
  }
}
```

2. ทดสอบสร้าง JSON payload ด้วยโค้ดต่อไปนี้ (แทนที่ในส่วน `loop()`)

```cpp
#include <ArduinoJson.h>

// วางในส่วน loop() หรือฟังก์ชันแยก
void createPayload() {
  JsonDocument doc;

  doc["device"]   = "ESP32-ME01";
  doc["sensor"]   = "DHT22";
  doc["temp"]     = 28.5;   // จำลองค่าอุณหภูมิ
  doc["humidity"]  = 62.0;   // จำลองค่าความชื้น
  doc["unit"]     = "celsius";

  String jsonString;
  serializeJson(doc, jsonString);

  Serial.println("JSON Payload:");
  Serial.println(jsonString);
}
```

3. รันโค้ดแล้วคัดลอก JSON ที่แสดงใน Serial Monitor

**ผลลัพธ์ JSON ที่ได้:**

```
(วางผลลัพธ์ตรงนี้)
```

---

## ส่วนที่ 4: HTTP POST — ส่งข้อมูล JSON ไปยังเซิร์ฟเวอร์ (25 นาที)

### ขั้นตอน

1. รวมโค้ดจากส่วนที่ 2 และ 3 เข้าด้วยกัน แล้วเปลี่ยนเป็น POST request
2. ใช้โค้ดด้านล่างเป็นตัวอย่างที่สมบูรณ์

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid     = "Wokwi-GUEST";
const char* password = "";
const char* endpoint = "https://httpbin.org/post";

int readCount = 0;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  Serial.println("Wi-Fi Connected!");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) return;

  // จำลองค่าเซนเซอร์ (สุ่มเล็กน้อย)
  float temp  = 25.0 + random(0, 80) / 10.0;
  float humid = 50.0 + random(0, 300) / 10.0;
  readCount++;

  // สร้าง JSON payload
  JsonDocument doc;
  doc["device"]    = "ESP32-ME01";
  doc["reading"]   = readCount;
  doc["temp_c"]    = temp;
  doc["humidity"]  = humid;
  doc["status"]    = (temp > 30.0) ? "warning" : "normal";

  String payload;
  serializeJson(doc, payload);
  Serial.println("ส่ง: " + payload);

  // ส่ง HTTP POST
  HTTPClient http;
  http.begin(endpoint);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(payload);
  Serial.printf("Response Code: %d\n", httpCode);

  if (httpCode == 200) {
    // อ่าน response บางส่วน
    String resp = http.getString();
    Serial.println("สำเร็จ! ขนาด response: " + String(resp.length()) + " bytes");
  }

  http.end();
  Serial.println("---");
  delay(15000); // ส่งทุก 15 วินาที
}
```

3. รันบน Wokwi แล้วบันทึกผลในตาราง

| ครั้งที่ (reading) | temp_c | humidity | status | HTTP Code | ผลลัพธ์ (สำเร็จ/ล้มเหลว) |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

---

## ส่วนที่ 5: แบบฝึกหัดท้าย Lab (10 นาที)

### คำถาม

1. **GET vs POST:** ถ้าต้องการส่งค่าอุณหภูมิ ความชื้น และแรงดันไฟฟ้าไปบันทึกที่เซิร์ฟเวอร์ ควรใช้ GET หรือ POST? เพราะเหตุใด?

   > คำตอบ:

2. **Status Code:** จงจับคู่ Status Code กับความหมาย

   | Status Code | ความหมาย (เลือก: สำเร็จ / ไม่พบหน้า / เซิร์ฟเวอร์ผิดพลาด / ส่งข้อมูลไม่ถูกรูปแบบ) |
   |---|---|
   | 200 | |
   | 400 | |
   | 404 | |
   | 500 | |

3. **ดัดแปลงโค้ด:** ถ้าต้องการเพิ่มฟิลด์ `"pressure_kpa": 101.3` ลงใน JSON payload ต้องเพิ่มโค้ดบรรทัดใดในส่วนที่ 4?

   > คำตอบ:

4. **คิดต่อ (ท้าทาย):** ในการใช้งานจริง ทำไมเราไม่ควรส่งข้อมูลถี่เกินไป (เช่น ทุก 100 ms)? ให้เหตุผลอย่างน้อย 2 ข้อ

   > คำตอบ:

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จะประกาศใน Google Classroom)**

**สิ่งที่ต้องส่ง:**
1. ภาพจับหน้าจอ (Screenshot) ของ Serial Monitor ที่แสดง HTTP POST สำเร็จ อย่างน้อย 2 ครั้ง
2. ลิงก์โปรเจกต์ Wokwi ที่ทำงานได้ (กด Share > Copy Link)
3. ไฟล์ใบงานนี้ที่กรอกตาราง/คำตอบครบถ้วน (PDF หรือรูปภาพ)

### Checklist ก่อนส่ง

- [ ] เชื่อมต่อ Wi-Fi บน Wokwi สำเร็จ (แสดง IP address)
- [ ] HTTP GET ทำงานได้ — Status Code `200`
- [ ] สร้าง JSON payload ด้วย ArduinoJson ถูกต้อง
- [ ] HTTP POST ส่งข้อมูลสำเร็จ — Status Code `200`
- [ ] กรอกตารางบันทึกผลครบทุกส่วน
- [ ] ตอบแบบฝึกหัดท้าย Lab ครบทุกข้อ
- [ ] แนบ Screenshot และลิงก์ Wokwi
