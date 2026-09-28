# 📊 บทเรียนเสริม: แดชบอร์ด IoT ด้วย Supabase + Grafana Cloud

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**บทที่เกี่ยวข้อง:** บทที่ 8 (HTTP/REST), บทที่ 10 (ฐานข้อมูล), บทที่ 12 (Grafana)  
**เครื่องมือ (ฟรีทั้งหมด):** Wokwi Simulator + Supabase (Free Plan) + Grafana Cloud (Free Tier)  
**เวลา:** 3 ชั่วโมง

---

## วัตถุประสงค์

- อธิบายเส้นทางข้อมูลจากเซนเซอร์ไปจนถึงแดชบอร์ด และแยก **เส้นทางเขียน (Write Path)** ออกจาก **เส้นทางอ่าน (Read Path)** ได้
- สร้างตารางข้อมูลอนุกรมเวลาบน PostgreSQL (Supabase) พร้อมกำหนดสิทธิ์ด้วย Row Level Security (RLS) ได้
- เขียนโปรแกรม ESP32 ส่งข้อมูล JSON ผ่าน HTTPS POST ไปยัง REST API ได้
- เชื่อม Grafana Cloud กับ PostgreSQL ด้วยบัญชีผู้ใช้แบบอ่านอย่างเดียว (Read-only Role) ได้
- เขียนคำสั่ง SQL ร่วมกับ Macro ของ Grafana เพื่อสร้างกราฟ เกจ และสถานะเครื่องจักร พร้อมตั้งการแจ้งเตือนได้

---

## ภาพรวมสถาปัตยกรรม

