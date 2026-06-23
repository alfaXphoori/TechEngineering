# Chapter 3: ตัวกระทำและการเชื่อมต่อ (Actuators & Interfacing)
## Actuators & Interfacing

---

### ภาพรวม: สถาปัตยกรรม IoT 4 ชั้น

บทนี้เชื่อมโยงกับชั้น Perception Layer ในส่วนของตัวกระทำ ซึ่งรับคำสั่งควบคุมย้อนกลับจากระบบ IoT เพื่อสร้างผลลัพธ์ในโลกจริง

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
  <text x="380" y="432" class="footer-text" text-anchor="middle">แผนภาพที่ 3.1 สถาปัตยกรรม IoT 4 ชั้น แสดงการไหลของข้อมูลสองทิศทาง (Bi-directional Data Flow)</text>
</svg>
</div>

---

### 3.1 ตัวกระทำคืออะไร (What is an Actuator?)

ในระบบ IoT เราแบ่งอุปกรณ์ปลายทางออกเป็น 2 กลุ่มหลัก:

- **ตัวรับรู้ (Sensor)** — แปลงปรากฏการณ์ทางกายภาพ → สัญญาณไฟฟ้า (อ่านค่า)
- **ตัวกระทำ (Actuator)** — แปลงสัญญาณไฟฟ้า → การกระทำทางกายภาพ (สั่งงาน)

