---
layout: default
title: "บทที่ 9: โพรโทคอลการรับส่งข้อความแบบไลท์เวท MQTT"
permalink: /chapters/ch09-mqtt/
---

# Chapter 9: โพรโทคอลการรับส่งข้อความแบบไลท์เวท MQTT

## Lightweight Messaging Protocol MQTT (Pub/Sub, Broker, Topics, Wildcards, QoS, LWT, PubSubClient)

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

> ### 🎯 ผลลัพธ์การเรียนรู้และการเชื่อมโยง (Constructive Alignment)
>
> - **สัปดาห์การเรียนรู้:** สัปดาห์ที่ 10 — โปรโตคอลการรับส่งข้อความแบบไลท์เวท (Lightweight Messaging Protocols & MQTT)
> - **ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs):**
>   - **CLO2:** เลือกใช้และอธิบายเทคโนโลยีไร้สาย โพรโทคอลการสื่อสาร และเทคโนโลยีคลาวด์สำหรับ IoT ได้
>   - **CLO3:** ออกแบบและพัฒนาระบบ IoT ที่เชื่อมต่อเซนเซอร์/ตัวกระทำ สื่อสารข้อมูล และแสดงผลผ่านโปรแกรมของผู้ใช้ได้
>   - **CLO4:** ปฏิบัติการสร้าง ทดสอบ และประยุกต์ใช้ระบบ IoT พร้อมการเรียนรู้ของเครื่องเบื้องต้น และทำงานเป็นทีมอย่างรับผิดชอบ
> - **ผลลัพธ์การเรียนรู้ระดับบทเรียน (LLOs):**
>   - **LLO10.1:** อธิบายรูปแบบ Publish/Subscribe ของ MQTT (Broker, Topic, QoS) ได้ (CLO2)
>   - **LLO10.2:** ส่งและรับข้อมูลเซนเซอร์ผ่านโพรโทคอล MQTT ได้ (CLO3, CLO4)
>
---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 9.1 บทนำและสถาปัตยกรรม Publish/Subscribe (Pub/Sub)

ในบทที่ 8 เราได้เรียนรู้โพรโทคอล HTTP ซึ่งใช้โมเดล Request-Response แต่ในงานวิศวกรรมไอโอทีที่มีอุปกรณ์เซนเซอร์นับร้อยนับพันตัว และต้องการการรายงานข้อมูลแบบทันที (Event-driven / Push-based) โพรโทคอล HTTP จะสร้างภาระให้กับระบบอย่างมาก

**MQTT (Message Queuing Telemetry Transport)** ได้รับการคิดค้นโดย Dr. Andy Stanford-Clark (IBM) และ Arlen Nipper (Arcom) ในปี ค.ศ. 1999 โดยออกแบบมาเพื่อติดตามท่อส่งน้ำมันผ่านดาวเทียมที่แบนด์วิดท์มีจำกัดและสัญญาณขาดหายบ่อย ปัจจุบัน MQTT เป็นมาตรฐานสากล (ISO/IEC 20922) สำหรับการสื่อสารในระบบ IoT และ IIoT

### 9.1.1 การแยกความเป็นอิสระ (Decoupling) 3 มิติของ Publish/Subscribe

สถาปัตยกรรม Pub/Sub แตกต่างจาก Client/Server โดยสิ้นเชิง เพราะผู้ส่งและผู้รับข้อมูลไม่ต้องเชื่อมต่อกันโดยตรง (Decoupled):

```
┌───────────────────────────┐                               ┌───────────────────────────┐
│         Publisher         │                               │        Subscriber         │
│   (ESP32 Vibration Node)  │ ─── Publish (Topic: A) ───┐   │   (Factory Dashboard)     │
└───────────────────────────┘                           │   │  (Subscribed to Topic: A) │
                                                        ▼   └───────────────────────────┘
                                              ┌───────────────────┐       ▲
                                              │    MQTT Broker    │ ──────┘
                                              │ (Message Router)  │ ──────┐
                                              └───────────────────┘       ▼
┌───────────────────────────┐                           ▲   ┌───────────────────────────┐
│         Publisher         │                           │   │        Subscriber         │
│    (ESP32 Climate Node)   │ ─── Publish (Topic: B) ───┘   │     (Alarm Controller)    │
│                           │                               │  (Subscribed to Topic: B) │
└───────────────────────────┘                               └───────────────────────────┘
```

