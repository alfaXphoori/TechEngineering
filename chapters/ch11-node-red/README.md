---
layout: default
title: "บทที่ 11: ระบบฐานข้อมูลและแดชบอร์ดแสดงผลท้องถิ่นด้วย Node-RED"
permalink: /chapters/ch11-node-red/
---

# Chapter 11: ระบบฐานข้อมูลและแดชบอร์ดแสดงผลท้องถิ่นด้วย Node-RED

## Local Database & Node-RED Real-time Dashboard (Edge Gateway, Flow-based Programming, MQTT Integration, UI Widgets)

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

> ### 🎯 ผลลัพธ์การเรียนรู้และการเชื่อมโยง (Constructive Alignment)
>
> - **สัปดาห์การเรียนรู้:** สัปดาห์ที่ 13 — ระบบฐานข้อมูลและแดชบอร์ดแสดงผลท้องถิ่น (Local Databases & Real-time Dashboards with Node-RED)
> - **ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs):**
>   - **CLO3:** ออกแบบและพัฒนาระบบ IoT ที่เชื่อมต่อเซนเซอร์/ตัวกระทำ สื่อสารข้อมูล และแสดงผลผ่านโปรแกรมของผู้ใช้ได้
>   - **CLO4:** ปฏิบัติการสร้าง ทดสอบ และประยุกต์ใช้ระบบ IoT พร้อมการเรียนรู้ของเครื่องเบื้องต้น และทำงานเป็นทีมอย่างรับผิดชอบ
> - **ผลลัพธ์การเรียนรู้ระดับบทเรียน (LLOs):**
>   - **LLO13.1:** เลือกชนิดกราฟและออกแบบการแสดงผลข้อมูลให้เหมาะสมกับงานวิศวกรรมได้ (CLO3)
>   - **LLO13.2:** สร้างแดชบอร์ดแสดงผลข้อมูลแบบเรียลไทม์และควบคุมอุปกรณ์ด้วย Node-RED ได้ (CLO3, CLO4)
>
---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 11.1 ความสำคัญของระบบแสดงผลท้องถิ่นและ Edge Gateway ในงานวิศวกรรม

แม้ว่าระบบคลาวด์ (Cloud Computing) จะมีความสามารถในการจัดเก็บข้อมูลระยะยาวและประมวลผลขนาดใหญ่ แต่ในสภาพแวดล้อมโรงงานอุตสาหกรรม การพึ่งพาคลาวด์เพียงอย่างเดียวมีความเสี่ยงสูง:
1. **ความต่อเนื่องในการผลิต (Operational Continuity):** หากอินเทอร์เน็ตภายนอกถูกตัดขาด ระบบควบคุมในโรงงานยังต้องสามารถทำงานและแสดงผลค่าสถานะวิกฤตได้ต่อเนื่อง 100%
2. **ความหน่วงเวลาต่ำยิ่งยวด (Zero Cloud Latency):** การตัดสินใจเพื่อความปลอดภัย (เช่น การตัดไฟเมื่อแรงสั่นสะเทือนเกินเกณฑ์) ต้องเกิดขึ้นภายในเวลาเสี้ยววินาทีในระดับเครือข่ายภายใน (LAN)
3. **ความปลอดภัยและความเป็นส่วนตัวของข้อมูล (Data Sovereignty):** ข้อมูลกระบวนการผลิตบางประเภทเป็นความลับทางการค้าที่ห้ามส่งออกนอกเครือข่ายโรงงาน

ดังนั้น วิศวกรจึงนิยมติดตั้ง **Edge Gateway** หรือเครื่องคอมพิวเตอร์แม่ข่ายขนาดเล็ก (เช่น Raspberry Pi หรือ Industrial IPC) ภายในโรงงาน เพื่อรันระบบรับส่งข้อมูลและแดชบอร์ดแสดงผลท้องถิ่นด้วย **Node-RED**

---

## 11.2 สถาปัตยกรรมและการทำงานของ Node-RED

