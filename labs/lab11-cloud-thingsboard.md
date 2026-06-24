# 🔬 Lab 11: เชื่อมต่อคลาวด์ ThingsBoard

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1

---

## วัตถุประสงค์

1. เพื่อให้นักศึกษาสามารถสมัครและใช้งานแพลตฟอร์มคลาวด์ ThingsBoard (thingsboard.cloud) เบื้องต้นได้
2. เพื่อให้นักศึกษาสามารถสร้าง Device และคัดลอก Access Token เพื่อยืนยันตัวตนอุปกรณ์ได้
3. เพื่อให้นักศึกษาสามารถเขียนโปรแกรม ESP32 บน Wokwi เพื่อส่งข้อมูลเซนเซอร์ (DHT22) ขึ้นคลาวด์ผ่าน MQTT ได้
4. เพื่อให้นักศึกษาสามารถสร้าง Web Dashboard บน ThingsBoard เพื่อแสดงผลข้อมูลแบบเรียลไทม์ได้

---

## ส่วนที่ 1: การเตรียมความพร้อมบน ThingsBoard Cloud (30 นาที)

ในส่วนนี้เราจะสร้างโปรเจกต์บน ThingsBoard Cloud เพื่อรับข้อมูลจาก ESP32 ผ่านโปรโตคอล MQTT

