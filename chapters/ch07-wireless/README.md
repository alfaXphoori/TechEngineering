---
layout: default
title: "บทที่ 7: การสื่อสารไร้สายสำหรับงานวิศวกรรม (ESP32-S3 IoT Console & Web Server)"
permalink: /chapters/ch07-wireless/
---

# Chapter 7: การสื่อสารไร้สายสำหรับงานวิศวกรรม (Wireless Communications in Engineering)

## ESP32-S3 Standalone Access Point, AHT25 I2C Sensor & Real-time Web Dashboard

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

> ### 🎯 ผลลัพธ์การเรียนรู้และการเชื่อมโยง (Constructive Alignment)
>
> - **สัปดาห์การเรียนรู้:** สัปดาห์ที่ 7 & 8 — เครือข่ายไร้สายพื้นฐานและการพัฒนาคอนโซลควบคุม IoT (Wi-Fi SoftAP, I2C Sensor Interfacing, Embedded Web Server)
> - **ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs):**
>   - **CLO2:** เลือกใช้และอธิบายเทคโนโลยีไร้สาย โพรโทคอลการสื่อสาร และการแลกเปลี่ยนข้อมูลสำหรับระบบ IoT ได้
>   - **CLO3:** ออกแบบและพัฒนาระบบ IoT ที่เชื่อมต่อเซนเซอร์/ตัวกระทำ สื่อสารข้อมูล และแสดงผลผ่านโปรแกรมของผู้ใช้ได้
>   - **CLO4:** ปฏิบัติการสร้าง ทดสอบ และประยุกต์ใช้ระบบ IoT ไร้สาย พร้อมแสดงผลข้อมูลแบบเรียลไทม์และทำงานเป็นทีมอย่างรับผิดชอบ
> - **ผลลัพธ์การเรียนรู้ระดับบทเรียน (LLOs):**
>   - **LLO7.1:** อธิบายหลักการทำงานของ Wi-Fi ในโหมด Access Point (SoftAP) และการจัดการ Event ขาเข้า-ออกของเครือข่ายไร้สายได้ (CLO2)
>   - **LLO7.2:** สื่อสารกับเซนเซอร์ดิจิทัล AHT25 ผ่านบัส I2C และส่งข้อมูลผ่าน Embedded Web Server ในรูปแบบ JSON ได้ (CLO3, CLO4)
>   - **LLO7.3:** พัฒนา Web Dashboard แบบ Asynchronous Polling พร้อมระบบควบคุมอุปกรณ์หลายช่องสัญญาณ (Multi-channel & Master Controls) ได้ (CLO3, CLO4)
>
---

<div class="chapter-tabs-nav" markdown="0">
  <button class="chapter-tab-btn active" data-tab-target="#concept">💡 ทฤษฎีและหลักการ (Concept)</button>
  <button class="chapter-tab-btn" data-tab-target="#sim">🎮 ปฏิบัติการและโค้ด (Interactive Sim)</button>
  <button class="chapter-tab-btn" data-tab-target="#waveform">📊 สรุปและอ้างอิง (Reference / Summary)</button>
  <button class="chapter-tab-btn" data-tab-target="#challenge">🏆 แบบฝึกหัดท้าทาย (Challenge)</button>
</div>

---

<div class="chapter-tab-content active" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 7.1 สถาปัตยกรรมการสื่อสารไร้สาย Wi-Fi บนไมโครคอนโทรลเลอร์ ESP32-S3

ในงานวิศวกรรมเครื่องกลและระบบอัตโนมัติอุตสาหกรรม มีหลายสถานการณ์ที่ไม่สามารถเชื่อมต่ออุปกรณ์เข้ากับโครงสร้างพื้นฐานเครือข่ายอินเทอร์เน็ตเดิมได้ เช่น เครื่องจักรกลที่ติดตั้งในพื้นที่ห่างไกล, ตู้ควบคุมเคลื่อนที่ (Mobile Machine Consoles), หรือเครื่องจักรที่ต้องการแยกเครือข่ายเพื่อความปลอดภัย (Air-gapped Systems) ไมโครคอนโทรลเลอร์ **ESP32-S3** จึงเป็นชิปประมวลผลที่ได้รับความนิยมอย่างสูง เนื่องจากมีโมดูลวิทยุ Wi-Fi 2.4 GHz (802.11 b/g/n) และ Bluetooth 5 (LE) ภายในตัว สามารถทำหน้าที่เป็นตัวส่งและสร้างเครือข่ายไร้สายได้ด้วยตนเอง

### 7.1.1 การเปรียบเทียบโหมด Wi-Fi: Station (STA) vs Soft Access Point (SoftAP)

โมดูล Wi-Fi ของ ESP32 รองรับรูปแบบการทำงาน 3 รูปแบบหลัก:

| คุณลักษณะทางเทคนิค | Station Mode (STA) | Soft Access Point Mode (SoftAP) | Concurrent Mode (AP + STA) |
|---|---|---|---|
| **บทบาทในเครือข่าย** | ทำหน้าที่เป็น **ลูกข่าย (Client)** เชื่อมต่อไปยัง Wi-Fi Router | ทำหน้าที่เป็น **ศูนย์กลางเครือข่าย (Hotspot)** ปล่อยสัญญาณให้ผู้อื่นเชื่อมต่อ | ทำงานทั้งเป็น Client และปล่อย Hotspot ไปพร้อมกัน |
| **ความต้องการเราเตอร์ภายนอก** | **จำเป็น** ต้องมี Wi-Fi Router หรือ Mobile Hotspot | **ไม่จำเป็น** ทำงานได้สมบูรณ์แบบ Standalone | จำเป็นสำหรับฝั่ง STA แต่ฝั่ง AP ไม่ต้องมี |
| **การแจกจ่ายหมายเลข IP** | รอรับ IP จาก DHCP Server ของ Router | **มี DHCP Server ภายในตัว** แจกจ่าย IP ให้ไคลเอนต์อัตโนมัติ | จัดการทั้งสองฝั่งแยกซับเน็ต |
| **หมายเลข IP เริ่มต้น** | ผันแปรตามวงแลนภายนอก (เช่น `192.168.1.X`) | **คงที่เสมอ** โดยเริ่มต้นคือ `192.168.4.1` | ฝั่ง AP คงที่ ฝั่ง STA ผันแปร |
| **การเชื่อมต่อไปยังอินเทอร์เน็ตภายนอก** | เชื่อมต่อไปยัง Internet ได้โดยตรง | **จำกัดเฉพาะ Local Network** (อินทราเน็ตภายในเครื่อง) | สามารถทำ Packet Forwarding ได้ |
| **การประยุกต์ใช้งานในงานวิศวกรรม** | ส่งข้อมูลขึ้น Cloud (MQTT, HTTP POST, InfluxDB) | **หน้าปัดควบคุมเครื่องจักรไร้สาย (Local Machine Console/HMI)**, การตั้งค่าหน้างาน (Field Commissioning) | เกตเวย์รับข้อมูลเซนเซอร์ในเครื่องแล้วรีเลย์ส่งต่อ |