**Node-RED** คือเครื่องมือพัฒนาซอฟต์แวร์แบบ **Flow-based Programming** ที่พัฒนาขึ้นโดย IBM Emerging Technology ทำงานอยู่บน Node.js Runtime:

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  mqtt in     │ ──────► │   function   │ ──────► │   ui_gauge   │
│ (Input Node) │ [msg]   │ (Processing) │ [msg]   │ (Output UI)  │
└──────────────┘         └──────────────┘         └──────────────┘
```

### 11.2.1 โครงสร้างของอ็อบเจกต์ข้อความ (Message Object: `msg`)
ข้อมูลที่ไหลผ่านสายเชื่อมต่อ (Wire) ใน Node-RED จะถูกห่อหุ้มอยู่ในรูปของ JavaScript Object ที่ชื่อว่า `msg` ซึ่งมีคุณสมบัติหลักดังนี้:
- **`msg.payload`:** เนื้อหาข้อมูลหลัก (Payload) อาจเป็นตัวเลข, ข้อความ (String), หรือ JSON Object
- **`msg.topic`:** หัวข้อของข้อมูล เช่น `factory/line1/temp`
- **`msg._msgid`:** รหัสประจำตัวเฉพาะของข้อความแต่ละชิ้นที่สร้างขึ้นโดยระบบ

---

## 11.3 โหนดพื้นฐานที่สำคัญใน Node-RED

### 1) โหนดกลุ่ม Input / Output
- **`inject`:** จำลองการส่งข้อมูลเข้าสู่ Flow ตามจังหวะเวลาหรือเมื่อกดปุ่ม เหมาะสำหรับการทดสอบ (Debug)
- **`debug`:** แสดงผลค่าของ `msg.payload` ออกทางหน้าต่าง Debug Sidebar ด้านขวา
- **`mqtt in`:** รับข้อมูลแบบ Real-time จาก MQTT Broker เมื่อมีข้อความเข้ามาใน Topic ที่กำหนด
- **`mqtt out`:** ส่งข้อมูลจาก Flow ไปยัง MQTT Broker ไปยัง Topic ปลายทาง
- **`http in` / `http response`:** สร้าง REST API Endpoint บน Node-RED เพื่อรับคำร้องจากอุปกรณ์ภายนอก

### 2) โหนดกลุ่ม Function & Logic
- **`function`:** เขียนโค้ดภาษา JavaScript เพื่อคำนวณสูตรทางวิศวกรรม แยกข้อมูล หรือแปลงโครงสร้าง JSON
- **`switch`:** กระจายทิศทางของข้อความตามเงื่อนไข (เช่น ถ้าอุณหภูมิ > 50 ให้ส่งออกขาที่ 1 ถ้าปกติส่งออกขาที่ 2)
- **`change`:** แก้ไข เปลี่ยนแปลง หรือลบค่าใน `msg.payload` หรือ `msg.topic`
- **`range`:** ปรับสเกลค่าตัวเลขเชิงเส้น (เหมือนฟังก์ชัน `map()` ใน Arduino) เช่น แปลงค่า $0-4095 
ightarrow 0.0-100.0\%$

---

## 11.4 การออกแบบแดชบอร์ดด้วย `node-red-dashboard`

โมดูล `node-red-dashboard` ช่วยให้วิศวกรสร้างหน้าจอควบคุมสั่งการและติดตามผล (HMI/Dashboard) ในรูปแบบเว็บแอปพลิเคชันได้ทันทีโดยไม่ต้องเขียนโค้ด HTML/CSS:

| วิดเจ็ต (UI Widget) | ลักษณะการแสดงผล | การใช้งานที่เหมาะสมในงานวิศวกรรม |
|---|---|---|
| **`ui_gauge`** | มาตรวัดเข็ม / แถบระดับทรงกลม | แสดงค่าความดันบรรยากาศ (Bar), อุณหภูมิ (°C), ความเร็วรอบมอเตอร์ (RPM) |
| **`ui_chart`** | กราฟเส้นแนวโน้มแบบ Real-time | ติดตามแนวโน้มการเปลี่ยนแปลงของอุณหภูมิหรือความสั่นสะเทือนตามเวลา |
| **`ui_text`** | กล่องข้อความและตัวเลข | แสดงสถานะเครื่องจักร เช่น `RUNNING`, `STANDBY`, `TRIPPED` |
| **`ui_switch`** | สวิตช์เปิด-ปิดแบบ Toggle | สั่งเปิด/ปิด ปั๊มน้ำ, พัดลมระบายอากาศ, หรือหลอดไฟ |
| **`ui_slider`** | แถบเลื่อนปรับค่าตัวเลข | กำหนดค่าเป้าหมาย (Setpoint) อุณหภูมิ หรือความเร็วรอบ |
| **`ui_button`** | ปุ่มกด Trigger | ปุ่มเริ่มการทำงาน (Start), รีเซ็ตค่า (Reset), หรือหยุดฉุกเฉิน (E-Stop) |
| **`ui_audio`** | สัญญาณเสียงเตือนภัย (Audio Alert) | เล่นเสียงไซเรนเตือนภัยผ่านลำโพงของเครื่องคอมพิวเตอร์ควบคุม |

---

## 11.5 หลักการเลือกชนิดกราฟสำหรับการแสดงภาพข้อมูลทางวิศวกรรม

```
                    ┌─────────────────────────┐
                    │ ต้องการแสดงข้อมูลแบบใด? │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ การเปลี่ยนแปลง   │    │ ค่าปัจจุบัน      │    │ สถานะตรรกะ      │