1. **Space Decoupling (อิสระด้านสถานที่):** Publisher และ Subscriber ไม่จำเป็นต้องทราบ IP Address หรือตำแหน่งที่อยู่ของกันและกัน รู้เพียง Address ของ Broker
2. **Time Decoupling (อิสระด้านเวลา):** Subscriber ไม่จำเป็นต้องเปิดเครื่องหรือออนไลน์ในขณะที่ Publisher กำลังส่งข้อมูล (หากใช้ฟีเจอร์ Retained Message หรือ Persistent Session)
3. **Synchronization Decoupling (อิสระด้านจังหวะการทำงาน):** Publisher ส่งข้อมูลเสร็จแล้วสามารถเข้าสู่โหมดประหยัดพลังงาน (Deep Sleep) ได้ทันทีโดยไม่ต้องรอให้ Subscriber ประมวลผลเสร็จ

---

## 9.2 องค์ประกอบหลักของระบบ MQTT

1. **MQTT Broker (เซิร์ฟเวอร์ตัวกลาง):** ทำหน้าที่เป็นศูนย์กลางรับข้อความจาก Publisher และกระจายข้อความต่อไปยัง Subscriber ทุกตัวที่ลงทะเบียนไว้ในหัวข้อ (Topic) นั้น ๆ เช่น *Eclipse Mosquitto, EMQX, HiveMQ, AWS IoT Core*
2. **MQTT Publisher (ผู้เผยแพร่ข้อมูล):** อุปกรณ์ฝั่งส่งข้อมูล เช่น บอร์ด ESP32 ที่อ่านค่าอุณหภูมิแล้วส่งไปยัง Broker
3. **MQTT Subscriber (ผู้รับข้อมูล):** แอปพลิเคชัน แดชบอร์ด หรือไมโครคอนโทรลเลอร์อีกตัวที่รอรับข้อมูลจาก Broker เมื่อมีข้อความใหม่เข้ามา

---

## 9.3 โครงสร้างหัวข้อข้อความ (MQTT Topics & Wildcards)

หัวข้อ (Topic) ใน MQTT มีลักษณะเป็นลำดับชั้น (Hierarchical String) คั่นด้วยเครื่องหมายทับ `/` (Slash) คล้ายกับโครงสร้างโฟลเดอร์ในคอมพิวเตอร์

### 9.3.1 ตัวอย่างการออกแบบ Topic ในโรงงานอุตสาหกรรม:
```text
factory/building1/lineA/machine02/telemetry/temperature
factory/building1/lineA/machine02/telemetry/vibration
factory/building1/lineA/machine02/control/relay
factory/building1/lineA/machine02/status
```

### 9.3.2 เครื่องหมายแทนค่า (Wildcards) สำหรับการ Subscribe:
Subscriber สามารถใช้ Wildcards เพื่อรับข้อมูลจากหลาย Topic พร้อมกันได้:

1. **Single-Level Wildcard (`+`):** ใช้แทนระดับชั้นใดก็ได้ **เพียง 1 ชั้น**
   - เช่น `factory/building1/+/machine02/telemetry/temperature`
   - จะรับข้อมูลจากทั้ง `lineA`, `lineB`, `lineC`
2. **Multi-Level Wildcard (`#`):** ใช้แทนระดับชั้นใดก็ได้ **ตั้งแต่ตำแหน่งนั้นลงไปทั้งหมด** (ต้องอยู่ท้ายสุดของ Topic)
   - เช่น `factory/building1/lineA/#`
   - จะรับข้อมูลทุกอย่างที่เกิดขึ้นใน `lineA` ทั้งหมด

---

## 9.4 ระดับคุณภาพการบริการ (Quality of Service: QoS)

MQTT มีกลไกรับประกันการส่งข้อมูลถึงปลายทาง 3 ระดับ (QoS Levels):

