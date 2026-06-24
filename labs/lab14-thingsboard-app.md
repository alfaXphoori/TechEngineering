# 🔬 Lab 14: แดชบอร์ดควบคุมผ่าน ThingsBoard

ใบงานปฏิบัติการนี้เป็นส่วนหนึ่งของรายวิชา **เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)** สำหรับนักศึกษาหลักสูตรวิศวกรรมเครื่องกล ชั้นปีที่ 1
ในใบงานนี้ เราจะเรียนรู้วิธีการสร้างแดชบอร์ดบนเว็บไซต์ ThingsBoard เพื่อ **ควบคุมอุปกรณ์** (สั่ง LED เปิด/ปิด ผ่าน RPC) และ **ติดตามสถานะเซนเซอร์** (แสดงค่า Potentiometer) แบบเรียลไทม์ผ่านอินเทอร์เน็ตของสรรพสิ่ง (IoT) โดยใช้บอร์ด ESP32 บนโปรแกรมจำลอง **Wokwi**

## วัตถุประสงค์
- เข้าใจและสามารถสร้าง Device บน ThingsBoard Cloud พร้อมคัดลอก Access Token ได้
- สามารถออกแบบหน้าแดชบอร์ด (Dashboard) บน ThingsBoard ให้มีทั้งวิดเจ็ตควบคุม (Switch/RPC) และวิดเจ็ตแสดงผล (Gauge) ได้
- สามารถเขียนโปรแกรมภาษา C++ เพื่อเชื่อมต่อ ESP32 เข้ากับ ThingsBoard Cloud ผ่าน MQTT ได้
- สามารถประยุกต์ใช้คำสั่ง RPC แบบสองทิศทาง (Bidirectional): ส่งโทรมาตรขึ้นคลาวด์ และรับคำสั่ง RPC จากแดชบอร์ดมาควบคุม LED ได้

---

## ส่วนที่ 1: การตั้งค่าแพลตฟอร์ม ThingsBoard (20 นาที)

ThingsBoard ใช้ระบบ MQTT ที่เซิร์ฟเวอร์ส่งคำสั่งควบคุมกลับมาหาอุปกรณ์ในรูปแบบ **Remote Procedure Call (RPC)** แทนระบบ Virtual Pin

