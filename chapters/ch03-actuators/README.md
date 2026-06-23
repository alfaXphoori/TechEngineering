# Chapter 3: ตัวกระทำและการเชื่อมต่อ (Actuators & Interfacing)
## Actuators & Interfacing

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

ในบทนี้เราจะเรียนรู้ประเภทของตัวกระทำ วงจรขับ (Driver Circuit) และหลักการป้องกันวงจร ซึ่งเป็นพื้นฐานสำคัญก่อนนำไปใช้ในโปรเจกต์ IoT จริง

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

**MOSFET (เช่น IRLZ44N, logic-level)** — ใช้แรงดัน Gate สั่งเปิด-ปิด ข้อดีคือ Gate แทบไม่กินกระแส ทนกระแส Drain ได้สูง (หลายสิบแอมป์) เหมาะกับโหลดใหญ่

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

### สรุปบทที่ 3 (Summary)

- ตัวกระทำ (Actuator) แปลงสัญญาณไฟฟ้าเป็นการกระทำทางกายภาพ: แสง เสียง การหมุน การเคลื่อนที่เชิงเส้น
- ESP32 จ่ายกระแสจาก GPIO ได้จำกัด (~12 mA) จึงต้องใช้ **วงจรขับ** (ทรานซิสเตอร์, MOSFET, โมดูลรีเลย์, มอเตอร์ไดรเวอร์) สำหรับโหลดที่กินกระแสมาก
- โหลดเหนี่ยวนำ (ขดลวด) **ต้องมีไดโอด Flyback** เพื่อป้องกันแรงดันย้อน
- แหล่งจ่ายหลายตัว **ต้องต่อ GND ร่วมกัน**
- PWM ใช้ควบคุมพลังงานเฉลี่ย: ความสว่าง LED ความเร็วมอเตอร์ และมุมเซอร์โว
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