| ระดับ QoS | คำนิยาม | กลไกการทำงาน | จำนวนแพ็กเก็ต | ข้อดี / ข้อเสีย | การประยุกต์ใช้งาน |
|:---:|---|---|:---:|---|---|
| **QoS 0** | At most once<br>(ส่งได้มากที่สุด 1 ครั้ง) | Fire and forget ผู้ส่งส่งข้อความออกไปแล้วไม่รอการตอบรับ | **1 Packet**<br>(PUBLISH) | เร็วที่สุด ใช้แบนด์วิดท์น้อยที่สุด ข้อมูลอาจสูญหายได้ | การส่งค่าเซนเซอร์อุณหภูมิเป็นประจำทุก 1 วินาที |
| **QoS 1** | At least once<br>(ส่งได้อย่างน้อย 1 ครั้ง) | ผู้รับต้องส่ง `PUBACK` ยืนยัน หากผู้ส่งไม่ได้รับ จะส่งซ้ำ | **2 Packets**<br>(PUBLISH + PUBACK) | ข้อมูลไม่สูญหายแน่นอน แต่อาจได้รับข้อความซ้ำ | การส่งค่าบันทึกการทำงาน หรือการแจ้งเตือนทั่วไป |
| **QoS 2** | Exactly once<br>(ส่งถึงเพียงครั้งเดียวพอดี) | มีการยืนยันแบบ 4 ขั้นตอน (Handshake) | **4 Packets**<br>(PUBLISH + PUBREC + PUBREL + PUBCOMP) | ปลอดภัยสูงสุด ไม่ซ้ำซ้อน แต่ช้าและใช้ทรัพยากรมากที่สุด | คำสั่งสั่งหยุดเครื่องจักรฉุกเฉิน (E-Stop), ธุรกรรมการเงิน |

---

## 9.5 คุณสมบัติขั้นสูงของ MQTT

### 1) Last Will and Testament (LWT - พินัยกรรมสั่งเสีย)
เมื่อ Client เชื่อมต่อกับ Broker จะสามารถฝากข้อความ LWT ไว้ได้ (เช่น Topic: `.../status`, Payload: `offline`) หากอุปกรณ์เกิดไฟดับ สัญญาณเน็ตหลุด หรือแฮงก์กะทันหัน Broker จะตรวจพบและส่งข้อความ LWT นี้ไปยัง Subscriber ทุกคนโดยอัตโนมัติ ทำให้ระบบรู้ทันทีว่าโหนดหลุดการเชื่อมต่อ

### 2) Retained Messages (ข้อความค้างส่ง)
หาก Publisher ส่งข้อความโดยเปิด Flag **Retain = true** Broker จะบันทึกข้อความล่าสุดนั้นไว้ เมื่อมี Subscriber ตัวใหม่เพิ่งเปิดเครื่องขึ้นมาและ Subscribe หัวข้อดังกล่าว จะได้รับข้อความล่าสุดทันทีโดยไม่ต้องรอให้ Publisher ส่งรอบใหม่

### 3) Keep-Alive & Ping Mechanism
Client จะส่งแพ็กเก็ต `PINGREQ` ขนาด 2 ไบต์ไปยัง Broker ตามช่วงเวลาที่กำหนด (เช่น ทุก 60 วินาที) และ Broker จะตอบกลับด้วย `PINGRESP` เพื่อยืนยันว่าการเชื่อมต่อ TCP ยังคงมีชีวิตอยู่

---

## 9.6 ตารางเปรียบเทียบเชิงวิศวกรรม: MQTT vs HTTP

| คุณลักษณะ | MQTT | HTTP (REST) |
|---|---|---|
| **รูปแบบสถาปัตยกรรม** | Publish / Subscribe (Event-driven) | Request / Response (Client/Server) |
| **ขนาด Header ต่ำสุด** | **2 ไบต์** (ประหยัดพลังงานมาก) | **200 – 800 ไบต์** (Overhead สูง) |
| **การเชื่อมต่อเครือข่าย** | เชื่อมต่อ TCP ค้างไว้ตลอดเวลา (Keep-Alive) | เปิดและปิดการเชื่อมต่อบ่อยครั้ง |
| **การส่งข้อมูลจากคลาวด์ลงอุปกรณ์** | ส่งแบบ Push ทันที (Real-time Push) | อุปกรณ์ต้องคอย Poll ไปถามเป็นระยะ |
| **ความเหมาะสมด้านพลังงาน** | เหมาะมากสำหรับอุปกรณ์ใช้แบตเตอรี่ | สิ้นเปลืองพลังงานมากกว่า |
| **ความง่ายในการเชื่อมต่อ** | ต้องมี MQTT Broker | ต่อตรงกับ Web Server ทั่วไปได้ทันที |

</div>

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">
## 9.7 ปฏิบัติการ Wokwi Lab 10: การรับส่งข้อมูลแบบ Publish/Subscribe ด้วยโพรโทคอล MQTT

