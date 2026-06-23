# Chapter 5: การเชื่อมต่อสัญญาณดิจิทัลและแอนะล็อก
## Digital & Analog I/O Interfacing

> บทนี้จะพาทำความเข้าใจวิธีที่ไมโครคอนโทรลเลอร์ (Microcontroller) "คุยกับโลกภายนอก" ผ่านสัญญาณไฟฟ้า ทั้งแบบดิจิทัล (Digital) ที่มีแค่ เปิด/ปิด และแบบแอนะล็อก (Analog) ที่มีค่าต่อเนื่อง เราจะฝึกบน ESP32 ผ่าน Wokwi Simulator เป็นหลัก

---

### ภาพรวม: สถาปัตยกรรม IoT 4 ชั้น

บทนี้เชื่อมโยงกับชั้น Perception Layer ผ่านการรับและส่งสัญญาณระหว่าง ESP32 กับอุปกรณ์ภายนอกในระบบ IoT

<div align="center" style="margin: 20px 0;">
<svg viewBox="0 0 760 450" width="100%" height="auto" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>สถาปัตยกรรม IoT 4 ชั้น: Perception, Network, Processing/Cloud และ Application</title>
  <defs>
    <style>
      .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
      .wire-dashed { fill: none; stroke: #cbd5e1; stroke-width: 2; stroke-linecap: round; stroke-dasharray: 4 6; }
      .main-box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
      .sub-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
      .text-title { font-family: 'IBM Plex Sans Thai', system-ui, sans-serif; font-size: 14px; font-weight: 700; fill: #7c3aed; }
      .text-sub { font-family: 'IBM Plex Sans Thai', system-ui, sans-serif; font-size: 11px; font-weight: 600; fill: #334155; }
      .flow-up { fill: none; stroke: #f59e0b; stroke-width: 3.5; stroke-dasharray: 10 12; stroke-linecap: round; animation: marchUp 2.5s linear infinite; }
      .flow-down { fill: none; stroke: #dc2626; stroke-width: 3.5; stroke-dasharray: 10 12; stroke-linecap: round; animation: marchDown 2.5s linear infinite; }
      .dot-up { fill: #f59e0b; stroke: #ffffff; stroke-width: 1.5; }
      .dot-down { fill: #dc2626; stroke: #ffffff; stroke-width: 1.5; }
      .flow-label { font-family: 'IBM Plex Sans Thai', system-ui, sans-serif; font-size: 10.5px; font-weight: 700; }
      .footer-text { font-family: 'IBM Plex Sans Thai', system-ui, sans-serif; font-size: 12px; font-weight: 700; fill: #475569; }
      @keyframes marchUp {
        to { stroke-dashoffset: -44; }
      }
      @keyframes marchDown {
        to { stroke-dashoffset: 44; }
      }
    </style>
  </defs>

  <rect x="5" y="5" width="750" height="440" class="bg"/>

  <!-- เส้นทางการไหลของข้อมูลขึ้น (Data Uplink) -->
  <path id="path-data-up" d="M 35,390 L 35,50" class="wire-dashed"/>
  <path d="M 35,390 L 35,50" class="flow-up"/>
  
  <circle r="5" class="dot-up">
    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 35,390 L 35,50" />
  </circle>
  <circle r="5" class="dot-up" opacity="0.75">
    <animateMotion dur="2.5s" begin="0.8s" repeatCount="indefinite" path="M 35,390 L 35,50" />
  </circle>
  <circle r="5" class="dot-up" opacity="0.5">
    <animateMotion dur="2.5s" begin="1.6s" repeatCount="indefinite" path="M 35,390 L 35,50" />
  </circle>
  <polygon points="35,35 30,47 40,47" fill="#f59e0b"/>
  <text x="20" y="220" fill="#f59e0b" class="flow-label" transform="rotate(-90 20 220)" text-anchor="middle">📡 ข้อมูลเซนเซอร์ส่งขึ้นคลาวด์ (Uplink Telemetry)</text>

  <!-- เส้นทางการสั่งการควบคุมลง (Control Downlink) -->
  <path id="path-control-down" d="M 725,50 L 725,390" class="wire-dashed"/>
  <path d="M 725,50 L 725,390" class="flow-down"/>
  
  <circle r="5" class="dot-down">
    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 725,50 L 725,390" />
  </circle>
  <circle r="5" class="dot-down" opacity="0.75">
    <animateMotion dur="2.5s" begin="1.25s" repeatCount="indefinite" path="M 725,50 L 725,390" />
  </circle>
  <polygon points="725,405 720,393 730,393" fill="#dc2626"/>
  <text x="740" y="220" fill="#dc2626" class="flow-label" transform="rotate(90 740 220)" text-anchor="middle">⚙️ คำสั่งควบคุมไหลลง (Downlink Control Command)</text>

  <!-- ชั้นที่ 4: Application Layer -->
  <g class="layer">
    <rect x="70" y="20" width="620" height="82" class="main-box" />
    <text x="85" y="40" class="text-title">📱 ชั้นที่ 4: Application Layer (ชั้นประยุกต์ใช้งาน)</text>
    <rect x="85" y="52" width="180" height="38" class="sub-box" />
    <text x="175" y="76" class="text-sub" text-anchor="middle">แดชบอร์ด (Dashboard)</text>
    <rect x="280" y="52" width="180" height="38" class="sub-box" />
    <text x="370" y="76" class="text-sub" text-anchor="middle">ระบบแจ้งเตือน (Alarm API)</text>
    <rect x="475" y="52" width="200" height="38" class="sub-box" />
    <text x="575" y="76" class="text-sub" text-anchor="middle">เว็บและโมบายแอปพลิเคชัน</text>
  </g>

  <!-- ชั้นที่ 3: Processing / Cloud Layer -->
  <g class="layer">
    <rect x="70" y="122" width="620" height="82" class="main-box" />
    <text x="85" y="142" class="text-title">☁️ ชั้นที่ 3: Processing / Cloud Layer (ชั้นประมวลผลคลาวด์)</text>
    <rect x="85" y="154" width="180" height="38" class="sub-box" />
    <text x="175" y="178" class="text-sub" text-anchor="middle">คลาวด์เซิร์ฟเวอร์ (Compute)</text>
    <rect x="280" y="154" width="180" height="38" class="sub-box" />
    <text x="370" y="178" class="text-sub" text-anchor="middle">ฐานข้อมูลอนุกรมเวลา (InfluxDB)</text>
    <rect x="475" y="154" width="200" height="38" class="sub-box" />
    <text x="575" y="178" class="text-sub" text-anchor="middle">วิเคราะห์ด้วยโมเดล AI/ML</text>
  </g>

  <!-- ชั้นที่ 2: Network Layer -->
  <g class="layer">
    <rect x="70" y="224" width="620" height="82" class="main-box" />
    <text x="85" y="244" class="text-title">📶 ชั้นที่ 2: Network Layer (ชั้นเครือข่ายและการสื่อสาร)</text>
    <rect x="85" y="256" width="135" height="38" class="sub-box" />
    <text x="152.5" y="280" class="text-sub" text-anchor="middle">เกตเวย์อุตสาหกรรม</text>
    <rect x="230" y="256" width="135" height="38" class="sub-box" />
    <text x="297.5" y="280" class="text-sub" text-anchor="middle">เครือข่าย Wi-Fi/5G</text>
    <rect x="375" y="256" width="135" height="38" class="sub-box" />
    <text x="442.5" y="280" class="text-sub" text-anchor="middle">LoRaWAN / LPWAN</text>
    <rect x="520" y="256" width="155" height="38" class="sub-box" />
    <text x="597.5" y="280" class="text-sub" text-anchor="middle">โปรโตคอล MQTT / HTTP</text>
  </g>

  <!-- ชั้นที่ 1: Perception Layer -->
  <g class="layer">
    <rect x="70" y="326" width="620" height="82" class="main-box" />
    <text x="85" y="346" class="text-title">🔌 ชั้นที่ 1: Perception Layer (ชั้นรับรู้และอุปกรณ์)</text>
    <rect x="85" y="358" width="180" height="38" class="sub-box" />
    <text x="175" y="382" class="text-sub" text-anchor="middle">เซนเซอร์ (ความชื้น, ความสั่น)</text>
    <rect x="280" y="358" width="180" height="38" class="sub-box" />
    <text x="370" y="382" class="text-sub" text-anchor="middle">ตัวกระทำ (รีเลย์, โซลินอยด์วาล์ว)</text>
    <rect x="475" y="358" width="200" height="38" class="sub-box" />
    <text x="575" y="382" class="text-sub" text-anchor="middle">ไมโครคอนโทรลเลอร์ (ESP32)</text>
  </g>

  <!-- คำบรรยายแผนภาพ -->
  <text x="380" y="432" class="footer-text" text-anchor="middle">แผนภาพที่ 5.1 สถาปัตยกรรม IoT 4 ชั้น แสดงการไหลของข้อมูลสองทิศทาง (Bi-directional Data Flow)</text>
</svg>
</div>

---

## 5.1 Digital I/O: ลอจิก HIGH/LOW

### 5.1.1 ระดับแรงดันของ ESP32

ESP32 ทำงานที่แรงดันลอจิก **3.3 V** ซึ่งแตกต่างจาก Arduino Uno ที่ใช้ 5 V

| สถานะลอจิก | ระดับแรงดัน ESP32 | ความหมาย |
|---|---|---|
| **HIGH** (1) | ≈ 3.3 V | เปิด / จริง (True) |
| **LOW** (0) | ≈ 0 V (GND) | ปิด / เท็จ (False) |

ขา GPIO (General Purpose Input/Output) แต่ละขาสามารถตั้งเป็น **INPUT** (รับสัญญาณเข้า) หรือ **OUTPUT** (ส่งสัญญาณออก) ได้ผ่านฟังก์ชัน `pinMode()`

### 5.1.2 ปัญหาสัญญาณลอย (Floating) และโครงสร้างพูลอัป / พูลดาวน์ภายใน

เมื่อตั้งค่าขา GPIO เป็น `INPUT` แล้วไม่ได้เชื่อมต่อเข้ากับแรงดันอ้างอิงใด ๆ (ปล่อยทิ้งไว้โดยไม่มีสายหรือเชื่อมกับปุ่มกดที่ยังไม่ได้ถูกกด) ขานั้นจะอยู่ในสถานะ **ลอย (Floating)** หรือสภาวะความต้านทานสูงมาก (High-Impedance: Hi-Z) ส่งผลให้ขานั้นมีความไวต่อคลื่นแม่เหล็กไฟฟ้ารบกวนรอบตัวและไฟฟ้าสถิต ทำให้อ่านค่าลอจิกได้แกว่งสุ่มระหว่าง HIGH และ LOW ส่งผลให้โปรแกรมทำงานผิดพลาดหรือประมวลผลเพี้ยน

**วิธีแก้ไข:** คือการใช้ตัวต้านทานเพื่อดึงแรงดันอ้างอิงให้มีสถานะเริ่มต้นที่ชัดเจน (Pull-Up หรือ Pull-Down)

- **Pull-up (พูลอัป)**: ต่อตัวต้านทานจากขา GPIO ไปยัง 3.3 V → สัญญาณปกติถูกดึงไว้เป็น HIGH เมื่อปิดสวิตช์ (กดปุ่ม) กระแสจะไหลลงกราวด์ ทำให้สถานะเปลี่ยนเป็น LOW
- **Pull-down (พูลดาวน์)**: ต่อตัวต้านทานจากขา GPIO ไปยัง GND → สัญญาณปกติถูกดึงลงเป็น LOW เมื่อปิดสวิตช์ (กดปุ่ม) จะได้รับกระแสจากไฟเลี้ยง ทำให้สถานะเปลี่ยนเป็น HIGH

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 780 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>สภาวะขาลอยเทียบกับสภาวะพูลอัป/พูลดาวน์</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .panel { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .resistor { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .sub-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-size: 11px; font-family: monospace; font-weight: 700; fill: #7c3aed; }
    
    @keyframes noiseMarch {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -20; }
    }
    .noise-path { fill: none; stroke: #f59e0b; stroke-width: 2.5; stroke-dasharray: 4 4; animation: noiseMarch 0.8s linear infinite; }
    
    @keyframes flashHighLow {
      0%, 45% { opacity: 0; }
      50%, 95% { opacity: 1; }
    }
    .flash-h { fill: #16a34a; font-weight: bold; animation: flashHighLow 1.5s ease-in-out infinite alternate; }
    .flash-l { fill: #dc2626; font-weight: bold; animation: flashHighLow 1.5s ease-in-out infinite alternate-reverse; }
    
    @keyframes toggleArm {
      0%, 40% { transform: rotate(-25deg); }
      60%, 100% { transform: rotate(0deg); }
    }
    .arm-pu { transform-origin: 330px 245px; animation: toggleArm 3s ease-in-out infinite alternate; }
    .arm-pd { transform-origin: 580px 135px; animation: toggleArm 3s ease-in-out infinite alternate; }
    
    @keyframes stateColorPU {
      0%, 40% { fill: #16a34a; }
      60%, 100% { fill: #dc2626; }
    }
    .state-dot-pu { animation: stateColorPU 3s ease-in-out infinite alternate; }
    
    @keyframes stateColorPD {
      0%, 40% { fill: #dc2626; }
      60%, 100% { fill: #16a34a; }
    }
    .state-dot-pd { animation: stateColorPD 3s ease-in-out infinite alternate; }

    @keyframes textStatePU {
      0%, 40% { opacity: 1; }
      60%, 100% { opacity: 0; }
    }
    .txt-pu-h { animation: textStatePU 3s ease-in-out infinite alternate; }
    .txt-pu-l { animation: textStatePU 3s ease-in-out infinite alternate-reverse; }
    
    @keyframes textStatePD {
      0%, 40% { opacity: 1; }
      60%, 100% { opacity: 0; }
    }
    .txt-pd-l { animation: textStatePD 3s ease-in-out infinite alternate; }
    .txt-pd-h { animation: textStatePD 3s ease-in-out infinite alternate-reverse; }
  </style>
  
  <rect x="5" y="5" width="770" height="330" class="bg"/>
  
  <!-- CASE 1: FLOATING -->
  <rect x="20" y="45" width="230" height="260" class="panel"/>
  <text x="135" y="70" class="text-main" text-anchor="middle">1. สภาวะลอย (Floating)</text>
  <path d="M 40 210 L 140 210 M 140 210 L 220 210" class="wire"/>
  <circle cx="140" cy="210" r="6" fill="#ffffff" stroke="#334155" stroke-width="2"/>
  <path d="M 40 210 Q 60 190 80 210 T 120 210 T 160 210" class="noise-path"/>
  <text x="100" y="175" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">คลื่นสัญญาณรบกวน (Noise)</text>
  <rect x="75" y="240" width="120" height="40" class="sub-box"/>
  <g transform="translate(135, 265)">
    <text class="flash-h" text-anchor="middle">HIGH (3.3V)</text>
    <text class="flash-l" text-anchor="middle">LOW (0V)</text>
  </g>
  <text x="135" y="115" class="text-sub" text-anchor="middle" fill="#dc2626">ขาลอยอยู่นิ่ง ๆ ดักจับสัญญาณ</text>
  <text x="135" y="130" class="text-sub" text-anchor="middle" fill="#dc2626">รบกวนรอบข้างลอยสั่นไปมา</text>
  <text x="135" y="145" class="text-code" text-anchor="middle">? ค่าแกว่งสุ่ม ?</text>

  <!-- CASE 2: PULL-UP -->
  <rect x="270" y="45" width="240" height="260" class="panel"/>
  <text x="390" y="70" class="text-main" text-anchor="middle">2. พูลอัป (Pull-Up)</text>
  <text x="390" y="105" fill="#dc2626" font-size="11" font-weight="bold" text-anchor="middle">VDD (3.3V)</text>
  <line x1="390" y1="110" x2="390" y2="130" class="wire"/>
  <rect x="375" y="130" width="30" height="40" class="resistor"/>
  <text x="390" y="153" font-size="9" text-anchor="middle" font-family="monospace">R_pu</text>
  <line x1="390" y1="170" x2="390" y2="210" class="wire"/>
  
  <line x1="330" y1="210" x2="490" y2="210" class="wire"/>
  <line x1="330" y1="210" x2="330" y2="245" class="wire"/>
  
  <line x1="310" y1="245" x2="350" y2="245" class="wire"/>
  <circle cx="330" cy="245" r="3" fill="#334155"/>
  <line x1="330" y1="245" x2="330" y2="270" class="wire arm-pu"/>
  <circle cx="330" cy="270" r="3" fill="#334155"/>
  <line x1="320" y1="270" x2="340" y2="270" class="wire"/>
  <line x1="323" y1="274" x2="337" y2="274" class="wire"/>
  <line x1="327" y1="278" x2="333" y2="278" class="wire"/>
  <text x="290" y="260" class="text-sub">สวิตช์</text>
  
  <circle cx="390" cy="210" r="6" class="state-dot-pu" stroke="#334155" stroke-width="1.5"/>
  <rect x="420" y="240" width="80" height="40" class="sub-box"/>
  <g transform="translate(460, 265)">
    <text class="txt-pu-h text-main" fill="#16a34a" text-anchor="middle">HIGH</text>
    <text class="txt-pu-l text-main" fill="#dc2626" text-anchor="middle">LOW</text>
  </g>
  <text x="460" y="232" class="text-sub" text-anchor="middle">ค่าที่อ่านได้</text>

  <!-- CASE 3: PULL-DOWN -->
  <rect x="530" y="45" width="230" height="260" class="panel"/>
  <text x="645" y="70" class="text-main" text-anchor="middle">3. พูลดาวน์ (Pull-Down)</text>
  <line x1="580" y1="210" x2="580" y2="135" class="wire"/>
  <text x="580" y="125" fill="#dc2626" font-size="11" font-weight="bold" text-anchor="middle">VDD (3.3V)</text>
  <circle cx="580" cy="135" r="3" fill="#334155"/>
  <line x1="580" y1="135" x2="580" y2="160" class="wire arm-pd"/>
  <circle cx="580" cy="160" r="3" fill="#334155"/>
  <line x1="580" y1="160" x2="580" y2="210" class="wire"/>
  
  <line x1="580" y1="210" x2="740" y2="210" class="wire"/>
  <line x1="640" y1="210" x2="640" y2="230" class="wire"/>
  
  <rect x="625" y="230" width="30" height="40" class="resistor"/>
  <text x="640" y="253" font-size="9" text-anchor="middle" font-family="monospace">R_pd</text>
  <line x1="640" y1="270" x2="640" y2="285" class="wire"/>
  
  <line x1="630" y1="285" x2="650" y2="285" class="wire"/>
  <line x1="633" y1="289" x2="647" y2="289" class="wire"/>
  <line x1="637" y1="293" x2="643" y2="293" class="wire"/>
  <text x="640" y="303" class="text-sub" text-anchor="middle">GND</text>
  
  <circle cx="640" cy="210" r="6" class="state-dot-pd" stroke="#334155" stroke-width="1.5"/>
  <rect x="670" y="240" width="80" height="40" class="sub-box"/>
  <g transform="translate(710, 265)">
    <text class="txt-pd-l text-main" fill="#dc2626" text-anchor="middle">LOW</text>
    <text class="txt-pd-h text-main" fill="#16a34a" text-anchor="middle">HIGH</text>
  </g>
  <text x="710" y="232" class="text-sub" text-anchor="middle">ค่าที่อ่านได้</text>

</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 5.1 การเปรียบเทียบระหว่างสภาวะลอย (Floating) ที่สัญญาณมีคลื่นรบกวนปะปน กับสภาวะพูลอัป (Pull-Up) และพูลดาวน์ (Pull-Down) ที่มีระดับต้านทานคงที่ดึงค่าแน่นอนไว้</div>
</div>

#### โครงสร้างวงจรภายใน GPIO ของ ESP32
ชิป ESP32 ได้ออกแบบโครงสร้างวงจรดิจิทัลอินพุตไว้ภายในแต่ละพิน เพื่ออำนวยความสะดวกแก่นักพัฒนาและลดความต้องการอุปกรณ์ภายนอก โดยมีรายละเอียดทางสถาปัตยกรรมดังนี้:

1. **สวิตช์ MOSFET และตัวต้านทานภายใน**:
   - **Internal Pull-up**: ประกอบด้วยตัวต้านทานภายในขนาดประมาณ **30 kΩ ถึง 80 kΩ** (ค่าระบุทั่วไปเฉลี่ยอยู่ที่ประมาณ **45 kΩ**) ต่อพ่วงกับแหล่งจ่าย $V_{DD}$ (3.3V) วงจรนี้จะใช้สวิตช์ P-MOSFET ในการเปิด-ปิดการเชื่อมต่อ เมื่อเราเขียนโค้ด `pinMode(pin, INPUT_PULLUP)` จะเป็นการสั่งจ่ายลอจิก LOW ไปที่ขาเกต (Gate) ของ P-MOSFET เพื่อนำกระแสให้ไฟเลี้ยงไหลเข้าสู่ขาพิน
   - **Internal Pull-down**: มีตัวต้านทานภายในขนาดประมาณ **30 kΩ ถึง 80 kΩ** ต่อเชื่อมลงกราวด์ (GND) วงจรนี้จะใช้ N-MOSFET ในการเปิด-ปิด เมื่อสั่งงานด้วยฟังก์ชัน `pinMode(pin, INPUT_PULLDOWN)` ลอจิก HIGH จะถูกจ่ายให้ขาเกตของ N-MOSFET ทำให้ขาสัญญาณถูกดึงระดับศักย์ลง GND
2. **สภาวะต้านทานสูงมาก (High-Impedance: Hi-Z)**:
   - หากเราตั้งค่าเป็น `INPUT` เฉย ๆ โดยไม่เปิดใช้คุณสมบัติพูลอัปหรือพูลดาวน์ ทั้ง P-MOSFET และ N-MOSFET จะถูกตัดการเชื่อมต่อ (OFF ทั้งคู่) ขาพินจะกลายเป็นพอร์ตวัดแรงดันที่มีความต้านทานขาเข้าสูงเป็นพิเศษ (มากกว่า 10 MΩ) ศักย์ไฟฟ้าบนพินจึงขึ้นอยู่กับประจุไฟฟ้าและสนามไฟฟ้าระรอบตัว เป็นเหตุที่ทำให้สัญญาณสั่นและลอย (Floating)
3. **Schmitt Trigger**:
   - สัญญาณไฟฟ้าที่เป็นแอนะล็อกที่มีสัญญาณรบกวนปนเข้ามา ก่อนที่จะป้อนเข้าสู่ระบบรีจิสเตอร์ดิจิทัลอ่านค่า จะต้องผ่านวงจรเปรียบเทียบที่มีแรงดันย้อนกลับประวัติ (Hysteresis) เรียกว่า **Schmitt Trigger** เพื่อทำความสะอาดขอบสัญญาณและปัดทศนิยมให้เปลี่ยนเป็นระดับลอจิก HIGH และ LOW ที่แน่นอนคมชัด ป้องกันปัญหาขอบสัญญาณทริกเกอร์แกว่งซ้ำ
4. **ความแตกต่างและข้อจำกัดระหว่างพูลอัปภายในกับภายนอก**:
   - เนื่องจากตัวต้านทานภายในมีค่าความต้านทานค่อนข้างสูง (ประมาณ 45 kΩ) ส่งผลให้มีกระแสพูลอัปไหลต่ำมาก (ราว ๆ 70 µA) เหมาะสำหรับการเชื่อมต่อสวิตช์ธรรมดาหรือความเร็วต่ำ
   - สำหรับบัสสื่อสารที่มีความถี่สูงและมีประจุไฟฟ้าปรสิตแฝงอยู่ในสายเป็นจำนวนมาก เช่น สายส่งข้อมูลบัส I2C หรือ One-Wire อัตราการคายประจุจะช้าเกินไปหากพึ่งพาตัวต้านทานพูลอัปภายใน ค่าแรงดันไฟฟ้าจะกลับจากลอจิก LOW ไปหา HIGH ได้ช้ามาก (รูปคลื่นจะโค้งมนแทนที่จะเป็นสี่เหลี่ยมคมชัด) นักพัฒนาจึงจำเป็นต้องเชื่อมต่อตัวต้านทานพูลอัปภายนอก (External Pull-up) ที่มีความต้านทานต่ำลง เช่น **4.7 kΩ** หรือ **10 kΩ** เพื่อสร้างแรงดึงที่แข็งแกร่งกว่า (Stronger Pull-up) เพิ่มเสถียรภาพในการรับส่งข้อมูล

> 💡 **เคล็ดลับ:** เมื่อใช้ `INPUT_PULLUP` กับปุ่มกด สถานะจะ **กลับด้าน** — ปุ่มไม่ถูกกด = HIGH, ปุ่มถูกกด = LOW เพราะปุ่มจะดึงสัญญาณลง GND

### 5.1.3 ตัวอย่างโค้ด: อ่านปุ่มกดเปิด-ปิด LED

```cpp
// อ่านปุ่มกด (Push Button) ด้วย INPUT_PULLUP แล้วสั่งเปิด-ปิด LED
// ทดสอบบน Wokwi: ESP32 + LED + Push Button

const int BUTTON_PIN = 14;   // ขาที่ต่อปุ่มกด
const int LED_PIN    = 27;   // ขาที่ต่อ LED

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP); // เปิด pull-up ภายใน
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);

  if (buttonState == LOW) {        // กดปุ่ม → LOW (เพราะ pull-up)
    digitalWrite(LED_PIN, HIGH);   // เปิด LED
    Serial.println("Button PRESSED → LED ON");
  } else {
    digitalWrite(LED_PIN, LOW);    // ปิด LED
  }
  delay(50); // หน่วงเวลาเล็กน้อยป้องกันสัญญาณกระเด้ง (debounce)
}
```

### 5.1.4 GPIO Interrupts & Debouncing (การจัดการขัดจังหวะและการลดสัญญาณกระเด้ง)

ในบทเรียนที่ผ่านมา เราอ่านสถานะอินพุตด้วยฟังก์ชัน `digitalRead()` แบบ **Polling** (การวนลูปตรวจจับค่าทุก ๆ รอบ) วิธีนี้มีข้อเสียสำคัญคือ หาก CPU กำลังทำงานหนักหรือมีคำสั่งหน่วงเวลายาวนาน เช่น `delay(1000)` ตัวโปรแกรมอาจไม่พบสัญญาณของการกดปุ่มในช่วงเวลาดังกล่าว

เพื่อแก้ไขปัญหานี้ ไมโครคอนโทรลเลอร์จึงสนับสนุนระบบ **อินเทอร์รัปต์ (Interrupt)** ซึ่งเสมือน "ปุ่มกระดิ่งฉุกเฉิน" ที่ส่งสัญญาณตรงไปยัง CPU หลัก เพื่อขอให้หยุดประมวลผลงานปัจจุบันชั่วคราว แล้วหันมารันโค้ดตอบรับเหตุการณ์นั้นทันทีก่อนจะกลับไปรันงานเดิมต่อ

#### ฟังก์ชันบริการอินเทอร์รัปต์ (Interrupt Service Routine: ISR)
ฟังก์ชันที่ถูกเรียกเมื่อเกิดสัญญาณอินเทอร์รัปต์เรียกว่า **ISR** ซึ่งมีกฎเกณฑ์ในการเขียนที่เข้มงวดดังนี้:
1. **ต้องรวดเร็ว**: ควรเป็นคำสั่งสั้น ๆ เปลี่ยนแปลงระดับสถานะของตัวแปร ไม่ควรมีหน่วงเวลายาวนาน
2. **ห้ามใช้คำสั่งบล็อกเวลา**: ห้ามใส่ `delay()` หรือใช้ไลบรารีส่งข้อมูลหนัก ๆ เช่น `Serial.println()` เพราะระบบอาจทำงานผิดพลาดหรือค้าง
3. **คีย์เวิร์ด `volatile`**: ตัวแปรระดับโกลบอลใด ๆ ที่ถูกเขียนค่าภายในฟังก์ชัน ISR และถูกเรียกใช้ในโปรแกรมหลัก `loop()` จะต้องประกาศนำหน้าด้วยคำว่า `volatile` เพื่อบอกคอมไพเลอร์ไม่ให้จับตัวแปรนั้นเก็บลงในแคชรีจิสเตอร์ของ CPU เพื่อป้องกันปัญหาข้อมูลไม่อัปเดตข้ามเธรด
4. **แอตทริบิวต์ `IRAM_ATTR`**: บน ESP32 เรามักเติม `IRAM_ATTR` ไว้หน้าชื่อฟังก์ชัน ISR เพื่อบอกตัวแปลภาษาให้นำฟังก์ชันนี้ไปบรรจุไว้ในหน่วยความจำ RAM ภายในชิป (Internal SRAM) แทนที่จะทิ้งไว้ใน External Flash Memory ส่งผลให้สามารถตอบสนองและประมวลผลโค้ดขัดจังหวะได้รวดเร็วระดับนาโนวินาที

#### การใช้งานคำสั่ง `attachInterrupt()`
ในเฟรมเวิร์ก Arduino เราเปิดใช้การตรวจสอบขัดจังหวะผ่านคำสั่ง:
```cpp
attachInterrupt(digitalPinToInterrupt(pin), ISR_callback, mode);
```
โดยที่เงื่อนไขการทริกเกอร์อินเทอร์รัปต์ (mode) ประกอบด้วย:
- `RISING`: เกิดเมื่อมีการเปลี่ยนระดับแรงดันจาก LOW ไปหา HIGH (ขอบขาขึ้น)
- `FALLING`: เกิดเมื่อมีการเปลี่ยนระดับแรงดันจาก HIGH ไปหา LOW (ขอบขาลง - มักใช้กับสวิตช์ที่เป็นพูลอัป)
- `CHANGE`: เกิดการเปลี่ยนระดับสถานะใด ๆ ทั้งขาขึ้นและขาลง

#### ปัญหาสัญญาขยายตัวสะท้อนเชิงกล (Contact Bounce) และแนวทาง Debouncing
เมื่อหน้าสัมผัสเชิงกลของปุ่มกดกดประกบเข้าหากัน ในทางไฟฟ้าจะไม่ประกบสนิทแนบแน่นทันที แผ่นโลหะจะสั่นกระเด้งไปมาสร้างคลื่นเปิด-ปิดหลายร้อยรอบในช่วงระดับ **1 ms ถึง 50 ms** แม้มือเราจะกดปุ่มเพียงครั้งเดียว แต่ MCU ที่ทำงานเร็วระดับเมกะเฮิรตซ์จะมองเห็นการกระเด้งนั้นและประมวลผลอินเทอร์รัปต์ซ้ำกันหลายสิบครั้ง (Double Triggering)

เราแก้ไขได้ด้วยวิธีการลดสัญญาณกระเด้ง **(Debouncing)** สองแนวทางหลัก:
1. **Hardware Debouncing**: ใช้ตัวเก็บประจุ 0.1 µF ต่อคร่อมปุ่มกดร่วมกับตัวต้านทาน เพื่อทำหน้าที่กรองความถี่ต่ำ ชะลอความลาดชันของขอบพัลส์ไฟสลับให้เรียบเนียน (วงจรตัวกรอง Low-pass Filter แบบ RC)
2. **Software Debouncing**: เขียนโปรแกรมกรองสัญญาณ
   - *ในลูปหลัก (Polling Debounce)*: เช็กการเปลี่ยนสถานะพินแล้วใส่ `delay(50)` เพื่อรอให้การสั่นจบลง
   - *ในการขัดจังหวะ (Interrupt Debounce)*: อาศัยหลักการ **ฐานเวลา** โดยทุกครั้งที่ ISR ถูกเรียก ให้ดึงเวลาทำงานของระบบด้วยฟังก์ชัน `millis()` เพื่อวัดดูระยะห่างจากสัญญารอบก่อนหน้า หากช่วงห่างดังกล่าวน้อยกว่าค่าที่ตั้งไว้ (เช่น ห่างกันไม่ถึง 200 มิลลิวินาที) ให้ตัดสินว่าเป็นสัญญาณกระเด้งรบกวนและปฏิเสธคำสั่งนั้น

#### ตัวอย่างโค้ด: การเขียนอินเทอร์รัปต์ร่วมกับ Software Debouncing แบบฐานเวลา
```cpp
// โปรแกรมตรวจจับอินเทอร์รัปต์ขอบขาลง พร้อมระบบลดสัญญาณกระเด้งโดยใช้ millis()
const int BUTTON_PIN = 14;   // ขาปุ่มกด (ต่อตัวต้านทานพูลอัปภายใน)
const int LED_PIN    = 27;   // ขา LED

volatile int pressCount = 0;      // ตัวแปรนับจำนวนการกด (ต้องใช้ volatile)
volatile bool ledState = false;    // สถานะไฟ LED
volatile uint32_t lastDebounceTime = 0; // เก็บเวลาการกดปุ่มครั้งหลังสุด (ms)
const uint32_t DEBOUNCE_DELAY = 200;    // กำหนดระยะเวลากรองสัญญาณกระเด้ง 200 ms

// ฟังก์ชัน ISR เก็บตัวใน IRAM
void IRAM_ATTR handleButtonPress() {
  uint32_t currentTime = millis();
  
  // ตรวจสอบว่าพัลส์นี้ห่างจากพัลส์ก่อนหน้าเกินเกณฑ์ดีเบาซ์หรือไม่
  if (currentTime - lastDebounceTime > DEBOUNCE_DELAY) {
    pressCount++;                  // เพิ่มจำนวนนับ
    ledState = !ledState;          // สลับสถานะไฟ
    digitalWrite(LED_PIN, ledState);
    lastDebounceTime = currentTime; // อัปเดตเวลาการกดล่าสุด
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  
  // แนบการทริกเกอร์ขอบขาลง (เมื่อปุ่มกดดึงสัญญาณลง GND)
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), handleButtonPress, FALLING);
  Serial.println("--- Interrupt & Debounce System Ready ---");
}

void loop() {
  // สังเกตและควบคุมการแสดงผลที่ห้ามพิมพ์ใน ISR
  static int lastCount = 0;
  if (pressCount != lastCount) {
    lastCount = pressCount;
    Serial.print("อินเทอร์รัปต์ทำงานจริง! จำนวนสะสม: ");
    Serial.println(lastCount);
  }
}
```

---

## 5.2 ADC (Analog-to-Digital Converter)

### 5.2.1 หลักการทำงาน: สุ่มตัวอย่างและควอนไทซ์

สัญญาณแอนะล็อก (เช่น แรงดันจากเซ็นเซอร์อุณหภูมิ หรือค่าความสว่างแสงจาก LDR) มีลักษณะเป็นค่าต่อเนื่อง (Continuous Value) ทว่าสมองกลดิจิทัลเข้าใจเพียงแค่ระบบเลขฐานสองและค่าสัญญาณที่ไม่ต่อเนื่อง (Discrete Value) จึงจำเป็นต้องพึ่งพากระบวนการของ **ADC** เพื่อทำหน้าที่เป็น "ล่ามแปลภาษาไฟฟ้า" ผ่าน 2 ขั้นตอนหลักดังนี้:

1. **การสุ่มตัวอย่าง (Sampling)** — คือการบันทึกค่าและอ่านแรงดันไฟฟ้า ณ จุดเวลาสเปกตรัมที่แน่นอน (ตามความถี่ในการสุ่มตัวอย่าง $f_s$ หรือคาบเวลา $t$) เพื่อหยุดภาพความต่อเนื่องของสัญญาณไว้ชั่วขณะ
2. **การควอนไทซ์ (Quantization)** — คือการจำแนกค่าแรงดันชั่วขณะที่ถูกสุ่มขึ้นมา ให้เข้าไปอยู่ในระดับความคมชัดดิจิทัลที่ใกล้เคียงที่สุดตามที่ระดับบิตของระบบจะเอื้ออำนวย (เปรียบเสมือนการนำระดับความสูงของคลื่นไปวางลงในช่องบันไดขั้นต่าง ๆ ของตัวรับสัญญาณ)

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 780 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>กระบวนการสุ่มตัวอย่างและการควอนไทซ์</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .grid-line { stroke: #e2e8f0; stroke-width: 1; }
    .grid-axis { stroke: #334155; stroke-width: 2.5; stroke-linecap: round; }
    .analog-curve { fill: none; stroke: #f59e0b; stroke-width: 3; stroke-linecap: round; }
    .quantized-stairs { fill: none; stroke: #16a34a; stroke-width: 3; stroke-linejoin: round; stroke-linecap: round; }
    .sampled-dot { fill: #16a34a; stroke: #ffffff; stroke-width: 1.5; }
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-size: 11px; font-family: monospace; font-weight: 700; fill: #7c3aed; }
    .legend-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
  </style>
  
  <rect x="5" y="5" width="770" height="330" class="bg"/>
  
  <line x1="80" y1="50" x2="720" y2="50" class="grid-line"/>
  <line x1="80" y1="90" x2="720" y2="90" class="grid-line"/>
  <line x1="80" y1="130" x2="720" y2="130" class="grid-line"/>
  <line x1="80" y1="170" x2="720" y2="170" class="grid-line"/>
  <line x1="80" y1="210" x2="720" y2="210" class="grid-line"/>
  <line x1="80" y1="250" x2="720" y2="250" class="grid-line"/>
  <line x1="80" y1="290" x2="720" y2="290" class="grid-line"/>
  
  <text x="70" y="54" class="text-code" text-anchor="end">110 (2.83V)</text>
  <text x="70" y="94" class="text-code" text-anchor="end">101 (2.36V)</text>
  <text x="70" y="134" class="text-code" text-anchor="end">100 (1.89V)</text>
  <text x="70" y="174" class="text-code" text-anchor="end">011 (1.41V)</text>
  <text x="70" y="214" class="text-code" text-anchor="end">010 (0.94V)</text>
  <text x="70" y="254" class="text-code" text-anchor="end">001 (0.47V)</text>
  <text x="70" y="294" class="text-code" text-anchor="end">000 (0.00V)</text>
  
  <line x1="80" y1="50" x2="80" y2="300" class="grid-line"/>
  <line x1="140" y1="50" x2="140" y2="300" class="grid-line"/>
  <line x1="200" y1="50" x2="200" y2="300" class="grid-line"/>
  <line x1="260" y1="50" x2="260" y2="300" class="grid-line"/>
  <line x1="320" y1="50" x2="320" y2="300" class="grid-line"/>
  <line x1="380" y1="50" x2="380" y2="300" class="grid-line"/>
  <line x1="440" y1="50" x2="440" y2="300" class="grid-line"/>
  <line x1="500" y1="50" x2="500" y2="300" class="grid-line"/>
  <line x1="560" y1="50" x2="560" y2="300" class="grid-line"/>
  <line x1="620" y1="50" x2="620" y2="300" class="grid-line"/>
  <line x1="680" y1="50" x2="680" y2="300" class="grid-line"/>

  <text x="80" y="315" class="text-sub" text-anchor="middle">t0</text>
  <text x="140" y="315" class="text-sub" text-anchor="middle">t1</text>
  <text x="200" y="315" class="text-sub" text-anchor="middle">t2</text>
  <text x="260" y="315" class="text-sub" text-anchor="middle">t3</text>
  <text x="320" y="315" class="text-sub" text-anchor="middle">t4</text>
  <text x="380" y="315" class="text-sub" text-anchor="middle">t5</text>
  <text x="440" y="315" class="text-sub" text-anchor="middle">t6</text>
  <text x="500" y="315" class="text-sub" text-anchor="middle">t7</text>
  <text x="560" y="315" class="text-sub" text-anchor="middle">t8</text>
  <text x="620" y="315" class="text-sub" text-anchor="middle">t9</text>
  <text x="680" y="315" class="text-sub" text-anchor="middle">t10</text>

  <line x1="80" y1="300" x2="730" y2="300" class="grid-axis"/>
  <line x1="80" y1="40" x2="80" y2="300" class="grid-axis"/>
  <text x="735" y="304" class="text-main">เวลา (Time)</text>
  <text x="80" y="32" class="text-main" text-anchor="middle">แรงดัน (V)</text>

  <path d="M 80 170 C 120 70, 160 70, 200 90 C 240 110, 240 230, 260 250 C 280 270, 300 270, 320 250 C 340 230, 360 70, 440 90 C 500 115, 530 250, 560 250 C 590 250, 620 170, 680 170" class="analog-curve"/>
  
  <path d="M 80 170 L 140 170 L 140 90 L 200 90 L 200 90 L 260 90 L 260 250 L 320 250 L 320 250 L 380 250 L 380 170 L 440 170 L 440 90 L 500 90 L 500 170 L 560 170 L 560 250 L 620 250 L 620 210 L 680 210 L 680 170" class="quantized-stairs"/>

  <circle cx="80" cy="170" r="4" class="sampled-dot"/>
  <circle cx="140" cy="90" r="4" class="sampled-dot"/>
  <circle cx="200" cy="90" r="4" class="sampled-dot"/>
  <circle cx="260" cy="250" r="4" class="sampled-dot"/>
  <circle cx="320" cy="250" r="4" class="sampled-dot"/>
  <circle cx="380" cy="170" r="4" class="sampled-dot"/>
  <circle cx="440" cy="90" r="4" class="sampled-dot"/>
  <circle cx="500" cy="170" r="4" class="sampled-dot"/>
  <circle cx="560" cy="250" r="4" class="sampled-dot"/>
  <circle cx="620" cy="210" r="4" class="sampled-dot"/>
  <circle cx="680" cy="170" r="4" class="sampled-dot"/>

  <line x1="80" y1="40" x2="80" y2="300" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="3 3">
    <animate attributeName="x1" values="80;680;80" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="x2" values="80;680;80" dur="8s" repeatCount="indefinite"/>
  </line>

  <rect x="520" y="15" width="220" height="65" class="legend-box" opacity="0.9"/>
  <line x1="535" y1="30" x2="565" y2="30" class="analog-curve" stroke-width="2"/>
  <text x="575" y="34" class="text-sub" font-weight="bold">สัญญาณแอนะล็อกต่อเนื่อง</text>
  
  <line x1="535" y1="50" x2="565" y2="50" class="quantized-stairs" stroke-width="2"/>
  <text x="575" y="54" class="text-sub" font-weight="bold">สัญญาณดิจิทัลแบบขั้นบันได</text>
  
  <circle cx="550" cy="68" r="4" class="sampled-dot"/>
  <text x="575" y="72" class="text-sub" font-weight="bold">จุดสุ่มตัวอย่าง (Sample Points)</text>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 5.2 กระบวนการสุ่มตัวอย่างตามคาบเวลา (Sampling at t) และการแปลงค่าความต่อเนื่องให้เป็นขั้นบันไดดิจิทัล (Quantization) ตามระดับบิต</div>
</div>

### 5.2.2 ความละเอียดบิตของ ESP32

ESP32 มี ADC ความละเอียด **12 บิต (12-bit)** หมายความว่า:

- จำนวนระดับ = 2¹² = **4,096 ระดับ** (ค่า 0 ถึง 4,095)
- ช่วงแรงดันอ้างอิง (Reference Voltage) ≈ 0 – 3.3 V

| พารามิเตอร์ | Arduino Uno | ESP32 |
|---|---|---|
| ความละเอียด ADC | 10 บิต (0–1023) | 12 บิต (0–4095) |
| แรงดันอ้างอิง | 5.0 V | 3.3 V |
| ความละเอียดต่อขั้น | ≈ 4.88 mV | ≈ 0.81 mV |

### 5.2.3 สูตรแปลงค่า ADC เป็นแรงดัน

```
V_actual = (ADC_value / ADC_max) × V_ref
```

สำหรับ ESP32:

```
V_actual = (ADC_value / 4095.0) × 3.3
```

ตัวอย่าง: อ่านค่าได้ 2048 → แรงดัน ≈ (2048 / 4095) × 3.3 ≈ **1.65 V**

### 5.2.4 ตัวอย่างโค้ด: อ่านค่าจาก Potentiometer

```cpp
// อ่านค่า Potentiometer ผ่าน ADC แล้วแปลงเป็นแรงดัน
// Wokwi: ESP32 + Potentiometer ต่อขา GPIO 34

const int POT_PIN = 34;  // ขา ADC (GPIO 34 เป็น input-only)

void setup() {
  Serial.begin(115200);
  // ขา ADC ไม่ต้องตั้ง pinMode เป็น INPUT ก็ได้ (เป็นค่าปริยาย)
}

void loop() {
  int adcValue = analogRead(POT_PIN);  // อ่านค่า 0–4095

  // แปลงเป็นแรงดัน (V)
  float voltage = (adcValue / 4095.0) * 3.3;

  Serial.print("ADC: ");
  Serial.print(adcValue);
  Serial.print("  |  Voltage: ");
  Serial.print(voltage, 2);  // แสดง 2 ตำแหน่งทศนิยม
  Serial.println(" V");

  delay(500);
}
```

> 💡 **หมายเหตุสำคัญ:** บน ESP32 ขา GPIO 34, 35, 36 และ 39 เป็นขา **input-only** ไม่สามารถตั้งเป็น OUTPUT ได้ แต่เหมาะสำหรับอ่าน ADC เพราะไม่มีวงจรไดรเวอร์ดิจิทัลเอาต์พุตภายในรบกวนสัญญาณแอนะล็อก

### 5.2.5 ปัญหาความไม่เป็นเชิงเส้นของ ESP32 ADC และการสอบเทียบ (Calibration)

แม้โมดูล ADC ของ ESP32 จะมีความละเอียด 12 บิตและสามารถวัดช่วงแรงดันได้กว้างตามระดับการลดทอน (Attenuation) ทว่าในการใช้งานจริง ตัว ADC มี **ความไม่เป็นเชิงเส้น (Non-linearity)** ค่อนข้างสูง โดยแบ่งขีดจำกัดออกเป็นพื้นที่ต่าง ๆ ดังนี้:

1. **Dead Zone ปลายล่าง (ใกล้อะนาล็อก 0V)**: แรงดันที่ต่ำกว่าประมาณ **0.1V ถึง 0.15V** จะวัดค่าความละเอียดได้เป็น 0 เสมอ (เรียกว่าปลายล่างตัด)
2. **Saturation Zone ปลายบน (ใกล้แรงดันอ้างอิงสูงสุด)**: หากตั้งเกณฑ์ลดทอนไว้ที่ 11dB (สำหรับวัดช่วง 0 - 3.6V) แรงดันที่เพิ่มสูงเกินประมาณ **3.1V ถึง 3.2V** เป็นต้นไป จะให้ค่าดิจิทัลอิ่มตัวที่ 4095 เท่ากันหมด
3. **ผลกระทบหลัก**: ในการอ่านค่าแรงดันเชิงเส้นตรงที่แม่นยำ ช่วงแรงดันของเอาต์พุตเซ็นเซอร์ที่ปลอดภัยและแนะนำให้ป้อนเข้าช่อง ADC จึงถูกจำกัดอยู่ระหว่าง **0.15V ถึง 3.1V** เท่านั้น

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 780 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>ESP32 ADC Response Curve & Calibration</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .grid-axis { stroke: #334155; stroke-width: 2.5; stroke-linecap: round; }
    .grid-line { stroke: #cbd5e1; stroke-width: 1; stroke-dasharray: 4 4; }
    .response-curve { fill: none; stroke: #334155; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .response-curve-active { fill: none; stroke: #f59e0b; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 12 15; animation: curveMarch 2.5s linear infinite; }
    
    .dead-zone { fill: #fee2e2; }
    .linear-zone { fill: #ecfdf5; }
    .sat-zone { fill: #fee2e2; }
    
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-size: 11px; font-family: monospace; font-weight: 700; fill: #7c3aed; }
    
    @keyframes curveMarch {
      to { stroke-dashoffset: -54; }
    }
  </style>
  
  <rect x="5" y="5" width="770" height="330" class="bg"/>
  
  <!-- Zone Backgrounds -->
  <!-- Dead Zone: 0.0V to 0.15V (X: 80 to 115) -->
  <rect x="80" y="50" width="35" height="240" class="dead-zone" opacity="0.6"/>
  <!-- Linear Zone: 0.15V to 3.1V (X: 115 to 680) -->
  <rect x="115" y="50" width="565" height="240" class="linear-zone" opacity="0.6"/>
  <!-- Saturation Zone: 3.1V to 3.3V (X: 680 to 720) -->
  <rect x="680" y="50" width="40" height="240" class="sat-zone" opacity="0.6"/>
  
  <!-- Grid Lines -->
  <line x1="80" y1="50" x2="720" y2="50" class="grid-line"/>
  <line x1="80" y1="170" x2="720" y2="170" class="grid-line"/>
  <line x1="80" y1="290" x2="720" y2="290" class="grid-line"/>
  
  <line x1="115" y1="50" x2="115" y2="290" class="grid-line"/>
  <line x1="380" y1="50" x2="380" y2="290" class="grid-line"/>
  <line x1="680" y1="50" x2="680" y2="290" class="grid-line"/>
  <line x1="720" y1="50" x2="720" y2="290" class="grid-line"/>

  <!-- Y-Axis labels -->
  <text x="70" y="54" class="text-code" text-anchor="end">4095</text>
  <text x="70" y="174" class="text-code" text-anchor="end">2048</text>
  <text x="70" y="294" class="text-code" text-anchor="end">0</text>
  
  <!-- X-Axis labels -->
  <text x="80" y="312" class="text-sub" text-anchor="middle">0.0V</text>
  <text x="115" y="312" class="text-sub" text-anchor="middle">0.15V</text>
  <text x="380" y="312" class="text-sub" text-anchor="middle">1.65V</text>
  <text x="680" y="312" class="text-sub" text-anchor="middle">3.10V</text>
  <text x="720" y="312" class="text-sub" text-anchor="middle">3.30V</text>

  <!-- Axes -->
  <line x1="80" y1="290" x2="730" y2="290" class="grid-axis"/>
  <line x1="80" y1="40" x2="80" y2="290" class="grid-axis"/>
  <text x="735" y="294" class="text-main">แรงดันอินพุต (Input Voltage)</text>
  <text x="80" y="32" class="text-main" text-anchor="middle">ค่าดิจิทัลเอาต์พุต (ADC Value)</text>

  <!-- Curves -->
  <path d="M 80 290 L 115 290 Q 130 290 145 272 L 650 78 Q 665 50 680 50 L 720 50" class="response-curve"/>
  <path id="curvePath" d="M 80 290 L 115 290 Q 130 290 145 272 L 650 78 Q 665 50 680 50 L 720 50" class="response-curve-active"/>

  <!-- Dynamic tracker dot -->
  <circle r="6" fill="#7c3aed" stroke="#ffffff" stroke-width="2">
    <animateMotion dur="6s" repeatCount="indefinite">
      <mpath href="#curvePath"/>
    </animateMotion>
  </circle>

  <!-- Annotations / Legends -->
  <text x="97" y="170" fill="#dc2626" font-size="11" font-weight="bold" text-anchor="middle" transform="rotate(-90 97 170)">ช่วงอับสัญญาณ (Dead Zone)</text>
  <text x="380" y="130" fill="#16a34a" font-size="14" font-weight="bold" text-anchor="middle">Linear Range (ช่วงที่วัดได้เป็นเชิงเส้นตรง)</text>
  <text x="700" y="170" fill="#dc2626" font-size="11" font-weight="bold" text-anchor="middle" transform="rotate(90 700 170)">ช่วงอิ่มตัว (Saturation Zone)</text>
  
  <!-- Info Box -->
  <rect x="420" y="150" width="240" height="70" fill="#ffffff" stroke="#334155" stroke-width="2" rx="4"/>
  <text x="430" y="170" class="text-main">คุณสมบัติการตอบสนอง:</text>
  <text x="430" y="190" class="text-sub">ต่ำกว่า 0.15V: เอาต์พุตเป็น 0 เสมอ</text>
  <text x="430" y="208" class="text-sub">สูงกว่า 3.10V: เอาต์พุตเป็น 4095 เสมอ</text>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 5.3 กราฟแสดงคุณลักษณะไม่เป็นเชิงเส้น (Non-linear Response Curve) ของ ADC บนชิป ESP32 ที่มีขอบ Dead Zone ที่ส่วนปลายล่าง และ Saturation Zone ที่ส่วนปลายบนสุด</div>
</div>

#### แนวทางแก้ปัญหาเพื่อสอบเทียบความเที่ยงตรง (Calibration)

การแปลงค่าตัวเลขแอนะล็อกดิบให้กลายเป็นระดับแรงดันไฟฟ้าที่แม่นยำสูง สามารถทำได้ 2 รูปแบบ:

##### 1. การสอบเทียบผ่านสมการพหุนามลำดับขั้นสูง (Polynomial Regression)
เป็นการใช้ตัววิเคราะห์ข้อมูลเพื่อทำโค้งความพอดี (Curve Fitting) ด้วยสมการพหุนามดีกรี 2 หรือ 3 บนความต้องการเฉพาะด้านเพื่อจูนช่วงระดับแรงดันไฟฟ้า ตัวอย่างรูปแบบสมการ เช่น:
$$V_{calibrated} = a \cdot ADC^3 + b \cdot ADC^2 + c \cdot ADC + d$$
โดยที่สัมประสิทธิ์ $a, b, c, d$ จะต้องทำการเก็บข้อมูลจับคู่คู่ระดับค่าดิบที่อ่านได้กับแรงดันไฟฟ้าที่วัดได้จากมิเตอร์มาตรฐาน แล้วคำนวณถดถอยพหุนาม

##### 2. การดึงค่าสอบเทียบจาก eFuse ด้วยไลบรารี `esp_adc_cal` (แนะนำ)
ชิป ESP32 แต่ละตัวจากโรงงานมีความคลาดเคลื่อนของแรงดันอ้างอิงภายใน (Internal Vref ซึ่งปกติควรจะเป็น 1.1 V แต่ความจริงมักจะเบี่ยงเบนระหว่าง 1.0 V ถึง 1.2 V) ทางผู้ผลิต Espressif จึงทำการวัดตัวชิปรายตัวแล้วจัดเก็บค่าแรงดันอ้างอิงจริงที่ปรับค่าถูกต้องแล้วไว้ในหน่วยความจำถาวรภายในชิปที่ชื่อว่า **eFuse**

ในซอฟต์แวร์ระดับล่าง เราสามารถเขียนคำสั่งในโปรแกรม Arduino หรือ ESP-IDF เพื่อเรียกไลบรารี `esp_adc_cal.h` เข้าไปเปิดข้อมูลสอบเทียบจาก eFuse มาทำการสอบเทียบย้อนกลับค่าแรงดันดิบให้กลายเป็นแรงดันมิลลิโวลต์ (mV) ที่ถูกต้องอย่างอัตโนมัติ

#### โค้ดตัวอย่าง: การดึงระดับแรงดันสอบเทียบจาก eFuse
```cpp
// โค้ดใช้ไลบรารี esp_adc_cal เพื่อดึงแรงดันไฟฟ้าสอบเทียบจากหน่วยความจำ eFuse ของ ESP32
#include <esp_adc_cal.h>

#define ADC_PIN 34
#define DEFAULT_VREF 1100 // ใช้ค่าเฉลี่ย 1100 mV หาก eFuse ของชิปไม่มีข้อมูลสอบเทียบ

esp_adc_cal_characteristics_t *adc_chars;

void setup() {
  Serial.begin(115200);
  
  // จัดเตรียมและจองพื้นที่หน่วยความจำสำหรับรับข้อมูลแคแรกเตอร์ตัวแปรสอบเทียบ
  adc_chars = (esp_adc_cal_characteristics_t *)calloc(1, sizeof(esp_adc_cal_characteristics_t));
  
  // ดึงข้อมูลและตรวจสอบค่าการสอบเทียบใน eFuse สำหรับชุดประมวลผล ADC1 
  // ภายใต้การลดทอนสัญญาณที่ 11dB และความละเอียดสูงสุด 12 บิต
  esp_adc_cal_value_t val_type = esp_adc_cal_characterize(
    ADC_UNIT_1, 
    ADC_ATTEN_DB_11, 
    ADC_WIDTH_BIT_12, 
    DEFAULT_VREF, 
    adc_chars
  );
  
  // พิมพ์ตรวจสอบชนิดการสอบเทียบที่พบในชิปตัวนี้
  if (val_type == ESP_ADC_CAL_VAL_EFUSE_TP) {
    Serial.println("พบข้อมูลการสอบเทียบแบบ Two Point values ใน eFuse");
  } else if (val_type == ESP_ADC_CAL_VAL_EFUSE_VREF) {
    Serial.println("พบข้อมูลแรงดันอ้างอิงตรงตัว Vref ใน eFuse");
  } else {
    Serial.println("ไม่พบข้อมูลสอบเทียบใน eFuse จะใช้ระดับอ้างอิงเบื้องต้น (Default Vref)");
  }
}

void loop() {
  int rawAdc = analogRead(ADC_PIN); // อ่านค่า ADC ดิบ 0-4095
  
  // แปลงค่าดิบ (Raw ADC) เป็นหน่วยแรงดันไฟฟ้ามิลลิโวลต์ (mV) ที่ถูกสอบเทียบแล้ว
  uint32_t voltage_mv = esp_adc_cal_raw_to_voltage(rawAdc, adc_chars);
  float voltage_v = voltage_mv / 1000.0;
  
  Serial.print("ค่าดิบ (Raw ADC): ");
  Serial.print(rawAdc);
  Serial.print(" | แรงดันที่สอบเทียบแล้ว (Voltage): ");
  Serial.print(voltage_v, 3);
  Serial.println(" V");
  
  delay(500);
}
```
```

---

## 5.3 PWM (Pulse Width Modulation)

### 5.3.1 หลักการ Duty Cycle และความถี่

PWM คือเทคนิคการสร้างสัญญาณดิจิทัลที่ **สลับระดับสถานะ HIGH และ LOW สลับไปมาอย่างรวดเร็ว** เพื่อจำลองระดับแรงดันไฟฟ้าเสมือนที่เป็นแอนะล็อก โดยส่งผ่านปริมาณพลังงานไฟฟ้าตามสัดส่วนการเปิดปิด ซึ่งสัญญาณ PWM จะมีตัวแปรสำคัญอยู่ 2 ส่วนหลัก:

- **ดิวตี้ไซเคิล (Duty Cycle)** — สัดส่วนค่าเฉลี่ยของช่วงเวลาที่เป็นลอจิก HIGH เทียบต่อคาบเวลา (Period: $T$) ทั้งหมดของการทำงานหนึ่งรอบ คํานวณออกมาเป็นเปอร์เซ็นต์ (`%`)
  - 0% = ปิดสัญญาณถาวร (ให้เอาต์พุตเท่ากับ 0V)
  - 50% = เปิดใช้งานครึ่งหนึ่งและปิดอีกครึ่งหนึ่งในหนึ่งคาบ (ได้แรงดันเฉลี่ยประมาณครึ่งหนึ่งของกำลัง เช่น 1.65V)
  - 100% = เปิดสัญญาณค้างตลอดเวลา (ได้แรงดันสูงเท่ากับแหล่งจ่ายคือ 3.3V)
- **ความถี่ (Frequency)** — จำนวนรอบคลื่นหรือคาบคลื่นในหน่วยวินาที (Hz) สำหรับความคุมหรี่แสง LED ความถี่ที่เกิน **5,000 Hz (5 kHz)** ขึ้นไปช่วยแก้ปัญหาการกะพริบที่ดวงตามนุษย์สังเกตได้ และลดความเมื่อยล้าสายตาได้เป็นอย่างดี

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 780 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>ดิวตี้ไซเคิล PWM กับความสว่าง LED</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .panel { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 8px; }
    .pwm-wave { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .timeline { stroke: #cbd5e1; stroke-width: 1; stroke-dasharray: 4 4; }
    .led-off { fill: #ffffff; stroke: #334155; stroke-width: 2; }
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-size: 11px; font-family: monospace; font-weight: 700; fill: #7c3aed; }
    
    @keyframes glowBlink25 {
      0%, 100% { opacity: 0.25; }
      50% { opacity: 0.45; }
    }
    @keyframes glowBlink50 {
      0%, 100% { opacity: 0.55; }
      50% { opacity: 0.75; }
    }
    @keyframes glowBlink75 {
      0%, 100% { opacity: 0.85; }
      50% { opacity: 1.0; }
    }
    
    .led-glow-25 { fill: #fef08a; stroke: #334155; stroke-width: 2; animation: glowBlink25 2s ease-in-out infinite; }
    .led-glow-50 { fill: #fde047; stroke: #334155; stroke-width: 2; animation: glowBlink50 2s ease-in-out infinite; }
    .led-glow-75 { fill: #facc15; stroke: #334155; stroke-width: 2; animation: glowBlink75 2s ease-in-out infinite; }
    
    @keyframes travelWave {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -120; }
    }
    .wave-flow { stroke-dasharray: 10 15; stroke: #f59e0b; stroke-width: 3.5; stroke-linecap: round; animation: travelWave 4s linear infinite; }
    .led-pin { stroke: #334155; stroke-width: 2.5; stroke-linecap: round; }
  </style>
  
  <rect x="5" y="5" width="770" height="330" class="bg"/>
  
  <!-- Row 1: 25% Duty Cycle -->
  <rect x="20" y="25" width="730" height="85" class="panel"/>
  <text x="35" y="55" class="text-main">ดิวตี้ไซเคิล 25% (หรี่มาก)</text>
  <text x="35" y="75" class="text-code">Avg: 0.825 V</text>
  
  <g transform="translate(240, 30)">
    <line x1="0" y1="60" x2="300" y2="60" class="timeline"/>
    <line x1="0" y1="15" x2="300" y2="15" class="timeline"/>
    <path id="wave25" d="M 0 60 L 0 15 L 20 15 L 20 60 L 80 60 L 80 15 L 100 15 L 100 60 L 160 60 L 160 15 L 180 15 L 180 60 L 240 60 L 240 15 L 260 15 L 260 60 L 300 60" class="pwm-wave"/>
    <path d="M 0 60 L 0 15 L 20 15 L 20 60 L 80 60 L 80 15 L 100 15 L 100 60 L 160 60 L 160 15 L 180 15 L 180 60 L 240 60 L 240 15 L 260 15 L 260 60 L 300 60" class="pwm-wave wave-flow" opacity="0.8"/>
    <text x="10" y="10" class="text-sub" text-anchor="middle">ON</text>
    <text x="50" y="55" class="text-sub" text-anchor="middle">OFF</text>
  </g>
  
  <g transform="translate(630, 68)">
    <circle cx="0" cy="0" r="20" class="led-off"/>
    <circle cx="0" cy="0" r="20" class="led-glow-25"/>
    <line x1="-5" y1="16" x2="-5" y2="24" class="led-pin"/>
    <line x1="5" y1="16" x2="5" y2="24" class="led-pin"/>
    <text x="35" y="5" class="text-main">LED สว่าง 25%</text>
  </g>

  <!-- Row 2: 50% Duty Cycle -->
  <rect x="20" y="120" width="730" height="85" class="panel"/>
  <text x="35" y="150" class="text-main">ดิวตี้ไซเคิล 50% (ปานกลาง)</text>
  <text x="35" y="170" class="text-code">Avg: 1.65 V</text>
  
  <g transform="translate(240, 125)">
    <line x1="0" y1="60" x2="300" y2="60" class="timeline"/>
    <line x1="0" y1="15" x2="300" y2="15" class="timeline"/>
    <path id="wave50" d="M 0 60 L 0 15 L 40 15 L 40 60 L 80 60 L 80 15 L 120 15 L 120 60 L 160 60 L 160 15 L 200 15 L 200 60 L 240 60 L 240 15 L 280 15 L 280 60 L 300 60" class="pwm-wave"/>
    <path d="M 0 60 L 0 15 L 40 15 L 40 60 L 80 60 L 80 15 L 120 15 L 120 60 L 160 60 L 160 15 L 200 15 L 200 60 L 240 60 L 240 15 L 280 15 L 280 60 L 300 60" class="pwm-wave wave-flow" opacity="0.8"/>
    <text x="20" y="10" class="text-sub" text-anchor="middle">ON</text>
    <text x="60" y="55" class="text-sub" text-anchor="middle">OFF</text>
  </g>
  
  <g transform="translate(630, 163)">
    <circle cx="0" cy="0" r="20" class="led-off"/>
    <circle cx="0" cy="0" r="20" class="led-glow-50"/>
    <line x1="-5" y1="16" x2="-5" y2="24" class="led-pin"/>
    <line x1="5" y1="16" x2="5" y2="24" class="led-pin"/>
    <text x="35" y="5" class="text-main">LED สว่าง 50%</text>
  </g>

  <!-- Row 3: 75% Duty Cycle -->
  <rect x="20" y="215" width="730" height="85" class="panel"/>
  <text x="35" y="245" class="text-main">ดิวตี้ไซเคิล 75% (สว่างมาก)</text>
  <text x="35" y="265" class="text-code">Avg: 2.475 V</text>
  
  <g transform="translate(240, 220)">
    <line x1="0" y1="60" x2="300" y2="60" class="timeline"/>
    <line x1="0" y1="15" x2="300" y2="15" class="timeline"/>
    <path id="wave75" d="M 0 60 L 0 15 L 60 15 L 60 60 L 80 60 L 80 15 L 140 15 L 140 60 L 160 60 L 160 15 L 220 15 L 220 60 L 240 60 L 240 15 L 300 15 L 300 60" class="pwm-wave"/>
    <path d="M 0 60 L 0 15 L 60 15 L 60 60 L 80 60 L 80 15 L 140 15 L 140 60 L 160 60 L 160 15 L 220 15 L 220 60 L 240 60 L 240 15 L 300 15 L 300 60" class="pwm-wave wave-flow" opacity="0.8"/>
    <text x="30" y="10" class="text-sub" text-anchor="middle">ON</text>
    <text x="70" y="55" class="text-sub" text-anchor="middle">OFF</text>
  </g>
  
  <g transform="translate(630, 258)">
    <circle cx="0" cy="0" r="20" class="led-off"/>
    <circle cx="0" cy="0" r="20" class="led-glow-75"/>
    <line x1="-5" y1="16" x2="-5" y2="24" class="led-pin"/>
    <line x1="5" y1="16" x2="5" y2="24" class="led-pin"/>
    <text x="35" y="5" class="text-main">LED สว่าง 75%</text>
  </g>

</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 5.3 อัตราส่วนความกว้างพัลส์ (Duty Cycle) ของสัญญาณ PWM ส่งผลต่อค่าแรงดันเฉลี่ยและความสว่างของหลอด LED ในลักษณะสัดส่วนเชิงเส้น</div>
</div>

### 5.3.2 PWM บน ESP32: LEDC API

ESP32 ไม่มีฟังก์ชัน `analogWrite()` แบบ Arduino Uno โดยตรง แต่ใช้ **LEDC (LED Control)** ที่ยืดหยุ่นกว่า:

```
ledcAttach(pin, freq, resolution)   // ผูกขา GPIO กับ PWM
ledcWrite(pin, dutyCycle)           // กำหนดค่า duty cycle
```

ค่าความละเอียด (Resolution) กำหนดช่วงค่า duty cycle เช่น:
- 8 บิต → ค่า 0–255
- 10 บิต → ค่า 0–1023

### 5.3.3 ตัวอย่างโค้ด: หรี่ไฟ LED ด้วย PWM

```cpp
// หรี่ไฟ LED แบบ Fade In / Fade Out ด้วย PWM
// Wokwi: ESP32 + LED ต่อขา GPIO 16

const int LED_PIN   = 16;
const int PWM_FREQ  = 5000;  // ความถี่ 5 kHz
const int PWM_RES   = 8;     // ความละเอียด 8 บิต (0–255)

void setup() {
  ledcAttach(LED_PIN, PWM_FREQ, PWM_RES);
}

void loop() {
  // Fade In: เพิ่มความสว่างจาก 0 ถึง 255
  for (int duty = 0; duty <= 255; duty += 5) {
    ledcWrite(LED_PIN, duty);
    delay(20);
  }

  // Fade Out: ลดความสว่างจาก 255 ถึง 0
  for (int duty = 255; duty >= 0; duty -= 5) {
    ledcWrite(LED_PIN, duty);
    delay(20);
  }
}
```

### 5.3.4 การควบคุมเซอร์โวมอเตอร์ (Servo Motor)

เซอร์โวมอเตอร์ทั่วไปรับสัญญาณ PWM ความถี่ **50 Hz** โดยความกว้างพัลส์ (Pulse Width) กำหนดมุม:

- **1 ms** (duty ≈ 5%) → มุม 0°
- **1.5 ms** (duty ≈ 7.5%) → มุม 90°
- **2 ms** (duty ≈ 10%) → มุม 180°

ใน Wokwi สามารถใช้ไลบรารี `ESP32Servo.h` เพื่อสั่งมุมได้ง่ายผ่าน `servo.write(angle)`

---

## 5.4 ESP32 DAC (Digital-to-Analog Converter)

### 5.4.1 หลักการทำงานและเปรียบเทียบกับ PWM
ในขณะที่ **PWM** เลียนแบบสัญญาณแอนะล็อกด้วยการใช้พัลส์สลับความถี่สูงเพื่อควบคุมพลังงานเฉลี่ย แต่อุปกรณ์บางชนิดไม่สามารถตอบรับสัญญาณแบบพัลส์ได้ (เช่น วงจรเสียงที่ต้องการความเรียบเนียน หรือเครื่องมือวัดความตึงเครียดของไฟฟ้า) 

**DAC (Digital-to-Analog Converter)** ทำหน้าที่ในทิศทางกลับกันกับ ADC คือการแปลงค่าข้อมูลตัวเลขดิจิทัลจากไมโครคอนโทรลเลอร์ ให้กลายเป็น **แรงดันไฟฟ้าแอนะล็อกแท้จริง (True Analog Voltage)** ที่คงที่และมีความต่อเนื่องที่จุดเอาต์พุตโดยไม่ต้องมีการสลับเปิด-ปิดสัญญาณพัลส์แต่อย่างใด

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 780 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>เปรียบเทียบสัญญาณ PWM และ DAC</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .panel { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 8px; }
    .grid-axis { stroke: #334155; stroke-width: 2.5; stroke-linecap: round; }
    .grid-line { stroke: #e2e8f0; stroke-width: 1; }
    .pwm-line { fill: none; stroke: #334155; stroke-width: 2.5; }
    .dac-line { fill: none; stroke: #334155; stroke-width: 2.5; }
    .avg-line-styled { fill: none; stroke: #dc2626; stroke-width: 2.5; stroke-dasharray: 4 4; }
    
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-size: 11px; font-family: monospace; font-weight: 700; fill: #7c3aed; }
    
    @keyframes travelPWM {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -100; }
    }
    .pwm-flow { stroke-dasharray: 8 12; stroke: #f59e0b; stroke-width: 3.5; stroke-linecap: round; animation: travelPWM 3s linear infinite; }
    
    @keyframes travelDAC {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -120; }
    }
    .dac-flow { stroke-dasharray: 8 12; stroke: #16a34a; stroke-width: 3.5; stroke-linecap: round; animation: travelDAC 3s linear infinite; }
  </style>
  
  <rect x="5" y="5" width="770" height="330" class="bg"/>
  
  <rect x="20" y="25" width="360" height="280" class="panel"/>
  <text x="200" y="50" class="text-main" text-anchor="middle">1. สัญญาณ PWM (Pulse Width Modulation)</text>
  
  <g transform="translate(50, 70)">
    <line x1="0" y1="160" x2="300" y2="160" class="grid-axis"/>
    <line x1="0" y1="20" x2="0" y2="160" class="grid-axis"/>
    <text x="-10" y="25" class="text-sub" text-anchor="end">3.3V</text>
    <text x="-10" y="165" class="text-sub" text-anchor="end">0V</text>
    <text x="290" y="180" class="text-sub" text-anchor="end">เวลา</text>
    
    <line x1="0" y1="20" x2="300" y2="20" class="grid-line"/>
    <line x1="0" y1="90" x2="300" y2="90" class="grid-line"/>
    
    <path d="M 0 160 L 0 20 L 30 20 L 30 160 L 90 160 L 90 20 L 120 20 L 120 160 L 180 160 L 180 20 L 210 20 L 210 160 L 270 160 L 270 20 L 300 20" class="pwm-line"/>
    <path d="M 0 160 L 0 20 L 30 20 L 30 160 L 90 160 L 90 20 L 120 20 L 120 160 L 180 160 L 180 20 L 210 20 L 210 160 L 270 160 L 270 20 L 300 20" class="pwm-line pwm-flow" opacity="0.8"/>
    
    <line x1="0" y1="90" x2="300" y2="90" class="avg-line-styled"/>
    <text x="150" y="80" fill="#dc2626" font-size="11" font-weight="bold" text-anchor="middle">แรงดันไฟฟ้าเฉลี่ย (V_avg ≈ 1.65V)</text>
  </g>
  <text x="200" y="260" class="text-sub" text-anchor="middle">สัญญาณดิจิทัลแท้สลับเปิด/ปิดอย่างรวดเร็ว</text>
  <text x="200" y="278" class="text-sub" text-anchor="middle" fill="#2563eb">ใช้เวลาเปิด/ปิดจูนความเฉื่อยของอุปกรณ์ภายนอก</text>

  <rect x="400" y="25" width="360" height="280" class="panel"/>
  <text x="580" y="50" class="text-main" text-anchor="middle">2. สัญญาณ DAC (Digital-to-Analog Converter)</text>
  
  <g transform="translate(430, 70)">
    <line x1="0" y1="160" x2="300" y2="160" class="grid-axis"/>
    <line x1="0" y1="20" x2="0" y2="160" class="grid-axis"/>
    <text x="-10" y="25" class="text-sub" text-anchor="end">3.3V</text>
    <text x="-10" y="165" class="text-sub" text-anchor="end">0V</text>
    <text x="290" y="180" class="text-sub" text-anchor="end">เวลา</text>
    
    <line x1="0" y1="20" x2="300" y2="20" class="grid-line"/>
    <line x1="0" y1="90" x2="300" y2="90" class="grid-line"/>
    
    <path id="dacWave" d="M 0 90 Q 75 10 150 90 T 300 90" class="dac-line"/>
    <path d="M 0 90 Q 75 10 150 90 T 300 90" class="dac-line dac-flow" opacity="0.8"/>
  </g>
  <text x="580" y="260" class="text-sub" text-anchor="middle">ระดับแรงดันแอนะล็อกแท้จริงมีความต่อเนื่อง</text>
  <text x="580" y="278" class="text-sub" text-anchor="middle" fill="#10b981">จ่ายกระแสแรงดันแปรผันตรง ๆ โดยไม่ต้องอาศัยพัลส์</text>

</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 5.4 เปรียบเทียบระหว่างคลื่นสัญญาณ PWM ที่สลับแบบดิจิทัลความถี่สูงเพื่อจำลองแรงดันเฉลี่ย กับสัญญาณจากโมดูล DAC ที่ผลิตแรงดันแอนะล็อกแท้ราบเรียบต่อเนื่องออกจากพิน</div>
</div>

#### 5.4.2 ข้อกำหนดของโมดูล DAC ภายใน ESP32
ชิป ESP32 (รุ่นดั้งเดิม) มีโมดูลแปลงสัญญาณดิจิทัลเป็นแอนะล็อก **ขนาด 8 บิต จำนวน 2 ช่องสัญญาณ** โดยมีพินเอาต์พุตคงที่ผูกติดอยู่กับฮาร์ดแวร์ดังนี้:
- **DAC ช่องที่ 1 (DAC Channel 1)**: จ่ายสัญญาณที่พิน **GPIO 25**
- **DAC ช่องที่ 2 (DAC Channel 2)**: จ่ายสัญญาณที่พิน **GPIO 26**

ความละเอียดของสัญญาณมีค่าเท่ากับ **8 บิต (8-bit)** หมายความว่าระดับเอาต์พุตไฟฟ้าสามารถเขียนสั่งค่าได้ตั้งแต่ **0 ถึง 255** (รวม 256 ขั้น) โดยที่:
- ค่าเขียนสั่ง = `0` จะให้แรงดันเอาต์พุตประมาณ **0 V**
- ค่าเขียนสั่ง = `255` จะให้แรงดันเอาต์พุตสูงสุดประมาณ **3.3 V** (แต่ปกติจะมีจุดอิ่มตัวปลายบนสุดตกอยู่ประมาณ 3.2V)
- การคำนวณเอาต์พุตเป็นแรงดันแอนะล็อกโดยประมาณ:
  $$V_{out} \approx \frac{DAC\_value}{255} \times V_{DD}$$

#### 5.4.3 ข้อจำกัดทางไฟฟ้าของ ESP32 DAC
โมดูล DAC ภายในมี **อิมพีแดนซ์เอาต์พุตสูง (High Output Impedance)** และมีกำลังส่งกระแสขับเคลื่อนจำกัดอย่างมาก หากเรานำขาเอาต์พุต DAC ไปเชื่อมต่อกับโหลดที่มีความต้านทานต่ำโดยตรง (เช่น ลำโพง 8 Ω หรือขดลวดมอเตอร์) ระดับแรงดันไฟฟ้าจะตกร่วงลงเกือบ 0V ทันทีและทำให้คลื่นเกิดการบิดเบี้ยวเสียหาย

ดังนั้น ในวงจรที่ต้องส่งสัญญาณไปขับแรงกระเพื่อมสูง ๆ จำเป็นต้องต่อเชื่อมผ่าน **บัฟเฟอร์ขยายกำลัง (Op-Amp Buffer / Unity Gain Amplifier)** หรือวงจรแอมพลิฟายเออร์ก่อนป้อนสัญญาณไปยังภายนอก

#### 5.4.4 ตัวอย่างโค้ด: การเขียนสร้างคลื่นไซน์และคลื่นแรมป์แอนะล็อก
ในระบบเขียนโปรแกรม ESP32 บน Arduino IDE สนับสนุนคำสั่งในการเขียนส่งแรงดันอย่างง่ายดายผ่านฟังก์ชัน `dacWrite(pin, value)` 

ตัวอย่างโปรแกรมด้านล่างสร้างตารางไซน์ล่วงหน้า (Sine Look-Up Table) เพื่อลดเวลาประมวลผลคำนวณคณิตศาสตร์ ณ เวลาจริง และทำการเปลี่ยนค่าเอาต์พุตอย่างเร็วเพื่อปล่อยคลื่นไซน์ความถี่สูง

```cpp
// โปรแกรมสร้างสัญญาณแอนะล็อกต่อเนื่องคลื่นไซน์ (Sine Wave) และคลื่นแรมป์ (Ramp) บน ESP32
#define DAC_PIN 25 // ใช้ขา GPIO 25 (DAC ช่องสัญญาณที่ 1)

const int SINE_STEPS = 100; // จำนวนตัวอย่างต่อ 1 คาบของคลื่นไซน์
uint8_t sineTable[SINE_STEPS];

void setup() {
  Serial.begin(115200);
  
  // คำนวณตารางค่าไซน์ล่วงหน้า (Look-Up Table) เพื่อรักษาประสิทธิภาพการทำงานใน loop
  for (int i = 0; i < SINE_STEPS; i++) {
    float angle = (i * 2.0 * PI) / SINE_STEPS;
    // เลื่อนคลื่นไซน์ให้อยู่แกนบวก (+1) และขยายขนาดผลลัพธ์ให้อยู่ในช่วง 0 - 255
    sineTable[i] = (uint8_t)((sin(angle) + 1.0) * 127.5);
  }
  
  Serial.println("--- DAC Sine Wave & Ramp Generator Started ---");
}

void loop() {
  // --- ตัวอย่างที่ 1: กำเนิดคลื่นไซน์ต่อเนื่อง (Sine Wave) ---
  for (int i = 0; i < SINE_STEPS; i++) {
    dacWrite(DAC_PIN, sineTable[i]); // ส่งแรงดันแอนะล็อกออกที่ขาพิน
    delayMicroseconds(30);           // ปรับแต่งหน่วงเวลาสั้น ๆ เพื่อจูนความถี่คลื่น
  }

  /* 
  // --- ตัวอย่างที่ 2: กำเนิดคลื่นฟันเลื่อย/คลื่นแรมป์ (Sawtooth/Ramp Wave) ---
  // (หากต้องการเปิดใช้คลื่นนี้ ให้นำวงเล็บคอมเมนต์ออก)
  for (int val = 0; val < 256; val++) {
    dacWrite(DAC_PIN, val);
    delayMicroseconds(20);
  }
  */
}
```

---

## 5.5 การปรับขนาดสัญญาณด้วย `map()` และการ Calibrate

### 5.5.1 ฟังก์ชัน map()

ฟังก์ชัน `map()` ช่วย **แปลงค่าจากช่วงหนึ่งไปอีกช่วงหนึ่ง** แบบเชิงเส้น (Linear):

```
output = map(value, fromLow, fromHigh, toLow, toHigh);
```

ตัวอย่างการใช้งาน:

```
int adcVal = analogRead(34);              // 0–4095
int pwmVal = map(adcVal, 0, 4095, 0, 255); // แปลงเป็น 0–255 สำหรับ PWM 8-bit
```

### 5.5.2 การ Calibrate เซ็นเซอร์

เซ็นเซอร์จริงไม่ได้ให้ค่า 0 ที่จุดต่ำสุดหรือ 4095 ที่จุดสูงสุดเสมอไป ควร **สอบเทียบ (Calibrate)** ก่อนใช้งาน:

1. วัดค่า ADC ที่สภาวะต่ำสุด → เก็บเป็น `sensorMin`
2. วัดค่า ADC ที่สภาวะสูงสุด → เก็บเป็น `sensorMax`
3. ใช้ `map(adcVal, sensorMin, sensorMax, 0, 255)` เพื่อให้ครอบคลุมช่วงจริง
4. ใช้ `constrain(result, 0, 255)` เพื่อป้องกันค่าเกินขอบเขต

> 💡 **ทำไมต้อง constrain?** เพราะ `map()` ไม่ได้จำกัดค่าผลลัพธ์ให้อยู่ในช่วง ถ้าค่าอินพุตเกินช่วง `fromLow–fromHigh` ผลลัพธ์ก็จะเกินช่วง `toLow–toHigh` ตามไปด้วย

---

## 5.6 ตัวอย่างรวม: อ่าน LDR ปรับความสว่าง LED อัตโนมัติ

โจทย์: ใช้ **LDR (Light Dependent Resistor)** ตรวจวัดแสง แล้วปรับความสว่าง LED ให้ **สว่างขึ้นเมื่อแสงน้อย** และ **หรี่ลงเมื่อแสงมาก** (เหมือนไฟถนนอัตโนมัติ)

### วงจรบน Wokwi

- LDR + ตัวต้านทาน 10 kΩ ต่อแบบ Voltage Divider ที่ขา **GPIO 34**
- LED ต่อผ่านตัวต้านทาน 220 Ω ที่ขา **GPIO 16**

### โค้ดเต็ม

```cpp
// ระบบปรับแสง LED อัตโนมัติตามแสงแวดล้อม
// Wokwi: ESP32 + LDR (voltage divider) + LED

const int LDR_PIN = 34;   // ขา ADC สำหรับ LDR
const int LED_PIN = 16;   // ขา PWM สำหรับ LED

// ค่า Calibration (ปรับตามเซ็นเซอร์จริง)
const int LDR_MIN = 200;   // ค่า ADC เมื่อมืดสนิท
const int LDR_MAX = 3800;  // ค่า ADC เมื่อสว่างจ้า

const int PWM_FREQ = 5000;
const int PWM_RES  = 8;    // 0–255

void setup() {
  Serial.begin(115200);
  ledcAttach(LED_PIN, PWM_FREQ, PWM_RES);
  Serial.println("=== Auto Light System ===");
}

void loop() {
  int ldrValue = analogRead(LDR_PIN);

  // แปลงค่า LDR → ค่า PWM (กลับด้าน: แสงน้อย = LED สว่างมาก)
  int brightness = map(ldrValue, LDR_MIN, LDR_MAX, 255, 0);
  brightness = constrain(brightness, 0, 255);  // จำกัดขอบเขต

  ledcWrite(LED_PIN, brightness);

  // แปลงค่า ADC เป็นแรงดันเพื่อแสดงผล
  float voltage = (ldrValue / 4095.0) * 3.3;

  Serial.print("LDR ADC: ");
  Serial.print(ldrValue);
  Serial.print("  |  V: ");
  Serial.print(voltage, 2);
  Serial.print(" V  |  LED Brightness: ");
  Serial.print(brightness);
  Serial.print("/255 (");
  Serial.print((brightness * 100) / 255);
  Serial.println("%)");

  delay(200);
}
```

**อธิบายการทำงาน:**

1. `analogRead()` อ่านค่าแรงดันจาก LDR ผ่าน ADC 12-bit
2. `map()` แปลงค่าจากช่วง calibrate ไปเป็น 0–255 แบบ **กลับด้าน** (ค่า ADC สูง = แสงมาก → LED หรี่)
3. `constrain()` ป้องกันค่าหลุดขอบเขต
4. `ledcWrite()` ส่งสัญญาณ PWM ไปที่ LED

> 💡 **ลองเอง:** ใน Wokwi ให้คลิกที่ตัว LDR แล้วเลื่อนแถบ slider เพื่อจำลองแสงน้อย/มาก จะเห็น LED เปลี่ยนความสว่างตามแบบเรียลไทม์

---

## 5.7 สรุปประจำบท

| หัวข้อ | ฟังก์ชันหลัก | ข้อควรจำ |
|---|---|---|
| **Digital Input** | `digitalRead()` + `INPUT_PULLUP` | ระวังสัญญาณ Floating, กดปุ่ม = LOW เมื่อใช้ pull-up |
| **Digital Output** | `digitalWrite()` | HIGH = 3.3 V, LOW = 0 V |
| **GPIO Interrupt** | `attachInterrupt()` | ใช้ขัดจังหวะทันที, ฟังก์ชัน ISR ต้องสั้นมากและใช้ `IRAM_ATTR`, ตัวแปรใช้ `volatile` |
| **Software Debounce** | การกรองทางเวลาด้วย `millis()` | หน้าสัมผัสปุ่มเชิงกลจะกระเด้งสะท้อน, ต้องมีระยะเวลาดีเลย์ล็อคช่วงกด |
| **ADC (อ่านอนาล็อก)** | `analogRead()` | ESP32 = 12-bit (0–4095), ระวังปัญหาแรงดันตายและอิ่มตัวปลายช่วง (Non-linearity) |
| **ADC Calibration** | `esp_adc_cal_raw_to_voltage()` | ดึงแรงดันอ้างอิงรายชิปตัวจริงจาก eFuse เพื่อสอบเทียบแรงดัน |
| **PWM (เลียนแบบอนาล็อก)**| `ledcAttach()` + `ledcWrite()` | สลับสับดิจิทัลอย่างเร็ว, กำหนดระดับความละเอียด (Resolution) และความถี่ล่วงหน้า |
| **DAC (อนาล็อกแท้)** | `dacWrite()` | ปล่อยแรงดันแอนะล็อกคงที่แท้จริงที่ขา GPIO 25 และ 26 (ความละเอียด 8 บิต: 0-255), มีอิมพีแดนซ์สูง |
| **การปรับขนาดสัญญาณ** | `map()` + `constrain()` | ป้องกันค่าล้นช่วงขอบเขตข้อมูล และสอบเทียบเซ็นเซอร์จริง |

**หลักคิดสำคัญ:** ไมโครคอนโทรลเลอร์ประมวลผลด้วยระบบลอจิกดิจิทัล (0 และ 1) แต่ปรากฏการณ์ธรรมชาติของโลกจริงมีค่าต่อเนื่องแบบแอนะล็อก — โมดูล **ADC** จึงเสมือน "โสตประสาทรับฟัง" และแปลงข้อมูลภายนอก ส่วน **PWM/DAC** เปรียบเป็น "กระบอกเสียงตอบโต้" สู่โลกภายนอก

---

## 5.8 แบบฝึกหัดท้ายบท

**ข้อ 1:** จงอธิบายว่าปัญหา "สัญญาณลอย (Floating)" คืออะไร เกิดขึ้นเมื่อใด และแก้ไขได้อย่างไร

**ข้อ 2:** ESP32 มี ADC ความละเอียด 12 บิต ถ้าอ่านค่าได้ 3072 จงคำนวณแรงดันจริง (V) ที่ขา ADC วัดได้ (แสดงวิธีทำ)

**ข้อ 3:** สัญญาณ PWM ที่มี duty cycle 75% หมายความว่าอย่างไร? ถ้าใช้ resolution 8 บิต ค่า duty ที่ต้องใส่ใน `ledcWrite()` เท่ากับเท่าไร?

**ข้อ 4:** จงเขียนโค้ดบน ESP32 ที่อ่านค่า Potentiometer จากขา GPIO 34 แล้วแสดงค่าแรงดัน (V) ทาง Serial Monitor ทุก 1 วินาที

**ข้อ 5:** ฟังก์ชัน `map(1500, 0, 4095, 0, 255)` จะได้ผลลัพธ์ประมาณเท่าไร? จงคำนวณ

**ข้อ 6:** เมื่อใช้ `INPUT_PULLUP` กับปุ่มกด เหตุใดเมื่อกดปุ่มจึงอ่านได้ค่า LOW แทนที่จะเป็น HIGH? จงอธิบายพร้อมวาดแผนภาพวงจรอย่างง่าย

**ข้อ 7 (ประยุกต์):** จงเขียนโค้ดระบบพัดลมอัตโนมัติ โดยใช้เซ็นเซอร์อุณหภูมิ (NTC Thermistor) ต่อที่ขา GPIO 35 อ่านค่า ADC แล้วแปลงเป็นอุณหภูมิ จากนั้นควบคุมความเร็วพัดลม (จำลองด้วย LED PWM ที่ขา GPIO 25): อุณหภูมิต่ำ = พัดลมหมุนช้า, อุณหภูมิสูง = พัดลมหมุนเร็ว

**ข้อ 8 (ท้าทาย):** ระบบ Smart Street Light: ใช้ LDR ตรวจแสง + ปุ่มกด Manual Override — ถ้ากดปุ่ม ให้บังคับ LED สว่าง 100% โดยไม่สนแสงแวดล้อม ถ้าปล่อยปุ่ม ให้กลับมาปรับอัตโนมัติตามค่า LDR จงเขียนโค้ดเต็มพร้อมระบุขาที่ใช้

**ข้อ 9:** จงอธิบายปัญหาความไม่เป็นเชิงเส้น (Non-linearity) ของ ADC บน ESP32 พร้อมยกตัวอย่างช่วงแรงดันที่เรียกว่า "Dead Zone" และอธิบายว่าทำไมการดึงค่าแรงดันอ้างอิงจาก eFuse ด้วยไลบรารี `esp_adc_cal` จึงให้ความแม่นยำสูงกว่าการแปลงค่าแอนะล็อกแบบดั้งเดิม

**ข้อ 10:** หากเรานำ DAC ของ ESP32 ไปสร้างสัญญาณแอนะล็อกแท้ (เช่น คลื่นไซน์) และต้องการให้เอาต์พุตมีแรงดันสูงสุด 2.5 V และต่ำสุด 0.5 V จงคำนวณหาช่วงค่าตัวเลขดิจิทัล (0–255) ที่ต้องเขียนลงในฟังก์ชัน `dacWrite()` ในแต่ละช่วง (โดยอนุมานว่าแรงดันตกคร่อม 0-3.3V ตอบสนองเป็นเส้นตรงเชิงอุดมคติ)

**ข้อ 11:** ปัญหาสัญญาณสะท้อนเชิงกล (Contact Bounce / Debounce) ในปุ่มกดเกิดขึ้นจากอะไร และเหตุใดการแก้ไขด้วยคำสั่ง `delay()` ในฟังก์ชันบริการอินเทอร์รัปต์ (ISR) จึงเป็นแนวทางที่ผิดหลักการ จงอธิบายพร้อมเสนอวิธีการแก้ปัญหา Debounce ด้วยซอฟต์แวร์โดยใช้ฐานเวลา (`millis()`)
