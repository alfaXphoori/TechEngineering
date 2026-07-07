# Chapter 11: การแสดงภาพข้อมูลและการออกแบบส่วนต่อประสานผู้ใช้ (Industrial HMI & Data Visualization)

> บทนี้จะอธิบายหลักการออกแบบแดชบอร์ด (Dashboard) และส่วนต่อประสานกับผู้ใช้งานระดับอุตสาหกรรม (Human-Machine Interface - HMI) ที่ถูกต้องตามหลักวิศวกรรมสรีรศาสตร์ (Ergonomics) ทฤษฎีข้อมูลต่อหมึกพิมพ์ของ Tufte และการประยุกต์ใช้โปรแกรมแสดงผลระดับสูงอย่าง Grafana ร่วมกับแพลตฟอร์มคลาวด์ ThingsBoard

---

## 11.1 ความสำคัญของการแสดงผลข้อมูลใน IoT

ระบบ IoT เก็บข้อมูลจากเซนเซอร์จำนวนมหาศาล — อุณหภูมิ ความชื้น แรงสั่นสะเทือน ค่ากระแสไฟฟ้า ฯลฯ ข้อมูลดิบ (Raw Data) เหล่านี้เป็นเพียงตัวเลขที่ไหลเข้ามาไม่หยุด หากไม่มี **การแสดงผลข้อมูล (Data Visualization)** ที่ดี ผู้ใช้จะไม่สามารถแปลงตัวเลขเหล่านั้นเป็น **ความเข้าใจ (Insight)** ได้

### ทำไมการแสดงผลจึงสำคัญ?

1. **เปลี่ยนข้อมูลดิบเป็นความเข้าใจ** — กราฟอุณหภูมิที่ไต่ขึ้นต่อเนื่องบอกได้ทันทีว่ามอเตอร์ร้อนผิดปกติ แต่ตารางตัวเลข 500 แถวบอกอะไรได้ยาก
2. **ตัดสินใจเร็วขึ้น** — แดชบอร์ดเรียลไทม์ช่วยให้วิศวกรตอบสนองต่อเหตุการณ์ได้ภายในวินาที
3. **สื่อสารกับทุกคน** — กราฟที่ชัดเจนทำให้ผู้จัดการที่ไม่ใช่วิศวกรเข้าใจสถานการณ์ได้
4. **ค้นหาแนวโน้มและความผิดปกติ** — รูปแบบ (Pattern) ที่ซ่อนอยู่ในข้อมูลจะปรากฏชัดเมื่อแสดงเป็นภาพ

> 💡 **หลักสำคัญ:** ข้อมูลที่ดีแต่แสดงผลแย่ = ไร้ประโยชน์ ในทางกลับกัน การแสดงผลสวยงามแต่ข้อมูลผิดพลาด = อันตราย ทั้งสองส่วนต้องถูกต้องควบคู่กัน

---

## 11.2 หลักการนำเสนอข้อมูลที่ดี

การออกแบบการแสดงผลข้อมูลที่ดีต้องยึดหลัก 3 ประการ:

### 11.2.1 ความชัดเจน (Clarity)

- ใช้กราฟที่เหมาะกับประเภทข้อมูล
- ตั้งชื่อแกน (Axis Label) และหน่วยให้ครบถ้วน เช่น "อุณหภูมิ (°C)" ไม่ใช่แค่ "Temp"
- หลีกเลี่ยงสี/ลวดลายที่ทำให้สับสน

### 11.2.2 บริบท (Context)

- แสดงช่วงเวลา (Time Range) ให้ชัดเจน
- มีเส้นอ้างอิง (Reference Line) เช่น ค่าเกณฑ์สูงสุดที่ยอมรับได้
- เปรียบเทียบกับค่าปกติ เช่น "วันนี้ vs. ค่าเฉลี่ย 7 วัน"

### 11.2.3 ไม่บิดเบือน (No Distortion)