```
[ โหมด SoftAP ของ ESP32-S3 (Standalone Local Network) ]

  ┌─────────────────────────────────────────────────────────────┐
  │                 ESP32-S3 Dual-Core SoC                      │
  │                                                             │
  │  ┌───────────────────────┐       ┌───────────────────────┐  │
  │  │   Wi-Fi SoftAP        │       │   Embedded WebServer  │  │
  │  │   SSID: ESP32S3_...   │ <───> │   Port: 80 (HTTP)     │  │
  │  │   IP: 192.168.4.1     │       │   JSON REST Endpoints │  │
  │  └───────────▲───────────┘       └───────────▲───────────┘  │
  └──────────────┼───────────────────────────────┼──────────────┘
                 │ Wi-Fi 2.4 GHz (WPA2-PSK)      │
       ┌─────────┴─────────┐           ┌─────────┴─────────┐
       │                   │           │                   │
  ┌────┴────────────┐ ┌────┴────────────┐ ┌────┴────────────┐
  │ สมาร์ตโฟนช่างกล │ │ แท็บเล็ตตรวจสอบ │ │ โน้ตบุ๊กทดสอบ   │
  │ 192.168.4.2     │ │ 192.168.4.3     │ │ 192.168.4.4     │
  └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 7.1.2 กลไกการทำงานของ SoftAP และ DHCP Server ใน ESP32-S3

เมื่อสั่งงาน `WiFi.mode(WIFI_AP)` และ `WiFi.softAP(ssid, password)` ตัวควบคุมคลื่นวิทยุ (Baseband & MAC Layer) ของ ESP32-S3 จะเริ่มดำเนินการดังนี้:
1. **การแพร่กระจายสัญญาณ Beacon Frames:** ESP32-S3 จะส่งแพ็กเก็ต Beacon ออกไปในอากาศทุกๆ 100 ms (Target Beacon Transmission Time - TBTT) เพื่อประกาศ SSID, รูปแบบการเข้ารหัส (WPA2-Personal/PSK) และ Channel ความถี่
2. **การเจรจาเชื่อมต่อ (4-Way Handshake):** เมื่อไคลเอนต์ (เช่น สมาร์ตโฟน) ป้อนรหัสผ่าน ชิปจะดำเนินการยืนยันตัวตนด้วย Pairwise Master Key (PMK)
3. **การแจกจ่าย IP ผ่าน Internal DHCP Server:** ทันทีที่การยืนยันตัวตนสำเร็จ เซิร์ฟเวอร์ DHCP ภายใน ESP-IDF (LwIP Stack) จะแจกหมายเลข IP ให้อุปกรณ์ลูกข่าย โดยเริ่มตั้งแต่ `192.168.4.2` เป็นต้นไป พร้อมกำหนดให้เกตเวย์และเซิร์ฟเวอร์ DNS ชี้มาที่ `192.168.4.1`

### 7.1.3 การจัดการเหตุการณ์เครือข่ายไร้สาย (Wi-Fi Event-Driven Architecture)

ในการพัฒนาเฟิร์มแวร์วิศวกรรมระดับมืออาชีพ การวนลูปตรวจสอบสถานะ Wi-Fi ซ้ำๆ (Polling) เป็นวิธีที่เปลืองทรัพยากรซีพียูและตอบสนองช้า ระบบของ ESP32 มีระบบส่งต่อสัญญาณขัดจังหวะของระบบปฏิบัติการ FreeRTOS เรียกว่า **Wi-Fi Events** ซึ่งสามารถดักจับสถานะผ่านฟังก์ชัน `WiFi.onEvent(callback)` ได้โดยตรง

```cpp
void WiFiEvent(WiFiEvent_t event, WiFiEventInfo_t info) {
  switch (event) {
    case ARDUINO_EVENT_WIFI_AP_STACONNECTED:
      // มีอุปกรณ์เชื่อมต่อเข้ามาใหม่: ดึง MAC Address และนับจำนวนเครื่อง
      Serial.printf("MAC: %02X:%02X:%02X:%02X:%02X:%02X | Total: %d\n",
                    info.wifi_ap_staconnected.mac[0], info.wifi_ap_staconnected.mac[1],
                    info.wifi_ap_staconnected.mac[2], info.wifi_ap_staconnected.mac[3],
                    info.wifi_ap_staconnected.mac[4], info.wifi_ap_staconnected.mac[5],
                    WiFi.softAPgetStationNum());
      break;
    case ARDUINO_EVENT_WIFI_AP_STADISCONNECTED:
      // มีอุปกรณ์ตัดการเชื่อมต่อ: ตรวจสอบความปลอดภัยทันที
      Serial.printf("Device disconnected | Remaining: %d\n", WiFi.softAPgetStationNum());
      break;
  }
}
```

ประโยชน์เชิงวิศวกรรมของการดักจับ Event:
- **Audit Logging & Security:** สามารถบันทึกรหัสเฉพาะ (MAC Address) ของอุปกรณ์ช่างที่เข้ามาเชื่อมต่อกับเครื่องจักร เพื่อใช้เป็นหลักฐานการเข้าปฏิบัติงาน
- **Session Tracking:** ใช้ทราบจำนวนผู้ควบคุมเครื่องที่กำลังเข้าถึงระบบพร้อมกัน ป้องกันการสั่งงานซ้ำซ้อน

---

## 7.2 การเชื่อมต่อเซนเซอร์ดิจิทัลความแม่นยำสูง AHT25 ผ่านบัส I2C

### 7.2.1 ลักษณะทางกายภาพและโครงสร้างของเซนเซอร์ AHT25 / AHT20

เซนเซอร์ **AHT25** (ผลิตโดย Aosong/Guangzhou ASAIR) เป็นเซนเซอร์วัดอุณหภูมิและความชื้นสัมพัทธ์แบบดิจิทัลรุ่นปรับปรุงที่รวมชิปตรวจจับความจุไฟฟ้าเซมิคอนดักเตอร์ (MEMS capacitive humidity sensing element) เข้ากับเซนเซอร์วัดอุณหภูมิมาตรฐานสูงและชิป ASIC สำหรับประมวลผลสัญญาณภายในตัว

```
  ┌─────────────────── AHT25 Module ───────────────────┐
  │                                                    │
  │   [ VCC ] ──────────── แหล่งจ่ายไฟ 3.3V DC         │
  │   [ SDA ] ──────────── สายข้อมูล I2C (Serial Data) │
  │   [ GND ] ──────────── กราวด์ร่วม (Common GND)     │
  │   [ SCL ] ──────────── สัญญาณนาฬิกา I2C (Clock)    │
  │                                                    │
  │   • ย่านวัดอุณหภูมิ: -40°C ถึง +85°C (±0.3°C)     │
  │   • ย่านวัดความชื้น: 0% ถึง 100% RH (±2% RH)      │
  │   • I2C Address: 0x38 (ความเร็วสูงสุด 400 kHz)    │
  └────────────────────────────────────────────────────┘
```

### 7.2.2 การกำหนดขา I2C บน ESP32-S3 (Custom I2C Pin Mapping)

ชิป **ESP32-S3** มีโมดูลฮาร์ดแวร์ I2C Master ภายใน 2 ช่อง (I2C0 และ I2C1) จุดเด่นของ ESP32-S3 คือมีวงจร **GPIO Matrix** ภายใน ทำให้เราสามารถกำหนดขา GPIO ใดๆ เป็นขา SDA และ SCL ได้โดยไม่จำกัดตายตัว

ในโครงงานนี้ มีการกำหนดขาใช้งานดังนี้:
- **SDA (Data Line):** ใช้ขา **GPIO 9**
- **SCL (Clock Line):** ใช้ขา **GPIO 8**

คำสั่งภาษา C++ ในการเปิดบัส I2C ด้วยขาที่ระบุ:
```cpp
#define I2C_SDA 9
#define I2C_SCL 8

