---
layout: default
title: "บทที่ 8: สถาปัตยกรรมเว็บและโพรโทคอล HTTP"
permalink: /chapters/ch08-http/
---

# Chapter 8: สถาปัตยกรรมเว็บและโพรโทคอล HTTP

## Web Architecture & HTTP/REST APIs (Client/Server, Methods, Status Codes, JSON, ArduinoJson, HTTPS)

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

> ### 🎯 ผลลัพธ์การเรียนรู้และการเชื่อมโยง (Constructive Alignment)
>
> - **สัปดาห์การเรียนรู้:** สัปดาห์ที่ 9 — โปรโตคอลประยุกต์เว็บและการสื่อสาร API (Web Application Protocols & REST APIs)
> - **ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs):**
>   - **CLO2:** เลือกใช้และอธิบายเทคโนโลยีไร้สาย โพรโทคอลการสื่อสาร และเทคโนโลยีคลาวด์สำหรับ IoT ได้
>   - **CLO3:** ออกแบบและพัฒนาระบบ IoT ที่เชื่อมต่อเซนเซอร์/ตัวกระทำ สื่อสารข้อมูล และแสดงผลผ่านโปรแกรมของผู้ใช้ได้
>   - **CLO4:** ปฏิบัติการสร้าง ทดสอบ และประยุกต์ใช้ระบบ IoT พร้อมการเรียนรู้ของเครื่องเบื้องต้น และทำงานเป็นทีมอย่างรับผิดชอบ
> - **ผลลัพธ์การเรียนรู้ระดับบทเรียน (LLOs):**
>   - **LLO9.1:** อธิบายสถาปัตยกรรม Client/Server, HTTP Methods และหลักการ REST API ได้ (CLO2)
>   - **LLO9.2:** ส่งข้อมูลเซนเซอร์ผ่าน HTTP/REST ในรูปแบบ JSON ได้ (CLO3, CLO4)
>
---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 8.1 บทบาทของโพรโทคอลระดับแอปพลิเคชันในระบบ IoT

เมื่ออุปกรณ์ไมโครคอนโทรลเลอร์ (เช่น ESP32) เชื่อมต่อเข้ากับเครือข่าย Wi-Fi หรือ Ethernet สำเร็จ นั่นหมายความว่าการเชื่อมต่อในชั้นเครือข่าย (Network Layer: IP) และชั้นขนส่ง (Transport Layer: TCP/UDP) พร้อมใช้งานแล้ว แต่ในการส่งข้อมูลทางวิศวกรรม เช่น อุณหภูมิเครื่องจักร ความดัน หรือค่าพิกัดพิกัด ไปยังเซิร์ฟเวอร์บนคลาวด์ จำเป็นต้องมี **โพรโทคอลระดับแอปพลิเคชัน (Application-Layer Protocol)** เพื่อกำหนดกฎเกณฑ์ รูปแบบโครงสร้างข้อความ และวิธีการแลกเปลี่ยนข้อมูลระหว่างสองระบบ

โพรโทคอลระดับแอปพลิเคชันที่เป็นรากฐานของระบบอินเทอร์เน็ตและบริการเว็บทั้งหมดคือ **HTTP (HyperText Transfer Protocol)** ซึ่งทำงานควบคู่กับรูปแบบสถาปัตยกรรม **REST (Representational State Transfer)** และการจัดโครงสร้างข้อมูลแบบ **JSON (JavaScript Object Notation)**

---

## 8.2 สถาปัตยกรรม Client/Server และวงจรชีวิต Request-Response

สถาปัตยกรรม HTTP ทำงานบนพื้นฐานโมเดล **ไคลเอนต์/เซิร์ฟเวอร์ (Client/Server Architecture)** แบบร้องขอ-ตอบกลับ (**Request-Response Cycle**):

```
┌─────────────────────────┐                            ┌─────────────────────────┐
│     HTTP Client         │ ── 1. HTTP Request ─────►  │       HTTP Server       │
│  (ESP32 Sensor Node)    │                            │  (Cloud API / Webhook)  │
│                         │ ◄── 2. HTTP Response ────  │                         │
└─────────────────────────┘                            └─────────────────────────┘
```

