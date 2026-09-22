# 🔬 Lab 7: ESP32-S3 Standalone IoT Console & Web Server

> **รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
> **หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
> **เครื่องมือ:** Wokwi Simulator / บอร์ดจริง ESP32-S3 + เซนเซอร์ AHT25 (I2C) + LED 3 ดวง  
> **เวลารวม:** ประมาณ 90 - 120 นาที

---

## วัตถุประสงค์เชิงปฏิบัติการ

1. เชื่อมต่อและตั้งค่าไมโครคอนโทรลเลอร์ **ESP32-S3** ในโหมด **Soft Access Point (SoftAP)** เพื่อปล่อยสัญญาณ Wi-Fi โดยไม่ต้องพึ่งพาเราเตอร์ภายนอก
2. ดักจับเหตุการณ์เชื่อมต่อและตัดการเชื่อมต่อของอุปกรณ์ลูกข่ายผ่าน **Wi-Fi Event-Driven Programming (`WiFi.onEvent`)** พร้อมอ่านรหัส MAC Address
3. สื่อสารกับเซนเซอร์วัดอุณหภูมิและความชื้นสัมพัทธ์แบบดิจิทัล **AHT25** ผ่านบัส **I2C (SDA: GPIO 9, SCL: GPIO 8)**
4. สร้าง **Embedded Web Server** ที่ให้บริการทั้งหน้าเว็บ Single Page Application (SPA) และ REST-like JSON API (`/data`, `/toggle`, `/setall`)
5. พัฒนาระบบแสดงผลแบบ Real-time ด้วย **HTML5 Canvas** และระบบควบคุมไฟ LED แบบแยกดวงและปุ่มคำสั่งหลัก (Master Controls)

---

## ส่วนประกอบและวงจรฮาร์ดแวร์ (Hardware Components & Wiring)

### รายการอุปกรณ์
1. บอร์ดไมโครคอนโทรลเลอร์ ESP32-S3 DevKit (หรือจำลองบน Wokwi)
2. โมดูลเซนเซอร์วัดอุณหภูมิและความชื้นสัมพัทธ์ AHT25 / AHT20 (I2C)
3. หลอด LED 3 ดวง (สีเขียว, สีส้ม/เหลือง, สีแดง)
4. ตัวต้านทานลดกระแส $220\Omega$ หรือ $330\Omega$ จำนวน 3 ตัว
5. แผงต่อวงจร (Breadboard) และสายเชื่อมต่อ (Jumper Wires)

### ตารางการต่อวงจร (Wiring Table)

| อุปกรณ์ | ขาบนอุปกรณ์ | ขาบน ESP32-S3 | หน้าที่ / คำอธิบาย |
|---|---|---|---|
| **AHT25 Sensor** | **VCC** | **3V3** | ไฟเลี้ยง 3.3V DC |
| **AHT25 Sensor** | **GND** | **GND** | กราวด์ร่วม |
| **AHT25 Sensor** | **SDA** | **GPIO 9** | ข้อมูลบัส I2C |
| **AHT25 Sensor** | **SCL** | **GPIO 8** | สัญญาณนาฬิกาบัส I2C |
| **LED 1 (เขียว)** | ขายาว (Anode) ผ่าน R 220Ω | **GPIO 15** | สัญญาณดิจิทัลเอาต์พุต LED 1 |
| **LED 1 (เขียว)** | ขาสั้น (Cathode) | **GND** | กราวด์ร่วม |
| **LED 2 (เหลือง)** | ขายาว (Anode) ผ่าน R 220Ω | **GPIO 16** | สัญญาณดิจิทัลเอาต์พุต LED 2 |
| **LED 2 (เหลือง)** | ขาสั้น (Cathode) | **GND** | กราวด์ร่วม |
| **LED 3 (แดง)** | ขายาว (Anode) ผ่าน R 220Ω | **GPIO 17** | สัญญาณดิจิทัลเอาต์พุต LED 3 |
| **LED 3 (แดง)** | ขาสั้น (Cathode) | **GND** | กราวด์ร่วม |

---

## ส่วนที่ 1: การจำลองวงจรบน Wokwi (`diagram.json`)

หากทดสอบบน Wokwi ให้สร้างโปรเจกต์ใหม่เลือกบอร์ด **ESP32-S3** และนำโค้ด JSON ด้านล่างไปใส่ในแท็บ `diagram.json`:

```json
{
  "version": 1,
  "author": "Puri Chantima",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-s3-devkitc-1", "id": "esp", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-aht20", "id": "aht1", "top": -120, "left": 140, "attrs": {} },
    { "type": "wokwi-led", "id": "led1", "top": 120, "left": -100, "attrs": { "color": "green" } },
    { "type": "wokwi-resistor", "id": "r1", "top": 170, "left": -100, "attrs": { "value": "220" } },
    { "type": "wokwi-led", "id": "led2", "top": 120, "left": -40, "attrs": { "color": "yellow" } },
    { "type": "wokwi-resistor", "id": "r2", "top": 170, "left": -40, "attrs": { "value": "220" } },
    { "type": "wokwi-led", "id": "led3", "top": 120, "left": 20, "attrs": { "color": "red" } },
    { "type": "wokwi-resistor", "id": "r3", "top": 170, "left": 20, "attrs": { "value": "220" } }
  ],
  "connections": [
    [ "esp:3V3", "aht1:VIN", "red", [ "v0" ] ],
    [ "esp:GND", "aht1:GND", "black", [ "v0" ] ],
    [ "esp:9", "aht1:SDA", "blue", [ "v0" ] ],
    [ "esp:8", "aht1:SCL", "yellow", [ "v0" ] ],

    [ "esp:15", "led1:A", "green", [ "v0" ] ],
    [ "led1:C", "r1:1", "black", [ "v0" ] ],
    [ "r1:2", "esp:GND", "black", [ "v0" ] ],

    [ "esp:16", "led2:A", "orange", [ "v0" ] ],
    [ "led2:C", "r2:1", "black", [ "v0" ] ],
    [ "r2:2", "esp:GND", "black", [ "v0" ] ],

    [ "esp:17", "led3:A", "red", [ "v0" ] ],
    [ "led3:C", "r3:1", "black", [ "v0" ] ],
    [ "r3:2", "esp:GND", "black", [ "v0" ] ]
  ],
  "dependencies": {}
}
```

---

## ส่วนที่ 2: ซอร์สโค้ดภาษา C++ ประจำใบงาน

พิมพ์หรือคัดลอกโค้ดลงใน `sketch.ino` (อย่าลืมเพิ่มไลบรารี `Adafruit AHTX0`):