Wire.begin(I2C_SDA, I2C_SCL);
if (!aht.begin(&Wire)) {
  Serial.println("❌ ไม่พบเซนเซอร์ AHT25!");
  aht_found = false;
} else {
  Serial.println("✅ ตรวจพบและเชื่อมต่อ AHT25 สำเร็จ");
  aht_found = true;
}
```

### 7.2.3 การอ่านค่าแบบ Non-blocking และ Fault-Tolerant Fallback

หากสายสัญญาณเซนเซอร์หลุด หรือเกิดสัญญาณรบกวนในโรงงานจนบัส I2C หยุดตอบสนอง เฟิร์มแวร์ระบบวิศวกรรมที่ดีต้อง **ไม่ค้าง (Hang/Freeze)** ฟังก์ชัน `readSensors()` ใช้ระบบตรวจสอบเงื่อนไข `aht_found` และส่งคืนค่าเดิมล่าสุด (`lastTemp`, `lastHum`) เพื่อให้ระบบ Web Server ยังคงทำงานและให้บริการควบคุม LED ต่อไปได้โดยไม่หยุดชะงัก

---

## 7.3 สถาปัตยกรรม Embedded Web Server และ REST JSON API

### 7.3.1 เปรียบเทียบสถาปัตยกรรม Web Dashboard ในระบบฝังตัว

ในการนำเสนอข้อมูลผ่านหน้าเว็บจากบอร์ดไมโครคอนโทรลเลอร์ มีแนวทางการออกแบบ 2 แบบที่มีข้อดีข้อเสียต่างกันอย่างสิ้นเชิง:

```
[ แบบดั้งเดิม (Traditional Full Page Reload) ]
เบราว์เซอร์ ──(1) ขอหน้าเว็บ ──► ESP32 (ประมวลผล HTML ใหม่ทั้งหน้า 5-10 KB)
เบราว์เซอร์ ◄──(2) ส่ง HTML เต็ม ── ESP32 (หน้าเว็บกะพริบ ทุกๆ 3 วินาที ซีพียูโหลดสูง)

[ แบบโมเดิร์น (SPA + RESTful JSON Polling) ]
เบราว์เซอร์ ──(1) ดาวน์โหลดแอปครั้งแรก ──► ESP32 (ส่ง MAIN_page ครั้งเดียว จบ)
เบราว์เซอร์ ──(2) fetch('/data') ทุก 1.5s ─► ESP32 (อ่านเซนเซอร์ & สร้าง JSON ~80 ไบต์)
เบราว์เซอร์ ◄──(3) ส่งเฉพาะ JSON กะทัดรัด ─ ESP32 (หน้าเว็บไม่กะพริบ อัปเดตลื่นไหล)
```

### 7.3.2 รายละเอียด Routing และ Endpoint บน `WebServer`

เฟิร์มแวร์ในโครงงานนี้ใช้ไลบรารี `WebServer.h` และกำหนดเส้นทางข้อมูล (Routing Table) ดังนี้:

| Endpoint (URL) | HTTP Method | รูปแบบข้อมูลตอบกลับ | หน้าที่การทำงาน |
|---|---|---|---|
| `/` | `GET` | `text/html; charset=UTF-8` | ส่งหน้าเว็บ Single Page Application (`MAIN_page`) จาก Flash Memory |
| `/data` | `GET` | `application/json` | ส่งสถานะเซนเซอร์และสถานะ LED ทั้ง 3 ช่องในรูปแบบ JSON |
| `/toggle?led={1,2,3}` | `GET` | `application/json` | สลับสถานะของ LED ตามหมายเลขที่ส่งมา และตอบกลับ JSON สถานะใหม่ทันที |
| `/setall?state={0,1}` | `GET` | `application/json` | สั่งเปิดทั้งหมด (`state=1`) หรือปิดทั้งหมด (`state=0`) และตอบกลับ JSON |

### 7.3.3 โครงสร้าง JSON Payload

```json
{
  "temp": 28.45,
  "hum": 62.10,
  "led1": true,
  "led2": false,
  "led3": true
}
```
ข้อดีของรูปแบบนี้คือ ขนาดข้อมูลเล็กมาก (น้อยกว่า 90 ไบต์) ส่งผ่านเครือข่ายไร้สายได้ภายในเวลาไม่ถึง 2 มิลลิวินาที ทำให้ความเร็วการตอบสนองในการกดปุ่มควบคุมแทบจะเกิดขึ้นทันที (Near Zero Latency)

---

## 7.4 การพัฒนาหน้ากากควบคุมอัจฉริยะ (Modern Web Dashboard Architecture)

### 7.4.1 การเก็บซอร์สโค้ดหน้าเว็บบน Flash ด้วย `PROGMEM`

เนื่องจากหน่วยความจำแรม (SRAM) ของไมโครคอนโทรลเลอร์มีจำกัด การสร้างตัวแปร String ขนาดใหญ่เพื่อเก็บหน้าเว็บ HTML/CSS/JS จะทำให้แรมเต็มและบอร์ดรีเซ็ตตัวเอง การใช้คีย์เวิร์ด `PROGMEM` และ Raw String Literal `R"rawliteral(...)rawliteral"` จะสั่งให้คอมไพเลอร์เก็บโค้ดหน้าเว็บไว้ในหน่วยความจำแฟลช (Flash ROM) ซึ่งมีขนาดใหญ่ (4MB – 16MB) และอ่านส่งให้ไคลเอนต์โดยตรง

### 7.4.2 การพล็อตกราฟแบบเรียลไทม์ด้วย HTML5 Canvas และเส้นโค้ง Bézier

หน้าเว็บของโครงงานนี้ไม่พึ่งพาไลบรารีภายนอกอย่าง Chart.js หรือ Highcharts (Zero External Dependency) ทำให้สามารถแสดงผลกราฟได้อย่างรวดเร็วแม้ไม่มีการเชื่อมต่ออินเทอร์เน็ตภายนอก โดยเขียนฟังก์ชัน `drawGraph()` บน HTML5 Canvas API:

1. **Auto-scaling:** หาค่าต่ำสุด (`min`) และค่าสูงสุด (`max`) จากชุดข้อมูล แล้วเพิ่มระยะเผื่อ (Padding) 20% เพื่อให้รูปคลื่นกราฟอยู่ตรงกลางกรอบ ไม่ชนขอบบนหรือขอบล่าง
2. **Cubic Bézier Smoothing:** แทนที่จะลากเส้นตรงหักมุมแบบฟันปลา (`lineTo`) อัลกอริทึมจะคำนวณจุดควบคุมกึ่งกลาง (`cx = (prevX + x) / 2`) แล้วใช้คำสั่ง `ctx.bezierCurveTo(cx, prevY, cx, y, x, y)` เพื่อให้เส้นกราฟมีความโค้งมนสวยงามระดับโปรดักชัน
3. **Linear Gradient Fill:** ลงสีไล่ระดับใต้เส้นกราฟด้วย `ctx.createLinearGradient()` จากค่าความโปร่งแสง 25% ด้านบน สู่โปร่งแสง 0% ด้านล่าง เพื่อให้ดูมีมิติเหมือนแดชบอร์ดอุตสาหกรรมยุคใหม่

```
  y (Min-Max Scaled)
  ▲
  │            ╭───────╮ (Cubic Bézier Interpolation)
  │    ╭───────╯       ╰──────╮
  │   ╱                        ╲
  │  ╱   Gradient Fill (25%)    ╲
  └──┴───────────────────────────┴────────► x (Time Series, Max 20 points)
