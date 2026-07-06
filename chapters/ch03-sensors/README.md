# Chapter 3: ตัวรับรู้ (Sensors)
## Sensors for IoT

บทนี้จะพาทำความรู้จักกับ **เซนเซอร์ (Sensor)** ซึ่งเป็นอุปกรณ์สำคัญที่ทำหน้าที่เป็น "ตา หู จมูก" ของระบบ IoT ทำให้ไมโครคอนโทรลเลอร์ (เช่น Arduino Uno ที่จำลองบน Tinkercad หรือ ESP32) สามารถรับรู้สิ่งที่เกิดขึ้นในโลกจริงได้ ไม่ว่าจะเป็นอุณหภูมิ แสงสว่าง ระยะทาง หรือแม้แต่แก๊สที่มองไม่เห็น

---

## 3.1 ความรู้พื้นฐานอิเล็กทรอนิกส์

ก่อนเข้าสู่การอ่านค่าเซนเซอร์ด้วยไมโครคอนโทรลเลอร์ ควรเข้าใจแนวคิดพื้นฐานของวงจรไฟฟ้าเล็กน้อย เพราะเซนเซอร์จำนวนมากไม่ได้ส่ง "ตัวเลข" ออกมาโดยตรง แต่ส่งผลลัพธ์เป็นแรงดัน กระแส หรือความต้านทานที่เปลี่ยนไป จากนั้นไมโครคอนโทรลเลอร์จึงอ่านค่าและแปลงเป็นข้อมูลดิจิทัลอีกที

### 3.1.1 แรงดัน กระแส และความต้านทาน (Voltage, Current, Resistance)

ในวงจรไฟฟ้าพื้นฐาน เรามักพบปริมาณสำคัญ 3 ตัว ได้แก่ แรงดันไฟฟ้า กระแสไฟฟ้า และความต้านทาน

*   **แรงดันไฟฟ้า ($V$ - Voltage):** คือ "แรงผลัก" ที่ทำให้ประจุไฟฟ้าเคลื่อนที่ หน่วยคือโวลต์ ($\text{V}$) เช่น ขา $5\text{ V}$ ของ Arduino Uno หรือ $3.3\text{ V}$ ของ ESP32 เป็นแหล่งจ่ายแรงดันที่ผลักให้กระแสไหลในวงจร
*   **กระแสไฟฟ้า ($I$ - Current):** คืออัตราการไหลของประจุไฟฟ้าผ่านจุดหนึ่งในวงจร หน่วยคือแอมแปร์ ($\text{A}$) ในงานไมโครคอนโทรลเลอร์มักใช้หน่วยมิลลิแอมแปร์ ($\text{mA}$)
*   **ความต้านทาน ($R$ - Resistance):** คือความยากง่ายที่กระแสจะไหลผ่านอุปกรณ์ หน่วยคือโอห์ม ($\Omega$) ยิ่งความต้านทานสูง กระแสยิ่งไหลได้น้อยลง

