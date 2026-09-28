---
layout: default
title: "บทที่ 12: ระบบ IoT สู่ฐานข้อมูลคลาวด์และแดชบอร์ด"
permalink: /chapters/ch12-hmi-visualization/
---

# Chapter 12: ระบบ IoT สู่ฐานข้อมูลคลาวด์และแดชบอร์ด

## Cloud Database & Dashboard (ESP32-S3, AHT25, Supabase/PostgreSQL, Grafana Cloud)

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
>   - **LLO14.2:** สร้างแดชบอร์ดแสดงผลและระบบแจ้งเตือนด้วย Grafana ตามหลักการออกแบบแดชบอร์ดที่ดีได้ (CLO3, CLO4)
>
> **ฮาร์ดแวร์:** ESP32-S3 DevKit · เซนเซอร์อุณหภูมิ/ความชื้น AHT25 · ปุ่มกด 3 ปุ่ม  
> **ซอฟต์แวร์ (ฟรีทั้งหมด):** Arduino IDE (ESP32 core) · Supabase Free Plan · Grafana Cloud Free Tier

---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 12.1 ภาพรวมระบบ: ตู้ควบคุมมอเตอร์ปั๊ม

ในโรงงาน มอเตอร์ปั๊มถูกควบคุมจาก **ตู้ควบคุมมอเตอร์ (Motor Control Cabinet)** ซึ่งภายในมีอินเวอร์เตอร์ คอนแทคเตอร์ และรีเลย์ ถ้าอุณหภูมิในตู้สูงเกินไป อุปกรณ์อิเล็กทรอนิกส์จะเสื่อมเร็วขึ้น และถ้าความชื้นสูงจนเกิดหยดน้ำเกาะ (Condensation) ก็อาจทำให้ไฟฟ้าลัดวงจรได้ ช่างซ่อมบำรุงจึงต้องการระบบที่
1. **ติดตามอุณหภูมิและความชื้นในตู้** ตลอด 24 ชั่วโมง และดูแนวโน้มย้อนหลังได้
2. **บันทึกการเปิด/ปิดอุปกรณ์จากผู้ควบคุม** ได้แก่ ไฟส่องสว่างในตู้ (`light`) ปั๊ม (`pump`) และพัดลมระบายอากาศ (`fan`) เพื่อนำไปเทียบกับข้อมูลเซนเซอร์ เช่น เปิดพัดลมแล้วอุณหภูมิในตู้ลดลงเท่าใด
3. **แจ้งเตือนอัตโนมัติ** เมื่ออุณหภูมิเกินเกณฑ์