- แกน Y ต้องเริ่มจาก 0 เมื่อเปรียบเทียบขนาด (Bar Chart)
- ไม่ตัดข้อมูลบางส่วนออกเพื่อให้กราฟดูดีขึ้น
- ใช้สเกลที่สม่ำเสมอ (Uniform Scale)

| หลักการ | ✅ ทำ | ❌ อย่าทำ |
|---------|------|----------|
| ความชัดเจน | ใช้สีแยกแยะข้อมูลชัดเจน ติดป้ายกำกับ | ยัดข้อมูล 10 ชุดในกราฟเดียว |
| บริบท | แสดงเส้นเกณฑ์เตือน (Threshold) | แสดงกราฟโดยไม่บอกช่วงเวลา |
| ไม่บิดเบือน | แกน Y เริ่มจาก 0 ในกราฟแท่ง | ตัดแกน Y เพื่อขยายความแตกต่าง |

---

## 11.3 ชนิดของกราฟและการเลือกใช้

### 11.3.1 กราฟเส้น (Line Chart)

เหมาะสำหรับข้อมูลแบบอนุกรมเวลา (Time-Series) เช่น อุณหภูมิทุก ๆ 5 วินาที แรงสั่นสะเทือนตลอดทั้งวัน แสดงให้เห็น **แนวโน้ม (Trend)** ได้ดีที่สุด

### 11.3.2 กราฟแท่ง (Bar Chart)

เหมาะสำหรับเปรียบเทียบค่าระหว่างหมวดหมู่ เช่น ปริมาณการใช้ไฟฟ้าของแต่ละเครื่องจักร พลังงานรายเดือน

### 11.3.3 เกจ / มาตรวัด (Gauge)

แสดงค่าปัจจุบันเทียบกับช่วงที่กำหนด เช่น ความเร็วรอบมอเตอร์ อุณหภูมิปัจจุบัน เหมาะกับแดชบอร์ดเรียลไทม์

### 11.3.4 แผนภูมิวงกลม (Pie Chart)

แสดงสัดส่วนของแต่ละส่วนเทียบกับทั้งหมด เช่น สัดส่วนพลังงานที่ใช้แต่ละระบบ ใช้เมื่อมีหมวดหมู่ไม่เกิน 5-6 รายการ

### 11.3.5 แผนที่ความร้อน (Heatmap)

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

## 11.4 แดชบอร์ด (Dashboard) และหลักการออกแบบ

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

## 9.5 เครื่องมือสำหรับแสดงผลข้อมูล IoT


## 11.5 การนำเสนอค่าทางสถิติด้วย Grafana

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

## 11.6 แดชบอร์ดของ ThingsBoard

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

## 11.7 การเชื่อมต่อกับโปรแกรมของผู้ใช้ (User Interface)

### 11.7.1 หลักการ UI/UX สำหรับ IoT

**UI (User Interface)** คือหน้าตาที่ผู้ใช้เห็นและสัมผัส **UX (User Experience)** คือประสบการณ์โดยรวมในการใช้งาน

หลักการสำคัญ:

- **เรียบง่าย (Simple):** แสดงเฉพาะสิ่งจำเป็น ผู้ใช้ไม่ควรต้องคิดว่าจะกดตรงไหน
- **ตอบสนองทันที (Responsive Feedback):** เมื่อกดปุ่มเปิดไฟ ต้องมีตอบกลับทันทีว่า "กำลังสั่ง..." หรือ "เปิดแล้ว"
- **ป้องกันข้อผิดพลาด (Error Prevention):** ปุ่มหยุดเครื่องจักรฉุกเฉินต้องมีการยืนยันก่อนทำงาน
- **สอดคล้องกัน (Consistency):** ใช้สีและตำแหน่งปุ่มเหมือนกันทุกหน้า

### 11.7.2 ส่วนควบคุม (Control Widgets)

