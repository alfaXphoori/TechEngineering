---
layout: default
title: "บทที่ 12: ระบบ IoT สู่ฐานข้อมูลคลาวด์และแดชบอร์ด"
permalink: /chapters/ch12-hmi-visualization/
---

# Chapter 12: ระบบ IoT สู่ฐานข้อมูลคลาวด์และแดชบอร์ด

## Cloud Database, Dashboard & Remote Control (ESP32-S3, AHT25, Supabase/PostgreSQL, Grafana Cloud)

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
>   - **LLO14.1:** ออกแบบและพัฒนาระบบ IoT ที่ส่งข้อมูลเซนเซอร์และเหตุการณ์จากผู้ใช้ไปจัดเก็บในฐานข้อมูลคลาวด์ (Supabase/PostgreSQL) พร้อมกำหนดสิทธิ์อย่างปลอดภัยได้ (CLO3)
>   - **LLO14.2:** สร้างแดชบอร์ดแสดงผล ระบบแจ้งเตือน และส่วนสั่งการอุปกรณ์กลับไปยัง ESP32 ด้วย Grafana ตามหลักการออกแบบแดชบอร์ดที่ดีได้ (CLO3, CLO4)
>
> **ฮาร์ดแวร์:** ESP32-S3 DevKit · เซนเซอร์อุณหภูมิ/ความชื้น AHT25 · ปุ่มกด 3 ปุ่ม · LED 3 ดวง + ตัวต้านทาน 220 Ω  
> **ซอฟต์แวร์ (ฟรีทั้งหมด):** Arduino IDE (ESP32 core) · Supabase Free Plan · Grafana Cloud Free Tier (+ plugin Business Forms)

---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 12.1 ภาพรวมระบบ: ตู้ควบคุมมอเตอร์ปั๊ม

ในโรงงาน มอเตอร์ปั๊มถูกควบคุมจาก **ตู้ควบคุมมอเตอร์ (Motor Control Cabinet)** ซึ่งภายในมีอินเวอร์เตอร์ คอนแทคเตอร์ และรีเลย์ ถ้าอุณหภูมิในตู้สูงเกินไป อุปกรณ์อิเล็กทรอนิกส์จะเสื่อมเร็วขึ้น และถ้าความชื้นสูงจนเกิดหยดน้ำเกาะ (Condensation) ก็อาจทำให้ไฟฟ้าลัดวงจรได้ ช่างซ่อมบำรุงจึงต้องการระบบที่
1. **ติดตามอุณหภูมิและความชื้นในตู้** ตลอด 24 ชั่วโมง ดูแนวโน้มย้อนหลังได้ และ **แจ้งเตือนอัตโนมัติ** เมื่ออุณหภูมิเกินเกณฑ์
2. **สั่งเปิด/ปิดอุปกรณ์จากระยะไกล** ได้แก่ ไฟส่องสว่างในตู้ (`light`) ปั๊ม (`pump`) และพัดลมระบายอากาศ (`fan`) ผ่านแดชบอร์ด โดยยังมีปุ่มหน้าตู้ให้ช่างสั่งเองได้ และทุกการสั่งจะถูกบันทึกไว้เทียบกับข้อมูลเซนเซอร์ เช่น เปิดพัดลมแล้วอุณหภูมิในตู้ลดลงเท่าใด

ข้อกำหนดทั้งสองข้อมีทิศทางของข้อมูลตรงข้ามกัน บทนี้จึงแบ่งการสร้างระบบเป็น **2 ส่วน**

| ส่วน | ทิศทางข้อมูล | สิ่งที่สร้าง |
|:---|:---|:---|
| **ส่วนที่ 1: ติดตาม (Monitoring)** | เซนเซอร์ → ESP32-S3 → ฐานข้อมูล → แดชบอร์ด | ส่งค่า AHT25 ขึ้น Supabase แล้วแสดงผลและแจ้งเตือนบน Grafana |
| **ส่วนที่ 2: สั่งการ (Control)** | แดชบอร์ด → ฐานข้อมูล → ESP32-S3 → อุปกรณ์ | สั่ง LED แทนไฟ ปั๊ม และพัดลม จากฟอร์มบน Grafana และจากปุ่มหน้าตู้ |

