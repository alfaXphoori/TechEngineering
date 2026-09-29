---
layout: default
title: "บทที่ 12: ระบบ IoT สู่ฐานข้อมูลคลาวด์และแดชบอร์ด"
permalink: /chapters/ch12-hmi-visualization/
---

# Chapter 12: ระบบ IoT สู่ฐานข้อมูลคลาวด์และแดชบอร์ด

## Cloud Database, Web Dashboard & Remote Control (ESP32-S3, AHT25, Supabase/PostgreSQL, Vercel)

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
>   - **LLO14.2:** ใช้เว็บแดชบอร์ดบน Vercel แสดงผล แจ้งเตือน และสั่งการอุปกรณ์กลับไปยัง ESP32 ตามหลักการออกแบบแดชบอร์ดที่ดีได้ (CLO3, CLO4)
>
> **ฮาร์ดแวร์:** ESP32-S3 DevKit · เซนเซอร์อุณหภูมิ/ความชื้น AHT25 · ปุ่มกด 3 ปุ่ม · LED 3 ดวง + ตัวต้านทาน 220 Ω  
> **ซอฟต์แวร์ (ฟรีทั้งหมด):** Arduino IDE (ESP32 core) · Supabase Free Plan · เว็บแดชบอร์ด Next.js บน Vercel (ลิงก์จากผู้สอน นักศึกษาไม่ต้องสมัคร Vercel)

---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 12.1 ภาพรวมระบบ: ตู้ควบคุมมอเตอร์ปั๊ม

ในโรงงาน มอเตอร์ปั๊มถูกควบคุมจาก **ตู้ควบคุมมอเตอร์ (Motor Control Cabinet)** ซึ่งภายในมีอินเวอร์เตอร์ คอนแทคเตอร์ และรีเลย์ ถ้าอุณหภูมิในตู้สูงเกินไป อุปกรณ์อิเล็กทรอนิกส์จะเสื่อมเร็วขึ้น และถ้าความชื้นสูงจนเกิดหยดน้ำเกาะ (Condensation) ก็อาจทำให้ไฟฟ้าลัดวงจรได้ ช่างซ่อมบำรุงจึงต้องการระบบที่
1. **ติดตามอุณหภูมิและความชื้นในตู้** ตลอด 24 ชั่วโมง ดูแนวโน้มย้อนหลังได้ และ **แจ้งเตือนอัตโนมัติ** เมื่ออุณหภูมิเกินเกณฑ์
2. **สั่งเปิด/ปิดอุปกรณ์จากระยะไกล** ได้แก่ ไฟส่องสว่างในตู้ (`light`) ปั๊ม (`pump`) และพัดลมระบายอากาศ (`fan`) ผ่านแดชบอร์ด โดยยังมีปุ่มหน้าตู้ให้ช่างสั่งเองได้ และทุกการสั่งจะถูกบันทึกไว้เทียบกับข้อมูลเซนเซอร์ เช่น เปิดพัดลมแล้วอุณหภูมิในตู้ลดลงเท่าใด

ข้อกำหนดทั้งสองข้อมีทิศทางของข้อมูลตรงข้ามกัน บทนี้จึงแบ่งการสร้างระบบเป็น **2 ส่วน**

| ส่วน | ทิศทางข้อมูล | สิ่งที่สร้าง |
|:---|:---|:---|
| **ส่วนที่ 1: ติดตาม (Monitoring)** | เซนเซอร์ → ESP32-S3 → Supabase → แดชบอร์ดบน Vercel | ส่งค่า AHT25 ขึ้น Supabase แล้วแสดงผลและแจ้งเตือนบนเว็บแดชบอร์ด |
| **ส่วนที่ 2: สั่งการ (Control)** | แดชบอร์ดบน Vercel → Supabase → ESP32-S3 → อุปกรณ์ | สั่ง LED แทนไฟ ปั๊ม และพัดลม จากปุ่มบนแดชบอร์ด (ใช้บนมือถือได้) และจากปุ่มหน้าตู้ |