1. **Client (ไคลเอนต์):** ฝ่ายเริ่มต้นการสื่อสาร โดยสร้างและส่งคำร้อง (HTTP Request) ไปยังเซิร์ฟเวอร์ เช่น บอร์ด ESP32 อ่านค่าเซนเซอร์แล้วส่งไปบันทึก
2. **Server (เซิร์ฟเวอร์):** ฝ่ายรอรับคำร้อง ทำการประมวลผล บันทึกลงฐานข้อมูล และส่งข้อความตอบกลับ (HTTP Response) พร้อมรหัสสถานะกลับมายัง Client
3. **ลักษณะสำคัญของ HTTP (Stateless):** เซิร์ฟเวอร์ไม่เก็บสถานะ (State) ของการร้องขอก่อนหน้า แต่ละ Request เป็นอิสระจากกันอย่างสมบูรณ์ ดังนั้นทุก Request จึงต้องบรรจุข้อมูลการระบุตัวตน (เช่น API Token หรือ Authentication Header) ให้ครบถ้วนในตัว

---

## 8.3 โครงสร้างข้อความ HTTP (HTTP Message Format)

### 8.3.1 โครงสร้างของ HTTP Request

HTTP Request ประกอบด้วย 3 ส่วนหลัก:

```http
POST /api/v1/telemetry HTTP/1.1
Host: iot.company.com
Content-Type: application/json
Authorization: Bearer secret_api_token_12345
Content-Length: 54

{"deviceId":"ESP32-MTR01","temp":42.5,"vibration":1.82}
```

1. **Request Line:** ประกอบด้วย **HTTP Method** (`POST`), **Request-URI** (`/api/v1/telemetry`), และ **HTTP Version** (`HTTP/1.1`)
2. **Request Headers:** ส่วนหัวของข้อมูลที่บอกข้อมูลเมตา (Metadata) เช่น:
   - `Host`: โดเมนของเซิร์ฟเวอร์ปลายทาง
   - `Content-Type`: รูปแบบของข้อมูลใน Body (เช่น `application/json`)
   - `Content-Length`: ขนาดของเนื้อหาในหน่วยไบต์
   - `Authorization`: ข้อมูลรับรองสิทธิ์ (API Key / Token)
3. **Empty Line (`
`):** บรรทัดว่างสำหรับคั่นระหว่าง Headers และ Body
4. **Message Body (Payload):** ข้อมูลจริงที่ต้องการส่ง (สำหรับ POST/PUT) ในรูปแบบ JSON หรือ Plain Text

---

### 8.3.2 เมธอดของ HTTP (HTTP Methods) และการแมปกับ CRUD

| HTTP Method | หน้าที่หลัก | การทำงานในงาน IoT | คุณสมบัติ Safe | คุณสมบัติ Idempotent |
|---|---|---|:---:|:---:|
| **GET** | ร้องขออ่านข้อมูล (Read) | ดึงค่าสถานะล่าสุดหรือค่าคอนฟิกจากคลาวด์ | ✅ ใช่ | ✅ ใช่ |
| **POST** | สร้างข้อมูลใหม่ (Create) | ส่งข้อมูล Telemetry ของเซนเซอร์ขึ้นไปบันทึก | ❌ ไม่ | ❌ ไม่ |
| **PUT** | ปรับปรุงข้อมูลทั้งหมด (Update/Replace) | อัปเดตค่าพารามิเตอร์ของอุปกรณ์ใหม่ทั้งหมด | ❌ ไม่ | ✅ ใช่ |
| **PATCH** | ปรับปรุงข้อมูลบางส่วน (Partial Update) | แก้ไขค่าตัวแปรเฉพาะตัว (เช่น เปลี่ยนเฉพาะ Setpoint) | ❌ ไม่ | ❌ ไม่ |
| **DELETE** | ลบข้อมูล (Delete) | ลบประวัติข้อมูลเซนเซอร์เก่าออกจากฐานข้อมูล | ❌ ไม่ | ✅ ใช่ |

