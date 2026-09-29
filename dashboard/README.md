# MCC Monitor: แดชบอร์ดบทที่ 12 (ESP32-S3 → Supabase → Vercel)

เว็บแดชบอร์ดสำหรับ Lab 14 ของรายวิชา *เทคโนโลยีดิจิทัลสำหรับวิศวกรรม* แสดงค่าอุณหภูมิ/ความชื้นจากตาราง `telemetry` และสั่งเปิด/ปิด `light`, `pump`, `fan` ผ่านตาราง `controls` ของ Supabase รายละเอียดทั้งหมดอยู่ใน [บทที่ 12](../chapters/ch12-hmi-visualization/README.md) หัวข้อ 12.5, 12.8.6–12.8.8 และ 12.9.5–12.9.6

- **Next.js (App Router) + `@supabase/supabase-js`** เท่านั้น ไม่มีไลบรารีกราฟภายนอก (Gauge และกราฟวาดด้วย SVG)
- เบราว์เซอร์คุยกับ Supabase **โดยตรง** Vercel ให้บริการเฉพาะไฟล์หน้าเว็บ
- ต้อง **login ด้วย Supabase Auth** จึงจะอ่านข้อมูลและสั่งการได้ (role `authenticated`)

## สำหรับผู้สอน: Deploy ครั้งเดียวให้ทั้งชั้นเรียน

1. เข้า [vercel.com](https://vercel.com) → **Add New… → Project** → **Import** repo `TechEngineering` (ต้องเชื่อมบัญชี GitHub)
2. **Root Directory** = `dashboard` · Framework Preset = **Next.js**
3. **ไม่ต้องกรอก Environment Variables** → **Deploy**
4. แจก URL ที่ได้ (เช่น `https://mcc-dashboard.vercel.app`) ให้นักศึกษา

เมื่อไม่มี Environment Variables แดชบอร์ดจะให้ผู้ใช้แต่ละคนกรอก **Project URL, Publishable key และ DEVICE_ID** ของตนเองในหน้าตั้งค่า ค่าจะเก็บใน `localStorage` ของเบราว์เซอร์ผู้ใช้เท่านั้น แดชบอร์ดตัวเดียวจึงใช้ได้กับโปรเจกต์ Supabase ของนักศึกษาทุกคน

## Deploy ของตนเอง (ผูกกับโปรเจกต์เดียว)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FalfaXphoori%2FTechEngineering%2Ftree%2Fmain%2Fdashboard&project-name=mcc-dashboard&repository-name=mcc-dashboard)

ถ้ากรอก Environment Variables ด้านล่าง แดชบอร์ดจะข้ามหน้าตั้งค่า

| ตัวแปร | ตัวอย่าง |
|:---|:---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` (ห้ามใช้ Secret key) |
| `NEXT_PUBLIC_DEVICE_ID` | `mcc-1234` |

## สิ่งที่ต้องตั้งค่าใน Supabase ก่อนใช้งาน

1. ตาราง `telemetry`, `controls`, `events` และ trigger ตามหัวข้อ 12.8.3 และ 12.9.2
2. **Authentication → Sign In / Providers → ปิด Allow new users to sign up**
3. **Authentication → Users → Add user → Create new user** (เลือก Auto confirm user?)
4. สิทธิ์ของ `authenticated` ตามหัวข้อ 12.8.4 ค. และ 12.9.3

## รันบนเครื่องตนเอง

```bash
cd dashboard
npm install
cp .env.example .env.local   # ไม่บังคับ ถ้าไม่กรอกจะใช้หน้าตั้งค่า
npm run dev                  # เปิด http://localhost:3000
```

## โครงสร้างไฟล์

| ไฟล์ | หน้าที่ |
|:---|:---|
| `lib/config.js` | เกณฑ์สี (`TEMP`, `HUM`), รอบ refresh (`REFRESH_MS`), เกณฑ์ขาดการเชื่อมต่อ, ช่วงเวลาของกราฟ, รายชื่ออุปกรณ์ |
| `lib/supabase.js` | อ่านค่าตั้ง (Environment Variables หรือ localStorage) และสร้าง Supabase client |
| `app/page.jsx` | ลำดับหน้าจอ: ตั้งค่า → login → แดชบอร์ด |
| `components/Dashboard.jsx` | ดึงข้อมูลทุก 5 วินาที (`load()`), สั่งการ (`command()`), แถบเตือน และ Layout 3 แถว |
| `components/Gauge.jsx`, `LineChart.jsx` | Gauge ครึ่งวงกลม และกราฟเส้นพร้อมเส้นหมายเหตุ (SVG) |
| `components/ControlPanel.jsx`, `EventList.jsx` | ปุ่มสั่งการ และตารางประวัติการสั่ง |
| `components/Settings.jsx`, `Login.jsx` | หน้าตั้งค่า และหน้า login |