วิธีนึกภาพที่ง่ายคือเปรียบวงจรไฟฟ้ากับน้ำในท่อ: **แรงดัน** เหมือนความสูงของถังน้ำที่ดันน้ำให้ไหล, **กระแส** เหมือนอัตราการไหลของน้ำ, และ **ความต้านทาน** เหมือนความแคบของท่อที่จำกัดการไหล

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 280" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>กระแสไหลในวงจรปิดผ่านตัวต้านทานและ LED</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .wire { fill: none; stroke: #334155; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .current-path { fill: none; stroke: #f59e0b; stroke-width: 4; stroke-dasharray: 10 12; stroke-linecap: round; animation: currentMarch 2.6s linear infinite; }
    .battery { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 8px; }
    .component { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .led-body { fill: #fee2e2; stroke: #dc2626; stroke-width: 2; }
    .led-ray { stroke: #ef4444; stroke-width: 2; stroke-linecap: round; opacity: 0.2; animation: ledGlow 1.4s ease-in-out infinite; }
    .dot { fill: #f59e0b; stroke: #ffffff; stroke-width: 1.5; }
    .text-main { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 12px; fill: #64748b; }
    .text-code { font-size: 12px; font-weight: 700; fill: #7c3aed; font-family: monospace; }
    .label-v { fill: #dc2626; font-weight: 700; }
    .label-i { fill: #d97706; font-weight: 700; }
    .label-r { fill: #2563eb; font-weight: 700; }
    @keyframes currentMarch {
      to { stroke-dashoffset: -44; }
    }
    @keyframes ledGlow {
      0%, 100% { opacity: 0.25; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
  </style>
  <rect x="5" y="5" width="750" height="270" class="bg"/>
  <path d="M 145 75 L 310 75 L 450 75 L 610 75 L 610 205 L 145 205 L 145 75" class="wire"/>
  <path id="closedCircuitPath" d="M 145 75 L 310 75 L 450 75 L 610 75 L 610 205 L 145 205 L 145 75" class="current-path"/>

  <rect x="95" y="118" width="100" height="60" class="battery"/>
  <line x1="128" y1="132" x2="128" y2="164" stroke="#dc2626" stroke-width="4"/>
  <line x1="158" y1="140" x2="158" y2="156" stroke="#334155" stroke-width="4"/>
  <text x="145" y="108" class="text-main" text-anchor="middle">แหล่งจ่าย</text>
  <text x="145" y="193" class="text-code" text-anchor="middle">3.3 V</text>
  <text x="115" y="134" class="label-v" text-anchor="middle">+</text>
  <text x="175" y="162" fill="#334155" font-weight="700" text-anchor="middle">-</text>

  <rect x="300" y="50" width="90" height="50" class="component"/>
  <line x1="312" y1="75" x2="328" y2="60" stroke="#2563eb" stroke-width="2"/>
  <line x1="328" y1="60" x2="344" y2="90" stroke="#2563eb" stroke-width="2"/>
  <line x1="344" y1="90" x2="360" y2="60" stroke="#2563eb" stroke-width="2"/>
  <line x1="360" y1="60" x2="376" y2="75" stroke="#2563eb" stroke-width="2"/>
  <text x="345" y="38" class="text-main" text-anchor="middle">ตัวต้านทาน</text>
  <text x="345" y="118" class="label-r" text-anchor="middle">R จำกัดกระแส</text>

  <g transform="translate(495,75)">
    <polygon points="-20,-22 -20,22 18,0" class="led-body"/>
    <line x1="22" y1="-24" x2="22" y2="24" stroke="#dc2626" stroke-width="3"/>
    <line x1="-34" y1="0" x2="-20" y2="0" stroke="#334155" stroke-width="3"/>
    <line x1="22" y1="0" x2="34" y2="0" stroke="#334155" stroke-width="3"/>
    <line x1="35" y1="-25" x2="52" y2="-42" class="led-ray"/>
    <line x1="45" y1="-10" x2="64" y2="-18" class="led-ray"/>
  </g>
  <text x="495" y="38" class="text-main" text-anchor="middle">LED</text>
  <text x="495" y="118" fill="#dc2626" font-size="12" font-weight="700" text-anchor="middle">ใช้กระแสไม่มาก</text>

  <circle r="6" class="dot">
    <animateMotion dur="2.6s" repeatCount="indefinite">
      <mpath href="#closedCircuitPath"/>
    </animateMotion>
  </circle>
  <circle r="6" class="dot" opacity="0.75">
    <animateMotion dur="2.6s" begin="0.85s" repeatCount="indefinite">
      <mpath href="#closedCircuitPath"/>
    </animateMotion>
  </circle>
  <circle r="6" class="dot" opacity="0.5">
    <animateMotion dur="2.6s" begin="1.7s" repeatCount="indefinite">
      <mpath href="#closedCircuitPath"/>
    </animateMotion>
  </circle>

  <text x="380" y="166" class="text-main" text-anchor="middle">กระแสแบบดั้งเดิมไหลจาก + ไป - เมื่อวงจรปิด</text>
  <text x="380" y="188" class="text-sub" text-anchor="middle">แรงดัน (V) ผลักกระแส (I) ผ่านความต้านทาน (R)</text>
  <text x="380" y="228" class="text-code" text-anchor="middle">V = 3.3V   I = V/R   R ทำหน้าที่จำกัดกระแส</text>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 2.1 กระแสจะไหลได้เมื่อมีแหล่งจ่ายและเส้นทางกลับครบเป็นวงจรปิด</div>
</div>

> 💡 **หลักคิดง่าย ๆ:** ถ้ามีแรงดันแต่ไม่มีวงจรปิด กระแสจะไม่ไหล และถ้าความต้านทานสูงขึ้น กระแสที่ไหลในวงจรจะลดลง

### 3.1.2 กฎของโอห์ม (Ohm's Law)

กฎของโอห์มเป็นสมการพื้นฐานที่เชื่อมความสัมพันธ์ระหว่างแรงดัน กระแส และความต้านทาน:

$$V = IR$$

จากสมการเดียวกันนี้สามารถจัดรูปเพื่อหาค่าที่ต้องการได้:

$$I = \frac{V}{R}$$

$$R = \frac{V}{I}$$

ตัวอย่างเช่น ถ้าต้องการต่อ LED กับขาบอร์ดไมโครคอนโทรลเลอร์ (เช่น Arduino Uno ที่จ่ายแรงดัน $5\text{ V}$) และต้องการจำกัดกระแสประมาณ $15\text{ mA}$ โดยสมมติว่า LED สีแดงมีแรงดันตกคร่อมประมาณ $2.0\text{ V}$ แรงดันที่เหลือตกคร่อมตัวต้านทานคือ:

$$V_R = 5.0 - 2.0 = 3.0\text{ V}$$

ดังนั้นค่าตัวต้านทานที่เหมาะสมโดยประมาณคือ:

$$R = \frac{V_R}{I} = \frac{3.0}{0.015} = 200\ \Omega$$

ในการใช้งานจริงมักเลือกค่ามาตรฐานที่ใกล้และสูงขึ้นเล็กน้อย เช่น $220\ \Omega$ เพื่อจำกัดกระแสให้อยู่ในเกณฑ์ที่ปลอดภัยสำหรับขา GPIO

กำลังไฟฟ้า ($P$) คืออัตราการใช้พลังงานของอุปกรณ์ในวงจร คำนวณได้จาก:

$$P = VI = I^2R$$

ในวงจรเซนเซอร์บางชนิด เช่น Thermistor หรือ LDR หากเลือกตัวต้านทานต่ำเกินไป กระแสจะสูงขึ้นและทำให้เกิดความร้อนสะสมในตัวเซนเซอร์ ส่งผลให้ค่าที่อ่านได้คลาดเคลื่อน

> 💡 **หลักคิดง่าย ๆ:** กฎของโอห์มช่วยตอบคำถามว่า "ถ้ามีแรงดันเท่านี้และความต้านทานเท่านี้ กระแสจะไหลเท่าไร" ซึ่งเป็นพื้นฐานของการเลือกตัวต้านทานและการออกแบบวงจรอ่านค่าเซนเซอร์

### 3.1.3 วงจรอนุกรมและขนาน (Series & Parallel)

การต่อตัวต้านทานมี 2 รูปแบบพื้นฐานที่พบได้บ่อย คืออนุกรมและขนาน ซึ่งให้พฤติกรรมของแรงดันและกระแสต่างกัน

**วงจรอนุกรม (Series Circuit)** คือต่ออุปกรณ์เรียงกันเป็นเส้นทางเดียว กระแสจึงเท่ากันทุกจุด แต่แรงดันจะแบ่งตกคร่อมอุปกรณ์แต่ละตัว:

$$R_{total} = R_1 + R_2 + ...$$

**วงจรขนาน (Parallel Circuit)** คือต่ออุปกรณ์หลายกิ่งคร่อมแหล่งจ่ายเดียวกัน แรงดันแต่ละกิ่งจึงเท่ากัน แต่กระแสจะแบ่งไปตามแต่ละกิ่ง:

$$\frac{1}{R_{total}} = \frac{1}{R_1} + \frac{1}{R_2} + ...$$

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 820 330" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>เปรียบเทียบวงจรอนุกรมและวงจรขนาน</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .panel { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 8px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .series-flow { fill: none; stroke: #f59e0b; stroke-width: 3; stroke-dasharray: 8 10; animation: marchSeries 2.8s linear infinite; }
    .parallel-flow { fill: none; stroke: #10b981; stroke-width: 3; stroke-dasharray: 8 10; animation: marchParallel 2.2s linear infinite; }
    .resistor { fill: #eff6ff; stroke: #2563eb; stroke-width: 2; rx: 4px; }
    .battery { fill: #fef2f2; stroke: #dc2626; stroke-width: 2; rx: 6px; }
    .dot-s { fill: #f59e0b; stroke: #ffffff; stroke-width: 1; }
    .dot-p { fill: #10b981; stroke: #ffffff; stroke-width: 1; }
    .text-main { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 12px; fill: #64748b; }
    .text-code { font-size: 11px; font-family: monospace; font-weight: 700; fill: #7c3aed; }
    .voltage { fill: #dc2626; font-size: 12px; font-weight: 700; }
    .current { fill: #059669; font-size: 12px; font-weight: 700; }
    @keyframes marchSeries {
      to { stroke-dashoffset: -36; }
    }
    @keyframes marchParallel {
      to { stroke-dashoffset: -36; }
    }
    @keyframes valueBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.45; }
    }
    .blink { animation: valueBlink 2.2s ease-in-out infinite; }
  </style>
  <rect x="5" y="5" width="810" height="320" class="bg"/>

  <rect x="25" y="45" width="365" height="235" class="panel"/>
  <text x="207.5" y="28" class="text-main" text-anchor="middle">วงจรอนุกรม: กระแสเท่ากัน แรงดันแบ่งกัน</text>
  <path d="M 80 105 L 185 105 L 280 105 L 335 105 L 335 220 L 80 220 L 80 105" class="wire"/>
  <path id="seriesPath" d="M 80 105 L 185 105 L 280 105 L 335 105 L 335 220 L 80 220 L 80 105" class="series-flow"/>
  <rect x="55" y="140" width="50" height="45" class="battery"/>
  <text x="80" y="133" class="voltage" text-anchor="middle">3.3V</text>
  <text x="64" y="158" class="voltage">+</text>
  <text x="92" y="178" fill="#334155" font-weight="700">-</text>
  <rect x="155" y="80" width="70" height="50" class="resistor"/>
  <text x="190" y="101" class="text-main" text-anchor="middle">R1</text>
  <text x="190" y="118" class="text-sub" text-anchor="middle">10 kΩ</text>
  <rect x="260" y="80" width="70" height="50" class="resistor"/>
  <text x="295" y="101" class="text-main" text-anchor="middle">R2</text>
  <text x="295" y="118" class="text-sub" text-anchor="middle">10 kΩ</text>
  <text x="190" y="62" class="voltage blink" text-anchor="middle">V1 ≈ 1.65V</text>
  <text x="295" y="62" class="voltage blink" text-anchor="middle">V2 ≈ 1.65V</text>
  <text x="207.5" y="250" class="text-code" text-anchor="middle">Rtotal = 10k + 10k = 20kΩ</text>
  <text x="207.5" y="268" class="text-sub" text-anchor="middle">กระแสเส้นเดียวกันไหลผ่าน R1 และ R2 เท่ากัน</text>
  <circle r="5" class="dot-s">
    <animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#seriesPath"/></animateMotion>
  </circle>
  <circle r="5" class="dot-s" opacity="0.65">
    <animateMotion dur="2.8s" begin="1.4s" repeatCount="indefinite"><mpath href="#seriesPath"/></animateMotion>
  </circle>

  <rect x="430" y="45" width="365" height="235" class="panel"/>
  <text x="612.5" y="28" class="text-main" text-anchor="middle">วงจรขนาน: แรงดันเท่ากัน กระแสแบ่งกัน</text>
  <path d="M 485 105 L 560 105 L 560 80 L 720 80 L 720 220 L 485 220 L 485 105" class="wire"/>
  <path d="M 560 150 L 720 150" class="wire"/>
  <path id="parallelTopPath" d="M 485 105 L 560 105 L 560 80 L 720 80 L 720 220 L 485 220 L 485 105" class="parallel-flow"/>
  <path id="parallelMidPath" d="M 485 105 L 560 105 L 560 150 L 720 150 L 720 220 L 485 220 L 485 105" class="parallel-flow"/>
  <rect x="460" y="140" width="50" height="45" class="battery"/>
  <text x="485" y="133" class="voltage" text-anchor="middle">3.3V</text>
  <text x="464" y="158" class="voltage">+</text>
  <text x="497" y="178" fill="#334155" font-weight="700">-</text>
  <rect x="610" y="55" width="70" height="50" class="resistor"/>
  <text x="645" y="76" class="text-main" text-anchor="middle">R1</text>
  <text x="645" y="93" class="text-sub" text-anchor="middle">10 kΩ</text>
  <rect x="610" y="125" width="70" height="50" class="resistor"/>
  <text x="645" y="146" class="text-main" text-anchor="middle">R2</text>
  <text x="645" y="163" class="text-sub" text-anchor="middle">10 kΩ</text>
  <text x="735" y="84" class="voltage blink">V1 = 3.3V</text>
  <text x="735" y="154" class="voltage blink">V2 = 3.3V</text>
  <text x="560" y="126" class="current">I แบ่งเป็น 2 กิ่ง</text>
  <text x="612.5" y="250" class="text-code" text-anchor="middle">1/Rtotal = 1/10k + 1/10k  →  Rtotal = 5kΩ</text>
  <text x="612.5" y="268" class="text-sub" text-anchor="middle">กระแสรวม = กระแสกิ่ง R1 + กระแสกิ่ง R2</text>
  <circle r="5" class="dot-p">
    <animateMotion dur="2.2s" repeatCount="indefinite"><mpath href="#parallelTopPath"/></animateMotion>
  </circle>
  <circle r="5" class="dot-p" opacity="0.75">
    <animateMotion dur="2.2s" begin="0.35s" repeatCount="indefinite"><mpath href="#parallelMidPath"/></animateMotion>
  </circle>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 2.2 วงจรอนุกรมใช้หลักการแบ่งแรงดัน ส่วนวงจรขนานใช้หลักการแบ่งกระแส</div>
</div>

วงจรแบ่งแรงดัน (Voltage Divider) ที่จะใช้กับ LDR และ Thermistor ในหัวข้อ 2.2.2 เป็นตัวอย่างสำคัญของวงจรอนุกรม: ตัวต้านทานคงที่และตัวต้านทานของเซนเซอร์ต่อเรียงกัน ทำให้แรงดันที่จุดกึ่งกลางเปลี่ยนตามค่าความต้านทานของเซนเซอร์

> 💡 **หลักคิดง่าย ๆ:** อนุกรมเหมาะกับการ "แบ่งแรงดัน" ส่วนขนานเหมาะกับการ "แบ่งกระแส" และการเข้าใจสองแบบนี้ช่วยอ่านวงจรเซนเซอร์ได้ง่ายขึ้นมาก

### 3.1.4 ตัวต้านทานและตัวต้านทานพูลอัป/พูลดาวน์ (Resistor & Pull-up/Pull-down)

**ตัวต้านทาน (Resistor)** ทำหน้าที่ควบคุมหรือจำกัดกระแส แบ่งแรงดัน และกำหนดสถานะเริ่มต้นของสัญญาณในวงจร ตัวต้านทานจริงมักมีแถบสีบอกค่า เช่น น้ำตาล-ดำ-ส้ม หมายถึง $10\text{ k}\Omega$ และในโมดูลเซนเซอร์สมัยใหม่มักพิมพ์ค่าเป็นรหัสบนตัวชิ้นส่วน เช่น `103` หมายถึง $10 \times 10^3 = 10\text{ k}\Omega$

เมื่อขา GPIO ถูกตั้งเป็นอินพุต ขานั้นมีความต้านทานอินพุตสูงมาก หากไม่ได้ต่อกับ HIGH หรือ LOW อย่างชัดเจน ขาอาจอยู่ในสถานะ **ลอย (Floating)** ทำให้ค่าที่อ่านได้แกว่งหรือสุ่มเปลี่ยนเอง ตัวต้านทานพูลอัปและพูลดาวน์จึงใช้เพื่อกำหนดสถานะเริ่มต้นให้ขาอินพุต

*   **Pull-up:** ต่อตัวต้านทานจากขาสัญญาณไปยัง $V_{DD}$ ทำให้สถานะปกติเป็น HIGH และเมื่อสวิตช์หรือเซนเซอร์ดึงลงกราวด์ สถานะจะกลายเป็น LOW
*   **Pull-down:** ต่อตัวต้านทานจากขาสัญญาณลงกราวด์ ทำให้สถานะปกติเป็น LOW และเมื่อสวิตช์หรือเซนเซอร์ดึงขึ้น $V_{DD}$ สถานะจะกลายเป็น HIGH

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 310" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>ตัวต้านทาน pull-up กำหนดสถานะ HIGH และการดึงลง GND ทำให้เป็น LOW</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .mcu { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .wire-high { fill: none; stroke: #16a34a; stroke-width: 4; stroke-linecap: round; animation: showHigh 6s ease-in-out infinite; }
    .wire-low { fill: none; stroke: #dc2626; stroke-width: 4; stroke-linecap: round; animation: showLow 6s ease-in-out infinite; }
    .pull-current { fill: none; stroke: #f59e0b; stroke-width: 3; stroke-dasharray: 7 9; animation: pullCurrent 6s linear infinite; }
    .resistor { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .node { stroke: #ffffff; stroke-width: 2; animation: nodeState 6s ease-in-out infinite; }
    .switch-arm { stroke: #334155; stroke-width: 4; stroke-linecap: round; transform-origin: 330px 210px; animation: switchMove 6s ease-in-out infinite; }
    .text-main { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 12px; fill: #64748b; }
    .text-code { font-size: 12px; font-family: monospace; font-weight: 700; fill: #7c3aed; }
    .text-green { fill: #16a34a; }
    .text-red { fill: #dc2626; }
    .text-muted { fill: #64748b; }
    .state-high { animation: showHigh 6s ease-in-out infinite; }
    .state-low { animation: showLow 6s ease-in-out infinite; }
    @keyframes showHigh {
      0%, 42%, 100% { opacity: 1; }
      50%, 92% { opacity: 0; }
    }
    @keyframes showLow {
      0%, 42%, 100% { opacity: 0; }
      50%, 92% { opacity: 1; }
    }
    @keyframes nodeState {
      0%, 42%, 100% { fill: #16a34a; }
      50%, 92% { fill: #dc2626; }
    }
    @keyframes switchMove {
      0%, 42%, 100% { transform: rotate(-32deg); }
      50%, 92% { transform: rotate(0deg); }
    }
    @keyframes pullCurrent {
      0%, 42%, 100% { opacity: 0; stroke-dashoffset: 0; }
      50%, 92% { opacity: 1; stroke-dashoffset: -96; }
    }
  </style>
  <rect x="5" y="5" width="750" height="300" class="bg"/>

  <text x="380" y="32" class="text-main" text-anchor="middle">Pull-up: ปกติ HIGH, เมื่อสวิตช์/เซนเซอร์ดึงลง GND จะเป็น LOW</text>
  <line x1="210" y1="65" x2="210" y2="110" class="wire"/>
  <text x="210" y="55" fill="#dc2626" font-size="13" font-weight="700" text-anchor="middle">VDD 3.3V</text>
  <rect x="190" y="110" width="40" height="70" class="resistor"/>
  <line x1="196" y1="122" x2="224" y2="122" stroke="#fbbf24" stroke-width="3"/>
  <line x1="196" y1="140" x2="224" y2="140" stroke="#a78bfa" stroke-width="3"/>
  <line x1="196" y1="158" x2="224" y2="158" stroke="#dc2626" stroke-width="3"/>
  <text x="250" y="138" class="text-main">Pull-up</text>
  <text x="250" y="156" class="text-code">4.7kΩ - 10kΩ</text>

  <line x1="210" y1="180" x2="210" y2="210" class="wire"/>
  <line x1="210" y1="210" x2="505" y2="210" class="wire"/>
  <path d="M 210 180 L 210 210 L 505 210" class="wire-high"/>
  <path d="M 210 210 L 330 210 L 360 248" class="wire-low"/>
  <path d="M 210 65 L 210 110 M 210 180 L 210 210 L 330 210 L 360 248" class="pull-current"/>
  <circle cx="210" cy="210" r="8" class="node"/>
  <text x="210" y="235" class="text-sub" text-anchor="middle">จุดสัญญาณ</text>

  <rect x="505" y="170" width="170" height="80" class="mcu"/>
  <text x="590" y="198" class="text-main" text-anchor="middle">MCU GPIO / Pin</text>
  <text x="590" y="218" class="text-sub" text-anchor="middle">ตั้งเป็น INPUT</text>
  <text x="590" y="238" class="text-code state-high" text-anchor="middle">digitalRead() = HIGH</text>
  <text x="590" y="238" class="text-code state-low" text-anchor="middle" fill="#dc2626">digitalRead() = LOW</text>

  <line x1="360" y1="248" x2="360" y2="262" class="wire"/>
  <line x1="338" y1="262" x2="382" y2="262" class="wire"/>
  <line x1="346" y1="268" x2="374" y2="268" class="wire"/>
  <line x1="354" y1="274" x2="366" y2="274" class="wire"/>
  <text x="360" y="294" class="text-sub" text-anchor="middle">GND</text>
  <line x1="330" y1="210" x2="360" y2="248" class="switch-arm"/>
  <circle cx="330" cy="210" r="4" fill="#334155"/>
  <circle cx="360" cy="248" r="4" fill="#334155"/>
  <text x="360" y="188" class="text-sub" text-anchor="middle">สวิตช์/เซนเซอร์</text>

  <g class="state-high">
    <rect x="60" y="65" width="115" height="60" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
    <text x="117.5" y="91" class="text-main" fill="#047857" text-anchor="middle">ปล่อยไว้</text>
    <text x="117.5" y="110" class="text-sub" fill="#047857" text-anchor="middle">ขาถูกดึงเป็น HIGH</text>
  </g>
  <g class="state-low">
    <rect x="60" y="65" width="115" height="60" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
    <text x="117.5" y="91" class="text-main" fill="#dc2626" text-anchor="middle">ถูกกด/ทริกเกอร์</text>
    <text x="117.5" y="110" class="text-sub" fill="#dc2626" text-anchor="middle">สัญญาณลง LOW</text>
  </g>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 2.3 ตัวต้านทาน pull-up ทำให้ขาอินพุตมีสถานะชัดเจน ไม่ลอย และยอมให้อุปกรณ์ดึงสายลง LOW ได้</div>
</div>

แนวคิดนี้สำคัญมากกับ GPIO, I2C และ One-Wire เพราะบัสเหล่านี้มักต้องมีสถานะว่างเป็น HIGH แล้วให้อุปกรณ์บนบัสดึงสายลง LOW เมื่อจะส่งสัญญาณ ในหัวข้อ 2.5 และตัวอย่างเซนเซอร์หัวข้อ 2.6 จะเห็นการใช้ pull-up ค่า $4.7\text{ k}\Omega$ ถึง $10\text{ k}\Omega$ กับสาย I2C และ One-Wire อยู่บ่อยครั้ง

> 💡 **หลักคิดง่าย ๆ:** Pull-up และ pull-down ไม่ได้มีไว้เพิ่มความซับซ้อน แต่มีไว้ทำให้ GPIO มีคำตอบชัดเจนว่าเป็น HIGH หรือ LOW เมื่อไม่มีใครขับสัญญาณอยู่

### 3.1.5 ตัวเก็บประจุ (Capacitor)

**ตัวเก็บประจุ (Capacitor)** คืออุปกรณ์ที่เก็บประจุไฟฟ้าและพลังงานไว้ในรูปของสนามไฟฟ้าระหว่างแผ่นตัวนำ 2 แผ่นที่มีฉนวนคั่นกลาง เมื่อต่อกับแหล่งจ่าย แผ่นหนึ่งจะสะสมประจุบวก อีกแผ่นหนึ่งจะสะสมประจุลบ และเมื่อตัดแหล่งจ่ายหรือมีทางให้กระแสไหลกลับ ตัวเก็บประจุจะคายประจุออกมา

ถ้าเปรียบกับน้ำในท่อ ตัวเก็บประจุคล้าย **ถังเก็บน้ำขนาดเล็ก** ที่รับน้ำเข้าได้เมื่อมีแรงดัน และปล่อยน้ำออกได้เมื่อแรงดันรอบข้างลดลง ถังใหญ่กว่าจะเก็บน้ำได้มากกว่า เช่นเดียวกับตัวเก็บประจุที่มีค่าความจุสูงกว่าจะเก็บประจุได้มากกว่าเมื่อแรงดันเท่ากัน

ค่าความจุไฟฟ้าใช้หน่วย **ฟารัด ($\text{F}$)** แต่ในการใช้งานจริงกับวงจรไมโครคอนโทรลเลอร์มักใช้หน่วยย่อย ได้แก่ ไมโครฟารัด ($\mu\text{F}$), นาโนฟารัด ($\text{nF}$) และพิโกฟารัด ($\text{pF}$) เช่น $0.1\ \mu\text{F}$, $1\ \mu\text{F}$ หรือ $10\ \mu\text{F}$

ปริมาณประจุที่ตัวเก็บประจุเก็บได้สัมพันธ์กับค่าความจุและแรงดันตามสมการ:

$$Q = CV$$

โดยที่ $Q$ คือประจุไฟฟ้าในหน่วยคูลอมบ์ ($\text{C}$), $C$ คือค่าความจุในหน่วยฟารัด ($\text{F}$) และ $V$ คือแรงดันคร่อมตัวเก็บประจุในหน่วยโวลต์ ($\text{V}$)

เมื่อตัวเก็บประจุต่อร่วมกับตัวต้านทานจะได้ **วงจร RC** ซึ่งมีพฤติกรรมสำคัญคือแรงดันคร่อมตัวเก็บประจุจะไม่เปลี่ยนทันที แต่จะชาร์จหรือคายประจุแบบโค้ง exponential ค่าที่บอกความเร็วของการเปลี่ยนแปลงนี้เรียกว่า **ค่าคงที่เวลา (Time Constant)**:

$$\tau = RC$$

โดยที่ $\tau$ มีหน่วยเป็นวินาที เมื่อเวลาผ่านไป $1\tau$ ระหว่างการชาร์จ แรงดันคร่อมตัวเก็บประจุจะขึ้นได้ประมาณ $63\%$ ของค่าสุดท้าย และหลังผ่านไปหลายเท่าของ $\tau$ แรงดันจะเข้าใกล้ค่าสุดท้ายมากขึ้นเรื่อย ๆ ในทางกลับกัน เมื่อคายประจุ แรงดันจะลดลงแบบ exponential เข้าหา $0\text{ V}$

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 820 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>วงจร RC แสดงการชาร์จและคายประจุของตัวเก็บประจุพร้อมกราฟแรงดันแบบ exponential</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .panel { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 8px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .wire-charge { fill: none; stroke: #16a34a; stroke-width: 4; stroke-linecap: round; animation: chargeWire 8s ease-in-out infinite; }
    .wire-discharge { fill: none; stroke: #dc2626; stroke-width: 4; stroke-linecap: round; animation: dischargeWire 8s ease-in-out infinite; }
    .current-charge { fill: none; stroke: #f59e0b; stroke-width: 3; stroke-dasharray: 8 10; animation: chargeCurrent 8s linear infinite; }
    .current-discharge { fill: none; stroke: #ef4444; stroke-width: 3; stroke-dasharray: 8 10; animation: dischargeCurrent 8s linear infinite; }
    .battery { fill: #fef2f2; stroke: #dc2626; stroke-width: 2; rx: 6px; }
    .resistor { fill: #eff6ff; stroke: #2563eb; stroke-width: 2; rx: 4px; }
    .cap-plate { stroke: #334155; stroke-width: 5; stroke-linecap: round; }
    .cap-charge { fill: #16a34a; font-size: 18px; font-weight: 800; animation: chargeMarks 8s ease-in-out infinite; }
    .cap-empty { fill: #94a3b8; font-size: 18px; font-weight: 800; animation: emptyMarks 8s ease-in-out infinite; }
    .dot-c { fill: #f59e0b; stroke: #ffffff; stroke-width: 1.5; animation: dotChargeFade 8s ease-in-out infinite; }
    .dot-d { fill: #ef4444; stroke: #ffffff; stroke-width: 1.5; animation: dotDischargeFade 8s ease-in-out infinite; }
    .axis { stroke: #64748b; stroke-width: 1.5; stroke-linecap: round; }
    .grid { stroke: #e2e8f0; stroke-width: 1; }
    .target { stroke: #16a34a; stroke-width: 1.5; stroke-dasharray: 5 5; }
    .curve-base { fill: none; stroke: #cbd5e1; stroke-width: 3; stroke-linecap: round; }
    .curve-charge { fill: none; stroke: #16a34a; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 250; animation: drawChargeCurve 8s ease-in-out infinite; }
    .curve-discharge { fill: none; stroke: #dc2626; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 250; animation: drawDischargeCurve 8s ease-in-out infinite; }
    .tau-line { stroke: #7c3aed; stroke-width: 1.5; stroke-dasharray: 4 4; animation: tauPulse 8s ease-in-out infinite; }
    .text-main { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 12px; fill: #64748b; }
    .text-code { font-size: 12px; font-family: monospace; font-weight: 700; fill: #7c3aed; }
    .state-charge { animation: showCharge 8s ease-in-out infinite; }
    .state-full { animation: showFull 8s ease-in-out infinite; }
    .state-discharge { animation: showDischarge 8s ease-in-out infinite; }
    .state-empty { animation: showEmpty 8s ease-in-out infinite; }
    @keyframes showCharge {
      0%, 45% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    @keyframes showFull {
      0%, 43%, 56%, 100% { opacity: 0; }
      46%, 54% { opacity: 1; }
    }
    @keyframes showDischarge {
      0%, 54%, 92%, 100% { opacity: 0; }
      58%, 88% { opacity: 1; }
    }
    @keyframes showEmpty {
      0%, 90% { opacity: 0; }
      94%, 100% { opacity: 1; }
    }
    @keyframes chargeWire {
      0%, 45% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    @keyframes dischargeWire {
      0%, 54%, 100% { opacity: 0; }
      58%, 90% { opacity: 1; }
    }
    @keyframes chargeCurrent {
      0% { opacity: 1; stroke-dashoffset: 0; }
      28% { opacity: 0.65; stroke-dashoffset: -70; }
      45% { opacity: 0; stroke-dashoffset: -110; }
      46%, 100% { opacity: 0; stroke-dashoffset: -110; }
    }
    @keyframes dischargeCurrent {
      0%, 54% { opacity: 0; stroke-dashoffset: 0; }
      58% { opacity: 1; stroke-dashoffset: 0; }
      75% { opacity: 0.65; stroke-dashoffset: 70; }
      90%, 100% { opacity: 0; stroke-dashoffset: 110; }
    }
    @keyframes dotChargeFade {
      0%, 22% { opacity: 1; }
      38% { opacity: 0.25; }
      45%, 100% { opacity: 0; }
    }
    @keyframes dotDischargeFade {
      0%, 56% { opacity: 0; }
      60%, 74% { opacity: 1; }
      88%, 100% { opacity: 0; }
    }
    @keyframes chargeMarks {
      0% { opacity: 0.1; }
      20% { opacity: 0.55; }
      45%, 56% { opacity: 1; }
      75% { opacity: 0.4; }
      92%, 100% { opacity: 0.1; }
    }
    @keyframes emptyMarks {
      0%, 18% { opacity: 0.8; }
      35%, 82% { opacity: 0; }
      94%, 100% { opacity: 0.8; }
    }
    @keyframes drawChargeCurve {
      0% { opacity: 1; stroke-dashoffset: 250; }
      45% { opacity: 1; stroke-dashoffset: 0; }
      52% { opacity: 1; stroke-dashoffset: 0; }
      58%, 100% { opacity: 0; stroke-dashoffset: 0; }
    }
    @keyframes drawDischargeCurve {
      0%, 54% { opacity: 0; stroke-dashoffset: 250; }
      58% { opacity: 1; stroke-dashoffset: 250; }
      90% { opacity: 1; stroke-dashoffset: 0; }
      100% { opacity: 0; stroke-dashoffset: 0; }
    }
    @keyframes tauPulse {
      0%, 8%, 45%, 100% { opacity: 0.25; }
      16%, 35% { opacity: 1; }
      62%, 82% { opacity: 1; }
    }
  </style>
  <rect x="5" y="5" width="810" height="350" class="bg"/>

  <rect x="25" y="45" width="365" height="265" class="panel"/>
  <text x="207.5" y="28" class="text-main" text-anchor="middle">วงจร RC: ตัวเก็บประจุชาร์จและคายผ่านตัวต้านทาน</text>

  <path d="M 85 125 L 160 125 L 255 125 L 330 125 L 330 235 L 85 235 L 85 125" class="wire"/>
  <path d="M 85 125 L 160 125 L 255 125 L 330 125 L 330 235" class="wire-charge"/>
  <path d="M 330 235 L 255 235 L 255 125 L 160 125 L 85 125" class="wire-discharge"/>
  <path id="chargePath" d="M 85 125 L 160 125 L 255 125 L 330 125 L 330 180" class="current-charge"/>
  <path id="dischargePath" d="M 330 180 L 330 235 L 255 235 L 255 125 L 160 125 L 85 125" class="current-discharge"/>

  <rect x="60" y="155" width="50" height="55" class="battery"/>
  <line x1="76" y1="166" x2="76" y2="198" stroke="#dc2626" stroke-width="4"/>
  <line x1="94" y1="174" x2="94" y2="190" stroke="#334155" stroke-width="4"/>
  <text x="85" y="146" fill="#dc2626" font-size="12" font-weight="700" text-anchor="middle">3.3V</text>
  <text x="66" y="168" fill="#dc2626" font-weight="700">+</text>
  <text x="98" y="200" fill="#334155" font-weight="700">-</text>

  <rect x="145" y="100" width="70" height="50" class="resistor"/>
  <text x="180" y="121" class="text-main" text-anchor="middle">R</text>
  <text x="180" y="138" class="text-sub" text-anchor="middle">10 kΩ</text>

  <line x1="315" y1="155" x2="315" y2="205" class="cap-plate"/>
  <line x1="345" y1="155" x2="345" y2="205" class="cap-plate"/>
  <line x1="330" y1="125" x2="330" y2="155" class="wire"/>
  <line x1="330" y1="205" x2="330" y2="235" class="wire"/>
  <text x="330" y="146" class="text-main" text-anchor="middle">C</text>
  <text x="330" y="222" class="text-sub" text-anchor="middle">0.1 μF</text>
  <text x="303" y="175" class="cap-charge" text-anchor="middle">+</text>
  <text x="303" y="195" class="cap-charge" text-anchor="middle">+</text>
  <text x="357" y="175" class="cap-charge" text-anchor="middle">-</text>
  <text x="357" y="195" class="cap-charge" text-anchor="middle">-</text>
  <text x="303" y="187" class="cap-empty" text-anchor="middle">±</text>
  <text x="357" y="187" class="cap-empty" text-anchor="middle">±</text>

  <circle r="5" class="dot-c">
    <animateMotion dur="8s" repeatCount="indefinite">
      <mpath href="#chargePath"/>
    </animateMotion>
  </circle>
  <circle r="5" class="dot-c" opacity="0.75">
    <animateMotion dur="8s" begin="0.75s" repeatCount="indefinite">
      <mpath href="#chargePath"/>
    </animateMotion>
  </circle>
  <circle r="5" class="dot-d">
    <animateMotion dur="8s" repeatCount="indefinite">
      <mpath href="#dischargePath"/>
    </animateMotion>
  </circle>
  <circle r="5" class="dot-d" opacity="0.75">
    <animateMotion dur="8s" begin="0.75s" repeatCount="indefinite">
      <mpath href="#dischargePath"/>
    </animateMotion>
  </circle>

  <g class="state-charge">
    <rect x="55" y="250" width="305" height="40" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
    <text x="207.5" y="275" class="text-main" fill="#047857" text-anchor="middle">กำลังชาร์จ: กระแสไหลมากตอนเริ่ม แล้วค่อย ๆ ลดลง</text>
  </g>
  <g class="state-full">
    <rect x="55" y="250" width="305" height="40" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
    <text x="207.5" y="275" class="text-main" fill="#166534" text-anchor="middle">ชาร์จเต็มโดยประมาณ: กระแส DC หยุดไหล</text>
  </g>
  <g class="state-discharge">
    <rect x="55" y="250" width="305" height="40" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
    <text x="207.5" y="275" class="text-main" fill="#dc2626" text-anchor="middle">กำลังคายประจุ: แรงดันลดลงเข้าหา 0V</text>
  </g>
  <g class="state-empty">
    <rect x="55" y="250" width="305" height="40" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="207.5" y="275" class="text-main" fill="#475569" text-anchor="middle">คายประจุแล้ว: พร้อมเริ่มรอบใหม่</text>
  </g>

  <rect x="430" y="45" width="365" height="265" class="panel"/>
  <text x="612.5" y="28" class="text-main" text-anchor="middle">กราฟแรงดันคร่อมตัวเก็บประจุ</text>
  <line x1="470" y1="235" x2="725" y2="235" class="axis"/>
  <line x1="470" y1="235" x2="470" y2="65" class="axis"/>
  <line x1="470" y1="78" x2="725" y2="78" class="target"/>
  <line x1="535" y1="235" x2="535" y2="115" class="tau-line"/>
  <line x1="470" y1="137" x2="535" y2="137" class="tau-line"/>
  <line x1="470" y1="115" x2="725" y2="115" class="grid"/>
  <line x1="470" y1="175" x2="725" y2="175" class="grid"/>
  <text x="458" y="82" class="text-sub" text-anchor="end">Vfinal</text>
  <text x="458" y="140" class="text-sub" text-anchor="end">63%</text>
  <text x="535" y="252" class="text-code" text-anchor="middle">τ = RC</text>
  <text x="726" y="252" class="text-sub" text-anchor="end">เวลา</text>
  <text x="452" y="70" class="text-sub" text-anchor="middle" transform="rotate(-90 452 70)">Vc</text>

  <path d="M 470 215 C 500 145, 545 105, 610 88 C 650 80, 685 78, 710 78" class="curve-base"/>
  <path d="M 470 78 C 505 135, 550 180, 610 202 C 650 214, 685 216, 710 216" class="curve-base"/>
  <path d="M 470 215 C 500 145, 545 105, 610 88 C 650 80, 685 78, 710 78" class="curve-charge"/>
  <path d="M 470 78 C 505 135, 550 180, 610 202 C 650 214, 685 216, 710 216" class="curve-discharge"/>

  <g class="state-charge">
    <text x="612.5" y="286" class="text-code text-green" text-anchor="middle">Charging: Vc เพิ่มเร็วตอนแรก แล้วค่อย ๆ เข้าใกล้ 3.3V</text>
  </g>
  <g class="state-discharge">
    <text x="612.5" y="286" class="text-code text-red" text-anchor="middle">Discharging: Vc ลดเร็วตอนแรก แล้วค่อย ๆ เข้าใกล้ 0V</text>
  </g>
  <g class="state-full">
    <text x="612.5" y="286" class="text-code text-green" text-anchor="middle">เมื่อ Vc เกือบเท่าแหล่งจ่าย กระแสชาร์จ ≈ 0</text>
  </g>
  <g class="state-empty">
    <text x="612.5" y="286" class="text-code text-muted" text-anchor="middle">แรงดันเหลือใกล้ 0V ก่อนเริ่มชาร์จรอบถัดไป</text>
  </g>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 2.4 วงจร RC ชาร์จและคายประจุแบบ exponential โดยกระแสจะมากตอนเริ่มและลดลงเมื่อแรงดันคร่อมตัวเก็บประจุเข้าใกล้ค่าสุดท้าย</div>
</div>

ในงาน IoT และเซนเซอร์ ตัวเก็บประจุไม่ได้มีไว้เก็บพลังงานอย่างเดียว แต่ช่วยให้สัญญาณและไฟเลี้ยงนิ่งขึ้นด้วย ตัวอย่างที่พบบ่อย ได้แก่

*   **ตัวเก็บประจุดีคัปปลิ้ง/บายพาส (Decoupling/Bypass Capacitor):** ใช้ลดสัญญาณรบกวนบนสายไฟเลี้ยง โดยมักต่อ $0.1\ \mu\text{F}$ คร่อมระหว่าง VCC กับ GND ใกล้ชิปเซนเซอร์หรือ ESP32 ให้มากที่สุด เพื่อให้ชิปมีแหล่งจ่ายประจุเล็ก ๆ อยู่ใกล้ตัวเมื่อต้องการกระแสชั่วขณะ
*   **การกรองสัญญาณรบกวน (Filtering):** เมื่อต่อร่วมกับตัวต้านทานจะสร้างตัวกรองความถี่ต่ำอย่างง่าย ช่วยลดการแกว่งเร็ว ๆ ของแรงดันก่อนส่งเข้า ADC ทำให้ค่าที่อ่านได้จากเซนเซอร์แอนะล็อกนิ่งขึ้น
*   **การลดการกระเด้งของปุ่มกด (Debounce):** ใช้ร่วมกับตัวต้านทานเพื่อทำให้แรงดันที่ขาอินพุตเปลี่ยนช้าลงเล็กน้อย ลดพัลส์สั้น ๆ ที่เกิดจากหน้าสัมผัสปุ่มกดกระเด้ง

> 💡 **หลักคิดง่าย ๆ:** ตัวเก็บประจุทำหน้าที่เหมือนถังพักประจุ ช่วยรับหรือจ่ายประจุชั่วคราว ทำให้แรงดันไม่เปลี่ยนแบบกระชาก และช่วยให้วงจรเซนเซอร์อ่านค่าได้นิ่งขึ้น

---

## 3.2 เซนเซอร์คืออะไร และหลักการแปลงปริมาณกายภาพเป็นสัญญาณไฟฟ้า

**เซนเซอร์ (Sensor)** คืออุปกรณ์ที่ตรวจจับปริมาณทางกายภาพ (Physical Quantity) แล้วแปลงให้เป็นสัญญาณไฟฟ้า (Electrical Signal) ที่ไมโครคอนโทรลเลอร์สามารถอ่านค่าได้

### 3.2.1 ทรานสดิวเซอร์ (Transducer)

คำว่า **ทรานสดิวเซอร์** หมายถึงอุปกรณ์ที่แปลงพลังงานรูปหนึ่งไปเป็นอีกรูปหนึ่ง เซนเซอร์จึงเป็นทรานสดิวเซอร์ประเภทหนึ่งที่แปลง *พลังงานทางกายภาพ → พลังงานไฟฟ้า*

**กระบวนการทำงาน:**

<div style="text-align: center; margin: 24px 0;">
<svg viewBox="0 0 850 140" width="100%" height="auto" role="img" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', 'Segoe UI', sans-serif">
  <title>กระบวนการแปลงปริมาณกายภาพเป็นข้อมูลดิจิทัล</title>
  <style>
    .flow-arrow { fill: none; stroke: #94a3b8; stroke-width: 1.5; }
    .physical-flow { fill: none; stroke: #16a34a; stroke-width: 2; stroke-dasharray: 6 4; animation: march 1.5s linear infinite; }
    .analog-flow { fill: none; stroke: #2563eb; stroke-width: 2; stroke-dasharray: 8 4; animation: march 2s linear infinite; }
    .electrical-flow { fill: none; stroke: #d97706; stroke-width: 2; stroke-dasharray: 8 4; animation: march 2s linear infinite; }
    .digital-flow { fill: none; stroke: #8b5cf6; stroke-width: 2; stroke-dasharray: 2 6; stroke-linecap: round; stroke-width: 4; animation: march 1s linear infinite; }

    @keyframes march {
      to {
        stroke-dashoffset: -20;
      }
    }
  </style>

  <!-- Box 1: ปริมาณกายภาพ -->
  <rect x="15" y="25" width="135" height="90" rx="12" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
  <text x="82.5" y="53" fill="#166534" font-size="13" font-weight="700" text-anchor="middle">ปริมาณกายภาพ</text>
  <text x="82.5" y="71" fill="#15803d" font-size="11" text-anchor="middle">(Physical Quantity)</text>
  <text x="82.5" y="91" fill="#22c55e" font-size="10" text-anchor="middle">ความร้อน, แสง, ความสั่น</text>

  <!-- Arrow 1: Physical flow (wavy/dashed) -->
  <path d="M 150 70 C 158 60, 163 80, 171 70 C 176 64, 180 70, 185 70" class="physical-flow"/>
  <polygon points="185,70 178,66 178,74" fill="#16a34a"/>

  <!-- Box 2: เซนเซอร์/ทรานสดิวเซอร์ -->
  <rect x="185" y="25" width="135" height="90" rx="12" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
  <text x="252.5" y="50" fill="#1e40af" font-size="13" font-weight="700" text-anchor="middle">เซนเซอร์ /</text>
  <text x="252.5" y="68" fill="#1e40af" font-size="13" font-weight="700" text-anchor="middle">ทรานสดิวเซอร์</text>
  <text x="252.5" y="90" fill="#3b82f6" font-size="10" text-anchor="middle">LDR, Thermistor, RTD</text>

  <!-- Arrow 2: Analog signal flow (voltage wave) -->
  <path d="M 320 70 C 328 55, 335 85, 343 70 C 349 58, 352 70, 355 70" class="analog-flow"/>
  <polygon points="355,70 348,66 348,74" fill="#2563eb"/>

  <!-- Box 3: สัญญาณไฟฟ้า -->
  <rect x="355" y="25" width="135" height="90" rx="12" fill="#fffbeb" stroke="#d97706" stroke-width="1.5"/>
  <text x="422.5" y="53" fill="#92400e" font-size="13" font-weight="700" text-anchor="middle">สัญญาณไฟฟ้า</text>
  <text x="422.5" y="71" fill="#b45309" font-size="11" text-anchor="middle">(Electrical Signal)</text>
  <text x="422.5" y="91" fill="#d97706" font-size="10" text-anchor="middle">แรงดัน (V), ความต้านทาน (Ω)</text>

  <!-- Arrow 3: Electrical signal flow -->
  <path d="M 490 70 C 498 55, 505 85, 513 70 C 519 58, 522 70, 525 70" class="electrical-flow"/>
  <polygon points="525,70 518,66 518,74" fill="#d97706"/>

  <!-- Box 4: ADC ใน Arduino Uno -->
  <rect x="525" y="25" width="135" height="90" rx="12" fill="#faf5ff" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="592.5" y="53" fill="#5b21b6" font-size="13" font-weight="700" text-anchor="middle">ADC ใน Arduino Uno</text>
  <text x="592.5" y="71" fill="#6d28d9" font-size="11" text-anchor="middle">(Analog-to-Digital)</text>
  <text x="592.5" y="91" fill="#8b5cf6" font-size="10" text-anchor="middle">ทำการสุ่มวัด &amp; กำหนดระดับ</text>

  <!-- Arrow 4: Digital discrete pulse flow -->
  <line x1="660" y1="70" x2="695" y2="70" class="digital-flow"/>
  <polygon points="695,70 688,66 688,74" fill="#7c3aed"/>

  <!-- Box 5: ค่าดิจิทัล -->
  <rect x="695" y="25" width="135" height="90" rx="12" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
  <text x="762.5" y="53" fill="#065f46" font-size="13" font-weight="700" text-anchor="middle">ค่าดิจิทัล</text>
  <text x="762.5" y="71" fill="#047857" font-size="11" text-anchor="middle">(Digital Value)</text>
  <text x="762.5" y="91" fill="#10b981" font-size="10" text-anchor="middle">ตัวเลข 0 – 1023 (10-bit)</text>
</svg>
</div>

**ตัวอย่าง:** เทอร์มิสเตอร์ (Thermistor) เปลี่ยนอุณหภูมิเป็นค่าความต้านทานไฟฟ้าที่เปลี่ยนแปลง → ไมโครคอนโทรลเลอร์ (เช่น Arduino Uno) อ่านค่าแรงดันที่เปลี่ยนไปตามความต้านทาน → คำนวณกลับเป็นองศาเซลเซียส

> 💡 **หลักคิดง่าย ๆ:** เซนเซอร์ทุกตัวทำหน้าที่เหมือน "นักแปล" ที่แปลงภาษาของธรรมชาติ (ความร้อน แสง เสียง) ให้เป็นภาษาของไฟฟ้า (แรงดัน กระแส ความต้านทาน) ที่ไมโครคอนโทรลเลอร์เข้าใจ

### 3.2.2 หลักการทางฟิสิกส์และแบบจำลองทางคณิตศาสตร์ของเซนเซอร์แบบความต้านทาน (Resistive Sensors)

ในงานวิศวกรรม เซนเซอร์ที่พบบ่อยที่สุดประเภทหนึ่งคือ **เซนเซอร์แบบแปรผันตามความต้านทาน (Resistive Sensors)** เช่น LDR, Thermistor และ RTD อุปกรณ์เหล่านี้จะเปลี่ยนคุณสมบัติทางกายภาพเป็นความต้านทานไฟฟ้า เพื่อนำไปประมวลผลต่อ

#### 1. หลักการทางฟิสิกส์ของตัวรับรู้แต่ละชนิด

*   **LDR (Light Dependent Resistor):** โครงสร้างสร้างจากสารกึ่งตัวนำประเภทแคดเมียมซัลไฟด์ (CdS) เมื่อไม่มีแสงตกกระทบ อิเล็กตรอนส่วนใหญ่จะอยู่ในแถบวาเลนซ์ (Valence Band) ทำให้ความต้านทานสูงมาก (หลักหลายเมกะโอห์ม) แต่เมื่อมีแสง (โฟตอนที่มีพลังงานสูงกว่าพลังงานช่องว่างแถบหรือ Band Gap) มาตกกระทบ พลังงานจากแสงจะกระตุ้นอิเล็กตรอนให้กระโดดขึ้นไปยังแถบนำไฟฟ้า (Conduction Band) ทำให้เกิดคู่อิเล็กตรอนและโฮลอิสระมากขึ้น ความนำไฟฟ้าเพิ่มขึ้น และส่งผลให้ความต้านทานลดลงอย่างรวดเร็วเป็นฟังก์ชันไม่เชิงเส้นตามความเข้มแสง ($E$ ในหน่วย Lux):
    $$R_{LDR} = A \cdot E^{-\alpha}$$
    โดยที่ $A$ และ $\alpha$ เป็นค่าคงที่เฉพาะตัวชิ้นงานนั้น ๆ

*   **NTC Thermistor (Negative Temperature Coefficient):** ทำจากโลหะออกไซด์ที่เป็นสารกึ่งตัวนำ เมื่ออุณหภูมิสูงขึ้น พลังงานความร้อนจะกระตุ้นให้มีพาหะนำไฟฟ้าอิสระ (Free Carriers) หลุดรอดข้าม Band Gap มากขึ้น ทำให้ความต้านทานลดลงตามอุณหภูมิที่สูงขึ้น

*   **RTD PT100 (Resistance Temperature Detector):** ทำจากโลหะบริสุทธิ์อย่างแพลทินัม (Platinum) โลหะมีพฤติกรรมตรงกันข้ามกับสารกึ่งตัวนำ เมื่ออุณหภูมิสูงขึ้น อะตอมในโครงสร้างตาข่าย (Lattice) ของโลหะจะสั่นสะเทือนรุนแรงขึ้น ส่งผลให้เกิดการกระเจิง (Scattering) ของอิเล็กตรอนนำไฟฟ้า ทำให้เคลื่อนที่ได้ยากขึ้น ดังนั้น ความต้านทานไฟฟ้าของ PT100 จึงเพิ่มขึ้นเมื่ออุณหภูมิสูงขึ้นอย่างเป็นเชิงเส้นสูงมาก

#### 3.2.3 วงจรแบ่งแรงดันไฟฟ้า (Voltage Divider)

เนื่องจากไมโครคอนโทรลเลอร์อย่าง Arduino Uno หรือ ESP32 ไม่สามารถวัดค่าความต้านทานไฟฟ้า ($R$) ได้โดยตรง (อ่านค่าได้เฉพาะแรงดันไฟฟ้า $V$) เราจึงต้องใช้วงจรแบ่งแรงดันเพื่อแปลงการเปลี่ยนแปลงของค่า $R$ เป็นแรงดันไฟฟ้า $V_{out}$

<div style="text-align: center; margin: 24px 0;">
<svg viewBox="0 0 750 250" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <style>
    .schematic-bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 12px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; }
    .wire-current { fill: none; stroke: #fbbf24; stroke-width: 3; stroke-dasharray: 8 8; animation: currentFlow 4s linear infinite; }
    .resistor-box { fill: #ffffff; stroke: #334155; stroke-width: 2.5; rx: 2px; }
    .ldr-outline { fill: #fef08a; stroke: #2563eb; stroke-width: 2; }
    .ldr-arrow { fill: none; stroke: #2563eb; stroke-width: 1.5; }
    .arrow-head { fill: #2563eb; }

    .light-ray { stroke: #facc15; stroke-width: 3; stroke-dasharray: 4 2; opacity: 0.1; animation: lightPulse 8s ease-in-out infinite; }
    .voltmeter-dial { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; }
    .voltmeter-pointer { fill: none; stroke: #ef4444; stroke-width: 3; stroke-linecap: round; transform-origin: 520px 140px; animation: needleMove 8s ease-in-out infinite; }
    .status-text { font-size: 13px; font-weight: bold; fill: #1e293b; }
    .formula-text { font-size: 11px; fill: #64748b; font-family: monospace; }

    @keyframes currentFlow {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes lightPulse {
      0%, 100% { opacity: 0.1; }
      40%, 60% { opacity: 1.0; }
    }
    @keyframes needleMove {
      0%, 100% { transform: rotate(0deg); }   /* Vout = 1.65V (Dark) */
      40%, 60% { transform: rotate(-74deg); }  /* Vout = 0.3V (Bright) */
    }

    /* Variable text display sync */
    .txt-dark { animation: showDark 8s infinite; }
    .txt-light { animation: showLight 8s infinite; }

    @keyframes showDark {
      0%, 25%, 75%, 100% { opacity: 1; }
      35%, 65% { opacity: 0; }
    }
    @keyframes showLight {
      0%, 25%, 75%, 100% { opacity: 0; }
      35%, 65% { opacity: 1; }
    }
  </style>

  <!-- Outer container -->
  <rect x="5" y="5" width="740" height="240" class="schematic-bg"/>

  <!-- Left Side: Schematic -->
  <!-- V_in Connection -->
  <line x1="120" y1="25" x2="120" y2="55" class="wire"/>
  <text x="120" y="20" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">V_in (5V)</text>

  <!-- R_fixed -->
  <rect x="105" y="55" width="30" height="50" class="resistor-box"/>
  <text x="95" y="83" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="end">R_fixed</text>
  <text x="95" y="98" font-size="10" fill="#64748b" text-anchor="end">10 kΩ</text>

  <!-- Middle connection to V_out -->
  <line x1="120" y1="105" x2="120" y2="135" class="wire"/>
  <line x1="120" y1="120" x2="220" y2="120" class="wire"/>
  <text x="225" y="115" font-size="12" font-weight="bold" fill="#7c3aed">V_out</text>
  <text x="225" y="130" font-size="10" fill="#6d28d9">(ไปยังขา ADC Arduino Uno)</text>

  <!-- R_sensor (LDR) -->
  <circle cx="120" cy="160" r="28" class="ldr-outline"/>
  <!-- Resistor zigzag or simple box inside circle -->
  <rect x="110" y="145" width="20" height="30" fill="#ffffff" stroke="#334155" stroke-width="1.5"/>
  <!-- LDR Arrows -->
  <line x1="72" y1="140" x2="94" y2="152" class="ldr-arrow"/>
  <polygon points="94,152 87,147 91,154" class="arrow-head"/>
  <line x1="80" y1="130" x2="102" y2="142" class="ldr-arrow"/>
  <polygon points="102,142 95,137 99,144" class="arrow-head"/>
  <text x="160" y="165" font-size="12" font-weight="bold" fill="#2563eb">R_sensor (LDR)</text>

  <!-- Ground Connection -->
  <line x1="120" y1="188" x2="120" y2="210" class="wire"/>
  <line x1="100" y1="210" x2="140" y2="210" class="wire"/>
  <line x1="108" y1="216" x2="132" y2="216" class="wire"/>
  <line x1="115" y1="222" x2="125" y2="222" class="wire"/>
  <text x="120" y="235" font-size="11" fill="#64748b" text-anchor="middle">GND (0V)</text>

  <!-- Current Flow Animation on Schematic Wire -->
  <path d="M 120 25 L 120 120 L 220 120 M 120 120 L 120 210" class="wire-current"/>

  <!-- Right Side: Graphic explanation of light sensor voltage division -->
  <!-- Sun representing Light Source -->
  <circle cx="340" cy="50" r="18" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  <!-- Sun rays -->
  <line x1="340" y1="25" x2="340" y2="12" stroke="#ca8a04" stroke-width="2"/>
  <line x1="340" y1="75" x2="340" y2="88" stroke="#ca8a04" stroke-width="2"/>
  <line x1="315" y1="50" x2="302" y2="50" stroke="#ca8a04" stroke-width="2"/>
  <line x1="365" y1="50" x2="378" y2="50" stroke="#ca8a04" stroke-width="2"/>
  <line x1="322" y1="32" x2="312" y2="22" stroke="#ca8a04" stroke-width="2"/>
  <line x1="358" y1="68" x2="368" y2="78" stroke="#ca8a04" stroke-width="2"/>
  <line x1="322" y1="68" x2="312" y2="78" stroke="#ca8a04" stroke-width="2"/>
  <line x1="358" y1="32" x2="368" y2="22" stroke="#ca8a04" stroke-width="2"/>

  <!-- Glowing Light Beams -->
  <path d="M 340 70 L 150 150" class="light-ray"/>
  <path d="M 320 60 L 140 140" class="light-ray"/>

  <!-- Voltmeter Instrument representation -->
  <path d="M 450 140 A 70 70 0 0 1 590 140" fill="none" stroke="#e2e8f0" stroke-width="15" stroke-linecap="round"/>
  <!-- Voltages scale lines -->
  <line x1="450" y1="140" x2="440" y2="140" stroke="#475569" stroke-width="2"/>
  <text x="430" y="144" font-size="10" fill="#475569" text-anchor="end">0V</text>

  <line x1="520" y1="70" x2="520" y2="60" stroke="#475569" stroke-width="2"/>
  <text x="520" y="52" font-size="10" fill="#475569" text-anchor="middle">2.5V</text>

  <line x1="590" y1="140" x2="600" y2="140" stroke="#475569" stroke-width="2"/>
  <text x="610" y="144" font-size="10" fill="#475569" text-anchor="start">5.0V</text>

  <!-- Dial pointer needle -->
  <line x1="520" y1="140" x2="520" y2="80" class="voltmeter-pointer"/>
  <circle cx="520" cy="140" r="6" fill="#475569"/>
  <text x="520" y="165" font-size="12" font-weight="bold" fill="#7c3aed" text-anchor="middle">V_out Meter</text>

  <!-- Animated Text Blocks -->
  <!-- Case 1: Dark -->
  <g class="txt-dark" transform="translate(340, 190)">
    <text x="0" y="0" class="status-text" fill="#1e293b">สภาวะ มืด (Dark)</text>
    <text x="0" y="18" class="formula-text" fill="#475569">R_sensor ≈ 10 kΩ (สูงมาก)</text>
    <text x="0" y="34" class="formula-text" fill="#2563eb">V_out = 5V * (10k / (10k + 10k)) = 2.5 V</text>
  </g>

  <!-- Case 2: Bright -->
  <g class="txt-light" transform="translate(340, 190)">
    <text x="0" y="0" class="status-text" fill="#ca8a04">สภาวะ สว่าง (Bright)</text>
    <text x="0" y="18" class="formula-text" fill="#475569">R_sensor ≈ 1 kΩ (ต่ำลง)</text>
    <text x="0" y="34" class="formula-text" fill="#2563eb">V_out = 5V * (1k / (10k + 1k)) ≈ 0.45 V</text>
  </g>
</svg>
</div>

ตามกฎของโอห์ม (Ohm's Law) แรงดันเอาต์พุต ($V_{out}$) ที่ตกคร่อมเซนเซอร์หาได้จากสมการ:
$$V_{out} = V_{in} \cdot \left( \frac{R_{sensor}}{R_{fixed} + R_{sensor}} \right)$$

เมื่อ Arduino Uno ทำการแปลงค่าแอนะล็อกเป็นดิจิทัล (ADC 10 บิต) จะได้ค่าดิจิทัลอ้างอิงกับ $V_{ref} = 5.0\text{ V}$ ดังนี้:
$$ADC = \text{round}\left( \frac{V_{out}}{V_{in}} \cdot 1023 \right)$$

ทำให้เราสามารถหาความสัมพันธ์ระหว่างค่าดิจิทัลที่อ่านได้จาก ADC กับความต้านทานของเซนเซอร์ได้โดยตรง:
$$\frac{ADC}{1023} = \frac{R_{sensor}}{R_{fixed} + R_{sensor}}$$

แก้สมการหา $R_{sensor}$:
$$R_{sensor} = R_{fixed} \cdot \left( \frac{ADC}{1023 - ADC} \right)$$

> ⚠️ **ข้อพิจารณาในการออกแบบ (Design Considerations):**
> 1. **การเลือก $R_{fixed}$:** ควรเลือกค่า $R_{fixed}$ ให้ใกล้เคียงกับค่าเฉลี่ยหรือย่านตรงกลางที่ใช้งานของ $R_{sensor}$ เพื่อให้ได้ความไว (Sensitivity) สูงสุดและการตอบสนองต่อแรงดันเอาต์พุตที่เป็นเชิงเส้นดีที่สุด
> 2. **กระแสไหลผ่านเซนเซอร์ (Self-Heating):** การมีกระแสไฟฟ้าไหลผ่าน $R_{sensor}$ จะทำให้เกิดความร้อนสะสมขึ้นเอง ($P = I^2 R$) ซึ่งอาจทำให้การวัดอุณหภูมิคลาดเคลื่อน จึงไม่ควรใช้ตัวต้านทานคงที่ขนาดเล็กเกินไป

#### 3. สมการความสัมพันธ์ระหว่างความต้านทานกับอุณหภูมิ

เมื่อเราหา $R_{sensor}$ (ในกรณีนี้คือเทอร์มิสเตอร์หรือ RTD) ได้แล้ว เราต้องใช้สมการทางคณิตศาสตร์แปลงค่าความต้านทานกลับมาเป็นอุณหภูมิในหน่วยองศาเซลเซียส

#### 3.1 NTC Thermistor: สมการพารามิเตอร์เบต้า (Beta Parameter Equation)
สมการยอดนิยมที่ใช้ประมาณความสัมพันธ์สำหรับเทอร์มิสเตอร์คือ:
$$\frac{1}{T} = \frac{1}{T_0} + \frac{1}{\beta} \ln\left(\frac{R}{R_0}\right)$$

โดยที่:
- $T$ คือ อุณหภูมิสมบูรณ์ในหน่วยเคลวิน ($\text{K} = ^\circ\text{C} + 273.15$)
- $T_0$ คือ อุณหภูมิอ้างอิงมาตรฐาน มักกำหนดไว้ที่ $25\ ^\circ\text{C}$ ($298.15\text{ K}$)
- $R_0$ คือ ค่าความต้านทานของเทอร์มิสเตอร์ที่อุณหภูมิอ้างอิง $T_0$ (เช่น $10,000\ \Omega$)
- $R$ คือ ค่าความต้านทานปัจจุบันของเทอร์มิสเตอร์ที่วัดได้
- $\beta$ คือ ค่าสัมประสิทธิ์เบต้า (Beta Coefficient) เป็นค่าเฉพาะตัวที่ระบุใน Datasheet (เช่น $3950$)

เมื่อแปลงสมการเพื่อคำนวณหาอุณหภูมิในหน่วยองศาเซลเซียส ($T_c$) จะได้:
$$T_c = \left( \frac{1}{\frac{1}{T_0} + \frac{1}{\beta} \ln\left(\frac{R}{R_0}\right)} \right) - 273.15$$

#### 3.2 NTC Thermistor: สมการสไตน์ฮาร์ต-ฮาร์ต (Steinhart-Hart Equation)
สำหรับงานวิจัยหรือระบบที่ต้องการความแม่นยำสูงพิเศษในช่วงอุณหภูมิกว้าง จะนิยมใช้สมการสไตน์ฮาร์ต-ฮาร์ตซึ่งมีความละเอียดสูงกว่า:
$$\frac{1}{T} = A + B \ln(R) + C (\ln(R))^3$$
*หมายเหตุ: ค่าคงที่ $A, B, C$ สามารถหาได้จากการทดลองวัดหาค่าความต้านทานของเซนเซอร์ตัวนั้น ๆ ณ อุณหภูมิที่แตกต่างกัน 3 จุดแล้วแก้ระบบสมการเชิงเส้น*

#### 3.3 RTD PT100: สมการคอลเลนเดอร์-แวน ดูเซน (Callendar-Van Dusen Equation)
สำหรับเซนเซอร์ PT100 ซึ่งมีความต้านทาน $100\ \Omega$ ที่ $0\ ^\circ\text{C}$ ช่วงอุณหภูมิตั้งแต่ $0\ ^\circ\text{C}$ ขึ้นไปจะมีความสัมพันธ์เป็นเส้นตรงอย่างดีเยี่ยมตามสมการเชิงเส้น:
$$R(T) = R_0 (1 + \alpha T)$$

โดยที่:
- $R(T)$ คือ ค่าความต้านทานที่อุณหภูมิ $T$
- $R_0 = 100\ \Omega$
- $\alpha = 0.00385\ ^\circ\text{C}^{-1}$ (ค่าสัมประสิทธิ์อุณหภูมิของความต้านทานแพลทินัมตามมาตรฐาน DIN IEC 751)

เมื่อแปลงสมการเพื่อคำนวณหาอุณหภูมิ ($T$) จากความต้านทานไฟฟ้าที่วัดได้ ($R_{RTD}$):
$$T = \frac{R_{RTD} - R_0}{R_0 \cdot \alpha} = \frac{R_{RTD} - 100}{100 \cdot 0.00385} = \frac{R_{RTD} - 100}{0.385}$$

---

## 3.3 การจำแนกประเภทเซนเซอร์

เซนเซอร์สามารถจำแนกได้ 2 แนวทางหลัก

### 3.3.1 จำแนกตามปริมาณที่วัด (Measured Quantity)

| ปริมาณที่วัด / ลักษณะข้อมูล | ตัวอย่างเซนเซอร์ | การประยุกต์ใช้ |
|---|---|---|
| การหมุน / มุม (Rotation / Angle) | Potentiometer | วัดการหมุนของข้อต่อ, ปรับค่าวอลลุ่ม |
| อุณหภูมิ (Temperature) | TMP36, LM35, DS18B20 | ตรวจวัดอุณหภูมิห้อง เครื่องจักร |
| แสง (Light) | LDR, Photodiode, Ambient Light Sensor | ระบบเปิด-ปิดไฟอัตโนมัติ, วัดความสว่าง |
| การโค้งงอ / แรงกด (Deflection / Force) | Flex Sensor, Force Sensor (FSR) | วัดการโก่งตัวของคาน, วัดน้ำหนักกดสัมผัส |
| แก๊ส (Gas) | MQ-2, MQ-135, Gas Sensor | ตรวจจับแก๊สรั่ว คุณภาพอากาศ |
| การเปิด/ปิดสลับ (Switching) | Pushbutton, Slideswitch, DIP Switch | ป้อนข้อมูลสถานะ 0/1 ควบคุมทั่วไป |
| การเคลื่อนไหว (Motion) | PIR (HC-SR501) | ระบบรักษาความปลอดภัย, ตรวจจับคนเดินผ่าน |
| ระยะทาง (Distance) | HC-SR04, Ping Sensor | หุ่นยนต์หลบสิ่งกีดขวาง, ตรวจจับตำแหน่งวัตถุ |
| การเอียง (Tilt) | Tilt Sensor | ตรวจจับการล้ม/เอียงของโครงสร้างหรือเครื่องยนต์ |
| สัญญาณอินฟราเรด (Infrared) | IR Receiver & Remote | รับส่งรหัสคำสั่งควบคุมแบบไร้สายระยะใกล้ |
| ความชื้น (Humidity) | DHT11, DHT22 | ระบบควบคุมเรือนกระจก, ตรวจสอบคลังสินค้า |
| ความดัน (Pressure) | BMP280 | สถานีตรวจอากาศ, วัดระดับความสูงเทียบความดัน |
| ความเร่ง (Acceleration) | MPU6050, ADXL345 | ตรวจจับการสั่นสะเทือนเครื่องจักร, อัตราเร่งเชิงมุม |


### 3.3.2 จำแนกตามชนิดสัญญาณ (Signal Type)

- **เซนเซอร์แอนะล็อก (Analog Sensor):** ให้สัญญาณแรงดันต่อเนื่อง เช่น TMP36 หรือ LM35 ที่มีแรงดันไฟฟ้าเอาต์พุตแปรผันเชิงเส้นตามอุณหภูมิ ซึ่งต้องเชื่อมต่อเข้ากับขา ADC (เช่น ขาแอนะล็อก A0–A5 ของ Arduino Uno) เพื่อแปลงค่าเป็นสัญญาณดิจิทัล
- **เซนเซอร์ดิจิทัล (Digital Sensor):** ให้สัญญาณเป็น 2 สถานะ (HIGH/LOW) เช่น ปุ่มกด, PIR หรือส่งข้อมูลเป็นชุดบิตคอมพิวเตอร์ผ่านโปรโตคอลดิจิทัล เช่น DHT11/DHT22 ส่งผ่าน One-Wire หรือ BMP280 ส่งผ่านบัส I2C

---

## 3.4 คุณลักษณะของเซนเซอร์ (Sensor Characteristics)

เมื่อเลือกเซนเซอร์มาใช้งาน ต้องพิจารณาคุณลักษณะต่อไปนี้:

| คุณลักษณะ | คำนิยาม | ตัวอย่าง |
|---|---|---|
| ช่วงวัด (Range) | ขอบเขตต่ำสุด-สูงสุดที่เซนเซอร์วัดได้ | DHT22 วัดอุณหภูมิ −40 ถึง +80 °C |
| ความไว (Sensitivity) | อัตราส่วนการเปลี่ยนแปลงสัญญาณเอาต์พุตต่อการเปลี่ยนแปลงอินพุต | LM35 ให้ 10 mV/°C |
| ความละเอียด (Resolution) | ค่าเปลี่ยนแปลงที่เล็กที่สุดที่เซนเซอร์สามารถแยกแยะได้ | DHT22 มีความละเอียด 0.1 °C |
| ความแม่นยำ (Accuracy) | ค่าที่วัดได้ใกล้เคียงกับค่าจริงมากเพียงใด | BMP280 ความแม่นยำ ±1 hPa |
| ความเที่ยง (Precision) | ค่าที่วัดซ้ำ ๆ แล้วได้ผลใกล้เคียงกันมากเพียงใด | วัด 10 ครั้งได้ผลต่างไม่เกิน 0.2 °C |
| ความคลาดเคลื่อน (Error) | ผลต่างระหว่างค่าที่วัดได้กับค่าจริง | วัดได้ 26.5 °C ค่าจริง 25.0 °C → Error = 1.5 °C |
| เวลาตอบสนอง (Response Time) | ระยะเวลาที่เซนเซอร์ใช้ในการแสดงผลหลังปริมาณเปลี่ยนแปลง | DHT22 อ่านค่าได้ทุก 2 วินาที |

> 💡 **ความแม่นยำ vs ความเที่ยง:** ลองนึกภาพยิงธนู — ถ้าลูกธนูกระจุกอยู่ใกล้กลางเป้า = ทั้งแม่น (accurate) และเที่ยง (precise) ถ้ากระจุกกันแต่ไม่อยู่กลางเป้า = เที่ยงแต่ไม่แม่น ถ้ากระจายทั่วแต่ค่าเฉลี่ยอยู่กลาง = แม่นแต่ไม่เที่ยง

---

## 3.5 ตัวอย่างเซนเซอร์ยอดนิยมใน IoT


#### A. กลุ่มเซนเซอร์และอุปกรณ์สัญญาณแอนะล็อก (Analog Inputs / Sensors)

### 3.5.1 Potentiometer (ตัวต้านทานปรับค่าได้)


*   **หลักการทำงาน:** เป็นอุปกรณ์ที่มีความต้านทานรวมคงที่ (เช่น $10\text{ k}\Omega$) แต่มีขากลาง (Wiper) ที่สามารถหมุนเลื่อนขยับตำแหน่งเพื่อแบ่งค่าความต้านทานออกเป็น 2 ส่วน ทำให้ทำหน้าที่เป็น **วงจรแบ่งแรงดันไฟฟ้า (Voltage Divider) ในตัว** โดยส่งค่าเอาต์พุตแอนะล็อกแปรผันตามตำแหน่งการหมุน
*   **อินเทอร์เฟซ:** แอนะล็อก (ขาริมต่อ 5V และ GND, ขากลางต่อเข้ากับขา ADC ของ Arduino Uno เช่น A0)

**ตัวอย่างโค้ดการอ่านค่า Potentiometer เพื่อเปลี่ยนค่าดิบเป็นเปอร์เซ็นต์:**
```cpp
const int potPin = A0; // ต่อขากลางของโพเทนชิออมิเตอร์เข้ากับขา A0

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(potPin); // อ่านค่า ADC (0-1023)
  float percentage = (raw / 1023.0) * 100.0; // แปลงช่วงข้อมูลเป็นเปอร์เซ็นต์ (0-100%)

  Serial.print("Pot ADC: ");
  Serial.print(raw);
  Serial.print(" | Percent: ");
  Serial.print(percentage, 1);
  Serial.println(" %");
  delay(200);
}
```

### 3.5.2 TMP36 / LM35 — วัดอุณหภูมิ (แอนะล็อก)


*   **TMP36 (มีจำลองใน Tinkercad):** ให้เอาต์พุตเป็นแรงดันไฟฟ้าแบบเชิงเส้น $10\text{ mV/}^\circ\text{C}$ แต่มี **แรงดันชดเชย (Offset) 500 mV** ที่อุณหภูมิ $0\ ^\circ\text{C}$ เพื่อให้วัดอุณหภูมิติดลบได้โดยไม่ต้องจ่ายไฟเลี้ยงลบ สูตรแปลงคือ:
    $$T\text{ (}^\circ\text{C)} = \frac{V_{out} - 0.5}{0.01}$$
*   **LM35 (นิยมในบอร์ดจริง / Wokwi):** ให้เอาต์พุตแรงดันสัมพันธ์โดยตรง $10\text{ mV/}^\circ\text{C}$ โดยเริ่มจาก $0\text{ V}$ ที่ $0\ ^\circ\text{C}$ สูตรแปลงคือ:
    $$T\text{ (}^\circ\text{C)} = \frac{V_{out}}{0.01}$$
*   **อินเทอร์เฟซ:** แอนะล็อก (ต่อเข้ากับขา ADC ของไมโครคอนโทรลเลอร์)

**ตัวอย่างโค้ดอ่านค่าอุณหภูมิ (รองรับเซนเซอร์ TMP36 ใน Tinkercad):**
```cpp
const int tempPin = A0; // ต่อขาแอนะล็อก A0 ของ Arduino Uno

void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead(tempPin);
  float voltage = raw * (5.0 / 1023.0); // แปลงค่า ADC (0-1023) เป็นแรงดัน (0-5V)
  
  // คำนวณแบบเซนเซอร์ TMP36 (สูตรมี offset 0.5V)
  float tempC = (voltage - 0.5) / 0.01; 

  Serial.print("Raw ADC: ");
  Serial.print(raw);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 3);
  Serial.print(" V | Temp (TMP36): ");
  Serial.print(tempC, 1);
  Serial.println(" °C");
  
  delay(1000);
}
```

### 3.5.3 Light Sensors — Photoresistor (LDR), Photodiode และ Ambient Light Sensor [Phototransistor]


ใน Tinkercad มีเซนเซอร์วัดความสว่างของแสงให้ใช้งานหลัก ๆ 3 ประเภท ซึ่งใช้หลักการทางฟิสิกส์และมีคุณสมบัติการตอบสนองที่แตกต่างกัน:

1.  **Photoresistor (LDR - Light Dependent Resistor):** เป็นตัวต้านทานแปรค่าตามความเข้มแสง (ความต้านทานต่ำลงเมื่อแสงสว่างขึ้น) ตอบสนองช้า (ประมาณหน่วยมิลลิวินาที) แต่ใช้วงจรง่ายที่สุดคือวงจรแบ่งแรงดันร่วมกับตัวต้านทาน $10\text{ k}\Omega$
2.  **Photodiode (ไดโอดตรวจจับแสง):** ยอมให้กระแสไหลย้อนกลับ (Reverse Current) มากขึ้นเมื่อมีแสงตกกระทบ ตอบสนองเร็วมาก (หน่วยไมโครวินาทีหรือเร็วกว่า) มักใช้ในการตรวจจับสัญญาณพัลส์แสงความถี่สูง
3.  **Ambient Light Sensor (ตัวตรวจจับแสงรอบข้าง - Phototransistor):** ใช้ทรานซิสเตอร์ไวแสงที่ทำการขยายกระแสไฟฟ้าในตัวเองตามความสว่าง ให้ผลลัพธ์ที่เป็นเชิงเส้นสูงและตอบสนองได้ใกล้เคียงกับการมองเห็นของตาคนมากที่สุด

**ตัวอย่างโค้ดการอ่านค่าเซนเซอร์แสง (ต่อขาสัญญาณแอนะล็อก A1 ของ Arduino Uno):**
```cpp
const int lightPin = A1;     // ขา A1 จากวงจรแบ่งแรงดันของเซนเซอร์แสง
const int threshold = 500;   // เกณฑ์แบ่งความมืด/ความสว่าง (ช่วง 0-1023)

void setup() {
  Serial.begin(9600);
  pinMode(lightPin, INPUT);
}

void loop() {
  int rawValue = analogRead(lightPin);
  float voltage = rawValue * (5.0 / 1023.0); // แปลงเป็นแรงดันอ้างอิง 5V

  Serial.print("Light ADC: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 2);

  if (rawValue < threshold) {
    Serial.println(" -> Dark (มืด)");
  } else {
    Serial.println(" -> Bright (สว่าง)");
  }

  delay(1000);
}
```

### 3.5.4 Flex Sensor & Force Sensor — ตัวตรวจจับการโค้งงอและแรงกด


เซนเซอร์กลุ่มนี้ทำงานด้วยความต้านทานเปลี่ยนไปตามแรงเชิงกลกระทำ (Mechanical Action) ซึ่งนิยมนำไปประยุกต์ใช้ในการวัดและควบคุมทางกลศาสตร์อย่างหลากหลาย:

1.  **Flex Sensor (เซนเซอร์วัดการโค้งงอ):** ความต้านทานภายในจะเปลี่ยนแปลงเป็นเชิงเส้นกับระดับความงอของแผ่นเซนเซอร์ (ยิ่งงอมาก ความต้านทานแปรผันสูงขึ้นจากค่าเริ่มต้น เช่น $10\text{ k}\Omega$ ขึ้นไปถึง $100\text{ k}\Omega$) ต้องเชื่อมต่อร่วมกับวงจรแบ่งแรงดันโดยใช้ตัวต้านทานดึงลง $10\text{ k}\Omega$
2.  **Force Sensor (FSR - Force Sensitive Resistor):** ความต้านทานภายในจะลดลงอย่างเป็นคาบไม่เชิงเส้นเมื่อได้รับแรงกดกระทำที่ผิวสัมผัส (สภาวะปกติไม่มีแรงกดความต้านทานจะสูงมากเป็นเมกะโอห์ม และเมื่อถูกกดจะลดลงต่ำสุดถึงต่ำกว่า $100\ \Omega$) ต่อร่วมกับวงจรแบ่งแรงดันเพื่อแปลงค่าเป็นระดับแรงดันไฟฟ้า

**ตัวอย่างโค้ดอ่านค่าเซนเซอร์วัดการโค้งงอหรือแรงกด (ต่อขาสัญญาณแอนะล็อก A2):**
```cpp
const int sensorPin = A2; // ขา Vout จากวงจรแบ่งแรงดันของ Flex/Force Sensor

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(sensorPin);
  float voltage = raw * (5.0 / 1023.0);

  Serial.print("Sensor ADC: ");
  Serial.print(raw);
  Serial.print(" | Vout: ");
  Serial.print(voltage, 2);
  Serial.println(" V");
  
  delay(300);
}
```

### 3.5.5 MQ-2 — ตรวจจับแก๊สและควัน *(จำลองใน Tinkercad ด้วยอุปกรณ์ Gas Sensor)*


- หลักการทำงาน: ตัวเซนเซอร์ทำจากสารกึ่งตัวนำ SnO2 (Tin dioxide) เมื่อมีแก๊สไวไฟเข้ามาทำปฏิกิริยาเคมีกับออกซิเจนที่ผิวตัวนำ จะส่งผลให้ความต้านทานลดลงอย่างรวดเร็ว
- ตรวจจับได้หลากหลาย: แก๊สหุงต้ม (LPG), ควันไฟ, แอลกอฮอล์, โพรเพน, มีเทน, ไฮโดรเจน
- เอาต์พุตมีทั้งช่องสัญญาณแอนะล็อก (A0) เพื่ออ่านระดับความเข้มข้น และดิจิทัล (D0) ที่สามารถปรับความไวในการทริกเกอร์เอาต์พุตได้โดยตรงบนโมดูลผ่านตัวต้านทานปรับค่าได้ (Potentiometer)

#### B. กลุ่มเซนเซอร์และอุปกรณ์สัญญาณดิจิทัล (Digital Inputs / Sensors)

### 3.5.6 Switches (Pushbutton, Slideswitch, DIP Switches) — อุปกรณ์ปุ่มกดและสวิตช์ควบคุม


*   **หลักการทำงาน:** สวิตช์ทำหน้าที่ปิดหรือเปิดวงจรไฟฟ้าเพื่อส่งข้อมูลสถานะลอจิกเป็นสัญญาณอินพุตดิจิทัลตรง:
    *   **Pushbutton (สวิตช์ปุ่มกด):** หน้าสัมผัสเชื่อมต่อชั่วขณะระหว่างปุ่มถูกกดค้าง (กดติด-ปล่อยดับ)
    *   **Slideswitch (สวิตช์เลื่อน):** เลื่อนก้านนำไฟฟ้าสลับตำแหน่งต่อวงจรค้างไว้ (มักต่อ GND หรือ 5V)
    *   **DIP Switches (DPST / SPST x 4 / SPST x 6):** ชุดสวิตช์ขนาดเล็กเรียงแถวคู่ มักใช้กำหนดที่อยู่ฮาร์ดแวร์ กำหนดค่าโหมดเริ่มต้นในแผงวงจรควบคุมอุตสาหกรรม
*   **อินเทอร์เฟซ:** ดิจิทัลตรงต่อร่วมกับตัวต้านทาน Pull-up/Pull-down หรือใช้โหมด `INPUT_PULLUP`

**ตัวอย่างโค้ดอ่านค่าสวิตช์เลื่อนและปุ่มกดเพื่อประมวลผล:**
```cpp
const int slideSwitchPin = 12; // ขาสัญญาณสวิตช์เลื่อนต่อ Pin 12
const int buttonPin = 2;       // ขาสัญญาณปุ่มกดต่อ Pin 2

void setup() {
  Serial.begin(9600);
  pinMode(slideSwitchPin, INPUT);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  int switchVal = digitalRead(slideSwitchPin);
  int buttonVal = digitalRead(buttonPin);

  Serial.print("Switch: ");
  Serial.print(switchVal == HIGH ? "ON (5V)" : "OFF (0V)");
  Serial.print(" | Button: ");
  Serial.println(buttonVal == LOW ? "PRESSED" : "RELEASED");
  
  delay(300);
}
```

### 3.5.7 PIR (HC-SR501) — ตรวจจับการเคลื่อนไหว


- ตรวจจับรังสีอินฟราเรดจากร่างกายสิ่งมีชีวิตที่มีความร้อนเคลื่อนที่ผ่านเซนเซอร์
- เอาต์พุต: สัญญาณดิจิทัลเอาต์พุต (HIGH เมื่อตรวจพบการเคลื่อนไหว, LOW เมื่อนิ่ง)
- การใช้งานที่ดีควรใช้ Interrupts เพื่อตอบสนองทันทีโดยไม่ต้องหน่วงเวลาเช็คสถานะในลูปหลัก

**ตัวอย่างโค้ดตรวจจับการเคลื่อนไหวโดยใช้ Hardware Interrupts (บอร์ด Arduino Uno):**
```cpp
const int pirPin = 2; // ขา OUT ของ PIR ต่อ Pin 2 (หนึ่งในขา Interrupt ของ Arduino Uno)
volatile bool motionDetected = false;

// ฟังก์ชัน Interrupt Service Routine (ISR) เมื่อเกิดการขัดจังหวะด้วยฮาร์ดแวร์
void detectMotion() {
  motionDetected = true;
}

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  // ตั้งขัดจังหวะที่ขาบอร์ดเมื่อเกิดการเปลี่ยนผ่านจาก LOW เป็น HIGH (RISING)
  attachInterrupt(digitalPinToInterrupt(pirPin), detectMotion, RISING);
  Serial.println("PIR Sensor Active. Monitoring motion...");
}

void loop() {
  if (motionDetected) {
    Serial.println("🚨 MOTION DETECTED! Warning System Triggered.");
    motionDetected = false; // ล้างค่าสถานะกลับมาเริ่มต้นใหม่
    delay(3000); // พักรอสัญญาณรบกวนก่อนตรวจจับครั้งถัดไป
  }
}
```

### 3.5.8 Ultrasonic Distance Sensor (3-pin & 4-pin) — วัดระยะทางด้วยอัลตราโซนิก


ใน Tinkercad มีเซนเซอร์อัลตราโซนิกให้เลือกใช้งาน 2 รูปแบบ โดยส่งคลื่นความถี่สูง $40\text{ kHz}$ ไปสะท้อนวัตถุและวัดระยะทางจากเวลาเดินทางกลับ:

1.  **รุ่น 4 พิน (เช่น HC-SR04):** มีขา VCC, GND, Trigger (ขาส่งคลื่น), และ Echo (ขารับคลื่นสะท้อนกลับ) แยกกันชัดเจน
2.  **รุ่น 3 พิน (เช่น Parallax Ping):** มีขา 5V, GND, และขา SIG (Signal) ซึ่งทำหน้าที่ส่งคลื่นทริกเกอร์และรับคลื่นสะท้อนในขาเดียวกัน ทำให้ประหยัดขาไมโครคอนโทรลเลอร์

**ตัวอย่างโค้ดอ่านค่ารุ่น 4 พิน (Trigger ต่อ Pin 3, Echo ต่อ Pin 4):**
```cpp
const int trigPin = 3;
const int echoPin = 4;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000); // หน่วยไมโครวินาที
  if (duration == 0) {
    Serial.println("Error: Out of range");
  } else {
    float distanceCm = duration / 58.3; // แปลงเวลาเป็นเซนติเมตร
    Serial.print("4-Pin Distance: ");
    Serial.print(distanceCm, 1);
    Serial.println(" cm");
  }
  delay(500);
}
```

**ตัวอย่างโค้ดอ่านค่ารุ่น 3 พิน (ขา SIG ต่อ Pin 7):**
```cpp
const int sigPin = 7;

void setup() {
  Serial.begin(9600);
}

void loop() {
  // 1. ส่งสัญญาณพัลส์ Trigger ออกไป (ตั้ง pinMode เป็น OUTPUT)
  pinMode(sigPin, OUTPUT);
  digitalWrite(sigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(sigPin, HIGH);
  delayMicroseconds(5);
  digitalWrite(sigPin, LOW);

  // 2. สลับ pinMode เป็น INPUT เพื่อดักรอจับความยาวพัลส์สะท้อนกลับ
  pinMode(sigPin, INPUT);
  long duration = pulseIn(sigPin, HIGH, 30000);
  
  if (duration == 0) {
    Serial.println("Error: Out of range");
  } else {
    float distanceCm = duration / 58.3;
    Serial.print("3-Pin Distance: ");
    Serial.print(distanceCm, 1);
    Serial.println(" cm");
  }
  delay(500);
}
```

### 3.5.9 Tilt Sensor (2-pin & 4-pin) — ตรวจจับการเอียง


*   **หลักการทำงาน:** เซนเซอร์เอียงทำหน้าที่เป็น **สวิตช์ตรวจจับมุมเอียง** ภายในโมดูลมักมีลูกโลหะนำไฟฟ้าขนาดเล็กบรรจุไว้ เมื่อเซนเซอร์เอียงทำมุมที่เหมาะสม ลูกเหล็กจะไหลมาเชื่อมต่อสัมผัสหน้าสัมผัสขั้วไฟฟ้าเข้าด้วยกัน ทำให้กระแสไหลผ่านได้ (สวิตช์ต่อ - HIGH/LOW ตามการจัดดึง) สำหรับรุ่น 4 พินสามารถให้ข้อมูลแกนแนวระนาบเอียงที่แยกละเอียดขึ้น
*   **อินเทอร์เฟซ:** ดิจิทัล (ต่อร่วมกับขา GPIO ของบอร์ด)

**ตัวอย่างโค้ดตรวจจับระดับเอียงโดยใช้ INPUT_PULLUP (ต่อกับ Pin 8):**
```cpp
const int tiltPin = 8; // ขาสัญญาณต่อ Pin 8 ของ Arduino Uno

void setup() {
  Serial.begin(9600);
  pinMode(tiltPin, INPUT_PULLUP); // ใช้ Pull-up ภายในบอร์ด
}

void loop() {
  int tiltState = digitalRead(tiltPin);

  if (tiltState == LOW) { // ลูกเหล็กกลิ้งมาแตะ GND ทำให้เกิดการลง LOW
    Serial.println("⚠️ Warning: Tilt Detected (วงจรเอียง!)");
  } else {
    Serial.println("System Stable (ปกติ)");
  }
  delay(300);
}
```

### 3.5.10 IR Sensor & IR Remote — การรับคำสั่งและตรวจจับอินฟราเรด


*   **หลักการทำงาน:** **IR Sensor (ตัวรับแสงอินฟราเรด)** จะถอดรหัสคลื่นแสงอินฟราเรดความถี่ $38\text{ kHz}$ ที่มองไม่เห็นด้วยตาเปล่า เมื่อกดปุ่มที่ **IR Remote (รีโมทคอนโทรลอินฟราเรด)** ตัวส่งจะยิงแสงกะพริบเป็นรหัสข้อมูลเฉพาะ และตัวรับจะแปลงสัญญาณกลับมาเป็นค่ารหัสตัวเลขฐานสิบหกขนาด 32 บิต
*   **อินเทอร์เฟซ:** ดิจิทัล (ขาสัญญาณต่อขา GPIO ทั่วไปของไมโครคอนโทรลเลอร์)

**ตัวอย่างโค้ดรับสัญญาณถอดรหัสรีโมทอินฟราเรดใน Tinkercad (ต่อสัญญาณเข้ากับ Pin 11):**
```cpp
#include <IRremote.h>

const int irReceiverPin = 11; // ต่อขา OUT ของตัวรับอินฟราเรดเข้ากับ Pin 11

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(irReceiverPin, ENABLE_LED_FEEDBACK); // เริ่มรับสัญญาณอินฟราเรด
  Serial.println("IR Receiver Ready.");
}

void loop() {
  if (IrReceiver.decode()) {
    // แสดงรหัสปุ่มกดที่ถอดได้ในรูปแบบเลขฐานสิบหก
    Serial.print("Button Pressed. Hex Code: 0x");
    Serial.println(IrReceiver.decodedIRData.decodedRawData, HEX);
    
    IrReceiver.resume(); // เตรียมพร้อมรับรหัสสัญญาณอินฟราเรดถัดไป
  }
}
```

### 3.5.11 DHT11 / DHT22 — วัดอุณหภูมิและความชื้น


*   **DHT11 (มีให้ใช้งานใน Tinkercad):** ช่วงวัดอุณหภูมิ 0 ถึง 50 °C (ความแม่นยำ ±2 °C) ช่วงวัดความชื้น 20–90 %RH (ความแม่นยำ ±5%) เหมาะสำหรับการเรียนรู้และจำลองเบื้องต้น
*   **DHT22 (นิยมใช้ในบอร์ดจริง / Wokwi):** ช่วงวัดอุณหภูมิ −40 ถึง +80 °C (ความแม่นยำ ±0.5 °C) ช่วงวัดความชื้น 0–100 %RH (ความแม่นยำ ±2%) มีความแม่นยำสูงกว่า
*   **อินเทอร์เฟซ:** One-Wire (ดิจิทัล) ใช้สายสัญญาณข้อมูลเพียงเส้นเดียว

**ตัวอย่างโค้ดอ่านค่าด้วยไลบรารี standard DHT (รองรับทั้ง Tinkercad และ Wokwi):**
```cpp
#include "DHT.h"

#define DHTPIN 2      // ต่อขาข้อมูลเข้ากับ Pin 2 ของ Arduino Uno
#define DHTTYPE DHT11 // หากทดสอบบนบอร์ดจริงหรือ Wokwi ที่เป็น DHT22 ให้เปลี่ยนเป็น DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("DHT Sensor Started");
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  // ตรวจสอบความถูกต้องในการอ่านค่า (ป้องกันค่าเป็น NaN)
  if (isnan(temp) || isnan(hum)) {
    Serial.println("Error: Failed to read from DHT sensor!");
  } else {
    Serial.print("Temp: ");
    Serial.print(temp, 1);
    Serial.print(" °C | Humidity: ");
    Serial.print(hum, 1);
    Serial.println(" %");
  }
  delay(2000); // DHT ต้องการเวลาอย่างน้อย 2 วินาทีในการสุ่มวัดครั้งถัดไป
}
```

#### C. กลุ่มเซนเซอร์และอุปกรณ์เชื่อมต่อผ่านบัสข้อมูลดิจิทัล (Digital Bus Sensors - I2C)

### 3.5.12 BMP280 — วัดความดันบรรยากาศและอุณหภูมิ *(รองรับบนบอร์ดจริง/Wokwi)*

- ช่วงวัดความดัน: 300–1100 hPa (ความแม่นยำสูงถึง ±1.0 hPa)
- อินเทอร์เฟซสื่อสาร: I2C (สาย SDA, SCL) หรือ SPI
- ประโยชน์เด่น: คำนวณความต่างระดับความสูงเทียบกับความดันอ้างอิงระดับน้ำทะเลมาตรฐาน ($1013.25\text{ hPa}$)

**ตัวอย่างโค้ดอ่านค่า BMP280 ผ่านบัส I2C พร้อมระบบจัดการข้อผิดพลาด (Error Handling):**
```cpp
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>

Adafruit_BMP280 bmp; // สร้างออบเจกต์สำหรับใช้งาน

void setup() {
  Serial.begin(9600);
  Serial.println("Initializing BMP280 sensor...");

  // เปิดใช้งานบัส I2C (Arduino Uno ใช้ A4=SDA, A5=SCL เป็นค่าเริ่มต้น)
  Wire.begin();

  // กำหนดแอดเดรสของชิปส่วนใหญ่จะเป็น 0x76 หรือ 0x77
  // โค้ดจะเช็คสถานะการเริ่มสื่อสาร หากไม่พบบอร์ดโปรแกรมจะตัดการทำงาน
  unsigned status = bmp.begin(0x76);
  if (!status) {
    Serial.println(F("Error: Could not find a valid BMP280 sensor, check wiring!"));
    Serial.print("SensorID was: 0x");
    Serial.println(bmp.sensorID(), HEX);
    while (1) {
      delay(10); // ลูปค้างเพื่อความปลอดภัย ไม่ส่งข้อมูลขยะต่อ
    }
  }

  // ปรับแต่งโหมดการทำงานและอัตราส่วนฟิลเตอร์ของเซนเซอร์ให้ละเอียด
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */
  Serial.println("BMP280 Initialized Successfully.");
}

void loop() {
  float temperature = bmp.readTemperature();
  float pressurePa = bmp.readPressure();
  float pressureHpa = pressurePa / 100.0F;
  // คำนวณความสูงอ้างอิงระดับแรงดันน้ำทะเลสากล 1013.25 hPa
  float altitude = bmp.readAltitude(1013.25);

  // ป้องกันค่าขยะ (Not a Number - NaN) ในกรณียังอ่านค่าไม่สมบูรณ์
  if (isnan(temperature) || isnan(pressurePa)) {
    Serial.println("Error: Failed to read data from BMP280!");
  } else {
    Serial.print(F("Temperature = "));
    Serial.print(temperature, 1);
    Serial.println(" *C");

    Serial.print(F("Pressure = "));
    Serial.print(pressureHpa, 2);
    Serial.println(" hPa");

    Serial.print(F("Approx Altitude = "));
    Serial.print(altitude, 1);
    Serial.println(" m");
    Serial.println("------------------------------------");
  }

  delay(2000);
}
```

### 3.5.13 การกรองสัญญาณรบกวนด้วยซอฟต์แวร์ (Software Signal Filtering)

สัญญาณที่ได้จากเซนเซอร์ชนิดแอนะล็อกมักจะมี **สัญญาณรบกวนทางไฟฟ้า (Electrical Noise)** หรือคลื่นความถี่สูงปนเข้ามา ส่งผลให้ค่าดิจิทัลที่อ่านได้จาก ADC มีความไม่นิ่งแกว่งไปแกว่งมา วิธีการแก้ปัญหาที่ประหยัดและยืดหยุ่นที่สุดคือการใช้ตัวกรองทางดิจิทัลด้วยโปรแกรม (Software Digital Filter)

ตัวกรองที่นิยมใช้มากที่สุดคือ **ตัวกรองแบบค่าเฉลี่ยเคลื่อนที่อย่างง่าย (Simple Moving Average - SMA Filter)** หลักการคือเก็บบันทึกข้อมูลการสุ่มวัดล่าสุดไว้ในอาร์เรย์ (Buffer Array) และคำนวณหาค่าเฉลี่ยของข้อมูลล่าสุดจำนวน $M$ ค่า เมื่อมีข้อมูลใหม่เข้ามา ข้อมูลที่เก่าที่สุดจะถูกลบออกไป (แบบ First-In, First-Out หรือ Queue)

#### แบบจำลองทางคณิตศาสตร์ของ SMA:
$$y[n] = \frac{1}{M} \sum_{i=0}^{M-1} x[n-i]$$

โดยที่:
- $x[n]$ คือ ค่าแอนะล็อกที่สุ่มวัดดิบได้ล่าสุด (Raw Value) ณ เวลาปัจจุบัน
- $x[n-i]$ คือ ค่าดิบที่เคยเก็บย้อนกลับไป $i$ ลำดับ
- $M$ คือ ขนาดของหน้าต่างเวลา (Window Size) ที่ต้องการเฉลี่ย (ยิ่ง $M$ มีค่ามาก สัญญาณจะยิ่งเรียบ แต่จะมีการหน่วงเวลา หรือ Time Delay ของสัญญาณมากขึ้น)
- $y[n]$ คือ ผลลัพธ์จากการกรองที่นำไปใช้งาน (Filtered Output)

**ตัวอย่างโค้ด C++ สำหรับกรองข้อมูลแอนะล็อกด้วยเทคนิค Moving Average (บอร์ด Arduino Uno):**
```cpp
const int sensorPin = A0;       // ขาแอนะล็อก A0
const int WINDOW_SIZE = 10;     // ขนาดของหน้าต่างข้อมูลเฉลี่ย (M)
int readings[WINDOW_SIZE];      // อาร์เรย์เก็บข้อมูลประวัติการวัด
int readIndex = 0;              // ตำแหน่งดัชนีของอาร์เรย์ปัจจุบัน
long total = 0;                 // ผลรวมทั้งหมดในอาร์เรย์
int average = 0;                // ผลลัพธ์ค่าเฉลี่ยที่กรองแล้ว

void setup() {
  Serial.begin(9600);
  pinMode(sensorPin, INPUT);

  // กำหนดค่าเริ่มต้นให้อาร์เรย์เป็น 0 ทั้งหมด
  for (int thisReading = 0; thisReading < WINDOW_SIZE; thisReading++) {
    readings[thisReading] = 0;
  }
}

void loop() {
  // 1. หักค่าข้อมูลตัวเก่าที่สุดที่จะถูกเขียนทับออกจากผลรวมย่อย
  total = total - readings[readIndex];

  // 2. อ่านค่าเซนเซอร์ตัวใหม่เข้ามาใส่แทนที่ตำแหน่งดัชนี
  readings[readIndex] = analogRead(sensorPin);

  // 3. บวกค่าข้อมูลตัวใหม่เข้าไปในผลรวมทั้งหมด
  total = total + readings[readIndex];

  // 4. เลื่อนดัชนีไปยังตำแหน่งถัดไป
  readIndex = readIndex + 1;

  // 5. หากเลื่อนจนสุดความกว้างหน้าต่าง ให้วนกลับมาเริ่มที่จุดเริ่มต้นใหม่ (Circular Buffer)
  if (readIndex >= WINDOW_SIZE) {
    readIndex = 0;
  }

  // 6. คำนวณหาค่าเฉลี่ยที่กรองแล้ว
  average = total / WINDOW_SIZE;

  // อ่านค่าดิบเปรียบเทียบกับค่าเฉลี่ยเพื่อดูผลการทดสอบการกรอง
  int rawValue = analogRead(sensorPin);
  Serial.print("Raw_ADC:");
  Serial.print(rawValue);
  Serial.print(",");
  Serial.print("Filtered_ADC:");
  Serial.println(average);

  delay(50); // สุ่มอ่านค่าทุก 50 มิลลิวินาที
}
```
*💡 **เทคนิค:** สามารถคัดลอกรหัสนี้ไปทดสอบในโปรแกรม Tinkercad หรือ Wokwi และเปิด **Serial Plotter** (ใน Tinkercad คือปุ่มกราฟในส่วน Serial Monitor) เพื่อสังเกตความแตกต่างของการตอบสนองของเส้นสีระหว่างเส้นสีดิบที่แกว่งและเส้นที่ได้รับการกรองผ่าน Moving Average*

### 3.5.14 ตารางสรุปอุปกรณ์รับเข้าและเซนเซอร์ใน Tinkercad และ Wokwi

| เซนเซอร์ / อุปกรณ์อินพุต | ปริมาณที่วัด / สถานะ | ชนิดสัญญาณ | อินเทอร์เฟซ | ช่วงวัด / ข้อมูล | Tinkercad / Wokwi |
|---|---|---|---|---|---|
| **Potentiometer** | ตรรกะแรงดันแปรผันตามการหมุน | แอนะล็อก | Analog (ขากลางแบ่งแรงดัน) | ค่าเอาต์พุตดิบ 0–1023 (0–100%) | ✅ / ✅ |
| **TMP36 / LM35** | อุณหภูมิ | แอนะล็อก | Analog | TMP36: −40 ถึง +125 °C, LM35: −55 ถึง +150 °C | ✅ / ✅ |
| **LDR / Photoresistor** | แสงสว่าง | แอนะล็อก | Analog (Voltage Divider) | ขึ้นกับความเข้มแสง (ความต้านทานเปลี่ยน) | ✅ / ✅ |
| **Photodiode** | สัญญาณแสงความถี่สูง | แอนะล็อก | Analog | ยอมให้กระแสไหลย้อนกลับตามระดับแสง | ✅ / ✅ |
| **Ambient Light Sensor** | แสงสว่างรอบข้าง | แอนะล็อก | Analog (Phototransistor) | ตอบสนองใกล้เคียงสายตามนุษย์ | ✅ / ✅ |
| **Flex Sensor** | การโค้งงอเชิงกล | แอนะล็อก | Analog (Voltage Divider) | ความต้านทานเพิ่มขึ้นเมื่อแผ่นโค้งงอ | ✅ / ❌ |
| **Force Sensor (FSR)** | แรงกด/น้ำหนักสัมผัส | แอนะล็อก | Analog (Voltage Divider) | ความต้านทานลดลงเมื่อมีแรงกดมากขึ้น | ✅ / ❌ |
| **MQ-2 / Gas Sensor** | แก๊สและควัน | แอนะล็อก + ดิจิทัล | Analog / GPIO | 200–10000 ppm | ✅ / ✅ |
| **Pushbutton / Switches** | การต่อหรือตัดวงจรไฟฟ้า | ดิจิทัล | GPIO (HIGH / LOW) | สัญญาณเข้าลอจิกตามสถานะเปิด/ปิดสวิตช์ | ✅ / ✅ |
| **PIR (HC-SR501)** | การเคลื่อนไหวของสิ่งมีชีวิต | ดิจิทัล | GPIO (HIGH / LOW) | ตรวจจับรังสีอินฟราเรดจากความร้อน | ✅ / ✅ |
| **HC-SR04 / Ping Sensor** | ระยะทาง | ดิจิทัล | Trigger/Echo หรือ SIG | 2–400 cm (ยิงคลื่นสะท้อน 40 kHz) | ✅ / ✅ |
| **Tilt Sensor** | มุมเอียง / ระนาบการเอียง | ดิจิทัล | GPIO (HIGH / LOW) | ลูกเหล็กสัมผัสขั้วเชื่อมต่อวงจรภายใน | ✅ / ✅ |
| **IR Receiver & Remote** | รหัสปุ่มกดอินฟราเรด | ดิจิทัล | GPIO (IR Library) | รับแสงกะพริบถอดรหัสความถี่ 38 kHz | ✅ / ✅ |
| **DHT11 / DHT22** | อุณหภูมิ + ความชื้น | ดิจิทัล | One-Wire | DHT11: 0 ถึง 50 °C, DHT22: −40 ถึง +80 °C | ✅ / ✅ |


---

## 3.6 สรุปประจำบทที่ 3 (Summary)

1. **เซนเซอร์** ทำหน้าที่แปลงปริมาณทางกายภาพเป็นสัญญาณไฟฟ้า ซึ่งเป็นพื้นฐานของระบบ IoT ทั้งหมด
2. เซนเซอร์จำแนกได้ตาม **ปริมาณที่วัด** (อุณหภูมิ แสง ระยะทาง ฯลฯ) และ **ชนิดสัญญาณ** (แอนะล็อก / ดิจิทัล)
3. การเลือกเซนเซอร์ต้องพิจารณา **คุณลักษณะ** ที่เหมาะสม ได้แก่ ช่วงวัด ความไว ความละเอียด ความแม่นยำ และเวลาตอบสนอง
4. บอร์ดไมโครคอนโทรลเลอร์ (เช่น Arduino Uno, ESP32) รองรับทั้ง **สัญญาณแอนะล็อก** (ผ่าน ADC) และ **สัญญาณดิจิทัล** (GPIO, I2C, SPI, One-Wire)
5. **Tinkercad และ Wokwi** รองรับเซนเซอร์ยอดนิยมหลายตัว ทำให้ฝึกปฏิบัติในโปรแกรมจำลองได้โดยไม่ต้องซื้ออุปกรณ์จริง
6. เซนเซอร์มีบทบาทสำคัญในงานวิศวกรรมเครื่องกล ตั้งแต่การตรวจสอบสภาพเครื่องจักรไปจนถึงระบบหุ่นยนต์

---

## 3.7 แบบฝึกหัดท้ายบทที่ 3 (Exercises)

**ข้อ 1:** จงอธิบายความแตกต่างระหว่าง "เซนเซอร์" กับ "ทรานสดิวเซอร์" พร้อมยกตัวอย่างประกอบ

**ข้อ 2:** เซนเซอร์ LM35 ให้เอาต์พุต 10 mV/°C ถ้าบอร์ด Arduino Uno (ADC 10 บิต, อ้างอิง 5 V) อ่านค่า raw = 51 จงคำนวณหาอุณหภูมิที่วัดได้ (แสดงวิธีคิด)

**ข้อ 3:** จงเติมตารางต่อไปนี้ให้สมบูรณ์:

| เซนเซอร์ | ปริมาณที่วัด | ชนิดสัญญาณ | อินเทอร์เฟซ |
|---|---|---|---|
| DHT22 | ? | ? | ? |
| HC-SR04 | ? | ? | ? |
| MQ-2 | ? | ? | ? |
| BMP280 | ? | ? | ? |


**ข้อ 4:** ถ้าต้องออกแบบระบบ IoT สำหรับตรวจสอบสภาพห้องเซิร์ฟเวอร์ (Server Room) จะเลือกใช้เซนเซอร์อะไรบ้าง อย่างน้อย 3 ตัว พร้อมอธิบายเหตุผลและระบุขาของบอร์ดไมโครคอนโทรลเลอร์ (เช่น Arduino Uno หรือ ESP32) ที่จะเชื่อมต่อ

**ข้อ 5:** จงอธิบายความแตกต่างระหว่าง "ความแม่นยำ (Accuracy)" และ "ความเที่ยง (Precision)" พร้อมอธิบายเปรียบเทียบในเชิงวิศวกรรมการวัด