> 📌 **นิยามทางวิศวกรรม:**
> - **Safe:** การเรียกใช้เมธอดนี้จะไม่ทำให้ข้อมูลบนเซิร์ฟเวอร์เกิดการเปลี่ยนแปลง (เช่น การอ่านค่าด้วย GET)
> - **Idempotent:** การเรียกใช้เมธอดซ้ำหลายครั้งด้วยพารามิเตอร์เดิม จะให้ผลลัพธ์บนเซิร์ฟเวอร์เท่ากับการเรียกใช้เพียงครั้งเดียว (เช่น PUT, DELETE)

---

### 8.3.3 รหัสสถานะการตอบกลับของ HTTP (HTTP Status Codes)

เมื่อเซิร์ฟเวอร์ประมวลผลคำร้องเสร็จ จะส่ง Status Code ขนาด 3 หลักกลับมา:

| หมวดหมู่รหัส | ความหมาย | รหัสที่พบบ่อยใน IoT | คำอธิบาย |
|---|---|---|---|
| **2xx (Success)** | การร้องขอสำเร็จ | **`200 OK`**<br>**`201 Created`**<br>**`204 No Content`** | ส่งข้อมูลสำเร็จและได้รับข้อมูลตอบกลับ<br>เซิร์ฟเวอร์สร้าง Resource ใหม่สำเร็จ (พบบ่อยหลัง POST)<br>ประมวลผลสำเร็จแต่ไม่มีข้อมูล Body ส่งกลับ |
| **3xx (Redirection)** | เปลี่ยนเส้นทาง | **`301 Moved`**<br>**`302 Found`** | URL ปลายทางถูกย้ายไปยังตำแหน่งใหม่ |
| **4xx (Client Error)** | ความผิดพลาดฝั่งไคลเอนต์ | **`400 Bad Request`**<br>**`401 Unauthorized`**<br>**`403 Forbidden`**<br>**`404 Not Found`**<br>**`429 Too Many Requests`** | รูปแบบ JSON ผิดไวยากรณ์หรือไม่ถูกต้อง<br>ไม่ได้แนบ API Key หรือ Token หมดอายุ<br>ไม่มีสิทธิ์เข้าถึง Resource นั้น<br>ไม่มี Endpoint URL นี้บนเซิร์ฟเวอร์<br>ส่งข้อมูลถี่เกินอัตราที่เซิร์ฟเวอร์กำหนด (Rate Limit) |
| **5xx (Server Error)** | ความผิดพลาดฝั่งเซิร์ฟเวอร์ | **`500 Internal Error`**<br>**`502 Bad Gateway`**<br>**`503 Service Unavailable`** | เกิดข้อผิดพลาดภายในซอฟต์แวร์ของเซิร์ฟเวอร์<br>เซิร์ฟเวอร์ตัวกลางไม่ได้รับคำตอบจาก Backend<br>เซิร์ฟเวอร์โอเวอร์โหลดหรืออยู่ในระหว่างปรับปรุง |

---

## 8.4 สถาปัตยกรรม RESTful API (REST Architecture)

**REST (Representational State Transfer)** เป็นรูปแบบสถาปัตยกรรมซอฟต์แวร์สำหรับออกแบบเว็บเซอร์วิส โดยกำหนดให้ทุกสิ่งในระบบเป็น **ทรัพยากร (Resource)** ที่สามารถเข้าถึงได้ผ่าน **URI (Uniform Resource Identifier)** ที่ชัดเจน

### ตัวอย่างการออกแบบ RESTful Endpoints สำหรับระบบตรวจสอบเครื่องจักรโรงงาน:

```http
GET    /api/v1/machines                 # ดึงรายชื่อเครื่องจักรทั้งหมดในโรงงาน
GET    /api/v1/machines/MTR-01          # ดึงข้อมูลสถานะเฉพาะของเครื่องจักร MTR-01
POST   /api/v1/machines/MTR-01/telemetry # ส่งข้อมูลอุณหภูมิ/การสั่นสะเทือนของ MTR-01
PUT    /api/v1/machines/MTR-01/config   # ปรับเปลี่ยนค่าขีดจำกัดความเร็วรอบของ MTR-01
```

---

## 8.5 รูปแบบข้อมูล JSON และไลบรารี ArduinoJson