| ส่วนควบคุม | ใช้สำหรับ | ตัวอย่าง |
|-----------|----------|---------|
| ปุ่ม (Button) | เปิด/ปิด หรือสั่งงานครั้งเดียว | เปิดปั๊มน้ำ, รีเซ็ตระบบ |
| สวิตช์ (Toggle Switch) | เปิด/ปิด แบบมีสถานะค้าง | เปิด/ปิดไฟ, เปิด/ปิดพัดลม |
| สไลเดอร์ (Slider) | ปรับค่าในช่วงต่อเนื่อง | ปรับความเร็วมอเตอร์ 0-100% |
| ช่องป้อนข้อมูล (Input Field) | ป้อนค่าตัวเลขที่แม่นยำ | ตั้งค่าอุณหภูมิเป้าหมาย 37.5°C |
| Dropdown | เลือกจากตัวเลือก | เลือกโหมดทำงาน: Auto/Manual |

### 11.7.3 โมบายแอป vs. เว็บแอป

- **เว็บแอป (Web App):** เปิดผ่านเบราว์เซอร์ ไม่ต้องติดตั้ง อัปเดตง่าย ใช้ได้ทุกอุปกรณ์ เหมาะกับแดชบอร์ดในโรงงาน
- **โมบายแอป (Mobile App):** ติดตั้งบนมือถือ รับ Push Notification ได้ ใช้งาน Offline บางส่วน เหมาะกับการแจ้งเตือนฉุกเฉิน

### 11.7.4 การใช้ ThingsBoard และสถาปัตยกรรม Telemetry / RPC

แพลตฟอร์ม **ThingsBoard** ออกแบบการสื่อสารระหว่างอุปกรณ์ไมโครคอนโทรลเลอร์กับผู้ใช้งานบนหลักการ **คีย์สตริง (String Key)** แทนการอ้างอิงพินทางกายภาพโดยตรง ทำให้โค้ดบนบอร์ดเป็นอิสระจากขา GPIO และสามารถปรับเปลี่ยนฮาร์ดแวร์ได้โดยไม่กระทบต่อการตั้งค่าแดชบอร์ด

#### 1. คีย์โทรมาตรและ RPC Method (Telemetry Keys & RPC Methods)
ThingsBoard ไม่มีแนวคิด "พินเสมือน" แต่ใช้สองกลไกหลัก:
- **Telemetry Keys (คีย์โทรมาตร):** สตริงชื่อตัวแปรที่บอร์ดส่งขึ้นคลาวด์ เช่น `"temperature"`, `"humidity"` ซึ่งแดชบอร์ดจะผูก Widget เข้ากับคีย์เหล่านี้โดยตรง
- **RPC Methods (เมธอด RPC):** ชื่อคำสั่งในรูปแบบสตริง เช่น `"setLed"`, `"setSpeed"` ที่แดชบอร์ดส่งลงมาควบคุมฮาร์ดแวร์ บอร์ดจะระบุแอคชันเฉพาะผ่านชื่อเมธอดนี้และนำค่าพารามิเตอร์ไปสั่งงาน GPIO
- **ข้อดี:** เปลี่ยนพิน GPIO ในวงจร (เช่น จาก GPIO2 เป็น GPIO5) โดยแก้โค้ดฝั่งบอร์ดเพียงจุดเดียว แดชบอร์ดไม่ต้องเปลี่ยนแปลงใด ๆ

#### 2. กลไกการอัปโหลดข้อมูลเซนเซอร์ (Uplink — publish Telemetry)
เมื่อ ESP32 ต้องการส่งอุณหภูมิขึ้นแสดงผลบนแดชบอร์ด:
- บอร์ดจัดเตรียมข้อมูลในรูปแบบ JSON เช่น `{"temperature": 28.5}`
- เรียกใช้ `client.publish("v1/devices/me/telemetry", payload)` ผ่านโปรโตคอล MQTT ไปยัง ThingsBoard Cloud ที่ `thingsboard.cloud:1883`
- ThingsBoard จะบันทึกค่าลงฐานข้อมูลอนุกรมเวลา (Time-series Storage) และอัปเดต Widget ทุกตัวที่ผูกกับคีย์ `"temperature"` บนแดชบอร์ดในทันที