ทั้งหมดสร้างด้วยเครื่องมือฟรี ตามสถาปัตยกรรมด้านล่าง

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 900 425" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif" role="img" aria-label="ส่วนที่ 1: ESP32-S3 ส่งค่า AHT25 ผ่าน HTTPS POST ไปยัง REST API ของ Supabase ลงตาราง telemetry เบราว์เซอร์ของช่างโหลดหน้าแดชบอร์ดจาก Vercel แล้ว login กับ Supabase Auth และอ่านข้อมูลจาก REST API โดยตรง ส่วนที่ 2: ช่างกดสวิตช์บนแดชบอร์ดซึ่งแก้ตาราง controls ESP32-S3 อ่านตาราง controls ทุก 2 วินาทีแล้วขับ LED ส่วนปุ่มหน้าตู้แก้ตาราง controls ด้วย PATCH และ trigger บันทึกทุกการเปลี่ยนแปลงลงตาราง events">
  <title>สถาปัตยกรรมระบบ: ESP32-S3 → Supabase → เว็บแดชบอร์ดบน Vercel และเส้นทางสั่งการกลับ</title>
  <style>
    .c12-bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; }
    .c12-box { fill: #ffffff; stroke: #475569; stroke-width: 2; }
    .c12-esp { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2.5; }
    .c12-db { fill: #ecfdf5; stroke: #059669; stroke-width: 2.5; }
    .c12-tb { fill: #ffffff; stroke: #059669; stroke-width: 1.5; }
    .c12-tk { fill: #ffffff; stroke: #db2777; stroke-width: 2; }
    .c12-vc { fill: #f1f5f9; stroke: #0f172a; stroke-width: 2.5; }
    .c12-web { fill: #fff7ed; stroke: #ea580c; stroke-width: 2.5; }
    .c12-cloud { fill: #f0fdf4; stroke: #059669; stroke-width: 1.5; stroke-dasharray: 6 5; }
    .c12-w { fill: none; stroke: #059669; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: c12-flow 1.6s linear infinite; }
    .c12-r { fill: none; stroke: #2f5597; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: c12-flow 1.6s linear infinite; }
    .c12-k { fill: none; stroke: #db2777; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: c12-flow 1.6s linear infinite; }
    .c12-g { fill: none; stroke: #64748b; stroke-width: 3; stroke-dasharray: 6 8; stroke-linecap: round; animation: c12-flow 1.6s linear infinite; }
    .c12-t { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .c12-l { font-size: 12px; fill: #64748b; font-weight: 500; }
    .c12-c { font-size: 11px; font-family: monospace; font-weight: 700; fill: #475569; }
    .c12-cw { font-size: 11px; font-family: monospace; font-weight: 700; fill: #059669; }
    .c12-cr { font-size: 11px; font-family: monospace; font-weight: 700; fill: #2f5597; }
    .c12-ck { font-size: 11px; font-family: monospace; font-weight: 700; fill: #db2777; }
    @keyframes c12-flow { to { stroke-dashoffset: -36; } }
    @media (prefers-reduced-motion: reduce) { .c12-w, .c12-r, .c12-k, .c12-g { animation: none; } }
  </style>
  <rect x="5" y="5" width="890" height="415" rx="10" class="c12-bg"/>
  <!-- Supabase container -->
  <rect x="230" y="30" width="330" height="345" rx="12" class="c12-cloud"/>
  <text x="246" y="52" class="c12-cw">SUPABASE</text>
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
  <text x="100" y="292" text-anchor="middle" class="c12-c">role: anon</text>
  <!-- ESP32 ↔ REST -->
  <path d="M 180 95 L 246 95" class="c12-w"/>
  <polygon points="246,90 256,95 246,100" fill="#059669"/>
  <text x="218" y="85" text-anchor="middle" class="c12-cw">POST</text>
  <text x="218" y="114" text-anchor="middle" class="c12-c">HTTPS</text>
  <path d="M 256 140 L 190 140" class="c12-k"/>
  <polygon points="190,135 180,140 190,145" fill="#db2777"/>
  <text x="218" y="132" text-anchor="middle" class="c12-ck">GET 2s</text>
  <path d="M 180 160 L 246 160" class="c12-k"/>
  <polygon points="246,155 256,160 246,165" fill="#db2777"/>
  <text x="218" y="178" text-anchor="middle" class="c12-ck">PATCH</text>
  <rect x="256" y="70" width="170" height="100" rx="8" class="c12-box"/>
  <text x="341" y="102" text-anchor="middle" class="c12-t">REST API</text>
  <text x="341" y="124" text-anchor="middle" class="c12-c">Publishable key</text>
  <text x="341" y="142" text-anchor="middle" class="c12-c">+ RLS</text>
  <rect x="440" y="70" width="104" height="100" rx="8" class="c12-box"/>
  <text x="492" y="102" text-anchor="middle" class="c12-t">Auth</text>
  <text x="492" y="124" text-anchor="middle" class="c12-c">email+pass</text>
  <text x="492" y="142" text-anchor="middle" class="c12-c">→ JWT</text>
  <!-- PostgreSQL -->
  <rect x="256" y="215" width="288" height="145" rx="8" class="c12-db"/>
  <text x="484" y="233" text-anchor="middle" class="c12-c">PostgreSQL + RLS</text>
  <rect x="264" y="245" width="86" height="55" rx="6" class="c12-tb"/>
  <text x="307" y="268" text-anchor="middle" class="c12-t">telemetry</text>
  <text x="307" y="288" text-anchor="middle" class="c12-l">ทุก 5 วินาที</text>
  <rect x="357" y="245" width="86" height="55" rx="6" class="c12-tk"/>
  <text x="400" y="268" text-anchor="middle" class="c12-t">controls</text>
  <text x="400" y="288" text-anchor="middle" class="c12-l">สถานะที่สั่ง</text>
  <rect x="450" y="245" width="86" height="55" rx="6" class="c12-tb"/>
  <text x="493" y="268" text-anchor="middle" class="c12-t">events</text>
  <text x="493" y="288" text-anchor="middle" class="c12-l">ประวัติการสั่ง</text>
  <!-- trigger: controls → events -->
  <path d="M 414 300 L 414 324 L 486 324 L 486 310" fill="none" stroke="#db2777" stroke-width="2"/>
  <polygon points="481,310 486,301 491,310" fill="#db2777"/>
  <text x="450" y="344" text-anchor="middle" class="c12-ck">trigger</text>
  <!-- REST ↔ DB -->
  <path d="M 290 170 L 290 237" class="c12-w"/>
  <polygon points="285,237 290,245 295,237" fill="#059669"/>
  <text x="285" y="200" text-anchor="end" class="c12-cw">INSERT</text>
  <path d="M 330 245 L 330 178" class="c12-r"/>
  <polygon points="325,178 330,170 335,178" fill="#2f5597"/>
  <text x="336" y="200" class="c12-cr">SELECT</text>
  <path d="M 400 170 L 400 237" class="c12-k"/>
  <polygon points="395,178 400,170 405,178" fill="#db2777"/>
  <polygon points="395,237 400,245 405,237" fill="#db2777"/>
  <!-- Vercel -->
  <rect x="610" y="40" width="150" height="80" rx="8" class="c12-vc"/>
  <text x="685" y="70" text-anchor="middle" class="c12-t">▲ Vercel</text>
  <text x="685" y="92" text-anchor="middle" class="c12-c">Next.js</text>
  <text x="685" y="108" text-anchor="middle" class="c12-l">ไฟล์หน้าเว็บ</text>
  <path d="M 685 120 L 685 160" class="c12-g"/>
  <polygon points="680,160 685,170 690,160" fill="#64748b"/>
  <text x="693" y="148" class="c12-c">HTML/JS</text>
  <!-- Browser dashboard -->
  <rect x="610" y="170" width="275" height="190" rx="8" class="c12-web"/>
  <text x="747" y="192" text-anchor="middle" class="c12-t">แดชบอร์ดบนเบราว์เซอร์</text>
  <rect x="624" y="202" width="247" height="16" rx="4" fill="#fee2e2"/>
  <text x="747" y="214" text-anchor="middle" class="c12-c" style="fill:#991b1b">temp &gt; 35 °C</text>
  <path d="M 632 262 A 22 22 0 0 1 676 262" fill="none" stroke="#e2e8f0" stroke-width="7"/>
  <path d="M 632 262 A 22 22 0 0 1 668 247" fill="none" stroke="#dc2626" stroke-width="7"/>
  <path d="M 690 262 A 22 22 0 0 1 734 262" fill="none" stroke="#e2e8f0" stroke-width="7"/>
  <path d="M 690 262 A 22 22 0 0 1 718 241" fill="none" stroke="#16a34a" stroke-width="7"/>
  <polyline points="748,264 766,252 784,256 802,238 820,244 842,228 862,236" fill="none" stroke="#ea580c" stroke-width="2.5"/>
  <line x1="802" y1="228" x2="802" y2="268" stroke="#db2777" stroke-width="1.5" stroke-dasharray="3 3"/>
  <rect x="628" y="288" width="72" height="30" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="664" y="308" text-anchor="middle" class="c12-c">light</text>
  <rect x="711" y="288" width="72" height="30" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <text x="747" y="308" text-anchor="middle" class="c12-c">pump</text>
  <rect x="794" y="288" width="72" height="30" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="830" y="308" text-anchor="middle" class="c12-c">fan</text>
  <text x="747" y="344" text-anchor="middle" class="c12-c">role: authenticated</text>
  <!-- Browser ↔ Supabase -->
  <path d="M 610 250 L 574 250 L 574 150 L 552 150" class="c12-g"/>
  <polygon points="552,145 544,150 552,155" fill="#64748b"/>
  <text x="590" y="140" text-anchor="middle" class="c12-c">login</text>
  <path d="M 420 170 L 420 185 L 602 185" class="c12-r"/>
  <polygon points="602,180 610,185 602,190" fill="#2f5597"/>
  <text x="500" y="180" text-anchor="middle" class="c12-cr">GET ทุก 5s</text>
  <path d="M 610 205 L 412 205 L 412 178" class="c12-k"/>
  <polygon points="407,178 412,170 417,178" fill="#db2777"/>
  <text x="515" y="200" text-anchor="middle" class="c12-ck">PATCH</text>
  <!-- legend -->
  <line x1="30" y1="400" x2="62" y2="400" stroke="#059669" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="70" y="404" class="c12-l">เขียน (ส่วนที่ 1)</text>
  <line x1="215" y1="400" x2="247" y2="400" stroke="#2f5597" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="255" y="404" class="c12-l">อ่าน (ส่วนที่ 1)</text>
  <line x1="390" y1="400" x2="422" y2="400" stroke="#db2777" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="430" y="404" class="c12-l">สั่งการ (ส่วนที่ 2)</text>
  <line x1="590" y1="400" x2="622" y2="400" stroke="#64748b" stroke-width="3" stroke-dasharray="6 8"/>
  <text x="630" y="404" class="c12-l">โหลดหน้าเว็บ / login</text>
</svg>
</div>

ระบบแบ่งเป็น 4 ชั้นตามสถาปัตยกรรม IoT ที่เรียนในบทที่ 1

| ชั้น (Layer) | องค์ประกอบในบทนี้ | หน้าที่ |
|:---|:---|:---|
| Perception | AHT25, ปุ่มกด 3 ปุ่ม, LED 3 ดวง | วัดอุณหภูมิ/ความชื้น รับคำสั่งจากช่างหน้าตู้ และขับอุปกรณ์ปลายทาง |
| Network | ESP32-S3 + Wi-Fi + HTTPS | ส่งข้อมูลขึ้นคลาวด์ และรับคำสั่งลงมาอย่างเข้ารหัส |
| Middleware / Storage | Supabase (REST API + PostgreSQL) | ตรวจสิทธิ์ จัดเก็บ ให้บริการ query และเป็นจุดพักคำสั่ง |
| Application | เว็บแดชบอร์ด Next.js บน Vercel + Supabase Auth | แสดงผล แจ้งเตือน และรับคำสั่งจากช่างผ่านเบราว์เซอร์หรือมือถือ |

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
- **`state` และ `source` ใน `events`** เก็บทั้งสถานะหลังเปลี่ยน และแหล่งที่สั่ง (`button` = ปุ่มหน้าตู้, `dashboard` = เว็บแดชบอร์ด) การรู้แค่ว่า "มีการสั่ง" ไม่พอ ต้องรู้ว่าเปิดหรือปิด จึงจะวาดช่วงเวลาที่อุปกรณ์ทำงานได้ และต้องรู้ว่าใครสั่ง จึงจะตรวจสอบย้อนหลังได้ (Audit trail)
- **Index `(device_id, created_at desc)`** แดชบอร์ดเกือบทุก query จะถามว่า "อุปกรณ์ X ในช่วงเวลา Y" B-tree index ที่เรียงตามคอลัมน์ทั้งสองจะช่วยให้ PostgreSQL กระโดดไปยังช่วงข้อมูลนั้นได้ทันที ไม่ต้องอ่านทั้งตาราง (Sequential Scan)

**ประเมินปริมาณข้อมูล:** ถ้าส่งทุก 5 วินาที จะได้ $86{,}400 / 5 = 17{,}280$ แถวต่อวัน ถ้าแต่ละแถวรวม index ใช้พื้นที่ราว 100 ไบต์ จะใช้พื้นที่ประมาณ 1.7 MB ต่อวัน หรือราว 50 MB ต่อเดือนต่ออุปกรณ์ ตัวเลขนี้ใช้เทียบกับพื้นที่ฐานข้อมูลของแผนฟรี เพื่อตัดสินใจเรื่องความถี่ในการส่งและการลบข้อมูลเก่า ส่วน `controls` มีขนาดคงที่ และ `events` เพิ่มเฉพาะเมื่อมีการสั่ง จึงเล็กมากเมื่อเทียบกับ `telemetry`

### 12.3.3 Row Level Security และหลัก Least Privilege

ระบบมีผู้ใช้ฐานข้อมูล 2 กลุ่ม และให้แต่ละกลุ่มมีสิทธิ์เท่าที่จำเป็นต่อหน้าที่เท่านั้น (**Principle of Least Privilege**)

| ผู้ใช้ | role ใน PostgreSQL | วิธียืนยันตัวตน | `telemetry` | `controls` | `events` |
|:---|:---|:---|:---|:---|:---|
| ESP32-S3 | `anon` | Publishable key อย่างเดียว (ไม่ login) | `INSERT` | `SELECT` + `UPDATE` ได้เฉพาะเมื่อ `updated_by = 'button'` | ไม่มีสิทธิ์ (trigger เป็นผู้เขียน) |
| ช่างที่ใช้แดชบอร์ด | `authenticated` | Publishable key + login ด้วยอีเมลและรหัสผ่าน (Supabase Auth) | `SELECT` | `SELECT` + `UPDATE` ได้เฉพาะเมื่อ `updated_by = 'dashboard'` | `SELECT` |

ทั้ง ESP32 และหน้าเว็บใช้ **Publishable key ตัวเดียวกัน** สิ่งที่ทำให้สิทธิ์ต่างกันคือ **การ login** คำขอที่ไม่มี login จะได้ role `anon` ส่วนคำขอที่แนบ token จากการ login จะได้ role `authenticated` (รายละเอียดในหัวข้อ 12.5.2)

**Row Level Security (RLS)** เป็นกฎที่ PostgreSQL ตรวจทุกครั้งที่มีการอ่านหรือเขียนแถว ถ้าเปิด RLS แล้วไม่มี policy อนุญาต คำขอนั้นจะถูกปฏิเสธทั้งหมด (**Deny by Default**) ผลของการออกแบบนี้คือ
- ถ้า key ใน ESP32 ถูกดึงออกจากเฟิร์มแวร์ ผู้ไม่หวังดีก็ **อ่าน** ข้อมูลเซนเซอร์ย้อนหลังของโรงงานไม่ได้ เพราะไม่มีบัญชี login และ **ลบหรือปลอมประวัติ** ใน `events` ไม่ได้ (แต่ยังสั่งอุปกรณ์ผ่าน `controls` ได้ ซึ่งเป็นข้อจำกัดของการใช้ key เดียวร่วมกันทุกอุปกรณ์ ดูแบบฝึกหัดท้ายบท)
- ถ้ารหัสผ่านของบัญชีแดชบอร์ดรั่ว ผู้ไม่หวังดีก็ **ลบ** ข้อมูล หรือ **ปลอม** ค่าเซนเซอร์ไม่ได้ เพราะ `authenticated` ไม่มีสิทธิ์ `INSERT`/`DELETE`
- policy ยังทำหน้าที่ **ตรวจความสมเหตุสมผลของข้อมูล** ได้ด้วย เช่น ปฏิเสธค่าอุณหภูมิที่อยู่นอกย่านวัดของ AHT25 (-40 ถึง 120 °C) ซึ่งมักเกิดจากเซนเซอร์เสีย และบังคับให้ผู้สั่งระบุ `updated_by` ตามตัวตนจริง (ESP32 อ้างเป็น `dashboard` ไม่ได้ และแดชบอร์ดอ้างเป็น `button` ไม่ได้)

> ⚠️ role `authenticated` หมายถึง **ทุกคนที่ login ได้** จึงต้อง **ปิดการสมัครสมาชิกเอง (Sign up)** ใน Supabase Auth และให้ผู้ดูแลเป็นผู้สร้างบัญชีให้ช่างเท่านั้น (หัวข้อ 12.8.4) มิฉะนั้นใครที่มี Publishable key ก็สมัครบัญชีเองแล้วอ่านข้อมูลได้

**API key ของ Supabase มี 4 แบบ** (ตาม [Supabase Docs: API keys](https://supabase.com/docs/guides/getting-started/api-keys))

| Key | รูปแบบ | Role ที่ได้ | RLS | ใช้ในอุปกรณ์/หน้าเว็บได้? |
|:---|:---|:---|:---|:---|
| **Publishable key** ✅ | `sb_publishable_...` | `anon` (ถ้า login แล้วเป็น `authenticated`) | ถูกตรวจ | **ได้** ← ใช้ใน ESP32-S3 และแดชบอร์ด |
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

## 12.5 เส้นทางอ่าน: เว็บแดชบอร์ดบน Vercel

แดชบอร์ดในบทนี้เป็น **เว็บแอปพลิเคชัน** ที่เขียนด้วย **Next.js** (เฟรมเวิร์กของ React) และใช้ไลบรารี **`supabase-js`** คุยกับ Supabase โค้ดแม่แบบอยู่ใน repo ของรายวิชา โฟลเดอร์ [`dashboard/`](https://github.com/alfaXphoori/TechEngineering/tree/main/dashboard) นักศึกษาไม่ต้องเขียนเว็บเอง แต่ต้องเข้าใจว่าข้อมูลเดินทางอย่างไร และอ่านโค้ดส่วนสำคัญได้

### 12.5.1 Vercel ทำหน้าที่อะไร

**Vercel** เป็นบริการฝากเว็บ (Web Hosting) ที่นำโค้ด Next.js ไป build และให้บริการไฟล์หน้าเว็บผ่าน URL เช่น `https://mcc-dashboard.vercel.app` สิ่งที่มักเข้าใจผิดคือ **Vercel ไม่ได้ดึงข้อมูลจากฐานข้อมูลแทนเรา**

| ขั้น | เกิดที่ใด | สิ่งที่เกิดขึ้น |
|:---|:---|:---|
| 1 | เบราว์เซอร์ → Vercel | เปิด URL ของแดชบอร์ด Vercel ส่งไฟล์ HTML, CSS และ JavaScript มาให้ **ครั้งเดียว** |
| 2 | เบราว์เซอร์ → Supabase Auth | ช่าง login ด้วยอีเมลและรหัสผ่าน ได้ token กลับมา |
| 3 | เบราว์เซอร์ → Supabase REST API | JavaScript ในหน้าเว็บขอข้อมูล `telemetry`, `controls`, `events` **โดยตรง** ทุก 5 วินาที |
| 4 | เบราว์เซอร์ → Supabase REST API | เมื่อกดสวิตช์ JavaScript ส่งคำขอแก้ `controls` (ส่วนที่ 2) |

ผลของสถาปัตยกรรมนี้คือ
- Vercel **ไม่ต้องรู้รหัสผ่านฐานข้อมูล** และไม่ต้องเชื่อมต่อ PostgreSQL โดยตรง เพราะทั้ง ESP32 และหน้าเว็บใช้ **REST API ตัวเดียวกัน** (หัวข้อ 12.4) ผ่าน HTTPS
- ความปลอดภัยทั้งหมดขึ้นกับ **RLS + การ login** (หัวข้อ 12.3.3) ไม่ได้ขึ้นกับการซ่อนโค้ด เพราะใครก็เปิดดูโค้ด JavaScript ของหน้าเว็บได้
- หน้าเว็บ 1 ชุดใช้กับหลายโปรเจกต์ได้ ผู้ใช้กรอก Project URL, Publishable key และ `DEVICE_ID` ของตนเองในหน้า **ตั้งค่า** ค่าจะถูกเก็บไว้ในเบราว์เซอร์ของผู้ใช้คนนั้นเท่านั้น (หรือผู้ Deploy จะกำหนดเป็น Environment Variables ไว้ล่วงหน้าก็ได้)

### 12.5.2 Login และ role `authenticated`

1. หน้าเว็บส่งอีเมลและรหัสผ่านไปที่ Supabase Auth ด้วย `supabase.auth.signInWithPassword()`
2. ถ้าถูกต้อง Supabase Auth ตอบ **access token** ซึ่งเป็น **JWT (JSON Web Token)** ที่มีข้อมูล `"role": "authenticated"` และลายเซ็นดิจิทัลของ Supabase (ปลอมไม่ได้) พร้อมอายุการใช้งาน (ค่าเริ่มต้น 1 ชั่วโมง `supabase-js` ต่ออายุให้อัตโนมัติ)
3. ทุกคำขอหลังจากนั้น `supabase-js` แนบ header `apikey: <Publishable key>` และ `Authorization: Bearer <JWT>`
4. PostgREST ตรวจลายเซ็นของ JWT แล้วรัน SQL ด้วย role `authenticated` RLS policy ที่เขียน `to authenticated` จึงมีผล

เปรียบเทียบกับ ESP32 ที่ส่งเฉพาะ `apikey` โดยไม่มี JWT จึงได้ role `anon` เสมอ

### 12.5.3 จาก `supabase-js` เป็น REST และ SQL

`supabase-js` เป็นเพียงตัวช่วยสร้างคำขอ REST แบบเดียวกับที่ ESP32 เขียนเองด้วย `HTTPClient` เช่น คำสั่งอ่านค่าล่าสุดในแดชบอร์ด

```js
supabase.from('telemetry')
  .select('created_at, temp, hum')
  .eq('device_id', 'mcc01')
  .order('created_at', { ascending: false })
  .limit(1)
```

| โค้ด `supabase-js` | คำขอ REST ที่ส่งจริง | SQL ที่ PostgREST สร้าง |
|:---|:---|:---|
| `.from('telemetry').select('created_at, temp, hum')` | `GET /rest/v1/telemetry?select=created_at,temp,hum` | `SELECT created_at, temp, hum FROM telemetry` |
| `.eq('device_id', 'mcc01')` | `&device_id=eq.mcc01` | `WHERE device_id = 'mcc01'` |
| `.gte('created_at', since)` | `&created_at=gte.2026-09-28T03:00:00Z` | `AND created_at >= '2026-09-28T03:00:00Z'` |
| `.order('created_at', { ascending: false })` | `&order=created_at.desc` | `ORDER BY created_at DESC` |
| `.limit(1)` | `&limit=1` | `LIMIT 1` |
| `.update({ fan: true, updated_by: 'dashboard' }).eq('device_id', 'mcc01')` | `PATCH /rest/v1/controls?device_id=eq.mcc01` | `UPDATE controls SET fan = true, updated_by = 'dashboard' WHERE device_id = 'mcc01'` |

Index `(device_id, created_at desc)` ในหัวข้อ 12.3.2 ทำให้คำขอเหล่านี้ตอบได้เร็ว แม้ตารางจะมีหลายแสนแถว

### 12.5.4 ปริมาณข้อมูลของกราฟและ Downsampling

กราฟในแดชบอร์ดเลือกดูได้ 15 นาที, 30 นาที และ 1 ชั่วโมง ข้อมูล 1 ชั่วโมงมี $3{,}600 / 5 = 720$ แถว ซึ่งต่ำกว่าเพดาน **Max rows = 1,000 แถวต่อคำขอ** ที่ Supabase ตั้งไว้เป็นค่าเริ่มต้น (ปรับได้ที่ **Integrations → Data API → Settings**)

ถ้าต้องการดูย้อนหลัง 7 วัน จะมีข้อมูล $17{,}280 \times 7 \approx 121{,}000$ จุด แต่กราฟกว้างราว 1,000 พิกเซลแสดงได้ไม่เกินราว 1,000 จุด การดึงข้อมูลดิบทั้งหมดมาวาดจึงช้าและเปลือง ต้องให้ฐานข้อมูลรวมข้อมูลเป็นช่วงก่อนส่ง เรียกว่า **Downsampling** ขนาดช่วงที่เหมาะสมคำนวณได้จาก

$$\Delta t \approx \frac{\text{ช่วงเวลาที่ดู}}{\text{ความกว้างของกราฟ}} = \frac{7 \times 86{,}400\ s}{1{,}000\ px} \approx 605\ s \approx 10\ \text{นาที}$$

แล้วใช้ `avg()` ร่วมกับ `GROUP BY` ช่วงเวลา 10 นาที ให้ข้อมูลราว 120 จุดเหลือจุดเดียว เทคนิคเดียวกับ `GROUP BY time()` ของ InfluxDB ในบทที่ 10 ใน Supabase ทำได้โดยสร้าง **SQL function** แล้วเรียกผ่าน `supabase.rpc()` (โจทย์ท้าทายท้ายบท)

### 12.5.5 การ refresh ของแดชบอร์ด: Polling หรือ Realtime

แดชบอร์ดดึงข้อมูลใหม่ทุก 5 วินาที (`REFRESH_MS` ใน `lib/config.js`) เท่ากับรอบส่งของ ESP32 ด้วยวิธี **Polling** แบบเดียวกับที่ ESP32 ถามคำสั่ง (หัวข้อ 12.6.3) ทุกเบราว์เซอร์ที่เปิดแดชบอร์ดอยู่จะส่ง 5 คำขอทุก 5 วินาที ถ้าเปิดทิ้งไว้ 10 เครื่อง ก็คือ 10 คำขอต่อวินาที

อีกทางเลือกคือ **Supabase Realtime** ซึ่งให้ฐานข้อมูลส่งแถวใหม่มายังเบราว์เซอร์ทันทีผ่าน WebSocket ไม่ต้องถามซ้ำ ตอบสนองเร็วกว่าและประหยัดคำขอ แต่ต้องเปิด Realtime ให้ตาราง และต้องจัดการการเชื่อมต่อที่หลุด บทนี้ใช้ Polling เพราะเข้าใจง่ายและเพียงพอกับข้อมูลที่เปลี่ยนทุก 5 วินาที

---

## 12.6 เส้นทางสั่งการ: Desired State และ Polling

### 12.6.1 ทำไมแดชบอร์ดสั่ง ESP32 ตรง ๆ ไม่ได้

ESP32-S3 ต่อ Wi-Fi อยู่หลังเราเตอร์ที่ทำ **NAT** จึงไม่มี IP สาธารณะ แดชบอร์ดบนอินเทอร์เน็ตจึงเปิดการเชื่อมต่อเข้าหา ESP32 ไม่ได้ ในทางกลับกัน ESP32 เป็นฝ่ายเชื่อมต่อ **ออก** ไปหาเซิร์ฟเวอร์ได้เสมอ ระบบจึงใช้ฐานข้อมูลเป็น **จุดพักคำสั่ง** ตรงกลาง

1. ช่างกดสวิตช์บนแดชบอร์ดแล้วยืนยัน → เบราว์เซอร์ส่ง `PATCH /rest/v1/controls ...` (= `UPDATE controls ...`) ด้วย role `authenticated`
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

เมื่อ $t_{submit}$ คือเวลาที่แดชบอร์ดเขียนฐานข้อมูล และ $t_{GET}$ คือเวลาของคำขอ HTTPS กรณีแย่ที่สุดอาจถึง 4–6 วินาที ถ้าคำสั่งมาถึงขณะ ESP32 กำลังส่งค่าเซนเซอร์อยู่

**ราคาของการ Poll:** $86{,}400 / 2 = 43{,}200$ คำขอต่อวัน ถ้าคำตอบพร้อม header ใช้ราว 0.5 KB จะได้ข้อมูลขาออก (Egress) ราว 21 MB ต่อวันต่ออุปกรณ์ ตัวเลขนี้ใช้เทียบกับโควตาของแผนฟรี

| วิธีรับคำสั่ง | ความหน่วง | ความซับซ้อน | เหมาะกับ |
|:---|:---|:---|:---|
| **HTTP Polling** (บทนี้) | วินาที | ต่ำ ใช้ REST เดิม | ไฟ พัดลม การตั้งค่าที่เปลี่ยนไม่บ่อย |
| Push ผ่าน MQTT (บทที่ 9) หรือ WebSocket (Supabase Realtime) | ต่ำกว่า 1 วินาที | สูงขึ้น ต้องรักษา connection ตลอดเวลา | งานที่ต้องตอบสนองเร็ว หรืออุปกรณ์จำนวนมาก |

> ⚠️ **ความปลอดภัยของเครื่องจักร:** การสั่งผ่านคลาวด์มีความหน่วงหลายวินาที และหยุดทำงานเมื่อเครือข่ายขัดข้อง จึง **ห้ามใช้เป็นระบบหยุดฉุกเฉิน (Emergency Stop)** ซึ่งต้องเป็นวงจรเดินสายตรง (Hardwired) ตามมาตรฐานความปลอดภัยของเครื่องจักรเสมอ ระบบในบทนี้เหมาะกับงานที่ไม่วิกฤต เช่น เปิดไฟส่องสว่างหรือพัดลมระบายอากาศ

### 12.6.4 สองผู้สั่ง หนึ่งความจริง

ระบบมีผู้สั่ง 2 ทาง คือสวิตช์บนแดชบอร์ดและปุ่มหน้าตู้ ทั้งสองทางต้องเขียนลงแถวเดียวกันใน `controls` ซึ่งเป็น **แหล่งความจริงเพียงแหล่งเดียว (Single Source of Truth)**

- **ช่างกดปุ่มหน้าตู้:** ESP32 สลับ LED ทันที (ไม่ต้องรอเครือข่าย) แล้ว `PATCH` ค่าใหม่ขึ้น `controls` แดชบอร์ดจึงเห็นสถานะเดียวกัน
- **ช่างสั่งจากแดชบอร์ด:** เบราว์เซอร์แก้ `controls` แล้ว ESP32 เห็นในรอบ poll ถัดไป และแดชบอร์ดเครื่องอื่นเห็นในรอบ refresh ถัดไป
- ถ้าสั่งพร้อมกันทั้งสองทาง ค่าที่เขียนทีหลังจะชนะ (**Last Write Wins**)

**Trigger** คือฟังก์ชันที่ PostgreSQL เรียกให้อัตโนมัติเมื่อตารางถูกแก้ไข เราใช้ trigger เปรียบเทียบค่าเก่า (`old`) กับค่าใหม่ (`new`) ของแต่ละอุปกรณ์ ถ้าเปลี่ยนก็เพิ่มแถวลง `events` พร้อม `source` ผลคือไม่ว่าคำสั่งจะมาจากทางใด ประวัติก็ถูกบันทึกครบ และทั้ง ESP32 และแดชบอร์ดไม่ต้องมีสิทธิ์เขียน `events` เลย

---

## 12.7 หลักการออกแบบแดชบอร์ด

แดชบอร์ดที่ดีต้องให้ช่างเข้าใจสถานะของตู้ควบคุมได้ **ภายใน 3 วินาที** โดยไม่ต้องอ่านคู่มือ จึงใช้หลักการต่อไปนี้

1. **ภาพรวมอยู่บน รายละเอียดอยู่ล่าง** แถวบนสุดเป็นค่าปัจจุบันและสถานะ ถัดลงมาเป็นแนวโน้ม และล่างสุดเป็นส่วนสั่งการและประวัติเหตุการณ์
2. **สีมีความหมายเสมอ** ใช้เขียว เหลือง และแดงเฉพาะเพื่อบอกสถานะ (ปกติ เฝ้าระวัง ผิดปกติ) ไม่ใช้สีเพื่อความสวยงาม ช่างจะได้มองหาสีแดงเป็นอันดับแรก
3. **เลือกรูปแบบการแสดงผลตามคำถาม**

| คำถามของช่าง | รูปแบบที่เหมาะ | เหตุผล |
|:---|:---|:---|
| ตอนนี้ร้อนแค่ไหน? | Gauge | เห็นตำแหน่งเทียบกับเกณฑ์ทันที |
| อุปกรณ์ยังส่งข้อมูลอยู่ไหม? | Stat (วินาทีตั้งแต่ข้อมูลล่าสุด) | ตัวเลขเดียวพร้อมสีสถานะ |
| อุณหภูมิเพิ่มขึ้นเรื่อย ๆ หรือไม่? | กราฟเส้นตามเวลา (Time series) | กราฟเส้นแสดงแนวโน้มตามเวลาได้ดีที่สุด |
| จะสั่งเปิด/ปิดไฟ ปั๊ม พัดลม? | ปุ่มสวิตช์ที่แสดงสถานะ (Toggle button) | แสดงสถานะที่สั่งอยู่ และกดเปลี่ยนได้ในที่เดียว ปุ่มใหญ่พอกดบนมือถือ |
| ใครสั่งอะไร เมื่อไร? | ตารางประวัติ (Event log) พร้อมป้ายสีเปิด/ปิด | อ่านลำดับเหตุการณ์และผู้สั่งได้ทันที |
| เปิดพัดลมแล้วอุณหภูมิลดลงหรือไม่? | เส้นหมายเหตุ (Annotation) บนกราฟ | วางเหตุการณ์ลงบนกราฟเดียวกันเพื่อเทียบเหตุกับผล |

4. **ข้อมูลต้องไม่บิดเบือน** ติดหน่วยทุกส่วน (°C, %RH) ใช้กราฟหรือแกนแยกเมื่อหน่วยต่างกัน และตั้งช่วงแกนของ Gauge ให้คงที่ (เช่น 0–60 °C) เพื่อไม่ให้การเปลี่ยนแปลงเล็กน้อยดูเหมือนรุนแรง
5. **ส่วนสั่งการต้องป้องกันการกดพลาด** แยกปุ่มสั่งการออกจากส่วนแสดงผล ใช้ป้ายกำกับชัดเจนว่ากำลังสั่งอุปกรณ์ใด ให้ **ยืนยันก่อนส่ง (Confirmation)** ทุกครั้ง และวางประวัติการสั่งไว้ข้างปุ่ม เพื่อให้ช่างเห็นผลของคำสั่งทันที

**Layout ของแดชบอร์ด `MCC Monitor`** (แม่แบบในโฟลเดอร์ `dashboard/` จัดไว้ให้แล้ว)

| แถว | ส่วนประกอบ | ใช้งานได้ตั้งแต่ส่วนที่ |
|:---|:---|:---|
| 1 (ภาพรวม) | Gauge อุณหภูมิ · Gauge ความชื้น · สถานะการเชื่อมต่อ | 1 |
| | เปิดพัดลมวันนี้ (จำนวนครั้ง) | 2 |
| 2 (แนวโน้ม) | กราฟอุณหภูมิ · กราฟความชื้น (เลือกช่วง 15 นาที / 30 นาที / 1 ชั่วโมง) | 1 |
| | เส้นหมายเหตุเปิด/ปิดพัดลมบนกราฟอุณหภูมิ | 2 |
| 3 (สั่งการและเหตุการณ์) | ปุ่มสั่งการ ไฟ · ปั๊ม · พัดลม · ประวัติการสั่ง | 2 |
| แถบบนสุด | แถบเตือนอุณหภูมิสูง / ขาดการเชื่อมต่อ / ข้อผิดพลาด | 1 |

</div>

<div class="chapter-tab-content" data-tab-name="Hands-on" data-tab-icon="🔧" id="handson" markdown="1">

## 12.8 ปฏิบัติการส่วนที่ 1: ติดตาม (Sensor → ESP32 → Dashboard)

> ใบงานพร้อมตารางบันทึกผลอยู่ในแท็บ **Lab 14** (หัวข้อ 12.11) หัวข้อ 12.8–12.10 อธิบายโค้ดและขั้นตอนทั้งหมดแบบละเอียด ส่วนที่ 1 ต้องทำงานได้ก่อน แล้วจึงต่อยอดเป็นส่วนที่ 2

**เป้าหมายของส่วนที่ 1:** ESP32-S3 อ่าน AHT25 แล้วส่งขึ้นตาราง `telemetry` ทุก 5 วินาที จากนั้นเว็บแดชบอร์ดบน Vercel แสดงค่าปัจจุบัน แนวโน้ม สถานะการเชื่อมต่อ และแจ้งเตือนเมื่ออุณหภูมิสูง

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
2. สร้างตาราง `telemetry` และสิทธิ์ของ ESP32 ด้วย **วิธีใดวิธีหนึ่ง** ด้านล่าง

**วิธีที่ 1: สร้างผ่านหน้าเว็บ Supabase**

*ก. สร้างตาราง*

1. เมนูซ้าย **Table Editor** → **New table** (หรือ **Create a new table**)
2. **Name** = `telemetry` → ให้ช่อง **Enable Row Level Security (RLS)** ถูกเลือกไว้ (ค่าเริ่มต้น) และเปิดสวิตช์ **Data API access** ไว้ เพราะ ESP32 ส่งข้อมูลผ่าน Data API
3. ส่วน **Columns** มีคอลัมน์ `id` (`int8`, Primary, Identity) และ `created_at` (`timestamptz`, Default value `now()`) ให้แล้ว ไม่ต้องแก้ไข จากนั้นกด **Add column** เพิ่มอีก 3 คอลัมน์

| Name | Type | Default value | Extra options (ปุ่ม ⚙ ท้ายแถว) |
|:---|:---|:---|:---|
| `device_id` | `text` | (ว่าง) | **ยกเลิก** เครื่องหมายที่ **Is nullable** (= `not null`) |
| `temp` | `float4` | (ว่าง) | คงค่าเดิม (nullable) |
| `hum` | `float4` | (ว่าง) | คงค่าเดิม (nullable) |

4. กด **Save** → หน้าเว็บจะเตือนว่า *Policies are required to query data* ซึ่งเราจะสร้าง policy ในขั้น ง.

> `id` ที่สร้างจากหน้าเว็บเป็นแบบ `generated by default as identity` (ใส่ `id` เองได้) ส่วนวิธีที่ 2 ใช้ `generated always` (ใส่เองไม่ได้) ทั้งสองแบบใช้กับบทนี้ได้เหมือนกัน เพราะ ESP32 ไม่ส่ง `id` มา

*ข. สร้าง Index*

1. เมนูซ้าย **Database** → **Indexes** → **Create index**
2. **Select a schema** = `public` → **Select a table** = `telemetry` → **Select up to 32 columns** = `device_id` แล้วตามด้วย `created_at` (ลำดับการเลือกมีผล) → **Select an index type** = `B-Tree`
3. ตรวจช่อง *Preview of SQL statement* แล้วกด **Create index**

> หน้าเว็บสร้าง index แบบเรียงจากน้อยไปมาก (ไม่มี `desc`) ซึ่งเร็วพอ ๆ กับวิธีที่ 2 เพราะ PostgreSQL อ่าน B-tree ย้อนหลังได้ query แบบ `ORDER BY created_at DESC` จึงยังใช้ index นี้ได้

*ค. จำกัดสิทธิ์ของ `anon` ให้ INSERT ได้อย่างเดียว*

สวิตช์ **Data API access** ในขั้น ก. ให้สิทธิ์ทุกอย่าง (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) กับ `anon` และ `authenticated` และหน้าเว็บยังเลือกให้เฉพาะบางสิทธิ์ไม่ได้ ขั้นนี้จึงต้องใช้ **SQL Editor → New query → Run**

```sql
revoke all on public.telemetry from anon, authenticated;
grant insert on public.telemetry to anon;
```

> ถ้าข้ามขั้นนี้ ระบบยังปลอดภัยในระดับหนึ่ง เพราะ RLS จะอนุญาตเฉพาะการกระทำที่มี policy รองรับ (มีเฉพาะ `INSERT` ในขั้น ง.) แต่การถอนสิทธิ์ที่ไม่ใช้ออกเป็นการป้องกันอีกชั้น (Defense in Depth) ถ้าวันหนึ่งมีคนเพิ่ม policy ผิดพลาด `anon` ก็ยังอ่านหรือลบข้อมูลไม่ได้

*ง. สร้าง RLS policy ให้ ESP32 เพิ่มแถวได้*

1. เมนูซ้าย **Database** → กลุ่ม **Access Control** → **Policies** → ที่ตาราง `telemetry` กด **Create policy**
2. กรอกค่าในแผง *Create a new Row Level Security policy*

| ช่อง | ค่าที่เลือก / กรอก |
|:---|:---|
| **Policy Name** | `esp32 insert telemetry` |
| **Table** | `public.telemetry` (เลือกไว้ให้แล้ว) |
| **Policy Behavior** (`as` clause) | `permissive` (ค่าเริ่มต้น) |
| **Policy Command** (`for` clause) | **INSERT** |
| **Target Roles** (`to` clause) | **anon** (ต้องเลือกเอง ถ้าเว้นว่างจะเป็น `public` คือทุก role) |

3. ในช่องแก้ SQL ด้านล่าง ระบบเขียนคำสั่ง `create policy ... with check ( ... );` ไว้ให้แล้ว ให้พิมพ์เงื่อนไขนี้ลงใน **วงเล็บของ `with check`**

```sql
device_id is not null
and temp between -40 and 120
and hum  between 0 and 100
```

4. กด **Save policy** → ต้องขึ้นข้อความ *Successfully created new policy* และตาราง `telemetry` ในหน้า Policies มีแถว `esp32 insert telemetry` ที่แสดงคำสั่ง `INSERT` และ role `anon`

> ถ้ามี policy ชื่อนี้อยู่แล้วแต่ตั้งค่าผิด เช่น Target Roles ไม่ใช่ `anon` ให้กด **⋯ → Edit policy** แล้วแก้ไข ไม่ต้องสร้างใหม่ เพราะในตารางเดียวกันตั้งชื่อ policy ซ้ำไม่ได้ ถ้าไม่มี policy นี้ ESP32 จะได้ error `401` พร้อมข้อความ *new row violates row-level security policy for table "telemetry"*

**วิธีที่ 2: ใช้ SQL ทั้งหมด**

เมนู **SQL Editor** → **New query** → วางคำสั่งทั้งหมดด้านล่าง → **Run** ชุดคำสั่งนี้ทำขั้น ก.–ง. ของวิธีที่ 1 ครบในครั้งเดียว

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

**ตรวจสอบและเก็บค่าที่ใช้ต่อ**

1. เปิด **Table Editor** → ตรวจว่ามีตาราง `telemetry` ที่มีคอลัมน์ตรงกับโครงสร้างด้านบน และแสดงสถานะ **RLS enabled**
2. **Database → Access Control → Policies** → ตาราง `telemetry` ต้องมี policy `esp32 insert telemetry` (คำสั่ง `INSERT`, role `anon`)
3. เมนูซ้าย **Integrations → Data API** → หน้า **Overview** → คัดลอก **Project URL** (เช่น `https://xxxx.supabase.co`) ซึ่งเป็นปลายทางของ REST API ที่ ESP32 ใช้ (URL ของหน้านี้คือ `supabase.com/dashboard/project/<project_ref>/integrations/data_api/overview`)
4. **Project Settings → API Keys** → คัดลอก **Publishable key** (ขึ้นต้นด้วย `sb_publishable_`) เก็บไว้ ห้ามคัดลอก Secret key (`sb_secret_`)

> 💡 ใช้ปุ่ม **Connect** ด้านบนของหน้าโปรเจกต์แทนข้อ 3–4 ได้ โดยเลือกแท็บ **Framework** แล้วดูไฟล์ env ในขั้น *Add files* ค่า `..._SUPABASE_URL` คือ Project URL และ `..._SUPABASE_PUBLISHABLE_KEY` คือ Publishable key (framework ที่เลือกไม่มีผล เพราะ ESP32 ใช้เฉพาะ 2 ค่านี้)

### 12.8.4 สร้างบัญชีผู้ใช้แดชบอร์ดด้วย Supabase Auth

แดชบอร์ดต้อง login ก่อนจึงจะอ่านข้อมูลได้ (หัวข้อ 12.3.3 และ 12.5.2) ขั้นนี้มี 3 ส่วน คือ ปิดการสมัครเอง สร้างบัญชีให้ช่าง และให้สิทธิ์อ่าน `telemetry` แก่ role `authenticated`

**ก. ปิดการสมัครสมาชิกเอง (ทำก่อนเสมอ)**

1. เมนูซ้าย **Authentication** → **Sign In / Providers**
2. ปิดสวิตช์ **Allow new users to sign up** → **Save changes**

> ถ้าไม่ปิด ใครก็ตามที่มี Publishable key (ซึ่งอยู่ในเฟิร์มแวร์ ESP32 และในหน้าเว็บ) สามารถสมัครบัญชีเองผ่าน API แล้วได้ role `authenticated` ทันที ซึ่งแปลว่าอ่านข้อมูลของโรงงานได้

**ข. สร้างบัญชีให้ช่าง**

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. **Email address** = อีเมลของตนเอง (เช่น อีเมลมหาวิทยาลัย) · **User Password** = รหัสผ่านอย่างน้อย 8 ตัวอักษร · เลือก **Auto confirm user?** ไว้ (ไม่ต้องยืนยันทางอีเมล)
3. กด **Create user** → บัญชีใหม่จะแสดงในรายการ Users

**ค. ให้สิทธิ์อ่าน `telemetry` แก่ผู้ที่ login**

ในหัวข้อ 12.8.3 เราถอนสิทธิ์ทั้งหมดของ `authenticated` ออกแล้ว จึงต้องให้กลับเฉพาะสิทธิ์อ่าน **SQL Editor → New query → Run**

```sql
grant select on public.telemetry to authenticated;

create policy "dashboard read telemetry" on public.telemetry
  for select to authenticated using (true);
```

> **ทางเลือก: สร้าง policy ผ่านหน้าเว็บ** ที่ **Database → Access Control → Policies** → ตาราง `telemetry` → **Create policy** → Policy Name `dashboard read telemetry` → Policy Command **SELECT** → Target Roles **authenticated** → พิมพ์ `true` ในวงเล็บของ `using` → **Save policy** แต่คำสั่ง `grant select ...` บรรทัดแรกยังต้องรันใน SQL Editor เพราะหน้าเว็บยังไม่มีเมนูให้สิทธิ์ระดับตาราง

**ตรวจสอบ**

- **Authentication → Users** มีบัญชีของตนเอง และ **Sign In / Providers** แสดงว่าปิด *Allow new users to sign up* แล้ว
- **Database → Access Control → Policies** ตาราง `telemetry` มี 2 policy คือ `esp32 insert telemetry` (INSERT, `anon`) และ `dashboard read telemetry` (SELECT, `authenticated`)

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

### 12.8.6 เปิดแดชบอร์ดบน Vercel

เลือกวิธีใดวิธีหนึ่ง

**วิธีที่ 1 (แนะนำ): ใช้แดชบอร์ดที่ผู้สอน Deploy ไว้** ไม่ต้องสมัคร Vercel หรือ GitHub

1. เปิดลิงก์แดชบอร์ดของรายวิชา: **(ลิงก์จากอาจารย์ผู้สอน เช่น `https://mcc-dashboard.vercel.app`)** ใช้ได้ทั้งคอมพิวเตอร์และมือถือ
2. ครั้งแรกจะพบหน้า **ตั้งค่าการเชื่อมต่อ Supabase** ให้กรอก

| ช่อง | ค่า | ที่มา |
|:---|:---|:---|
| **Project URL** | `https://xxxx.supabase.co` (ไม่มี `/rest/v1/` ต่อท้าย) | หัวข้อ 12.8.3 |
| **Publishable key** | `sb_publishable_...` | หัวข้อ 12.8.3 (ห้ามใช้ Secret key) |
| **DEVICE_ID** | ค่าเดียวกับในโปรแกรม ESP32 เช่น `mcc-1234` | หัวข้อ 12.8.5 |

3. กด **บันทึก** → พบหน้า **เข้าสู่ระบบแดชบอร์ด** → กรอกอีเมลและรหัสผ่านที่สร้างในหัวข้อ 12.8.4 ข. → **เข้าสู่ระบบ**

ค่าที่กรอกจะถูกเก็บใน **เบราว์เซอร์เครื่องนั้นเท่านั้น** (localStorage) ผู้สอนและนักศึกษาคนอื่นไม่เห็น ถ้าเปลี่ยนเครื่องหรือเปิดโหมดไม่ระบุตัวตน ต้องกรอกใหม่ และแก้ค่าได้จากปุ่ม **เปลี่ยนโปรเจกต์** บนแดชบอร์ด

**วิธีที่ 2: Deploy แดชบอร์ดของตนเอง** (ต้องมีบัญชี GitHub)

1. เปิด [หน้า Deploy บน Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FalfaXphoori%2FTechEngineering%2Ftree%2Fmain%2Fdashboard&project-name=mcc-dashboard&repository-name=mcc-dashboard) → login Vercel ด้วยบัญชี GitHub → **Create** (Vercel จะคัดลอกโฟลเดอร์ `dashboard/` ไปเป็น repo ใหม่ในบัญชี GitHub ของเรา)
2. (ไม่บังคับ) ที่ **Environment Variables** กรอก `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` และ `NEXT_PUBLIC_DEVICE_ID` ถ้ากรอก แดชบอร์ดจะข้ามหน้าตั้งค่าและผูกกับโปรเจกต์นั้นเสมอ ถ้าไม่กรอกจะทำงานแบบวิธีที่ 1
3. **Deploy** → รอ 1–2 นาที → ได้ URL เช่น `https://mcc-dashboard-xxxx.vercel.app`

> **สำหรับผู้สอน (Deploy ครั้งเดียวให้ทั้งชั้นเรียน):** Vercel → **Add New… → Project** → **Import** repo `TechEngineering` → **Root Directory** = `dashboard` → Framework Preset = **Next.js** (ตรวจพบอัตโนมัติ) → **ไม่ต้องกรอก Environment Variables** → **Deploy** แล้วแจกลิงก์ให้นักศึกษา แดชบอร์ดตัวเดียวใช้ได้กับทุกโปรเจกต์ Supabase ของนักศึกษา เพราะเบราว์เซอร์ของแต่ละคนคุยกับ Supabase ของตนเองโดยตรง Vercel login ด้วยบัญชี Google ได้ แต่การ Import repo ต้องเชื่อมบัญชี GitHub

**ตรวจสอบ:** หลัง login ต้องเห็น Gauge อุณหภูมิและความชื้นแสดงค่าเดียวกับ Serial Monitor และ **สถานะการเชื่อมต่อ** แสดงตัวเลขไม่เกินประมาณ 10 วินาทีสีเขียว

### 12.8.7 อ่านแดชบอร์ดของส่วนที่ 1

แดชบอร์ดจัด Layout ตามหลักการในหัวข้อ 12.7 โดยส่วนที่ 1 ใช้แถวที่ 1–2

| แถว | ส่วนประกอบ | ข้อมูลจาก | ไฟล์ในโฟลเดอร์ `dashboard/` |
|:---|:---|:---|:---|
| 1 | Gauge อุณหภูมิ (0–60 °C, เหลือง 30, แดง 35) · Gauge ความชื้น (0–100 %RH, เหลือง 60, แดง 70) | แถวล่าสุดของ `telemetry` | `components/Gauge.jsx` |
| 1 | สถานะการเชื่อมต่อ (วินาทีตั้งแต่ข้อมูลล่าสุด เกิน 30 วินาทีเป็นสีแดง) | `created_at` ของแถวล่าสุด | `components/Dashboard.jsx` |
| 2 | กราฟอุณหภูมิ และกราฟความชื้น (แยกกราฟเพราะหน่วยต่างกัน) พร้อมปุ่มเลือกช่วง 15 นาที / 30 นาที / 1 ชั่วโมง | `telemetry` ในช่วงเวลาที่เลือก | `components/LineChart.jsx` |

เกณฑ์สีทั้งหมดอยู่ในไฟล์ `lib/config.js` (`TEMP`, `HUM`, `STALE_SECONDS`) ถ้าต้องการเปลี่ยนเกณฑ์ ให้แก้ไฟล์นี้แล้ว Deploy ใหม่

**โค้ดที่ดึงข้อมูล** (`components/Dashboard.jsx` ฟังก์ชัน `load()` ซึ่งถูกเรียกทุก 5 วินาที)

```js
const since = new Date(Date.now() - minutes * 60 * 1000).toISOString()

// แถวล่าสุด → Gauge และสถานะการเชื่อมต่อ
supabase.from('telemetry').select('created_at, temp, hum')
  .eq('device_id', DEVICE_ID).order('created_at', { ascending: false }).limit(1)

// ข้อมูลย้อนหลังตามช่วงที่เลือก → กราฟ
supabase.from('telemetry').select('created_at, temp, hum')
  .eq('device_id', DEVICE_ID).gte('created_at', since)
  .order('created_at', { ascending: true }).limit(1000)
```

| ส่วนของโค้ด | การทำงาน |
|:---|:---|
| `.eq('device_id', DEVICE_ID)` | อ่านเฉพาะอุปกรณ์ของตนเอง ค่ามาจากหน้าตั้งค่า จึงต้องตรงกับ `DEVICE_ID` ในโปรแกรม ESP32 ทุกตัวอักษร |
| `.order(... ascending: false).limit(1)` | เรียงจากใหม่ไปเก่าแล้วเอาแถวแรก ได้ค่าล่าสุดเพียงแถวเดียว |
| `.gte('created_at', since)` | เอาเฉพาะแถวที่ใหม่กว่าเวลาเริ่มต้นของช่วงที่เลือก |
| `.limit(1000)` | ไม่ขอเกินเพดาน Max rows ของ Supabase (หัวข้อ 12.5.4) |
| `setInterval(load, REFRESH_MS)` | เรียก `load()` ซ้ำทุก 5 วินาที (Polling) |

**ทดสอบ**

| การทดลอง | ผลที่ควรเห็น |
|:---|:---|
| ใช้นิ้วจับ AHT25 นาน 1 นาที | Gauge อุณหภูมิเพิ่มขึ้น และเส้นกราฟอุณหภูมิยกตัว |
| ถอดสาย USB ของ ESP32-S3 แล้วรอ 40 วินาที | สถานะการเชื่อมต่อเป็นสีแดง และมีแถบเตือน *ไม่ได้รับข้อมูลจาก ESP32* |
| เปลี่ยนช่วงจาก 15 นาที เป็น 1 ชั่วโมง | แกนเวลาของกราฟกว้างขึ้น และเห็นแนวโน้มยาวขึ้น |
| เปิด **Table Editor** ของ `telemetry` เทียบกับ Gauge | ค่าล่าสุดตรงกัน |

### 12.8.8 การแจ้งเตือนบนแดชบอร์ด

แดชบอร์ดแสดง **แถบเตือนด้านบนสุด** เมื่อพบสภาวะผิดปกติ 2 แบบ

| แถบเตือน | เงื่อนไข | ค่าที่ปรับได้ใน `lib/config.js` |
|:---|:---|:---|
| 🔥 *อุณหภูมิในตู้สูงเกิน 35 °C* (สีแดง) | อุณหภูมิล่าสุด ≥ `TEMP.alarm` | `TEMP.alarm = 35` |
| 📡 *ไม่ได้รับข้อมูลจาก ESP32 เกิน 30 วินาที* (สีเหลือง) | ข้อมูลล่าสุดเก่ากว่า `STALE_SECONDS` | `STALE_SECONDS = 30` |

```js
const ageSec = latest ? Math.round((now - new Date(latest.created_at).getTime()) / 1000) : null
const stale = ageSec == null || ageSec > STALE_SECONDS
const tempAlarm = latest && levelOf(latest.temp, TEMP) === 'alarm'
```

**ทดสอบ:** ใช้นิ้วจับหรือเป่าลมอุ่นใส่ AHT25 จนอุณหภูมิเกินเกณฑ์ (ถ้าอุณหภูมิห้องต่ำ ให้ Deploy แดชบอร์ดของตนเองตามหัวข้อ 12.8.6 วิธีที่ 2 แล้วลด `TEMP.alarm` เป็นค่าที่สูงกว่าอุณหภูมิห้องเล็กน้อย เช่น `32`)

> **ข้อจำกัดของการแจ้งเตือนบนหน้าเว็บ:** แถบเตือนทำงานเฉพาะเมื่อมีคนเปิดแดชบอร์ดอยู่ ถ้าต้องการแจ้งเตือนตลอด 24 ชั่วโมง เช่น ส่งอีเมลหรือข้อความเข้ามือถือ ต้องให้ **ฝั่งเซิร์ฟเวอร์** เป็นผู้ตรวจ เช่น ใช้ Database Webhook หรือ Edge Function ของ Supabase ทำงานทุกครั้งที่มีแถวใหม่ใน `telemetry` แล้วส่งอีเมลเมื่อค่าเกินเกณฑ์ต่อเนื่อง (โจทย์ท้าทายท้ายบท) และควรตรวจแบบ **ต่อเนื่อง** เช่น เกินเกณฑ์นาน 2 นาที เพื่อไม่ให้แจ้งเตือนผิดจากค่ากระโดดเพียงครั้งเดียว

---

## 12.9 ปฏิบัติการส่วนที่ 2: สั่งการ (Dashboard → ESP32)

**เป้าหมายของส่วนที่ 2:** ช่างสั่งเปิด/ปิดไฟ ปั๊ม และพัดลม (แทนด้วย LED) ได้ 2 ทาง คือจากปุ่มบนเว็บแดชบอร์ด และจากปุ่มหน้าตู้ ทั้งสองทางทำให้ตาราง `controls` ตรงกับสถานะของ LED เสมอ และทุกการเปลี่ยนแปลงถูกบันทึกลง `events` เพื่อแสดงเป็นประวัติการสั่งและเส้นหมายเหตุบนกราฟ

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
| `light` | `boolean` (`bool`) | `not null`, `default false` | แดชบอร์ด / ปุ่ม GPIO 4 | สั่งไฟ (`true` = เปิด) | `false` |
| `pump` | `boolean` (`bool`) | `not null`, `default false` | แดชบอร์ด / ปุ่ม GPIO 5 | สั่งปั๊ม | `false` |
| `fan` | `boolean` (`bool`) | `not null`, `default false` | แดชบอร์ด / ปุ่ม GPIO 6 | สั่งพัดลม | `true` |
| `updated_by` | `text` (`text`) | รับเฉพาะ `button` / `dashboard` | แดชบอร์ด / ESP32-S3 | ผู้สั่งครั้งล่าสุด | `dashboard` |
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
| 58 | 2026-09-28 03:20:45+00 | mcc01 | fan | true | dashboard | ช่างสั่งเปิดพัดลมจากแดชบอร์ด |
| 59 | 2026-09-28 03:48:02+00 | mcc01 | fan | false | button | กดปุ่ม GPIO 6 หน้าตู้ |

ตาราง `events` ไม่ได้เชื่อมกับ `telemetry` ด้วย Foreign key แต่เชื่อมกันด้วย `device_id` และช่วงเวลา `created_at` เช่น เส้นหมายเหตุบนแดชบอร์ดจะนำ event `fan` ไปวางบนกราฟ `telemetry` ของอุปกรณ์เดียวกัน ณ เวลาเดียวกัน

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
| `is distinct from` | เปรียบเทียบค่าเก่ากับค่าใหม่ บันทึกเฉพาะอุปกรณ์ที่เปลี่ยนจริง ถ้าคำสั่ง `UPDATE` หนึ่งครั้งแก้หลายคอลัมน์ `events` จะได้เฉพาะแถวของอุปกรณ์ที่ค่าเปลี่ยนจริง และถ้าสั่งค่าเดิมซ้ำจะไม่มีแถวเพิ่ม |
| `security definer` + `set search_path = ''` | ฟังก์ชันทำงานด้วยสิทธิ์ของเจ้าของ (`postgres`) ESP32 และแดชบอร์ดจึงไม่ต้องมีสิทธิ์เขียน `events` เอง การกำหนด `search_path` ว่างและเขียนชื่อเต็ม `public.events` ป้องกันการหลอกให้ฟังก์ชันเขียนตารางอื่น |
| `grant update (light, pump, fan, updated_by)` | สิทธิ์ระดับคอลัมน์ ESP32 แก้ได้เฉพาะสถานะและผู้สั่ง แก้ `device_id` หรือ `updated_at` เองไม่ได้ (ผู้ใช้แดชบอร์ด `authenticated` ในหัวข้อ 12.9.3 ได้สิทธิ์แบบเดียวกัน) |
| `with check (updated_by = 'button')` | ESP32 ต้องระบุตัวเองว่า `button` เสมอ อ้างเป็น `dashboard` ไม่ได้ ประวัติใน `events` จึงเชื่อถือได้ |

### 12.9.3 ให้สิทธิ์สั่งการแก่ผู้ใช้แดชบอร์ด (`authenticated`)

บัญชีที่สร้างในหัวข้อ 12.8.4 ตอนนี้อ่านได้เฉพาะ `telemetry` ส่วนที่ 2 ต้องเพิ่มสิทธิ์ดังนี้

| ตาราง | สิทธิ์ของ `authenticated` | RLS policy | ใช้กับ |
|:---|:---|:---|:---|
| `controls` | `SELECT` + `UPDATE` เฉพาะคอลัมน์ `light`, `pump`, `fan`, `updated_by` | อ่านได้ทุกแถว · แก้ได้เมื่อ `updated_by = 'dashboard'` เท่านั้น | สวิตช์สั่งการ |
| `events` | `SELECT` | อ่านได้ทุกแถว | ประวัติการสั่ง เส้นหมายเหตุบนกราฟ และจำนวนครั้งที่เปิดพัดลม |

แดชบอร์ด **ไม่มีสิทธิ์เขียน `events`** แถวใน `events` ที่เกิดจากการสั่งผ่านแดชบอร์ด trigger เป็นผู้เขียนให้ (หัวข้อ 12.6.4) ประวัติจึงปลอมไม่ได้

**SQL Editor → New query → Run**

```sql
-- ===== ผู้ใช้แดชบอร์ด (authenticated): อ่าน/แก้ controls =====
grant select on public.controls to authenticated;
grant update (light, pump, fan, updated_by) on public.controls to authenticated;

create policy "dashboard read controls" on public.controls
  for select to authenticated using (true);
create policy "dashboard update controls" on public.controls
  for update to authenticated
  using (true)
  with check (updated_by = 'dashboard');

-- ===== ผู้ใช้แดชบอร์ด (authenticated): อ่าน events =====
grant select on public.events to authenticated;
create policy "dashboard read events" on public.events
  for select to authenticated using (true);
```

> **ทางเลือก: สร้าง policy ผ่านหน้าเว็บ** ที่ **Database → Access Control → Policies** ได้เช่นเดียวกับหัวข้อ 12.8.4 ค. (policy แบบ UPDATE ให้พิมพ์ `true` ในช่อง `using` และ `updated_by = 'dashboard'` ในช่อง `with check`) แต่คำสั่ง `grant ...` ทั้ง 3 บรรทัดยังต้องรันใน SQL Editor

**ตรวจสอบ**

- **Database → Access Control → Policies** → ตาราง `controls` ต้องมี 4 policy (`esp32 read controls`, `esp32 update controls`, `dashboard read controls`, `dashboard update controls`) และตาราง `events` ต้องมี `dashboard read events`
- **SQL Editor** → รันคำสั่งด้านล่าง ต้องได้ 3 แถวคือ `controls | SELECT`, `controls | UPDATE` และ `events | SELECT`

```sql
select table_name, privilege_type
from information_schema.table_privileges
where grantee = 'authenticated' and table_name in ('controls', 'events')
union
select distinct table_name, privilege_type
from information_schema.column_privileges
where grantee = 'authenticated' and table_name = 'controls' and privilege_type = 'UPDATE'
order by 1, 2;
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

### 12.9.5 สั่งเปิด/ปิดอุปกรณ์จากแดชบอร์ด

แดชบอร์ดชุดเดิมจากหัวข้อ 12.8.6 มีแถวที่ 3 สำหรับส่วนที่ 2 อยู่แล้ว เมื่อให้สิทธิ์ในหัวข้อ 12.9.3 และสร้างแถวใน `controls` แล้ว ให้ **กด refresh หน้าเว็บ 1 ครั้ง** จะเห็นกล่อง **สั่งการอุปกรณ์** ที่มีปุ่ม 3 ปุ่ม

| ปุ่ม | สถานะที่แสดง | เมื่อกด |
|:---|:---|:---|
| 💡 ไฟในตู้ (`light`) | **เปิด** (กรอบเขียว) / **ปิด** (กรอบเทา) ตามค่าใน `controls` | ถามยืนยัน แล้วสั่งสถานะตรงข้าม |
| 🛢️ ปั๊ม (`pump`) | เช่นเดียวกัน | เช่นเดียวกัน |
| 🌀 พัดลมระบายอากาศ (`fan`) | เช่นเดียวกัน | เช่นเดียวกัน |

ใต้ปุ่มแสดง **ผู้สั่งล่าสุด** (ปุ่มหน้าตู้ หรือแดชบอร์ด) และเวลา ซึ่งมาจากคอลัมน์ `updated_by` และ `updated_at` ถ้ากดปุ่มหน้าตู้ ปุ่มบนแดชบอร์ดจะเปลี่ยนตามภายในรอบ refresh ถัดไป (ไม่เกิน 5 วินาที)

**โค้ดที่สั่งการ** (`components/Dashboard.jsx` ฟังก์ชัน `command()`)

```js
async function command(device, value) {
  const verb = value ? 'เปิด' : 'ปิด'
  if (!window.confirm(`ยืนยัน${verb}${device.label} ของ ${DEVICE_ID}?`)) return
  setBusy(device.key)
  const { data, error } = await supabase.from('controls')
    .update({ [device.key]: value, updated_by: 'dashboard' })
    .eq('device_id', DEVICE_ID)
    .select()
  if (error) setError(error.message)
  else if (data.length === 0) setError('สั่งไม่สำเร็จ: ไม่พบแถวของอุปกรณ์นี้ใน controls หรือไม่มีสิทธิ์แก้ไข')
  setBusy(null)
  load()
}
```

| ส่วนของโค้ด | การทำงาน |
|:---|:---|
| `window.confirm(...)` | ถามยืนยันก่อนทุกครั้ง ป้องกันการกดพลาด (หลักการข้อ 5 ในหัวข้อ 12.7) โดยระบุชื่ออุปกรณ์และ `DEVICE_ID` ให้ชัด |
| `.update({ [device.key]: value, updated_by: 'dashboard' })` | แก้เฉพาะคอลัมน์ของอุปกรณ์ที่กด และระบุตัวว่า `dashboard` ตามที่ RLS policy บังคับ (เทียบกับ ESP32 ที่ต้องส่ง `button`) |
| `.eq('device_id', DEVICE_ID)` | แก้เฉพาะแถวของอุปกรณ์นี้ |
| `.select()` | ขอแถวที่แก้แล้วกลับมา (เทียบกับ `RETURNING` ใน SQL) ถ้าได้ 0 แถว แปลว่าไม่พบแถว หรือ RLS ไม่อนุญาต ซึ่ง PostgREST ไม่ถือว่าเป็น error |
| `setBusy(...)` | ปิดปุ่มทั้งหมดชั่วคราวระหว่างส่ง ป้องกันการกดซ้ำ |
| `load()` | อ่านข้อมูลใหม่ทันที ไม่ต้องรอรอบ 5 วินาที |

**ลำดับเหตุการณ์เมื่อกดสั่ง:** เบราว์เซอร์ส่ง `PATCH /rest/v1/controls?device_id=eq.<id>` พร้อม JWT → PostgREST รันด้วย role `authenticated` → RLS ตรวจว่า `updated_by = 'dashboard'` → trigger บันทึก `events` → ภายในราว 2 วินาที ESP32 `GET` ได้ค่าใหม่แล้วขับ LED (Serial Monitor แสดง `CMD fan -> ON`) → แดชบอร์ดแสดงแถวใหม่ในประวัติการสั่ง

### 12.9.6 ประวัติการสั่ง เส้นหมายเหตุบนกราฟ และจำนวนครั้งที่เปิดพัดลม

เมื่อ `authenticated` อ่าน `events` ได้แล้ว แดชบอร์ดจะแสดงข้อมูลจากตาราง `events` 3 จุด

| ส่วนประกอบ | ตำแหน่ง | คำขอข้อมูล |
|:---|:---|:---|
| **ประวัติการสั่ง** (เวลา · อุปกรณ์ · เปิด/ปิด · ผู้สั่ง) 20 รายการล่าสุด | แถว 3 ข้างปุ่มสั่งการ | `events` ของอุปกรณ์นี้ เรียงจากใหม่ไปเก่า `limit(20)` |
| **เส้นหมายเหตุ (Annotation)** เปิดพัดลม / ปิดพัดลม | บนกราฟอุณหภูมิ แถว 2 | กรองเฉพาะ `event = 'fan'` จากรายการเดียวกัน |
| **เปิดพัดลมวันนี้** (จำนวนครั้ง) | แถว 1 | นับแถว `event = 'fan'` และ `state = true` ตั้งแต่เที่ยงคืนตามเวลาไทย |

```js
// นับจำนวนแถวโดยไม่ดึงข้อมูลจริง (head: true)
supabase.from('events').select('id', { count: 'exact', head: true })
  .eq('device_id', DEVICE_ID).eq('event', 'fan').eq('state', true)
  .gte('created_at', startOfThaiDay())
```

`{ count: 'exact', head: true }` ให้ PostgREST ตอบเฉพาะจำนวนแถว (เทียบกับ `SELECT count(*)`) ไม่ส่งข้อมูลทั้งแถวกลับมา จึงประหยัดกว่าดึงทั้งหมดแล้วมานับเอง ส่วน `startOfThaiDay()` คำนวณเวลาเที่ยงคืนตามเวลาไทย (UTC+7) แล้วแปลงกลับเป็น UTC เพราะ `created_at` เก็บเป็น UTC ถ้าใช้เที่ยงคืน UTC ตรง ๆ วันใหม่จะเริ่มตอน 07:00 น. ตามเวลาไทย

เส้นหมายเหตุช่วยให้เห็นเหตุกับผลบนกราฟเดียวกัน เช่น หลังเส้น "เปิดพัดลม" อุณหภูมิในตู้ควรค่อย ๆ ลดลง

**ทดสอบ**

| การทดลอง | ผลที่ควรเห็น |
|:---|:---|
| กด **พัดลมระบายอากาศ** บนแดชบอร์ด → ยืนยัน | LED พัดลมติดภายในไม่กี่วินาที ประวัติการสั่งมีแถวใหม่ (`dashboard`) และกราฟอุณหภูมิมีเส้นหมายเหตุ "เปิดพัดลม" |
| กดปุ่ม `pump` หน้าตู้ | ภายใน 5 วินาที ปุ่มปั๊มบนแดชบอร์ดเปลี่ยนเป็น **เปิด** และประวัติการสั่งแสดงผู้สั่ง **ปุ่มหน้าตู้** |
| เปิด-ปิดพัดลม 2 รอบ | ค่า **เปิดพัดลมวันนี้** เพิ่มขึ้น 2 |

---

## 12.10 การแก้ปัญหาที่พบบ่อย

| ส่วน | อาการ | สาเหตุที่เป็นไปได้ | วิธีแก้ |
|:---|:---|:---|:---|
| 1 | Serial Monitor ไม่แสดงอะไร | ปิด USB CDC On Boot | ตั้ง **USB CDC On Boot: Enabled** แล้วอัปโหลดใหม่ |
| 1 | `AHT25 not found` | สาย SDA/SCL สลับ หรือไม่ได้จ่ายไฟ | ตรวจขาตามที่พิมพ์ไว้บนโมดูล และใช้ 3V3 |
| 1 | ต่อ Wi-Fi ไม่ขึ้น | เครือข่าย 5 GHz หรือเป็น WPA2-Enterprise | ใช้ Hotspot มือถือแบบ 2.4 GHz |
| 1 | ได้ `401` ตลอด | key ผิด หรือคัดลอกมาไม่ครบ | คัดลอก Publishable key (`sb_publishable_...`) ใหม่ และตรวจว่าส่งใน header `apikey` |
| 1 | ได้ `401` พร้อมข้อความ *new row violates row-level security policy* ทั้งที่ค่าที่ส่งอยู่ในช่วงปกติ | ยังไม่มี policy `esp32 insert telemetry` หรือตั้ง Target Roles ไม่ใช่ `anon` | สร้างหรือแก้ policy ตามหัวข้อ 12.8.3 ขั้น ง. |
| 1 | ได้ `401` พร้อมข้อความ *new row violates row-level security policy* และค่าผิดปกติ (เช่น `temp` เกิน 120) | ค่าไม่ผ่านเงื่อนไข `with check` (มักเกิดจากเซนเซอร์เสียหรือต่อสายผิด) | ตรวจเซนเซอร์และค่าที่ส่งใน Serial Monitor |
| 1 | ได้ `401` พร้อมข้อความ *permission denied for table telemetry* | `anon` ไม่มีสิทธิ์ `INSERT` (เช่น ปิด Data API access ตอนสร้างตาราง หรือลืม `grant insert`) | รัน `grant insert on public.telemetry to anon;` |
| 1 | หน้าตั้งค่าขึ้น *Project URL ต้องมีรูปแบบ https://xxxx.supabase.co* | ใส่ `/rest/v1/` ต่อท้าย (แบบใน ESP32) หรือคัดลอกมาไม่ครบ | ใช้ Project URL ที่ไม่มี `/rest/v1/` |
| 1 | login ไม่ได้: *Invalid login credentials* | อีเมลหรือรหัสผ่านผิด หรือยังไม่ได้สร้างบัญชี | ตรวจที่ **Authentication → Users** ถ้าลืมรหัสผ่าน ให้ลบบัญชีแล้วสร้างใหม่ |
| 1 | login ไม่ได้: *Email not confirmed* | ตอนสร้างบัญชีไม่ได้เลือก **Auto confirm user?** | สร้างบัญชีใหม่โดยเลือก Auto confirm user? |
| 1 | แดชบอร์ดขึ้นแถบแดง *permission denied for table telemetry* | `authenticated` ยังไม่มีสิทธิ์ `SELECT` | รัน `grant select on public.telemetry to authenticated;` (หัวข้อ 12.8.4 ค.) |
| 1 | login ได้ แต่ Gauge แสดง `–` และขึ้นแถบเหลือง *ไม่ได้รับข้อมูลจาก ESP32* ทั้งที่ ESP32 ได้ `201` | ไม่มี policy `dashboard read telemetry` (RLS คืนผลเป็น 0 แถว ไม่ใช่ error) หรือ `DEVICE_ID` ในหน้าตั้งค่าไม่ตรงกับ ESP32 | ตรวจ policy ในหน้า Policies และแก้ `DEVICE_ID` ด้วยปุ่ม **เปลี่ยนโปรเจกต์** |
| 1 | ใช้บนมือถือแล้วต้องตั้งค่าใหม่ | ค่าตั้งเก็บแยกในแต่ละเบราว์เซอร์ | กรอกค่าตั้งในเบราว์เซอร์ของมือถือ 1 ครั้ง |
| 2 | LED ไม่ติดเลย | ต่อ LED กลับขั้ว หรือลืมตัวต้านทาน | ขายาวต่อฝั่ง GPIO ผ่าน 220 Ω ขาสั้นต่อ GND |
| 2 | กดปุ่มครั้งเดียวได้ 2 event | ปุ่มเด้งนานกว่า 50 ms | เพิ่ม `DEBOUNCE_MS` เป็น 80–100 |
| 2 | Serial ขึ้น `controls: no row for this DEVICE_ID` | ยังไม่ได้ `insert` แถวของอุปกรณ์ หรือ `DEVICE_ID` สะกดไม่ตรง | รัน `insert into controls (device_id) values ('<DEVICE_ID>');` |
| 2 | `PATCH` ได้ `204` แต่แดชบอร์ดไม่เปลี่ยน | ไม่มีแถวที่ตรง `DEVICE_ID` (แก้ 0 แถว) | ตรวจแถวใน `controls` เหมือนข้อบน |
| 2 | `PATCH` ได้ `401/403` code `42501` | `updated_by` ไม่ใช่ `button` หรือไม่มี policy update | ตรวจ body และ policy `esp32 update controls` |
| 2 | กดปุ่มแล้ว LED ติดแล้วดับเองใน 2 วินาที | `PATCH` ล้มเหลว poll จึงดึงค่าเดิมกลับมา | ดู status code ของ `PATCH` ใน Serial Monitor |
| 2 | แดชบอร์ดขึ้น *ไม่พบแถวของอุปกรณ์นี้ในตาราง controls* | ยังไม่ได้ `insert` แถว หรือ `authenticated` ไม่มี policy อ่าน `controls` | สร้างแถวตามหัวข้อ 12.9.2 และตรวจสิทธิ์ตามหัวข้อ 12.9.3 |
| 2 | กดสวิตช์แล้วขึ้น *สั่งไม่สำเร็จ: ไม่พบแถว... หรือไม่มีสิทธิ์แก้ไข* | ไม่มี policy `dashboard update controls` | รันคำสั่งในหัวข้อ 12.9.3 |
| 2 | กดสวิตช์แล้วขึ้น *permission denied for table controls* | ลืม `grant update (light, pump, fan, updated_by) ...` | รันคำสั่ง `grant` ในหัวข้อ 12.9.3 |
| 2 | กดสวิตช์แล้วขึ้น *new row violates row-level security policy* | policy ของ `authenticated` เขียน `with check` ผิด | ตรวจว่า `with check (updated_by = 'dashboard')` |
| 2 | สั่งจากแดชบอร์ดแล้ว `events` ไม่มีแถวใหม่ | ส่งค่าเดิมซ้ำ (trigger บันทึกเฉพาะเมื่อค่าเปลี่ยน) หรือไม่ได้สร้าง trigger | เปลี่ยนค่าจริง หรือรันคำสั่ง `create trigger` อีกครั้ง |
| 2 | ประวัติการสั่งว่างทั้งที่ `events` มีข้อมูล | `authenticated` ยังอ่าน `events` ไม่ได้ | รันส่วน `grant select on public.events ...` ในหัวข้อ 12.9.3 |

</div>


<div class="chapter-tab-content" data-tab-name="Lab 14" data-tab-icon="🔬" id="lab14" markdown="1">

## 12.11 ใบงานปฏิบัติการ Lab 14: ระบบติดตามและสั่งการตู้ควบคุมด้วย Supabase + Vercel

**ฮาร์ดแวร์:** ESP32-S3 DevKit + AHT25 + ปุ่มกด 3 ปุ่ม + LED 3 ดวง + ตัวต้านทาน 220 Ω 3 ตัว  
**เครื่องมือ (ฟรีทั้งหมด):** Arduino IDE + Supabase (Free Plan) + แดชบอร์ดบน Vercel (ลิงก์จากผู้สอน)  
**เวลา:** 3 ชั่วโมง (ส่วนที่ 1 ประมาณ 100 นาที · ส่วนที่ 2 ประมาณ 80 นาที)

> ใบงานนี้ใช้ทำตามลำดับขั้นและบันทึกผล ส่วนโค้ดฉบับเต็ม SQL และคำอธิบายอยู่ในแท็บ **Hands-on** (หัวข้อ 12.8 สำหรับส่วนที่ 1 และ 12.9 สำหรับส่วนที่ 2)

### วัตถุประสงค์ของใบงาน

**ส่วนที่ 1: ติดตาม (ESP32 → Supabase → Vercel)**
- ต่อวงจร ESP32-S3 กับ AHT25 (I2C) ได้
- สร้างตาราง `telemetry` บน Supabase พร้อมกำหนดสิทธิ์ด้วย Row Level Security ได้
- ส่งข้อมูลเซนเซอร์ผ่าน HTTPS POST ไปยัง REST API ได้
- สร้างบัญชีผู้ใช้ด้วย Supabase Auth และเปิดดูข้อมูลบนเว็บแดชบอร์ดที่ Deploy บน Vercel ได้

**ส่วนที่ 2: สั่งการ (Vercel → Supabase → ESP32)**
- ต่อปุ่มกด (Pull-up + Interrupt) และ LED เป็นเอาต์พุตได้
- สร้างตาราง `controls` แบบ Desired State และ trigger ที่บันทึก `events` อัตโนมัติได้
- เขียนโปรแกรมให้ ESP32 poll คำสั่งด้วย HTTPS GET และแจ้งการกดปุ่มหน้าตู้ด้วย PATCH ได้
- สั่งเปิด/ปิดอุปกรณ์จากแดชบอร์ด โดยผู้ใช้ที่ login แก้ได้เฉพาะตาราง `controls` ได้

**สถานการณ์:** ติดตั้งอุปกรณ์ในตู้ควบคุมมอเตอร์ปั๊ม (MCC) เพื่อวัดอุณหภูมิและความชื้นภายในตู้ (ส่วนที่ 1) และให้ช่างสั่งเปิด/ปิด **ไฟ** (`light`), **ปั๊ม** (`pump`) และ **พัดลม** (`fan`) ได้ทั้งจากแดชบอร์ดบนมือถือและจากปุ่มหน้าตู้ (ส่วนที่ 2) โดยทุกการสั่งจะถูกบันทึกพร้อมผู้สั่ง

---

## ส่วนที่ 1: ติดตาม (ESP32 → Supabase → Vercel)

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

### ขั้นที่ 1.2: สร้างตาราง `telemetry` บน Supabase (20 นาที)

#### ขั้นตอนปฏิบัติ

1. สมัครที่ [supabase.com](https://supabase.com) → **New project** → ชื่อ `mcc-monitor` → ตั้ง Database Password → Region **Southeast Asia (Singapore)**
2. สร้างตาราง `telemetry` ตาม **หัวข้อ 12.8.3** (วิธีที่ 1 ผ่านหน้าเว็บ หรือวิธีที่ 2 ด้วย SQL) ซึ่งจะได้
   - ตาราง `telemetry` พร้อม index
   - policy ให้ `anon` (ESP32) **INSERT ได้อย่างเดียว** และตรวจช่วงค่า `temp` / `hum`
3. **Integrations → Data API → Overview** → คัดลอก **Project URL** และ **Project Settings → API Keys** → คัดลอก **Publishable key** (`sb_publishable_...`)

#### ตารางบันทึกผล — ขั้นที่ 1.2

| รายการ | สถานะ |
|:---|:---|
| เห็นตาราง `telemetry` ใน Table Editor | ________ |
| RLS ของตาราง `telemetry` แสดงสถานะ Enabled | ________ |
| วิธีที่ใช้สร้างตาราง (หน้าเว็บ / SQL) | ________ |
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

### ขั้นที่ 1.4: สร้างบัญชีแดชบอร์ดและเปิดแดชบอร์ดบน Vercel (25 นาที)

#### ความรู้เบื้องต้น

- หน้าเว็บแดชบอร์ดโหลดจาก Vercel แต่ **เบราว์เซอร์ดึงข้อมูลจาก Supabase โดยตรง** ด้วย Publishable key ตัวเดียวกับ ESP32
- ต้อง login ก่อนจึงจะได้ role `authenticated` ที่อ่านข้อมูลได้ จึงต้อง **ปิดการสมัครเอง** และให้ผู้ดูแลสร้างบัญชีให้เท่านั้น

#### ขั้นตอนปฏิบัติ

1. **Authentication → Sign In / Providers** → ปิด **Allow new users to sign up** → Save ตาม **หัวข้อ 12.8.4 ก.**
2. **Authentication → Users → Add user → Create new user** → ใส่อีเมลและรหัสผ่านของตนเอง → เลือก **Auto confirm user?** → Create user ตาม **หัวข้อ 12.8.4 ข.**
3. รัน SQL ให้สิทธิ์อ่าน `telemetry` แก่ `authenticated` ตาม **หัวข้อ 12.8.4 ค.**
4. เปิดลิงก์แดชบอร์ดของรายวิชา → กรอก Project URL, Publishable key และ `DEVICE_ID` → บันทึก → login ตาม **หัวข้อ 12.8.6**
5. ทดลองตาม **หัวข้อ 12.8.7** และ **12.8.8**

#### ตารางบันทึกผล — ขั้นที่ 1.4

| การทดลอง | ผลที่เห็นบนแดชบอร์ด |
|:---|:---|
| login ด้วยรหัสผ่านผิด 1 ครั้ง | ข้อความที่แสดง: ________ |
| ค่า Gauge อุณหภูมิเทียบกับ Serial Monitor | แดชบอร์ด ____ °C / Serial ____ °C |
| ใช้นิ้วจับ AHT25 นาน 1 นาที | สีของ Gauge อุณหภูมิ: ________ กราฟ: ________ |
| ถอดสาย USB ของ ESP32-S3 แล้วรอ 40 วินาที | ค่าและสีของสถานะการเชื่อมต่อ: ________ แถบเตือน: ________ |
| เปลี่ยนช่วงกราฟจาก 15 นาที เป็น 1 ชั่วโมง | กราฟเปลี่ยนอย่างไร: ________ |
| ทำให้อุณหภูมิเกิน `TEMP.alarm` (35 °C) | แถบเตือนที่แสดง: ________ |
| เปิดแดชบอร์ดบนมือถือ | ต้องกรอกค่าตั้งใหม่หรือไม่ เพราะเหตุใด: ________ |

### ขั้นที่ 1.5: ทดสอบความปลอดภัยของส่วนที่ 1 (15 นาที)

#### ขั้นตอนปฏิบัติ

1. เปิดแดชบอร์ดในหน้าต่างไม่ระบุตัวตน (Incognito) → กรอกค่าตั้ง → **อย่า login** แล้วสังเกตว่าเข้าหน้าแดชบอร์ดได้หรือไม่
2. ที่ **Authentication → Sign In / Providers** เปิด **Allow new users to sign up** ชั่วคราว แล้วอธิบายในแบบฝึกหัดข้อ 4 ว่าเปิดทิ้งไว้จะเกิดความเสี่ยงอะไร จากนั้น **ปิดกลับทันที**
3. SQL Editor → รัน `select policyname, roles, cmd from pg_policies where tablename = 'telemetry';` แล้วจดผล

#### ตารางบันทึกผล — ขั้นที่ 1.5

| การทดลอง | ผล |
|:---|:---|
| เปิดแดชบอร์ดโดยไม่ login | ________ |
| policy ของ `telemetry` (ชื่อ · role · คำสั่ง) | ________ |
| ปิด Allow new users to sign up กลับแล้ว | ________ |

---

## ส่วนที่ 2: สั่งการ (Vercel → Supabase → ESP32)

> เริ่มส่วนที่ 2 ได้เมื่อแดชบอร์ดของส่วนที่ 1 แสดงข้อมูลได้แล้วเท่านั้น

### ขั้นที่ 2.1: ต่อ LED + ปุ่ม และสร้างตาราง `controls` (25 นาที)

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
4. ให้สิทธิ์สั่งการแก่ผู้ใช้แดชบอร์ดตาม **หัวข้อ 12.9.3** แล้วรันคำสั่งตรวจสิทธิ์

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

### ขั้นที่ 2.3: สั่งการจากแดชบอร์ดบน Vercel (30 นาที)

#### ขั้นตอนปฏิบัติ

1. กด refresh แดชบอร์ด 1 ครั้ง → ตรวจว่าแถวที่ 3 แสดงกล่อง **สั่งการอุปกรณ์** และ **ประวัติการสั่ง** ตาม **หัวข้อ 12.9.5** และ **12.9.6**
2. ทดลองตามตารางด้านล่าง โดยเปิด Serial Monitor ไว้ด้วย

#### ตารางบันทึกผล — ขั้นที่ 2.3

| การทดลอง | ผลที่เห็น |
|:---|:---|
| กด **พัดลมระบายอากาศ** บนแดชบอร์ด → ยืนยัน แล้วจับเวลาจนถึง LED ติด (ทำ 5 ครั้ง) | ____ / ____ / ____ / ____ / ____ วินาที เฉลี่ย ____ (เทียบกับค่าประมาณในหัวข้อ 12.6.3) |
| กดปุ่มบนแดชบอร์ดแล้วเลือก **ยกเลิก** ในหน้าต่างยืนยัน | LED และ `events` เปลี่ยนหรือไม่: ________ |
| กดปุ่ม `pump` หน้าตู้ แล้วรอไม่เกิน 5 วินาที | ปุ่มปั๊มบนแดชบอร์ด: ________ ผู้สั่งในประวัติ: ________ |
| สั่ง `fan` เปิด-ปิดจากแดชบอร์ด 1 รอบ และจากปุ่ม 1 รอบ | ค่า **เปิดพัดลมวันนี้**: ____ ข้อความบนเส้นหมายเหตุ: ________ |
| เปิด `fan` แล้วใช้มือบังอากาศรอบ AHT25 เทียบกับตอนปิด | แนวโน้มอุณหภูมิบนกราฟ: ________ |
| สั่งจากแดชบอร์ดบนมือถือ ขณะอยู่นอกเครือข่าย Wi-Fi เดียวกับ ESP32 (ใช้ 4G/5G) | LED ทำงานหรือไม่ เพราะเหตุใด: ________ |
| ปิด Hotspot ของ ESP32 แล้วสั่ง `light` จากแดชบอร์ด จากนั้นเปิด Hotspot อีกครั้ง | LED `light` ทำงานเมื่อใด: ________ |

---

### แบบฝึกหัดท้ายใบงาน

1. **Interrupt กับ Polling:** จากผลการทดลองในขั้นที่ 2.2 (กด `pump` ขณะกำลังส่งข้อมูล) อธิบายว่าถ้าโปรแกรมอ่านปุ่มด้วย `digitalRead()` ใน `loop()` แทน Interrupt ผลจะต่างไปอย่างไร เพราะเหตุใด

   > คำตอบ: _______________________________________________________________

2. **Debounce:** จากการกดปุ่ม `fan` ค้างไว้ 3 วินาที ทำไมโปรแกรมจึงนับเป็นเพียง 1 การสั่ง? อธิบายโดยอ้างอิงเงื่อนไขในฟังก์ชัน `onButtonChange()`

   > คำตอบ: _______________________________________________________________

3. **Desired State:** จากการทดลองรีเซ็ตบอร์ดขณะเปิด `fan` ไว้ อธิบายว่าทำไม LED จึงกลับมาอยู่สถานะเดิม และถ้าเปลี่ยนตาราง `controls` ให้เก็บเป็นคำสั่ง "toggle" แทนสถานะ จะเกิดปัญหาอะไร

   > คำตอบ: _______________________________________________________________

4. **ความปลอดภัย:** ESP32 และแดชบอร์ดใช้ Publishable key ตัวเดียวกัน (ก) ถ้ามีผู้ไม่หวังดีนำ key ออกจากเฟิร์มแวร์ได้ เขาจะทำอะไรกับฐานข้อมูลได้บ้าง และทำอะไรไม่ได้บ้าง (ข) ถ้าเปิด *Allow new users to sign up* ทิ้งไว้ ความเสี่ยงจะเพิ่มขึ้นอย่างไร อ้างอิง policy ที่สร้างในขั้นที่ 1.2, 1.4 และ 2.1

   > คำตอบ: _______________________________________________________________

5. **ประยุกต์งานเครื่องกล:** ถ้าต้องการรู้ว่า "เปิดพัดลมระบายอากาศแล้ว อุณหภูมิเฉลี่ยในตู้ลดลงหรือไม่" จะดูส่วนใดบนแดชบอร์ด และเขียน SQL ใน SQL Editor เปรียบเทียบอุณหภูมิเฉลี่ย 10 นาทีก่อนและหลัง event `fan` ที่ `state = true` ล่าสุดอย่างไร

   > คำตอบ: _______________________________________________________________

---

### การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จากอาจารย์ผู้สอน)**

สิ่งที่ต้องส่ง:
1. รูปถ่ายวงจรจริง ESP32-S3 + AHT25 + ปุ่ม 3 ปุ่ม + LED 3 ดวง
2. Screenshot Serial Monitor ที่แสดง `POST telemetry ... -> 201`, `PATCH controls ... -> 204` และ `CMD ... -> ON`
3. Screenshot Supabase Table Editor ของตาราง `telemetry` (อย่างน้อย 20 แถว), `controls` และ `events` (มีทั้ง `source` = `button` และ `dashboard`)
4. Screenshot หน้า **Authentication → Sign In / Providers** ที่ปิด *Allow new users to sign up* แล้ว และหน้า **Policies** ของทั้ง 3 ตาราง
5. Screenshot แดชบอร์ด `MCC Monitor` ที่มีครบ 3 แถว (ภาพรวม · กราฟ · สั่งการและประวัติ)
6. คลิปวิดีโอสั้น (ไม่เกิน 30 วินาที) แสดงการกดสั่งบนแดชบอร์ดแล้ว LED บนบอร์ดติด
7. คำตอบแบบฝึกหัดท้ายใบงานครบทุกข้อ

#### Checklist ก่อนส่ง

- [ ] `DEVICE_ID` เป็นรูปแบบ `mcc-` ตามด้วยรหัสนักศึกษา 4 ตัวท้าย ตรงกันทั้งในโปรแกรม ESP32 แถวใน `controls` และหน้าตั้งค่าของแดชบอร์ด
- [ ] ESP32-S3 และแดชบอร์ดใช้ Publishable key (`sb_publishable_...`) เท่านั้น ไม่ใช่ Secret key (`sb_secret_...`) หรือ `service_role` key
- [ ] ทุกตาราง (`telemetry`, `controls`, `events`) เปิด RLS และมี policy ครบทั้งของ `anon` และ `authenticated`
- [ ] ปิด **Allow new users to sign up** แล้ว และมีบัญชีแดชบอร์ดที่ผู้ดูแลสร้างเท่านั้น
- [ ] กดปุ่ม 1 ครั้งได้ 1 การสั่งเสมอ
- [ ] การสั่งจากแดชบอร์ดมีหน้าต่างยืนยันทุกครั้ง
- [ ] กรอกตารางบันทึกผลครบทุกขั้น
- [ ] ระบุชื่อ-นามสกุล และรหัสนักศึกษาในฟอร์ม

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="summary" markdown="1">

## 12.12 สรุปประจำบทที่ 12 (Summary)

1. **ระบบ IoT แบบครบวงจร** ประกอบด้วย 4 ชั้น ได้แก่ เซนเซอร์ ปุ่ม และเอาต์พุต (AHT25, LED) อุปกรณ์เครือข่าย (ESP32-S3 + HTTPS) ฐานข้อมูลคลาวด์ (Supabase/PostgreSQL) และแอปพลิเคชันแสดงผลและสั่งการ (เว็บแดชบอร์ดบน Vercel) โดยแบ่งเป็นเส้นทาง **ติดตาม** (ส่วนที่ 1) และเส้นทาง **สั่งการ** (ส่วนที่ 2)
2. **AHT25** สื่อสารผ่าน I2C ที่ address `0x38` ให้ค่าดิบ 20 บิต ซึ่งแปลงเป็นหน่วยจริงได้ด้วย $RH = S_{RH}/2^{20} \times 100$ และ $T = S_T/2^{20} \times 200 - 50$ ความละเอียดของค่าไม่ใช่ความแม่นยำ
3. **ปุ่มกด** ต้องใช้ Pull-up และ Debounce และควรอ่านด้วย **Interrupt** เมื่อโปรแกรมมีงานที่บล็อกนาน เช่น การส่ง HTTPS ส่วน **เอาต์พุต** ต้องจำกัดกระแสด้วยตัวต้านทาน และใช้โมดูลรีเลย์เมื่อขับโหลดจริง
4. **Telemetry, Command State และ Event** เป็นข้อมูลต่างประเภทกัน จึงควรแยกตาราง และเลือกรูปแบบการแสดงผลให้ตรงกับประเภทข้อมูล
5. **Row Level Security และ Least Privilege** แยกสิทธิ์ตามการ login ด้วย Publishable key ตัวเดียวกัน (`anon` = ESP32 → `INSERT` telemetry และแก้ `controls` ในนาม `button` · `authenticated` = ช่างที่ login → อ่านข้อมูลและแก้ `controls` ในนาม `dashboard`) และต้องปิดการสมัครสมาชิกเอง
6. **Vercel** ให้บริการเฉพาะไฟล์หน้าเว็บ เบราว์เซอร์คุยกับ Supabase REST API โดยตรงผ่าน `supabase-js` ซึ่งแปลงเป็นคำขอ REST และ SQL แบบเดียวกับที่ ESP32 ใช้ ความปลอดภัยจึงขึ้นกับ RLS ไม่ใช่การซ่อนโค้ด
7. **การสั่งการผ่านคลาวด์** ใช้ฐานข้อมูลเป็นจุดพัก **Desired State** ที่ ESP32 poll เป็นรอบ ซึ่ง Idempotent และทนต่อการรีบูต แลกกับความหน่วงประมาณ $T_{poll}/2 + t_{HTTPS}$ และห้ามใช้แทนระบบหยุดฉุกเฉิน
8. **Trigger** ของ PostgreSQL บันทึกประวัติการสั่งพร้อมผู้สั่งได้โดยอัตโนมัติ ทำให้มีแหล่งความจริงเดียว และผู้สั่งไม่ต้องมีสิทธิ์เขียนประวัติเอง
9. **แดชบอร์ดที่ดี** ต้องเข้าใจได้ใน 3 วินาที วางภาพรวมไว้บน ใช้สีเพื่อบอกสถานะเท่านั้น ติดหน่วยทุกส่วน และส่วนสั่งการต้องยืนยันก่อนส่งและแสดงผลของคำสั่งให้เห็น

### ตารางอ้างอิงด่วน

| หัวข้อ | ค่า / คำสั่ง |
|:---|:---|
| I2C ของ AHT25 | address `0x38`, SDA = GPIO 8, SCL = GPIO 9 |
| ปุ่ม / LED | ปุ่ม GPIO 4/5/6 (`INPUT_PULLUP`) · LED GPIO 10/11/12 ผ่าน 220 Ω |
| ส่งค่าเซนเซอร์ (ESP32) | `POST https://<ref>.supabase.co/rest/v1/telemetry` → `201` |
| ถามคำสั่ง (ESP32) | `GET .../rest/v1/controls?device_id=eq.<id>&select=light,pump,fan` → `200` |
| แจ้งการกดปุ่ม (ESP32) | `PATCH .../rest/v1/controls?device_id=eq.<id>` body `{"fan":true,"updated_by":"button"}` → `204` |
| อ่านค่าล่าสุด (แดชบอร์ด) | `supabase.from('telemetry').select(...).eq('device_id', id).order('created_at', { ascending: false }).limit(1)` |
| สั่งการ (แดชบอร์ด) | `supabase.from('controls').update({ fan: true, updated_by: 'dashboard' }).eq('device_id', id).select()` |
| บัญชีแดชบอร์ด | Authentication → Users → Add user → Create new user (Auto confirm user?) · ปิด Allow new users to sign up |
| โค้ดแดชบอร์ด | [`dashboard/`](https://github.com/alfaXphoori/TechEngineering/tree/main/dashboard) · เกณฑ์สีและรอบ refresh ใน `lib/config.js` |

> ℹ️ **แผนฟรี:** Supabase Free Plan และ Vercel Hobby Plan มีโควตาจำกัด เช่น พื้นที่ฐานข้อมูล ปริมาณข้อมูลขาออก (Egress) และการ pause โปรเจกต์ Supabase ที่ไม่มีการใช้งาน เงื่อนไขเหล่านี้อาจเปลี่ยนได้ ควรตรวจสอบหน้าราคาของผู้ให้บริการก่อนเริ่มภาคการศึกษา

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 12.13 แบบฝึกหัดท้ายบทที่ 12 (Exercises)

**ข้อ 1:** AHT25 ส่งค่าดิบของความชื้น $S_{RH} = 629{,}146$ และอุณหภูมิ $S_T = 419{,}430$ จงคำนวณความชื้นสัมพัทธ์ (%RH) และอุณหภูมิ (°C) พร้อมอธิบายว่าทำไมจึงควรรายงานผลเพียงทศนิยม 1 ตำแหน่ง

**ข้อ 2:** อธิบายว่าถ้าเปลี่ยนการอ่านปุ่มจาก Interrupt เป็น Polling ใน `loop()` จะเกิดปัญหาอะไรกับระบบในส่วนที่ 2 และปัญหานั้นเกี่ยวข้องกับการส่ง HTTPS อย่างไร

**ข้อ 3:** ถ้าผู้พัฒนาใส่ **Secret key** ไว้ในหน้าเว็บแดชบอร์ดแทน Publishable key เพื่อ "ไม่ต้อง login" ระบบยังทำงานได้ แต่ความเสี่ยงเพิ่มขึ้นอย่างไร? (ใบ้: ใครก็เปิดดูโค้ด JavaScript ของหน้าเว็บได้) ยกตัวอย่างเหตุการณ์ที่อาจเกิดขึ้นในโรงงาน

**ข้อ 4:** ถ้าต้องการให้แดชบอร์ดแสดงกราฟย้อนหลัง 30 วันบนกราฟกว้าง 1,200 พิกเซล จะมีข้อมูลดิบในตาราง `telemetry` กี่แถว และช่วงเวลาของ Downsampling ควรมีค่าประมาณเท่าใด? แสดงวิธีคำนวณ แล้วอธิบายว่าทำไมการใช้ `.limit(1000)` เพียงอย่างเดียวจึงไม่พอ

**ข้อ 5:** ความชื้นในตู้ควบคุมจะเสี่ยงเกิดหยดน้ำเมื่ออุณหภูมิลดลงถึงจุดน้ำค้าง (Dew Point) จงเขียนคำสั่ง SQL ที่คำนวณ Dew Point จากคอลัมน์ `temp` และ `hum` ด้วยสมการ Magnus โดยประมาณ $T_d = \frac{b\,\gamma}{a - \gamma}$ เมื่อ $\gamma = \ln(RH/100) + \frac{a\,T}{b + T}$, $a = 17.62$, $b = 243.12\ ^\circ C$ แล้วเสนอวิธีนำค่านี้ไปแสดงบนแดชบอร์ด

**ข้อ 6 (ความหน่วงของ Polling):** ถ้าลด `POLL_INTERVAL` จาก 2 วินาทีเป็น 0.5 วินาที และคำขอ HTTPS แต่ละครั้งใช้เวลา 0.8 วินาที
- (ก) ความหน่วงเฉลี่ยตั้งแต่กดส่งคำสั่งจนถึง LED ติดเปลี่ยนจากเดิมเท่าใด
- (ข) จำนวนคำขอ `GET` ต่อวันเพิ่มขึ้นกี่เท่า
- (ค) ทำไม ESP32 จึงอาจ poll ได้ไม่ถี่ถึง 0.5 วินาทีจริง (พิจารณาเวลาของ HTTPS) และควรเปลี่ยนไปใช้วิธีใดแทน

**ข้อ 7 (Fail-safe):** เมื่อ Wi-Fi ขาดหายนานเกิน 1 นาที ESP32 ควรทำอย่างไรกับไฟ ปั๊ม และพัดลม แต่ละตัว (คงสถานะเดิม หรือปิดเอง)? ให้เหตุผลทางวิศวกรรมของแต่ละอุปกรณ์ แล้วเสนอการแก้โค้ดใน `loop()`

**ข้อ 8 (แจ้งเตือน 24 ชั่วโมง):** แถบเตือนบนแดชบอร์ดทำงานเฉพาะเมื่อเปิดหน้าเว็บไว้ จงออกแบบระบบแจ้งเตือนทางอีเมลเมื่ออุณหภูมิเกิน 35 °C ต่อเนื่อง 2 นาที โดยระบุว่าจะตรวจที่ใด (ESP32 / ฐานข้อมูล / Edge Function) เงื่อนไข "ต่อเนื่อง" คำนวณอย่างไร และป้องกันการส่งอีเมลซ้ำทุก 5 วินาทีอย่างไร

**ข้อ 9 (ออกแบบ):** โรงงานมีตู้ควบคุม 20 ตู้ แต่ละตู้มี ESP32-S3 หนึ่งตัว จงออกแบบ
- (ก) ค่า `device_id` ที่สื่อความหมาย
- (ข) Layout แดชบอร์ดภาพรวมที่ให้หัวหน้าช่างเห็นได้ทันทีว่าตู้ใดผิดปกติ
- (ค) คำนวณพื้นที่ฐานข้อมูลที่ใช้ต่อเดือน แล้วเสนอแนวทางลดขนาดข้อมูลเก่า
- (ง) แนวทางป้องกันไม่ให้ ESP32 ของตู้หนึ่งสั่งอุปกรณ์ของตู้อื่นได้ ทั้งที่ทุกตัวใช้ Publishable key เดียวกัน และให้ช่างแต่ละแผนกเห็นเฉพาะตู้ของแผนกตนเอง (ใบ้: ให้แต่ละอุปกรณ์และช่าง login ด้วยบัญชีของตนเอง แล้วเขียน RLS policy ที่เทียบ `device_id` กับตัวตนของผู้ login ผ่าน `auth.uid()`)

</div>