```cpp
#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_AHTX0.h>

// กำหนดขา I2C สำหรับ AHT25
#define I2C_SDA 9
#define I2C_SCL 8

// กำหนดขา LED
#define LED1 15
#define LED2 16
#define LED3 17

const char* ssid = "ESP32S3_DASHBOARD";
const char* password = "password123";

WebServer server(80);
Adafruit_AHTX0 aht;
bool aht_found = false;

// สถานะไฟ LED
bool led1State = false;
bool led2State = false;
bool led3State = false;

float lastTemp = 0.0;
float lastHum = 0.0;

// โค้ดหน้าเว็บ Dashboard
const char MAIN_page[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ESP32-S3 IoT Console</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background-color: #0d1117; color: #e6edf3; padding: 20px 12px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
    
    .header { text-align: center; margin-bottom: 20px; width: 100%; max-width: 600px; }
    .header h1 { font-size: 24px; font-weight: 700; color: #58a6ff; }
    .header p { font-size: 13px; color: #8b949e; margin-top: 4px; }

    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; width: 100%; max-width: 600px; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    .card-title { font-size: 14px; text-transform: uppercase; letter-spacing: 0.8px; color: #8b949e; margin-bottom: 12px; font-weight: 600; display: flex; justify-content: space-between; }
    .val-display { font-size: 32px; font-weight: 800; margin-bottom: 12px; }
    .temp-accent { color: #ff7b72; }
    .hum-accent { color: #58a6ff; }

    canvas { width: 100%; height: 160px; background: #0d1117; border-radius: 10px; border: 1px solid #21262d; }

    /* ปุ่ม Master Controls (เปิด/ปิด ทั้งหมด) */
    .master-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
    .btn-master {
      padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 700;
      border: 1px solid transparent; cursor: pointer; transition: 0.2s;
    }
    .btn-all-on { background: #238636; color: #fff; border-color: #2ea043; }
    .btn-all-on:hover { background: #2ea043; }
    .btn-all-off { background: #da3633; color: #fff; border-color: #f85149; }
    .btn-all-off:hover { background: #f85149; }

    /* ปุ่มเปิด-ปิด LED แต่ละดวง */
    .btn-group { display: flex; flex-direction: column; gap: 10px; }
    .led-btn {
      display: flex; justify-content: space-between; align-items: center;
      background: #21262d; border: 1px solid #30363d; border-radius: 12px;
      padding: 14px 18px; color: #c9d1d9; font-size: 15px; font-weight: 600;
      cursor: pointer; transition: all 0.25s ease;
    }
    .led-btn:active { transform: scale(0.98); }
    .led-indicator { width: 14px; height: 14px; border-radius: 5px; background: #484f58; transition: all 0.3s ease; }

    .led-btn.active { background: #1f3527; border-color: #2ea043; color: #fff; }
    .led-btn.active .led-indicator { background: #3fb950; box-shadow: 0 0 10px #3fb950; }

    /* กล่องข้อมูลผู้จัดทำ ย้ายมาไว้ล่างสุด */
    .student-card {
      background: linear-gradient(135deg, #161b22, #0d1117);
      border: 1px solid #30363d;
      border-radius: 14px;
      padding: 16px 20px;
      margin-top: 20px;
      width: 100%;
      max-width: 600px;
      text-align: center;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }
    .student-card .label { font-size: 12px; color: #8b949e; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
    .student-card .name { font-size: 20px; font-weight: 700; color: #58a6ff; margin-top: 4px; }
    .student-card .detail { font-size: 12px; color: #8b949e; margin-top: 4px; }
  </style>
</head>
<body>

  <div class="header">
    <h1>ESP32-S3 IoT Console</h1>
    <p id="clock">กำลังเชื่อมต่อข้อมูล...</p>
  </div>

  <div class="grid">
    <!-- กราฟอุณหภูมิ -->
    <div class="card">
      <div class="card-title"><span>Temperature</span><span>&deg;C</span></div>
      <div class="val-display temp-accent"><span id="tVal">--</span> <small style="font-size:18px;">&deg;C</small></div>
      <canvas id="tempChart" width="400" height="160"></canvas>
    </div>

    <!-- กราฟความชื้น -->
    <div class="card">
      <div class="card-title"><span>Humidity</span><span>%RH</span></div>
      <div class="val-display hum-accent"><span id="hVal">--</span> <small style="font-size:18px;">%</small></div>
      <canvas id="humChart" width="400" height="160"></canvas>
    </div>

    <!-- ควบคุม LED -->
    <div class="card">
      <div class="card-title">LED Remote Control</div>
      
      <!-- ปุ่มเปิด/ปิด ทั้งหมด -->
      <div class="master-controls">
        <button class="btn-master btn-all-on" onclick="setAllLED(1)">⚡ เปิดทั้งหมด (ALL ON)</button>
        <button class="btn-master btn-all-off" onclick="setAllLED(0)">🔌 ปิดทั้งหมด (ALL OFF)</button>
      </div>

      <div class="btn-group">
        <button id="btn1" class="led-btn" onclick="toggle(1)">
          <span>LED 1 (GPIO 15)</span><span class="led-indicator"></span>
        </button>
        <button id="btn2" class="led-btn" onclick="toggle(2)">
          <span>LED 2 (GPIO 16)</span><span class="led-indicator"></span>
        </button>
        <button id="btn3" class="led-btn" onclick="toggle(3)">
          <span>LED 3 (GPIO 17)</span><span class="led-indicator"></span>
        </button>
      </div>
    </div>
  </div>

  <!-- การ์ดชื่อผู้จัดทำ ย้ายมาไว้ล่างสุดของหน้าเว็บ -->
  <div class="student-card">
    <div class="label">ผู้จัดทำโครงงาน (Developer)</div>
    <div class="name">ภูริ จันทิมา</div>
    <div class="detail">ESP32-S3 Standalone AP &bull; AHT25 I2C Sensor &bull; Web Server</div>
  </div>

<script>
  const maxPoints = 20;
  let tData = [];
  let hData = [];

  function drawGraph(canvasId, dataArr, strokeColor, fillColor) {
    const cvs = document.getElementById(canvasId);
    const ctx = cvs.getContext('2d');
    const w = cvs.width, h = cvs.height;
    ctx.clearRect(0, 0, w, h);

    if (dataArr.length < 2) return;

    let min = Math.min(...dataArr);
    let max = Math.max(...dataArr);
    let pad = (max - min) * 0.2 || 2;
    min = Math.floor(min - pad);
    max = Math.ceil(max + pad);

    const getY = val => h - ((val - min) / (max - min)) * (h - 30) - 15;
    const step = w / (maxPoints - 1);

    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 1; i <= 3; i++) {
      let y = (h / 4) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;

    for (let i = 0; i < dataArr.length; i++) {
      let x = i * step;
      let y = getY(dataArr[i]);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        let prevX = (i - 1) * step;
        let prevY = getY(dataArr[i - 1]);
        let cx = (prevX + x) / 2;
        ctx.bezierCurveTo(cx, prevY, cx, y, x, y);
      }
    }
    ctx.stroke();

    ctx.lineTo((dataArr.length - 1) * step, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    let grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, fillColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function setButton(id, state) {
    const el = document.getElementById(id);
    if (state) el.classList.add('active');
    else el.classList.remove('active');
  }

  function applyData(data) {
    document.getElementById('tVal').innerText = data.temp.toFixed(1);
    document.getElementById('hVal').innerText = data.hum.toFixed(1);
    document.getElementById('clock').innerText = 'อัปเดตข้อมูลล่าสุด: ' + new Date().toLocaleTimeString();

    setButton('btn1', data.led1);
    setButton('btn2', data.led2);
    setButton('btn3', data.led3);

    tData.push(data.temp);
    hData.push(data.hum);
    if (tData.length > maxPoints) { tData.shift(); hData.shift(); }

    drawGraph('tempChart', tData, '#ff7b72', 'rgba(255, 123, 114, 0.25)');
    drawGraph('humChart', hData, '#58a6ff', 'rgba(88, 166, 255, 0.25)');
  }

  function toggle(num) {
    fetch('/toggle?led=' + num)
      .then(res => res.json())
      .then(data => applyData(data))
      .catch(e => console.error(e));
  }

  function setAllLED(state) {
    fetch('/setall?state=' + state)
      .then(res => res.json())
      .then(data => applyData(data))
      .catch(e => console.error(e));
  }

  function fetchData() {
    fetch('/data')
      .then(res => res.json())
      .then(data => applyData(data))
      .catch(e => {
        document.getElementById('clock').innerText = 'สถานะ: ขาดการเชื่อมต่อ';
      });
  }

  setInterval(fetchData, 1500);
  fetchData();
</script>
</body>
</html>
)rawliteral";

// ตรวจจับการเชื่อมต่อ Wi-Fi
void WiFiEvent(WiFiEvent_t event, WiFiEventInfo_t info) {
  switch (event) {
    case ARDUINO_EVENT_WIFI_AP_STACONNECTED: {
      Serial.println("\n------------------------------------------------");
      Serial.print("📱 [ALERT] มีอุปกรณ์เชื่อมต่อเข้ามาใหม่!");
      Serial.printf("\n   MAC Address: %02X:%02X:%02X:%02X:%02X:%02X\n",
                    info.wifi_ap_staconnected.mac[0], info.wifi_ap_staconnected.mac[1],
                    info.wifi_ap_staconnected.mac[2], info.wifi_ap_staconnected.mac[3],
                    info.wifi_ap_staconnected.mac[4], info.wifi_ap_staconnected.mac[5]);
      Serial.printf("   จำนวนเครื่องที่กำลังเชื่อมต่อ: %d เครื่อง\n", WiFi.softAPgetStationNum());
      Serial.println("------------------------------------------------");
      break;
    }
    case ARDUINO_EVENT_WIFI_AP_STADISCONNECTED: {
      Serial.println("\n------------------------------------------------");
      Serial.print("📴 [ALERT] อุปกรณ์ตัดการเชื่อมต่อออกไป");
      Serial.printf("\n   MAC Address: %02X:%02X:%02X:%02X:%02X:%02X\n",
                    info.wifi_ap_stadisconnected.mac[0], info.wifi_ap_stadisconnected.mac[1],
                    info.wifi_ap_stadisconnected.mac[2], info.wifi_ap_stadisconnected.mac[3],
                    info.wifi_ap_stadisconnected.mac[4], info.wifi_ap_stadisconnected.mac[5]);
      Serial.printf("   คงเหลือเชื่อมต่อ: %d เครื่อง\n", WiFi.softAPgetStationNum());
      Serial.println("------------------------------------------------");
      break;
    }
    default:
      break;
  }
}

void readSensors() {
  if (aht_found) {
    sensors_event_t hum, temp;
    if (aht.getEvent(&hum, &temp)) {
      lastTemp = temp.temperature;
      lastHum = hum.relative_humidity;
    }
  }
}

String getJsonPayload() {
  String json = "{";
  json += "\"temp\":" + String(lastTemp, 2) + ",";
  json += "\"hum\":" + String(lastHum, 2) + ",";
  json += "\"led1\":" + String(led1State ? "true" : "false") + ",";
  json += "\"led2\":" + String(led2State ? "true" : "false") + ",";
  json += "\"led3\":" + String(led3State ? "true" : "false");
  json += "}";
  return json;
}

void handleRoot() {
  server.send(200, "text/html; charset=UTF-8", MAIN_page);
}

void handleData() {
  readSensors();
  server.send(200, "application/json", getJsonPayload());
}

void handleToggle() {
  if (server.hasArg("led")) {
    int num = server.arg("led").toInt();
    if (num == 1) { led1State = !led1State; digitalWrite(LED1, led1State ? HIGH : LOW); }
    if (num == 2) { led2State = !led2State; digitalWrite(LED2, led2State ? HIGH : LOW); }
    if (num == 3) { led3State = !led3State; digitalWrite(LED3, led3State ? HIGH : LOW); }
    Serial.printf("[ACTION] LED %d เปลี่ยนเป็น -> %s\n", num, (num == 1 ? led1State : (num == 2 ? led2State : led3State)) ? "ON" : "OFF");
  }
  handleData();
}

// จัดการคำสั่ง เปิด/ปิด LED ทั้งหมดพร้อมกัน
void handleSetAll() {
  if (server.hasArg("state")) {
    int state = server.arg("state").toInt();
    bool targetState = (state == 1);
    led1State = targetState;
    led2State = targetState;
    led3State = targetState;
    digitalWrite(LED1, targetState ? HIGH : LOW);
    digitalWrite(LED2, targetState ? HIGH : LOW);
    digitalWrite(LED3, targetState ? HIGH : LOW);
    Serial.printf("[ACTION] สั่งงาน LED ทั้งหมด -> %s\n", targetState ? "ALL ON" : "ALL OFF");
  }
  handleData();
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n================================================");
  Serial.println("   โครงงาน: ESP32-S3 IoT Dashboard + AHT25");
  Serial.println("   ผู้จัดทำ: ภูริ จันทิมา");
  Serial.println("================================================");

  // ขา LED
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  digitalWrite(LED1, LOW);
  digitalWrite(LED2, LOW);
  digitalWrite(LED3, LOW);

  // เชื่อมต่อเซนเซอร์ AHT25
  Wire.begin(I2C_SDA, I2C_SCL);
  if (!aht.begin(&Wire)) {
    Serial.printf("❌ [SENSOR] ตรวจไม่พบ AHT25 (SDA: %d, SCL: %d)\n", I2C_SDA, I2C_SCL);
    aht_found = false;
  } else {
    Serial.println("✅ [SENSOR] เชื่อมต่อ AHT25 สำเร็จ");
    aht_found = true;
  }

  // ลงทะเบียน Event Wi-Fi
  WiFi.onEvent(WiFiEvent);

  // เปิด AP Mode
  WiFi.mode(WIFI_AP);
  WiFi.softAP(ssid, password);
  Serial.printf("📡 [AP READY] Wi-Fi SSID: %s\n", ssid);
  Serial.printf("🌐 [WEB URL] เปิดได้ที่: http://%s\n", WiFi.softAPIP().toString().c_str());

  // Routing
  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.on("/toggle", handleToggle);
  server.on("/setall", handleSetAll);

  server.begin();
  Serial.println("🚀 Web Server พร้อมทำงานแล้ว\n");
}

void loop() {
  server.handleClient();
}
```

