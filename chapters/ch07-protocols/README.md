# Chapter 7: โพรโทคอลการสื่อสารสำหรับ IoT (HTTP/REST และ MQTT)
## Communication Protocols — HTTP/REST & MQTT

---

### 7.1 ทำไม IoT ต้องมีโพรโทคอลระดับแอป

ในบทก่อนหน้า เราเรียนรู้การเชื่อมต่อ ESP32 เข้ากับเครือข่าย Wi-Fi ซึ่งทำให้บอร์ดสามารถ "พูดคุย" ในระดับเครือข่าย (Network Layer) ได้แล้ว แต่การจะส่งข้อมูลเซ็นเซอร์ไปยังเซิร์ฟเวอร์ หรือสั่งงานอุปกรณ์จากระยะไกล เราต้องการ **โพรโทคอลระดับแอปพลิเคชัน (Application-Layer Protocol)** ที่กำหนดรูปแบบและกฎเกณฑ์ในการแลกเปลี่ยนข้อมูล

ลองนึกภาพง่าย ๆ — Wi-Fi เปรียบเสมือน "ถนน" ที่เชื่อมบ้านสองหลัง ส่วนโพรโทคอลระดับแอปคือ "ภาษา" ที่คนในบ้านทั้งสองใช้สื่อสารกัน ถ้าพูดคนละภาษาก็ไม่เข้าใจกัน

ในบทนี้เราจะเรียนรู้โพรโทคอล 2 ตัวที่สำคัญที่สุดในโลก IoT:

1. **HTTP/REST** — มาตรฐานของเว็บ เหมาะกับการร้องขอ-ตอบกลับ (Request/Response)
2. **MQTT** — โพรโทคอลน้ำหนักเบา เหมาะกับอุปกรณ์ IoT ที่มีทรัพยากรจำกัด

---

### 7.2 สถาปัตยกรรม Client/Server

ก่อนลงรายละเอียดโพรโทคอล ต้องเข้าใจแนวคิดพื้นฐานของสถาปัตยกรรม **ไคลเอนต์/เซิร์ฟเวอร์ (Client/Server)**:

- **Client (ไคลเอนต์)** — ฝ่ายที่ "ร้องขอ" บริการ เช่น ESP32 ที่ส่งค่าอุณหภูมิไปยังเซิร์ฟเวอร์
- **Server (เซิร์ฟเวอร์)** — ฝ่ายที่ "ให้บริการ" เช่น เว็บเซิร์ฟเวอร์ที่รับข้อมูลและจัดเก็บ

> 💡 **จำง่าย ๆ**: Client = คนสั่งอาหาร, Server = ร้านอาหาร — ลูกค้าสั่ง (Request) แล้วร้านเสิร์ฟ (Response)

ในโลก IoT บอร์ด ESP32 ของเรามักทำหน้าที่เป็น Client ที่ส่งข้อมูลไปยัง Cloud Server เช่น Blynk, Firebase หรือ Node-RED

---

### 7.3 HTTP: Request/Response

**HTTP (HyperText Transfer Protocol)** เป็นโพรโทคอลพื้นฐานของเว็บ ทำงานแบบ **Request/Response** — ไคลเอนต์ส่งคำร้อง (Request) ไปยังเซิร์ฟเวอร์ แล้วเซิร์ฟเวอร์ตอบกลับ (Response)

#### 7.3.1 HTTP Methods (เมธอดของ HTTP)

| Method | ความหมาย | ตัวอย่างการใช้งาน IoT |
|--------|----------|----------------------|
| **GET** | ดึงข้อมูล (Read) | อ่านค่าอุณหภูมิล่าสุดจากเซิร์ฟเวอร์ |
| **POST** | สร้างข้อมูลใหม่ (Create) | ส่งค่าเซ็นเซอร์ไปบันทึกบนเซิร์ฟเวอร์ |
| **PUT** | อัปเดตข้อมูลทั้งหมด (Update) | แก้ไขการตั้งค่าอุปกรณ์ |
| **DELETE** | ลบข้อมูล (Delete) | ลบล็อกข้อมูลเก่า |

#### 7.3.2 HTTP Status Codes (รหัสสถานะ)

| กลุ่มรหัส | ความหมาย | ตัวอย่าง |
|----------|----------|---------|
| **2xx** | สำเร็จ (Success) | `200 OK`, `201 Created` |
| **3xx** | เปลี่ยนเส้นทาง (Redirect) | `301 Moved Permanently` |
| **4xx** | ข้อผิดพลาดฝั่งไคลเอนต์ | `400 Bad Request`, `404 Not Found` |
| **5xx** | ข้อผิดพลาดฝั่งเซิร์ฟเวอร์ | `500 Internal Server Error` |

#### 7.3.3 โครงสร้างของ HTTP Message

**Request** ประกอบด้วย:
- **Request Line** — ระบุ Method, URL และเวอร์ชัน เช่น `POST /api/sensor HTTP/1.1`
- **Headers** — ข้อมูลเพิ่มเติม เช่น `Content-Type: application/json`
- **Body** — เนื้อหาข้อมูลที่ส่ง (ใช้กับ POST/PUT)

**Response** ประกอบด้วย:
- **Status Line** — เช่น `HTTP/1.1 200 OK`
- **Headers** — เช่น `Content-Length: 128`
- **Body** — ข้อมูลที่เซิร์ฟเวอร์ตอบกลับ

---

### 7.4 REST API และหลักการ

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

### 7.5 รูปแบบข้อมูล JSON

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

### 7.6 MQTT: รูปแบบ Publish/Subscribe