ตัวกระทำคืออุปกรณ์ที่รับคำสั่งจากไมโครคอนโทรลเลอร์ (MCU) แล้ว **"ทำ"** บางอย่างในโลกจริง เช่น หมุนมอเตอร์, เปิด-ปิดวาล์ว, ส่งเสียง หรือให้แสงสว่าง

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 220" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>การส่งสัญญาณควบคุมจาก MCU ไปยังตัวกระทำและโลกจริง</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .mcu-box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2.5; rx: 8px; }
    .act-box { fill: #ddebf7; stroke: #2f5597; stroke-width: 2.5; rx: 8px; }
    .world-box { fill: #fce4d6; stroke: #c55a11; stroke-width: 2.5; rx: 8px; }
    .wire { fill: none; stroke: #334155; stroke-width: 3; stroke-linecap: round; }
    .signal-flow { fill: none; stroke: #a78bfa; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: flow 2s linear infinite; }
    .output-flow { fill: none; stroke: #f97316; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: flow 1.5s linear infinite; }
    .propeller { fill: #475569; transform-origin: 410px 95px; animation: spin 1s linear infinite; }
    .led-glow { fill: #22c55e; animation: blink 1s ease-in-out infinite alternate; }
    .wind-line { fill: none; stroke: #ea580c; stroke-width: 2; stroke-linecap: round; animation: wind 1.5s linear infinite; }
    .text-title { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .text-label { font-size: 12px; fill: #64748b; font-weight: 500; }
    .text-code { font-size: 11px; font-family: monospace; font-weight: 700; fill: #475569; }
    @keyframes flow {
      to { stroke-dashoffset: -36; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes blink {
      0% { opacity: 0.3; }
      100% { opacity: 1; }
    }
    @keyframes wind {
      0% { stroke-dasharray: 0 40; stroke-dashoffset: 0; opacity: 0; }
      50% { stroke-dasharray: 20 20; stroke-dashoffset: -10; opacity: 1; }
      100% { stroke-dasharray: 0 40; stroke-dashoffset: -40; opacity: 0; }
    }
  </style>
  <rect x="5" y="5" width="750" height="210" class="bg"/>
  
  <!-- Connections -->
  <line x1="195" y1="105" x2="335" y2="105" class="wire"/>
  <path d="M 195 105 L 335 105" class="signal-flow"/>
  <polygon points="335,100 345,105 335,110" fill="#7c3aed"/>
  
  <line x1="485" y1="105" x2="585" y2="105" class="wire"/>
  <path d="M 485 105 L 585 105" class="output-flow"/>
  <polygon points="585,100 595,105 585,110" fill="#c55a11"/>

  <!-- ESP32 MCU Box -->
  <rect x="45" y="50" width="150" height="110" class="mcu-box"/>
  <text x="120" y="80" class="text-title" text-anchor="middle">ESP32 (MCU)</text>
  <text x="120" y="105" class="text-label" text-anchor="middle">ประมวลผลคำสั่ง</text>
  <text x="120" y="125" class="text-code" text-anchor="middle">digitalWrite()</text>
  <text x="120" y="142" class="text-code" text-anchor="middle">analogWrite()</text>
  <circle cx="65" cy="76" r="5" class="led-glow"/>
  
  <!-- Actuator Box -->
  <rect x="335" y="50" width="150" height="110" class="act-box"/>
  <text x="410" y="75" class="text-title" text-anchor="middle">Actuator</text>
  <text x="410" y="140" class="text-label" text-anchor="middle">ตัวขับเคลื่อน / มอเตอร์</text>
  
  <!-- Motor Visual -->
  <circle cx="410" cy="95" r="14" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
  <circle cx="410" cy="95" r="4" fill="#334155"/>
  <!-- Propeller -->
  <path d="M 410 95 L 390 85 C 385 82, 385 75, 390 75 C 395 75, 405 85, 410 95 Z" class="propeller"/>
  <path d="M 410 95 L 430 105 C 435 108, 435 115, 430 115 C 425 115, 415 105, 410 95 Z" class="propeller"/>
  <path d="M 410 95 L 420 75 C 423 70, 430 70, 430 75 C 430 80, 420 90, 410 95 Z" class="propeller"/>
  <path d="M 410 95 L 400 115 C 397 120, 390 120, 390 115 C 390 110, 400 100, 410 95 Z" class="propeller"/>

  <!-- Real World Box -->
  <rect x="585" y="50" width="130" height="110" class="world-box"/>
  <text x="650" y="80" class="text-title" text-anchor="middle">โลกกายภาพ</text>
  <text x="650" y="105" class="text-label" text-anchor="middle">การเปลี่ยนแปลงจริง</text>
  <text x="650" y="130" class="text-label" text-anchor="middle">(หมุน, ลมพัด, สว่าง)</text>
  
  <!-- Wind animation in World Box -->
  <path d="M 605 140 Q 620 135 635 140 T 665 140" class="wind-line"/>
  <path d="M 610 148 Q 625 143 640 148 T 670 148" class="wind-line"/>

  <!-- Flow Labels -->
  <text x="265" y="90" class="text-title" fill="#7c3aed" text-anchor="middle">สัญญาณดิจิทัล / PWM</text>
  <text x="535" y="90" class="text-title" fill="#c55a11" text-anchor="middle">การกระทำทางกายภาพ</text>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 3.1 แผนผังแสดงการเปลี่ยนสัญญาณไฟฟ้าขนาดเล็กจากไมโครคอนโทรลเลอร์เป็นการกระทำทางกายภาพในโลกจริงผ่านตัวกระทำ (Actuator)</div>
</div>

ในบทนี้เราจะเรียนรู้ประเภทของตัวกระทำ ฟิสิกส์พื้นฐานของมอเตอร์ไฟฟ้า วงจรขับ (Driver Circuit) พร้อมการคำนวณค่าอุปกรณ์ หลักการป้องกันวงจร การควบคุมด้วย PWM ตลอดจนเจาะลึกเซอร์โวและสเต็ปเปอร์มอเตอร์ การประเมินกำลัง/ความร้อน และปิดท้ายด้วยตัวอย่างการออกแบบระบบจริง ซึ่งเป็นพื้นฐานสำคัญก่อนนำไปใช้ในโปรเจกต์ IoT จริง

---

### 3.2 ประเภทของตัวกระทำ (Types of Actuators)

#### 3.2.1 ภาพรวม

| ตัวกระทำ | หลักการทำงาน | ตัวอย่างการใช้งานทางวิศวกรรม | สัญญาณควบคุม |
|---|---|---|---|
| LED | ไฟฟ้า → แสง (Electroluminescence) | ไฟแสดงสถานะเครื่องจักร, ไฟเตือน | Digital / PWM |
| บัซเซอร์ (Buzzer) | ไฟฟ้า → เสียง (Piezoelectric / Electromagnetic) | เสียงเตือนอุณหภูมิเกิน, แจ้งเตือน | Digital / PWM |
| รีเลย์ (Relay) | ขดลวดสร้างแม่เหล็ก → สลับหน้าสัมผัส | เปิด-ปิดปั๊มน้ำ, คอมเพรสเซอร์ | Digital |
| มอเตอร์ DC (DC Motor) | กระแสผ่านขดลวดในสนามแม่เหล็ก → หมุน | พัดลมระบายความร้อน, สายพานลำเลียง | PWM + ทิศทาง |
| เซอร์โวมอเตอร์ (Servo) | มอเตอร์ DC + เฟืองทด + วงจรควบคุมตำแหน่ง | แขนหุ่นยนต์, วาล์วควบคุม | PWM (50 Hz) |
| สเต็ปเปอร์มอเตอร์ (Stepper) | ขดลวดหลายเฟสสลับกระตุ้น → หมุนทีละสเต็ป | เครื่อง CNC, เครื่องพิมพ์ 3D | Pulse + Direction |
| โซลินอยด์ (Solenoid) | ขดลวดสร้างแม่เหล็ก → ดึง/ดันแกน | ล็อกประตู, วาล์วน้ำ/ลม | Digital |

#### 3.2.2 รายละเอียดแต่ละชนิด

**LED และบัซเซอร์** — โหลดเบา สามารถขับจาก GPIO ของ ESP32 ได้โดยตรง (กระแส ≤ 12 mA ต่อขา) เหมาะสำหรับฝึกพื้นฐาน

**รีเลย์ (Relay)** — ทำหน้าที่เป็น "สวิตช์ไฟฟ้า" ที่ควบคุมด้วย MCU ใช้แรงดันต่ำ (3.3–5 V) สั่งสลับวงจรแรงดันสูง (เช่น 220 VAC) ได้ โมดูลรีเลย์สำเร็จรูปมักมีออปโตคัปเปลอร์และทรานซิสเตอร์ขับในตัว

**มอเตอร์ DC** — หมุนเร็ว ควบคุมความเร็วด้วย PWM ควบคุมทิศทางด้วยวงจร H-Bridge

**เซอร์โว (Servo)** — ควบคุม "มุม" ได้แม่นยำ (ปกติ 0°–180°) โดยส่งสัญญาณ PWM ความถี่ 50 Hz ความกว้างพัลส์ 1–2 ms

**สเต็ปเปอร์ (Stepper)** — หมุนทีละ "สเต็ป" (เช่น 1.8° ต่อสเต็ป = 200 สเต็ปต่อรอบ) แม่นยำมาก เหมาะกับงานที่ต้องการควบคุมตำแหน่งแบบวงเปิด (Open-loop)

**โซลินอยด์ (Solenoid)** — เคลื่อนที่เชิงเส้น (ดัน/ดึง) ใช้งานแบบ ON/OFF

#### 3.2.3 หลักการทางฟิสิกส์ของมอเตอร์ไฟฟ้ากระแสตรง (DC Motor Physics)

มอเตอร์เป็นตัวกระทำที่พบบ่อยที่สุดในงานวิศวกรรมเครื่องกล การเข้าใจสมการพื้นฐานช่วยให้เลือกมอเตอร์และออกแบบวงจรขับได้ถูกต้อง

**1) แรงและแรงบิดจากสนามแม่เหล็ก** — เมื่อกระแส $I$ ไหลผ่านขดลวดความยาว $L$ ที่วางอยู่ในสนามแม่เหล็ก $B$ จะเกิดแรงตามกฎของลอเรนซ์ (Lorentz Force):

$$F = B \, I \, L$$

แรงนี้กระทำต่อขดลวดที่ระยะ (รัศมี) จากแกนหมุน ทำให้เกิด **แรงบิด (Torque, $\tau$)** ซึ่งแปรผันตรงกับกระแส:

$$\tau = k_t \, I$$

โดย $k_t$ คือ **ค่าคงที่แรงบิด (Torque Constant)** หน่วย $\text{N·m/A}$ นั่นหมายความว่า **ยิ่งจ่ายกระแสมาก แรงบิดยิ่งสูง** ซึ่งเป็นเหตุผลว่าทำไมมอเตอร์ที่ต้องออกแรงมาก (เช่น ตอนสตาร์ทหรือมีภาระหนัก) จึงดึงกระแสสูง

**2) แรงเคลื่อนไฟฟ้าย้อนกลับ (Back-EMF)** — เมื่อมอเตอร์หมุน ขดลวดที่เคลื่อนที่ในสนามแม่เหล็กจะสร้างแรงดันต้านขึ้นมาเอง เรียกว่า Back-EMF ($E$) ซึ่งแปรผันตรงกับความเร็วเชิงมุม $\omega$:

$$E = k_e \, \omega$$

โดย $k_e$ คือ **ค่าคงที่แรงดัน (Back-EMF Constant)** หน่วย $\text{V·s/rad}$ (ในระบบ SI ค่า $k_t$ และ $k_e$ มีค่าเท่ากันในเชิงตัวเลข)

**3) สมการวงจรของมอเตอร์** — เมื่อรวมความต้านทานขดลวด $R_m$ จะได้สมการสมดุลแรงดัน:

$$V = I R_m + E = I R_m + k_e \, \omega$$

จัดรูปเพื่อหาความเร็วรอบ:

$$\omega = \frac{V - I R_m}{k_e}$$

จากสมการนี้ได้ข้อสรุปเชิงวิศวกรรมที่สำคัญ:

- **ขณะสตาร์ท (Stall):** $\omega = 0 \Rightarrow E = 0$ กระแสจึงพุ่งสูงสุด $I_{stall} = V / R_m$ (กระแสสตาร์ทอาจสูงกว่ากระแสปกติ 5–10 เท่า → วงจรขับต้องทนกระแสพีคได้)
- **ขณะไม่มีภาระ (No-load):** มอเตอร์หมุนเร็วจน $E \approx V$ กระแสจึงต่ำมาก
- **ควบคุมความเร็วด้วยแรงดัน:** ลดแรงดันเฉลี่ยที่ป้อน (ผ่าน PWM) → ความเร็วลดลง

**4) กำลังและประสิทธิภาพ** — กำลังไฟฟ้าที่ป้อนเข้า ($P_{in}$) และกำลังกลที่ได้ ($P_{mech}$):

$$P_{in} = V I \qquad P_{mech} = \tau \, \omega$$

ส่วนต่างคือกำลังที่สูญเสียเป็นความร้อนในขดลวด ($I^2 R_m$) ประสิทธิภาพ $\eta = P_{mech} / P_{in}$

> 💡 **เชื่อมโยงสู่การออกแบบ:** สมการ $\tau = k_t I$ และ $I_{stall} = V/R_m$ อธิบายว่าทำไมเราต้องเผื่อกระแสพีคของมอเตอร์เสมอ ตัวอย่างเช่น มอเตอร์ที่ระบุกระแสใช้งาน 500 mA อาจดึงกระแสตอนสตาร์ทถึง 2–3 A ชั่วขณะ หากเลือกไดรเวอร์ที่ทนเพียง 600 mA ไดรเวอร์จะร้อนจัดหรือพังได้

---

### 3.3 การขับโหลด (Driving Loads)

#### 3.3.1 ทำไม MCU ขับโหลดใหญ่โดยตรงไม่ได้?

GPIO ของ ESP32 จ่ายกระแสได้สูงสุดเพียง **~12 mA ต่อขา** (และรวมทั้งชิปไม่ควรเกิน ~40 mA) ซึ่ง:

- LED ทั่วไปใช้ ~10–20 mA → พอได้ (แต่ไม่ควรต่อหลายตัว)
- รีเลย์ใช้ ~70–100 mA → **ไม่พอ** → ต้องมีวงจรขับ
- มอเตอร์ DC เล็กใช้ ~200–500 mA → **ไม่พอเลย**
- โซลินอยด์ใช้ ~300 mA–1 A → **อันตราย** ถ้าต่อตรง

> 💡 **ข้อควรระวังเรื่องกระแส:** การต่อโหลดที่กินกระแสเกินพิกัดเข้ากับ GPIO โดยตรงจะทำให้ชิป ESP32 เสียหายถาวร ทุกครั้งที่เลือกตัวกระทำ ให้ตรวจสอบกระแสที่โหลดต้องการก่อน หากเกิน 10 mA ให้ใช้วงจรขับเสมอ

#### 3.3.2 วงจรขับด้วยทรานซิสเตอร์ / MOSFET

**ทรานซิสเตอร์ NPN (เช่น 2N2222)** — ใช้ GPIO สั่ง Base ผ่านตัวต้านทาน (1–10 kΩ) ทรานซิสเตอร์ทำหน้าที่เป็นสวิตช์ให้กระแสไหลจากแหล่งจ่ายภายนอกผ่านโหลดลง GND

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>วงจรขับโหลดด้วยทรานซิสเตอร์ NPN</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .mcu { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .base-current { fill: none; stroke: #10b981; stroke-width: 3; stroke-dasharray: 6 8; stroke-linecap: round; animation: marchBase 1.5s linear infinite, glowBase 6s ease-in-out infinite; }
    .load-current { fill: none; stroke: #ef4444; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: marchLoad 1.2s linear infinite, glowLoad 6s ease-in-out infinite; }
    .transistor-body { fill: #ffffff; stroke: #334155; stroke-width: 2.5; }
    .load-box { fill: #ffffff; stroke: #334155; stroke-width: 2.5; rx: 6px; animation: loadActive 6s ease-in-out infinite; }
    .text-main { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 12px; fill: #64748b; }
    .text-code { font-size: 12px; font-family: monospace; font-weight: 700; }
    .state-high { animation: glowBase 6s ease-in-out infinite; }
    .state-low { animation: glowBase 6s ease-in-out infinite reverse; }
    
    @keyframes marchBase {
      to { stroke-dashoffset: -28; }
    }
    @keyframes marchLoad {
      to { stroke-dashoffset: -36; }
    }
    @keyframes glowBase {
      0%, 42%, 100% { opacity: 0; }
      50%, 92% { opacity: 1; }
    }
    @keyframes loadActive {
      0%, 42%, 100% { fill: #ffffff; stroke: #334155; }
      50%, 92% { fill: #fee2e2; stroke: #dc2626; filter: drop-shadow(0 0 4px rgba(220, 38, 38, 0.15)); }
    }
  </style>
  <rect x="5" y="5" width="750" height="310" class="bg"/>
  
  <text x="380" y="32" class="text-main" text-anchor="middle">การทำงานของทรานซิสเตอร์ NPN ในฐานะสวิตช์ไฟฟ้า (Electronic Switch)</text>
  
  <!-- Wires -->
  <!-- Base Circuit Wire -->
  <path d="M 120 190 L 362 190" class="wire"/>
  <!-- Collector/Load Wire -->
  <path d="M 380 50 L 380 190" class="wire"/>
  <!-- Emitter/GND Wire -->
  <path d="M 380 190 L 380 270" class="wire"/>
  
  <!-- Animated Currents -->
  <path d="M 120 190 L 362 190 M 366 198 L 380 230 L 380 270" class="base-current"/>
  <path d="M 380 50 L 380 162 L 366 182 M 366 198 L 380 230 L 380 270" class="load-current"/>
  
  <!-- ESP32 Pin representation -->
  <rect x="25" y="150" width="95" height="80" class="mcu"/>
  <text x="72.5" y="178" class="text-main" fill="#7c3aed" text-anchor="middle">ESP32 GPIO</text>
  <g class="state-low">
    <text x="72.5" y="205" class="text-code" fill="#64748b" text-anchor="middle">0V (LOW)</text>
  </g>
  <g class="state-high">
    <text x="72.5" y="205" class="text-code" fill="#10b981" text-anchor="middle">3.3V (HIGH)</text>
  </g>

  <!-- Base Resistor R1 -->
  <rect x="180" y="170" width="70" height="40" fill="#ffffff" stroke="#334155" stroke-width="2" rx="4"/>
  <!-- Resistor bands (1k ohm: Brown, Black, Red) -->
  <rect x="192" y="170" width="6" height="40" fill="#78350f"/>
  <rect x="208" y="170" width="6" height="40" fill="#000000"/>
  <rect x="224" y="170" width="6" height="40" fill="#dc2626"/>
  <text x="215" y="155" class="text-main" text-anchor="middle">R_Base (1 kΩ)</text>
  <text x="215" y="230" class="text-sub" text-anchor="middle">จำกัดกระแส Base</text>

  <!-- Transistor NPN Symbol -->
  <g transform="translate(0,0)">
    <circle cx="380" cy="190" r="28" class="transistor-body"/>
    <line x1="362" y1="172" x2="362" y2="208" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="330" y1="190" x2="362" y2="190" stroke="#334155" stroke-width="2.5"/>
    <line x1="380" y1="150" x2="366" y2="182" stroke="#334155" stroke-width="2.5"/>
    <line x1="366" y1="198" x2="380" y2="230" stroke="#334155" stroke-width="2.5"/>
    <polygon points="374,222 382,232 382,220" fill="#334155"/>
  </g>
  <text x="420" y="185" class="text-main">NPN Transistor</text>
  <text x="420" y="202" class="text-code" fill="#4b5563">(e.g., 2N2222)</text>
  <text x="345" y="182" class="text-code" fill="#475569">B</text>
  <text x="388" y="145" class="text-code" fill="#475569">C</text>
  <text x="388" y="245" class="text-code" fill="#475569">E</text>

  <!-- Load (e.g., Motor/Relay) -->
  <rect x="330" y="70" width="100" height="50" class="load-box"/>
  <text x="380" y="93" class="text-main" text-anchor="middle">โหลดภายนอก</text>
  <text x="380" y="110" class="text-sub" text-anchor="middle">(มอเตอร์ / รีเลย์)</text>

  <!-- V_ext Source -->
  <text x="380" y="45" fill="#dc2626" font-size="13" font-weight="700" text-anchor="middle">V_ext (+12V)</text>
  
  <!-- Ground (GND) -->
  <line x1="360" y1="270" x2="400" y2="270" class="wire"/>
  <line x1="368" y1="276" x2="392" y2="276" class="wire"/>
  <line x1="376" y1="282" x2="384" y2="282" class="wire"/>
  <text x="380" y="298" class="text-sub" text-anchor="middle">GND</text>

  <!-- State Labels on the right side -->
  <g class="state-low">
    <rect x="510" y="110" width="210" height="110" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="615" y="138" class="text-main" fill="#475569" text-anchor="middle">สถานะ: คัทออฟ (Cut-off)</text>
    <text x="615" y="162" class="text-sub" text-anchor="middle">ไม่มีกระแสไหลเข้าขา B</text>
    <text x="615" y="182" class="text-sub" text-anchor="middle">ทำให้ไม่มีกระแส C-E (สวิตช์ปิด)</text>
    <text x="615" y="202" class="text-code" fill="#dc2626" text-anchor="middle">โหลดไม่ทำงาน (OFF)</text>
  </g>
  <g class="state-high">
    <rect x="510" y="110" width="210" height="110" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
    <text x="615" y="138" class="text-main" fill="#047857" text-anchor="middle">สถานะ: อิ่มตัว (Saturation)</text>
    <text x="615" y="162" class="text-sub" fill="#047857" text-anchor="middle">มีกระแส Base กระตุ้น</text>
    <text x="615" y="182" class="text-sub" fill="#047857" text-anchor="middle">เปิดช่อง C-E ให้นำกระแสได้</text>
    <text x="615" y="202" class="text-code" fill="#10b981" text-anchor="middle">โหลดทำงาน (ON)</text>
  </g>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 3.2 วงจรทรานซิสเตอร์ NPN ทำงานเสมือนสวิตช์เปิด-ปิดโหลดไฟฟ้ากระแสสูงด้วยกระแสควบคุมขนาดเล็กจากขา GPIO</div>
</div>

**การคำนวณค่าตัวต้านทาน Base ($R_B$):** เพื่อให้ทรานซิสเตอร์ทำงานในสภาวะ "อิ่มตัว (Saturation)" คือเป็นสวิตช์ที่นำกระแสเต็มที่ ต้องป้อนกระแส Base ให้เพียงพอ ขั้นตอนคำนวณมีดังนี้

1. หากระแส Base ขั้นต่ำจากอัตราขยาย $\beta$ (hFE) ของทรานซิสเตอร์: $I_{B(min)} = I_C / \beta$
2. เผื่อค่าความปลอดภัย (Overdrive factor) ประมาณ 2–5 เท่า เพื่อให้อิ่มตัวแน่นอน: $I_B = k_{od} \cdot I_{B(min)}$
3. หาค่าตัวต้านทานจากแรงดันที่เหลือ (GPIO 3.3 V ลบแรงดันตกคร่อม Base-Emitter $V_{BE} \approx 0.7\text{ V}$):

$$R_B = \frac{V_{GPIO} - V_{BE}}{I_B}$$

**ตัวอย่าง:** ขับรีเลย์ที่กินกระแส $I_C = 100\text{ mA}$ ด้วยทรานซิสเตอร์ที่มี $\beta = 100$ และเผื่อ overdrive 3 เท่า:

$$I_{B(min)} = \frac{100\text{ mA}}{100} = 1\text{ mA} \;\Rightarrow\; I_B = 3 \times 1 = 3\text{ mA}$$

$$R_B = \frac{3.3 - 0.7}{3\text{ mA}} = \frac{2.6}{0.003} \approx 867\ \Omega \;\rightarrow\; \text{เลือกค่ามาตรฐาน } 1\ \text{k}\Omega$$

นี่คือเหตุผลที่ในภาพที่ 3.2 ใช้ตัวต้านทาน Base ขนาด 1 kΩ

**MOSFET (เช่น IRLZ44N, logic-level)** — ใช้แรงดัน Gate สั่งเปิด-ปิด ข้อดีคือ Gate แทบไม่กินกระแส ทนกระแส Drain ได้สูง (หลายสิบแอมป์) เหมาะกับโหลดใหญ่ การนำกระแสของ MOSFET ถูกควบคุมด้วยแรงดัน Gate-Source ($V_{GS}$) เทียบกับแรงดันขีดเริ่ม (Threshold, $V_{GS(th)}$)

> ⚠️ **ต้องใช้ MOSFET แบบ "Logic-Level" กับ ESP32:** MOSFET ทั่วไป (เช่น IRF540) ต้องการ $V_{GS}$ ราว 10 V จึงจะนำกระแสเต็มที่ แต่ ESP32 จ่าย Gate ได้เพียง 3.3 V หากใช้ MOSFET ผิดชนิด มันจะนำกระแสไม่เต็มที่ (อยู่ในย่าน Linear) ทำให้ $R_{DS(on)}$ สูง เกิดความร้อนสะสมจนพังได้ ให้เลือกเบอร์ที่ระบุ "Logic-Level" ซึ่งมี $V_{GS(th)}$ ต่ำ (เช่น IRLZ44N, AOD4184) และนิยมต่อตัวต้านทาน Pull-down (10 kΩ) ที่ Gate ลง GND เพื่อกันไม่ให้ MOSFET ค้างเปิดตอน ESP32 บูต

| เปรียบเทียบ | ทรานซิสเตอร์ BJT | MOSFET |
|---|---|---|
| สั่งด้วย | กระแส (Current-driven) | แรงดัน (Voltage-driven) |
| กระแสขับที่ต้องการ | มาก (ต้องมี R base) | น้อยมาก (≈ 0) |
| สูญเสียเมื่อ ON | V_CE(sat) × I_C | R_DS(on) × I_D² |
| เหมาะกับโหลด | เล็ก–กลาง (< 2 A) | กลาง–ใหญ่ (> 2 A) |
| ตัวอย่างเบอร์ | 2N2222, BC547 | IRLZ44N, IRF3205 |

#### 3.3.3 โมดูลรีเลย์ (Relay Module)

โมดูลรีเลย์สำเร็จรูปภายในมี: ทรานซิสเตอร์ขับ + LED แสดงสถานะ + ไดโอดป้องกัน + หน้าสัมผัส COM/NO/NC ต่อใช้งานง่าย เพียงต่อ GPIO → IN, VCC → 5 V, GND → GND

- **NO (Normally Open)** — ปกติวงจรเปิด สั่ง ON แล้ววงจรจึงปิด
- **NC (Normally Closed)** — ปกติวงจรปิด สั่ง ON แล้ววงจรจึงเปิด
- **COM (Common)** — ขาร่วม

#### 3.3.4 มอเตอร์ไดรเวอร์ (Motor Driver)

สำหรับมอเตอร์ DC ที่ต้องควบคุมทั้งความเร็วและทิศทาง จำเป็นต้องใช้ **H-Bridge**

| IC ไดรเวอร์ | จำนวนช่อง | กระแสต่อเนื่อง | กระแสพีค | แรงดันโหลด | หมายเหตุ |
|---|---|---|---|---|---|
| L293D | 2 | 600 mA | 1.2 A | 4.5–36 V | มีไดโอดป้องกันในตัว |
| L298N | 2 | 2 A | 3 A | 5–46 V | ไม่มีไดโอดในตัว ต้องต่อเพิ่ม |

**หลักการ H-Bridge:** สวิตช์ 4 ตัวจัดเป็นรูป H ที่มอเตอร์อยู่ตรงกลาง สลับทิศกระแสผ่านมอเตอร์ได้ → มอเตอร์หมุนได้ 2 ทิศ

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>หลักการทำงานของวงจรสะพานเอช (H-Bridge)</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .current-fw { fill: none; stroke: #3b82f6; stroke-width: 4.5; stroke-dasharray: 8 10; stroke-linecap: round; animation: marchFw 1.2s linear infinite, glowFw 9s ease-in-out infinite; }
    .current-rv { fill: none; stroke: #ef4444; stroke-width: 4.5; stroke-dasharray: 8 10; stroke-linecap: round; animation: marchRv 1.2s linear infinite, glowRv 9s ease-in-out infinite; }
    .switch-arm { stroke: #1e293b; stroke-width: 4; stroke-linecap: round; }
    .switch-node { fill: #334155; }
    .motor-body { fill: #ffffff; stroke: #334155; stroke-width: 2.5; }
    .propeller { fill: #64748b; transform-origin: 380px 160px; animation: HBridgeMotor 9s linear infinite; }
    
    .text-main { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 12px; fill: #64748b; }
    .text-code { font-size: 12px; font-family: monospace; font-weight: 700; }
    
    /* Switch Animations */
    .s1-arm { transform-origin: 240px 70px; animation: S1Move 9s ease-in-out infinite; }
    .s2-arm { transform-origin: 240px 250px; animation: S2Move 9s ease-in-out infinite; }
    .s3-arm { transform-origin: 520px 70px; animation: S3Move 9s ease-in-out infinite; }
    .s4-arm { transform-origin: 520px 250px; animation: S4Move 9s ease-in-out infinite; }

    /* Explanation Box Animations */
    .explain-fw { animation: glowFw 9s ease-in-out infinite; }
    .explain-rv { animation: glowRv 9s ease-in-out infinite; }
    .explain-stop { animation: glowStop 9s ease-in-out infinite; }

    @keyframes marchFw { to { stroke-dashoffset: -36; } }
    @keyframes marchRv { to { stroke-dashoffset: -36; } }
    
    @keyframes glowFw {
      0%, 30% { opacity: 1; }
      33.3%, 100% { opacity: 0; }
    }
    @keyframes glowRv {
      0%, 30% { opacity: 0; }
      33.3%, 63.3% { opacity: 1; }
      66.6%, 100% { opacity: 0; }
    }
    @keyframes glowStop {
      0%, 63.3% { opacity: 0; }
      66.6%, 96.6% { opacity: 1; }
      100% { opacity: 0; }
    }

    @keyframes S1Move {
      0%, 30% { transform: rotate(0deg); }
      33.3%, 100% { transform: rotate(30deg); }
    }
    @keyframes S2Move {
      0%, 30% { transform: rotate(-30deg); }
      33.3%, 63.3% { transform: rotate(0deg); }
      66.6%, 100% { transform: rotate(-30deg); }
    }
    @keyframes S3Move {
      0%, 30% { transform: rotate(-30deg); }
      33.3%, 63.3% { transform: rotate(0deg); }
      66.6%, 100% { transform: rotate(-30deg); }
    }
    @keyframes S4Move {
      0%, 30% { transform: rotate(0deg); }
      33.3%, 100% { transform: rotate(30deg); }
    }

    @keyframes HBridgeMotor {
      0% { transform: rotate(0deg); }
      30% { transform: rotate(1080deg); }
      33.3% { transform: rotate(1080deg); }
      63.3% { transform: rotate(0deg); }
      66.6%, 100% { transform: rotate(0deg); }
    }
  </style>
  <rect x="5" y="5" width="750" height="330" class="bg"/>
  
  <text x="380" y="30" class="text-main" text-anchor="middle">การทำงานของสะพานเอช (H-Bridge) ควบคุมมอเตอร์ 2 ทิศทาง</text>
  
  <!-- Rails -->
  <path d="M 200 50 L 560 50" class="wire"/>
  <path d="M 200 270 L 560 270" class="wire"/>
  <text x="380" y="45" fill="#dc2626" font-size="12" font-weight="700" text-anchor="middle">+V (แหล่งจ่ายมอเตอร์)</text>
  
  <!-- Ground symbol -->
  <line x1="365" y1="270" x2="395" y2="270" class="wire"/>
  <line x1="371" y1="276" x2="389" y2="276" class="wire"/>
  <line x1="377" y1="282" x2="383" y2="282" class="wire"/>
  <text x="380" y="295" class="text-sub" text-anchor="middle">GND</text>
  
  <!-- Static Wires for H-Bridge -->
  <!-- Left Side -->
  <path d="M 240 50 L 240 70" class="wire"/>
  <path d="M 240 125 L 240 200" class="wire"/>
  <path d="M 240 250 L 240 270" class="wire"/>
  
  <!-- Right Side -->
  <path d="M 520 50 L 520 70" class="wire"/>
  <path d="M 520 125 L 520 200" class="wire"/>
  <path d="M 520 250 L 520 270" class="wire"/>
  
  <!-- Motor Bridge Wires -->
  <path d="M 240 160 L 350 160" class="wire"/>
  <path d="M 410 160 L 520 160" class="wire"/>
  
  <!-- Animated Current Paths -->
  <path d="M 240 50 L 240 160 L 520 160 L 520 270" class="current-fw"/>
  <path d="M 520 50 L 520 160 L 240 160 L 240 270" class="current-rv"/>
  
  <!-- Switch Contacts -->
  <!-- S1 contact -->
  <circle cx="240" cy="70" r="4" class="switch-node"/>
  <circle cx="240" cy="125" r="4" class="switch-node"/>
  <text x="210" y="100" class="text-code">S1</text>
  
  <!-- S2 contact -->
  <circle cx="240" cy="200" r="4" class="switch-node"/>
  <circle cx="240" cy="250" r="4" class="switch-node"/>
  <text x="210" y="230" class="text-code">S2</text>
  
  <!-- S3 contact -->
  <circle cx="520" cy="70" r="4" class="switch-node"/>
  <circle cx="520" cy="125" r="4" class="switch-node"/>
  <text x="545" y="100" class="text-code">S3</text>
  
  <!-- S4 contact -->
  <circle cx="520" cy="200" r="4" class="switch-node"/>
  <circle cx="520" cy="250" r="4" class="switch-node"/>
  <text x="545" y="230" class="text-code">S4</text>
  
  <!-- Switch Arms -->
  <line x1="240" y1="70" x2="240" y2="125" class="switch-arm s1-arm"/>
  <line x1="240" y1="250" x2="240" y2="195" class="switch-arm s2-arm"/>
  <line x1="520" y1="70" x2="520" y2="125" class="switch-arm s3-arm"/>
  <line x1="520" y1="250" x2="520" y2="195" class="switch-arm s4-arm"/>
  
  <!-- Motor Drawing -->
  <circle cx="380" cy="160" r="30" class="motor-body"/>
  <text x="380" y="165" font-size="16" font-weight="700" fill="#334155" text-anchor="middle">M</text>
  <!-- Motor Propeller -->
  <path d="M 380 160 L 360 150 C 355 147, 355 140, 360 140 C 365 140, 375 150, 380 160 Z" class="propeller"/>
  <path d="M 380 160 L 400 170 C 405 173, 405 180, 400 180 C 395 180, 385 170, 380 160 Z" class="propeller"/>

  <!-- Explanations on the Left/Right -->
  <!-- Left info: Input states -->
  <rect x="20" y="110" width="165" height="110" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="102.5" y="132" class="text-main" text-anchor="middle">สถานะควบคุม</text>
  <text x="35" y="158" class="text-sub">Forward:</text><text x="110" y="158" class="text-code" fill="#3b82f6">S1 + S4 ON</text>
  <text x="35" y="178" class="text-sub">Reverse:</text><text x="110" y="178" class="text-code" fill="#ef4444">S2 + S3 ON</text>
  <text x="35" y="198" class="text-sub">Short-ckt:</text><text x="110" y="198" class="text-code" fill="#dc2626">S1 + S2 ON ❌</text>
  
  <!-- Right info dynamic explainers -->
  <g class="explain-fw">
    <rect x="575" y="110" width="165" height="110" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="657.5" y="138" class="text-main" fill="#1d4ed8" text-anchor="middle">หมุนตามเข็ม (Forward)</text>
    <text x="657.5" y="165" class="text-sub" fill="#1e40af" text-anchor="middle">กระแสไหล ซ้าย → ขวา</text>
    <text x="657.5" y="185" class="text-sub" fill="#1e40af" text-anchor="middle">มอเตอร์หมุนขวา</text>
  </g>
  <g class="explain-rv">
    <rect x="575" y="110" width="165" height="110" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
    <text x="657.5" y="138" class="text-main" fill="#b91c1c" text-anchor="middle">หมุนทวนเข็ม (Reverse)</text>
    <text x="657.5" y="165" class="text-sub" fill="#991b1b" text-anchor="middle">กระแสไหล ขวา → ซ้าย</text>
    <text x="657.5" y="185" class="text-sub" fill="#991b1b" text-anchor="middle">มอเตอร์หมุนซ้าย</text>
  </g>
  <g class="explain-stop">
    <rect x="575" y="110" width="165" height="110" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="657.5" y="138" class="text-main" fill="#475569" text-anchor="middle">หยุดหมุน (Brake / Coast)</text>
    <text x="657.5" y="165" class="text-sub" fill="#475569" text-anchor="middle">ทุกสวิตช์เปิดออก (Open)</text>
    <text x="657.5" y="185" class="text-sub" fill="#475569" text-anchor="middle">ไม่มีกระแสไหลผ่าน</text>
  </g>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 3.3 สะพานเอชควบคุมทิศทางการหมุนของมอเตอร์โดยการสลับเปิด-ปิดสวิตช์คู่ทะแยงเพื่อสลับทิศทางของกระแสไฟฟ้า</div>
</div>

**การต่อ L298N กับ ESP32:**
- ENA → PWM (ควบคุมความเร็ว)
- IN1, IN2 → GPIO (ควบคุมทิศทาง)
- OUT1, OUT2 → มอเตอร์
- VCC → แหล่งจ่ายมอเตอร์ (แยกจาก ESP32)
- GND → **ต้องต่อร่วมกัน** ระหว่างแหล่งจ่ายมอเตอร์และ ESP32

**ตัวอย่างโค้ด ESP32 — ควบคุมความเร็วและทิศทางมอเตอร์ DC ผ่าน L298N:**

```cpp
// ESP32 + L298N : ควบคุมมอเตอร์ DC 1 ตัว (ความเร็ว + ทิศทาง)
const int IN1 = 26;   // ทิศทาง A
const int IN2 = 27;   // ทิศทาง B
const int ENA = 25;   // ขา PWM ควบคุมความเร็ว

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  analogWriteResolution(8);      // 0–255
  analogWriteFrequency(20000);   // 20 kHz : พ้นย่านที่หูได้ยิน ลดเสียงหวีดมอเตอร์
}

// speed: -255 (ถอยเต็มที่) ... 0 (หยุด) ... +255 (เดินหน้าเต็มที่)
void driveMotor(int speed) {
  if (speed > 0) {               // เดินหน้า
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
  } else if (speed < 0) {        // ถอยหลัง
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
  } else {                       // เบรก (ลัดขั้วมอเตอร์)
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
  }
  analogWrite(ENA, abs(speed));  // ขนาดของ PWM = ความเร็ว
}

void loop() {
  driveMotor(180);   // เดินหน้า ~70%
  delay(2000);
  driveMotor(0);     // หยุด
  delay(1000);
  driveMotor(-180);  // ถอยหลัง ~70%
  delay(2000);
  driveMotor(0);
  delay(1000);
}
```

> 💡 **เคล็ดลับ:** L298N มีแรงดันตกคร่อมภายในราว 1.5–2 V ทำให้มอเตอร์ได้แรงดันน้อยกว่าแหล่งจ่ายจริง หากต้องการประสิทธิภาพสูงและความร้อนต่ำ ควรเปลี่ยนไปใช้ไดรเวอร์ตระกูล MOSFET เช่น **TB6612FNG** หรือ **DRV8871** ซึ่งแรงดันตกน้อยกว่ามาก

---

### 3.4 การป้องกันวงจร (Circuit Protection)

#### 3.4.1 ไดโอด Flyback (Flyback Diode / Freewheeling Diode)

เมื่อขดลวด (มอเตอร์, รีเลย์, โซลินอยด์) ถูกตัดกระแสกะทันหัน ขดลวดจะ **สร้างแรงดันย้อนกลับ (Back-EMF)** สูงมาก (อาจหลายร้อยโวลต์) ซึ่งทำลายทรานซิสเตอร์หรือ MCU ได้

**วิธีแก้:** ต่อไดโอด (เช่น 1N4007) **ขนานกลับขั้ว** กับขดลวด เมื่อเกิดแรงดันย้อน กระแสจะวนผ่านไดโอดแทนที่จะย้อนเข้าวงจรควบคุม

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 300" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>หลักการทำงานของไดโอด Flyback เพื่อป้องกันแรงดันย้อนกลับ</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    
    /* Currents */
    .current-on { fill: none; stroke: #ef4444; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: marchOn 1s linear infinite, glowOn 6s ease-in-out infinite; }
    .current-off-loop { fill: none; stroke: #3b82f6; stroke-width: 4; stroke-dasharray: 8 10; stroke-linecap: round; animation: marchOff 1s linear infinite, glowOff 6s ease-in-out infinite; }
    
    .coil-box { fill: #ffffff; stroke: #334155; stroke-width: 2.5; rx: 6px; }
    .diode-body { fill: #ffffff; stroke: #334155; stroke-width: 2; }
    .switch-arm { stroke: #1e293b; stroke-width: 4; stroke-linecap: round; transform-origin: 300px 220px; animation: switchFlyback 6s ease-in-out infinite; }
    .node { fill: #334155; }
    
    .text-main { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 12px; fill: #64748b; }
    .text-code { font-size: 12px; font-family: monospace; font-weight: 700; }
    
    .state-on-block { animation: glowOn 6s ease-in-out infinite; }
    .state-off-block { animation: glowOff 6s ease-in-out infinite; }

    @keyframes marchOn { to { stroke-dashoffset: -36; } }
    @keyframes marchOff { to { stroke-dashoffset: -36; } }

    @keyframes glowOn {
      0%, 45% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    @keyframes glowOff {
      0%, 45% { opacity: 0; }
      50%, 95% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes switchFlyback {
      0%, 45% { transform: rotate(0deg); }
      50%, 95% { transform: rotate(-35deg); }
      100% { transform: rotate(0deg); }
    }
  </style>
  <rect x="5" y="5" width="750" height="290" class="bg"/>
  
  <text x="380" y="30" class="text-main" text-anchor="middle">การทำงานของ Flyback Diode ป้องกันทรานซิสเตอร์เสียหายจากโหลดเหนี่ยวนำ</text>
  
  <!-- Rails & Wires -->
  <path d="M 200 60 L 300 60 L 300 100" class="wire"/>
  <path d="M 200 60 L 200 100" class="wire"/>
  <path d="M 200 190 L 200 220 L 300 220" class="wire"/>
  <path d="M 300 190 L 300 220" class="wire"/>
  <path d="M 300 260 L 300 270" class="wire"/>
  
  <text x="300" y="50" fill="#dc2626" font-size="12" font-weight="700" text-anchor="middle">+V (แหล่งจ่าย)</text>
  
  <!-- Animated Currents -->
  <!-- Switch ON: Current flows straight to GND -->
  <path d="M 300 60 L 300 220 L 300 260 M 300 260 L 300 270" class="current-on"/>
  <!-- Switch OFF: Current circulates through diode and coil -->
  <path d="M 300 190 L 200 190 L 200 100 L 300 100 L 300 190" class="current-off-loop"/>

  <!-- Flyback Diode Symbol -->
  <g transform="translate(0,0)">
    <line x1="200" y1="100" x2="200" y2="135" class="wire"/>
    <line x1="200" y1="155" x2="200" y2="190" class="wire"/>
    <polygon points="190,155 210,155 200,135" class="diode-body"/>
    <line x1="190" y1="135" x2="210" y2="135" stroke="#334155" stroke-width="2.5"/>
    <text x="160" y="150" class="text-code" fill="#2563eb">Flyback</text>
    <text x="160" y="165" class="text-code" fill="#2563eb">Diode</text>
  </g>

  <!-- Coil / Inductive Load -->
  <g transform="translate(0,0)">
    <rect x="260" y="100" width="80" height="90" class="coil-box"/>
    <!-- Inductor curly drawing inside coil box -->
    <path d="M 300 100 C 315 105, 315 120, 300 120 C 315 125, 315 140, 300 140 C 315 145, 315 160, 300 160 C 315 165, 315 180, 300 180 C 310 185, 310 190, 300 190" fill="none" stroke="#b45309" stroke-width="2.5"/>
    <text x="300" y="93" class="text-main" text-anchor="middle">ขดลวด</text>
    <text x="300" y="208" class="text-sub" text-anchor="middle">(มอเตอร์ / รีเลย์)</text>
  </g>
  
  <!-- Mechanical Switch -->
  <circle cx="300" cy="220" r="4" class="node"/>
  <circle cx="300" cy="260" r="4" class="node"/>
  <line x1="300" y1="220" x2="300" y2="260" class="switch-arm"/>
  <text x="330" y="245" class="text-main">สวิตช์ / ทรานซิสเตอร์</text>

  <!-- Ground -->
  <line x1="285" y1="270" x2="315" y2="270" class="wire"/>
  <line x1="291" y1="276" x2="309" y2="276" class="wire"/>
  <line x1="297" y1="282" x2="303" y2="282" class="wire"/>
  <text x="300" y="293" class="text-sub" text-anchor="middle">GND</text>

  <!-- Explanations Box (Right) -->
  <g class="state-on-block">
    <rect x="420" y="90" width="310" height="130" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
    <text x="575" y="118" class="text-main" fill="#dc2626" text-anchor="middle">สถานะ: สวิตช์ปิด (ON) / จ่ายไฟ</text>
    <text x="440" y="148" class="text-sub" fill="#991b1b">• กระแสหลักไหลจาก +V ผ่านขดลวดลง GND</text>
    <text x="440" y="168" class="text-sub" fill="#991b1b">• ขดลวดสะสมพลังงานสนามแม่เหล็ก</text>
    <text x="440" y="188" class="text-sub" fill="#991b1b">• ไดโอด Reverse-biased (ปิดกั้นกระแส ไม่ทำงาน)</text>
  </g>
  <g class="state-off-block">
    <rect x="420" y="90" width="310" height="130" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="575" y="118" class="text-main" fill="#1d4ed8" text-anchor="middle">สถานะ: สวิตช์เปิด (OFF) ทันที</text>
    <text x="440" y="148" class="text-sub" fill="#1e40af">• สนามแม่เหล็กยุบตัว เกิดแรงดันเหนี่ยวนำย้อนกลับ (Back-EMF)</text>
    <text x="440" y="168" class="text-sub" fill="#1e40af">• ไดโอดจะทำงานเป็นทางผ่านกระแส (Forward-biased)</text>
    <text x="440" y="188" class="text-sub" fill="#1e40af">• กระแสไหลวนกลับไปสลายตัวในคอยล์ ปลอดภัยสำหรับวงจร</text>
  </g>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 3.4 ไดโอด Flyback ต่อขนานคร่อมโหลดเหนี่ยวนำเพื่อจำกัดกระแสแรงดันย้อนกลับเหนี่ยวนำไม่ให้ย้อนกลับไปทำลายไมโครคอนโทรลเลอร์หรือตัวทรานซิสเตอร์สวิตช์</div>
</div>

> 💡 **เรื่อง Flyback Diode สำคัญมาก:** ทุกครั้งที่ต่อโหลดเหนี่ยวนำ (Inductive Load) เช่น รีเลย์ มอเตอร์ โซลินอยด์ **ต้องมีไดโอด flyback เสมอ** ไม่ว่าจะเล็กแค่ไหน ถ้าลืมต่อ แรงดันย้อนอาจทำลายทรานซิสเตอร์และ MCU ในทันที นี่คือสาเหตุวงจรพังที่พบบ่อยที่สุดในงาน IoT สำหรับผู้เริ่มต้น

#### 3.4.2 การแยกกราวด์ร่วม (Common Ground)

เมื่อใช้แหล่งจ่ายหลายตัว (เช่น USB สำหรับ ESP32 + อะแดปเตอร์ 12 V สำหรับมอเตอร์) **GND ของทุกแหล่งจ่ายต้องต่อร่วมกัน** มิฉะนั้นสัญญาณจะไม่มีจุดอ้างอิงร่วม → วงจรทำงานไม่ถูกต้องหรือเสียหาย

#### 3.4.3 ออปโตคัปเปลอร์ (Optocoupler / Optoisolator)

แยกวงจร MCU ออกจากวงจรโหลดแรงดันสูง **ทางไฟฟ้าอย่างสมบูรณ์** โดยใช้แสงเป็นตัวกลางส่งสัญญาณ (LED ภายใน → Phototransistor ภายใน)

ใช้เมื่อ:
- ควบคุมโหลด AC 220 V
- ต้องการป้องกัน MCU จากสัญญาณรบกวน (Noise) ของมอเตอร์ขนาดใหญ่
- ต้องการความปลอดภัยสูง (Galvanic Isolation)

---

### 3.5 PWM กับการควบคุมตัวกระทำ (PWM & Actuator Control — Introduction)

**PWM (Pulse Width Modulation)** คือเทคนิคการสร้างสัญญาณดิจิทัลที่เปลี่ยน "สัดส่วนเวลาที่เป็น HIGH" (เรียกว่า **Duty Cycle**) เพื่อควบคุมพลังงานเฉลี่ยที่ส่งให้โหลด

- Duty Cycle 0% → ปิดสนิท
- Duty Cycle 50% → จ่ายพลังงานครึ่งหนึ่ง
- Duty Cycle 100% → เปิดเต็มที่

**แบบจำลองทางคณิตศาสตร์ของ PWM:** ในหนึ่งคาบสัญญาณ (Period, $T$) สัญญาณเป็น HIGH นานเป็นเวลา $t_{on}$ ค่า Duty Cycle ($D$) คือ:

$$D = \frac{t_{on}}{T} \times 100\% \qquad f_{PWM} = \frac{1}{T}$$

เนื่องจากโหลด (เช่น มอเตอร์หรือ LED) ตอบสนองต่อ "ค่าเฉลี่ย" ของแรงดัน แรงดันเฉลี่ยที่โหลดได้รับจึงเป็น:

$$V_{avg} = D \times V_{supply}$$

ตัวอย่าง: ถ้าจ่าย PWM duty 75% จากแหล่ง 12 V มอเตอร์จะเห็นแรงดันเฉลี่ย $0.75 \times 12 = 9\text{ V}$

**ความละเอียด (Resolution):** ESP32 กำหนดความละเอียด PWM เป็นจำนวนบิตได้ ความละเอียด $n$ บิตให้จำนวนระดับ Duty ที่ตั้งได้เท่ากับ $2^n$ ระดับ เช่น 8 บิต = 256 ระดับ (ค่า 0–255), 10 บิต = 1024 ระดับ ยิ่งบิตมากยิ่งปรับละเอียด แต่ความถี่สูงสุดที่ทำได้จะลดลง (มีความสัมพันธ์ผกผันกับความละเอียดผ่านคล็อกภายในของตัวจับเวลา)

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 300" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>สัญญาณ PWM ที่ค่า Duty Cycle ต่าง ๆ และแรงดันเฉลี่ยที่ได้</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .axis { stroke: #94a3b8; stroke-width: 1.5; }
    .grid { stroke: #e2e8f0; stroke-width: 1; }
    .pwm-wave { fill: none; stroke: #7c3aed; stroke-width: 3; stroke-linejoin: round; }
    .avg-line { stroke: #ef4444; stroke-width: 2.5; stroke-dasharray: 6 5; }
    .fill-on { fill: #ede9fe; opacity: 0.7; }
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-avg { font-size: 11px; font-weight: 700; fill: #dc2626; }
    .duty-label { font-size: 14px; font-weight: 700; fill: #7c3aed; }
    /* brightness demo dot */
    .lamp { animation: lampPulse 9s ease-in-out infinite; }
    @keyframes lampPulse {
      0%, 100% { fill: #1e1b4b; }
      50% { fill: #c4b5fd; }
    }
  </style>
  <rect x="5" y="5" width="750" height="290" class="bg"/>
  <text x="380" y="30" class="text-main" text-anchor="middle">PWM : Duty Cycle ควบคุมแรงดันเฉลี่ย (V_avg = D × V_supply)</text>

  <!-- Three panels: 25%, 50%, 75% -->
  <!-- Panel 1: 25% -->
  <g transform="translate(40,55)">
    <line x1="0" y1="0" x2="0" y2="110" class="axis"/>
    <line x1="0" y1="110" x2="200" y2="110" class="axis"/>
    <text x="100" y="-8" class="duty-label" text-anchor="middle">Duty 25%</text>
    <!-- ON fills (25% of each 50px period) -->
    <rect x="0" y="20" width="12.5" height="90" class="fill-on"/>
    <rect x="50" y="20" width="12.5" height="90" class="fill-on"/>
    <rect x="100" y="20" width="12.5" height="90" class="fill-on"/>
    <rect x="150" y="20" width="12.5" height="90" class="fill-on"/>
    <path d="M0,20 H12.5 V110 H50 V20 H62.5 V110 H100 V20 H112.5 V110 H150 V20 H162.5 V110 H200" class="pwm-wave"/>
    <line x1="0" y1="87.5" x2="200" y2="87.5" class="avg-line"/>
    <text x="205" y="91" class="text-avg">V_avg</text>
  </g>

  <!-- Panel 2: 50% -->
  <g transform="translate(290,55)">
    <line x1="0" y1="0" x2="0" y2="110" class="axis"/>
    <line x1="0" y1="110" x2="200" y2="110" class="axis"/>
    <text x="100" y="-8" class="duty-label" text-anchor="middle">Duty 50%</text>
    <rect x="0" y="20" width="25" height="90" class="fill-on"/>
    <rect x="50" y="20" width="25" height="90" class="fill-on"/>
    <rect x="100" y="20" width="25" height="90" class="fill-on"/>
    <rect x="150" y="20" width="25" height="90" class="fill-on"/>
    <path d="M0,20 H25 V110 H50 V20 H75 V110 H100 V20 H125 V110 H150 V20 H175 V110 H200" class="pwm-wave"/>
    <line x1="0" y1="65" x2="200" y2="65" class="avg-line"/>
    <text x="205" y="69" class="text-avg">V_avg</text>
  </g>

  <!-- Panel 3: 75% -->
  <g transform="translate(540,55)">
    <line x1="0" y1="0" x2="0" y2="110" class="axis"/>
    <line x1="0" y1="110" x2="200" y2="110" class="axis"/>
    <text x="100" y="-8" class="duty-label" text-anchor="middle">Duty 75%</text>
    <rect x="0" y="20" width="37.5" height="90" class="fill-on"/>
    <rect x="50" y="20" width="37.5" height="90" class="fill-on"/>
    <rect x="100" y="20" width="37.5" height="90" class="fill-on"/>
    <rect x="150" y="20" width="37.5" height="90" class="fill-on"/>
    <path d="M0,20 H37.5 V110 H50 V20 H87.5 V110 H100 V20 H137.5 V110 H150 V20 H187.5 V110 H200" class="pwm-wave"/>
    <line x1="0" y1="42.5" x2="200" y2="42.5" class="avg-line"/>
    <text x="205" y="46" class="text-avg">V_avg</text>
  </g>

  <!-- Brightness demo -->
  <text x="120" y="215" class="text-sub" text-anchor="middle">ผลที่ได้ : ความสว่าง / ความเร็วเพิ่มขึ้นตาม Duty</text>
  <circle cx="330" cy="235" r="14" fill="#1e1b4b"/>
  <text x="330" y="265" class="text-sub" text-anchor="middle">25%</text>
  <circle cx="400" cy="235" r="14" fill="#6d28d9"/>
  <text x="400" y="265" class="text-sub" text-anchor="middle">50%</text>
  <circle cx="470" cy="235" r="14" fill="#a78bfa"/>
  <text x="470" y="265" class="text-sub" text-anchor="middle">75%</text>
  <circle cx="560" cy="235" r="14" class="lamp"/>
  <text x="560" y="265" class="text-sub" text-anchor="middle">หลอดจำลอง (วนค่า)</text>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 3.5 ยิ่ง Duty Cycle สูง สัดส่วนเวลาที่สัญญาณเป็น HIGH ยิ่งมาก ทำให้แรงดันเฉลี่ย (เส้นประแดง) สูงขึ้น โหลดจึงสว่างขึ้นหรือหมุนเร็วขึ้น</div>
</div>

**การใช้งานกับตัวกระทำ:**

| การใช้งาน | ความถี่ PWM ที่เหมาะสม | สิ่งที่ Duty Cycle ควบคุม |
|---|---|---|
| ความสว่าง LED | 1–5 kHz | ระดับความสว่าง |
| ความเร็วมอเตอร์ DC | 5–25 kHz | ความเร็วรอบ |
| มุมเซอร์โว | 50 Hz (คงที่) | ตำแหน่งมุม (ความกว้างพัลส์ 1–2 ms) |
| เสียงบัซเซอร์ | 100 Hz–10 kHz | ระดับเสียง (Tone) |

**ตัวอย่างโค้ด ESP32 — ควบคุมความสว่าง LED ด้วย PWM (ทดลองบน Wokwi):**

```cpp
// ESP32 LED Brightness Control — PWM
// ทดสอบบน Wokwi: ต่อ LED + R 220Ω ที่ GPIO 2

const int ledPin = 2;

void setup() {
  // ESP32 Arduino Core 3.x: ใช้ analogWrite() ได้โดยตรง
  // หรือใช้ ledcAttach() + ledcWrite() สำหรับ Core 2.x
  analogWriteResolution(8);     // ความละเอียด 8 บิต (0-255)
  analogWriteFrequency(5000);   // ความถี่ 5 kHz
}

void loop() {
  // ค่อย ๆ สว่างขึ้น
  for (int duty = 0; duty <= 255; duty += 5) {
    analogWrite(ledPin, duty);
    delay(30);
  }
  // ค่อย ๆ หรี่ลง
  for (int duty = 255; duty >= 0; duty -= 5) {
    analogWrite(ledPin, duty);
    delay(30);
  }
}
```

> 💡 **หมายเหตุ:** ESP32 Arduino Core เวอร์ชัน 3.x รองรับ `analogWrite()` เหมือน Arduino ทั่วไป แต่เวอร์ชันเก่า (2.x) ต้องใช้ `ledcSetup()` + `ledcAttachPin()` + `ledcWrite()` แทน ตรวจสอบเวอร์ชันที่ใช้ก่อนเขียนโค้ดเสมอ

---

### 3.6 การเลือกวงจรขับให้เหมาะกับโหลด (Selecting the Right Driver)

ใช้ตารางต่อไปนี้เป็นแนวทางในการเลือกวิธีขับโหลด:

| โหลด | กระแสโดยประมาณ | แรงดัน | วงจรขับที่แนะนำ | ไดโอด Flyback? |
|---|---|---|---|---|
| LED (ตัวเดียว) | 10–20 mA | 2–3.3 V | ต่อ GPIO ตรง + R จำกัดกระแส | ไม่จำเป็น |
| บัซเซอร์เพียโซ | 5–15 mA | 3.3 V | ต่อ GPIO ตรง | ไม่จำเป็น |
| บัซเซอร์แม่เหล็กไฟฟ้า | 30–80 mA | 5 V | ทรานซิสเตอร์ NPN | **จำเป็น** |
| รีเลย์ 5 V | 70–100 mA | 5 V | ทรานซิสเตอร์ NPN / โมดูลสำเร็จรูป | **จำเป็น** |
| มอเตอร์ DC เล็ก | 200–500 mA | 6–12 V | L293D / L298N | **จำเป็น** |
| มอเตอร์ DC กลาง | 1–3 A | 12–24 V | L298N / MOSFET H-Bridge | **จำเป็น** |
| เซอร์โว SG90 | 100–500 mA (พีค) | 5 V | ต่อสัญญาณ GPIO ตรง แต่จ่ายไฟแยก | มีในตัว |
| สเต็ปเปอร์ NEMA 17 | 1–2 A | 12 V | A4988 / DRV8825 | มีในโมดูล |
| โซลินอยด์ 12 V | 300 mA–1 A | 12 V | MOSFET (logic-level) | **จำเป็น** |

**หลักการตัดสินใจ:**

1. ตรวจสอบ **กระแส** ที่โหลดต้องการ → ถ้า > 10 mA ห้ามต่อ GPIO ตรง
2. ตรวจสอบ **แรงดัน** ที่โหลดต้องการ → ถ้าต่างจาก 3.3 V ต้องใช้แหล่งจ่ายแยก
3. ดูว่าโหลดเป็น **ขดลวด** หรือไม่ → ถ้าใช่ ต้องมีไดโอด Flyback
4. ต้องการ **ควบคุมทิศทาง** ด้วยหรือไม่ → ถ้าใช่ ใช้ H-Bridge

---

### 3.7 เซอร์โวมอเตอร์เชิงลึก (Servo Motor in Depth)

#### 3.7.1 โครงสร้างภายในและหลักการควบคุมตำแหน่ง

เซอร์โวมอเตอร์ (RC Servo) เป็นตัวกระทำที่ควบคุม **"มุม/ตำแหน่ง"** ได้แม่นยำ ภายในประกอบด้วย 4 ส่วนทำงานร่วมกันเป็น **ระบบควบคุมแบบป้อนกลับวงปิด (Closed-loop Feedback)**:

1. **มอเตอร์ DC ขนาดเล็ก** — ให้กำลังหมุน
2. **ชุดเฟืองทด (Gearbox)** — ลดรอบ เพิ่มแรงบิด
3. **โพเทนชิออมิเตอร์ (Potentiometer)** — ติดที่แกนเอาต์พุต ทำหน้าที่เป็นเซนเซอร์วัดมุมปัจจุบันแล้วป้อนกลับ
4. **วงจรควบคุม** — เปรียบเทียบมุมที่สั่ง (จากความกว้างพัลส์) กับมุมจริง (จากโพเทนชิออมิเตอร์) แล้วขับมอเตอร์จนกว่าจะตรงกัน

#### 3.7.2 การเข้ารหัสมุมด้วยความกว้างพัลส์ (Pulse-Width Encoding)

เซอร์โวรับสัญญาณ PWM ความถี่ **50 Hz** (คาบ 20 ms) แต่สิ่งที่กำหนดมุมไม่ใช่ Duty Cycle ตรง ๆ แต่เป็น **"ความกว้างของพัลส์ (Pulse Width)"** ในแต่ละคาบ:

| ความกว้างพัลส์ | มุมโดยประมาณ (เซอร์โว 180°) |
|---|---|
| 1.0 ms | 0° |
| 1.5 ms | 90° (กึ่งกลาง) |
| 2.0 ms | 180° |

ความสัมพันธ์เป็นเชิงเส้น สามารถประมาณมุมจากความกว้างพัลส์ ($t_p$ หน่วย ms) ได้ดังนี้:

$$\theta \approx \left( \frac{t_p - 1.0}{2.0 - 1.0} \right) \times 180^\circ$$

> 💡 **หมายเหตุ:** เซอร์โวแต่ละรุ่นมีช่วงพัลส์ต่างกันเล็กน้อย บางรุ่นใช้ 0.5–2.5 ms การปรับค่า min/max ในไลบรารีให้ตรงกับรุ่นจริงช่วยให้ได้ช่วงมุมเต็ม 0–180° และป้องกันเซอร์โว "ชนสุด" จนสั่น (Jitter) และร้อน

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>ความกว้างพัลส์ PWM กำหนดมุมของเซอร์โวมอเตอร์</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .axis { stroke: #94a3b8; stroke-width: 1.5; }
    .frame-box { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 6px; }
    .pulse { fill: #7c3aed; stroke: #5b21b6; stroke-width: 1.5; }
    .servo-body { fill: #1e293b; stroke: #0f172a; stroke-width: 2; rx: 6px; }
    .servo-horn { fill: #f59e0b; stroke: #b45309; stroke-width: 2; transform-origin: 590px 175px; animation: hornMove 9s ease-in-out infinite; }
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-size: 13px; font-weight: 700; font-family: monospace; }

    .p1 { animation: ph1 9s ease-in-out infinite; }
    .p2 { animation: ph2 9s ease-in-out infinite; }
    .p3 { animation: ph3 9s ease-in-out infinite; }

    @keyframes ph1 { 0%,28% {opacity:1;} 33%,100% {opacity:0;} }
    @keyframes ph2 { 0%,30% {opacity:0;} 36%,61% {opacity:1;} 66%,100% {opacity:0;} }
    @keyframes ph3 { 0%,63% {opacity:0;} 69%,96% {opacity:1;} 100% {opacity:0;} }

    @keyframes hornMove {
      0%, 30%   { transform: rotate(-90deg); }
      36%, 63%  { transform: rotate(0deg); }
      69%, 96%  { transform: rotate(90deg); }
      100%      { transform: rotate(-90deg); }
    }
  </style>
  <rect x="5" y="5" width="750" height="310" class="bg"/>
  <text x="380" y="30" class="text-main" text-anchor="middle">ความกว้างพัลส์ (Pulse Width) → มุมของเซอร์โว (คาบคงที่ 20 ms / 50 Hz)</text>

  <!-- PWM frame timeline -->
  <text x="60" y="70" class="text-main">สัญญาณควบคุม (1 คาบ = 20 ms)</text>
  <rect x="60" y="85" width="380" height="70" class="frame-box"/>
  <line x1="60" y1="155" x2="440" y2="155" class="axis"/>
  <text x="60" y="172" class="text-sub">0 ms</text>
  <text x="420" y="172" class="text-sub">20 ms</text>

  <!-- Pulses (only one visible at a time) -->
  <rect class="pulse p1" x="60" y="95" width="38"  height="60"/>
  <rect class="pulse p2" x="60" y="95" width="57"  height="60"/>
  <rect class="pulse p3" x="60" y="95" width="76"  height="60"/>

  <!-- Pulse-width readouts -->
  <g class="p1"><text x="250" y="200" class="text-code" fill="#7c3aed" text-anchor="middle">พัลส์ 1.0 ms  →  มุม 0°</text></g>
  <g class="p2"><text x="250" y="200" class="text-code" fill="#7c3aed" text-anchor="middle">พัลส์ 1.5 ms  →  มุม 90°</text></g>
  <g class="p3"><text x="250" y="200" class="text-code" fill="#7c3aed" text-anchor="middle">พัลส์ 2.0 ms  →  มุม 180°</text></g>

  <!-- Servo body + horn -->
  <rect x="560" y="175" width="60" height="80" class="servo-body"/>
  <text x="590" y="275" class="text-sub" text-anchor="middle">Servo (SG90)</text>
  <circle cx="590" cy="175" r="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
  <!-- Horn: drawn pointing up from pivot, rotated by animation -->
  <rect class="servo-horn" x="585" y="105" width="10" height="72" rx="4"/>
  <circle cx="590" cy="175" r="4" fill="#0f172a"/>

  <!-- Angle arc guide -->
  <path d="M 520 175 A 70 70 0 0 1 660 175" fill="none" stroke="#e2e8f0" stroke-width="2"/>
  <text x="512" y="180" class="text-sub" text-anchor="middle">0°</text>
  <text x="590" y="98" class="text-sub" text-anchor="middle">90°</text>
  <text x="668" y="180" class="text-sub" text-anchor="middle">180°</text>

  <!-- explanation -->
  <text x="250" y="240" class="text-sub" text-anchor="middle">วงจรภายในเปรียบเทียบมุมที่สั่งกับมุมจริงจากโพเทนชิออมิเตอร์</text>
  <text x="250" y="258" class="text-sub" text-anchor="middle">แล้วขับมอเตอร์จนกระทั่งแกนหมุนไปอยู่ตำแหน่งที่ถูกต้อง</text>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 3.6 เซอร์โวอ่าน "ความกว้างพัลส์" ในแต่ละคาบ 20 ms (1.0–2.0 ms) แล้วหมุนแกนเอาต์พุตไปยังมุม 0°–180° ที่สอดคล้องกัน</div>
</div>

#### 3.7.3 ข้อมูลจำเพาะ SG90 และการต่อใช้งาน

- แรงดันใช้งาน: 4.8–6 V (นิยมจ่ายจาก 5 V)
- แรงบิด: ~1.8 kg·cm ที่ 4.8 V
- ช่วงมุม: ~180° • กระแสพีคขณะเคลื่อน: 100–500 mA
- สายไฟ: **น้ำตาล** = GND, **แดง** = +5V, **ส้ม/เหลือง** = สัญญาณ

> ⚠️ **อย่าจ่ายไฟเซอร์โวจากขา 3.3V ของ ESP32:** เซอร์โวดึงกระแสพีคสูงตอนออกแรง อาจทำให้แรงดันตก ESP32 รีเซ็ตเองได้ ให้จ่ายไฟเซอร์โวจากแหล่ง 5 V แยก และ **ต่อ GND ร่วมกับ ESP32** ส่วนสายสัญญาณต่อกับ GPIO ได้โดยตรง

**ตัวอย่างโค้ด ESP32 — ควบคุมมุมเซอร์โว (ไลบรารี ESP32Servo):**

```cpp
#include <ESP32Servo.h>

Servo myServo;
const int servoPin = 13;

void setup() {
  myServo.setPeriodHertz(50);            // เซอร์โวมาตรฐาน 50 Hz
  myServo.attach(servoPin, 500, 2400);   // ช่วงพัลส์ min/max (µs) ปรับตามรุ่น
}

void loop() {
  myServo.write(0);     delay(1000);     // ไป 0°
  myServo.write(90);    delay(1000);     // ไป 90°
  myServo.write(180);   delay(1000);     // ไป 180°

  // กวาดมุมต่อเนื่อง (sweep)
  for (int a = 0; a <= 180; a++) { myServo.write(a); delay(15); }
  for (int a = 180; a >= 0; a--) { myServo.write(a); delay(15); }
}
```

**การประยุกต์ทางวิศวกรรมเครื่องกล:** ข้อต่อแขนหุ่นยนต์ (Robotic Arm Joint), กิมบอลกล้อง, ระบบบังคับเลี้ยวรถจำลอง, การเปิด-ปิดวาล์วแบบปรับองศา และกลไกคัดแยกชิ้นงานบนสายพาน

---

### 3.8 สเต็ปเปอร์มอเตอร์เชิงลึก (Stepper Motor in Depth)

#### 3.8.1 หลักการหมุนทีละสเต็ป

สเต็ปเปอร์มอเตอร์หมุนเป็น "ขั้น" ที่แน่นอนโดยการ **กระตุ้นขดลวด (Phase/Coil) ตามลำดับ** สนามแม่เหล็กที่เกิดขึ้นจะดึงให้โรเตอร์ (แม่เหล็กถาวร) หมุนตามไปทีละสเต็ป ข้อดีคือควบคุมตำแหน่งแบบ **วงเปิด (Open-loop)** ได้แม่นยำโดยไม่ต้องมีเซนเซอร์ป้อนกลับ — แค่นับจำนวนพัลส์ก็รู้ตำแหน่ง

มุมต่อสเต็ป (Step Angle) และจำนวนสเต็ปต่อรอบ:

$$\text{สเต็ปต่อรอบ} = \frac{360^\circ}{\text{Step Angle}}$$

เช่น มอเตอร์ที่มี Step Angle = 1.8° จะหมุน $360/1.8 = 200$ สเต็ปต่อรอบ

#### 3.8.2 รูปแบบการขับ (Drive Modes)

| โหมด | ลำดับการกระตุ้น | คุณสมบัติ |
|---|---|---|
| Wave Drive | กระตุ้นทีละ 1 เฟส | กินไฟน้อย แต่แรงบิดต่ำสุด |
| Full-step | กระตุ้นทีละ 2 เฟสพร้อมกัน | แรงบิดสูง (มาตรฐาน) |
| Half-step | สลับ 1 เฟส/2 เฟส | ความละเอียด 2 เท่า เดินนุ่มขึ้น |
| Microstepping | ปรับกระแสแต่ละเฟสแบบ sine | ละเอียดมาก (1/16, 1/32) เดินนิ่ง |

ตารางลำดับการกระตุ้นแบบ Full-step (4 เฟส A, B, C, D):

| สเต็ป | A | B | C | D |
|---|---|---|---|---|
| 1 | ● | ● | | |
| 2 | | ● | ● | |
| 3 | | | ● | ● |
| 4 | ● | | | ● |

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>ลำดับการกระตุ้นขดลวดทำให้โรเตอร์ของสเต็ปเปอร์หมุนทีละสเต็ป</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .stator { fill: #ffffff; stroke: #334155; stroke-width: 2; }
    .coil-label { font-size: 13px; font-weight: 700; }
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-size: 12px; font-weight: 700; font-family: monospace; }
    .rotor { fill: #ef4444; stroke: #991b1b; stroke-width: 2; transform-origin: 250px 180px; animation: rotorStep 8s steps(1) infinite; }

    /* coil energize glows : 4 phases, each lit during its step */
    .cA { animation: litA 8s steps(1) infinite; }
    .cB { animation: litB 8s steps(1) infinite; }
    .cC { animation: litC 8s steps(1) infinite; }
    .cD { animation: litD 8s steps(1) infinite; }

    @keyframes rotorStep {
      0%   { transform: rotate(0deg); }
      25%  { transform: rotate(90deg); }
      50%  { transform: rotate(180deg); }
      75%  { transform: rotate(270deg); }
      100% { transform: rotate(360deg); }
    }
    /* Full-step: each step energizes two adjacent coils; show primary coil per quadrant */
    @keyframes litA { 0%{fill:#22c55e;} 25%,100%{fill:#cbd5e1;} }
    @keyframes litB { 0%{fill:#cbd5e1;} 25%{fill:#22c55e;} 50%,100%{fill:#cbd5e1;} }
    @keyframes litC { 0%,25%{fill:#cbd5e1;} 50%{fill:#22c55e;} 75%,100%{fill:#cbd5e1;} }
    @keyframes litD { 0%,50%{fill:#cbd5e1;} 75%{fill:#22c55e;} 100%{fill:#cbd5e1;} }
  </style>
  <rect x="5" y="5" width="750" height="330" class="bg"/>
  <text x="380" y="30" class="text-main" text-anchor="middle">การกระตุ้นขดลวดตามลำดับ → สนามแม่เหล็กดึงโรเตอร์หมุนทีละสเต็ป</text>

  <!-- Stator coils (4 around center 250,180) -->
  <!-- A top, B right, C bottom, D left -->
  <rect class="stator cA" x="225" y="80"  width="50" height="40" rx="6"/>
  <text x="250" y="105" class="coil-label" fill="#1e293b" text-anchor="middle">A</text>
  <rect class="stator cB" x="320" y="160" width="50" height="40" rx="6"/>
  <text x="345" y="185" class="coil-label" fill="#1e293b" text-anchor="middle">B</text>
  <rect class="stator cC" x="225" y="240" width="50" height="40" rx="6"/>
  <text x="250" y="265" class="coil-label" fill="#1e293b" text-anchor="middle">C</text>
  <rect class="stator cD" x="130" y="160" width="50" height="40" rx="6"/>
  <text x="155" y="185" class="coil-label" fill="#1e293b" text-anchor="middle">D</text>

  <!-- Rotor (magnet) at center, pointer shows orientation -->
  <circle cx="250" cy="180" r="34" fill="#fee2e2" stroke="#334155" stroke-width="2"/>
  <polygon class="rotor" points="250,150 262,180 250,210 238,180"/>
  <circle cx="250" cy="180" r="5" fill="#0f172a"/>
  <text x="250" y="320" class="text-sub" text-anchor="middle">โรเตอร์ (แม่เหล็กถาวร) หันเข้าหาเฟสที่ถูกกระตุ้น (สีเขียว)</text>

  <!-- Sequence panel -->
  <rect x="470" y="80" width="250" height="200" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="595" y="108" class="text-main" text-anchor="middle">ลำดับ Full-step</text>
  <text x="495" y="140" class="text-code" fill="#16a34a">สเต็ป 1 : กระตุ้น A</text>
  <text x="495" y="170" class="text-code" fill="#16a34a">สเต็ป 2 : กระตุ้น B</text>
  <text x="495" y="200" class="text-code" fill="#16a34a">สเต็ป 3 : กระตุ้น C</text>
  <text x="495" y="230" class="text-code" fill="#16a34a">สเต็ป 4 : กระตุ้น D</text>
  <text x="495" y="262" class="text-sub">วนกลับสเต็ป 1 → หมุนต่อเนื่อง</text>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 3.7 การกระตุ้นขดลวดเรียงลำดับ A→B→C→D ทำให้สนามแม่เหล็กหมุนรอบ โรเตอร์จึงถูกดึงให้หมุนตามทีละสเต็ป (ภาพแสดงแบบเฟสเดียวเพื่อให้เห็นทิศทางชัดเจน)</div>
</div>

#### 3.8.3 ชนิดของสเต็ปเปอร์และไดรเวอร์ที่ใช้คู่กัน

| ชนิด | ตัวอย่าง | ไดรเวอร์ | ลักษณะเด่น |
|---|---|---|---|
| Unipolar | 28BYJ-48 (5V) | ULN2003 | ราคาถูก กระแสต่ำ เหมาะฝึกหัด |
| Bipolar | NEMA 17 | A4988 / DRV8825 | แรงบิดสูง รองรับ Microstepping |

> 💡 **A4988/DRV8825 ใช้แค่ 2 ขา:** ไดรเวอร์รุ่นใหม่รับสัญญาณเพียง **STEP** (พัลส์ละ 1 สเต็ป) และ **DIR** (กำหนดทิศทาง) ทำให้ ESP32 ควบคุมง่ายมาก และอย่าลืมตั้งกระแส (Vref) บนไดรเวอร์ให้ตรงกับพิกัดมอเตอร์เพื่อกันความร้อนเกิน

**ตัวอย่างโค้ด ESP32 — ขับสเต็ปเปอร์ผ่าน A4988 (STEP/DIR):**

```cpp
const int STEP_PIN = 14;
const int DIR_PIN  = 12;
const int STEPS_PER_REV = 200;   // 1.8° ต่อสเต็ป

void setup() {
  pinMode(STEP_PIN, OUTPUT);
  pinMode(DIR_PIN, OUTPUT);
}

void rotateSteps(int steps, bool cw) {
  digitalWrite(DIR_PIN, cw ? HIGH : LOW);
  for (int i = 0; i < steps; i++) {
    digitalWrite(STEP_PIN, HIGH);
    delayMicroseconds(800);        // ยิ่งหน่วงสั้น ยิ่งหมุนเร็ว (ระวังหลุดสเต็ป)
    digitalWrite(STEP_PIN, LOW);
    delayMicroseconds(800);
  }
}

void loop() {
  rotateSteps(STEPS_PER_REV, true);   // หมุน 1 รอบ ตามเข็ม
  delay(1000);
  rotateSteps(STEPS_PER_REV, false);  // หมุน 1 รอบ ทวนเข็ม
  delay(1000);
}
```

**การประยุกต์ทางวิศวกรรมเครื่องกล:** เครื่อง CNC, เครื่องพิมพ์ 3 มิติ (แกน X/Y/Z และ Extruder), สไลด์เดอร์กล้อง, ปั๊มฉีดของเหลวแม่นยำ (Syringe Pump) และโต๊ะหมุนชิ้นงาน

---

### 3.9 การคำนวณกำลังและการระบายความร้อน (Power & Thermal Considerations)

อุปกรณ์ขับโหลด (ทรานซิสเตอร์/MOSFET/ไดรเวอร์) จะร้อนขึ้นเพราะมีกำลังสูญเสียภายใน หากออกแบบไม่ดีอาจร้อนจนพัง การประเมินความร้อนจึงสำคัญ

**กำลังสูญเสียในอุปกรณ์สวิตช์:**

- **BJT (ขณะ ON):** $P = V_{CE(sat)} \times I_C$ — เช่น $V_{CE(sat)} = 0.3\text{ V}$, $I_C = 1\text{ A}$ → $P = 0.3\text{ W}$
- **MOSFET (ขณะ ON):** $P = I_D^2 \times R_{DS(on)}$ — เช่น $R_{DS(on)} = 0.02\ \Omega$, $I_D = 3\text{ A}$ → $P = 0.18\text{ W}$ (จะเห็นว่า MOSFET ที่ $R_{DS(on)}$ ต่ำสูญเสียน้อยกว่า BJT มากในกระแสสูง)

**การประเมินอุณหภูมิจุดต่อ (Junction Temperature):**

$$T_j = T_a + P \times R_{\theta JA}$$

โดย $T_a$ = อุณหภูมิอากาศโดยรอบ, $R_{\theta JA}$ = ความต้านทานความร้อนจากจุดต่อสู่อากาศ (°C/W จากดาต้าชีต) ถ้าผลลัพธ์ $T_j$ เข้าใกล้พิกัดสูงสุด (มัก ~150 °C) **ต้องติดฮีตซิงก์ (Heat Sink)** เพื่อลด $R_{\theta JA}$

**การจัดงบกระแสและแหล่งจ่าย:**

1. รวมกระแสสูงสุดของโหลดทุกตัว แล้ว **เผื่อ 20–30%** เลือกแหล่งจ่ายให้จ่ายได้เกินค่านี้
2. เผื่อกระแสพีคขณะสตาร์ตมอเตอร์ (Inrush) ซึ่งสูงกว่ากระแสปกติหลายเท่า
3. เลือกขนาดสายไฟ (Wire Gauge) ให้รับกระแสได้ และเดินสายโหลดกระแสสูงให้สั้นเพื่อลดแรงดันตก
4. เพิ่มตัวเก็บประจุ (เช่น 470–1000 µF) คร่อมแหล่งจ่ายมอเตอร์ เพื่อรองรับกระแสกระชากและลดสัญญาณรบกวนกลับเข้า ESP32

---

### 3.10 ตัวอย่างการออกแบบระบบจริง: ระบบรดน้ำอัตโนมัติ (Design Walkthrough)

โจทย์: ออกแบบส่วนขับของระบบรดน้ำอัตโนมัติที่ควบคุมด้วย ESP32 ประกอบด้วย **ปั๊มน้ำ 12 V / 2 A**, **วาล์วโซลินอยด์ 12 V / 0.5 A** และ **LED แสดงสถานะ 3 ดวง**

**ขั้นที่ 1 — วิเคราะห์โหลดแต่ละตัว**

| อุปกรณ์ | กระแส | ชนิดโหลด | ต่อ GPIO ตรงได้? |
|---|---|---|---|
| ปั๊มน้ำ 12V | 2 A (พีคสูงกว่านี้) | เหนี่ยวนำ (มอเตอร์) | ❌ |
| โซลินอยด์ 12V | 0.5 A | เหนี่ยวนำ (ขดลวด) | ❌ |
| LED ×3 | 10–15 mA ต่อดวง | ไม่เหนี่ยวนำ | ✅ (ผ่าน R จำกัดกระแส) |

**ขั้นที่ 2 — เลือกวงจรขับ**

- **ปั๊มน้ำ:** กระแสสูง 2 A → ใช้ **MOSFET logic-level (IRLZ44N)** หรือโมดูลรีเลย์ที่ทนกระแสพอ + **ไดโอด Flyback (1N4007 หรือ Schottky)**
- **โซลินอยด์:** 0.5 A → **MOSFET หรือทรานซิสเตอร์ NPN (เช่น TIP120)** + **ไดโอด Flyback**
- **LED:** ต่อ GPIO โดยตรงผ่านตัวต้านทานจำกัดกระแส (~220 Ω ต่อดวง)

**ขั้นที่ 3 — การป้องกันและกราวด์**

- ทั้งปั๊มและโซลินอยด์เป็นโหลดเหนี่ยวนำ → **ต้องมีไดโอด Flyback ทั้งคู่**
- ใช้แหล่งจ่าย 2 ชุด (USB 5V สำหรับ ESP32 + อะแดปเตอร์ 12V สำหรับปั๊ม/วาล์ว) → **ต้องต่อ GND ร่วมกัน**
- เพิ่มคาปาซิเตอร์ 1000 µF คร่อมไฟ 12V ใกล้ปั๊ม เพื่อรองรับกระแสกระชาก
- (แนะนำ) ใช้ออปโตคัปเปลอร์หรือโมดูลรีเลย์แบบแยกไฟ เพื่อกันสัญญาณรบกวนจากปั๊มกลับเข้า ESP32

**ขั้นที่ 4 — งบกระแสรวม:** $2 + 0.5 + 0.045 \approx 2.55\text{ A}$ → เผื่อ 30% และเผื่อ inrush ปั๊ม → เลือกอะแดปเตอร์ **12 V อย่างน้อย 4–5 A**

**ขั้นที่ 5 — โครงสร้างโค้ด (Skeleton)**

```cpp
const int PUMP = 25;     // ขับ MOSFET ปั๊ม
const int VALVE = 26;    // ขับ MOSFET วาล์ว
const int LED_OK = 18, LED_WATERING = 19, LED_ERR = 21;

void setup() {
  pinMode(PUMP, OUTPUT);  pinMode(VALVE, OUTPUT);
  pinMode(LED_OK, OUTPUT); pinMode(LED_WATERING, OUTPUT); pinMode(LED_ERR, OUTPUT);
  digitalWrite(LED_OK, HIGH);           // ระบบพร้อม
}

void startWatering() {
  digitalWrite(VALVE, HIGH);  delay(200);  // เปิดวาล์วก่อน
  digitalWrite(PUMP, HIGH);                 // แล้วค่อยเปิดปั๊ม
  digitalWrite(LED_WATERING, HIGH);
}

void stopWatering() {
  digitalWrite(PUMP, LOW);   delay(200);    // ปิดปั๊มก่อน
  digitalWrite(VALVE, LOW);                  // แล้วค่อยปิดวาล์ว
  digitalWrite(LED_WATERING, LOW);
}

void loop() {
  startWatering();  delay(5000);   // รดน้ำ 5 วินาที
  stopWatering();   delay(10000);  // เว้น 10 วินาที (จริงควรอิงเซนเซอร์ความชื้นดิน)
}
```

> 💡 **ลำดับการเปิด-ปิดสำคัญ:** เปิดวาล์วก่อนเปิดปั๊ม และปิดปั๊มก่อนปิดวาล์ว เพื่อลดการกระแทกของแรงดันน้ำ (Water Hammer) ที่อาจทำให้ท่อหรือข้อต่อเสียหาย — เป็นหลักการเดียวกับงานระบบท่อในงานวิศวกรรมเครื่องกล

---

### สรุปบทที่ 3 (Summary)

- ตัวกระทำ (Actuator) แปลงสัญญาณไฟฟ้าเป็นการกระทำทางกายภาพ: แสง เสียง การหมุน การเคลื่อนที่เชิงเส้น
- มอเตอร์ DC ทำงานตามฟิสิกส์ $\tau = k_t I$ และ $V = I R_m + k_e \omega$ → แรงบิดขึ้นกับกระแส และกระแสสตาร์ท (Stall) สูงสุดเพราะยังไม่มี Back-EMF
- ESP32 จ่ายกระแสจาก GPIO ได้จำกัด (~12 mA) จึงต้องใช้ **วงจรขับ** (ทรานซิสเตอร์, MOSFET, โมดูลรีเลย์, มอเตอร์ไดรเวอร์) สำหรับโหลดที่กินกระแสมาก โดยคำนวณค่า $R_B$ ของทรานซิสเตอร์จากสภาวะอิ่มตัว และใช้ MOSFET แบบ **logic-level** กับ ESP32
- โหลดเหนี่ยวนำ (ขดลวด) **ต้องมีไดโอด Flyback** เพื่อป้องกันแรงดันย้อน
- แหล่งจ่ายหลายตัว **ต้องต่อ GND ร่วมกัน**
- PWM ใช้ควบคุมพลังงานเฉลี่ย ($V_{avg} = D \times V_{supply}$): ความสว่าง LED และความเร็วมอเตอร์ DC
- **เซอร์โว** ควบคุม "มุม" ด้วยความกว้างพัลส์ (1–2 ms ที่ 50 Hz) ผ่านระบบป้อนกลับวงปิดภายใน
- **สเต็ปเปอร์** หมุนทีละสเต็ปด้วยการกระตุ้นขดลวดตามลำดับ ควบคุมตำแหน่งแบบวงเปิดได้แม่นยำ
- ต้องประเมิน **กำลังสูญเสียและความร้อน** ($T_j = T_a + P R_{\theta JA}$) และจัดงบกระแส/แหล่งจ่ายให้เผื่อกระแสพีค
- เลือกวงจรขับโดยพิจารณา: กระแส แรงดัน ชนิดโหลด และความต้องการควบคุมทิศทาง

---

### แบบฝึกหัดท้ายบท (Exercises)

**ข้อ 1:** จงอธิบายความแตกต่างระหว่าง Sensor กับ Actuator พร้อมยกตัวอย่างอย่างละ 3 ชนิดที่ใช้ในงานวิศวกรรมเครื่องกล

**ข้อ 2:** มอเตอร์ DC ตัวหนึ่งใช้แรงดัน 12 V กินกระแส 800 mA ถ้านักศึกษาต่อ GPIO ของ ESP32 เข้ากับมอเตอร์โดยตรง จะเกิดอะไรขึ้น? ควรใช้วงจรขับแบบใด?

**ข้อ 3:** จงวาดวงจรขับรีเลย์ 5 V ด้วยทรานซิสเตอร์ NPN โดยมีองค์ประกอบครบถ้วน (ตัวต้านทาน Base, ไดโอด Flyback, แหล่งจ่าย, ESP32 GPIO) พร้อมระบุค่าอุปกรณ์

**ข้อ 4:** เหตุใดจึงต้องต่อไดโอด Flyback ขนานกลับขั้วกับขดลวดรีเลย์? จะเกิดอะไรขึ้นถ้าไม่ต่อ?

**ข้อ 5:** เซอร์โว SG90 ใช้สัญญาณ PWM ความถี่เท่าไร? ความกว้างพัลส์ 1 ms, 1.5 ms, 2 ms ให้มุมประมาณเท่าไร?

**ข้อ 6:** จงเปรียบเทียบข้อดี-ข้อเสียของการใช้ **ทรานซิสเตอร์ BJT** กับ **MOSFET** ในการขับโหลด โดยพิจารณาด้านกระแสขับ Gate/Base การสูญเสียพลังงาน และความเหมาะสมกับขนาดโหลด

**ข้อ 7 (Wokwi):** เขียนโปรแกรม ESP32 บน Wokwi ให้ LED 3 ดวง (แดง เหลือง เขียว) กะพริบสลับกันแบบสัญญาณไฟจราจร (เขียว 5 วิ → เหลือง 2 วิ → แดง 5 วิ → วนซ้ำ) พร้อมวาดแผนผังวงจร

**ข้อ 8 (คิดวิเคราะห์):** ระบบรดน้ำอัตโนมัติต้องการควบคุมอุปกรณ์ต่อไปนี้จาก ESP32: ปั๊มน้ำ 12 V/2 A, วาล์วโซลินอยด์ 12 V/500 mA, และ LED แสดงสถานะ 3 ดวง จงเลือกวงจรขับสำหรับแต่ละอุปกรณ์พร้อมให้เหตุผล และระบุว่าอุปกรณ์ใดต้องมีไดโอด Flyback

**ข้อ 9 (คำนวณ):** ต้องการขับรีเลย์ที่กินกระแส 120 mA ด้วยทรานซิสเตอร์ NPN ที่มี $\beta = 80$ ผ่านขา GPIO 3.3 V โดยเผื่อ overdrive factor 4 เท่า จงคำนวณค่าตัวต้านทาน Base ($R_B$) ที่เหมาะสม (กำหนด $V_{BE} = 0.7\text{ V}$) และเลือกค่ามาตรฐานที่ใกล้เคียง

**ข้อ 10 (คำนวณ):** มอเตอร์ DC ขับด้วย PWM duty cycle 60% จากแหล่งจ่าย 12 V จงหาแรงดันเฉลี่ยที่มอเตอร์ได้รับ และถ้าต้องการความละเอียดในการปรับความเร็ว 1024 ระดับ ต้องตั้งความละเอียด PWM กี่บิต?

**ข้อ 11 (เซอร์โว):** จงอธิบายว่าทำไมเซอร์โวจึงจัดเป็นระบบควบคุมแบบ "วงปิด (Closed-loop)" ในขณะที่สเต็ปเปอร์มอเตอร์ทั่วไปเป็นแบบ "วงเปิด (Open-loop)" และยกตัวอย่างงานที่เหมาะกับแต่ละชนิด

**ข้อ 12 (สเต็ปเปอร์):** สเต็ปเปอร์มอเตอร์ตัวหนึ่งมี Step Angle = 1.8° จงหาว่าต้องส่งพัลส์กี่ครั้งจึงจะหมุนได้ครบ 3 รอบ และถ้าขับด้วยโหมด Half-step จำนวนพัลส์จะเปลี่ยนเป็นเท่าใด

**ข้อ 13 (ความร้อน):** MOSFET ตัวหนึ่งมี $R_{DS(on)} = 0.04\ \Omega$ ขับโหลด 4 A จงคำนวณกำลังสูญเสียในตัว MOSFET และถ้า $R_{\theta JA} = 62\text{ °C/W}$ ที่อุณหภูมิห้อง 30 °C จงประเมินอุณหภูมิจุดต่อ ($T_j$) และวิเคราะห์ว่าจำเป็นต้องติดฮีตซิงก์หรือไม่
