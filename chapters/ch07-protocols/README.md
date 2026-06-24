# Chapter 7: โพรโทคอลการสื่อสารสำหรับ IoT (HTTP/REST และ MQTT)
## Communication Protocols — HTTP/REST & MQTT

---

## 7.1 ทำไม IoT ต้องมีโพรโทคอลระดับแอป

ในบทก่อนหน้า เราเรียนรู้การเชื่อมต่อ ESP32 เข้ากับเครือข่าย Wi-Fi ซึ่งทำให้บอร์ดสามารถ "พูดคุย" ในระดับเครือข่าย (Network Layer) ได้แล้ว แต่การจะส่งข้อมูลเซ็นเซอร์ไปยังเซิร์ฟเวอร์ หรือสั่งงานอุปกรณ์จากระยะไกล เราต้องการ **โพรโทคอลระดับแอปพลิเคชัน (Application-Layer Protocol)** ที่กำหนดรูปแบบและกฎเกณฑ์ในการแลกเปลี่ยนข้อมูล

ลองนึกภาพง่าย ๆ — Wi-Fi เปรียบเสมือน "ถนน" ที่เชื่อมบ้านสองหลัง ส่วนโพรโทคอลระดับแอปคือ "ภาษา" ที่คนในบ้านทั้งสองใช้สื่อสารกัน ถ้าพูดคนละภาษาก็ไม่เข้าใจกัน

ในบทนี้เราจะเรียนรู้โพรโทคอล 2 ตัวที่สำคัญที่สุดในโลก IoT:

1. **HTTP/REST** — มาตรฐานของเว็บ เหมาะกับการร้องขอ-ตอบกลับ (Request/Response)
2. **MQTT** — โพรโทคอลน้ำหนักเบา เหมาะกับอุปกรณ์ IoT ที่มีทรัพยากรจำกัด

---

## 7.2 สถาปัตยกรรม Client/Server

ก่อนลงรายละเอียดโพรโทคอล ต้องเข้าใจแนวคิดพื้นฐานของสถาปัตยกรรม **ไคลเอนต์/เซิร์ฟเวอร์ (Client/Server)**:

- **Client (ไคลเอนต์)** — ฝ่ายที่ "ร้องขอ" บริการ เช่น ESP32 ที่ส่งค่าอุณหภูมิไปยังเซิร์ฟเวอร์
- **Server (เซิร์ฟเวอร์)** — ฝ่ายที่ "ให้บริการ" เช่น เว็บเซิร์ฟเวอร์ที่รับข้อมูลและจัดเก็บ

> 💡 **จำง่าย ๆ**: Client = คนสั่งอาหาร, Server = ร้านอาหาร — ลูกค้าสั่ง (Request) แล้วร้านเสิร์ฟ (Response)

ในโลก IoT บอร์ด ESP32 ของเรามักทำหน้าที่เป็น Client ที่ส่งข้อมูลไปยัง Cloud Server เช่น ThingsBoard, Firebase หรือ Node-RED

---

## 7.3 HTTP: Request/Response

**HTTP (HyperText Transfer Protocol)** เป็นโพรโทคอลพื้นฐานของเว็บ ทำงานแบบ **Request/Response** — ไคลเอนต์ส่งคำร้อง (Request) ไปยังเซิร์ฟเวอร์ แล้วเซิร์ฟเวอร์ตอบกลับ (Response)

### 7.3.1 HTTP Methods (เมธอดของ HTTP)

| Method | ความหมาย | ตัวอย่างการใช้งาน IoT |
|--------|----------|----------------------|
| **GET** | ดึงข้อมูล (Read) | อ่านค่าอุณหภูมิล่าสุดจากเซิร์ฟเวอร์ |
| **POST** | สร้างข้อมูลใหม่ (Create) | ส่งค่าเซ็นเซอร์ไปบันทึกบนเซิร์ฟเวอร์ |
| **PUT** | อัปเดตข้อมูลทั้งหมด (Update) | แก้ไขการตั้งค่าอุปกรณ์ |
| **DELETE** | ลบข้อมูล (Delete) | ลบล็อกข้อมูลเก่า |

### 7.3.2 HTTP Status Codes (รหัสสถานะ)

| กลุ่มรหัส | ความหมาย | ตัวอย่าง |
|----------|----------|---------|
| **2xx** | สำเร็จ (Success) | `200 OK`, `201 Created` |
| **3xx** | เปลี่ยนเส้นทาง (Redirect) | `301 Moved Permanently` |
| **4xx** | ข้อผิดพลาดฝั่งไคลเอนต์ | `400 Bad Request`, `404 Not Found` |
| **5xx** | ข้อผิดพลาดฝั่งเซิร์ฟเวอร์ | `500 Internal Server Error` |

### 7.3.3 โครงสร้างของ HTTP Message

**Request** ประกอบด้วย:
- **Request Line** — ระบุ Method, URL และเวอร์ชัน เช่น `POST /api/sensor HTTP/1.1`
- **Headers** — ข้อมูลเพิ่มเติม เช่น `Content-Type: application/json`
- **Body** — เนื้อหาข้อมูลที่ส่ง (ใช้กับ POST/PUT)

**Response** ประกอบด้วย:
- **Status Line** — เช่น `HTTP/1.1 200 OK`
- **Headers** — เช่น `Content-Length: 128`
- **Body** — ข้อมูลที่เซิร์ฟเวอร์ตอบกลับ

