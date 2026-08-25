---
layout: default
title: "บทที่ 12: การแสดงภาพข้อมูลและการออกแบบส่วนต่อประสานผู้ใช้"
permalink: /chapters/ch12-hmi-visualization/
---

# Chapter 12: การแสดงภาพข้อมูลและการออกแบบส่วนต่อประสานผู้ใช้

## Data Visualization & Industrial HMI Design (ISA 101, ThingsBoard Dashboards, 2-Way RPC Control, Widgets)

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

> ### 🎯 ผลลัพธ์การเรียนรู้และการเชื่อมโยง (Constructive Alignment)
>
> - **สัปดาห์การเรียนรู้:** สัปดาห์ที่ 14 — การแสดงภาพข้อมูลและการออกแบบส่วนต่อประสานผู้ใช้ (Data Visualization & HMI Design)
> - **ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs):**
>   - **CLO3:** ออกแบบและพัฒนาระบบ IoT ที่เชื่อมต่อเซนเซอร์/ตัวกระทำ สื่อสารข้อมูล และแสดงผลผ่านโปรแกรมของผู้ใช้ได้
>   - **CLO4:** ปฏิบัติการสร้าง ทดสอบ และประยุกต์ใช้ระบบ IoT พร้อมการเรียนรู้ของเครื่องเบื้องต้น และทำงานเป็นทีมอย่างรับผิดชอบ
> - **ผลลัพธ์การเรียนรู้ระดับบทเรียน (LLOs):**
>   - **LLO14.1:** ออกแบบส่วนต่อประสานผู้ใช้ (UI/HMI) สำหรับควบคุมและติดตามระบบ IoT ตามหลักการ ISA 101 ได้ (CLO3)
>   - **LLO14.2:** สร้างแอปพลิเคชัน/แดชบอร์ดควบคุมอุปกรณ์สองทาง (2-way RPC Control) ผ่าน ThingsBoard ได้ (CLO3, CLO4)
>
---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 12.1 ความสำคัญของการแสดงผลข้อมูลใน IoT

ระบบ IoT เก็บข้อมูลจากเซนเซอร์จำนวนมหาศาล — อุณหภูมิ ความชื้น แรงสั่นสะเทือน ค่ากระแสไฟฟ้า ฯลฯ ข้อมูลดิบ (Raw Data) เหล่านี้เป็นเพียงตัวเลขที่ไหลเข้ามาไม่หยุด หากไม่มี **การแสดงผลข้อมูล (Data Visualization)** ที่ดี ผู้ใช้จะไม่สามารถแปลงตัวเลขเหล่านั้นเป็น **ความเข้าใจ (Insight)** ได้

### ทำไมการแสดงผลจึงสำคัญ?

1. **เปลี่ยนข้อมูลดิบเป็นความเข้าใจ** — กราฟอุณหภูมิที่ไต่ขึ้นต่อเนื่องบอกได้ทันทีว่ามอเตอร์ร้อนผิดปกติ แต่ตารางตัวเลข 500 แถวบอกอะไรได้ยาก
2. **ตัดสินใจเร็วขึ้น** — แดชบอร์ดเรียลไทม์ช่วยให้วิศวกรตอบสนองต่อเหตุการณ์ได้ภายในวินาที
3. **สื่อสารกับทุกคน** — กราฟที่ชัดเจนทำให้ผู้จัดการที่ไม่ใช่วิศวกรเข้าใจสถานการณ์ได้
4. **ค้นหาแนวโน้มและความผิดปกติ** — รูปแบบ (Pattern) ที่ซ่อนอยู่ในข้อมูลจะปรากฏชัดเมื่อแสดงเป็นภาพ

> 💡 **หลักสำคัญ:** ข้อมูลที่ดีแต่แสดงผลแย่ = ไร้ประโยชน์ ในทางกลับกัน การแสดงผลสวยงามแต่ข้อมูลผิดพลาด = อันตราย ทั้งสองส่วนต้องถูกต้องควบคู่กัน

---

## 12.2 หลักการนำเสนอข้อมูลที่ดี

การออกแบบการแสดงผลข้อมูลที่ดีต้องยึดหลัก 3 ประการ:

### 12.2.1 ความชัดเจน (Clarity)

- ใช้กราฟที่เหมาะกับประเภทข้อมูล
- ตั้งชื่อแกน (Axis Label) และหน่วยให้ครบถ้วน เช่น "อุณหภูมิ (°C)" ไม่ใช่แค่ "Temp"
- หลีกเลี่ยงสี/ลวดลายที่ทำให้สับสน

### 12.2.2 บริบท (Context)

- แสดงช่วงเวลา (Time Range) ให้ชัดเจน
- มีเส้นอ้างอิง (Reference Line) เช่น ค่าเกณฑ์สูงสุดที่ยอมรับได้
- เปรียบเทียบกับค่าปกติ เช่น "วันนี้ vs. ค่าเฉลี่ย 7 วัน"

### 12.2.3 ไม่บิดเบือน (No Distortion)

- แกน Y ต้องเริ่มจาก 0 เมื่อเปรียบเทียบขนาด (Bar Chart)
- ไม่ตัดข้อมูลบางส่วนออกเพื่อให้กราฟดูดีขึ้น
- ใช้สเกลที่สม่ำเสมอ (Uniform Scale)

| หลักการ | ✅ ทำ | ❌ อย่าทำ |
|---------|------|----------|
| ความชัดเจน | ใช้สีแยกแยะข้อมูลชัดเจน ติดป้ายกำกับ | ยัดข้อมูล 10 ชุดในกราฟเดียว |
| บริบท | แสดงเส้นเกณฑ์เตือน (Threshold) | แสดงกราฟโดยไม่บอกช่วงเวลา |
| ไม่บิดเบือน | แกน Y เริ่มจาก 0 ในกราฟแท่ง | ตัดแกน Y เพื่อขยายความแตกต่าง |

---

## 12.3 ชนิดของกราฟและการเลือกใช้

### 12.3.1 กราฟเส้น (Line Chart)

