# Chapter 2: ตัวรับรู้ (Sensors)
## Sensors for IoT

บทนี้จะพาทำความรู้จักกับ **เซนเซอร์ (Sensor)** ซึ่งเป็นอุปกรณ์สำคัญที่ทำหน้าที่เป็น "ตา หู จมูก" ของระบบ IoT ทำให้ไมโครคอนโทรลเลอร์อย่าง ESP32 สามารถรับรู้สิ่งที่เกิดขึ้นในโลกจริงได้ ไม่ว่าจะเป็นอุณหภูมิ แสงสว่าง ระยะทาง หรือแม้แต่แก๊สที่มองไม่เห็น

---

## 2.1 เซนเซอร์คืออะไร และหลักการแปลงปริมาณกายภาพเป็นสัญญาณไฟฟ้า

**เซนเซอร์ (Sensor)** คืออุปกรณ์ที่ตรวจจับปริมาณทางกายภาพ (Physical Quantity) แล้วแปลงให้เป็นสัญญาณไฟฟ้า (Electrical Signal) ที่ไมโครคอนโทรลเลอร์สามารถอ่านค่าได้

### 2.1.1 ทรานสดิวเซอร์ (Transducer)

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

### 2.1.2 หลักการทางฟิสิกส์และแบบจำลองทางคณิตศาสตร์ของเซนเซอร์แบบความต้านทาน (Resistive Sensors)

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

## 2.2 การจำแนกประเภทเซนเซอร์

เซนเซอร์สามารถจำแนกได้ 2 แนวทางหลัก

### 2.2.1 จำแนกตามปริมาณที่วัด (Measured Quantity)

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

### 2.2.2 จำแนกตามชนิดสัญญาณ (Signal Type)

- **เซนเซอร์แอนะล็อก (Analog Sensor):** ให้สัญญาณแรงดันต่อเนื่อง เช่น LM35 ให้แรงดัน 0–1 V ตามอุณหภูมิ 0–100 °C ต้องใช้ขา ADC ของ ESP32 อ่านค่า
- **เซนเซอร์ดิจิทัล (Digital Sensor):** ให้สัญญาณเป็น HIGH/LOW หรือส่งข้อมูลผ่านโปรโตคอล เช่น DHT22 ส่งข้อมูลผ่าน One-Wire, BMP280 ส่งผ่าน I2C

---

## 2.3 คุณลักษณะของเซนเซอร์ (Sensor Characteristics)

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

## 2.4 สัญญาณดิจิทัลกับแอนะล็อก และการเชื่อมต่อกับไมโครคอนโทรลเลอร์

### 2.4.1 สัญญาณแอนะล็อก (Analog Signal)

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