│ ตามเวลา (Trend)  │    │ ทันที (Instant)  │    │ (State/Discrete) │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         ▼                       ▼                       ▼
    [ ui_chart ]            [ ui_gauge ]            [ ui_text ]
  (Real-time Line)      (Dial/Gauge Meter)      (Colored Status)
```

1. **ข้อมูลอนุกรมเวลา (Time-Series / Trends):** ใช้ **Line Chart** พร้อมกำหนด Time Window เช่น ย้อนหลัง 15 นาที หรือ 1 ชั่วโมง เพื่อดูอัตราการเพิ่มขึ้นของความร้อน
2. **ข้อมูลสภาวะปัจจุบัน (Instantaneous Values):** ใช้ **Gauge** พร้อมกำหนดช่วงสีแถบเตือน (เขียว = ปกติ, เหลือง = เตือน, แดง = อันตราย)
3. **สถานะการทำงาน (Operating State):** ใช้ **Status Badge / Text** ที่เปลี่ยนสีพื้นหลังตามสถานะ

</div>

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">

## 11.6 การทดลองและจำลองวงจรบน Wokwi + Node-RED

การทดลองนี้จำลองบอร์ด ESP32 อ่านค่าเซนเซอร์และส่งข้อมูลผ่าน MQTT ไปแสดงผลบน Node-RED Dashboard พร้อมรับคำสั่งควบคุมสวิตช์จากหน้าจอ Node-RED

### 11.6.1 แผนผังการเชื่อมต่อวงจร (Wiring Table)

| อุปกรณ์ | ขาอุปกรณ์ | ขาบนบอร์ด ESP32 | หน้าที่ / หมายเหตุ |
|---|---|---|---|
| **DHT22** | DATA | **GPIO 15** | อุณหภูมิและความชื้น |
| **Potentiometer (Speed)** | SIG | **GPIO 34** | จำลองความเร็วรอบปั๊ม (0-3000 RPM) |
| **Relay Module** | IN | **GPIO 13** | สั่งงานปั๊มน้ำ (Pump Driver) |
| **Status LED** | Anode (+) | **GPIO 12** | ไฟแสดงสถานะ Alarm |

---

### 11.6.2 โค้ดโปรแกรม Arduino C++ สำหรับ ESP32 Node

```cpp
/**
 * Chapter 11: ESP32 Node for Node-RED Local Dashboard
 * Protocol: MQTT (HiveMQ Public Broker)
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASS = "";

const char* MQTT_BROKER = "broker.hivemq.com";
const int   MQTT_PORT   = 1883;

// กำหนด Topics สำหรับคุยกับ Node-RED
const char* TOPIC_TELEMETRY = "ksu/nodered/telemetry";
const char* TOPIC_CONTROL   = "ksu/nodered/control";

#define DHTPIN 15
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define POT_PIN 34
#define RELAY_PIN 13
#define LED_PIN 12

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastSend = 0;

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (unsigned int i = 0; i < length; i++) message += (char)payload[i];
  
  Serial.printf("[COMMAND FROM NODE-RED] Topic: %s | Payload: %s
", topic, message.c_str());

  JsonDocument doc;
  if (!deserializeJson(doc, message)) {
    if (doc.containsKey("pump")) {
      bool pumpState = doc["pump"];
      digitalWrite(RELAY_PIN, pumpState ? HIGH : LOW);
      Serial.printf("[ACTUATOR] Pump Relay set to: %s
", pumpState ? "ON" : "OFF");
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("[MQTT] Connecting to Node-RED Broker...");
    String cid = "ESP32-NodeRED-" + String(random(0xffff), HEX);
    if (client.connect(cid.c_str())) {
      Serial.println("CONNECTED!");
      client.subscribe(TOPIC_CONTROL);
    } else {
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LED_PIN, LOW);

  dht.begin();
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(300);

  client.setServer(MQTT_BROKER, MQTT_PORT);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  if (millis() - lastSend >= 2000) {
    lastSend = millis();

    float temp = dht.readTemperature();
    float humid = dht.readHumidity();
    int rawPot = analogRead(POT_PIN);
    int rpm = map(rawPot, 0, 4095, 0, 3000); // 0 - 3000 RPM

    if (!isnan(temp) && !isnan(humid)) {
      JsonDocument doc;
      doc["temp"] = temp;
      doc["humid"] = humid;
      doc["rpm"] = rpm;
      doc["pump_running"] = digitalRead(RELAY_PIN) == HIGH;

      String payload;
      serializeJson(doc, payload);
      client.publish(TOPIC_TELEMETRY, payload.c_str());
    }
  }
}
```

---

### 11.6.3 ไฟล์ Exportable Node-RED Flow JSON (พร้อม Import ใช้งานได้ทันที)

คัดลอก JSON ด้านล่างนี้ไปที่เมนู **Import** บนโปรแกรม Node-RED เพื่อสร้างแดชบอร์ดทันที:

```json
[
  {
    "id": "tab_ch11_dashboard",
    "type": "tab",
    "label": "Industrial Chiller Dashboard",
    "disabled": false,
    "info": "Dashboard for Chapter 11 IoT Engineering"
  },
  {
    "id": "mqtt_in_telemetry",
    "type": "mqtt in",
    "z": "tab_ch11_dashboard",
    "name": "Receive Telemetry",
    "topic": "ksu/nodered/telemetry",
    "qos": "0",
    "datatype": "json",
    "broker": "hivemq_broker",
    "nl": false,
    "rap": true,
    "rh": 0,
    "x": 150,
    "y": 140,
    "wires": [["fn_split_data", "debug_telemetry"]]
  },
  {
    "id": "fn_split_data",
    "type": "function",
    "z": "tab_ch11_dashboard",
    "name": "Parse Sensor Metrics",
    "func": "var tempMsg = { payload: msg.payload.temp };
var humidMsg = { payload: msg.payload.humid };
var rpmMsg = { payload: msg.payload.rpm };
var pumpMsg = { payload: msg.payload.pump_running ? 'RUNNING' : 'STOPPED' };
return [tempMsg, humidMsg, rpmMsg, pumpMsg];",
    "outputs": 4,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 380,
    "y": 140,
    "wires": [
      ["ui_gauge_temp", "ui_chart_temp"],
      ["ui_gauge_humid"],
      ["ui_gauge_rpm"],
      ["ui_text_status"]
    ]
  },
  {
    "id": "ui_gauge_temp",
    "type": "ui_gauge",
    "z": "tab_ch11_dashboard",
    "name": "Temperature Gauge",
    "group": "group_metrics",
    "order": 1,
    "width": 6,
    "height": 4,
    "gtype": "gage",
    "title": "Chiller Temp (°C)",
    "label": "°C",
    "format": "{{value}}",
    "min": 0,
    "max": 60,
    "colors": ["#00B500", "#E6E600", "#CA3838"],
    "seg1": "35",
    "seg2": "45",
    "x": 640,
    "y": 80,
    "wires": []
  },
  {
    "id": "ui_chart_temp",
    "type": "ui_chart",
    "z": "tab_ch11_dashboard",
    "name": "Temp Trend Chart",
    "group": "group_trends",
    "order": 1,
    "width": 12,
    "height": 5,
    "label": "Temperature Trend Line",
    "chartType": "line",
    "legend": "false",
    "xformat": "HH:mm:ss",
    "interpolate": "linear",
    "nodata": "Waiting for data...",
    "dot": false,
    "ymin": "15",
    "ymax": "55",
    "removeOlder": 15,
    "removeOlderPoints": "",
    "removeOlderUnit": "60",
    "cutout": 0,
    "useOneColor": false,
    "useUTC": false,
    "colors": ["#1f77b4", "#aec7e8", "#ff7f0e"],
    "outputs": 1,
    "x": 630,
    "y": 140,
    "wires": [[]]
  }
]
```

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

## 11.7 สรุปเนื้อหาและตารางอ้างอิงทางวิศวกรรม

### 11.7.1 โค้ดตัวอย่าง JavaScript สำเร็จรูปสำหรับ Function Node

#### 1) การคำนวณค่าเฉลี่ยเคลื่อนที่ (Moving Average Filter):
```javascript
// เก็บค่าก่อนหน้าไว้ใน context
var buffer = context.get('buffer') || [];
buffer.push(msg.payload);

if (buffer.length > 10) {
  buffer.shift(); // เก็บเพียง 10 ค่าล่าสุด
}
context.set('buffer', buffer);

// คำนวณค่าเฉลี่ย
var sum = buffer.reduce((a, b) => a + b, 0);
msg.payload = parseFloat((sum / buffer.length).toFixed(2));
return msg;
```

#### 2) การตรวจสอบเงื่อนไขและเปลี่ยนสีข้อความแจ้งเตือน:
```javascript
if (msg.payload.temp > 45.0) {
  msg.color = "red";
  msg.payload = "OVERHEAT ALARM!";
} else {
  msg.color = "green";
  msg.payload = "NORMAL OPERATION";
}
return msg;
```

---

### 11.7.2 ข้อควรระวังในการติดตั้งระบบ Node-RED ในโรงงาน
1. **การตั้งรหัสผ่านความปลอดภัย (Admin Authentication):** ต้องเปิดใช้งาน `adminAuth` ในไฟล์ `settings.js` เพื่อป้องกันผู้ไม่หวังดีเข้ามาแก้ไข Flow
2. **การจัดการหน่วยความจำของ Chart:** กำหนด `removeOlder` บน `ui_chart` ไม่ให้เก็บข้อมูลนานเกินไป (เช่น ไม่เกิน 1 ชั่วโมง) เพื่อป้องกันแรมบนเครื่องเกตเวย์เต็ม

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 11.8 โจทย์ท้าทายวิศวกรรม (Engineering Challenges)

### 🏆 โจทย์: แดชบอร์ดตรวจสอบและตัดการทำงานอัตโนมัติสถานีสูบน้ำหล่อเย็น (Chilled Water Pump Station)

โรงงานผลิตพลังงานต้องการระบบ Local Monitoring สำหรับปั๊มน้ำหล่อเย็นขนาด 75 kW:

#### เงื่อนไขการทำงาน (Specifications):
1. **หน้าจอ Node-RED Dashboard:**
   - ติดตั้ง Gauge มาตรวัดความเร็วรอบปั๊ม ($0-3000	ext{ RPM}$)
   - ติดตั้ง Real-time Chart แสดงแนวโน้มอุณหภูมิย้อนหลัง 10 นาที
   - มีปุ่มสวิตช์ Toggle สั่ง `PUMP ON/OFF` จากหน้าเว็บ
2. **ระบบตัดการทำงานอัตโนมัติ (Automated Trip Logic):**
   - หากอุณหภูมิน้ำหล่อเย็นสูงเกิน $48.0^\circ	ext{C}$ ติดต่อกันนานกว่า 5 วินาที ให้ Flow ใน Node-RED ส่งคำสั่ง MQTT ไปสั่งดับปั๊มทันที
   - แสดงกล่องข้อความเตือนภัยสีแดงบน Dashboard และส่งเสียงไซเรนผ่าน `ui_audio`

#### สิ่งที่ต้องส่งและประเมินผล:
- [ ] ไฟล์ Exported Flow JSON จาก Node-RED
- [ ] ซอร์สโค้ด ESP32 C++ ที่ทำงานร่วมกับแดชบอร์ด
- [ ] ภาพบันทึกหน้าจอแดชบอร์ดขณะทำงานปกติ และขณะเกิดสภาวะ Trip

</div>
