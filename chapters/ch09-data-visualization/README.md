# Chapter 9: การแสดงผลข้อมูลและโปรแกรมของผู้ใช้
## Data Visualization & User Interface

---

## 9.1 ความสำคัญของการแสดงผลข้อมูลใน IoT

ระบบ IoT เก็บข้อมูลจากเซนเซอร์จำนวนมหาศาล — อุณหภูมิ ความชื้น แรงสั่นสะเทือน ค่ากระแสไฟฟ้า ฯลฯ ข้อมูลดิบ (Raw Data) เหล่านี้เป็นเพียงตัวเลขที่ไหลเข้ามาไม่หยุด หากไม่มี **การแสดงผลข้อมูล (Data Visualization)** ที่ดี ผู้ใช้จะไม่สามารถแปลงตัวเลขเหล่านั้นเป็น **ความเข้าใจ (Insight)** ได้

### ทำไมการแสดงผลจึงสำคัญ?

1. **เปลี่ยนข้อมูลดิบเป็นความเข้าใจ** — กราฟอุณหภูมิที่ไต่ขึ้นต่อเนื่องบอกได้ทันทีว่ามอเตอร์ร้อนผิดปกติ แต่ตารางตัวเลข 500 แถวบอกอะไรได้ยาก
2. **ตัดสินใจเร็วขึ้น** — แดชบอร์ดเรียลไทม์ช่วยให้วิศวกรตอบสนองต่อเหตุการณ์ได้ภายในวินาที
3. **สื่อสารกับทุกคน** — กราฟที่ชัดเจนทำให้ผู้จัดการที่ไม่ใช่วิศวกรเข้าใจสถานการณ์ได้
4. **ค้นหาแนวโน้มและความผิดปกติ** — รูปแบบ (Pattern) ที่ซ่อนอยู่ในข้อมูลจะปรากฏชัดเมื่อแสดงเป็นภาพ

> 💡 **หลักสำคัญ:** ข้อมูลที่ดีแต่แสดงผลแย่ = ไร้ประโยชน์ ในทางกลับกัน การแสดงผลสวยงามแต่ข้อมูลผิดพลาด = อันตราย ทั้งสองส่วนต้องถูกต้องควบคู่กัน

---

## 9.2 หลักการนำเสนอข้อมูลที่ดี

การออกแบบการแสดงผลข้อมูลที่ดีต้องยึดหลัก 3 ประการ:

### 9.2.1 ความชัดเจน (Clarity)

- ใช้กราฟที่เหมาะกับประเภทข้อมูล
- ตั้งชื่อแกน (Axis Label) และหน่วยให้ครบถ้วน เช่น "อุณหภูมิ (°C)" ไม่ใช่แค่ "Temp"
- หลีกเลี่ยงสี/ลวดลายที่ทำให้สับสน

### 9.2.2 บริบท (Context)

- แสดงช่วงเวลา (Time Range) ให้ชัดเจน
- มีเส้นอ้างอิง (Reference Line) เช่น ค่าเกณฑ์สูงสุดที่ยอมรับได้
- เปรียบเทียบกับค่าปกติ เช่น "วันนี้ vs. ค่าเฉลี่ย 7 วัน"

### 9.2.3 ไม่บิดเบือน (No Distortion)

- แกน Y ต้องเริ่มจาก 0 เมื่อเปรียบเทียบขนาด (Bar Chart)
- ไม่ตัดข้อมูลบางส่วนออกเพื่อให้กราฟดูดีขึ้น
- ใช้สเกลที่สม่ำเสมอ (Uniform Scale)

| หลักการ | ✅ ทำ | ❌ อย่าทำ |
|---------|------|----------|
| ความชัดเจน | ใช้สีแยกแยะข้อมูลชัดเจน ติดป้ายกำกับ | ยัดข้อมูล 10 ชุดในกราฟเดียว |
| บริบท | แสดงเส้นเกณฑ์เตือน (Threshold) | แสดงกราฟโดยไม่บอกช่วงเวลา |
| ไม่บิดเบือน | แกน Y เริ่มจาก 0 ในกราฟแท่ง | ตัดแกน Y เพื่อขยายความแตกต่าง |

---

## 9.3 ชนิดของกราฟและการเลือกใช้

### 9.3.1 กราฟเส้น (Line Chart)

เหมาะสำหรับข้อมูลแบบอนุกรมเวลา (Time-Series) เช่น อุณหภูมิทุก ๆ 5 วินาที แรงสั่นสะเทือนตลอดทั้งวัน แสดงให้เห็น **แนวโน้ม (Trend)** ได้ดีที่สุด

### 9.3.2 กราฟแท่ง (Bar Chart)

เหมาะสำหรับเปรียบเทียบค่าระหว่างหมวดหมู่ เช่น ปริมาณการใช้ไฟฟ้าของแต่ละเครื่องจักร พลังงานรายเดือน

### 9.3.3 เกจ / มาตรวัด (Gauge)

แสดงค่าปัจจุบันเทียบกับช่วงที่กำหนด เช่น ความเร็วรอบมอเตอร์ อุณหภูมิปัจจุบัน เหมาะกับแดชบอร์ดเรียลไทม์

### 9.3.4 แผนภูมิวงกลม (Pie Chart)

แสดงสัดส่วนของแต่ละส่วนเทียบกับทั้งหมด เช่น สัดส่วนพลังงานที่ใช้แต่ละระบบ ใช้เมื่อมีหมวดหมู่ไม่เกิน 5-6 รายการ

### 9.3.5 แผนที่ความร้อน (Heatmap)

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

## 9.4 แดชบอร์ด (Dashboard) และหลักการออกแบบ

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

### 9.5.1 Node-RED

**Node-RED** เป็นเครื่องมือเขียนโปรแกรมในลักษณะ **Flow-Based Programming (FBP)** ที่ออกแบบมาสำหรับยุค IoT และ Web Services โดยเฉพาะ พัฒนาขึ้นโดย IBM ทำงานบนแพลตฟอร์ม Node.js ทำให้นักพัฒนาสามารถเชื่อมโยงอุปกรณ์ฮาร์ดแวร์, API และบริการออนไลน์เข้าด้วยกันได้อย่างรวดเร็วผ่านตัวแก้ไขแบบลากวาง (Flow Editor) บนเว็บเบราว์เซอร์