ในบทเรียนนี้ เราจำลองงาน **Predictive Maintenance** ของปั๊มน้ำในโรงงาน ESP32 วัดอุณหภูมิตัวเรือนปั๊มและระดับการสั่นสะเทือน แล้วส่งขึ้นฐานข้อมูลทุก 5 วินาที ส่วนช่างซ่อมบำรุงดูแนวโน้มผ่านแดชบอร์ด Grafana ได้จากทุกที่

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 900 310" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif" role="img" aria-label="ESP32 เขียนข้อมูลผ่าน REST API ของ Supabase ส่วน Grafana Cloud อ่านข้อมูลผ่าน Session Pooler ด้วย role อ่านอย่างเดียว">
  <title>เส้นทางเขียน (ESP32 → REST API → PostgreSQL) และเส้นทางอ่าน (PostgreSQL → Pooler → Grafana → ผู้ใช้)</title>
  <style>
    .sg-bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; }
    .sg-box { fill: #ffffff; stroke: #475569; stroke-width: 2; }
    .sg-esp { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2.5; }
    .sg-db { fill: #ecfdf5; stroke: #059669; stroke-width: 2.5; }
    .sg-gf { fill: #fff7ed; stroke: #ea580c; stroke-width: 2.5; }
    .sg-cloud { fill: #f0fdf4; stroke: #059669; stroke-width: 1.5; stroke-dasharray: 6 5; }
    .sg-w { fill: none; stroke: #059669; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: sg-flow 1.6s linear infinite; }
    .sg-r { fill: none; stroke: #2f5597; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: sg-flow 1.6s linear infinite; }
    .sg-t { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .sg-l { font-size: 12px; fill: #64748b; font-weight: 500; }
    .sg-c { font-size: 11px; font-family: monospace; font-weight: 700; fill: #475569; }
    .sg-cw { font-size: 11px; font-family: monospace; font-weight: 700; fill: #059669; }
    .sg-cr { font-size: 11px; font-family: monospace; font-weight: 700; fill: #2f5597; }
    @keyframes sg-flow { to { stroke-dashoffset: -36; } }
    @media (prefers-reduced-motion: reduce) { .sg-w, .sg-r { animation: none; } }
  </style>
  <rect x="5" y="5" width="890" height="300" rx="10" class="sg-bg"/>
  <!-- ESP32 -->
  <rect x="20" y="70" width="150" height="140" rx="8" class="sg-esp"/>
  <text x="95" y="98" text-anchor="middle" class="sg-t">ESP32</text>
  <text x="95" y="124" text-anchor="middle" class="sg-l">DHT22 → temp</text>
  <text x="95" y="144" text-anchor="middle" class="sg-l">Pot → vib</text>
  <text x="95" y="190" text-anchor="middle" class="sg-c">Wokwi</text>
  <!-- write: ESP32 → REST -->
  <path d="M 170 100 L 246 100" class="sg-w"/>
  <polygon points="246,95 256,100 246,105" fill="#059669"/>
  <text x="211" y="90" text-anchor="middle" class="sg-cw">HTTPS POST</text>
  <text x="211" y="120" text-anchor="middle" class="sg-l">ทุก 5 วินาที</text>
  <!-- Supabase container -->
  <rect x="230" y="30" width="345" height="240" rx="12" class="sg-cloud"/>
  <text x="246" y="52" class="sg-cw">SUPABASE (PostgreSQL)</text>
  <rect x="256" y="70" width="140" height="60" rx="8" class="sg-box"/>
  <text x="326" y="96" text-anchor="middle" class="sg-t">REST API</text>
  <text x="326" y="116" text-anchor="middle" class="sg-c">anon key</text>
  <rect x="416" y="70" width="140" height="60" rx="8" class="sg-box"/>
  <text x="486" y="96" text-anchor="middle" class="sg-t">Session Pooler</text>
  <text x="486" y="116" text-anchor="middle" class="sg-c">port 5432</text>
  <rect x="256" y="170" width="300" height="80" rx="8" class="sg-db"/>
  <text x="406" y="198" text-anchor="middle" class="sg-t">ตาราง telemetry</text>
  <text x="406" y="222" text-anchor="middle" class="sg-c">RLS: anon INSERT · grafana_ro SELECT</text>
  <!-- write: REST → table -->
  <path d="M 326 130 L 326 160" class="sg-w"/>
  <polygon points="321,160 326,170 331,160" fill="#059669"/>
  <text x="336" y="154" class="sg-cw">INSERT</text>
  <!-- read: table → pooler -->
  <path d="M 486 170 L 486 140" class="sg-r"/>
  <polygon points="481,140 486,130 491,140" fill="#2f5597"/>
  <text x="496" y="154" class="sg-cr">SELECT</text>
  <!-- read: pooler → Grafana -->
  <path d="M 556 100 L 620 100" class="sg-r"/>
  <polygon points="620,95 630,100 620,105" fill="#2f5597"/>
  <text x="593" y="90" text-anchor="middle" class="sg-cr">SQL + TLS</text>
  <text x="593" y="120" text-anchor="middle" class="sg-c">grafana_ro</text>
  <!-- Grafana -->
  <rect x="630" y="70" width="130" height="140" rx="8" class="sg-gf"/>
  <text x="695" y="98" text-anchor="middle" class="sg-t">Grafana Cloud</text>
  <polyline points="648,170 666,160 684,164 702,146 720,150 742,128" fill="none" stroke="#ea580c" stroke-width="2.5"/>
  <circle cx="742" cy="128" r="3.5" fill="#ea580c"/>
  <text x="695" y="196" text-anchor="middle" class="sg-c">refresh 10s</text>
  <!-- Grafana → user -->
  <path d="M 760 140 L 790 140" class="sg-r"/>
  <polygon points="790,135 800,140 790,145" fill="#2f5597"/>
  <rect x="800" y="90" width="85" height="100" rx="8" class="sg-box"/>
  <text x="842" y="132" text-anchor="middle" class="sg-t">ผู้ใช้</text>
  <text x="842" y="154" text-anchor="middle" class="sg-l">เบราว์เซอร์</text>
  <!-- legend -->
  <line x1="240" y1="290" x2="272" y2="290" stroke="#059669" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="280" y="294" class="sg-l">เส้นทางเขียน (Write Path)</text>
  <line x1="480" y1="290" x2="512" y2="290" stroke="#2f5597" stroke-width="4" stroke-dasharray="8 10"/>
  <text x="520" y="294" class="sg-l">เส้นทางอ่าน (Read Path)</text>
</svg>
</div>

ระบบนี้แยกเส้นทางข้อมูลเป็น 2 เส้นอย่างตั้งใจ

| เส้นทาง | ใครใช้ | โปรโตคอล | สิทธิ์ที่ได้ |
|:---|:---|:---|:---|
| **เขียน (Write)** | ESP32 | HTTPS → REST API (PostgREST) | role `anon` เขียน (`INSERT`) ได้อย่างเดียว |
| **อ่าน (Read)** | Grafana Cloud | PostgreSQL wire protocol ผ่าน TLS | role `grafana_ro` อ่าน (`SELECT`) ได้อย่างเดียว |

หลักการนี้เรียกว่า **Principle of Least Privilege** คือให้แต่ละส่วนมีสิทธิ์เท่าที่จำเป็นต่อหน้าที่เท่านั้น ถ้ารหัสผ่านของ Grafana รั่ว ผู้ไม่หวังดีก็แก้ไขหรือลบข้อมูลไม่ได้ และถ้า key ใน ESP32 ถูกดึงออกจากเฟิร์มแวร์ ก็อ่านข้อมูลย้อนหลังของโรงงานไม่ได้เช่นกัน

> **ทำไม ESP32 ไม่ต่อ PostgreSQL โดยตรง?** การเชื่อมต่อฐานข้อมูลโดยตรงต้องใช้รหัสผ่านของ role ที่มีสิทธิ์สูง และไลบรารี PostgreSQL บนไมโครคอนโทรลเลอร์ก็มีจำกัด REST API จึงเป็น "ประตูหน้า" ที่ปลอดภัยกว่า เพราะรับได้เฉพาะคำขอ HTTP มาตรฐานที่ผ่านการตรวจ RLS แล้ว

---

## ส่วนที่ 1: สร้างฐานข้อมูลบน Supabase (30 นาที)

### ความรู้เบื้องต้น

**Supabase** คือบริการ Backend-as-a-Service ที่มี **PostgreSQL** เป็นแกนกลาง ทุกตารางที่สร้างจะมี REST API ให้ใช้ทันทีผ่านเครื่องมือชื่อ **PostgREST** ซึ่งแปลงคำขอ HTTP เป็นคำสั่ง SQL ให้อัตโนมัติ

| คำขอ HTTP | คำสั่ง SQL ที่ PostgREST สร้าง |
|:---|:---|
| `POST /rest/v1/telemetry` + JSON body | `INSERT INTO telemetry (...) VALUES (...)` |
| `GET /rest/v1/telemetry?device_id=eq.pump01` | `SELECT * FROM telemetry WHERE device_id = 'pump01'` |

**การออกแบบตารางสำหรับข้อมูลอนุกรมเวลา:**
- **`created_at timestamptz default now()`** ให้ฐานข้อมูลเป็นผู้ประทับเวลา ESP32 จึงไม่ต้องมีนาฬิกาที่แม่นยำ (ไม่ต้องใช้ NTP) และ `timestamptz` เก็บเวลาเป็น UTC แล้วแสดงตาม time zone ของผู้ใช้ Grafana จึงแสดงเวลาไทย (UTC+7) ได้ถูกต้อง
- **Index `(device_id, created_at desc)`** แดชบอร์ดเกือบทุก query จะถามว่า "เครื่อง X ในช่วงเวลา Y" B-tree index ที่เรียงตามคอลัมน์ทั้งสองนี้ทำให้ PostgreSQL กระโดดไปยังช่วงข้อมูลที่ต้องการได้ทันที โดยไม่ต้องอ่านทั้งตาราง (Sequential Scan) ถ้าไม่มี index นี้ query จะช้าลงเรื่อย ๆ ตามจำนวนแถวที่สะสม
- **Row Level Security (RLS)** เป็นกฎที่ PostgreSQL ตรวจทุกครั้งที่มีการอ่านหรือเขียนแถว ถ้าเปิด RLS แล้วไม่มี policy ที่อนุญาต คำขอนั้นจะถูกปฏิเสธทั้งหมด (Deny by Default)

### ขั้นตอนปฏิบัติ

1. สมัครที่ [supabase.com](https://supabase.com) ด้วยบัญชี GitHub → **New project**
2. ตั้งชื่อโปรเจกต์ `pump-monitor` → ตั้ง **Database Password** (จดเก็บไว้) → Region เลือก **Southeast Asia (Singapore)** เพื่อลด latency → **Create new project**
3. เมื่อโปรเจกต์พร้อม ไปที่เมนู **SQL Editor** → **New query** → วางคำสั่งด้านล่าง → **Run**

```sql
-- 1) ตารางเก็บข้อมูลเซนเซอร์
create table public.telemetry (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  device_id  text not null,
  temp       real,        -- อุณหภูมิตัวเรือนปั๊ม (°C)
  vib        real         -- ระดับการสั่นสะเทือน (g)
);

-- 2) index สำหรับ query แบบ "เครื่อง X ในช่วงเวลา Y"
create index telemetry_device_time_idx
  on public.telemetry (device_id, created_at desc);

-- 3) เปิด RLS และอนุญาตให้ anon (ESP32) เขียนได้อย่างเดียว
alter table public.telemetry enable row level security;

grant insert on public.telemetry to anon;
create policy "esp32 insert only" on public.telemetry
  for insert to anon
  with check (device_id is not null and temp between -40 and 125);
```

**คำอธิบาย:**
- `generated always as identity` ให้ PostgreSQL สร้างเลข `id` เรียงกันอัตโนมัติ
- `with check (...)` เป็นด่านตรวจข้อมูลก่อนบันทึก ค่า `-40 ถึง 125 °C` คือย่านวัดของ DHT22 ถ้าเซนเซอร์เสียแล้วส่งค่าผิดปกติ เช่น `999` แถวนั้นจะถูกปฏิเสธ ไม่ปนเข้ามาในกราฟ
- ในบทเรียนนี้ **ไม่ได้** สร้าง policy `select` ให้ `anon` ดังนั้น key ที่ฝังใน ESP32 จึงใช้อ่านข้อมูลไม่ได้

4. ไปที่ **Project Settings → API Keys** → คัดลอก **Publishable key** (หรือ `anon` key ในแท็บ Legacy) และ **Project URL** (`https://xxxx.supabase.co`) เก็บไว้

> ⚠️ ห้ามใช้ **Secret key** หรือ **`service_role` key** ใน ESP32 เด็ดขาด เพราะ key กลุ่มนี้ข้าม RLS ได้ทั้งหมด

### ตารางบันทึกผล — ส่วนที่ 1

| รายการ | สถานะ |
|:---|:---|
| สร้างตาราง `telemetry` สำเร็จ (เห็นใน Table Editor) | ________ |
| RLS แสดงสถานะ Enabled | ________ |
| Project URL ของฉัน | ________ |

---

## ส่วนที่ 2: ESP32 ส่งข้อมูลผ่าน HTTPS (45 นาที)

### ความรู้เบื้องต้น

**การแปลงค่า ADC เป็นระดับการสั่นสะเทือน:** ใน Wokwi เราใช้ Potentiometer แทนเซนเซอร์สั่นสะเทือน ESP32 มี ADC ความละเอียด 12 บิต จึงอ่านค่าได้ 0–4095 เราแปลงค่านี้เป็นช่วง 0–2 g แบบเชิงเส้น

$$vib = \frac{ADC_{raw}}{4095} \times 2.0 \ \text{g}$$

เช่น อ่านได้ `2048` จะได้ `vib ≈ 1.00 g`

**รหัสสถานะ HTTP ที่ต้องรู้จัก** (ทบทวนบทที่ 8)

| Status | ความหมายในระบบนี้ |
|:---|:---|
| `201 Created` | บันทึกแถวสำเร็จ |
| `400 Bad Request` | JSON ผิดรูปแบบ หรือชื่อคอลัมน์ไม่ตรงกับตาราง |
| `401 / 403` | key ผิด หรือไม่ผ่าน RLS (เช่น ค่า temp อยู่นอกช่วงที่ policy กำหนด) |
| `-1` หรือค่าติดลบ | ESP32 เชื่อมต่อไม่ได้ (Wi-Fi หลุด หรือ TLS handshake ล้มเหลว) |

**ประเมินปริมาณข้อมูล:** ถ้าส่ง 1 แถวทุก 5 วินาที จะได้ 86,400 / 5 = **17,280 แถวต่อวัน** ถ้าแต่ละแถวรวม index ใช้พื้นที่ราว 100 ไบต์ จะใช้พื้นที่ประมาณ 1.7 MB ต่อวัน หรือราว 50 MB ต่อเดือนต่อเครื่อง ตัวเลขนี้ใช้ตัดสินใจได้ว่าควรส่งถี่แค่ไหน และต้องลบข้อมูลเก่าเมื่อใด เมื่อเทียบกับพื้นที่ฐานข้อมูลของแผนฟรี

### ขั้นตอนปฏิบัติ

**ต่อวงจร:**

| อุปกรณ์ | ขาอุปกรณ์ | ขา ESP32 |
|:---|:---|:---|
| DHT22 | VCC / GND / SDA | 3V3 / GND / GPIO 15 |
| Potentiometer | VCC / GND / SIG | 3V3 / GND / GPIO 34 |

เพิ่มไลบรารีใน Wokwi Library Manager: **`DHT sensor library`** (`WiFi`, `HTTPClient` และ `WiFiClientSecure` มากับ ESP32 core อยู่แล้ว)

### 📁 ไฟล์โครงสร้างวงจร `diagram.json`

```json
{
  "version": 1,
  "author": "KSU TechEngineering",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-dht22", "id": "dht1", "top": -140, "left": 120, "attrs": { "temperature": "45", "humidity": "60" } },
    { "type": "wokwi-potentiometer", "id": "pot1", "top": -140, "left": -100, "attrs": {} }
  ],
  "connections": [
    [ "esp:TX", "$serialMonitor:RX", "", [] ],
    [ "esp:RX", "$serialMonitor:TX", "", [] ],
    [ "esp:3V3", "dht1:VCC", "red", [ "v0" ] ],
    [ "esp:GND.1", "dht1:GND", "black", [ "v0" ] ],
    [ "esp:15", "dht1:SDA", "blue", [ "v0" ] ],
    [ "esp:3V3", "pot1:VCC", "red", [ "v0" ] ],
    [ "esp:GND.1", "pot1:GND", "black", [ "v0" ] ],
    [ "esp:34", "pot1:SIG", "green", [ "v0" ] ]
  ],
  "dependencies": {}
}
```

### 💻 ไฟล์ `sketch.ino`

```cpp
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <DHT.h>

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASS = "";

// เปลี่ยนเป็นค่าจากโปรเจกต์ Supabase ของตนเอง
const char* SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co/rest/v1/telemetry";
const char* SUPABASE_KEY = "YOUR_PUBLISHABLE_OR_ANON_KEY";
const char* DEVICE_ID    = "pump01";

#define DHTPIN   15
#define DHTTYPE  DHT22
#define VIB_PIN  34
const unsigned long SEND_INTERVAL = 5000;   // ms

DHT dht(DHTPIN, DHTTYPE);
WiFiClientSecure tls;
unsigned long lastSend = 0;

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }
  Serial.println(" OK");
}

int postTelemetry(float temp, float vib) {
  char body[96];
  snprintf(body, sizeof(body),
           "{\"device_id\":\"%s\",\"temp\":%.1f,\"vib\":%.2f}",
           DEVICE_ID, temp, vib);

  HTTPClient http;
  http.begin(tls, SUPABASE_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Prefer", "return=minimal");   // ไม่ต้องส่งแถวกลับมา ประหยัด bandwidth
  http.addHeader("apikey", SUPABASE_KEY);
  // key แบบ legacy (JWT ขึ้นต้นด้วย "eyJ") ต้องส่งใน Authorization ด้วย
  if (strncmp(SUPABASE_KEY, "eyJ", 3) == 0) {
    http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY);
  }

  int code = http.POST(body);
  Serial.printf("POST %s -> %d\n", body, code);
  if (code >= 400) Serial.println(http.getString());   // ข้อความ error จาก Supabase
  http.end();
  return code;
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  analogReadResolution(12);
  tls.setInsecure();   // สำหรับห้องแล็บ งานจริงให้ใช้ tls.setCACert(rootCA)
  connectWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();

  if (millis() - lastSend < SEND_INTERVAL) return;
  lastSend = millis();

  float temp = dht.readTemperature();
  if (isnan(temp)) {
    Serial.println("DHT22 read failed");
    return;
  }
  float vib = analogRead(VIB_PIN) / 4095.0 * 2.0;   // 0–4095 → 0–2 g

  postTelemetry(temp, vib);
}
```

**คำอธิบายโค้ด:**
- **`millis()` แทน `delay()`** ทำให้ `loop()` ไม่ถูกบล็อก จึงตรวจสถานะ Wi-Fi และทำงานอื่นเพิ่มได้ในอนาคต
- **`snprintf`** สร้าง JSON ลงบัฟเฟอร์ขนาดคงที่ ช่วยเลี่ยงการจองหน่วยความจำซ้ำ ๆ ของ `String` ซึ่งทำให้ heap แตกกระจาย (Fragmentation) เมื่อรันนาน ๆ
- **`Prefer: return=minimal`** บอก PostgREST ว่าไม่ต้องส่งแถวที่บันทึกกลับมา ESP32 จึงได้ `201` พร้อม body ว่าง
- **`tls.setInsecure()`** เข้ารหัสข้อมูลแต่ไม่ตรวจใบรับรองของเซิร์ฟเวอร์ ใช้ได้ในห้องแล็บเพื่อความสะดวก แต่งานจริงต้องใส่ Root CA เพื่อป้องกัน Man-in-the-Middle
- **header `apikey`** ใช้ได้กับ Publishable key แบบใหม่ ส่วน key แบบ legacy ต้องส่ง `Authorization: Bearer` เพิ่ม รูปแบบ key ของ Supabase เปลี่ยนมาแล้วระยะหนึ่ง จึงควรตรวจกับ[เอกสารทางการ](https://supabase.com/docs/guides/api/api-keys)อีกครั้ง

**ทดสอบ:** กด ▶ ใน Wokwi → Serial Monitor ต้องแสดง `POST {...} -> 201` → กลับไปที่ Supabase **Table Editor → telemetry** จะเห็นแถวใหม่เพิ่มขึ้นทุก 5 วินาที ลองคลิก DHT22 ใน Wokwi แล้วปรับอุณหภูมิเป็น 130 °C จะได้ `401` หรือ `403` เพราะไม่ผ่าน `with check` ใน policy

### ตารางบันทึกผล — ส่วนที่ 2

| การทดลอง | Status Code ที่ได้ | แถวใหม่ใน Table Editor? |
|:---|:---|:---|
| temp = 45 °C, หมุน Pot กลาง | ________ | ________ |
| temp = 130 °C (นอกช่วง policy) | ________ | ________ |
| ใส่ key ผิด 1 ตัวอักษร | ________ | ________ |

---

## ส่วนที่ 3: สร้าง Role อ่านอย่างเดียวและเชื่อม Grafana Cloud (30 นาที)

### ความรู้เบื้องต้น

Grafana ไม่ได้เก็บข้อมูลเอง แต่ส่ง query ไปถามฐานข้อมูลทุกครั้งที่แดชบอร์ด refresh (ทบทวนหัวข้อ 12.5) เราจึงต้องสร้างบัญชีฐานข้อมูลให้ Grafana ใช้โดยเฉพาะ

**ทำไมต้องใช้ Session Pooler?** ที่อยู่ Direct connection ของ Supabase (`db.xxxx.supabase.co`) ใช้ IPv6 ขณะที่บริการคลาวด์หลายแห่ง รวมถึง Grafana Cloud เชื่อมต่อออกด้วย IPv4 จึงต้องต่อผ่าน **Session Pooler** (Supavisor) ซึ่งรองรับ IPv4 และช่วยจัดการจำนวน connection ไม่ให้ฐานข้อมูลรับภาระเกิน

### ขั้นตอนปฏิบัติ — ฝั่ง Supabase

1. เปิด **SQL Editor** แล้วรันคำสั่งต่อไปนี้ (เปลี่ยนรหัสผ่านเป็นของตนเอง)

```sql
-- role สำหรับ Grafana: login ได้ อ่านได้อย่างเดียว
create role grafana_ro with login password 'ChangeMe-Strong-2026';
grant usage on schema public to grafana_ro;
grant select on public.telemetry to grafana_ro;

-- RLS เปิดอยู่ จึงต้องมี policy ให้ role นี้อ่านได้ด้วย
create policy "grafana read" on public.telemetry
  for select to grafana_ro using (true);
```

> 💡 ถ้าขาด `create policy` บรรทัดสุดท้าย Grafana จะเชื่อมต่อสำเร็จแต่ **ได้ผลลัพธ์ 0 แถว** โดยไม่มี error เพราะ RLS กรองทุกแถวทิ้ง นี่เป็นปัญหาที่พบบ่อยที่สุดของบทเรียนนี้

2. คลิกปุ่ม **Connect** ด้านบนของหน้าโปรเจกต์ → เลือก **Session pooler** → จดค่า `host` (เช่น `aws-0-ap-southeast-1.pooler.supabase.com`), `port` (`5432`) และ `user` (`postgres.xxxx`)

### ขั้นตอนปฏิบัติ — ฝั่ง Grafana Cloud

1. สมัครที่ [grafana.com](https://grafana.com) → เลือกแผน **Free** → สร้าง Stack (เช่น `ksu-pump.grafana.net`)
2. เมนูซ้าย **Connections → Data sources → Add data source → PostgreSQL**
3. กรอกค่าดังนี้

| ช่อง | ค่าที่กรอก |
|:---|:---|
| Host URL | `aws-0-ap-southeast-1.pooler.supabase.com:5432` (ตามโปรเจกต์ของตนเอง) |
| Database name | `postgres` |
| Username | `grafana_ro.xxxx` (ชื่อ role + จุด + project ref แบบเดียวกับ user ในข้อ 2) |
| Password | รหัสผ่านที่ตั้งให้ `grafana_ro` |
| TLS/SSL Mode | `require` |
| Version | 15 ขึ้นไป (ตามที่ Supabase แสดง) |
| TimescaleDB | ปิด |

4. กด **Save & test** → ต้องขึ้น ✅ *Database Connection OK*

### ตารางบันทึกผล — ส่วนที่ 3

| รายการ | สถานะ |
|:---|:---|
| สร้าง role `grafana_ro` สำเร็จ | ________ |
| Grafana แสดง Database Connection OK | ________ |
| ทดลอง `delete from telemetry` ด้วย role นี้ใน Explore แล้วได้ผลอย่างไร | ________ |

---

## ส่วนที่ 4: สร้าง Dashboard ติดตามปั๊ม (45 นาที)

### ความรู้เบื้องต้น: Macro ของ Grafana สำหรับ SQL

ในหัวข้อ 12.5 เราใช้ `$timeFilter` และ `GROUP BY time(5m)` กับ InfluxQL ฝั่ง PostgreSQL ก็มี Macro ที่ทำหน้าที่เดียวกัน

| หน้าที่ | InfluxQL (บทที่ 12.5) | PostgreSQL (บทเรียนนี้) |
|:---|:---|:---|
| กรองตามช่วงเวลาที่เลือกบนแดชบอร์ด | `$timeFilter` | `$__timeFilter(created_at)` |
| รวมข้อมูลเป็นช่วงเวลา (Downsampling) | `GROUP BY time(5m)` | `$__timeGroupAlias(created_at, $__interval)` |
| ขนาดช่วงเวลาที่ Grafana คำนวณให้ | `$__interval` | `$__interval` |

**ทำไมต้อง Downsampling?** ถ้าเลือกดูย้อนหลัง 7 วัน จะมีข้อมูล 17,280 × 7 ≈ 121,000 จุด แต่กราฟกว้างราว 1,000 พิกเซลแสดงได้ไม่ถึงหลักพันจุด `$__interval` จะคำนวณขนาดช่วงให้พอดีกับความกว้างของกราฟ (ในกรณีนี้ราว 10 นาที) แล้ว `avg()` จะรวมหลายจุดในช่วงนั้นเหลือจุดเดียว ทำให้ query เร็วขึ้นและกราฟไม่รก

### ขั้นตอนปฏิบัติ

**4.1 สร้างตัวแปรเลือกเครื่องจักร**
1. **Dashboards → New → New dashboard** → ⚙️ **Settings → Variables → Add variable**
2. Type: **Query**, Name: `device`, Data source: PostgreSQL ที่สร้างไว้
3. Query: `SELECT DISTINCT device_id FROM telemetry ORDER BY 1;` → **Apply** จะได้ dropdown เลือกเครื่องที่มุมบนของแดชบอร์ด

**4.2 Panel กราฟแนวโน้ม (Time series)**

**Add visualization** → เลือก **Time series** → สลับตัวแก้ query เป็นโหมด **Code** → Format: **Time series**

```sql
SELECT
  $__timeGroupAlias(created_at, $__interval),
  avg(temp) AS "อุณหภูมิ (°C)",
  avg(vib)  AS "สั่นสะเทือน (g)"
FROM telemetry
WHERE device_id = '$device'
  AND $__timeFilter(created_at)
GROUP BY 1
ORDER BY 1;
```

ตั้งค่า **Overrides** ให้ซีรีส์ "สั่นสะเทือน (g)" ใช้แกน Y ด้านขวา (Axis placement: Right) เพราะหน่วยและสเกลต่างจากอุณหภูมิมาก

**4.3 Panel อุณหภูมิล่าสุด (Gauge)**

```sql
SELECT created_at AS time, temp
FROM telemetry
WHERE device_id = '$device'
ORDER BY created_at DESC
LIMIT 1;
```

ตั้ง Min `0`, Max `100`, Unit **Celsius (°C)**, Thresholds: เขียว (base) → เหลือง `70` → แดง `80`

**4.4 Panel สถานะการเชื่อมต่อ (Stat)** คำนวณว่าข้อมูลล่าสุดส่งมาเมื่อกี่วินาทีที่แล้ว

```sql
SELECT EXTRACT(EPOCH FROM now() - max(created_at)) AS "วินาทีที่แล้ว"
FROM telemetry
WHERE device_id = '$device';
```

ตั้ง Unit เป็น **seconds (s)** และ Thresholds เป็น เขียว → แดงที่ `30` ถ้าค่าเกิน 30 วินาที แสดงว่า ESP32 ขาดการติดต่อไปแล้วอย่างน้อย 5 รอบการส่ง

**4.5 ตั้ง Auto-refresh** ที่มุมขวาบนของแดชบอร์ด เลือก **10s** → **Save dashboard** ตั้งชื่อ `Pump Monitor`

### ตารางบันทึกผล — ส่วนที่ 4

| การทดลอง | ผลที่เห็นบน Dashboard |
|:---|:---|
| หมุน Potentiometer จากต่ำสุดไปสูงสุด | ________ |
| ปรับ DHT22 เป็น 85 °C | สี Gauge: ________ |
| กดหยุด Wokwi แล้วรอ 40 วินาที | ค่า Stat: ________ |
| เปลี่ยนช่วงเวลาจาก Last 15 minutes เป็น Last 24 hours | กราฟเปลี่ยนอย่างไร: ________ |

---

## ส่วนที่ 5: ตั้งการแจ้งเตือนอุณหภูมิสูง (20 นาที)

Grafana Alerting จะรัน query ตามรอบเวลาที่กำหนด แล้วแจ้งเตือนเมื่อค่าเกินเกณฑ์ **ต่อเนื่อง** ตามระยะเวลาที่ตั้งไว้ (Pending period) จึงไม่แจ้งเตือนผิดจาก noise ของเซนเซอร์เพียงครั้งเดียว

1. **Alerting → Contact points → Add contact point** → Integration: **Email** → ใส่อีเมลของตนเอง → **Test** → **Save**
2. **Alerting → Alert rules → New alert rule** → ตั้งชื่อ `Pump overheat`
3. Query (Format: Time series)

```sql
SELECT
  $__timeGroupAlias(created_at, 1m),
  avg(temp) AS temp
FROM telemetry
WHERE device_id = 'pump01'
  AND $__timeFilter(created_at)
GROUP BY 1
ORDER BY 1;
```

4. Expressions: **Reduce** = `Last` → **Threshold** = `IS ABOVE 80`
5. Evaluation: ทุก `1m`, Pending period `2m` → เลือก Contact point ที่สร้างไว้ → **Save rule**

> **หมายเหตุ:** Alert rule ใช้ตัวแปร `$device` ของแดชบอร์ดไม่ได้ จึงต้องระบุชื่อเครื่องตรง ๆ

### ตารางบันทึกผล — ส่วนที่ 5

| การทดลอง | สถานะ Alert (Normal / Pending / Firing) | ได้รับอีเมล? |
|:---|:---|:---|
| temp = 85 °C นาน 1 นาที | ________ | ________ |
| temp = 85 °C นาน 4 นาที | ________ | ________ |

---

## การแก้ปัญหาที่พบบ่อย

| อาการ | สาเหตุที่เป็นไปได้ | วิธีแก้ |
|:---|:---|:---|
| ESP32 ได้ `401` ตลอด | key ผิด หรือใช้ key legacy แต่ไม่ส่ง `Authorization` | คัดลอก key ใหม่ ตรวจ header |
| ESP32 ได้ `401/403` พร้อม `42501` | ไม่ผ่าน RLS policy | ตรวจ `with check` และค่าที่ส่ง |
| ESP32 ได้ `404` | URL ผิด หรือขาด `/rest/v1/telemetry` | ตรวจ `SUPABASE_URL` |
| Grafana: connection timeout | ใช้ Direct connection (IPv6) | เปลี่ยนเป็น Session pooler |
| Grafana: password authentication failed | Username ไม่มี `.project_ref` ต่อท้าย | ใช้รูปแบบ `grafana_ro.xxxx` |
| Grafana: เชื่อมต่อได้แต่ไม่มีข้อมูล | ไม่มี policy `select` ให้ `grafana_ro` | รัน `create policy "grafana read"` |
| Grafana: *Data is missing a time field* | Format ไม่ตรง หรือไม่มีคอลัมน์เวลา | ตั้ง Format เป็น Time series และใช้ `$__timeGroupAlias` |

---

## แบบฝึกหัดท้ายใบงาน

1. **Least Privilege:** ถ้าเปลี่ยนให้ Grafana เชื่อมต่อด้วย user `postgres` แทน `grafana_ro` ระบบยังทำงานได้ แต่ความเสี่ยงเพิ่มขึ้นอย่างไร? ยกตัวอย่างเหตุการณ์ที่อาจเกิดขึ้นในโรงงาน

   > คำตอบ: _______________________________________________________________

2. **Downsampling:** ถ้าเลือกช่วงเวลา Last 30 days บนกราฟกว้าง 1,200 พิกเซล จะมีข้อมูลดิบกี่แถว และ `$__interval` ควรมีค่าประมาณเท่าใด? แสดงวิธีคำนวณ

   > คำตอบ: _______________________________________________________________

3. **ประยุกต์งานเครื่องกล:** มาตรฐาน ISO 10816 ประเมินความรุนแรงของการสั่นสะเทือนจากความเร็ว (mm/s RMS) ไม่ใช่ความเร่ง (g) ถ้าเปลี่ยนเซนเซอร์เป็นแบบวัดความเร็วการสั่น ต้องแก้ส่วนใดบ้าง (ตาราง, ESP32, Grafana)? เขียนคำสั่ง SQL ที่ต้องใช้

   > คำตอบ: _______________________________________________________________

4. **เปรียบเทียบสถาปัตยกรรม:** เทียบระบบนี้กับ ThingsBoard (Lab 11–12) และ Node-RED (Lab 13) ในด้านค่าใช้จ่าย การดูแลรักษา ความยืดหยุ่นของการวิเคราะห์ข้อมูล และความเหมาะกับโรงงาน 50 เครื่องจักร

   > คำตอบ: _______________________________________________________________

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จากอาจารย์ผู้สอน)**

สิ่งที่ต้องส่ง:
1. Screenshot Serial Monitor ของ Wokwi ที่แสดง `POST ... -> 201`
2. Screenshot Supabase Table Editor ที่เห็นข้อมูลอย่างน้อย 20 แถว
3. Screenshot Grafana Dashboard ที่มี Time series, Gauge และ Stat ครบ
4. Screenshot Alert rule สถานะ Firing หรืออีเมลแจ้งเตือนที่ได้รับ
5. คำตอบแบบฝึกหัดท้ายใบงานครบทุกข้อ

### Checklist ก่อนส่ง

- [ ] ESP32 ใช้ Publishable/anon key เท่านั้น ไม่ใช่ Secret หรือ `service_role` key
- [ ] ตาราง `telemetry` เปิด RLS และมี policy ครบ 2 ตัว (`esp32 insert only`, `grafana read`)
- [ ] Grafana เชื่อมต่อด้วย role `grafana_ro` ผ่าน Session pooler
- [ ] Dashboard มีตัวแปร `device` และตั้ง Auto-refresh 10s
- [ ] Alert rule ทำงานและส่งอีเมลได้
- [ ] กรอกตารางบันทึกผลครบทุกส่วน
- [ ] ระบุชื่อ-นามสกุล และรหัสนักศึกษาในฟอร์ม

> ℹ️ **ข้อควรทราบเรื่องแผนฟรี:** ทั้ง Supabase Free Plan และ Grafana Cloud Free Tier มีโควตาจำกัด (พื้นที่ฐานข้อมูล จำนวนผู้ใช้ และการ pause โปรเจกต์ที่ไม่มีการใช้งาน) เงื่อนไขเหล่านี้อาจเปลี่ยนได้ ควรตรวจสอบหน้าราคาของผู้ให้บริการก่อนเริ่มภาคการศึกษา