**รหัสปฏิบัติการ:** LAB-10 | **เวลาปฏิบัติการ:** 2 ชั่วโมง  
**เป้าหมายการเรียนรู้:** LLO10.1, LLO10.2 (CLO2, CLO3, CLO4)  
**เครื่องมือที่ใช้:** Wokwi Simulator, ESP32, DHT22, Relay Module, LED แสดงสถานะ, Public Broker `broker.hivemq.com`, HiveMQ Web Client

---

### 9.7.1 วัตถุประสงค์เชิงปฏิบัติการ
1. เชื่อมต่อ ESP32 เข้ากับ MQTT Broker สาธารณะ (`broker.hivemq.com`) ด้วยไลบรารี PubSubClient
2. Publish ข้อมูลอุณหภูมิและความชื้นในรูปแบบ JSON ไปยัง Topic `ksu/iot/telemetry` เป็นระยะอย่างต่อเนื่อง
3. Subscribe Topic `ksu/iot/control` เพื่อรับคำสั่งควบคุม Relay จากภายนอก และทดสอบคุณสมบัติ Retained Message กับ Last Will and Testament (LWT)

---

### 9.7.2 แผนผังการต่อวงจร (Wiring Table)

| อุปกรณ์ | ขาอุปกรณ์ | ขาบนบอร์ด ESP32 DevKit | หน้าที่ / หมายเหตุ |
|---|---|---|---|
| **DHT22 Sensor** | VCC / GND | 3V3 / GND | แหล่งจ่ายไฟและกราวด์ |
| | DATA | **GPIO 15** | สัญญาณดิจิทัลอุณหภูมิและความชื้น |
| **Relay Module** | VCC / GND | 5V / GND | ไฟเลี้ยงวงจรขับคอยล์รีเลย์ |
| | IN | **GPIO 13** | ขาสั่งงาน Relay จากคำสั่ง MQTT |
| **Status LED** | Anode (+) | **GPIO 12** | แสดงสถานะการเชื่อมต่อ MQTT |

---

### 9.7.3 ไฟล์โครงสร้างวงจร `diagram.json` สำหรับ Wokwi

```json
{
  "version": 1,
  "author": "KSU TechEngineering",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-dht22", "id": "dht1", "top": -140, "left": 120, "attrs": { "temperature": "29.4", "humidity": "62" } },
    { "type": "wokwi-relay-module", "id": "relay1", "top": 120, "left": 140, "attrs": {} },
    { "type": "wokwi-led", "id": "led1", "top": 120, "left": -80, "attrs": { "color": "green" } },
    { "type": "wokwi-resistor", "id": "r1", "top": 170, "left": -80, "attrs": { "value": "330" } }
  ],
  "connections": [
    [ "esp:3V3", "dht1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "dht1:GND", "black", [ "v0" ] ],
    [ "esp:15", "dht1:SDA", "blue", [ "v0" ] ],

    [ "esp:5V", "relay1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "relay1:GND", "black", [ "v0" ] ],
    [ "esp:13", "relay1:IN", "purple", [ "v0" ] ],

    [ "esp:12", "led1:A", "orange", [ "v0" ] ],
    [ "led1:C", "r1:1", "black", [ "v0" ] ],
    [ "r1:2", "esp:GND", "black", [ "v0" ] ]
  ],
  "dependencies": {}
}
```

---

### 9.7.4 ซอร์สโค้ดภาษา C++ (MQTT Pub/Sub ด้วยไลบรารี PubSubClient)

