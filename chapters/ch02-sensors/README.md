# Chapter 2: ตัวรับรู้ (Sensors)
## Sensors for IoT

บทนี้จะพาทำความรู้จักกับ **เซนเซอร์ (Sensor)** ซึ่งเป็นอุปกรณ์สำคัญที่ทำหน้าที่เป็น "ตา หู จมูก" ของระบบ IoT ทำให้ไมโครคอนโทรลเลอร์อย่าง ESP32 สามารถรับรู้สิ่งที่เกิดขึ้นในโลกจริงได้ ไม่ว่าจะเป็นอุณหภูมิ แสงสว่าง ระยะทาง หรือแม้แต่แก๊สที่มองไม่เห็น

---

## 2.1 ความรู้พื้นฐานอิเล็กทรอนิกส์

ก่อนเข้าสู่การอ่านค่าเซนเซอร์ด้วย ESP32 ควรเข้าใจแนวคิดพื้นฐานของวงจรไฟฟ้าเล็กน้อย เพราะเซนเซอร์จำนวนมากไม่ได้ส่ง "ตัวเลข" ออกมาโดยตรง แต่ส่งผลลัพธ์เป็นแรงดัน กระแส หรือความต้านทานที่เปลี่ยนไป จากนั้นไมโครคอนโทรลเลอร์จึงอ่านค่าและแปลงเป็นข้อมูลดิจิทัลอีกที

### 2.1.1 แรงดัน กระแส และความต้านทาน (Voltage, Current, Resistance)

ในวงจรไฟฟ้าพื้นฐาน เรามักพบปริมาณสำคัญ 3 ตัว ได้แก่ แรงดันไฟฟ้า กระแสไฟฟ้า และความต้านทาน

*   **แรงดันไฟฟ้า ($V$ - Voltage):** คือ "แรงผลัก" ที่ทำให้ประจุไฟฟ้าเคลื่อนที่ หน่วยคือโวลต์ ($\text{V}$) เช่น ขา $3.3\text{ V}$ ของ ESP32 เป็นแหล่งจ่ายแรงดันที่ผลักให้กระแสไหลในวงจร
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

### 2.1.2 กฎของโอห์ม (Ohm's Law)

กฎของโอห์มเป็นสมการพื้นฐานที่เชื่อมความสัมพันธ์ระหว่างแรงดัน กระแส และความต้านทาน:

$$V = IR$$

จากสมการเดียวกันนี้สามารถจัดรูปเพื่อหาค่าที่ต้องการได้:

$$I = \frac{V}{R}$$

$$R = \frac{V}{I}$$

ตัวอย่างเช่น ถ้าต้องการต่อ LED กับขา ESP32 ที่จ่ายแรงดัน $3.3\text{ V}$ และต้องการจำกัดกระแสประมาณ $10\text{ mA}$ โดยสมมติว่า LED สีแดงมีแรงดันตกคร่อมประมาณ $2.0\text{ V}$ แรงดันที่เหลือตกคร่อมตัวต้านทานคือ:

$$V_R = 3.3 - 2.0 = 1.3\text{ V}$$

ดังนั้นค่าตัวต้านทานที่เหมาะสมโดยประมาณคือ:

$$R = \frac{V_R}{I} = \frac{1.3}{0.01} = 130\ \Omega$$

ในการใช้งานจริงมักเลือกค่ามาตรฐานที่ใกล้และสูงขึ้นเล็กน้อย เช่น $150\ \Omega$ หรือ $220\ \Omega$ เพื่อให้กระแสไม่สูงเกินไปและช่วยป้องกันขา GPIO

กำลังไฟฟ้า ($P$) คืออัตราการใช้พลังงานของอุปกรณ์ในวงจร คำนวณได้จาก:

$$P = VI = I^2R$$

ในวงจรเซนเซอร์บางชนิด เช่น Thermistor หรือ LDR หากเลือกตัวต้านทานต่ำเกินไป กระแสจะสูงขึ้นและทำให้เกิดความร้อนสะสมในตัวเซนเซอร์ ส่งผลให้ค่าที่อ่านได้คลาดเคลื่อน

> 💡 **หลักคิดง่าย ๆ:** กฎของโอห์มช่วยตอบคำถามว่า "ถ้ามีแรงดันเท่านี้และความต้านทานเท่านี้ กระแสจะไหลเท่าไร" ซึ่งเป็นพื้นฐานของการเลือกตัวต้านทานและการออกแบบวงจรอ่านค่าเซนเซอร์

### 2.1.3 วงจรอนุกรมและขนาน (Series & Parallel)

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

### 2.1.4 ตัวต้านทานและตัวต้านทานพูลอัป/พูลดาวน์ (Resistor & Pull-up/Pull-down)

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
  <text x="590" y="198" class="text-main" text-anchor="middle">ESP32 GPIO</text>
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

### 2.1.5 ตัวเก็บประจุ (Capacitor)

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

## 2.2 เซนเซอร์คืออะไร และหลักการแปลงปริมาณกายภาพเป็นสัญญาณไฟฟ้า

**เซนเซอร์ (Sensor)** คืออุปกรณ์ที่ตรวจจับปริมาณทางกายภาพ (Physical Quantity) แล้วแปลงให้เป็นสัญญาณไฟฟ้า (Electrical Signal) ที่ไมโครคอนโทรลเลอร์สามารถอ่านค่าได้