### 2.4.2 สัญญาณดิจิทัล (Digital Signal)

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
<svg viewBox="0 0 700 180" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
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
  <rect x="5" y="5" width="690" height="170" class="bg"/>
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
  <g>
    <rect x="0" y="0" width="45" height="14" rx="3" class="sda-packet"/>
    <text x="22.5" y="10" class="packet-label" text-anchor="middle">ADDR 0x76</text>
    <animateMotion path="M 140 105 L 450 105 L 450 45 L 520 45" dur="4s" repeatCount="indefinite" />
  </g>
  <g>
    <rect x="0" y="0" width="45" height="14" rx="3" fill="#3b82f6" stroke="#ffffff" stroke-width="1"/>
    <text x="22.5" y="10" class="packet-label" text-anchor="middle">DATA: 25C</text>
    <animateMotion path="M 520 45 L 450 45 L 450 105 L 140 105" dur="4s" begin="2s" repeatCount="indefinite" />
  </g>
  <text x="340" y="160" class="text-sub" text-anchor="middle" fill="#475569">SDA ส่งที่อยู่เพื่อเรียกเซนเซอร์ (ADDR) และเซนเซอร์จะตอบรับและส่งข้อมูล (DATA) กลับมาในสายสัญญาณเส้นเดิม</text>
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
<svg viewBox="0 0 700 240" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1; rx: 8px; }
    .mcu { fill: #faf5ff; stroke: #a78bfa; stroke-width: 2; rx: 8px; }
    .sensor { fill: #eff6ff; stroke: #60a5fa; stroke-width: 2; rx: 8px; }
    .wire { fill: none; stroke: #cbd5e1; stroke-width: 1.5; }
    .wire-active { fill: none; stroke: #3b82f6; stroke-width: 2; }
    .wire-cs-low { fill: none; stroke: #ef4444; stroke-width: 2; }
    .wire-cs-high { fill: none; stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 3 3; }
    .text-main { font-size: 12px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 10px; fill: #64748b; }
    .text-bus { font-size: 10px; font-weight: bold; font-family: monospace; fill: #475569; }
    .packet-mosi { fill: #ec4899; stroke: #ffffff; stroke-width: 1; }
    .packet-miso { fill: #10b981; stroke: #ffffff; stroke-width: 1; }
    .packet-label { font-size: 8px; fill: #ffffff; font-weight: bold; font-family: monospace; }
  </style>
  <rect x="5" y="5" width="690" height="230" class="bg"/>
  <rect x="20" y="45" width="120" height="150" class="mcu"/>
  <text x="80" y="110" class="text-main" text-anchor="middle">ESP32</text>
  <text x="80" y="130" class="text-sub" text-anchor="middle">(SPI Master)</text>
  <!-- SCK Bus Line & Branch to Sensor B -->
  <line x1="140" y1="65" x2="520" y2="65" class="wire"/>
  <path d="M 470 65 L 470 160 L 520 160" class="wire"/>
  <circle cx="470" cy="65" r="3" fill="#cbd5e1"/>
  <text x="150" y="50" class="text-bus">SCK (Clock)</text>
  
  <!-- MOSI Bus Line & Branch to Sensor B -->
  <line x1="140" y1="95" x2="520" y2="95" class="wire-active"/>
  <path d="M 450 95 L 450 170 L 520 170" class="wire"/>
  <circle cx="450" cy="95" r="3" fill="#cbd5e1"/>
  <text x="150" y="80" class="text-bus" fill="#db2777">MOSI (Data Out)</text>
  
  <!-- MISO Bus Line with active branch from Sensor A and inactive from Sensor B -->
  <line x1="140" y1="125" x2="450" y2="125" class="wire-active"/>
  <line x1="450" y1="125" x2="520" y2="125" class="wire"/>
  <path d="M 520 105 L 450 105 L 450 125" class="wire-active"/>
  <path d="M 520 180 L 450 180 L 450 125" class="wire"/>
  <circle cx="450" cy="125" r="3" fill="#cbd5e1"/>
  <text x="150" y="110" class="text-bus" fill="#059669">MISO (Data In)</text>
  <path d="M 140 165 L 430 165 L 430 100 L 520 100" class="wire-cs-low"/>
  <text x="150" y="150" class="text-bus" fill="#dc2626">CS A (Active LOW ➔ Enabled)</text>
  <line x1="140" y1="185" x2="520" y2="185" class="wire-cs-high"/>
  <text x="150" y="205" class="text-bus" fill="#94a3b8">CS B (Standby HIGH ➔ Disabled)</text>
  <rect x="520" y="30" width="150" height="80" class="sensor"/>
  <text x="595" y="65" class="text-main" text-anchor="middle">Sensor A</text>
  <text x="595" y="85" class="text-sub" text-anchor="middle">(SPI Slave 1 - Active)</text>
  <rect x="520" y="150" width="150" height="70" class="sensor" style="opacity: 0.5;"/>
  <text x="595" y="185" class="text-main" text-anchor="middle" style="opacity: 0.5;">Sensor B</text>
  <text x="595" y="200" class="text-sub" text-anchor="middle" style="opacity: 0.5;">(Disabled)</text>
  <!-- Junction circles removed from here since they are declared inline with bus paths -->
  <g>
    <rect x="0" y="0" width="40" height="12" rx="2" class="packet-mosi"/>
    <text x="20" y="9" class="packet-label" text-anchor="middle">WRITE</text>
    <animateMotion path="M 140 95 L 520 95" dur="3s" repeatCount="indefinite" />
  </g>
  <g>
    <rect x="0" y="0" width="40" height="12" rx="2" class="packet-miso"/>
    <text x="20" y="9" class="packet-label" text-anchor="middle">READ</text>
    <animateMotion path="M 520 125 L 140 125" dur="3s" repeatCount="indefinite" />
  </g>
  <text x="350" y="222" class="text-sub" text-anchor="middle" fill="#475569">การส่งข้อมูลแบบ Full-Duplex: ข้อมูลไหลผ่าน MOSI และ MISO พร้อมกันในรอบบัสเดียว เมื่อขา CS A ถูกดึงลงต่ำ (LOW)</text>
</svg>
</div>

#### C. One-Wire
โปรโตคอลการสื่อสารที่เป็นสิทธิบัตรของ Dallas Semiconductor (ปัจจุบันคือ Maxim Integrated) ออกแบบมาเพื่อเน้นการเชื่อมต่อที่ประหยัดสายสัญญาณและอุปกรณ์มีราคาประหยัด
*   **ลักษณะทางกายภาพ:** ใช้สายสัญญาณรับส่งข้อมูลเพียง **1 เส้น** (Data Line) ร่วมกับสายกราวด์ (GND) และต้องการตัวต้านทาน Pull-up (มักใช้ $4.7\text{ k}\Omega$)
*   **การเชื่อมต่อ:** เป็นการรับ-ส่งข้อมูลทิศทางเดียวสลับเวลา (Half-Duplex) บนสายสัญญาณเส้นเดียว
*   **ความสามารถพิเศษ:** อุปกรณ์ One-Wire ทุกตัวมีรหัสระบุตัวตน 64 บิตที่เป็นเอกลักษณ์เฉพาะตัว (Unique ROM ID) ฝังมาจากโรงงาน ทำให้เราสามารถต่อเซนเซอร์ One-Wire ชนิดเดียวกัน เช่น เซนเซอร์วัดอุณหภูมิกันน้ำ DS18B20 หลายสิบตัวขนานกันบนสายข้อมูลเส้นเดียว และสั่งอ่านอุณหภูมิทีละตัวได้โดยใช้สายทองแดงเพียงชุดเดียวไปตามพื้นที่ต่างๆ
*   **ตัวอย่างการประยุกต์ใช้:** เซนเซอร์ DHT22 (วัดอุณหภูมิและความชื้น) และ DS18B20 (วัดอุณหภูมิความละเอียดสูงชนิดกันน้ำ)

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 700 200" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
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
  <rect x="5" y="5" width="690" height="190" class="bg"/>
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
  <g>
    <rect x="0" y="0" width="55" height="12" rx="2" class="packet-cmd"/>
    <text x="27.5" y="9" class="packet-label" text-anchor="middle">REQ #98B</text>
    <animateMotion path="M 140 90 L 520 90" dur="4s" repeatCount="indefinite" />
  </g>
  <g>
    <rect x="0" y="0" width="55" height="12" rx="2" class="packet-reply"/>
    <text x="27.5" y="9" class="packet-label" text-anchor="middle">TEMP: 26.8C</text>
    <animateMotion path="M 520 90 L 140 90" dur="4s" begin="2s" repeatCount="indefinite" />
  </g>
  <text x="350" y="178" class="text-sub" text-anchor="middle" fill="#475569">การสื่อสารแบบ Half-Duplex: ใช้สายส่งข้อมูล 1 เส้นร่วมกัน โดย Master ส่งรหัสเรียกเซนเซอร์ แล้วเซนเซอร์ส่งข้อมูลกลับในสายเดิม</text>
</svg>
</div>

### 2.4.3 เปรียบเทียบการเชื่อมต่อ

| หัวข้อ | แอนะล็อก | ดิจิทัล (GPIO) | ดิจิทัล (I2C/SPI) |
|---|---|---|---|
| จำนวนสายข้อมูล | 1 | 1 | 2–4 |
| ขา ESP32 ที่ใช้ | ADC (GPIO 32–39) | GPIO ใดก็ได้ | SDA/SCL หรือ SPI |
| ตัวอย่างเซนเซอร์ | LM35, LDR | PIR, HC-SR04 | BMP280, MPU6050 |
| ข้อดี | วงจรง่าย | อ่านค่าง่าย | ต่อหลายตัวได้บน Bus เดียว |
| ข้อจำกัด | อ่อนไหวต่อสัญญาณรบกวน | ได้แค่ 2 สถานะ | ต้องใช้ไลบรารี |

---

## 2.5 ตัวอย่างเซนเซอร์ยอดนิยมใน IoT

### 2.5.1 DHT22 — วัดอุณหภูมิและความชื้น

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

### 2.5.2 LM35 — วัดอุณหภูมิ (แอนะล็อก)

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

### 2.5.3 LDR — วัดแสง (Light Dependent Resistor)

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

### 2.5.4 HC-SR04 — วัดระยะทางด้วยคลื่นอัลตราโซนิก

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

### 2.5.5 PIR (HC-SR501) — ตรวจจับการเคลื่อนไหว

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

### 2.5.6 MQ-2 — ตรวจจับแก๊สและควัน

- หลักการทำงาน: ตัวเซนเซอร์ทำจากสารกึ่งตัวนำ SnO2 (Tin dioxide) เมื่อมีแก๊สไวไฟเข้ามาทำปฏิกิริยาเคมีกับออกซิเจนที่ผิวตัวนำ จะส่งผลให้ความต้านทานลดลงอย่างรวดเร็ว
- ตรวจจับได้หลากหลาย: แก๊สหุงต้ม (LPG), ควันไฟ, แอลกอฮอล์, โพรเพน, มีเทน, ไฮโดรเจน
- เอาต์พุตมีทั้งช่องสัญญาณแอนะล็อก (A0) เพื่ออ่านระดับความเข้มข้น และดิจิทัล (D0) ที่สามารถปรับความไวในการทริกเกอร์เอาต์พุตได้โดยตรงบนโมดูลผ่านตัวต้านทานปรับค่าได้ (Potentiometer)

### 2.5.7 BMP280 — วัดความดันบรรยากาศและอุณหภูมิ

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

### 2.5.8 การกรองสัญญาณรบกวนด้วยซอฟต์แวร์ (Software Signal Filtering)

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

### 2.5.9 ตารางสรุปเซนเซอร์ยอดนิยม

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
