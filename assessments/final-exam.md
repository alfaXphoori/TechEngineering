# 📝 ตัวอย่างข้อสอบปลายภาค — เทคโนโลยีดิจิทัลสำหรับวิศวกรรม

| รายการ | รายละเอียด |
|---|---|
| **รายวิชา** | เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering) |
| **หลักสูตร** | วิศวกรรมเครื่องกล ชั้นปีที่ 1 |
| **ครอบคลุมเนื้อหา** | สัปดาห์ที่ 9–15 (บทที่ 7–10: HTTP/REST, MQTT, Cloud/ThingsBoard, Data Visualization, ML) |
| **CLO ที่ประเมิน** | CLO2 และ CLO3 |
| **คะแนนเต็ม** | 100 คะแนน (สัดส่วน 25% ของคะแนนรวม) |
| **เวลาสอบ** | 2 ชั่วโมง 30 นาที (150 นาที) |

> **คำชี้แจง:** อนุญาตให้ดูกระดาษสูตร 1 หน้า A4 (เขียนเอง) ไม่อนุญาตใช้อินเทอร์เน็ตหรืออุปกรณ์อิเล็กทรอนิกส์ระหว่างสอบ

---

## ส่วน ก — ปรนัย (Multiple Choice)

**(12 ข้อ × 2.5 คะแนน = 30 คะแนน)** — เลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว

*ครอบคลุม: LLO9.1, LLO10.1, LLO11.1, LLO13.1, LLO15.1 | CLO2*

---

**ข้อ 1.** HTTP Method ใดที่เหมาะสมที่สุดสำหรับการส่งข้อมูลเซนเซอร์ใหม่ขึ้นไปยัง REST API เซิร์ฟเวอร์

ก. GET — ดึงข้อมูลจากเซิร์ฟเวอร์  
ข. DELETE — ลบข้อมูลออกจากเซิร์ฟเวอร์  
ค. POST — ส่งข้อมูลใหม่ขึ้นเซิร์ฟเวอร์  
ง. OPTIONS — ตรวจสอบความสามารถของเซิร์ฟเวอร์  

---

**ข้อ 2.** ในรูปแบบ JSON ต่อไปนี้ ข้อใดถูกต้องตามไวยากรณ์ JSON

ก. `{temperature: 85.5, unit: 'Celsius'}`  
ข. `{"temperature": 85.5, "unit": "Celsius"}`  
ค. `{temperature = 85.5, unit = "Celsius"}`  
ง. `["temperature" = 85.5, "unit" = "Celsius"]`  

---

**ข้อ 3.** MQTT แตกต่างจาก HTTP ในแง่ของสถาปัตยกรรมการสื่อสารอย่างไร

ก. MQTT ใช้ Client/Server model เหมือน HTTP แต่เร็วกว่า  
ข. MQTT ใช้ Publish/Subscribe model ผ่าน Broker ไม่ต้องสื่อสารตรงระหว่างอุปกรณ์  
ค. MQTT ต้องการ IP address ของปลายทางเสมอ เหมือนกับ HTTP  
ง. MQTT ไม่สามารถส่งข้อมูลแบบ real-time ได้ต้องรอ polling  

---

**ข้อ 4.** Topic ของ MQTT ที่ ESP32 ใช้ส่งข้อมูล telemetry ไปยัง ThingsBoard Cloud คือข้อใด

ก. `thingsboard/device/telemetry`  
ข. `v1/devices/me/telemetry`  
ค. `iot/sensor/data/upload`  
ง. `mqtt/publish/thingsboard/sensor`  

---

**ข้อ 5.** QoS Level 1 ใน MQTT หมายความว่าอย่างไร

ก. ส่งข้อความครั้งเดียว ไม่มีการยืนยัน — อาจสูญหายได้  
ข. ข้อความถูกส่งถึงอย่างน้อย 1 ครั้ง — อาจได้รับซ้ำ  
ค. ข้อความถูกส่งถึงพอดี 1 ครั้ง — มีการตรวจสอบสองชั้น  
ง. ข้อความถูกส่งพร้อมกันหลายเส้นทาง เพื่อความน่าเชื่อถือสูงสุด  

---

**ข้อ 6.** บริการคลาวด์แบบ PaaS (Platform as a Service) แตกต่างจาก SaaS (Software as a Service) อย่างไร

