---
layout: default
title: "บทที่ 12: ระบบ IoT สู่คลาวด์และแดชบอร์ด"
permalink: /chapters/ch12-hmi-visualization/
---

# Chapter 12: ระบบ IoT สู่คลาวด์และแดชบอร์ด

## IoT Cloud Platform, Dashboard & Remote Control (ESP32-S3, AHT25, Arduino Cloud)

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

> ### 🎯 ผลลัพธ์การเรียนรู้และการเชื่อมโยง (Constructive Alignment)
>
> - **สัปดาห์การเรียนรู้:** สัปดาห์ที่ 14 — การแสดงภาพข้อมูลและการออกแบบส่วนต่อประสานผู้ใช้ (Data Visualization & User Interface)
> - **ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs):**
>   - **CLO3:** ออกแบบและพัฒนาระบบ IoT ที่เชื่อมต่อเซนเซอร์/ตัวกระทำ สื่อสารข้อมูล และแสดงผลผ่านโปรแกรมของผู้ใช้ได้
>   - **CLO4:** ปฏิบัติการสร้าง ทดสอบ และประยุกต์ใช้ระบบ IoT พร้อมการเรียนรู้ของเครื่องเบื้องต้น และทำงานเป็นทีมอย่างรับผิดชอบ
> - **ผลลัพธ์การเรียนรู้ระดับบทเรียน (LLOs):**
>   - **LLO14.1:** ออกแบบและพัฒนาระบบ IoT ที่ส่งข้อมูลเซนเซอร์และรับคำสั่งจากผู้ใช้ผ่านแพลตฟอร์มคลาวด์ (Arduino Cloud) โดยกำหนดตัวแปร สิทธิ์ และการยืนยันตัวตนของอุปกรณ์อย่างถูกต้องได้ (CLO3)
>   - **LLO14.2:** สร้างแดชบอร์ดแสดงผล แจ้งเตือน และสั่งการอุปกรณ์กลับไปยัง ESP32 ตามหลักการออกแบบแดชบอร์ดที่ดีได้ (CLO3, CLO4)
>
> **ฮาร์ดแวร์:** ESP32-S3 DevKit · เซนเซอร์อุณหภูมิ/ความชื้น AHT25 · ปุ่มกด 3 ปุ่ม · LED 3 ดวง + ตัวต้านทาน 220 Ω  
> **ซอฟต์แวร์ (ฟรีทั้งหมด):** Arduino IDE (ESP32 core + ไลบรารี ArduinoIoTCloud) · [Arduino Cloud](https://cloud.arduino.cc/) Free Plan · แอป Arduino IoT Remote บนมือถือ (ไม่บังคับ)

---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 12.1 ภาพรวมระบบ: ตู้ควบคุมมอเตอร์ปั๊ม

ในโรงงาน มอเตอร์ปั๊มถูกควบคุมจาก **ตู้ควบคุมมอเตอร์ (Motor Control Cabinet)** ซึ่งภายในมีอินเวอร์เตอร์ คอนแทคเตอร์ และรีเลย์ ถ้าอุณหภูมิในตู้สูงเกินไป อุปกรณ์อิเล็กทรอนิกส์จะเสื่อมเร็วขึ้น และถ้าความชื้นสูงจนเกิดหยดน้ำเกาะ (Condensation) ก็อาจทำให้ไฟฟ้าลัดวงจรได้ ช่างซ่อมบำรุงจึงต้องการระบบที่
1. **ติดตามอุณหภูมิและความชื้นในตู้** ตลอด 24 ชั่วโมง ดูแนวโน้มย้อนหลังได้ และ **แจ้งเตือน** เมื่ออุณหภูมิเกินเกณฑ์
2. **สั่งเปิด/ปิดอุปกรณ์จากระยะไกล** ได้แก่ ไฟส่องสว่างในตู้ (`light`) ปั๊ม (`pump`) และพัดลมระบายอากาศ (`fan`) ผ่านแดชบอร์ดบนคอมพิวเตอร์หรือมือถือ โดยยังมีปุ่มหน้าตู้ให้ช่างสั่งเองได้ และแดชบอร์ดต้องแสดงสถานะที่ตรงกับหน้าตู้เสมอ

ข้อกำหนดทั้งสองข้อมีทิศทางของข้อมูลตรงข้ามกัน บทนี้จึงแบ่งการสร้างระบบเป็น **2 ส่วน**

| ส่วน | ทิศทางข้อมูล | สิ่งที่สร้าง |
|:---|:---|:---|
| **ส่วนที่ 1: ติดตาม (Monitoring)** | เซนเซอร์ → ESP32-S3 → Arduino Cloud → แดชบอร์ด | ส่งค่า AHT25 ขึ้น Arduino Cloud แล้วแสดงผลด้วย Gauge และ Chart พร้อมสถานะแจ้งเตือน |
| **ส่วนที่ 2: สั่งการ (Control)** | แดชบอร์ด ↔ Arduino Cloud ↔ ESP32-S3 → อุปกรณ์ | สั่ง LED แทนไฟ ปั๊ม และพัดลม จาก Switch บนแดชบอร์ด และจากปุ่มหน้าตู้ โดยทั้งสองทางซิงก์กัน |

ทั้งหมดสร้างบน **Arduino Cloud** ซึ่งเป็น **แพลตฟอร์ม IoT สำเร็จรูป (IoT Platform)** ที่รวมการยืนยันตัวตนของอุปกรณ์ การสื่อสาร การเก็บข้อมูล และแดชบอร์ดไว้ในที่เดียว ตามสถาปัตยกรรมด้านล่าง

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 900 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif" role="img" aria-label="ESP32-S3 เชื่อมต่อ Arduino Cloud ด้วย MQTT over TLS ค้างไว้ตลอด ส่งค่า temp และ hum ขึ้นไปทุก 5 วินาที ส่วนตัวแปร light pump fan ซิงก์สองทาง ช่างเปิด Dashboard ผ่านเบราว์เซอร์หรือแอป IoT Remote บนมือถือ เมื่อกด Switch คลาวด์จะ push ค่าใหม่ลงมาที่ ESP32 ทันที">
  <title>สถาปัตยกรรมระบบ: ESP32-S3 ↔ Arduino Cloud (Device, Thing, Dashboard) ↔ เบราว์เซอร์และแอปมือถือ</title>
  <style>
    .a12-bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; }
    .a12-box { fill: #ffffff; stroke: #475569; stroke-width: 2; }
    .a12-esp { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2.5; }
    .a12-cloud { fill: #ecfeff; stroke: #0e7490; stroke-width: 1.5; stroke-dasharray: 6 5; }
    .a12-thing { fill: #ffffff; stroke: #0e7490; stroke-width: 2.5; }
    .a12-ro { fill: #ecfdf5; stroke: #059669; stroke-width: 1.5; }
    .a12-rw { fill: #fdf2f8; stroke: #db2777; stroke-width: 1.5; }
    .a12-web { fill: #fff7ed; stroke: #ea580c; stroke-width: 2.5; }
    .a12-w { fill: none; stroke: #059669; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: a12-flow 1.6s linear infinite; }
    .a12-k { fill: none; stroke: #db2777; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: a12-flow 1.6s linear infinite; }
    .a12-r { fill: none; stroke: #2f5597; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: a12-flow 1.6s linear infinite; }
    .a12-t { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .a12-l { font-size: 12px; fill: #64748b; font-weight: 500; }
    .a12-c { font-size: 11px; font-family: monospace; font-weight: 700; fill: #475569; }
    .a12-cw { font-size: 11px; font-family: monospace; font-weight: 700; fill: #059669; }
    .a12-ck { font-size: 11px; font-family: monospace; font-weight: 700; fill: #db2777; }
    .a12-cr { font-size: 11px; font-family: monospace; font-weight: 700; fill: #2f5597; }
    .a12-cc { font-size: 11px; font-family: monospace; font-weight: 700; fill: #0e7490; }
    @keyframes a12-flow { to { stroke-dashoffset: -36; } }
    @media (prefers-reduced-motion: reduce) { .a12-w, .a12-k, .a12-r { animation: none; } }
  </style>
  <rect x="5" y="5" width="890" height="390" rx="10" class="a12-bg"/>
  <!-- Arduino Cloud container (drawn first so labels stay on top) -->
  <rect x="250" y="30" width="370" height="310" rx="12" class="a12-cloud"/>
  <text x="266" y="52" class="a12-cc">ARDUINO CLOUD</text>
  <!-- ESP32-S3 -->
  <rect x="20" y="60" width="160" height="250" rx="8" class="a12-esp"/>
  <text x="100" y="88" text-anchor="middle" class="a12-t">ESP32-S3</text>
  <text x="100" y="116" text-anchor="middle" class="a12-l">AHT25 (I2C)</text>
  <text x="100" y="134" text-anchor="middle" class="a12-c">GPIO 8/9</text>
  <text x="100" y="166" text-anchor="middle" class="a12-l">ปุ่มหน้าตู้ 3 ปุ่ม</text>
  <text x="100" y="184" text-anchor="middle" class="a12-c">GPIO 4/5/6</text>
  <text x="100" y="216" text-anchor="middle" class="a12-l">LED 3 ดวง</text>
  <text x="100" y="234" text-anchor="middle" class="a12-c">GPIO 10/11/12</text>
  <text x="100" y="266" text-anchor="middle" class="a12-c">ArduinoIoTCloud</text>
  <text x="100" y="284" text-anchor="middle" class="a12-c">update()</text>
  <!-- ESP32 ↔ Cloud -->
  <path d="M 180 130 L 262 130" class="a12-w"/>
  <polygon points="262,125 272,130 262,135" fill="#059669"/>
  <text x="222" y="120" text-anchor="middle" class="a12-cw">temp, hum</text>
  <text x="222" y="150" text-anchor="middle" class="a12-cw">ทุก 5 s</text>
  <path d="M 272 220 L 190 220" class="a12-k"/>
  <polygon points="190,215 180,220 190,225" fill="#db2777"/>
  <path d="M 180 240 L 262 240" class="a12-k"/>
  <polygon points="262,235 272,240 262,245" fill="#db2777"/>
  <text x="222" y="210" text-anchor="middle" class="a12-ck">push</text>
  <text x="222" y="262" text-anchor="middle" class="a12-ck">ปุ่มหน้าตู้</text>
  <text x="215" y="325" text-anchor="middle" class="a12-c">MQTT + TLS</text>
  <text x="215" y="340" text-anchor="middle" class="a12-c">port 8884</text>
  <!-- Device -->
  <rect x="272" y="70" width="120" height="70" rx="8" class="a12-box"/>
  <text x="332" y="96" text-anchor="middle" class="a12-t">Device</text>
  <text x="332" y="116" text-anchor="middle" class="a12-c">Device ID</text>
  <text x="332" y="130" text-anchor="middle" class="a12-c">+ Secret Key</text>
  <!-- Thing -->
  <rect x="272" y="160" width="210" height="165" rx="8" class="a12-thing"/>
  <text x="377" y="182" text-anchor="middle" class="a12-t">Thing: MCC Monitor</text>
  <rect x="284" y="194" width="186" height="46" rx="6" class="a12-ro"/>
  <text x="377" y="212" text-anchor="middle" class="a12-cw">temp · hum</text>
  <text x="377" y="230" text-anchor="middle" class="a12-l">Read Only · Periodically 5 s</text>
  <rect x="284" y="250" width="186" height="46" rx="6" class="a12-rw"/>
  <text x="377" y="268" text-anchor="middle" class="a12-ck">light · pump · fan</text>
  <text x="377" y="286" text-anchor="middle" class="a12-l">Read &amp; Write · On Change</text>
  <text x="377" y="315" text-anchor="middle" class="a12-c">ค่าย้อนหลัง 1 วัน (แผนฟรี)</text>
  <line x1="332" y1="140" x2="332" y2="160" stroke="#475569" stroke-width="2"/>
  <!-- Dashboard -->
  <rect x="500" y="70" width="108" height="255" rx="8" class="a12-box"/>
  <text x="554" y="94" text-anchor="middle" class="a12-t">Dashboard</text>
  <path d="M 520 140 A 18 18 0 0 1 556 140" fill="none" stroke="#e2e8f0" stroke-width="6"/>
  <path d="M 520 140 A 18 18 0 0 1 548 126" fill="none" stroke="#16a34a" stroke-width="6"/>
  <text x="554" y="160" text-anchor="middle" class="a12-c">Gauge</text>
  <polyline points="516,205 530,196 544,200 558,186 572,190 590,178" fill="none" stroke="#ea580c" stroke-width="2.5"/>
  <text x="554" y="222" text-anchor="middle" class="a12-c">Chart</text>
  <rect x="524" y="244" width="30" height="16" rx="8" fill="#16a34a"/>
  <circle cx="546" cy="252" r="6" fill="#ffffff"/>
  <rect x="560" y="244" width="30" height="16" rx="8" fill="#94a3b8"/>
  <circle cx="568" cy="252" r="6" fill="#ffffff"/>
  <text x="554" y="280" text-anchor="middle" class="a12-c">Switch</text>
  <line x1="482" y1="217" x2="500" y2="217" stroke="#0e7490" stroke-width="2"/>
  <line x1="482" y1="273" x2="500" y2="273" stroke="#0e7490" stroke-width="2"/>
  <!-- Users -->
  <path d="M 608 150 L 672 150" class="a12-r"/>
  <polygon points="672,145 682,150 672,155" fill="#2f5597"/>
  <text x="645" y="140" text-anchor="middle" class="a12-cr">แสดงผล</text>
  <path d="M 682 250 L 618 250" class="a12-k"/>
  <polygon points="618,245 608,250 618,255" fill="#db2777"/>
  <text x="645" y="240" text-anchor="middle" class="a12-ck">สั่งการ</text>
  <rect x="682" y="70" width="200" height="110" rx="8" class="a12-web"/>
  <text x="782" y="98" text-anchor="middle" class="a12-t">เบราว์เซอร์</text>
  <text x="782" y="120" text-anchor="middle" class="a12-c">app.arduino.cc</text>
  <text x="782" y="146" text-anchor="middle" class="a12-l">login บัญชี Arduino</text>
  <rect x="682" y="200" width="200" height="110" rx="8" class="a12-web"/>
  <text x="782" y="228" text-anchor="middle" class="a12-t">มือถือ</text>
  <text x="782" y="250" text-anchor="middle" class="a12-c">Arduino IoT Remote</text>
  <text x="782" y="276" text-anchor="middle" class="a12-l">Dashboard เดียวกัน</text>
  <!-- legend -->
  <line x1="30" y1="378" x2="62" y2="378" stroke="#059669" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="70" y="382" class="a12-l">ค่าเซนเซอร์ (ส่วนที่ 1)</text>
  <line x1="250" y1="378" x2="282" y2="378" stroke="#2f5597" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="290" y="382" class="a12-l">แสดงผล (ส่วนที่ 1)</text>
  <line x1="450" y1="378" x2="482" y2="378" stroke="#db2777" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="490" y="382" class="a12-l">สั่งการสองทาง (ส่วนที่ 2)</text>
</svg>
</div>

ระบบแบ่งเป็น 4 ชั้นตามสถาปัตยกรรม IoT ที่เรียนในบทที่ 1

| ชั้น (Layer) | องค์ประกอบในบทนี้ | หน้าที่ |
|:---|:---|:---|
| Perception | AHT25, ปุ่มกด 3 ปุ่ม, LED 3 ดวง | วัดอุณหภูมิ/ความชื้น รับคำสั่งจากช่างหน้าตู้ และขับอุปกรณ์ปลายทาง |
| Network | ESP32-S3 + Wi-Fi + MQTT over TLS | รักษาการเชื่อมต่อกับคลาวด์ไว้ตลอด ส่งค่าขึ้นและรับคำสั่งลงอย่างเข้ารหัส |
| Middleware / Storage | Arduino Cloud (Device, Thing, Cloud Variables) | ยืนยันตัวตนอุปกรณ์ ซิงก์ตัวแปร และเก็บค่าย้อนหลัง |
| Application | Dashboard บนเว็บ + แอป Arduino IoT Remote | แสดงผล แจ้งเตือน และรับคำสั่งจากช่าง |

---

## 12.2 ฮาร์ดแวร์ของระบบ

### 12.2.1 ESP32-S3

ESP32-S3 เป็นไมโครคอนโทรลเลอร์รุ่นใหม่ในตระกูล ESP32 ที่เหมาะกับงาน IoT

| คุณสมบัติ | ESP32-S3 | ความสำคัญต่อระบบนี้ |
|:---|:---|:---|
| CPU | Xtensa LX7 ดูอัลคอร์ สูงสุด 240 MHz | ประมวลผล TLS (การเข้ารหัสการเชื่อมต่อกับ Arduino Cloud) ได้เร็ว |
| การสื่อสารไร้สาย | Wi-Fi 2.4 GHz (802.11 b/g/n) + Bluetooth LE 5 | รองรับเฉพาะ **2.4 GHz** ใช้ Wi-Fi 5 GHz ไม่ได้ |
| USB | Native USB (GPIO 19/20) | อัปโหลดโปรแกรมและใช้ Serial Monitor ผ่านสาย USB ได้โดยตรง |
| ADC | 12 บิต | ไม่ได้ใช้ในบทนี้ เพราะ AHT25 ส่งค่าเป็นดิจิทัล |
| ขาที่ควรเลี่ยง | 0, 3, 45, 46 (Strapping) · 19–20 (USB) · 35–37 (บอร์ดที่มี Octal PSRAM) | ต่อปุ่มหรือ LED ผิดขาอาจทำให้บอร์ดบูตไม่ขึ้น |

### 12.2.2 เซนเซอร์ AHT25 และโปรโตคอล I2C

**AHT25** เป็นเซนเซอร์วัดอุณหภูมิและความชื้นสัมพัทธ์แบบดิจิทัล ภายในมีตัววัดความชื้นแบบ Capacitive (ค่าความจุไฟฟ้าเปลี่ยนตามปริมาณไอน้ำที่ถูกดูดซับ) ตัววัดอุณหภูมิ และวงจร ADC พร้อมสอบเทียบมาจากโรงงาน สื่อสารด้วย **I2C** ที่ address `0x38` (ทบทวนบทที่ 6) และใช้ชุดคำสั่งเดียวกับ AHT20

**ขั้นตอนการวัด 1 ครั้ง** (ไลบรารีจัดการให้ แต่วิศวกรควรเข้าใจ)
1. ESP32 ส่งคำสั่งเริ่มวัด `0xAC 0x33 0x00` ไปที่ address `0x38`
2. รอประมาณ **80 ms** ให้เซนเซอร์วัดเสร็จ (บิตที่ 7 ของ status byte ต้องกลับเป็น `0`)
3. อ่านข้อมูล 7 ไบต์: status (1) + ความชื้น 20 บิต + อุณหภูมิ 20 บิต + CRC (1)
4. แปลงค่าดิบเป็นหน่วยทางกายภาพ

$$RH\,[\%] = \frac{S_{RH}}{2^{20}} \times 100 \qquad T\,[^\circ C] = \frac{S_T}{2^{20}} \times 200 - 50$$

**ตัวอย่าง:** ถ้าอ่านได้ $S_T = 393{,}216$ จะได้ $T = \frac{393216}{1048576} \times 200 - 50 = 75 - 50 = 25\ ^\circ C$

> **ความละเอียด (Resolution) กับความแม่นยำ (Accuracy) ไม่เท่ากัน:** ค่า 20 บิตให้ความละเอียดของอุณหภูมิถึง $200 / 2^{20} \approx 0.0002\ ^\circ C$ แต่ datasheet ระบุความแม่นยำไว้ราว ±0.3 °C และ ±2 %RH (ควรตรวจสอบกับ datasheet ของรุ่นที่ใช้) ทศนิยมเกิน 1 ตำแหน่งจึงไม่มีความหมายทางวิศวกรรม เราจึงส่งข้อมูลแค่ทศนิยม 1 ตำแหน่ง

### 12.2.3 ปุ่มกด: Pull-up, การเด้งของหน้าสัมผัส และ Interrupt

ในส่วนที่ 2 ปุ่ม 3 ปุ่มทำหน้าที่เป็น **ปุ่มสั่งการหน้าตู้ (Local Control)** ให้ช่างเปิด/ปิดอุปกรณ์ได้เองโดยไม่ต้องเปิดแดชบอร์ด

**วงจร Pull-up ภายใน:** เมื่อตั้ง `pinMode(pin, INPUT_PULLUP)` ชิปจะต่อตัวต้านทานภายในค่าประมาณ 45 kΩ จากขาไปยัง 3.3 V ขณะปล่อยปุ่มขาจึงอ่านได้ `HIGH` เมื่อกดปุ่ม (ปุ่มต่อลง GND) ขาจะถูกดึงเป็น `LOW` โดยมีกระแสไหลเพียง $3.3 / 45\text{k} \approx 73\ \mu A$

**การเด้งของหน้าสัมผัส (Contact Bounce):** ปุ่มกลไกมีแผ่นโลหะที่กระทบกันแล้วเด้งหลายครั้งในช่วงประมาณ 1–20 ms ไมโครคอนโทรลเลอร์ที่อ่านค่าได้ระดับไมโครวินาทีจะเห็นเป็นการกดหลายครั้ง จึงต้องทำ **Debounce** คือทิ้งขอบสัญญาณที่เกิดถี่เกินช่วงเวลาที่กำหนด

**ทำไมต้องใช้ Interrupt?** `loop()` ต้องเรียก `ArduinoCloud.update()` ตลอดเวลา ปกติฟังก์ชันนี้ทำงานเสร็จเร็ว แต่ช่วงที่ Wi-Fi หลุดหรือกำลังเชื่อมต่อ Arduino Cloud ใหม่ (ต้องทำ TLS handshake) อาจค้างนานหลายร้อยมิลลิวินาทีถึงหลายวินาที

| วิธีอ่านปุ่ม | ถ้าผู้ใช้กดปุ่มระหว่าง ESP32 กำลังเชื่อมต่อหรือส่งข้อมูล |
|:---|:---|
| **Polling** (อ่าน `digitalRead` ใน `loop()`) | การกดสั้น ๆ ช่วงที่ `update()` ค้างจะ **หายไป** เพราะ `loop()` ยังไม่วนกลับมาอ่าน |
| **Interrupt** (ISR ทำงานทันทีที่ขาเปลี่ยนสถานะ) | ISR จำการกดไว้ใน flag แล้ว `loop()` จะจัดการในรอบถัดไป **ไม่หาย** |

### 12.2.4 เอาต์พุต: LED แทนคอนแทคเตอร์

ในห้องแล็บเราใช้ LED 3 ดวงแทนคอนแทคเตอร์ของไฟ ปั๊ม และพัดลม LED แต่ละดวงต่อผ่านตัวต้านทานจำกัดกระแสจากขา GPIO ลง GND เมื่อขาเป็น `HIGH` (3.3 V) และ LED สีแดงมีแรงดันตกคร่อม $V_F \approx 2.0$ V กระแสที่ไหลคือ

$$I = \frac{V_{GPIO} - V_F}{R} = \frac{3.3 - 2.0}{220} \approx 5.9\ \text{mA}$$

ค่านี้ต่ำกว่ากระแสที่ขา GPIO ของ ESP32-S3 จ่ายได้ตามค่าเริ่มต้น (ประมาณ 20 mA ต่อขา ควรตรวจสอบกับ datasheet) และเพียงพอให้ LED สว่างชัดเจน

> **งานจริงห้ามต่อขดลวดรีเลย์หรือคอนแทคเตอร์เข้าขา GPIO โดยตรง** เพราะขดลวดต้องการกระแสหลายสิบถึงหลายร้อย mA และสร้างแรงดันย้อนกลับ (Back EMF) ตอนตัดไฟ ต้องใช้โมดูลรีเลย์ที่มีทรานซิสเตอร์ขับและไดโอดกันแรงดันย้อนกลับ (Flyback Diode) หรือ Solid State Relay (ทบทวนบทที่ 4) โดยโค้ดในบทนี้ใช้ได้เหมือนเดิม เพียงเปลี่ยนสิ่งที่ต่อกับขา GPIO

---

## 12.3 แนวคิดของ Arduino Cloud

### 12.3.1 Device, Thing, Cloud Variable และ Dashboard

Arduino Cloud แบ่งระบบเป็น 4 องค์ประกอบ ซึ่งต้องสร้างตามลำดับนี้

| องค์ประกอบ | คืออะไร | ในบทนี้ |
|:---|:---|:---|
| **Device** | บอร์ดจริงที่ลงทะเบียนกับคลาวด์ ระบุด้วย **Device ID** และพิสูจน์ตัวตนด้วย **Secret Key** | ESP32-S3 ชื่อ `MCC-1234` |
| **Thing** | "ฝาแฝดดิจิทัล (Digital Twin)" ของอุปกรณ์บนคลาวด์ ประกอบด้วยตัวแปรที่ซิงก์กับบอร์ด ผูกกับ Device ได้ 1 เครื่อง | `MCC Monitor` |
| **Cloud Variable** | ตัวแปรที่มีค่าเดียวกันทั้งในบอร์ดและบนคลาวด์ เขียนในโปรแกรมเหมือนตัวแปร C++ ธรรมดา เช่น `temp = 31.4;` | `temp`, `hum`, `light`, `pump`, `fan` |
| **Dashboard** | หน้าจอที่ประกอบจาก **Widget** แต่ละ Widget ผูกกับ Cloud Variable 1 ตัว | `MCC Monitor` บนเว็บและแอปมือถือ |

แนวคิด **Digital Twin** คือ คลาวด์เก็บ "สำเนา" ของสถานะอุปกรณ์ไว้เสมอ แดชบอร์ดอ่านและเขียนสำเนานี้ ไม่ได้คุยกับบอร์ดโดยตรง ส่วนไลบรารีในบอร์ดมีหน้าที่ทำให้ค่าในบอร์ดกับสำเนาบนคลาวด์ตรงกัน ถ้าบอร์ดออฟไลน์ แดชบอร์ดก็ยังแสดงค่าล่าสุดที่รู้ได้

### 12.3.2 ข้อมูล 2 ประเภท: Telemetry และ Command State

| | Telemetry | Command State |
|:---|:---|:---|
| ตัวอย่าง | อุณหภูมิ 31.4 °C, ความชื้น 58 %RH | ตอนนี้สั่งให้พัดลม **เปิด** |
| ผู้เปลี่ยนค่า | บอร์ดฝ่ายเดียว | ทั้งแดชบอร์ดและบอร์ด (ปุ่มหน้าตู้) |
| รูปแบบการเกิด | เป็นรอบคงที่ (Periodic) ทุก 5 วินาที | เมื่อมีการสั่ง (Event-driven) |
| Permission | **Read Only** | **Read & Write** |
| Update Policy | **Periodically** ทุก 5 วินาที | **On Change** |
| Widget | Gauge, Chart | Switch |

**ตัวแปรของ Thing `MCC Monitor`**

| Name | Type (ชื่อใน C++) | Permission | Update Policy | ความหมาย |
|:---|:---|:---|:---|:---|
| `temp` | Temperature Sensor (`CloudTemperatureSensor`) | Read Only | Periodically 5 s | อุณหภูมิในตู้ (°C) |
| `hum` | Relative Humidity (`CloudRelativeHumidity`) | Read Only | Periodically 5 s | ความชื้นสัมพัทธ์ (%RH) |
| `light` | Boolean (`bool`) | Read & Write | On Change | สั่งไฟ (`true` = เปิด) |
| `pump` | Boolean (`bool`) | Read & Write | On Change | สั่งปั๊ม |
| `fan` | Boolean (`bool`) | Read & Write | On Change | สั่งพัดลม |

- **ชนิดข้อมูลแบบ Specialized** เช่น `CloudTemperatureSensor` ภายในเป็น `float` ธรรมดา แต่คลาวด์รู้หน่วยของค่า จึงแสดงหน่วย (°C, %) บน Widget ได้เอง ถ้าหาชนิดนี้ไม่พบ ใช้ **Floating Point Number** (`float`) แทนได้
- **Read Only** ป้องกันไม่ให้ใครเปลี่ยนค่าเซนเซอร์จากแดชบอร์ด ค่าวัดจึงมาจากบอร์ดเท่านั้น
- **Read & Write** ทำให้ไลบรารีสร้าง **Callback** เช่น `onFanChange()` ซึ่งถูกเรียกเมื่อแดชบอร์ดเปลี่ยนค่า

**Periodically กับ On Change:** ตัวแปรแบบ On Change มีค่า **threshold** (ค่าเริ่มต้นคือ 0) ถ้าตั้ง threshold ของ `temp` เป็น 0.2 °C บอร์ดจะส่งค่าก็ต่อเมื่ออุณหภูมิเปลี่ยนเกิน 0.2 °C จากค่าที่ส่งครั้งก่อน เรียกว่า **Deadband** ช่วยลดจำนวนข้อความเมื่อค่าคงที่ แต่กราฟจะไม่มีจุดใหม่ในช่วงที่ค่าไม่เปลี่ยน บทนี้ใช้ Periodically 5 วินาทีกับค่าเซนเซอร์ เพื่อให้กราฟมีจุดสม่ำเสมอ และใช้การที่ข้อมูลหยุดมาเป็นสัญญาณว่าอุปกรณ์ขัดข้องได้

**ประเมินปริมาณข้อมูล:** ตัวแปร 2 ตัวส่งทุก 5 วินาที เท่ากับ $2 \times 86{,}400 / 5 = 34{,}560$ ค่าต่อวัน แผนฟรีเก็บค่าย้อนหลังเพียง **1 วัน** กราฟจึงดูย้อนหลังได้ไม่เกิน 24 ชั่วโมง ถ้าต้องเก็บนานกว่านั้นต้องดาวน์โหลดข้อมูลเก็บเอง (Widget Chart มีปุ่ม Download Historical Data) หรือใช้แผนที่สูงขึ้น

### 12.3.3 ความปลอดภัย: Device ID, Secret Key และบัญชีผู้ใช้

| ผู้เข้าถึง | ยืนยันตัวตนด้วย | ทำอะไรได้ |
|:---|:---|:---|
| ESP32-S3 | **Device ID + Secret Key** เฉพาะเครื่อง (เก็บใน `arduino_secrets.h`) | อ่าน/เขียนตัวแปรของ Thing ที่ผูกกับเครื่องนี้เท่านั้น |
| ช่าง | **บัญชี Arduino** (อีเมล + รหัสผ่าน หรือ Google) | เห็นและแก้ Thing, Dashboard ในบัญชีของตนเอง หรือที่ถูกแชร์ให้ |

- **Secret Key ใช้กับอุปกรณ์เดียว** ถ้ารั่ว ผู้ไม่หวังดีปลอมตัวเป็นบอร์ดเครื่องนั้นได้ เช่น ส่งค่าอุณหภูมิปลอม หรือเปลี่ยนสถานะ `fan` ในนามบอร์ด แต่ **เข้าบัญชีของเรา ลบ Dashboard หรือเข้าถึงอุปกรณ์เครื่องอื่นไม่ได้** และแก้ได้โดยลบอุปกรณ์แล้วลงทะเบียนใหม่เพื่อออก key ใหม่
- การเชื่อมต่อทั้งหมดเข้ารหัสด้วย **TLS** ผู้ที่ดักฟัง Wi-Fi จึงอ่านค่าหรือ Secret Key ไม่ได้
- **Secret Key แสดงเพียงครั้งเดียว** ตอนลงทะเบียนอุปกรณ์ ต้องเก็บให้ดี และห้ามนำไฟล์ `arduino_secrets.h` ขึ้น GitHub
- บัญชี Arduino ควรใช้รหัสผ่านที่แข็งแรง เพราะใครเข้าบัญชีได้ก็สั่งอุปกรณ์ได้ทุกเครื่อง

---

## 12.4 การสื่อสาร: MQTT และ `ArduinoCloud.update()`

ไลบรารี `ArduinoIoTCloud` สื่อสารกับคลาวด์ด้วย **MQTT** (ทบทวนบทที่ 9) โดยมี Arduino Cloud เป็น **Broker** ESP32 เปิดการเชื่อมต่อแบบ TLS ไปยัง Broker **ค้างไว้ตลอด** (port 8884 สำหรับอุปกรณ์ที่ใช้ Device ID + Secret Key) แล้วใช้การเชื่อมต่อเดียวนี้ทั้งส่งค่าขึ้น (Publish) และรับค่าลง (Subscribe) ไลบรารีจัดการชื่อ topic และเข้ารหัสข้อมูล (รูปแบบ CBOR ซึ่งเป็น JSON แบบไบนารีที่เล็กกว่า) ให้ทั้งหมด

| สิ่งที่เราเขียนในโปรแกรม | สิ่งที่ไลบรารีทำให้ |
|:---|:---|
| `ArduinoCloud.begin(ArduinoIoTPreferredConnection)` | เชื่อม Wi-Fi, ทำ TLS handshake, login ด้วย Device ID + Secret Key, subscribe ตัวแปร Read & Write |
| `temp = 31.4;` | จำค่าไว้ แล้ว publish เมื่อถึงรอบ 5 วินาที |
| `ArduinoCloud.update();` | ส่งค่าที่ถึงรอบ/เปลี่ยนแปลง, รับค่าที่แดชบอร์ดเปลี่ยนแล้วเรียก Callback, ส่ง keep-alive, ต่อใหม่อัตโนมัติเมื่อหลุด |
| `void onFanChange() { ... }` | ถูกเรียกหลังเขียนค่าใหม่จากคลาวด์ลงตัวแปร `fan` แล้ว |

**กฎสำคัญ:** `ArduinoCloud.update()` ต้องถูกเรียก **บ่อย ๆ** ใน `loop()` ถ้าใส่ `delay(10000)` ไว้ ค่าจะไม่ถูกส่ง คำสั่งจากแดชบอร์ดจะมาช้า และถ้าเงียบนานเกินช่วง keep-alive คลาวด์จะถือว่าอุปกรณ์ **Offline** โปรแกรมจึงใช้ `millis()` จับเวลาแทน `delay()` เหมือนบทที่ผ่านมา

---

## 12.5 เส้นทางสั่งการ: Push, Callback และ Sync

### 12.5.1 ทำไมคลาวด์สั่ง ESP32 ได้ทันที

ESP32-S3 อยู่หลังเราเตอร์ที่ทำ **NAT** จึงไม่มี IP สาธารณะ คลาวด์เปิดการเชื่อมต่อใหม่เข้าหาบอร์ดไม่ได้ แต่เพราะ **บอร์ดเป็นฝ่ายเปิดการเชื่อมต่อ MQTT ออกไปค้างไว้** คลาวด์จึง **ส่งข้อความกลับมาทางการเชื่อมต่อเดิมได้ทันที (Push)** เมื่อช่างกด Switch

| วิธีรับคำสั่ง | หลักการ | ความหน่วงโดยประมาณ | ภาระเครือข่าย |
|:---|:---|:---|:---|
| **HTTP Polling** | บอร์ดถามเซิร์ฟเวอร์ซ้ำทุก $T_{poll}$ วินาที (เช่นระบบ REST ในบทที่ 8) | $\bar{t} \approx \frac{T_{poll}}{2} + t_{HTTPS}$ เช่น $T_{poll} = 2$ s ได้ราว 2 วินาที | ถามตลอดแม้ไม่มีคำสั่ง $86{,}400/2 = 43{,}200$ ครั้งต่อวัน |
| **MQTT Push** (บทนี้) | คลาวด์ส่งลงมาทันทีผ่านการเชื่อมต่อที่เปิดค้างไว้ | $\bar{t} \approx t_{\text{dashboard→cloud}} + t_{\text{cloud→board}}$ ปกติต่ำกว่า 1 วินาที | ส่งเฉพาะเมื่อมีคำสั่ง + keep-alive เล็ก ๆ |

ข้อแลกเปลี่ยนของ Push คือ บอร์ดต้องรักษาการเชื่อมต่อไว้ตลอด (ใช้พลังงานและหน่วยความจำมากกว่า) และต้องจัดการการเชื่อมต่อใหม่เมื่อ Wi-Fi หลุด ซึ่งไลบรารีทำให้แล้ว

### 12.5.2 สองผู้สั่ง หนึ่งความจริง

ระบบมีผู้สั่ง 2 ทาง และทั้งสองทางเปลี่ยน **ตัวแปรเดียวกัน** ซึ่งเป็น **แหล่งความจริงเพียงแหล่งเดียว (Single Source of Truth)**

- **ช่างกด Switch บนแดชบอร์ด:** คลาวด์ push ค่าใหม่ลงบอร์ด → ไลบรารีเขียนค่าลงตัวแปร `fan` → เรียก `onFanChange()` → โปรแกรมขับ LED
- **ช่างกดปุ่มหน้าตู้:** โปรแกรมสลับค่าตัวแปร `fan` ในบอร์ด และขับ LED ทันที (ไม่ต้องรอเครือข่าย) → ในการเรียก `update()` ครั้งถัดไป ไลบรารีพบว่าค่าเปลี่ยน (On Change) จึง publish ขึ้นคลาวด์ → Switch บนแดชบอร์ดเปลี่ยนตาม
- ถ้าสั่งพร้อมกันทั้งสองทาง ค่าที่ถึงคลาวด์ทีหลังจะชนะ (**Last Write Wins**)

### 12.5.3 Sync เมื่อเชื่อมต่อใหม่: ค่าของใครชนะ

เมื่อบอร์ดรีบูตหรือ Wi-Fi หลุดแล้วกลับมา ค่าตัวแปร Read & Write ในบอร์ดกับบนคลาวด์อาจไม่ตรงกัน ตอนเชื่อมต่อ คลาวด์จะส่งค่าล่าสุดลงมาในข้อความ **Sync** แล้วไลบรารีตัดสินตามนโยบายของตัวแปรนั้น

| นโยบาย | ผลเมื่อค่าไม่ตรงกัน | เหมาะกับ |
|:---|:---|:---|
| **`CLOUD_WINS`** (ค่าเริ่มต้นของโค้ดที่ Arduino Cloud สร้างให้) | ใช้ค่าบนคลาวด์ แล้วเรียก Callback ให้ LED กลับไปตรงกับที่สั่งไว้ | ไฟส่องสว่าง พัดลมระบายความร้อน ที่ควรกลับมาทำงานต่อหลังไฟดับ |
| **`DEVICE_WINS`** | ใช้ค่าในบอร์ด (ที่เพิ่งบูต = ปิด) แล้วส่งขึ้นไปแทนค่าบนคลาวด์ | ปั๊มหรือเครื่องจักรที่ต้องให้คนยืนยันก่อนเริ่มเดินใหม่ (Fail-safe) |

แนวคิดที่คลาวด์เก็บ **"สถานะที่ต้องการ" (Desired State)** แทน "คำสั่งให้สลับ" ทำให้ระบบทนต่อเครือข่ายที่ไม่เสถียร เพราะไม่ว่าบอร์ดจะพลาดข้อความกี่ครั้ง เมื่อเชื่อมต่อใหม่ก็ได้สถานะล่าสุดเสมอ คุณสมบัติที่ "ทำซ้ำกี่ครั้งผลก็เหมือนเดิม" นี้เรียกว่า **Idempotent** และเป็นเหตุผลที่ `light`, `pump`, `fan` เป็น `bool` ที่บอกสถานะ ไม่ใช่ปุ่ม "Toggle"

> ⚠️ **ความปลอดภัยของเครื่องจักร:** การสั่งผ่านคลาวด์หยุดทำงานเมื่ออินเทอร์เน็ตขัดข้อง และมีความหน่วงที่ควบคุมไม่ได้ จึง **ห้ามใช้เป็นระบบหยุดฉุกเฉิน (Emergency Stop)** ซึ่งต้องเป็นวงจรเดินสายตรง (Hardwired) ตามมาตรฐานความปลอดภัยของเครื่องจักรเสมอ ระบบในบทนี้เหมาะกับงานที่ไม่วิกฤต เช่น เปิดไฟส่องสว่างหรือพัดลมระบายอากาศ

---

## 12.6 หลักการออกแบบแดชบอร์ด

แดชบอร์ดที่ดีต้องให้ช่างเข้าใจสถานะของตู้ควบคุมได้ **ภายใน 3 วินาที** โดยไม่ต้องอ่านคู่มือ จึงใช้หลักการต่อไปนี้

1. **ภาพรวมอยู่บน รายละเอียดอยู่ล่าง** แถวบนสุดเป็นค่าปัจจุบันและสถานะ ถัดลงมาเป็นแนวโน้ม และล่างสุดเป็นส่วนสั่งการ
2. **สีมีความหมายเสมอ** ใช้เขียว เหลือง และแดงเฉพาะเพื่อบอกสถานะ (ปกติ เฝ้าระวัง ผิดปกติ) ไม่ใช้สีเพื่อความสวยงาม
3. **เลือก Widget ตามคำถาม**

| คำถามของช่าง | Widget ที่เหมาะ | เหตุผล |
|:---|:---|:---|
| ตอนนี้ร้อนแค่ไหน? | **Gauge** | เห็นตำแหน่งเทียบกับช่วงค่าทันที |
| ค่าแม่นยำเท่าไร? | **Value** | ตัวเลขชัดเจนพร้อมหน่วย |
| อุณหภูมิเพิ่มขึ้นเรื่อย ๆ หรือไม่? | **Chart** | กราฟเส้นแสดงแนวโน้มตามเวลาได้ดีที่สุด |
| จะสั่งเปิด/ปิดไฟ ปั๊ม พัดลม? | **Switch** | แสดงสถานะที่สั่งอยู่ และกดเปลี่ยนได้ในที่เดียว |
| ตู้ร้อนเกินเกณฑ์หรือไม่? | **Status** หรือ **LED** (ผูกกับตัวแปร `bool`) | บอกได้ทันทีด้วยสีและสัญลักษณ์ |

4. **ข้อมูลต้องไม่บิดเบือน** ติดหน่วยทุก Widget (°C, %RH) แยก Chart เมื่อหน่วยต่างกัน และตั้งช่วง Gauge ให้คงที่ (เช่น 0–60 °C) เพื่อไม่ให้การเปลี่ยนแปลงเล็กน้อยดูเหมือนรุนแรง
5. **ส่วนสั่งการต้องป้องกันการกดพลาด** แยก Switch ไว้แถวล่าง ตั้งชื่อให้ชัดว่าสั่งอุปกรณ์ใด และขยาย Widget ให้ใหญ่พอกดบนมือถือได้โดยไม่โดนปุ่มข้างเคียง

**Layout ของ Dashboard `MCC Monitor`**

| แถว | Widget | สร้างในส่วนที่ |
|:---|:---|:---|
| 1 (ภาพรวม) | Gauge `temp` · Gauge `hum` · Status `overheat` (ไม่บังคับ) | 1 |
| 2 (แนวโน้ม) | Chart `temp` · Chart `hum` | 1 |
| 3 (สั่งการ) | Switch `light` · Switch `pump` · Switch `fan` | 2 |

---

## 12.7 ข้อจำกัดของแพลตฟอร์มสำเร็จรูปและแผนฟรี

**แผนฟรีของ Arduino Cloud** (ข้อมูล ณ ปี 2025 อาจเปลี่ยนได้ ควรตรวจสอบที่ [cloud.arduino.cc/plans](https://cloud.arduino.cc/plans) ก่อนเริ่มภาคการศึกษา)

| ข้อจำกัด | ผลต่อบทนี้ | แนวทาง |
|:---|:---|:---|
| อุปกรณ์ได้ไม่เกิน **2 เครื่อง** ต่อบัญชี | นักศึกษาแต่ละคนใช้บัญชีของตนเอง | ลบอุปกรณ์ทดลองที่ไม่ใช้ออก |
| เก็บค่าตัวแปรย้อนหลัง **1 วัน** | Chart ดูย้อนหลังได้ไม่เกิน 24 ชั่วโมง | ดาวน์โหลดข้อมูลเก็บเอง ถ้าต้องวิเคราะห์ต่อ |
| compile ใน Cloud Editor ได้ **25 ครั้งต่อวัน** | ถ้าแก้โค้ดบ่อยจะติดเพดาน | compile ด้วย **Arduino IDE บนเครื่อง** (หัวข้อ 12.8.2) ไม่ติดเพดานนี้ |
| **Triggers** (แจ้งเตือนทางอีเมล/แอป) ต้องใช้แผน Maker และรองรับเฉพาะตัวแปร `bool` และ `String` | ส่งอีเมลเมื่อร้อนเกินเกณฑ์ไม่ได้ในแผนฟรี | ใช้ตัวแปร `overheat` + Widget Status บนแดชบอร์ดแทน (หัวข้อ 12.8.7) |
| อาจจำกัดจำนวนตัวแปรต่อ Thing | บทนี้ใช้ตัวแปรหลักเพียง 5 ตัว | ตัวแปรที่ 6 (`overheat`) เป็นส่วนไม่บังคับ |

**ข้อจำกัดของแพลตฟอร์มสำเร็จรูป (เทียบกับการสร้างระบบเองด้วยฐานข้อมูล):**
- **ไม่มีประวัติว่าใครสั่งอะไรเมื่อไร (Audit trail)** เห็นเพียงค่าบนกราฟ ถ้าโรงงานต้องการตรวจสอบย้อนหลัง ต้องเก็บเหตุการณ์เองในฐานข้อมูลภายนอก
- **ออกแบบโครงสร้างข้อมูลเองไม่ได้** เช่น รวมข้อมูลหลายตู้เพื่อวิเคราะห์ด้วย SQL
- **ผูกกับผู้ให้บริการ (Vendor Lock-in)** ถ้าเงื่อนไขหรือราคาเปลี่ยน การย้ายระบบต้องแก้ทั้งโปรแกรมในบอร์ดและแดชบอร์ด

ในทางกลับกัน ข้อดีคือ **เริ่มใช้งานได้เร็วมาก** ไม่ต้องเขียน SQL, REST, หรือเว็บ และได้การยืนยันตัวตนต่ออุปกรณ์ การเข้ารหัส การเชื่อมต่อใหม่อัตโนมัติ และแอปมือถือมาพร้อมกัน การเลือกระหว่าง "ใช้แพลตฟอร์ม" กับ "สร้างเอง" จึงเป็นการตัดสินใจทางวิศวกรรม (แบบฝึกหัดข้อ 8)

</div>

<div class="chapter-tab-content" data-tab-name="Hands-on" data-tab-icon="🔧" id="handson" markdown="1">

## 12.8 ปฏิบัติการส่วนที่ 1: ติดตาม (Sensor → ESP32 → Arduino Cloud → Dashboard)

> ใบงานพร้อมตารางบันทึกผลอยู่ในแท็บ **Lab 14** (หัวข้อ 12.11) หัวข้อ 12.8–12.10 อธิบายโค้ดและขั้นตอนทั้งหมดแบบละเอียด ส่วนที่ 1 ต้องทำงานได้ก่อน แล้วจึงต่อยอดเป็นส่วนที่ 2

**เป้าหมายของส่วนที่ 1:** ESP32-S3 อ่าน AHT25 แล้วส่งค่า `temp` และ `hum` ขึ้น Arduino Cloud ทุก 5 วินาที จากนั้น Dashboard แสดงค่าปัจจุบันด้วย Gauge และแนวโน้มด้วย Chart บนเว็บและมือถือ

### 12.8.1 ต่อวงจร

| อุปกรณ์ | ขาอุปกรณ์ | ESP32-S3 |
|:---|:---|:---|
| AHT25 | VDD / GND | 3V3 / GND |
| AHT25 | SDA / SCL | GPIO 8 / GPIO 9 |

- ลำดับขาของโมดูล AHT25 แต่ละยี่ห้อไม่เหมือนกัน ให้ดูตามที่พิมพ์ไว้บนบอร์ด และห้ามต่อเข้า 5V

### 12.8.2 ตั้งค่า Arduino IDE

1. **Boards Manager** → ติดตั้ง **esp32 by Espressif Systems**
2. **Library Manager** → ติดตั้ง **Adafruit AHTX0** (จะติดตั้ง Adafruit BusIO และ Adafruit Unified Sensor ให้ด้วย)
3. **Library Manager** → ติดตั้ง **ArduinoIoTCloud** (by Arduino) → เมื่อถามให้ติดตั้งไลบรารีที่เกี่ยวข้อง (dependencies เช่น Arduino_ConnectionHandler) เลือก **Install All**
4. **Tools** → Board: **ESP32S3 Dev Module** → **USB CDC On Boot: Enabled** ถ้าไม่เปิด Serial Monitor จะไม่แสดงอะไรเมื่อเสียบสายที่พอร์ต USB ตรงของชิป
5. Wi-Fi: ESP32-S3 รองรับเฉพาะ 2.4 GHz และใช้กับเครือข่ายแบบ WPA2-Enterprise หรือแบบที่ต้อง login ผ่านหน้าเว็บ (Captive Portal) ไม่ได้ ถ้า Wi-Fi มหาวิทยาลัยเป็นแบบนั้น ให้ใช้ Hotspot จากมือถือแทน

> **ทำไมใช้ Arduino IDE แทน Cloud Editor?** Arduino Cloud มี Cloud Editor บนเว็บที่ compile และอัปโหลดได้ (ต้องติดตั้งโปรแกรม **Arduino Cloud Agent**) แต่แผนฟรี compile ได้ 25 ครั้งต่อวัน การใช้ Arduino IDE บนเครื่องจึงไม่ติดเพดานนี้ และใช้ ESP32 core ชุดเดียวกับบทก่อน ๆ

### 12.8.3 ลงทะเบียนอุปกรณ์ (Device)

1. สมัครหรือ login ที่ [cloud.arduino.cc](https://cloud.arduino.cc/) (ใช้บัญชี Google ได้)
2. เมนู **Devices** → **Add Device** → **Third Party Device** → เลือก **ESP32** → รุ่น **ESP32S3 Dev Module** (หรือชื่อรุ่น ESP32-S3 ที่ใกล้เคียงที่สุดในรายการ) → **Continue**
3. ตั้งชื่ออุปกรณ์เป็น `MCC-` ตามด้วยรหัสนักศึกษา 4 ตัวท้าย เช่น `MCC-1234` → **Next**
4. หน้าจอจะแสดง **Device ID** และ **Secret Key** → คัดลอกเก็บไว้ (หรือดาวน์โหลดเป็นไฟล์ PDF ที่หน้าจอเสนอให้) → ยืนยันว่าบันทึกแล้ว → **Continue**

> ⚠️ **Secret Key แสดงเพียงครั้งเดียว** ถ้าทำหาย ต้องลบอุปกรณ์แล้วลงทะเบียนใหม่ และห้ามนำ Secret Key ขึ้น GitHub หรือส่งให้ผู้อื่น (หัวข้อ 12.3.3)

### 12.8.4 สร้าง Thing และตัวแปรของส่วนที่ 1

1. เมนู **Things** → **Create Thing** (หรือ **+ Thing**) → ตั้งชื่อ `MCC Monitor`
2. ส่วน **Associated Device** → **Select Device** → เลือก `MCC-1234` → **Associate**
3. ส่วน **Network** → **Configure** → กรอก **Wi-Fi Name**, **Password** (Wi-Fi 2.4 GHz) และ **Secret Key** จากหัวข้อ 12.8.3 → **Save**
4. ส่วน **Cloud Variables** → **Add** เพิ่มตัวแปร 2 ตัว (ชื่อต้องตรงทุกตัวอักษร เพราะโปรแกรมใช้ชื่อเหล่านี้)

| Name | Type | Permission | Update Policy |
|:---|:---|:---|:---|
| `temp` | Temperature Sensor (°C) | Read Only | Periodically ทุก **5** วินาที |
| `hum` | Relative Humidity | Read Only | Periodically ทุก **5** วินาที |

5. เปิดแท็บ **Sketch** ของ Thing → ดูไฟล์ `thingProperties.h` ที่ระบบสร้างให้ ต้องมีตัวแปร `temp` และ `hum`

### 12.8.5 โปรแกรม ESP32-S3 ส่วนที่ 1 (`mcc_cloud_monitor.ino`)

โปรแกรมประกอบด้วย 3 ไฟล์ในโฟลเดอร์ sketch เดียวกัน

| ไฟล์ | ผู้สร้าง | เนื้อหา |
|:---|:---|:---|
| `thingProperties.h` | Arduino Cloud สร้างให้ (**ห้ามแก้เอง**) | Device ID, ตัวแปร Cloud, การลงทะเบียน Callback |
| `arduino_secrets.h` | เราสร้างเอง | ชื่อและรหัส Wi-Fi, Secret Key |
| `mcc_cloud_monitor.ino` | เราเขียนเอง | อ่าน AHT25 แล้วเขียนค่าลงตัวแปร Cloud |

1. Arduino IDE → สร้าง sketch ใหม่ชื่อ `mcc_cloud_monitor` → เพิ่มแท็บไฟล์ใหม่ (ปุ่ม **⋯** หรือ **▾** ข้างแท็บ → **New Tab**) 2 ไฟล์ ชื่อ `thingProperties.h` และ `arduino_secrets.h`
2. **`thingProperties.h`:** คัดลอกเนื้อหาทั้งหมดจากแท็บ **Sketch** ของ Thing บน Arduino Cloud มาวาง (ตัวอย่างด้านล่างใช้ตรวจเทียบ ค่า `DEVICE_LOGIN_NAME` ต้องเป็น Device ID ของตนเอง)

```cpp
// Code generated by Arduino IoT Cloud, DO NOT EDIT.

#include <ArduinoIoTCloud.h>
#include <Arduino_ConnectionHandler.h>

const char DEVICE_LOGIN_NAME[]  = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

const char SSID[]               = SECRET_SSID;          // Network SSID (name)
const char PASS[]               = SECRET_OPTIONAL_PASS; // Network password (use for WPA, or use as key for WEP)
const char DEVICE_KEY[]         = SECRET_DEVICE_KEY;    // Secret device password


CloudTemperatureSensor temp;
CloudRelativeHumidity hum;

void initProperties(){

  ArduinoCloud.setBoardId(DEVICE_LOGIN_NAME);
  ArduinoCloud.setSecretDeviceKey(DEVICE_KEY);
  ArduinoCloud.addProperty(temp, READ, 5 * SECONDS, NULL);
  ArduinoCloud.addProperty(hum, READ, 5 * SECONDS, NULL);

}

WiFiConnectionHandler ArduinoIoTPreferredConnection(SSID, PASS);
```

3. **`arduino_secrets.h`:** ใส่ค่าของตนเอง (ชื่อ macro ต้องตรงกับที่ `thingProperties.h` ใช้)

```cpp
#define SECRET_SSID          "YOUR_WIFI"
#define SECRET_OPTIONAL_PASS "YOUR_PASSWORD"
#define SECRET_DEVICE_KEY    "YOUR_SECRET_KEY"   // Secret Key จากหัวข้อ 12.8.3
```

4. **`mcc_cloud_monitor.ino`:** วางโค้ดด้านล่าง → อัปโหลด → เปิด Serial Monitor ที่ **115200**

```cpp
#include "arduino_secrets.h"   // ชื่อ/รหัส Wi-Fi และ Secret Key ของอุปกรณ์
#include "thingProperties.h"   // สร้างโดย Arduino Cloud: ตัวแปร temp, hum
#include <Wire.h>
#include <Adafruit_AHTX0.h>

#define I2C_SDA 8
#define I2C_SCL 9
const unsigned long READ_INTERVAL = 5000;   // ms อ่าน AHT25 (เท่ากับรอบส่งของตัวแปร)

Adafruit_AHTX0 aht;
unsigned long  lastRead = 0;

void setup() {
  Serial.begin(115200);
  delay(1500);                           // รอให้เปิด Serial Monitor ทัน

  Wire.begin(I2C_SDA, I2C_SCL);
  if (!aht.begin(&Wire)) {
    Serial.println("AHT25 not found: check wiring SDA=8 SCL=9");
  }

  initProperties();                      // ประกาศตัวแปร Cloud (thingProperties.h)
  ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  setDebugMessageLevel(2);               // 0 = เฉพาะ error ... 4 = ละเอียดที่สุด
  ArduinoCloud.printDebugInfo();
}

void loop() {
  ArduinoCloud.update();                 // ต้องเรียกบ่อย ๆ ห้ามใช้ delay() ยาว ๆ

  if (millis() - lastRead >= READ_INTERVAL) {
    lastRead = millis();
    sensors_event_t h, t;
    if (aht.getEvent(&h, &t)) {
      temp = roundf(t.temperature * 10) / 10.0f;          // ทศนิยม 1 ตำแหน่ง
      hum  = roundf(h.relative_humidity * 10) / 10.0f;
      Serial.printf("temp=%.1f hum=%.1f\n", t.temperature, h.relative_humidity);
    } else {
      Serial.println("AHT25 read failed");
    }
  }
}
```

5. รอประมาณ 10–30 วินาที Serial Monitor ต้องแสดง `Connected to Arduino IoT Cloud` และค่า `temp=... hum=...` ทุก 5 วินาที หน้า **Devices** ต้องแสดงสถานะ **Online** และหน้า Thing แสดง **Last Value** ของ `temp` และ `hum`

**คำอธิบายโค้ด**

| ส่วนของโค้ด | การทำงาน |
|:---|:---|
| `#include "arduino_secrets.h"` ก่อน `thingProperties.h` | `thingProperties.h` ใช้ macro `SECRET_SSID`, `SECRET_OPTIONAL_PASS`, `SECRET_DEVICE_KEY` จึงต้อง include ไฟล์ secrets ก่อน ถ้าสลับลำดับจะ compile ไม่ผ่าน |
| `CloudTemperatureSensor temp;` (ใน `thingProperties.h`) | ประกาศตัวแปร Cloud ให้ใช้ได้เลย ไม่ต้องประกาศซ้ำใน `.ino` |
| `addProperty(temp, READ, 5 * SECONDS, NULL)` | ตัวแปร Read Only ส่งทุก 5 วินาที ไม่มี Callback เพราะแดชบอร์ดเปลี่ยนค่าไม่ได้ |
| `ArduinoCloud.begin(ArduinoIoTPreferredConnection)` | เชื่อม Wi-Fi แล้วเปิดการเชื่อมต่อ MQTT + TLS กับ Arduino Cloud ค้างไว้ และต่อใหม่อัตโนมัติถ้าหลุด (หัวข้อ 12.4) |
| `setDebugMessageLevel(2)` / `printDebugInfo()` | พิมพ์สถานะการเชื่อมต่อลง Serial Monitor ช่วยหาสาเหตุเมื่อต่อไม่ติด (ระดับ 4 ละเอียดที่สุด) |
| `ArduinoCloud.update()` | ส่งค่าที่ถึงรอบและรับข้อมูลจากคลาวด์ ต้องเรียกทุกรอบของ `loop()` |
| `millis()` แทน `delay()` | `loop()` จึงวนเร็วและเรียก `update()` ได้ต่อเนื่อง |
| `temp = roundf(... * 10) / 10.0f` | ปัดเป็นทศนิยม 1 ตำแหน่ง ตามความแม่นยำจริงของ AHT25 (หัวข้อ 12.2.2) |
| ไม่หยุดโปรแกรมเมื่อไม่พบ AHT25 | บอร์ดยังเชื่อมคลาวด์ได้และแสดงสถานะ Online ช่วยแยกว่าปัญหาอยู่ที่เซนเซอร์หรือเครือข่าย |

> **ไม่มีบอร์ดจริง?** Wokwi จำลอง ESP32 ได้ แต่การเชื่อม Arduino Cloud จาก Wokwi ต้องตั้งค่าเพิ่มและอาจไม่เสถียร ควรใช้บอร์ดจริงสำหรับบทนี้

### 12.8.6 สร้าง Dashboard ของส่วนที่ 1

1. เมนู **Dashboards** → **Create Dashboard** → ตั้งชื่อ `MCC Monitor`
2. กดปุ่มแก้ไข (✏️) → **Add** → เลือกแท็บ **Things** → เลือก `MCC Monitor` → **Create Widgets** ระบบจะสร้าง Widget ให้ทุกตัวแปรอัตโนมัติ
3. ปรับ Widget ตามหลักการในหัวข้อ 12.6 (คลิกที่ Widget → ⚙️ หรือ **Edit Settings**) และเพิ่ม Widget ด้วยปุ่ม **Add → Widgets**

| แถว | Widget | ตัวแปร | ตั้งค่า |
|:---|:---|:---|:---|
| 1 | **Gauge** | `temp` | Min `0`, Max `60` ชื่อ "อุณหภูมิ (°C)" |
| 1 | **Gauge** | `hum` | Min `0`, Max `100` ชื่อ "ความชื้น (%RH)" |
| 2 | **Chart** | `temp` | ชื่อ "แนวโน้มอุณหภูมิ" |
| 2 | **Chart** | `hum` | ชื่อ "แนวโน้มความชื้น" (แยกกราฟเพราะหน่วยต่างกัน) |

4. จัดตำแหน่งตามแถว (ภาพรวมบน แนวโน้มล่าง) เว้นแถวที่ 3 ไว้สำหรับส่วนที่ 2 → **Done**
5. กดไอคอน **Mobile Layout** เพื่อดูหน้าตาบนมือถือ และ (ไม่บังคับ) ติดตั้งแอป **Arduino IoT Remote** บนมือถือ แล้ว login บัญชีเดียวกันเพื่อเปิด Dashboard

**ทดสอบ**

| การทดลอง | ผลที่ควรเห็น |
|:---|:---|
| ใช้นิ้วจับ AHT25 นาน 1 นาที | Gauge อุณหภูมิเพิ่มขึ้น และเส้น Chart ยกตัว |
| เทียบค่าบน Gauge กับ Serial Monitor | ตรงกัน (ต่างกันได้ไม่เกิน 1 รอบส่ง) |
| ถอดสาย USB ของ ESP32-S3 แล้วรอ 1–2 นาที | หน้า **Devices** เปลี่ยนเป็น **Offline** ส่วน Gauge ค้างที่ค่าล่าสุด (Digital Twin เก็บค่าที่รู้ล่าสุด) |
| เปลี่ยนช่วงเวลาของ Chart (เช่น 1 ชั่วโมง / 1 วัน) | ดูย้อนหลังได้ไม่เกิน 1 วันในแผนฟรี |

### 12.8.7 การแจ้งเตือนอุณหภูมิสูง (ไม่บังคับ)

**Triggers** ของ Arduino Cloud ส่งอีเมลหรือแจ้งเตือนในแอปได้ แต่ **ต้องใช้แผน Maker** และรองรับเฉพาะตัวแปรชนิด `bool` และ `String` ([Arduino Docs: Triggers](https://docs.arduino.cc/arduino-cloud/cloud-interface/triggers/)) จึงให้ ESP32 เป็นผู้ตัดสินว่า "ร้อนเกินเกณฑ์" แล้วเขียนผลลงตัวแปร `bool`

1. เพิ่มตัวแปร `overheat` ชนิด **Boolean**, **Read Only**, **On Change** → คัดลอก `thingProperties.h` ใหม่จากแท็บ Sketch มาแทนของเดิม
2. ใน `loop()` ต่อจากบรรทัด `hum = ...` เพิ่มเงื่อนไขว่าอุณหภูมิเกิน 35 °C **ต่อเนื่อง** 2 นาที

```cpp
static unsigned long hotSince = 0;                 // เวลาที่เริ่มร้อนเกินเกณฑ์ (0 = ยังไม่ร้อน)
if (t.temperature > 35.0) {
  if (hotSince == 0) hotSince = millis();
  overheat = (millis() - hotSince >= 2UL * 60 * 1000);
} else {
  hotSince = 0;
  overheat = false;
}
```

3. **แผนฟรี:** เพิ่ม Widget **Status** หรือ **LED** ผูกกับ `overheat` ไว้แถวที่ 1 ของ Dashboard · **แผน Maker:** **Triggers → Add Trigger → Cloud Variable** → เลือก Thing และ `overheat` → **Link Variable** → Action **Email** → เปิด **State**

เงื่อนไข "ต่อเนื่อง 2 นาที" ป้องกันการแจ้งเตือนผิดจากค่ากระโดดเพียงครั้งเดียว (เช่น มีคนเปิดตู้ชั่วขณะ) และเพราะ `overheat` เป็น On Change จึงถูกส่งเฉพาะตอนเปลี่ยนสถานะ ไม่ส่งซ้ำทุก 5 วินาที

> ถ้าแผนที่ใช้จำกัดจำนวนตัวแปรต่อ Thing จนเพิ่ม `overheat` แล้วเพิ่มตัวแปรของส่วนที่ 2 ไม่ได้ ให้ลบ `overheat` ออกก่อนเริ่มส่วนที่ 2

---

## 12.9 ปฏิบัติการส่วนที่ 2: สั่งการ (Dashboard ↔ Arduino Cloud ↔ ESP32)

**เป้าหมายของส่วนที่ 2:** ช่างสั่งเปิด/ปิดไฟ ปั๊ม และพัดลม (แทนด้วย LED) ได้ 2 ทาง คือจาก Switch บน Dashboard และจากปุ่มหน้าตู้ โดยทั้งสองทางซิงก์กันผ่านตัวแปร `light`, `pump`, `fan`

### 12.9.1 ต่อวงจรเพิ่ม

ต่อเพิ่มจากวงจรส่วนที่ 1 โดยไม่ต้องถอด AHT25

| อุปกรณ์ | ขาอุปกรณ์ | ESP32-S3 |
|:---|:---|:---|
| ปุ่ม 1 ไฟ (`light`) | ขาหนึ่ง / อีกขา | GPIO 4 / GND |
| ปุ่ม 2 ปั๊ม (`pump`) | ขาหนึ่ง / อีกขา | GPIO 5 / GND |
| ปุ่ม 3 พัดลม (`fan`) | ขาหนึ่ง / อีกขา | GPIO 6 / GND |
| LED 1 ไฟ (`light`) | ขายาว (Anode) ผ่าน R 220 Ω / ขาสั้น (Cathode) | GPIO 10 / GND |
| LED 2 ปั๊ม (`pump`) | ขายาว (Anode) ผ่าน R 220 Ω / ขาสั้น (Cathode) | GPIO 11 / GND |
| LED 3 พัดลม (`fan`) | ขายาว (Anode) ผ่าน R 220 Ω / ขาสั้น (Cathode) | GPIO 12 / GND |

- ปุ่มไม่ต้องต่อตัวต้านทานเพิ่ม เพราะใช้ `INPUT_PULLUP` ภายในชิป
- ปุ่มทำงานแบบ **Toggle** กดครั้งแรกเป็นการเปิด กดอีกครั้งเป็นการปิด
- ถ้า LED ไม่ติด ให้ตรวจขั้วของ LED ก่อน (ขายาวต้องอยู่ฝั่ง GPIO)

### 12.9.2 เพิ่มตัวแปรสั่งการใน Thing

1. เปิด Thing `MCC Monitor` → **Cloud Variables** → **Add** เพิ่มอีก 3 ตัว

| Name | Type | Permission | Update Policy |
|:---|:---|:---|:---|
| `light` | Boolean | Read & Write | On Change |
| `pump` | Boolean | Read & Write | On Change |
| `fan` | Boolean | Read & Write | On Change |

2. เปิดแท็บ **Sketch** → `thingProperties.h` ต้องมีตัวแปรครบ 5 ตัว และมีการประกาศ Callback 3 ฟังก์ชัน คือ `onLightChange()`, `onPumpChange()`, `onFanChange()`

### 12.9.3 โปรแกรม ESP32-S3 ส่วนที่ 2 (`mcc_cloud.ino`)

โปรแกรมนี้รวมงานของส่วนที่ 1 ไว้ด้วย จึงใช้แทน `mcc_cloud_monitor.ino` ได้ทันที

1. สร้าง sketch ใหม่ชื่อ `mcc_cloud` → สร้างแท็บ `thingProperties.h` และ `arduino_secrets.h` เหมือนหัวข้อ 12.8.5 (ไฟล์ `arduino_secrets.h` ใช้ค่าเดิม)
2. **`thingProperties.h`:** คัดลอกฉบับใหม่จากแท็บ Sketch (มีตัวแปร 5 ตัว) ตัวอย่างสำหรับตรวจเทียบ

```cpp
// Code generated by Arduino IoT Cloud, DO NOT EDIT.

#include <ArduinoIoTCloud.h>
#include <Arduino_ConnectionHandler.h>

const char DEVICE_LOGIN_NAME[]  = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

const char SSID[]               = SECRET_SSID;          // Network SSID (name)
const char PASS[]               = SECRET_OPTIONAL_PASS; // Network password (use for WPA, or use as key for WEP)
const char DEVICE_KEY[]         = SECRET_DEVICE_KEY;    // Secret device password

void onLightChange();
void onPumpChange();
void onFanChange();

CloudTemperatureSensor temp;
CloudRelativeHumidity hum;
bool light;
bool pump;
bool fan;

void initProperties(){

  ArduinoCloud.setBoardId(DEVICE_LOGIN_NAME);
  ArduinoCloud.setSecretDeviceKey(DEVICE_KEY);
  ArduinoCloud.addProperty(temp, READ, 5 * SECONDS, NULL);
  ArduinoCloud.addProperty(hum, READ, 5 * SECONDS, NULL);
  ArduinoCloud.addProperty(light, READWRITE, ON_CHANGE, onLightChange);
  ArduinoCloud.addProperty(pump, READWRITE, ON_CHANGE, onPumpChange);
  ArduinoCloud.addProperty(fan, READWRITE, ON_CHANGE, onFanChange);

}

WiFiConnectionHandler ArduinoIoTPreferredConnection(SSID, PASS);
```

3. **`mcc_cloud.ino`:** วางโค้ดด้านล่าง → อัปโหลด → เปิด Serial Monitor ที่ **115200**

```cpp
#include "arduino_secrets.h"   // ชื่อ/รหัส Wi-Fi และ Secret Key ของอุปกรณ์
#include "thingProperties.h"   // สร้างโดย Arduino Cloud: ตัวแปร temp, hum, light, pump, fan
#include <Wire.h>
#include <Adafruit_AHTX0.h>

#define I2C_SDA 8
#define I2C_SCL 9
const uint8_t BTN_PINS[3] = {4, 5, 6};             // ปุ่มหน้าตู้
const uint8_t OUT_PINS[3] = {10, 11, 12};          // LED แทนคอนแทคเตอร์
const char*   NAMES[3]    = {"light", "pump", "fan"};

const unsigned long READ_INTERVAL = 5000;   // ms อ่าน AHT25
const unsigned long DEBOUNCE_MS   = 50;     // ms

Adafruit_AHTX0 aht;
unsigned long  lastRead = 0;

// ตัวแปรของ Cloud ทั้ง 3 ตัวรวมเป็นอาร์เรย์ของ pointer เพื่อวนลูปได้
bool* const STATES[3] = {&light, &pump, &fan};

// ตัวแปรที่ใช้ร่วมกับ ISR ต้องเป็น volatile
volatile bool          btnPending[3]  = {false, false, false};
volatile unsigned long btnLastEdge[3] = {0, 0, 0};

// ISR: เรียกทุกครั้งที่ขาเปลี่ยนสถานะ (เหมือน Lab 14)
void IRAM_ATTR onButtonChange(void* arg) {
  int i = (int)(intptr_t)arg;
  unsigned long now = millis();
  if (now - btnLastEdge[i] < DEBOUNCE_MS) {
    btnLastEdge[i] = now;
    return;
  }
  btnLastEdge[i] = now;
  if (digitalRead(BTN_PINS[i]) == LOW) btnPending[i] = true;
}

// ขับ LED ทั้ง 3 ดวงให้ตรงกับค่าของตัวแปร Cloud
void applyOutputs() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(OUT_PINS[i], *STATES[i] ? HIGH : LOW);
  }
}

void setup() {
  Serial.begin(115200);
  delay(1500);

  Wire.begin(I2C_SDA, I2C_SCL);
  if (!aht.begin(&Wire)) {
    Serial.println("AHT25 not found: check wiring SDA=8 SCL=9");
  }

  for (int i = 0; i < 3; i++) {
    pinMode(OUT_PINS[i], OUTPUT);
    pinMode(BTN_PINS[i], INPUT_PULLUP);
    attachInterruptArg(BTN_PINS[i], onButtonChange, (void*)(intptr_t)i, CHANGE);
  }
  applyOutputs();                        // เริ่มต้นปิดทั้งหมด

  initProperties();                      // ประกาศตัวแปร Cloud (thingProperties.h)
  ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  setDebugMessageLevel(2);               // 0 = เฉพาะ error ... 4 = ละเอียดที่สุด
  ArduinoCloud.printDebugInfo();
}

void loop() {
  ArduinoCloud.update();                 // ส่ง/รับค่าตัวแปรกับ Cloud ต้องเรียกบ่อย ๆ

  // 1) ปุ่มหน้าตู้: สลับสถานะ ขับ LED ทันที แล้ว Cloud จะส่งค่าใหม่ขึ้นไปเอง
  for (int i = 0; i < 3; i++) {
    if (btnPending[i]) {
      btnPending[i] = false;
      *STATES[i] = !*STATES[i];          // Toggle
      applyOutputs();
      Serial.printf("BTN %s -> %s\n", NAMES[i], *STATES[i] ? "ON" : "OFF");
    }
  }

  // 2) ค่าเซนเซอร์: อ่านทุก READ_INTERVAL แล้วเขียนลงตัวแปร Cloud
  if (millis() - lastRead >= READ_INTERVAL) {
    lastRead = millis();
    sensors_event_t h, t;
    if (aht.getEvent(&h, &t)) {
      temp = roundf(t.temperature * 10) / 10.0f;          // ทศนิยม 1 ตำแหน่ง
      hum  = roundf(h.relative_humidity * 10) / 10.0f;
      Serial.printf("temp=%.1f hum=%.1f\n", t.temperature, h.relative_humidity);
    } else {
      Serial.println("AHT25 read failed");
    }
  }
}

// ===== Callback: ทำงานเมื่อค่าถูกเปลี่ยนจาก Dashboard =====
void onLightChange() { applyOutputs(); Serial.printf("CMD light -> %s\n", light ? "ON" : "OFF"); }
void onPumpChange()  { applyOutputs(); Serial.printf("CMD pump -> %s\n",  pump  ? "ON" : "OFF"); }
void onFanChange()   { applyOutputs(); Serial.printf("CMD fan -> %s\n",   fan   ? "ON" : "OFF"); }
```

**คำอธิบายโค้ดส่วนที่เพิ่มจากส่วนที่ 1**

| ส่วนของโค้ด | การทำงาน |
|:---|:---|
| `addProperty(fan, READWRITE, ON_CHANGE, onFanChange)` (ใน `thingProperties.h`) | ตัวแปร Read & Write ที่ส่งเมื่อค่าเปลี่ยน และลงทะเบียน `onFanChange()` เป็น Callback รูปแบบนี้ใช้นโยบาย Sync แบบ `CLOUD_WINS` เป็นค่าเริ่มต้น (หัวข้อ 12.5.3) |
| `void onFanChange()` | ไลบรารีเรียกเมื่อ Dashboard เปลี่ยนค่า `fan` โดยค่าใหม่ถูกเขียนลงตัวแปรก่อนแล้ว จึงเพียงเรียก `applyOutputs()` ให้ LED ตรงกับตัวแปร |
| `bool* const STATES[3] = {&light, &pump, &fan}` | อาร์เรย์ของ pointer ไปยังตัวแปร Cloud ทำให้วนลูปจัดการปุ่มและ LED ทั้ง 3 ชุดด้วยโค้ดเดียว `*STATES[i]` คือค่าของตัวแปรที่ pointer ชี้อยู่ |
| `*STATES[i] = !*STATES[i]` แล้ว `applyOutputs()` | ปุ่มหน้าตู้สลับค่าและขับ LED ทันทีโดยไม่รอเครือข่าย ไลบรารีตรวจพบว่าค่าเปลี่ยน (On Change) แล้ว publish ขึ้นคลาวด์เองในการเรียก `update()` ครั้งถัดไป Switch บน Dashboard จึงเปลี่ยนตาม |
| `attachInterruptArg(..., CHANGE)` | ใช้ ISR ตัวเดียวกับทั้ง 3 ปุ่ม โดยส่งหมายเลขปุ่ม `i` เป็นอาร์กิวเมนต์ |
| `IRAM_ATTR` | เก็บ ISR ไว้ใน RAM ภายใน เพื่อให้ตอบสนองได้เร็ว และทำงานได้แม้ cache ของ flash ถูกปิดชั่วคราว |
| Debounce ใน ISR | ขอบสัญญาณที่ห่างจากครั้งก่อนไม่ถึง 50 ms ถูกทิ้ง และช่วงเงียบถูกยืดออก ขอบแรกที่ผ่านเงื่อนไขจะนับเป็นการกดเมื่อขาอ่านได้ `LOW` เท่านั้น กดหนึ่งครั้งจึงได้หนึ่งการสั่ง การปล่อยปุ่มหรือกดค้างไม่ทำให้นับซ้ำ |
| `volatile` | บอกคอมไพเลอร์ว่าตัวแปรถูกแก้จาก ISR ได้ทุกเมื่อ ต้องอ่านจากหน่วยความจำจริงทุกครั้ง |
| ตัวแปร Cloud ไม่ถูกแก้ใน ISR | ISR ตั้งเพียง flag `btnPending` ส่วนการแก้ `light`, `pump`, `fan` ทำใน `loop()` เพราะไลบรารีอ่านตัวแปรเหล่านี้ใน `update()` ถ้าแก้จาก ISR อาจชนกันระหว่างส่งข้อมูล |

> **ข้อจำกัดของระบบ:** (1) ระหว่างบอร์ดบูตจนถึงเชื่อมต่อคลาวด์สำเร็จ (ราว 5–30 วินาที) LED จะอยู่ในสถานะเริ่มต้น (ปิด) แล้วจึงถูก Sync กลับเป็นค่าบนคลาวด์ (2) ตัวแปร `bool` บอกเพียง **สถานะที่สั่ง** ไม่ได้ยืนยันว่าอุปกรณ์ทำงานจริง งานจริงควรใช้หน้าสัมผัสช่วย (Auxiliary Contact) ของคอนแทคเตอร์ส่งสถานะจริงกลับเป็นตัวแปร Read Only อีกตัว (3) Arduino Cloud ไม่เก็บว่าใครสั่งเมื่อไร ถ้าต้องการประวัติ ต้องส่งเหตุการณ์ไปเก็บในระบบอื่น

### 12.9.4 เพิ่ม Switch บน Dashboard และทดสอบการสั่งการ

1. เปิด Dashboard `MCC Monitor` → ✏️ → **Add → Widgets → Switch** 3 ตัว ผูกกับ `light`, `pump`, `fan` ตั้งชื่อ "ไฟในตู้", "ปั๊ม", "พัดลมระบายอากาศ"
2. วางไว้แถวที่ 3 และขยายให้ใหญ่พอกดบนมือถือได้ง่าย → **Done**

**ทดสอบ**

| การทดลอง | ผลที่ควรเห็น |
|:---|:---|
| กด Switch `fan` บน Dashboard | Serial ขึ้น `CMD fan -> ON` และ LED พัดลมติดภายในไม่ถึง 1–2 วินาที |
| กดปุ่ม `pump` หน้าตู้ | Serial ขึ้น `BTN pump -> ON` LED ติดทันที และ Switch ปั๊มบน Dashboard เปลี่ยนเป็นเปิดภายในไม่กี่วินาที |
| กดปุ่ม `fan` ค้างไว้ 3 วินาทีแล้วปล่อย | สลับเพียง 1 ครั้ง (Debounce) |
| สั่งจากแอป IoT Remote บนมือถือ ขณะมือถือใช้ 4G/5G (คนละเครือข่ายกับบอร์ด) | LED ทำงานได้ เพราะทั้งสองฝั่งคุยผ่านคลาวด์ ไม่ต้องอยู่ในเครือข่ายเดียวกัน |
| เปิด `fan` แล้วกดปุ่ม EN (รีเซ็ต) บนบอร์ด | LED ดับระหว่างบูต แล้วกลับมาติดเมื่อเชื่อมต่อคลาวด์ได้ (`CLOUD_WINS`) |
| ปิด Hotspot 30 วินาที ระหว่างนั้นกด Switch `light` แล้วเปิด Hotspot | เมื่อบอร์ดเชื่อมต่อใหม่ LED `light` จะเปลี่ยนตามค่าบนคลาวด์ |

---

## 12.10 การแก้ปัญหาที่พบบ่อย

| ส่วน | อาการ | สาเหตุที่เป็นไปได้ | วิธีแก้ |
|:---|:---|:---|:---|
| 1 | Serial Monitor ไม่แสดงอะไร | ปิด USB CDC On Boot | ตั้ง **USB CDC On Boot: Enabled** แล้วอัปโหลดใหม่ |
| 1 | compile ไม่ผ่าน: `'SECRET_SSID' was not declared` | ไม่มีไฟล์ `arduino_secrets.h` หรือ include หลัง `thingProperties.h` | สร้างแท็บ `arduino_secrets.h` และ `#include "arduino_secrets.h"` เป็นบรรทัดแรกของ `.ino` |
| 1 | compile ไม่ผ่าน: `ArduinoIoTCloud.h: No such file or directory` | ยังไม่ได้ติดตั้งไลบรารี | ติดตั้ง **ArduinoIoTCloud** พร้อม dependencies (Install All) |
| 1 | compile ไม่ผ่าน: `'temp' was not declared` หรือ `onFanChange` ไม่พบ | ชื่อตัวแปรบน Thing ไม่ตรงกับโปรแกรม หรือยังไม่ได้คัดลอก `thingProperties.h` ฉบับใหม่ | ตั้งชื่อตัวแปรให้ตรงทุกตัวอักษร แล้วคัดลอก `thingProperties.h` ใหม่จากแท็บ Sketch |
| 1 | `AHT25 not found` | สาย SDA/SCL สลับ หรือไม่ได้จ่ายไฟ | ตรวจขาตามที่พิมพ์ไว้บนโมดูล และใช้ 3V3 |
| 1 | ต่อ Wi-Fi ไม่ขึ้น | เครือข่าย 5 GHz หรือเป็น WPA2-Enterprise | ใช้ Hotspot มือถือแบบ 2.4 GHz |
| 1 | ต่อ Wi-Fi ได้ แต่ Serial แจ้งเชื่อม Arduino Cloud ไม่สำเร็จซ้ำ ๆ และหน้า Devices เป็น Offline | Secret Key หรือ Device ID ผิด หรือเครือข่ายปิด port 8884 | คัดลอก Device ID ใหม่จาก `thingProperties.h` ของ Thing ตรวจ Secret Key (ถ้าทำหายให้ลบอุปกรณ์แล้วลงทะเบียนใหม่) และลองใช้ Hotspot มือถือ ตั้ง `setDebugMessageLevel(4)` เพื่อดูรายละเอียด |
| 1 | Online แต่ค่าบน Dashboard ไม่เปลี่ยน | ใช้ `delay()` ยาวใน `loop()` หรือ Widget ผูกผิดตัวแปร | เอา `delay()` ออก ใช้ `millis()` และตรวจ Linked Variable ของ Widget |
| 1 | Chart ไม่มีข้อมูลเก่า | แผนฟรีเก็บค่าย้อนหลัง 1 วัน และ Widget ที่ลบแล้วสร้างใหม่จะเริ่มประวัติใหม่ | ข้อจำกัดของแผน ดาวน์โหลดข้อมูลเก็บไว้ถ้าต้องใช้ |
| 1 | compile บน Cloud Editor ไม่ได้: เกินเพดาน | แผนฟรี compile ได้ 25 ครั้งต่อวัน | ใช้ Arduino IDE บนเครื่อง (หัวข้อ 12.8.2) |
| 2 | LED ไม่ติดเลย | ต่อ LED กลับขั้ว หรือลืมตัวต้านทาน | ขายาวต่อฝั่ง GPIO ผ่าน 220 Ω ขาสั้นต่อ GND |
| 2 | กดปุ่มครั้งเดียวสลับ 2 ครั้ง | ปุ่มเด้งนานกว่า 50 ms | เพิ่ม `DEBOUNCE_MS` เป็น 80–100 |
| 2 | กด Switch บน Dashboard แล้วไม่มี `CMD ...` ใน Serial | ตั้งตัวแปรเป็น Read Only แทน Read & Write หรือ `thingProperties.h` ยังเป็นฉบับเก่า | แก้ Permission เป็น Read & Write แล้วคัดลอก `thingProperties.h` ใหม่ |
| 2 | Switch บน Dashboard กดไม่ได้ (เป็นสีเทา) | ตัวแปรเป็น Read Only | แก้ Permission เป็น Read & Write |
| 2 | กดปุ่มหน้าตู้แล้ว LED ติด แต่ Switch บน Dashboard ไม่เปลี่ยน | แก้ตัวแปร Cloud ใน ISR หรือบอร์ด Offline | แก้ตัวแปรใน `loop()` เท่านั้น และตรวจสถานะ Online |
| 2 | หลังรีบูต LED ไม่กลับมาตามค่าบนคลาวด์ | ใช้ `addProperty(..., Permission::ReadWrite)` แบบใหม่ที่ไม่ได้กำหนด `onSync()` หรือกำหนดเป็น `DEVICE_WINS` | ใช้ `thingProperties.h` ที่ Arduino Cloud สร้างให้ หรือเพิ่ม `.onSync(CLOUD_WINS)` |

</div>

<div class="chapter-tab-content" data-tab-name="Lab 14" data-tab-icon="🔬" id="lab14" markdown="1">

## 12.11 ใบงานปฏิบัติการ Lab 14: ระบบติดตามและสั่งการตู้ควบคุมด้วย Arduino Cloud

**ฮาร์ดแวร์:** ESP32-S3 DevKit + AHT25 + ปุ่มกด 3 ปุ่ม + LED 3 ดวง + ตัวต้านทาน 220 Ω 3 ตัว  
**เครื่องมือ (ฟรีทั้งหมด):** Arduino IDE + [Arduino Cloud](https://cloud.arduino.cc/) (Free Plan) + แอป Arduino IoT Remote (ไม่บังคับ)  
**เวลา:** 3 ชั่วโมง (ส่วนที่ 1 ประมาณ 100 นาที · ส่วนที่ 2 ประมาณ 80 นาที)

> ใบงานนี้ใช้ทำตามลำดับขั้นและบันทึกผล ส่วนโค้ดฉบับเต็มและคำอธิบายอยู่ในแท็บ **Hands-on** (หัวข้อ 12.8 สำหรับส่วนที่ 1 และ 12.9 สำหรับส่วนที่ 2)

### วัตถุประสงค์ของใบงาน

**ส่วนที่ 1: ติดตาม (Sensor → ESP32 → Arduino Cloud → Dashboard)**
- ต่อวงจร ESP32-S3 กับ AHT25 (I2C) ได้
- ลงทะเบียน ESP32-S3 เป็น Third Party Device และสร้าง Thing พร้อม Cloud Variables ที่มี Permission และ Update Policy เหมาะสมได้
- เขียนโปรแกรมด้วยไลบรารี `ArduinoIoTCloud` ให้ส่งค่าเซนเซอร์ขึ้นคลาวด์ได้
- สร้าง Dashboard ด้วย Gauge และ Chart ตามหลักการออกแบบที่ดีได้

**ส่วนที่ 2: สั่งการ (Dashboard ↔ Arduino Cloud ↔ ESP32)**
- ต่อปุ่มกด (Pull-up + Interrupt) และ LED เป็นเอาต์พุตได้
- ใช้ตัวแปร Read & Write และ Callback รับคำสั่งจาก Dashboard ได้
- ทำให้ปุ่มหน้าตู้และ Switch บน Dashboard ซิงก์กันได้
- อธิบายความหน่วงแบบ Push และพฤติกรรม Sync หลังรีบูตจากผลการทดลองได้

**สถานการณ์:** ติดตั้งอุปกรณ์ในตู้ควบคุมมอเตอร์ปั๊ม (MCC) เพื่อวัดอุณหภูมิและความชื้นภายในตู้ (ส่วนที่ 1) และให้ช่างสั่งเปิด/ปิด **ไฟ** (`light`), **ปั๊ม** (`pump`) และ **พัดลม** (`fan`) ได้ทั้งจาก Dashboard บนมือถือและจากปุ่มหน้าตู้ (ส่วนที่ 2)

---

## ส่วนที่ 1: ติดตาม (Sensor → ESP32 → Arduino Cloud → Dashboard)

### ขั้นที่ 1.1: ต่อวงจรและตั้งค่า Arduino IDE (20 นาที)

#### ความรู้เบื้องต้น

- **AHT25** เป็นเซนเซอร์ดิจิทัล สื่อสารผ่าน I2C ที่ address `0x38` ESP32-S3 เลือกขา I2C ได้อิสระ บทนี้ใช้ SDA = GPIO 8 และ SCL = GPIO 9
- ไลบรารี **ArduinoIoTCloud** จัดการการเชื่อมต่อ MQTT + TLS กับ Arduino Cloud ให้ทั้งหมด

#### ขั้นตอนปฏิบัติ

| อุปกรณ์ | ขาอุปกรณ์ | ESP32-S3 |
|:---|:---|:---|
| AHT25 | VDD / GND / SDA / SCL | 3V3 / GND / GPIO 8 / GPIO 9 |

1. ต่อวงจรตามตาราง โดยดูลำดับขาตามที่พิมพ์ไว้บนโมดูล AHT25 และ **ห้ามต่อเข้า 5V**
2. Arduino IDE → ติดตั้ง **esp32 by Espressif Systems**, **Adafruit AHTX0** และ **ArduinoIoTCloud** (Install All) ตาม **หัวข้อ 12.8.2**
3. **Tools** → Board **ESP32S3 Dev Module** → **USB CDC On Boot: Enabled**
4. เตรียม Wi-Fi แบบ **2.4 GHz** ที่ไม่ต้อง login ผ่านหน้าเว็บ (ใช้ Hotspot มือถือได้)

#### ตารางบันทึกผล — ขั้นที่ 1.1

| รายการ | สถานะ |
|:---|:---|
| ต่อวงจรครบ ตรวจแรงดันที่ขา VDD ของ AHT25 = 3.3 V | ________ |
| ติดตั้ง ESP32 core, Adafruit AHTX0 และ ArduinoIoTCloud สำเร็จ | ________ |
| ชื่อ Wi-Fi ที่ใช้ และย่านความถี่ | ________ |

### ขั้นที่ 1.2: ลงทะเบียนอุปกรณ์และสร้าง Thing (25 นาที)

#### ขั้นตอนปฏิบัติ

1. ลงทะเบียน ESP32-S3 เป็น **Third Party Device** ชื่อ `MCC-` ตามด้วยรหัสนักศึกษา 4 ตัวท้าย ตาม **หัวข้อ 12.8.3** และเก็บ **Device ID** กับ **Secret Key** ไว้
2. สร้าง Thing `MCC Monitor` → Associate Device → ตั้งค่า Network → เพิ่มตัวแปร `temp` และ `hum` ตาม **หัวข้อ 12.8.4**

#### ตารางบันทึกผล — ขั้นที่ 1.2

| รายการ | สถานะ |
|:---|:---|
| ชื่ออุปกรณ์ และ Device ID (8 ตัวอักษรแรก) | ________ |
| เก็บ Secret Key ไว้ที่ใด (ห้ามจดตัว key ลงในใบงาน) | ________ |
| ตัวแปรที่สร้าง (ชื่อ · Type · Permission · Update Policy) | ________ |

### ขั้นที่ 1.3: โปรแกรม ESP32-S3 ส่งค่าเซนเซอร์ (30 นาที)

#### ความรู้เบื้องต้น

- `thingProperties.h` สร้างโดย Arduino Cloud ประกาศตัวแปร `temp` และ `hum` ไว้แล้ว โปรแกรมเพียงเขียนค่า เช่น `temp = 31.4;` แล้วไลบรารีจะส่งขึ้นคลาวด์ทุก 5 วินาที
- `ArduinoCloud.update()` ต้องถูกเรียกบ่อย ๆ ใน `loop()` จึงใช้ `millis()` แทน `delay()`

#### ขั้นตอนปฏิบัติ

1. สร้าง sketch `mcc_cloud_monitor` ที่มี 3 ไฟล์ ตาม **หัวข้อ 12.8.5** (`thingProperties.h` คัดลอกจากแท็บ Sketch ของ Thing, `arduino_secrets.h` ใส่ค่าของตนเอง)
2. อัปโหลด → เปิด Serial Monitor ที่ **115200** → รอจนขึ้น `Connected to Arduino IoT Cloud`
3. ตรวจหน้า **Devices** (Online) และหน้า Thing (Last Value ของ `temp`, `hum`)

#### ตารางบันทึกผล — ขั้นที่ 1.3

| การทดลอง | ผล |
|:---|:---|
| เวลาตั้งแต่อัปโหลดเสร็จจนขึ้น `Connected to Arduino IoT Cloud` | ________ วินาที |
| ค่า `temp` / `hum` ในหน้า Thing เทียบกับ Serial Monitor | Thing ____ / Serial ____ |
| ใช้นิ้วจับ AHT25 นาน 30 วินาที | temp เปลี่ยนจาก ____ เป็น ____ °C |
| แก้ Secret Key ผิด 1 ตัวอักษร แล้วอัปโหลดใหม่ | ข้อความใน Serial: ________ สถานะใน Devices: ________ (ทดสอบแล้วแก้กลับ) |
| ใส่ `delay(20000);` ท้าย `loop()` ชั่วคราว | ค่าบน Thing อัปเดตทุก ____ วินาที เพราะ: ________ (ทดสอบแล้วลบออก) |

### ขั้นที่ 1.4: สร้าง Dashboard (25 นาที)

#### ขั้นตอนปฏิบัติ

1. สร้าง Dashboard `MCC Monitor` → **Create Widgets** จาก Thing → ปรับเป็น Gauge และ Chart ตาม **หัวข้อ 12.8.6**
2. (ไม่บังคับ) ติดตั้งแอป **Arduino IoT Remote** แล้วเปิด Dashboard บนมือถือ
3. (ไม่บังคับ) เพิ่มตัวแปร `overheat` และ Widget Status ตาม **หัวข้อ 12.8.7**

#### ตารางบันทึกผล — ขั้นที่ 1.4

| การทดลอง | ผลที่เห็นบน Dashboard |
|:---|:---|
| ใช้นิ้วจับ AHT25 นาน 1 นาที | Gauge: ________ Chart: ________ |
| ถอดสาย USB ของ ESP32-S3 แล้วรอ 2 นาที | Gauge แสดงค่าใด: ________ สถานะในหน้า Devices: ________ |
| Dashboard บอกได้หรือไม่ว่าอุปกรณ์ Offline ถ้าบอกไม่ได้ ช่างจะเข้าใจผิดอย่างไร | ________ |
| เปลี่ยนช่วงเวลาของ Chart | ดูย้อนหลังได้นานสุด: ________ |
| (ไม่บังคับ) ทำให้อุณหภูมิเกิน 35 °C นาน 2 นาที | Widget Status `overheat`: ________ |

---

## ส่วนที่ 2: สั่งการ (Dashboard ↔ Arduino Cloud ↔ ESP32)

> เริ่มส่วนที่ 2 ได้เมื่อ Dashboard ของส่วนที่ 1 แสดงข้อมูลได้แล้วเท่านั้น

### ขั้นที่ 2.1: ต่อ LED + ปุ่ม และเพิ่มตัวแปรสั่งการ (25 นาที)

#### ความรู้เบื้องต้น

- **ปุ่มกด** ต่อระหว่างขา GPIO กับ GND แล้วเปิด `INPUT_PULLUP` ขาจะอ่านได้ `HIGH` ตอนปล่อย และ `LOW` ตอนกด
- **LED** ต่อผ่านตัวต้านทาน 220 Ω จำกัดกระแสไว้ราว 6 mA ($I = (3.3 - 2.0)/220$)
- ตัวแปร **Read & Write** เปลี่ยนได้ทั้งจาก Dashboard และจากบอร์ด เมื่อ Dashboard เปลี่ยนค่า ไลบรารีจะเรียก **Callback**

#### ขั้นตอนปฏิบัติ

| อุปกรณ์ | ESP32-S3 |
|:---|:---|
| ปุ่ม `light` / `pump` / `fan` (อีกขาต่อ GND) | GPIO 4 / 5 / 6 |
| LED `light` / `pump` / `fan` (ขายาวผ่าน R 220 Ω, ขาสั้นต่อ GND) | GPIO 10 / 11 / 12 |

1. ต่อวงจรเพิ่มตามตาราง โดยไม่ต้องถอด AHT25
2. เพิ่มตัวแปร `light`, `pump`, `fan` ใน Thing ตาม **หัวข้อ 12.9.2**
3. เปิดแท็บ Sketch แล้วตรวจ `thingProperties.h` ฉบับใหม่

#### ตารางบันทึกผล — ขั้นที่ 2.1

| รายการ | สถานะ |
|:---|:---|
| จำนวนตัวแปรใน Thing และชื่อ | ________ |
| ชื่อ Callback ทั้ง 3 ฟังก์ชันใน `thingProperties.h` | ________ |
| บรรทัด `addProperty` ของ `fan` (คัดลอกมา) | ________ |

### ขั้นที่ 2.2: โปรแกรม ESP32-S3 รับคำสั่งและปุ่มหน้าตู้ (25 นาที)

#### ความรู้เบื้องต้น

- Dashboard เปลี่ยนค่า → คลาวด์ **push** ลงบอร์ดทันที → `onFanChange()` ขับ LED
- ปุ่มหน้าตู้เปลี่ยนตัวแปรในบอร์ด → ไลบรารีส่งขึ้นคลาวด์เอง (On Change) → Switch บน Dashboard เปลี่ยนตาม
- ช่วงที่ `ArduinoCloud.update()` ค้าง (เช่นกำลังเชื่อมต่อใหม่) โปรแกรมจึงอ่านปุ่มด้วย **Interrupt** และทำ **Debounce** 50 ms ใน ISR

#### ขั้นตอนปฏิบัติ

1. สร้าง sketch `mcc_cloud` ตาม **หัวข้อ 12.9.3** (คัดลอก `thingProperties.h` ฉบับ 5 ตัวแปร ใช้ `arduino_secrets.h` เดิม)
2. อัปโหลด → Serial Monitor ต้องขึ้น `Connected to Arduino IoT Cloud` และค่า `temp=... hum=...` ทุก 5 วินาทีเหมือนเดิม
3. กดปุ่มแต่ละปุ่ม 1 ครั้ง → LED ต้องติดทันที และเห็น `BTN ... -> ON` **ครั้งเดียวต่อการกด**

#### ตารางบันทึกผล — ขั้นที่ 2.2

| การทดลอง | ผลใน Serial Monitor / LED | ค่าตัวแปรในหน้า Thing |
|:---|:---|:---|
| กดปุ่ม `light` 1 ครั้ง | ________ | ________ |
| กดปุ่ม `light` อีก 1 ครั้ง | ________ | ________ |
| กดปุ่ม `fan` ค้างไว้ 3 วินาทีแล้วปล่อย | สลับกี่ครั้ง: ________ | ________ |

### ขั้นที่ 2.3: สั่งการจาก Dashboard และทดสอบการซิงก์ (30 นาที)

#### ขั้นตอนปฏิบัติ

1. เพิ่ม Widget **Switch** 3 ตัว ผูกกับ `light`, `pump`, `fan` ไว้แถวที่ 3 ตาม **หัวข้อ 12.9.4**
2. ทดลองตามตารางด้านล่าง โดยเปิด Serial Monitor ไว้ตลอด

#### ตารางบันทึกผล — ขั้นที่ 2.3

| การทดลอง | ผลที่เห็น |
|:---|:---|
| กด Switch `fan` แล้วจับเวลาจนถึง LED ติด (ทำ 5 ครั้ง) | ____ / ____ / ____ / ____ / ____ เฉลี่ย ____ วินาที (เทียบกับค่าประมาณของ Polling ในหัวข้อ 12.5.1) |
| กดปุ่ม `pump` หน้าตู้ แล้วดู Switch บน Dashboard | เปลี่ยนภายใน ____ วินาที |
| สั่งจากแอป IoT Remote ขณะมือถือใช้ 4G/5G | LED ทำงานหรือไม่ เพราะเหตุใด: ________ |
| เปิด `fan` จาก Dashboard แล้วกดปุ่ม EN (รีเซ็ต) บนบอร์ด | LED `fan` ระหว่างบูต: ____ หลังเชื่อมต่อ: ____ ใช้เวลา ____ วินาที |
| ปิด Hotspot 30 วินาที ระหว่างนั้นกด Switch `light` แล้วเปิด Hotspot | LED `light` ทำงานเมื่อใด: ________ Serial แสดงอะไร: ________ |
| กด Switch `pump` บน Dashboard และกดปุ่ม `pump` หน้าตู้เกือบพร้อมกัน | สถานะสุดท้าย: ________ อธิบาย: ________ |
| หาประวัติว่า "ใครสั่งเปิดพัดลมเมื่อไร" | ทำได้หรือไม่ อย่างไร: ________ |

---

### แบบฝึกหัดท้ายใบงาน

1. **Interrupt กับ Polling:** ถ้าโปรแกรมอ่านปุ่มด้วย `digitalRead()` ใน `loop()` แทน Interrupt จะเกิดปัญหาเมื่อใด อธิบายโดยเชื่อมโยงกับการทำงานของ `ArduinoCloud.update()` ขณะ Wi-Fi หลุด

   > คำตอบ: _______________________________________________________________

2. **Push กับ Poll:** จากผลจับเวลาในขั้นที่ 2.3 อธิบายว่าทำไมความหน่วงจึงต่ำกว่าระบบที่บอร์ดต้องถามเซิร์ฟเวอร์ทุก 2 วินาที และทำไมคลาวด์จึงส่งคำสั่งถึงบอร์ดได้ทั้งที่บอร์ดอยู่หลัง NAT

   > คำตอบ: _______________________________________________________________

3. **Sync หลังรีบูต:** จากผลการกดปุ่ม EN ขณะเปิด `fan` อธิบายการทำงานของ `CLOUD_WINS` และเสนอว่าอุปกรณ์ใดใน 3 ตัว (ไฟ ปั๊ม พัดลม) ควรเปลี่ยนเป็น `DEVICE_WINS` เพราะเหตุใด

   > คำตอบ: _______________________________________________________________

4. **ความปลอดภัย:** ถ้ามีผู้ไม่หวังดีได้ Secret Key ของบอร์ดไป เขาทำอะไรได้บ้าง และทำอะไรไม่ได้บ้าง ควรแก้ไขอย่างไร

   > คำตอบ: _______________________________________________________________

5. **ประยุกต์งานเครื่องกล:** ถ้าต้องการรู้ว่า "เปิดพัดลมระบายอากาศแล้ว อุณหภูมิในตู้ลดลงเร็วเพียงใด" จะใช้ Widget ใดบน Dashboard และข้อจำกัดของแผนฟรี (เก็บข้อมูล 1 วัน ไม่มีประวัติการสั่ง) มีผลต่อการวิเคราะห์นี้อย่างไร

   > คำตอบ: _______________________________________________________________

---

### การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จากอาจารย์ผู้สอน)**

สิ่งที่ต้องส่ง:
1. รูปถ่ายวงจรจริง ESP32-S3 + AHT25 + ปุ่ม 3 ปุ่ม + LED 3 ดวง
2. Screenshot หน้า **Thing** ที่แสดง Associated Device และ Cloud Variables ครบ 5 ตัว
3. Screenshot Serial Monitor ที่แสดง `Connected to Arduino IoT Cloud`, `BTN ... -> ON` และ `CMD ... -> ON`
4. Screenshot Dashboard `MCC Monitor` ที่มีครบ 3 แถว (ภาพรวม · แนวโน้ม · สั่งการ) บนคอมพิวเตอร์ หรือแอป Arduino IoT Remote
5. คลิปวิดีโอสั้น (ไม่เกิน 30 วินาที) แสดงการกด Switch บน Dashboard แล้ว LED บนบอร์ดติด และการกดปุ่มหน้าตู้แล้ว Switch บน Dashboard เปลี่ยนตาม
6. คำตอบแบบฝึกหัดท้ายใบงานครบทุกข้อ

#### Checklist ก่อนส่ง

- [ ] ชื่ออุปกรณ์เป็นรูปแบบ `MCC-` ตามด้วยรหัสนักศึกษา 4 ตัวท้าย
- [ ] ชื่อตัวแปรบน Arduino Cloud ตรงกับโปรแกรม (`temp`, `hum`, `light`, `pump`, `fan`)
- [ ] `temp`, `hum` เป็น Read Only และ `light`, `pump`, `fan` เป็น Read & Write
- [ ] `arduino_secrets.h` และ Secret Key ไม่ถูกนำขึ้น GitHub หรือแนบในไฟล์ที่ส่ง
- [ ] `loop()` ไม่มี `delay()` ยาว ๆ ที่ขวาง `ArduinoCloud.update()`
- [ ] กดปุ่ม 1 ครั้งได้ 1 การสั่งเสมอ
- [ ] กรอกตารางบันทึกผลครบทุกขั้น
- [ ] ระบุชื่อ-นามสกุล และรหัสนักศึกษาในฟอร์ม

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="summary" markdown="1">

## 12.12 สรุปประจำบทที่ 12 (Summary)

1. **ระบบ IoT แบบครบวงจร** ประกอบด้วย 4 ชั้น ได้แก่ เซนเซอร์ ปุ่ม และเอาต์พุต (AHT25, LED) อุปกรณ์เครือข่าย (ESP32-S3 + MQTT over TLS) แพลตฟอร์มคลาวด์ (Arduino Cloud) และแอปพลิเคชันแสดงผลและสั่งการ (Dashboard บนเว็บและมือถือ) โดยแบ่งเป็นเส้นทาง **ติดตาม** (ส่วนที่ 1) และเส้นทาง **สั่งการ** (ส่วนที่ 2)
2. **AHT25** สื่อสารผ่าน I2C ที่ address `0x38` ให้ค่าดิบ 20 บิต ซึ่งแปลงเป็นหน่วยจริงได้ด้วย $RH = S_{RH}/2^{20} \times 100$ และ $T = S_T/2^{20} \times 200 - 50$ ความละเอียดของค่าไม่ใช่ความแม่นยำ
3. **ปุ่มกด** ต้องใช้ Pull-up และ Debounce และควรอ่านด้วย **Interrupt** เพราะ `ArduinoCloud.update()` อาจค้างขณะเชื่อมต่อใหม่ ส่วน **เอาต์พุต** ต้องจำกัดกระแสด้วยตัวต้านทาน และใช้โมดูลรีเลย์เมื่อขับโหลดจริง
4. **Device, Thing, Cloud Variable, Dashboard** เป็นองค์ประกอบหลักของ Arduino Cloud โดย Thing เป็น **Digital Twin** ที่เก็บสำเนาสถานะของอุปกรณ์
5. **Telemetry ใช้ Read Only + Periodically** ส่วน **Command State ใช้ Read & Write + On Change** และตัวแปร Read & Write จะมี **Callback** ที่ถูกเรียกเมื่อ Dashboard เปลี่ยนค่า
6. **ความปลอดภัย** อาศัย Device ID + Secret Key เฉพาะแต่ละอุปกรณ์ การเข้ารหัส TLS และบัญชีผู้ใช้ Arduino Secret Key แสดงเพียงครั้งเดียวและห้ามเผยแพร่
7. **MQTT Push** ทำให้คำสั่งถึงบอร์ดภายในไม่ถึงวินาที เพราะบอร์ดเปิดการเชื่อมต่อค้างไว้ ต่างจาก Polling ที่มีความหน่วงราว $T_{poll}/2 + t_{HTTPS}$ และ `ArduinoCloud.update()` ต้องถูกเรียกบ่อย ๆ เสมอ
8. **Sync หลังเชื่อมต่อใหม่** ตัดสินด้วย `CLOUD_WINS` (ค่าเริ่มต้นของโค้ดที่สร้างให้ คืนสถานะที่สั่งไว้) หรือ `DEVICE_WINS` (ใช้ค่าในบอร์ด เหมาะกับ Fail-safe) และการสั่งผ่านคลาวด์ห้ามใช้แทนระบบหยุดฉุกเฉิน
9. **แดชบอร์ดที่ดี** ต้องเข้าใจได้ใน 3 วินาที วางภาพรวมไว้บน ใช้สีเพื่อบอกสถานะเท่านั้น ติดหน่วยทุก Widget และส่วนสั่งการต้องแยกชัดเจน กดง่ายบนมือถือ
10. **แพลตฟอร์มสำเร็จรูป** เริ่มใช้งานเร็ว แต่มีข้อจำกัด เช่น เก็บข้อมูลย้อนหลัง 1 วันในแผนฟรี ไม่มีประวัติการสั่ง และผูกกับผู้ให้บริการ

### ตารางอ้างอิงด่วน

| หัวข้อ | ค่า / คำสั่ง |
|:---|:---|
| I2C ของ AHT25 | address `0x38`, SDA = GPIO 8, SCL = GPIO 9 |
| ปุ่ม / LED | ปุ่ม GPIO 4/5/6 (`INPUT_PULLUP`) · LED GPIO 10/11/12 ผ่าน 220 Ω |
| ลงทะเบียนบอร์ด | Devices → Add Device → Third Party Device → ESP32 → ESP32S3 Dev Module |
| ตัวแปรเซนเซอร์ | `temp` (Temperature Sensor), `hum` (Relative Humidity) · Read Only · Periodically 5 s |
| ตัวแปรสั่งการ | `light`, `pump`, `fan` (Boolean) · Read & Write · On Change |
| ไฟล์ของ sketch | `thingProperties.h` (สร้างให้) · `arduino_secrets.h` (`SECRET_SSID`, `SECRET_OPTIONAL_PASS`, `SECRET_DEVICE_KEY`) · `.ino` |
| เชื่อมต่อ | `initProperties(); ArduinoCloud.begin(ArduinoIoTPreferredConnection);` |
| ใน `loop()` | `ArduinoCloud.update();` ทุกรอบ ห้ามใช้ `delay()` ยาว |
| รับคำสั่ง | `void onFanChange() { applyOutputs(); }` |
| Sync หลังเชื่อมต่อใหม่ | `CLOUD_WINS` (ค่าเริ่มต้น) · `DEVICE_WINS` |
| การเชื่อมต่อ | MQTT over TLS, port 8884 (Device ID + Secret Key) |

> ℹ️ **แผนฟรี:** Arduino Cloud Free Plan มีโควตาจำกัด เช่น อุปกรณ์ 2 เครื่อง เก็บข้อมูลย้อนหลัง 1 วัน compile ใน Cloud Editor 25 ครั้งต่อวัน และ Triggers ต้องใช้แผน Maker เงื่อนไขเหล่านี้อาจเปลี่ยนได้ ควรตรวจสอบ [หน้าแผนราคา](https://cloud.arduino.cc/plans) ก่อนเริ่มภาคการศึกษา

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 12.13 แบบฝึกหัดท้ายบทที่ 12 (Exercises)

**ข้อ 1:** AHT25 ส่งค่าดิบของความชื้น $S_{RH} = 629{,}146$ และอุณหภูมิ $S_T = 419{,}430$ จงคำนวณความชื้นสัมพัทธ์ (%RH) และอุณหภูมิ (°C) พร้อมอธิบายว่าทำไมจึงควรรายงานผลเพียงทศนิยม 1 ตำแหน่ง

**ข้อ 2:** อธิบายว่าถ้าเปลี่ยนการอ่านปุ่มจาก Interrupt เป็น Polling ใน `loop()` จะเกิดปัญหาอะไรกับระบบในส่วนที่ 2 และปัญหานั้นเกี่ยวข้องกับ `ArduinoCloud.update()` อย่างไร

**ข้อ 3:** ถ้าเปลี่ยนตัวแปร `temp` จาก Read Only เป็น Read & Write จะเกิดความเสี่ยงอะไรต่อความน่าเชื่อถือของข้อมูลในโรงงาน? และถ้าเปลี่ยน `fan` จาก Read & Write เป็น Read Only ระบบจะทำงานต่างไปอย่างไร

**ข้อ 4:** ถ้าตั้ง `temp` เป็น On Change ด้วย threshold 0.2 °C แทน Periodically 5 วินาที ในช่วงที่อุณหภูมิคงที่ 2 ชั่วโมง แล้วค่อย ๆ เพิ่มขึ้น 3 °C ใน 30 นาที จงประมาณจำนวนข้อความที่ส่งเทียบกับแบบ Periodically และอธิบายข้อดีข้อเสียต่อการแสดงผลบน Chart และการตรวจว่าอุปกรณ์ยังทำงานอยู่

**ข้อ 5:** ความชื้นในตู้ควบคุมจะเสี่ยงเกิดหยดน้ำเมื่ออุณหภูมิลดลงถึงจุดน้ำค้าง (Dew Point) จงเขียนโค้ดบน ESP32 ที่คำนวณ Dew Point จาก `temp` และ `hum` ด้วยสมการ Magnus โดยประมาณ $T_d = \frac{b\,\gamma}{a - \gamma}$ เมื่อ $\gamma = \ln(RH/100) + \frac{a\,T}{b + T}$, $a = 17.62$, $b = 243.12\ ^\circ C$ แล้วออกแบบตัวแปร Cloud และ Widget สำหรับแสดงค่านี้

**ข้อ 6 (Push กับ Poll):** ระบบหนึ่งใช้ HTTP Polling ทุก 2 วินาที (คำขอละ 0.8 วินาที) อีกระบบใช้ MQTT Push แบบบทนี้
- (ก) คำนวณความหน่วงเฉลี่ยของระบบ Polling และจำนวนคำขอต่อวัน
- (ข) อธิบายว่าทำไมระบบ Push จึงไม่ต้องส่งคำขอซ้ำ และต้องแลกกับอะไร
- (ค) ถ้าบอร์ดใช้แบตเตอรี่และต้องประหยัดพลังงานมาก ควรเลือกแบบใด เพราะเหตุใด

**ข้อ 7 (Fail-safe):** เมื่อ Wi-Fi ขาดหายนานเกิน 1 นาที ESP32 ควรทำอย่างไรกับไฟ ปั๊ม และพัดลม แต่ละตัว (คงสถานะเดิม หรือปิดเอง)? ให้เหตุผลทางวิศวกรรมของแต่ละอุปกรณ์ แล้วเสนอการแก้โค้ดโดยใช้ `ArduinoCloud.connected()` ตรวจสถานะการเชื่อมต่อ และเลือกนโยบาย Sync (`CLOUD_WINS` / `DEVICE_WINS`) ให้แต่ละตัวแปร

**ข้อ 8 (เลือกแพลตฟอร์ม):** โรงงานมีตู้ควบคุม 20 ตู้ ต้องเก็บข้อมูลย้อนหลัง 1 ปี และต้องรู้ว่าใครสั่งอะไรเมื่อไร จงเปรียบเทียบการใช้ Arduino Cloud กับการสร้างระบบเองด้วยฐานข้อมูลคลาวด์ (เช่น PostgreSQL + REST API) ในด้าน ค่าใช้จ่าย ความเร็วในการพัฒนา การเก็บข้อมูล ความปลอดภัย และการตรวจสอบย้อนหลัง แล้วเสนอแนวทางที่เหมาะสม

**ข้อ 9 (ออกแบบ):** ออกแบบ Dashboard ภาพรวมสำหรับหัวหน้าช่างที่ดูแลตู้ 20 ตู้ ให้เห็นได้ทันทีว่าตู้ใดร้อนเกินเกณฑ์หรือออฟไลน์ โดยระบุ Widget ที่ใช้ การจัดแถว และตัวแปรที่ต้องเพิ่มในแต่ละ Thing

</div>