เหมาะสำหรับข้อมูลแบบอนุกรมเวลา (Time-Series) เช่น อุณหภูมิทุก ๆ 5 วินาที แรงสั่นสะเทือนตลอดทั้งวัน แสดงให้เห็น **แนวโน้ม (Trend)** ได้ดีที่สุด

### 12.3.2 กราฟแท่ง (Bar Chart)

เหมาะสำหรับเปรียบเทียบค่าระหว่างหมวดหมู่ เช่น ปริมาณการใช้ไฟฟ้าของแต่ละเครื่องจักร พลังงานรายเดือน

### 12.3.3 เกจ / มาตรวัด (Gauge)

แสดงค่าปัจจุบันเทียบกับช่วงที่กำหนด เช่น ความเร็วรอบมอเตอร์ อุณหภูมิปัจจุบัน เหมาะกับแดชบอร์ดเรียลไทม์

### 12.3.4 แผนภูมิวงกลม (Pie Chart)

แสดงสัดส่วนของแต่ละส่วนเทียบกับทั้งหมด เช่น สัดส่วนพลังงานที่ใช้แต่ละระบบ ใช้เมื่อมีหมวดหมู่ไม่เกิน 5-6 รายการ

### 12.3.5 แผนที่ความร้อน (Heatmap)

แสดงข้อมูลเป็นตาราง 2 มิติที่ใช้สีแทนค่า เช่น อุณหภูมิของแต่ละจุดบนพื้นที่โรงงานในแต่ละชั่วโมง เหมาะกับข้อมูลที่มีตัวแปร 2 มิติ

### ตารางสรุปการเลือกใช้กราฟ

| ชนิดกราฟ | ใช้เมื่อ | ตัวอย่างข้อมูล IoT | ข้อควรระวัง |
|----------|---------|-------------------|------------|
| กราฟเส้น (Line) | ดูแนวโน้มตามเวลา | อุณหภูมิ, ความชื้น ตลอด 24 ชม. | จุดข้อมูลมากเกินทำให้กราฟรก |
| กราฟแท่ง (Bar) | เปรียบเทียบระหว่างหมวดหมู่ | พลังงานแต่ละเครื่องจักร | แกน Y ต้องเริ่มจาก 0 |
| เกจ (Gauge) | ค่าปัจจุบัน ณ ขณะนั้น | RPM มอเตอร์, อุณหภูมิ | แสดงได้ทีละ 1 ค่า |
| วงกลม (Pie) | สัดส่วน | % พลังงานแต่ละระบบ | ไม่ควรเกิน 5-6 หมวด |
| Heatmap | ข้อมูล 2 มิติ + ค่าเป็นสี | อุณหภูมิแต่ละจุดในโรงงาน | ต้องเลือกสเกลสีที่เข้าใจง่าย |

---

## 12.4 แดชบอร์ด (Dashboard) และหลักการออกแบบ

**แดชบอร์ด** คือหน้าจอรวมศูนย์ที่แสดงข้อมูลสำคัญทั้งหมดในที่เดียว เปรียบเหมือนแผงหน้าปัดรถยนต์ที่รวมความเร็ว รอบเครื่อง ระดับน้ำมัน และอุณหภูมิไว้ในจุดเดียว

### หลักการออกแบบแดชบอร์ด

1. **จัดลำดับความสำคัญ (Priority Layout)**
   - ข้อมูลสำคัญที่สุดอยู่มุมซ้ายบน (ตาคนอ่านซ้ายไปขวา บนลงล่าง)
   - ใช้ขนาดใหญ่สำหรับข้อมูลหลัก ขนาดเล็กสำหรับข้อมูลรอง
   - จัดกลุ่มข้อมูลที่เกี่ยวข้องไว้ใกล้กัน

2. **การแสดงผลเรียลไทม์ (Real-Time Display)**
   - อัปเดตค่าทุก 1-5 วินาทีสำหรับข้อมูลวิกฤต
   - แสดงเวลาอัปเดตล่าสุด (Last Updated) ให้ผู้ใช้ทราบ
   - ใช้สีแจ้งเตือนสถานะ: เขียว = ปกติ, เหลือง = เฝ้าระวัง, แดง = อันตราย

3. **ไม่แออัดเกินไป (Avoid Clutter)**
   - แดชบอร์ดที่ดีควรมี Widget ไม่เกิน 7-10 ชิ้น
   - ใช้แท็บ (Tab) แบ่งหน้าสำหรับข้อมูลรายละเอียด

> 💡 **เคล็ดลับ:** ก่อนออกแบบแดชบอร์ด ให้ถามตัวเองว่า "ถ้ามีเวลาแค่ 3 วินาที ข้อมูลไหนที่ต้องเห็นก่อน?" คำตอบนั้นคือสิ่งที่ต้องอยู่ตำแหน่งเด่นที่สุด

---

## 12.5 เครื่องมือสำหรับแสดงผลข้อมูล IoT


## 12.5 การนำเสนอค่าทางสถิติด้วย Grafana

**Grafana** เป็นแพลตฟอร์มการแสดงผลวิเคราะห์และติดตามข้อมูลระดับองค์กร (Enterprise Grade Analytics Engine) โดดเด่นด้านความสวยงาม ความยืดหยุ่นในการจัดการ และประสิทธิภาพที่โดดเด่นเมื่อใช้ประมวลผลข้อมูลอนุกรมเวลาขนาดใหญ่จากคลาวด์และโรงงานอุตสาหกรรม

#### โครงสร้างและการจัดเลย์เอาต์ (Layout Structure)
1. **Dashboards & Rows (กระดานควบคุมและแถวจัดระเบียบ):** 
   - พื้นที่การทำงานสูงสุดคือ Dashboard ซึ่งภายในถูกแบ่งย่อยเป็นโครงสร้างแบบ Grid layout
   - **Rows (แถว):** ใช้สำหรับจัดแบ่งกลุ่มพาเนลตามเนื้อหา และช่วยลดภาระการโหลดประมวลผลข้อมูลโดยสามารถกดพับเก็บ (Collapse) การประมวลผลพาเนลภายในแถวที่ไม่ถูกรับชมได้