#### 3. กลไกการรับคำสั่งควบคุมอุปกรณ์ (Downlink — RPC Command)
เมื่อผู้ใช้กดสวิตช์ Toggle บนแดชบอร์ดเพื่อสั่งเปิด-ปิด LED:
- แดชบอร์ดส่ง RPC Request มาในรูป JSON เช่น `{"method": "setLed", "params": true}` ลงมาที่ Topic `v1/devices/me/rpc/request/{id}`
- บอร์ดที่ Subscribe Topic `v1/devices/me/rpc/request/+` ไว้จะได้รับข้อความนี้ผ่านฟังก์ชัน Callback `onRpcCommand()`
- ภายใน Callback บอร์ดแยกค่า `method` และ `params` ออกมาสั่งงาน `digitalWrite(LED_PIN, params)` แล้วตอบกลับ (RPC Response) บน Topic `v1/devices/me/rpc/response/{id}` ด้วย `{"success": true}`

#### 4. การซิงโครไนซ์สถานะอุปกรณ์ด้วย Shared Attributes
**ปัญหา:** เมื่อ ESP32 รีบูตหลังไฟดับ ค่าตัวแปรในหน่วยความจำ RAM จะหายทั้งหมด (LED กลับเป็น OFF) แต่แดชบอร์ดยังแสดงสวิตช์เป็น ON เนื่องจากคลาวด์เก็บสถานะล่าสุดไว้ สถานะจึงไม่ตรงกัน

**วิธีแก้ด้วย ThingsBoard Shared Attributes:**
- เมื่อบอร์ดเชื่อมต่อคลาวด์สำเร็จ บอร์ดจะส่งคำขอดึงสถานะล่าสุดไปยัง Topic `v1/devices/me/attributes/request/1`
- ThingsBoard จะตอบกลับด้วยค่าคุณลักษณะ (Attribute) ที่บันทึกไว้บนคลาวด์ เช่น `{"ledState": true}`
- บอร์ดอ่านค่านี้มาตั้งสถานะฮาร์ดแวร์ให้ตรงกับแดชบอร์ดโดยอัตโนมัติทันที
- กลไกนี้เรียกว่า **Digital Twin** — ThingsBoard เก็บ "ภาพจำลองดิจิทัล" ของสถานะอุปกรณ์ทุกตัวบนคลาวด์ตลอดเวลา