**JSON (JavaScript Object Notation)** เป็นมาตรฐานสากลในการจัดโครงสร้างข้อมูลแบบข้อความที่ทั้งมนุษย์และคอมพิวเตอร์สามารถอ่านเข้าใจได้ง่าย

### 8.5.1 ชนิดข้อมูลใน JSON (JSON Data Types)
- **Object:** ล้อมรอบด้วย `{ }` บรรจุคู่ Key-Value คั่นด้วยจุลภาค `,`
- **Array:** ล้อมรอบด้วย `[ ]` บรรจุรายการข้อมูลเรียงลำดับ
- **String:** สายอักขระในเครื่องหมายคำพูดคู่ `"text"`
- **Number:** ตัวเลขจำนวนเต็มหรือทศนิยม เช่น `100`, `25.4`
- **Boolean:** ค่าความจริง `true` หรือ `false`
- **Null:** ค่าว่าง `null`

### 8.5.2 ตัวอย่าง JSON Payload สำหรับ IoT Telemetry
```json
{
  "stationId": "PUMP_STATION_A",
  "timestamp": 1740000000,
  "sensors": {
    "temperature": 45.2,
    "vibration_rms": 2.14,
    "pressure_bar": 5.8
  },
  "status": {
    "motor_running": true,
    "fault_alarm": false
  }
}
```

### 8.5.3 การเขียนโค้ดแปลงข้อมูลด้วยไลบรารี ArduinoJson (v6/v7)

#### 1) การสร้าง JSON String (Serialization):
```cpp
#include <ArduinoJson.h>

// สร้างเอกสาร JSON ขนาดเหมาะสม
JsonDocument doc;

// ใส่ข้อมูลลงในตัวแปร Key-Value
doc["deviceId"] = "ESP32-STATION-01";
doc["temp"] = 38.4;
doc["vibration"] = 1.25;
doc["alarm"] = false;

// แปลง JSON Object เป็น String
String jsonPayload;
serializeJson(doc, jsonPayload);

// ผลลัพธ์: {"deviceId":"ESP32-STATION-01","temp":38.4,"vibration":1.25,"alarm":false}
```

#### 2) การแกะข้อมูลจาก JSON Response (Deserialization):
```cpp
String serverResponse = "{"status":"OK","command":"SET_SPEED","rpm":1450}";

JsonDocument doc;
DeserializationError error = deserializeJson(doc, serverResponse);

if (!error) {
  const char* status = doc["status"];      // "OK"
  const char* command = doc["command"];    // "SET_SPEED"
  int targetRpm = doc["rpm"];              // 1450
}
```

---

## 8.6 การสื่อสารปลอดภัยผ่าน HTTPS และ TLS/SSL บน ESP32

ในการส่งข้อมูลทางอุตสาหกรรม การใช้ HTTP แบบธรรมดา (Port 80) จะส่งข้อมูลดิบแบบไม่มีการเข้ารหัส ทำให้เสี่ยงต่อการถูกดักฟัง (Eavesdropping) หรือปลอมแปลงข้อมูล (Man-in-the-Middle Attack)

**HTTPS (HTTP Secure)** จะเข้ารหัสข้อมูลทั้งหมดด้วยโพรโทคอล **TLS/SSL (Transport Layer Security)** ผ่านพอร์ต **443**:
- บน ESP32 ใช้คลาส `WiFiClientSecure` ควบคู่กับ `HTTPClient`
- สามารถกำหนด Root Certificate (CA Cert) เพื่อยืนยันความถูกต้องของเซิร์ฟเวอร์ หรือใช้โหมด `setInsecure()` สำหรับการทดสอบในห้องปฏิบัติการ

</div>

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">

## 8.7 การทดลองและจำลองวงจรบน Wokwi Simulator

การทดลองนี้จำลองบอร์ด ESP32 อ่านค่าเซนเซอร์อุณหภูมิและความชื้น (DHT22) พร้อมจำลองการวัดแรงสั่นสะเทือนผ่าน Potentiometer จากนั้นสร้าง JSON Payload ส่งขึ้นสู่ Cloud REST API ผ่านคำสั่ง HTTP POST และรับคำสั่งควบคุมตอบกลับจากเซิร์ฟเวอร์