2. **Panels (พาเนลแสดงผลข้อมูลแบบจำแนกประเภท):**
   - **Time Series (อนุกรมเวลา):** พาเนลหลักยอดนิยมที่วาดเส้นกราฟความเข้มข้นของจุดข้อมูลเทียบแกนเวลา (Time-based numeric data)
   - **Stat (สถิติตัวเลขเดี่ยว):** วิดเจ็ตที่เน้นตัวเลขแสดงสถานะปัจจุบันขนาดใหญ่ เหมาะสำหรับตัวเลขสำคัญ เช่น อุณหภูมิสูงสุด หรือผลรวมยอดผลิต โดยสามารถกำหนดสีพื้นหลังหรือสีข้อความตามค่าอิมแพ็กต์ผ่าน Thresholds
   - **Gauge (เกจวัดมาตรฐาน):** วิดเจ็ตมาตรวัดวงกลมหรือครึ่งวงกลม มีการแสดงส่วนของเฉดสีเตือนภัยเพื่อระบุระดับปริมาณ (เช่น เกจน้ำมัน เกจวัดรอบหมุนมอเตอร์)
   - **Bar Gauge (เกจแท่งระดับ):** ใช้แถบขนานแนวนอนหรือแนวตั้งเพื่อเปรียบเทียบชุดข้อมูลที่คล้ายคลึงกัน (เช่น ระดับของเหลวในถังเก็บสารเคมี 5 ใบ)
   - **Table (ตารางแจกแจงรายละเอียด):** แสดงผลตารางคอลัมน์และแถวข้อมูลดิบ เหมาะสำหรับรายการบันทึกเหตุการณ์ (Logs) หรือการเปรียบเทียบข้อมูลจำเพาะเชิงโครงสร้าง

3. **Data Source Integration:**
   - Grafana ไม่ได้ทำหน้าที่เก็บข้อมูลด้วยตนเอง แต่จะดึงข้อมูลผ่านการเชื่อมต่อปลั๊กอิน (Data Sources) ไปยังฐานข้อมูลภายนอก เช่น InfluxDB (ฐานข้อมูลอนุกรมเวลา), Prometheus (ฐานข้อมูลตรวจวัดระบบ), PostgreSQL, MySQL, หรือ MongoDB

#### พื้นฐานการสืบค้นข้อมูลอนุกรมเวลาด้วย InfluxQL
เมื่อฐานข้อมูลต้นทางคือ InfluxDB (ซึ่งเป็น Time-series Database ยอดนิยมในระบบ IoT) Grafana จะใช้ภาษา **InfluxQL** (Influx Query Language) ซึ่งมีไวยากรณ์คล้าย SQL เพื่อดึงค่าข้อมูล ตัวอย่างคำสั่งมาตรฐานที่สำคัญมีดังนี้:

```sql
-- คำสั่งค้นหาค่าเฉลี่ยของอุณหภูมิทุกๆ 5 นาที โดยคัดกรองจากอุปกรณ์เฉพาะเจาะจง
SELECT MEAN("temperature") 
FROM "sensor_readings" 
WHERE ("device_id" = 'ESP32_Office') AND $timeFilter 
GROUP BY time(5m) fill(linear)
```

**คำอธิบายไวยากรณ์และสัญลักษณ์:**
- **`SELECT MEAN("temperature")`:** การระบุฟิลด์ตัวเลขข้อมูลดิบที่อุณหภูมิถูกจัดเก็บ นำมาหาค่าเฉลี่ย (Mean) โดยสามารถใช้ฟังก์ชันอื่นได้ เช่น `MAX()`, `MIN()`, `LAST()`, หรือ `COUNT()`
- **`FROM "sensor_readings"`:** ระบุชื่อ Measurement (เปรียบเทียบเหมือน Table ในฐานข้อมูลเชิงสัมพันธ์) ซึ่งจัดเก็บตัวแปรเซนเซอร์ตัวนั้นไว้
- **`WHERE ("device_id" = 'ESP32_Office')`:** การกรองข้อมูลด้วยแถบป้ายข้อความ (Tags) ซึ่งเป็นดัชนีระบุตัวตนเฉพาะ
- **`AND $timeFilter`:** คีย์เวิร์ดตัวแปรเฉพาะของ Grafana (Dashboard Global Macro) ที่ทำหน้าที่แปลงช่วงเวลาควบคุมที่ผู้ใช้เลือกในหน้า UI (เช่น ย้อนหลัง 1 ชม., 24 ชม., หรือ 7 วัน) ให้กลายเป็นช่วงเงื่อนไขเชิงวันเวลาสืบค้นโดยอัตโนมัติ
- **`GROUP BY time(5m)`:** สั่งสรุปย่อขนาดข้อมูล (Downsampling) ให้เหลือจุดข้อมูลเพียงจุดเดียวต่อหน้าต่าง 5 นาที โดย Grafana จะสร้างจุดข้อมูลตามฟังก์ชันคณิตศาสตร์ที่กำหนด เช่น `MEAN()` ด้านบน
- **`fill(linear)`:** การกำหนดค่าทดแทนข้อมูลกรณีในช่วงเวลาใดที่เซนเซอร์ไม่ได้อัปโหลดหรือสัญญาณขาดหาย เช่น `fill(linear)` ลากเส้นเชื่อมต่อจุดข้อมูลที่มีแบบเส้นตรง หรือ `fill(previous)` ใช้ค่าที่ปรากฏก่อนหน้า และ `fill(0)` ป้อนค่าเป็นศูนย์

---

## 12.6 แดชบอร์ดของ ThingsBoard