ก. PaaS ผู้ใช้ต้องดูแล Hardware และ OS เอง แต่ SaaS ดูแลให้หมด  
ข. PaaS ให้ platform พัฒนา/รัน application แต่ SaaS ให้ซอฟต์แวร์พร้อมใช้งาน  
ค. PaaS ถูกกว่า SaaS เสมอ เพราะไม่รวม application layer  
ง. PaaS ใช้สำหรับเก็บข้อมูลเท่านั้น ไม่สามารถประมวลผลได้  

---

**ข้อ 7.** ThingsBoard Cloud จัดเป็น Cloud Service Model ประเภทใดสำหรับนักพัฒนา IoT

ก. IaaS — ให้ใช้ virtual machine เขียนระบบเอง  
ข. PaaS — ให้แพลตฟอร์ม IoT สำเร็จรูป (device management, dashboard, telemetry)  
ค. SaaS — ซอฟต์แวร์สำเร็จรูปที่ผู้ใช้ทั่วไปใช้งานโดยไม่ต้องเขียนโค้ด  
ง. FaaS — Function as a Service รันโค้ดเฉพาะส่วนที่ต้องการ  

---

**ข้อ 8.** สำหรับการแสดงข้อมูลอุณหภูมิมอเตอร์ในช่วง 24 ชั่วโมงที่ผ่านมา ชนิดกราฟใดเหมาะสมที่สุด

ก. Pie Chart (กราฟวงกลม) — แสดงสัดส่วนของแต่ละช่วงอุณหภูมิ  
ข. Bar Chart (กราฟแท่ง) — เปรียบเทียบอุณหภูมิระหว่างมอเตอร์หลายตัว  
ค. Line Chart (กราฟเส้น) — แสดงแนวโน้มอุณหภูมิตามเวลา  
ง. Scatter Plot — แสดงความสัมพันธ์ระหว่างอุณหภูมิและความดัน  

---

**ข้อ 9.** Node-RED ใช้รับข้อมูลจาก ESP32 ผ่าน MQTT แล้วแสดงบนแดชบอร์ด — Node ลำดับใดถูกต้อง

ก. `mqtt in` → `json` → `ui_chart`  
ข. `ui_chart` → `json` → `mqtt in`  
ค. `mqtt out` → `ui_chart` → `json`  
ง. `inject` → `mqtt in` → `ui_chart`  

---

**ข้อ 10.** การเรียนรู้ของเครื่องแบบ "Supervised Learning" (การเรียนรู้แบบมีผู้สอน) หมายความว่าอย่างไร

ก. มีผู้เชี่ยวชาญคอยดูแลและแก้ไขโมเดลทุกขั้นตอน  
ข. ฝึกโมเดลจากข้อมูลที่มี label กำกับไว้แล้ว (input → output ที่ถูกต้อง)  
ค. โมเดลเรียนรู้โดยการทดลองและรับรางวัล/บทลงโทษจากสภาพแวดล้อม  
ง. โมเดลหาความสัมพันธ์จากข้อมูลที่ไม่มี label โดยอัตโนมัติ  

---

**ข้อ 11.** ขั้นตอน ML Pipeline ที่ถูกต้องสำหรับสร้างโมเดลจำแนกสภาพเครื่องจักร (ปกติ/ผิดปกติ) คือข้อใด

ก. เก็บข้อมูล → สร้างโมเดล → ติด label → ฝึก → ทดสอบ  
ข. เก็บข้อมูล → ทำความสะอาด/ติด label → แยก train/test → ฝึกโมเดล → ประเมินผล  
ค. สร้างโมเดล → เก็บข้อมูล → ฝึก → ติด label → deploy  
ง. ทดสอบ → ฝึก → เก็บข้อมูล → ประเมินผล → ติด label  

---

**ข้อ 12.** TinyML หรือ Edge AI ต่างจาก Cloud ML อย่างไร

ก. TinyML ใช้ GPU ขนาดใหญ่กว่า Cloud ML เพื่อประมวลผลที่เร็วกว่า  
ข. TinyML รันโมเดล ML บนอุปกรณ์ขนาดเล็ก (ESP32/microcontroller) โดยไม่ต้องส่งข้อมูลไปคลาวด์  
ค. TinyML ใช้อินเทอร์เน็ตความเร็วสูงส่งข้อมูลไปประมวลผลบน server  
ง. TinyML เหมาะสำหรับฝึกโมเดลใหม่เท่านั้น ไม่ใช่สำหรับ inference  