1. ไปที่เว็บไซต์ [thingsboard.cloud](https://thingsboard.cloud/) และทำการสมัครสมาชิก (Sign Up) หรือเข้าสู่ระบบ (Log In)
2. เมื่อเข้าสู่ระบบแล้ว ให้ไปที่เมนู **Entities** -> **Devices** (แถบด้านซ้าย) แล้วคลิก **+ Add device** (ไอคอน + มุมขวาบน)
3. ตั้งชื่ออุปกรณ์ เช่น `ESP32_Weather` แล้วคลิก **Add**
4. **สำคัญมาก:** คลิกที่ชื่ออุปกรณ์ที่เพิ่งสร้าง ไปที่แท็บ **Details** แล้วคลิกปุ่ม **Copy access token** เก็บค่านี้ไว้ใน Notepad — นี่คือ **Access Token** ที่ใช้ยืนยันตัวตนอุปกรณ์กับ MQTT Broker
5. ไปที่เมนู **Dashboards** -> คลิก **+ Create new dashboard**
6. ตั้งชื่อ Dashboard เช่น `Weather Monitor` แล้วคลิก **Add**
7. คลิก **Open dashboard** จากนั้นคลิก **Edit mode** (ไอคอนดินสอ มุมขวาล่าง)
8. คลิก **Add widget** เพื่อเพิ่มวิดเจ็ตแสดงผล:
   * เลือก Widget Bundle **Gauges** -> เลือก **Radial gauge**
   * ในหน้าตั้งค่าวิดเจ็ต ไปที่แท็บ **Datasources** -> คลิก **+ Add datasource**
   * เลือก Type: **Device**, เลือก Device: `ESP32_Weather`
   * ใส่ Key: `temperature` -> คลิก **Add** แล้วคลิก **Add** อีกครั้งเพื่อบันทึกวิดเจ็ต
   * ทำซ้ำเพื่อเพิ่มวิดเจ็ต Gauge ที่ 2 โดยใช้ Key: `humidity`
9. คลิก **Save** ที่มุมขวาล่างเพื่อบันทึก Dashboard

---

## ส่วนที่ 2: การต่อวงจรและเตรียม Wokwi (15 นาที)

1. เปิดเว็บไซต์ [Wokwi](https://wokwi.com/) สร้างโปรเจกต์ใหม่ เลือกบอร์ด **ESP32**
2. เพิ่มอุปกรณ์และต่อวงจรดังนี้:
   * เซนเซอร์ **DHT22** จำนวน 1 ตัว
   * ขา `VCC` ของ DHT22 ต่อกับ `3.3V` ของ ESP32
   * ขา `GND` ของ DHT22 ต่อกับ `GND` ของ ESP32
   * ขา `SDA` (ข้อมูล) ของ DHT22 ต่อกับขา `GPIO15` ของ ESP32
3. ติดตั้งไลบรารีที่จำเป็น:
   * ไปที่แท็บ **Library Manager** (ไอคอนหนังสือ)
   * ค้นหาและเพิ่ม `PubSubClient` (สำหรับ MQTT)
   * ค้นหาและเพิ่ม `ArduinoJson` (สำหรับสร้างข้อความ JSON)
   * ค้นหาและเพิ่ม `DHT sensor library for ESPx` (สำหรับอ่าน DHT22)

---

## ส่วนที่ 3: การเขียนโปรแกรมส่งข้อมูลขึ้น ThingsBoard (45 นาที)

1. คัดลอกโค้ดด้านล่างไปวางใน `sketch.ino`
2. **แก้ไขบรรทัด `access_token`** ให้เป็น Access Token ที่ได้จาก ThingsBoard ในส่วนที่ 1 ข้อ 4

```cpp
/*
 * Lab 11: เชื่อมต่อคลาวด์ ThingsBoard
 * Board  : ESP32
 * Sensor : DHT22 (GPIO15)
 * Cloud  : thingsboard.cloud (MQTT port 1883)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHTesp.h"

// ---------- การตั้งค่า Wi-Fi สำหรับ Wokwi ----------
const char* ssid = "Wokwi-GUEST";
const char* pass = "";

// ---------- การตั้งค่า ThingsBoard MQTT Broker ----------
const char* tb_server  = "thingsboard.cloud";
const int   tb_port    = 1883;
// *** แทนที่ด้วย Access Token ของอุปกรณ์ที่ได้จาก ThingsBoard ***
const char* access_token = "YOUR_ACCESS_TOKEN_HERE";

// ---------- กำหนดขาของ DHT22 ----------
const int DHT_PIN = 15;
DHTesp dht;

WiFiClient   espClient;
PubSubClient client(espClient);

// ---------- ตัวแปรจับเวลาแบบ Non-blocking ----------
unsigned long lastSendTime      = 0;
const unsigned long sendInterval = 2000; // ส่งทุกๆ 2 วินาที

unsigned long lastReconnectAttempt = 0;

// ---------- ฟังก์ชันพยายามเชื่อมต่อ MQTT แบบ Non-blocking ----------
void reconnectNonBlocking() {
  if (millis() - lastReconnectAttempt > 5000) {
    lastReconnectAttempt = millis();
    Serial.print("กำลังเชื่อมต่อ ThingsBoard...");
    // Username = Access Token, Password = NULL
    if (client.connect("ESP32_Weather", access_token, NULL)) {
      Serial.println(" เชื่อมต่อสำเร็จ!");
    } else {
      Serial.print(" ล้มเหลว (rc=");
      Serial.print(client.state());
      Serial.println(") ลองใหม่อีกครั้งใน 5 วินาที");
    }
  }
}

// ---------- ฟังก์ชันอ่านค่า DHT22 และส่งโทรมาตรขึ้นคลาวด์ ----------
void sendSensorData() {
  TempAndHumidity data = dht.getTempAndHumidity();

  if (isnan(data.temperature) || isnan(data.humidity)) {
    Serial.println("อ่านค่า DHT22 ไม่ได้!");
    return;
  }

  // สร้างข้อความ JSON: {"temperature":xx.x,"humidity":xx.x}
  StaticJsonDocument<128> doc;
  doc["temperature"] = data.temperature;
  doc["humidity"]    = data.humidity;

  char payload[128];
  serializeJson(doc, payload);

  Serial.print("ส่งโทรมาตร: ");
  Serial.println(payload);

  // ส่งไปยัง MQTT Topic โทรมาตรของ ThingsBoard
  client.publish("v1/devices/me/telemetry", payload);
}

void setup() {
  Serial.begin(115200);

  // เริ่มต้น DHT22
  dht.setup(DHT_PIN, DHTesp::DHT22);

  // เชื่อมต่อ Wi-Fi
  Serial.print("กำลังเชื่อมต่อ Wi-Fi...");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" เชื่อมต่อ Wi-Fi สำเร็จ!");

  // ตั้งค่า MQTT Broker
  client.setServer(tb_server, tb_port);
}

void loop() {
  // ตรวจสอบและเชื่อมต่อ MQTT แบบ Non-blocking
  if (!client.connected()) {
    reconnectNonBlocking();
  } else {
    client.loop(); // รักษาการสื่อสาร MQTT และ Keep-alive
  }

  // ส่งข้อมูลตามรอบสัญญาณเวลาโดยไม่ใช้ delay()
  if (millis() - lastSendTime >= sendInterval) {
    lastSendTime = millis();
    if (client.connected()) {
      sendSensorData();
    }
  }
}
```

3. กดปุ่ม **Start Simulation** (เครื่องหมาย Play) บน Wokwi
4. สังเกตที่ Serial Monitor จะต้องขึ้นข้อความว่าเชื่อมต่อ Wi-Fi และ ThingsBoard สำเร็จ และแสดงค่าโทรมาตรที่ส่งออกทุก 2 วินาที
5. กลับไปที่หน้า ThingsBoard Dashboard สังเกตเข็มของ Gauge ว่าขยับตามค่าจำลองใน Wokwi หรือไม่ (สามารถคลิกที่ตัว DHT22 ใน Wokwi เพื่อเลื่อนแถบปรับค่าอุณหภูมิและความชื้นจำลองได้)

---

## ส่วนที่ 4: บันทึกผลการทดลอง (15 นาที)

ให้ทำการปรับค่าเซนเซอร์ DHT22 บน Wokwi จำนวน 3 ครั้งแตกต่างกัน รอประมาณ 2–3 วินาที แล้วบันทึกค่าที่ปรากฏใน Serial Monitor เทียบกับค่าที่แสดงผลบน ThingsBoard Dashboard

| ครั้งที่ | อุณหภูมิ Wokwi (°C) | อุณหภูมิ ThingsBoard `temperature` (°C) | ความชื้น Wokwi (%) | ความชื้น ThingsBoard `humidity` (%) | สถานะการอัปเดต (ทันที/ล่าช้า) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

---

## คำถามท้ายใบงาน

1. ในโค้ดนี้ใช้ `client.loop()` ร่วมกับ `millis()` แทนการใช้ `delay()` เหตุใดการใช้ `delay()` ใน `loop()` จึงเป็นอันตรายต่อการเชื่อมต่อ MQTT กับ ThingsBoard? (힌트: เกี่ยวกับ MQTT Keep-alive และ Heartbeat)
*(ตอบ: .................................................................................................... )*

2. คีย์ `temperature` และ `humidity` ในข้อความ JSON (`{"temperature":..,"humidity":..}`) ที่ส่งไปยัง Topic `v1/devices/me/telemetry` มีความสัมพันธ์กับวิดเจ็ต Gauge บน ThingsBoard Dashboard อย่างไร? และหากต้องการเพิ่มข้อมูลความดันอากาศ นักศึกษาต้องแก้ไขโค้ดส่วนใด?
*(ตอบ: .................................................................................................... )*

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: [ลิงก์ฟอร์มส่งงานของรายวิชา]

### Checklist ก่อนส่ง
- [ ] กรอกข้อมูลรหัสนักศึกษาและชื่อ-นามสกุลในฟอร์มครบถ้วน
- [ ] แนบลิงก์โปรเจกต์ Wokwi (ที่บันทึกและรันได้ปกติ)
- [ ] แนบภาพถ่ายหน้าจอ (Screenshot) ที่แสดงผล ThingsBoard Dashboard (Gauge อุณหภูมิและความชื้น) คู่กับหน้าจอ Wokwi และ Serial Monitor
- [ ] ตอบคำถามท้ายใบงานและกรอกตารางบันทึกผลเรียบร้อยแล้ว