### 7.3.4 แผนภาพการส่ง HTTP Request และ Response
เพื่อให้เห็นภาพลำดับการทำงานที่ชัดเจน แผนภาพเคลื่อนไหวด้านล่างนี้แสดงขั้นตอนการส่งข้อมูลจาก ESP32 Client ไปยัง Web Server และการตอบกลับ

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 740 240" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .client-box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .server-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .wire-active-req { fill: none; stroke: #f59e0b; stroke-width: 2.5; stroke-dasharray: 8 4; stroke-linecap: round; animation: flowReq 3s linear infinite; }
    .wire-active-res { fill: none; stroke: #16a34a; stroke-width: 2.5; stroke-dasharray: 8 4; stroke-linecap: round; animation: flowRes 3s linear infinite; }
    .envelope-req { fill: #ffffff; stroke: #f59e0b; stroke-width: 2; rx: 3px; animation: moveReq 6s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    .envelope-res { fill: #ffffff; stroke: #16a34a; stroke-width: 2; rx: 3px; animation: moveRes 6s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    .text-main { font-size: 13px; font-weight: 700; fill: #334155; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-family: monospace; font-size: 11px; fill: #7c3aed; font-weight: bold; }
    .text-title { font-size: 14px; font-weight: 800; fill: #0f172a; }
    
    @keyframes flowReq {
      0% { stroke-dashoffset: 24; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes flowRes {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 24; }
    }
    @keyframes moveReq {
      0% { transform: translate(160px, 90px); opacity: 0; }
      5%, 35% { opacity: 1; }
      40%, 100% { transform: translate(520px, 90px); opacity: 0; }
    }
    @keyframes moveRes {
      0%, 45% { transform: translate(520px, 140px); opacity: 0; }
      50%, 80% { opacity: 1; }
      85%, 100% { transform: translate(160px, 140px); opacity: 0; }
    }
  </style>
  <rect x="5" y="5" width="730" height="230" class="bg"/>
  <text x="370" y="32" class="text-title" text-anchor="middle">การสื่อสารแบบ HTTP Request / Response (ร้องขอ - ตอบกลับ)</text>
  
  <!-- ESP32 Client Box -->
  <rect x="25" y="60" width="135" height="120" class="client-box"/>
  <text x="92.5" y="85" class="text-main" text-anchor="middle" fill="#7c3aed">ESP32 Client</text>
  <text x="92.5" y="105" class="text-sub" text-anchor="middle">ริเริ่มการเชื่อมต่อ TCP</text>
  <text x="92.5" y="125" class="text-sub" text-anchor="middle">ส่งข้อมูลตามตารางเวลา</text>
  <text x="92.5" y="150" class="text-code" text-anchor="middle">HTTP POST</text>
  
  <!-- Cloud/Server Box -->
  <rect x="580" y="60" width="135" height="120" class="server-box"/>
  <text x="647.5" y="85" class="text-main" text-anchor="middle">Web Server</text>
  <text x="647.5" y="105" class="text-sub" text-anchor="middle">(เช่น API Gateway)</text>
  <text x="647.5" y="125" class="text-sub" text-anchor="middle">รอการร้องขออย่างเดียว</text>
  <text x="647.5" y="145" class="text-sub" text-anchor="middle">ประมวลผลแล้วบันทึก</text>
  
  <!-- Connections -->
  <!-- Request Line (Top) -->
  <line x1="160" y1="100" x2="580" y2="100" class="wire"/>
  <line x1="160" y1="100" x2="580" y2="100" class="wire-active-req"/>
  <!-- Arrow top right -->
  <path d="M 572 95 L 580 100 L 572 105 Z" fill="#f59e0b"/>
  
  <!-- Response Line (Bottom) -->
  <line x1="160" y1="150" x2="580" y2="150" class="wire"/>
  <line x1="160" y1="150" x2="580" y2="150" class="wire-active-res"/>
  <!-- Arrow bottom left -->
  <path d="M 168 145 L 160 150 L 168 155 Z" fill="#16a34a"/>
  
  <!-- Message Labels -->
  <!-- Request Info -->
  <text x="370" y="85" class="text-sub" text-anchor="middle" fill="#f59e0b" font-weight="bold">HTTP Request: POST /data</text>
  <text x="370" y="118" class="text-code" text-anchor="middle" fill="#f59e0b">{"device_id":"ESP32","temp":32.5}</text>
  
  <!-- Response Info -->
  <text x="370" y="175" class="text-sub" text-anchor="middle" fill="#16a34a" font-weight="bold">HTTP Response: 200 OK</text>
  <text x="370" y="193" class="text-code" text-anchor="middle" fill="#16a34a">{"status":"success","id":128}</text>
  
  <!-- Request Envelope Icon -->
  <g class="envelope-req">
    <rect x="-15" y="-10" width="30" height="20" rx="2" />
    <path d="M -15 -10 L 0 0 L 15 -10" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
  </g>
  
  <!-- Response Envelope Icon -->
  <g class="envelope-res">
    <rect x="-15" y="-10" width="30" height="20" rx="2" />
    <path d="M -15 -10 L 0 0 L 15 -10" fill="none" stroke="#16a34a" stroke-width="1.5"/>
  </g>
  
</svg>
</div>

---

## 7.4 REST API และหลักการ

**REST (Representational State Transfer)** เป็นแนวทางในการออกแบบ API บนพื้นฐาน HTTP โดยมีหลักการสำคัญ:

1. **Resource (ทรัพยากร)** — ทุกสิ่งที่ต้องการจัดการถูกมองเป็น "ทรัพยากร" เช่น เซ็นเซอร์ อุปกรณ์ ผู้ใช้
2. **Endpoint (จุดเข้าถึง)** — URL ที่ระบุตำแหน่งของทรัพยากร เช่น `https://api.example.com/sensors/1`
3. **Stateless (ไม่เก็บสถานะ)** — แต่ละ Request จะสมบูรณ์ในตัวเอง เซิร์ฟเวอร์ไม่จำว่าไคลเอนต์เคยส่งอะไรมาก่อน
4. **ใช้ HTTP Methods** — ใช้ GET/POST/PUT/DELETE แทนการกระทำ CRUD (Create, Read, Update, Delete)

ตัวอย่าง Endpoint ในระบบ IoT:

| Endpoint | Method | ความหมาย |
|----------|--------|----------|
| `/api/sensors` | GET | ดึงรายชื่อเซ็นเซอร์ทั้งหมด |
| `/api/sensors` | POST | เพิ่มเซ็นเซอร์ใหม่ |
| `/api/sensors/1/data` | GET | ดึงข้อมูลจากเซ็นเซอร์หมายเลข 1 |
| `/api/sensors/1/data` | POST | ส่งข้อมูลใหม่จากเซ็นเซอร์หมายเลข 1 |

---

## 7.5 รูปแบบข้อมูล JSON

**JSON (JavaScript Object Notation)** เป็นรูปแบบข้อมูลที่นิยมใช้ใน REST API เพราะอ่านง่ายทั้งคนและเครื่อง

```json
{
  "device_id": "ESP32-001",
  "location": "ME-Lab-301",
  "sensors": [
    {
      "type": "temperature",
      "value": 32.5,
      "unit": "°C"
    },
    {
      "type": "humidity",
      "value": 65.2,
      "unit": "%"
    }
  ],
  "timestamp": "2026-06-22T15:00:00+07:00"
}
```

> 💡 **เคล็ดลับ**: JSON ใช้เครื่องหมายปีกกา `{}` สำหรับวัตถุ (Object) และวงเล็บเหลี่ยม `[]` สำหรับอาร์เรย์ (Array) — คีย์ (Key) ต้องอยู่ในเครื่องหมายคำพูดคู่ `"` เสมอ

---

## 7.6 MQTT: รูปแบบ Publish/Subscribe

**MQTT (Message Queuing Telemetry Transport)** ถูกออกแบบมาเพื่ออุปกรณ์ IoT โดยเฉพาะ มีขนาดเล็ก (Lightweight) และใช้แบนด์วิดท์ต่ำ

### 7.6.1 องค์ประกอบหลัก

MQTT ทำงานแบบ **Publish/Subscribe (Pub/Sub)** ซึ่งต่างจาก HTTP ตรงที่ไม่ต้องร้องขอโดยตรง:

- **Broker** — เซิร์ฟเวอร์ตัวกลางที่รับและกระจายข้อความ (เช่น Mosquitto, HiveMQ)
- **Publisher** — อุปกรณ์ที่ "เผยแพร่" ข้อมูลไปยัง Topic เช่น ESP32 ส่งค่าอุณหภูมิ
- **Subscriber** — อุปกรณ์ที่ "สมัครรับ" ข้อมูลจาก Topic ที่สนใจ

แผนภาพเคลื่อนไหวด้านล่างนี้แสดงกลไกการแลกเปลี่ยนข้อมูลแบบ Publish/Subscribe โดยมี Broker เป็นศูนย์กลางในการกระจายข้อมูลอุณหภูมิไปยังผู้รับหลายรายพร้อมกัน:

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 270" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .pub-box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .broker-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .sub-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .dashboard-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .wire-pub { fill: none; stroke: #f59e0b; stroke-width: 2.5; stroke-dasharray: 6 4; stroke-linecap: round; animation: flowPub 3s linear infinite; }
    .wire-sub1 { fill: none; stroke: #16a34a; stroke-width: 2.5; stroke-dasharray: 6 4; stroke-linecap: round; animation: flowSub1 3s linear infinite; }
    .wire-sub2 { fill: none; stroke: #16a34a; stroke-width: 2.5; stroke-dasharray: 6 4; stroke-linecap: round; animation: flowSub2 3s linear infinite; }
    
    .msg-pub { fill: #ffffff; stroke: #f59e0b; stroke-width: 2; rx: 3px; animation: mqttPubCycle 6s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    .msg-sub1 { fill: #ffffff; stroke: #16a34a; stroke-width: 2; rx: 3px; animation: mqttSub1Cycle 6s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    .msg-sub2 { fill: #ffffff; stroke: #16a34a; stroke-width: 2; rx: 3px; animation: mqttSub2Cycle 6s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    
    .text-main { font-size: 13px; font-weight: 700; fill: #334155; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-family: monospace; font-size: 11px; fill: #7c3aed; font-weight: bold; }
    .text-title { font-size: 14px; font-weight: 800; fill: #0f172a; }
    
    @keyframes flowPub {
      0% { stroke-dashoffset: 20; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes flowSub1 {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 20; }
    }
    @keyframes flowSub2 {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 20; }
    }
    
    @keyframes mqttPubCycle {
      0% { transform: translate(190px, 135px); opacity: 0; }
      5%, 30% { opacity: 1; }
      35%, 100% { transform: translate(320px, 135px); opacity: 0; }
    }
    @keyframes mqttSub1Cycle {
      0%, 40% { transform: translate(440px, 110px); opacity: 0; }
      45%, 70% { opacity: 1; }
      75%, 100% { transform: translate(570px, 72px); opacity: 0; }
    }
    @keyframes mqttSub2Cycle {
      0%, 40% { transform: translate(440px, 160px); opacity: 0; }
      45%, 70% { opacity: 1; }
      75%, 100% { transform: translate(570px, 198px); opacity: 0; }
    }
  </style>
  <rect x="5" y="5" width="750" height="260" class="bg"/>
  <text x="380" y="32" class="text-title" text-anchor="middle">สถาปัตยกรรม MQTT (Publish / Subscribe)</text>
  
  <!-- Publisher Box -->
  <rect x="25" y="85" width="150" height="100" class="pub-box"/>
  <text x="100" y="110" class="text-main" text-anchor="middle" fill="#7c3aed">ESP32 Publisher</text>
  <text x="100" y="130" class="text-sub" text-anchor="middle">ผู้เผยแพร่ข้อมูลอุณหภูมิ</text>
  <text x="100" y="150" class="text-sub" text-anchor="middle">Topic: home/temp</text>
  <text x="100" y="170" class="text-code" text-anchor="middle">temp: 32.5</text>
  
  <!-- MQTT Broker Box (Center) -->
  <rect x="305" y="85" width="150" height="100" class="broker-box"/>
  <text x="380" y="110" class="text-main" text-anchor="middle">MQTT Broker</text>
  <text x="380" y="130" class="text-sub" text-anchor="middle">ตัวกลางคัดแยกข้อมูล</text>
  <text x="380" y="150" class="text-sub" text-anchor="middle">ตาม Topic</text>
  <text x="380" y="170" class="text-code" text-anchor="middle" fill="#334155">Mosquitto / HiveMQ</text>
  
  <!-- Subscriber 1 (Web Dashboard) -->
  <rect x="585" y="30" width="150" height="85" class="dashboard-box"/>
  <text x="660" y="55" class="text-main" text-anchor="middle">Web Dashboard</text>
  <text x="660" y="75" class="text-sub" text-anchor="middle">Sub: home/temp</text>
  <text x="660" y="98" class="text-code" text-anchor="middle" fill="#16a34a">Temp: 32.5 °C</text>
  
  <!-- Subscriber 2 (Mobile App) -->
  <rect x="585" y="155" width="150" height="85" class="sub-box"/>
  <text x="660" y="180" class="text-main" text-anchor="middle">Mobile App</text>
  <text x="660" y="200" class="text-sub" text-anchor="middle">Sub: home/temp</text>
  <text x="660" y="223" class="text-code" text-anchor="middle" fill="#16a34a">Temp: 32.5 °C</text>
  
  <!-- Paths -->
  <!-- Pub to Broker -->
  <line x1="175" y1="135" x2="305" y2="135" class="wire"/>
  <line x1="175" y1="135" x2="305" y2="135" class="wire-pub"/>
  <path d="M 297 130 L 305 135 L 297 140 Z" fill="#f59e0b"/>
  
  <!-- Broker to Sub 1 (Web Dashboard) -->
  <line x1="455" y1="110" x2="585" y2="72" class="wire"/>
  <line x1="455" y1="110" x2="585" y2="72" class="wire-sub1"/>
  <path d="M 577 69 L 585 72 L 579 78 Z" fill="#16a34a"/>
  
  <!-- Broker to Sub 2 (Mobile App) -->
  <line x1="455" y1="160" x2="585" y2="198" class="wire"/>
  <line x1="455" y1="160" x2="585" y2="198" class="wire-sub2"/>
  <path d="M 579 192 L 585 198 L 577 201 Z" fill="#16a34a"/>
  
  <!-- Message Envelope Icons -->
  <!-- Pub Envelope -->
  <g class="msg-pub">
    <rect x="-12" y="-8" width="24" height="16" rx="2" />
    <path d="M -12 -8 L 0 0 L 12 -8" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
  </g>
  
  <!-- Sub 1 Envelope -->
  <g class="msg-sub1">
    <rect x="-12" y="-8" width="24" height="16" rx="2" />
    <path d="M -12 -8 L 0 0 L 12 -8" fill="none" stroke="#16a34a" stroke-width="1.5"/>
  </g>
  
  <!-- Sub 2 Envelope -->
  <g class="msg-sub2">
    <rect x="-12" y="-8" width="24" height="16" rx="2" />
    <path d="M -12 -8 L 0 0 L 12 -8" fill="none" stroke="#16a34a" stroke-width="1.5"/>
  </g>
  
</svg>
</div>

### 7.6.2 โครงสร้าง Topic

Topic ใน MQTT จัดเป็นลำดับชั้น (Hierarchy) คล้ายโครงสร้างโฟลเดอร์:

```
building/floor1/room101/temperature
building/floor1/room101/humidity
building/floor2/room201/temperature
```

**Wildcard (ตัวแทน):**
- `+` แทนระดับเดียว — `building/+/room101/temperature` จะรับข้อมูลจากทุกชั้น
- `#` แทนหลายระดับ — `building/floor1/#` จะรับข้อมูลทั้งหมดของชั้น 1

### 7.6.3 ระดับ QoS (Quality of Service)

MQTT มีกลไกการรับประกันการรับส่งข้อมูลผ่านระดับ **QoS (Quality of Service)** 3 ระดับ เพื่อรองรับเสถียรภาพเครือข่ายและข้อจำกัดของอุปกรณ์ที่แตกต่างกัน:

| ระดับ QoS | ชื่อเรียก | คำอธิบาย | การแลกเปลี่ยนแพ็กเก็ตคีย์หลัก | เหมาะกับงาน |
|-----------|------|----------|---------------------------|------------|
| **0** | At most once | ส่งข้อมูลครั้งเดียว ไม่รอการยืนยัน | `PUBLISH` ➔ จบงานทันที | ข้อมูลเซ็นเซอร์ทั่วไปที่ส่งถี่ ๆ (เช่น อุณหภูมิรายวินาที) |
| **1** | At least once | มั่นใจว่าถึงปลายทาง แต่อาจมีข้อมูลซ้ำ | `PUBLISH` ➔ `PUBACK` | คำสั่งเปิด-ปิดไฟ หรือข้อมูลที่ห้ามสูญหายเด็ดขาด |
| **2** | Exactly once | ข้อมูลถึงผู้รับครั้งเดียวแน่นอน ไม่ซ้ำ | `PUBLISH` ➔ `PUBREC` ➔ `PUBREL` ➔ `PUBCOMP` | ระบบการเงิน, การหักยอดสินค้า หรือคำสั่งที่ห้ามเกิดซ้ำซ้อน |

#### ลำดับขั้นตอนการแลกเปลี่ยนแพ็กเก็ตควบคุม (Packet Flow Sequence)

เพื่อให้เข้าใจเชิงลึกว่าแต่ละระดับ QoS จัดการข้อมูลอย่างไรในระดับ TCP Payload ด้านล่างนี้คือลำดับแพ็กเก็ตควบคุมที่แลกเปลี่ยนกันระหว่างผู้ส่ง (Client/Publisher) และผู้รับ (Broker):

##### 1. ลำดับของ QoS 0 (At most once - อย่างมากหนึ่งครั้ง)
ส่งแบบ **"ยิงแล้วลืม" (Fire and Forget)** ไม่มีการเก็บสถานะ ไม่มีการรอแพ็กเก็ตตอบกลับใด ๆ
<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 600 130" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>QoS 0 Sequence Diagram</title>
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1.5; rx: 8px; }
    .lifeline { stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4 4; }
    .node-box { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 4px; }
    .txt-node { font-size: 12px; font-weight: bold; fill: #1e293b; }
    
    .msg-line { fill: none; stroke: #94a3b8; stroke-width: 2; }
    .msg-flow { fill: none; stroke: #3b82f6; stroke-width: 2; stroke-dasharray: 6 6; animation: msg-march 1.5s linear infinite; }
    .msg-text { font-size: 11.5px; font-weight: bold; fill: #2563eb; }
    .note-text { font-size: 11px; fill: #64748b; }
    
    @keyframes msg-march {
      to { stroke-dashoffset: -12; }
    }
  </style>

  <rect x="5" y="5" width="590" height="120" class="bg"/>
  
  <defs>
    <marker id="arrow-seq" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#3b82f6"/>
    </marker>
  </defs>

  <!-- Lifelines -->
  <line x1="150" y1="45" x2="150" y2="105" class="lifeline"/>
  <line x1="450" y1="45" x2="450" y2="105" class="lifeline"/>
  
  <rect x="90" y="20" width="120" height="26" class="node-box"/>
  <text x="150" y="37" text-anchor="middle" class="txt-node">Publisher</text>

  <rect x="390" y="20" width="120" height="26" class="node-box"/>
  <text x="450" y="37" text-anchor="middle" class="txt-node">Broker</text>

  <!-- Message 1 -->
  <line x1="150" y1="75" x2="450" y2="75" class="msg-line" marker-end="url(#arrow-seq)"/>
  <line x1="150" y1="75" x2="445" y2="75" class="msg-flow"/>
  <text x="300" y="68" text-anchor="middle" class="msg-text">1. PUBLISH</text>
  <text x="462" y="80" text-anchor="start" class="note-text">(ได้รับข้อมูลและประมวลผลทันที)</text>
</svg>
</div>
- **ขั้นตอน:** ผู้ส่งทำการส่งแพ็กเก็ต `PUBLISH` เพียงครั้งเดียว และไม่มีการติดตามการตอบรับ
- **ข้อดี:** ความหน่วงต่ำมาก (Latency ต่ำสุด) ใช้แบนด์วิดท์และพลังงานน้อยที่สุด
- **ความเสี่ยง:** หากสัญญาณเครือข่ายมีปัญหาระหว่างส่ง ข้อมูลจะสูญหายทันทีโดยไม่มีการรับรู้

##### 2. ลำดับของ QoS 1 (At least once - อย่างน้อยหนึ่งครั้ง)
รับประกันข้อมูลถึงปลายทางแน่นอน แต่อาจได้รับข้อความซ้ำได้หากตัวส่งเข้าใจผิดว่าข้อความหล่นหาย
<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 600 170" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>QoS 1 Sequence Diagram</title>
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1.5; rx: 8px; }
    .lifeline { stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4 4; }
    .node-box { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 4px; }
    .txt-node { font-size: 12px; font-weight: bold; fill: #1e293b; }
    
    .msg-line { fill: none; stroke: #94a3b8; stroke-width: 2; }
    .msg-flow-right { fill: none; stroke: #3b82f6; stroke-width: 2; stroke-dasharray: 6 6; animation: march-r 1.5s linear infinite; }
    .msg-flow-left { fill: none; stroke: #10b981; stroke-width: 2; stroke-dasharray: 6 6; animation: march-l 1.5s linear infinite; }
    
    .msg-text-blue { font-size: 11.5px; font-weight: bold; fill: #2563eb; }
    .msg-text-green { font-size: 11.5px; font-weight: bold; fill: #059669; }
    .note-text { font-size: 11px; fill: #64748b; }
    
    @keyframes march-r {
      to { stroke-dashoffset: -12; }
    }
    @keyframes march-l {
      to { stroke-dashoffset: 12; }
    }
  </style>

  <rect x="5" y="5" width="590" height="160" class="bg"/>
  
  <defs>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#3b82f6"/>
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#10b981"/>
    </marker>
  </defs>

  <!-- Lifelines -->
  <line x1="150" y1="45" x2="150" y2="145" class="lifeline"/>
  <line x1="450" y1="45" x2="450" y2="145" class="lifeline"/>
  
  <rect x="90" y="20" width="120" height="26" class="node-box"/>
  <text x="150" y="37" text-anchor="middle" class="txt-node">Publisher</text>

  <rect x="390" y="20" width="120" height="26" class="node-box"/>
  <text x="450" y="37" text-anchor="middle" class="txt-node">Broker</text>

  <!-- Message 1 -->
  <line x1="150" y1="75" x2="450" y2="75" class="msg-line" marker-end="url(#arrow-blue)"/>
  <line x1="150" y1="75" x2="445" y2="75" class="msg-flow-right"/>
  <text x="300" y="68" text-anchor="middle" class="msg-text-blue">1. PUBLISH (PacketID: 1)</text>
  <text x="462" y="80" text-anchor="start" class="note-text">(ได้รับและบันทึกข้อความ)</text>

  <!-- Message 2 -->
  <line x1="450" y1="115" x2="150" y2="115" class="msg-line" marker-end="url(#arrow-green)"/>
  <line x1="450" y1="115" x2="155" y2="115" class="msg-flow-left"/>
  <text x="300" y="108" text-anchor="middle" class="msg-text-green">2. PUBACK (PacketID: 1)</text>
  <text x="138" y="120" text-anchor="end" class="note-text">(ลบข้อความออกจากหน่วยความจำ)</text>
</svg>
</div>
- **ขั้นตอน:**
  1. ผู้ส่งบันทึกข้อความไว้ใน Memory เครื่อง และส่ง `PUBLISH` พร้อมตัวระบุเลขแพ็กเก็ต (`Packet ID`)
  2. ผู้รับบันทึกข้อความลงระบบ ประมวลผล และส่งแพ็กเก็ต `PUBACK` (Publish Acknowledgement) กลับไปหาผู้ส่ง
  3. เมื่อผู้ส่งได้รับ `PUBACK` ตรงกับ `Packet ID` จึงลบข้อความนั้นออกจาก Memory
- **การจัดการกรณีเครือข่ายขัดข้อง:** หากผู้ส่งไม่ได้ส่ง `PUBACK` กลับมาภายในเวลาที่กำหนด (Timeout) ผู้ส่งจะส่ง `PUBLISH` ซ้ำอีกครั้งโดยเพิ่มแฟล็ก `DUP: 1` (Duplicate) เพื่อเตือนผู้รับ

##### 3. ลำดับของ QoS 2 (Exactly once - ครั้งเดียวและแน่นอน)
การันตีความถูกต้องสูงสุด ป้องกันปัญหากรณีข้อมูลซ้ำซ้อนอย่างสมบูรณ์แบบโดยใช้ระบบ Handshake 4 ขั้นตอน:
<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 600 250" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>QoS 2 Sequence Diagram</title>
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1.5; rx: 8px; }
    .lifeline { stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4 4; }
    .node-box { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 4px; }
    .txt-node { font-size: 12px; font-weight: bold; fill: #1e293b; }
    
    .msg-line { fill: none; stroke: #94a3b8; stroke-width: 2; }
    .msg-flow-right { fill: none; stroke: #3b82f6; stroke-width: 2; stroke-dasharray: 6 6; animation: march-r 1.5s linear infinite; }
    .msg-flow-left { fill: none; stroke: #10b981; stroke-width: 2; stroke-dasharray: 6 6; animation: march-l 1.5s linear infinite; }
    .msg-flow-purple-right { fill: none; stroke: #8b5cf6; stroke-width: 2; stroke-dasharray: 6 6; animation: march-r 1.5s linear infinite; }
    .msg-flow-purple-left { fill: none; stroke: #8b5cf6; stroke-width: 2; stroke-dasharray: 6 6; animation: march-l 1.5s linear infinite; }
    
    .msg-text-blue { font-size: 11px; font-weight: bold; fill: #2563eb; }
    .msg-text-green { font-size: 11px; font-weight: bold; fill: #059669; }
    .msg-text-purple { font-size: 11px; font-weight: bold; fill: #6d28d9; }
    .note-text { font-size: 10.5px; fill: #64748b; }
    
    @keyframes march-r {
      to { stroke-dashoffset: -12; }
    }
    @keyframes march-l {
      to { stroke-dashoffset: 12; }
    }
  </style>

  <rect x="5" y="5" width="590" height="240" class="bg"/>
  
  <defs>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#3b82f6"/>
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#10b981"/>
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#8b5cf6"/>
    </marker>
  </defs>

  <!-- Lifelines -->
  <line x1="150" y1="45" x2="150" y2="225" class="lifeline"/>
  <line x1="450" y1="45" x2="450" y2="225" class="lifeline"/>
  
  <rect x="90" y="20" width="120" height="26" class="node-box"/>
  <text x="150" y="37" text-anchor="middle" class="txt-node">Publisher</text>

  <rect x="390" y="20" width="120" height="26" class="node-box"/>
  <text x="450" y="37" text-anchor="middle" class="txt-node">Broker</text>

  <!-- Message 1 -->
  <line x1="150" y1="70" x2="450" y2="70" class="msg-line" marker-end="url(#arrow-blue)"/>
  <line x1="150" y1="70" x2="445" y2="70" class="msg-flow-right"/>
  <text x="300" y="63" text-anchor="middle" class="msg-text-blue">1. PUBLISH (PacketID: 2)</text>
  <text x="462" y="74" text-anchor="start" class="note-text">(จำ Packet ID ไว้ชั่วคราว)</text>

  <!-- Message 2 -->
  <line x1="450" y1="110" x2="150" y2="110" class="msg-line" marker-end="url(#arrow-green)"/>
  <line x1="450" y1="110" x2="155" y2="110" class="msg-flow-left"/>
  <text x="300" y="103" text-anchor="middle" class="msg-text-green">2. PUBREC (PacketID: 2)</text>
  <text x="138" y="114" text-anchor="end" class="note-text">(รับทราบและบล็อกข้อมูลซ้ำ)</text>

  <!-- Message 3 -->
  <line x1="150" y1="150" x2="450" y2="150" class="msg-line" marker-end="url(#arrow-purple)"/>
  <line x1="150" y1="150" x2="445" y2="150" class="msg-flow-purple-right"/>
  <text x="300" y="143" text-anchor="middle" class="msg-text-purple">3. PUBREL (PacketID: 2)</text>
  <text x="462" y="154" text-anchor="start" class="note-text">(ส่งข้อมูลหาผู้รับ / ปลดล็อก)</text>

  <!-- Message 4 -->
  <line x1="450" y1="190" x2="150" y2="190" class="msg-line" marker-end="url(#arrow-purple)"/>
  <line x1="450" y1="190" x2="155" y2="190" class="msg-flow-purple-left"/>
  <text x="300" y="183" text-anchor="middle" font-size="11px" font-weight="bold" fill="#6d28d9">4. PUBCOMP (PacketID: 2)</text>
  <text x="138" y="194" text-anchor="end" class="note-text">(เสร็จสิ้นกระบวนการแลกเปลี่ยน)</text>
</svg>
</div>
- **ขั้นตอน:**
  1. **PUBLISH (ส่ง):** ผู้ส่งส่งข้อความระบุ `Packet ID`
  2. **PUBREC (ตอบรับว่าได้รับ):** ผู้รับรับทราบการส่งและบันทึกข้อมูลไว้ แต่จะยังไม่กระจายไปยัง Subscriber โดยตอบรับด้วยแพ็กเก็ต `PUBREC` (Publish Received) กลับไป
  3. **PUBREL (แจ้งลบสถานะตัวส่ง):** เมื่อผู้ส่งได้รับ `PUBREC` จะตอบกลับด้วย `PUBREL` (Publish Release) เพื่อบอกให้ผู้รับเตรียมเผยแพร่ข้อความและลบเลขแพ็กเก็ตที่บันทึกไว้ได้
  4. **PUBCOMP (ยืนยันสิ้นสุดงาน):** ผู้รับกระจายข้อความเสร็จแล้ว ส่งสัญญาณ `PUBCOMP` (Publish Complete) กลับไปเพื่อบอกผู้ส่งว่าเสร็จสมบูรณ์ร้อยเปอร์เซ็นต์

### 7.6.4 คุณสมบัติพิเศษ

- **Retained Message** — Broker เก็บข้อความล่าสุดไว้ เมื่อมี Subscriber ใหม่จะได้รับข้อมูลทันทีโดยไม่ต้องรอ Publisher ส่งใหม่
- **Last Will and Testament (LWT)** — ข้อความที่ Client ฝากไว้กับ Broker ตั้งแต่ตอนเชื่อมต่อ หาก Client หลุดโดยไม่ปกติ Broker จะส่งข้อความนี้แจ้งเตือน เช่น `"ESP32-001 offline"`

> 💡 **LWT เหมาะมากสำหรับ IoT** — เพราะอุปกรณ์ในภาคสนามอาจหลุดเชื่อมต่อได้ตลอดเวลา การแจ้งเตือนอัตโนมัติช่วยให้ระบบรู้สถานะอุปกรณ์แม้ไม่ได้รับข้อมูล

---

## 7.7 ตารางเปรียบเทียบแบบเจาะลึก: HTTP/REST ปะทะ MQTT

การเลือกโพรโทคอลที่เหมาะสมมีผลโดยตรงต่อการเลือกแบตเตอรี่ ขนาดหน่วยความจำบอร์ด และค่าใช้จ่ายอินเทอร์เน็ตของโครงการ IoT ตารางด้านล่างเป็นการเปรียบเทียบเชิงวิศวกรรมระหว่าง HTTP/REST และ MQTT:

| เกณฑ์การพิจารณา | HTTP/REST | MQTT |
| :--- | :--- | :--- |
| **รูปแบบสถาปัตยกรรม (Architecture)** | **Request-Response (ดึง/ส่งแบบทิศทางเดียว)**<br>Client ต้องร้องขอก่อน เซิร์ฟเวอร์จึงตอบกลับ | **Publish-Subscribe (กระจายตามหัวข้อ)**<br>Broker เป็นตัวกลางจัดการข้อมูลผ่าน Topic |
| **ขนาดเมตาดาต้า (Header Overhead)** | **สูงมาก (300 - 1,000 ไบต์ต่อครั้ง)**<br>เนื่องจากใช้ข้อความ Text เช่น HTTP Headers, User-Agent | **ต่ำมาก (เริ่มต้นเพียง 2 ไบต์)**<br>จัดเก็บในรูปแบบไบนารีฟอร์แมตขนาดเล็กพิเศษ |
| **ความคงอยู่ของการเชื่อมต่อ (Persistence)** | **ไม่คงอยู่ (Stateless)**<br>สร้างและปิดการเชื่อมต่อ TCP บ่อยครั้ง (ยกเว้นใช้ Keep-Alive) | **คงอยู่ตลอดเวลา (Persistent)**<br>รักษาการเชื่อมต่อไว้ด้วยการส่งแพ็กเก็ต Ping ประหยัดเวลา Handshake |
| **ความหน่วงเวลา (Latency)** | **สูงปานกลาง**<br>ต้องเสียเวลาสร้าง TCP handshake และแลกเปลี่ยน Header ใหม่ทุกรอบ | **ต่ำมาก (Real-time)**<br>เนื่องจากท่อเชื่อมต่อ TCP เปิดค้างไว้แล้ว ส่งข้อมูลถึงทันที |
| **คุณภาพการบริการ (QoS Support)** | **ไม่มีในระดับแอปพลิเคชัน**<br>อาศัยการรับประกันของ TCP ด้านล่างเท่านั้น หากแอปหลุดต้องเขียนซ้ำเอง | **มี 3 ระดับในตัว (QoS 0, 1, 2)**<br>เลือกระดับความน่าเชื่อถือของการส่งข้อมูลได้อิสระ |
| **การใช้พลังงาน (Power Consumption)** | **สูง**<br>ต้องใช้ CPU ประมวลผลและเปิดวิทยุรับส่งบ่อยครั้งเนื่องจากข้อมูลมีขนาดใหญ่ | **ต่ำมาก**<br>ลด Overhead ส่งผลให้ชิปอยู่ในโหมด Deep Sleep ได้ยาวนานกว่า |
| **การส่งข้อมูลจาก Server ➔ Client** | **ทำได้ยาก**<br>ต้องใช้เทคนิค Polling (ถามซ้ำ ๆ) หรือเปลี่ยนไปใช้ WebSockets | **ทำได้ง่ายและเร็ว**<br>เซิร์ฟเวอร์สามารถ Publish ไปยัง Topic ที่อุปกรณ์ Subscribe ไว้ได้ทันที |
| **ปริมาณแบนด์วิดท์ (Bandwidth)** | **ใช้ปริมาณข้อมูลมาก**<br>ไม่เหมาะกับอุปกรณ์ที่ส่งผ่านซิมการ์ด 4G/5G ที่คิดตามปริมาณการรับส่งข้อมูล | **ใช้ข้อมูลน้อยมาก (ประหยัดสุด)**<br>เหมาะอย่างยิ่งกับการรับส่งข้อมูลที่นับเป็นกิโลไบต์/เดือน |
| **ความซับซ้อนของโครงสร้างระบบ** | **ต่ำ**<br>ไม่ต้องใช้ Broker เพิ่มเติม สามารถเรียกใช้ URL API ได้โดยตรง | **ปานกลาง**<br>ต้องติดตั้งและดูแลรักษาเซิร์ฟเวอร์ MQTT Broker (เช่น Mosquitto) |
| **ความเหมาะสมของหน้างาน** | 1. การร้องขอข้อมูลขนาดใหญ่เป็นรอบ ๆ<br>2. การเรียกใช้ Web Service API ภายนอก<br>3. การอัปโหลดเฟิร์มแวร์อุปกรณ์ (OTA) | 1. บอร์ดแบตเตอรี่ต่ำในพื้นที่ห่างไกล<br>2. ระบบแจ้งเตือนเซ็นเซอร์แบบ Real-time<br>3. มีอุปกรณ์รับส่งข้อมูลหลักร้อยถึงล้านตัวพร้อม ๆ กัน |

---

## 7.8 ตัวอย่างโค้ด ESP32

### 7.8.1 ส่งข้อมูลผ่าน HTTP POST

โค้ดนี้อ่านค่าจากเซ็นเซอร์ DHT22 แล้วส่งเป็น JSON ไปยังเซิร์ฟเวอร์ด้วย HTTP POST — ทดสอบบน Wokwi ได้โดยใช้ `httpbin.org` เป็นเซิร์ฟเวอร์ปลายทาง

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <DHTesp.h>

// --- ตั้งค่า Wi-Fi และ Server ---
const char* ssid       = "Wokwi-GUEST";
const char* password   = "";
const char* serverUrl  = "https://httpbin.org/post";

DHTesp dht;
const int DHT_PIN = 15;

void setup() {
  Serial.begin(115200);
  dht.setup(DHT_PIN, DHTesp::DHT22);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float temperature = dht.getTemperature();
    float humidity    = dht.getHumidity();

    // สร้าง JSON payload
    String jsonPayload = "{";
    jsonPayload += "\"device_id\":\"ESP32-001\",";
    jsonPayload += "\"temperature\":" + String(temperature, 1) + ",";
    jsonPayload += "\"humidity\":" + String(humidity, 1);
    jsonPayload += "}";

    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonPayload);

    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);
    if (httpResponseCode > 0) {
      Serial.println("Response: " + http.getString());
    } else {
      Serial.println("Error: " + String(httpResponseCode));
    }
    http.end();
  }
  delay(10000);  // ส่งทุก 10 วินาที
}
```

#### อธิบายการทำงานของโค้ด HTTP POST (คำอธิบายรายบรรทัด)
- **การนำเข้าไลบรารี (`#include <HTTPClient.h>`):** เรียกใช้งานโมดูลสำหรับการสร้างการเชื่อมต่อ HTTP ซึ่งถูกพอร์ตมากับ ESP32 Core เพื่อช่วยอำนวยความสะดวกในการจัดรูปแบบ Headers และการสร้างคำสั่งร้องขอ (GET, POST, PUT, DELETE)
- **การเริ่มต้นออบเจกต์อินสแตนซ์ (`HTTPClient http;`):** ประกาศตัวแปรเพื่อใช้จัดการการแลกเปลี่ยนข้อมูล
- **การตั้งพารามิเตอร์ URL ปลายทาง (`http.begin(serverUrl)`):** เป็นการเริ่มต้นเก็บ URL ที่ระบุประเภทโปรโตคอล (HTTP หรือ HTTPS) และโฮสต์ เช่น `https://httpbin.org/post`
- **การกำหนดประเภทเนื้อหาและ Headers (`http.addHeader(...)`):**
  ```cpp
  http.addHeader("Content-Type", "application/json");
  ```
  เพื่อส่งสัญญาณให้เว็บเซิร์ฟเวอร์ปลายทางทราบว่า Payload ที่ส่งไปอยู่ในรูปแบบ JSON และต้องใช้ JSON Parser ในการประมวลผล
- **การทำ HTTP POST (`int httpResponseCode = http.POST(jsonPayload)`):** เป็นฟังก์ชันบล็อกการทำงาน (Blocking Function) ที่จะส่งคำร้องและเนื้อความ JSON ไปยังเซิร์ฟเวอร์ และคืนค่าเป็น **HTTP Status Code** (จำนวนเต็ม) กลับมาเก็บไว้เพื่อตรวจสอบความสำเร็จ (เช่น 200 หรือ 201 หมายถึงส่งสำเร็จ, ค่าติดลบหมายถึงเชื่อมต่อเซิร์ฟเวอร์ไม่ได้)
- **การรับข้อความตอบกลับ (`http.getString()`):** หากส่งผ่านและได้รหัสมากกว่า 0 โค้ดจะดึงข้อมูลการประมวลผล (Body Response) ที่เซิร์ฟเวอร์ส่งกลับมาในรูปของ String เพื่อแสดงผลใน Serial Monitor
- **การปิดการเชื่อมต่อเพื่อคืนหน่วยความจำ (`http.end()`):** คำสั่งสำคัญในการยกเลิกและปิดท่อ TCP Socket เพื่อคืน Memory ของ ESP32 ให้กลับมาว่าง ป้องกันปัญหา Memory Leak ของอุปกรณ์

### 7.8.2 Publish/Subscribe ผ่าน MQTT

โค้ดนี้เชื่อมต่อ MQTT Broker แบบสาธารณะ ส่งค่าอุณหภูมิ (Publish) และรับคำสั่งเปิด-ปิด LED (Subscribe) — ใช้ได้กับ Wokwi

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHTesp.h>

// --- ตั้งค่า Wi-Fi และ MQTT ---
const char* ssid        = "Wokwi-GUEST";
const char* password    = "";
const char* mqttBroker  = "broker.hivemq.com";
const int   mqttPort    = 1883;

// --- Topic ---
const char* pubTopic    = "ksu/me/lab301/temperature";
const char* subTopic    = "ksu/me/lab301/led";

WiFiClient   espClient;
PubSubClient mqtt(espClient);
DHTesp       dht;

const int DHT_PIN = 15;
const int LED_PIN = 2;

// --- Callback เมื่อได้รับข้อความ ---
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println("Received [" + String(topic) + "]: " + message);

  if (message == "ON")  digitalWrite(LED_PIN, HIGH);
  if (message == "OFF") digitalWrite(LED_PIN, LOW);
}

void reconnect() {
  while (!mqtt.connected()) {
    Serial.print("Connecting to MQTT...");
    // ตั้ง LWT: แจ้ง "offline" หากหลุด
    if (mqtt.connect("ESP32-ME-001", NULL, NULL,
                     "ksu/me/lab301/status", 1, true, "offline")) {
      Serial.println("connected!");
      mqtt.subscribe(subTopic);
      mqtt.publish("ksu/me/lab301/status", "online", true);
    } else {
      Serial.print("failed, rc=");
      Serial.println(mqtt.state());
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  dht.setup(DHT_PIN, DHTesp::DHT22);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  Serial.println("WiFi connected");

  mqtt.setServer(mqttBroker, mqttPort);
  mqtt.setCallback(mqttCallback);
}

void loop() {
  if (!mqtt.connected()) reconnect();
  mqtt.loop();

  static unsigned long lastSend = 0;
  if (millis() - lastSend > 5000) {
    float temp = dht.getTemperature();
    String payload = String(temp, 1);
    mqtt.publish(pubTopic, payload.c_str());
    Serial.println("Published: " + payload + " °C");
    lastSend = millis();
  }
}
```

#### อธิบายการทำงานของโค้ด PubSubClient MQTT (คำอธิบายรายบรรทัด)
- **การประกาศตัวแปรไคลเอนต์และตัวนำทางเครือข่าย:**
  ```cpp
  WiFiClient espClient;
  PubSubClient mqtt(espClient);
  ```
  เนื่องจาก `PubSubClient` จำเป็นต้องใช้ออบเจกต์เครือข่ายพื้นฐานในการจัดการ TCP Stream เราจึงสร้าง `WiFiClient` ส่งผ่านเข้าไปในคอนสตรัคเตอร์ของ MQTT ไคลเอนต์
- **ฟังก์ชันตอบกลับข้อความ (`void mqttCallback(char* topic, byte* payload, unsigned int length)`):**
  เป็นฟังก์ชัน Event Handler ที่ Broker จะเรียกใช้เมื่อมีข้อความใหม่ถูก Publish เข้ามาใน Topic ที่ ESP32 สมัครรับข้อมูล (`Subscribe`) ไว้ ตัวฟังก์ชันจะทำการวนลูปแปลงข้อมูลจาก byte array ในตัวแปร `payload` ออกมาเป็น String เพื่อเอาไปตรวจสอบเงื่อนไข เช่น เปิด-ปิดไฟ LED
- **การเชื่อมต่อและรักษาการทำงาน (`reconnect()`):**
  ```cpp
  mqtt.connect("ESP32-ME-001", NULL, NULL, "ksu/me/lab301/status", 1, true, "offline")
  ```
  ฟังก์ชันนี้จะเชื่อมต่อเข้ากับ Broker โดยมีการฝากข้อความ **Last Will and Testament (LWT)** ไว้กับเซิร์ฟเวอร์:
  - ชื่อหัวข้อแจ้งสถานะ: `ksu/me/lab301/status`
  - QoS: 1
  - Retain: true
  - ข้อความเมื่อหลุดกะทันหัน: `"offline"`
  - เมื่อสามารถเชื่อมต่อ Broker สำเร็จ บอร์ดจะส่งคำขอ `mqtt.subscribe(subTopic)` ทันที และส่งข้อความ `"online"` ไปยัง Topic สถานะเพื่อระบุว่าบอร์ดพร้อมทำงานแล้ว
- **ฟังก์ชันลูปการรันงานหลัก (`mqtt.loop()`):**
  ต้องเรียกใช้คำสั่งนี้ในฟังก์ชัน `loop()` เสมอ เนื่องจากทำหน้าที่จัดการการรับส่งข้อความในบัฟเฟอร์ คอยส่งสัญญาณ `PINGREQ` ไปยัง Broker เพื่อบอกว่าอุปกรณ์ยังทำงานอยู่ (Keep-Alive) และคอยกระตุ้นฟังก์ชัน `mqttCallback` เมื่อมีข้อความเข้า
- **การส่งข้อมูลแบบไม่หน่วงลูปหลัก (`millis() - lastSend > 5000`):**
  หลีกเลี่ยงการใช้คำสั่ง `delay()` ในลูปหลัก เพื่อไม่ให้โปรแกรมหยุดการทำงานชั่วขณะ ซึ่งจะขัดขวางการรับข้อความด่วนผ่านคำสั่ง `mqtt.loop()` โดยใช้การเช็คเวลารูปแบบ Millis ในการสั่งส่งข้อมูลอุณหภูมิ (Publish) ทุก ๆ 5 วินาทีแทน

---

## สรุปท้ายบท

- **HTTP/REST** เหมาะสำหรับการส่งข้อมูลแบบ Request/Response ใช้ง่าย เข้ากับระบบเว็บที่มีอยู่ แต่มี Overhead สูงและไม่เหมาะกับการส่งข้อมูลถี่ ๆ
- **MQTT** ออกแบบมาสำหรับ IoT โดยเฉพาะ ใช้แบนด์วิดท์ต่ำ รองรับ Real-time และการสื่อสารแบบ Pub/Sub ที่ยืดหยุ่น
- **JSON** เป็นรูปแบบข้อมูลมาตรฐานที่ใช้ร่วมกับทั้ง HTTP และ MQTT
- ใช้ **QoS** ของ MQTT เลือกระดับความน่าเชื่อถือให้เหมาะกับงาน — QoS 0 สำหรับข้อมูลที่สูญหายได้ (เช่น อุณหภูมิที่ส่งทุกวินาที) และ QoS 1-2 สำหรับคำสั่งสำคัญ
- **LWT** และ **Retained Message** ช่วยให้ระบบ IoT มีความทนทาน (Resilient) แม้อุปกรณ์จะหลุดเชื่อมต่อ

---

## แบบฝึกหัดท้ายบท

1. **อธิบายความแตกต่าง** — จงอธิบายความแตกต่างระหว่างรูปแบบ Request/Response ของ HTTP กับรูปแบบ Publish/Subscribe ของ MQTT พร้อมยกตัวอย่างสถานการณ์ที่เหมาะสมกับแต่ละรูปแบบ อย่างละ 1 สถานการณ์

2. **ออกแบบ REST API** — สมมติว่าต้องสร้างระบบตรวจวัดอุณหภูมิในอาคารเรียนวิศวกรรมเครื่องกล 3 ชั้น ชั้นละ 4 ห้อง จงออกแบบ REST API Endpoint อย่างน้อย 4 เส้นทาง พร้อมระบุ HTTP Method ที่ใช้

3. **วิเคราะห์ QoS** — ระบบ IoT ในโรงงานต้องส่งข้อมูล 2 ประเภท: (ก) ค่าอุณหภูมิทุก 5 วินาที และ (ข) สัญญาณเตือนฉุกเฉินเมื่อความดันเกินค่ากำหนด จงเลือกระดับ QoS ที่เหมาะสมสำหรับแต่ละประเภท พร้อมให้เหตุผล

4. **เขียน JSON** — จงเขียน JSON payload สำหรับส่งข้อมูลจากเซ็นเซอร์วัดแรงสั่นสะเทือน (Vibration Sensor) ที่ติดตั้งบนมอเตอร์ไฟฟ้า โดยต้องมีข้อมูล: รหัสอุปกรณ์ ความเร่ง 3 แกน (x, y, z) หน่วย เวลา และสถานะ

5. **แก้ไขโค้ด** — โค้ด ESP32 ด้านล่างมีข้อผิดพลาด 3 จุด จงระบุและแก้ไขให้ถูกต้อง:
   ```cpp
   HTTPClient http;
   http.begin("http://api.example.com/data");
   http.addHeader("Content-Type", "text/plain");
   int code = http.GET("{\"temp\":25.5}");
   ```

6. **ออกแบบ Topic** — จงออกแบบโครงสร้าง MQTT Topic สำหรับระบบ Smart Farm ที่มี 2 โรงเรือน แต่ละโรงเรือนมีเซ็นเซอร์อุณหภูมิ ความชื้น และมีปั๊มน้ำที่สั่งเปิด-ปิดได้ แสดง Topic อย่างน้อย 6 รายการ พร้อมระบุว่าแต่ละ Topic ใช้ Publish หรือ Subscribe

7. **เปรียบเทียบ** — หากต้องสร้างระบบ IoT สำหรับติดตามตำแหน่งรถบรรทุก (Fleet Tracking) ที่ต้องส่งพิกัด GPS ทุก 10 วินาที ควรเลือกใช้ HTTP หรือ MQTT? ให้เหตุผลอย่างน้อย 3 ข้อ

8. **ท้าทาย (Wokwi)** — ดัดแปลงโค้ดในหัวข้อ 7.8.2 ให้ ESP32 ส่งค่าทั้งอุณหภูมิและความชื้นในรูปแบบ JSON ไปยัง Topic `ksu/me/lab301/climate` แทนการส่งเฉพาะตัวเลข และเพิ่มการ Subscribe Topic `ksu/me/lab301/interval` เพื่อให้ปรับความถี่ในการส่งข้อมูลจากระยะไกลได้ ทดสอบบน Wokwi