**ThingsBoard** เป็นแพลตฟอร์ม IoT ระดับอุตสาหกรรม (Industrial-grade IoT Platform) แบบโอเพนซอร์สที่ออกแบบมาเพื่อรองรับทั้งการเรียนรู้และงานจริงในระบบฝังตัว ผู้พัฒนาสามารถสร้างแดชบอร์ดเว็บแบบลากวาง (Drag-and-drop Web Dashboard) พร้อมวิดเจ็ตหลากหลาย เช่น เกจวัดค่า กราฟอนุกรมเวลา และ LED แสดงสถานะ นอกจากนี้ยังมีแอปมือถือ (ThingsBoard Mobile App) สำหรับ iOS และ Android อุปกรณ์เชื่อมต่อผ่านโปรโตคอล MQTT โดยส่งข้อมูลโทรมาตร (Telemetry) ขึ้นคลาวด์และรับคำสั่งควบคุมกลับมา (RPC) แบบสองทิศทาง ระบบมีฐานข้อมูลอนุกรมเวลา (Time-series Storage) และระบบแจ้งเตือน (Alarms) ในตัวโดยไม่ต้องติดตั้งซอฟต์แวร์เพิ่มเติม

---

### ตารางเปรียบเทียบเครื่องมือ

| คุณสมบัติ | Node-RED | Grafana | ThingsBoard |
|----------|----------|---------|------------|
| ประเภท | Self-hosted | Self-hosted | Cloud / Self-hosted |
| ความยากในการเริ่มต้น | ง่าย | ปานกลาง | ปานกลาง |
| ปรับแต่งกราฟ | ปานกลาง | สูงมาก | สูง |
| รองรับ Real-Time | ✅ | ✅ | ✅ |
| โมบายแอป | ❌ | จำกัด | ✅ |
| ค่าใช้จ่าย | ฟรี | ฟรี (OSS) | ฟรี (จำกัด) / OSS |
| เหมาะกับ | Prototype, งานขนาดเล็ก | Production, งานขนาดใหญ่ | การเรียนรู้ถึงงานอุตสาหกรรม |
| ตั้ง Alert ได้ | ✅ (ผ่าน Flow) | ✅ (Built-in) | ✅ (Built-in Alarms) |

---

</div>

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">
## 12.6 ปฏิบัติการ Wokwi Lab 14: การสร้าง HMI อุตสาหกรรม และการควบคุมสองทาง 2-Way RPC บน ThingsBoard

**รหัสปฏิบัติการ:** LAB-12 | **เวลาปฏิบัติการ:** 2 ชั่วโมง  
**เป้าหมายการเรียนรู้:** LLO14.1, LLO14.2 (CLO3, CLO4)  
**เครื่องมือที่ใช้:** Wokwi Simulator, ThingsBoard Dashboard Builder, ESP32, Relay, OLED SSD1306

---

### 12.6.1 วัตถุประสงค์เชิงปฏิบัติการ
1. ออกแบบส่วนต่อประสานผู้ใช้ (Industrial HMI Dashboard) ตามมาตรฐานความปลอดภัยและสรีรศาสตร์ทางการมองเห็น (ISA 101)
2. พัฒนาระบบรับคำสั่งสั่งการสองทางระยะไกล (Two-Way Remote Procedure Calls: RPC) จากหน้าเว็บ ThingsBoard ไปยังอุปกรณ์จริง
3. แสดงผลสถานะหน้าเครื่องจักรแบบ Local HMI ผ่านจอ OLED ไปพร้อมกับการแสดงผลบนคลาวด์

---

### 12.6.2 แผนผังการต่อวงจร (Wiring Table)

| อุปกรณ์ | ขาของอุปกรณ์ | ขาบนบอร์ด ESP32 DevKit | หน้าที่ / หมายเหตุ |
|---|---|---|---|
| **SSD1306 OLED (Local HMI)** | SDA / SCL | **GPIO 21 / GPIO 22** | แสดงผลหน้าเครื่องจักร (I2C) |
| **Relay Module (Fan Driver)** | IN | **GPIO 13** | สั่งงานพัดลมจาก 2-Way RPC |
| **Status LED** | Anode (+) | **GPIO 12** (ผ่าน R 330Ω) | ไฟแสดงสถานะ RPC Active |

---

### 12.6.3 ไฟล์โครงสร้างวงจร `diagram.json` สำหรับ Wokwi

```json
{
  "version": 1,
  "author": "KSU TechEngineering",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-ssd1306", "id": "oled1", "top": -140, "left": 80, "attrs": { "i2cAddress": "0x3c" } },
    { "type": "wokwi-relay-module", "id": "relay1", "top": 120, "left": 120, "attrs": {} },
    { "type": "wokwi-led", "id": "led1", "top": 120, "left": -80, "attrs": { "color": "blue" } },
    { "type": "wokwi-resistor", "id": "r1", "top": 170, "left": -80, "attrs": { "value": "330" } }
  ],
  "connections": [
    [ "esp:3V3", "oled1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "oled1:GND", "black", [ "v0" ] ],
    [ "esp:21", "oled1:SDA", "green", [ "v0" ] ],
    [ "esp:22", "oled1:SCL", "yellow", [ "v0" ] ],

    [ "esp:5V", "relay1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "relay1:GND", "black", [ "v0" ] ],
    [ "esp:13", "relay1:IN", "purple", [ "v0" ] ],

    [ "esp:12", "led1:A", "orange", [ "v0" ] ],
    [ "led1:C", "r1:1", "black", [ "v0" ] ],
    [ "r1:2", "esp:GND", "black", [ "v0" ] ]
  ],
  "dependencies": {}
}
```

---

### 12.6.4 ซอร์สโค้ดภาษา C++ รองรับการสั่งการ Two-Way RPC