```

---

## 7.5 การเปรียบเทียบเทคโนโลยีการสื่อสารไร้สายในงานวิศวกรรม

| เกณฑ์เปรียบเทียบ | Wi-Fi SoftAP (ESP32-S3) | Wi-Fi Station (STA) | Bluetooth Low Energy (BLE) | LoRaWAN |
|---|---|---|---|---|
| **ความถี่วิทยุ** | 2.4 GHz ISM | 2.4 / 5 GHz ISM | 2.4 GHz ISM | Sub-GHz (920-925 MHz ไทย) |
| **ระยะการส่งสัญญาณ** | 30 – 100 เมตร | 30 – 100 เมตร | 10 – 50 เมตร | **2 – 15 กิโลเมตร** |
| **อัตราการส่งข้อมูล** | สูง (11 – 150 Mbps) | สูง (11 – 150 Mbps) | ปานกลาง (1 – 2 Mbps) | ต่ำมาก (0.3 – 50 kbps) |
| **อินเทอร์เฟซผู้ใช้** | **เว็บเบราว์เซอร์มาตรฐาน** (ไม่ต้องลงแอป) | เว็บเบราว์เซอร์ หรือ Cloud | ต้องมีแอปเฉพาะ (Web Bluetooth / Mobile App) | แดชบอร์ดบน Cloud Gateway |
| **การใช้พลังงาน** | ปานกลาง-สูง (100-240 mA) | ปานกลาง-สูง (100-240 mA) | **ต่ำมาก** (10-15 mA) | **ต่ำที่สุด** (10 mA ขณะส่ง) |
| **ความเหมาะสมทางวิศวกรรม** | คอนโซลควบคุมเครื่องจักรหน้างาน, แท่นทดสอบ | เชื่อมต่อระบบโรงงานเดิม (SCADA / MES) | เซนเซอร์แบบพกพา, อุปกรณ์วัดสวมใส่ | เซนเซอร์การเกษตร, สถานีวัดน้ำระยะไกล |

</div>

---

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">

## 7.6 ปฏิบัติการ: สร้างระบบคอนโซล IoT ไร้สายด้วย ESP32-S3 และ AHT25 Web Server

**รหัสปฏิบัติการ:** LAB-07 | **เวลาปฏิบัติการ:** 3 ชั่วโมง  
**เป้าหมายการเรียนรู้:** LLO7.1, LLO7.2, LLO7.3 (CLO2, CLO3, CLO4)  
**อุปกรณ์ที่ใช้:** บอร์ดไมโครคอนโทรลเลอร์ ESP32-S3, โมดูลเซนเซอร์ AHT25 (I2C), หลอด LED 3 ดวง, ตัวต้านทาน $220\Omega$ หรือ $330\Omega$ 3 ตัว, เบรดบอร์ด และสายต่อวงจร

---

### 7.6.1 แผนผังการต่อวงจรเชิงฮาร์ดแวร์ (Hardware Wiring Table)

| อุปกรณ์ที่เชื่อมต่อ | ขาบนตัวอุปกรณ์ | ขาบนบอร์ด ESP32-S3 | หน้าที่ทางวิศวกรรม / ข้อกำหนดทางไฟฟ้า |
|---|---|---|---|
| **AHT25 Sensor** | **VCC** | **3V3** | แหล่งจ่ายแรงดันไฟฟ้ากระแสตรง 3.3V เสถียร |
| **AHT25 Sensor** | **GND** | **GND** | กราวด์ร่วมของระบบ (Common Ground) |
| **AHT25 Sensor** | **SDA** | **GPIO 9** | สัญญาณข้อมูลบัส I2C (Serial Data) |
| **AHT25 Sensor** | **SCL** | **GPIO 8** | สัญญาณนาฬิกาบัส I2C (Serial Clock) |
| **LED 1 (ไฟแสดงสถานะ 1)** | ขา Anode (+) ผ่าน R 220Ω | **GPIO 15** | สัญญาณดิจิทัลเอาต์พุต ควบคุม LED ดวงที่ 1 |
| **LED 1 (ไฟแสดงสถานะ 1)** | ขา Cathode (-) | **GND** | กราวด์ร่วม |
| **LED 2 (ไฟแสดงสถานะ 2)** | ขา Anode (+) ผ่าน R 220Ω | **GPIO 16** | สัญญาณดิจิทัลเอาต์พุต ควบคุม LED ดวงที่ 2 |
| **LED 2 (ไฟแสดงสถานะ 2)** | ขา Cathode (-) | **GND** | กราวด์ร่วม |
| **LED 3 (ไฟแสดงสถานะ 3)** | ขา Anode (+) ผ่าน R 220Ω | **GPIO 17** | สัญญาณดิจิทัลเอาต์พุต ควบคุม LED ดวงที่ 3 |
| **LED 3 (ไฟแสดงสถานะ 3)** | ขา Cathode (-) | **GND** | กราวด์ร่วม |

---

### 7.6.2 โครงสร้างไฟล์วงจร `diagram.json` สำหรับการจำลองบน Wokwi

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

### 7.6.3 ซอร์สโค้ดภาษา C++ ฉบับสมบูรณ์ (Complete Project Source Code)

คัดลอกโค้ดด้านล่างนี้ลงในโปรแกรม Arduino IDE หรือแท็บ `sketch.ino` บน Wokwi โดยติดตั้งไลบรารี **Adafruit AHTX0** ผ่าน Library Manager ให้เรียบร้อยก่อนทำการคอมไพล์:

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

### 7.6.4 ขั้นตอนการทดสอบและการทดลองเชิงปฏิบัติการ (Step-by-Step Testing)

1. **การคอมไพล์และอัปโหลดโปรแกรม:**
   - เลือกบอร์ดใน Arduino IDE เป็น **ESP32S3 Dev Module** (หรือรันจำลองบน Wokwi)
   - เปิด Serial Monitor ที่อัตราความเร็ว **115200 baud**
   - สังเกตข้อความ Boot: บอร์ดจะเริ่มค้นหา AHT25 และเริ่มปล่อยสัญญาณ Access Point
   - ตรวจสอบ URL ที่ได้: ปกติจะเป็น `http://192.168.4.1`
