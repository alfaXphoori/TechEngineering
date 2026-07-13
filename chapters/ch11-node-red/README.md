# Chapter 11: ระบบฐานข้อมูลและแดชบอร์ดแสดงผลท้องถิ่น (Local Databases & Node-RED Orchestration)

> บทนี้จะอธิบายแนวทางเชื่อมต่อบริการข้อมูลในเครือข่ายภายใน (Local Network) โดยใช้งานโปรแกรม Node-RED ในการเขียนลอจิกการไหลของข้อมูล (Flow-based Programming) ผูกเชื่อมกับระบบฐานข้อมูลอนุกรมเวลา (Time-Series Database) เช่น InfluxDB และระบบฐานข้อมูลเชิงสัมพันธ์น้ำหนักเบาอย่าง SQLite

---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 11.1 โดเมนการเขียนโฟลว์ดักข้อมูล Node-RED

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
   - เป็นโหนดที่มีความยืดหยุ่นสูงที่สุดเนื่องจากเปิดโอกาสให้เขียนโปรแกรม JavaScript ลงไป เพื่อคำวณและประมวลผล ตัวอย่างเช่น:
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
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .grid { fill: none; stroke: #e2e8f0; stroke-width: 1; stroke-dasharray: 5 5; }
    
    /* Node-RED style nodes - Flat Design */
    .node-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 6px; }
    
    /* Wires and paths */
    .wire { fill: none; stroke: #475569; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .wire-active { fill: none; stroke: #f59e0b; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 8 10; animation: flowData 2.6s linear infinite; }
    
    /* Packets */
    .packet { fill: #f59e0b; stroke: #ffffff; stroke-width: 1.5; }
    .packet-green { fill: #16a34a; stroke: #ffffff; stroke-width: 1.5; }
    .packet-red { fill: #dc2626; stroke: #ffffff; stroke-width: 1.5; }
    
    /* Ports */
    .port { fill: #ffffff; stroke: #334155; stroke-width: 1.5; }
    
    /* Text styles */
    .text-main { font-size: 14px; font-weight: bold; fill: #1e293b; }
    .text-sub { font-size: 12px; fill: #64748b; }
    .text-tag { font-size: 10px; font-weight: bold; fill: #1e293b; }
    
    /* Tags inside nodes */
    .tag-mqtt { fill: #e0e7ff; stroke: #6366f1; stroke-width: 1; rx: 3px; }
    .tag-func { fill: #d1fae5; stroke: #10b981; stroke-width: 1; rx: 3px; }
    .tag-ui { fill: #fef3c7; stroke: #f59e0b; stroke-width: 1; rx: 3px; }
    
    /* Animations */
    @keyframes flowData {
      to { stroke-dashoffset: -44; }
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
      transition: all 0.2s ease;
    }
    .node-hover:hover {
      filter: brightness(0.97);
      cursor: pointer;
    }
  </style>

  <!-- Panel background -->
  <rect x="5" y="5" width="790" height="350" class="bg"/>
  
  <!-- Grid -->
  <g class="grid">
    <path d="M 5,40 H 795 M 5,80 H 795 M 5,120 H 795 M 5,160 H 795 M 5,200 H 795 M 5,240 H 795 M 5,280 H 795 M 5,320 H 795" />
    <path d="M 80,5 V 355 M 160,5 V 355 M 240,5 V 355 M 320,5 V 355 M 400,5 V 355 M 480,5 V 355 M 560,5 V 355 M 640,5 V 355 M 720,5 V 355" />
  </g>

  <!-- Connection Wires -->
  <path d="M 230,120 C 280,120 280,180 330,180" class="wire"/>
  <path id="wire1" d="M 230,120 C 280,120 280,180 330,180" class="wire-active"/>

  <path d="M 480,165 C 530,165 530,120 580,120" class="wire"/>
  <path id="wire2" d="M 480,165 C 530,165 530,120 580,120" class="wire-active" stroke="#16a34a"/>

  <path d="M 480,195 C 530,195 530,240 580,240" class="wire"/>
  <path id="wire3" d="M 480,195 C 530,195 530,240 580,240" class="wire-active" stroke="#dc2626"/>

  <!-- Node 1: MQTT Input -->
  <g transform="translate(50, 80)" class="node-hover">
    <rect x="0" y="0" width="180" height="80" class="node-box"/>
    <!-- Node Tag -->
    <rect x="12" y="12" width="55" height="18" class="tag-mqtt"/>
    <text x="39" y="24" class="text-tag" text-anchor="middle">mqtt in</text>
    <!-- Labels -->
    <text x="15" y="48" class="text-main">รับค่าอุณหภูมิ</text>
    <text x="15" y="66" class="text-sub">หัวข้อ: office/temp</text>
    <!-- Output Port -->
    <circle cx="180" cy="40" r="5" class="port"/>
  </g>

  <!-- Node 2: Function Node -->
  <g transform="translate(300, 140)" class="node-hover">
    <rect x="0" y="0" width="180" height="80" class="node-box"/>
    <rect x="12" y="12" width="55" height="18" class="tag-func"/>
    <text x="39" y="24" class="text-tag" text-anchor="middle">function</text>
    <text x="15" y="48" class="text-main">ตรวจสอบเงื่อนไข</text>
    <text x="15" y="66" class="text-sub">msg.payload > 35.0 ?</text>
    <!-- Input Port -->
    <circle cx="0" cy="40" r="5" class="port"/>
    <!-- Output Ports -->
    <circle cx="180" cy="25" r="5" class="port"/>
    <circle cx="180" cy="55" r="5" class="port"/>
    <text x="170" y="28" font-size="9" fill="#64748b" text-anchor="end">1</text>
    <text x="170" y="58" font-size="9" fill="#64748b" text-anchor="end">2</text>
  </g>

  <!-- Node 3: Gauge Node -->
  <g transform="translate(580, 80)" class="node-hover">
    <rect x="0" y="0" width="180" height="80" class="node-box"/>
    <rect x="12" y="12" width="55" height="18" class="tag-ui"/>
    <text x="39" y="24" class="text-tag" text-anchor="middle">ui_gauge</text>
    <text x="15" y="48" class="text-main">เกจวัดความร้อน</text>
    <text x="15" y="66" class="text-sub">แท็บ: แดชบอร์ดหลัก</text>
    <!-- Input Port -->
    <circle cx="0" cy="40" r="5" class="port"/>
  </g>

  <!-- Node 4: Chart Node -->
  <g transform="translate(580, 200)" class="node-hover">
    <rect x="0" y="0" width="180" height="80" class="node-box"/>
    <rect x="12" y="12" width="55" height="18" class="tag-ui"/>
    <text x="39" y="24" class="text-tag" text-anchor="middle">ui_chart</text>
    <text x="15" y="48" class="text-main">กราฟความร้อน</text>
    <text x="15" y="66" class="text-sub">แสดงแนวโน้มเวลา</text>
    <!-- Input Port -->
    <circle cx="0" cy="40" r="5" class="port"/>
  </g>

  <!-- Data Flow Simulation Packets -->
  <circle r="5" class="packet">
    <animateMotion dur="2.6s" repeatCount="indefinite">
      <mpath href="#wire1"/>
    </animateMotion>
  </circle>
  <circle r="5" class="packet" opacity="0.65">
    <animateMotion dur="2.6s" begin="0.86s" repeatCount="indefinite">
      <mpath href="#wire1"/>
    </animateMotion>
  </circle>
  <circle r="5" class="packet" opacity="0.3">
    <animateMotion dur="2.6s" begin="1.72s" repeatCount="indefinite">
      <mpath href="#wire1"/>
    </animateMotion>
  </circle>

  <!-- Path 2 flow -->
  <circle r="5" class="packet-green">
    <animateMotion dur="2.6s" begin="0.4s" repeatCount="indefinite">
      <mpath href="#wire2"/>
    </animateMotion>
  </circle>
  <!-- Path 3 flow -->
  <circle r="5" class="packet-red">
    <animateMotion dur="2.6s" begin="1.2s" repeatCount="indefinite">
      <mpath href="#wire3"/>
    </animateMotion>
  </circle>

  <!-- Side Panel Miniatures -->
  <!-- Gauge Mini Graphic -->
  <g transform="translate(735, 105)">
    <path d="M -15,10 A 18,18 0 0,1 15,10" fill="none" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
    <path d="M -15,10 A 18,18 0 0,1 5, -8" fill="none" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="10" x2="12" y2="-2" stroke="#334155" stroke-width="2.5" stroke-linecap="round" class="gauge-needle"/>
    <circle cx="0" cy="10" r="3.5" fill="#334155"/>
  </g>

  <!-- Chart Mini Graphic -->
  <g transform="translate(720, 240)">
    <line x1="0" y1="0" x2="30" y2="0" stroke="#cbd5e1" stroke-width="1.5"/>
    <line x1="0" y1="-15" x2="30" y2="-15" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M 0,0 L 5,-4 L 10, -2 L 15, -12 L 20, -8 L 25, -18 L 30, -14" fill="none" stroke="#16a34a" stroke-width="2.5" class="chart-line"/>
  </g>

  <!-- Labels -->
  <text x="400" y="336" fill="#64748b" font-size="12" font-weight="500" text-anchor="middle">ทิศทางการไหลของวัตถุข้อความ (msg) จากโหนดอินพุต ผ่านฟังก์ชันประมวลผล สู่หน้าจอแดชบอร์ด</text>

</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 9.1 แผนภาพการไหลของข้อมูล (Flow) ในระบบ Node-RED แสดงการรับ ส่ง และแปลงข้อมูล</div>
</div>

---


## 11.2 ระบบฐานข้อมูลสำหรับข้อมูลเชิงอนุกรมเวลา (Databases for Time-Series IoT Data)

ในการทำระบบจัดเก็บและวิเคราะห์ข้อมูลจากอุปกรณ์ IoT การเลือกฐานข้อมูลมีความสำคัญอย่างยิ่ง เนื่องจากปริมาณข้อมูลที่ส่งจากเซนเซอร์จะมีลักษณะส่งเข้ามาอย่างสม่ำเสมอตามระยะเวลาที่กำหนด (เช่น ส่งอุณหภูมิทุก ๆ 10 วินาที) ข้อมูลประเภทนี้ถูกเรียกว่า **ข้อมูลอนุกรมเวลา (Time-Series Data)**

### 11.2.1 ฐานข้อมูลอนุกรมเวลา (Time-Series Database: TSDB)
*   **InfluxDB:** เป็นระบบฐานข้อมูลแบบ Open-source ที่ได้รับความนิยมสูงสุดสำหรับการบันทึกค่าทางสถิติ IoT โดยออกแบบโครงสร้างคีย์การจัดเก็บแบบเฉพาะทาง
    *   **Measurement:** เปรียบได้กับตารางใน Relational DB (เช่น `machine_telemetry`)
    *   **Tags:** ดัชนีข้อมูลสำหรับช่วยค้นหาได้อย่างรวดเร็ว (เช่น `device_id="motor_A"`, `location="line_1"`)
    *   **Fields:** ค่าตัวเลขหรือสภาวะจริงที่เราวัดได้ (เช่น `vibration=4.23`, `temp=45.2`)
    *   **Timestamp:** คีย์หลักที่ระบุเวลาวินาที/มิลลิวินาทีของจุดข้อมูลนั้น

### 11.2.2 ฐานข้อมูลเชิงสัมพันธ์น้ำหนักเบา (Relational Database: SQLite)
*   **SQLite:** เป็นฐานข้อมูลแบบมีขนาดเล็ก ไม่ต้องการเซิร์ฟเวอร์แยกต่างหาก (Serverless) ตัวข้อมูลจะถูกจัดเก็บลงเป็นไฟล์เดียว เหมาะสำหรับการทดลองเก็บข้อมูลแบบง่าย ๆ ภายในระบบขอบข่ายขนาดเล็ก เช่น ติดตั้งบน Raspberry Pi ในระดับเครื่องจักรเดี่ยว

---

</div>

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">

## 11.3 โครงสร้างการเชื่อมต่อแดชบอร์ดท้องถิ่น (Local Data Orchestration)

การเชื่อมต่อของข้อมูลในระบบท้องถิ่น (Local Area Network - LAN) โดยทั่วไปมีขั้นตอนดังภาพ:
```
[ ESP32 Node ]  ---> ( MQTT Broker ) ---> [ Node-RED Flow ] ---> [ InfluxDB / SQLite ]
                                                  |
                                                  v
                                      [ Node-RED Dashboard UI ]
```

### 11.3.1 ตัวอย่างการสร้างโฟลว์ใน Node-RED เพื่อบันทึกข้อมูลและแสดงผล
1.  **โหนด `mqtt in`:** คอยสมัครรับข้อมูลจากหัวข้อ เช่น `factory/sensor/temp`
2.  **โหนด `json`:** แปลงข้อความสตริง JSON ให้เป็นออบเจกต์ JavaScript (payload)
3.  **โหนด `function`:** เขียนสคริปต์สั้น ๆ เพื่อสกัดฟิลด์ข้อมูลไปพล็อตหรือจัดรูปแบบ SQL query
4.  **โหนด `influxdb out` / `sqlite`:** บันทึกข้อมูลลงฐานข้อมูลโดยตรง
5.  **โหนด `ui_gauge` / `ui_chart`:** นำข้อมูลความร้อนมาพล็อตเป็นหน้าเกจบนแท็บเบราว์เซอร์

---

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

## 11.4 สรุปประจำบทที่ 11 (Summary)

1.  **Node-RED** ทำงานภายใต้สถาปัตยกรรมแบบ Flow-Based Programming ช่วยให้ออกแบบเส้นทางการไหลของข้อมูล (Data Pipelines) ได้ง่ายและรวดเร็ว
2.  **โหนดประเภทอินพุตและเอาต์พุต** ช่วยลดความซับซ้อนในการเขียนคำสั่งเชื่อมต่อเครือข่ายระดับต่ำ
3.  **InfluxDB (TSDB)** มีสถาปัตยกรรมการจัดเก็บบนเงื่อนเวลาเป็นดัชนีหลัก ทำให้ประหยัดเนื้อที่ดิสก์และสามารถดึงค่าสถิติปริมาณล้านจุดออกมาคำนวณเฉลี่ยได้เร็วกว่าฐานข้อมูลตารางแบบเก่า

---

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 11.5 แบบฝึกหัดท้ายบทที่ 11 (Exercises)

**ข้อ 1:** จงอธิบายความแตกต่างระหว่างฐานข้อมูลอนุกรมเวลา (เช่น InfluxDB) และฐานข้อมูลเชิงสัมพันธ์ทั่วไป (เช่น MySQL/PostgreSQL) ในแง่การรองรับข้อมูลเซนเซอร์ปริมาณสูง
**ข้อ 2:** ในโฟลว์ของ Node-RED หากเราได้รับ Payload เป็นข้อความตัวอักษรธรรมดา เช่น `"25.5"` จาก MQTT แต่หน้าจอ Widget เกจต้องการตัวเลข (Number) เราต้องใช้โหนดใดหรือเขียนคำสั่งสคริปต์อย่างไรเพื่อแปลงประเภทตัวแปร?
**ข้อ 3:** โหนดประเภท Inject Node และ Debug Node มีบทบาทอย่างไรต่อนักพัฒนาในการทดสอบระบบและแก้ปัญหา (Debugging) โฟลว์การควบคุมข้อมูล?

</div>
