# 🔬 Lab 12: จัดเก็บข้อมูลและการแจ้งเตือนบน ThingsBoard

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1
**แพลตฟอร์มที่ใช้:** Wokwi Simulator และ ThingsBoard Cloud (thingsboard.cloud)

---

## 🎯 วัตถุประสงค์
1. เพื่อให้นักศึกษาสามารถส่งข้อมูลจากเซนเซอร์ขึ้นไปเก็บบันทึกเป็นอนุกรมเวลา (Time-series) บน ThingsBoard Cloud ได้อย่างต่อเนื่อง
2. สามารถเรียกดูแนวโน้มข้อมูลย้อนหลัง (History) ผ่านวิดเจ็ต Time-series Chart บน Dashboard
3. สามารถสร้างกฎการแจ้งเตือน (Alarm Rule) บน ThingsBoard เพื่อตรวจจับสภาวะผิดปกติ เช่น อุณหภูมิเกินขีดจำกัด
4. สามารถตรวจสอบ Alarm ที่ถูกสร้างขึ้นจากหน้า Dashboard และหน้า Device ใน ThingsBoard ได้

---

## ⏱️ ส่วนที่ 1: การเตรียม Dashboard และกฎแจ้งเตือนบน ThingsBoard (30 นาที)

ThingsBoard เก็บข้อมูลโทรมาตร (Telemetry) ทุกชุดที่อุปกรณ์ส่งมาโดยอัตโนมัติ เป็นฐานข้อมูลอนุกรมเวลา ไม่จำเป็นต้องตั้งค่าเพิ่มเติมให้ข้อมูลถูกบันทึก เพียงส่งข้อมูลเข้ามาก็จะถูกเก็บและสามารถดูย้อนหลังได้ทันที