#### โครงสร้างและองค์ประกอบหลักของ Node-RED
1. **Nodes (โหนด):** บล็อกฟังก์ชันสำเร็จรูปที่ทำหน้าที่เฉพาะเจาะจง แบ่งออกเป็น 3 ประเภทหลัก:
   - **Input Nodes (โหนดนำเข้าข้อมูล):** รับข้อมูลจากแหล่งภายนอกเข้ามายังโฟลว์ เช่น `mqtt in` (รับข้อมูลจาก MQTT Broker), `inject` (การจำลองการส่งข้อมูลด้วยการกดปุ่มส่งแบบตั้งเวลา), และ `http in` (สร้าง Endpoint ของเว็บรับข้อมูลแบบ REST API)
   - **Processing/Function Nodes (โหนดประมวลผล):** ทำการเปลี่ยนแปลง ปรับปรุง หรือตรวจสอบเงื่อนไขของข้อมูล เช่น `function` (เขียนโค้ดด้วยภาษา JavaScript เพื่อควบคุมข้อมูลอย่างอิสระ), `switch` (แยกเส้นทางการไหลตามเงื่อนไข), และ `change` (แก้ไข เพิ่มเติม หรือลบค่าตัวแปรในออบเจกต์)
   - **Output Nodes (โหนดส่งออกข้อมูล):** ส่งข้อมูลที่ผ่านการประมวลผลแล้วไปยังปลายทาง เช่น `mqtt out` (ส่งข้อมูลไปเก็บหรือสั่งงานผ่าน MQTT), `debug` (แสดงค่าในหน้าจอดีบักเพื่อตรวจสอบสถานะการทำงาน), และ `ui_gauge` / `ui_chart` (แสดงผลข้อมูลบนหน้าแดชบอร์ด)

2. **Flow & Message Routing (ทิศทางและการส่งต่อข้อมูล):**
   - การสื่อสารระหว่างโหนดจะใช้วัตถุข้อความภาษา JavaScript ที่เรียกว่า **Message Object (`msg`)**
   - ตัวแปรหลักที่บรรจุข้อมูลส่งผ่านไปยังโหนดอื่น ๆ คือ **`msg.payload`** ซึ่งอาจเป็นได้ทั้งตัวเลข (Number), ข้อความ (String), หรือออบเจกต์โครงสร้าง (JSON Object)
   - นอกจากนี้ยังมีตัวแปรเสริม เช่น `msg.topic` เพื่อระบุหัวข้อหรือประเภทของข้อมูลที่เคลื่อนที่ผ่านตัวนำทาง (Wire)

3. **Function Node JavaScript Programming:**
   - เป็นโหนดที่มีความยืดหยุ่นสูงที่สุดเนื่องจากเปิดโอกาสให้เขียนโปรแกรม JavaScript ลงไป เพื่อคำนวณและประมวลผล ตัวอย่างเช่น:
     ```javascript
     // ตัวอย่างการคัดกรองข้อมูลอุณหภูมิและเปลี่ยนสถานะแจ้งเตือน
     let temp = msg.payload.temperature;
     if (temp > 40.0) {
         msg.payload = { status: "DANGER", value: temp, alarm: true };
         return [msg, null]; // ส่งออกไปยังช่องเอาต์พุตที่ 1 (เตือนภัย)
     } else {
         msg.payload = { status: "NORMAL", value: temp, alarm: false };
         return [null, msg]; // ส่งออกไปยังช่องเอาต์พุตที่ 2 (สถานะปกติ)
     }
     ```

4. **Node-RED Dashboard Layout Structure:**
   - โครงสร้างการแสดงผลของโหนดแดชบอร์ด (`node-red-dashboard`) จะเป็นรูปแบบแผนผังต้นไม้ (Tree Structure) เพื่อความเป็นระเบียบและรองรับการจัดสรรบนขนาดหน้าจอที่แตกต่างกัน (Responsive Layout):
     - **Tabs (แท็บหลัก):** แถบหน้าต่างหลักสำหรับแยกหน้าการแสดงผลตามหมวดหมู่ใหญ่ (เช่น หน้าควบคุมห้องนั่งเล่น, หน้าสถิติพลังงาน)
     - **Groups (กลุ่มย่อย):** กล่องจัดกลุ่ม (Card Container) บนแต่ละแท็บเพื่อนำเอาชิ้นส่วนควบคุมหรือแสดงผลที่เกี่ยวข้องกันมารวมไว้ด้วยกัน
     - **Widgets (วิดเจ็ตแสดงผล):** ส่วนควบคุมปฏิสัมพันธ์และอุปกรณ์แสดงผลชิ้นย่อยสุดที่อยู่ภายในกลุ่ม เช่น ปุ่มกด (Button), สวิตช์สลับ (Switch), เกจ (Gauge), กราฟเส้น (Chart) และตารางแสดงข้อมูล (Table)

