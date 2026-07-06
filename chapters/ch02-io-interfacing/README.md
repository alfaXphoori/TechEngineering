# Chapter 2: การเชื่อมต่อสัญญาณดิจิทัลและแอนะล็อก
## Digital & Analog Signal Interfacing

> บทนี้จะอธิบายวิธีการที่ไมโครคอนโทรลเลอร์ (เช่น Arduino Uno R3) ใช้ในการเชื่อมต่อและรับ-ส่งสัญญาณกับอุปกรณ์ภายนอก ทั้งสัญญาณดิจิทัล (Digital) และสัญญาณแอนะล็อก (Analog) รวมถึงมาตรฐานโปรโตคอลการสื่อสารอนุกรมเบื้องต้น

---

## 2.1 สัญญาณดิจิทัลและสัญญาณแอนะล็อกคืออะไร? (Understanding Analog and Digital Signals)

ในการประยุกต์ใช้งานระบบวัดและควบคุมทางวิศวกรรม ข้อมูลหรือปริมาณทางกายภาพในโลกจริงจะถูกแปลงเป็นสัญญาณไฟฟ้า ซึ่งไมโครคอนโทรลเลอร์สามารถอ่านหรือประมวลผลสัญญาณได้ใน 2 รูปแบบหลักคือ สัญญาณแอนะล็อก (Analog) และสัญญาณดิจิทัล (Digital)

### 2.1.1 สัญญาณแอนะล็อก (Analog Signal)