1. ไปที่เว็บไซต์ [thingsboard.cloud](https://thingsboard.cloud/) แล้วทำการสมัครสมาชิก (Sign Up) หรือเข้าสู่ระบบ
2. ไปที่เมนู **Entities** -> **Devices** -> คลิก **+ Add device**
   - **Name:** `ESP32_Control`
   - คลิก **Add**
3. คลิกที่ชื่ออุปกรณ์ `ESP32_Control` -> แท็บ **Details** -> คลิก **Copy access token** เก็บไว้ใน Notepad
4. ไปที่เมนู **Dashboards** -> คลิก **+ Create new dashboard** -> ตั้งชื่อ `Lab14_Control` -> คลิก **Add**
5. คลิก **Open dashboard** -> คลิก **Edit mode** (ไอคอนดินสอ) เพื่อเพิ่มวิดเจ็ต

**เพิ่มวิดเจ็ต Switch สำหรับส่ง RPC ควบคุม LED:**
1. คลิก **Add widget** -> เลือก Widget Bundle **Control widgets** -> เลือก **Round switch**
2. ในหน้าตั้งค่า -> แท็บ **Datasources** -> คลิก **+ Add datasource**
   - Type: **Device**, Device: `ESP32_Control`
   - เพิ่ม Key: `ledState` (ใช้ดูสถานะที่ส่งกลับ ถ้ามี หรือเว้นว่างได้)
3. ไปที่แท็บ **Advanced** (หรือ Settings) -> ตั้งค่า **RPC**:
   - **Method name (RPC on):** `setLed`
   - **Params (on):** `true`
   - **Params (off):** `false`
4. คลิก **Add** เพื่อบันทึกวิดเจ็ต Switch

**เพิ่มวิดเจ็ต Gauge สำหรับแสดงค่าโทรมาตร:**
1. คลิก **Add widget** -> เลือก Widget Bundle **Gauges** -> เลือก **Radial gauge**
2. ในหน้าตั้งค่า -> แท็บ **Datasources** -> คลิก **+ Add datasource**
   - Type: **Device**, Device: `ESP32_Control`
   - เพิ่ม Key: `sensorValue`
3. คลิก **Add**

6. คลิก **Save** เพื่อบันทึก Dashboard

---

## ส่วนที่ 2: การออกแบบวงจรใน Wokwi (15 นาที)

1. เปิดเว็บไซต์ [Wokwi.com](https://wokwi.com) และสร้างโปรเจกต์ ESP32 ใหม่
2. เพิ่มอุปกรณ์และต่อวงจรดังนี้:
   - หลอด **LED** 1 ดวง: ต่อขา Anode → ผ่านตัวต้านทาน 220Ω → `GPIO2`; ขา Cathode → `GND`
   - **Potentiometer** 1 ตัว: ขากลาง (Wiper) → `GPIO34`; ขาข้าง → `3.3V` และ `GND`
3. ไปที่แท็บ **Library Manager** (ไอคอนหนังสือ) และกดปุ่ม `+` เพื่อเพิ่มไลบรารี:
   - `PubSubClient`
   - `ArduinoJson`

---

## ส่วนที่ 3: การเขียนโปรแกรม ESP32 บน Wokwi (30 นาที)

โค้ดนี้ทำงานสองทิศทาง:
- **Uplink (ส่งขึ้นคลาวด์):** อ่านค่า Potentiometer แล้วส่งเป็น Telemetry ทุก 2 วินาที
- **Downlink (รับคำสั่ง):** Subscribe Topic `v1/devices/me/rpc/request/+` รอรับคำสั่ง `setLed` จากแดชบอร์ด

คัดลอกและวางโค้ดด้านล่างนี้ลงใน `sketch.ino` แล้วแทนที่ `YOUR_ACCESS_TOKEN_HERE` ด้วยค่าที่ได้จาก ThingsBoard:

```cpp
/*
 * Lab 14: แดชบอร์ดควบคุมผ่าน ThingsBoard (RPC + Telemetry)
 * Board   : ESP32
 * Wiring  : LED (GPIO2 ผ่าน 220Ω), Potentiometer (GPIO34)
 * Cloud   : thingsboard.cloud (MQTT port 1883)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// ---------- การตั้งค่า Wi-Fi สำหรับ Wokwi ----------
const char* ssid = "Wokwi-GUEST";
const char* pass = "";

// ---------- การตั้งค่า ThingsBoard MQTT Broker ----------
const char* tb_server    = "thingsboard.cloud";
const int   tb_port      = 1883;
// *** แทนที่ด้วย Access Token ของอุปกรณ์ที่ได้จาก ThingsBoard ***
const char* access_token = "YOUR_ACCESS_TOKEN_HERE";

// ---------- ขาของอุปกรณ์ ----------
const int LED_PIN = 2;   // LED ต่อผ่านตัวต้านทาน 220Ω
const int POT_PIN = 34;  // Potentiometer (ADC)

WiFiClient   espClient;
PubSubClient client(espClient);

// ---------- ตัวแปรจับเวลาแบบ Non-blocking ----------
unsigned long lastSendTime         = 0;
const unsigned long sendInterval   = 2000;
unsigned long lastReconnectAttempt = 0;

// ---------- Callback: รับคำสั่ง RPC จาก ThingsBoard ----------
// ถูกเรียกอัตโนมัติเมื่อมีข้อความเข้ามาที่ Topic rpc/request/+
void onRpcCommand(char* topic, byte* payload, unsigned int length) {
  // แปลง payload เป็น JSON
  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload, length);

  const char* method = doc["method"];
  Serial.print("RPC method: ");
  Serial.println(method);

  // ตรวจสอบว่าเป็นคำสั่ง setLed หรือไม่
  if (strcmp(method, "setLed") == 0) {
    bool ledState = doc["params"];             // อ่านค่า true หรือ false
    digitalWrite(LED_PIN, ledState ? HIGH : LOW);

    Serial.print("LED: ");
    Serial.println(ledState ? "ON" : "OFF");

    // ส่งข้อมูลตอบกลับ (RPC Response) เพื่อยืนยันว่าทำงานสำเร็จ
    String topicStr   = String(topic);
    String requestId  = topicStr.substring(topicStr.lastIndexOf("/") + 1);
    String responseTopic = "v1/devices/me/rpc/response/" + requestId;
    client.publish(responseTopic.c_str(), "{\"success\":true}");
  }
}

// ---------- ฟังก์ชันเชื่อมต่อ MQTT แบบ Non-blocking ----------
void reconnectNonBlocking() {
  if (millis() - lastReconnectAttempt > 5000) {
    lastReconnectAttempt = millis();
    Serial.print("กำลังเชื่อมต่อ ThingsBoard...");
    // Username = Access Token, Password = NULL
    if (client.connect("ESP32_Control", access_token, NULL)) {
      Serial.println(" เชื่อมต่อสำเร็จ!");
      // Subscribe หัวข้อ RPC เพื่อรับคำสั่งจากแดชบอร์ด
      client.subscribe("v1/devices/me/rpc/request/+");
      Serial.println("Subscribe RPC Topic สำเร็จ");
    } else {
      Serial.print(" ล้มเหลว (rc=");
      Serial.print(client.state());
      Serial.println(") ลองใหม่ใน 5 วินาที");
    }
  }
}

// ---------- ฟังก์ชันอ่านเซนเซอร์และส่งโทรมาตรขึ้นคลาวด์ ----------
void sendSensorData() {
  int rawValue = analogRead(POT_PIN);
  // แปลงค่า ADC (0–4095) เป็นช่วง 0.0–100.0
  float sensorValue = (rawValue / 4095.0) * 100.0;

  StaticJsonDocument<128> doc;
  doc["sensorValue"] = sensorValue;

  char payload[128];
  serializeJson(doc, payload);

  Serial.print("Telemetry: ");
  Serial.println(payload);

  client.publish("v1/devices/me/telemetry", payload);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // เชื่อมต่อ Wi-Fi
  Serial.print("กำลังเชื่อมต่อ Wi-Fi...");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" เชื่อมต่อ Wi-Fi สำเร็จ!");

  // ตั้งค่า MQTT Broker และ Callback สำหรับรับ RPC
  client.setServer(tb_server, tb_port);
  client.setCallback(onRpcCommand);
}

void loop() {
  // ตรวจสอบและเชื่อมต่อ MQTT แบบ Non-blocking
  if (!client.connected()) {
    reconnectNonBlocking();
  } else {
    client.loop(); // ประมวลผลข้อความ MQTT ขาเข้า (RPC) และ Keep-alive
  }

  // ส่งโทรมาตรตามรอบสัญญาณเวลาโดยไม่ใช้ delay()
  if (millis() - lastSendTime >= sendInterval) {
    lastSendTime = millis();
    if (client.connected()) {
      sendSensorData();
    }
  }
}
```

---

## ส่วนที่ 4: การทดสอบและบันทึกผล (15 นาที)

1. กดปุ่ม **Start Simulation (▶)** ใน Wokwi รอจนกว่า Serial Monitor จะแสดงข้อความ "เชื่อมต่อสำเร็จ" และ "Subscribe RPC Topic สำเร็จ"
2. เปิดหน้าต่าง ThingsBoard Dashboard `Lab14_Control` ควบคู่ไปกับหน้าต่าง Wokwi
3. ทดลองกด **Switch** บน ThingsBoard Dashboard แล้วสังเกตหลอด LED ใน Wokwi
4. ทดลองปรับหมุนค่า Potentiometer ใน Wokwi แล้วสังเกตเข็มเกจ (sensorValue) บน Dashboard

**บันทึกผลการทดลอง:**

| การกระทำ (Action) | ผลที่สังเกตได้บน Wokwi | ผลที่สังเกตได้บน ThingsBoard Dashboard |
| :--- | :--- | :--- |
| กด Switch ให้เป็นสถานะ ON | .............................................................. | .............................................................. |
| กด Switch ให้เป็นสถานะ OFF | .............................................................. | .............................................................. |
| ปรับหมุน Potentiometer ขึ้นสูงสุด | .............................................................. | .............................................................. |
| ปรับหมุน Potentiometer ลงต่ำสุด | .............................................................. | .............................................................. |

---

## คำถามท้ายการทดลอง (Review Questions)

1. อธิบายการทำงานของฟังก์ชัน `onRpcCommand` ในโค้ด: เมื่อผู้ใช้กด Switch บน ThingsBoard Dashboard ข้อมูลเดินทางอย่างไรจาก Dashboard ไปถึง LED บน Wokwi?
**ตอบ** ......................................................................................................................................................................
................................................................................................................................................................................

2. อธิบายความแตกต่างระหว่างระบบ RPC (Remote Procedure Call) ของ ThingsBoard กับระบบที่ใช้ Virtual Pin หมายเลขคงที่: แต่ละแนวทางรับคำสั่งควบคุมจากแดชบอร์ดในรูปแบบใด และเหตุใดการใช้ชื่อ method และ JSON params จึงยืดหยุ่นกว่าสำหรับงานวิศวกรรม?
**ตอบ** ......................................................................................................................................................................
................................................................................................................................................................................
................................................................................................................................................................................

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form ตามลิงก์ที่ประกาศในระบบ e-Learning หรือช่องทางสื่อสารของรายวิชา

### Checklist ก่อนส่ง
- [ ] ระบุชื่อ-สกุล และรหัสนักศึกษา เป็นคอมเมนต์ไว้ที่บรรทัดบนสุดของโค้ดใน Wokwi อย่างชัดเจน
- [ ] แทนที่ `YOUR_ACCESS_TOKEN_HERE` ด้วย Access Token ของตนเองและทดสอบรันสำเร็จแล้ว
- [ ] คัดลอกลิงก์โปรเจกต์ Wokwi (ตรวจสอบให้แน่ใจว่าบันทึกโปรเจกต์และเปิดเป็น Public แล้ว)
- [ ] แนบภาพถ่ายหน้าจอ (Screenshot) ของ ThingsBoard Dashboard ที่แสดง Switch ในสถานะ ON และเกจแสดงค่า sensorValue
- [ ] แนบภาพถ่ายหน้าจอ Serial Monitor ที่แสดงข้อความ RPC และ Telemetry ทำงานสำเร็จ
- [ ] กรอกตารางบันทึกผลและตอบคำถามท้ายการทดลองครบถ้วนทุกข้อ