---

## ส่วนที่ 3: ขั้นตอนการทดลองและบันทึกผลการทำงาน (40 นาที)

### 3.1 การเชื่อมต่อ Wi-Fi และ Event Logging
1. อัปโหลดโค้ดลงบอร์ด ESP32-S3 หรือกด **Start Simulation** บน Wokwi
2. ใช้สมาร์ตโฟนหรือคอมพิวเตอร์ ค้นหาสัญญาณ Wi-Fi ชื่อ `ESP32S3_DASHBOARD` และเชื่อมต่อด้วยรหัสผ่าน `password123`
3. สังเกตผลลัพธ์บน Serial Monitor และบันทึกข้อมูล:

| พารามิเตอร์ที่ตรวจสอบ | ผลลัพธ์ที่แสดงบน Serial Monitor |
|---|---|
| **สถานะการค้นพบเซนเซอร์ AHT25** | |
| **Wi-Fi SSID** | |
| **Web Server IP URL** | |
| **MAC Address ของอุปกรณ์ที่เชื่อมต่อเข้ามา** | |
| **จำนวนอุปกรณ์ที่เชื่อมต่อ (Station Count)** | |

---

### 3.2 การทดสอบหน้าเว็บและการดึงข้อมูลแบบ Asynchronous Polling
1. เปิดเว็บเบราว์เซอร์ไปยัง `http://192.168.4.1`
2. ทดสอบความเร็วในการอัปเดตข้อมูลเซนเซอร์ และสังเกตกราฟแบบ Real-time
3. ทดสอบการกดปุ่มควบคุม และบันทึกผลลงในตาราง:

| การทดสอบ | ปุ่มที่กดบนหน้าเว็บ | สถานะที่ปรากฏบนหน้าเว็บ | สถานะหลอด LED บนวงจร | ข้อความบน Serial Monitor |
|---|---|---|---|---|
| 1 | กด **LED 1 (GPIO 15)** | | | |
| 2 | กด **LED 2 (GPIO 16)** | | | |
| 3 | กด **LED 3 (GPIO 17)** | | | |
| 4 | กด **⚡ เปิดทั้งหมด (ALL ON)** | | | |
| 5 | กด **🔌 ปิดทั้งหมด (ALL OFF)** | | | |

---

## ส่วนที่ 4: แบบฝึกหัดและคำถามท้ายการทดลอง (20 นาที)

1. **สถาปัตยกรรม Wi-Fi SoftAP:** ทำไมบอร์ด ESP32-S3 ในโหมด SoftAP จึงสามารถสื่อสารกับอุปกรณ์มือถือได้โดยตรงแม้ไม่มีสัญญาณอินเทอร์เน็ตหรือเราเตอร์ภายนอก? และข้อจำกัดสำคัญของโหมดนี้คืออะไร?

   > คำตอบ: .......................................................................................................................

2. **ประสิทธิภาพของ JSON REST API:** เพราะเหตุใดการใช้คำสั่ง `fetch('/data')` เพื่อดึงข้อมูล JSON มาอัปเดตเฉพาะ DOM Element จึงมีประสิทธิภาพดีกว่าการใช้ `<meta http-equiv='refresh' content='2'>` เพื่อโหลดหน้าเว็บใหม่ทั้งหมด?

   > คำตอบ: .......................................................................................................................