<div style="text-align: center; margin: 25px 0;">
<svg viewBox="0 0 800 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>โครงสร้างการไหลของข้อมูลใน Node-RED</title>
  <style>
    .bg { fill: #0f172a; stroke: #1e293b; stroke-width: 2; rx: 12px; }
    .grid { fill: none; stroke: #1e293b; stroke-width: 1; stroke-dasharray: 4 4; }
    .node-border-mqtt { fill: #312e81; stroke: #6366f1; stroke-width: 2; rx: 8px; }
    .node-border-func { fill: #064e3b; stroke: #10b981; stroke-width: 2; rx: 8px; }
    .node-border-ui { fill: #78350f; stroke: #f59e0b; stroke-width: 2; rx: 8px; }
    .wire { fill: none; stroke: #475569; stroke-width: 3; stroke-linecap: round; }
    .wire-active { fill: none; stroke: #38bdf8; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 8 10; animation: flowData 2s linear infinite; }
    .packet { fill: #38bdf8; filter: drop-shadow(0 0 4px #38bdf8); }
    .node-title { font-size: 14px; font-weight: bold; fill: #f8fafc; }
    .node-sub { font-size: 11px; fill: #94a3b8; }
    .text-tag { font-size: 10px; font-weight: bold; fill: #ffffff; }
    .tag-mqtt { fill: #4f46e5; rx: 4px; }
    .tag-func { fill: #059669; rx: 4px; }
    .tag-ui { fill: #d97706; rx: 4px; }
    .port { fill: #e2e8f0; stroke: #475569; stroke-width: 1.5; }
    .wire-glow { fill: none; stroke: #06b6d4; stroke-width: 5; opacity: 0.15; stroke-linecap: round; }
    
    /* Animations */
    @keyframes flowData {
      to { stroke-dashoffset: -36; }
    }
    .gauge-needle {
      transform-origin: 640px 145px;
      animation: swingNeedle 4s ease-in-out infinite alternate;
    }
    @keyframes swingNeedle {
      0% { transform: rotate(-60deg); }
      50% { transform: rotate(10deg); }
      100% { transform: rotate(45deg); }
    }
    .chart-line {
      stroke-dasharray: 200;
      stroke-dashoffset: 200;
      animation: drawChart 8s linear infinite;
    }
    @keyframes drawChart {
      0%, 10% { stroke-dashoffset: 200; }
      50%, 100% { stroke-dashoffset: 0; }
    }
    .node-hover {
      transition: all 0.3s ease;
    }
    .node-hover:hover {
      filter: brightness(1.2);
      cursor: pointer;
    }
  </style>

  <!-- Background and grid -->
  <rect x="0" y="0" width="800" height="360" class="bg"/>
  <g class="grid">
    <path d="M 0,40 H 800 M 0,80 H 800 M 0,120 H 800 M 0,160 H 800 M 0,200 H 800 M 0,240 H 800 M 0,280 H 800 M 0,320 H 800" />
    <path d="M 80,0 V 360 M 160,0 V 360 M 240,0 V 360 M 320,0 V 360 M 400,0 V 360 M 480,0 V 360 M 560,0 V 360 M 640,0 V 360 M 720,0 V 360" />
  </g>

  <!-- Connection Wires -->
  <!-- Wire from MQTT to Function -->
  <path d="M 230,120 C 280,120 280,180 330,180" class="wire-glow"/>
  <path d="M 230,120 C 280,120 280,180 330,180" class="wire"/>
  <path id="wire1" d="M 230,120 C 280,120 280,180 330,180" class="wire-active"/>

  <!-- Wire from Function Output 1 to Gauge -->
  <path d="M 480,165 C 530,165 530,120 580,120" class="wire-glow"/>
  <path d="M 480,165 C 530,165 530,120 580,120" class="wire"/>
  <path id="wire2" d="M 480,165 C 530,165 530,120 580,120" class="wire-active"/>

  <!-- Wire from Function Output 2 to Chart -->
  <path d="M 480,195 C 530,195 530,240 580,240" class="wire-glow"/>
  <path d="M 480,195 C 530,195 530,240 580,240" class="wire"/>
  <path id="wire3" d="M 480,195 C 530,195 530,240 580,240" class="wire-active"/>

  <!-- Node 1: MQTT Input (mqtt in) -->
  <g transform="translate(50, 80)" class="node-hover">
    <rect x="0" y="0" width="180" height="80" class="node-border-mqtt"/>
    <rect x="10" y="10" width="55" height="18" class="tag-mqtt"/>
    <text x="37" y="22" class="text-tag" text-anchor="middle">mqtt in</text>
    <text x="15" y="48" class="node-title">รับค่าอุณหภูมิ</text>
    <text x="15" y="66" class="node-sub">หัวข้อ: office/temp</text>
    <circle cx="180" cy="40" r="5" class="port"/>
  </g>

  <!-- Node 2: Function Node -->
  <g transform="translate(300, 140)" class="node-hover">
    <rect x="0" y="0" width="180" height="80" class="node-border-func"/>
    <rect x="10" y="10" width="55" height="18" class="tag-func"/>
    <text x="37" y="22" class="text-tag" text-anchor="middle">function</text>
    <text x="15" y="48" class="node-title">ตรวจสอบเงื่อนไข</text>
    <text x="15" y="66" class="node-sub">msg.payload > 35.0 ?</text>
    <circle cx="0" cy="40" r="5" class="port"/>
    <circle cx="180" cy="25" r="5" class="port"/>
    <circle cx="180" cy="55" r="5" class="port"/>
    <text x="170" y="28" font-size="9" fill="#94a3b8" text-anchor="end">1</text>
    <text x="170" y="58" font-size="9" fill="#94a3b8" text-anchor="end">2</text>
  </g>

  <!-- Node 3: Gauge Node (ui_gauge) -->
  <g transform="translate(580, 80)" class="node-hover">
    <rect x="0" y="0" width="180" height="80" class="node-border-ui"/>
    <rect x="10" y="10" width="55" height="18" class="tag-ui"/>
    <text x="37" y="22" class="text-tag" text-anchor="middle">ui_gauge</text>
    <text x="15" y="48" class="node-title">เกจวัดความร้อน</text>
    <text x="15" y="66" class="node-sub">แท็บ: แดชบอร์ดหลัก</text>
    <circle cx="0" cy="40" r="5" class="port"/>
  </g>

  <!-- Node 4: Chart Node (ui_chart) -->
  <g transform="translate(580, 200)" class="node-hover">
    <rect x="0" y="0" width="180" height="80" class="node-border-ui"/>
    <rect x="10" y="10" width="55" height="18" class="tag-ui"/>
    <text x="37" y="22" class="text-tag" text-anchor="middle">ui_chart</text>
    <text x="15" y="48" class="node-title">กราฟความร้อน</text>
    <text x="15" y="66" class="node-sub">แสดงแนวโน้มเวลา</text>
    <circle cx="0" cy="40" r="5" class="port"/>
  </g>

  <!-- Data Flow Simulation Packets -->
  <circle r="4" class="packet">
    <animateMotion dur="2s" repeatCount="indefinite">
      <mpath href="#wire1"/>
    </animateMotion>
  </circle>
  <circle r="4" class="packet" opacity="0.6">
    <animateMotion dur="2s" begin="0.66s" repeatCount="indefinite">
      <mpath href="#wire1"/>
    </animateMotion>
  </circle>
  <circle r="4" class="packet" opacity="0.3">
    <animateMotion dur="2s" begin="1.33s" repeatCount="indefinite">
      <mpath href="#wire1"/>
    </animateMotion>
  </circle>

  <!-- Path 2 flow -->
  <circle r="4" fill="#10b981" filter="drop-shadow(0 0 4px #10b981)">
    <animateMotion dur="2s" begin="0.3s" repeatCount="indefinite">
      <mpath href="#wire2"/>
    </animateMotion>
  </circle>
  <!-- Path 3 flow -->
  <circle r="4" fill="#f59e0b" filter="drop-shadow(0 0 4px #f59e0b)">
    <animateMotion dur="2s" begin="0.8s" repeatCount="indefinite">
      <mpath href="#wire3"/>
    </animateMotion>
  </circle>

  <!-- Side Panel Miniatures -->
  <!-- Gauge Mini Graphic -->
  <g transform="translate(735, 105)">
    <path d="M -15,10 A 18,18 0 0,1 15,10" fill="none" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
    <path d="M -15,10 A 18,18 0 0,1 5, -8" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="10" x2="12" y2="-2" stroke="#ffffff" stroke-width="2" stroke-linecap="round" class="gauge-needle"/>
    <circle cx="0" cy="10" r="3" fill="#ffffff"/>
  </g>

  <!-- Chart Mini Graphic -->
  <g transform="translate(720, 240)">
    <line x1="0" y1="0" x2="30" y2="0" stroke="#334155" stroke-width="1"/>
    <line x1="0" y1="-15" x2="30" y2="-15" stroke="#334155" stroke-width="1"/>
    <path d="M 0,0 L 5,-4 L 10, -2 L 15, -12 L 20, -8 L 25, -18 L 30, -14" fill="none" stroke="#38bdf8" stroke-width="2" class="chart-line"/>
  </g>

  <!-- Labels -->
  <text x="400" y="340" fill="#94a3b8" font-size="12" text-anchor="middle">ทิศทางการไหลของวัตถุข้อความ (msg) จากโหนดอินพุต ผ่านฟังก์ชันประมวลผล สู่หน้าจอแดชบอร์ด</text>

</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 9.1 แผนภาพการไหลของข้อมูล (Flow) ในระบบ Node-RED แสดงการรับ ส่ง และแปลงข้อมูล</div>
</div>

---

### 9.5.2 Grafana

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

### 9.5.3 Blynk

**Blynk** เป็นแพลตฟอร์มระบบคลาวด์สำเร็จรูปที่เน้นความเร็วในการขึ้นโครงร่างโปรเจกต์ IoT (Rapid Prototyping) ช่วยให้นักพัฒนาและนักเรียนวิศวกรรมสามารถสร้างสรรค์แดชบอร์ดบนโมบายแอปพลิเคชันระบบ iOS/Android และบนเว็บเบราว์เซอร์ได้โดยแทบไม่ต้องมีความรู้เกี่ยวกับการทำ Web Server หรือเขียนแอปพลิเคชันมือถือแบบดั้งเดิม

---

### ตารางเปรียบเทียบเครื่องมือ

| คุณสมบัติ | Node-RED | Grafana | Blynk |
|----------|----------|---------|------------|
| ประเภท | Self-hosted | Self-hosted | Cloud |
| ความยากในการเริ่มต้น | ง่าย | ปานกลาง | ง่ายมาก |
| ปรับแต่งกราฟ | ปานกลาง | สูงมาก | ปานกลาง |
| รองรับ Real-Time | ✅ | ✅ | ✅ |
| โมบายแอป | ❌ | จำกัด | ✅ |
| ค่าใช้จ่าย | ฟรี | ฟรี (OSS) | ฟรี (จำกัด) |
| เหมาะกับ | Prototype, งานขนาดเล็ก | Production, งานขนาดใหญ่ | การเรียนรู้, งานเล็ก |
| ตั้ง Alert ได้ | ✅ (ผ่าน Flow) | ✅ (Built-in) | ✅ (ThingHTTP) |

---

## 9.6 การเชื่อมต่อกับโปรแกรมของผู้ใช้ (User Interface)

### 9.6.1 หลักการ UI/UX สำหรับ IoT

**UI (User Interface)** คือหน้าตาที่ผู้ใช้เห็นและสัมผัส **UX (User Experience)** คือประสบการณ์โดยรวมในการใช้งาน

หลักการสำคัญ:

- **เรียบง่าย (Simple):** แสดงเฉพาะสิ่งจำเป็น ผู้ใช้ไม่ควรต้องคิดว่าจะกดตรงไหน
- **ตอบสนองทันที (Responsive Feedback):** เมื่อกดปุ่มเปิดไฟ ต้องมีตอบกลับทันทีว่า "กำลังสั่ง..." หรือ "เปิดแล้ว"
- **ป้องกันข้อผิดพลาด (Error Prevention):** ปุ่มหยุดเครื่องจักรฉุกเฉินต้องมีการยืนยันก่อนทำงาน
- **สอดคล้องกัน (Consistency):** ใช้สีและตำแหน่งปุ่มเหมือนกันทุกหน้า

### 9.6.2 ส่วนควบคุม (Control Widgets)

| ส่วนควบคุม | ใช้สำหรับ | ตัวอย่าง |
|-----------|----------|---------|
| ปุ่ม (Button) | เปิด/ปิด หรือสั่งงานครั้งเดียว | เปิดปั๊มน้ำ, รีเซ็ตระบบ |
| สวิตช์ (Toggle Switch) | เปิด/ปิด แบบมีสถานะค้าง | เปิด/ปิดไฟ, เปิด/ปิดพัดลม |
| สไลเดอร์ (Slider) | ปรับค่าในช่วงต่อเนื่อง | ปรับความเร็วมอเตอร์ 0-100% |
| ช่องป้อนข้อมูล (Input Field) | ป้อนค่าตัวเลขที่แม่นยำ | ตั้งค่าอุณหภูมิเป้าหมาย 37.5°C |
| Dropdown | เลือกจากตัวเลือก | เลือกโหมดทำงาน: Auto/Manual |

### 9.6.3 โมบายแอป vs. เว็บแอป

- **เว็บแอป (Web App):** เปิดผ่านเบราว์เซอร์ ไม่ต้องติดตั้ง อัปเดตง่าย ใช้ได้ทุกอุปกรณ์ เหมาะกับแดชบอร์ดในโรงงาน
- **โมบายแอป (Mobile App):** ติดตั้งบนมือถือ รับ Push Notification ได้ ใช้งาน Offline บางส่วน เหมาะกับการแจ้งเตือนฉุกเฉิน

### 9.6.4 การใช้ Blynk และสถาปัตยกรรม Virtual Pins

แพลตฟอร์ม **Blynk** มุ่งเน้นการปฏิสัมพันธ์ระหว่างอุปกรณ์ไมโครคอนโทรลเลอร์กับผู้ใช้งานผ่านระบบเซิร์ฟเวอร์คลาวด์ระดับโลก โดยจุดเด่นสำคัญที่สุดที่ขับเคลื่อนกลไกการสื่อสารนี้คือ **สถาปัตยกรรมพินเสมือน (Virtual Pins Architecture)**

#### 1. พินเสมือน (Virtual Pins) คืออะไร?
ในฮาร์ดแวร์ทั่วไป เช่น ESP32 จะมีพินทางกายภาพ (Physical GPIO Pins) เช่น GPIO2, GPIO15 สำหรับต่อไฟ LED หรือเซนเซอร์ แต่การควบคุมข้ามเครือข่ายอินเทอร์เน็ตโดยตรงผ่านพินทางกายภาพจะจำกัดความยืดหยุ่น เช่น หากต้องสลับพินฮาร์ดแวร์ในวงจรใหม่ จะทำให้ตัวแสดงผลและโมบายแอปใช้งานไม่ได้ทันทีและต้องแก้ไขระบบครั้งใหญ่

Blynk จึงออกแบบแนวคิด **Virtual Pins (V0 ถึง V255)** ซึ่งเปรียบเหมือน "ถังหน่วยความจำเสมือนบนคลาวด์" ที่ไม่ยึดติดกับพินกายภาพใด ๆ:
- มีสถานะเปรียบเสมือนตัวนำข้อมูลหรือช่องทาง (Data Streams) ที่จัดตั้งขึ้นระหว่างโมบายแอปพลิเคชัน คลาวด์ และบอร์ด ESP32
- ข้อมูลที่ถูกส่งผ่าน Virtual Pins สามารถเป็นได้ทั้งข้อมูลตัวเลขข้อมูลจริง (Float), จำนวนเต็ม (Int), อักษร (String) หรือชุดข้อมูลอาร์เรย์ (Array)

#### 2. กลไกการอัปโหลดข้อมูลเซนเซอร์ (Uplink - `Blynk.virtualWrite`)
เมื่อ ESP32 ต้องการส่งข้อมูลจากสภาพแวดล้อมจริง เช่น ข้อมูลอุณหภูมิขึ้นไปแสดงผลบนหน้าแดชบอร์ด:
- ESP32 จะประมวลผลข้อมูลและเรียกใช้ฟังก์ชัน `Blynk.virtualWrite(V0, temp)`
- คำสั่งนี้จะทำการสร้างแพ็กเก็ตข้อมูลขนาดเล็กและยิงผ่านโปรโตคอล TCP/SSL ไปยัง Blynk Server 
- Blynk Server เมื่อได้รับค่าที่ช่องหน่วยความจำ V0 จะอัปเดตฐานข้อมูลคลาวด์ และแจ้งเตือนไปยังสมาร์ทโฟนที่เปิดแอปพลิเคชันอยู่ทันทีผ่านการเชื่อมต่อแบบเรียลไทม์ (WebSockets) ทำให้เกจหรือกราฟที่แมปกับพิน V0 ปรับระดับเข็มขึ้นอย่างรวดเร็ว

#### 3. กลไกการรับคำสั่งควบคุมอุปกรณ์ (Downlink - `BLYNK_WRITE`)
เมื่อผู้ใช้งานป้อนคำสั่งผ่านโมบายแอปพลิเคชัน เช่น กดปุ่มสัมผัสเพื่อสั่งเปิดไฟ LED:
- แอพ Blynk บนโทรศัพท์มือถือจะส่งคำขออัปเดตค่าพิน V1 ไปยัง Blynk Cloud
- Blynk Cloud จะบันทึกสถานะใหม่ และส่งสัญญาณพุช (Push Alert Event) ไปยัง ESP32 ที่รอฟังอยู่
- ในเฟิร์มแวร์ของ ESP32 ไลบรารีของ Blynk จะดักจับเหตุการณ์นี้ และทำการเรียกใช้ตัวควบคุมคอลแบ็กเฉพาะผ่านชุดคำสั่งแมโครที่เรียกว่า **`BLYNK_WRITE(V1)`**
- ฟังก์ชันนี้ทำงานเปรียบเสมือนอินเทอร์รัปต์ทางซอฟต์แวร์ ภายในฟังก์ชันนี้เราจะใช้คำสั่งดึงค่าสถานะ `param.asInt()` (เพื่อรับค่า 0 หรือ 1) หรือ `param.asStr()` แล้วนำไปสั่งงานขาพินทางกายภาพ เช่น `digitalWrite(GPIO_PIN, value)`

#### 4. ความสำคัญของการประสานงานและซิงโครไนซ์สถานะ (Cloud State Synchronization)
ปัญหาสำคัญของการนำระบบควบคุมอุปกรณ์มาใช้งานจริงคือ **"การสูญเสียการประสานสถานะ (State Inconsistency)"** ซึ่งเกิดขึ้นเมื่อ:
- ตัวอย่างเช่น ผู้ใช้สั่งเปิดไฟผ่านแอปไว้ (พิน V1 บนระบบคลาวด์เป็น 1 - ON)
- จากนั้นบอร์ด ESP32 เกิดเหตุไฟดับ หรืออินเทอร์เน็ตหลุด และทำการรีเซ็ตเครื่องใหม่ (Reboot)
- เมื่อ ESP32 กลับมาทำงานใหม่ ค่าตัวแปรในวงจรกายภาพจะถูกตั้งค่ากลับไปที่ 0 (ไฟ LED ดับ) แต่ในแอปบนสมาร์ทโฟนยังคงมองเห็นปุ่มเป็นสีแดง (ไฟเปิด) เนื่องจากคลาวด์เก็บบันทึกสถานะล่าสุดไว้เป็น 1 สถานะทั้งสองจึงไม่ตรงกัน!

Blynk แก้ไขปัญหานี้โดยการเตรียมโครงสร้างซิงโครไนซ์สถานะย้อนกลับ:
- **`BLYNK_CONNECTED()`:** เป็นฟังก์ชันพิเศษที่จะทำงานเพียงครั้งเดียวเมื่อ ESP32 เชื่อมต่อกับคลาวด์ Blynk สำเร็จ
- **`Blynk.syncVirtual(V1)`:** เมื่อฟังก์ชันนี้ทำงานใน `BLYNK_CONNECTED()` ตัวไมโครคอนโทรลเลอร์จะยิงสัญญาณแจ้งเตือนไปยัง Blynk Cloud เพื่อขอดึงสถานะปัจจุบันของพินเสมือน V1 ย้อนกลับลงมา 
- Blynk Cloud จะส่งข้อมูลล่าสุดลงมา ซึ่งจะไปทริกเกอร์ให้ฟังก์ชัน `BLYNK_WRITE(V1)` ทำงานทันทีโดยอัตโนมัติ ช่วยสั่งเปิดไฟ LED ในความจริงให้สอดรับกับหน้าจอแอป

<div style="text-align: center; margin: 25px 0;">
<svg viewBox="0 0 820 380" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>สถาปัตยกรรมและกระบวนการซิงโครไนซ์ข้อมูลผ่าน Blynk Cloud</title>
  <style>
    .bg { fill: #0b0f19; stroke: #1e293b; stroke-width: 2; rx: 12px; }
    .grid { fill: none; stroke: #1e293b; stroke-width: 1; stroke-dasharray: 4 4; }
    .device-box { fill: #1e293b; stroke: #475569; stroke-width: 2; rx: 8px; }
    .cloud-box { fill: #1e1b4b; stroke: #4f46e5; stroke-width: 2; rx: 8px; }
    .app-box { fill: #0f172a; stroke: #ea580c; stroke-width: 2; rx: 8px; }
    .title-text { font-size: 14px; font-weight: bold; fill: #f8fafc; }
    .sub-text { font-size: 11px; fill: #94a3b8; }
    .code-text { font-size: 11px; font-family: monospace; fill: #38bdf8; font-weight: bold; }
    .code-orange { font-size: 11px; font-family: monospace; fill: #fb923c; font-weight: bold; }
    .sync-line { fill: none; stroke-width: 2; stroke-linecap: round; }
    
    /* Animations */
    @keyframes flowRight {
      0% { stroke-dashoffset: 24; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes flowLeft {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 24; }
    }
    .flow-to-cloud { stroke: #38bdf8; stroke-dasharray: 6 6; stroke-width: 2.5; animation: flowRight 1.5s linear infinite; }
    .flow-to-app { stroke: #38bdf8; stroke-dasharray: 6 6; stroke-width: 2.5; animation: flowRight 1.5s linear infinite; }
    .flow-from-app { stroke: #fb923c; stroke-dasharray: 6 6; stroke-width: 2.5; animation: flowLeft 1.5s linear infinite; }
    .flow-to-esp { stroke: #fb923c; stroke-dasharray: 6 6; stroke-width: 2.5; animation: flowLeft 1.5s linear infinite; }
    .sync-req { stroke: #a78bfa; stroke-dasharray: 4 4; stroke-width: 2; animation: flowLeft 2s linear infinite; }
    
    .glow-orange { filter: drop-shadow(0 0 6px #ea580c); }
    .glow-cyan { filter: drop-shadow(0 0 6px #06b6d4); }
    .glow-purple { filter: drop-shadow(0 0 6px #8b5cf6); }
    
    .app-screen { fill: #020617; stroke: #334155; rx: 4px; }
    .widget-gauge { fill: #1e293b; stroke: #06b6d4; stroke-width: 1.5; rx: 4px; }
    .widget-btn { fill: #ea580c; stroke: #ff7849; stroke-width: 1.5; rx: 4px; }
  </style>

  <!-- Background -->
  <rect x="0" y="0" width="820" height="380" class="bg"/>
  <g class="grid">
    <path d="M 0,50 H 820 M 0,100 H 820 M 0,150 H 820 M 0,200 H 820 M 0,250 H 820 M 0,300 H 820 M 0,350 H 820" />
    <path d="M 100,0 V 380 M 200,0 V 380 M 300,0 V 380 M 400,0 V 380 M 500,0 V 380 M 600,0 V 380 M 700,0 V 380" />
  </g>

  <!-- Lines of data communication (Paths) -->
  <!-- Segment 1: ESP32 to Cloud (V0) -->
  <path d="M 230,100 L 370,100" class="sync-line" stroke="#1e293b" stroke-width="3"/>
  <path d="M 230,100 L 370,100" class="flow-to-cloud"/>
  <!-- Segment 2: Cloud to App (V0) -->
  <path d="M 450,100 L 590,100" class="sync-line" stroke="#1e293b" stroke-width="3"/>
  <path d="M 450,100 L 590,100" class="flow-to-app"/>

  <!-- Segment 1: App to Cloud (V1) -->
  <path d="M 450,220 L 590,220" class="sync-line" stroke="#1e293b" stroke-width="3"/>
  <path d="M 450,220 L 590,220" class="flow-from-app"/>
  <!-- Segment 2: Cloud to ESP32 (V1) -->
  <path d="M 230,220 L 370,220" class="sync-line" stroke="#1e293b" stroke-width="3"/>
  <path d="M 230,220 L 370,220" class="flow-to-esp"/>

  <!-- Line 3: syncVirtual request (ESP -> Cloud) -->
  <path d="M 230,300 C 300,340 330,340 370,300" class="sync-line" stroke="#1e293b" stroke-width="2"/>
  <path d="M 230,300 C 300,340 330,340 370,300" class="sync-req"/>

  <!-- 1. LEFT CONTAINER: ESP32 (Physical Device) -->
  <g transform="translate(30, 40)">
    <rect x="0" y="0" width="200" height="290" class="device-box"/>
    <text x="100" y="25" class="title-text" text-anchor="middle">🔌 ESP32 ไมโครคอนโทรลเลอร์</text>
    
    <!-- Code Blocks inside ESP32 -->
    <rect x="10" y="45" width="180" height="65" fill="#0f172a" rx="4" stroke="#334155"/>
    <text x="20" y="62" class="sub-text" fill="#94a3b8">ส่งค่าอุณหภูมิ (ทุก 2 วินาที)</text>
    <text x="20" y="80" class="code-text">float temp = readTemp();</text>
    <text x="20" y="98" class="code-text">Blynk.virtualWrite(V0, temp);</text>
    <circle cx="190" cy="60" r="5" fill="#38bdf8" class="glow-cyan"/>

    <!-- LED Control Block (BLYNK_WRITE) -->
    <rect x="10" y="125" width="180" height="75" fill="#0f172a" rx="4" stroke="#334155"/>
    <text x="20" y="142" class="sub-text" fill="#f59e0b">รับคำสั่งควบคุม LED</text>
    <text x="20" y="160" class="code-orange">BLYNK_WRITE(V1) {</text>
    <text x="30" y="176" class="code-orange">  int state = param.asInt();</text>
    <text x="30" y="191" class="code-orange">  digitalWrite(LED, state);</text>
    <text x="20" y="195" class="code-orange">}</text>
    <circle cx="190" cy="180" r="5" fill="#fb923c" class="glow-orange"/>

    <!-- Sync Trigger Block -->
    <rect x="10" y="215" width="180" height="60" fill="#0f172a" rx="4" stroke="#334155"/>
    <text x="20" y="232" class="sub-text" fill="#c084fc">ร้องขอสถานะล่าสุดเมื่อต่อเน็ต</text>
    <text x="20" y="250" class="code-text" fill="#c084fc">BLYNK_CONNECTED() {</text>
    <text x="30" y="268" class="code-text" fill="#c084fc">  Blynk.syncVirtual(V1);</text>
    <text x="20" y="272" class="code-text" fill="#c084fc">}</text>
    <circle cx="190" cy="260" r="5" fill="#c084fc" class="glow-purple"/>
  </g>

  <!-- 2. MIDDLE CONTAINER: Blynk Cloud (State Broker) -->
  <g transform="translate(370, 40)">
    <rect x="0" y="0" width="80" height="290" class="cloud-box"/>
    <text x="40" y="25" class="title-text" text-anchor="middle">☁️ Cloud</text>
    
    <!-- Cloud Icon -->
    <g transform="translate(20, 40)" fill="#4f46e5" opacity="0.6">
      <path d="M10 20 a 10 10 0 0 1 10 -10 a 8 8 0 0 1 14 3 a 10 10 0 0 1 16 7 a 6 6 0 0 1 -6 6 h -28 a 6 6 0 0 1 -6 -6 z"/>
    </g>

    <!-- Registers/Datastreams -->
    <rect x="8" y="80" width="64" height="60" fill="#312e81" rx="4" stroke="#6366f1"/>
    <text x="40" y="98" class="text-tag" text-anchor="middle">V0 (Float)</text>
    <text x="40" y="118" font-size="10" fill="#94a3b8" text-anchor="middle">ข้อมูลเซนเซอร์</text>
    <text x="40" y="132" font-size="11" font-weight="bold" fill="#38bdf8" text-anchor="middle">25.5 °C</text>

    <rect x="8" y="180" width="64" height="60" fill="#581c87" rx="4" stroke="#a855f7"/>
    <text x="40" y="198" class="text-tag" text-anchor="middle">V1 (Int)</text>
    <text x="40" y="218" font-size="10" fill="#e9d5ff" text-anchor="middle">คำสั่งสวิตช์</text>
    <text x="40" y="232" font-size="12" font-weight="bold" fill="#fb923c" text-anchor="middle">1 (ON)</text>
  </g>

  <!-- 3. RIGHT CONTAINER: Blynk Mobile App / Dashboard -->
  <g transform="translate(590, 40)">
    <rect x="0" y="0" width="200" height="290" class="app-box"/>
    <text x="100" y="25" class="title-text" text-anchor="middle">📱 แอปมือถือ Blynk</text>

    <rect x="25" y="45" width="150" height="230" class="app-screen"/>
    <text x="100" y="62" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">ห้องทำงาน #1</text>
    <line x1="40" y1="68" x2="160" y2="68" stroke="#1e293b" stroke-width="1"/>

    <!-- Widget Gauge (V0) -->
    <rect x="40" y="80" width="120" height="60" class="widget-gauge"/>
    <text x="100" y="96" font-size="10" fill="#94a3b8" text-anchor="middle">อุณหภูมิ (V0)</text>
    <text x="100" y="118" font-size="16" font-weight="bold" fill="#22d3ee" text-anchor="middle">25.5 °C</text>
    <path d="M 60,130 L 140,130" stroke="#0891b2" stroke-width="2"/>
    <circle cx="100" cy="130" r="3" fill="#22d3ee"/>

    <!-- Widget Button (V1) -->
    <rect x="40" y="170" width="120" height="60" class="widget-btn"/>
    <text x="100" y="186" font-size="10" fill="#ffedd5" text-anchor="middle">ควบคุม LED (V1)</text>
    <rect x="80" y="196" width="40" height="20" rx="10" fill="#f97316"/>
    <circle cx="110" cy="206" r="8" fill="#ffffff" class="glow-orange"/>
    <text x="100" y="246" font-size="9" fill="#94a3b8" text-anchor="middle">กดปุ่ม = เปลี่ยนสถานะในคลาวด์</text>
  </g>

  <!-- Labels & Legends -->
  <text x="300" y="90" font-size="10" fill="#38bdf8" text-anchor="middle">1. virtualWrite(V0)</text>
  <text x="520" y="90" font-size="10" fill="#38bdf8" text-anchor="middle">2. Push ไปหน้าจอแอป</text>
  
  <text x="520" y="244" font-size="10" fill="#fb923c" text-anchor="middle">3. กดปุ่มเปิดไฟ V1 = 1</text>
  <text x="300" y="244" font-size="10" fill="#fb923c" text-anchor="middle">4. คลาวด์ส่งคำสั่ง BLYNK_WRITE(V1)</text>

  <text x="300" y="345" font-size="10" fill="#c084fc" text-anchor="middle">5. syncVirtual(V1) โหลดสถานะล่าสุดตอนบู๊ต</text>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 9.2 สถาปัตยกรรม Virtual Pins และการทำงานประสานกัน (Synchronization) ระหว่างไมโครคอนโทรลเลอร์, Blynk Cloud และโมบายแอปพลิเคชัน</div>
</div>

---

#### 5. ขั้นตอนการจัดเตรียมและเชื่อมต่อโปรเจกต์ Blynk
1. **สร้างบัญชีคลาวด์:** สมัครลงทะเบียนที่หน้าเว็บ [blynk.cloud](https://blynk.cloud/)
2. **สร้าง Template:** นิยามโมเดลอุปกรณ์ ตั้งชื่อโมเดล เช่น `ESP32_Control`
3. **กำหนด Datastreams:** สร้างขวดบรรจุข้อมูล (Datastream) โดยใช้ Virtual Pin เป็นตัวอ้างอิง:
   - **V0 (อุณหภูมิ):** ชนิดตัวเลขทศนิยม (Double/Float) มีพิกัดขอบเขต $0.0 - 100.0\text{ °C}$
   - **V1 (สวิตช์ควบคุม):** ชนิดตัวเลขจำนวนเต็ม (Integer) มีระดับค่าคือ $0$ (OFF) หรือ $1$ (ON)
4. **จัดเตรียม Dashboard (การลากวางหน้าจอ):**
   - **Web Dashboard:** วางวิดเจ็ตแสดงผลกราฟโดยให้ระบุตัวแปรที่รับมาเป็น `V0` และวางสวิตช์เชื่อมกับ `V1`
   - **Mobile App:** เปิด Blynk App บนมือถือ นำวิดเจ็ตเกจ (Gauge) ต่อเข้าช่อง `V0` และนำสวิตช์ปุ่มกดผูกเข้ากับ `V1`
5. **ดึงรหัสระบุตัวตน:** คัดลอกแถบรหัสเชื่อมโยง (Blynk API credentials) ซึ่งจะถูกสร้างในหน้า Template Info:
   - `BLYNK_TEMPLATE_ID`
   - `BLYNK_TEMPLATE_NAME`
   - `BLYNK_AUTH_TOKEN`

---

#### ตัวอย่างโค้ดสมบูรณ์: การทำงานร่วมกันระหว่าง Uplink, Downlink และ Sync บน ESP32

ต่อไปนี้คือรูปแบบโปรแกรมภาษา C++ บนไมโครคอนโทรลเลอร์ ESP32 สำหรับแสดงการบันทึกส่งอุณหภูมิ (V0) พร้อมรับคำสั่งไฟ LED (V1) และการเรียกใช้คำสั่งดึงค่าซิงโครไนซ์ป้องกันข้อมูลคลาดเคลื่อนเวลาบู๊ตระบบ:

```cpp
#define BLYNK_TEMPLATE_ID "TMPL6xXxXxxx"
#define BLYNK_TEMPLATE_NAME "WorkspaceMonitor"
#define BLYNK_AUTH_TOKEN "YourAuthTokenHere"

// กำหนดให้พิมพ์ข้อความสถานะการตรวจแก้ของ Blynk ลงสู่ Serial Monitor
#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>

char ssid[] = "YourWiFi_SSID";
char pass[] = "YourWiFi_Password";

#define LED_PIN 2 // ขาพินควบคุม LED ทางกายภาพบนบอร์ด ESP32

// ออบเจกต์ตัวจับเวลากลไกส่งค่าวิดเจ็ต เพื่อไม่ให้ขัดขังหวงทำงาน loop()
BlynkTimer timer;

// ฟังก์ชันที่จะทริกเกอร์ทำงานโดยอัตโนมัติเมื่ออุปกรณ์เชื่อมต่อเซิร์ฟเวอร์สำเร็จ
BLYNK_CONNECTED() {
  Serial.println("เชื่อมต่อ Blynk Server สำเร็จ! กำลังร้องขอซิงโครไนซ์...");
  // ร้องขอให้คลาวด์ป้อนส่งค่าสถานะปัจจุบันของ V1 (สวิตช์ไฟ) ลงมาปรับใช้
  Blynk.syncVirtual(V1);
}

// โค้ดที่จะทริกเกอร์ทำงานเมื่อสถานะพิน V1 บน Blynk Cloud ถูกเปลี่ยนค่า
BLYNK_WRITE(V1) {
  int ledState = param.asInt(); // รับค่าเป็นเลขจำนวนเต็ม (0 หรือ 1)
  digitalWrite(LED_PIN, ledState); // นำสถานะจากหน้าจอแอปมาเขียนเข้าพิน GPIO
  
  Serial.print("ได้รับค่าควบคุม LED (V1): ");
  Serial.println(ledState == 1 ? "เปิด (ON)" : "ปิด (OFF)");
}

// ฟังก์ชันอ่านค่าและส่งอุณหภูมิขึ้นสู่คลาวด์ทำงานแยกส่วนผ่าน Timer
void sendSensorData() {
  // จำลองอุณหภูมิจากการคำนวณสุ่มเป็นองศาเซลเซียส
  float temp = 24.0 + (random(0, 100) / 10.0);
  
  // อัปโหลดข้อมูลไปยัง Virtual Pin V0
  Blynk.virtualWrite(V0, temp);
  
  Serial.print("ส่งสถานะอุณหภูมิปัจจุบัน (V0): ");
  Serial.print(temp, 1);
  Serial.println(" °C");
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  
  // เชื่อมต่อไวไฟและเข้าระบบ Blynk Server
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
  
  // ตั้งค่า Timer ให้ส่งค่าเซนเซอร์ทุกๆ 5000 มิลลิวินาที (5 วินาที)
  // เพื่อป้องกันการส่งที่ถี่เกินไปจนโดนบล็อกการเชื่อมต่อ (Flood Limit)
  timer.setInterval(5000L, sendSensorData);
}

void loop() {
  Blynk.run(); // ดูแลการแลกเปลี่ยนแพ็กเก็ตข้อมูลกับ Blynk Server
  timer.run(); // รันกลไกกำหนดพิกัดเวลา
}
```

> 💡 **สำหรับ Wokwi:** ปัจจุบัน Wokwi ไม่รองรับการเชื่อมต่อ Blynk โดยตรง แต่นักศึกษาสามารถฝึกเขียนโค้ดโครงสร้างบน Wokwi แล้วนำไปทดสอบจริงกับบอร์ด ESP32 ได้ หรือใช้ Serial Monitor จำลองการแสดงผลแทน

---

## 9.7 ตัวอย่างการออกแบบแดชบอร์ดติดตามเครื่องจักร

### สถานการณ์จำลอง

โรงงานมีมอเตอร์ไฟฟ้า 1 ตัวที่ต้องติดตาม:
- **อุณหภูมิตัวเรือน** (Body Temperature)
- **ความเร็วรอบ** (RPM)
- **กระแสไฟฟ้า** (Current)
- **สถานะการทำงาน** (Running / Stopped / Error)

### การออกแบบ Layout

```
┌─────────────────────────────────────────────────┐
│  🏭  แดชบอร์ดติดตามมอเตอร์ #1                    │
├────────────────┬────────────────┬───────────────┤
│  [Gauge]       │  [Gauge]       │  [สถานะ]      │
│  อุณหภูมิ       │  RPM           │  🟢 Running   │
│  42.3 °C       │  1,480 rpm     │               │
├────────────────┴────────────────┴───────────────┤
│  [กราฟเส้น] อุณหภูมิ & กระแสไฟฟ้า ย้อนหลัง 1 ชม.  │
│  ──────────────────────────────────────          │
├────────────────┬────────────────────────────────┤
│  [ปุ่ม]        │  [สไลเดอร์]                     │
│  หยุดฉุกเฉิน    │  ปรับความเร็ว: ████░░░░ 60%     │
└────────────────┴────────────────────────────────┘
```

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
- **เครื่องมือ** มีหลายตัวเลือก: Node-RED (ง่าย), Grafana (ปรับแต่งสูง), Blynk (Cloud + แอปมือถือ) เลือกใช้ตามความเหมาะสม
- **UI/UX สำหรับ IoT** ต้องเรียบง่าย ตอบสนองทันที และป้องกันข้อผิดพลาด
- **Blynk** ช่วยสร้างแอปมือถือสำหรับ IoT ได้รวดเร็วโดยไม่ต้องเขียนแอปเอง

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

**ข้อ 4:** เปรียบเทียบ Node-RED, Grafana และ Blynk ในแง่ต่อไปนี้ โดยสรุปเป็นตาราง:
- ความง่ายในการติดตั้ง
- ความสามารถในการปรับแต่งกราฟ
- ความเหมาะสมกับงาน Production ขนาดใหญ่
- จงแนะนำว่านักศึกษาปี 1 ควรเริ่มจากเครื่องมือใดและเพราะอะไร

**ข้อ 5:** เขียนโปรแกรม ESP32 บน Wokwi ที่อ่านค่าจาก Potentiometer (ต่อที่ GPIO34) แล้วแสดงผลเป็น "มาตรวัด" แบบข้อความใน Serial Monitor โดยใช้อักขระ `█` และ `░` แสดงระดับ 0-100% เช่น `████████░░░░░░░░░░░░ 40%`

**ข้อ 6 (ท้าทาย):** จงอธิบายหลัก UI/UX 3 ข้อที่สำคัญที่สุดสำหรับระบบ IoT ที่ควบคุมเครื่องจักรอันตราย พร้อมยกตัวอย่างว่าการออกแบบ UI ที่แย่อาจนำไปสู่อุบัติเหตุได้อย่างไร

**ข้อ 7 (ปฏิบัติ):** สร้างโปรเจกต์ Wokwi ที่ใช้ ESP32 อ่านค่าเซนเซอร์อุณหภูมิ (DHT22) และแสดงผลบน Serial Monitor ในรูปแบบ JSON เช่น `{"temp": 28.5, "humid": 65.2, "status": "normal"}` เพื่อให้พร้อมส่งไปแสดงผลบนแดชบอร์ดภายนอก