2. **การเชื่อมต่อ Wi-Fi จากอุปกรณ์ภายนอก:**
   - ใช้โทรศัพท์มือถือหรือแล็ปท็อป เปิดหน้าต่างค้นหาสัญญาณ Wi-Fi
   - เลือกเชื่อมต่อ SSID: `ESP32S3_DASHBOARD` ป้อนรหัสผ่าน `password123`
   - สังเกต Serial Monitor: ฟังก์ชัน `WiFiEvent` จะแจ้งเตือนทันที พร้อมพิมพ์รหัส **MAC Address** ของอุปกรณ์ที่เชื่อมต่อเข้ามาใหม่ และระบุจำนวนไคลเอนต์ปัจจุบัน
3. **การเข้าถึง Web Dashboard และการทดสอบ Real-time Graph:**
   - เปิดเว็บเบราว์เซอร์ (Chrome, Safari, Firefox) แล้วไปที่ `http://192.168.4.1`
   - สังเกตหน้าปัดคอนโซลสีเข้ม (Dark Mode) จะแสดงค่าอุณหภูมิและความชื้น
   - กราฟ Canvas ทั้งสองช่องจะเริ่มพล็อตจุดข้อมูลต่อเนื่องทุก 1.5 วินาที
   - ทดสอบให้ความร้อนหรือเป่าลมชื้นใส่เซนเซอร์ AHT25 สังเกตความเปลี่ยนแปลงของกราฟที่ปรับสเกลแกน Y โดยอัตโนมัติ