```cpp
/**
 * LAB 12: Industrial HMI & 2-Way RPC Control over ThingsBoard
 * Course: Digital Technology for Engineering, KSU
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASS = "";

const char* TB_SERVER = "thingsboard.cloud";
const char* TB_TOKEN  = "YOUR_ACCESS_TOKEN_HERE";

#define RELAY_FAN_PIN 13
#define LED_STATUS_PIN 12

WiFiClient espClient;
PubSubClient client(espClient);

void onRpcMessage(char* topic, byte* payload, unsigned int length) {
  String responseTopic = String(topic);
  responseTopic.replace("request", "response");

  String msg = "";
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];

  Serial.printf("\n[RPC RECEIVED] Topic: %s | Payload: %s\n", topic, msg.c_str());

  JsonDocument doc;
  if (!deserializeJson(doc, msg)) {
    const char* method = doc["method"];

    if (String(method) == "setFanState") {
      bool state = doc["params"];
      digitalWrite(RELAY_FAN_PIN, state ? HIGH : LOW);
      digitalWrite(LED_STATUS_PIN, state ? HIGH : LOW);
      Serial.printf("[ACTION] Fan Relay set to: %s\n", state ? "ON" : "OFF");

      client.publish(responseTopic.c_str(), "{\"status\":\"SUCCESS\"}");
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_FAN_PIN, OUTPUT);
  pinMode(LED_STATUS_PIN, OUTPUT);
  digitalWrite(RELAY_FAN_PIN, LOW);
  digitalWrite(LED_STATUS_PIN, LOW);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  client.setServer(TB_SERVER, 1883);
  client.setCallback(onRpcMessage);
}

void loop() {
  if (!client.connected()) {
    while (!client.connected()) {
      if (client.connect("ESP32_HMI", TB_TOKEN, NULL)) {
        Serial.println("[ThingsBoard] Connected & Subscribing to RPC Commands...");
        client.subscribe("v1/devices/me/rpc/request/+");
      } else {
        delay(2000);
      }
    }
  }
  client.loop();
}
```
</div>
</div>

---

#### 5. ขั้นตอนการจัดเตรียมและเชื่อมต่อโปรเจกต์ ThingsBoard
1. **สร้างบัญชีคลาวด์:** สมัครลงทะเบียนฟรีที่ [thingsboard.cloud](https://thingsboard.cloud/)
2. **สร้าง Device:** ไปที่เมนู Entities → Devices → เพิ่มอุปกรณ์ใหม่ เช่น ตั้งชื่อว่า `ESP32_Lab09`
3. **คัดลอก Access Token:** เปิดหน้ารายละเอียดของ Device → แท็บ Credentials → คัดลอก **Access Token** (ใช้แทนรหัสผ่าน MQTT)
4. **สร้าง Dashboard และเพิ่ม Widget:**
   - ไปที่เมนู Dashboards → สร้าง Dashboard ใหม่
   - เพิ่มวิดเจ็ต **Gauge** ผูกกับ Telemetry Key `temperature` เพื่อแสดงอุณหภูมิแบบเรียลไทม์
   - เพิ่มวิดเจ็ต **Round Switch** และตั้งค่า RPC Method เป็น `setLed` เพื่อส่งคำสั่งควบคุม LED
5. **เขียนและอัปโหลดโค้ด ESP32:** ใช้ Libraries `WiFi.h`, `PubSubClient.h`, `ArduinoJson.h` (ดูโค้ดตัวอย่างด้านล่าง) และใส่ Access Token ที่คัดลอกมาในตัวแปร `access_token`

---

#### ตัวอย่างโค้ดสมบูรณ์: Telemetry, RPC และ Attribute Sync บน ESP32 กับ ThingsBoard

ต่อไปนี้คือรูปแบบโปรแกรมภาษา C++ สำหรับ ESP32 ที่ส่งข้อมูลอุณหภูมิ (Telemetry) ขึ้นคลาวด์ รับคำสั่ง RPC สั่งงาน LED และดึงสถานะล่าสุดจาก Shared Attributes เมื่อบู๊ตระบบ:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// รายละเอียดการเชื่อมต่อ Wi-Fi (Wokwi ใช้ Wokwi-GUEST ไม่ต้องใส่รหัสผ่าน)
const char* ssid         = "Wokwi-GUEST";
const char* pass         = "";

// รายละเอียด ThingsBoard MQTT Broker
const char* tb_server    = "thingsboard.cloud";
const int   tb_port      = 1883;
const char* access_token = "Your_Access_Token_Here"; // ใส่ Access Token จากหน้า Device

#define LED_PIN 2 // ขา GPIO ที่ต่อ LED

WiFiClient   espClient;
PubSubClient client(espClient);

unsigned long lastSendTime    = 0;
const unsigned long INTERVAL  = 3000; // ส่ง Telemetry ทุก 3 วินาที

// ฟังก์ชัน Callback รับข้อความจาก ThingsBoard (RPC + Attribute Response)
void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<256> doc;
  if (deserializeJson(doc, payload, length) != DeserializationError::Ok) return;

  String topicStr = String(topic);

  // ---- จัดการ RPC Request ----
  if (topicStr.startsWith("v1/devices/me/rpc/request/")) {
    const char* method = doc["method"];

    if (strcmp(method, "setLed") == 0) {
      bool ledState = doc["params"];                    // รับค่า true/false จากสวิตช์แดชบอร์ด
      digitalWrite(LED_PIN, ledState ? HIGH : LOW);    // สั่งงาน GPIO ตามคำสั่ง
      Serial.printf("RPC setLed: %s\n", ledState ? "ON" : "OFF");

      // ตอบกลับ ThingsBoard เพื่อยืนยันว่าดำเนินการสำเร็จ
      String requestId    = topicStr.substring(topicStr.lastIndexOf('/') + 1);
      String responseTopic = "v1/devices/me/rpc/response/" + requestId;
      client.publish(responseTopic.c_str(), "{\"success\":true}");
    }
  }

  // ---- จัดการ Shared Attribute Response (ซิงค์สถานะเมื่อบู๊ต) ----
  if (topicStr.startsWith("v1/devices/me/attributes/response/")) {
    JsonVariant shared = doc["shared"];
    if (!shared.isNull() && shared.containsKey("ledState")) {
      bool restoredState = shared["ledState"];
      digitalWrite(LED_PIN, restoredState ? HIGH : LOW);
      Serial.printf("Attr Sync: ledState = %s\n", restoredState ? "ON" : "OFF");
    }
  }
}