---

## ส่วน ข — อัตนัยสั้น (Short Answer)

**(5 ข้อ × 6 คะแนน = 30 คะแนน)** — ตอบอธิบายให้ชัดเจน

*ครอบคลุม: LLO9.1, LLO10.1, LLO11.1, LLO13.1, LLO15.1 | CLO2, CLO3*

---

**ข้อ 13.** อธิบายความแตกต่างระหว่าง HTTP/REST กับ MQTT ในด้าน (ก) รูปแบบการสื่อสาร (ข) ความเหมาะสมกับ IoT ระบุว่าควรเลือกใช้โพรโทคอลใดในสถานการณ์ใด

*(6 คะแนน: HTTP 2 คะแนน, MQTT 2 คะแนน, การเลือกใช้ตามสถานการณ์ 2 คะแนน)*

---

**ข้อ 14.** อธิบายว่า "ฐานข้อมูล Time-Series" คืออะไร และทำไม ThingsBoard จึงใช้ฐานข้อมูลประเภทนี้สำหรับข้อมูล IoT แทนฐานข้อมูลเชิงสัมพันธ์ทั่วไป (Relational Database)

*(6 คะแนน: นิยาม time-series DB 2 คะแนน, คุณลักษณะพิเศษ 2 คะแนน, เหตุผลที่เลือกใช้ 2 คะแนน)*

---

**ข้อ 15.** หลักการออกแบบแดชบอร์ด IoT ที่ดีสำหรับวิศวกรในห้องควบคุมโรงงาน ควรคำนึงถึงปัจจัยอะไรบ้าง อย่างน้อย 4 ปัจจัย พร้อมอธิบายสั้นๆ

*(6 คะแนน: ปัจจัยละ 1.5 คะแนน × 4 = 6 คะแนน)*

---

**ข้อ 16.** "ThingsBoard RPC (Remote Procedure Call)" คืออะไร อธิบายว่า ESP32 รับคำสั่ง RPC จาก ThingsBoard dashboard ได้อย่างไร และยกตัวอย่างการใช้งานในระบบควบคุมปั๊มน้ำ

*(6 คะแนน: นิยาม RPC 2 คะแนน, กลไกการทำงาน 2 คะแนน, ตัวอย่าง 2 คะแนน)*

---

**ข้อ 17.** อธิบายความแตกต่างระหว่าง Supervised Learning และ Unsupervised Learning พร้อมยกตัวอย่างการประยุกต์ใช้กับข้อมูลเซนเซอร์ในงานวิศวกรรมเครื่องกลสำหรับแต่ละประเภท

*(6 คะแนน: Supervised 2 คะแนน + ตัวอย่าง 1 คะแนน, Unsupervised 2 คะแนน + ตัวอย่าง 1 คะแนน)*

---

## ส่วน ค — คำนวณ วิเคราะห์ และออกแบบ (Analysis & Design)

**(3 ข้อ × 10 คะแนน = 30 คะแนน)** — แสดงวิธีทำหรือเหตุผลประกอบ

*ครอบคลุม: LLO9.2, LLO10.2, LLO12.1, LLO13.1, LLO14.1 | CLO2, CLO3*

---

**ข้อ 18.** ระบบตรวจสอบสภาพหม้อต้มไอน้ำ (Boiler Monitoring) ส่งข้อมูลเซนเซอร์ 3 ตัวพร้อมกัน ได้แก่ อุณหภูมิน้ำ (°C), ความดัน (bar), และสถานะ Burner (เปิด/ปิด) ผ่าน MQTT ไปยัง ThingsBoard

**(ก)** เขียน JSON payload ที่ถูกต้องสำหรับส่งข้อมูลนี้ โดยสมมติว่าอ่านค่าได้: อุณหภูมิ 185.5°C, ความดัน 8.2 bar, Burner เปิด (true) (3 คะแนน)

**(ข)** ออกแบบโครงสร้าง MQTT Topic ที่เหมาะสมสำหรับโรงงานที่มีหม้อต้ม 3 ตัว (boiler_01, boiler_02, boiler_03) โดยแต่ละตัวส่งข้อมูล telemetry และรับคำสั่งควบคุม (command) — แสดง topic ตัวอย่างอย่างน้อย 4 topic (4 คะแนน)