- มีค่าต่อเนื่อง (Continuous) เช่น 0.00 V, 1.25 V, 2.73 V
- Arduino Uno มี ADC (Analog-to-Digital Converter) ขนาด 10 บิต แปลงแรงดัน 0–5 V เป็นค่าดิจิทัล 0–1023
- ขาที่ใช้ได้: ขา A0 ถึง A5 (บนบอร์ดจริง หรือในระบบจำลอง Tinkercad)

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 700 120" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1; rx: 8px; }
    .mcu { fill: #faf5ff; stroke: #a78bfa; stroke-width: 2; rx: 8px; }
    .sensor { fill: #eff6ff; stroke: #60a5fa; stroke-width: 2; rx: 8px; }
    .wire-bg { fill: none; stroke: #cbd5e1; stroke-width: 2; }
    .wire-flow { fill: none; stroke: #3b82f6; stroke-width: 3; stroke-dasharray: 200; stroke-linecap: round; animation: analogFlow 3s linear infinite; }
    .pulse-dot { fill: #ef4444; }
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-family: monospace; font-size: 11px; fill: #7c3aed; font-weight: bold; }
    @keyframes analogFlow {
      0% { stroke-dashoffset: 200; }
      100% { stroke-dashoffset: 0; }
    }
  </style>
  <rect x="5" y="5" width="690" height="110" class="bg"/>
  <rect x="20" y="20" width="130" height="70" class="sensor"/>
  <text x="85" y="45" class="text-main" text-anchor="middle">เซนเซอร์แอนะล็อก</text>
  <text x="85" y="62" class="text-sub" text-anchor="middle">(เช่น LM35, LDR)</text>
  <text x="85" y="78" class="text-sub" text-anchor="middle" fill="#2563eb" font-weight="bold">แรงดันต่อเนื่อง (V)</text>
  <rect x="505" y="15" width="175" height="80" class="mcu"/>
  <text x="592.5" y="37" class="text-main" text-anchor="middle">Arduino Uno (ขา A0)</text>
  <text x="592.5" y="55" class="text-sub" text-anchor="middle">อ่านค่าแอนะล็อก 10 บิต</text>
  <text x="592.5" y="75" class="text-code" text-anchor="middle">analogRead(A0) ➔ 0-1023</text>
  <path d="M 150 55 C 230 15, 270 95, 340 55 C 410 15, 450 95, 505 55" class="wire-bg"/>
  <path id="analogPath" d="M 150 55 C 230 15, 270 95, 340 55 C 410 15, 450 95, 505 55" class="wire-flow"/>
  <circle r="5" class="pulse-dot">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#analogPath"/>
    </animateMotion>
  </circle>
  <text x="340" y="100" class="text-sub" text-anchor="middle" fill="#475569">สัญญาณแรงดันเปลี่ยนแปลงต่อเนื่องตามปริมาณกายภาพ</text>
</svg>
</div>

**ตัวอย่างการอ่านค่าแอนะล็อก (Tinkercad Circuits — บอร์ด Arduino Uno):**

```cpp
const int sensorPin = A0; // ขาแอนะล็อก A0

void setup() {
  Serial.begin(9600); // เริ่มต้นใช้งาน Serial Monitor (9600 bps คือความเร็วเริ่มต้นของ Tinkercad)
}

void loop() {
  int rawValue = analogRead(sensorPin); // อ่านค่าดิบได้ในช่วง 0-1023 (10 บิต)
  float voltage = rawValue * (5.0 / 1023.0); // แปลงเป็นแรงดันจริงโดยอิงแรงดันอ้างอิง 5V ของบอร์ด
  Serial.print("Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.println(voltage, 2);
  delay(1000);
}
```


### 2.1.2 สัญญาณดิจิทัล (Digital Signal)

สัญญาณดิจิทัลไม่มีความต่อเนื่องเหมือนสัญญาณแอนะล็อก แต่จะมีสถานะที่จำกัดและชัดเจน โดยทั่วไปในระดับลอจิก (Logic Levels) ของไมโครคอนโทรลเลอร์จะแบ่งออกเป็น 2 สถานะหลัก:

*   **HIGH (ลอจิก 1):** สำหรับ Arduino Uno คือแรงดันไฟฟ้าประมาณ $5\text{ V}$ (ทางไฟฟ้ากำหนดเกณฑ์รับเข้าไว้ว่าแรงดันที่สูงกว่าประมาณ $3.0\text{ V}$ ขึ้นไป จะถือว่าเป็น HIGH)
*   **LOW (ลอจิก 0):** สำหรับ Arduino Uno คือแรงดันไฟฟ้าประมาณ $0\text{ V}$ (ทางไฟฟ้ากำหนดเกณฑ์ไว้ว่าแรงดันที่ต่ำกว่าประมาณ $1.5\text{ V}$ ลงมา จะถือว่าเป็น LOW)

การรับสัญญาณดิจิทัลจากเซนเซอร์แบ่งออกเป็น 2 รูปแบบหลักตามลักษณะของข้อมูล:

#### 1. สัญญาณดิจิทัลตรง (Direct Digital High/Low Input)
เป็นเซนเซอร์ที่ส่งระดับแรงดัน $HIGH$ หรือ $LOW$ เพื่อแจ้งเหตุการณ์หรือสถานะโดยตรง (ไม่ต้องใช้โปรโตคอลซับซ้อน) โดยไมโครคอนโทรลเลอร์ใช้คำสั่ง `digitalRead()` อ่านค่าได้เลย
*   **เซนเซอร์ตรวจจับความเคลื่อนไหว (PIR Sensor):** ส่ง $HIGH$ เมื่อพบการเคลื่อนไหว และส่ง $LOW$ เมื่อไม่มี
*   **เซนเซอร์ตรวจจับสิ่งกีดขวางอินฟราเรด (IR Obstacle Sensor):** ส่ง $LOW$ เมื่อตรวจพบวัตถุสะท้อนแสงกลับ และส่ง $HIGH$ เมื่อทางสะดวก
*   **สวิตช์ปุ่มกด (Push Button Switch):** ส่งสัญญาณลอจิกเปลี่ยนไปเมื่อปุ่มโดนกด

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 700 120" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1; rx: 8px; }
    .mcu { fill: #faf5ff; stroke: #a78bfa; stroke-width: 2; rx: 8px; }
    .sensor { fill: #eff6ff; stroke: #60a5fa; stroke-width: 2; rx: 8px; }
    .wire-bg { fill: none; stroke: #cbd5e1; stroke-width: 2; }
    .wire-flow { fill: none; stroke: #10b981; stroke-width: 3; stroke-dasharray: 200; stroke-linecap: round; animation: digitalFlow 2s linear infinite; }
    .pulse-square { fill: #ef4444; }
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-family: monospace; font-size: 11px; fill: #7c3aed; font-weight: bold; }
    @keyframes digitalFlow {
      0% { stroke-dashoffset: 200; }
      100% { stroke-dashoffset: 0; }
    }
  </style>
  <rect x="5" y="5" width="690" height="110" class="bg"/>
  <rect x="20" y="20" width="130" height="70" class="sensor"/>
  <text x="85" y="45" class="text-main" text-anchor="middle">เซนเซอร์ดิจิทัลตรง</text>
  <text x="85" y="62" class="text-sub" text-anchor="middle">(เช่น PIR, IR)</text>
  <text x="85" y="78" class="text-sub" text-anchor="middle" fill="#059669" font-weight="bold">HIGH (5V) / LOW (0V)</text>
  <rect x="505" y="15" width="175" height="80" class="mcu"/>
  <text x="592.5" y="37" class="text-main" text-anchor="middle">Arduino Uno (Pin 2)</text>
  <text x="592.5" y="55" class="text-sub" text-anchor="middle">อ่านค่าสถานะดิจิทัลตรง</text>
  <text x="592.5" y="75" class="text-code" text-anchor="middle">digitalRead(2) ➔ 1 / 0</text>
  <path d="M 150 75 L 210 75 L 210 35 L 280 35 L 280 75 L 350 75 L 350 35 L 420 35 L 420 75 L 505 75" class="wire-bg"/>
  <path id="digitalPath" d="M 150 75 L 210 75 L 210 35 L 280 35 L 280 75 L 350 75 L 350 35 L 420 35 L 420 75 L 505 75" class="wire-flow"/>
  <circle r="5" class="pulse-square">
    <animateMotion dur="2s" repeatCount="indefinite">
      <mpath href="#digitalPath"/>
    </animateMotion>
  </circle>
  <text x="340" y="100" class="text-sub" text-anchor="middle" fill="#475569">สัญญาณเปลี่ยนสถานะสลับพัลส์เหลี่ยม HIGH หรือ LOW ทันทีตามสถานะ</text>
</svg>
</div>



---

## 2.2 Digital I/O: ลอจิก HIGH/LOW

### 2.2.1 ระดับแรงดันของ Arduino Uno

Arduino Uno ทำงานที่แรงดันลอจิก **5 V** เป็นหลัก

| สถานะลอจิก | ระดับแรงดัน Arduino Uno | ความหมาย |
|---|---|---|
| **HIGH** (1) | ≈ 5.0 V | เปิด / จริง (True) |
| **LOW** (0) | ≈ 0 V (GND) | ปิด / เท็จ (False) |

ขา GPIO (General Purpose Input/Output) แต่ละขาสามารถตั้งเป็น **INPUT** (รับสัญญาณเข้า) หรือ **OUTPUT** (ส่งสัญญาณออก) ได้ผ่านฟังก์ชัน `pinMode()`

### 2.2.2 ปัญหาสัญญาณลอย (Floating) และโครงสร้างพูลอัป / พูลดาวน์ภายใน

เมื่อตั้งค่าขา GPIO เป็น `INPUT` แล้วไม่ได้เชื่อมต่อเข้ากับแรงดันอ้างอิงใด ๆ (ปล่อยทิ้งไว้โดยไม่มีสายหรือเชื่อมกับปุ่มกดที่ยังไม่ได้ถูกกด) ขานั้นจะอยู่ในสถานะ **ลอย (Floating)** หรือสภาวะความต้านทานสูงมาก (High-Impedance: Hi-Z) ส่งผลให้ขานั้นมีความไวต่อคลื่นแม่เหล็กไฟฟ้ารบกวนรอบตัวและไฟฟ้าสถิต ทำให้อ่านค่าลอจิกได้แกว่งสุ่มระหว่าง HIGH และ LOW ส่งผลให้โปรแกรมทำงานผิดพลาดหรือประมวลผลเพี้ยน

**วิธีแก้ไข:** คือการใช้ตัวต้านทานเพื่อดึงแรงดันอ้างอิงให้มีสถานะเริ่มต้นที่ชัดเจน (Pull-Up หรือ Pull-Down)

- **Pull-up (พูลอัป)**: ต่อตัวต้านทานจากขา GPIO ไปยัง 5 V → สัญญาณปกติถูกดึงไว้เป็น HIGH เมื่อปิดสวิตช์ (กดปุ่ม) กระแสจะไหลลงกราวด์ ทำให้สถานะเปลี่ยนเป็น LOW
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

#### โครงสร้างวงจรภายใน GPIO ของ Arduino Uno
ชิปไมโครคอนโทรลเลอร์ ATmega328P บนบอร์ด Arduino Uno ได้ออกแบบโครงสร้างวงจรดิจิทัลอินพุตไว้ภายในแต่ละพิน เพื่ออำนวยความสะดวกแก่นักพัฒนาและลดการใช้งานอุปกรณ์ภายนอก โดยมีรายละเอียดดังนี้:

1. **ตัวต้านทานพูลอัปภายใน (Internal Pull-up)**:
   - ประกอบด้วยตัวต้านทานภายในขนาดประมาณ **20 kΩ ถึง 50 kΩ** ต่อพ่วงกับแหล่งจ่ายไฟหลัก $V_{CC}$ (5V) บอร์ด Arduino Uno **ไม่มีตัวต้านทานพูลดาวน์ภายใน (Internal Pull-down)** ดังนั้นหากต้องการใช้พูลดาวน์ จะต้องต่อตัวต้านทานภายนอกเอง
   - เมื่อเราเขียนโค้ด `pinMode(pin, INPUT_PULLUP)` จะเป็นการสั่งเปิดใช้งานสวิตช์ภายในเพื่อเชื่อมต่อขาพินกับตัวต้านทานพูลอัปนี้ ดึงศักย์แรงดันของขาพินขึ้นไปที่ 5V ทันที ป้องกันปัญหาสัญญาณลอย
2. **สภาวะต้านทานสูงมาก (High-Impedance: Hi-Z)**:
   - หากเราตั้งค่าพินเป็น `INPUT` เฉย ๆ โดยไม่เปิดใช้คุณสมบัติพูลอัป ขาพินจะกลายเป็นพอร์ตวัดแรงดันที่มีความต้านทานขาเข้าสูงเป็นพิเศษ (มากกว่า 100 MΩ) ศักย์ไฟฟ้าบนพินจึงไวต่อสัญญาณรบกวนและสนามไฟฟ้าโดยรอบ เป็นเหตุที่ทำให้สัญญาณสั่นและลอย (Floating)
3. **Schmitt Trigger**:
   - สัญญาณไฟฟ้าทางอินพุต ก่อนที่จะป้อนเข้าสู่รีจิสเตอร์ดิจิทัลเพื่อให้อ่านค่าได้ จะต้องผ่านวงจรเปรียบเทียบที่มีคุณสมบัติ Hysteresis เรียกว่า **Schmitt Trigger** เพื่อแปลงขอบสัญญาณที่ลาดเอียงหรือสัญญาณรบกวน ให้เปลี่ยนเป็นระดับลอจิก HIGH และ LOW ที่คมชัดและแน่นอน
4. **ความแตกต่างและข้อจำกัดระหว่างพูลอัปภายในกับภายนอก**:
   - ตัวต้านทานพูลอัปภายในของ Arduino Uno มีค่าประมาณ 20 kΩ ซึ่งจ่ายกระแสพูลอัปได้น้อย เหมาะสำหรับการเชื่อมต่อสวิตช์ปุ่มกดทั่วไปที่ทำงานด้วยความเร็วต่ำ
   - สำหรับการสื่อสารความเร็วสูง เช่น บัส I2C หรือ One-Wire ที่มีประจุไฟฟ้าปรสิตสะสมในสายส่งค่อนข้างมาก ตัวต้านทานพูลอัปภายในจะดึงแรงดันกลับขึ้นมาเป็น HIGH ได้ช้าเกินไป ทำให้อัตราเร็วการส่งข้อมูลลดลง นักพัฒนาจึงจำเป็นต้องเชื่อมต่อตัวต้านทานพูลอัปภายนอก (External Pull-up) ที่มีความต้านทานต่ำกว่า เช่น **4.7 kΩ** หรือ **10 kΩ** เพื่อปรับปรุงขอบขาขึ้นของสัญญาณให้คมชัดขึ้น

> 💡 **เคล็ดลับ:** เมื่อใช้ `INPUT_PULLUP` กับปุ่มกด สถานะจะ **กลับด้าน** — ปุ่มไม่ถูกกด = HIGH, ปุ่มถูกกด = LOW เพราะปุ่มจะดึงสัญญาณลง GND

### 2.2.3 ตัวอย่างโค้ด: อ่านปุ่มกดเปิด-ปิด LED

```cpp
// อ่านปุ่มกด (Push Button) ด้วย INPUT_PULLUP แล้วสั่งเปิด-ปิด LED
// จำลองบน Tinkercad: Arduino Uno + LED + Push Button

const int BUTTON_PIN = 2;   // ขาที่ต่อปุ่มกด (สวิตช์)
const int LED_PIN    = 3;   // ขาที่ต่อ LED

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP); // เปิดใช้งาน pull-up ภายใน
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600); // 9600 bps สำหรับ Tinkercad
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);

  if (buttonState == LOW) {        // กดปุ่มสวิตช์ดึงสัญญาณลง GND → LOW
    digitalWrite(LED_PIN, HIGH);   // เปิด LED
    Serial.println("Button PRESSED -> LED ON");
  } else {
    digitalWrite(LED_PIN, LOW);    // ปิด LED
  }
  delay(50); // หน่วงเวลาสั้น ๆ เพื่อช่วยแก้ปัญหาสัญญาณกระเด้งเบื้องต้น
}
```

### 2.2.4 GPIO Interrupts & Debouncing (การจัดการขัดจังหวะและการลดสัญญาณกระเด้ง)

ในบทเรียนที่ผ่านมา เราอ่านสถานะอินพุตด้วยฟังก์ชัน `digitalRead()` แบบ **Polling** (การวนลูปตรวจจับค่าทุก ๆ รอบ) วิธีนี้มีข้อเสียสำคัญคือ หาก CPU กำลังทำงานหนักหรือมีคำสั่งหน่วงเวลายาวนาน เช่น `delay(1000)` ตัวโปรแกรมอาจไม่พบสัญญาณของการกดปุ่มในช่วงเวลาดังกล่าว

เพื่อแก้ไขปัญหานี้ ไมโครคอนโทรลเลอร์จึงสนับสนุนระบบ **อินเทอร์รัปต์ (Interrupt)** ซึ่งเสมือน "ปุ่มกระดิ่งฉุกเฉิน" ที่ส่งสัญญาณตรงไปยัง CPU หลัก เพื่อขอให้หยุดประมวลผลงานปัจจุบันชั่วคราว แล้วหันมารันโค้ดตอบรับเหตุการณ์นั้นทันทีก่อนจะกลับไปรันงานเดิมต่อ

#### ฟังก์ชันบริการอินเทอร์รัปต์ (Interrupt Service Routine: ISR)
ฟังก์ชันที่ถูกเรียกเมื่อเกิดสัญญาณอินเทอร์รัปต์เรียกว่า **ISR** ซึ่งมีข้อกำหนดและกฎเกณฑ์ในการเขียนดังนี้:
1. **ต้องทำงานได้รวดเร็วมาก**: ควรเป็นคำสั่งสั้น ๆ เช่นการอัปเดตหรือสลับค่าตัวแปรระดับโกลบอล
2. **ห้ามใช้คำสั่งบล็อกเวลาหรือคำสั่งที่ช้า**: ห้ามใช้ `delay()` หรือ `Serial.println()` ภายใน ISR เด็ดขาด เพราะอาจทำให้ระบบค้างเนื่องจากการขัดจังหวะทำงานร่วมกับระบบส่งถ่ายข้อมูลอนุกรมไม่ได้
3. **ใช้คีย์เวิร์ด `volatile`**: ตัวแปรระดับโกลบอลใด ๆ ที่เปลี่ยนค่าใน ISR และใช้ใน `loop()` ต้องประกาศนำหน้าด้วยคีย์เวิร์ด `volatile` เพื่อบอกคอมไพเลอร์ไม่ให้นำตัวแปรไปเก็บไว้ในแคชรีจิสเตอร์ของ CPU ช่วยการันตีความถูกต้องของข้อมูลข้ามบริบทการทำงาน

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
// จำลองบน Tinkercad: Arduino Uno (อินเทอร์รัปต์ภายนอกรองรับเฉพาะ Pin 2 และ Pin 3)
const int BUTTON_PIN = 2;    // ขาปุ่มกด (Pin 2 ทริกเกอร์ขัดจังหวะ INT0)
const int LED_PIN    = 3;    // ขา LED

volatile int pressCount = 0;      // ตัวแปรนับจำนวนการกด (ต้องใช้ volatile)
volatile bool ledState = false;    // สถานะไฟ LED
volatile unsigned long lastDebounceTime = 0; // เก็บเวลาการกดปุ่มครั้งล่าสุด (ms)
const unsigned long DEBOUNCE_DELAY = 200;    // กำหนดระยะเวลากรองสัญญาณกระเด้ง 200 ms

// ฟังก์ชันสำหรับ ISR (ไม่ต้องใส่ IRAM_ATTR สำหรับ Arduino Uno)
void handleButtonPress() {
  unsigned long currentTime = millis();
  
  // ตรวจสอบว่าพัลส์นี้อยู่ห่างจากเวลาในการกดครั้งก่อนเกินช่วงหน่วงเวลา debounce หรือไม่
  if (currentTime - lastDebounceTime > DEBOUNCE_DELAY) {
    pressCount++;                  // เพิ่มจำนวนนับ
    ledState = !ledState;          // สลับสถานะไฟ LED
    digitalWrite(LED_PIN, ledState);
    lastDebounceTime = currentTime; // อัปเดตเวลาการกดล่าสุด
  }
}

void setup() {
  Serial.begin(9600); // ความเร็ว 9600 bps สำหรับ Tinkercad
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  
  // แนบการทริกเกอร์ขอบขาลง FALLING (ปุ่มกดทำงานแบบ Active-Low)
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), handleButtonPress, FALLING);
  Serial.println("--- Interrupt & Debounce System Ready ---");
}

void loop() {
  // พิมพ์ข้อมูลผ่าน Serial Monitor ที่ห้ามเรียกใช้ใน ISR
  static int lastCount = 0;
  if (pressCount != lastCount) {
    lastCount = pressCount;
    Serial.print("Interrupt triggered! Count: ");
    Serial.println(lastCount);
  }
}
```

---

## 2.3 ADC (Analog-to-Digital Converter)

### 2.3.1 หลักการทำงาน: สุ่มตัวอย่างและควอนไทซ์

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

### 2.3.2 เปรียบเทียบความละเอียดบิตของระบบ

Arduino Uno มี ADC ความละเอียด **10 บิต (10-bit)** หมายความว่า:

- จำนวนระดับ = 2¹⁰ = **1,024 ระดับ** (ค่า 0 ถึง 1,023)
- ช่วงแรงดันอ้างอิง (Reference Voltage) ≈ 0 – 5.0 V

| พารามิเตอร์ | Arduino Uno | ESP32 |
|---|---|---|
| ความละเอียด ADC | 10 บิต (0–1023) | 12 บิต (0–4095) |
| แรงดันอ้างอิง | 5.0 V | 3.3 V / 1.1 V |
| ความละเอียดต่อขั้น | ≈ 4.88 mV | ≈ 0.80 mV |

### 2.3.3 สูตรแปลงค่า ADC เป็นแรงดัน

```
V_actual = (ADC_value / ADC_max) × V_ref
```

สำหรับ Arduino Uno:

```
V_actual = (ADC_value / 1023.0) × 5.0
```

ตัวอย่าง: อ่านค่าได้ 512 → แรงดัน ≈ (512 / 1023) × 5.0 ≈ **2.50 V**

### 2.3.4 ตัวอย่างโค้ด: อ่านค่าจาก Potentiometer

```cpp
// อ่านค่า Potentiometer ผ่าน ADC แล้วแปลงเป็นแรงดัน
// จำลองบน Tinkercad: Arduino Uno + Potentiometer ต่อขา A0

const int POT_PIN = A0;  // ขา ADC (ขาอนาล็อก A0)

void setup() {
  Serial.begin(9600);
  // ขา ADC ไม่ต้องตั้ง pinMode เป็น INPUT ก็ได้ (เป็นค่าปริยาย)
}

void loop() {
  int adcValue = analogRead(POT_PIN);  // อ่านค่า 0–1023

  // แปลงเป็นแรงดัน (V)
  float voltage = (adcValue / 1023.0) * 5.0;

  Serial.print("ADC: ");
  Serial.print(adcValue);
  Serial.print("  |  Voltage: ");
  Serial.print(voltage, 2);  // แสดง 2 ตำแหน่งทศนิยม
  Serial.println(" V");

  delay(500);
}
```

> 💡 **หมายเหตุสำคัญ:** บน Arduino Uno ขา A0 ถึง A5 เป็นขาอินพุตแอนะล็อกเฉพาะทาง ไม่สามารถตั้งเป็น OUTPUT ได้ แต่เหมาะสำหรับอ่าน ADC เพราะไม่มีวงจรไดรเวอร์ดิจิทัลเอาต์พุตภายในรบกวนสัญญาณแอนะล็อก

### 2.3.5 ความเป็นเชิงเส้นและความเที่ยงตรงของ ADC บน Arduino Uno

ต่างจากไมโครคอนโทรลเลอร์ความเร็วสูงบางรุ่น (เช่น ESP32) ที่มักมีปัญหาความไม่เป็นเชิงเส้น (Non-linearity) ของสัญญาณบริเวณปลายย่านแรงดันต่ำและแรงดันสูง (เกิด Dead Zone และ Saturation Zone) ชิปแปลงสัญญาณ ADC ภายในบอร์ด **Arduino Uno R3** นั้นทำหน้าที่ได้อย่างมีประสิทธิภาพและมีความสอดคล้องเป็นเชิงเส้นตรง (Linear) ที่ดีเยี่ยมตลอดช่วงแรงดันวัด $0\text{–}5\text{ V}$

**แนวทางเพิ่มความแม่นยำในการวัดเชิงวิศวกรรม:**
1. **การสอบเทียบแรงดันอ้างอิง (Reference Calibration):** โดยปกติสูตรคำนวณจะอิงแรงดันไฟเลี้ยงบอร์ดคงที่ที่ $5.0\text{ V}$ ทว่าในการต่อจริงผ่านพอร์ต USB โน้ตบุ๊ก แรงดันไฟเลี้ยง 5V จริงอาจจะเบี่ยงเบนไปเป็น $4.85\text{ V}$ หรือ $5.12\text{ V}$ ได้ วิธีการแก้ไขคือใช้มัลติมิเตอร์วัดระดับแรงดันที่ขา 5V จริงของ Arduino แล้วนำค่านั้นมาใส่แทนเลข `5.0` ในสมการโค้ดของท่าน
2. **การอ้างอิงแรงดันคงที่ภายนอก (AREF):** หากต้องการวัดความต่างศักย์ขนาดเล็กมาก ๆ เช่นต่ำกว่า 1V อย่างแม่นยำสูง เราสามารถต่อแหล่งจ่ายแรงดันคงที่อ้างอิงภายนอกเข้าที่ขา **AREF** และเรียกฟังก์ชัน `analogReference(EXTERNAL)` เพื่อปรับขอบช่วงความละเอียดให้แคบลงและลดเสียงรบกวนได้

## 2.4 PWM (Pulse Width Modulation)

### 2.4.1 หลักการ Duty Cycle และความถี่

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

### 2.4.2 การเอาต์พุตสัญญาณ PWM บน Arduino Uno

ไมโครคอนโทรลเลอร์ Arduino Uno R3 สามารถสร้างเอาต์พุตสัญญาณ PWM (มอดูเลตความกว้างพัลส์) ได้ง่ายดายโดยการใช้คำสั่งมาตรฐาน `analogWrite(pin, value)` บนขาที่รองรับเอาต์พุต PWM (พินที่มีเครื่องหมาย ~ นำหน้า ได้แก่ **Pin 3, 5, 6, 9, 10, 11**)
*   `analogWrite(pin, value)` สั่งจ่ายสัญญาณเอาต์พุตโดยที่ค่า `value` อยู่ในช่วง **0 ถึง 255** (ความละเอียด 8 บิต)
*   ค่า `0` หมายถึงสัดส่วนเวลาทำงาน (Duty Cycle) = 0% (เทียบเท่าแรงดันเฉลี่ย 0V)
*   ค่า `255` หมายถึงสัดส่วนเวลาทำงาน (Duty Cycle) = 100% (เทียบเท่าแรงดันเฉลี่ย 5.0V)

### 2.4.3 ตัวอย่างโค้ด: หรี่และเร่งความสว่างไฟ LED ด้วย PWM (Tinkercad Circuits)

```cpp
// หรี่และเร่งความสว่างไฟ LED แบบ Fade In / Fade Out ด้วย PWM
// จำลองบน Tinkercad: LED + R 220Ω ต่อที่ Pin 9 (PWM Pin)

const int LED_PIN = 9; // กำหนดพินเอาต์พุตไปพิน PWM 9

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Fade In: ค่อยๆ เพิ่มความสว่างจากดับสนิทจนสว่างสูงสุด (0 ถึง 255)
  for (int duty = 0; duty <= 255; duty += 5) {
    analogWrite(LED_PIN, duty);
    delay(20);
  }

  // Fade Out: ค่อยๆ หรี่ความสว่างจากสว่างสูงสุดจนดับสนิท (255 ถึง 0)
  for (int duty = 255; duty >= 0; duty -= 5) {
    analogWrite(LED_PIN, duty);
    delay(20);
  }
}
```

### 2.4.4 การควบคุมเซอร์โวมอเตอร์ (Servo Motor)

เซอร์โวมอเตอร์ทั่วไปรับสัญญาณ PWM ความถี่ **50 Hz** โดยความกว้างพัลส์ (Pulse Width) กำหนดมุม:

- **1 ms** (duty ≈ 5%) → มุม 0°
- **1.5 ms** (duty ≈ 7.5%) → มุม 90°
- **2 ms** (duty ≈ 10%) → มุม 180°

ใน Tinkercad สามารถใช้ไลบรารีมาตรฐาน `<Servo.h>` เพื่อสั่งมุมได้ง่ายผ่าน `servo.write(angle)`

---



---

## 2.5 โปรโตคอลการสื่อสารข้อมูลดิจิทัล (Digital Communication Protocols)

นอกจากการอ่านสถานะลอจิก HIGH/LOW โดยตรงแล้ว เซนเซอร์ดิจิทัลระดับสูง (เช่น เซนเซอร์วัดความชื้น DHT22 หรือเซนเซอร์วัดความดัน BMP280) จะส่งข้อมูลออกมาในลักษณะกลุ่มบิตอนุกรม (Serial Data) ผ่านโปรโตคอลสื่อสารที่กำหนดไว้ ซึ่งมาตรฐานสื่อสารยอดนิยมสำหรับวงจรขยายมี 3 รูปแบบหลัก ได้แก่:

#### 2. สัญญาณโปรโตคอลการสื่อสารข้อมูลดิจิทัล (Digital Communication Protocols)
เซนเซอร์สมัยใหม่จำนวนมากทำหน้าที่ประมวลผลสัญญาณและแปลงเป็นข้อมูลตัวเลขสำเร็จรูปอยู่ภายในชิป จากนั้นจึงส่งข้อมูลที่เป็นชุดบิต (Data Packet) ผ่านพอร์ตสื่อสารแบบอนุกรม (Serial Communication Bus) ไปยังไมโครคอนโทรลเลอร์ โปรโตคอลหลักที่ใช้งานมีดังนี้:

#### A. One-Wire
โปรโตคอลการสื่อสารที่เป็นสิทธิบัตรของ Dallas Semiconductor (ปัจจุบันคือ Maxim Integrated) ออกแบบมาเพื่อเน้นการเชื่อมต่อที่ประหยัดสายสัญญาณและอุปกรณ์มีราคาประหยัด
*   **ลักษณะทางกายภาพ:** ใช้สายสัญญาณรับส่งข้อมูลเพียง **1 เส้น** (Data Line) ร่วมกับสายกราวด์ (GND) และต้องการตัวต้านทาน Pull-up (มักใช้ $4.7\text{ k}\Omega$)
*   **การเชื่อมต่อ:** เป็นการรับ-ส่งข้อมูลทิศทางเดียวสลับเวลา (Half-Duplex) บนสายสัญญาณเส้นเดียว
*   **ความสามารถพิเศษ:** อุปกรณ์ One-Wire ทุกตัวมีรหัสระบุตัวตน 64 บิตที่เป็นเอกลักษณ์เฉพาะตัว (Unique ROM ID) ฝังมาจากโรงงาน ทำให้เราสามารถต่อเซนเซอร์ One-Wire ชนิดเดียวกัน เช่น เซนเซอร์วัดอุณหภูมิกันน้ำ DS18B20 หลายสิบตัวขนานกันบนสายข้อมูลเส้นเดียว และสั่งอ่านอุณหภูมิทีละตัวได้โดยใช้สายทองแดงเพียงชุดเดียวไปตามพื้นที่ต่างๆ
*   **ตัวอย่างการประยุกต์ใช้:** เซนเซอร์ DHT22 (วัดอุณหภูมิและความชื้น) และ DS18B20 (วัดอุณหภูมิความละเอียดสูงชนิดกันน้ำ)

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 700 220" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1; rx: 8px; }
    .mcu { fill: #faf5ff; stroke: #a78bfa; stroke-width: 2; rx: 8px; }
    .sensor { fill: #eff6ff; stroke: #60a5fa; stroke-width: 2; rx: 8px; }
    .wire-one { fill: none; stroke: #2563eb; stroke-width: 2; }
    .wire-pullup { fill: none; stroke: #ef4444; stroke-width: 1.5; }
    .resistor { fill: #fff; stroke: #64748b; stroke-width: 1.5; }
    .text-main { font-size: 12px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 10px; fill: #64748b; }
    .text-bus { font-size: 10px; font-weight: bold; font-family: monospace; fill: #2563eb; }
    .packet-cmd { fill: #6366f1; stroke: #ffffff; stroke-width: 1; }
    .packet-reply { fill: #f59e0b; stroke: #ffffff; stroke-width: 1; }
    .packet-label { font-size: 7px; fill: #ffffff; font-weight: bold; font-family: monospace; }
  </style>
  <rect x="5" y="5" width="690" height="210" class="bg"/>
  <rect x="20" y="50" width="120" height="80" class="mcu"/>
  <text x="80" y="85" class="text-main" text-anchor="middle">MCU / Uno</text>
  <text x="80" y="105" class="text-sub" text-anchor="middle">(One-Wire Master)</text>
  <line x1="140" y1="90" x2="520" y2="90" class="wire-one"/>
  <text x="150" y="75" class="text-bus">DQ (Single Data Line)</text>
  <line x1="220" y1="90" x2="220" y2="30" class="wire-pullup"/>
  <rect x="212" y="42" width="16" height="25" rx="2" class="resistor"/>
  <line x1="212" y1="47" x2="228" y2="47" stroke="#fbbf24" stroke-width="2"/>
  <line x1="212" y1="52" x2="228" y2="52" stroke="#a78bfa" stroke-width="2"/>
  <line x1="212" y1="57" x2="228" y2="57" stroke="#dc2626" stroke-width="2"/>
  <text x="235" y="48" class="text-sub" font-weight="bold">Pull-up</text>
  <text x="235" y="58" class="text-sub">4.7 kΩ</text>
  <text x="220" y="24" class="text-bus" fill="#dc2626" text-anchor="middle">VCC (3.3V)</text>
  <rect x="520" y="25" width="150" height="50" class="sensor"/>
  <text x="595" y="45" class="text-main" text-anchor="middle">DS18B20 #1</text>
  <text x="595" y="60" class="text-sub" text-anchor="middle">ID: 0x28...12A</text>
  <line x1="520" y1="50" x2="400" y2="50" stroke="#cbd5e1" stroke-width="1.5"/>
  <line x1="400" y1="50" x2="400" y2="90" stroke="#cbd5e1" stroke-width="1.5"/>
  <circle cx="400" cy="90" r="3" fill="#2563eb"/>
  <rect x="520" y="105" width="150" height="50" class="sensor"/>
  <text x="595" y="125" class="text-main" text-anchor="middle">DS18B20 #2</text>
  <text x="595" y="140" class="text-sub" text-anchor="middle">ID: 0x28...98B</text>
  <line x1="520" y1="130" x2="470" y2="130" stroke="#cbd5e1" stroke-width="1.5"/>
  <line x1="470" y1="130" x2="470" y2="90" stroke="#cbd5e1" stroke-width="1.5"/>
  <circle cx="470" cy="90" r="3" fill="#2563eb"/>

  <!-- Packet animations addressing both sensors sequentially -->
  <!-- DS18B20 #1 (ID: ...12A) Cycle -->
  <g>
    <rect x="-27.5" y="-6" width="55" height="12" rx="2" class="packet-cmd"/>
    <text x="0" y="3" class="packet-label" text-anchor="middle">REQ #12A</text>
    <animateMotion path="M 140 90 L 400 90 L 400 50 L 520 50" dur="8s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="1; 1; 0; 0" keyTimes="0; 0.25; 0.26; 1" dur="8s" repeatCount="indefinite" />
  </g>
  <g>
    <rect x="-27.5" y="-6" width="55" height="12" rx="2" class="packet-reply"/>
    <text x="0" y="3" class="packet-label" text-anchor="middle">TEMP: 25.4C</text>
    <animateMotion path="M 520 50 L 400 50 L 400 90 L 140 90" dur="8s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.24; 0.25; 0.5; 0.51; 1" dur="8s" repeatCount="indefinite" />
  </g>

  <!-- DS18B20 #2 (ID: ...98B) Cycle -->
  <g>
    <rect x="-27.5" y="-6" width="55" height="12" rx="2" class="packet-cmd"/>
    <text x="0" y="3" class="packet-label" text-anchor="middle">REQ #98B</text>
    <animateMotion path="M 140 90 L 470 90 L 470 130 L 520 130" dur="8s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.49; 0.5; 0.75; 0.76; 1" dur="8s" repeatCount="indefinite" />
  </g>
  <g>
    <rect x="-27.5" y="-6" width="55" height="12" rx="2" class="packet-reply"/>
    <text x="0" y="3" class="packet-label" text-anchor="middle">TEMP: 26.8C</text>
    <animateMotion path="M 520 130 L 470 130 L 470 90 L 140 90" dur="8s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="0; 0; 1; 1" keyTimes="0; 0.74; 0.75; 1" dur="8s" repeatCount="indefinite" />
  </g>

  <text x="350" y="202" class="text-sub" text-anchor="middle" fill="#475569">การสื่อสารแบบ Half-Duplex: ใช้สายส่งข้อมูล 1 เส้นร่วมกัน โดย Master ส่งรหัสเรียกเซนเซอร์ แล้วเซนเซอร์ส่งข้อมูลกลับในสายเดิม</text>
</svg>
</div>

#### B. I2C (Inter-Integrated Circuit)
โปรโตคอลแบบบัสอนุกรมที่พัฒนาโดย Philips นิยมใช้สูงมากกับเซนเซอร์ระยะใกล้บนบอร์ดเดียวกัน
*   **ลักษณะทางกายภาพ:** ใช้สายสัญญาณเพียง 2 เส้น:
    *   **SDA (Serial Data):** สายรับ-ส่งข้อมูลสองทิศทางแบบสลับเวลา (Half-Duplex)
    *   **SCL (Serial Clock):** สายส่งสัญญาณนาฬิกาควบคุมจังหวะโดยตัวแม่ข่าย (Master)
*   **การเชื่อมต่อ:** ต้องต่อตัวต้านทาน Pull-up (มักใช้ $4.7\text{ k}\Omega$ ถึง $10\text{ k}\Omega$) ไว้ที่สาย SDA และ SCL ไปยัง $V_{DD}$ เพื่อดึงระดับลอจิกขึ้นเมื่อไม่มีอุปกรณ์ใดส่งข้อมูล
*   **ความสามารถพิเศษ:** รองรับการเชื่อมต่ออุปกรณ์เซนเซอร์หลายตัว (Multi-drop) บนบัสเดียวกัน โดยใช้รหัสแอดเดรสระบุตัวเซนเซอร์ (Device Address เช่น $0x76$ หรือ $0x68$) ขนาด 7 บิต ทำให้สามารถต่อเซนเซอร์ต่างชนิดกัน เช่น BMP280 และ MPU6050 เข้ากับขาคู่เดียวกันบนบอร์ดไมโครคอนโทรลเลอร์ได้โดยไม่สับสน
*   **ความเร็วระดับมาตรฐาน:** $100\text{ kbps}$ (Standard Mode) และ $400\text{ kbps}$ (Fast Mode)

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 700 200" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1; rx: 8px; }
    .mcu { fill: #faf5ff; stroke: #a78bfa; stroke-width: 2; rx: 8px; }
    .sensor { fill: #eff6ff; stroke: #60a5fa; stroke-width: 2; rx: 8px; }
    .line-scl { fill: none; stroke: #f59e0b; stroke-width: 2; }
    .line-sda { fill: none; stroke: #10b981; stroke-width: 2; }
    .scl-pulse { fill: none; stroke: #d97706; stroke-width: 2; stroke-dasharray: 10 5; animation: clockPulse 1.5s linear infinite; }
    .sda-packet { fill: #ef4444; stroke: #ffffff; stroke-width: 1; }
    .packet-label { font-size: 8px; fill: #ffffff; font-weight: bold; font-family: monospace; }
    .text-main { font-size: 12px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 10px; fill: #64748b; }
    .text-bus { font-size: 11px; font-weight: 800; font-family: monospace; }
    @keyframes clockPulse {
      to { stroke-dashoffset: -15; }
    }
  </style>
  <rect x="5" y="5" width="690" height="190" class="bg"/>
  <rect x="20" y="45" width="120" height="90" class="mcu"/>
  <text x="80" y="75" class="text-main" text-anchor="middle">MCU / Uno</text>
  <text x="80" y="95" class="text-sub" text-anchor="middle">(I2C Master)</text>
  <text x="80" y="115" class="text-sub" text-anchor="middle" fill="#7c3aed" font-weight="bold">GPIO 21, 22</text>
  <line x1="140" y1="75" x2="520" y2="75" class="line-scl"/>
  <line x1="140" y1="75" x2="520" y2="75" class="scl-pulse"/>
  <text x="160" y="55" class="text-bus" fill="#d97706">SCL (Clock)</text>
  <line x1="140" y1="105" x2="520" y2="105" class="line-sda"/>
  <text x="160" y="130" class="text-bus" fill="#059669">SDA (Data)</text>
  <rect x="520" y="20" width="150" height="60" class="sensor"/>
  <text x="595" y="42" class="text-main" text-anchor="middle">BMP280</text>
  <text x="595" y="58" class="text-sub" text-anchor="middle">Address: 0x76 (Sensor 1)</text>
  <path d="M 480 75 L 480 135 L 520 135" stroke="#cbd5e1" stroke-width="1.5" fill="none"/>
  <path d="M 450 105 L 450 45 L 520 45" stroke="#cbd5e1" stroke-width="1.5" fill="none"/>
  <rect x="520" y="100" width="150" height="60" class="sensor"/>
  <text x="595" y="122" class="text-main" text-anchor="middle">MPU6050</text>
  <text x="595" y="138" class="text-sub" text-anchor="middle">Address: 0x68 (Sensor 2)</text>
  <circle cx="450" cy="105" r="3" fill="#10b981"/>
  <circle cx="480" cy="75" r="3" fill="#f59e0b"/>

  <!-- Packet animations addressing both sensors in sequence -->
  <!-- Sensor 1 (BMP280 @ 0x76) Cycle -->
  <g>
    <rect x="-22.5" y="-7" width="45" height="14" rx="3" class="sda-packet"/>
    <text x="0" y="3" class="packet-label" text-anchor="middle">ADDR 0x76</text>
    <animateMotion path="M 140 105 L 450 105 L 450 45 L 520 45" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1; 1; 0; 0" keyTimes="0; 0.25; 0.26; 1" dur="8s" repeatCount="indefinite" />
  </g>
  <g>
    <rect x="-22.5" y="-7" width="45" height="14" rx="3" fill="#3b82f6" stroke="#ffffff" stroke-width="1"/>
    <text x="0" y="3" class="packet-label" text-anchor="middle">DATA: 25C</text>
    <animateMotion path="M 520 45 L 450 45 L 450 105 L 140 105" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.24; 0.25; 0.5; 0.51; 1" dur="8s" repeatCount="indefinite" />
  </g>

  <!-- Sensor 2 (MPU6050 @ 0x68) Cycle -->
  <g>
    <rect x="-22.5" y="-7" width="45" height="14" rx="3" class="sda-packet"/>
    <text x="0" y="3" class="packet-label" text-anchor="middle">ADDR 0x68</text>
    <animateMotion path="M 140 105 L 480 105 L 480 135 L 520 135" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.49; 0.5; 0.75; 0.76; 1" dur="8s" repeatCount="indefinite" />
  </g>
  <g>
    <rect x="-22.5" y="-7" width="45" height="14" rx="3" fill="#3b82f6" stroke="#ffffff" stroke-width="1"/>
    <text x="0" y="3" class="packet-label" text-anchor="middle">DATA: ±2g</text>
    <animateMotion path="M 520 135 L 480 135 L 480 105 L 140 105" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0; 0; 1; 1" keyTimes="0; 0.74; 0.75; 1" dur="8s" repeatCount="indefinite" />
  </g>

  <text x="350" y="182" class="text-sub" text-anchor="middle" fill="#475569">SDA ส่งที่อยู่เพื่อเรียกเซนเซอร์ (ADDR) และเซนเซอร์จะตอบรับและส่งข้อมูล (DATA) กลับมาในสายสัญญาณเส้นเดิม</text>
</svg>
</div>

#### C. SPI (Serial Peripheral Interface)
โปรโตคอลการสื่อสารความเร็วสูงแบบ Synchronous พัฒนาโดย Motorola เหมาะสำหรับการส่งข้อมูลปริมาณมาก เช่น หน้าจอแสดงผลกราฟิก หรือเซนเซอร์ความละเอียดสูง
*   **ลักษณะทางกายภาพ:** ใช้สายสัญญาณหลัก 4 เส้น:
    *   **MOSI (Master Out Slave In):** สายส่งข้อมูลออกจาก Master ไปยัง Sensor
    *   **MISO (Master In Slave Out):** สายรับข้อมูลเข้า Master จาก Sensor
    *   **SCK (Serial Clock):** สายส่งสัญญาณนาฬิกาควบคุมจังหวะการรับส่งข้อมูล
    *   **CS / SS (Chip Select / Slave Select):** สายเลือกอุปกรณ์ที่ต้องการคุยด้วย (แยกเฉพาะตัวละ 1 เส้น)
*   **การเชื่อมต่อ:** การสื่อสารเป็นแบบสองทิศทางพร้อมกัน (Full-Duplex)
*   **ความสามารถพิเศษ:** ทำงานได้รวดเร็วกว่า I2C มาก (ระดับความเร็วสูงสุดถึงหลักหลายสิบ MHz) เนื่องจากไม่ต้องจัดการส่งแอดเดรสบิตผ่านข้อมูลสายหลัก แต่ใช้สายฮาร์ดแวร์ CS ในการเลือกว่าจะติดต่อกับอุปกรณ์ตัวใดโดยเฉพาะแทน
*   **ข้อจำกัด:** เมื่อจำนวนเซนเซอร์เพิ่มขึ้น จะต้องเปลืองขา I/O ของไมโครคอนโทรลเลอร์เพิ่มตามจำนวนเซนเซอร์เพื่อนำไปทำเป็นขา CS ของเซนเซอร์แต่ละตัว

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 700 260" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1; rx: 8px; }
    .mcu { fill: #faf5ff; stroke: #a78bfa; stroke-width: 2; rx: 8px; }
    .sensor { fill: #eff6ff; stroke: #60a5fa; stroke-width: 2; rx: 8px; }
    .wire { fill: none; stroke: #cbd5e1; stroke-width: 1.5; }
    .wire-cs-low { fill: none; stroke: #ef4444; stroke-width: 2; }
    .wire-cs-high { fill: none; stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 3 3; }
    .text-main { font-size: 12px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 10px; fill: #64748b; }
    .text-bus { font-size: 9px; font-weight: bold; font-family: monospace; fill: #475569; }
    .packet-mosi { fill: #ec4899; stroke: #ffffff; stroke-width: 1; }
    .packet-miso { fill: #10b981; stroke: #ffffff; stroke-width: 1; }
    .packet-label { font-size: 8px; fill: #ffffff; font-weight: bold; font-family: monospace; }

    /* SCK Clock Animation */
    .line-sck { fill: none; stroke: #fef08a; stroke-width: 2; }
    .sck-pulse { fill: none; stroke: #d97706; stroke-width: 2; stroke-dasharray: 10 5; animation: sckClockPulse 1.2s linear infinite; }
    @keyframes sckClockPulse {
      to { stroke-dashoffset: -15; }
    }

    /* MOSI & MISO active lines */
    .wire-mosi-active { fill: none; stroke: #db2777; stroke-width: 2; }
    .wire-miso-active { fill: none; stroke: #059669; stroke-width: 2; }
  </style>
  <rect x="5" y="5" width="690" height="250" class="bg"/>

  <!-- MCU Breakout Box -->
  <rect x="20" y="35" width="120" height="170" class="mcu"/>
  <text x="80" y="95" class="text-main" text-anchor="middle">MCU / Uno</text>
  <text x="80" y="115" class="text-sub" text-anchor="middle">(SPI Master)</text>
  <text x="80" y="135" class="text-sub" fill="#7c3aed" font-weight="bold" text-anchor="middle">GPIO 5, 18, 23, 19, 4</text>

  <!-- MCU Pin Labels -->
  <text x="130" y="54" class="text-bus" text-anchor="end" fill="#dc2626">CS A</text>
  <text x="130" y="114" class="text-bus" text-anchor="end" fill="#d97706">SCK</text>
  <text x="130" y="129" class="text-bus" text-anchor="end" fill="#db2777">MOSI</text>
  <text x="130" y="144" class="text-bus" text-anchor="end" fill="#059669">MISO</text>
  <text x="130" y="189" class="text-bus" text-anchor="end" fill="#94a3b8">CS B</text>

  <!-- CS A & CS B Lines -->
  <path d="M 140 50 L 520 50" class="wire-cs-low"/>
  <text x="150" y="45" class="text-bus" fill="#dc2626">CS A (Active LOW ➔ Enabled)</text>

  <line x1="140" y1="185" x2="520" y2="185" class="wire-cs-high"/>
  <text x="150" y="197" class="text-bus" fill="#94a3b8">CS B (Standby HIGH ➔ Disabled)</text>

  <!-- SCK Bus Line (Clock) -->
  <path d="M 140 110 L 480 110 L 480 75 L 520 75" class="line-sck"/>
  <path d="M 140 110 L 480 110 L 480 75 L 520 75" class="sck-pulse"/>
  <path d="M 480 110 L 480 165 L 520 165" class="wire"/>
  <circle cx="480" cy="110" r="3" fill="#f59e0b"/>
  <text x="150" y="103" class="text-bus" fill="#d97706">SCK (Clock)</text>

  <!-- MOSI Bus Line (Master Out Slave In) -->
  <path d="M 140 125 L 450 125 L 450 85 L 520 85" class="wire-mosi-active"/>
  <path d="M 450 125 L 450 175 L 520 175" class="wire"/>
  <circle cx="450" cy="125" r="3" fill="#db2777"/>
  <text x="150" y="121" class="text-bus" fill="#db2777">MOSI (Data Out)</text>

  <!-- MISO Bus Line (Master In Slave Out) -->
  <path d="M 520 95 L 420 95 L 420 140 L 140 140" class="wire-miso-active"/>
  <path d="M 520 195 L 420 195 L 420 140" class="wire"/>
  <circle cx="420" cy="140" r="3" fill="#059669"/>
  <text x="150" y="136" class="text-bus" fill="#059669">MISO (Data In)</text>

  <!-- Sensor A breakout (Active) -->
  <rect x="520" y="25" width="150" height="80" class="sensor"/>
  <text x="610" y="60" class="text-main" text-anchor="middle">Sensor A</text>
  <text x="610" y="78" class="text-sub" text-anchor="middle">(Active)</text>

  <!-- Sensor A Pin Labels -->
  <text x="526" y="54" class="text-bus" text-anchor="start" fill="#dc2626">CS</text>
  <text x="526" y="79" class="text-bus" text-anchor="start" fill="#d97706">SCK</text>
  <text x="526" y="89" class="text-bus" text-anchor="start" fill="#db2777">MOSI</text>
  <text x="526" y="99" class="text-bus" text-anchor="start" fill="#059669">MISO</text>

  <!-- Sensor B breakout (Disabled/Standby) -->
  <rect x="520" y="150" width="150" height="70" class="sensor" style="opacity: 0.6;"/>
  <text x="610" y="180" class="text-main" text-anchor="middle" style="opacity: 0.6;">Sensor B</text>
  <text x="610" y="196" class="text-sub" text-anchor="middle" style="opacity: 0.6;">(Disabled)</text>

  <!-- Sensor B Pin Labels -->
  <text x="526" y="169" class="text-bus" text-anchor="start" style="opacity: 0.6;" fill="#94a3b8">SCK</text>
  <text x="526" y="179" class="text-bus" text-anchor="start" style="opacity: 0.6;" fill="#94a3b8">MOSI</text>
  <text x="526" y="189" class="text-bus" text-anchor="start" style="opacity: 0.6;" fill="#94a3b8">CS</text>
  <text x="526" y="199" class="text-bus" text-anchor="start" style="opacity: 0.6;" fill="#94a3b8">MISO</text>

  <!-- Packet animations -->
  <g>
    <rect x="-20" y="-6" width="40" height="12" rx="2" class="packet-mosi"/>
    <text x="0" y="3" class="packet-label" text-anchor="middle">WRITE</text>
    <animateMotion path="M 140 125 L 450 125 L 450 85 L 520 85" dur="3s" repeatCount="indefinite" />
  </g>
  <g>
    <rect x="-20" y="-6" width="40" height="12" rx="2" class="packet-miso"/>
    <text x="0" y="3" class="packet-label" text-anchor="middle">READ</text>
    <animateMotion path="M 520 95 L 420 95 L 420 140 L 140 140" dur="3s" repeatCount="indefinite" />
  </g>
  <text x="350" y="242" class="text-sub" text-anchor="middle" fill="#475569">การส่งข้อมูลแบบ Full-Duplex: ข้อมูลไหลผ่าน MOSI และ MISO พร้อมกันในรอบบัสเดียว เมื่อขา CS A ถูกดึงลงต่ำ (LOW)</text>
</svg>
</div>



---

## 2.6 ตารางเปรียบเทียบลักษณะการเชื่อมต่อสัญญาณและโปรโตคอล

| หัวข้อ | แอนะล็อก | ดิจิทัล (GPIO) | ดิจิทัล (I2C/SPI) |
|---|---|---|---|
| จำนวนสายข้อมูล | 1 | 1 | 2–4 |
| ขาที่ใช้ (Uno / ESP32) | A0–A5 / ADC (GPIO 32–39) | GPIO ใดก็ได้ | SDA/SCL หรือ SPI |
| ตัวอย่างเซนเซอร์ | Potentiometer, TMP36, LDR | Switches, PIR, HC-SR04 | BMP280, MPU6050 |
| ข้อดี | วงจรง่าย | อ่านค่าง่าย | ต่อหลายตัวได้บน Bus เดียว |
| ข้อจำกัด | อ่อนไหวต่อสัญญาณรบกวน | ได้แค่ 2 สถานะ | ต้องใช้ไลบรารี |

---



---

## 2.7 การสร้างแรงดันแอนะล็อกแท้จริง (True Analog Output Options)

### 2.7.1 หลักการทำงานของ DAC และข้อจำกัดบน Arduino Uno
ในขณะที่ **PWM** เลียนแบบสัญญาณแอนะล็อกด้วยการจ่ายพัลส์ไฟฟ้าสลับความถี่สูงเพื่อควบคุมกำลังเฉลี่ย (ซึ่งใช้ได้ดีกับ LED หรือมอเตอร์กระแสตรง) แต่โหลดบางประเภทที่มีความอ่อนไหวจะไม่สามารถรับสัญญาณพัลส์ตรง ๆ ได้ เช่น ลำโพง วงจรกำเนิดเสียงดนตรี หรือเซนเซอร์บางชนิดที่ต้องการแรงดันไฟฟ้าเรียบตรงคงที่

อุปกรณ์ประเภทนี้ต้องการ **DAC (Digital-to-Analog Converter)** ซึ่งทำหน้าที่แปลงเลขฐานสองในชิปประมวลผลให้ออกมาเป็น **แรงดันไฟฟ้าแอนะล็อกแท้จริง (True Analog Voltage)** ที่มีความต่อเนื่องและคงตัวโดยไม่มีการสลับลอจิกพัลส์เปิด/ปิด

**ข้อจำกัดของ Arduino Uno:** บอร์ด Arduino Uno R3 ไม่มีโมดูล DAC ในตัว (มีเพียงเอาต์พุต PWM เท่านั้น) หากเราจำเป็นต้องสร้างเอาต์พุตแอนะล็อกแท้จริงจาก Arduino Uno เราสามารถเลือกใช้วิธีทางวิศวกรรมได้ 2 แนวทางหลักดังนี้:

#### 2.7.2 วงจรกรองความถี่ต่ำผ่าน (RC Low-Pass Filter)
เป็นวิธีที่ประหยัดที่สุด โดยการต่อตัวต้านทาน ($R$) และตัวเก็บประจุ ($C$) เข้ากับพินเอาต์พุต PWM ของ Arduino Uno วงจรนี้ทำหน้าที่กรองและรวมค่าระดับพัลส์ของ PWM ให้กลายเป็นแรงดันไฟฟ้ากระแสตรงราบเรียบ (DC Voltage) ที่มีค่าเฉลี่ยสัมพันธ์โดยตรงกับเปอร์เซ็นต์ของ Duty Cycle
*   **สูตรการคำนวณความถี่ตัดคัตออฟ (Cutoff Frequency):**
    $$f_c = \frac{1}{2\pi R C}$$
    *ต้องเลือกค่า $f_c$ ให้ต่ำกว่าความถี่ PWM ของ Arduino Uno ($f_{PWM} \approx 490\text{ Hz}$ หรือ $980\text{ Hz}$) เพื่อกรองสัญญาณพัลส์ออกได้อย่างมีประสิทธิภาพ*

#### 2.7.3 การต่อชิปไอซีแปลงสัญญาณภายนอก (External DAC IC)
เป็นวิธีที่ให้คุณภาพสูงสุดและได้รูปคลื่นสัญญาณแอนะล็อกที่มีความแม่นยำและเสถียรที่สุด โดยนิยมใช้ชิปไอซีสำเร็จรูป เช่น **MCP4725** (มีให้จำลองใน Tinkercad Circuits)
*   **การเชื่อมต่อ:** เชื่อมต่อกับบอร์ด Arduino Uno ผ่านอินเทอร์เฟซ **I2C** (พิน SDA ต่อขา A4, SCL ต่อขา A5)
*   **ความละเอียด:** ชิป MCP4725 มีความละเอียดระดับ **12 บิต** ($2^{12} = 4096$ ระดับ) ทำให้ส่งระดับแรงดันเอาต์พุตได้เนียนและละเอียดอย่างมาก

**ตัวอย่างโค้ด Arduino Uno สั่งงานไอซี MCP4725 สร้างสัญญาณคลื่นแรมป์แอนะล็อก (ใช้ไลบรารี Adafruit_MCP4725):**
```cpp
#include <Wire.h>
#include <Adafruit_MCP4725.h>

Adafruit_MCP4725 dac;

void setup() {
  dac.begin(0x60); // ที่อยู่ I2C เริ่มต้นของชิป MCP4725 บน Tinkercad
}

void loop() {
  // สร้างสัญญาณคลื่นฟันเลื่อย (Sawtooth Wave) หรือคลื่นแรมป์แอนะล็อก
  for (int i = 0; i < 4096; i += 64) {
    dac.setVoltage(i, false); // ส่งค่าแรงดันดิจิทัล 12 บิตไปยังเอาต์พุต DAC
    delay(5);
  }
}
```

## 5.5 การปรับขนาดสัญญาณด้วย `map()` และการ Calibrate

### 2.8.1 ฟังก์ชัน map()

ฟังก์ชัน `map()` ช่วย **แปลงค่าจากช่วงหนึ่งไปอีกช่วงหนึ่ง** แบบเชิงเส้น (Linear):

```
output = map(value, fromLow, fromHigh, toLow, toHigh);
```

ตัวอย่างการใช้งาน:

```
int adcVal = analogRead(34);              // 0–1023
int pwmVal = map(adcVal, 0, 1023, 0, 255); // แปลงเป็น 0–255 สำหรับ PWM 8-bit
```

### 2.8.2 การ Calibrate เซ็นเซอร์

เซ็นเซอร์จริงไม่ได้ให้ค่า 0 ที่จุดต่ำสุดหรือ 1023 ที่จุดสูงสุดเสมอไป ควร **สอบเทียบ (Calibrate)** ก่อนใช้งาน:

1. วัดค่า ADC ที่สภาวะต่ำสุด → เก็บเป็น `sensorMin`
2. วัดค่า ADC ที่สภาวะสูงสุด → เก็บเป็น `sensorMax`
3. ใช้ `map(adcVal, sensorMin, sensorMax, 0, 255)` เพื่อให้ครอบคลุมช่วงจริง
4. ใช้ `constrain(result, 0, 255)` เพื่อป้องกันค่าเกินขอบเขต

> 💡 **ทำไมต้อง constrain?** เพราะ `map()` ไม่ได้จำกัดค่าผลลัพธ์ให้อยู่ในช่วง ถ้าค่าอินพุตเกินช่วง `fromLow–fromHigh` ผลลัพธ์ก็จะเกินช่วง `toLow–toHigh` ตามไปด้วย

---

## 2.9 ตัวอย่างรวม: อ่าน LDR ปรับความสว่าง LED อัตโนมัติ

โจทย์: ใช้ **LDR (Light Dependent Resistor)** ตรวจวัดแสง แล้วปรับความสว่าง LED ให้ **สว่างขึ้นเมื่อแสงน้อย** และ **หรี่ลงเมื่อแสงมาก** (เหมือนไฟถนนอัตโนมัติ)

### วงจรบน Tinkercad

- LDR + ตัวต้านทาน 10 kΩ ต่อแบบ Voltage Divider ที่ขา **A0**
- LED ต่อผ่านตัวต้านทาน 220 Ω ที่ขา **Pin 9**

### โค้ดเต็ม (Tinkercad Circuits)

```cpp
// ระบบปรับแสง LED อัตโนมัติตามแสงแวดล้อม
// จำลองบน Tinkercad: Arduino Uno + LDR (Voltage Divider) + LED ต่อพิน 9

const int LDR_PIN = A0;   // ขาอินพุตอ่านค่า LDR (Analog Pin A0)
const int LED_PIN = 9;    // ขาเอาต์พุตจ่ายสัญญาณ PWM ไปยัง LED (Pin 9)

// ค่า Calibration (สำหรับ Tinkercad LDR ช่วงประมาณ 200 ถึง 900)
const int LDR_MIN = 200;   // ค่า ADC ที่วัดได้เมื่อความสว่างน้อยที่สุด (มืด)
const int LDR_MAX = 900;   // ค่า ADC ที่วัดได้เมื่อความสว่างมากที่สุด (สว่างจ้า)

void setup() {
  Serial.begin(9600); // เริ่มต้น Serial Monitor ที่ความเร็ว 9600 bps
  pinMode(LED_PIN, OUTPUT);
  Serial.println("=== Arduino Uno Auto Light System ===");
}

void loop() {
  int ldrValue = analogRead(LDR_PIN); // อ่านค่า ADC 10 บิต (0-1023)

  // แปลงค่า LDR -> เอาต์พุตสว่าง LED (กลับด้าน: แสงน้อย = ค่า ADC ต่ำ -> ให้ LED สว่างมาก)
  int brightness = map(ldrValue, LDR_MIN, LDR_MAX, 255, 0);
  brightness = constrain(brightness, 0, 255);  // บังคับช่วงไม่ให้เกิน 0-255

  analogWrite(LED_PIN, brightness); // ส่งค่าเอาต์พุต PWM หรี่/เร่งไฟ LED

  // แปลงค่าดิบ ADC เป็นระดับแรงดันไฟฟ้า (5.0V อ้างอิง)
  float voltage = (ldrValue / 1023.0) * 5.0;

  Serial.print("LDR Raw: ");
  Serial.print(ldrValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 2);
  Serial.print(" V | LED Brightness: ");
  Serial.print(brightness);
  Serial.print("/255 (");
  Serial.print((brightness * 100) / 255);
  Serial.println("%)");

  delay(200);
}
```

**อธิบายการทำงาน:**

1. `analogRead()` อ่านระดับศักย์แบ่งแรงดันของ LDR ออกมาเป็นค่าดิจิทัล 10 บิต
2. `map()` แปลงค่าจากช่วง calibrate ของเซนเซอร์ (200-900) เป็นความละเอียด 8 บิตของ PWM (0-255) ในทิศทางกลับกัน
3. `constrain()` ปรับค่าล้นขอบนอกเขตให้อยู่ในขีดจำกัดช่วง 0 ถึง 255
4. `analogWrite()` ส่งสัญญาณ Duty Cycle ไปสั่งงานไฟหรี่หลอด LED

> 💡 **ลองเล่นบน Tinkercad:** กดคลิกที่ตัวอุปกรณ์ LDR ในหน้ารันระบบจำลอง แล้วเลื่อนแถบควบคุมความเข้มแสง ท่านจะพบการเปลี่ยนความสว่างของ LED สลับความสว่างอัตโนมัติตามแบบเรียลไทม์

## 2.10 สรุปประจำบทที่ 2 (Summary)

| หัวข้อ | ฟังก์ชันหลัก | ข้อควรจำ |
|---|---|---|
| **Digital Input** | `digitalRead()` + `INPUT_PULLUP` | ระวังสัญญาณ Floating, กดปุ่ม = LOW เมื่อใช้ pull-up |
| **Digital Output** | `digitalWrite()` | HIGH = 5.0 V, LOW = 0 V |
| **GPIO Interrupt** | `attachInterrupt()` | ใช้ขัดจังหวะทันที, ขา INT บน Uno มีเฉพาะ Pin 2, 3, ฟังก์ชัน ISR ต้องทำงานสั้นมาก, ใช้ตัวแปร `volatile` |
| **Software Debounce** | การกรองทางเวลาด้วย `millis()` | หน้าสัมผัสปุ่มเชิงกลจะกระเด้งสะท้อน, ต้องมีระยะเวลาดีเลย์ล็อคช่วงกด |
| **ADC (อ่านอนาล็อก)** | `analogRead()` | Arduino Uno = 10-bit (0–1023), ความเป็นเชิงเส้นสูง ทำงานเสถียร |
| **ADC Calibration** | วัดขา 5V จริงดรอปเทียบ | สอบเทียบการอ้างอิงแรงดันโดยตรงในการหารสัดส่วนเทียบจริง |
| **PWM (เลียนแบบอนาล็อก)**| `analogWrite()` | สลับเปิด-ปิด ดิจิทัลความเร็วสูงเพื่อจำลองระดับแรงดัน (0-255) 8 บิต |
| **DAC (อนาล็อกแท้)** | ไอซีภายนอก (I2C MCP4725) | ส่งระดับแรงดันแอนะล็อกแท้ราบเรียบโดยมีความละเอียดบิตสูง (12 บิต) |
| **การปรับขนาดสัญญาณ** | `map()` + `constrain()` | ป้องกันค่าล้นช่วงขอบเขตข้อมูล และสอบเทียบเซ็นเซอร์จริง |

**หลักคิดสำคัญ:** ไมโครคอนโทรลเลอร์ประมวลผลด้วยระบบลอจิกดิจิทัล (0 และ 1) แต่ปรากฏการณ์ธรรมชาติของโลกจริงมีค่าต่อเนื่องแบบแอนะล็อก — โมดูล **ADC** จึงเสมือน "โสตประสาทรับฟัง" และแปลงข้อมูลภายนอก ส่วน **PWM/DAC** เปรียบเป็น "กระบอกเสียงตอบโต้" สู่โลกภายนอก

---

## 2.11 แบบฝึกหัดท้ายบทที่ 2 (Exercises)

**ข้อ 1:** จงอธิบายว่าปัญหา "สัญญาณลอย (Floating)" คืออะไร เกิดขึ้นเมื่อใด และแก้ไขได้อย่างไร

**ข้อ 2:** บอร์ด Arduino Uno มี ADC ความละเอียด 10 บิต ถ้าต่อวัดตัวต้านทานปรับค่าได้แล้วอ่านค่าดิจิทัลดิบได้ 512 จงคำนวณหาแรงดันไฟฟ้าจริง (V) ที่พิน ADC วัดได้ โดยสมมติว่าแรงดันอ้างอิงเป็น 5.0V (แสดงวิธีทำ)

**ข้อ 3:** สัญญาณ PWM ที่มี duty cycle 75% หมายความว่าอย่างไร? ถ้าใช้ resolution 8 บิต ค่า duty ที่ต้องใส่ใน `analogWrite()` เท่ากับเท่าไร?

**ข้อ 4:** จงเขียนโค้ดภาษา C++ บน Arduino Uno ที่ทำหน้าที่อ่านค่าแรงดันจากโพเทนชิออมิเตอร์ผ่านขาแอนะล็อก A0 แล้วคำนวณแสดงผลแรงดันจริงออกทาง Serial Monitor ทุก ๆ 1 วินาที ด้วยระดับความเร็ว 9600 bps

**ข้อ 5:** ฟังก์ชัน `map(1500, 0, 1023, 0, 255)` จะได้ผลลัพธ์ประมาณเท่าไร? จงคำนวณ