3. **Event-Driven vs Loop Polling:** ฟังก์ชัน `WiFiEvent()` ทำงานบนหลักการใด และมีประโยชน์อย่างไรต่อความปลอดภัยและความน่าเชื่อถือของระบบอุตสาหกรรม?

   > คำตอบ: .......................................................................................................................

4. **โจทย์ท้าทาย (Bonus):** หากต้องการเปลี่ยนเซนเซอร์ AHT25 เป็นเซนเซอร์ตัวอื่นที่ส่งค่าความดันบรรยากาศ (เช่น BMP280) ต้องปรับแก้ฟังก์ชัน `getJsonPayload()`, โค้ด HTML ใน `MAIN_page`, และ JavaScript ส่วนใดบ้าง?

   > คำตอบ: .......................................................................................................................

---

## การส่งงาน

> 📋 ส่งงานผ่านระบบประเมินผลออนไลน์ตามที่ผู้สอนกำหนด

สิ่งที่ต้องส่ง:
1. ภาพหน้าจอ (Screenshot) หน้าเว็บ Dashboard ที่แสดงกราฟอุณหภูมิและความชื้น พร้อมไฟสถานะ LED
2. ภาพหน้าจอ Serial Monitor ขณะตรวจพบการเชื่อมต่ออุปกรณ์และ MAC Address
3. ลิงก์โปรเจกต์ Wokwi (กด Share → Copy Link) หรือวิดีโอสาธิตการทำงานจริง
4. ใบงานสรุปผลการทดลองที่ตอบคำถามครบถ้วน