<div style="text-align: center; margin: 25px 0;">
<svg viewBox="0 0 820 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>สถาปัตยกรรม ThingsBoard Telemetry และ RPC สองทิศทาง</title>
  <style>
    #tb9-svg .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; }
    #tb9-svg .box-esp { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; }
    #tb9-svg .box-cloud { fill: #eff6ff; stroke: #2563eb; stroke-width: 2; }
    #tb9-svg .box-dash { fill: #f0fdf4; stroke: #16a34a; stroke-width: 2; }
    #tb9-svg .code-box { fill: #f1f5f9; stroke: #e2e8f0; stroke-width: 1; }

    #tb9-svg .lbl-title { font-size: 13px; font-weight: 700; fill: #0f172a; }
    #tb9-svg .lbl-sub { font-size: 9px; fill: #64748b; font-weight: 500; }
    #tb9-svg .lbl-code-p { font-size: 9px; font-family: monospace; fill: #7c3aed; font-weight: bold; }
    #tb9-svg .lbl-code-g { font-size: 9px; font-family: monospace; fill: #059669; font-weight: bold; }
    #tb9-svg .lbl-code-r { font-size: 9px; font-family: monospace; fill: #dc2626; font-weight: bold; }
    #tb9-svg .lbl-key { font-size: 9px; font-weight: 700; fill: #ffffff; }

    #tb9-svg .flow-up { fill: none; stroke: #10b981; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 6 7; animation: tb9-right 1.8s linear infinite; }
    #tb9-svg .flow-down { fill: none; stroke: #ef4444; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 6 7; animation: tb9-left 1.8s linear infinite; }
    #tb9-svg .flow-sync { fill: none; stroke: #6366f1; stroke-width: 2; stroke-linecap: round; stroke-dasharray: 4 5; animation: tb9-left 2.2s linear infinite; }

    @keyframes tb9-right { to { stroke-dashoffset: -26; } }
    @keyframes tb9-left  { to { stroke-dashoffset:  26; } }

    #tb9-svg .pill-g { fill: #10b981; }
    #tb9-svg .pill-r { fill: #ef4444; }
    #tb9-svg .pill-i { fill: #6366f1; }
    #tb9-svg .widget-box { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; }
    #tb9-svg .btn-glow { animation: tb9-pulse 2s infinite ease-in-out; }
    @keyframes tb9-pulse { 0%,100% { opacity: 0.8; } 50% { opacity: 1; } }
  </style>

  <g id="tb9-svg">
    <rect x="5" y="5" width="810" height="390" rx="10" class="bg"/>

    <!-- Main Title -->
    <text x="410" y="30" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">สถาปัตยกรรม ThingsBoard: Telemetry Keys + RPC Methods (สองทิศทาง)</text>

    <!-- ========== LEFT: ESP32 ========== -->
    <rect x="20" y="50" width="215" height="320" rx="8" class="box-esp"/>
    <text x="127" y="73" text-anchor="middle" class="lbl-title" fill="#7c3aed">ESP32 (บอร์ดควบคุม)</text>
    <text x="127" y="88" text-anchor="middle" class="lbl-sub">WiFi: Wokwi-GUEST | Auth: Access Token</text>

    <!-- Code block: Telemetry publish -->
    <rect x="32" y="100" width="191" height="72" rx="4" class="code-box"/>
    <text x="42" y="115" class="lbl-sub">ส่งข้อมูลอุณหภูมิขึ้นคลาวด์ (ทุก 3 วินาที)</text>
    <text x="42" y="132" class="lbl-code-g">StaticJsonDocument&lt;128&gt; doc;</text>
    <text x="42" y="147" class="lbl-code-g">doc["temperature"] = temp;</text>
    <text x="42" y="162" class="lbl-code-g">client.publish(</text>
    <text x="52" y="175" class="lbl-code-g">"v1/devices/me/telemetry", buf);</text>
    <circle cx="223" cy="110" r="5" fill="#10b981"/>

    <!-- Code block: RPC handler -->
    <rect x="32" y="186" width="191" height="88" rx="4" class="code-box"/>
    <text x="42" y="201" class="lbl-sub">รับคำสั่ง RPC ควบคุม LED (GPIO2)</text>
    <text x="42" y="217" class="lbl-code-r">void onRpcCommand(char* topic,</text>
    <text x="52" y="230" class="lbl-code-r">  byte* payload, uint len) {</text>
    <text x="52" y="243" class="lbl-code-r">  const char* m = doc["method"];</text>
    <text x="52" y="256" class="lbl-code-r">  if (!strcmp(m,"setLed"))</text>
    <text x="62" y="269" class="lbl-code-r">    digitalWrite(2, doc["params"]);</text>
    <text x="42" y="269" class="lbl-code-r">}</text>
    <circle cx="223" cy="230" r="5" fill="#ef4444"/>

    <!-- Code block: Shared Attr sync -->
    <rect x="32" y="288" width="191" height="65" rx="4" class="code-box"/>
    <text x="42" y="303" class="lbl-sub">ร้องขอสถานะล่าสุดเมื่อเชื่อมต่อใหม่</text>
    <text x="42" y="319" class="lbl-code-p">client.publish(</text>
    <text x="52" y="332" class="lbl-code-p">"v1/devices/me/</text>
    <text x="52" y="345" class="lbl-code-p">  attributes/request/1", "{}");</text>
    <circle cx="223" cy="318" r="5" fill="#6366f1"/>

    <!-- ========== MIDDLE: ThingsBoard Cloud ========== -->
    <rect x="305" y="50" width="210" height="320" rx="8" class="box-cloud"/>
    <text x="410" y="73" text-anchor="middle" class="lbl-title" fill="#2563eb">ThingsBoard Cloud</text>
    <text x="410" y="88" text-anchor="middle" class="lbl-sub">thingsboard.cloud:1883 | Access Token Auth</text>

    <!-- Telemetry Key pill -->
    <rect x="330" y="105" width="160" height="32" rx="6" class="pill-g"/>
    <text x="410" y="125" text-anchor="middle" class="lbl-key">"temperature" (Telemetry Key)</text>

    <!-- RPC Method pill -->
    <rect x="330" y="195" width="160" height="32" rx="6" class="pill-r"/>
    <text x="410" y="215" text-anchor="middle" class="lbl-key">"setLed" (RPC Method)</text>

    <!-- Shared Attribute pill -->
    <rect x="330" y="295" width="160" height="32" rx="6" class="pill-i"/>
    <text x="410" y="315" text-anchor="middle" class="lbl-key">ledState (Shared Attribute)</text>

    <!-- Digital Twin label -->
    <rect x="325" y="345" width="170" height="18" rx="4" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
    <text x="410" y="358" text-anchor="middle" font-size="9" font-weight="700" fill="#1e40af">Digital Twin: เก็บสถานะล่าสุดบนคลาวด์</text>

    <!-- ========== RIGHT: Dashboard ========== -->
    <rect x="585" y="50" width="210" height="320" rx="8" class="box-dash"/>
    <text x="690" y="73" text-anchor="middle" class="lbl-title" fill="#16a34a">แดชบอร์ด (Web / App)</text>
    <text x="690" y="88" text-anchor="middle" class="lbl-sub">ThingsBoard Dashboard</text>

    <!-- Widget: Gauge -->
    <rect x="605" y="105" width="170" height="38" rx="4" class="widget-box"/>
    <text x="615" y="120" font-size="9" font-weight="700" fill="#475569">Gauge: อุณหภูมิ</text>
    <text x="770" y="132" text-anchor="end" font-size="9" font-weight="700" fill="#10b981">"temperature"</text>
    <path d="M 615,135 A 16,16 0 0 1 647,135" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    <path d="M 615,135 A 16,16 0 0 1 638,120" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
    <circle cx="631" cy="135" r="3" fill="#334155"/>

    <!-- Widget: Switch -->
    <rect x="605" y="195" width="170" height="38" rx="4" class="widget-box"/>
    <text x="615" y="210" font-size="9" font-weight="700" fill="#475569">Switch: เปิด/ปิด LED</text>
    <rect x="735" y="203" width="26" height="14" rx="7" fill="#ef4444"/>
    <circle cx="741" cy="210" r="5" fill="#ffffff" class="btn-glow"/>
    <text x="770" y="222" text-anchor="end" font-size="9" font-weight="700" fill="#ef4444">"setLed" RPC</text>

    <!-- Widget: Shared Attr display -->
    <rect x="605" y="295" width="170" height="38" rx="4" class="widget-box"/>
    <text x="615" y="310" font-size="9" font-weight="700" fill="#475569">Value: สถานะ LED</text>
    <text x="770" y="322" text-anchor="end" font-size="9" font-weight="700" fill="#6366f1">ledState (Attr)</text>
    <circle cx="745" cy="316" r="6" fill="#6366f1" opacity="0.8"/>

    <!-- ========== FLOW LINES ========== -->
    <!-- Telemetry up: ESP32 -> Cloud -->
    <path d="M 235 121 H 299" class="flow-up"/>
    <!-- Telemetry up: Cloud -> Dashboard -->
    <path d="M 515 121 H 579" class="flow-up"/>
    <text x="267" y="113" font-size="8" fill="#10b981" font-weight="bold" text-anchor="middle">Telemetry</text>
    <text x="547" y="113" font-size="8" fill="#10b981" font-weight="bold" text-anchor="middle">push ขึ้นหน้าจอ</text>

    <!-- RPC down: Dashboard -> Cloud -->
    <path d="M 579 211 H 515" class="flow-down"/>
    <!-- RPC down: Cloud -> ESP32 -->
    <path d="M 299 211 H 235" class="flow-down"/>
    <text x="547" y="205" font-size="8" fill="#ef4444" font-weight="bold" text-anchor="middle">RPC Request</text>
    <text x="267" y="205" font-size="8" fill="#ef4444" font-weight="bold" text-anchor="middle">RPC Response</text>

    <!-- Sync: ESP32 -> Cloud (curved) -->
    <path d="M 235 311 C 267 350 299 350 305 311" class="flow-sync"/>
    <text x="267" y="368" font-size="8" fill="#6366f1" font-weight="bold" text-anchor="middle">Attr Request / Response</text>
    <!-- Sync: Cloud -> Dashboard -->
    <path d="M 515 311 H 579" class="flow-sync"/>
    <text x="547" y="305" font-size="8" fill="#6366f1" font-weight="bold" text-anchor="middle">Attr sync</text>
  </g>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 9.2 สถาปัตยกรรม ThingsBoard: Telemetry Key "temperature" (สีเขียว, ขาขึ้น), RPC Method "setLed" (สีแดง, ขาลง) และ Shared Attribute Sync (สีม่วง, ซิงค์สถานะ)</div>
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

## 11.8 ตัวอย่างการออกแบบแดชบอร์ดติดตามเครื่องจักร

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

## 11.9 สรุปประจำบทที่ 11 (Summary)

1.  **การแสดงผลข้อมูลที่ดี** ต้องให้ลำดับความสำคัญของตัวชี้วัด (KPIs) ชัดเจน สามารถสื่อสารถึงความผิดปกติของสภาวะเครื่องจักรให้กับทีมช่างเทคนิคได้ใน 3 วินาทีแรก
2.  **หลักการของ Tufte (Data-Ink Ratio)** แนะนำให้นักออกแบบตัดแต่งขอบเส้น แถบสีพื้น หรือลวดลายตกแต่งที่ฟุ่มเฟือยทิ้งไป เพื่อรักษาโฟกัสของข้อมูลจริงให้เด่นชัดที่สุด
3.  **Grafana** เป็นเครื่องมือสืบค้นข้อมูลเชิงวิเคราะห์และดึงค่าจากแหล่งฐานข้อมูลที่หลากหลาย มาทำหน้ารายงานภาพระดับโปรเจกต์ ได้แก่ การวิเคราะห์แนวโน้ม (Trending) และการทำนายความล้มเหลว
4.  **ส่วนควบคุม HMI** จะมีทิศทางการไหลข้อนกลับ โดยรองรับคำสั่งจากผู้ใช้งานส่งผ่านโปรโตคอลย้อนกลับไปขับระบบกระทำ (Actuators) เช่น ปล่อยกระแสกระตุ้นคอยล์รีเลย์เปิดพัดลมดูดอากาศ

---

## 11.10 แบบฝึกหัดท้ายบทที่ 11 (Exercises)

**ข้อ 1:** จงอธิบายความสำคัญของการคำนึงถึงทฤษฎีสีในการออกแบบแดชบอร์ดระดับอุตสาหกรรมในห้องควบคุมกลาง
**ข้อ 2:** ทฤษฎีอัตราส่วนข้อมูลต่อหมึกพิมพ์ (Data-Ink Ratio) มีกฎเหล็กสำคัญอย่างไรในการพล็อตและแสดงผลกราฟสถิติ?
**ข้อ 3:** สถาปัตยกรรมแบบการควบคุมย้อนกลับ (RPC - Remote Procedure Call) ในคลาวด์ ThingsBoard มีความสำคัญอย่างไรในการควบคุมอุปกรณ์ตัวกระทำภายนอกผ่านหน้าแดชบอร์ด?