4. **การทดสอบระบบควบคุมไฟ LED (Individual & Master Controls):**
   - ทดสอบคลิกปุ่ม **LED 1 (GPIO 15)**: ไฟสถานะบนหน้าเว็บจะเปลี่ยนเป็นสีเขียวเรืองแสง และหลอด LED 1 บนวงจรจะสว่างขึ้นทันที
   - ตรวจสอบหน้าต่าง Serial Monitor: จะมีข้อความยืนยัน `[ACTION] LED 1 เปลี่ยนเป็น -> ON`
   - ทดสอบคลิกปุ่ม **⚡ เปิดทั้งหมด (ALL ON)**: หลอด LED ทั้ง 3 ดวงจะต้องสว่างพร้อมกันทันที
   - ทดสอบคลิกปุ่ม **🔌 ปิดทั้งหมด (ALL OFF)**: หลอด LED ทั้ง 3 ดวงจะต้องดับพร้อมกันทั้งหมด
5. **การทดสอบความทนทานต่อการตัดการเชื่อมต่อ:**
   - ทดลองปิด Wi-Fi บนโทรศัพท์มือถือ สังเกต Serial Monitor จะแสดงข้อความ `📴 [ALERT] อุปกรณ์ตัดการเชื่อมต่อออกไป` พร้อมอัปเดตจำนวนคงเหลือ

</div>

---

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

## สรุปบทเรียน (Summary & Key Takeaways)

1. **Wi-Fi SoftAP Mode** ทำให้ ESP32-S3 สามารถสร้างเครือข่ายอินทราเน็ตเฉพาะกิจได้ด้วยตนเองโดยไม่ต้องพึ่งพาเราเตอร์ภายนอก โดยแจกจ่าย IP อัตโนมัติและกำหนดให้ตัวเองอยู่ที่ `192.168.4.1`
2. **Event-Driven Architecture (`WiFi.onEvent`)** มีประสิทธิภาพและเสถียรกว่าการตรวจเช็กแบบ Polling ในฟังก์ชัน loop() ทำให้สามารถดักจับการเชื่อมต่อ/ตัดการเชื่อมต่อ และบันทึก MAC Address ของอุปกรณ์ไคลเอนต์ได้ทันที
3. **การสื่อสาร I2C บน ESP32-S3** สามารถกำหนดขา SDA และ SCL ไปยังขา GPIO ใดๆ ก็ได้ผ่านคำสั่ง `Wire.begin(SDA, SCL)` โดยโมดูล AHT25 ให้ค่าความแม่นยำสูงและมีความเสถียรต่อสัญญาณรบกวน
4. **Asynchronous Polling ผ่าน JSON API** มีประสิทธิภาพเหนือกว่าการรีเฟรชหน้าเว็บแบบดั้งเดิมอย่างมหาศาล เนื่องจากลดขนาดข้อมูลรับส่งลงเหลือไม่ถึง 100 ไบต์ ขจัดปัญหาหน้าเว็บกะพริบ และตอบสนองต่อการสั่งงานได้ในระดับมิลลิวินาที
5. **HTML5 Canvas Zero-Dependency** สามารถพล็อตกราฟแบบ Real-time พร้อมฟังก์ชัน Auto-scaling และการปรับเส้นโค้ง Cubic Bézier ได้อย่างลื่นไหลโดยไม่ต้องเชื่อมต่ออินเทอร์เน็ตภายนอกเพื่อโหลดไลบรารี

---

## ตารางสรุป API Endpoints และโครงสร้างข้อมูล

| Endpoint | Method | พารามิเตอร์ | ตัวอย่างการเรียกใช้งาน | ผลลัพธ์ (Response JSON) |
|---|---|---|---|---|
| `/` | `GET` | - | `http://192.168.4.1/` | HTML5 Document (Content-Type: text/html) |
| `/data` | `GET` | - | `http://192.168.4.1/data` | `{"temp":29.10,"hum":58.40,"led1":false,"led2":true,"led3":false}` |
| `/toggle` | `GET` | `led={1,2,3}` | `http://192.168.4.1/toggle?led=1` | JSON สถานะปัจจุบันหลังสลับสถานะ LED 1 |
| `/setall` | `GET` | `state={0,1}` | `http://192.168.4.1/setall?state=1` | JSON สถานะปัจจุบันหลังสั่งเปิด LED ทั้งหมด |

---

## คู่มือตรวจสอบและแก้ไขข้อผิดพลาด (Troubleshooting Guide)