### 2.2.1 ทรานสดิวเซอร์ (Transducer)

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

  <!-- Box 4: ADC ใน ESP32 -->
  <rect x="525" y="25" width="135" height="90" rx="12" fill="#faf5ff" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="592.5" y="53" fill="#5b21b6" font-size="13" font-weight="700" text-anchor="middle">ADC ใน ESP32</text>
  <text x="592.5" y="71" fill="#6d28d9" font-size="11" text-anchor="middle">(Analog-to-Digital)</text>
  <text x="592.5" y="91" fill="#8b5cf6" font-size="10" text-anchor="middle">ทำการสุ่มวัด &amp; กำหนดระดับ</text>

  <!-- Arrow 4: Digital discrete pulse flow -->
  <line x1="660" y1="70" x2="695" y2="70" class="digital-flow"/>
  <polygon points="695,70 688,66 688,74" fill="#7c3aed"/>

  <!-- Box 5: ค่าดิจิทัล -->
  <rect x="695" y="25" width="135" height="90" rx="12" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
  <text x="762.5" y="53" fill="#065f46" font-size="13" font-weight="700" text-anchor="middle">ค่าดิจิทัล</text>
  <text x="762.5" y="71" fill="#047857" font-size="11" text-anchor="middle">(Digital Value)</text>
  <text x="762.5" y="91" fill="#10b981" font-size="10" text-anchor="middle">ตัวเลข 0 – 4095 (12-bit)</text>
</svg>
</div>

**ตัวอย่าง:** เทอร์มิสเตอร์ (Thermistor) เปลี่ยนอุณหภูมิเป็นค่าความต้านทานไฟฟ้าที่เปลี่ยนแปลง → ESP32 อ่านค่าแรงดันที่เปลี่ยนไปตามความต้านทาน → คำนวณกลับเป็นองศาเซลเซียส

> 💡 **หลักคิดง่าย ๆ:** เซนเซอร์ทุกตัวทำหน้าที่เหมือน "นักแปล" ที่แปลงภาษาของธรรมชาติ (ความร้อน แสง เสียง) ให้เป็นภาษาของไฟฟ้า (แรงดัน กระแส ความต้านทาน) ที่ไมโครคอนโทรลเลอร์เข้าใจ

### 2.2.2 หลักการทางฟิสิกส์และแบบจำลองทางคณิตศาสตร์ของเซนเซอร์แบบความต้านทาน (Resistive Sensors)

ในงานวิศวกรรม เซนเซอร์ที่พบบ่อยที่สุดประเภทหนึ่งคือ **เซนเซอร์แบบแปรผันตามความต้านทาน (Resistive Sensors)** เช่น LDR, Thermistor และ RTD อุปกรณ์เหล่านี้จะเปลี่ยนคุณสมบัติทางกายภาพเป็นความต้านทานไฟฟ้า เพื่อนำไปประมวลผลต่อ

#### 1. หลักการทางฟิสิกส์ของตัวรับรู้แต่ละชนิด

*   **LDR (Light Dependent Resistor):** โครงสร้างสร้างจากสารกึ่งตัวนำประเภทแคดเมียมซัลไฟด์ (CdS) เมื่อไม่มีแสงตกกระทบ อิเล็กตรอนส่วนใหญ่จะอยู่ในแถบวาเลนซ์ (Valence Band) ทำให้ความต้านทานสูงมาก (หลักหลายเมกะโอห์ม) แต่เมื่อมีแสง (โฟตอนที่มีพลังงานสูงกว่าพลังงานช่องว่างแถบหรือ Band Gap) มาตกกระทบ พลังงานจากแสงจะกระตุ้นอิเล็กตรอนให้กระโดดขึ้นไปยังแถบนำไฟฟ้า (Conduction Band) ทำให้เกิดคู่อิเล็กตรอนและโฮลอิสระมากขึ้น ความนำไฟฟ้าเพิ่มขึ้น และส่งผลให้ความต้านทานลดลงอย่างรวดเร็วเป็นฟังก์ชันไม่เชิงเส้นตามความเข้มแสง ($E$ ในหน่วย Lux):
    $$R_{LDR} = A \cdot E^{-\alpha}$$
    โดยที่ $A$ และ $\alpha$ เป็นค่าคงที่เฉพาะตัวชิ้นงานนั้น ๆ

*   **NTC Thermistor (Negative Temperature Coefficient):** ทำจากโลหะออกไซด์ที่เป็นสารกึ่งตัวนำ เมื่ออุณหภูมิสูงขึ้น พลังงานความร้อนจะกระตุ้นให้มีพาหะนำไฟฟ้าอิสระ (Free Carriers) หลุดรอดข้าม Band Gap มากขึ้น ทำให้ความต้านทานลดลงตามอุณหภูมิที่สูงขึ้น

*   **RTD PT100 (Resistance Temperature Detector):** ทำจากโลหะบริสุทธิ์อย่างแพลทินัม (Platinum) โลหะมีพฤติกรรมตรงกันข้ามกับสารกึ่งตัวนำ เมื่ออุณหภูมิสูงขึ้น อะตอมในโครงสร้างตาข่าย (Lattice) ของโลหะจะสั่นสะเทือนรุนแรงขึ้น ส่งผลให้เกิดการกระเจิง (Scattering) ของอิเล็กตรอนนำไฟฟ้า ทำให้เคลื่อนที่ได้ยากขึ้น ดังนั้น ความต้านทานไฟฟ้าของ PT100 จึงเพิ่มขึ้นเมื่ออุณหภูมิสูงขึ้นอย่างเป็นเชิงเส้นสูงมาก