### 8.7.1 แผนผังการต่อวงจร (Wiring Table)

| อุปกรณ์ | ขาอุปกรณ์ | ขาบนบอร์ด ESP32 DevKit | หน้าที่ / หมายเหตุ |
|---|---|---|---|
| **DHT22 Sensor** | VCC | 3V3 | แหล่งจ่ายไฟ |
| | GND | GND | กราวด์ร่วม |
| | DATA | **GPIO 15** | ข้อมูลดิจิทัลอุณหภูมิและความชื้น |
| **Potentiometer (Vibration Sim)** | VCC / GND | 3V3 / GND | แหล่งจ่ายไฟและกราวด์ |
| | SIG (ขาปรับค่า) | **GPIO 34** | สัญญาณอนาล็อก ADC1 วัดการสั่นสะเทือน |
| **Relay / Status LED** | Anode (+) | **GPIO 13** | ไฟแสดงสถานะการเชื่อมต่อ HTTP |

---

### 8.7.2 โค้ดโปรแกรม Arduino C++ ส่งข้อมูล HTTP POST JSON

```cpp
/**
 * Chapter 8: ESP32 REST Client with JSON Telemetry
 * Framework: Arduino on ESP32 + Wokwi Simulator
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// การตั้งค่า WiFi จำลองของ Wokwi
const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASS = "";

// URL ปลายทาง REST API (ใช้ mock API สาธารณะสำหรับทดสอบ)
const char* SERVER_URL = "http://httpbin.org/post";

#define DHTPIN 15
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define VIBRATION_PIN 34
#define LED_STATUS_PIN 13

unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 5000; // ส่งข้อมูลทุก 5 วินาที

void connectWiFi() {
  Serial.print("[WIFI] Connecting to ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("
[WIFI] Connected successfully!");
  Serial.print("[WIFI] IP Address: ");
  Serial.println(WiFi.localIP());
}

void sendTelemetryData(float temp, float humid, float vibration) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[ERROR] WiFi disconnected, reconnecting...");
    connectWiFi();
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(4000); // กำหนด Timeout 4 วินาที

  // 1. สร้าง JSON Document
  JsonDocument doc;
  doc["deviceId"] = "ESP32-MACHINE-01";
  doc["uptime_sec"] = millis() / 1000;
  
  JsonObject metrics = doc["metrics"].to<JsonObject>();
  metrics["temperature_c"] = temp;
  metrics["humidity_pct"] = humid;
  metrics["vibration_g"] = vibration;

  doc["alarm_flag"] = (temp > 40.0 || vibration > 3.0);

  // 2. แปลงเป็น JSON String
  String requestBody;
  serializeJson(doc, requestBody);

  Serial.println("
--- [HTTP POST Request] ---");
  Serial.print("Target URL: "); Serial.println(SERVER_URL);
  Serial.print("Payload: "); Serial.println(requestBody);

  // 3. ส่งคำร้อง HTTP POST
  digitalWrite(LED_STATUS_PIN, HIGH); // เปิดไฟขณะกำลังส่ง
  int httpResponseCode = http.POST(requestBody);
  digitalWrite(LED_STATUS_PIN, LOW);

  // 4. ตรวจสอบผลลัพธ์การตอบกลับ
  if (httpResponseCode > 0) {
    Serial.printf("[HTTP Response] Status Code: %d
", httpResponseCode);
    String responseBody = http.getString();
    
    // แกะอ่านข้อมูล Response
    JsonDocument responseDoc;
    DeserializationError err = deserializeJson(responseDoc, responseBody);
    if (!err) {
      Serial.println("[HTTP Response] Successfully received JSON from server!");
    }
  } else {
    Serial.printf("[HTTP ERROR] Request failed, error: %s
", http.errorToString(httpResponseCode).c_str());
  }

  http.end(); // ปิดการเชื่อมต่อ
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_STATUS_PIN, OUTPUT);
  digitalWrite(LED_STATUS_PIN, LOW);

  dht.begin();
  connectWiFi();
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentMillis;

    // อ่านค่าเซนเซอร์
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    
    // แปลงค่า ADC (0-4095) เป็นแรงสั่นสะเทือนจำลอง 0.0 - 5.0 G
    int rawVib = analogRead(VIBRATION_PIN);
    float vibration = (rawVib / 4095.0) * 5.0;

    if (!isnan(temperature) && !isnan(humidity)) {
      sendTelemetryData(temperature, humidity, vibration);
    } else {
      Serial.println("[ERROR] Failed to read from DHT22!");
    }
  }
}
```