```cpp
/**
 * Chapter 9: ESP32 MQTT Telemetry & Remote Control Node
 * Library: PubSubClient, ArduinoJson, DHT sensor library
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// WiFi Configuration
const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASS = "";

// MQTT Broker Configuration (Public HiveMQ Broker)
const char* MQTT_BROKER = "broker.hivemq.com";
const int   MQTT_PORT   = 1883;

// Topics
const char* TOPIC_TELEMETRY = "ksu/eng/machine01/telemetry";
const char* TOPIC_CONTROL   = "ksu/eng/machine01/control";
const char* TOPIC_STATUS    = "ksu/eng/machine01/status";

#define DHTPIN 15
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define RELAY_PIN 13
#define LED_STATUS_PIN 12

WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 3000; // ส่งข้อมูลทุก 3 วินาที

// Callback Function: ทำงานอัตโนมัติเมื่อมีข้อความเข้ามาใน Topic ที่ Subscribe ไว้
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.printf("\n[MQTT Callback] Message arrived on topic: %s\n", topic);
  
  // แปลง Payload เป็น String
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("[MQTT Callback] Payload: ");
  Serial.println(message);

  // แกะข้อมูล JSON คำสั่งควบคุม
  JsonDocument doc;
  DeserializationError err = deserializeJson(doc, message);
  if (!err) {
    if (doc.containsKey("relay")) {
      bool relayCmd = doc["relay"];
      digitalWrite(RELAY_PIN, relayCmd ? HIGH : LOW);
      Serial.printf("[ACTION] Relay state updated to: %s\n", relayCmd ? "ON" : "OFF");
    }
  } else {
    // รองรับคำสั่งข้อความธรรมดา "ON" / "OFF"
    if (message == "ON" || message == "1") {
      digitalWrite(RELAY_PIN, HIGH);
      Serial.println("[ACTION] Relay turned ON via plain text command");
    } else if (message == "OFF" || message == "0") {
      digitalWrite(RELAY_PIN, LOW);
      Serial.println("[ACTION] Relay turned OFF via plain text command");
    }
  }
}

void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("[MQTT] Attempting connection to broker...");
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);

    // กำหนด Last Will and Testament (LWT)
    // หากบอร์ดดับกะทันหัน Broker จะ Publish "offline" อัตโนมัติ
    if (mqttClient.connect(clientId.c_str(), TOPIC_STATUS, 1, true, "offline")) {
      Serial.println("CONNECTED!");
      digitalWrite(LED_STATUS_PIN, HIGH);

      // ประกาศสถานะว่าบอร์ดออนไลน์ (Retained = true)
      mqttClient.publish(TOPIC_STATUS, "online", true);

      // Subscribe หัวข้อรับคำสั่งควบคุม
      mqttClient.subscribe(TOPIC_CONTROL);
      Serial.printf("[MQTT] Subscribed to topic: %s\n", TOPIC_CONTROL);
    } else {
      Serial.printf("FAILED, rc=%d. Retrying in 2 seconds...\n", mqttClient.state());
      digitalWrite(LED_STATUS_PIN, LOW);
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_STATUS_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LED_STATUS_PIN, LOW);

  dht.begin();

  // 1. เชื่อมต่อ WiFi
  Serial.print("[WIFI] Connecting to ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[WIFI] Connected!");

  // 2. ตั้งค่า MQTT Client
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
}

void loop() {
  // รักษาการเชื่อมต่อ MQTT
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop(); // ประมวลผลข้อความเข้า-ออก

  // ส่ง Telemetry ตามช่วงเวลา (Non-blocking)
  unsigned long currentMillis = millis();
  if (currentMillis - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = currentMillis;

    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (!isnan(t) && !isnan(h)) {
      JsonDocument doc;
      doc["deviceId"] = "ESP32-MTR01";
      doc["temp"] = t;
      doc["humidity"] = h;
      doc["relay_status"] = digitalRead(RELAY_PIN) == HIGH;
      doc["uptime"] = millis() / 1000;

      String payload;
      serializeJson(doc, payload);

      // Publish ข้อมูลด้วย QoS 0
      mqttClient.publish(TOPIC_TELEMETRY, payload.c_str());
      Serial.printf("[PUBLISH -> %s] %s\n", TOPIC_TELEMETRY, payload.c_str());
    }
  }
}
```

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

## 9.8 สรุปเนื้อหาและตารางอ้างอิงทางวิศวกรรม

### 9.8.1 ตารางสรุปโค้ดสถานะข้อผิดพลาดของ PubSubClient (`state()`)

| รหัสสถานะ (`state()`) | สัญลักษณ์ (Constant) | ความหมายและสาเหตุ |
|:---:|---|---|
| **0** | `MQTT_CONNECTED` | เชื่อมต่อกับ Broker สำเร็จพร้อมใช้งาน |
| **-1** | `MQTT_CONNECT_FAILED` | ไม่สามารถต่อ TCP Socket ไปยัง IP/Port ของ Broker ได้ |
| **-2** | `MQTT_DISCONNECTED` | การเชื่อมต่อถูกตัดขาด (Connection Closed) |
| **-3** | `MQTT_CONNECT_BAD_PROTOCOL` | Broker ไม่รองรับเวอร์ชันของโพรโทคอล MQTT |
| **-4** | `MQTT_CONNECT_BAD_CLIENT_ID` | Client ID ไม่ถูกต้องหรือถูกปฏิเสธ |
| **-5** | `MQTT_CONNECT_UNAVAILABLE` | Broker ไม่พร้อมให้บริการ (Server Unavailable) |
| **-6** | `MQTT_CONNECT_BAD_CREDENTIALS` | Username หรือ Password ไม่ถูกต้อง |
| **-7** | `MQTT_CONNECT_UNAUTHORIZED` | ไม่ได้รับสิทธิ์เข้าถึง (Unauthorized Access) |