**(ค)** เซนเซอร์วัดอุณหภูมิส่งข้อมูลทุก 5 วินาที เป็นเวลา 24 ชั่วโมง ถามว่ามีจุดข้อมูลทั้งหมดกี่จุด และถ้าจุดข้อมูลแต่ละจุดมีขนาด 50 bytes จะใช้พื้นที่เก็บข้อมูลทั้งหมดเท่าไร (เป็น KB) (3 คะแนน)

---

**ข้อ 19.** ระบบ Dashboard ติดตามสายพานลำเลียง (Conveyor Belt) ในโรงงานประกอบรถยนต์ ต้องการแสดงข้อมูลต่อไปนี้:

| ข้อมูล | ลักษณะ | ความถี่ update |
|---|---|---|
| อุณหภูมิมอเตอร์ขับสายพาน | ค่าต่อเนื่อง 60–120°C | ทุก 10 วินาที |
| จำนวนชิ้นงานที่ผ่าน | ค่าสะสมต่อชั่วโมง | ทุก 1 นาที |
| สถานะสายพาน | เดิน/หยุด/ผิดปกติ | ทันทีเมื่อเปลี่ยน |
| ค่าเฉลี่ยอุณหภูมิรายชั่วโมง (24 ชม.) | แนวโน้มย้อนหลัง | ทุก 1 ชั่วโมง |
| สัดส่วนเวลาการทำงาน vs หยุด | เปอร์เซ็นต์ต่อกะงาน | ทุก 8 ชั่วโมง |

**(ก)** เลือกชนิดกราฟ/Widget ที่เหมาะสมสำหรับแต่ละข้อมูล พร้อมอธิบายเหตุผล (5 คะแนน)

**(ข)** อธิบายหลักการจัดวาง (Layout) ที่ดีสำหรับ Dashboard นี้ — ข้อมูลใดควรอยู่ส่วนใดของหน้าจอและทำไม (5 คะแนน)

---

**ข้อ 20.** ทีมวิศวกรต้องการสร้างโมเดล ML สำหรับทำนายความผิดปกติของแบริ่งมอเตอร์ (Bearing Fault Detection) จากข้อมูลแรงสั่นสะเทือน โดยมีข้อมูลที่เก็บมาแล้ว 1,000 ตัวอย่าง แบ่งเป็น "ปกติ" 700 ตัวอย่าง และ "ผิดปกติ" 300 ตัวอย่าง

**(ก)** นี่เป็นปัญหาประเภทใดใน ML (Classification/Regression/Clustering) และเป็น Supervised หรือ Unsupervised Learning (2 คะแนน)

**(ข)** อธิบาย ML Pipeline ที่เหมาะสมตั้งแต่ต้นจนจบ ระบุสัดส่วน train/test set ที่ควรแบ่ง (4 คะแนน)

**(ค)** ถ้าโมเดลที่ฝึกได้มีความถูกต้อง (Accuracy) 92% บนชุด test และต้องการ deploy บน ESP32 ควรพิจารณาปัจจัยอะไรเพิ่มเติมบ้างก่อน deploy (4 คะแนน)

---

## ส่วน ง — เขียน/อ่านโค้ด (Code Writing & Reading)

**(1 ข้อ × 10 คะแนน = 10 คะแนน)**

*ครอบคลุม: LLO9.2, LLO10.2, LLO12.1 | CLO3*

---

**ข้อ 21.** อ่านโค้ด ESP32 (Arduino/C++) ต่อไปนี้แล้วตอบคำถาม:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid       = "Factory_WiFi";
const char* password   = "eng12345";
const char* mqttServer = "mqtt.thingsboard.cloud";
const int   mqttPort   = 1883;
const char* token      = "YOUR_DEVICE_TOKEN";

WiFiClient espClient;
PubSubClient client(espClient);

const int TEMP_PIN    = 34;
const int PUMP_PIN    = 26;
float tempThreshold   = 90.0;