---

### 8.7.3 ไฟล์จำลอง `diagram.json` สำหรับ Wokwi

```json
{
  "version": 1,
  "author": "KSU TechEngineering",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-dht22", "id": "dht1", "top": -140, "left": 120, "attrs": { "temperature": "38.2", "humidity": "55" } },
    { "type": "wokwi-potentiometer", "id": "pot1", "top": -140, "left": -100, "attrs": { "value": "1800" } },
    { "type": "wokwi-led", "id": "led1", "top": 120, "left": 100, "attrs": { "color": "blue" } },
    { "type": "wokwi-resistor", "id": "r1", "top": 170, "left": 100, "attrs": { "value": "330" } }
  ],
  "connections": [
    [ "esp:3V3", "dht1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "dht1:GND", "black", [ "v0" ] ],
    [ "esp:15", "dht1:SDA", "blue", [ "v0" ] ],

    [ "esp:3V3", "pot1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "pot1:GND", "black", [ "v0" ] ],
    [ "esp:34", "pot1:SIG", "green", [ "v0" ] ],

    [ "esp:13", "led1:A", "orange", [ "v0" ] ],
    [ "led1:C", "r1:1", "black", [ "v0" ] ],
    [ "r1:2", "esp:GND", "black", [ "v0" ] ]
  ],
  "dependencies": {}
}
```

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

## 8.8 สรุปเนื้อหาและตารางอ้างอิงทางวิศวกรรม

### 8.8.1 ตารางเปรียบเทียบคุณสมบัติ HTTP Status Codes

| รหัสสถานะ | ชื่อสากล | ความหมาย | แนวทางปฏิบัติในการเขียนโปรแกรม MCU |
|:---:|---|---|---|
| **200** | OK | ร้องขอสำเร็จและได้รับข้อมูลตอบกลับ | ถอดรหัส JSON Response และนำค่าไปใช้งาน |
| **201** | Created | เซิร์ฟเวอร์สร้าง Resource สำเร็จ | ยืนยันว่าบันทึก Telemetry เข้าฐานข้อมูลแล้ว |
| **204** | No Content | สำเร็จแต่ไม่มี Body ตอบกลับ | ปิดการเชื่อมต่อและดำเนินการวัดค่ารอบถัดไป |
| **400** | Bad Request | ไวยากรณ์ JSON หรือ Parameter ผิดพลาด | พิมพ์ JSON String ออก Serial เพื่อตรวจสอบความถูกต้อง |
| **401** | Unauthorized | ไม่มีสิทธิ์ / Token ผิด | ตรวจสอบ API Key หรือ Authorization Header |
| **404** | Not Found | ไม่พบ Endpoint URL | ตรวจสอบ Path และ Domain Name |
| **429** | Too Many Requests | ส่งข้อมูลถี่เกินกำหนด (Rate Limit) | เพิ่มระยะเวลาหน่วง `SEND_INTERVAL` ให้นานขึ้น |
| **500** | Internal Server Error | เซิร์ฟเวอร์เกิดข้อผิดพลาด | รอเวลา (Backoff) แล้วลองส่งใหม่รอบถัดไป |

---

### 8.8.2 โครงสร้างไวยากรณ์ ArduinoJson Cheatsheet

```cpp
// 1. การสร้างและกำหนดค่าตัวแปร
JsonDocument doc;
doc["key_str"] = "Hello";
doc["key_int"] = 42;
doc["key_float"] = 3.1415;
doc["key_bool"] = true;

// 2. การสร้าง Nested Array
JsonArray arr = doc["readings"].to<JsonArray>();
arr.add(10.2);
arr.add(10.5);
arr.add(10.8);

// 3. แปลงเป็นข้อความ
String output;
serializeJson(doc, output);       // แบบบีบอัด (Compact) สำหรับส่งผ่านเน็ต
serializeJsonPretty(doc, Serial); // แบบจัดย่อหน้าสวยงามสำหรับ Debug

// 4. การคำนวณขนาดหน่วยความจำ
size_t len = measureJson(doc);
```