ทั้งหมดสร้างด้วยเครื่องมือฟรี ตามสถาปัตยกรรมด้านล่าง

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 900 425" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif" role="img" aria-label="ส่วนที่ 1: ESP32-S3 ส่งค่า AHT25 ผ่าน HTTPS POST ไปยัง REST API ของ Supabase ลงตาราง telemetry แล้ว Grafana Cloud อ่านผ่าน Session Pooler ด้วย role grafana_ro เพื่อแสดงแดชบอร์ดและส่งอีเมลแจ้งเตือน ส่วนที่ 2: ช่างสั่งการบนฟอร์มของ Grafana ซึ่งเขียนตาราง controls ด้วย role grafana_ctl ESP32-S3 อ่านตาราง controls ทุก 2 วินาทีแล้วขับ LED ส่วนปุ่มหน้าตู้แก้ตาราง controls ด้วย PATCH และ trigger บันทึกทุกการเปลี่ยนแปลงลงตาราง events">
  <title>สถาปัตยกรรมระบบ: ส่วนที่ 1 เส้นทางติดตาม และส่วนที่ 2 เส้นทางสั่งการ ผ่าน Supabase และ Grafana</title>
  <style>
    .c12-bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; }
    .c12-box { fill: #ffffff; stroke: #475569; stroke-width: 2; }
    .c12-esp { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2.5; }
    .c12-db { fill: #ecfdf5; stroke: #059669; stroke-width: 2.5; }
    .c12-tb { fill: #ffffff; stroke: #059669; stroke-width: 1.5; }
    .c12-tk { fill: #ffffff; stroke: #db2777; stroke-width: 2; }
    .c12-gf { fill: #fff7ed; stroke: #ea580c; stroke-width: 2.5; }
    .c12-cloud { fill: #f0fdf4; stroke: #059669; stroke-width: 1.5; stroke-dasharray: 6 5; }
    .c12-w { fill: none; stroke: #059669; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: c12-flow 1.6s linear infinite; }
    .c12-r { fill: none; stroke: #2f5597; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: c12-flow 1.6s linear infinite; }
    .c12-k { fill: none; stroke: #db2777; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: c12-flow 1.6s linear infinite; }
    .c12-a { fill: none; stroke: #ea580c; stroke-width: 3; stroke-dasharray: 6 8; stroke-linecap: round; animation: c12-flow 1.2s linear infinite; }
    .c12-t { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .c12-l { font-size: 12px; fill: #64748b; font-weight: 500; }
    .c12-c { font-size: 11px; font-family: monospace; font-weight: 700; fill: #475569; }
    .c12-cw { font-size: 11px; font-family: monospace; font-weight: 700; fill: #059669; }
    .c12-cr { font-size: 11px; font-family: monospace; font-weight: 700; fill: #2f5597; }
    .c12-ck { font-size: 11px; font-family: monospace; font-weight: 700; fill: #db2777; }
    .c12-ca { font-size: 11px; font-family: monospace; font-weight: 700; fill: #ea580c; }
    @keyframes c12-flow { to { stroke-dashoffset: -36; } }
    @media (prefers-reduced-motion: reduce) { .c12-w, .c12-r, .c12-k, .c12-a { animation: none; } }
  </style>
  <rect x="5" y="5" width="890" height="415" rx="10" class="c12-bg"/>
  <!-- ESP32-S3 -->
  <rect x="20" y="60" width="160" height="250" rx="8" class="c12-esp"/>
  <text x="100" y="88" text-anchor="middle" class="c12-t">ESP32-S3</text>
  <text x="100" y="116" text-anchor="middle" class="c12-l">AHT25 (I2C)</text>
  <text x="100" y="134" text-anchor="middle" class="c12-c">temp, hum</text>
  <text x="100" y="166" text-anchor="middle" class="c12-l">ปุ่มหน้าตู้ 3 ปุ่ม</text>
  <text x="100" y="184" text-anchor="middle" class="c12-c">GPIO 4/5/6</text>
  <text x="100" y="216" text-anchor="middle" class="c12-l">LED 3 ดวง</text>
  <text x="100" y="234" text-anchor="middle" class="c12-c">GPIO 10/11/12</text>
  <text x="100" y="256" text-anchor="middle" class="c12-c">light/pump/fan</text>
  <text x="100" y="292" text-anchor="middle" class="c12-c">Wi-Fi 2.4 GHz</text>
  <!-- ESP32 ↔ REST -->
  <path d="M 180 95 L 246 95" class="c12-w"/>
  <polygon points="246,90 256,95 246,100" fill="#059669"/>
  <text x="218" y="85" text-anchor="middle" class="c12-cw">POST</text>
  <text x="218" y="118" text-anchor="middle" class="c12-c">HTTPS</text>
  <path d="M 256 140 L 190 140" class="c12-k"/>
  <polygon points="190,135 180,140 190,145" fill="#db2777"/>
  <text x="218" y="132" text-anchor="middle" class="c12-ck">GET 2s</text>
  <path d="M 180 160 L 246 160" class="c12-k"/>
  <polygon points="246,155 256,160 246,165" fill="#db2777"/>
  <text x="218" y="178" text-anchor="middle" class="c12-ck">PATCH</text>
  <!-- Supabase container -->
  <rect x="230" y="30" width="345" height="345" rx="12" class="c12-cloud"/>
  <text x="246" y="52" class="c12-cw">SUPABASE</text>
  <rect x="256" y="70" width="140" height="100" rx="8" class="c12-box"/>
  <text x="326" y="102" text-anchor="middle" class="c12-t">REST API</text>
  <text x="326" y="124" text-anchor="middle" class="c12-c">Publishable key</text>
  <text x="326" y="142" text-anchor="middle" class="c12-c">(anon)</text>
  <rect x="416" y="70" width="140" height="100" rx="8" class="c12-box"/>
  <text x="486" y="102" text-anchor="middle" class="c12-t">Session Pooler</text>
  <text x="486" y="124" text-anchor="middle" class="c12-c">port 5432</text>
  <!-- PostgreSQL -->
  <rect x="256" y="215" width="300" height="145" rx="8" class="c12-db"/>
  <text x="406" y="233" text-anchor="middle" class="c12-c">PostgreSQL + RLS</text>
  <rect x="266" y="245" width="88" height="55" rx="6" class="c12-tb"/>
  <text x="310" y="268" text-anchor="middle" class="c12-t">telemetry</text>
  <text x="310" y="288" text-anchor="middle" class="c12-l">ทุก 5 วินาที</text>
  <rect x="362" y="245" width="88" height="55" rx="6" class="c12-tk"/>
  <text x="406" y="268" text-anchor="middle" class="c12-t">controls</text>
  <text x="406" y="288" text-anchor="middle" class="c12-l">สถานะที่สั่ง</text>
  <rect x="458" y="245" width="88" height="55" rx="6" class="c12-tb"/>
  <text x="502" y="268" text-anchor="middle" class="c12-t">events</text>
  <text x="502" y="288" text-anchor="middle" class="c12-l">ประวัติการสั่ง</text>
  <!-- trigger: controls → events -->
  <path d="M 420 300 L 420 324 L 490 324 L 490 310" fill="none" stroke="#db2777" stroke-width="2"/>
  <polygon points="485,310 490,301 495,310" fill="#db2777"/>
  <text x="455" y="344" text-anchor="middle" class="c12-ck">trigger</text>
  <!-- REST ↔ DB -->
  <path d="M 310 170 L 310 237" class="c12-w"/>
  <polygon points="305,237 310,245 315,237" fill="#059669"/>
  <text x="316" y="200" class="c12-cw">INSERT</text>
  <path d="M 380 170 L 380 237" class="c12-k"/>
  <polygon points="375,178 380,170 385,178" fill="#db2777"/>
  <polygon points="375,237 380,245 385,237" fill="#db2777"/>
  <!-- Pooler ↔ DB -->
  <path d="M 435 170 L 435 237" class="c12-k"/>
  <polygon points="430,237 435,245 440,237" fill="#db2777"/>
  <path d="M 502 245 L 502 178" class="c12-r"/>
  <polygon points="497,178 502,170 507,178" fill="#2f5597"/>
  <text x="508" y="200" class="c12-cr">SELECT</text>
  <!-- Pooler ↔ Grafana -->
  <path d="M 556 100 L 620 100" class="c12-r"/>
  <polygon points="620,95 630,100 620,105" fill="#2f5597"/>
  <text x="593" y="90" text-anchor="middle" class="c12-cr">grafana_ro</text>
  <path d="M 630 150 L 566 150" class="c12-k"/>
  <polygon points="566,145 556,150 566,155" fill="#db2777"/>
  <text x="593" y="170" text-anchor="middle" class="c12-ck">grafana_ctl</text>
  <!-- Grafana -->
  <rect x="630" y="60" width="130" height="200" rx="8" class="c12-gf"/>
  <text x="695" y="88" text-anchor="middle" class="c12-t">Grafana Cloud</text>
  <polyline points="648,150 666,140 684,144 702,126 720,130 742,108" fill="none" stroke="#ea580c" stroke-width="2.5"/>
  <circle cx="742" cy="108" r="3.5" fill="#ea580c"/>
  <line x1="702" y1="100" x2="702" y2="158" stroke="#db2777" stroke-width="1.5" stroke-dasharray="3 3"/>
  <rect x="650" y="178" width="26" height="14" rx="7" fill="#059669"/>
  <circle cx="669" cy="185" r="5" fill="#ffffff"/>
  <rect x="682" y="178" width="26" height="14" rx="7" fill="#94a3b8"/>
  <circle cx="689" cy="185" r="5" fill="#ffffff"/>
  <rect x="714" y="178" width="26" height="14" rx="7" fill="#059669"/>
  <circle cx="733" cy="185" r="5" fill="#ffffff"/>
  <text x="695" y="214" text-anchor="middle" class="c12-l">ฟอร์มสั่งการ</text>
  <text x="695" y="242" text-anchor="middle" class="c12-c">refresh 10s</text>
  <!-- Grafana ↔ user -->
  <path d="M 760 120 L 790 120" class="c12-r"/>
  <polygon points="790,115 800,120 790,125" fill="#2f5597"/>
  <path d="M 800 160 L 770 160" class="c12-k"/>
  <polygon points="770,155 760,160 770,165" fill="#db2777"/>
  <rect x="800" y="80" width="85" height="100" rx="8" class="c12-box"/>
  <text x="842" y="124" text-anchor="middle" class="c12-t">ช่าง</text>
  <text x="842" y="146" text-anchor="middle" class="c12-l">เบราว์เซอร์</text>
  <!-- Grafana → email -->
  <path d="M 695 260 L 695 296" class="c12-a"/>
  <polygon points="690,296 695,306 700,296" fill="#ea580c"/>
  <text x="705" y="284" class="c12-ca">temp &gt; 35 °C</text>
  <rect x="630" y="306" width="130" height="44" rx="8" class="c12-box"/>
  <text x="695" y="333" text-anchor="middle" class="c12-t">อีเมลแจ้งเตือน</text>
  <!-- legend -->
  <line x1="30" y1="400" x2="62" y2="400" stroke="#059669" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="70" y="404" class="c12-l">เขียน (ส่วนที่ 1)</text>
  <line x1="215" y1="400" x2="247" y2="400" stroke="#2f5597" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="255" y="404" class="c12-l">อ่าน (ส่วนที่ 1)</text>
  <line x1="390" y1="400" x2="422" y2="400" stroke="#ea580c" stroke-width="3" stroke-dasharray="6 8"/>
  <text x="430" y="404" class="c12-l">แจ้งเตือน (ส่วนที่ 1)</text>
  <line x1="590" y1="400" x2="622" y2="400" stroke="#db2777" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="630" y="404" class="c12-l">สั่งการ (ส่วนที่ 2)</text>
</svg>
</div>

ระบบแบ่งเป็น 4 ชั้นตามสถาปัตยกรรม IoT ที่เรียนในบทที่ 1

| ชั้น (Layer) | องค์ประกอบในบทนี้ | หน้าที่ |
|:---|:---|:---|
| Perception | AHT25, ปุ่มกด 3 ปุ่ม, LED 3 ดวง | วัดอุณหภูมิ/ความชื้น รับคำสั่งจากช่างหน้าตู้ และขับอุปกรณ์ปลายทาง |
| Network | ESP32-S3 + Wi-Fi + HTTPS | ส่งข้อมูลขึ้นคลาวด์ และรับคำสั่งลงมาอย่างเข้ารหัส |
| Middleware / Storage | Supabase (REST API + PostgreSQL) | ตรวจสิทธิ์ จัดเก็บ ให้บริการ query และเป็นจุดพักคำสั่ง |
| Application | Grafana Cloud | แสดงแดชบอร์ด แจ้งเตือน และรับคำสั่งจากช่าง |

---

## 12.2 ฮาร์ดแวร์ของระบบ

### 12.2.1 ESP32-S3

ESP32-S3 เป็นไมโครคอนโทรลเลอร์รุ่นใหม่ในตระกูล ESP32 ที่เหมาะกับงาน IoT

| คุณสมบัติ | ESP32-S3 | ความสำคัญต่อระบบนี้ |
|:---|:---|:---|
| CPU | Xtensa LX7 ดูอัลคอร์ สูงสุด 240 MHz | ประมวลผล TLS (การเข้ารหัส HTTPS) ได้เร็ว |
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

**ทำไมต้องใช้ Interrupt?** การส่ง HTTPS แต่ละครั้งต้องทำ TLS handshake ซึ่งทำให้ `http.POST()` หรือ `http.GET()` ค้างอยู่ประมาณ 0.5–2 วินาที และในส่วนที่ 2 ESP32 ต้องส่ง HTTPS แทบตลอดเวลา (ส่งค่าเซนเซอร์ทุก 5 วินาที และถามคำสั่งทุก 2 วินาที)

| วิธีอ่านปุ่ม | ถ้าผู้ใช้กดปุ่มระหว่าง ESP32 กำลังส่งข้อมูล |
|:---|:---|
| **Polling** (อ่าน `digitalRead` ใน `loop()`) | การกดสั้น ๆ ช่วงนั้นจะ **หายไป** เพราะ `loop()` ยังไม่วนกลับมาอ่าน |
| **Interrupt** (ISR ทำงานทันทีที่ขาเปลี่ยนสถานะ) | ISR จำการกดไว้ใน flag แล้ว `loop()` จะจัดการในรอบถัดไป **ไม่หาย** |

### 12.2.4 เอาต์พุต: LED แทนคอนแทคเตอร์

ในห้องแล็บเราใช้ LED 3 ดวงแทนคอนแทคเตอร์ของไฟ ปั๊ม และพัดลม LED แต่ละดวงต่อผ่านตัวต้านทานจำกัดกระแสจากขา GPIO ลง GND เมื่อขาเป็น `HIGH` (3.3 V) และ LED สีแดงมีแรงดันตกคร่อม $V_F \approx 2.0$ V กระแสที่ไหลคือ

$$I = \frac{V_{GPIO} - V_F}{R} = \frac{3.3 - 2.0}{220} \approx 5.9\ \text{mA}$$

ค่านี้ต่ำกว่ากระแสที่ขา GPIO ของ ESP32-S3 จ่ายได้ตามค่าเริ่มต้น (ประมาณ 20 mA ต่อขา ควรตรวจสอบกับ datasheet) และเพียงพอให้ LED สว่างชัดเจน

> **งานจริงห้ามต่อขดลวดรีเลย์หรือคอนแทคเตอร์เข้าขา GPIO โดยตรง** เพราะขดลวดต้องการกระแสหลายสิบถึงหลายร้อย mA และสร้างแรงดันย้อนกลับ (Back EMF) ตอนตัดไฟ ต้องใช้โมดูลรีเลย์ที่มีทรานซิสเตอร์ขับและไดโอดกันแรงดันย้อนกลับ (Flyback Diode) หรือ Solid State Relay (ทบทวนบทที่ 4) โดยโค้ดในบทนี้ใช้ได้เหมือนเดิม เพียงเปลี่ยนสิ่งที่ต่อกับขา GPIO

---

## 12.3 การออกแบบข้อมูลและความปลอดภัย

### 12.3.1 ข้อมูล 3 ประเภท: Telemetry, Command State และ Event

| | Telemetry | Command State | Event |
|:---|:---|:---|:---|
| ตาราง | `telemetry` (ส่วนที่ 1) | `controls` (ส่วนที่ 2) | `events` (ส่วนที่ 2) |
| ตัวอย่าง | อุณหภูมิ 31.4 °C, ความชื้น 58 %RH | ตอนนี้สั่งให้พัดลม **เปิด** | 10:20 น. พัดลมถูกเปิดจากแดชบอร์ด |
| รูปแบบการเกิด | เป็นรอบคงที่ (Periodic) ทุก 5 วินาที | ถูกแก้เมื่อมีการสั่ง | เกิดเมื่อสถานะเปลี่ยน (Event-driven) |
| จำนวนแถว | เพิ่มขึ้นเรื่อย ๆ | **1 แถวต่ออุปกรณ์** (แก้ทับแถวเดิม) | เพิ่มขึ้นเรื่อย ๆ |
| คำถามที่ตอบ | ตอนนั้นร้อนแค่ไหน? | ตอนนี้อุปกรณ์ควรอยู่สถานะใด? | ใครสั่งอะไร เมื่อไร? |
| การแสดงผล | กราฟเส้น, เกจ | ฟอร์มสั่งการ | แถบสถานะ (State timeline), เส้นหมายเหตุบนกราฟ (Annotation) |

เราแยกข้อมูลไว้คนละตาราง เพราะโครงสร้าง วิธีเขียน และวิธี query ต่างกัน ถ้ารวมในตารางเดียว จะมีคอลัมน์ว่างจำนวนมาก และ query แต่ละแบบจะซับซ้อนขึ้น โดยเฉพาะ `controls` ที่ถูก **แก้ทับ (UPDATE)** ขณะที่อีกสองตารางถูก **เพิ่มแถว (INSERT)** เท่านั้น

### 12.3.2 โครงสร้างตาราง

```sql
-- ส่วนที่ 1
create table public.telemetry (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id  text not null,
  temp       real,        -- อุณหภูมิ (°C)
  hum        real         -- ความชื้นสัมพัทธ์ (%RH)
);

-- ส่วนที่ 2
create table public.controls (
  device_id  text primary key,                   -- 1 แถวต่ออุปกรณ์
  light      boolean not null default false,     -- true = สั่งเปิด
  pump       boolean not null default false,
  fan        boolean not null default false,
  updated_by text not null default 'dashboard'
             check (updated_by in ('button', 'dashboard')),
  updated_at timestamptz not null default now()
);

create table public.events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id  text not null,
  event      text not null check (event in ('light', 'pump', 'fan')),
  state      boolean not null,     -- true = เปิด, false = ปิด
  source     text not null check (source in ('button', 'dashboard'))
);
```

- **`created_at ... default now()`** ให้ฐานข้อมูลเป็นผู้ประทับเวลา ESP32 จึงไม่ต้องมีนาฬิกาที่แม่นยำ ส่วน `timestamptz` เก็บเวลาเป็น UTC แล้วแสดงตาม time zone ของผู้ใช้
- **`controls.device_id` เป็น Primary key** จึงมีได้เพียง 1 แถวต่ออุปกรณ์ แถวนี้คือ "สถานะที่สั่งล่าสุด" ของอุปกรณ์นั้น
- **`check (... in (...))`** ทำให้ฐานข้อมูลรับเฉพาะค่าที่กำหนด ถ้าสะกดผิดจะถูกปฏิเสธ
- **`state` และ `source` ใน `events`** เก็บทั้งสถานะหลังเปลี่ยน และแหล่งที่สั่ง (`button` = ปุ่มหน้าตู้, `dashboard` = Grafana) การรู้แค่ว่า "มีการสั่ง" ไม่พอ ต้องรู้ว่าเปิดหรือปิด จึงจะวาดช่วงเวลาที่อุปกรณ์ทำงานได้ และต้องรู้ว่าใครสั่ง จึงจะตรวจสอบย้อนหลังได้ (Audit trail)
- **Index `(device_id, created_at desc)`** แดชบอร์ดเกือบทุก query จะถามว่า "อุปกรณ์ X ในช่วงเวลา Y" B-tree index ที่เรียงตามคอลัมน์ทั้งสองจะช่วยให้ PostgreSQL กระโดดไปยังช่วงข้อมูลนั้นได้ทันที ไม่ต้องอ่านทั้งตาราง (Sequential Scan)

**ประเมินปริมาณข้อมูล:** ถ้าส่งทุก 5 วินาที จะได้ $86{,}400 / 5 = 17{,}280$ แถวต่อวัน ถ้าแต่ละแถวรวม index ใช้พื้นที่ราว 100 ไบต์ จะใช้พื้นที่ประมาณ 1.7 MB ต่อวัน หรือราว 50 MB ต่อเดือนต่ออุปกรณ์ ตัวเลขนี้ใช้เทียบกับพื้นที่ฐานข้อมูลของแผนฟรี เพื่อตัดสินใจเรื่องความถี่ในการส่งและการลบข้อมูลเก่า ส่วน `controls` มีขนาดคงที่ และ `events` เพิ่มเฉพาะเมื่อมีการสั่ง จึงเล็กมากเมื่อเทียบกับ `telemetry`

### 12.3.3 Row Level Security และหลัก Least Privilege

ระบบมีผู้ใช้ฐานข้อมูล 3 ราย และให้แต่ละรายมีสิทธิ์เท่าที่จำเป็นต่อหน้าที่เท่านั้น (**Principle of Least Privilege**)

| ผู้ใช้ | ช่องทาง | `telemetry` | `controls` | `events` |
|:---|:---|:---|:---|:---|
| ESP32-S3 (role `anon`) | HTTPS → REST API | `INSERT` | `SELECT` + `UPDATE` ได้เฉพาะเมื่อ `updated_by = 'button'` | ไม่มีสิทธิ์ (trigger เป็นผู้เขียน) |
| Grafana แดชบอร์ด (role `grafana_ro`) | PostgreSQL + TLS | `SELECT` | ไม่มีสิทธิ์ | `SELECT` |
| Grafana ฟอร์มสั่งการ (role `grafana_ctl`) | PostgreSQL + TLS | ไม่มีสิทธิ์ | `SELECT` + `UPDATE` ได้เฉพาะเมื่อ `updated_by = 'dashboard'` | ไม่มีสิทธิ์ |

การแยก `grafana_ctl` ออกจาก `grafana_ro` ทำให้ panel แสดงผลทั่วไปไม่มีทางเขียนฐานข้อมูลได้ แม้จะเขียน SQL ผิดพลาด สิทธิ์เขียนมีอยู่ใน data source เดียวที่ใช้กับฟอร์มสั่งการเท่านั้น

**Row Level Security (RLS)** เป็นกฎที่ PostgreSQL ตรวจทุกครั้งที่มีการอ่านหรือเขียนแถว ถ้าเปิด RLS แล้วไม่มี policy อนุญาต คำขอนั้นจะถูกปฏิเสธทั้งหมด (**Deny by Default**) ผลของการออกแบบนี้คือ
- ถ้า key ใน ESP32 ถูกดึงออกจากเฟิร์มแวร์ ผู้ไม่หวังดีก็ **อ่าน** ข้อมูลเซนเซอร์ย้อนหลังของโรงงานไม่ได้ และ **ลบหรือปลอมประวัติ** ใน `events` ไม่ได้ (แต่ยังสั่งอุปกรณ์ผ่าน `controls` ได้ ซึ่งเป็นข้อจำกัดของการใช้ key เดียวร่วมกันทุกอุปกรณ์ ดูแบบฝึกหัดท้ายบท)
- ถ้ารหัสผ่านของ `grafana_ro` รั่ว ผู้ไม่หวังดีก็ **แก้ไขหรือลบ** ข้อมูลไม่ได้
- policy ยังทำหน้าที่ **ตรวจความสมเหตุสมผลของข้อมูล** ได้ด้วย เช่น ปฏิเสธค่าอุณหภูมิที่อยู่นอกย่านวัดของ AHT25 (-40 ถึง 120 °C) ซึ่งมักเกิดจากเซนเซอร์เสีย และบังคับให้ผู้สั่งระบุ `updated_by` ตามตัวตนจริง (ESP32 อ้างเป็น `dashboard` ไม่ได้)

**API key ของ Supabase มี 4 แบบ** (ตาม [Supabase Docs: API keys](https://supabase.com/docs/guides/getting-started/api-keys))

| Key | รูปแบบ | Role ที่ได้ | RLS | ใช้ในอุปกรณ์/หน้าเว็บได้? |
|:---|:---|:---|:---|:---|
| **Publishable key** ✅ | `sb_publishable_...` | `anon` (ยังไม่ login) | ถูกตรวจ | **ได้** ← ใช้ใน ESP32-S3 |
| Secret key | `sb_secret_...` | `service_role` | **ข้าม RLS** | ห้ามเด็ดขาด |
| `anon` (legacy) | JWT ขึ้นต้นด้วย `eyJ` | `anon` | ถูกตรวจ | ได้ แต่เป็นแบบเก่าที่กำลังจะเลิกใช้ |
| `service_role` (legacy) | JWT ขึ้นต้นด้วย `eyJ` | `service_role` | **ข้าม RLS** | ห้ามเด็ดขาด |

ในบทนี้ใช้ **Publishable key** เพราะเป็น key ที่ Supabase ออกแบบให้ฝังในอุปกรณ์หรือหน้าเว็บได้ ใครได้ key ไปก็ทำได้เฉพาะสิ่งที่ RLS policy อนุญาต ส่วน legacy key มีแผนจะถูกเลิกใช้ จึงควรใช้แบบใหม่ตั้งแต่ต้น

> ⚠️ ห้ามนำ **Secret key** หรือ **`service_role` key** ของ Supabase ไปใส่ในอุปกรณ์ หน้าเว็บ หรือโค้ดที่ขึ้น GitHub เด็ดขาด เพราะ key กลุ่มนี้ข้าม RLS ได้ทั้งหมด

---

## 12.4 เส้นทางเขียน: HTTPS และ REST API

Supabase มีเครื่องมือชื่อ **PostgREST** ที่สร้าง REST API ให้ทุกตารางโดยอัตโนมัติ ด้วยการแปลงคำขอ HTTP เป็นคำสั่ง SQL (ทบทวนบทที่ 8) ESP32 ใช้ REST API ทั้งในส่วนที่ 1 และส่วนที่ 2

| ส่วน | คำขอ HTTP จาก ESP32 | คำสั่ง SQL ที่ PostgREST สร้าง |
|:---|:---|:---|
| 1 | `POST /rest/v1/telemetry` body `{"device_id":"mcc01","temp":31.4,"hum":58.2}` | `INSERT INTO telemetry (device_id, temp, hum) VALUES ('mcc01', 31.4, 58.2)` |
| 2 | `GET /rest/v1/controls?device_id=eq.mcc01&select=light,pump,fan` | `SELECT light, pump, fan FROM controls WHERE device_id = 'mcc01'` |
| 2 | `PATCH /rest/v1/controls?device_id=eq.mcc01` body `{"fan":true,"updated_by":"button"}` | `UPDATE controls SET fan = true, updated_by = 'button' WHERE device_id = 'mcc01'` |

ใน URL ของ PostgREST ตัวกรอง `device_id=eq.mcc01` หมายถึง `device_id = 'mcc01'` (`eq` = equal) และ `select=` ระบุคอลัมน์ที่ต้องการ ผลลัพธ์ของ `GET` เป็น JSON array เสมอ เช่น `[{"light":false,"pump":false,"fan":true}]` ถ้าไม่มีแถวที่ตรงเงื่อนไขจะได้ `[]`

**Header ที่ต้องส่ง**

| Header | ค่า | หน้าที่ |
|:---|:---|:---|
| `apikey` | Publishable key (`sb_publishable_...`) | ระบุโปรเจกต์ และกำหนด role เป็น `anon` |
| `Authorization` | **ไม่ต้องส่ง** เมื่อใช้ Publishable key (ส่งเป็น `Bearer <key>` เฉพาะ legacy `anon` key ที่เป็น JWT) | Publishable key ไม่ใช่ JWT ถ้าส่งใน `Authorization: Bearer` ระบบจะพยายามตรวจเป็น JWT แล้วล้มเหลว |
| `Content-Type` | `application/json` | บอกว่า body เป็น JSON (ใช้กับ `POST` และ `PATCH`) |
| `Prefer` | `return=minimal` | ไม่ต้องส่งแถวที่บันทึกกลับมา ประหยัด bandwidth |

**รหัสสถานะที่ต้องรู้จัก:** `200` อ่านสำเร็จ (`GET`) · `201` เพิ่มแถวสำเร็จ (`POST`) · `204` แก้ไขสำเร็จ (`PATCH` แบบ `return=minimal`) · `400` JSON หรือชื่อคอลัมน์ผิด · `401/403` key ผิดหรือไม่ผ่าน RLS · `404` URL หรือชื่อตารางผิด · ค่าติดลบ ESP32 เชื่อมต่อไม่ได้ (Wi-Fi หลุด หรือ TLS ล้มเหลว)

> ⚠️ `PATCH` ที่ไม่พบแถวตรงเงื่อนไขก็ได้ `204` เช่นกัน เพราะ SQL `UPDATE` ที่แก้ 0 แถวไม่ถือว่าผิดพลาด ถ้ากดปุ่มแล้วได้ `204` แต่แดชบอร์ดไม่เปลี่ยน ให้ตรวจว่ามีแถวของ `DEVICE_ID` นี้ในตาราง `controls` แล้วหรือไม่

> **HTTPS กับการยืนยันใบรับรอง:** ในห้องแล็บเราใช้ `tls.setInsecure()` ข้อมูลยังถูกเข้ารหัส แต่ ESP32 จะไม่ตรวจว่ากำลังคุยกับเซิร์ฟเวอร์ตัวจริงหรือไม่ งานจริงต้องใช้ `tls.setCACert(rootCA)` เพื่อป้องกันการโจมตีแบบ Man-in-the-Middle ซึ่งสำคัญยิ่งขึ้นเมื่อระบบรับคำสั่งควบคุมอุปกรณ์

---

## 12.5 เส้นทางอ่าน: Grafana และ SQL

**Grafana** ไม่ได้เก็บข้อมูลเอง แต่ส่ง query ไปถามฐานข้อมูลทุกครั้งที่แดชบอร์ด refresh แล้วนำผลลัพธ์มาวาดเป็น panel เราจึงสร้างบัญชี `grafana_ro` ไว้ให้ Grafana ใช้โดยเฉพาะ

**ทำไมต้องใช้ Session Pooler?** ที่อยู่ Direct connection ของ Supabase (`db.xxxx.supabase.co`) ใช้ IPv6 ขณะที่บริการคลาวด์หลายแห่ง รวมถึง Grafana Cloud เชื่อมต่อออกด้วย IPv4 จึงต้องต่อผ่าน **Session Pooler** (Supavisor) ซึ่งรองรับ IPv4 และช่วยจำกัดจำนวน connection ไม่ให้ฐานข้อมูลรับภาระเกิน

### 12.5.1 Macro ของ Grafana

| Macro | หน้าที่ | ตัวอย่างผลลัพธ์ที่ Grafana แทนให้ |
|:---|:---|:---|
| `$__timeFilter(created_at)` | กรองตามช่วงเวลาที่เลือกบนแดชบอร์ด | `created_at BETWEEN '2026-09-28T01:00:00Z' AND '2026-09-28T07:00:00Z'` |
| `$__timeGroupAlias(created_at, $__interval)` | ปัดเวลาลงเป็นช่วง (bucket) และตั้งชื่อคอลัมน์ว่า `time` | ใช้คู่กับ `GROUP BY 1` และ `avg()` |
| `$__interval` | ขนาดช่วงที่ Grafana คำนวณจากช่วงเวลาที่เลือก หารด้วยความกว้างของกราฟ | `5m`, `10m`, `1h` |
| `$device` | ตัวแปรที่ผู้ใช้เลือกจาก dropdown บนแดชบอร์ด | `'mcc01'` |

### 12.5.2 Downsampling

ถ้าเลือกดูย้อนหลัง 7 วัน จะมีข้อมูล $17{,}280 \times 7 \approx 121{,}000$ จุด แต่กราฟกว้างราว 1,000 พิกเซลแสดงได้ไม่เกินราว 1,000 จุด Grafana จะคำนวณ

$$\$\_\_interval \approx \frac{7 \times 86{,}400\ s}{1{,}000\ px} \approx 605\ s \approx 10\ \text{นาที}$$

จากนั้น `avg()` จะรวมข้อมูลราว 120 จุดในแต่ละช่วง 10 นาทีให้เหลือจุดเดียว query จึงเร็วขึ้น ส่งข้อมูลผ่านเครือข่ายน้อยลง และกราฟไม่รก เทคนิคนี้เรียกว่า **Downsampling** แบบเดียวกับ `GROUP BY time()` ของ InfluxDB ในบทที่ 10

---

## 12.6 เส้นทางสั่งการ: Desired State และ Polling

### 12.6.1 ทำไมแดชบอร์ดสั่ง ESP32 ตรง ๆ ไม่ได้

ESP32-S3 ต่อ Wi-Fi อยู่หลังเราเตอร์ที่ทำ **NAT** จึงไม่มี IP สาธารณะ Grafana Cloud บนอินเทอร์เน็ตจึงเปิดการเชื่อมต่อเข้าหา ESP32 ไม่ได้ ในทางกลับกัน ESP32 เป็นฝ่ายเชื่อมต่อ **ออก** ไปหาเซิร์ฟเวอร์ได้เสมอ ระบบจึงใช้ฐานข้อมูลเป็น **จุดพักคำสั่ง** ตรงกลาง

1. ช่างเลือกสถานะบนฟอร์มของ Grafana แล้วกดส่ง → Grafana รัน `UPDATE controls ...` ด้วย role `grafana_ctl`
2. ESP32 ถามตาราง `controls` ทุก 2 วินาที (`GET`) → ถ้าค่าต่างจากสถานะปัจจุบันก็ขับ LED ตามค่านั้น
3. trigger ในฐานข้อมูลบันทึกการเปลี่ยนแปลงลง `events` โดยอัตโนมัติ

แนวคิดนี้เป็นรูปแบบเดียวกับ **Device Shadow / Digital Twin** ของแพลตฟอร์ม IoT เชิงพาณิชย์ และ Shared Attributes ของ ThingsBoard ในบทที่ 10

### 12.6.2 เก็บ "สถานะที่ต้องการ" ไม่ใช่ "คำสั่ง"

| แนวทาง | ข้อมูลที่เก็บ | ถ้า ESP32 พลาดการอ่าน 1 รอบ หรือรีบูต |
|:---|:---|:---|
| เก็บคำสั่ง (Command) | "สลับสถานะพัดลม" | คำสั่งอาจหายหรือถูกทำซ้ำ สถานะจริงจะผิดจากที่ช่างตั้งใจ |
| **เก็บสถานะที่ต้องการ (Desired State)** ✅ | "พัดลมต้อง **เปิด**" | อ่านรอบถัดไปก็ได้ค่าเดิม ขับซ้ำกี่ครั้งผลก็เหมือนเดิม |

คุณสมบัติที่ "ทำซ้ำกี่ครั้งผลก็เหมือนเดิม" เรียกว่า **Idempotent** ทำให้ระบบทนต่อเครือข่ายที่ไม่เสถียร และเมื่อ ESP32 รีบูต ก็เพียงอ่านแถวใน `controls` ครั้งแรกตอนเริ่มทำงาน แล้วขับ LED ให้ตรงกับสถานะล่าสุดได้ทันที

### 12.6.3 ความหน่วงของ Polling

ESP32 ถาม `controls` ทุก $T_{poll} = 2$ วินาที ช่างอาจกดส่งคำสั่ง ณ จุดใดของรอบก็ได้ เวลารอจึงกระจายสม่ำเสมอระหว่าง $0$ ถึง $T_{poll}$ ความหน่วงเฉลี่ยตั้งแต่กดส่งจนถึง LED ติดคือ

$$\bar{t}_{delay} \approx t_{submit} + \frac{T_{poll}}{2} + t_{GET} \approx 0.3 + 1 + 1 \approx 2.3\ \text{วินาที}$$

เมื่อ $t_{submit}$ คือเวลาที่ Grafana เขียนฐานข้อมูล และ $t_{GET}$ คือเวลาของคำขอ HTTPS กรณีแย่ที่สุดอาจถึง 4–6 วินาที ถ้าคำสั่งมาถึงขณะ ESP32 กำลังส่งค่าเซนเซอร์อยู่

**ราคาของการ Poll:** $86{,}400 / 2 = 43{,}200$ คำขอต่อวัน ถ้าคำตอบพร้อม header ใช้ราว 0.5 KB จะได้ข้อมูลขาออก (Egress) ราว 21 MB ต่อวันต่ออุปกรณ์ ตัวเลขนี้ใช้เทียบกับโควตาของแผนฟรี

| วิธีรับคำสั่ง | ความหน่วง | ความซับซ้อน | เหมาะกับ |
|:---|:---|:---|:---|
| **HTTP Polling** (บทนี้) | วินาที | ต่ำ ใช้ REST เดิม | ไฟ พัดลม การตั้งค่าที่เปลี่ยนไม่บ่อย |
| Push ผ่าน MQTT (บทที่ 9) หรือ WebSocket (Supabase Realtime) | ต่ำกว่า 1 วินาที | สูงขึ้น ต้องรักษา connection ตลอดเวลา | งานที่ต้องตอบสนองเร็ว หรืออุปกรณ์จำนวนมาก |

> ⚠️ **ความปลอดภัยของเครื่องจักร:** การสั่งผ่านคลาวด์มีความหน่วงหลายวินาที และหยุดทำงานเมื่อเครือข่ายขัดข้อง จึง **ห้ามใช้เป็นระบบหยุดฉุกเฉิน (Emergency Stop)** ซึ่งต้องเป็นวงจรเดินสายตรง (Hardwired) ตามมาตรฐานความปลอดภัยของเครื่องจักรเสมอ ระบบในบทนี้เหมาะกับงานที่ไม่วิกฤต เช่น เปิดไฟส่องสว่างหรือพัดลมระบายอากาศ

### 12.6.4 สองผู้สั่ง หนึ่งความจริง

ระบบมีผู้สั่ง 2 ทาง คือฟอร์มบนแดชบอร์ดและปุ่มหน้าตู้ ทั้งสองทางต้องเขียนลงแถวเดียวกันใน `controls` ซึ่งเป็น **แหล่งความจริงเพียงแหล่งเดียว (Single Source of Truth)**

- **ช่างกดปุ่มหน้าตู้:** ESP32 สลับ LED ทันที (ไม่ต้องรอเครือข่าย) แล้ว `PATCH` ค่าใหม่ขึ้น `controls` แดชบอร์ดจึงเห็นสถานะเดียวกัน
- **ช่างสั่งจากแดชบอร์ด:** Grafana แก้ `controls` แล้ว ESP32 เห็นในรอบ poll ถัดไป
- ถ้าสั่งพร้อมกันทั้งสองทาง ค่าที่เขียนทีหลังจะชนะ (**Last Write Wins**)

**Trigger** คือฟังก์ชันที่ PostgreSQL เรียกให้อัตโนมัติเมื่อตารางถูกแก้ไข เราใช้ trigger เปรียบเทียบค่าเก่า (`old`) กับค่าใหม่ (`new`) ของแต่ละอุปกรณ์ ถ้าเปลี่ยนก็เพิ่มแถวลง `events` พร้อม `source` ผลคือไม่ว่าคำสั่งจะมาจากทางใด ประวัติก็ถูกบันทึกครบ และทั้ง ESP32 และ Grafana ไม่ต้องมีสิทธิ์เขียน `events` เลย

---

## 12.7 หลักการออกแบบแดชบอร์ด

แดชบอร์ดที่ดีต้องให้ช่างเข้าใจสถานะของตู้ควบคุมได้ **ภายใน 3 วินาที** โดยไม่ต้องอ่านคู่มือ จึงใช้หลักการต่อไปนี้

1. **ภาพรวมอยู่บน รายละเอียดอยู่ล่าง** แถวบนสุดเป็นค่าปัจจุบันและสถานะ ถัดลงมาเป็นแนวโน้ม และล่างสุดเป็นส่วนสั่งการและประวัติเหตุการณ์
2. **สีมีความหมายเสมอ** ใช้เขียว เหลือง และแดงเฉพาะเพื่อบอกสถานะ (ปกติ เฝ้าระวัง ผิดปกติ) ไม่ใช้สีเพื่อความสวยงาม ช่างจะได้มองหาสีแดงเป็นอันดับแรก
3. **เลือกชนิด panel ตามคำถาม**

| คำถามของช่าง | Panel ที่เหมาะ | เหตุผล |
|:---|:---|:---|
| ตอนนี้ร้อนแค่ไหน? | Gauge | เห็นตำแหน่งเทียบกับเกณฑ์ทันที |
| อุปกรณ์ยังส่งข้อมูลอยู่ไหม? | Stat (วินาทีตั้งแต่ข้อมูลล่าสุด) | ตัวเลขเดียวพร้อมสีสถานะ |
| อุณหภูมิเพิ่มขึ้นเรื่อย ๆ หรือไม่? | Time series | กราฟเส้นแสดงแนวโน้มตามเวลาได้ดีที่สุด |
| จะสั่งเปิด/ปิดไฟ ปั๊ม พัดลม? | Business Forms (ฟอร์มสั่งการ) | แสดงสถานะที่สั่งอยู่ และแก้ไขได้ในที่เดียว |
| ไฟ ปั๊ม และพัดลม เปิดอยู่ช่วงไหน? | State timeline | แถบสีต่อเนื่องแสดงช่วงเวลาเปิด/ปิดของแต่ละอุปกรณ์ |
| เปิดพัดลมแล้วอุณหภูมิลดลงหรือไม่? | Annotation บน Time series | วางเหตุการณ์ลงบนกราฟเดียวกันเพื่อเทียบเหตุกับผล |

4. **ข้อมูลต้องไม่บิดเบือน** ติดหน่วยทุก panel (°C, %RH) ใช้แกนแยกเมื่อหน่วยต่างกัน และตั้งช่วงแกนของ Gauge ให้คงที่ (เช่น 0–60 °C) เพื่อไม่ให้การเปลี่ยนแปลงเล็กน้อยดูเหมือนรุนแรง
5. **ส่วนสั่งการต้องป้องกันการกดพลาด** แยกฟอร์มสั่งการออกจาก panel แสดงผล ใช้ป้ายกำกับชัดเจนว่ากำลังสั่งอุปกรณ์ใด ให้ **ยืนยันก่อนส่ง (Confirmation)** ทุกครั้ง และวางแถบสถานะไว้ข้างฟอร์ม เพื่อให้ช่างเห็นผลของคำสั่งทันที

**Layout ของแดชบอร์ด `MCC Monitor`**

| แถว | Panel | สร้างในส่วนที่ |
|:---|:---|:---|
| 1 (ภาพรวม) | Gauge อุณหภูมิ · Gauge ความชื้น · Stat สถานะการเชื่อมต่อ | 1 |
| | Stat เปิดพัดลมวันนี้ | 2 |
| 2 (แนวโน้ม) | Time series อุณหภูมิ + ความชื้น | 1 |
| | Annotation เปิด/ปิดพัดลมบน Time series | 2 |
| 3 (สั่งการและเหตุการณ์) | ฟอร์มสั่งการ (Business Forms) · State timeline ไฟ · ปั๊ม · พัดลม | 2 |

</div>

<div class="chapter-tab-content" data-tab-name="Hands-on" data-tab-icon="🔧" id="handson" markdown="1">

## 12.8 ปฏิบัติการส่วนที่ 1: ติดตาม (Sensor → ESP32 → Dashboard)

> ใบงานพร้อมตารางบันทึกผลอยู่ในแท็บ **Lab 14** (หัวข้อ 12.11) หัวข้อ 12.8–12.10 อธิบายโค้ดและขั้นตอนทั้งหมดแบบละเอียด ส่วนที่ 1 ต้องทำงานได้ก่อน แล้วจึงต่อยอดเป็นส่วนที่ 2

**เป้าหมายของส่วนที่ 1:** ESP32-S3 อ่าน AHT25 แล้วส่งขึ้นตาราง `telemetry` ทุก 5 วินาที จากนั้น Grafana แสดงค่าปัจจุบัน แนวโน้ม สถานะการเชื่อมต่อ และแจ้งเตือนเมื่ออุณหภูมิสูง

### 12.8.1 ต่อวงจร

| อุปกรณ์ | ขาอุปกรณ์ | ESP32-S3 |
|:---|:---|:---|
| AHT25 | VDD / GND | 3V3 / GND |
| AHT25 | SDA / SCL | GPIO 8 / GPIO 9 |

- ลำดับขาของโมดูล AHT25 แต่ละยี่ห้อไม่เหมือนกัน ให้ดูตามที่พิมพ์ไว้บนบอร์ด และห้ามต่อเข้า 5V

### 12.8.2 ตั้งค่า Arduino IDE

1. **Boards Manager** → ติดตั้ง **esp32 by Espressif Systems**
2. **Library Manager** → ติดตั้ง **Adafruit AHTX0** (จะติดตั้ง Adafruit BusIO และ Adafruit Unified Sensor ให้ด้วย)
3. **Tools** → Board: **ESP32S3 Dev Module** → **USB CDC On Boot: Enabled** ถ้าไม่เปิด Serial Monitor จะไม่แสดงอะไรเมื่อเสียบสายที่พอร์ต USB ตรงของชิป
4. Wi-Fi: ESP32-S3 รองรับเฉพาะ 2.4 GHz และใช้กับเครือข่ายแบบ WPA2-Enterprise หรือแบบที่ต้อง login ผ่านหน้าเว็บ (Captive Portal) ไม่ได้ ถ้า Wi-Fi มหาวิทยาลัยเป็นแบบนั้น ให้ใช้ Hotspot จากมือถือแทน

### 12.8.3 สร้างตาราง `telemetry` บน Supabase

**ตาราง `telemetry`: ค่าเซนเซอร์ที่ส่งทุก 5 วินาที**

| คอลัมน์ | ชนิดข้อมูล | ค่าเริ่มต้น / เงื่อนไข | ผู้กำหนดค่า | ความหมาย | ตัวอย่าง |
|:---|:---|:---|:---|:---|:---|
| `id` | `bigint` (`int8`) | Primary key, identity (เพิ่มอัตโนมัติ) | ฐานข้อมูล | เลขลำดับแถว | `1024` |
| `created_at` | `timestamptz` (`timestamptz`) | `not null`, `default now()` | ฐานข้อมูล | เวลาที่บันทึก (เก็บเป็น UTC) | `2026-09-28 03:15:05+00` |
| `device_id` | `text` (`text`) | `not null` | ESP32-S3 | รหัสอุปกรณ์ | `mcc01` |
| `temp` | `real` (`float4`) | -40 ถึง 120 (ตรวจโดย RLS policy) | ESP32-S3 | อุณหภูมิ (°C) | `31.4` |
| `hum` | `real` (`float4`) | 0 ถึง 100 (ตรวจโดย RLS policy) | ESP32-S3 | ความชื้นสัมพัทธ์ (%RH) | `58.2` |

Index: `telemetry_device_time_idx` บนคอลัมน์ `(device_id, created_at desc)`

ชื่อในวงเล็บคือชื่อที่ **Table Editor** ของ Supabase แสดง (เป็นชื่อย่อของชนิดเดียวกันใน PostgreSQL)

**เหตุผลการเลือกชนิดข้อมูล** (ตามคำแนะนำใน [Supabase Docs: Data types](https://supabase.com/docs/guides/database/tables#data-types)) ใช้กับตารางในส่วนที่ 2 ด้วย

| ชนิดข้อมูล | ใช้กับ | เหตุผล |
|:---|:---|:---|
| `bigint` แทน `integer` | `id` | `integer` เก็บได้สูงสุดประมาณ 2.1 พันล้าน และ identity อาจข้ามเลข จึงอาจเต็มก่อนมีข้อมูลครบจำนวนนั้น ข้อมูลที่ส่งทุก 5 วินาทีจะสะสมเร็วมาก |
| `generated always as identity` | `id` | ฐานข้อมูลเป็นผู้กำหนดเลขเท่านั้น ถ้า ESP32 ส่ง `id` มาเองจะถูกปฏิเสธ (แบบ `by default` ยอมให้ใส่เองได้) |
| `timestamptz` แทน `timestamp` | `created_at`, `updated_at` | เก็บเป็นช่วงเวลาจริง (UTC) แล้วแสดงตาม time zone ของผู้ดู ส่วน `timestamp` ไม่รู้ time zone จึงเทียบเวลาข้ามประเทศหรือข้ามระบบผิดได้ |
| `text` แทน `varchar(n)` | `device_id`, `event`, `source`, `updated_by` | ใช้พื้นที่เท่ากันแต่ไม่จำกัดความยาว ถ้าต้องการจำกัดค่าให้ใช้ `check` constraint แบบที่ใช้กับ `event` |
| `boolean` | `light`, `pump`, `fan`, `state` | มีได้เพียง 2 สถานะ (เปิด/ปิด) ตรงกับความหมายของข้อมูล |
| `real` แทน `numeric` | `temp`, `hum` | เอกสารแนะนำ `numeric` สำหรับเงินและทศนิยมที่ต้องแม่นยำแบบตรงเป๊ะ เพราะ `real` เก็บค่าบางค่า เช่น 0.10 แบบตรงเป๊ะไม่ได้ แต่ `real` แม่นยำประมาณ 6–7 หลักนัยสำคัญ ความคลาดเคลื่อนจึงเล็กกว่าความแม่นยำของ AHT25 (±0.3 °C, ±2 %RH) มาก และข้อมูลเซนเซอร์ไม่ได้ถูกบวกสะสมแบบยอดเงิน `real` ยังใช้เพียง 4 ไบต์และคำนวณเร็วกว่า |

**ตัวอย่างข้อมูลหลังระบบทำงาน** (Table Editor แสดงเวลาเป็น UTC ดังนั้น `03:15` คือ 10:15 น. ตามเวลาไทย)

| id | created_at | device_id | temp | hum |
|---:|:---|:---|---:|---:|
| 1024 | 2026-09-28 03:15:05+00 | mcc01 | 31.4 | 58.2 |
| 1025 | 2026-09-28 03:15:10+00 | mcc01 | 31.5 | 58.0 |
| 1026 | 2026-09-28 03:15:15+00 | mcc01 | 31.5 | 57.9 |

**ขั้นตอน**

1. สมัครที่ [supabase.com](https://supabase.com) → **New project** → ตั้งชื่อ `mcc-monitor` → ตั้ง Database Password → Region **Southeast Asia (Singapore)**
2. เมนู **SQL Editor** → **New query** → วางคำสั่งทั้งหมดด้านล่าง → **Run**

```sql
-- ===== ส่วนที่ 1: ตาราง telemetry =====
create table public.telemetry (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id  text not null,
  temp       real,
  hum        real
);
create index telemetry_device_time_idx on public.telemetry (device_id, created_at desc);

-- ===== เส้นทางเขียน: anon (ESP32) INSERT ได้อย่างเดียว =====
alter table public.telemetry enable row level security;

-- Supabase ให้สิทธิ์ทุกอย่างกับ anon/authenticated บนตารางใหม่โดยอัตโนมัติ
-- จึงถอนออกก่อน แล้วให้เฉพาะสิทธิ์ที่จำเป็น
revoke all on public.telemetry from anon, authenticated;
grant insert on public.telemetry to anon;

create policy "esp32 insert telemetry" on public.telemetry
  for insert to anon
  with check (device_id is not null
              and temp between -40 and 120
              and hum  between 0 and 100);
```

3. เปิด **Table Editor** → ตรวจว่ามีตาราง `telemetry` ที่มีคอลัมน์ตรงกับโครงสร้างด้านบน และแสดงสถานะ **RLS enabled**
4. เมนูซ้าย **Integrations → Data API** → หน้า **Overview** → คัดลอก **Project URL** (เช่น `https://xxxx.supabase.co`) ซึ่งเป็นปลายทางของ REST API ที่ ESP32 ใช้ (URL ของหน้านี้คือ `supabase.com/dashboard/project/<project_ref>/integrations/data_api/overview`)
5. **Project Settings → API Keys** → คัดลอก **Publishable key** (ขึ้นต้นด้วย `sb_publishable_`) เก็บไว้ ห้ามคัดลอก Secret key (`sb_secret_`)

> 💡 ปุ่ม **Connect** ด้านบนของหน้าโปรเจกต์แสดงทั้ง Project URL และ Publishable key ในหน้าเดียว ใช้แทนข้อ 4–5 ได้

### 12.8.4 ตั้งค่า user `grafana_ro` บน Supabase

Grafana ต้องมีบัญชีฐานข้อมูลของตนเองเพื่ออ่านตาราง `telemetry` (หลัก Least Privilege ในหัวข้อ 12.3.3) บัญชีนี้ใน PostgreSQL เรียกว่า **role** ซึ่ง user กับ role คือสิ่งเดียวกัน user ก็คือ role ที่ login ได้

**user `grafana_ro`**

| รายการ | ค่า | เหตุผล |
|:---|:---|:---|
| Name | `grafana_ro` | `ro` = read-only |
| Login | ได้ | Grafana ต้อง login ผ่าน Session Pooler |
| Password | ตั้งเอง ยาวอย่างน้อย 16 ตัวอักษร | ใช้กรอกใน data source ของ Grafana (หัวข้อ 12.8.6) |
| Bypass RLS · Superuser · Create role · Create DB | ปิดทั้งหมด | ให้สิทธิ์เท่าที่จำเป็นเท่านั้น |
| Username ที่กรอกใน Grafana | `grafana_ro.<project_ref>` | Session Pooler ใช้ project ref ต่อท้ายเพื่อรู้ว่าเป็นโปรเจกต์ใด |

**สิทธิ์ที่ต้องให้**

| คำสั่ง | ความหมาย |
|:---|:---|
| `grant usage on schema public` | ให้มองเห็นตารางใน schema `public` (เหมือนได้สิทธิ์เข้าห้อง แต่ยังเปิดตู้ไม่ได้) |
| `grant select on public.telemetry` | อ่านตาราง `telemetry` ได้ แต่เพิ่ม แก้ หรือลบไม่ได้ |
| `create policy ... for select to grafana_ro using (true)` | RLS อนุญาตให้อ่านได้ทุกแถว ถ้าไม่มี policy นี้ query จะได้ 0 แถว แม้มีสิทธิ์ `select` แล้วก็ตาม |

**วิธีที่ 1: สร้าง user ผ่านหน้าเว็บ Supabase แล้วให้สิทธิ์ด้วย SQL**

1. เมนูซ้าย **Database** → กลุ่ม **Access Control** → **Roles** → **Add role**
2. **Name** = `grafana_ro` → เปิดสวิตช์ **User can login** เพียงข้อเดียว (สวิตช์อื่น โดยเฉพาะ *User bypasses every row level security policy* ต้องปิดไว้) → **Save**
3. ตรวจว่า `grafana_ro` ปรากฏในหน้า **Roles** หัวข้อ *Other database roles*
4. หน้าเว็บยังไม่มีช่องตั้งรหัสผ่าน และไม่มีเมนูให้สิทธิ์ schema/ตารางแก่ role ที่สร้างเอง (หน้า **Column Privileges** แก้ได้เฉพาะ `anon`, `authenticated` และ `service_role`) จึงต้องไปที่ **SQL Editor → New query** → เปลี่ยนรหัสผ่านเป็นของตนเอง → **Run**

```sql
alter role grafana_ro with password 'ChangeMe-Strong-2026';
grant usage on schema public to grafana_ro;
grant select on public.telemetry to grafana_ro;

create policy "grafana read telemetry" on public.telemetry
  for select to grafana_ro using (true);
```

**วิธีที่ 2: ใช้ SQL ทั้งหมด**

**SQL Editor → New query** → เปลี่ยนรหัสผ่านเป็นของตนเอง → **Run** (ต่างจากวิธีที่ 1 เฉพาะบรรทัดแรก ที่ใช้ `create role` สร้าง user พร้อมตั้งรหัสผ่านในคำสั่งเดียว)

```sql
create role grafana_ro with login password 'ChangeMe-Strong-2026';
grant usage on schema public to grafana_ro;
grant select on public.telemetry to grafana_ro;

create policy "grafana read telemetry" on public.telemetry
  for select to grafana_ro using (true);
```

> ⚠️ เลือกใช้วิธีใดวิธีหนึ่งเท่านั้น ถ้าสร้าง user ผ่านหน้าเว็บแล้วมารันวิธีที่ 2 จะเกิด error *role "grafana_ro" already exists* และคำสั่งทั้งชุดจะไม่ถูกบันทึก ภายหลังถ้าต้องการเปลี่ยนรหัสผ่าน ให้รันเฉพาะคำสั่ง `alter role grafana_ro with password '...';`

**ตรวจสอบ**

- **Database → Access Control → Policies** → ตาราง `telemetry` ต้องมี 2 policy คือ `esp32 insert telemetry` (role `anon`) และ `grafana read telemetry` (role `grafana_ro`)
- **SQL Editor** → รันคำสั่งด้านล่าง ต้องได้ 1 แถวคือ `grafana_ro | SELECT`

```sql
select grantee, privilege_type
from information_schema.table_privileges
where table_name = 'telemetry' and grantee = 'grafana_ro';
```

การทดสอบจริงว่า login ได้ คือขั้น **Save & test** ของ data source ในหัวข้อ 12.8.6

### 12.8.5 โปรแกรม ESP32-S3 ส่วนที่ 1 (`mcc_monitor.ino`)

```cpp
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_AHTX0.h>

// ===== ตั้งค่าให้ตรงกับของตนเอง =====
const char* WIFI_SSID    = "YOUR_WIFI";
const char* WIFI_PASS    = "YOUR_PASSWORD";
const char* SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co/rest/v1/";
const char* SUPABASE_KEY = "sb_publishable_xxxxxxxxxxxx";   // Publishable key
const char* DEVICE_ID    = "mcc01";

#define I2C_SDA 8
#define I2C_SCL 9

const unsigned long SEND_INTERVAL = 5000;   // ms

Adafruit_AHTX0   aht;
WiFiClientSecure tls;
unsigned long    lastSend = 0;

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }
  Serial.printf(" OK  IP=%s\n", WiFi.localIP().toString().c_str());
}

// header ที่ทุกคำขอไป Supabase ต้องมี
void addAuthHeaders(HTTPClient& http) {
  http.addHeader("apikey", SUPABASE_KEY);
  if (strncmp(SUPABASE_KEY, "eyJ", 3) == 0) {           // legacy anon key (JWT)
    http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY);
  }
}

int postJson(const char* table, const char* body) {
  HTTPClient http;
  http.begin(tls, String(SUPABASE_URL) + table);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Prefer", "return=minimal");
  addAuthHeaders(http);
  int code = http.POST(String(body));
  Serial.printf("POST %s %s -> %d\n", table, body, code);
  if (code >= 400) Serial.println(http.getString());    // ข้อความ error จาก Supabase
  http.end();
  return code;
}

void setup() {
  Serial.begin(115200);
  delay(500);

  Wire.begin(I2C_SDA, I2C_SCL);
  if (!aht.begin(&Wire)) {
    Serial.println("AHT25 not found: check wiring SDA=8 SCL=9");
    while (true) delay(1000);
  }

  tls.setInsecure();   // สำหรับห้องแล็บ งานจริงให้ใช้ tls.setCACert(rootCA)
  connectWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();

  // ค่าเซนเซอร์: ส่งทุก SEND_INTERVAL
  if (millis() - lastSend >= SEND_INTERVAL) {
    lastSend = millis();
    sensors_event_t hum, temp;
    if (aht.getEvent(&hum, &temp)) {
      char body[96];
      snprintf(body, sizeof(body),
               "{\"device_id\":\"%s\",\"temp\":%.1f,\"hum\":%.1f}",
               DEVICE_ID, temp.temperature, hum.relative_humidity);
      postJson("telemetry", body);
    } else {
      Serial.println("AHT25 read failed");
    }
  }
}
```

**คำอธิบายโค้ด**

| ส่วนของโค้ด | การทำงาน |
|:---|:---|
| `Wire.begin(8, 9)` | ESP32-S3 เลือกขา I2C ได้อิสระ จึงต้องระบุ SDA/SCL ให้ตรงกับที่ต่อจริง |
| `aht.getEvent(&hum, &temp)` | ส่งคำสั่งวัด รอราว 80 ms อ่าน 7 ไบต์ แล้วแปลงค่าตามสูตรในหัวข้อ 12.2.2 |
| `millis()` แทน `delay()` | `loop()` ไม่ถูกบล็อกระหว่างรอรอบส่ง ส่วนที่ 2 จึงเพิ่มงานอื่น (อ่านปุ่ม ถามคำสั่ง) ลงใน `loop()` เดิมได้ |
| `snprintf` | สร้าง JSON ลงบัฟเฟอร์ขนาดคงที่ ช่วยเลี่ยงการจองหน่วยความจำซ้ำ ๆ ของ `String` ซึ่งทำให้ heap แตกกระจายเมื่อรันนาน ๆ |
| `addAuthHeaders()` | Publishable key ส่งเฉพาะ header `apikey` ตาม[เอกสาร Supabase](https://supabase.com/docs/guides/getting-started/api-keys) และห้ามส่งใน `Authorization: Bearer` เพราะไม่ใช่ JWT เงื่อนไข `strncmp(..., "eyJ", 3)` มีไว้รองรับกรณีที่ยังใช้ legacy `anon` key (JWT ขึ้นต้นด้วย `eyJ` เสมอ) ซึ่งต้องส่ง `Authorization` เพิ่ม |

> **ข้อจำกัดด้านเวลา:** ฐานข้อมูลประทับเวลาตอนที่ข้อมูลมาถึง จึงอาจช้ากว่าเวลาวัดจริงประมาณ 1–2 วินาทีตามเวลาส่ง HTTPS ซึ่งยอมรับได้สำหรับงานบำรุงรักษา ถ้าต้องการเวลาระดับมิลลิวินาที ให้ซิงก์นาฬิกาด้วย NTP แล้วส่ง `created_at` ไปเอง

> **ไม่มีบอร์ดจริง?** ใช้ [Wokwi](https://wokwi.com) เลือกบอร์ด ESP32-S3 แทนได้ AHT25 ไม่มีใน Wokwi จึงต้องใช้ DHT22 แทน โดยเปลี่ยนเฉพาะส่วนอ่านเซนเซอร์เป็น `dht.readTemperature()` / `dht.readHumidity()` และใช้ Wi-Fi `Wokwi-GUEST`

### 12.8.6 เชื่อม Grafana Cloud

1. ใน Supabase คลิก **Connect** ด้านบนของหน้าโปรเจกต์ → เลือก **Session pooler** → **คัดลอก** ค่า host (รูปแบบ `aws-[INDEX]-[REGION].pooler.supabase.com`), port `5432` และ project ref (ส่วนต่อท้ายของ user `postgres.xxxx`)

   > ⚠️ `[INDEX]` คือหมายเลข cluster ของ pooler ซึ่ง **เดาจาก region ไม่ได้** (อาจเป็น `aws-0-...` หรือ `aws-1-...`) ต้องคัดลอก host จากหน้า Connect ของโปรเจกต์ตนเองเท่านั้น ([Supabase Docs: Connecting to Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres))
2. สมัครที่ [grafana.com](https://grafana.com) → แผน **Free** → สร้าง Stack
3. **Connections → Data sources → Add data source → PostgreSQL** → ตั้งชื่อ `Supabase` แล้วกรอกค่าดังนี้

| ช่อง | ค่า |
|:---|:---|
| Host URL | host ที่คัดลอกจากข้อ 1 ตามด้วย `:5432` เช่น `aws-[INDEX]-ap-southeast-1.pooler.supabase.com:5432` |
| Database name | `postgres` |
| Username | `grafana_ro.xxxx` (ชื่อ role + จุด + project ref) |
| Password | รหัสผ่านของ `grafana_ro` |
| TLS/SSL Mode | `require` |
| TimescaleDB | ปิด |

4. **Save & test** → ต้องขึ้น ✅ *Database Connection OK*

### 12.8.7 สร้าง Panel ของส่วนที่ 1

ทุก panel ในหัวข้อนี้ใช้ data source `Supabase` (role `grafana_ro`)

**ตัวแปร `device`:** Dashboard **Settings → Variables → Add variable** → Type **Query** → `SELECT DISTINCT device_id FROM telemetry ORDER BY 1;`

**Gauge อุณหภูมิ** (Min 0, Max 60, Unit Celsius, Thresholds เขียว → เหลือง `30` → แดง `35`) และ **Gauge ความชื้น** (เปลี่ยน `temp` เป็น `hum`, Max 100, Unit Humidity (%H), เหลือง `60` → แดง `70`)

```sql
SELECT created_at AS time, temp
FROM telemetry
WHERE device_id = '$device'
ORDER BY created_at DESC
LIMIT 1;
```

**Stat สถานะการเชื่อมต่อ** (Unit seconds, แดงที่ `30` ขึ้นไป ค่าเกิน 30 วินาทีแปลว่าขาดข้อมูลไปอย่างน้อย 5 รอบ)

```sql
SELECT EXTRACT(EPOCH FROM now() - max(created_at)) AS "วินาทีที่แล้ว"
FROM telemetry
WHERE device_id = '$device';
```

**Time series แนวโน้ม** (Format: Time series ตั้ง Override ให้ซีรีส์ความชื้นใช้แกน Y ด้านขวา)

```sql
SELECT
  $__timeGroupAlias(created_at, $__interval),
  avg(temp) AS "อุณหภูมิ (°C)",
  avg(hum)  AS "ความชื้น (%RH)"
FROM telemetry
WHERE device_id = '$device' AND $__timeFilter(created_at)
GROUP BY 1
ORDER BY 1;
```

ตั้ง Auto-refresh ที่มุมขวาบนเป็น **10s** แล้ว **Save dashboard** ชื่อ `MCC Monitor`

### 12.8.8 ตั้งการแจ้งเตือน

1. **Alerting → Contact points → Add contact point** → Integration **Email** → ใส่อีเมล → **Test** → **Save**
2. **Alerting → Alert rules → New alert rule** → ชื่อ `MCC overheat` → เลือก data source `Supabase` → Query:

```sql
SELECT $__timeGroupAlias(created_at, 1m), avg(temp) AS temp
FROM telemetry
WHERE device_id = 'mcc01' AND $__timeFilter(created_at)
GROUP BY 1
ORDER BY 1;
```

3. Expressions: **Reduce** = `Last` → **Threshold** = `IS ABOVE 35`
4. Evaluation ทุก `1m`, Pending period `2m` → เลือก Contact point → **Save rule**

Pending period ทำให้ต้องเกินเกณฑ์ **ต่อเนื่อง** 2 นาทีจึงจะแจ้งเตือน จึงไม่แจ้งเตือนผิดจากค่ากระโดดเพียงครั้งเดียว นอกจากนี้ Alert rule ใช้ตัวแปร `$device` ของแดชบอร์ดไม่ได้ จึงต้องระบุชื่ออุปกรณ์ตรง ๆ

---

## 12.9 ปฏิบัติการส่วนที่ 2: สั่งการ (Dashboard → ESP32)

**เป้าหมายของส่วนที่ 2:** ช่างสั่งเปิด/ปิดไฟ ปั๊ม และพัดลม (แทนด้วย LED) ได้ 2 ทาง คือจากฟอร์มบน Grafana และจากปุ่มหน้าตู้ ทั้งสองทางทำให้ตาราง `controls` ตรงกับสถานะของ LED เสมอ และทุกการเปลี่ยนแปลงถูกบันทึกลง `events` เพื่อแสดงบน State timeline และ Annotation

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

### 12.9.2 สร้างตาราง `controls`, `events` และ trigger บน Supabase

**ตาราง `controls`: สถานะที่สั่งล่าสุด 1 แถวต่ออุปกรณ์**

| คอลัมน์ | ชนิดข้อมูล | ค่าเริ่มต้น / เงื่อนไข | ผู้กำหนดค่า | ความหมาย | ตัวอย่าง |
|:---|:---|:---|:---|:---|:---|
| `device_id` | `text` (`text`) | Primary key | ผู้ดูแลระบบ (สร้างแถวครั้งแรก) | รหัสอุปกรณ์ | `mcc01` |
| `light` | `boolean` (`bool`) | `not null`, `default false` | Grafana / ปุ่ม GPIO 4 | สั่งไฟ (`true` = เปิด) | `false` |
| `pump` | `boolean` (`bool`) | `not null`, `default false` | Grafana / ปุ่ม GPIO 5 | สั่งปั๊ม | `false` |
| `fan` | `boolean` (`bool`) | `not null`, `default false` | Grafana / ปุ่ม GPIO 6 | สั่งพัดลม | `true` |
| `updated_by` | `text` (`text`) | รับเฉพาะ `button` / `dashboard` | Grafana / ESP32-S3 | ผู้สั่งครั้งล่าสุด | `dashboard` |
| `updated_at` | `timestamptz` (`timestamptz`) | `default now()` (trigger ตั้งใหม่ทุกครั้ง) | ฐานข้อมูล | เวลาที่สั่งครั้งล่าสุด | `2026-09-28 03:20:45+00` |

**ตาราง `events`: ประวัติการเปลี่ยนสถานะ (trigger เป็นผู้เขียน)**

| คอลัมน์ | ชนิดข้อมูล | ค่าเริ่มต้น / เงื่อนไข | ผู้กำหนดค่า | ความหมาย | ตัวอย่าง |
|:---|:---|:---|:---|:---|:---|
| `id` | `bigint` (`int8`) | Primary key, identity (เพิ่มอัตโนมัติ) | ฐานข้อมูล | เลขลำดับแถว | `57` |
| `created_at` | `timestamptz` (`timestamptz`) | `not null`, `default now()` | ฐานข้อมูล | เวลาที่สถานะเปลี่ยน (เก็บเป็น UTC) | `2026-09-28 03:16:12+00` |
| `device_id` | `text` (`text`) | `not null` | trigger | รหัสอุปกรณ์ | `mcc01` |
| `event` | `text` (`text`) | `not null`, รับเฉพาะ `light` / `pump` / `fan` | trigger | อุปกรณ์ที่ถูกสั่ง | `fan` |
| `state` | `boolean` (`bool`) | `not null` | trigger | สถานะหลังเปลี่ยน (`true` = เปิด, `false` = ปิด) | `true` |
| `source` | `text` (`text`) | `not null`, รับเฉพาะ `button` / `dashboard` | trigger (คัดลอกจาก `updated_by`) | ผู้สั่ง | `dashboard` |

Index: `events_device_time_idx` บนคอลัมน์ `(device_id, created_at desc)`

**ตัวอย่างข้อมูลหลังระบบทำงาน**

`controls` (มีแถวเดียว และถูกแก้ทับทุกครั้งที่สั่ง)

| device_id | light | pump | fan | updated_by | updated_at |
|:---|:---|:---|:---|:---|:---|
| mcc01 | true | false | false | button | 2026-09-28 03:48:02+00 |

`events` (เพิ่มแถวทุกครั้งที่สถานะเปลี่ยน)

| id | created_at | device_id | event | state | source | มาจาก |
|---:|:---|:---|:---|:---|:---|:---|
| 57 | 2026-09-28 03:16:12+00 | mcc01 | light | true | button | กดปุ่ม GPIO 4 หน้าตู้ |
| 58 | 2026-09-28 03:20:45+00 | mcc01 | fan | true | dashboard | ช่างสั่งเปิดพัดลมจาก Grafana |
| 59 | 2026-09-28 03:48:02+00 | mcc01 | fan | false | button | กดปุ่ม GPIO 6 หน้าตู้ |

ตาราง `events` ไม่ได้เชื่อมกับ `telemetry` ด้วย Foreign key แต่เชื่อมกันด้วย `device_id` และช่วงเวลา `created_at` เช่น Annotation บน Grafana จะนำ event `fan` ไปวางบนกราฟ `telemetry` ของอุปกรณ์เดียวกัน ณ เวลาเดียวกัน

**ขั้นตอน**

1. **SQL Editor → New query** → วางคำสั่งด้านล่าง → เปลี่ยน `'mcc01'` ในคำสั่ง `insert` ท้ายสุดเป็น `DEVICE_ID` ของตนเอง → **Run**

```sql
-- ===== ส่วนที่ 2: ตาราง controls (สถานะที่สั่ง) =====
create table public.controls (
  device_id  text primary key,
  light      boolean not null default false,
  pump       boolean not null default false,
  fan        boolean not null default false,
  updated_by text not null default 'dashboard'
             check (updated_by in ('button', 'dashboard')),
  updated_at timestamptz not null default now()
);

-- ===== ตาราง events (ประวัติการเปลี่ยนสถานะ) =====
create table public.events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id  text not null,
  event      text not null check (event in ('light', 'pump', 'fan')),
  state      boolean not null,
  source     text not null check (source in ('button', 'dashboard'))
);
create index events_device_time_idx on public.events (device_id, created_at desc);

-- ===== Trigger: บันทึก events ทุกครั้งที่ controls เปลี่ยน =====
create or replace function public.log_control_change()
returns trigger
language plpgsql
security definer          -- ทำงานด้วยสิทธิ์เจ้าของฟังก์ชัน จึงเขียน events ได้
set search_path = ''
as $$
begin
  new.updated_at := now();
  if new.light is distinct from old.light then
    insert into public.events (device_id, event, state, source)
    values (new.device_id, 'light', new.light, new.updated_by);
  end if;
  if new.pump is distinct from old.pump then
    insert into public.events (device_id, event, state, source)
    values (new.device_id, 'pump', new.pump, new.updated_by);
  end if;
  if new.fan is distinct from old.fan then
    insert into public.events (device_id, event, state, source)
    values (new.device_id, 'fan', new.fan, new.updated_by);
  end if;
  return new;
end;
$$;

create trigger controls_log_change
  before update on public.controls
  for each row execute function public.log_control_change();

-- ===== สิทธิ์ของ ESP32 (anon) =====
alter table public.controls enable row level security;
alter table public.events   enable row level security;

revoke all on public.controls, public.events from anon, authenticated;
grant select on public.controls to anon;
grant update (light, pump, fan, updated_by) on public.controls to anon;

create policy "esp32 read controls" on public.controls
  for select to anon using (true);
create policy "esp32 update controls" on public.controls
  for update to anon
  using (true)
  with check (updated_by = 'button');

-- ===== สร้างแถวเริ่มต้นของอุปกรณ์ (เปลี่ยนเป็น DEVICE_ID ของตนเอง) =====
insert into public.controls (device_id) values ('mcc01');
```

2. **Table Editor** → ตรวจว่ามีตาราง `controls` (1 แถว ค่าเป็น `false` ทั้งหมด) และ `events` (ว่าง) และทั้งสองตารางแสดงสถานะ **RLS enabled**
3. ทดสอบ trigger ใน SQL Editor: รัน `update controls set fan = true, updated_by = 'dashboard' where device_id = 'mcc01';` แล้วเปิด `events` ต้องเห็น 1 แถว (`fan`, `true`, `dashboard`) จากนั้นรัน `update controls set fan = false where device_id = 'mcc01';` เพื่อคืนค่า

**คำอธิบาย SQL ที่สำคัญ**

| ส่วนของ SQL | การทำงาน |
|:---|:---|
| `before update ... for each row` | trigger ทำงานก่อนบันทึกแต่ละแถว จึงแก้ `new.updated_at` ได้ และถ้าคำสั่ง `UPDATE` ถูกปฏิเสธด้วย RLS แถวใน `events` ก็จะถูกยกเลิกไปด้วย เพราะอยู่ใน transaction เดียวกัน |
| `is distinct from` | เปรียบเทียบค่าเก่ากับค่าใหม่ บันทึกเฉพาะอุปกรณ์ที่เปลี่ยนจริง ฟอร์มของ Grafana ส่งค่าทั้ง 3 อุปกรณ์ทุกครั้ง แต่ `events` จะได้เฉพาะแถวของอุปกรณ์ที่ถูกเปลี่ยน |
| `security definer` + `set search_path = ''` | ฟังก์ชันทำงานด้วยสิทธิ์ของเจ้าของ (`postgres`) ESP32 และ Grafana จึงไม่ต้องมีสิทธิ์เขียน `events` เอง การกำหนด `search_path` ว่างและเขียนชื่อเต็ม `public.events` ป้องกันการหลอกให้ฟังก์ชันเขียนตารางอื่น |
| `grant update (light, pump, fan, updated_by)` | สิทธิ์ระดับคอลัมน์ ESP32 แก้ได้เฉพาะสถานะและผู้สั่ง แก้ `device_id` หรือ `updated_at` เองไม่ได้ (`grafana_ctl` ในหัวข้อ 12.9.3 ได้สิทธิ์แบบเดียวกัน) |
| `with check (updated_by = 'button')` | ESP32 ต้องระบุตัวเองว่า `button` เสมอ อ้างเป็น `dashboard` ไม่ได้ ประวัติใน `events` จึงเชื่อถือได้ |

### 12.9.3 ตั้งค่า user `grafana_ctl` และเพิ่มสิทธิ์ `grafana_ro` บน Supabase

ส่วนที่ 2 ต้องตั้งค่า user 2 ราย

- **`grafana_ctl` (user ใหม่):** ใช้กับฟอร์มสั่งการบน Grafana เท่านั้น อ่านและแก้ได้เฉพาะตาราง `controls` (`ctl` = control)
- **`grafana_ro` (user เดิมจากหัวข้อ 12.8.4):** เพิ่มสิทธิ์อ่านตาราง `events` สำหรับ State timeline, Annotation และ Stat

**user `grafana_ctl`**

| รายการ | ค่า | เหตุผล |
|:---|:---|:---|
| Name | `grafana_ctl` | แยกจาก `grafana_ro` เพื่อให้ panel แสดงผลเขียนฐานข้อมูลไม่ได้ |
| Login | ได้ | Grafana ต้อง login ผ่าน Session Pooler |
| Password | ตั้งเอง และต้องไม่ซ้ำกับของ `grafana_ro` | ใช้กรอกใน data source `Supabase-Control` (หัวข้อ 12.9.5) |
| Bypass RLS · Superuser · Create role · Create DB | ปิดทั้งหมด | ให้สิทธิ์เท่าที่จำเป็นเท่านั้น |
| Username ที่กรอกใน Grafana | `grafana_ctl.<project_ref>` | รูปแบบเดียวกับ `grafana_ro` |

**สิทธิ์ที่ต้องให้**

| User | ตาราง | สิทธิ์ | RLS policy |
|:---|:---|:---|:---|
| `grafana_ctl` | `controls` | `SELECT` + `UPDATE` เฉพาะคอลัมน์ `light`, `pump`, `fan`, `updated_by` | อ่านได้ทุกแถว · แก้ได้เมื่อ `updated_by = 'dashboard'` เท่านั้น |
| `grafana_ro` | `events` | `SELECT` | อ่านได้ทุกแถว |

`grafana_ctl` ไม่มีสิทธิ์ใด ๆ กับ `telemetry` และ `events` เพราะฟอร์มสั่งการไม่ต้องใช้ ส่วนแถวใน `events` ที่เกิดจากการสั่งผ่านแดชบอร์ด trigger เป็นผู้เขียนให้ (หัวข้อ 12.6.4)

**วิธีที่ 1: สร้าง user ผ่านหน้าเว็บ Supabase แล้วให้สิทธิ์ด้วย SQL**

1. **Database → Access Control → Roles → Add role**
2. **Name** = `grafana_ctl` → เปิดสวิตช์ **User can login** เพียงข้อเดียว → **Save**
3. **SQL Editor → New query** → เปลี่ยนรหัสผ่านเป็นของตนเอง → **Run**

```sql
-- ===== grafana_ctl: ฟอร์มสั่งการ อ่าน/แก้ controls ได้อย่างเดียว =====
alter role grafana_ctl with password 'ChangeMe-Control-2026';
grant usage on schema public to grafana_ctl;
grant select on public.controls to grafana_ctl;
grant update (light, pump, fan, updated_by) on public.controls to grafana_ctl;

create policy "grafana read controls" on public.controls
  for select to grafana_ctl using (true);
create policy "grafana update controls" on public.controls
  for update to grafana_ctl
  using (true)
  with check (updated_by = 'dashboard');

-- ===== grafana_ro อ่าน events เพิ่ม (State timeline, Annotation) =====
grant select on public.events to grafana_ro;
create policy "grafana read events" on public.events
  for select to grafana_ro using (true);
```

**วิธีที่ 2: ใช้ SQL ทั้งหมด**

ใช้ชุดคำสั่งเดียวกับวิธีที่ 1 แต่เปลี่ยนบรรทัด `alter role ...` เป็น

```sql
create role grafana_ctl with login password 'ChangeMe-Control-2026';
```

> ⚠️ เช่นเดียวกับหัวข้อ 12.8.4 ให้เลือกใช้วิธีใดวิธีหนึ่งเท่านั้น ถ้ามี user `grafana_ctl` อยู่แล้ว คำสั่ง `create role` จะ error และคำสั่งทั้งชุดจะไม่ถูกบันทึก

**ตรวจสอบ**

- **Database → Access Control → Roles** → หัวข้อ *Other database roles* ต้องมีทั้ง `grafana_ro` และ `grafana_ctl`
- **Database → Access Control → Policies** → ตาราง `controls` ต้องมี 4 policy (`esp32 read controls`, `esp32 update controls`, `grafana read controls`, `grafana update controls`) และตาราง `events` ต้องมี `grafana read events`
- **SQL Editor** → รันคำสั่งด้านล่าง ต้องได้ 3 แถวคือ `controls | grafana_ctl | SELECT`, `controls | grafana_ctl | UPDATE` และ `events | grafana_ro | SELECT`

```sql
select table_name, grantee, privilege_type
from information_schema.table_privileges
where grantee in ('grafana_ro', 'grafana_ctl')
  and table_name in ('controls', 'events')
union
select distinct table_name, grantee, privilege_type
from information_schema.column_privileges
where grantee = 'grafana_ctl' and table_name = 'controls' and privilege_type = 'UPDATE'
order by 1, 2, 3;
```

### 12.9.4 โปรแกรม ESP32-S3 ส่วนที่ 2 (`mcc_control.ino`)

ติดตั้งไลบรารีเพิ่ม: **Library Manager** → **ArduinoJson** (by Benoit Blanchon, เวอร์ชัน 7) โปรแกรมนี้รวมงานของส่วนที่ 1 ไว้ด้วย จึงใช้แทน `mcc_monitor.ino` ได้ทันที

```cpp
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_AHTX0.h>
#include <ArduinoJson.h>

// ===== ตั้งค่าให้ตรงกับของตนเอง =====
const char* WIFI_SSID    = "YOUR_WIFI";
const char* WIFI_PASS    = "YOUR_PASSWORD";
const char* SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co/rest/v1/";
const char* SUPABASE_KEY = "sb_publishable_xxxxxxxxxxxx";   // Publishable key
const char* DEVICE_ID    = "mcc01";

#define I2C_SDA 8
#define I2C_SCL 9
const uint8_t BTN_PINS[3] = {4, 5, 6};             // ปุ่มหน้าตู้
const uint8_t OUT_PINS[3] = {10, 11, 12};          // LED แทนคอนแทคเตอร์
const char*   NAMES[3]    = {"light", "pump", "fan"};

const unsigned long SEND_INTERVAL = 5000;   // ms ส่งค่าเซนเซอร์
const unsigned long POLL_INTERVAL = 2000;   // ms ถามคำสั่งจากฐานข้อมูล
const unsigned long DEBOUNCE_MS   = 50;     // ms

Adafruit_AHTX0   aht;
WiFiClientSecure tls;
unsigned long    lastSend = 0;
unsigned long    lastPoll = 0;

// ตัวแปรที่ใช้ร่วมกับ ISR ต้องเป็น volatile
volatile bool          btnPending[3]  = {false, false, false};
volatile unsigned long btnLastEdge[3] = {0, 0, 0};

// สถานะของ light, pump, fan ที่ขับออก LED อยู่ขณะนี้
bool outState[3] = {false, false, false};

// ISR: เรียกทุกครั้งที่ขาเปลี่ยนสถานะ (กดหรือปล่อย)
void IRAM_ATTR onButtonChange(void* arg) {
  int i = (int)(intptr_t)arg;
  unsigned long now = millis();
  if (now - btnLastEdge[i] < DEBOUNCE_MS) {   // ยังอยู่ในช่วงหน้าสัมผัสเด้ง
    btnLastEdge[i] = now;                     // ขยายช่วงเงียบออกไป
    return;
  }
  btnLastEdge[i] = now;
  if (digitalRead(BTN_PINS[i]) == LOW) btnPending[i] = true;   // นับเฉพาะจังหวะกด
}

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }
  Serial.printf(" OK  IP=%s\n", WiFi.localIP().toString().c_str());
}

// header ที่ทุกคำขอไป Supabase ต้องมี
void addAuthHeaders(HTTPClient& http) {
  http.addHeader("apikey", SUPABASE_KEY);
  if (strncmp(SUPABASE_KEY, "eyJ", 3) == 0) {           // legacy anon key (JWT)
    http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY);
  }
}

int postJson(const char* table, const char* body) {
  HTTPClient http;
  http.begin(tls, String(SUPABASE_URL) + table);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Prefer", "return=minimal");
  addAuthHeaders(http);
  int code = http.POST(String(body));
  Serial.printf("POST %s %s -> %d\n", table, body, code);
  if (code >= 400) Serial.println(http.getString());    // ข้อความ error จาก Supabase
  http.end();
  return code;
}

void applyOutput(int i) {
  digitalWrite(OUT_PINS[i], outState[i] ? HIGH : LOW);
}

// ปุ่มหน้าตู้: แจ้งสถานะใหม่ของอุปกรณ์ i ขึ้นตาราง controls
int patchControl(int i) {
  HTTPClient http;
  http.begin(tls, String(SUPABASE_URL) + "controls?device_id=eq." + DEVICE_ID);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Prefer", "return=minimal");
  addAuthHeaders(http);
  char body[64];
  snprintf(body, sizeof(body), "{\"%s\":%s,\"updated_by\":\"button\"}",
           NAMES[i], outState[i] ? "true" : "false");
  int code = http.PATCH(String(body));
  Serial.printf("PATCH controls %s -> %d\n", body, code);
  if (code >= 400) Serial.println(http.getString());
  http.end();
  return code;
}

// คำสั่งจากแดชบอร์ด: อ่านสถานะที่ต้องการจาก controls แล้วขับ LED ให้ตรง
void pollControls() {
  HTTPClient http;
  http.begin(tls, String(SUPABASE_URL) + "controls?device_id=eq." + DEVICE_ID +
                  "&select=light,pump,fan");
  addAuthHeaders(http);
  int code = http.GET();
  if (code != 200) {
    Serial.printf("GET controls -> %d\n", code);
    if (code >= 400) Serial.println(http.getString());
    http.end();
    return;
  }
  String json = http.getString();        // เช่น [{"light":false,"pump":false,"fan":true}]
  http.end();

  JsonDocument doc;
  if (deserializeJson(doc, json) || doc.size() == 0) {
    Serial.println("controls: no row for this DEVICE_ID");
    return;
  }
  JsonObject row = doc[0];
  for (int i = 0; i < 3; i++) {
    bool want = row[NAMES[i]] | false;
    if (want != outState[i]) {             // เปลี่ยนเฉพาะเมื่อค่าต่างจากเดิม
      outState[i] = want;
      applyOutput(i);
      Serial.printf("CMD %s -> %s\n", NAMES[i], want ? "ON" : "OFF");
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(500);

  Wire.begin(I2C_SDA, I2C_SCL);
  if (!aht.begin(&Wire)) {
    Serial.println("AHT25 not found: check wiring SDA=8 SCL=9");
    while (true) delay(1000);
  }

  for (int i = 0; i < 3; i++) {
    pinMode(OUT_PINS[i], OUTPUT);
    applyOutput(i);                        // เริ่มต้นปิดทั้งหมด
    pinMode(BTN_PINS[i], INPUT_PULLUP);
    attachInterruptArg(BTN_PINS[i], onButtonChange, (void*)(intptr_t)i, CHANGE);
  }

  tls.setInsecure();   // สำหรับห้องแล็บ งานจริงให้ใช้ tls.setCACert(rootCA)
  connectWiFi();
  pollControls();      // รีบูตแล้วกลับไปสถานะล่าสุดที่สั่งไว้
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();

  // 1) ปุ่มหน้าตู้: สลับสถานะ ขับ LED ทันที แล้วแจ้งฐานข้อมูล
  for (int i = 0; i < 3; i++) {
    if (btnPending[i]) {
      btnPending[i] = false;
      outState[i] = !outState[i];          // Toggle
      applyOutput(i);
      patchControl(i);
    }
  }

  // 2) คำสั่งจากแดชบอร์ด: ถามทุก POLL_INTERVAL
  if (millis() - lastPoll >= POLL_INTERVAL) {
    lastPoll = millis();
    pollControls();
  }

  // 3) ค่าเซนเซอร์: ส่งทุก SEND_INTERVAL (เหมือนส่วนที่ 1)
  if (millis() - lastSend >= SEND_INTERVAL) {
    lastSend = millis();
    sensors_event_t hum, temp;
    if (aht.getEvent(&hum, &temp)) {
      char body[96];
      snprintf(body, sizeof(body),
               "{\"device_id\":\"%s\",\"temp\":%.1f,\"hum\":%.1f}",
               DEVICE_ID, temp.temperature, hum.relative_humidity);
      postJson("telemetry", body);
    } else {
      Serial.println("AHT25 read failed");
    }
  }
}
```

**คำอธิบายโค้ดส่วนที่เพิ่มจากส่วนที่ 1**

| ส่วนของโค้ด | การทำงาน |
|:---|:---|
| `attachInterruptArg(..., CHANGE)` | ใช้ ISR ตัวเดียวกับทั้ง 3 ปุ่ม โดยส่งหมายเลขปุ่ม `i` เป็นอาร์กิวเมนต์ |
| `IRAM_ATTR` | เก็บ ISR ไว้ใน RAM ภายใน เพื่อให้ตอบสนองได้เร็ว และทำงานได้แม้ cache ของ flash ถูกปิดชั่วคราว |
| Debounce ใน ISR | ขอบสัญญาณที่ห่างจากครั้งก่อนไม่ถึง 50 ms ถูกทิ้ง และช่วงเงียบถูกยืดออก ขอบแรกที่ผ่านเงื่อนไขจะนับเป็นการกดเมื่อขาอ่านได้ `LOW` เท่านั้น กดหนึ่งครั้งจึงได้หนึ่งการสั่ง การปล่อยปุ่มหรือกดค้างไม่ทำให้นับซ้ำ |
| `volatile` | บอกคอมไพเลอร์ว่าตัวแปรถูกแก้จาก ISR ได้ทุกเมื่อ ต้องอ่านจากหน่วยความจำจริงทุกครั้ง |
| `outState[i] = !outState[i]` แล้ว `applyOutput(i)` ก่อน `patchControl(i)` | ขับ LED ทันทีที่กดปุ่ม ช่างหน้าตู้จึงไม่ต้องรอเครือข่าย แล้วจึงแจ้งฐานข้อมูลให้แดชบอร์ดเห็นสถานะเดียวกัน `outState` แก้เฉพาะใน `loop()` จึงไม่ต้องเป็น `volatile` |
| `http.PATCH(...)` ไปที่ `controls?device_id=eq.<id>` | แก้เฉพาะคอลัมน์ของอุปกรณ์ที่กด พร้อม `updated_by = "button"` ตามที่ RLS policy บังคับ trigger ในฐานข้อมูลจะบันทึก `events` ให้เอง |
| `pollControls()` | `GET` แถวของอุปกรณ์นี้ แปลง JSON ด้วย ArduinoJson แล้วขับ LED เฉพาะอุปกรณ์ที่ค่าต่างจากเดิม คำสั่งจากแดชบอร์ดจึงทำงานภายในราว 2 วินาที (หัวข้อ 12.6.3) |
| `row[NAMES[i]] \| false` | ถ้าไม่พบคีย์หรือชนิดข้อมูลไม่ใช่ boolean ให้ใช้ค่า `false` (ปิด) ซึ่งเป็นสถานะที่ปลอดภัยกว่า |
| `pollControls()` ใน `setup()` | เมื่อรีบูต ESP32 จะอ่านสถานะล่าสุดจาก `controls` แล้วขับ LED ให้ตรงทันที (Desired State ในหัวข้อ 12.6.2) |
| ลำดับใน `loop()`: ปุ่ม → poll → เซนเซอร์ | จัดการปุ่มก่อน เพื่อให้ `PATCH` ถึงฐานข้อมูลก่อนการ `GET` รอบถัดไป ถ้าสลับลำดับ ค่าเก่าจากฐานข้อมูลอาจสลับ LED กลับทันทีหลังกดปุ่ม |

> **ข้อจำกัดของระบบ:** (1) ถ้า `PATCH` ล้มเหลว (เช่น Wi-Fi หลุดชั่วขณะ) การ poll รอบถัดไปจะสลับ LED กลับเป็นค่าในฐานข้อมูล เพราะฐานข้อมูลคือแหล่งความจริง (2) ตาราง `controls` เก็บเฉพาะ **สถานะที่สั่ง (Desired)** ไม่ได้ยืนยันว่าอุปกรณ์ทำงานจริง (Reported) งานจริงควรเพิ่มคอลัมน์ที่ ESP32 รายงานสถานะจริงกลับ หรือใช้หน้าสัมผัสช่วย (Auxiliary Contact) ของคอนแทคเตอร์ยืนยัน (3) เมื่อไม่มีเครือข่าย ESP32 จะค้างสถานะเดิมไว้ ต้องออกแบบว่าอุปกรณ์ใดควรปิดเองเมื่อขาดการติดต่อ (Fail-safe)

> **ใช้ Wokwi:** LED ปุ่มกด และไลบรารี ArduinoJson ใช้ใน Wokwi ได้ตามปกติ ต่อ LED ผ่านตัวต้านทาน 220 Ω ที่ GPIO 10/11/12 ได้เหมือนบอร์ดจริง

### 12.9.5 สร้างฟอร์มสั่งการด้วย Business Forms

**Business Forms** (plugin id `volkovlabs-form-panel`) เป็น panel plugin ที่ Grafana Labs ดูแล ใช้สร้างฟอร์มที่อ่านค่าจาก data source แล้วส่งค่าที่แก้ไขกลับไปเขียน data source ได้ ([Grafana Docs: Business Forms](https://grafana.com/docs/plugins/volkovlabs-form-panel/latest/)) ขั้นตอนด้านล่างอ้างอิงเวอร์ชัน 6.x ชื่อเมนูอาจต่างเล็กน้อยในเวอร์ชันอื่น

**ก. ติดตั้ง plugin และเพิ่ม data source สำหรับสั่งการ**

1. **Administration → Plugins and data → Plugins** → ค้นหา **Business Forms** → **Install** (ต้องเป็นผู้ดูแล Stack ซึ่งเจ้าของ Stack เป็นอยู่แล้ว)
2. **Connections → Data sources → Add data source → PostgreSQL** → ตั้งชื่อ `Supabase-Control` → กรอกค่าเหมือนหัวข้อ 12.8.6 ยกเว้น **Username** = `grafana_ctl.xxxx` และ **Password** = รหัสผ่านของ `grafana_ctl` → **Save & test**

> data source `Supabase` (`grafana_ro`) ใช้กับ panel แสดงผลทั้งหมด ส่วน `Supabase-Control` (`grafana_ctl`) ใช้กับฟอร์มสั่งการเท่านั้น ถ้าเลือกผิดเป็น `Supabase` ฟอร์มจะขึ้น *permission denied for table controls*

**ข. สร้าง panel ฟอร์มสั่งการ**

เปิดแดชบอร์ด `MCC Monitor` → **Add → Visualization** → เลือก visualization **Business Forms** → ตั้งชื่อ panel `สั่งการอุปกรณ์` แล้วตั้งค่าตามลำดับ

1. **Queries** (แท็บด้านล่าง): data source `Supabase-Control` → โหมด **Code** → Format **Table**

```sql
SELECT light, pump, fan
FROM controls
WHERE device_id = '$device';
```

2. **Form Elements** → **Add Element** 3 ตัว

| Id | Label | Type |
|:---|:---|:---|
| `light` | ไฟในตู้ | Radio group with boolean options |
| `pump` | ปั๊ม | Radio group with boolean options |
| `fan` | พัดลมระบายอากาศ | Radio group with boolean options |

   element แบบ boolean แสดงเป็นปุ่มเลือก **Enabled** (เปิด = `true`) / **Disabled** (ปิด = `false`)

3. **Initial Request** → **Initial Action** = `Query` → **Synchronize with data** = `Enabled` จากนั้นที่ **Initial Fields → Query Fields** จับคู่ element กับคอลัมน์ `light` → `A:light`, `pump` → `A:pump`, `fan` → `A:fan`

   ฟอร์มจะแสดงสถานะใน `controls` ขณะนั้น และอัปเดตตามทุกครั้งที่แดชบอร์ด refresh จึงเห็นผลของการกดปุ่มหน้าตู้ด้วย

4. **Update Request** → **Update Action** = `Data Source` → **Data Source** = `Supabase-Control` → **Custom Code** (โค้ดที่ทำงานหลังส่งคำสั่ง)

```js
if (context.panel.response && context.panel.response.state === 'Done') {
  context.grafana.notifySuccess(['สั่งการ', 'บันทึกคำสั่งแล้ว ESP32 จะทำตามภายในไม่กี่วินาที']);
  context.grafana.refresh();
} else {
  context.grafana.notifyError(['สั่งการ', 'ส่งคำสั่งไม่สำเร็จ']);
}
```

5. **Update Request Payload** → **Request Payload** = `All Elements` → **Query Editor** โหมด **Code** → Format **Table**

```sql
UPDATE controls
SET light      = ${payload.light},
    pump       = ${payload.pump},
    fan        = ${payload.fan},
    updated_by = 'dashboard'
WHERE device_id = '$device'
RETURNING light, pump, fan;
```

6. **Confirmation Window** = `Enabled` (ยืนยันก่อนส่งทุกครั้ง ตามหลักการในหัวข้อ 12.7) → **Submit Button → Text** = `ส่งคำสั่ง`
7. **Save dashboard**

| ตัวแปร | ความหมาย |
|:---|:---|
| `${payload.light}` | ค่าของ element id `light` ขณะกดส่ง Business Forms แทนเป็น `true` หรือ `false` ก่อนส่ง SQL ไปยังฐานข้อมูล |
| `'$device'` | ตัวแปรของแดชบอร์ด ฟอร์มจึงสั่งเฉพาะอุปกรณ์ที่เลือกอยู่ |
| `RETURNING ...` | ให้ `UPDATE` ส่งแถวที่แก้แล้วกลับมา ถ้าได้ 0 แถวแปลว่าไม่มีแถวของอุปกรณ์นี้ใน `controls` |

**ลำดับเหตุการณ์เมื่อกด "ส่งคำสั่ง":** Grafana ส่ง `UPDATE` ด้วย role `grafana_ctl` → RLS ตรวจว่า `updated_by = 'dashboard'` → trigger บันทึก `events` ของอุปกรณ์ที่เปลี่ยน → ภายในราว 2 วินาที ESP32 `GET` ได้ค่าใหม่แล้วขับ LED → แดชบอร์ด refresh แล้ว State timeline แสดงช่วงเวลาใหม่

### 12.9.6 Panel ประวัติการสั่ง (State timeline, Annotation, Stat)

panel ในหัวข้อนี้อ่าน `events` จึงใช้ data source `Supabase` (`grafana_ro`)

**State timeline ไฟ · ปั๊ม · พัดลม** (Format: Time series, Value mappings: `1` → "เปิด" สีเขียว, `0` → "ปิด" สีเทา) วางไว้ข้างฟอร์มสั่งการในแถวที่ 3

```sql
SELECT created_at AS time, event AS metric, state::int AS value
FROM events
WHERE device_id = '$device' AND $__timeFilter(created_at)
ORDER BY 1;
```

คอลัมน์ชื่อ `metric` บอก Grafana ให้แยกข้อมูลเป็นซีรีส์ตามชื่ออุปกรณ์ จึงได้แถบ 3 แถว (light, pump, fan) ส่วน `state::int` แปลง `true`/`false` เป็น `1`/`0` ให้ใช้กับ Value mappings ได้

**Annotation เปิด/ปิดพัดลม:** Dashboard **Settings → Annotations → New** → เลือก data source `Supabase`

```sql
SELECT created_at AS time,
       CASE WHEN state THEN 'เปิดพัดลม' ELSE 'ปิดพัดลม' END
         || ' (' || source || ')' AS text,
       event AS tags
FROM events
WHERE device_id = '$device' AND event = 'fan'
  AND $__timeFilter(created_at);
```

เส้นหมายเหตุนี้ช่วยให้เห็นเหตุกับผลบนกราฟแนวโน้มในแถวที่ 2 เช่น หลังเส้น "เปิดพัดลม (dashboard)" อุณหภูมิในตู้ควรค่อย ๆ ลดลง

**Stat เปิดพัดลมวันนี้** (วางในแถวที่ 1 นับจำนวนครั้งที่เปิดพัดลมตามเวลาไทย ไม่ว่าจะสั่งจากทางใด)

```sql
SELECT count(*) AS "เปิดพัดลมวันนี้"
FROM events
WHERE device_id = '$device' AND event = 'fan' AND state = true
  AND created_at >= date_trunc('day', now() AT TIME ZONE 'Asia/Bangkok') AT TIME ZONE 'Asia/Bangkok';
```

`AT TIME ZONE` สองชั้นคือ แปลงเวลาปัจจุบันเป็นเวลาไทย ตัดให้เหลือเที่ยงคืน แล้วแปลงกลับเป็น `timestamptz` ถ้าใช้ `date_trunc('day', now())` ตรง ๆ วันใหม่จะเริ่มตอน 07:00 น. ตามเวลาไทย เพราะ `now()` เป็นเวลา UTC

จัด panel ให้ครบตาม Layout ในหัวข้อ 12.7 แล้ว **Save dashboard**

---

## 12.10 การแก้ปัญหาที่พบบ่อย

| ส่วน | อาการ | สาเหตุที่เป็นไปได้ | วิธีแก้ |
|:---|:---|:---|:---|
| 1 | Serial Monitor ไม่แสดงอะไร | ปิด USB CDC On Boot | ตั้ง **USB CDC On Boot: Enabled** แล้วอัปโหลดใหม่ |
| 1 | `AHT25 not found` | สาย SDA/SCL สลับ หรือไม่ได้จ่ายไฟ | ตรวจขาตามที่พิมพ์ไว้บนโมดูล และใช้ 3V3 |
| 1 | ต่อ Wi-Fi ไม่ขึ้น | เครือข่าย 5 GHz หรือเป็น WPA2-Enterprise | ใช้ Hotspot มือถือแบบ 2.4 GHz |
| 1 | ได้ `401` ตลอด | key ผิด หรือคัดลอกมาไม่ครบ | คัดลอก Publishable key (`sb_publishable_...`) ใหม่ และตรวจว่าส่งใน header `apikey` |
| 1 | ได้ `401/403` พร้อม code `42501` | ไม่ผ่าน RLS policy | ตรวจค่าที่ส่งกับ `with check` |
| 1 | Grafana: connection timeout | ใช้ Direct connection (IPv6) | เปลี่ยนเป็น Session pooler |
| 1 | Grafana: password authentication failed | Username ไม่มี `.project_ref` ต่อท้าย | ใช้รูปแบบ `grafana_ro.xxxx` หรือ `grafana_ctl.xxxx` |
| 1 | Grafana: เชื่อมต่อได้แต่ไม่มีข้อมูล | ไม่มี policy `select` ให้ role นั้น | รัน `create policy "grafana read ..."` |
| 1 | Grafana: *Data is missing a time field* | Format ไม่ตรง หรือไม่มีคอลัมน์เวลา | ตั้ง Format เป็น Time series และตั้งชื่อคอลัมน์เวลาว่า `time` |
| 2 | LED ไม่ติดเลย | ต่อ LED กลับขั้ว หรือลืมตัวต้านทาน | ขายาวต่อฝั่ง GPIO ผ่าน 220 Ω ขาสั้นต่อ GND |
| 2 | กดปุ่มครั้งเดียวได้ 2 event | ปุ่มเด้งนานกว่า 50 ms | เพิ่ม `DEBOUNCE_MS` เป็น 80–100 |
| 2 | Serial ขึ้น `controls: no row for this DEVICE_ID` | ยังไม่ได้ `insert` แถวของอุปกรณ์ หรือ `DEVICE_ID` สะกดไม่ตรง | รัน `insert into controls (device_id) values ('<DEVICE_ID>');` |
| 2 | `PATCH` ได้ `204` แต่แดชบอร์ดไม่เปลี่ยน | ไม่มีแถวที่ตรง `DEVICE_ID` (แก้ 0 แถว) | ตรวจแถวใน `controls` เหมือนข้อบน |
| 2 | `PATCH` ได้ `401/403` code `42501` | `updated_by` ไม่ใช่ `button` หรือไม่มี policy update | ตรวจ body และ policy `esp32 update controls` |
| 2 | กดปุ่มแล้ว LED ติดแล้วดับเองใน 2 วินาที | `PATCH` ล้มเหลว poll จึงดึงค่าเดิมกลับมา | ดู status code ของ `PATCH` ใน Serial Monitor |
| 2 | Business Forms: *permission denied for table controls* | ฟอร์มใช้ data source `Supabase` (`grafana_ro`) | เปลี่ยน Query และ Update Request เป็น `Supabase-Control` |
| 2 | Business Forms: กดส่งแล้ว SQL error ที่ `SET light = ,` | element id ไม่ตรงกับ `${payload.<id>}` หรือยังไม่ได้ map Query Fields | ตรวจ Id ของ element และการจับคู่ `A:light` ฯลฯ |
| 2 | สั่งจากแดชบอร์ดแล้ว `events` ไม่มีแถวใหม่ | ส่งค่าเดิมซ้ำ (trigger บันทึกเฉพาะเมื่อค่าเปลี่ยน) หรือไม่ได้สร้าง trigger | เปลี่ยนค่าจริง หรือรันคำสั่ง `create trigger` อีกครั้ง |

</div>

<div class="chapter-tab-content" data-tab-name="Lab 14" data-tab-icon="🔬" id="lab14" markdown="1">

## 12.11 ใบงานปฏิบัติการ Lab 14: ระบบติดตามและสั่งการตู้ควบคุมด้วย Supabase + Grafana

**ฮาร์ดแวร์:** ESP32-S3 DevKit + AHT25 + ปุ่มกด 3 ปุ่ม + LED 3 ดวง + ตัวต้านทาน 220 Ω 3 ตัว  
**เครื่องมือ (ฟรีทั้งหมด):** Arduino IDE + Supabase (Free Plan) + Grafana Cloud (Free Tier) + plugin Business Forms  
**เวลา:** 3 ชั่วโมง (ส่วนที่ 1 ประมาณ 105 นาที · ส่วนที่ 2 ประมาณ 75 นาที)

> ใบงานนี้ใช้ทำตามลำดับขั้นและบันทึกผล ส่วนโค้ดฉบับเต็ม SQL และคำอธิบายอยู่ในแท็บ **Hands-on** (หัวข้อ 12.8 สำหรับส่วนที่ 1 และ 12.9 สำหรับส่วนที่ 2)

### วัตถุประสงค์ของใบงาน

**ส่วนที่ 1: ติดตาม (Sensor → ESP32 → Dashboard)**
- ต่อวงจร ESP32-S3 กับ AHT25 (I2C) ได้
- สร้างตาราง `telemetry` บน Supabase พร้อมกำหนดสิทธิ์ด้วย Row Level Security ได้
- ส่งข้อมูลเซนเซอร์ผ่าน HTTPS POST ไปยัง REST API ได้
- เชื่อม Grafana Cloud ด้วย role อ่านอย่างเดียว สร้างแดชบอร์ดตามหลักการออกแบบที่ดี และตั้งการแจ้งเตือนอุณหภูมิสูงทางอีเมลได้

**ส่วนที่ 2: สั่งการ (Dashboard → ESP32)**
- ต่อปุ่มกด (Pull-up + Interrupt) และ LED เป็นเอาต์พุตได้
- สร้างตาราง `controls` แบบ Desired State และ trigger ที่บันทึก `events` อัตโนมัติได้
- เขียนโปรแกรมให้ ESP32 poll คำสั่งด้วย HTTPS GET และแจ้งการกดปุ่มหน้าตู้ด้วย PATCH ได้
- สร้างฟอร์มสั่งการด้วย Business Forms ผ่าน role ที่แก้ได้เฉพาะตาราง `controls` ได้

**สถานการณ์:** ติดตั้งอุปกรณ์ในตู้ควบคุมมอเตอร์ปั๊ม (MCC) เพื่อวัดอุณหภูมิและความชื้นภายในตู้ (ส่วนที่ 1) และให้ช่างสั่งเปิด/ปิด **ไฟ** (`light`), **ปั๊ม** (`pump`) และ **พัดลม** (`fan`) ได้ทั้งจากแดชบอร์ดและจากปุ่มหน้าตู้ (ส่วนที่ 2) โดยทุกการสั่งจะถูกบันทึกพร้อมผู้สั่ง

---

## ส่วนที่ 1: ติดตาม (Sensor → ESP32 → Dashboard)

### ขั้นที่ 1.1: ต่อวงจรและตั้งค่า Arduino IDE (15 นาที)

#### ความรู้เบื้องต้น

- **AHT25** เป็นเซนเซอร์ดิจิทัล สื่อสารผ่าน I2C ที่ address `0x38` ESP32-S3 เลือกขา I2C ได้อิสระ บทนี้ใช้ SDA = GPIO 8 และ SCL = GPIO 9

#### ขั้นตอนปฏิบัติ

| อุปกรณ์ | ขาอุปกรณ์ | ESP32-S3 |
|:---|:---|:---|
| AHT25 | VDD / GND / SDA / SCL | 3V3 / GND / GPIO 8 / GPIO 9 |

1. ต่อวงจรตามตาราง โดยดูลำดับขาตามที่พิมพ์ไว้บนโมดูล AHT25 และ **ห้ามต่อเข้า 5V**
2. Arduino IDE → **Boards Manager** → ติดตั้ง **esp32 by Espressif Systems**
3. **Library Manager** → ติดตั้ง **Adafruit AHTX0**
4. **Tools** → Board **ESP32S3 Dev Module** → **USB CDC On Boot: Enabled**
5. เตรียม Wi-Fi แบบ **2.4 GHz** ที่ไม่ต้อง login ผ่านหน้าเว็บ (ใช้ Hotspot มือถือได้)

#### ตารางบันทึกผล — ขั้นที่ 1.1

| รายการ | สถานะ |
|:---|:---|
| ต่อวงจรครบ ตรวจแรงดันที่ขา VDD ของ AHT25 = 3.3 V | ________ |
| ติดตั้ง ESP32 core และ Adafruit AHTX0 สำเร็จ | ________ |
| ชื่อ Wi-Fi ที่ใช้ และย่านความถี่ | ________ |

### ขั้นที่ 1.2: สร้างตาราง `telemetry` และ user `grafana_ro` บน Supabase (20 นาที)

#### ขั้นตอนปฏิบัติ

1. สมัครที่ [supabase.com](https://supabase.com) → **New project** → ชื่อ `mcc-monitor` → ตั้ง Database Password → Region **Southeast Asia (Singapore)**
2. **SQL Editor → New query** → วางชุดคำสั่ง SQL ส่วนที่ 1 จาก **หัวข้อ 12.8.3** → **Run** ชุดคำสั่งนี้สร้าง
   - ตาราง `telemetry` พร้อม index
   - policy ให้ `anon` (ESP32) **INSERT ได้อย่างเดียว** และตรวจช่วงค่า `temp` / `hum`
3. สร้าง user `grafana_ro` ที่ **SELECT ได้อย่างเดียว** ตาม **หัวข้อ 12.8.4** (วิธีที่ 1 ผ่านหน้าเว็บ หรือวิธีที่ 2 ด้วย SQL) โดยตั้งรหัสผ่านเป็นของตนเอง
4. **Integrations → Data API → Overview** → คัดลอก **Project URL** และ **Project Settings → API Keys** → คัดลอก **Publishable key** (`sb_publishable_...`)

#### ตารางบันทึกผล — ขั้นที่ 1.2

| รายการ | สถานะ |
|:---|:---|
| เห็นตาราง `telemetry` ใน Table Editor | ________ |
| RLS ของตาราง `telemetry` แสดงสถานะ Enabled | ________ |
| วิธีที่ใช้สร้าง `grafana_ro` (หน้าเว็บ / SQL) และผลคำสั่งตรวจสิทธิ์ | ________ |
| Project URL ของฉัน | ________ |

### ขั้นที่ 1.3: โปรแกรม ESP32-S3 ส่งค่าเซนเซอร์ (25 นาที)

#### ความรู้เบื้องต้น

- ESP32 ส่งค่าเซนเซอร์ไปที่ `POST /rest/v1/telemetry` ทุก 5 วินาที ฐานข้อมูลตอบ `201` เมื่อบันทึกสำเร็จ
- โปรแกรมใช้ `millis()` แทน `delay()` เพื่อให้ `loop()` ว่างสำหรับงานอื่นในส่วนที่ 2

#### ขั้นตอนปฏิบัติ

1. สร้าง sketch ใหม่ชื่อ `mcc_monitor` → คัดลอกโค้ดจาก **หัวข้อ 12.8.5**
2. แก้ค่า `WIFI_SSID`, `WIFI_PASS`, `SUPABASE_URL` (ต้องลงท้ายด้วย `/rest/v1/`) และ `SUPABASE_KEY`
3. เปลี่ยน `DEVICE_ID` เป็น `mcc-` ตามด้วยรหัสนักศึกษา 4 ตัวท้าย เช่น `mcc-1234`
4. อัปโหลด → เปิด Serial Monitor ที่ **115200** ต้องเห็น `WiFi OK` แล้วตามด้วย `POST telemetry ... -> 201` ทุก 5 วินาที
5. เปิด Supabase **Table Editor** → ตรวจว่ามีแถวใหม่ในตาราง `telemetry`

#### ตารางบันทึกผล — ขั้นที่ 1.3

| การทดลอง | ผลใน Serial Monitor | แถวใหม่ใน Table Editor? |
|:---|:---|:---|
| รอ 30 วินาที | ได้ `201` กี่ครั้ง: ________ | ________ |
| ใช้นิ้วจับ AHT25 นาน 30 วินาที | temp เปลี่ยนจาก ____ เป็น ____ °C | ________ |
| แก้ key ผิด 1 ตัวอักษร แล้วอัปโหลดใหม่ | Status code: ________ | ________ |

### ขั้นที่ 1.4: เชื่อม Grafana Cloud และสร้างแดชบอร์ด (30 นาที)

#### ขั้นตอนปฏิบัติ

1. Supabase → **Connect** → **Session pooler** → จด host, port และ project ref
2. สมัคร [grafana.com](https://grafana.com) แผน **Free** → **Connections → Data sources → PostgreSQL** → ตั้งชื่อ `Supabase` → กรอกค่าตาม **หัวข้อ 12.8.6** (Username = `grafana_ro.<project_ref>`, TLS/SSL Mode = `require`) → **Save & test**
3. สร้างแดชบอร์ดใหม่ → เพิ่มตัวแปร `device` → สร้าง panel ตาม query ใน **หัวข้อ 12.8.7** โดยจัด Layout ดังนี้ (เว้นที่ว่างสำหรับ panel ของส่วนที่ 2)

| แถว | Panel |
|:---|:---|
| 1 | Gauge อุณหภูมิ · Gauge ความชื้น · Stat สถานะการเชื่อมต่อ |
| 2 | Time series อุณหภูมิ + ความชื้น |

4. ตั้ง Auto-refresh **10s** → **Save dashboard** ชื่อ `MCC Monitor`

#### ตารางบันทึกผล — ขั้นที่ 1.4

| การทดลอง | ผลที่เห็นบน Dashboard |
|:---|:---|
| Save & test ของ data source | ________ |
| ใช้นิ้วจับ AHT25 นาน 1 นาที | Gauge อุณหภูมิเปลี่ยนสีหรือไม่: ________ |
| ถอดสาย USB ของ ESP32-S3 แล้วรอ 40 วินาที | ค่าและสีของ Stat สถานะการเชื่อมต่อ: ________ |
| เปลี่ยนช่วงเวลาจาก Last 15 minutes เป็น Last 24 hours | กราฟเปลี่ยนอย่างไร: ________ |

### ขั้นที่ 1.5: ตั้งการแจ้งเตือนอุณหภูมิสูง (15 นาที)

#### ขั้นตอนปฏิบัติ

1. **Alerting → Contact points** → เพิ่ม Email ของตนเอง → **Test**
2. **Alerting → Alert rules → New alert rule** → ใช้ query ใน **หัวข้อ 12.8.8** (เปลี่ยน `'mcc01'` เป็น `DEVICE_ID` ของตนเอง)
3. **Reduce** = `Last` → **Threshold** `IS ABOVE 35` → Evaluation ทุก `1m`, Pending period `2m` → **Save rule**
4. ทดสอบ: เปลี่ยน Threshold เป็นค่าที่สูงกว่าอุณหภูมิห้องเล็กน้อย เช่น `32` แล้วใช้นิ้วจับหรือเป่าลมอุ่นใส่ AHT25 ต่อเนื่อง

#### ตารางบันทึกผล — ขั้นที่ 1.5

| การทดลอง | สถานะ Alert (Normal / Pending / Firing) | ได้รับอีเมล? |
|:---|:---|:---|
| อุณหภูมิเกินเกณฑ์นาน 1 นาที | ________ | ________ |
| อุณหภูมิเกินเกณฑ์นาน 4 นาที | ________ | ________ |
| ปล่อยให้อุณหภูมิกลับสู่ปกติ | ________ | ________ |

---

## ส่วนที่ 2: สั่งการ (Dashboard → ESP32)

> เริ่มส่วนที่ 2 ได้เมื่อแดชบอร์ดของส่วนที่ 1 แสดงข้อมูลได้แล้วเท่านั้น

### ขั้นที่ 2.1: ต่อ LED + ปุ่ม สร้างตาราง `controls` และ user `grafana_ctl` (25 นาที)

#### ความรู้เบื้องต้น

- **ปุ่มกด** ต่อระหว่างขา GPIO กับ GND แล้วเปิด `INPUT_PULLUP` ขาจะอ่านได้ `HIGH` ตอนปล่อย และ `LOW` ตอนกด
- **LED** ต่อผ่านตัวต้านทาน 220 Ω จำกัดกระแสไว้ราว 6 mA ($I = (3.3 - 2.0)/220$)
- ตาราง `controls` เก็บ **สถานะที่ต้องการ** 1 แถวต่ออุปกรณ์ ทั้งแดชบอร์ดและปุ่มหน้าตู้เขียนแถวเดียวกัน และ trigger บันทึกทุกการเปลี่ยนแปลงลง `events`

#### ขั้นตอนปฏิบัติ

| อุปกรณ์ | ESP32-S3 |
|:---|:---|
| ปุ่ม `light` / `pump` / `fan` (อีกขาต่อ GND) | GPIO 4 / 5 / 6 |
| LED `light` / `pump` / `fan` (ขายาวผ่าน R 220 Ω, ขาสั้นต่อ GND) | GPIO 10 / 11 / 12 |

1. ต่อวงจรเพิ่มตามตาราง โดยไม่ต้องถอด AHT25
2. **SQL Editor → New query** → วางชุดคำสั่ง SQL ส่วนที่ 2 จาก **หัวข้อ 12.9.2** → เปลี่ยน `'mcc01'` ในคำสั่ง `insert` เป็น `DEVICE_ID` ของตนเอง → **Run**
3. ทดสอบ trigger ด้วยคำสั่ง `update` ในข้อ 3 ของหัวข้อ 12.9.2 แล้วตรวจตาราง `events`
4. สร้าง user `grafana_ctl` และเพิ่มสิทธิ์อ่าน `events` ให้ `grafana_ro` ตาม **หัวข้อ 12.9.3** โดยตั้งรหัสผ่านเป็นของตนเอง

#### ตารางบันทึกผล — ขั้นที่ 2.1

| รายการ | สถานะ |
|:---|:---|
| ตาราง `controls` มี 1 แถวของ `DEVICE_ID` ของฉัน | ________ |
| RLS ของ `controls` และ `events` แสดงสถานะ Enabled | ________ |
| หลังทดสอบ `update` ตาราง `events` มีกี่แถว และค่า `source` คือ | ________ |
| ผลคำสั่งตรวจสิทธิ์ในหัวข้อ 12.9.3 ได้กี่แถว | ________ |

### ขั้นที่ 2.2: โปรแกรม ESP32-S3 รับคำสั่งและปุ่มหน้าตู้ (25 นาที)

#### ความรู้เบื้องต้น

- ESP32 ถามคำสั่งด้วย `GET /rest/v1/controls?device_id=eq.<id>` ทุก 2 วินาที และเมื่อกดปุ่มจะสลับ LED ทันทีแล้ว `PATCH` ค่าใหม่ขึ้น `controls`
- ESP32 ต้องส่ง HTTPS แทบตลอดเวลา (แต่ละครั้งค้าง 0.5–2 วินาที) โปรแกรมจึงอ่านปุ่มด้วย **Interrupt** เพื่อไม่ให้การกดระหว่างส่งข้อมูลหายไป และทำ **Debounce** 50 ms ใน ISR

#### ขั้นตอนปฏิบัติ

1. **Library Manager** → ติดตั้ง **ArduinoJson** (by Benoit Blanchon, v7)
2. สร้าง sketch ใหม่ชื่อ `mcc_control` → คัดลอกโค้ดจาก **หัวข้อ 12.9.4** → ใส่ค่า Wi-Fi, URL, key และ `DEVICE_ID` เดิมจากขั้นที่ 1.3
3. อัปโหลด → Serial Monitor ต้องเห็น `POST telemetry ... -> 201` ทุก 5 วินาทีเหมือนเดิม และไม่มีข้อความ `controls: no row ...`
4. กดปุ่มแต่ละปุ่ม 1 ครั้ง → LED ต้องติดทันที และเห็น `PATCH controls ... -> 204` **ครั้งเดียวต่อการกด**
5. SQL Editor → รัน `update controls set pump = true, updated_by = 'dashboard' where device_id = '<DEVICE_ID>';` → ภายในไม่กี่วินาทีต้องเห็น `CMD pump -> ON` และ LED ปั๊มติด

#### ตารางบันทึกผล — ขั้นที่ 2.2

| การทดลอง | ผลใน Serial Monitor / LED | แถวใหม่ใน `events` (`event`, `state`, `source`) |
|:---|:---|:---|
| กดปุ่ม `light` 1 ครั้ง | ________ | ________ |
| กดปุ่ม `light` อีก 1 ครั้ง | ________ | ________ |
| กดปุ่ม `fan` ค้างไว้ 3 วินาทีแล้วปล่อย | ได้ `PATCH` กี่ครั้ง: ________ | ________ |
| กดปุ่ม `pump` ขณะ Serial กำลังพิมพ์ `POST telemetry` | การกดหายหรือไม่: ________ | ________ |
| สั่ง `pump = true` จาก SQL Editor | เวลาจนเห็น `CMD pump -> ON` ประมาณ ____ วินาที | ________ |
| เปิด `fan` ไว้ แล้วกดปุ่ม EN (รีเซ็ต) บนบอร์ด | หลังบูต LED `fan` ติดหรือไม่: ________ | ________ |

### ขั้นที่ 2.3: ฟอร์มสั่งการบน Grafana และ panel ประวัติการสั่ง (25 นาที)

#### ขั้นตอนปฏิบัติ

1. ติดตั้ง plugin **Business Forms** และเพิ่ม data source `Supabase-Control` (Username = `grafana_ctl.<project_ref>`) ตาม **หัวข้อ 12.9.5 ก**
2. สร้าง panel `สั่งการอุปกรณ์` ตาม **หัวข้อ 12.9.5 ข** (element 3 ตัว, Initial Action = Query, Update Action = Data Source, Confirmation Window = Enabled)
3. สร้าง State timeline, Annotation และ Stat เปิดพัดลมวันนี้ ตาม **หัวข้อ 12.9.6** แล้วจัด Layout ให้ครบ

| แถว | Panel |
|:---|:---|
| 1 | Gauge อุณหภูมิ · Gauge ความชื้น · Stat สถานะการเชื่อมต่อ · Stat เปิดพัดลมวันนี้ |
| 2 | Time series อุณหภูมิ + ความชื้น พร้อม Annotation เปิด/ปิดพัดลม |
| 3 | ฟอร์มสั่งการ · State timeline ไฟ · ปั๊ม · พัดลม |

4. **Save dashboard**

#### ตารางบันทึกผล — ขั้นที่ 2.3

| การทดลอง | ผลที่เห็น |
|:---|:---|
| สั่ง `fan` = Enabled จากฟอร์ม แล้วจับเวลาจนถึง LED ติด (ทำ 5 ครั้ง) | ____ / ____ / ____ / ____ / ____ วินาที เฉลี่ย ____ (เทียบกับค่าประมาณในหัวข้อ 12.6.3) |
| กดปุ่ม `pump` หน้าตู้ แล้วรอแดชบอร์ด refresh | ค่า `pump` บนฟอร์ม: ________ แถบ pump บน State timeline: ________ |
| สั่ง `fan` เปิด-ปิดจากฟอร์ม 1 รอบ และจากปุ่ม 1 รอบ | ค่า Stat เปิดพัดลมวันนี้: ____ ข้อความบนเส้น Annotation: ________ |
| เปิด `fan` แล้วใช้มือบังอากาศรอบ AHT25 เทียบกับตอนปิด | แนวโน้มอุณหภูมิบนกราฟ: ________ |
| เปลี่ยน data source ของ Update Request เป็น `Supabase` (`grafana_ro`) ชั่วคราว แล้วกดส่ง | ข้อความ error: ________ (ทดสอบแล้วเปลี่ยนกลับ) |
| ปิด Hotspot แล้วสั่ง `light` จากฟอร์ม จากนั้นเปิด Hotspot อีกครั้ง | LED `light` ทำงานเมื่อใด: ________ |

---

### แบบฝึกหัดท้ายใบงาน

1. **Interrupt กับ Polling:** จากผลการทดลองในขั้นที่ 2.2 (กด `pump` ขณะกำลังส่งข้อมูล) อธิบายว่าถ้าโปรแกรมอ่านปุ่มด้วย `digitalRead()` ใน `loop()` แทน Interrupt ผลจะต่างไปอย่างไร เพราะเหตุใด

   > คำตอบ: _______________________________________________________________

2. **Debounce:** จากการกดปุ่ม `fan` ค้างไว้ 3 วินาที ทำไมโปรแกรมจึงนับเป็นเพียง 1 การสั่ง? อธิบายโดยอ้างอิงเงื่อนไขในฟังก์ชัน `onButtonChange()`

   > คำตอบ: _______________________________________________________________

3. **Desired State:** จากการทดลองรีเซ็ตบอร์ดขณะเปิด `fan` ไว้ อธิบายว่าทำไม LED จึงกลับมาอยู่สถานะเดิม และถ้าเปลี่ยนตาราง `controls` ให้เก็บเป็นคำสั่ง "toggle" แทนสถานะ จะเกิดปัญหาอะไร

   > คำตอบ: _______________________________________________________________

4. **ความปลอดภัย:** ถ้ามีผู้ไม่หวังดีนำ Publishable key ออกจากเฟิร์มแวร์ของ ESP32-S3 ได้ เขาจะทำอะไรกับฐานข้อมูลได้บ้าง และทำอะไรไม่ได้บ้าง? อ้างอิง policy ที่สร้างในขั้นที่ 1.2 และ 2.1

   > คำตอบ: _______________________________________________________________

5. **ประยุกต์งานเครื่องกล:** ถ้าต้องการรู้ว่า "เปิดพัดลมระบายอากาศแล้ว อุณหภูมิเฉลี่ยในตู้ลดลงหรือไม่" จะใช้ panel ใดบนแดชบอร์ด และเขียน SQL เปรียบเทียบอุณหภูมิเฉลี่ย 10 นาทีก่อนและหลัง event `fan` ที่ `state = true` ล่าสุดอย่างไร

   > คำตอบ: _______________________________________________________________

---

### การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จากอาจารย์ผู้สอน)**

สิ่งที่ต้องส่ง:
1. รูปถ่ายวงจรจริง ESP32-S3 + AHT25 + ปุ่ม 3 ปุ่ม + LED 3 ดวง
2. Screenshot Serial Monitor ที่แสดง `POST telemetry ... -> 201`, `PATCH controls ... -> 204` และ `CMD ... -> ON`
3. Screenshot Supabase Table Editor ของตาราง `telemetry` (อย่างน้อย 20 แถว), `controls` และ `events` (มีทั้ง `source` = `button` และ `dashboard`)
4. Screenshot แดชบอร์ด `MCC Monitor` ที่มีครบ 3 แถวตาม Layout
5. Screenshot Alert rule สถานะ Firing หรืออีเมลแจ้งเตือนที่ได้รับ
6. คลิปวิดีโอสั้น (ไม่เกิน 30 วินาที) แสดงการสั่ง LED จากฟอร์มบน Grafana
7. คำตอบแบบฝึกหัดท้ายใบงานครบทุกข้อ

#### Checklist ก่อนส่ง

- [ ] `DEVICE_ID` เป็นรูปแบบ `mcc-` ตามด้วยรหัสนักศึกษา 4 ตัวท้าย และตรงกับแถวใน `controls`
- [ ] ESP32-S3 ใช้ Publishable key (`sb_publishable_...`) เท่านั้น ไม่ใช่ Secret key (`sb_secret_...`) หรือ `service_role` key
- [ ] ทุกตาราง (`telemetry`, `controls`, `events`) เปิด RLS และมี policy ครบ
- [ ] panel แสดงผลใช้ data source `Supabase` (`grafana_ro`) และมีเฉพาะฟอร์มสั่งการที่ใช้ `Supabase-Control` (`grafana_ctl`)
- [ ] กดปุ่ม 1 ครั้งได้ 1 การสั่งเสมอ
- [ ] ฟอร์มสั่งการเปิด Confirmation Window
- [ ] แดชบอร์ดมีตัวแปร `device` และตั้ง Auto-refresh 10s
- [ ] Alert rule ทำงานและส่งอีเมลได้
- [ ] กรอกตารางบันทึกผลครบทุกขั้น
- [ ] ระบุชื่อ-นามสกุล และรหัสนักศึกษาในฟอร์ม

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="summary" markdown="1">

## 12.12 สรุปประจำบทที่ 12 (Summary)

1. **ระบบ IoT แบบครบวงจร** ประกอบด้วย 4 ชั้น ได้แก่ เซนเซอร์ ปุ่ม และเอาต์พุต (AHT25, LED) อุปกรณ์เครือข่าย (ESP32-S3 + HTTPS) ฐานข้อมูลคลาวด์ (Supabase/PostgreSQL) และแอปพลิเคชันแสดงผลและสั่งการ (Grafana) โดยแบ่งเป็นเส้นทาง **ติดตาม** (ส่วนที่ 1) และเส้นทาง **สั่งการ** (ส่วนที่ 2)
2. **AHT25** สื่อสารผ่าน I2C ที่ address `0x38` ให้ค่าดิบ 20 บิต ซึ่งแปลงเป็นหน่วยจริงได้ด้วย $RH = S_{RH}/2^{20} \times 100$ และ $T = S_T/2^{20} \times 200 - 50$ ความละเอียดของค่าไม่ใช่ความแม่นยำ
3. **ปุ่มกด** ต้องใช้ Pull-up และ Debounce และควรอ่านด้วย **Interrupt** เมื่อโปรแกรมมีงานที่บล็อกนาน เช่น การส่ง HTTPS ส่วน **เอาต์พุต** ต้องจำกัดกระแสด้วยตัวต้านทาน และใช้โมดูลรีเลย์เมื่อขับโหลดจริง
4. **Telemetry, Command State และ Event** เป็นข้อมูลต่างประเภทกัน จึงควรแยกตาราง และเลือก panel ให้ตรงกับประเภทข้อมูล
5. **Row Level Security และ Least Privilege** แยกสิทธิ์ของแต่ละผู้ใช้ (`anon` → `INSERT` telemetry และแก้ `controls` ในนาม `button`, `grafana_ro` → `SELECT`, `grafana_ctl` → แก้ `controls` ในนาม `dashboard`) ข้อมูลจึงยังปลอดภัยแม้ key ตัวใดตัวหนึ่งรั่ว
6. **Grafana** ดึงข้อมูลด้วย SQL และ Macro (`$__timeFilter`, `$__timeGroupAlias`, `$__interval`) พร้อมทำ Downsampling ให้พอดีกับความกว้างของกราฟ
7. **การสั่งการผ่านคลาวด์** ใช้ฐานข้อมูลเป็นจุดพัก **Desired State** ที่ ESP32 poll เป็นรอบ ซึ่ง Idempotent และทนต่อการรีบูต แลกกับความหน่วงประมาณ $T_{poll}/2 + t_{HTTPS}$ และห้ามใช้แทนระบบหยุดฉุกเฉิน
8. **Trigger** ของ PostgreSQL บันทึกประวัติการสั่งพร้อมผู้สั่งได้โดยอัตโนมัติ ทำให้มีแหล่งความจริงเดียว และผู้สั่งไม่ต้องมีสิทธิ์เขียนประวัติเอง
9. **แดชบอร์ดที่ดี** ต้องเข้าใจได้ใน 3 วินาที วางภาพรวมไว้บน ใช้สีเพื่อบอกสถานะเท่านั้น ติดหน่วยทุก panel และส่วนสั่งการต้องยืนยันก่อนส่งและแสดงผลของคำสั่งให้เห็น

### ตารางอ้างอิงด่วน

| หัวข้อ | ค่า / คำสั่ง |
|:---|:---|
| I2C ของ AHT25 | address `0x38`, SDA = GPIO 8, SCL = GPIO 9 |
| ปุ่ม / LED | ปุ่ม GPIO 4/5/6 (`INPUT_PULLUP`) · LED GPIO 10/11/12 ผ่าน 220 Ω |
| ส่งค่าเซนเซอร์ | `POST https://<ref>.supabase.co/rest/v1/telemetry` → `201` |
| ถามคำสั่ง | `GET .../rest/v1/controls?device_id=eq.<id>&select=light,pump,fan` → `200` |
| แจ้งการกดปุ่ม | `PATCH .../rest/v1/controls?device_id=eq.<id>` body `{"fan":true,"updated_by":"button"}` → `204` |
| Pooler สำหรับ Grafana | `aws-[INDEX]-[REGION].pooler.supabase.com:5432` (คัดลอกจาก Connect → Session pooler), user `grafana_ro.<ref>` / `grafana_ctl.<ref>`, SSL `require` |
| กรองช่วงเวลา | `$__timeFilter(created_at)` |
| Downsampling | `$__timeGroupAlias(created_at, $__interval)` + `avg()` + `GROUP BY 1` |
| Update ของ Business Forms | `UPDATE controls SET fan = ${payload.fan}, updated_by = 'dashboard' WHERE device_id = '$device'` |
| เริ่มต้นวันตามเวลาไทย | `date_trunc('day', now() AT TIME ZONE 'Asia/Bangkok') AT TIME ZONE 'Asia/Bangkok'` |

> ℹ️ **แผนฟรี:** Supabase Free Plan และ Grafana Cloud Free Tier มีโควตาจำกัด เช่น พื้นที่ฐานข้อมูล ปริมาณข้อมูลขาออก (Egress) จำนวนผู้ใช้ และการ pause โปรเจกต์ที่ไม่มีการใช้งาน เงื่อนไขเหล่านี้อาจเปลี่ยนได้ ควรตรวจสอบหน้าราคาของผู้ให้บริการก่อนเริ่มภาคการศึกษา

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 12.13 แบบฝึกหัดท้ายบทที่ 12 (Exercises)

**ข้อ 1:** AHT25 ส่งค่าดิบของความชื้น $S_{RH} = 629{,}146$ และอุณหภูมิ $S_T = 419{,}430$ จงคำนวณความชื้นสัมพัทธ์ (%RH) และอุณหภูมิ (°C) พร้อมอธิบายว่าทำไมจึงควรรายงานผลเพียงทศนิยม 1 ตำแหน่ง

**ข้อ 2:** อธิบายว่าถ้าเปลี่ยนการอ่านปุ่มจาก Interrupt เป็น Polling ใน `loop()` จะเกิดปัญหาอะไรกับระบบในส่วนที่ 2 และปัญหานั้นเกี่ยวข้องกับการส่ง HTTPS อย่างไร

**ข้อ 3:** ถ้าเปลี่ยนให้ Grafana ทุก panel เชื่อมต่อด้วย user `postgres` แทน `grafana_ro` และ `grafana_ctl` ระบบยังทำงานได้ แต่ความเสี่ยงเพิ่มขึ้นอย่างไร? ยกตัวอย่างเหตุการณ์ที่อาจเกิดขึ้นในโรงงาน

**ข้อ 4:** ถ้าเลือกช่วงเวลา Last 30 days บนกราฟกว้าง 1,200 พิกเซล จะมีข้อมูลดิบในตาราง `telemetry` กี่แถว และ `$__interval` ควรมีค่าประมาณเท่าใด? แสดงวิธีคำนวณ

**ข้อ 5:** ความชื้นในตู้ควบคุมจะเสี่ยงเกิดหยดน้ำเมื่ออุณหภูมิลดลงถึงจุดน้ำค้าง (Dew Point) จงเขียนคำสั่ง SQL สำหรับ Grafana ที่คำนวณ Dew Point จากคอลัมน์ `temp` และ `hum` ด้วยสมการ Magnus โดยประมาณ $T_d = \frac{b\,\gamma}{a - \gamma}$ เมื่อ $\gamma = \ln(RH/100) + \frac{a\,T}{b + T}$, $a = 17.62$, $b = 243.12\ ^\circ C$

**ข้อ 6 (ความหน่วงของ Polling):** ถ้าลด `POLL_INTERVAL` จาก 2 วินาทีเป็น 0.5 วินาที และคำขอ HTTPS แต่ละครั้งใช้เวลา 0.8 วินาที
- (ก) ความหน่วงเฉลี่ยตั้งแต่กดส่งคำสั่งจนถึง LED ติดเปลี่ยนจากเดิมเท่าใด
- (ข) จำนวนคำขอ `GET` ต่อวันเพิ่มขึ้นกี่เท่า
- (ค) ทำไม ESP32 จึงอาจ poll ได้ไม่ถี่ถึง 0.5 วินาทีจริง (พิจารณาเวลาของ HTTPS) และควรเปลี่ยนไปใช้วิธีใดแทน

**ข้อ 7 (Fail-safe):** เมื่อ Wi-Fi ขาดหายนานเกิน 1 นาที ESP32 ควรทำอย่างไรกับไฟ ปั๊ม และพัดลม แต่ละตัว (คงสถานะเดิม หรือปิดเอง)? ให้เหตุผลทางวิศวกรรมของแต่ละอุปกรณ์ แล้วเสนอการแก้โค้ดใน `loop()`

**ข้อ 8 (ออกแบบ):** โรงงานมีตู้ควบคุม 20 ตู้ แต่ละตู้มี ESP32-S3 หนึ่งตัว จงออกแบบ
- (ก) ค่า `device_id` ที่สื่อความหมาย
- (ข) Layout แดชบอร์ดภาพรวมที่ให้หัวหน้าช่างเห็นได้ทันทีว่าตู้ใดผิดปกติ
- (ค) คำนวณพื้นที่ฐานข้อมูลที่ใช้ต่อเดือน แล้วเสนอแนวทางลดขนาดข้อมูลเก่า
- (ง) แนวทางป้องกันไม่ให้ ESP32 ของตู้หนึ่งสั่งอุปกรณ์ของตู้อื่นได้ ทั้งที่ทุกตัวใช้ Publishable key เดียวกัน (ใบ้: ให้แต่ละอุปกรณ์ login ด้วยบัญชีของตนเอง แล้วเขียน RLS policy ที่เทียบ `device_id` กับตัวตนของผู้ login)

</div>
