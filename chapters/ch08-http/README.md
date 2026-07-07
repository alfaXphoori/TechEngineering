# Chapter 7: สถาปัตยกรรมเว็บและโปรโตคอล HTTP (Web Architecture & HTTP/REST APIs)

> บทนี้จะอธิบายหลักการทำงานของโพรโทคอล HTTP ซึ่งเป็นสถาปัตยกรรมสื่อสารในรูปแบบ Request-Response ที่ใช้กันแพร่หลายในบริการเว็บทั่วไป การจัดรูปแบบข้อมูลโครงสร้าง JSON และแนวทางการเขียนโปรแกรมเชื่อมต่อ RESTful API บนไมโครคอนโทรลเลอร์

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


---

## 7.9 สรุปประจำบทที่ 7 (Summary)

1. **สถาปัตยกรรม Client-Server** เป็นรูปแบบดั้งเดิมที่อุปกรณ์ (Client) ส่งคำขอร้อง HTTP Request ไปยังจุดปลายทาง (Server) และรับการตอบกลับ HTTP Response กลับมาในเวลาอันสั้น
2. **โปรโตคอล HTTP** ทำงานเป็นแบบไร้สถานะ (Stateless) โดยมีเมธอดหลักในการระบุความต้องการของข้อมูล ได้แก่ GET (ร้องขอข้อมูล), POST (ส่งข้อมูลขึ้นบันทึก), PUT (อัปเดตข้อมูล) และ DELETE (ลบข้อมูล)
3. **JSON (JavaScript Object Notation)** เป็นรูปแบบมาตรฐานข้อความสำหรับใช้แลกเปลี่ยนจัดเก็บข้อมูลระดับแอปพลิเคชันที่มีโครงสร้างจัดง่าย เช่น ออบเจกต์ (Key-Value) และอาร์เรย์ (Array)
4. **RESTful API** เป็นการจัดอินเทอร์เฟซมาตรฐานของเว็บบริการบนแนวคิดระบุทรัพยากรด้วย URL และดำเนินการผ่านเมธอดมาตรฐานของ HTTP

---

## 7.10 แบบฝึกหัดท้ายบทที่ 7 (Exercises)

**ข้อ 1:** จงอธิบายความหมายของสถานะตอบกลับ HTTP Status Code ต่อไปนี้: `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found` และ `500 Internal Server Error`
**ข้อ 2:** ในระบบวิศวกรรมการผลิต หากต้องการสั่งส่งระดับอุณหภูมิของเตาอบทุก 1 วินาทีต่อเนื่อง ทำไมการใช้ HTTP/REST API จึงอาจสร้างปัญหาโหลดข้อมูลแบนด์วิดท์สูงเกินไป?
**ข้อ 3:** จงเขียนโครงสร้างข้อความรูปแบบ JSON ที่จำลองการเก็บค่าพารามิเตอร์เซนเซอร์ตรวจจับลมของเครื่องจักร 3 ชิ้น ประกอบด้วย รหัสเครื่อง (string), ทิศทางลม (string), และความเร็วลม (float)
**ข้อ 4:** จงอธิบายความสำคัญของการเรียกคำสั่ง `http.end()` หลังจากการรันคำขอ http บนไมโครคอนโทรลเลอร์ ESP32