| อาการผิดปกติ | สาเหตุที่เป็นไปได้ | แนวทางแก้ไขทางวิศวกรรม |
|---|---|---|
| **Serial ขึ้นข้อความ `❌ ตรวจไม่พบ AHT25`** | 1. ต่อสาย SDA / SCL สลับขากัน<br>2. ลืมต่อตัวต้านทาน Pull-up (กรณีใช้โมดูลไม่มี Pull-up ในตัว)<br>3. ไฟเลี้ยงไม่เพียงพอ | ตรวจสอบว่า SDA ต่อเข้า **GPIO 9** และ SCL ต่อเข้า **GPIO 8** แน่นหนาดีหรือไม่ และตรวจสอบแรงดันไฟฟ้าที่ขา VCC ว่าได้ 3.3V หรือไม่ |
| **ค้นหาสัญญาณ Wi-Fi `ESP32S3_DASHBOARD` ไม่พบ** | 1. ชิป Wi-Fi ยังไม่เริ่มทำงาน หรือไฟจ่ายไม่พอ<br>2. กำลังส่งเสาอากาศต่ำ | กดปุ่ม Reset บนบอร์ด ESP32-S3 สังเกตข้อความบน Serial Monitor ตรวจสอบสาย USB ว่าจ่ายกระแสได้อย่างน้อย 500mA หรือไม่ |
| **เชื่อมต่อ Wi-Fi สำเร็จแต่เปิดหน้าเว็บ `192.168.4.1` ไม่ได้** | 1. สมาร์ตโฟนสลับไปใช้เน็ตมือถือ (Mobile Data) อัตโนมัติเนื่องจากตรวจพบว่า Wi-Fi ไม่มีอินเทอร์เน็ต | ปิด Cellular Data (เน็ตมือถือ) บนโทรศัพท์ชั่วคราวขณะทดสอบ หรือกดยืนยันตัวเลือก "เชื่อมต่อกับเครือข่ายนี้ต่อไปแม้ไม่มีอินเทอร์เน็ต" |
| **กดปุ่มบนหน้าเว็บแล้วไฟ LED ไม่ติด แต่สถานะบนเว็บเปลี่ยน** | 1. เสียบขา Anode/Cathode ของ LED สลับขั้ว<br>2. ตัวต้านทานต่อไม่ลงกราวด์<br>3. ต่อผิดขา GPIO | ตรวจสอบว่าขาขายาวของ LED ต่อเข้า GPIO 15, 16, 17 และขาสั้นผ่านตัวต้านทาน 220Ω ลงสู่ขา GND ร่วม |

</div>

---

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## แบบฝึกหัดท้าทายเชิงวิศวกรรม (Engineering Challenges)

**ข้อ 1: การวิเคราะห์ระบบเครือข่ายและสถาปัตยกรรม SoftAP**  
จงอธิบายว่าเหตุใดหมายเลข IP เริ่มต้นของบอร์ด ESP32 ในโหมด SoftAP จึงถูกกำหนดไว้ที่ `192.168.4.1` และหากมีวิศวกร 4 คนนำอุปกรณ์มาเชื่อมต่อพร้อมกัน ESP32-S3 จะจ่ายหมายเลข IP ใดให้อุปกรณ์แต่ละเครื่อง จงเขียนลำดับขั้นตอนการแจกจ่าย IP ผ่านโพรโทคอล DHCP

**ข้อ 2: การคำนวณและวิเคราะห์แบนด์วิดท์ (Bandwidth & Resource Optimization)**  
สมมติว่าในโรงงานมีช่างเทคนิคเปิดหน้าเว็บแดชบอร์ดนี้ค้างไว้พร้อมกัน 3 เครื่อง โดยแต่ละเครื่องส่งคำขอ `fetch('/data')` ทุกๆ 1.5 วินาที หากขนาดของ HTTP Header รวมกับ JSON Payload มีขนาดเฉลี่ย 180 ไบต์ต่อ Request จงคำนวณ:
1. อัตราการส่งข้อมูลเฉลี่ยรวม (Throughput) ที่ ESP32-S3 ต้องประมวลผลต่อวินาที
2. เปรียบเทียบกับวิธี Full Page Reload (ขนาดหน้าเว็บประมาณ 8.5 KB) ว่าระบบ SPA ประหยัดแบนด์วิดท์ของชิปคิดเป็นกี่เปอร์เซ็นต์

**ข้อ 3: การประยุกต์ใช้วงจรป้องกันและระบบควบคุมอัตโนมัติ (Closed-loop Control)**  
จงออกแบบและเขียนฟังก์ชันเพิ่มเติมลงในเฟิร์มแวร์ C++ เพื่อสร้างระบบ **Thermal Protection (การป้องกันความร้อนเกินพิกัด)**:
- หากอุณหภูมิที่อ่านได้จากเซนเซอร์ AHT25 สูงเกิน **45.0°C** ให้ระบบสั่งงานตัดไฟ LED1, LED2 และสั่งเปิดไฟกระพริบฉุกเฉินที่ LED3 โดยอัตโนมัติ พร้อมส่งสถานะ Warning ไปแสดงบนหน้าปัด Web Dashboard

**ข้อ 4: การรักษาความปลอดภัยเครือข่ายเฉพาะจุด (Local Security Enhancement)**  
ในสถานการณ์จริงที่นำบอร์ดนี้ไปติดตั้งควบคุมเครื่องจักรในโรงงาน การใช้รหัสผ่านคงที่แบบธรรมดา (`password123`) อาจไม่ปลอดภัยเพียงพอ จงเสนอแนวทางปรับปรุงความปลอดภัยของระบบ Wi-Fi SoftAP และระบบ Web Server อย่างน้อย 2 วิธี พร้อมเขียนบล็อกโค้ดตัวอย่างประกอบ

</div>