---

### 9.8.2 กฎและแนวปฏิบัติที่ดีในการตั้งชื่อ Topic (Topic Best Practices)

1. **ห้ามขึ้นต้นด้วยเครื่องหมาย `/` (Leading Slash):** เช่น `/factory/sensor` เพราะจะทำให้เกิด Topic ระดับบนสุดเป็นค่าว่าง ทำให้เปลืองหน่วยความจำบน Broker
2. **ห้ามใช้ช่องว่าง (Spaces):** ใช้ตัวพิมพ์เล็กและคั่นด้วยขีดล่างหรือขีดกลาง เช่น `vibration_rms` หรือ `temperature-c`
3. **กำหนดโครงสร้างเชิงตรรกะที่แน่นอน:** `[องค์กร]/[สถานที่]/[สายการผลิต]/[รหัสอุปกรณ์]/[ประเภทข้อมูล]`
4. **แยก Topic ระหว่าง Telemetry และ Command:**
   - ข้อมูลส่งออก: `.../telemetry`
   - ข้อมูลสั่งการ: `.../command` หรือ `.../control`
   - ข้อมูลสถานะ: `.../status`

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 9.9 โจทย์ท้าทายวิศวกรรม (Engineering Challenges)

### 🏆 โจทย์: ระบบตรวจสอบการสั่นสะเทือนมอเตอร์และสั่งหยุดฉุกเฉินระยะไกล (E-Stop over MQTT)

โรงงานต้องการพัฒนาระบบ IoT ป้องกันมอเตอร์สายพานลำเลียงเสียหาย โดยให้บอร์ด ESP32 ควบคุมรีเลย์และรายงานข้อมูลผ่าน MQTT:

#### เงื่อนไขการทำงาน (Specifications):
1. **การรายงานข้อมูล Telemetry:**
   - ส่งค่าอุณหภูมิและความชื้นจาก DHT22 ทุก ๆ 2 วินาที ไปยัง Topic `plant/line1/conveyor/telemetry` (QoS 0)
2. **ระบบพินัยกรรมแจ้งสถานะ (Last Will & Status):**
   - ส่งข้อความสถานะ `online` ไปยัง Topic `plant/line1/conveyor/status` (Retain = true)
   - กำหนดข้อความ LWT เป็น `offline` เพื่อให้ Broker แจ้งเตือนอัตโนมัติหากสัญญาณขาดหาย
3. **ระบบตัดการทำงานอัตโนมัติเมื่อเกิดอันตราย (Local Trip Interlock):**
   - หากตรวจพบอุณหภูมิ $T \ge 55.0^\circ	ext{C}$ ให้บอร์ดสั่งตัดการทำงานของ Relay มอเตอร์ทันที พร้อมส่งข้อความเตือนภัยฉุกเฉินไปยัง Topic `plant/line1/conveyor/alarm` ด้วย **QoS 1**
4. **ระบบสั่งหยุดฉุกเฉินจากระยะไกล (Remote E-Stop):**
   - Subscribe หัวข้อ `plant/line1/conveyor/command`
   - หากได้รับคำสั่ง `{"cmd":"EMERGENCY_STOP"}` ให้สั่งดับรีเลย์ทันทีภายในเวลาไม่เกิน $100	ext{ ms}$

#### สิ่งที่ต้องส่งและประเมินผล:
- [ ] ซอร์สโค้ดภาษา C++ ที่มีฟังก์ชันการทำงานครบตามเงื่อนไข
- [ ] แผนผังการต่อวงจรและไฟล์ `diagram.json` บน Wokwi
- [ ] ภาพบันทึกหน้าจอการทดสอบการส่งคำสั่ง Remote E-Stop ผ่าน MQTT Web Client (เช่น HiveMQ Web Client)

</div>