// เชื่อมต่อ ThingsBoard และ Subscribe หัวข้อที่จำเป็น
void reconnect() {
  while (!client.connected()) {
    Serial.print("เชื่อมต่อ ThingsBoard...");
    // Access Token ใช้เป็น Username, Password ให้เป็น NULL
    if (client.connect("ESP32_Lab09", access_token, NULL)) {
      Serial.println(" สำเร็จ!");
      // Subscribe รับคำสั่ง RPC จากแดชบอร์ด
      client.subscribe("v1/devices/me/rpc/request/+");
      // Subscribe รับ Shared Attribute Response
      client.subscribe("v1/devices/me/attributes/response/+");
      // ร้องขอสถานะล่าสุดจากคลาวด์เมื่อเชื่อมต่อใหม่ (Digital Twin Sync)
      client.publish("v1/devices/me/attributes/request/1",
                     "{\"sharedKeys\":\"ledState\"}");
    } else {
      Serial.printf(" ล้มเหลว rc=%d ลองใหม่ใน 5 วินาที\n", client.state());
      delay(5000);
    }
  }
}

// ส่งข้อมูลอุณหภูมิขึ้น ThingsBoard แบบ Non-blocking ด้วย millis()
void sendTelemetry() {
  float temperature = 24.0 + random(0, 120) / 10.0; // จำลองอุณหภูมิ 24.0–36.0 °C

  StaticJsonDocument<128> doc;
  doc["temperature"] = temperature;

  char payload[128];
  serializeJson(doc, payload);

  client.publish("v1/devices/me/telemetry", payload);
  Serial.printf("Telemetry: %s\n", payload);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  // เชื่อมต่อ Wi-Fi
  WiFi.begin(ssid, pass);
  Serial.print("เชื่อมต่อ Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" เชื่อมต่อแล้ว!");

  // ตั้งค่า MQTT Broker และ Callback
  client.setServer(tb_server, tb_port);
  client.setCallback(onMqttMessage);
}

void loop() {
  // เชื่อมต่อใหม่หากหลุด (Non-blocking ในรอบถัดไปเมื่อเวลาผ่าน)
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); // ประมวลผลคิว MQTT และ Keep-alive

  // ส่ง Telemetry ตามรอบเวลาโดยไม่ใช้ delay()
  if (millis() - lastSendTime >= INTERVAL) {
    lastSendTime = millis();
    sendTelemetry();
  }
}
```

> 💡 **สำหรับ Wokwi:** ThingsBoard ใช้โปรโตคอล MQTT พอร์ต 1883 ซึ่ง Wokwi-GUEST รองรับการเชื่อมต่อออกอินเทอร์เน็ตจริง นักศึกษาสามารถทดสอบโค้ดนี้บน Wokwi ได้โดยตรง — กำหนด SSID เป็น `"Wokwi-GUEST"` และ Password เป็น `""` แล้วใส่ Access Token จากบัญชี ThingsBoard ของตนเอง บอร์ดจะเชื่อมต่อ thingsboard.cloud:1883 ได้จริงในโปรแกรมจำลอง

---

## 12.8 ตัวอย่างการออกแบบแดชบอร์ดติดตามเครื่องจักร

### สถานการณ์จำลอง

โรงงานมีมอเตอร์ไฟฟ้า 1 ตัวที่ต้องติดตาม:
- **อุณหภูมิตัวเรือน** (Body Temperature)
- **ความเร็วรอบ** (RPM)
- **กระแสไฟฟ้า** (Current)
- **สถานะการทำงาน** (Running / Stopped / Error)

### การออกแบบ Layout

<div style="text-align: center; margin: 25px 0;">
<svg viewBox="0 0 760 380" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>แดชบอร์ดติดตามมอเตอร์ #1 (Layout Mockup)</title>
  <style>
    .db-bg { fill: #0f172a; stroke: #1e293b; stroke-width: 2; rx: 12px; }
    .card { fill: #1e293b; stroke: #334155; stroke-width: 1.5; rx: 8px; }
    
    .txt-header { font-size: 15px; font-weight: bold; fill: #f8fafc; }
    .txt-lbl { font-size: 12px; fill: #94a3b8; }
    .txt-val-temp { font-size: 24px; font-weight: bold; fill: #f97316; }
    .txt-val-rpm { font-size: 24px; font-weight: bold; fill: #38bdf8; }
    
    .btn-estop { fill: #ef4444; stroke: #b91c1c; stroke-width: 1.5; rx: 6px; }
    .btn-txt { font-size: 12px; font-weight: bold; fill: #ffffff; }
    
    .slider-track { fill: #475569; rx: 3px; }
    .slider-fill { fill: #3b82f6; rx: 3px; }
    
    .chart-line { fill: none; stroke: #38bdf8; stroke-width: 2.5; stroke-linecap: round; }
    .chart-line-sub { fill: none; stroke: #fb7185; stroke-width: 1.5; stroke-linecap: round; stroke-dasharray: 4 4; }
    .chart-area { fill: url(#chart-grad); opacity: 0.15; }
    .chart-grid { stroke: #334155; stroke-width: 1; stroke-dasharray: 2 4; }
  </style>

  <rect x="5" y="5" width="750" height="370" class="db-bg"/>
  
  <!-- Gradients -->
  <defs>
    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Header -->
  <text x="30" y="38" class="txt-header">🏭 แดชบอร์ดติดตามมอเตอร์ #1 (Motor #1 Monitoring Dashboard)</text>
  <rect x="620" y="22" width="110" height="24" rx="12" fill="#064e3b" stroke="#059669" stroke-width="1"/>
  <text x="675" y="38" text-anchor="middle" font-size="11px" font-weight="bold" fill="#34d399">🟢 Connected</text>

  <!-- Card 1: Temp -->
  <rect x="30" y="65" width="220" height="110" class="card"/>
  <text x="50" y="95" class="txt-lbl">🌡️ อุณหภูมิตัวเรือน (Body Temp)</text>
  <text x="50" y="135" class="txt-val-temp">42.3 °C</text>
  <text x="50" y="158" font-size="10.5px" fill="#64748b">ขีดจำกัดความร้อนสูงสุด: 65 °C</text>

  <!-- Card 2: RPM -->
  <rect x="270" y="65" width="220" height="110" class="card"/>
  <text x="290" y="95" class="txt-lbl">🔄 ความเร็วรอบมอเตอร์ (RPM)</text>
  <text x="290" y="135" class="txt-val-rpm">1,480 rpm</text>
  <text x="290" y="158" font-size="10.5px" fill="#64748b">ความเร็วรอบใช้งานสูงสุด: 1800 rpm</text>

  <!-- Card 3: Status -->
  <rect x="510" y="65" width="220" height="110" class="card"/>
  <text x="530" y="95" class="txt-lbl">⚙️ สถานะระบบ (System Status)</text>
  <rect x="530" y="112" width="110" height="30" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
  <text x="585" y="132" text-anchor="middle" font-size="13px" font-weight="bold" fill="#34d399">🟢 RUNNING</text>
  <text x="530" y="158" font-size="10.5px" fill="#64748b">โหมดควบคุม: รีโมท (Auto)</text>

  <!-- Card 4: Historical Chart -->
  <rect x="30" y="195" width="460" height="150" class="card"/>
  <text x="50" y="222" class="txt-lbl">📈 กราฟเส้นแสดงอุณหภูมิ &amp; กระแสไฟฟ้า (ย้อนหลัง 1 ชม.)</text>
  
  <!-- Chart Grid -->
  <line x1="60" y1="245" x2="460" y2="245" class="chart-grid"/>
  <line x1="60" y1="280" x2="460" y2="280" class="chart-grid"/>
  <line x1="60" y1="315" x2="460" y2="315" class="chart-grid"/>
  
  <!-- Chart Lines & Area -->
  <path d="M 60 300 Q 110 270 160 290 T 260 250 T 360 280 T 460 260 L 460 315 L 60 315 Z" class="chart-area"/>
  <path d="M 60 300 Q 110 270 160 290 T 260 250 T 360 280 T 460 260" class="chart-line"/>
  <path d="M 60 280 Q 110 290 160 260 T 260 280 T 360 250 T 460 270" class="chart-line-sub"/>
  
  <!-- Chart Legends -->
  <circle cx="340" cy="220" r="4" fill="#38bdf8"/>
  <text x="350" y="223" font-size="10px" fill="#94a3b8">อุณหภูมิ (°C)</text>
  
  <circle cx="410" cy="220" r="4" fill="#fb7185"/>
  <text x="420" y="223" font-size="10px" fill="#94a3b8">กระแส (A)</text>

  <!-- Card 5: Controls -->
  <rect x="510" y="195" width="220" height="150" class="card"/>
  <text x="530" y="222" class="txt-lbl">🕹️ แผงควบคุม (Control Panel)</text>
  
  <!-- E-Stop button -->
  <rect x="530" y="240" width="180" height="34" class="btn-estop"/>
  <text x="620" y="261" text-anchor="middle" class="btn-txt">🚨 หยุดฉุกเฉิน (EMERGENCY STOP)</text>

  <!-- Slider -->
  <text x="530" y="300" font-size="11px" fill="#94a3b8">ปรับความเร็วรอบพัดลม (Target: 60%)</text>
  <rect x="530" y="312" width="180" height="6" class="slider-track"/>
  <rect x="530" y="312" width="108" height="6" class="slider-fill"/>
  <circle cx="638" cy="315" r="7" fill="#ffffff" stroke="#3b82f6" stroke-width="2.5"/>
</svg>
</div>

### ตัวอย่างโค้ดจำลองบน Wokwi (ESP32 + Serial Dashboard)

```cpp
#include <Arduino.h>