**MQTT (Message Queuing Telemetry Transport)** ถูกออกแบบมาเพื่ออุปกรณ์ IoT โดยเฉพาะ มีขนาดเล็ก (Lightweight) และใช้แบนด์วิดท์ต่ำ

#### 7.6.1 องค์ประกอบหลัก

MQTT ทำงานแบบ **Publish/Subscribe (Pub/Sub)** ซึ่งต่างจาก HTTP ตรงที่ไม่ต้องร้องขอโดยตรง:

- **Broker** — เซิร์ฟเวอร์ตัวกลางที่รับและกระจายข้อความ (เช่น Mosquitto, HiveMQ)
- **Publisher** — อุปกรณ์ที่ "เผยแพร่" ข้อมูลไปยัง Topic เช่น ESP32 ส่งค่าอุณหภูมิ
- **Subscriber** — อุปกรณ์ที่ "สมัครรับ" ข้อมูลจาก Topic ที่สนใจ

#### 7.6.2 โครงสร้าง Topic

Topic ใน MQTT จัดเป็นลำดับชั้น (Hierarchy) คล้ายโครงสร้างโฟลเดอร์:

```
building/floor1/room101/temperature
building/floor1/room101/humidity
building/floor2/room201/temperature
```

**Wildcard (ตัวแทน):**
- `+` แทนระดับเดียว — `building/+/room101/temperature` จะรับข้อมูลจากทุกชั้น
- `#` แทนหลายระดับ — `building/floor1/#` จะรับข้อมูลทั้งหมดของชั้น 1

#### 7.6.3 ระดับ QoS (Quality of Service)

| ระดับ QoS | ชื่อ | คำอธิบาย | การรับประกัน |
|-----------|------|----------|-------------|
| **0** | At most once | ส่งครั้งเดียว ไม่ยืนยัน | อาจสูญหาย — เร็วที่สุด |
| **1** | At least once | ส่งซ้ำจนกว่าจะได้รับ ACK | อาจซ้ำ — สมดุลดี |
| **2** | Exactly once | ใช้ Handshake 4 ขั้นตอน | ไม่ซ้ำ ไม่หาย — ช้าที่สุด |

#### 7.6.4 คุณสมบัติพิเศษ

- **Retained Message** — Broker เก็บข้อความล่าสุดไว้ เมื่อมี Subscriber ใหม่จะได้รับข้อมูลทันทีโดยไม่ต้องรอ Publisher ส่งใหม่
- **Last Will and Testament (LWT)** — ข้อความที่ Client ฝากไว้กับ Broker ตั้งแต่ตอนเชื่อมต่อ หาก Client หลุดโดยไม่ปกติ Broker จะส่งข้อความนี้แจ้งเตือน เช่น `"ESP32-001 offline"`

> 💡 **LWT เหมาะมากสำหรับ IoT** — เพราะอุปกรณ์ในภาคสนามอาจหลุดเชื่อมต่อได้ตลอดเวลา การแจ้งเตือนอัตโนมัติช่วยให้ระบบรู้สถานะอุปกรณ์แม้ไม่ได้รับข้อมูล

---

### 7.7 ตารางเปรียบเทียบ HTTP กับ MQTT

| เกณฑ์ | HTTP/REST | MQTT |
|-------|-----------|------|
| **รูปแบบการสื่อสาร** | Request/Response | Publish/Subscribe |
| **ขนาด Header** | ใหญ่ (หลายร้อยไบต์) | เล็กมาก (เริ่มต้น 2 ไบต์) |
| **การใช้พลังงาน** | สูง | ต่ำ |
| **การส่งข้อมูลแบบ Real-time** | ต้อง Polling หรือ WebSocket | รองรับโดยธรรมชาติ |
| **การส่งข้อมูลจาก Server → Client** | ทำได้ยาก | ทำได้ง่ายผ่าน Subscribe |
| **ความซับซ้อนในการติดตั้ง** | ต่ำ (ใช้ URL ธรรมดา) | ปานกลาง (ต้องมี Broker) |
| **QoS** | ไม่มี (ใช้ TCP รับประกัน) | มี 3 ระดับ |
| **เหมาะกับงาน** | ส่งข้อมูลไม่บ่อย, เรียก API | ส่งข้อมูลถี่, สั่งงานอุปกรณ์จำนวนมาก |

---

### 7.8 ตัวอย่างโค้ด ESP32

#### 7.8.1 ส่งข้อมูลผ่าน HTTP POST

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

#### 7.8.2 Publish/Subscribe ผ่าน MQTT

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

---

### สรุปท้ายบท

- **HTTP/REST** เหมาะสำหรับการส่งข้อมูลแบบ Request/Response ใช้ง่าย เข้ากับระบบเว็บที่มีอยู่ แต่มี Overhead สูงและไม่เหมาะกับการส่งข้อมูลถี่ ๆ
- **MQTT** ออกแบบมาสำหรับ IoT โดยเฉพาะ ใช้แบนด์วิดท์ต่ำ รองรับ Real-time และการสื่อสารแบบ Pub/Sub ที่ยืดหยุ่น
- **JSON** เป็นรูปแบบข้อมูลมาตรฐานที่ใช้ร่วมกับทั้ง HTTP และ MQTT
- ใช้ **QoS** ของ MQTT เลือกระดับความน่าเชื่อถือให้เหมาะกับงาน — QoS 0 สำหรับข้อมูลที่สูญหายได้ (เช่น อุณหภูมิที่ส่งทุกวินาที) และ QoS 1-2 สำหรับคำสั่งสำคัญ
- **LWT** และ **Retained Message** ช่วยให้ระบบ IoT มีความทนทาน (Resilient) แม้อุปกรณ์จะหลุดเชื่อมต่อ

---

### แบบฝึกหัดท้ายบท

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