---

### 8.8.3 ข้อจำกัดของ HTTP ในงาน IoT เมื่อเทียบกับโพรโทคอลอื่น

1. **Header Overhead สูง:** การส่งค่าตัวเลขเพียงไม่กี่ไบต์ ต้องแนบ HTTP Header ขนาด $200 - 800	ext{ bytes}$ ทุกครั้ง ทำให้เปลือง Bandwidth เครือข่าย
2. **การเชื่อมต่อแบบเปิด-ปิด (Connection Overhead):** ทุกครั้งที่ส่งคำร้องต้องทำ TCP Handshake 3 ขั้นตอน (และ TLS Handshake อีกหลายขั้นตอนหากใช้ HTTPS)
3. **ทำงานแบบ Polling:** หากเซิร์ฟเวอร์ต้องการสั่งงานไมโครคอนโทรลเลอร์ ตัวบอร์ดต้องคอยส่งคำร้อง GET ไปถามเป็นระยะ ทำให้สิ้นเปลืองพลังงานและเกิดความหน่วง (Latency)

*ปัญหาเหล่านี้จะได้รับการแก้ไขด้วยโพรโทคอลแบบ Publish/Subscribe เช่น **MQTT** ในบทที่ 9*

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 8.9 โจทย์ท้าทายวิศวกรรม (Engineering Challenges)

### 🏆 โจทย์: ระบบบันทึกข้อมูลและส่งแจ้งเตือนการสั่นสะเทือนเครื่องจักรผ่าน REST API

โรงงานผลิตชิ้นงานกลึงอัตโนมัติ (CNC Milling) ต้องการติดตั้งระบบส่งข้อมูลการทำงานของมอเตอร์ขับหัวกัด (Spindle Motor) ขึ้นสู่ระบบคลาวด์ ERP ผ่าน REST API

#### เงื่อนไขการทำงาน (Specifications):
1. **การอ่านและประมวลผลข้อมูล:**
   - อ่านค่าอุณหภูมิผิวของมอเตอร์จากเซนเซอร์ DHT22 ($T$)
   - อ่านค่าความสั่นสะเทือน RMS จากสัญญาณอนาล็อก ($V_{rms}$)
2. **การส่งข้อมูล Telemetry ปกติ:**
   - ส่งข้อมูล JSON ผ่าน `HTTP POST` ทุก 10 วินาที ไปยัง Endpoint `/api/v1/cnc/telemetry`
3. **ระบบจัดการเหตุการณ์ฉุกเฉินและการแจ้งเตือน (Critical Event Alert):**
   - หากตรวจพบค่า $V_{rms} \ge 3.5	ext{ G}$ หรือ $T \ge 50.0^\circ	ext{C}$ ให้ส่ง Request ทันทีโดยไม่ต้องรอรอบ 10 วินาที ไปยัง Endpoint `/api/v1/cnc/alert`
4. **กลไกการส่งข้อมูลซ้ำเมื่อเครือข่ายขัดข้อง (Exponential Backoff Retry):**
   - หากส่งข้อมูลแล้วได้รับ Status Code อื่นที่ไม่ใช่ 200 หรือเกิด Timeout ให้ระบบทำการหน่วงเวลาและลองส่งใหม่แบบทวีคูณ ($1	ext{s} 
ightarrow 2	ext{s} 
ightarrow 4	ext{s} 
ightarrow 8	ext{s}$) สูงสุด 3 ครั้ง

#### สิ่งที่ต้องส่งและประเมินผล:
- [ ] ซอร์สโค้ดภาษา C++ ที่มีฟังก์ชัน Exponential Backoff และการจัดการ JSON สมบูรณ์
- [ ] ไฟล์ `diagram.json` และผลการจำลองบน Wokwi
- [ ] รายงานบันทึก Serial Monitor แสดงการทำงานในสภาวะปกติ และสภาวะจำลองเน็ตหลุด/ส่งซ้ำ

</div>