#### 2. วงจรแบ่งแรงดันไฟฟ้า (Voltage Divider)

เนื่องจากไมโครคอนโทรลเลอร์อย่าง ESP32 ไม่สามารถวัดค่าความต้านทานไฟฟ้า ($R$) ได้โดยตรง (อ่านค่าได้เฉพาะแรงดันไฟฟ้า $V$) เราจึงต้องใช้วงจรแบ่งแรงดันเพื่อแปลงการเปลี่ยนแปลงของค่า $R$ เป็นแรงดันไฟฟ้า $V_{out}$

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
  <text x="120" y="20" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">V_in (3.3V)</text>

  <!-- R_fixed -->
  <rect x="105" y="55" width="30" height="50" class="resistor-box"/>
  <text x="95" y="83" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="end">R_fixed</text>
  <text x="95" y="98" font-size="10" fill="#64748b" text-anchor="end">10 kΩ</text>

  <!-- Middle connection to V_out -->
  <line x1="120" y1="105" x2="120" y2="135" class="wire"/>
  <line x1="120" y1="120" x2="220" y2="120" class="wire"/>
  <text x="225" y="115" font-size="12" font-weight="bold" fill="#7c3aed">V_out</text>
  <text x="225" y="130" font-size="10" fill="#6d28d9">(ไปยังขา ADC ESP32)</text>

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
  <text x="520" y="52" font-size="10" fill="#475569" text-anchor="middle">1.65V</text>

  <line x1="590" y1="140" x2="600" y2="140" stroke="#475569" stroke-width="2"/>
  <text x="610" y="144" font-size="10" fill="#475569" text-anchor="start">3.3V</text>

  <!-- Dial pointer needle -->
  <line x1="520" y1="140" x2="520" y2="80" class="voltmeter-pointer"/>
  <circle cx="520" cy="140" r="6" fill="#475569"/>
  <text x="520" y="165" font-size="12" font-weight="bold" fill="#7c3aed" text-anchor="middle">V_out Meter</text>

  <!-- Animated Text Blocks -->
  <!-- Case 1: Dark -->
  <g class="txt-dark" transform="translate(340, 190)">
    <text x="0" y="0" class="status-text" fill="#1e293b">สภาวะ มืด (Dark)</text>
    <text x="0" y="18" class="formula-text" fill="#475569">R_sensor ≈ 10 kΩ (สูงมาก)</text>
    <text x="0" y="34" class="formula-text" fill="#2563eb">V_out = 3.3V * (10k / (10k + 10k)) ≈ 1.65 V</text>
  </g>

  <!-- Case 2: Bright -->
  <g class="txt-light" transform="translate(340, 190)">
    <text x="0" y="0" class="status-text" fill="#ca8a04">สภาวะ สว่าง (Bright)</text>
    <text x="0" y="18" class="formula-text" fill="#475569">R_sensor ≈ 1 kΩ (ต่ำลง)</text>
    <text x="0" y="34" class="formula-text" fill="#2563eb">V_out = 3.3V * (1k / (10k + 1k)) ≈ 0.30 V</text>
  </g>
</svg>
</div>