ในบทนี้เราจะสร้างระบบทั้งหมดด้วยเครื่องมือฟรี ตามสถาปัตยกรรมด้านล่าง

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 900 345" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif" role="img" aria-label="ESP32-S3 ส่งข้อมูล AHT25 และเหตุการณ์ปุ่มผ่าน HTTPS ไปยัง REST API ของ Supabase ซึ่งบันทึกลง PostgreSQL ส่วน Grafana Cloud อ่านข้อมูลผ่าน Session Pooler ด้วย role อ่านอย่างเดียว แล้วแสดงแดชบอร์ดและส่งอีเมลแจ้งเตือน">
  <title>สถาปัตยกรรมระบบ: เส้นทางเขียน ESP32-S3 → REST API → PostgreSQL และเส้นทางอ่าน PostgreSQL → Pooler → Grafana</title>
  <style>
    .c12-bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; }
    .c12-box { fill: #ffffff; stroke: #475569; stroke-width: 2; }
    .c12-esp { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2.5; }
    .c12-db { fill: #ecfdf5; stroke: #059669; stroke-width: 2.5; }
    .c12-tb { fill: #ffffff; stroke: #059669; stroke-width: 1.5; }
    .c12-gf { fill: #fff7ed; stroke: #ea580c; stroke-width: 2.5; }
    .c12-cloud { fill: #f0fdf4; stroke: #059669; stroke-width: 1.5; stroke-dasharray: 6 5; }
    .c12-w { fill: none; stroke: #059669; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: c12-flow 1.6s linear infinite; }
    .c12-r { fill: none; stroke: #2f5597; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: c12-flow 1.6s linear infinite; }
    .c12-a { fill: none; stroke: #ea580c; stroke-width: 3; stroke-dasharray: 6 8; stroke-linecap: round; animation: c12-flow 1.2s linear infinite; }
    .c12-t { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .c12-l { font-size: 12px; fill: #64748b; font-weight: 500; }
    .c12-c { font-size: 11px; font-family: monospace; font-weight: 700; fill: #475569; }
    .c12-cw { font-size: 11px; font-family: monospace; font-weight: 700; fill: #059669; }
    .c12-cr { font-size: 11px; font-family: monospace; font-weight: 700; fill: #2f5597; }
    .c12-ca { font-size: 11px; font-family: monospace; font-weight: 700; fill: #ea580c; }
    @keyframes c12-flow { to { stroke-dashoffset: -36; } }
    @media (prefers-reduced-motion: reduce) { .c12-w, .c12-r, .c12-a { animation: none; } }
  </style>
  <rect x="5" y="5" width="890" height="335" rx="10" class="c12-bg"/>
  <!-- ESP32-S3 -->
  <rect x="20" y="60" width="160" height="180" rx="8" class="c12-esp"/>
  <text x="100" y="88" text-anchor="middle" class="c12-t">ESP32-S3</text>
  <text x="100" y="116" text-anchor="middle" class="c12-l">AHT25 (I2C)</text>
  <text x="100" y="134" text-anchor="middle" class="c12-c">temp, hum</text>
  <text x="100" y="164" text-anchor="middle" class="c12-l">ปุ่ม 3 ปุ่ม</text>
  <text x="100" y="182" text-anchor="middle" class="c12-c">light/pump/fan</text>
  <text x="100" y="222" text-anchor="middle" class="c12-c">Wi-Fi 2.4 GHz</text>
  <!-- write: ESP32 → REST -->
  <path d="M 180 100 L 246 100" class="c12-w"/>
  <polygon points="246,95 256,100 246,105" fill="#059669"/>
  <text x="218" y="90" text-anchor="middle" class="c12-cw">HTTPS</text>
  <text x="218" y="120" text-anchor="middle" class="c12-cw">POST</text>
  <!-- Supabase container -->
  <rect x="230" y="30" width="345" height="250" rx="12" class="c12-cloud"/>
  <text x="246" y="52" class="c12-cw">SUPABASE</text>
  <rect x="256" y="70" width="140" height="60" rx="8" class="c12-box"/>
  <text x="326" y="96" text-anchor="middle" class="c12-t">REST API</text>
  <text x="326" y="116" text-anchor="middle" class="c12-c">anon key</text>
  <rect x="416" y="70" width="140" height="60" rx="8" class="c12-box"/>
  <text x="486" y="96" text-anchor="middle" class="c12-t">Session Pooler</text>
  <text x="486" y="116" text-anchor="middle" class="c12-c">port 5432</text>
  <!-- PostgreSQL -->
  <rect x="256" y="170" width="300" height="95" rx="8" class="c12-db"/>
  <text x="406" y="188" text-anchor="middle" class="c12-c">PostgreSQL + RLS</text>
  <rect x="268" y="198" width="132" height="56" rx="6" class="c12-tb"/>
  <text x="334" y="220" text-anchor="middle" class="c12-t">telemetry</text>
  <text x="334" y="242" text-anchor="middle" class="c12-l">ทุก 5 วินาที</text>
  <rect x="412" y="198" width="132" height="56" rx="6" class="c12-tb"/>
  <text x="478" y="220" text-anchor="middle" class="c12-t">events</text>
  <text x="478" y="242" text-anchor="middle" class="c12-l">เมื่อกดปุ่ม</text>
  <!-- write: REST → DB -->
  <path d="M 326 130 L 326 160" class="c12-w"/>
  <polygon points="321,160 326,170 331,160" fill="#059669"/>
  <text x="336" y="154" class="c12-cw">INSERT</text>
  <!-- read: DB → pooler -->
  <path d="M 486 170 L 486 140" class="c12-r"/>
  <polygon points="481,140 486,130 491,140" fill="#2f5597"/>
  <text x="496" y="154" class="c12-cr">SELECT</text>
  <!-- read: pooler → Grafana -->
  <path d="M 556 100 L 620 100" class="c12-r"/>
  <polygon points="620,95 630,100 620,105" fill="#2f5597"/>
  <text x="593" y="90" text-anchor="middle" class="c12-cr">SQL+TLS</text>
  <text x="593" y="120" text-anchor="middle" class="c12-c">grafana_ro</text>
  <!-- Grafana -->
  <rect x="630" y="60" width="130" height="170" rx="8" class="c12-gf"/>
  <text x="695" y="88" text-anchor="middle" class="c12-t">Grafana Cloud</text>
  <polyline points="648,170 666,160 684,164 702,146 720,150 742,128" fill="none" stroke="#ea580c" stroke-width="2.5"/>
  <circle cx="742" cy="128" r="3.5" fill="#ea580c"/>
  <line x1="702" y1="120" x2="702" y2="178" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="3 3"/>
  <text x="695" y="212" text-anchor="middle" class="c12-c">refresh 10s</text>
  <!-- Grafana → user -->
  <path d="M 760 120 L 790 120" class="c12-r"/>
  <polygon points="790,115 800,120 790,125" fill="#2f5597"/>
  <rect x="800" y="70" width="85" height="100" rx="8" class="c12-box"/>
  <text x="842" y="112" text-anchor="middle" class="c12-t">ช่าง</text>
  <text x="842" y="134" text-anchor="middle" class="c12-l">เบราว์เซอร์</text>
  <!-- Grafana → email -->
  <path d="M 695 230 L 695 266" class="c12-a"/>
  <polygon points="690,266 695,276 700,266" fill="#ea580c"/>
  <text x="705" y="254" class="c12-ca">temp &gt; 35 °C</text>
  <rect x="630" y="276" width="130" height="44" rx="8" class="c12-box"/>
  <text x="695" y="303" text-anchor="middle" class="c12-t">อีเมลแจ้งเตือน</text>
  <!-- legend -->
  <line x1="30" y1="300" x2="62" y2="300" stroke="#059669" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="70" y="304" class="c12-l">เส้นทางเขียน</text>
  <line x1="30" y1="322" x2="62" y2="322" stroke="#2f5597" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="70" y="326" class="c12-l">เส้นทางอ่าน</text>
  <line x1="250" y1="311" x2="282" y2="311" stroke="#ea580c" stroke-width="3" stroke-dasharray="6 8"/>
  <text x="290" y="315" class="c12-l">การแจ้งเตือน</text>
</svg>
</div>

ระบบแบ่งเป็น 4 ชั้นตามสถาปัตยกรรม IoT ที่เรียนในบทที่ 1

| ชั้น (Layer) | องค์ประกอบในบทนี้ | หน้าที่ |
|:---|:---|:---|
| Perception | AHT25, ปุ่มกด 3 ปุ่ม | วัดอุณหภูมิ/ความชื้น และรับคำสั่งจากผู้ควบคุม |
| Network | ESP32-S3 + Wi-Fi + HTTPS | ส่งข้อมูลขึ้นคลาวด์อย่างเข้ารหัส |
| Middleware / Storage | Supabase (REST API + PostgreSQL) | ตรวจสิทธิ์ จัดเก็บ และให้บริการ query |
| Application | Grafana Cloud | แสดงแดชบอร์ด และแจ้งเตือน |

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
| ขาที่ควรเลี่ยง | 0, 3, 45, 46 (Strapping) · 19–20 (USB) · 35–37 (บอร์ดที่มี Octal PSRAM) | ต่อปุ่มผิดขาอาจทำให้บอร์ดบูตไม่ขึ้น |

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

**วงจร Pull-up ภายใน:** เมื่อตั้ง `pinMode(pin, INPUT_PULLUP)` ชิปจะต่อตัวต้านทานภายในค่าประมาณ 45 kΩ จากขาไปยัง 3.3 V ขณะปล่อยปุ่มขาจึงอ่านได้ `HIGH` เมื่อกดปุ่ม (ปุ่มต่อลง GND) ขาจะถูกดึงเป็น `LOW` โดยมีกระแสไหลเพียง $3.3 / 45\text{k} \approx 73\ \mu A$

**การเด้งของหน้าสัมผัส (Contact Bounce):** ปุ่มกลไกมีแผ่นโลหะที่กระทบกันแล้วเด้งหลายครั้งในช่วงประมาณ 1–20 ms ไมโครคอนโทรลเลอร์ที่อ่านค่าได้ระดับไมโครวินาทีจะเห็นเป็นการกดหลายครั้ง จึงต้องทำ **Debounce** คือทิ้งขอบสัญญาณที่เกิดถี่เกินช่วงเวลาที่กำหนด

**ทำไมต้องใช้ Interrupt?** การส่ง HTTPS แต่ละครั้งต้องทำ TLS handshake ซึ่งทำให้ `http.POST()` ค้างอยู่ประมาณ 0.5–2 วินาที

| วิธีอ่านปุ่ม | ถ้าผู้ใช้กดปุ่มระหว่าง ESP32 กำลังส่งข้อมูล |
|:---|:---|
| **Polling** (อ่าน `digitalRead` ใน `loop()`) | การกดสั้น ๆ ช่วงนั้นจะ **หายไป** เพราะ `loop()` ยังไม่วนกลับมาอ่าน |
| **Interrupt** (ISR ทำงานทันทีที่ขาเปลี่ยนสถานะ) | ISR จำการกดไว้ใน flag แล้ว `loop()` จะส่งในรอบถัดไป **ไม่หาย** |

---

## 12.3 การออกแบบข้อมูลและความปลอดภัย

### 12.3.1 ข้อมูล 2 ประเภท: Telemetry และ Event

| | Telemetry | Event |
|:---|:---|:---|
| ตัวอย่าง | อุณหภูมิ 31.4 °C, ความชื้น 58 %RH | ผู้ควบคุมกดปุ่มเปิดพัดลม |
| รูปแบบการเกิด | เป็นรอบคงที่ (Periodic) ทุก 5 วินาที | เกิดเมื่อใดก็ได้ (Event-driven) |
| ค่าที่เก็บ | ตัวเลขต่อเนื่อง | ชื่ออุปกรณ์จากชุดค่าที่กำหนดไว้ (`light`, `pump`, `fan`) + สถานะเปิด/ปิด |
| การแสดงผล | กราฟเส้น, เกจ | แถบสถานะ (State timeline), เส้นหมายเหตุบนกราฟ (Annotation) |

เราแยกข้อมูลสองประเภทนี้ไว้คนละตาราง (`telemetry` และ `events`) เพราะโครงสร้างและวิธี query ต่างกัน ถ้ารวมในตารางเดียว จะมีคอลัมน์ว่างจำนวนมาก และ query แต่ละแบบจะซับซ้อนขึ้น

### 12.3.2 โครงสร้างตาราง

```sql
create table public.telemetry (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id  text not null,
  temp       real,        -- อุณหภูมิ (°C)
  hum        real         -- ความชื้นสัมพัทธ์ (%RH)
);

create table public.events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id  text not null,
  event      text not null check (event in ('light', 'pump', 'fan')),
  state      boolean not null      -- true = เปิด, false = ปิด
);
```

- **`created_at ... default now()`** ให้ฐานข้อมูลเป็นผู้ประทับเวลา ESP32 จึงไม่ต้องมีนาฬิกาที่แม่นยำ ส่วน `timestamptz` เก็บเวลาเป็น UTC แล้วแสดงตาม time zone ของผู้ใช้
- **`check (event in (...))`** ทำให้ฐานข้อมูลรับเฉพาะชื่ออุปกรณ์ที่กำหนด ถ้าสะกดผิดจะถูกปฏิเสธ
- **`state boolean`** เก็บสถานะหลังการกดปุ่ม (`true` = เปิด, `false` = ปิด) การรู้แค่ว่า "มีการกดปุ่ม" ไม่พอ เพราะต้องรู้ว่าอุปกรณ์ถูกเปิดหรือปิด จึงจะวาดช่วงเวลาที่อุปกรณ์ทำงานได้
- **Index `(device_id, created_at desc)`** แดชบอร์ดเกือบทุก query จะถามว่า "อุปกรณ์ X ในช่วงเวลา Y" B-tree index ที่เรียงตามคอลัมน์ทั้งสองจะช่วยให้ PostgreSQL กระโดดไปยังช่วงข้อมูลนั้นได้ทันที ไม่ต้องอ่านทั้งตาราง (Sequential Scan)

**ประเมินปริมาณข้อมูล:** ถ้าส่งทุก 5 วินาที จะได้ $86{,}400 / 5 = 17{,}280$ แถวต่อวัน ถ้าแต่ละแถวรวม index ใช้พื้นที่ราว 100 ไบต์ จะใช้พื้นที่ประมาณ 1.7 MB ต่อวัน หรือราว 50 MB ต่อเดือนต่ออุปกรณ์ ตัวเลขนี้ใช้เทียบกับพื้นที่ฐานข้อมูลของแผนฟรี เพื่อตัดสินใจเรื่องความถี่ในการส่งและการลบข้อมูลเก่า

### 12.3.3 Row Level Security และหลัก Least Privilege

ระบบแยกเส้นทางข้อมูลเป็น 2 เส้น และให้แต่ละเส้นมีสิทธิ์เท่าที่จำเป็นต่อหน้าที่เท่านั้น (**Principle of Least Privilege**)

| เส้นทาง | ผู้ใช้ | ช่องทาง | สิทธิ์ |
|:---|:---|:---|:---|
| เขียน (Write) | ESP32-S3 | HTTPS → REST API ด้วย role `anon` | `INSERT` เท่านั้น |
| อ่าน (Read) | Grafana Cloud | PostgreSQL + TLS ด้วย role `grafana_ro` | `SELECT` เท่านั้น |

**Row Level Security (RLS)** เป็นกฎที่ PostgreSQL ตรวจทุกครั้งที่มีการอ่านหรือเขียนแถว ถ้าเปิด RLS แล้วไม่มี policy อนุญาต คำขอนั้นจะถูกปฏิเสธทั้งหมด (**Deny by Default**) ผลของการออกแบบนี้คือ
- ถ้า key ใน ESP32 ถูกดึงออกจากเฟิร์มแวร์ ผู้ไม่หวังดีก็ **อ่าน** ข้อมูลย้อนหลังของโรงงานไม่ได้
- ถ้ารหัสผ่านของ Grafana รั่ว ผู้ไม่หวังดีก็ **แก้ไขหรือลบ** ข้อมูลไม่ได้
- policy ยังทำหน้าที่ **ตรวจความสมเหตุสมผลของข้อมูล** ได้ด้วย เช่น ปฏิเสธค่าอุณหภูมิที่อยู่นอกย่านวัดของ AHT25 (-40 ถึง 120 °C) ซึ่งมักเกิดจากเซนเซอร์เสีย

> ⚠️ ห้ามนำ **Secret key** หรือ **`service_role` key** ของ Supabase ไปใส่ในอุปกรณ์หรือหน้าเว็บเด็ดขาด เพราะ key กลุ่มนี้ข้าม RLS ได้ทั้งหมด

---

## 12.4 เส้นทางเขียน: HTTPS และ REST API

Supabase มีเครื่องมือชื่อ **PostgREST** ที่สร้าง REST API ให้ทุกตารางโดยอัตโนมัติ ด้วยการแปลงคำขอ HTTP เป็นคำสั่ง SQL (ทบทวนบทที่ 8)

| คำขอ HTTP จาก ESP32 | คำสั่ง SQL ที่ PostgREST สร้าง |
|:---|:---|
| `POST /rest/v1/telemetry` body `{"device_id":"mcc01","temp":31.4,"hum":58.2}` | `INSERT INTO telemetry (device_id, temp, hum) VALUES ('mcc01', 31.4, 58.2)` |
| `POST /rest/v1/events` body `{"device_id":"mcc01","event":"fan","state":true}` | `INSERT INTO events (device_id, event, state) VALUES ('mcc01', 'fan', true)` |

**Header ที่ต้องส่ง**

| Header | ค่า | หน้าที่ |
|:---|:---|:---|
| `apikey` | Publishable key (หรือ legacy `anon` key) | ระบุโปรเจกต์ และกำหนด role เป็น `anon` |
| `Authorization` | `Bearer <key>` (เฉพาะ legacy key แบบ JWT) | ยืนยันตัวตนตามรูปแบบเดิม |
| `Content-Type` | `application/json` | บอกว่า body เป็น JSON |
| `Prefer` | `return=minimal` | ไม่ต้องส่งแถวที่บันทึกกลับมา ประหยัด bandwidth |

**รหัสสถานะที่ต้องรู้จัก:** `201` บันทึกสำเร็จ · `400` JSON หรือชื่อคอลัมน์ผิด · `401/403` key ผิดหรือไม่ผ่าน RLS · `404` URL หรือชื่อตารางผิด · ค่าติดลบ ESP32 เชื่อมต่อไม่ได้ (Wi-Fi หลุด หรือ TLS ล้มเหลว)

> **HTTPS กับการยืนยันใบรับรอง:** ในห้องแล็บเราใช้ `tls.setInsecure()` ข้อมูลยังถูกเข้ารหัส แต่ ESP32 จะไม่ตรวจว่ากำลังคุยกับเซิร์ฟเวอร์ตัวจริงหรือไม่ งานจริงต้องใช้ `tls.setCACert(rootCA)` เพื่อป้องกันการโจมตีแบบ Man-in-the-Middle

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

## 12.6 หลักการออกแบบแดชบอร์ด

แดชบอร์ดที่ดีต้องให้ช่างเข้าใจสถานะของตู้ควบคุมได้ **ภายใน 3 วินาที** โดยไม่ต้องอ่านคู่มือ จึงใช้หลักการต่อไปนี้

1. **ภาพรวมอยู่บน รายละเอียดอยู่ล่าง** แถวบนสุดเป็นค่าปัจจุบันและสถานะ ถัดลงมาเป็นแนวโน้ม และล่างสุดเป็นประวัติเหตุการณ์
2. **สีมีความหมายเสมอ** ใช้เขียว เหลือง และแดงเฉพาะเพื่อบอกสถานะ (ปกติ เฝ้าระวัง ผิดปกติ) ไม่ใช้สีเพื่อความสวยงาม ช่างจะได้มองหาสีแดงเป็นอันดับแรก
3. **เลือกชนิด panel ตามคำถาม**

| คำถามของช่าง | Panel ที่เหมาะ | เหตุผล |
|:---|:---|:---|
| ตอนนี้ร้อนแค่ไหน? | Gauge | เห็นตำแหน่งเทียบกับเกณฑ์ทันที |
| อุปกรณ์ยังส่งข้อมูลอยู่ไหม? | Stat (วินาทีตั้งแต่ข้อมูลล่าสุด) | ตัวเลขเดียวพร้อมสีสถานะ |
| อุณหภูมิเพิ่มขึ้นเรื่อย ๆ หรือไม่? | Time series | กราฟเส้นแสดงแนวโน้มตามเวลาได้ดีที่สุด |
| ไฟ ปั๊ม และพัดลม เปิดอยู่ช่วงไหน? | State timeline | แถบสีต่อเนื่องแสดงช่วงเวลาเปิด/ปิดของแต่ละอุปกรณ์ |
| เปิดพัดลมแล้วอุณหภูมิลดลงหรือไม่? | Annotation บน Time series | วางเหตุการณ์ลงบนกราฟเดียวกันเพื่อเทียบเหตุกับผล |

4. **ข้อมูลต้องไม่บิดเบือน** ติดหน่วยทุก panel (°C, %RH) ใช้แกนแยกเมื่อหน่วยต่างกัน และตั้งช่วงแกนของ Gauge ให้คงที่ (เช่น 0–60 °C) เพื่อไม่ให้การเปลี่ยนแปลงเล็กน้อยดูเหมือนรุนแรง

**Layout ของแดชบอร์ด `MCC Monitor`**

| แถว | Panel |
|:---|:---|
| 1 (ภาพรวม) | Gauge อุณหภูมิ · Gauge ความชื้น · Stat สถานะการเชื่อมต่อ · Stat เปิดพัดลมวันนี้ |
| 2 (แนวโน้ม) | Time series อุณหภูมิ + ความชื้น พร้อม Annotation เปิด/ปิดพัดลม |
| 3 (เหตุการณ์) | State timeline ไฟ · ปั๊ม · พัดลม |

</div>

<div class="chapter-tab-content" data-tab-name="Hands-on" data-tab-icon="🔧" id="handson" markdown="1">

## 12.7 ปฏิบัติการ: สร้างระบบตั้งแต่ต้นจนจบ

> ใบงานพร้อมตารางบันทึกผลอยู่ในแท็บ **Lab 14** (หัวข้อ 12.8) หัวข้อนี้อธิบายโค้ดและขั้นตอนทั้งหมดแบบละเอียด

### 12.7.1 ต่อวงจร

| อุปกรณ์ | ขาอุปกรณ์ | ESP32-S3 |
|:---|:---|:---|
| AHT25 | VDD / GND | 3V3 / GND |
| AHT25 | SDA / SCL | GPIO 8 / GPIO 9 |
| ปุ่ม 1 ไฟ (`light`) | ขาหนึ่ง / อีกขา | GPIO 4 / GND |
| ปุ่ม 2 ปั๊ม (`pump`) | ขาหนึ่ง / อีกขา | GPIO 5 / GND |
| ปุ่ม 3 พัดลม (`fan`) | ขาหนึ่ง / อีกขา | GPIO 6 / GND |

- ลำดับขาของโมดูล AHT25 แต่ละยี่ห้อไม่เหมือนกัน ให้ดูตามที่พิมพ์ไว้บนบอร์ด และห้ามต่อเข้า 5V
- ปุ่มไม่ต้องต่อตัวต้านทานเพิ่ม เพราะใช้ `INPUT_PULLUP` ภายในชิป
- ปุ่มทำงานแบบ **Toggle** กดครั้งแรกเป็นการเปิด กดอีกครั้งเป็นการปิด ทุกครั้งที่กดจะบันทึกลงตาราง `events` 1 แถว

### 12.7.2 ตั้งค่า Arduino IDE

1. **Boards Manager** → ติดตั้ง **esp32 by Espressif Systems**
2. **Library Manager** → ติดตั้ง **Adafruit AHTX0** (จะติดตั้ง Adafruit BusIO และ Adafruit Unified Sensor ให้ด้วย)
3. **Tools** → Board: **ESP32S3 Dev Module** → **USB CDC On Boot: Enabled** ถ้าไม่เปิด Serial Monitor จะไม่แสดงอะไรเมื่อเสียบสายที่พอร์ต USB ตรงของชิป
4. Wi-Fi: ESP32-S3 รองรับเฉพาะ 2.4 GHz และใช้กับเครือข่ายแบบ WPA2-Enterprise หรือแบบที่ต้อง login ผ่านหน้าเว็บ (Captive Portal) ไม่ได้ ถ้า Wi-Fi มหาวิทยาลัยเป็นแบบนั้น ให้ใช้ Hotspot จากมือถือแทน

### 12.7.3 สร้างฐานข้อมูลบน Supabase

ฐานข้อมูลของระบบนี้มี 2 ตาราง (ดูเหตุผลที่แยกตารางในหัวข้อ 12.3.1) โดยคำสั่ง SQL ในข้อ 2 จะสร้างตารางตามโครงสร้างด้านล่าง

**ตาราง `telemetry`: ค่าเซนเซอร์ที่ส่งทุก 5 วินาที**

| คอลัมน์ | ชนิดข้อมูล | ค่าเริ่มต้น / เงื่อนไข | ผู้กำหนดค่า | ความหมาย | ตัวอย่าง |
|:---|:---|:---|:---|:---|:---|
| `id` | `bigint` (`int8`) | Primary key, identity (เพิ่มอัตโนมัติ) | ฐานข้อมูล | เลขลำดับแถว | `1024` |
| `created_at` | `timestamptz` (`timestamptz`) | `not null`, `default now()` | ฐานข้อมูล | เวลาที่บันทึก (เก็บเป็น UTC) | `2026-09-28 03:15:05+00` |
| `device_id` | `text` (`text`) | `not null` | ESP32-S3 | รหัสอุปกรณ์ | `mcc01` |
| `temp` | `real` (`float4`) | -40 ถึง 120 (ตรวจโดย RLS policy) | ESP32-S3 | อุณหภูมิ (°C) | `31.4` |
| `hum` | `real` (`float4`) | 0 ถึง 100 (ตรวจโดย RLS policy) | ESP32-S3 | ความชื้นสัมพัทธ์ (%RH) | `58.2` |

Index: `telemetry_device_time_idx` บนคอลัมน์ `(device_id, created_at desc)`

**ตาราง `events`: การเปิด/ปิดอุปกรณ์จากการกดปุ่ม**

| คอลัมน์ | ชนิดข้อมูล | ค่าเริ่มต้น / เงื่อนไข | ผู้กำหนดค่า | ความหมาย | ตัวอย่าง |
|:---|:---|:---|:---|:---|:---|
| `id` | `bigint` (`int8`) | Primary key, identity (เพิ่มอัตโนมัติ) | ฐานข้อมูล | เลขลำดับแถว | `57` |
| `created_at` | `timestamptz` (`timestamptz`) | `not null`, `default now()` | ฐานข้อมูล | เวลาที่กดปุ่ม (เก็บเป็น UTC) | `2026-09-28 03:16:12+00` |
| `device_id` | `text` (`text`) | `not null` | ESP32-S3 | รหัสอุปกรณ์ | `mcc01` |
| `event` | `text` (`text`) | `not null`, รับเฉพาะ `light` / `pump` / `fan` | ESP32-S3 | อุปกรณ์ที่ถูกสั่ง (ปุ่ม GPIO 4 / 5 / 6) | `fan` |
| `state` | `boolean` (`bool`) | `not null` | ESP32-S3 | สถานะหลังกดปุ่ม (`true` = เปิด, `false` = ปิด) | `true` |

Index: `events_device_time_idx` บนคอลัมน์ `(device_id, created_at desc)`

ชื่อในวงเล็บคือชื่อที่ **Table Editor** ของ Supabase แสดง (เป็นชื่อย่อของชนิดเดียวกันใน PostgreSQL)

**เหตุผลการเลือกชนิดข้อมูล** (ตามคำแนะนำใน [Supabase Docs: Data types](https://supabase.com/docs/guides/database/tables#data-types))

| ชนิดข้อมูล | ใช้กับ | เหตุผล |
|:---|:---|:---|
| `bigint` แทน `integer` | `id` | `integer` เก็บได้สูงสุดประมาณ 2.1 พันล้าน และ identity อาจข้ามเลข จึงอาจเต็มก่อนมีข้อมูลครบจำนวนนั้น ข้อมูลที่ส่งทุก 5 วินาทีจะสะสมเร็วมาก |
| `generated always as identity` | `id` | ฐานข้อมูลเป็นผู้กำหนดเลขเท่านั้น ถ้า ESP32 ส่ง `id` มาเองจะถูกปฏิเสธ (แบบ `by default` ยอมให้ใส่เองได้) |
| `timestamptz` แทน `timestamp` | `created_at` | เก็บเป็นช่วงเวลาจริง (UTC) แล้วแสดงตาม time zone ของผู้ดู ส่วน `timestamp` ไม่รู้ time zone จึงเทียบเวลาข้ามประเทศหรือข้ามระบบผิดได้ |
| `text` แทน `varchar(n)` | `device_id`, `event` | ใช้พื้นที่เท่ากันแต่ไม่จำกัดความยาว ถ้าต้องการจำกัดค่าให้ใช้ `check` constraint แบบที่ใช้กับ `event` |
| `boolean` | `state` | มีได้เพียง 2 สถานะ (เปิด/ปิด) ตรงกับความหมายของข้อมูล |
| `real` แทน `numeric` | `temp`, `hum` | เอกสารแนะนำ `numeric` สำหรับเงินและทศนิยมที่ต้องแม่นยำแบบตรงเป๊ะ เพราะ `real` เก็บค่าบางค่า เช่น 0.10 แบบตรงเป๊ะไม่ได้ แต่ `real` แม่นยำประมาณ 6–7 หลักนัยสำคัญ ความคลาดเคลื่อนจึงเล็กกว่าความแม่นยำของ AHT25 (±0.3 °C, ±2 %RH) มาก และข้อมูลเซนเซอร์ไม่ได้ถูกบวกสะสมแบบยอดเงิน `real` ยังใช้เพียง 4 ไบต์และคำนวณเร็วกว่า |

**ตัวอย่างข้อมูลหลังระบบทำงาน** (Table Editor แสดงเวลาเป็น UTC ดังนั้น `03:15` คือ 10:15 น. ตามเวลาไทย)

`telemetry`

| id | created_at | device_id | temp | hum |
|---:|:---|:---|---:|---:|
| 1024 | 2026-09-28 03:15:05+00 | mcc01 | 31.4 | 58.2 |
| 1025 | 2026-09-28 03:15:10+00 | mcc01 | 31.5 | 58.0 |
| 1026 | 2026-09-28 03:15:15+00 | mcc01 | 31.5 | 57.9 |

`events`

| id | created_at | device_id | event | state | มาจาก |
|---:|:---|:---|:---|:---|:---|
| 57 | 2026-09-28 03:16:12+00 | mcc01 | light | true | ปุ่ม GPIO 4 (เปิดไฟ) |
| 58 | 2026-09-28 03:20:45+00 | mcc01 | fan | true | ปุ่ม GPIO 6 (เปิดพัดลม) |
| 59 | 2026-09-28 03:48:02+00 | mcc01 | fan | false | ปุ่ม GPIO 6 (ปิดพัดลม) |
| 60 | 2026-09-28 05:42:30+00 | mcc01 | pump | true | ปุ่ม GPIO 5 (เปิดปั๊ม) |

ทั้งสองตารางไม่ได้เชื่อมกันด้วย Foreign key แต่เชื่อมกันด้วย `device_id` และช่วงเวลา `created_at` เช่น Annotation บน Grafana จะนำ event `fan` ไปวางบนกราฟ `telemetry` ของอุปกรณ์เดียวกัน ณ เวลาเดียวกัน

**สิทธิ์ของแต่ละ role** (หลัก Least Privilege ในหัวข้อ 12.3.3)

| Role | `telemetry` | `events` | ใช้โดย |
|:---|:---|:---|:---|
| `anon` | `INSERT` เท่านั้น | `INSERT` เท่านั้น | ESP32-S3 (ผ่าน Publishable key) |
| `grafana_ro` | `SELECT` เท่านั้น | `SELECT` เท่านั้น | Grafana Cloud (ผ่าน Session Pooler) |
| `postgres` | ทั้งหมด | ทั้งหมด | ผู้ดูแลระบบ (SQL Editor / Table Editor) |

**ขั้นตอน**

1. สมัครที่ [supabase.com](https://supabase.com) → **New project** → ตั้งชื่อ `mcc-monitor` → ตั้ง Database Password → Region **Southeast Asia (Singapore)**
2. เมนู **SQL Editor** → **New query** → วางคำสั่งทั้งหมดด้านล่าง → **Run**

```sql
-- ===== ตาราง =====
create table public.telemetry (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id  text not null,
  temp       real,
  hum        real
);
create index telemetry_device_time_idx on public.telemetry (device_id, created_at desc);

create table public.events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id  text not null,
  event      text not null check (event in ('light', 'pump', 'fan')),
  state      boolean not null      -- true = เปิด, false = ปิด
);
create index events_device_time_idx on public.events (device_id, created_at desc);

-- ===== เส้นทางเขียน: anon (ESP32) INSERT ได้อย่างเดียว =====
alter table public.telemetry enable row level security;
alter table public.events    enable row level security;

grant insert on public.telemetry, public.events to anon;

create policy "esp32 insert telemetry" on public.telemetry
  for insert to anon
  with check (device_id is not null
              and temp between -40 and 120
              and hum  between 0 and 100);

create policy "esp32 insert events" on public.events
  for insert to anon
  with check (device_id is not null);

-- ===== เส้นทางอ่าน: grafana_ro SELECT ได้อย่างเดียว =====
create role grafana_ro with login password 'ChangeMe-Strong-2026';
grant usage on schema public to grafana_ro;
grant select on public.telemetry, public.events to grafana_ro;

create policy "grafana read telemetry" on public.telemetry
  for select to grafana_ro using (true);
create policy "grafana read events" on public.events
  for select to grafana_ro using (true);
```

3. เปิด **Table Editor** → ตรวจว่ามีตาราง `telemetry` และ `events` ที่มีคอลัมน์ตรงกับโครงสร้างด้านบน และทั้งสองตารางแสดงสถานะ **RLS enabled**
4. **Project Settings → API Keys** → คัดลอก **Publishable key** (หรือ `anon` key ในแท็บ Legacy) และ **Project URL** เก็บไว้

### 12.7.4 โปรแกรม ESP32-S3 (`mcc_monitor.ino`)

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
const char* SUPABASE_KEY = "YOUR_PUBLISHABLE_OR_ANON_KEY";
const char* DEVICE_ID    = "mcc01";

#define I2C_SDA 8
#define I2C_SCL 9
const uint8_t BTN_PINS[3]   = {4, 5, 6};
const char*   BTN_EVENTS[3] = {"light", "pump", "fan"};   // GPIO 4 / 5 / 6

const unsigned long SEND_INTERVAL = 5000;   // ms
const unsigned long DEBOUNCE_MS   = 50;     // ms

Adafruit_AHTX0   aht;
WiFiClientSecure tls;
unsigned long    lastSend = 0;

// ตัวแปรที่ใช้ร่วมกับ ISR ต้องเป็น volatile
volatile bool          btnPending[3]  = {false, false, false};
volatile unsigned long btnLastEdge[3] = {0, 0, 0};

// สถานะเปิด/ปิดของ light, pump, fan (เริ่มต้นปิดทั้งหมด)
bool btnState[3] = {false, false, false};

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

int postJson(const char* table, const char* body) {
  HTTPClient http;
  http.begin(tls, String(SUPABASE_URL) + table);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Prefer", "return=minimal");
  http.addHeader("apikey", SUPABASE_KEY);
  if (strncmp(SUPABASE_KEY, "eyJ", 3) == 0) {           // legacy anon key (JWT)
    http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY);
  }
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

  for (int i = 0; i < 3; i++) {
    pinMode(BTN_PINS[i], INPUT_PULLUP);
    attachInterruptArg(BTN_PINS[i], onButtonChange, (void*)(intptr_t)i, CHANGE);
  }

  tls.setInsecure();   // สำหรับห้องแล็บ งานจริงให้ใช้ tls.setCACert(rootCA)
  connectWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();

  // 1) เหตุการณ์จากปุ่ม: สลับสถานะเปิด/ปิด แล้วส่งทันที
  for (int i = 0; i < 3; i++) {
    if (btnPending[i]) {
      btnPending[i] = false;
      btnState[i] = !btnState[i];                        // Toggle
      char body[96];
      snprintf(body, sizeof(body),
               "{\"device_id\":\"%s\",\"event\":\"%s\",\"state\":%s}",
               DEVICE_ID, BTN_EVENTS[i], btnState[i] ? "true" : "false");
      postJson("events", body);
    }
  }

  // 2) ค่าเซนเซอร์: ส่งทุก SEND_INTERVAL
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
| `attachInterruptArg(..., CHANGE)` | ใช้ ISR ตัวเดียวกับทั้ง 3 ปุ่ม โดยส่งหมายเลขปุ่ม `i` เป็นอาร์กิวเมนต์ |
| `IRAM_ATTR` | เก็บ ISR ไว้ใน RAM ภายใน เพื่อให้ตอบสนองได้เร็ว และทำงานได้แม้ cache ของ flash ถูกปิดชั่วคราว |
| Debounce ใน ISR | ขอบสัญญาณที่ห่างจากครั้งก่อนไม่ถึง 50 ms ถูกทิ้ง และช่วงเงียบถูกยืดออก ขอบแรกที่ผ่านเงื่อนไขจะนับเป็นการกดเมื่อขาอ่านได้ `LOW` เท่านั้น กดหนึ่งครั้งจึงได้หนึ่ง event การปล่อยปุ่มหรือกดค้างไม่ทำให้นับซ้ำ |
| `volatile` | บอกคอมไพเลอร์ว่าตัวแปรถูกแก้จาก ISR ได้ทุกเมื่อ ต้องอ่านจากหน่วยความจำจริงทุกครั้ง |
| `btnState[i] = !btnState[i]` | ปุ่มแบบ Toggle กดแต่ละครั้งสลับสถานะของอุปกรณ์นั้น แล้วส่ง `state` เป็น JSON boolean (`true`/`false` ไม่มีเครื่องหมายคำพูด) ตัวแปรนี้แก้เฉพาะใน `loop()` จึงไม่ต้องเป็น `volatile` |
| `millis()` แทน `delay()` | `loop()` ไม่ถูกบล็อก จึงตรวจ flag ของปุ่มได้ถี่ แม้ยังไม่ถึงรอบส่งเซนเซอร์ |
| `snprintf` | สร้าง JSON ลงบัฟเฟอร์ขนาดคงที่ ช่วยเลี่ยงการจองหน่วยความจำซ้ำ ๆ ของ `String` ซึ่งทำให้ heap แตกกระจายเมื่อรันนาน ๆ |
| `strncmp(SUPABASE_KEY, "eyJ", 3)` | key แบบ legacy เป็น JWT ซึ่งขึ้นต้นด้วย `eyJ` เสมอ จึงต้องส่ง `Authorization` เพิ่ม ส่วน Publishable key แบบใหม่ส่งแค่ `apikey` (รูปแบบ key ของ Supabase เปลี่ยนมาแล้วระยะหนึ่ง ควรตรวจกับ[เอกสารทางการ](https://supabase.com/docs/guides/api/api-keys)อีกครั้ง) |

> **ข้อจำกัดด้านเวลา:** ฐานข้อมูลประทับเวลาตอนที่ข้อมูลมาถึง event จึงอาจช้ากว่าเวลากดจริงประมาณ 1–2 วินาทีตามเวลาส่ง HTTPS ซึ่งยอมรับได้สำหรับงานบำรุงรักษา ถ้าต้องการเวลาระดับมิลลิวินาที ให้ซิงก์นาฬิกาด้วย NTP แล้วส่ง `created_at` ไปเอง

> **ข้อจำกัดของ Toggle:** `btnState` เก็บอยู่ใน RAM เมื่อ ESP32-S3 รีบูต สถานะจะกลับเป็นปิดทั้งหมด ถ้าก่อนรีบูตอุปกรณ์เปิดอยู่ การกดครั้งถัดไปจะบันทึกเป็น `true` ซ้ำ ในงานจริงควรเก็บสถานะไว้ใน flash (ไลบรารี `Preferences`) หรืออ่านสถานะล่าสุดจากตาราง `events` ตอนเริ่มทำงาน

> **ไม่มีบอร์ดจริง?** ใช้ [Wokwi](https://wokwi.com) เลือกบอร์ด ESP32-S3 แทนได้ AHT25 ไม่มีใน Wokwi จึงต้องใช้ DHT22 แทน โดยเปลี่ยนเฉพาะส่วนอ่านเซนเซอร์เป็น `dht.readTemperature()` / `dht.readHumidity()` และใช้ Wi-Fi `Wokwi-GUEST`

### 12.7.5 เชื่อม Grafana Cloud

1. ใน Supabase คลิก **Connect** ด้านบนของหน้าโปรเจกต์ → เลือก **Session pooler** → จดค่า host (เช่น `aws-0-ap-southeast-1.pooler.supabase.com`), port `5432` และ project ref (ส่วนต่อท้ายของ user `postgres.xxxx`)
2. สมัครที่ [grafana.com](https://grafana.com) → แผน **Free** → สร้าง Stack
3. **Connections → Data sources → Add data source → PostgreSQL** แล้วกรอกค่าดังนี้

| ช่อง | ค่า |
|:---|:---|
| Host URL | `aws-0-ap-southeast-1.pooler.supabase.com:5432` (ตามโปรเจกต์ของตนเอง) |
| Database name | `postgres` |
| Username | `grafana_ro.xxxx` (ชื่อ role + จุด + project ref) |
| Password | รหัสผ่านของ `grafana_ro` |
| TLS/SSL Mode | `require` |
| TimescaleDB | ปิด |

4. **Save & test** → ต้องขึ้น ✅ *Database Connection OK*

### 12.7.6 สร้าง Panel ตาม Layout ในหัวข้อ 12.6

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

**Stat เปิดพัดลมวันนี้** (นับจำนวนครั้งที่เปิดพัดลมตามเวลาไทย)

```sql
SELECT count(*) AS "เปิดพัดลมวันนี้"
FROM events
WHERE device_id = '$device' AND event = 'fan' AND state = true
  AND created_at >= date_trunc('day', now() AT TIME ZONE 'Asia/Bangkok') AT TIME ZONE 'Asia/Bangkok';
```

`AT TIME ZONE` สองชั้นคือ แปลงเวลาปัจจุบันเป็นเวลาไทย ตัดให้เหลือเที่ยงคืน แล้วแปลงกลับเป็น `timestamptz` ถ้าใช้ `date_trunc('day', now())` ตรง ๆ วันใหม่จะเริ่มตอน 07:00 น. ตามเวลาไทย เพราะ `now()` เป็นเวลา UTC

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

**Annotation เปิด/ปิดพัดลม:** Dashboard **Settings → Annotations → New** → เลือก data source PostgreSQL

```sql
SELECT created_at AS time,
       CASE WHEN state THEN 'เปิดพัดลม' ELSE 'ปิดพัดลม' END AS text,
       event AS tags
FROM events
WHERE device_id = '$device' AND event = 'fan'
  AND $__timeFilter(created_at);
```

เส้นหมายเหตุนี้ช่วยให้เห็นเหตุกับผลบนกราฟเดียวกัน เช่น หลังเส้น "เปิดพัดลม" อุณหภูมิในตู้ควรค่อย ๆ ลดลง

**State timeline ไฟ · ปั๊ม · พัดลม** (Format: Time series, Value mappings: `1` → "เปิด" สีเขียว, `0` → "ปิด" สีเทา)

```sql
SELECT created_at AS time, event AS metric, state::int AS value
FROM events
WHERE device_id = '$device' AND $__timeFilter(created_at)
ORDER BY 1;
```

คอลัมน์ชื่อ `metric` บอก Grafana ให้แยกข้อมูลเป็นซีรีส์ตามชื่ออุปกรณ์ จึงได้แถบ 3 แถว (light, pump, fan) ส่วน `state::int` แปลง `true`/`false` เป็น `1`/`0` ให้ใช้กับ Value mappings ได้

ตั้ง Auto-refresh ที่มุมขวาบนเป็น **10s** แล้ว **Save dashboard** ชื่อ `MCC Monitor`

### 12.7.7 ตั้งการแจ้งเตือน

1. **Alerting → Contact points → Add contact point** → Integration **Email** → ใส่อีเมล → **Test** → **Save**
2. **Alerting → Alert rules → New alert rule** → ชื่อ `MCC overheat` → Query:

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

### 12.7.8 การแก้ปัญหาที่พบบ่อย

| อาการ | สาเหตุที่เป็นไปได้ | วิธีแก้ |
|:---|:---|:---|
| Serial Monitor ไม่แสดงอะไร | ปิด USB CDC On Boot | ตั้ง **USB CDC On Boot: Enabled** แล้วอัปโหลดใหม่ |
| `AHT25 not found` | สาย SDA/SCL สลับ หรือไม่ได้จ่ายไฟ | ตรวจขาตามที่พิมพ์ไว้บนโมดูล และใช้ 3V3 |
| ต่อ Wi-Fi ไม่ขึ้น | เครือข่าย 5 GHz หรือเป็น WPA2-Enterprise | ใช้ Hotspot มือถือแบบ 2.4 GHz |
| กดปุ่มครั้งเดียวได้ 2 event | ปุ่มเด้งนานกว่า 50 ms | เพิ่ม `DEBOUNCE_MS` เป็น 80–100 |
| ได้ `401` ตลอด | key ผิด หรือใช้ legacy key แต่ไม่ส่ง `Authorization` | คัดลอก key ใหม่ และตรวจ header |
| ได้ `401/403` พร้อม code `42501` | ไม่ผ่าน RLS policy | ตรวจค่าที่ส่งกับ `with check` |
| Grafana: connection timeout | ใช้ Direct connection (IPv6) | เปลี่ยนเป็น Session pooler |
| Grafana: password authentication failed | Username ไม่มี `.project_ref` ต่อท้าย | ใช้รูปแบบ `grafana_ro.xxxx` |
| Grafana: เชื่อมต่อได้แต่ไม่มีข้อมูล | ไม่มี policy `select` ให้ `grafana_ro` | รัน `create policy "grafana read ..."` |
| Grafana: *Data is missing a time field* | Format ไม่ตรง หรือไม่มีคอลัมน์เวลา | ตั้ง Format เป็น Time series และตั้งชื่อคอลัมน์เวลาว่า `time` |

</div>

<div class="chapter-tab-content" data-tab-name="Lab 14" data-tab-icon="🔬" id="lab14" markdown="1">

## 12.8 ใบงานปฏิบัติการ Lab 14: ระบบติดตามตู้ควบคุมด้วย Supabase + Grafana

**ฮาร์ดแวร์:** ESP32-S3 DevKit + AHT25 + ปุ่มกด 3 ปุ่ม  
**เครื่องมือ (ฟรีทั้งหมด):** Arduino IDE + Supabase (Free Plan) + Grafana Cloud (Free Tier)  
**เวลา:** 3 ชั่วโมง

> ใบงานนี้ใช้ทำตามลำดับขั้นและบันทึกผล ส่วนโค้ดฉบับเต็ม SQL และคำอธิบายอยู่ในแท็บ **Hands-on** หัวข้อ 12.7

### วัตถุประสงค์ของใบงาน

- ต่อวงจร ESP32-S3 กับ AHT25 (I2C) และปุ่มกด 3 ปุ่ม (Pull-up + Interrupt) ได้
- สร้างตาราง `telemetry` และ `events` บน Supabase พร้อมกำหนดสิทธิ์ด้วย Row Level Security ได้
- ส่งข้อมูลเซนเซอร์และเหตุการณ์จากปุ่มผ่าน HTTPS POST ไปยัง REST API ได้
- เชื่อม Grafana Cloud ด้วย role อ่านอย่างเดียว แล้วสร้างแดชบอร์ดตามหลักการออกแบบที่ดีได้
- ตั้งการแจ้งเตือนอุณหภูมิสูงทางอีเมลได้

**สถานการณ์:** ติดตั้งอุปกรณ์ในตู้ควบคุมมอเตอร์ปั๊ม (MCC) เพื่อวัดอุณหภูมิและความชื้นภายในตู้ ปุ่มทั้ง 3 ปุ่มให้ผู้ควบคุมเปิด/ปิด **ไฟ** (`light`, GPIO 4), **ปั๊ม** (`pump`, GPIO 5) และ **พัดลม** (`fan`, GPIO 6) แบบ Toggle โดยทุกการกดจะถูกบันทึกพร้อมสถานะ

---

### ส่วนที่ 1: ต่อวงจรและตั้งค่า Arduino IDE (25 นาที)

#### ความรู้เบื้องต้น

- **AHT25** เป็นเซนเซอร์ดิจิทัล สื่อสารผ่าน I2C ที่ address `0x38` ESP32-S3 เลือกขา I2C ได้อิสระ บทนี้ใช้ SDA = GPIO 8 และ SCL = GPIO 9
- **ปุ่มกด** ต่อระหว่างขา GPIO กับ GND แล้วเปิด `INPUT_PULLUP` ขาจะอ่านได้ `HIGH` ตอนปล่อย และ `LOW` ตอนกด

#### ขั้นตอนปฏิบัติ

| อุปกรณ์ | ขาอุปกรณ์ | ESP32-S3 |
|:---|:---|:---|
| AHT25 | VDD / GND / SDA / SCL | 3V3 / GND / GPIO 8 / GPIO 9 |
| ปุ่ม 1 `light` | ขาหนึ่ง / อีกขา | GPIO 4 / GND |
| ปุ่ม 2 `pump` | ขาหนึ่ง / อีกขา | GPIO 5 / GND |
| ปุ่ม 3 `fan` | ขาหนึ่ง / อีกขา | GPIO 6 / GND |

1. ต่อวงจรตามตาราง โดยดูลำดับขาตามที่พิมพ์ไว้บนโมดูล AHT25 และ **ห้ามต่อเข้า 5V**
2. Arduino IDE → **Boards Manager** → ติดตั้ง **esp32 by Espressif Systems**
3. **Library Manager** → ติดตั้ง **Adafruit AHTX0**
4. **Tools** → Board **ESP32S3 Dev Module** → **USB CDC On Boot: Enabled**
5. เตรียม Wi-Fi แบบ **2.4 GHz** ที่ไม่ต้อง login ผ่านหน้าเว็บ (ใช้ Hotspot มือถือได้)

#### ตารางบันทึกผล — ส่วนที่ 1

| รายการ | สถานะ |
|:---|:---|
| ต่อวงจรครบ ตรวจแรงดันที่ขา VDD ของ AHT25 = 3.3 V | ________ |
| ติดตั้ง ESP32 core และ Adafruit AHTX0 สำเร็จ | ________ |
| ชื่อ Wi-Fi ที่ใช้ และย่านความถี่ | ________ |

---

### ส่วนที่ 2: สร้างฐานข้อมูลบน Supabase (30 นาที)

#### ขั้นตอนปฏิบัติ

1. สมัครที่ [supabase.com](https://supabase.com) → **New project** → ชื่อ `mcc-monitor` → ตั้ง Database Password → Region **Southeast Asia (Singapore)**
2. **SQL Editor → New query** → วางชุดคำสั่ง SQL จาก **หัวข้อ 12.7.3** (แท็บ Hands-on) → **Run** ชุดคำสั่งนี้สร้าง
   - ตาราง `telemetry` และ `events` พร้อม index
   - policy ให้ `anon` (ESP32) **INSERT ได้อย่างเดียว** และตรวจช่วงค่า `temp` / `hum`
   - role `grafana_ro` ที่ **SELECT ได้อย่างเดียว** (เปลี่ยนรหัสผ่านเป็นของตนเองก่อน Run)
3. **Project Settings → API Keys** → คัดลอก **Publishable key** และ **Project URL**

#### ตารางบันทึกผล — ส่วนที่ 2

| รายการ | สถานะ |
|:---|:---|
| เห็นตาราง `telemetry` และ `events` ใน Table Editor | ________ |
| RLS ของทั้งสองตารางแสดงสถานะ Enabled | ________ |
| Project URL ของฉัน | ________ |

---

### ส่วนที่ 3: โปรแกรม ESP32-S3 ส่งข้อมูล (45 นาที)

#### ความรู้เบื้องต้น

- ESP32 ส่งค่าเซนเซอร์ไปที่ `POST /rest/v1/telemetry` ทุก 5 วินาที และเมื่อกดปุ่มจะส่งไปที่ `POST /rest/v1/events` ทันที
- การส่ง HTTPS แต่ละครั้งค้างอยู่ประมาณ 0.5–2 วินาที โปรแกรมจึงอ่านปุ่มด้วย **Interrupt** เพื่อไม่ให้การกดระหว่างส่งข้อมูลหายไป และทำ **Debounce** 50 ms ใน ISR

#### ขั้นตอนปฏิบัติ

1. สร้าง sketch ใหม่ชื่อ `mcc_monitor` → คัดลอกโค้ดจาก **หัวข้อ 12.7.4** (แท็บ Hands-on)
2. แก้ค่า `WIFI_SSID`, `WIFI_PASS`, `SUPABASE_URL` (ต้องลงท้ายด้วย `/rest/v1/`) และ `SUPABASE_KEY`
3. เปลี่ยน `DEVICE_ID` เป็น `mcc-` ตามด้วยรหัสนักศึกษา 4 ตัวท้าย เช่น `mcc-1234`
4. อัปโหลด → เปิด Serial Monitor ที่ **115200** ต้องเห็น `WiFi OK` แล้วตามด้วย `POST telemetry ... -> 201` ทุก 5 วินาที
5. กดปุ่มแต่ละปุ่ม 1 ครั้ง → ต้องเห็น `POST events ... -> 201` **ครั้งเดียวต่อการกด**
6. เปิด Supabase **Table Editor** → ตรวจว่ามีแถวใหม่ในทั้งสองตาราง

#### ตารางบันทึกผล — ส่วนที่ 3

| การทดลอง | ผลใน Serial Monitor | แถวใหม่ใน Table Editor? |
|:---|:---|:---|
| รอ 30 วินาที | ได้ `201` กี่ครั้ง: ________ | ________ |
| กดปุ่ม `light` 1 ครั้ง | ค่า `state`: ________ | ________ |
| กดปุ่ม `light` อีก 1 ครั้ง | ค่า `state`: ________ | ________ |
| กดปุ่ม `fan` ค้างไว้ 3 วินาทีแล้วปล่อย | ได้ event กี่ครั้ง: ________ | ________ |
| กดปุ่ม `pump` ขณะ Serial กำลังพิมพ์ `POST telemetry` | event หายหรือไม่: ________ | ________ |
| ใช้นิ้วจับ AHT25 นาน 30 วินาที | temp เปลี่ยนจาก ____ เป็น ____ °C | ________ |
| แก้ key ผิด 1 ตัวอักษร แล้วอัปโหลดใหม่ | Status code: ________ | ________ |

---

### ส่วนที่ 4: เชื่อม Grafana Cloud และสร้างแดชบอร์ด (50 นาที)

#### ขั้นตอนปฏิบัติ

1. Supabase → **Connect** → **Session pooler** → จด host, port และ project ref
2. สมัคร [grafana.com](https://grafana.com) แผน **Free** → **Connections → Data sources → PostgreSQL** → กรอกค่าตาม **หัวข้อ 12.7.5** (Username = `grafana_ro.<project_ref>`, TLS/SSL Mode = `require`) → **Save & test**
3. สร้างแดชบอร์ดใหม่ → เพิ่มตัวแปร `device` → สร้าง panel ตาม query ใน **หัวข้อ 12.7.6** โดยจัด Layout ดังนี้

| แถว | Panel |
|:---|:---|
| 1 | Gauge อุณหภูมิ · Gauge ความชื้น · Stat สถานะการเชื่อมต่อ · Stat เปิดพัดลมวันนี้ |
| 2 | Time series อุณหภูมิ + ความชื้น พร้อม Annotation เปิด/ปิดพัดลม |
| 3 | State timeline ไฟ · ปั๊ม · พัดลม |

4. ตั้ง Auto-refresh **10s** → **Save dashboard** ชื่อ `MCC Monitor`

#### ตารางบันทึกผล — ส่วนที่ 4

| การทดลอง | ผลที่เห็นบน Dashboard |
|:---|:---|
| Save & test ของ data source | ________ |
| กด `pump` → รอ 1 นาที → กด `pump` อีกครั้ง | State timeline แถว pump: ________ |
| กด `fan` เปิด-ปิด 2 รอบ | ค่า Stat เปิดพัดลมวันนี้: ____ และเส้น Annotation: ________ |
| เปิด `fan` แล้วใช้มือบังอากาศรอบ AHT25 เทียบกับตอนปิด | แนวโน้มอุณหภูมิบนกราฟ: ________ |
| ถอดสาย USB ของ ESP32-S3 แล้วรอ 40 วินาที | ค่าและสีของ Stat สถานะการเชื่อมต่อ: ________ |
| เปลี่ยนช่วงเวลาจาก Last 15 minutes เป็น Last 24 hours | กราฟเปลี่ยนอย่างไร: ________ |

---

### ส่วนที่ 5: ตั้งการแจ้งเตือนอุณหภูมิสูง (20 นาที)

#### ขั้นตอนปฏิบัติ

1. **Alerting → Contact points** → เพิ่ม Email ของตนเอง → **Test**
2. **Alerting → Alert rules → New alert rule** → ใช้ query ใน **หัวข้อ 12.7.7** (เปลี่ยน `'mcc01'` เป็น `DEVICE_ID` ของตนเอง)
3. **Reduce** = `Last` → **Threshold** `IS ABOVE 35` → Evaluation ทุก `1m`, Pending period `2m` → **Save rule**
4. ทดสอบ: เปลี่ยน Threshold เป็นค่าที่สูงกว่าอุณหภูมิห้องเล็กน้อย เช่น `32` แล้วใช้นิ้วจับหรือเป่าลมอุ่นใส่ AHT25 ต่อเนื่อง

#### ตารางบันทึกผล — ส่วนที่ 5

| การทดลอง | สถานะ Alert (Normal / Pending / Firing) | ได้รับอีเมล? |
|:---|:---|:---|
| อุณหภูมิเกินเกณฑ์นาน 1 นาที | ________ | ________ |
| อุณหภูมิเกินเกณฑ์นาน 4 นาที | ________ | ________ |
| ปล่อยให้อุณหภูมิกลับสู่ปกติ | ________ | ________ |

---

### แบบฝึกหัดท้ายใบงาน

1. **Interrupt กับ Polling:** จากผลการทดลองในส่วนที่ 3 (กด `pump` ขณะกำลังส่งข้อมูล) อธิบายว่าถ้าโปรแกรมอ่านปุ่มด้วย `digitalRead()` ใน `loop()` แทน Interrupt ผลจะต่างไปอย่างไร เพราะเหตุใด

   > คำตอบ: _______________________________________________________________

2. **Debounce:** จากการกดปุ่ม `fan` ค้างไว้ 3 วินาที ทำไมโปรแกรมจึงนับเป็นเพียง 1 event? อธิบายโดยอ้างอิงเงื่อนไขในฟังก์ชัน `onButtonChange()`

   > คำตอบ: _______________________________________________________________

3. **ความปลอดภัย:** ถ้ามีผู้ไม่หวังดีนำ Publishable key ออกจากเฟิร์มแวร์ของ ESP32-S3 ได้ เขาจะทำอะไรกับฐานข้อมูลได้บ้าง และทำอะไรไม่ได้บ้าง? อ้างอิง policy ที่สร้างในส่วนที่ 2

   > คำตอบ: _______________________________________________________________

4. **ประยุกต์งานเครื่องกล:** ถ้าต้องการรู้ว่า "เปิดพัดลมระบายอากาศแล้ว อุณหภูมิเฉลี่ยในตู้ลดลงหรือไม่" จะใช้ panel ใดบนแดชบอร์ด และเขียน SQL เปรียบเทียบอุณหภูมิเฉลี่ย 10 นาทีก่อนและหลัง event `fan` ที่ `state = true` ล่าสุดอย่างไร

   > คำตอบ: _______________________________________________________________

---

### การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จากอาจารย์ผู้สอน)**

สิ่งที่ต้องส่ง:
1. รูปถ่ายวงจรจริง ESP32-S3 + AHT25 + ปุ่ม 3 ปุ่ม
2. Screenshot Serial Monitor ที่แสดง `POST telemetry ... -> 201` และ `POST events ... -> 201`
3. Screenshot Supabase Table Editor ของตาราง `telemetry` (อย่างน้อย 20 แถว) และ `events`
4. Screenshot แดชบอร์ด `MCC Monitor` ที่มีครบ 3 แถวตาม Layout
5. Screenshot Alert rule สถานะ Firing หรืออีเมลแจ้งเตือนที่ได้รับ
6. คำตอบแบบฝึกหัดท้ายใบงานครบทุกข้อ

#### Checklist ก่อนส่ง

- [ ] `DEVICE_ID` เป็นรูปแบบ `mcc-` ตามด้วยรหัสนักศึกษา 4 ตัวท้าย
- [ ] ESP32-S3 ใช้ Publishable/anon key เท่านั้น ไม่ใช่ Secret หรือ `service_role` key
- [ ] ทั้งสองตารางเปิด RLS และมี policy ครบ
- [ ] Grafana เชื่อมต่อด้วย role `grafana_ro` ผ่าน Session pooler
- [ ] กดปุ่ม 1 ครั้งได้ 1 event เสมอ
- [ ] แดชบอร์ดมีตัวแปร `device` และตั้ง Auto-refresh 10s
- [ ] Alert rule ทำงานและส่งอีเมลได้
- [ ] กรอกตารางบันทึกผลครบทุกส่วน
- [ ] ระบุชื่อ-นามสกุล และรหัสนักศึกษาในฟอร์ม

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="summary" markdown="1">

## 12.9 สรุปประจำบทที่ 12 (Summary)

1. **ระบบ IoT แบบครบวงจร** ประกอบด้วย 4 ชั้น ได้แก่ เซนเซอร์และปุ่ม (AHT25) อุปกรณ์เครือข่าย (ESP32-S3 + HTTPS) ฐานข้อมูลคลาวด์ (Supabase/PostgreSQL) และแอปพลิเคชันแสดงผล (Grafana)
2. **AHT25** สื่อสารผ่าน I2C ที่ address `0x38` ให้ค่าดิบ 20 บิต ซึ่งแปลงเป็นหน่วยจริงได้ด้วย $RH = S_{RH}/2^{20} \times 100$ และ $T = S_T/2^{20} \times 200 - 50$ ความละเอียดของค่าไม่ใช่ความแม่นยำ
3. **ปุ่มกด** ต้องใช้ Pull-up และ Debounce และควรอ่านด้วย **Interrupt** เมื่อโปรแกรมมีงานที่บล็อกนาน เช่น การส่ง HTTPS
4. **Telemetry กับ Event** เป็นข้อมูลต่างประเภทกัน จึงควรแยกตาราง และเลือก panel ให้ตรงกับประเภทข้อมูล
5. **Row Level Security และ Least Privilege** แยกสิทธิ์ของเส้นทางเขียน (`anon` → `INSERT`) กับเส้นทางอ่าน (`grafana_ro` → `SELECT`) ข้อมูลจึงยังปลอดภัยแม้ key ตัวใดตัวหนึ่งรั่ว
6. **Grafana** ดึงข้อมูลด้วย SQL และ Macro (`$__timeFilter`, `$__timeGroupAlias`, `$__interval`) พร้อมทำ Downsampling ให้พอดีกับความกว้างของกราฟ
7. **แดชบอร์ดที่ดี** ต้องเข้าใจได้ใน 3 วินาที วางภาพรวมไว้บน ใช้สีเพื่อบอกสถานะเท่านั้น และติดหน่วยทุก panel

### ตารางอ้างอิงด่วน

| หัวข้อ | ค่า / คำสั่ง |
|:---|:---|
| I2C ของ AHT25 | address `0x38`, SDA = GPIO 8, SCL = GPIO 9 |
| REST endpoint | `POST https://<ref>.supabase.co/rest/v1/<table>` |
| HTTP สำเร็จ | `201 Created` |
| Pooler สำหรับ Grafana | `aws-0-<region>.pooler.supabase.com:5432`, user `grafana_ro.<ref>`, SSL `require` |
| กรองช่วงเวลา | `$__timeFilter(created_at)` |
| Downsampling | `$__timeGroupAlias(created_at, $__interval)` + `avg()` + `GROUP BY 1` |
| เริ่มต้นวันตามเวลาไทย | `date_trunc('day', now() AT TIME ZONE 'Asia/Bangkok') AT TIME ZONE 'Asia/Bangkok'` |

> ℹ️ **แผนฟรี:** Supabase Free Plan และ Grafana Cloud Free Tier มีโควตาจำกัด เช่น พื้นที่ฐานข้อมูล จำนวนผู้ใช้ และการ pause โปรเจกต์ที่ไม่มีการใช้งาน เงื่อนไขเหล่านี้อาจเปลี่ยนได้ ควรตรวจสอบหน้าราคาของผู้ให้บริการก่อนเริ่มภาคการศึกษา

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 12.10 แบบฝึกหัดท้ายบทที่ 12 (Exercises)

**ข้อ 1:** AHT25 ส่งค่าดิบของความชื้น $S_{RH} = 629{,}146$ และอุณหภูมิ $S_T = 419{,}430$ จงคำนวณความชื้นสัมพัทธ์ (%RH) และอุณหภูมิ (°C) พร้อมอธิบายว่าทำไมจึงควรรายงานผลเพียงทศนิยม 1 ตำแหน่ง

**ข้อ 2:** อธิบายว่าถ้าเปลี่ยนการอ่านปุ่มจาก Interrupt เป็น Polling ใน `loop()` จะเกิดปัญหาอะไรกับระบบนี้ และปัญหานั้นเกี่ยวข้องกับการส่ง HTTPS อย่างไร

**ข้อ 3:** ถ้าเปลี่ยนให้ Grafana เชื่อมต่อด้วย user `postgres` แทน `grafana_ro` ระบบยังทำงานได้ แต่ความเสี่ยงเพิ่มขึ้นอย่างไร? ยกตัวอย่างเหตุการณ์ที่อาจเกิดขึ้นในโรงงาน

**ข้อ 4:** ถ้าเลือกช่วงเวลา Last 30 days บนกราฟกว้าง 1,200 พิกเซล จะมีข้อมูลดิบในตาราง `telemetry` กี่แถว และ `$__interval` ควรมีค่าประมาณเท่าใด? แสดงวิธีคำนวณ

**ข้อ 5:** ความชื้นในตู้ควบคุมจะเสี่ยงเกิดหยดน้ำเมื่ออุณหภูมิลดลงถึงจุดน้ำค้าง (Dew Point) จงเขียนคำสั่ง SQL สำหรับ Grafana ที่คำนวณ Dew Point จากคอลัมน์ `temp` และ `hum` ด้วยสมการ Magnus โดยประมาณ $T_d = \frac{b\,\gamma}{a - \gamma}$ เมื่อ $\gamma = \ln(RH/100) + \frac{a\,T}{b + T}$, $a = 17.62$, $b = 243.12\ ^\circ C$

**ข้อ 6 (ออกแบบ):** โรงงานมีตู้ควบคุม 20 ตู้ แต่ละตู้มี ESP32-S3 หนึ่งตัว จงออกแบบ
- (ก) ค่า `device_id` ที่สื่อความหมาย
- (ข) Layout แดชบอร์ดภาพรวมที่ให้หัวหน้าช่างเห็นได้ทันทีว่าตู้ใดผิดปกติ
- (ค) คำนวณพื้นที่ฐานข้อมูลที่ใช้ต่อเดือน แล้วเสนอแนวทางลดขนาดข้อมูลเก่า

</div>
