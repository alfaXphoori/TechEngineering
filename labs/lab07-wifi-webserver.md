# 🔬 Lab 7: Wi-Fi Web Server บน ESP32

> **รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
> **หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
> **เครื่องมือ:** Wokwi Simulator + ESP32  
> **เวลารวม:** ประมาณ 90 นาที

---

## วัตถุประสงค์

- อธิบายหลักการทำงานของ Wi-Fi บนไมโครคอนโทรลเลอร์ ESP32 ได้
- เชื่อมต่อ ESP32 เข้ากับเครือข่าย Wi-Fi โดยใช้คำสั่ง `WiFi.begin()` ได้
- สร้าง Web Server บน ESP32 เพื่อแสดงค่าเซนเซอร์ผ่านหน้าเว็บได้
- เพิ่มปุ่มควบคุม LED ผ่านหน้าเว็บและเข้าใจการรับ-ส่งคำสั่งผ่าน HTTP ได้

---

## ส่วนที่ 1: เชื่อมต่อ ESP32 กับ Wi-Fi (20 นาที)

### ความรู้เบื้องต้น

ESP32 มีโมดูล Wi-Fi ในตัว สามารถทำงานเป็น **Station (STA)** เพื่อเชื่อมต่อเข้าเราเตอร์ หรือเป็น **Access Point (AP)** เพื่อสร้างเครือข่ายเอง ใน Lab นี้เราจะใช้โหมด STA

> ⚠️ **Wokwi:** ใช้ชื่อ Wi-Fi `Wokwi-GUEST` และรหัสผ่านเป็นค่าว่าง `""` เท่านั้น ไม่ต้องตั้งค่าเพิ่ม

### ขั้นตอนปฏิบัติ