**ขั้นตอนปฏิบัติ — สร้าง Dashboard แสดงกราฟอนุกรมเวลา:**
1. เข้าสู่ระบบ [thingsboard.cloud](https://thingsboard.cloud/)
2. ตรวจสอบว่ายังมี Device ที่สร้างไว้ใน Lab 11 (`ESP32_Weather`) พร้อมใช้งาน หากยังไม่มีให้สร้างใหม่และคัดลอก Access Token เก็บไว้
3. ไปที่เมนู **Dashboards** -> คลิก **+ Create new dashboard** -> ตั้งชื่อ `Weather History & Alert` -> คลิก **Add**
4. คลิก **Open dashboard** -> คลิก **Edit mode** (ไอคอนดินสอ)
5. คลิก **Add widget** เพื่อเพิ่มวิดเจ็ตกราฟ:
   * เลือก Widget Bundle **Charts** -> เลือก **Time-series Line Chart**
   * ในหน้าตั้งค่าวิดเจ็ต ไปที่แท็บ **Datasources** -> คลิก **+ Add datasource**
   * เลือก Type: **Device**, เลือก Device: `ESP32_Weather`
   * เพิ่ม Key: `temperature` และ `humidity` (คลิก **Add** ทั้งสองคีย์)
   * คลิก **Add** เพื่อบันทึกวิดเจ็ต — นี่คือกราฟที่จะแสดงประวัติข้อมูลย้อนหลัง
6. คลิก **Save** เพื่อบันทึก Dashboard

**ขั้นตอนปฏิบัติ — สร้างกฎแจ้งเตือน (Alarm Rule) ผ่าน Device Profile:**
1. ไปที่เมนู **Profiles** -> **Device profiles** ทางแถบซ้าย
2. คลิก **default** (หรือ Profile ที่อุปกรณ์ใช้งาน)
3. ไปที่แท็บ **Alarm rules** -> คลิก **+ Add alarm rule**
4. กำหนดค่า Alarm Rule ดังนี้:
   * **Alarm type:** `High Temperature`
   * **Create alarm:** เงื่อนไข **temperature** > `35` (Severity: **Warning**)
   * **Clear alarm:** เงื่อนไข **temperature** <= `35`
5. คลิก **Save** เพื่อบันทึก Device Profile — ระบบจะสร้าง Alarm อัตโนมัติเมื่ออุณหภูมิเกิน 35°C ทุกครั้งที่มีข้อมูลเข้ามา

> **หมายเหตุ:** Alarm ที่เกิดขึ้นสามารถดูได้ที่ **Entities -> Devices -> เลือก Device -> แท็บ Alarms** หรือเพิ่มวิดเจ็ต **Alarms table** ลงใน Dashboard

---

## ⏱️ ส่วนที่ 2: การเขียนโปรแกรมส่งข้อมูลและสร้างทริกเกอร์ (60 นาที)

ในส่วนนี้นักศึกษาจะต่อวงจรจำลองใน **Wokwi** โดยใช้ **ESP32** ร่วมกับเซนเซอร์ **DHT22** เพื่ออ่านค่าอุณหภูมิและความชื้น จากนั้นส่งขึ้น ThingsBoard ทุกๆ 2 วินาที ผ่าน MQTT โดยโค้ดยังพิมพ์คำเตือนใน Serial Monitor เมื่ออุณหภูมิเกินเกณฑ์

**อุปกรณ์ใน Wokwi:**
- ESP32
- เซนเซอร์ DHT22 (ต่อขา Data เข้ากับ GPIO 15 ของ ESP32, VCC → 3.3V, GND → GND)

**ไลบรารีที่ต้องเพิ่มใน Library Manager:**
- `PubSubClient`
- `ArduinoJson`
- `DHT sensor library for ESPx`

**โค้ดโปรแกรม:**

```cpp
/*
 * Lab 12: จัดเก็บข้อมูลและการแจ้งเตือนบน ThingsBoard
 * Board  : ESP32
 * Sensor : DHT22 (GPIO15)
 * Cloud  : thingsboard.cloud (MQTT port 1883)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHTesp.h"

// ข้อมูล Wi-Fi สำหรับ Wokwi
const char* ssid = "Wokwi-GUEST";
const char* pass = "";

// การตั้งค่า ThingsBoard MQTT Broker
const char* tb_server   = "thingsboard.cloud";
const int   tb_port     = 1883;
// *** แทนที่ด้วย Access Token ของอุปกรณ์ที่ได้จาก ThingsBoard ***
const char* access_token = "YOUR_ACCESS_TOKEN_HERE";

// กำหนดขาของ DHT22
const int DHT_PIN = 15;
DHTesp dht;

WiFiClient   espClient;
PubSubClient client(espClient);

// ตัวแปรจับเวลาแบบ Non-blocking
unsigned long lastSendTime         = 0;
const unsigned long sendInterval   = 2000;
unsigned long lastReconnectAttempt = 0;

// ตัวแปรสถานะการแจ้งเตือน (ป้องกันการพิมพ์ซ้ำต่อเนื่อง)
bool isHighTempAlerted = false;

// ฟังก์ชันพยายามเชื่อมต่อ MQTT แบบ Non-blocking
void reconnectNonBlocking() {
  if (millis() - lastReconnectAttempt > 5000) {
    lastReconnectAttempt = millis();
    Serial.print("กำลังเชื่อมต่อ ThingsBoard...");
    if (client.connect("ESP32_Weather", access_token, NULL)) {
      Serial.println(" เชื่อมต่อสำเร็จ!");
    } else {
      Serial.print(" ล้มเหลว (rc=");
      Serial.print(client.state());
      Serial.println(") ลองใหม่ใน 5 วินาที");
    }
  }
}

// ฟังก์ชันอ่านค่า DHT22 และส่งโทรมาตรขึ้นคลาวด์
void sendSensorData() {
  TempAndHumidity data = dht.getTempAndHumidity();

  if (isnan(data.temperature) || isnan(data.humidity)) {
    Serial.println("อ่านค่า DHT22 ไม่ได้!");
    return;
  }

  float t = data.temperature;
  float h = data.humidity;

  // สร้างข้อความ JSON และส่งโทรมาตรขึ้น ThingsBoard
  StaticJsonDocument<128> doc;
  doc["temperature"] = t;
  doc["humidity"]    = h;

  char payload[128];
  serializeJson(doc, payload);

  Serial.print("Telemetry: ");
  Serial.println(payload);

  client.publish("v1/devices/me/telemetry", payload);

  // ตรวจสอบเงื่อนไขแจ้งเตือนในโค้ด (เสริม Serial Monitor)
  // กฎแจ้งเตือนหลักถูกตั้งค่าไว้บน ThingsBoard Alarm Rule แล้ว
  if (t > 35.0) {
    if (!isHighTempAlerted) {
      Serial.println(">> อุณหภูมิสูงผิดปกติ! ThingsBoard Alarm Rule จะสร้าง Alarm อัตโนมัติ");
      isHighTempAlerted = true;
    }
  } else {
    if (isHighTempAlerted) {
      Serial.println(">> อุณหภูมิกลับสู่สภาวะปกติ — Alarm จะถูกล้างโดยอัตโนมัติ");
      isHighTempAlerted = false;
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("เริ่มต้น ThingsBoard IoT Lab...");

  dht.setup(DHT_PIN, DHTesp::DHT22);

  Serial.print("กำลังเชื่อมต่อ Wi-Fi...");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" เชื่อมต่อ Wi-Fi สำเร็จ!");

  client.setServer(tb_server, tb_port);
}

void loop() {
  if (!client.connected()) {
    reconnectNonBlocking();
  } else {
    client.loop(); // รักษาการสื่อสาร MQTT และ Keep-alive
  }

  if (millis() - lastSendTime >= sendInterval) {
    lastSendTime = millis();
    if (client.connected()) {
      sendSensorData();
    }
  }
}
```

**การทดสอบการทำงาน:**
1. นำโค้ดด้านบนไปใส่ใน Wokwi แล้วแทนที่ `YOUR_ACCESS_TOKEN_HERE` ด้วย Access Token ของนักศึกษา
2. กด **Run Simulation**
3. คลิกที่ตัวเซนเซอร์ DHT22 ใน Wokwi แล้วลองปรับแถบเลื่อนอุณหภูมิ (Temperature slider) ให้เกิน 35°C
4. สังเกต Serial Monitor — จะต้องพิมพ์ข้อความว่าอุณหภูมิสูง
5. ไปที่ ThingsBoard -> เลือก Device `ESP32_Weather` -> แท็บ **Alarms** ตรวจสอบว่ามี Alarm **High Temperature** ปรากฏขึ้นหรือไม่
6. เปิดหน้า Dashboard `Weather History & Alert` เพื่อสังเกตกราฟเส้นที่บันทึกข้อมูลอย่างต่อเนื่องพร้อมเส้นประวัติย้อนหลัง

---

## ⏱️ ส่วนที่ 3: ตารางออกแบบกฎการแจ้งเตือน (Alert Rules) (20 นาที)

ในฐานะวิศวกรเครื่องกล การกำหนดเกณฑ์แจ้งเตือนต้องสอดคล้องกับความปลอดภัยของระบบ ให้นักศึกษาออกแบบเงื่อนไขจำลองสำหรับการเฝ้าระวังเครื่องจักร โดยเติมข้อมูลลงในตารางด้านล่างให้สมบูรณ์

| ลำดับ | พารามิเตอร์ที่ตรวจจับ | เงื่อนไข (Condition) | ระดับความรุนแรง (Level) | ช่องทางแจ้งเตือนหลัก | การดำเนินการ (Action) |
| :---: | :--- | :--- | :---: | :--- | :--- |
| 1 | อุณหภูมิของมอเตอร์ | temperature > 35°C | Warning | ThingsBoard Alarm | ตรวจสอบระบบระบายความร้อน |
| 2 | อุณหภูมิของมอเตอร์ | temperature > 80°C | Critical | ThingsBoard Alarm + Email | ........................................................ |
| 3 | ................................... | ................................... | .......................... | ................................... | ........................................................ |
| 4 | ................................... | ................................... | .......................... | ................................... | ........................................................ |

---

## 📝 คำถามท้ายการทดลอง
1. ThingsBoard เก็บข้อมูลโทรมาตรเป็นอนุกรมเวลา (Time-series) โดยอัตโนมัติ แตกต่างจากการใช้ฟังก์ชันพิเศษอย่างไร? วิดเจ็ต Time-series Line Chart แสดงข้อมูลจากส่วนใดของระบบ?
2. เหตุใดในโปรแกรมจึงต้องมีการใช้ตัวแปร `isHighTempAlerted` ร่วมกับเงื่อนไข `if (!isHighTempAlerted)` ก่อนพิมพ์ข้อความแจ้งเตือน? (ทั้งที่ ThingsBoard Alarm Rule จัดการเรื่องนี้ได้แล้ว)
3. หาก ThingsBoard Alarm Rule ตั้งค่าเงื่อนไข Clear alarm ไว้ที่ temperature <= 35 และอุณหภูมิยังคงสูงกว่า 35°C ต่อเนื่อง 10 นาที Alarm จะยังคงสถานะ **Active** อยู่หรือไม่? อธิบายเหตุผล
4. วิดเจ็ต Time-series Line Chart มีความสำคัญอย่างไรในการวิเคราะห์แนวโน้มสภาพเครื่องจักร (Machine Condition Trend)?

---

## 📥 การส่งงาน

> 📋 **Google Form:** [ลิงก์สำหรับส่งงาน Lab 12] (รอรับลิงก์จากอาจารย์ผู้สอน)

### Checklist ก่อนส่งงาน
- [ ] ทดสอบส่งข้อมูลขึ้น ThingsBoard เรียบร้อยและมีข้อมูลกราฟโชว์บน Time-series Line Chart
- [ ] ทดสอบปรับค่าเซนเซอร์จำลองให้เกินเกณฑ์ที่กำหนด และตรวจสอบ Alarm ที่หน้า Device -> แท็บ Alarms สำเร็จ
- [ ] แคปเจอร์หน้าจอ (Screenshot) แท็บ Alarms ของ Device บน ThingsBoard ที่แสดง Alarm High Temperature
- [ ] แคปเจอร์หน้าจอกราฟ Time-series Line Chart ที่แสดงการเปลี่ยนแปลงของอุณหภูมิและความชื้น
- [ ] ตอบคำถามท้ายการทดลองและเติมข้อมูลในตารางออกแบบกฎแจ้งเตือนครบถ้วน
- [ ] รวบรวมรูปภาพ โค้ด และคำตอบจัดทำเป็นไฟล์ PDF เดียวกันเพื่ออัปโหลดลง Google Form