ตามกฎของโอห์ม (Ohm's Law) แรงดันเอาต์พุต ($V_{out}$) ที่ตกคร่อมเซนเซอร์หาได้จากสมการ:
$$V_{out} = V_{in} \cdot \left( \frac{R_{sensor}}{R_{fixed} + R_{sensor}} \right)$$

เมื่อ ESP32 ทำการแปลงค่าแอนะล็อกเป็นดิจิทัล (ADC 12 บิต) จะได้ค่าดิจิทัลอ้างอิงกับ $V_{ref} = 3.3\text{ V}$ ดังนี้:
$$ADC = \text{round}\left( \frac{V_{out}}{V_{in}} \cdot 4095 \right)$$

ทำให้เราสามารถหาความสัมพันธ์ระหว่างค่าดิจิทัลที่อ่านได้จาก ADC กับความต้านทานของเซนเซอร์ได้โดยตรง:
$$\frac{ADC}{4095} = \frac{R_{sensor}}{R_{fixed} + R_{sensor}}$$

แก้สมการหา $R_{sensor}$:
$$R_{sensor} = R_{fixed} \cdot \left( \frac{ADC}{4095 - ADC} \right)$$

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

## 2.3 การจำแนกประเภทเซนเซอร์

เซนเซอร์สามารถจำแนกได้ 2 แนวทางหลัก

### 2.3.1 จำแนกตามปริมาณที่วัด (Measured Quantity)

| ปริมาณที่วัด | ตัวอย่างเซนเซอร์ | การประยุกต์ใช้ |
|---|---|---|
| อุณหภูมิ (Temperature) | DHT22, LM35, DS18B20 | ตรวจวัดอุณหภูมิห้อง เครื่องจักร |
| ความชื้น (Humidity) | DHT22, SHT31 | ระบบเรือนกระจก คลังสินค้า |
| แสง (Light) | LDR, BH1750 | ระบบเปิด-ปิดไฟอัตโนมัติ |
| ระยะทาง (Distance) | HC-SR04, VL53L0X | หุ่นยนต์หลบสิ่งกีดขวาง |
| การเคลื่อนไหว (Motion) | PIR (HC-SR501) | ระบบรักษาความปลอดภัย |
| แก๊ส (Gas) | MQ-2, MQ-135 | ตรวจจับแก๊สรั่ว คุณภาพอากาศ |
| ความดัน (Pressure) | BMP280, BMP180 | สถานีตรวจอากาศ วัดความสูง |
| ความเร่ง (Acceleration) | MPU6050, ADXL345 | ตรวจจับการสั่นสะเทือนเครื่องจักร |

### 2.3.2 จำแนกตามชนิดสัญญาณ (Signal Type)

- **เซนเซอร์แอนะล็อก (Analog Sensor):** ให้สัญญาณแรงดันต่อเนื่อง เช่น LM35 ให้แรงดัน 0–1 V ตามอุณหภูมิ 0–100 °C ต้องใช้ขา ADC ของ ESP32 อ่านค่า
- **เซนเซอร์ดิจิทัล (Digital Sensor):** ให้สัญญาณเป็น HIGH/LOW หรือส่งข้อมูลผ่านโปรโตคอล เช่น DHT22 ส่งข้อมูลผ่าน One-Wire, BMP280 ส่งผ่าน I2C

---

## 2.4 คุณลักษณะของเซนเซอร์ (Sensor Characteristics)

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

## 2.5 สัญญาณดิจิทัลกับแอนะล็อก และการเชื่อมต่อกับไมโครคอนโทรลเลอร์

### 2.5.1 สัญญาณแอนะล็อก (Analog Signal)

- มีค่าต่อเนื่อง (Continuous) เช่น 0.00 V, 1.25 V, 2.73 V
- ESP32 มี ADC (Analog-to-Digital Converter) ขนาด 12 บิต แปลงแรงดัน 0–3.3 V เป็นค่าดิจิทัล 0–4095
- ขาที่ใช้ได้: GPIO 32–39 (ADC1) และ GPIO 0, 2, 4, 12–15, 25–27 (ADC2)

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
  <text x="592.5" y="37" class="text-main" text-anchor="middle">ESP32 (ADC1 ขา 34)</text>
  <text x="592.5" y="55" class="text-sub" text-anchor="middle">อ่านค่าแอนะล็อก 12 บิต</text>
  <text x="592.5" y="75" class="text-code" text-anchor="middle">analogRead(34) ➔ 0-4095</text>
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

**ตัวอย่างการอ่านค่าแอนะล็อก (Wokwi):**

```cpp
const int sensorPin = 34; // ขา ADC1

void setup() {
  Serial.begin(115200);
}

void loop() {
  int rawValue = analogRead(sensorPin);
  float voltage = rawValue * (3.3 / 4095.0);
  Serial.print("Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.println(voltage, 2);
  delay(1000);
}
```

### 2.5.2 สัญญาณดิจิทัล (Digital Signal)

สัญญาณดิจิทัลไม่มีความต่อเนื่องเหมือนสัญญาณแอนะล็อก แต่จะมีสถานะที่จำกัดและชัดเจน โดยทั่วไปในระดับลอจิก (Logic Levels) ของไมโครคอนโทรลเลอร์จะแบ่งออกเป็น 2 สถานะหลัก:

*   **HIGH (ลอจิก 1):** สำหรับ ESP32 คือแรงดันไฟฟ้าประมาณ $3.3\text{ V}$ (ทางไฟฟ้ามักกำหนดเกณฑ์รับเข้าไว้ว่าแรงดันที่สูงกว่า $0.75 \times V_{DD}$ หรือประมาณ $2.47\text{ V}$ ขึ้นไป จะถือว่าเป็น HIGH)
*   **LOW (ลอจิก 0):** สำหรับ ESP32 คือแรงดันไฟฟ้าประมาณ $0\text{ V}$ (ทางไฟฟ้ากำหนดเกณฑ์ไว้ว่าแรงดันที่ต่ำกว่า $0.25 \times V_{DD}$ หรือประมาณ $0.82\text{ V}$ ลงมา จะถือว่าเป็น LOW)

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
  <text x="85" y="78" class="text-sub" text-anchor="middle" fill="#059669" font-weight="bold">HIGH (3.3V) / LOW (0V)</text>
  <rect x="505" y="15" width="175" height="80" class="mcu"/>
  <text x="592.5" y="37" class="text-main" text-anchor="middle">ESP32 (GPIO 19)</text>
  <text x="592.5" y="55" class="text-sub" text-anchor="middle">อ่านค่าสถานะดิจิทัลตรง</text>
  <text x="592.5" y="75" class="text-code" text-anchor="middle">digitalRead(19) ➔ 1 / 0</text>
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

#### 2. สัญญาณโปรโตคอลการสื่อสารข้อมูลดิจิทัล (Digital Communication Protocols)
เซนเซอร์สมัยใหม่จำนวนมากทำหน้าที่ประมวลผลสัญญาณและแปลงเป็นข้อมูลตัวเลขสำเร็จรูปอยู่ภายในชิป จากนั้นจึงส่งข้อมูลที่เป็นชุดบิต (Data Packet) ผ่านพอร์ตสื่อสารแบบอนุกรม (Serial Communication Bus) ไปยัง ESP32 โปรโตคอลหลักที่ใช้งานมีดังนี้:

#### A. I2C (Inter-Integrated Circuit)
โปรโตคอลแบบบัสอนุกรมที่พัฒนาโดย Philips นิยมใช้สูงมากกับเซนเซอร์ระยะใกล้บนบอร์ดเดียวกัน
*   **ลักษณะทางกายภาพ:** ใช้สายสัญญาณเพียง 2 เส้น:
    *   **SDA (Serial Data):** สายรับ-ส่งข้อมูลสองทิศทางแบบสลับเวลา (Half-Duplex)
    *   **SCL (Serial Clock):** สายส่งสัญญาณนาฬิกาควบคุมจังหวะโดยตัวแม่ข่าย (Master)
*   **การเชื่อมต่อ:** ต้องต่อตัวต้านทาน Pull-up (มักใช้ $4.7\text{ k}\Omega$ ถึง $10\text{ k}\Omega$) ไว้ที่สาย SDA และ SCL ไปยัง $V_{DD}$ เพื่อดึงระดับลอจิกขึ้นเมื่อไม่มีอุปกรณ์ใดส่งข้อมูล
*   **ความสามารถพิเศษ:** รองรับการเชื่อมต่ออุปกรณ์เซนเซอร์หลายตัว (Multi-drop) บนบัสเดียวกัน โดยใช้รหัสแอดเดรสระบุตัวเซนเซอร์ (Device Address เช่น $0x76$ หรือ $0x68$) ขนาด 7 บิต ทำให้สามารถต่อเซนเซอร์ต่างชนิดกัน เช่น BMP280 และ MPU6050 เข้ากับขาคู่เดียวกันบน ESP32 ได้โดยไม่สับสน
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
  <text x="80" y="75" class="text-main" text-anchor="middle">ESP32</text>
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

#### B. SPI (Serial Peripheral Interface)
โปรโตคอลการสื่อสารความเร็วสูงแบบ Synchronous พัฒนาโดย Motorola เหมาะสำหรับการส่งข้อมูลปริมาณมาก เช่น หน้าจอแสดงผลกราฟิก หรือเซนเซอร์ความละเอียดสูง
*   **ลักษณะทางกายภาพ:** ใช้สายสัญญาณหลัก 4 เส้น:
    *   **MOSI (Master Out Slave In):** สายส่งข้อมูลออกจาก Master ไปยัง Sensor
    *   **MISO (Master In Slave Out):** สายรับข้อมูลเข้า Master จาก Sensor
    *   **SCK (Serial Clock):** สายส่งสัญญาณนาฬิกาควบคุมจังหวะการรับส่งข้อมูล
    *   **CS / SS (Chip Select / Slave Select):** สายเลือกอุปกรณ์ที่ต้องการคุยด้วย (แยกเฉพาะตัวละ 1 เส้น)
*   **การเชื่อมต่อ:** การสื่อสารเป็นแบบสองทิศทางพร้อมกัน (Full-Duplex)
*   **ความสามารถพิเศษ:** ทำงานได้รวดเร็วกว่า I2C มาก (ระดับความเร็วสูงสุดถึงหลักหลายสิบ MHz) เนื่องจากไม่ต้องจัดการส่งแอดเดรสบิตผ่านข้อมูลสายหลัก แต่ใช้สายฮาร์ดแวร์ CS ในการเลือกว่าจะติดต่อกับอุปกรณ์ตัวใดโดยเฉพาะแทน
*   **ข้อจำกัด:** เมื่อจำนวนเซนเซอร์เพิ่มขึ้น จะต้องเปลืองขา GPIO ของ ESP32 เพิ่มตามจำนวนเซนเซอร์เพื่อนำไปทำเป็นขา CS ของเซนเซอร์แต่ละตัว

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

  <!-- ESP32 Breakout Box -->
  <rect x="20" y="35" width="120" height="170" class="mcu"/>
  <text x="80" y="95" class="text-main" text-anchor="middle">ESP32</text>
  <text x="80" y="115" class="text-sub" text-anchor="middle">(SPI Master)</text>
  <text x="80" y="135" class="text-sub" fill="#7c3aed" font-weight="bold" text-anchor="middle">GPIO 5, 18, 23, 19, 4</text>

  <!-- ESP32 Pin Labels -->
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

#### C. One-Wire
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
  <text x="80" y="85" class="text-main" text-anchor="middle">ESP32</text>
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

### 2.5.3 เปรียบเทียบการเชื่อมต่อ

| หัวข้อ | แอนะล็อก | ดิจิทัล (GPIO) | ดิจิทัล (I2C/SPI) |
|---|---|---|---|
| จำนวนสายข้อมูล | 1 | 1 | 2–4 |
| ขา ESP32 ที่ใช้ | ADC (GPIO 32–39) | GPIO ใดก็ได้ | SDA/SCL หรือ SPI |
| ตัวอย่างเซนเซอร์ | LM35, LDR | PIR, HC-SR04 | BMP280, MPU6050 |
| ข้อดี | วงจรง่าย | อ่านค่าง่าย | ต่อหลายตัวได้บน Bus เดียว |
| ข้อจำกัด | อ่อนไหวต่อสัญญาณรบกวน | ได้แค่ 2 สถานะ | ต้องใช้ไลบรารี |

---

## 2.6 ตัวอย่างเซนเซอร์ยอดนิยมใน IoT

### 2.6.1 DHT22 — วัดอุณหภูมิและความชื้น

- ช่วงวัดอุณหภูมิ: −40 ถึง +80 °C (ความแม่นยำ ±0.5 °C)
- ช่วงวัดความชื้น: 0–100 %RH (ความแม่นยำ ±2%)
- อินเทอร์เฟซ: One-Wire (ดิจิทัล)

```cpp
#include "DHTesp.h"
DHTesp dht;

void setup() {
  Serial.begin(115200);
  dht.setup(15, DHTesp::DHT22); // GPIO 15
}

void loop() {
  float temp = dht.getTemperature();
  float hum = dht.getHumidity();
  Serial.printf("Temp: %.1f°C  Humidity: %.1f%%\n", temp, hum);
  delay(2000);
}
```

### 2.6.2 LM35 — วัดอุณหภูมิ (แอนะล็อก)

- ช่วงวัด: −55 ถึง +150 °C
- ให้เอาต์พุต 10 mV/°C (เช่น 25 °C = 250 mV)
- อินเทอร์เฟซ: แอนะล็อก

```cpp
const int lm35Pin = 34;

void setup() { Serial.begin(115200); }

void loop() {
  int raw = analogRead(lm35Pin);
  float voltage = raw * (3.3 / 4095.0);
  float tempC = voltage / 0.01; // 10 mV per °C
  Serial.printf("Temperature: %.1f°C\n", tempC);
  delay(1000);
}
```

### 2.6.3 LDR — วัดแสง (Light Dependent Resistor)

- ความต้านทานเปลี่ยนตามแสง: แสงมาก → ต้านทานต่ำ, แสงน้อย → ต้านทานสูง
- ต้องต่อวงจรแบ่งแรงดัน (Voltage Divider) ร่วมกับตัวต้านทานคงที่ (แนะนำ $10\text{ k}\Omega$)
- ขาต่อสัญญาณ: ขาแอนะล็อกของ ESP32 (เช่น GPIO 34)

**ตัวอย่างโค้ดการอ่านค่า LDR และคำนวณสว่าง/มืด:**
```cpp
const int ldrPin = 34;       // ขา Vout จากวงจรแบ่งแรงดัน
const int threshold = 2000;  // ค่าเกณฑ์ตัดสินมืด/สว่าง (ย่าน 0-4095)

void setup() {
  Serial.begin(115200);
  pinMode(ldrPin, INPUT);
}

void loop() {
  int rawValue = analogRead(ldrPin);
  float voltage = rawValue * (3.3 / 4095.0);

  Serial.print("ADC Raw: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 2);

  if (rawValue < threshold) {
    Serial.println(" -> สภาพแวดล้อม: มืด (Dark)");
  } else {
    Serial.println(" -> สภาพแวดล้อม: สว่าง (Bright)");
  }

  delay(1000);
}
```

### 2.6.4 HC-SR04 — วัดระยะทางด้วยคลื่นอัลตราโซนิก

- ช่วงวัด: 2–400 cm
- ใช้หลักการส่งคลื่นอัลตราโซนิกความถี่ $40\text{ kHz}$ ออกไป แล้วจับเวลารอสะท้อนกลับ
- ขาต่อสัญญาณ: Trigger (ส่งสัญญาณพัลส์ควบคุม), Echo (ส่งสัญญาณสะท้อนกลับเป็นความยาวคลื่นพัลส์ตามช่วงเวลาเดินทาง)
- สูตรการคำนวณระยะทาง:
  $$\text{Distance (cm)} = \frac{\text{Time (}\mu\text{s)} \times 0.0343}{2}$$

**ตัวอย่างโค้ดอ่านค่า HC-SR04 โดยไม่ใช้ไลบรารี:**
```cpp
const int trigPin = 5;  // ขา Trigger ต่อ GPIO 5
const int echoPin = 18; // ขา Echo ต่อ GPIO 18

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  // 1. เคลียร์สัญญาณส่งคลื่นให้ชัวร์ว่าเป็น LOW
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  // 2. ส่งพัลส์ HIGH เป็นเวลา 10 ไมโครวินาทีเพื่อกระตุ้นเซนเซอร์ให้เริ่มยิงคลื่น
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // 3. วัดช่วงเวลาที่ขา Echo มีสถานะเป็น HIGH (หน่วยไมโครวินาที)
  // กำหนด timeout 30 ms (ประมาณ 5 เมตร) เพื่อไม่ให้บอร์ดค้างถ้าวัดไม่ได้
  long duration = pulseIn(echoPin, HIGH, 30000);

  if (duration == 0) {
    Serial.println("Error: Out of range or sensor disconnected.");
  } else {
    // 4. คำนวณระยะทางหน่วยเซนติเมตร
    float distanceCm = duration / 58.3;
    Serial.print("Distance: ");
    Serial.print(distanceCm, 1);
    Serial.println(" cm");
  }

  delay(1000);
}
```

### 2.6.5 PIR (HC-SR501) — ตรวจจับการเคลื่อนไหว

- ตรวจจับรังสีอินฟราเรดจากร่างกายสิ่งมีชีวิตที่มีความร้อนเคลื่อนที่ผ่านเซนเซอร์
- เอาต์พุต: สัญญาณดิจิทัลเอาต์พุต (HIGH เมื่อตรวจพบการเคลื่อนไหว, LOW เมื่อนิ่ง)
- การใช้งานที่ดีควรใช้ Interrupts เพื่อตอบสนองทันทีโดยไม่ต้องหน่วงเวลาเช็คสถานะในลูปหลัก

**ตัวอย่างโค้ดตรวจจับการเคลื่อนไหวโดยใช้ Hardware Interrupts:**
```cpp
const int pirPin = 19;
volatile bool motionDetected = false;

// ฟังก์ชัน Interrupt Service Routine (ISR) เมื่อเกิดการขัดจังหวะด้วยฮาร์ดแวร์
void IRAM_ATTR detectMotion() {
  motionDetected = true;
}

void setup() {
  Serial.begin(115200);
  pinMode(pirPin, INPUT_PULLDOWN);
  // ตั้งขัดจังหวะที่ขา GPIO เมื่อเกิดการเปลี่ยนผ่านจาก LOW เป็น HIGH (RISING)
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

### 2.6.6 MQ-2 — ตรวจจับแก๊สและควัน

- หลักการทำงาน: ตัวเซนเซอร์ทำจากสารกึ่งตัวนำ SnO2 (Tin dioxide) เมื่อมีแก๊สไวไฟเข้ามาทำปฏิกิริยาเคมีกับออกซิเจนที่ผิวตัวนำ จะส่งผลให้ความต้านทานลดลงอย่างรวดเร็ว
- ตรวจจับได้หลากหลาย: แก๊สหุงต้ม (LPG), ควันไฟ, แอลกอฮอล์, โพรเพน, มีเทน, ไฮโดรเจน
- เอาต์พุตมีทั้งช่องสัญญาณแอนะล็อก (A0) เพื่ออ่านระดับความเข้มข้น และดิจิทัล (D0) ที่สามารถปรับความไวในการทริกเกอร์เอาต์พุตได้โดยตรงบนโมดูลผ่านตัวต้านทานปรับค่าได้ (Potentiometer)

### 2.6.7 BMP280 — วัดความดันบรรยากาศและอุณหภูมิ

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
  Serial.begin(115200);
  Serial.println("Initializing BMP280 sensor...");

  // เปิดใช้งานบัส I2C (ESP32 ใช้ SDA=GPIO 21, SCL=GPIO 22 เป็นค่าเริ่มต้น)
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

### 2.6.8 การกรองสัญญาณรบกวนด้วยซอฟต์แวร์ (Software Signal Filtering)

สัญญาณที่ได้จากเซนเซอร์ชนิดแอนะล็อกมักจะมี **สัญญาณรบกวนทางไฟฟ้า (Electrical Noise)** หรือคลื่นความถี่สูงปนเข้ามา ส่งผลให้ค่าดิจิทัลที่อ่านได้จาก ADC มีความไม่นิ่งแกว่งไปแกว่งมา วิธีการแก้ปัญหาที่ประหยัดและยืดหยุ่นที่สุดคือการใช้ตัวกรองทางดิจิทัลด้วยโปรแกรม (Software Digital Filter)

ตัวกรองที่นิยมใช้มากที่สุดคือ **ตัวกรองแบบค่าเฉลี่ยเคลื่อนที่อย่างง่าย (Simple Moving Average - SMA Filter)** หลักการคือเก็บบันทึกข้อมูลการสุ่มวัดล่าสุดไว้ในอาร์เรย์ (Buffer Array) และคำนวณหาค่าเฉลี่ยของข้อมูลล่าสุดจำนวน $M$ ค่า เมื่อมีข้อมูลใหม่เข้ามา ข้อมูลที่เก่าที่สุดจะถูกลบออกไป (แบบ First-In, First-Out หรือ Queue)

#### แบบจำลองทางคณิตศาสตร์ของ SMA:
$$y[n] = \frac{1}{M} \sum_{i=0}^{M-1} x[n-i]$$

โดยที่:
- $x[n]$ คือ ค่าแอนะล็อกที่สุ่มวัดดิบได้ล่าสุด (Raw Value) ณ เวลาปัจจุบัน
- $x[n-i]$ คือ ค่าดิบที่เคยเก็บย้อนกลับไป $i$ ลำดับ
- $M$ คือ ขนาดของหน้าต่างเวลา (Window Size) ที่ต้องการเฉลี่ย (ยิ่ง $M$ มีค่ามาก สัญญาณจะยิ่งเรียบ แต่จะมีการหน่วงเวลา หรือ Time Delay ของสัญญาณมากขึ้น)
- $y[n]$ คือ ผลลัพธ์จากการกรองที่นำไปใช้งาน (Filtered Output)

**ตัวอย่างโค้ด C++ ใน ESP32 สำหรับกรองข้อมูลแอนะล็อกด้วยเทคนิค Moving Average:**
```cpp
const int sensorPin = 34;       // ขา ADC
const int WINDOW_SIZE = 10;     // ขนาดของหน้าต่างข้อมูลเฉลี่ย (M)
int readings[WINDOW_SIZE];      // อาร์เรย์เก็บข้อมูลประวัติการวัด
int readIndex = 0;              // ตำแหน่งดัชนีของอาร์เรย์ปัจจุบัน
long total = 0;                 // ผลรวมทั้งหมดในอาร์เรย์
int average = 0;                // ผลลัพธ์ค่าเฉลี่ยที่กรองแล้ว

void setup() {
  Serial.begin(115200);
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
*💡 **เทคนิค:** สามารถคัดลอกรหัสนี้ไปทดสอบในโปรแกรม Wokwi และเปิด **Serial Plotter** เพื่อสังเกตความแตกต่างของการตอบสนองของเส้นสีระหว่างเส้นสีดิบที่แกว่งและเส้นที่ได้รับการกรองผ่าน Moving Average*

### 2.6.9 ตารางสรุปเซนเซอร์ยอดนิยม

| เซนเซอร์ | วัดปริมาณ | ชนิดสัญญาณ | อินเทอร์เฟซ | ช่วงวัด | ใช้งานกับ Wokwi |
|---|---|---|---|---|---|
| DHT22 | อุณหภูมิ + ความชื้น | ดิจิทัล | One-Wire | −40 ถึง +80 °C, 0–100 %RH | ✅ |
| LM35 | อุณหภูมิ | แอนะล็อก | Analog | −55 ถึง +150 °C | ✅ |
| LDR | แสงสว่าง | แอนะล็อก | Analog (Voltage Divider) | ขึ้นกับวงจร | ✅ |
| HC-SR04 | ระยะทาง | ดิจิทัล | Trigger/Echo | 2–400 cm | ✅ |
| PIR (HC-SR501) | การเคลื่อนไหว | ดิจิทัล | GPIO | — | ✅ |
| MQ-2 | แก๊ส/ควัน | แอนะล็อก + ดิจิทัล | Analog / GPIO | 200–10000 ppm | ✅ |
| BMP280 | ความดัน + อุณหภูมิ | ดิจิทัล | I2C / SPI | 300–1100 hPa | ✅ |

---

## สรุปท้ายบท

1. **เซนเซอร์** ทำหน้าที่แปลงปริมาณทางกายภาพเป็นสัญญาณไฟฟ้า ซึ่งเป็นพื้นฐานของระบบ IoT ทั้งหมด
2. เซนเซอร์จำแนกได้ตาม **ปริมาณที่วัด** (อุณหภูมิ แสง ระยะทาง ฯลฯ) และ **ชนิดสัญญาณ** (แอนะล็อก / ดิจิทัล)
3. การเลือกเซนเซอร์ต้องพิจารณา **คุณลักษณะ** ที่เหมาะสม ได้แก่ ช่วงวัด ความไว ความละเอียด ความแม่นยำ และเวลาตอบสนอง
4. ESP32 รองรับทั้ง **สัญญาณแอนะล็อก** (ผ่าน ADC 12 บิต) และ **สัญญาณดิจิทัล** (GPIO, I2C, SPI, One-Wire)
5. **Wokwi** รองรับเซนเซอร์ยอดนิยมหลายตัว ทำให้ฝึกปฏิบัติได้โดยไม่ต้องซื้ออุปกรณ์จริง
6. เซนเซอร์มีบทบาทสำคัญในงานวิศวกรรมเครื่องกล ตั้งแต่การตรวจสอบสภาพเครื่องจักรไปจนถึงระบบหุ่นยนต์

---

## แบบฝึกหัดท้ายบท

**ข้อ 1:** จงอธิบายความแตกต่างระหว่าง "เซนเซอร์" กับ "ทรานสดิวเซอร์" พร้อมยกตัวอย่างประกอบ

**ข้อ 2:** เซนเซอร์ LM35 ให้เอาต์พุต 10 mV/°C ถ้า ESP32 (ADC 12 บิต, อ้างอิง 3.3 V) อ่านค่า raw = 310 จงคำนวณหาอุณหภูมิที่วัดได้ (แสดงวิธีคิด)

**ข้อ 3:** จงเติมตารางต่อไปนี้ให้สมบูรณ์:

| เซนเซอร์ | ปริมาณที่วัด | ชนิดสัญญาณ | อินเทอร์เฟซ |
|---|---|---|---|
| DHT22 | ? | ? | ? |
| HC-SR04 | ? | ? | ? |
| MQ-2 | ? | ? | ? |
| BMP280 | ? | ? | ? |

**ข้อ 4:** ถ้าต้องออกแบบระบบ IoT สำหรับตรวจสอบสภาพห้องเซิร์ฟเวอร์ (Server Room) จะเลือกใช้เซนเซอร์อะไรบ้าง อย่างน้อย 3 ตัว พร้อมอธิบายเหตุผลและระบุขา ESP32 ที่จะเชื่อมต่อ

**ข้อ 5:** จงอธิบายความแตกต่างระหว่าง "ความแม่นยำ (Accuracy)" และ "ความเที่ยง (Precision)" พร้อมวาดรูปเป้ายิงธนูประกอบ 3 กรณี: (1) ทั้งแม่นและเที่ยง (2) เที่ยงแต่ไม่แม่น (3) ไม่แม่นไม่เที่ยง

**ข้อ 6:** จงเขียนโปรแกรม Arduino สำหรับ ESP32 บน Wokwi ที่อ่านค่า LDR ผ่านขา GPIO 34 แล้วแสดงผลเป็น "สว่าง" (ค่า ADC > 2000) หรือ "มืด" (ค่า ADC ≤ 2000) ทาง Serial Monitor ทุก 1 วินาที

**ข้อ 7:** ในโรงงานผลิตชิ้นส่วนยานยนต์ วิศวกรเครื่องกลต้องการติดตั้งระบบ IoT เพื่อตรวจจับการสั่นสะเทือนผิดปกติของเครื่อง CNC จงเสนอเซนเซอร์ที่เหมาะสมพร้อมอธิบายคุณลักษณะสำคัญ (Range, Sensitivity, Response Time) ที่ต้องพิจารณา

**ข้อ 8 (ท้าทาย):** จงออกแบบ diagram.json สำหรับ Wokwi ที่ต่อ ESP32 กับ DHT22 และ LED โดยเมื่ออุณหภูมิเกิน 35 °C ให้ LED ติด และเขียนโค้ดให้ทำงานได้จริง