1. เปิด [wokwi.com](https://wokwi.com) แล้วสร้างโปรเจกต์ใหม่ เลือกบอร์ด **ESP32**
2. พิมพ์โค้ดต่อไปนี้ลงใน Editor:

```cpp
#include <WiFi.h>

const char* ssid = "Wokwi-GUEST";
const char* password = "";

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("กำลังเชื่อมต่อ Wi-Fi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nเชื่อมต่อสำเร็จ!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // ยังไม่มีการทำงานใน loop
}
```

3. กด **Start Simulation** แล้วเปิด Serial Monitor สังเกตผลลัพธ์
4. บันทึกผลที่ได้ลงตาราง:

| รายการ | ผลลัพธ์ที่ได้ |
|---|---|
| ชื่อ Wi-Fi ที่เชื่อมต่อ | |
| IP Address ที่ได้รับ | |
| ใช้เวลาเชื่อมต่อประมาณ (วินาที) | |

---

## ส่วนที่ 2: สร้าง Web Server แสดงค่าเซนเซอร์ (30 นาที)

### ขั้นตอนปฏิบัติ

1. เพิ่มเซนเซอร์อุณหภูมิ (NTC Thermistor) ในแผงวงจรของ Wokwi โดยต่อขาหนึ่งเข้า **GPIO 34** (ADC) และอีกขาเข้า **GND** พร้อมตัวต้านทาน pull-up 10kΩ เข้า **3.3V**
2. แก้ไขโค้ดเป็นดังนี้:

```cpp
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "Wokwi-GUEST";
const char* password = "";

WebServer server(80);

const int sensorPin = 34;

String buildHTML(float temperature) {
  String html = "<!DOCTYPE html><html><head>";
  html += "<meta charset='UTF-8'>";
  html += "<meta http-equiv='refresh' content='3'>";
  html += "<title>ESP32 Sensor</title>";
  html += "<style>";
  html += "body{font-family:Arial;text-align:center;background:#1a1a2e;color:#eee;padding:40px;}";
  html += ".card{background:#16213e;border-radius:12px;padding:30px;max-width:400px;margin:auto;}";
  html += ".value{font-size:48px;color:#e94560;font-weight:bold;}";
  html += "</style></head><body>";
  html += "<div class='card'>";
  html += "<h1>🌡️ ESP32 Sensor Monitor</h1>";
  html += "<p>อุณหภูมิปัจจุบัน</p>";
  html += "<p class='value'>" + String(temperature, 1) + " °C</p>";
  html += "</div></body></html>";
  return html;
}

float readTemperature() {
  int raw = analogRead(sensorPin);
  float voltage = raw * (3.3 / 4095.0);
  // สูตรประมาณอุณหภูมิจาก NTC (ค่าโดยประมาณ)
  float temperature = (voltage - 0.5) * 100.0;
  return temperature;
}

void handleRoot() {
  float temp = readTemperature();
  server.send(200, "text/html", buildHTML(temp));
}

void setup() {
  Serial.begin(115200);
  pinMode(sensorPin, INPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi Connected!");
  Serial.print("เปิดเบราว์เซอร์ไปที่: http://");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  server.handleClient();
}
```

3. กด **Start Simulation** แล้วคลิกลิงก์ IP ที่แสดงใน Serial Monitor
4. สังเกตหน้าเว็บที่ปรากฏ — หน้าเว็บจะรีเฟรชอัตโนมัติทุก 3 วินาที (`<meta http-equiv='refresh' content='3'>`)
5. บันทึกผล:

| ครั้งที่ | ค่า ADC (Raw) | อุณหภูมิที่แสดงบนเว็บ (°C) |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

---

## ส่วนที่ 3: เพิ่มปุ่มควบคุม LED ผ่านหน้าเว็บ (30 นาที)

### ขั้นตอนปฏิบัติ

1. เพิ่ม **LED** ต่อเข้า **GPIO 2** (ขายาว → GPIO 2 ผ่านตัวต้านทาน 220Ω, ขาสั้น → GND)
2. เพิ่มฟังก์ชันสร้าง HTML ที่มีปุ่มเปิด/ปิด LED โดยเพิ่ม/แก้ไขโค้ดดังนี้:

```cpp
const int ledPin = 2;
bool ledState = false;

String buildHTML(float temperature) {
  String html = "<!DOCTYPE html><html><head>";
  html += "<meta charset='UTF-8'>";
  html += "<title>ESP32 IoT Dashboard</title>";
  html += "<style>";
  html += "body{font-family:Arial;text-align:center;background:#1a1a2e;color:#eee;padding:40px;}";
  html += ".card{background:#16213e;border-radius:12px;padding:30px;max-width:400px;margin:auto;margin-bottom:20px;}";
  html += ".value{font-size:48px;color:#e94560;font-weight:bold;}";
  html += ".btn{padding:15px 40px;font-size:18px;border:none;border-radius:8px;cursor:pointer;margin:5px;}";
  html += ".on{background:#4ecca3;color:#000;} .off{background:#e94560;color:#fff;}";
  html += "</style></head><body>";
  html += "<div class='card'><h1>🌡️ Sensor</h1>";
  html += "<p class='value'>" + String(temperature, 1) + " °C</p></div>";
  html += "<div class='card'><h1>💡 LED Control</h1>";
  html += "<p>สถานะ: " + String(ledState ? "เปิด 🟢" : "ปิด 🔴") + "</p>";
  html += "<a href='/led/on'><button class='btn on'>เปิด</button></a> ";
  html += "<a href='/led/off'><button class='btn off'>ปิด</button></a>";
  html += "</div></body></html>";
  return html;
}
```

3. เพิ่ม handler สำหรับเส้นทาง (route) `/led/on` และ `/led/off`:

```cpp
void handleLedOn() {
  ledState = true;
  digitalWrite(ledPin, HIGH);
  server.sendHeader("Location", "/");
  server.send(303);
}

void handleLedOff() {
  ledState = false;
  digitalWrite(ledPin, LOW);
  server.sendHeader("Location", "/");
  server.send(303);
}
```

4. ใน `setup()` เพิ่ม:

```cpp
pinMode(ledPin, OUTPUT);
server.on("/led/on", handleLedOn);
server.on("/led/off", handleLedOff);
```

5. รันจำลองใหม่ ทดสอบกดปุ่มเปิด/ปิด LED บนหน้าเว็บ สังเกต LED บนวงจร
6. บันทึกผล:

| การทดสอบ | URL ที่เรียก | สถานะ LED | LED บนวงจร |
|---|---|---|---|
| กดปุ่ม "เปิด" | | | |
| กดปุ่ม "ปิด" | | | |

---

## ส่วนที่ 4: แบบฝึกหัดและคำถาม (10 นาที)

1. **HTTP Status Code 303** ที่ใช้ใน `handleLedOn()` มีความหมายว่าอย่างไร? ทำไมต้องใช้ `sendHeader("Location", "/")` ร่วมด้วย?

   > คำตอบ: .......................................................

2. ถ้าต้องการเพิ่มปุ่มควบคุม LED ดวงที่ 2 ที่ GPIO 4 ต้องเพิ่มหรือแก้ไขโค้ดส่วนใดบ้าง? (ระบุอย่างน้อย 3 จุด)

   > คำตอบ: .......................................................

3. `<meta http-equiv='refresh' content='3'>` ทำหน้าที่อะไร? ถ้าลบบรรทัดนี้ออก หน้าเว็บจะแสดงค่าเซนเซอร์อัปเดตหรือไม่? เพราะเหตุใด?

   > คำตอบ: .......................................................

4. **ท้าทาย (Bonus):** แก้ไขโค้ดให้หน้าเว็บแสดงเวลาที่ ESP32 ทำงานมาแล้ว (uptime) โดยใช้ฟังก์ชัน `millis()` — แปลงเป็นนาทีและวินาที แนบโค้ดที่แก้ไข

   > โค้ด: .......................................................

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จะประกาศใน Google Classroom)**

สิ่งที่ต้องส่ง:
1. ภาพหน้าจอ (Screenshot) หน้าเว็บที่แสดงค่าเซนเซอร์และปุ่ม LED
2. ภาพหน้าจอ Serial Monitor ที่แสดง IP Address
3. ลิงก์โปรเจกต์ Wokwi (กด Share → Copy Link)
4. ใบงานที่กรอกคำตอบครบทุกข้อ (ถ่ายรูปหรือพิมพ์)

### Checklist ก่อนส่ง

- [ ] ESP32 เชื่อมต่อ Wi-Fi สำเร็จ แสดง IP Address ใน Serial Monitor
- [ ] หน้าเว็บแสดงค่าอุณหภูมิจากเซนเซอร์ได้ถูกต้อง
- [ ] ปุ่มเปิด/ปิด LED บนหน้าเว็บทำงานได้จริง (LED บนวงจรเปลี่ยนสถานะ)
- [ ] กรอกตารางบันทึกผลครบทุกช่อง
- [ ] ตอบแบบฝึกหัดครบทุกข้อ (ข้อ Bonus ไม่บังคับ)
- [ ] แนบลิงก์ Wokwi โปรเจกต์ที่รันได้