void callback(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<256> doc;
  deserializeJson(doc, payload, length);
  
  if (doc.containsKey("setThreshold")) {
    tempThreshold = doc["setThreshold"].as<float>();
    Serial.print("New threshold: ");
    Serial.println(tempThreshold);
  }
  
  if (doc.containsKey("pumpControl")) {
    bool state = doc["pumpControl"].as<bool>();
    digitalWrite(PUMP_PIN, state ? HIGH : LOW);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_PIN, OUTPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  client.connect("ESP32_Boiler", token, NULL);
  client.subscribe("v1/devices/me/rpc/request/+");
}

void loop() {
  client.loop();
  
  int raw = analogRead(TEMP_PIN);
  float temp = (raw / 4095.0) * 150.0;  // 0-150°C range
  
  if (temp > tempThreshold) {
    digitalWrite(PUMP_PIN, HIGH);  // เปิดปั๊มระบายความร้อน
  }
  
  StaticJsonDocument<128> telemetry;
  telemetry["temperature"] = temp;
  telemetry["pump_status"] = digitalRead(PUMP_PIN);
  
  char buffer[128];
  serializeJson(telemetry, buffer);
  client.publish("v1/devices/me/telemetry", buffer);
  
  delay(5000);
}
```

**(ก)** อธิบายภาพรวมว่าโค้ดนี้ทำงานอะไร ระบุ: แหล่งข้อมูล input, การประมวลผล, output ที่ส่งออก (3 คะแนน)

**(ข)** ฟังก์ชัน `callback()` ถูกเรียกเมื่อใด และรองรับคำสั่งอะไรบ้างจาก ThingsBoard อธิบายการทำงานของแต่ละคำสั่ง (3 คะแนน)

**(ค)** ระบุ Bug หรือ ข้อบกพร่อง อย่างน้อย 2 จุด ในโค้ดนี้ที่อาจทำให้ระบบทำงานผิดปกติหรือไม่ปลอดภัย พร้อมแนะนำวิธีแก้ไข (4 คะแนน)

---

<details>
<summary>📋 แนวเฉลยและเกณฑ์การให้คะแนน (กดเพื่อขยาย — สำหรับผู้สอนเท่านั้น)</summary>

## แนวเฉลยข้อสอบปลายภาค

### ส่วน ก — ปรนัย (เฉลย)

| ข้อ | เฉลย | อ้างอิง LLO |
|:---:|:---:|---|
| 1 | **ค** | LLO9.1 — POST ส่งข้อมูลใหม่ขึ้น server |
| 2 | **ข** | LLO9.1 — JSON ใช้ double quotes สำหรับ keys |
| 3 | **ข** | LLO10.1 — MQTT = Pub/Sub ผ่าน Broker |
| 4 | **ข** | LLO10.2 — ThingsBoard telemetry topic = `v1/devices/me/telemetry` |
| 5 | **ข** | LLO10.1 — QoS 1 = at least once (อาจซ้ำ) |
| 6 | **ข** | LLO11.1 — PaaS ให้ platform พัฒนา app, SaaS ให้ app สำเร็จรูป |
| 7 | **ข** | LLO11.1 — ThingsBoard = PaaS สำหรับ IoT |
| 8 | **ค** | LLO13.1 — Line Chart เหมาะกับข้อมูล time-series/แนวโน้ม |
| 9 | **ก** | LLO13.2 — Node-RED flow: mqtt in → json parser → ui_chart |
| 10 | **ข** | LLO15.1 — Supervised = ข้อมูลมี label |
| 11 | **ข** | LLO15.1 — ML Pipeline: เก็บ → ทำความสะอาด/label → train/test split → ฝึก → ประเมิน |
| 12 | **ข** | LLO15.1 — TinyML รัน inference บน edge device |

---

### ส่วน ข — อัตนัยสั้น (แนวเฉลย)

**ข้อ 13 — HTTP vs MQTT (6 คะแนน)**

**HTTP/REST:**
- Client/Server model — Client ส่ง request, Server ตอบ response (request-response)
- Connection ปิดหลังตอบกลับ (stateless) ต้อง polling เพื่อรับข้อมูลใหม่
- เหมาะกับ: ดึงข้อมูล (GET), ส่งข้อมูลเป็นครั้งๆ, integration กับ Web API
- Overhead header ใหญ่กว่า

**MQTT:**
- Publish/Subscribe ผ่าน Broker — ผู้ส่งและผู้รับไม่ต้องเชื่อมตรงกัน
- Connection แบบ persistent — ได้รับข้อมูลทันทีเมื่อมี publish (real-time)
- เหมาะกับ: IoT real-time monitoring, อุปกรณ์ที่มีพลังงานจำกัด, ข้อมูลที่ส่งบ่อย
- Overhead เล็กน้อย (packet ขนาดเล็ก)

**เลือกใช้:**
- HTTP: ส่งข้อมูลไม่บ่อย ต้องการ confirmation, integration กับ Web Service
- MQTT: real-time, หลายอุปกรณ์, พลังงานต่ำ, ส่งบ่อย → IoT ส่วนใหญ่เลือก MQTT

**ข้อ 14 — Time-Series Database (6 คะแนน)**
- Time-series DB คือฐานข้อมูลที่ออกแบบมาเฉพาะสำหรับข้อมูลที่มีมิติของเวลากำกับทุก record
- คุณลักษณะพิเศษ: เขียนข้อมูลได้เร็วมาก (write-optimized), บีบอัดข้อมูลที่ซ้ำกันได้ดี, query ตามช่วงเวลาเร็ว, รองรับการ downsample/aggregate อัตโนมัติ
- เหตุผลที่ IoT เลือกใช้: ข้อมูลเซนเซอร์เป็นชุดตัวเลขที่เกิดต่อเนื่องตามเวลา — ฐานข้อมูลเชิงสัมพันธ์ (MySQL, PostgreSQL) ไม่ได้ออกแบบมาสำหรับการเขียนข้อมูลซ้ำๆ ล้านรายการต่อวัน และ query ช่วงเวลาได้ช้ากว่ามาก

**ข้อ 15 — Dashboard Design Principles (6 คะแนน)**
ปัจจัยที่ควรคำนึงถึงอย่างน้อย 4 ปัจจัย (ตัวอย่าง):
1. **ลำดับความสำคัญ (Visual Hierarchy):** ข้อมูลวิกฤต (alarm, fault) ควรอยู่ตำแหน่งเด่น มองเห็นได้ทันที
2. **ความหนาแน่นของข้อมูล (Information Density):** ไม่ยัดข้อมูลมากเกินไปในหน้าเดียว แยกเป็นหน้า/panel ตามหมวดหมู่
3. **การเลือกชนิดกราฟที่ถูกต้อง:** กราฟเส้นสำหรับแนวโน้ม, gauge สำหรับค่าปัจจุบัน, ตารางสำหรับรายการ
4. **ความสม่ำเสมอ (Consistency):** ใช้สี หน่วย และ font ให้สม่ำเสมอตลอด dashboard
5. **Real-time update:** แสดงเวลาอัปเดตล่าสุดเสมอ และมีสัญลักษณ์แสดงสถานะการเชื่อมต่อ
6. **การแจ้งเตือน (Alert):** ตั้งสีเตือน (เขียว/เหลือง/แดง) ที่ชัดเจน มี threshold ที่มองเห็นได้

**ข้อ 16 — ThingsBoard RPC (6 คะแนน)**
- **RPC (Remote Procedure Call):** กลไกที่ช่วยให้ Dashboard/Server สั่งให้ ESP32 ทำงานบางอย่าง (เช่น เปิด/ปิดปั๊ม, เปลี่ยน threshold) ในทิศทาง cloud → device
- **กลไก:** ThingsBoard ส่งข้อความ JSON ผ่าน MQTT topic `v1/devices/me/rpc/request/{id}` → ESP32 ที่ subscribe topic นี้รับ payload → แปลง JSON → ดำเนินการ → (Optional) ตอบกลับผ่าน `v1/devices/me/rpc/response/{id}`
- **ตัวอย่างระบบปั๊มน้ำ:** กดปุ่ม "เปิดปั๊ม" บน Dashboard → ThingsBoard ส่ง `{"method":"setPump","params":{"state":true}}` → ESP32 รับ → `digitalWrite(PUMP_PIN, HIGH)` → ปั๊มทำงาน

**ข้อ 17 — Supervised vs Unsupervised (6 คะแนน)**
- **Supervised Learning:** ฝึกจากข้อมูลที่มี label (input + output ที่ถูกต้อง) → โมเดลเรียนรู้ mapping จาก input ไป output
  - ตัวอย่าง ME: จำแนกสภาพแบริ่ง (ปกติ/เริ่มเสื่อม/เสียหาย) จากข้อมูล vibration ที่ผ่านการ label แล้วโดยช่างซ่อมบำรุง
- **Unsupervised Learning:** หาความสัมพันธ์หรือกลุ่มในข้อมูลที่ไม่มี label — โมเดลค้นหาโครงสร้างเอง
  - ตัวอย่าง ME: Clustering ข้อมูลพลังงานมอเตอร์ เพื่อหากลุ่มรูปแบบการทำงาน (ไม่รู้ล่วงหน้าว่ามีกี่กลุ่ม)

---

### ส่วน ค — คำนวณ/วิเคราะห์ (แนวเฉลย)

**ข้อ 18 — MQTT / JSON / Time-Series (10 คะแนน)**

**(ก)** JSON payload ที่ถูกต้อง:
```json
{
  "temperature": 185.5,
  "pressure": 8.2,
  "burner_active": true
}
```
(รับแบบ flat JSON ตรงๆ หรือมี key ต่างกันเล็กน้อย ขอให้ถูก syntax JSON)

**(ข)** โครงสร้าง MQTT Topic ตัวอย่าง:
```
factory/boiler/boiler_01/telemetry
factory/boiler/boiler_02/telemetry
factory/boiler/boiler_03/telemetry
factory/boiler/boiler_01/command
factory/boiler/boiler_02/command
factory/boiler/+/telemetry    (wildcard ดูทุกตัวพร้อมกัน)
```
(ตอบอย่างน้อย 4 topic ที่มีโครงสร้างสม่ำเสมอ)

**(ค)** การคำนวณ:
- จุดข้อมูลต่อชั่วโมง = 3600 / 5 = 720 จุด
- 24 ชั่วโมง = 720 × 24 = **17,280 จุด**
- ขนาดรวม = 17,280 × 50 bytes = 864,000 bytes = **843.75 KB ≈ 844 KB**

**ข้อ 19 — Dashboard Design (10 คะแนน)**

**(ก)** ชนิดกราฟที่เหมาะสม:

| ข้อมูล | Widget ที่แนะนำ | เหตุผล |
|---|---|---|
| อุณหภูมิมอเตอร์ | Gauge / Thermometer widget | แสดงค่าปัจจุบันทันที มีขอบเขตสีเตือน |
| จำนวนชิ้นงาน/ชม. | Bar Chart หรือ Counter | เปรียบเทียบปริมาณแต่ละชั่วโมงได้ชัดเจน |
| สถานะสายพาน | Status Indicator / LED widget | สถานะแบบ discrete (3 สถานะ) มองเห็นทันที |
| อุณหภูมิเฉลี่ยรายชั่วโมง | Line Chart | แสดงแนวโน้มช่วง 24 ชม. ได้ดี |
| สัดส่วนทำงาน vs หยุด | Pie Chart / Donut Chart | แสดงสัดส่วนเปอร์เซ็นต์ได้เหมาะสม |

**(ข)** หลักการ Layout:
- ส่วนบนซ้าย/กลาง: สถานะสายพานและ Gauge อุณหภูมิ (ข้อมูล critical ที่ต้องดูทันที)
- ส่วนกลาง: Line Chart แนวโน้มอุณหภูมิ (ติดตามความผิดปกติระยะยาว)
- ส่วนขวา: Counter ชิ้นงาน (ประสิทธิภาพ production)
- ส่วนล่าง: Pie Chart สัดส่วนเวลา (สรุปผลรายกะ มองผ่านได้)
- เหตุผล: ข้อมูล critical อยู่ด้านซ้ายบน (ตาเริ่มอ่านจากซ้ายไปขวา บนลงล่าง), ข้อมูลเชิงประวัติและสรุปอยู่ด้านล่าง

**ข้อ 20 — ML Pipeline (10 คะแนน)**

**(ก)** Classification (จำแนกประเภท: ปกติ/ผิดปกติ = 2 class), Supervised Learning (มี label อยู่แล้ว)

**(ข)** ML Pipeline:
1. **เก็บและทำความสะอาดข้อมูล:** ตรวจสอบ missing values, outlier, normalize ค่า vibration
2. **Feature Engineering:** สกัด features จาก time-domain (mean, std, RMS) หรือ freq-domain (FFT)
3. **แบ่ง train/test:** 80% train (560 ปกติ + 240 ผิดปกติ), 20% test (140 ปกติ + 60 ผิดปกติ)
4. **เลือกและฝึกโมเดล:** Decision Tree / Random Forest / SVM สำหรับ classification
5. **ประเมินผลบน test set:** วัด Accuracy, Precision, Recall, F1-score

**(ค)** ปัจจัยก่อน deploy บน ESP32:
1. **Model size:** ESP32 RAM จำกัด (~520 KB) — ต้องตรวจสอบว่าโมเดลพอดี (ใช้ TensorFlow Lite / ONNX quantized)
2. **Inference time:** ต้องรันได้เร็วพอสำหรับ real-time detection (ไม่บล็อก loop หลัก)
3. **Class imbalance:** ข้อมูล 700:300 อาจทำให้ Accuracy 92% misleading — ตรวจสอบ Recall ของ class ผิดปกติ (false negative อันตรายกว่า false positive)
4. **Drift:** สภาพแบริ่งเปลี่ยนตามเวลา — ต้องวางแผน retrain โมเดลเป็นระยะ

---

### ส่วน ง — อ่านโค้ด (แนวเฉลย)

**ข้อ 21 — Code Reading (10 คะแนน)**

**(ก) ภาพรวม:**
- โค้ดเชื่อมต่อ ESP32 เข้า Wi-Fi และ ThingsBoard Cloud ผ่าน MQTT
- Input: อ่านค่าเซนเซอร์อุณหภูมิแอนะล็อก (ขา 34) แปลงเป็น °C (0–150°C)
- ประมวลผล: ถ้าอุณหภูมิ > threshold → เปิดปั๊ม (ขา 26)
- Output: ส่ง JSON telemetry (`temperature`, `pump_status`) ทุก 5 วินาที ไปยัง ThingsBoard; รับคำสั่ง RPC จาก Dashboard (`setThreshold` หรือ `pumpControl`)

**(ข) Callback Function:**
- `callback()` ถูกเรียกทุกครั้งที่มีข้อความมาถึง topic ที่ subscribe ไว้ (`v1/devices/me/rpc/request/+`)
- รองรับ 2 คำสั่ง:
  - `setThreshold`: อัปเดต tempThreshold ด้วยค่าใหม่จาก dashboard (เปลี่ยน set-point แจ้งเตือนได้จากระยะไกล)
  - `pumpControl`: สั่งเปิด (true) หรือปิด (false) ปั๊มโดยตรงจาก dashboard (Manual override)

**(ค) Bug / ข้อบกพร่อง:**

1. **ไม่มี Reconnect Logic:** ถ้า MQTT/Wi-Fi หลุด โค้ดใน `loop()` จะยังคงทำงาน แต่ `client.publish()` จะล้มเหลวเงียบๆ — ควรเพิ่ม `if (!client.connected()) reconnect();` ใน loop
2. **ปั๊มไม่ปิดอัตโนมัติ:** เมื่ออุณหภูมิลดลงต่ำกว่า threshold ปั๊มจะยังคงเปิดอยู่ (ไม่มี `else { digitalWrite(PUMP_PIN, LOW); }`) — อาจทำให้ปั๊มทำงานตลอดเวลา
3. (เพิ่มเติม) **ไม่มี error handling ใน JSON parse:** ถ้า payload ที่รับมาไม่ใช่ JSON ที่ถูกต้อง `deserializeJson()` จะ return error แต่โค้ดไม่ตรวจสอบ — ควรตรวจสอบ `DeserializationError`
4. (เพิ่มเติม) **Token เป็น plaintext ในโค้ด:** เปิดเผย token ในซอร์สโค้ดไม่ปลอดภัย ควรเก็บใน config file หรือ flash partition ที่แยกต่างหาก

*(รับคำตอบ 2 ใน 4 ข้อ ×2 คะแนน = 4 คะแนน)*

---

### ตารางสรุปการวัดผล

| ส่วน | คะแนน | CLO ที่ประเมิน | LLO หลัก |
|---|:---:|---|---|
| ก. ปรนัย (12 ข้อ) | 30 | CLO2 | LLO9.1, LLO10.1, LLO11.1, LLO13.1, LLO15.1 |
| ข. อัตนัยสั้น (5 ข้อ) | 30 | CLO2, CLO3 | LLO9.1, LLO10.1, LLO11.1, LLO13.1, LLO15.1 |
| ค. วิเคราะห์/ออกแบบ (3 ข้อ) | 30 | CLO2, CLO3 | LLO9.2, LLO10.2, LLO12.1, LLO13.1, LLO14.1 |
| ง. อ่าน/เขียนโค้ด (1 ข้อ) | 10 | CLO3 | LLO9.2, LLO10.2, LLO12.1 |
| **รวม** | **100** | **CLO2, CLO3** | |

</details>