// จำลองเซนเซอร์
float readTemperature() { return 40.0 + random(0, 80) / 10.0; }
int readRPM()           { return 1400 + random(0, 200); }
float readCurrent()     { return 3.5 + random(0, 20) / 10.0; }

void printDashboard(float temp, int rpm, float current) {
  Serial.println("╔══════════════════════════════════╗");
  Serial.println("║   แดชบอร์ดมอเตอร์ #1              ║");
  Serial.println("╠══════════════════════════════════╣");
  Serial.print("║  อุณหภูมิ:  ");
  Serial.print(temp, 1);
  Serial.println(" °C");
  Serial.print("║  RPM:       ");
  Serial.println(rpm);
  Serial.print("║  กระแส:     ");
  Serial.print(current, 1);
  Serial.println(" A");
  Serial.print("║  สถานะ:     ");
  if (temp > 45.0) {
    Serial.println("⚠️  เตือน: อุณหภูมิสูง!");
  } else {
    Serial.println("✅ ปกติ");
  }
  Serial.println("╚══════════════════════════════════╝");
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  randomSeed(analogRead(0));
  Serial.println("เริ่มระบบติดตามมอเตอร์...");
}

void loop() {
  float temp    = readTemperature();
  int rpm       = readRPM();
  float current = readCurrent();

  printDashboard(temp, rpm, current);
  delay(3000);  // อัปเดตทุก 3 วินาที
}
```

**ลิงก์ทดลองบน Wokwi:** สร้างโปรเจกต์ใหม่ → เลือกบอร์ด ESP32 → วางโค้ดด้านบน → กด Run → ดูผลลัพธ์ใน Serial Monitor

---

## สรุปบทเรียน

บทนี้กล่าวถึงการเปลี่ยนข้อมูลดิบจากเซนเซอร์ IoT ให้เป็นภาพและส่วนติดต่อผู้ใช้ที่เข้าใจง่าย:

- **การแสดงผลข้อมูล** เป็นสะพานระหว่างข้อมูลดิบกับการตัดสินใจ ต้องยึดหลักความชัดเจน มีบริบท และไม่บิดเบือน
- **กราฟแต่ละชนิด** มีจุดประสงค์เฉพาะ: กราฟเส้นสำหรับแนวโน้ม กราฟแท่งสำหรับเปรียบเทียบ เกจสำหรับค่าปัจจุบัน
- **แดชบอร์ด** ต้องจัดลำดับความสำคัญ แสดงผลเรียลไทม์ และไม่แออัด
- **เครื่องมือ** มีหลายตัวเลือก: Node-RED (ง่าย), Grafana (ปรับแต่งสูง), ThingsBoard (Cloud + แดชบอร์ด/แอปมือถือผ่าน MQTT/RPC) เลือกใช้ตามความเหมาะสม
- **UI/UX สำหรับ IoT** ต้องเรียบง่าย ตอบสนองทันที และป้องกันข้อผิดพลาด
- **ThingsBoard** ช่วยสร้างแดชบอร์ดและแอปมือถือสำหรับ IoT ได้รวดเร็ว รองรับการควบคุมสองทิศทางผ่าน MQTT และ RPC

> 💡 **จำไว้:** แดชบอร์ดที่ดีที่สุดคือแดชบอร์ดที่ผู้ใช้ "เข้าใจภายใน 3 วินาที" โดยไม่ต้องมีคู่มือ

---

## แบบฝึกหัดท้ายบท

**ข้อ 1:** จงอธิบายว่าทำไม "ข้อมูลดิบ" จากเซนเซอร์จึงไม่เพียงพอสำหรับการตัดสินใจ และการแสดงผลข้อมูลช่วยแก้ปัญหานี้อย่างไร พร้อมยกตัวอย่างในบริบทวิศวกรรมเครื่องกล

**ข้อ 2:** กำหนดข้อมูลต่อไปนี้ จงเลือกชนิดกราฟที่เหมาะสมที่สุดพร้อมให้เหตุผล:
- (ก) อุณหภูมิน้ำหล่อเย็นทุก 10 วินาทีตลอด 8 ชั่วโมง
- (ข) เปรียบเทียบพลังงานที่ใช้ของเครื่องจักร 5 เครื่อง
- (ค) สัดส่วนเวลาที่เครื่องจักรอยู่ในสถานะ: Running, Idle, Maintenance
- (ง) ค่าแรงสั่นสะเทือน ณ ตำแหน่งต่าง ๆ บนเครื่องจักรในแต่ละชั่วโมง

**ข้อ 3:** จงออกแบบ Layout แดชบอร์ดสำหรับห้องเซิร์ฟเวอร์ที่มีเซนเซอร์วัดอุณหภูมิ 4 จุด เซนเซอร์ความชื้น 2 จุด และสถานะเครื่องปรับอากาศ 2 เครื่อง วาดแผนผังตำแหน่ง Widget ที่จะใช้ พร้อมอธิบายเหตุผลการจัดวาง

**ข้อ 4:** เปรียบเทียบ Node-RED, Grafana และ ThingsBoard ในแง่ต่อไปนี้ โดยสรุปเป็นตาราง:
- ความง่ายในการติดตั้ง
- ความสามารถในการปรับแต่งกราฟ
- ความเหมาะสมกับงาน Production ขนาดใหญ่
- จงแนะนำว่านักศึกษาปี 1 ควรเริ่มจากเครื่องมือใดและเพราะอะไร

**ข้อ 5:** เขียนโปรแกรม ESP32 บน Wokwi ที่อ่านค่าจาก Potentiometer (ต่อที่ GPIO34) แล้วแสดงผลเป็น "มาตรวัด" แบบข้อความใน Serial Monitor โดยใช้อักขระ `█` และ `░` แสดงระดับ 0-100% เช่น `████████░░░░░░░░░░░░ 40%`

---

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

## 12.9 สรุปประจำบทที่ 12 (Summary)

1.  **การแสดงผลข้อมูลที่ดี** ต้องให้ลำดับความสำคัญของตัวชี้วัด (KPIs) ชัดเจน สามารถสื่อสารถึงความผิดปกติของสภาวะเครื่องจักรให้กับทีมช่างเทคนิคได้ใน 3 วินาทีแรก
2.  **หลักการของ Tufte (Data-Ink Ratio)** แนะนำให้นักออกแบบตัดแต่งขอบเส้น แถบสีพื้น หรือลวดลายตกแต่งที่ฟุ่มเฟือยทิ้งไป เพื่อรักษาโฟกัสของข้อมูลจริงให้เด่นชัดที่สุด
3.  **Grafana** เป็นเครื่องมือสืบค้นข้อมูลเชิงวิเคราะห์และดึงค่าจากแหล่งฐานข้อมูลที่หลากหลาย มาทำหน้ารายงานภาพระดับโปรเจกต์ ได้แก่ การวิเคราะห์แนวโน้ม (Trending) และการทำนายความล้มเหลว
4.  **ส่วนควบคุม HMI** จะมีทิศทางการไหลข้อนกลับ โดยรองรับคำสั่งจากผู้ใช้งานส่งผ่านโปรโตคอลย้อนกลับไปขับระบบกระทำ (Actuators) เช่น ปล่อยกระแสกระตุ้นคอยล์รีเลย์เปิดพัดลมดูดอากาศ

---

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 12.10 แบบฝึกหัดท้ายบทที่ 12 (Exercises)

**ข้อ 1:** จงอธิบายความสำคัญของการคำนึงถึงทฤษฎีสีในการออกแบบแดชบอร์ดระดับอุตสาหกรรมในห้องควบคุมกลาง
**ข้อ 2:** ทฤษฎีอัตราส่วนข้อมูลต่อหมึกพิมพ์ (Data-Ink Ratio) มีกฎเหล็กสำคัญอย่างไรในการพล็อตและแสดงผลกราฟสถิติ?
**ข้อ 3:** สถาปัตยกรรมแบบการควบคุมย้อนกลับ (RPC - Remote Procedure Call) ในคลาวด์ ThingsBoard มีความสำคัญอย่างไรในการควบคุมอุปกรณ์ตัวกระทำภายนอกผ่านหน้าแดชบอร์ด?

</div>
