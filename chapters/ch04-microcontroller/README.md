# Chapter 4: ไมโครคอนโทรลเลอร์ (ESP32/Arduino)
## Microcontrollers — ESP32 & Arduino

---

### 4.1 ไมโครคอนโทรลเลอร์คืออะไร? (Introduction to Microcontrollers)

**ไมโครคอนโทรลเลอร์ (Microcontroller Unit — MCU)** คือชิปประมวลผลเดี่ยว (Single-chip computer) ที่รวมหน่วยประมวลผล (CPU), หน่วยความจำ (RAM, Flash), และโมดูลอินพุต/เอาต์พุต (Peripherals) ทั้งแอนะล็อกและดิจิทัลไว้ภายในวงจรรวม (Integrated Circuit - IC) เดียวกัน เพื่อควบคุมการทำงานของอุปกรณ์ในระบบฝังตัว (Embedded Systems) เช่น ระบบอัตโนมัติในโรงงาน เครื่องวัดค่าทางการแพทย์ หรือระบบยานยนต์

#### 4.1.1 เปรียบเทียบ MCU กับ Microprocessor (MPU)

| หัวข้อ | ไมโครคอนโทรลเลอร์ (MCU) | ไมโครโพรเซสเซอร์ (MPU) |
|---|---|---|
| **ตัวอย่าง** | ESP32, ATmega328 (Arduino Uno), STM32 | Intel Core i7, AMD Ryzen, Apple M1, ARM Cortex-A |
| **โครงสร้างระบบ** | รวมทุกอย่างในชิปเดี่ยว (SoC - System on Chip) | มีเฉพาะ CPU ต้องเชื่อมต่อ RAM, ROM, I/O ภายนอก |
| **ระบบปฏิบัติการ** | รันแบบ Bare-metal หรือ Real-Time OS (RTOS) | รันระบบปฏิบัติการเต็มรูปแบบ เช่น Windows, Linux, macOS |
| **ความถี่สัญญาณนาฬิกา** | ต่ำ (ระดับ MHz ถึงร้อยกว่า MHz) | สูง (ระดับ GHz) |
| **การใช้พลังงาน** | ต่ำมาก (ระดับมิลลิวัตต์ mW) มีโหมด Sleep | สูง (ระดับวัตต์ W จนถึงร้อยวัตต์) |
| **ต้นทุนระบบ** | ต่ำมาก (หลักสิบถึงหลักร้อยบาท) | สูง (หลักพันถึงหลายหมื่นบาท) |
| **ลักษณะงาน** | ควบคุมฮาร์ดแวร์เฉพาะด้าน, งาน IoT, ระบบควบคุมรถยนต์ | ประมวลผลข้อมูลทั่วไป, งานคำนวณหนัก, เซิร์ฟเวอร์ |

---

#### 4.1.2 สถาปัตยกรรมหน่วยความจำ: Von Neumann vs Harvard Architecture

ในการออกแบบสถาปัตยกรรมคอมพิวเตอร์และระบบบัสเพื่อเข้าถึงคำสั่ง (Instruction) และข้อมูล (Data) มีแนวคิดหลักสองรูปแบบดังนี้:

#### 1) สถาปัตยกรรมแบบ Von Neumann (Von Neumann Architecture)
สถาปัตยกรรมที่ใช้บัสข้อมูล (Data Bus) และบัสแอดเดรส (Address Bus) ชุดเดียวกันในการเข้าถึงทั้งหน่วยความจำโปรแกรม (คำสั่ง) และหน่วยความจำข้อมูล
- **ลักษณะเด่น:** คำสั่งและข้อมูลแชร์พื้นที่หน่วยความจำและระบบบัสร่วมกัน
- **ข้อดี:** ออกแบบทางฮาร์ดแวร์ได้ง่าย ประหยัดสายสัญญาณบัสบนชิป
- **ข้อเสีย:** เกิดปัญหา **"คอขวดฟอนนอยมันน์" (Von Neumann Bottleneck)** เนื่องจาก CPU ไม่สามารถ Fetch คำสั่งพร้อมกับ Read/Write ข้อมูลในหน่วยความจำในเวลาเดียวกันได้ (ต้องผลัดกันส่งข้อมูลผ่านบัสร่วม)

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 300" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>สถาปัตยกรรมแบบ Von Neumann</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .box-cpu { fill: #e0e7ff; stroke: #4f46e5; stroke-width: 2; rx: 8px; }
    .box-mem { fill: #ecfdf5; stroke: #059669; stroke-width: 2; rx: 8px; }
    .bus-line { fill: none; stroke: #64748b; stroke-width: 8; stroke-linecap: round; }
    .bus-inner { fill: none; stroke: #94a3b8; stroke-width: 4; stroke-linecap: round; }
    .bus-glow { fill: none; stroke: #818cf8; stroke-width: 8; stroke-linecap: round; opacity: 0.15; }
    .text-title { font-size: 16px; font-weight: bold; fill: #1e293b; }
    .text-node { font-size: 14px; font-weight: bold; fill: #0f172a; }
    .text-desc { font-size: 12px; fill: #475569; }
    .packet-inst { fill: #8b5cf6; stroke: #ffffff; stroke-width: 1.5; }
    .packet-data { fill: #f59e0b; stroke: #ffffff; stroke-width: 1.5; }
    .gate-inst { rx: 2px; }
    .gate-data { rx: 2px; }
    
    @keyframes busTraffic {
      0%, 45% { stroke: #8b5cf6; }
      50%, 95% { stroke: #f59e0b; }
      46%, 49%, 96%, 99% { stroke: #ef4444; }
    }
    .active-bus { animation: busTraffic 7s infinite; }
    
    @keyframes moveInst {
      0% { transform: translate(450px, 150px); opacity: 0; }
      5% { transform: translate(450px, 150px); opacity: 1; }
      40% { transform: translate(250px, 150px); opacity: 1; }
      45%, 100% { transform: translate(250px, 150px); opacity: 0; }
    }
    @keyframes moveData {
      0%, 50% { transform: translate(250px, 150px); opacity: 0; }
      55% { transform: translate(250px, 150px); opacity: 1; }
      90% { transform: translate(450px, 150px); opacity: 1; }
      95%, 100% { transform: translate(450px, 150px); opacity: 0; }
    }
    @keyframes gateRed {
      0%, 45% { fill: #22c55e; }
      46%, 95% { fill: #ef4444; }
      96%, 100% { fill: #22c55e; }
    }
    @keyframes gateBlue {
      0%, 49% { fill: #ef4444; }
      50%, 95% { fill: #22c55e; }
      96%, 100% { fill: #ef4444; }
    }
    .inst-dot { animation: moveInst 7s infinite; }
    .data-dot { animation: moveData 7s infinite; }
    .gate-inst-light { animation: gateRed 7s infinite; }
    .gate-data-light { animation: gateBlue 7s infinite; }
  </style>
  
  <rect x="5" y="5" width="750" height="290" class="bg"/>
  <text x="380" y="30" class="text-title" text-anchor="middle">สถาปัตยกรรมแบบ Von Neumann (บัสร่วม)</text>
  
  <rect x="50" y="90" width="180" height="120" class="box-cpu"/>
  <text x="140" y="135" class="text-node" text-anchor="middle">หน่วยประมวลผล (CPU)</text>
  <text x="140" y="160" class="text-desc" text-anchor="middle">- ALU &amp; Registers</text>
  <text x="140" y="180" class="text-desc" text-anchor="middle">- Control Unit</text>
  
  <rect x="530" y="90" width="180" height="120" class="box-mem"/>
  <text x="620" y="135" class="text-node" text-anchor="middle">หน่วยความจำร่วม</text>
  <text x="620" y="160" class="text-desc" text-anchor="middle">[คำสั่ง (Instruction)]</text>
  <text x="620" y="180" class="text-desc" text-anchor="middle">&amp; [ข้อมูล (Data)]</text>
  
  <line x1="230" y1="150" x2="530" y2="150" class="bus-line"/>
  <line x1="230" y1="150" x2="530" y2="150" class="bus-glow active-bus"/>
  <line x1="230" y1="150" x2="530" y2="150" class="bus-inner"/>
  
  <text x="380" y="115" class="text-node" text-anchor="middle">บัสร่วม (Shared Address / Data Bus)</text>
  <text x="380" y="195" class="text-desc" text-anchor="middle" fill="#dc2626">คอขวด (Bottleneck): คำสั่งและข้อมูลต้องสลับกันเข้าบัส</text>
  
  <g transform="translate(260, 95)">
    <rect x="0" y="0" width="18" height="34" fill="#1e293b" rx="3"/>
    <circle cx="9" cy="9" r="5" class="gate-inst-light"/>
    <circle cx="9" cy="25" r="5" class="gate-data-light"/>
  </g>
  <text x="280" y="85" class="text-desc" font-size="10">คิวบัส</text>
  
  <g class="inst-dot">
    <circle r="10" class="packet-inst"/>
    <text y="4" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">Inst</text>
  </g>
  
  <g class="data-dot">
    <circle r="10" class="packet-data"/>
    <text y="4" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">Data</text>
  </g>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 4.1 สถาปัตยกรรมแบบ Von Neumann ที่มีบัสคำสั่งและข้อมูลแชร์ร่วมกัน เกิดสภาวะคอขวดสะสม</div>
</div>

#### 2) สถาปัตยกรรมแบบ Harvard (Harvard Architecture)
สถาปัตยกรรมที่แยกบัสข้อมูล (Data Bus) และบัสคำสั่ง (Instruction Bus) ออกจากกันเป็นอิสระ รวมถึงแยกหน่วยความจำโปรแกรมและหน่วยความจำข้อมูลด้วย
- **ลักษณะเด่น:** CPU สามารถ Fetch คำสั่งจากหน่วยความจำโปรแกรม ไปพร้อมกับการอ่านหรือเขียนข้อมูลในหน่วยความจำข้อมูลได้ในรอบสัญญาณนาฬิกาเดียวกัน
- **ข้อดี:** ความเร็วในการประมวลผลสูงกว่า หลีกเลี่ยงปัญหาคอขวดบัส
- **ข้อเสีย:** การออกแบบวงจรบนชิปมีความซับซ้อนมากกว่า และใช้จำนวนพิน/สายสัญญาณมากกว่า

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 300" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>สถาปัตยกรรมแบบ Harvard</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .box-cpu { fill: #e0e7ff; stroke: #4f46e5; stroke-width: 2; rx: 8px; }
    .box-pmem { fill: #e0f2fe; stroke: #0284c7; stroke-width: 2; rx: 8px; }
    .box-dmem { fill: #ecfdf5; stroke: #059669; stroke-width: 2; rx: 8px; }
    .bus-line { fill: none; stroke: #64748b; stroke-width: 6; stroke-linecap: round; }
    .bus-inner-inst { fill: none; stroke: #bae6fd; stroke-width: 3; stroke-linecap: round; }
    .bus-inner-data { fill: none; stroke: #a7f3d0; stroke-width: 3; stroke-linecap: round; }
    .bus-glow-inst { fill: none; stroke: #0284c7; stroke-width: 6; stroke-linecap: round; opacity: 0.2; }
    .bus-glow-data { fill: none; stroke: #059669; stroke-width: 6; stroke-linecap: round; opacity: 0.2; }
    .text-title { font-size: 16px; font-weight: bold; fill: #1e293b; }
    .text-node { font-size: 14px; font-weight: bold; fill: #0f172a; }
    .text-desc { font-size: 12px; fill: #475569; }
    .packet-inst { fill: #0284c7; stroke: #ffffff; stroke-width: 1.5; }
    .packet-data { fill: #059669; stroke: #ffffff; stroke-width: 1.5; }
    
    @keyframes moveInstHarvard {
      0% { transform: translate(500px, 100px); opacity: 0; }
      10% { transform: translate(500px, 100px); opacity: 1; }
      90% { transform: translate(230px, 100px); opacity: 1; }
      100% { transform: translate(230px, 100px); opacity: 0; }
    }
    @keyframes moveDataHarvard {
      0% { transform: translate(230px, 200px); opacity: 0; }
      10% { transform: translate(230px, 200px); opacity: 1; }
      90% { transform: translate(500px, 200px); opacity: 1; }
      100% { transform: translate(500px, 200px); opacity: 0; }
    }
    .inst-dot { animation: moveInstHarvard 3s linear infinite; }
    .data-dot { animation: moveDataHarvard 3s linear infinite; }
  </style>
  
  <rect x="5" y="5" width="750" height="290" class="bg"/>
  <text x="380" y="30" class="text-title" text-anchor="middle">สถาปัตยกรรมแบบ Harvard (บัสแยกอิสระ)</text>
  
  <rect x="50" y="80" width="180" height="150" class="box-cpu"/>
  <text x="140" y="135" class="text-node" text-anchor="middle">หน่วยประมวลผล (CPU)</text>
  <text x="140" y="160" class="text-desc" text-anchor="middle">- ALU &amp; Registers</text>
  <text x="140" y="180" class="text-desc" text-anchor="middle">- Parallel Control Units</text>
  
  <rect x="500" y="60" width="200" height="75" class="box-pmem"/>
  <text x="600" y="90" class="text-node" text-anchor="middle">หน่วยความจำโปรแกรม</text>
  <text x="600" y="110" class="text-desc" text-anchor="middle">Program Memory [Inst]</text>
  
  <rect x="500" y="165" width="200" height="75" class="box-dmem"/>
  <text x="600" y="195" class="text-node" text-anchor="middle">หน่วยความจำข้อมูล</text>
  <text x="600" y="215" class="text-desc" text-anchor="middle">Data Memory [Data]</text>
  
  <line x1="230" y1="100" x2="500" y2="100" class="bus-line"/>
  <line x1="230" y1="100" x2="500" y2="100" class="bus-glow-inst"/>
  <line x1="230" y1="100" x2="500" y2="100" class="bus-inner-inst"/>
  <text x="365" y="85" class="text-desc" font-weight="bold" fill="#0284c7">บัสคำสั่ง (Instruction Bus)</text>
  
  <line x1="230" y1="200" x2="500" y2="200" class="bus-line"/>
  <line x1="230" y1="200" x2="500" y2="200" class="bus-glow-data"/>
  <line x1="230" y1="200" x2="500" y2="200" class="bus-inner-data"/>
  <text x="365" y="185" class="text-desc" font-weight="bold" fill="#059669">บัสข้อมูล (Data Bus)</text>
  
  <text x="365" y="265" class="text-desc" text-anchor="middle" font-weight="bold" fill="#059669">ทำงานขนานกัน (Parallel): อ่านคำสั่งพร้อมกับอ่าน/เขียนข้อมูลในรอบเดียวกัน</text>
  
  <g class="inst-dot">
    <circle r="9" class="packet-inst"/>
    <text y="3" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">Inst</text>
  </g>
  
  <g class="data-dot">
    <circle r="9" class="packet-data"/>
    <text y="3" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">Data</text>
  </g>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 4.2 สถาปัตยกรรมแบบ Harvard แยกสายส่งข้อมูลและสายสั่งงานออกเป็นอิสระ เพื่อการรันงานแบบขนานเต็มประสิทธิภาพ</div>
</div>

#### 3) Modified Harvard Architecture
ไมโครคอนโทรลเลอร์และไมโครโพรเซสเซอร์ยุคใหม่ (เช่น สถาปัตยกรรม ARM Cortex หรือ Xtensa ใน ESP32) มักหันมาใช้สถาปัตยกรรมแบบ **Modified Harvard** ซึ่งเป็นการผสานข้อดีของทั้งสองระบบ โดยภายใน CPU จะแยกบัสคำสั่งและบัสข้อมูลเพื่อให้ประมวลผลได้เร็วแบบ Harvard แต่ระบบหน่วยความจำภายนอกหรือพื้นที่แอดเดรสจะสามารถเข้าถึงร่วมกันได้ ทำให้โปรแกรมสามารถอ่านข้อมูลคงที่ (Constant data เช่น ตาราง lookup table) ที่เก็บอยู่ใน Flash Memory (หน่วยความจำโปรแกรม) เสมือนเป็นข้อมูลปกติใน RAM ได้โดยสะดวกผ่านกลไก MMU

---

#### 4.1.3 ส่วนประกอบภายในของ CPU และวงรอบการทำงาน (Internal CPU Components & Instruction Cycle)

#### 1) ส่วนประกอบสำคัญภายใน CPU
- **ALU (Arithmetic Logic Unit):** หน่วยคำนวณทางคณิตศาสตร์ (เช่น บวก ลบ) และตรรกศาสตร์ (เช่น AND, OR, XOR)
- **Registers (รีจิสเตอร์):** หน่วยความจำภายใน CPU ที่ทำงานเร็วที่สุด ใช้เก็บข้อมูลและสถานะขณะประมวลผล:
  - **Program Counter (PC):** รีจิสเตอร์ที่ทำหน้าที่ชี้ตำแหน่งแอดเดรสของคำสั่งถัดไปในหน่วยความจำโปรแกรมที่จะต้องถูกดึงมาประมวลผล
  - **Stack Pointer (SP):** รีจิสเตอร์ที่เก็บตำแหน่งแอดเดรสล่าสุดของหน่วยความจำสแต็ก (Stack) ใช้สำหรับเก็บสถานะของ CPU และตัวแปรชั่วคราวเมื่อเกิดการเรียกฟังก์ชัน (Function Call) หรือเมื่อมีสัญญาณขัดจังหวะ (Interrupt)
  - **Instruction Register (IR):** รีจิสเตอร์ที่พักรหัสคำสั่ง (Opcode) ที่เพิ่งจะถูก Fetch มาจากหน่วยความจำ เพื่อรอส่งต่อไปยังหน่วยถอดรหัสคำสั่ง (Decoder)
  - **Status Register / Flag Register:** รีจิสเตอร์เก็บสถานะที่ระบุผลลัพธ์ของการคำนวณล่าสุดจาก ALU เช่น Zero Flag (Z - ผลลัพธ์เป็นศูนย์), Carry Flag (C - มีการทดเลข), Negative Flag (N - ผลลัพธ์เป็นลบ), และ Overflow Flag (V - เกิดการล้นของเลขมีเครื่องหมาย)
  - **General Purpose Registers (รีจิสเตอร์ทั่วไป):** รีจิสเตอร์ที่โปรแกรมเมอร์หรือคอมไพเลอร์ใช้สำหรับพักข้อมูลตัวแปรชั่วคราวในขั้นตอนการคำนวณทั่วไป

#### 2) วงรอบการทำงาน Fetch-Decode-Execute-Writeback (FDEW Cycle)
CPU ทำงานตามลำดับรอบที่เรียกว่า **Instruction Cycle** วนซ้ำไปเรื่อย ๆ ดังนี้:

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>วงรอบ FDEW Cycle</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .box-stage { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 6px; transition: all 0.3s ease; }
    .path-flow { fill: none; stroke: #e2e8f0; stroke-width: 4; stroke-dasharray: 6 6; stroke-linecap: round; }
    .text-title { font-size: 16px; font-weight: bold; fill: #1e293b; }
    .text-stage-title { font-size: 14px; font-weight: bold; fill: #1e293b; }
    .text-stage-desc { font-size: 11px; fill: #475569; }
    .dot-flow { fill: #6366f1; stroke: #ffffff; stroke-width: 2; filter: drop-shadow(0 0 6px #6366f1); }
    
    .stage-fetch { animation: activeFetch 6s infinite; }
    .stage-decode { animation: activeDecode 6s infinite; }
    .stage-execute { animation: activeExecute 6s infinite; }
    .stage-writeback { animation: activeWriteback 6s infinite; }
    
    @keyframes activeFetch {
      0%, 25% { fill: #e0e7ff; stroke: #4f46e5; stroke-width: 2.5; filter: drop-shadow(0 0 8px rgba(79, 70, 229, 0.4)); }
      25.01%, 100% { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; filter: none; }
    }
    @keyframes activeDecode {
      0%, 25% { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; filter: none; }
      25.01%, 50% { fill: #f3e8ff; stroke: #a855f7; stroke-width: 2.5; filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.4)); }
      50.01%, 100% { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; filter: none; }
    }
    @keyframes activeExecute {
      0%, 50% { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; filter: none; }
      50.01%, 75% { fill: #ffe4e6; stroke: #f43f5e; stroke-width: 2.5; filter: drop-shadow(0 0 8px rgba(244, 63, 94, 0.4)); }
      75.01%, 100% { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; filter: none; }
    }
    @keyframes activeWriteback {
      0%, 75% { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; filter: none; }
      75.01%, 100% { fill: #ecfdf5; stroke: #059669; stroke-width: 2.5; filter: drop-shadow(0 0 8px rgba(5, 150, 105, 0.4)); }
    }
    @keyframes colorChangeDot {
      0%, 25% { fill: #4f46e5; }
      25.01%, 50% { fill: #a855f7; }
      50.01%, 75% { fill: #f43f5e; }
      75.01%, 100% { fill: #059669; }
    }
    .dot-animated { animation: colorChangeDot 6s infinite; }
  </style>
  
  <rect x="5" y="5" width="750" height="310" class="bg"/>
  <text x="380" y="30" class="text-title" text-anchor="middle">วงรอบการทำงานของ CPU (FDEW Cycle)</text>
  <text x="380" y="160" font-size="14px" font-weight="bold" fill="#64748b" text-anchor="middle">Instruction Cycle</text>
  <text x="380" y="180" font-size="11px" fill="#94a3b8" text-anchor="middle">ประมวลผลคำสั่งวนซ้ำทีละขั้นตอน</text>
  
  <path id="loopPath" d="M 380 65 Q 580 65 580 160 Q 580 255 380 255 Q 180 255 180 160 Q 180 65 380 65" class="path-flow"/>
  
  <g transform="translate(290, 35)">
    <rect x="0" y="0" width="180" height="60" class="box-stage stage-fetch"/>
    <text x="90" y="24" class="text-stage-title" text-anchor="middle">1. Fetch (ดึงคำสั่ง)</text>
    <text x="90" y="44" class="text-stage-desc" text-anchor="middle">ดึงคำสั่งจาก Flash/RAM ชี้โดย PC</text>
  </g>
  
  <g transform="translate(490, 130)">
    <rect x="0" y="0" width="180" height="60" class="box-stage stage-decode"/>
    <text x="90" y="24" class="text-stage-title" text-anchor="middle">2. Decode (ถอดรหัส)</text>
    <text x="90" y="44" class="text-stage-desc" text-anchor="middle">แปลงรหัส Opcode เพื่อสั่งการระบบ</text>
  </g>
  
  <g transform="translate(290, 225)">
    <rect x="0" y="0" width="180" height="60" class="box-stage stage-execute"/>
    <text x="90" y="24" class="text-stage-title" text-anchor="middle">3. Execute (ประมวลผล)</text>
    <text x="90" y="44" class="text-stage-desc" text-anchor="middle">สั่ง ALU คำนวณหรือเปรียบเทียบข้อมูล</text>
  </g>
  
  <g transform="translate(90, 130)">
    <rect x="0" y="0" width="180" height="60" class="box-stage stage-writeback"/>
    <text x="90" y="24" class="text-stage-title" text-anchor="middle">4. Writeback (เขียนกลับ)</text>
    <text x="90" y="44" class="text-stage-desc" text-anchor="middle">บันทึกผลลัพธ์ลง Register / RAM</text>
  </g>
  
  <circle r="8" class="dot-flow dot-animated">
    <animateMotion dur="6s" repeatCount="indefinite">
      <mpath href="#loopPath"/>
    </animateMotion>
  </circle>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 4.3 วงจรขั้นตอน FDEW ดำเนินการต่อเนื่องทีละคำสั่ง (ทำงานร่วมกับระบบ Pipeline ในชิปสมัยใหม่)</div>
</div>

- **Pipelining (การทำไปป์ไลน์):** เพื่อเร่งความเร็วในการทำงาน CPU สมัยใหม่จะใช้วิธี **Pipelining** ซึ่งแบ่งส่วนทำงาน FDEW ออกเป็นขั้นตอนย่อยและรันแบบขนานกัน (Overlap) เสมือนสายพานโรงงาน ตัวอย่างเช่น ขณะที่กำลัง Execute คำสั่งแรก CPU จะก้าวไป Decode คำสั่งที่สอง และ Fetch คำสั่งที่สามพร้อมกัน ทำให้สามารถทำยอดการรันคำสั่งได้เกือบ 1 คำสั่งต่อ 1 รอบสัญญาณนาฬิกา (1 Instruction Per Cycle - IPC)

---

#### 4.1.4 ระบบสัญญาณนาฬิกาและตัวหารความถี่ (Clock Systems & Prescalers)

- **แหล่งกำเนิดสัญญาณนาฬิกา (Clock Sources):**
  - **Crystal Oscillator (คริสตัลภายนอก):** มีความเสถียรและแม่นยำสูงมาก (เช่น 40 MHz ใน ESP32) มักใช้ในงานที่ต้องการความแม่นยำทางเวลา เช่น การสื่อสารไร้สายหรือพอร์ตอนุกรม
  - **Internal RC Oscillator (วงจรความถี่ภายใน):** สร้างความถี่โดยอาศัยตัวเก็บประจุและตัวต้านทานภายในชิป มีราคาถูกและบูตเร็ว แต่ความแม่นยำต่ำและแปรผันตามอุณหภูมิ มักใช้ช่วงเปิดเครื่องหรือในโหมดประหยัดพลังงาน (Deep Sleep)
- **Phase-Locked Loop (PLL):** วงจรภายในชิปที่ใช้เพิ่มความถี่ (Frequency Multiplier) จากคริสตัลภายนอก ตัวอย่างเช่น รับความถี่ 40 MHz จากคริสตัลแล้วคูณขึ้นไปเป็น 240 MHz เพื่อให้ CPU ทำงานได้เต็มประสิทธิภาพ
- **ตัวหารความถี่ (Prescaler):** เนื่องจากโมดูลเชื่อมต่ออุปกรณ์ต่อพ่วง (Peripherals) เช่น Timer, ADC, I2C ไม่จำเป็นต้องทำงานเร็วเท่า CPU (และทำงานที่ความถี่สูงอาจทำให้อุปกรณ์ร้อนหรือกินไฟเกินความจำเป็น) Prescaler จะรับสัญญาณนาฬิกาหลักมาหารด้วยตัวเลขจำลองค่าคงที่ (เช่น หารด้วย 2, 4, 8, ... 256) เพื่อสร้างความถี่ที่เหมาะสมให้แก่อุปกรณ์ปลายทาง

#### 4.1.5 องค์ประกอบหลักของไมโครคอนโทรลเลอร์

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>ส่วนประกอบหลักของไมโครคอนโทรลเลอร์ (MCU)</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 10px; }
    .box-cpu { fill: #e0e7ff; stroke: #4f46e5; stroke-width: 1.5; rx: 6px; }
    .box-mem { fill: #e6f4ea; stroke: #137333; stroke-width: 1.5; rx: 6px; }
    .box-peri { fill: #fff7ed; stroke: #c2410c; stroke-width: 1.5; rx: 6px; }
    .bus-main { fill: none; stroke: #334155; stroke-width: 8; stroke-linecap: round; }
    .bus-glow { fill: none; stroke: #3b82f6; stroke-width: 8; stroke-linecap: round; opacity: 0.3; animation: busPulse 2s infinite alternate; }
    .bus-conn { fill: none; stroke: #64748b; stroke-width: 3; }
    .text-title { font-size: 16px; font-weight: bold; fill: #1e293b; }
    .text-node { font-size: 13px; font-weight: bold; fill: #0f172a; }
    .text-desc { font-size: 10px; fill: #475569; }
    
    .pulse-dot { fill: #60a5fa; stroke: #ffffff; stroke-width: 1.5; filter: drop-shadow(0 0 4px #3b82f6); }
    
    @keyframes busPulse {
      0% { opacity: 0.15; stroke: #3b82f6; }
      100% { opacity: 0.65; stroke: #06b6d4; }
    }
  </style>
  
  <rect x="5" y="5" width="750" height="310" class="bg"/>
  <text x="380" y="25" class="text-title" text-anchor="middle">ส่วนประกอบระดับบล็อกภายในของไมโครคอนโทรลเลอร์ (MCU)</text>
  
  <path id="pathCpuToRam" d="M 100 105 L 100 160 L 240 160 L 240 105" fill="none"/>
  <path id="pathCpuToGpio" d="M 100 105 L 100 160 L 100 215" fill="none"/>
  <path id="pathCpuToFlash" d="M 100 105 L 100 160 L 380 160 L 380 105" fill="none"/>
  <path id="pathCpuToSpi" d="M 100 105 L 100 160 L 520 160 L 520 215" fill="none"/>
  <path id="pathCpuToWifi" d="M 100 105 L 100 160 L 660 160 L 660 215" fill="none"/>
  
  <line x1="100" y1="105" x2="100" y2="215" class="bus-conn"/>
  <line x1="240" y1="105" x2="240" y2="215" class="bus-conn"/>
  <line x1="380" y1="105" x2="380" y2="215" class="bus-conn"/>
  <line x1="520" y1="105" x2="520" y2="215" class="bus-conn"/>
  <line x1="660" y1="105" x2="660" y2="215" class="bus-conn"/>
  
  <line x1="80" y1="160" x2="680" y2="160" class="bus-main"/>
  <line x1="80" y1="160" x2="680" y2="160" class="bus-glow"/>
  <text x="380" y="152" font-size="11px" font-weight="bold" fill="#ffffff" text-anchor="middle">Internal System Bus (บัสระบบภายใน)</text>
  
  <g transform="translate(45, 45)">
    <rect x="0" y="0" width="110" height="60" class="box-cpu"/>
    <text x="55" y="25" class="text-node" text-anchor="middle">CPU Core</text>
    <text x="55" y="40" class="text-desc" text-anchor="middle">หน่วยประมวลผล</text>
    <text x="55" y="52" class="text-desc" text-anchor="middle">(Xtensa LX6)</text>
  </g>
  
  <g transform="translate(185, 45)">
    <rect x="0" y="0" width="110" height="60" class="box-mem"/>
    <text x="55" y="25" class="text-node" text-anchor="middle">RAM (SRAM)</text>
    <text x="55" y="40" class="text-desc" text-anchor="middle">เก็บข้อมูลชั่วคราว</text>
    <text x="55" y="52" class="text-desc" text-anchor="middle">(520 KB)</text>
  </g>
  
  <g transform="translate(325, 45)">
    <rect x="0" y="0" width="110" height="60" class="box-mem"/>
    <text x="55" y="25" class="text-node" text-anchor="middle">Flash Memory</text>
    <text x="55" y="40" class="text-desc" text-anchor="middle">เก็บเฟิร์มแวร์ / โค้ด</text>
    <text x="55" y="52" class="text-desc" text-anchor="middle">(4 MB SPI)</text>
  </g>
  
  <g transform="translate(465, 45)">
    <rect x="0" y="0" width="110" height="60" class="box-peri"/>
    <text x="55" y="25" class="text-node" text-anchor="middle">Timer/Counter</text>
    <text x="55" y="40" class="text-desc" text-anchor="middle">จับเวลา / สร้าง PWM</text>
    <text x="55" y="52" class="text-desc" text-anchor="middle">(16 channels)</text>
  </g>
  
  <g transform="translate(605, 45)">
    <rect x="0" y="0" width="110" height="60" class="box-peri"/>
    <text x="55" y="25" class="text-node" text-anchor="middle">ADC</text>
    <text x="55" y="40" class="text-desc" text-anchor="middle">แปลงแอนะล็อก → ดิจิทัล</text>
    <text x="55" y="52" class="text-desc" text-anchor="middle">(12-bit, 18 ch)</text>
  </g>
  
  <g transform="translate(45, 215)">
    <rect x="0" y="0" width="110" height="60" class="box-peri"/>
    <text x="55" y="25" class="text-node" text-anchor="middle">GPIO Pins</text>
    <text x="55" y="40" class="text-desc" text-anchor="middle">อินพุต/เอาต์พุตดิจิทัล</text>
    <text x="55" y="52" class="text-desc" text-anchor="middle">(ควบคุมพิน)</text>
  </g>
  
  <g transform="translate(185, 215)">
    <rect x="0" y="0" width="110" height="60" class="box-peri"/>
    <text x="55" y="25" class="text-node" text-anchor="middle">DAC</text>
    <text x="55" y="40" class="text-desc" text-anchor="middle">แปลงดิจิทัล → แอนะล็อก</text>
    <text x="55" y="52" class="text-desc" text-anchor="middle">(8-bit, 2 ch)</text>
  </g>
  
  <g transform="translate(325, 215)">
    <rect x="0" y="0" width="110" height="60" class="box-peri"/>
    <text x="55" y="25" class="text-node" text-anchor="middle">UART (Serial)</text>
    <text x="55" y="40" class="text-desc" text-anchor="middle">สื่อสารอนุกรมดีบั๊ก</text>
    <text x="55" y="52" class="text-desc" text-anchor="middle">(พอร์ตอนุกรม ×3)</text>
  </g>
  
  <g transform="translate(465, 215)">
    <rect x="0" y="0" width="110" height="60" class="box-peri"/>
    <text x="55" y="25" class="text-node" text-anchor="middle">SPI / I2C</text>
    <text x="55" y="40" class="text-desc" text-anchor="middle">เชื่อมต่อไอซี / เซ็นเซอร์</text>
    <text x="55" y="52" class="text-desc" text-anchor="middle">(บัสสื่อสารความเร็วสูง)</text>
  </g>
  
  <g transform="translate(605, 215)">
    <rect x="0" y="0" width="110" height="60" class="box-cpu"/>
    <text x="55" y="25" class="text-node" text-anchor="middle">Wi-Fi &amp; BT</text>
    <text x="55" y="40" class="text-desc" text-anchor="middle">สื่อสารไร้สายความถี่สูง</text>
    <text x="55" y="52" class="text-desc" text-anchor="middle">(2.4 GHz + BLE)</text>
  </g>
  
  <circle r="4" class="pulse-dot">
    <animateMotion dur="2.4s" repeatCount="indefinite">
      <mpath href="#pathCpuToRam"/>
    </animateMotion>
  </circle>
  
  <circle r="4" class="pulse-dot" opacity="0.8">
    <animateMotion dur="1.8s" begin="0.5s" repeatCount="indefinite">
      <mpath href="#pathCpuToGpio"/>
    </animateMotion>
  </circle>
  
  <circle r="4" class="pulse-dot" opacity="0.9">
    <animateMotion dur="3s" begin="0.2s" repeatCount="indefinite">
      <mpath href="#pathCpuToFlash"/>
    </animateMotion>
  </circle>
  
  <circle r="4" class="pulse-dot" opacity="0.75">
    <animateMotion dur="2.2s" begin="0.8s" repeatCount="indefinite">
      <mpath href="#pathCpuToSpi"/>
    </animateMotion>
  </circle>
  
  <circle r="4" class="pulse-dot" opacity="0.6">
    <animateMotion dur="2.8s" begin="1.2s" repeatCount="indefinite">
      <mpath href="#pathCpuToWifi"/>
    </animateMotion>
  </circle>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 4.4 โครงสร้างส่วนประกอบในระบบชิปเดี่ยว (SoC) ที่แชร์ข้อมูลร่วมกันผ่านระบบบัสภายในของ MCU</div>
</div>

- **CPU** — หน่วยประมวลผลกลาง ทำหน้าที่คำนวณและตัดสินใจ
- **RAM** — หน่วยความจำชั่วคราว เก็บข้อมูลขณะทำงาน (หายเมื่อปิดไฟ)
- **Flash Memory** — เก็บโปรแกรม (ไม่หายเมื่อปิดไฟ)
- **GPIO (General Purpose I/O)** — ขาเชื่อมต่อกับอุปกรณ์ภายนอก
- **Timer/Counter** — ตัวจับเวลาและตัวนับ ใช้สร้างสัญญาณ PWM หรือจับเวลาเหตุการณ์
- **ADC/DAC** — แปลงสัญญาณอะนาล็อก ↔ ดิจิทัล

---

### 4.2 รู้จัก ESP32

**ESP32** เป็นไมโครคอนโทรลเลอร์จากบริษัท Espressif Systems (จีน) ที่ได้รับความนิยมสูงมากในงาน IoT เนื่องจากมี **Wi-Fi และ Bluetooth ในตัว** ราคาถูก และประสิทธิภาพสูง

#### 4.2.1 สเปกของ ESP32-WROOM-32

- **Wi-Fi 802.11 b/g/n** ในตัว — เชื่อมต่ออินเทอร์เน็ตได้เลยโดยไม่ต้องใช้โมดูลเพิ่ม
- **Bluetooth 4.2 / BLE** ในตัว — สื่อสารกับสมาร์ตโฟนหรืออุปกรณ์ BLE ได้
- **Dual-core** Xtensa LX6 — ประมวลผลสองแกนพร้อมกัน
- **ราคาถูก** — บอร์ด ESP32 DevKit เริ่มต้นประมาณ ฿100–฿200
- **รองรับ Arduino Framework** — เขียนโปรแกรมง่ายเหมือน Arduino ทั่วไป

| คุณสมบัติ | รายละเอียด |
|---|---|
| CPU | Xtensa LX6 Dual-core, สูงสุด 240 MHz |
| RAM | 520 KB SRAM |
| Flash | 4 MB (ภายนอกบนโมดูล) |
| Wi-Fi | 802.11 b/g/n, 2.4 GHz |
| Bluetooth | v4.2 BR/EDR + BLE |
| GPIO | สูงสุด 34 ขา |
| ADC | 18 ช่อง (12-bit) |
| DAC | 2 ช่อง (8-bit) |
| PWM | 16 ช่อง (LED Control) |
| Touch Sensor | 10 ช่อง |
| อินเทอร์เฟซ | SPI ×4, I2C ×2, UART ×3, I2S ×2 |
| แรงดันทำงาน | 3.3 V |
| แรงดันจ่ายผ่าน USB | 5 V (ผ่านตัวควบคุมแรงดันบนบอร์ด) |

> 💡 **ข้อควรระวัง:** ESP32 ทำงานที่แรงดัน **3.3 V** ห้ามต่อสัญญาณ 5 V เข้าขา GPIO โดยตรง อาจทำให้ชิปเสียหายได้

---

#### 4.2.2 เจาะลึกฮาร์ดแวร์ ESP32: Dual-core Xtensa LX6

ESP32 (รุ่น WROOM-32) ใช้ตัวประมวลผลกลางสถาปัตยกรรม **Xtensa LX6** จาก Tensilica ขนาด 32 บิต จำนวน 2 แกนหลัก (Dual-core) ทำงานขนานกันภายใต้สถาปัตยกรรมระบบประมวลผลหลายตัวแบบสมมาตร (Symmetric Multiprocessing — SMP) ร่วมกับระบบปฏิบัติการเวลาจริง FreeRTOS 

##### 1) โครงสร้างสถาปัตยกรรมภายในหน่วยประมวลผล (Xtensa LX6 Microarchitecture)
- **สถาปัตยกรรมบัสและไปป์ไลน์ (Bus & Pipeline):** ตัวประมวลผล LX6 ใช้สถาปัตยกรรมแบบ Harvard ขนาด 32 บิต (แยกบัสข้อมูลและบัสคำสั่งชัดเจน) โดยมีสายพานการประมวลผล (Instruction Pipeline) ขนาด **7 ขั้นตอน (7-stage pipeline)** ทำให้สามารถประมวลผลคำสั่งส่วนใหญ่ได้เสร็จสิ้นใน 1 รอบสัญญาณนาฬิกา
- **สไลด์หน้าต่างรีจิสเตอร์ (Register Windowing):** LX6 แก้ปัญหา Overhead ในการผลักข้อมูลเข้า/ออกสแต็ก (Push/Pop) ขณะเรียกฟังก์ชันโดยใช้กลไก Register Windowing ซึ่งมีรีจิสเตอร์กายภาพภายในถึง 64 ตัว แต่จะเปิดแอปพลิเคชันให้มองเห็นครั้งละ 16 ตัว (`a0` ถึง `a15`) เมื่อเรียกฟังก์ชัน หน้าต่างนี้จะสไลด์เลื่อนตัวแปรไปโดยอัตโนมัติ ทำให้การสลับฟังก์ชันและการเข้าโปรแกรมบริการขัดจังหวะ (Interrupt Service Routine — ISR) ทำได้เร็วมากในระดับสัญญาณนาฬิกาไม่กี่รอบ
- **หน่วยประมวลผลทางคณิตศาสตร์พิเศษ:**
  - **FPU (Floating Point Unit):** รองรับการคำนวณทศนิยมแบบความละเอียดเดี่ยว (Single-precision float) บนฮาร์ดแวร์โดยตรง เหมาะสำหรับการคำนวณสัญญาณไฟฟ้าและการประมวลผลสัญญาณดิจิทัล (DSP)
  - **MAC (Multiply-Accumulate):** สนับสนุนคำสั่งคูณและสะสมค่าใน 1 รอบสัญญาณนาฬิกา ช่วยอำนวยความสะดวกให้งานปัญญาประดิษฐ์ขนาดเล็กและการกรองสัญญาณเชิงตัวเลข (TinyML / Digital Filters)

##### 2) หน่วยประมวลผลร่วมประหยัดพลังงานพิเศษ (ULP Coprocessor)
นอกเหนือจากแกนประมวลผลหลัก 2 แกนแล้ว ESP32 ยังรวมเอาหน่วยประมวลผลร่วม **ULP (Ultra Low Power) Coprocessor** ขนาดเล็กไว้อีก 1 ตัว:
- **กลไกทำงาน:** ULP เป็นตัวประมวลผลแบบ RISC สถาปัตยกรรมเรียบง่าย ทำงานแยกจากแกนหลัก โดยมีความถี่สัญญาณนาฬิกาต่ำ (มักขับเคลื่อนโดย internal 8 MHz RC oscillator) และเข้าถึงได้เฉพาะรีจิสเตอร์พื้นฐานกับพื้นที่หน่วยความจำ RTC Slow Memory เท่านั้น
- **การประหยัดพลังงาน:** ในโหมดนอนหลับลึก (Deep Sleep) แกนหลัก Xtensa LX6 ทั้งคู่จะปิดการทำงานลงทั้งหมดเพื่อประหยัดไฟ แต่ ULP จะยังทำงานอยู่เพื่อตรวจสอบสถานะของ GPIO อ่านค่าเซ็นเซอร์แอนะล็อกผ่านโมดูล ADC หรือสื่อสารผ่าน I2C/SPI เมื่อตรวจสอบพบค่าข้อมูลสัมผัสเกณฑ์ปลอดภัยที่วิศวกรกำหนด ULP จะส่งสัญญาณอินเทอร์รัปต์ปลุก (Wake-up) ให้แกนหลักทั้งคู่ตื่นขึ้นมาทำงานประมวลผลขนาดใหญ่ต่อไป วิธีนี้ช่วยลดระดับกระแสไฟฟ้าเหลือเพียง **10–15 µA** ซึ่งยืดอายุการใช้งานอุปกรณ์จากแบตเตอรี่ได้นานหลายปี

##### 3) การทำงานแบบ SMP vs AMP ใน FreeRTOS
การทำงานแบบมัลติคอร์ของ ESP32 ได้รับการปรับแต่งให้อยู่ในโหมด **SMP (Symmetric Multiprocessing)**:
- **Symmetric Multiprocessing (SMP):** ตัวประมวลผลทั้งสองแกน (PRO_CPU และ APP_CPU) จะแชร์หน่วยความจำและตัวควบคุมแคชร่วมกันอย่างสมบูรณ์ โดยรันระบบปฏิบัติการ FreeRTOS เพียงชุดเดียว (Single OS instance) ซึ่งตัวจัดตารางงาน (Scheduler) ของ FreeRTOS จะคอยสลับและกระจายทาสก์ของระบบและผู้ใช้ให้รันบนแกนที่มีสเปกความเร็วและทรัพยากรว่างอยู่โดยอัตโนมัติ
- **Asymmetric Multiprocessing (AMP):** แตกต่างจากโหมด AMP ที่แต่ละแกนจะรันระบบปฏิบัติการของตัวเองแยกจากกัน (เช่น แกนหนึ่งรัน Linux อีกแกนรัน Bare-metal) ซึ่งทำให้การสื่อสารและการป้องกันการเข้าถึงหน่วยความจำชนกันของทั้งสองแกนมีความยับยั้งยากและท้าทายในวิศวกรรมระดับล่าง
- **การจัดการบทบาทสองแกนบน ESP32:**
  - **PRO_CPU (Protocol CPU / Core 0):** ทำหน้าที่ประมวลผลโปรโตคอลระบบต่ำ เช่น โครงสร้างสแต็กของ Wi-Fi, Bluetooth และระบบความปลอดภัย เพื่อป้องกันไม่ให้โหลดงานเครือข่ายขัดจังหวะการควบคุมอุปกรณ์
  - **APP_CPU (Application CPU / Core 1):** ทำหน้าที่ประมวลผลโค้ดแอปพลิเคชันหลักของผู้ใช้งาน ใน Arduino Framework ฟังก์ชัน `setup()` และ `loop()` จะถูกคอมไพล์และตั้งค่าเริ่มต้นให้รันอยู่บน Core 1 เสมอ

#### ตัวอย่างการใช้งาน Multitasking ด้วยการพินงานเข้ากับ Core (Task Pinning)
ภายใต้ระบบปฏิบัติการ FreeRTOS เราสามารถแยกโปรแกรมออกเป็น Tasks และระบุ Core ที่ต้องการให้รันได้ผ่านคำสั่ง `xTaskCreatePinnedToCore()`:

```cpp
// ฟังก์ชันของ Task ที่ต้องการรันบน Core 0
void TaskOnCore0(void *pvParameters) {
    (void) pvParameters;
    
    Serial.print("Task Core 0 is running on core: ");
    Serial.println(xPortGetCoreID()); // จะได้ผลลัพธ์เป็น 0
    
    for (;;) {
        // ทำงานประมวลผลที่ต้องการความเร็วสูงหรือแยกส่วน
        // เช่น การดึงข้อมูลด่วนจากเซ็นเซอร์หรือวิเคราะห์ข้อมูล
        vTaskDelay(pdMS_TO_TICKS(1000)); // หยุดรอ 1 วินาทีแบบไม่บล็อก CPU
    }
}

void setup() {
    Serial.begin(115200);
    
    // สร้าง Task และพินเข้ากับ Core 0 (PRO_CPU)
    xTaskCreatePinnedToCore(
        TaskOnCore0,     // ฟังก์ชันงาน
        "Task_Core0",    // ชื่ออ้างอิง Task
        2048,            // ขนาด Stack (คำนวณเป็นหน่วย Words)
        NULL,            // พารามิเตอร์ส่งเข้าฟังก์ชัน
        1,               // ระดับความสำคัญ (Priority) 
        NULL,            // ตัวแปรเก็บ Handle ของ Task
        0                // เลือกพินเข้า Core 0 (ถ้าต้องการ Core 1 ให้ใส่ 1)
    );
}

void loop() {
    // โค้ดหลักใน loop() จะถูกรันบน Core 1 (APP_CPU) เสมอ
    Serial.print("Arduino loop() is running on core: ");
    Serial.println(xPortGetCoreID()); // จะได้ผลลัพธ์เป็น 1
    delay(2000);
}
```

---

#### 4.2.3 แผนผังหน่วยความจำภายในและการแคชหน่วยความจำภายนอก (Memory Mapping & Cache)

ESP32 จัดสรรพื้นที่แอดเดรสของหน่วยความจำทั้งหมดผ่านโครงสร้างพื้นที่แอดเดรสขนาด 32 บิต (4 GB Address Space) โดยมีหน่วยความจำภายในขนาด 520 KB SRAM และเข้าถึงอุปกรณ์ภายนอกผ่าน Memory Management Unit (MMU) ดังรายละเอียด:

##### 1) แผนผังหน่วยความจำภายใน (Internal Memory Mapping)
- **SRAM 0 (ขนาด 192 KB / แอดเดรส `0x40070000` ถึง `0x4009FFFF`):** ทำหน้าที่เป็น **Instruction RAM (IRAM)** ซึ่งเป็นหน่วยความจำที่ CPU ใช้เก็บส่วนของคำสั่ง/โค้ดโปรแกรมที่ต้องการเข้าถึงแบบรวดเร็วระดับสัญญาณนาฬิกา เช่น รหัสโปรแกรม Interrupt Service Routines (ISR) หรือรูทีนหลักของ FreeRTOS
- **SRAM 1 (ขนาด 128 KB / แอดเดรส `0x3FFE0000` ถึง `0x3FFFFFFF`):** หน่วยความจำอเนกประสงค์ที่สามารถเข้าถึงได้ทั้งเป็น IRAM หรือ Data RAM (DRAM) บ่อยครั้งถูกจองไว้สำหรับเป็นบัฟเฟอร์การรับส่งข้อมูลของโมดูลเครือข่ายและใช้งานกลไก DMA (Direct Memory Access) จาก Peripherals โดยไม่ต้องผ่านคอขวด CPU
- **SRAM 2 (ขนาด 200 KB / แอดเดรส `0x3FFAE000` ถึง `0x3FFDFFFF`):** ทำหน้าที่เป็น **Data RAM (DRAM)** เป็นหลัก ใช้เก็บตัวแปรโกลบอล (Global variables) เก็บข้อมูลสแต็ก (Stack) ของแต่ละทาสก์ และเป็นพื้นที่ฮีป (Heap) สำหรับตัวแปรที่มีการจองพื้นที่แบบพลวัต (Dynamic memory allocation เช่น คำสั่ง `malloc()` หรือ `new`)
- **Internal ROM (ขนาด 448 KB / แอดเดรส `0x40000000` เป็นต้นไป):** บันทึกโค้ดแบบอ่านอย่างเดียวที่ไม่สามารถแก้ไขได้มาตั้งแต่โรงงาน ประกอบด้วยโปรแกรมบูตโหลดเดอร์ขั้นแรก (ROM Bootloader), ตารางไลบรารีระบบปฏิบัติการ FreeRTOS, ไลบรารีคณิตศาสตร์ และอัลกอริทึมเข้ารหัส (Cryptographic APIs)
- **RTC Memory:** หน่วยความจำพิเศษบนโมดูลเวลาจริงที่ยังคงมีไฟเลี้ยงขณะปิดแกนหลัก:
  - **RTC Fast Memory (ขนาด 8 KB):** ใช้เก็บส่วนของโปรแกรมรันสัญญาณเปิดระบบเบื้องต้นขณะตื่นจาก Deep Sleep
  - **RTC Slow Memory (ขนาด 8 KB):** ใช้เก็บตัวแปรข้อมูลของ ULP Coprocessor ในช่วง Deep Sleep

##### 2) การเข้าถึง Flash Memory และ PSRAM ภายนอกผ่าน MMU และ Cache
เนื่องจากตัวโปรแกรมหลักของผู้ใช้งานและข้อมูลคงที่มักเก็บอยู่ใน Flash Memory ภายนอกชิป (เช่น 4 MB ผ่านการต่อแบบ SPI) ซึ่งมีความเร็วต่ำกว่า SRAM ภายในชิปมาก:
- **Virtual Mapping via MMU:** ESP32 ใช้หน่วยจัดการหน่วยความจำ **MMU (Memory Management Unit)** ในการแมปแอดเดรสเสมือนของ CPU ไปยังพื้นที่ใน Flash หรือหน่วยความจำสแตติกภายนอก (PSRAM)
  - **DROM (Data ROM Mapped):** พื้นที่แอดเดรสช่วง `0x3F400000` ถึง `0x3F800000` (ขนาดสูงสุด 4 MB) ถูกแมปเข้าหา Flash ภายนอกเพื่อให้โปรแกรมสามารถอ่านข้อมูลค่าคงที่ (Constant Data) เสมือนอ่านจาก RAM ปกติ
  - **IROM (Instruction ROM Mapped):** พื้นที่แอดเดรสช่วง `0x400D0000` ถึง `0x40400000` (ขนาดสูงสุด 3.2 MB) ถูกแมปเข้าหา Flash ภายนอกเพื่อให้ CPU สามารถดึงโค้ดโปรแกรมหลักมาประมวลผลได้โดยตรง
- **ระบบ Cache สองระดับ:** เพื่อป้องกันปัญหาหน่วงเวลาในการอ่าน Flash ภายนอก ESP32 จะแบ่งหน่วยความจำขนาด **32 KB** ใน SRAM0 ออกมาเป็น Cache ประจำแต่ละแกน CPU โดยใช้กลไกการดึงคำสั่งล่วงหน้า (Pre-fetch) หากเกิดสถานะ Cache Hit ตัว CPU จะประมวลผลได้รวดเร็วเทียบเท่าการดึงข้อมูลผ่าน SRAM ภายในชิปโดยตรง

---

#### 4.2.4 กระบวนการบูตระบบ (ESP32 Bootloader Process)

เมื่อปล่อยสัญญาณรีเซ็ตหรือเปิดเครื่อง (Power-on Reset — POR) บอร์ด ESP32 จะดำเนินกระบวนการเริ่มต้นระบบผ่านขั้นตอนที่เป็นลำดับขั้น (Multi-stage Boot) ดังนี้:

```
[ Power-On Reset ]
       │
       ▼
┌─────────────────────────────────┐
│     Stage 1: ROM Bootloader     │  <-- ฝังในชิป อ่านจาก ROM
│ - เช็กระดับแรงดันและแหล่งจ่ายไฟ  │
│ - อ่านขาสัญญาณ Strapping Pins    │
│ - บูตเข้า UART หรือ SPI Flash   │
└──────────────┬──────────────────┘
               │ (โหมดปกติ: SPI Boot)
               ▼
┌─────────────────────────────────┐
│   Stage 2: 2nd Stage Bootloader │  <-- อ่านจาก Flash Offset 0x1000
│ - กำหนดค่า Clock / Cache / MMU  │
│ - ตรวจสอบตารางพาร์ทิชัน (0x8000) │
│ - โหลด App Binary เข้าสู่ SRAM   │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Stage 3: Application Startup  │  <-- รันโค้ดผู้ใช้งาน
│ - รัน entry point (call_start)  │
│ - เคลียร์ BSS และจองฮีประบบ     │
│ - เริ่มระบบ FreeRTOS (Core 0/1) │
│ - เรียกใช้ setup() และ loop()   │
└─────────────────────────────────┘
```

##### ขั้นตอนที่ 1: ROM Bootloader (Stage 1 Bootloader)
- **ตำแหน่งโค้ด:** โค้ดส่วนนี้ถูกโปรแกรมลงใน Internal ROM ตั้งแต่วงจรพิมพ์ชิป ไม่สามารถแก้ไขหรือเขียนทับได้
- **การทำงาน:** เมื่อเริ่มจ่ายไฟ วงจรจะเริ่มต้นพินหลักและระบบสัญญาณนาฬิกาพื้นฐาน จากนั้นจะเข้าไปตรวจสอบระดับลอจิก (HIGH/LOW) ของพินกำหนดโหมดบูต (**Strapping Pins** ได้แก่ GPIO 0, 2, 5, 12, 15)
  - หากพบพินอยู่ในสถานะอัปโหลด (เช่น GPIO 0 = LOW) ชิปจะเปิดใช้งานโหมดดาวน์โหลดโปรแกรมผ่าน UART0 เพื่อรอรับไฟล์เฟิร์มแวร์ใหม่
  - หากพบพินอยู่ในสถานะทำงานปกติ (เช่น GPIO 0 = HIGH) ชิปจะค้นหาชิป SPI Flash ภายนอก ทำการเปิดใช้งานและเข้าไปโหลดโปรแกรมดาวน์โหลดขั้นที่สอง (2nd Stage Bootloader) ซึ่งถูกบันทึกไว้ที่แอดเดรส **Offset `0x1000`** ใน Flash นำไปพักไว้ใน SRAM 0 จากนั้นจะย้ายการควบคุม (Jump) ไปรันที่โค้ดตัวนี้

##### ขั้นตอนที่ 2: Software Bootloader (2nd Stage Bootloader)
- **ตำแหน่งโค้ด:** เป็นไฟล์โค้ดของซอฟต์แวร์ระบบที่คอมไพล์รวมกับ SDK (ESP-IDF) และจัดเตรียมเก็บไว้ในพาร์ทิชันเริ่มต้นของ Flash Memory
- **การทำงาน:** บูตโหลดเดอร์ตัวนี้จะขยายขีดความสามารถการเริ่มต้นระบบ:
  - กำหนดค่าและปรับความถี่สัญญาณนาฬิกาหลักของ CPU (ผ่านการตั้งค่า PLL)
  - ตรวจสอบและตั้งค่าโมดูลหน่วยความจำภายนอก (เช่น เปิดใช้ PSRAM หากบอร์ดเชื่อมต่อไว้)
  - กำหนดค่าและเปิดการทำงาน MMU Cache เพื่อเตรียมแมป IROM และ DROM
  - เปิดอ่านตารางแบ่งพาร์ทิชันหน่วยความจำ (**Partition Table** บันทึกอยู่ที่แอดเดรส **Offset `0x8000`**) เพื่อตรวจสอบพาร์ทิชันที่เปิดแอคทีฟอยู่ในระบบ (เช่น เลือกแอปพลิเคชันเวอร์ชัน Factory หรือตรวจเลือก OTA Partition กรณีอัปเดตซอฟต์แวร์ทางอากาศ)
  - โหลดส่วนหัวของแอปพลิเคชัน (Application Binary) จาก Flash แล้วส่งเซกเมนต์ต่างๆ ของโปรแกรมผู้ใช้ลงไปเก็บยังหน่วยความจำ SRAM และ IRAM
  - ย้ายตัวชี้คำสั่ง Jump ไปยังแอดเดรสฟังก์ชันเริ่มต้นของแอปพลิเคชันหลัก (`call_start_cpu0`)

##### ขั้นตอนที่ 3: Application Start & FreeRTOS Initialization (Stage 3)
- **ตำแหน่งโค้ด:** เป็นส่วนของโค้ดสตาร์ตอัพในเฟิร์มแวร์ของผู้ใช้งาน
- **การทำงาน:** 
  - ฟังก์ชัน `call_start_cpu0` จะเคลียร์พื้นที่หน่วยความจำ BSS (เคลียร์ตัวแปรไม่มีค่าเริ่มต้นให้เป็น 0) และสำรวจขนาดของ SRAM2 เพื่อจัดตั้งเป็นกองหน่วยความจำส่วนกลาง (System Heap)
  - ตั้งค่าเวกเตอร์ขัดจังหวะ (Interrupt Vector Table) ของทั้งแกน CPU 0 และ CPU 1
  - สตาร์ตระบบจัดตารางงาน FreeRTOS บนแกน CPU 0 (PRO_CPU) จากนั้นจะส่งสัญญาณขัดจังหวะระหว่างคอร์ (Inter-processor Interrupt — IPI) เพื่อปลุกแกน CPU 1 (APP_CPU) ให้เริ่มทำงานขนานกัน
  - ตัว FreeRTOS Scheduler บนแกน CPU 1 จะสร้างงานหลักชื่อ `loopTask` ซึ่งภายในทาสก์นี้จะเข้าไปเรียกใช้ฟังก์ชัน `setup()` ของผู้ใช้งานเพื่อกำหนดทิศทางวงจร และเข้าสู่ลูปทำงานวนซ้ำอย่างถาวรในฟังก์ชัน `loop()` เสมือนเป็นเบสโปรแกรมหลัก

---

#### 4.2.5 ขากำหนดโหมดการบูตเริ่มต้น (Boot Strapping Pins)

ESP32 จะตรวจสอบสถานะทางไฟฟ้า (HIGH/LOW) ของพินจำนวน 5 พินในจังหวะเริ่มปล่อยสัญญาณรีเซ็ต (Reset / Power-on Reset) เพื่อเลือกโหมดในการบูตระบบ ขาเหล่านี้เรียกว่า **Strapping Pins**:

#### ตารางการกำหนดโหมดบูต (ESP32 Strapping State Table)

| ขา (Pin) | ชื่อพินระบบ | สถานะภายในชิป (Default) | โหมดทำงานปกติ (SPI Boot) | โหมดอัปโหลดโปรแกรม (UART Boot) | ผลกระทบ/ข้อควรระวังทางวิศวกรรม |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **GPIO 0** | GPIO0 | Pull-up | HIGH (หรือปล่อยลอย) | **LOW** | หากเชื่อมต่อปุ่มกดหรือวงจรภายนอกที่ดึงพินนี้ลง LOW ขณะเปิดเครื่อง ชิปจะค้างที่โหมดอัปโหลดโปรแกรมและไม่รันแอปพลิเคชันปกติ |
| **GPIO 2** | GPIO2 | Pull-down | LOW (หรือปล่อยลอย) | **LOW** | ต้องเป็น LOW หรือลอยอยู่ขณะบูตคู่กับ GPIO 0 = LOW เพื่อเข้าโหมดอัปโหลด หากต่อไฟสูง HIGH ค้างไว้ตอนบูต ชิปจะไม่ยอมเข้าสู่โหมดดาวน์โหลดโปรแกรม |
| **GPIO 5** | GPIO5 | Pull-up | HIGH (หรือปล่อยลอย) | Don't Care | ใช้ควบคุมความถี่สัญญาณนาฬิกาของวงจร SDIO Slave ตอนบูต ไม่ควรต่อวงจรภายนอกดึงลง LOW ช่วงบูตเพราะอาจส่งผลให้ชิปเริ่มต้นระบบล้มเหลว |
| **GPIO 12** | MTDI | Pull-down | **LOW** (3.3V Flash) | Don't Care | **เตือนอันตรายระดับสูง:** ใช้เลือกระดับแรงดันไฟเลี้ยงตัว SPI Flash ภายนอก โดย **LOW = 3.3V** และ **HIGH = 1.8V** เนื่องจากโมดูล ESP32 ทั่วไปใช้ Flash 3.3V หากต่อเซ็นเซอร์/ตัวต้านทานภายนอกที่ดึงพินนี้ขึ้น HIGH ตอนเริ่มเครื่อง ชิปจะส่งแรงดันไฟฟ้าให้ Flash เพียง 1.8V ส่งผลให้ Flash ทำงานไม่ได้และเกิดอาการ **Boot Loop (flash read err)** ค้างอยู่ตลอดเวลา |
| **GPIO 15** | MTDO | Pull-up | HIGH | Don't Care | ควบคุมการส่งข้อมูลดีบั๊กของเฟิร์มแวร์ระบบเปิดตัวชิปทางพอร์ต UART0 หากดึงลอจิกเป็น LOW จะปิดข้อความดีบั๊กของชิปขณะเริ่มต้นทำงาน |

> ⚠️ **กฎทองคำทางวิศวกรรม (Engineering Rule of Thumb):** หลีกเลี่ยงการนำอุปกรณ์ภายนอกที่มีวงจรดึงกระแส (เช่น ตัวต้านทาน Pull-up/Pull-down ค่าต่ำ, วงจรเอาต์พุตของไอซีตัวอื่น, หรือปุ่มกดที่ไม่ได้กรองสัญญาณ) มาต่อเข้ากับขา **GPIO 0, 2, 12, 15** หากจำเป็นต้องใช้งานขานั้นจริง ๆ จะต้องออกแบบวงจรแยกสัญญาณ (Isolation Buffer) หรือเลือกใช้ตัวต้านทาน Pull ที่มีค่าสูงพอ (เช่น 10kΩ ขึ้นไป) เพื่อป้องกันไม่ให้ดึงกระแสและเปลี่ยนสถานะลอจิกที่ถูกต้องของชิปในจังหวะเริ่มต้นระบบ

---

#### 4.2.6 การควบคุม GPIO ในระดับรีจิสเตอร์ (GPIO Register Control)

ในระบบปฏิบัติการทั่วไปหรือ Arduino API การเปิด-ปิดหน้าสัมผัสของพินดิจิทัลมักใช้ฟังก์ชัน `digitalWrite(pin, state)` ซึ่งฟังก์ชันนี้มีการทำงานที่ค่อนข้างช้า (มี Overhead สูง) เนื่องจากระบบต้องแปลงเลขพิน ตรวจสอบความถูกต้อง ป้องกันพอร์ตชนกัน และเรียกฟังก์ชันย่อยลงไปหลายระดับ ซึ่งอาจใช้เวลาประมวลผลมากถึง **1-2 ไมโครวินาที (หรือประมาณ 30-80 รอบสัญญาณนาฬิกา)**

สำหรับการเขียนโปรแกรมที่ต้องการประสิทธิภาพสูง (เช่น การแปลงค่าพัลส์ความถี่สูง, การสร้างบัสข้อมูลเฉพาะทาง) วิศวกรนิยมสั่งงานโดยตรงผ่าน **GPIO registers**:

- `GPIO_OUT_REG`: รีจิสเตอร์ขนาด 32 บิต ใช้สำหรับตั้งค่าลอจิก (HIGH/LOW) ของพิน GPIO 0 ถึง 31 พร้อมกัน (โดยเขียน 1 ในตำแหน่งบิตที่ต้องการเพื่อตั้งเป็น HIGH และเขียน 0 เพื่อตั้งเป็น LOW)
- `GPIO_OUT_W1TS_REG` (Write 1 to Set): การเขียนบิตเป็น 1 ในตำแหน่งใด ๆ ของรีจิสเตอร์นี้ จะบังคับให้ GPIO ในบิตนั้น ๆ กลายเป็น HIGH (1) ทันที โดยบิตที่เป็น 0 จะไม่ได้รับผลกระทบใด ๆ
- `GPIO_OUT_W1TC_REG` (Write 1 to Clear): การเขียนบิตเป็น 1 ในตำแหน่งใด ๆ ของรีจิสเตอร์นี้ จะบังคับให้ GPIO ในบิตนั้น ๆ กลายเป็น LOW (0) ทันที โดยบิตที่เป็น 0 จะไม่ได้รับผลกระทบใด ๆ
- `GPIO_IN_REG`: รีจิสเตอร์ขนาด 32 บิตที่แสดงสถานะไฟฟ้าขาเข้าของทุกพินดิจิทัล (0-31) ในขณะนั้น

#### เหตุใดจึงควรใช้ W1TS และ W1TC แทนการใช้ GPIO_OUT_REG?
เมื่อเราต้องการสั่งงานแบบระบุพินในรีจิสเตอร์ `GPIO_OUT_REG` หากเราใช้กลไกการเปลี่ยนค่าทั่วไป (Read-Modify-Write) เช่น:
```cpp
// อ่านค่าเดิม เปลี่ยนแปลงบิต แล้วเขียนกลับ (เสี่ยงต่อ Race Condition ในระบบ Multitasking)
REG_WRITE(GPIO_OUT_REG, REG_READ(GPIO_OUT_REG) | (1 << 18));
```
หากมี Interrupt แทรกขึ้นมาระหว่างกลางหรือมีอีกแกน CPU (Core 0) กำหนดค่า GPIO พินอื่นในเวลานั้น ค่าของพินอื่นจะถูกเขียนทับผิดพลาด แต่การเขียนลง `GPIO_OUT_W1TS_REG` หรือ `GPIO_OUT_W1TC_REG` เป็นการทำงานแบบ **Atomic Operation** คือส่งคำสั่งเขียนค่าลงไปครั้งเดียว ชิปฮาร์ดแวร์จะเปลี่ยนสถานะเฉพาะพินที่เราส่งบิตเป็น 1 ไปเท่านั้น ปราศจากการอ่านค่ากลับมาแก้ไข จึงรวดเร็ว ปลอดภัย และไม่สร้าง Race Condition

#### ตารางเปรียบเทียบโค้ดการสั่งงาน GPIO: Arduino API vs Register Control

```cpp
// ========================================================
// 1. วิธีปกติผ่าน Arduino API (ช้า แต่เข้าใจง่าย ปลอดภัยระดับพิน)
// ========================================================
void togglePinNormal() {
    digitalWrite(18, HIGH); // สั่งงานพิน 18 เป็น HIGH (ใช้เวลา ~1.2 us)
    digitalWrite(18, LOW);  // สั่งงานพิน 18 เป็น LOW
}

// ========================================================
// 2. วิธีสั่งงานตรงผ่าน Register (เร็วมาก ในระดับนาโนวินาที ~0.008 us)
// ========================================================
void togglePinFast() {
    // กำหนดลอจิก HIGH ที่ขา GPIO 18 (บิตที่ 18 มีค่าเท่ากับ 1 << 18)
    REG_WRITE(GPIO_OUT_W1TS_REG, (1 << 18)); 
    
    // กำหนดลอจิก LOW ที่ขา GPIO 18
    REG_WRITE(GPIO_OUT_W1TC_REG, (1 << 18));
}

// ========================================================
// 3. สั่งพอร์ตพร้อมกันหลายพินแบบขนาน (ไม่สามารถทำได้ด้วย digitalWrite ปกติ)
// ========================================================
void toggleMultiplePins() {
    // สั่งพิน GPIO 18, 19, และ 21 ให้กลายเป็น HIGH พร้อมกันในสัญญาณนาฬิกาเดียวกัน
    REG_WRITE(GPIO_OUT_W1TS_REG, (1 << 18) | (1 << 19) | (1 << 21));
    
    // สั่งพิน GPIO 18, 19, และ 21 ให้กลายเป็น LOW พร้อมกัน
    REG_WRITE(GPIO_OUT_W1TC_REG, (1 << 18) | (1 << 19) | (1 << 21));
}
```

---

### 4.3 ขา GPIO และฟังก์ชัน

GPIO (General Purpose Input/Output) คือขาอเนกประสงค์ที่สามารถตั้งค่าให้เป็นขาอินพุตหรือเอาต์พุตได้ตามต้องการ ESP32 มีขาที่มีฟังก์ชันหลายอย่างซ้อนกัน (multiplexed)

#### ตารางสรุปฟังก์ชัน GPIO ของ ESP32

| ฟังก์ชัน | ขาที่ใช้ได้ | หมายเหตุ |
|---|---|---|
| Digital Output | GPIO 0–33 (ส่วนใหญ่) | ส่งสัญญาณ HIGH/LOW |
| Digital Input | GPIO 0–39 | รับสัญญาณ HIGH/LOW |
| ADC1 (อ่านอะนาล็อก) | GPIO 32–39 | ใช้ได้พร้อม Wi-Fi |
| ADC2 (อ่านอะนาล็อก) | GPIO 0, 2, 4, 12–15, 25–27 | **ใช้ไม่ได้** ขณะเปิด Wi-Fi |
| DAC (ส่งอะนาล็อก) | GPIO 25, 26 | 8-bit (0–255 → 0–3.3 V) |
| PWM | ทุกขา Output ได้ | ตั้งค่าผ่าน LEDC API |
| Touch Sensor | GPIO 0, 2, 4, 12–15, 27, 32, 33 | Capacitive touch |
| I2C (default) | SDA=GPIO 21, SCL=GPIO 22 | เปลี่ยนได้ |
| SPI (default VSPI) | MOSI=23, MISO=19, CLK=18, CS=5 | เปลี่ยนได้ |
| UART0 (Serial) | TX=GPIO 1, RX=GPIO 3 | ใช้ร่วมกับ USB Serial |

#### ขาพิเศษ / ข้อควรระวัง

- **GPIO 0** — ใช้กำหนดโหมดบูต ไม่ควรใช้งานทั่วไป
- **GPIO 1, 3** — ใช้เป็น UART0 (USB Serial) ห้ามต่ออุปกรณ์อื่น
- **GPIO 6–11** — เชื่อมต่อกับ Flash ภายใน **ห้ามใช้เด็ดขาด**
- **GPIO 34–39** — เป็น **Input only** ไม่สามารถตั้งเป็น Output ได้ ไม่มี pull-up/pull-down ภายใน

---

### 4.4 โครงสร้างโปรแกรม Arduino

โปรแกรม Arduino (เรียกว่า **Sketch**) มีโครงสร้างหลัก 2 ฟังก์ชัน:

```
โปรแกรมเริ่มต้น
       │
       ▼
   setup()  ←── ทำงานครั้งเดียวตอนเริ่ม
       │
       ▼
   loop()   ←── ทำงานวนซ้ำตลอดเวลา
       │
       └──→ กลับมาที่ loop() อีกครั้ง (ไม่มีวันหยุด)
```

- **`setup()`** — ทำงาน **ครั้งเดียว** ตอนบอร์ดเริ่มทำงานหรือกดปุ่ม Reset ใช้ตั้งค่าขา GPIO, เริ่ม Serial, เชื่อมต่อ Wi-Fi ฯลฯ
- **`loop()`** — ทำงาน **วนซ้ำไม่หยุด** เป็นส่วนหลักของโปรแกรมที่อ่านเซ็นเซอร์ ประมวลผล และสั่งงานอุปกรณ์

#### ตัวอย่างที่ 1: Blink LED (กะพริบ LED)

```cpp
// ตัวอย่าง Blink LED บน ESP32
// LED ในตัวของ ESP32 DevKit มักอยู่ที่ GPIO 2

#define LED_PIN 2  // กำหนดขาที่ต่อ LED

void setup() {
  pinMode(LED_PIN, OUTPUT);   // ตั้งค่าขา LED เป็น Output
  Serial.begin(115200);       // เริ่ม Serial Monitor ที่ 115200 baud
  Serial.println("ESP32 Blink Start!");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);  // เปิด LED (ส่งแรงดัน 3.3V)
  Serial.println("LED ON");
  delay(1000);                  // รอ 1 วินาที (1000 มิลลิวินาที)

  digitalWrite(LED_PIN, LOW);   // ปิด LED (แรงดัน 0V)
  Serial.println("LED OFF");
  delay(1000);                  // รอ 1 วินาที
}
```

**อธิบายการทำงาน:**
1. `setup()` — ตั้งขา GPIO 2 เป็น Output และเริ่ม Serial ที่ 115200 baud
2. `loop()` — สลับเปิด-ปิด LED ทุก 1 วินาที พร้อมแสดงสถานะใน Serial Monitor

---

### 4.5 การติดตั้งเครื่องมือ

#### วิธีที่ 1: Arduino IDE + ESP32 Core

1. **ดาวน์โหลด Arduino IDE** จาก [arduino.cc](https://www.arduino.cc/en/software) แล้วติดตั้ง
2. **เพิ่ม ESP32 Board Manager URL:**
   - ไปที่ `File → Preferences`
   - ในช่อง *Additional Boards Manager URLs* เพิ่ม:
     ```
     https://espressif.github.io/arduino-esp32/package_esp32_index.json
     ```
3. **ติดตั้ง ESP32 Core:**
   - ไปที่ `Tools → Board → Boards Manager`
   - ค้นหา `esp32` แล้วกด **Install** (by Espressif Systems)
4. **เลือกบอร์ด:**
   - ไปที่ `Tools → Board → esp32` → เลือก **ESP32 Dev Module**
5. **เลือกพอร์ต:**
   - ไปที่ `Tools → Port` → เลือกพอร์ตที่แสดง (เช่น COM3 หรือ /dev/ttyUSB0)
6. กด **Upload** เพื่ออัปโหลดโปรแกรมเข้าบอร์ด

#### วิธีที่ 2: Wokwi Simulator (แนะนำสำหรับผู้เริ่มต้น)

**Wokwi** คือเว็บแอปจำลองวงจรอิเล็กทรอนิกส์ที่รองรับ ESP32 และ Arduino ใช้งานผ่านเบราว์เซอร์ได้ทันทีโดยไม่ต้องซื้อบอร์ดจริง

1. เปิดเว็บ [wokwi.com](https://wokwi.com)
2. กด **Start a new project** → เลือก **ESP32**
3. เขียนโค้ดในหน้าต่างซ้าย (Editor)
4. ลากวางอุปกรณ์ (LED, เซ็นเซอร์ ฯลฯ) ในหน้าต่างขวา (Diagram)
5. กดปุ่ม **▶ Start Simulation** เพื่อรันโปรแกรม
6. ดูผลลัพธ์ใน Serial Monitor ด้านล่าง

> 💡 **ทำไมต้อง Wokwi?** นักศึกษาสามารถทดลองวงจรได้ทุกที่ทุกเวลาโดยไม่ต้องมีบอร์ดจริง ไม่ต้องกลัวต่อผิดแล้วอุปกรณ์พัง เหมาะกับการเรียนรู้และทำการบ้านมาก

---

### 4.6 ฟังก์ชันพื้นฐาน Arduino

#### ตารางสรุปฟังก์ชันที่ใช้บ่อย

| ฟังก์ชัน | รูปแบบ | คำอธิบาย |
|---|---|---|
| `pinMode()` | `pinMode(pin, mode)` | ตั้งโหมดขา: `INPUT`, `OUTPUT`, `INPUT_PULLUP` |
| `digitalWrite()` | `digitalWrite(pin, value)` | ส่งค่า `HIGH` (3.3V) หรือ `LOW` (0V) ไปที่ขา |
| `digitalRead()` | `digitalRead(pin)` | อ่านค่าดิจิทัล: คืนค่า `HIGH` หรือ `LOW` |
| `analogRead()` | `analogRead(pin)` | อ่านค่าอะนาล็อก: คืนค่า 0–4095 (12-bit) |
| `analogWrite()` | `ledcWrite(ch, duty)` | ESP32 ใช้ LEDC API แทน analogWrite |
| `delay()` | `delay(ms)` | หยุดรอ (มิลลิวินาที) — **บล็อกโปรแกรม** |
| `millis()` | `millis()` | คืนเวลาที่ผ่านไป (ms) ตั้งแต่เริ่มทำงาน |
| `Serial.begin()` | `Serial.begin(baud)` | เริ่ม Serial ที่ baud rate ที่กำหนด |
| `Serial.print()` | `Serial.print(data)` | พิมพ์ข้อมูลไปยัง Serial Monitor (ไม่ขึ้นบรรทัดใหม่) |
| `Serial.println()` | `Serial.println(data)` | พิมพ์ข้อมูล + ขึ้นบรรทัดใหม่ |

#### ตัวอย่างที่ 2: อ่านค่าเซ็นเซอร์แสง (LDR) และควบคุม LED

```cpp
// อ่านค่า LDR (Light Dependent Resistor) ผ่านขา ADC
// ถ้ามืด (ค่า ADC ต่ำ) → เปิด LED / ถ้าสว่าง → ปิด LED

#define LDR_PIN   34   // ขา ADC (Input only)
#define LED_PIN    2   // ขา LED

const int THRESHOLD = 1000;  // ค่าเกณฑ์แบ่งมืด/สว่าง

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  // ขา ADC ไม่ต้อง pinMode (ตั้งค่าอัตโนมัติ)
  Serial.println("LDR Sensor Ready");
}

void loop() {
  int ldrValue = analogRead(LDR_PIN);  // อ่านค่า 0–4095

  Serial.print("LDR Value: ");
  Serial.println(ldrValue);

  if (ldrValue < THRESHOLD) {
    // มืด → เปิดไฟ
    digitalWrite(LED_PIN, HIGH);
    Serial.println("Status: DARK -> LED ON");
  } else {
    // สว่าง → ปิดไฟ
    digitalWrite(LED_PIN, LOW);
    Serial.println("Status: BRIGHT -> LED OFF");
  }

  delay(500);  // อ่านค่าทุก 0.5 วินาที
}
```

**อธิบายการทำงาน:**
1. ใช้ `analogRead()` อ่านค่าจาก LDR ที่ GPIO 34 (ค่า 0–4095)
2. เปรียบเทียบกับค่า `THRESHOLD` ที่ตั้งไว้ 1000
3. ถ้าค่าน้อยกว่า (แสงน้อย = มืด) → เปิด LED / ถ้ามากกว่า (แสงมาก) → ปิด LED
4. แสดงค่าและสถานะผ่าน Serial Monitor ตลอดเวลา

---

### 4.7 การออกแบบเฟิร์มแวร์แบบไม่บล็อกการทำงาน (Non-blocking Firmware Design)

ในงานระบบควบคุมทางวิศวกรรม เฟิร์มแวร์ที่ดีจะต้องมีคุณสมบัติในการตอบสนองที่รวดเร็วแบบทันท่วงที (Real-time responsiveness) เพื่อรับมือกับเหตุการณ์ต่าง ๆ ได้ขนานกัน

#### 4.7.1 ปัญหาของฟังก์ชัน `delay()` ในงานวิศวกรรมจริง

ฟังก์ชัน `delay(milliseconds)` เป็นฟังก์ชันที่มีคุณลักษณะเป็น **Blocking Call** คือเมื่อเรียกใช้ ตัวประมวลผล CPU จะถูกกักตัวไว้ในลูปเปล่า (CPU Spinning) คอยตรวจสอบเวลาที่ผ่านไป การกระทำนี้ทำให้อุปกรณ์หยุดชะงักการตรวจสอบสัญญาณรอบตัวไปโดยสิ้นเชิง ซึ่งส่งผลเสียอย่างรุนแรงในหลายมิติ:

- **การหยุดชะงักของระบบความปลอดภัย (Safety Block):** หากอุปกรณ์กำลังรัน `delay(5000)` เพื่อรอส่งข้อมูล และในจังหวะนั้นเกิดเหตุฉุกเฉิน เช่น ท่อระเบิด อุณหภูมิเกินเกณฑ์ หรือผู้ใช้งานกดปุ่มหยุดฉุกเฉิน (Emergency Stop) ระบบจะไม่สามารถตรวจจับสัญญาณขัดจังหวะนั้นได้เลยจนกว่าจะสิ้นสุดการหน่วงเวลา 5 วินาที
- **ความล่าช้าในลูปควบคุมแบบป้อนกลับ (PID Controller Latency):** ตัวควบคุมแบบ PID ต้องการรอบการประมวลผลที่ตรงเวลาสม่ำเสมอ (เช่น ทุก ๆ 10 มิลลิวินาที) หากมีจุดหน่วงเวลาแบบ `delay()` สอดแทรกอยู่ ระบบควบคุมจะไม่สามารถแก้ไขค่าของระบบ (เช่น ควบคุมทิศทางโดรน, ความเร็วมอเตอร์) ได้อย่างราบรื่น ทำให้เกิดการแกว่งและระบบอาจพังเสียหาย
- **การหลุดการเชื่อมต่อเครือข่ายไร้สาย (Wi-Fi/Bluetooth Disconnection):** ในโมดูล ESP32 แม้จะรันสแต็ก Wi-Fi แยกกันในระดับแกนฮาร์ดแวร์ แต่หากเฟิร์มแวร์แอปพลิเคชันเกิดการบล็อกเป็นเวลานานเกินไป อาจทำให้ทาสก์การเชื่อมต่อขาดการตรวจสอบหรือการสลับงานภายในโปรแกรมชะงัก (Watchdog reset หรือสัญญาณ keep-alive หลุด) ส่งผลให้อุปกรณ์หลุดจากเครือข่าย

---

#### 4.7.2 การทำงานมัลติทาสกิงแบบร่วมมือด้วย `millis()` (Cooperative Multitasking)

เพื่อหลีกเลี่ยงปัญหาข้างต้น เฟิร์มแวร์วิศวกรรมจะใช้ฟังก์ชัน `millis()` เพื่อดึงเวลาปัจจุบันในหน่วยมิลลิวินาที นับตั้งแต่ไมโครคอนโทรลเลอร์เริ่มรัน และนำไปคำนวณเปรียบเทียบกับตัวแปรที่บันทึกเวลาล่าสุดเพื่อบริหารจัดการเวลาโดยไม่บล็อกการประมวลผล (Non-blocking timing)

#### 1) โครงสร้างโค้ดแบบ Non-blocking (Blink without Delay)

```cpp
#define LED_PIN 2
const unsigned long INTERVAL = 1000; // รอบการทำงาน 1 วินาที (1000 ms)
unsigned long previousMillis = 0;    // ตัวแปรเก็บเวลาครั้งล่าสุดที่สลับสถานะ LED

bool ledState = false;

void setup() {
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    unsigned long currentMillis = millis(); // ดึงเวลาปัจจุบันมาเก็บไว้
    
    // ตรวจสอบว่าผ่านไปครบช่วงเวลาที่ต้องการหรือยัง
    if (currentMillis - previousMillis >= INTERVAL) {
        previousMillis = currentMillis; // อัปเดตเวลาล่าสุด
        ledState = !ledState;           // กลับสถานะไฟ LED
        digitalWrite(LED_PIN, ledState);
    }
    
    // ตรงส่วนนี้ CPU สามารถไปประมวลผลโปรแกรมอื่น ๆ ได้ทันทีโดยไม่หยุดคอย!
    // เช่น การสแกนอินพุตปุ่มกด หรืออ่านค่าเซ็นเซอร์ทุกรอบของ loop()
}
```

#### 2) การพิสูจน์คณิตศาสตร์ปัญหารอบเวียนล้นของบิต (32-bit Rollover Math Proof)
ฟังก์ชัน `millis()` ส่งค่ากลับมาในรูปแบบตัวแปร `unsigned long` ขนาด 32 บิต ซึ่งมีขอบเขตค่าอยู่ที่ $0$ ถึง $4,294,967,295$ (หรือ $2^{32} - 1$) ซึ่งระบบจะเกิดสภาวะล้น **(Rollover/Overflow)** กลับไปเริ่มที่ 0 ใหม่เมื่อถึงระยะเวลาประมาณ **49.71 วัน**

*คำถามยอดนิยมทางวิศวกรรม:* หาก `currentMillis` ล้นกลับมาที่ 0 แล้ว แต่ตัวแปรอ้างอิง `previousMillis` ยังเก็บค่าสุดท้ายก่อนล้น เช่น $4,294,967,290$ หากใช้วิธีลบแบบปกติจะทำให้การทำงานมีปัญหาหรือไม่?

*การพิสูจน์:* สมการที่ถูกต้องคือ `currentMillis - previousMillis` เสมอ (ห้ามเขียนกลับด้านหรือใช้วิธีเปรียบเทียบค่าตรง ๆ เช่น `currentMillis >= previousMillis + INTERVAL`)

ด้วยคุณลักษณะของ **เลขคณิตส่วนเติมเต็มสอง (Two's Complement Arithmetic)** ในตัวประมวลผล 32 บิต เมื่อคำนวณการลบที่เป็นเลขฐานลบของตัวแปรประเภทไม่มีเครื่องหมาย (Unsigned) ผลลัพธ์จะล้นกลับมาเป็นค่าบวกที่แท้จริงเสมอ

**ตัวอย่างสมมติเพื่อให้เข้าใจง่ายด้วย 8-bit unsigned (ค่า 0-255, ล้นกลับที่ 256):**
- สมมติให้ `previousMillis` บันทึกค่าที่ $250$
- กำหนด `INTERVAL` เท่ากับ $10$
- เมื่อเวลาล่วงเลยไป $10$ มิลลิวินาที ค่าจริงต้องเป็น $260$ แต่เกิดล้นขึ้นเนื่องจากเก็บในตัวแปรกว้าง 8 บิต ผลลัพธ์จึงกลายเป็น $260 - 256 = 4$
- ดังนั้น `currentMillis` อ่านได้เท่ากับ $4$
- ทำการแทนค่าลงในสมการเปรียบเทียบ:
  $$\text{result} = currentMillis - previousMillis$$
  $$\text{result} = 4 - 250$$
- ในการลบแบบ Unsigned 8-bit ค่าลบที่เกิดขึ้นจะถูกคำนวณภายใต้คณิตศาสตร์แบบมอดุโล 256 ($\pmod{256}$):
  $$4 - 250 = -246$$
  $$-246 \equiv -246 + 256 = 10 \pmod{256}$$
- หรือพิจารณาในรูปแบบเลขฐานสอง:
  - $4_{10}$ = `0b00000100`
  - $250_{10}$ = `0b11111010`
  - การลบคือการบวกด้วย Two's Complement ของ $250$ (ซึ่งก็คือ $-250_{10}$ = `0b00000110` หรือ $6_{10}$):
    $$\text{result} = \text{0b00000100} + \text{0b00000110} = \text{0b00001010} \ (10_{10})$$
- ผลลัพธ์จากการลบได้คำตอบเป็น **$10$** ซึ่งตรงกับช่วงเวลาที่ล่วงเลยไปจริงอย่างถูกต้อง! ทำให้ตัวโปรแกรมสามารถทำงานผ่านพ้นปัญหารอบเวลา 49.7 วันไปได้โดยไม่มีอาการค้างหรือข้อบกพร่องใด ๆ

---

#### 4.7.3 การออกแบบโดยใช้ Finite State Machine (FSM)

ในการออกแบบระบบเฟิร์มแวร์ที่มีความซับซ้อน มีเงื่อนไขการรับอินพุตและการเปลี่ยนสถานะที่ขึ้นแก่เวลาและอุปกรณ์แวดล้อม วิศวกรจะจัดกลุ่มพฤติกรรมของระบบให้อยู่ในรูปแบบของ **เครื่องจำลองสถานะจำกัด (Finite State Machine - FSM)**

#### การใช้ `enum class` เพื่อความปลอดภัยของข้อมูล (Type Safety)
ในการเขียนภาษา C++ ดั้งเดิม มักใช้วิธีนิยามสถานะระบบด้วย `#define STATE_A 0` หรือ `enum State { STATE_A, STATE_B }` ซึ่งไม่ปลอดภัยต่อการเขียนโค้ดขนาดใหญ่ เนื่องจากค่าเหล่านี้สามารถถูกนำไปเปรียบเทียบหรือแทนค่าเป็นจำนวนเต็มอินทิเจอร์ (Implicit Conversion) ได้โดยคอมไพเลอร์ไม่แจ้งเตือน และขอบเขตตัวแปรสามารถปนเปกันได้

การใช้งาน `enum class` (หรือเรียกว่า Scoped Enumerations) จะช่วยแก้ปัญหานี้ได้:
- ป้องกันการแปลงชนิดข้อมูลอัตโนมัติ (No Implicit Conversion to int)
- ป้องกันปัญหามลภาวะของเนมสเปซ (Namespace Pollution) เนื่องจากต้องระบุขอบเขตด้วยสัญลักษณ์ `::` (เช่น `State::IDLE` แทนที่จะเป็น `IDLE` ลอย ๆ)

#### โครงสร้างทั่วไปของ FSM ใน Arduino `loop()`:
```cpp
enum class MachineState {
    STANDBY,
    RUNNING,
    ERROR
};

MachineState currentState = MachineState::STANDBY;

void loop() {
    switch (currentState) {
        case MachineState::STANDBY:
            // 1. ทำกิจกรรมในสถานะ STANDBY
            // 2. ตรวจสอบเงื่อนไขเพื่อเปลี่ยนสถานะ
            if (digitalRead(START_PIN) == LOW) {
                currentState = MachineState::RUNNING;
            }
            break;
            
        case MachineState::RUNNING:
            // 1. ทำกิจกรรมในสถานะ RUNNING
            // 2. ตรวจสอบเงื่อนไขเพื่อเปลี่ยนสถานะ
            if (analogRead(SENSOR_PIN) > LIMIT) {
                currentState = MachineState::ERROR;
            }
            break;
            
        case MachineState::ERROR:
            // 1. ส่งสัญญาณแจ้งเตือนระบบขัดข้อง
            break;
    }
}
```

---

### 4.8 กรณีศึกษาเชิงวิศวกรรม: ระบบควบคุมปั๊มระบายความร้อนหม้อต้มอุตสาหกรรม (Boiler Cooling Pump Controller)

#### 4.8.1 รายละเอียดการออกแบบระบบและเงื่อนไขความปลอดภัย
โจทย์ทางวิศวกรรมนี้ประกอบด้วยหน่วยประมวลผล ESP32 คอยควบคุมระบบปั๊มน้ำไหลเวียนเพื่อระบายความร้อนให้แก่ระบบบอยเลอร์อุตสาหกรรม โดยควบคุมตามสถานะความร้อน (ผ่านเซ็นเซอร์ NTC Thermistor แอนะล็อก) และมีเงื่อนไขต่าง ๆ ดังนี้:

1. **Safety Interlock (ระบบเซ็นเซอร์ล้มเหลว):** ตรวจสอบกรณีเซ็นเซอร์เสียหาย ได้แก่ สายขาด (Open Circuit - อ่านค่าดิบ ADC ได้ต่ำกว่า 50) หรือเกิดการชอร์ตลงกราวด์ (Short Circuit - อ่านค่าดิบ ADC ได้สูงกว่า 4050) หากตรวจพบต้องบังคับย้ายระบบไปทำงานที่สถานะ `FAULT` ทันที เพื่อป้องกันเครื่องควบคุมอ่านค่าอุณหภูมิผิดพลาด
2. **Post-Run Cooling (ชะลอการดับปั๊ม):** เมื่อตัวควบคุมประเมินว่าอุณหภูมิลดลงต่ำกว่าเกณฑ์เปิดปั๊มแล้ว ระบบจะไม่ดับปั๊มทันที แต่จะเปลี่ยนไปที่สถานะหน่วงเวลา (`COOLDOWN_DELAY`) รันปั๊มต่ออีกเป็นเวลา 10 วินาทีเพื่อขจัดความร้อนสะสมที่สะสมในห้องเครื่องป้องกันอาการเดือดหลังเครื่องดับ (Thermal overshoot) และป้องกันระบบเปิด-ปิดปั๊มถี่เกินไป (ลด Hysteresis Wear)
3. **Failsafe in Fault:** เมื่อเครื่องเข้าสู่สถานะ `FAULT` ปั๊มระบายความร้อนจะถูกเปิดค้างไว้ตลอดเวลา (Failsafe ON) พร้อมมีสัญญาณเตือนภัย (Siren) และจะอนุญาตให้ทำการรีเซ็ตเครื่องกลับมาสแตนด์บายได้เฉพาะเมื่อปุ่ม Reset ถูกกด **และ** อุณหภูมิโดยรอบต้องลดลงมาอยู่ในเกณฑ์ปลอดภัยจริง (< 70°C) เท่านั้น
4. **Software Debounce (การกรองสัญญาณรบกวนปุ่มกด):** ปุ่มกด Reset ภายนอกมักมีการเด้งของกลไกหน้าสัมผัส (Contact bounce) ทำให้ชิปเข้าใจผิดว่าเกิดการกดหลายครั้งในเวลาอันสั้น จึงต้องเขียนโค้ดตรวจสอบสัญญาณหน่วงเวลาอย่างเป็นระบบ

---

#### 4.8.2 แผนภาพสถานะของระบบ (State Transition Diagram)

```
                       ┌────────────────────────┐
                       │        Power-on        │
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │          IDLE          │◄──────────────────────┐
                       │      - Pump: OFF       │                       │
                       │      - Siren: OFF      │                       │
                       └───────────┬────────────┘                       │
                                   │                                    │
                       Temp > 80°C │ Sensor Error                       │
                                   │ or Temp > 95°C                     │
                                   ▼                                    │
  ┌────────────────────────────────┼──────────────────────────────┐     │
  │                                │                              │     │
  │   Sensor Error                 │                              │     │
  │   or Temp > 95°C               ▼                              │     │
  │                      ┌──────────────────┐                     │     │
  │                      │     PUMPING      │                     │     │
  │                      │   - Pump: ON     │                     │     │
  │                      │   - Siren: OFF   │                     │     │
  │                      └─────────┬────────┘                     │     │
  │                                │                              │     │
  │                   Temp < 60°C  │                              │     │
  │                                ▼                              │     │
  │                      ┌──────────────────┐                     │     │
  │                      │  COOLDOWN_DELAY  │                     │     │
  │                      │   - Pump: ON     │                     │     │
  │                      │   - Siren: OFF   │                     │     │
  │                      └─────────┬────────┘                     │     │
  │                                │                              │     │
  │                                │ Timer Exceeded (10s)         │     │
  │                                └──────────────────────────────┼─────┘
  │                                                               │
  ▼                                                               │
┌───────────────────────────────────────┐                         │
│                 FAULT                 │                         │
│            - Pump: ON (Failsafe)      ├─────────────────────────┘
│            - Siren: ON (Alarm)        │ Temp < 70°C & Sensor OK
│            - Manual Reset Required    │ & Reset Button Pressed
└───────────────────────────────────────┘
```

---

#### 4.8.3 ซอร์สโค้ดภาษา C++ เต็มรูปแบบสำหรับกรณีศึกษา (Industrial C++ Source Code)

ซอร์สโค้ดต่อไปนี้ได้รับการรับรองไวยากรณ์ผ่านคอมไพเลอร์ ทำงานแบบปราศจากการบล็อกเวลาทั้งหมด (Pure Non-blocking) โดยจัดวางแยกแต่ละสถานะอย่างเป็นระบบ:

```cpp
#include <Arduino.h>

// การนิยามสถานะใน FSM ด้วย enum class ป้องกันปัญหาระดับประเภทข้อมูล
enum class State {
    IDLE,
    PUMPING,
    COOLDOWN_DELAY,
    FAULT
};

// พินกำหนดอินพุต/เอาต์พุตของระบบ
const uint8_t TEMP_PIN = 34;      // ขาอินพุตแอนะล็อกเชื่อมกับเซ็นเซอร์วัดอุณหภูมิ (ADC1)
const uint8_t PUMP_PIN = 25;      // ขาสั่งงานรีเลย์ควบคุมปั๊มน้ำระบายความร้อน
const uint8_t BUZZER_PIN = 26;    // ขาสั่งการบัซเซอร์สัญญาณเตือนภัย (Siren)
const uint8_t RESET_BTN_PIN = 14;  // ขาต่อปุ่มกด Reset (วงจรดึง Pull-up ภายใน, กดปุ่ม = LOW)

// ค่าเกณฑ์และค่าทางวิศวกรรม
const double TEMP_PUMP_ON = 80.0;   // อุณหภูมิสั่งเริ่มปั๊มน้ำ (°C)
const double TEMP_PUMP_OFF = 60.0;  // อุณหภูมิสั่งเริ่มหยุดปั๊ม (°C)
const double TEMP_CRITICAL = 95.0;  // อุณหภูมิวิกฤต บังคับเข้าสู่ FAULT (°C)
const double TEMP_SAFE_RESET = 70.0;// อุณหภูมิปลอดภัยที่ยินยอมให้เริ่มทำงานใหม่หลังเคลียร์ FAULT (°C)

const unsigned long COOLDOWN_DURATION = 10000; // ระยะเวลาชะลอการปิดปั๊ม 10 วินาที (10,000 ms)
const unsigned long DEBOUNCE_DELAY = 50;       // เวลาการกรองปุ่มกดหน้าสัมผัส 50 ms

// ตัวแปรควบคุมระบบ
State currentState = State::IDLE;
unsigned long cooldownStart = 0;

// ตัวแปรกองสัญญาณปุ่มกด (Debounce variables)
int lastButtonState = HIGH;      // หน้าสัมผัสปกติเนื่องจาก Pull-up
int buttonState = HIGH;          // สถานะปุ่มคัดกรองแล้ว
unsigned long lastDebounceTime = 0; 

// ฟังก์ชันแปลงสัญญาณ ADC และตรวจสอบสถานะเซ็นเซอร์ (Failsafe)
// ส่งค่ากลับเป็น true หากเซ็นเซอร์ปกติ และเก็บอุณหภูมิในพารามิเตอร์อ้างอิง tempCelsius
bool readTemperature(double &tempCelsius) {
    int rawAdc = analogRead(TEMP_PIN); // อ่านค่าขนาด 12-bit (0 - 4095)
    
    // ตรวจสอบความปลอดภัยเซ็นเซอร์ (Open / Short circuit checking)
    // สำหรับ ESP32 ADC ที่แรงดันสูงสุด 3.1V หากสายขาดหรือชอร์ต แรงดันไฟฟ้าจะกระโดดขอบวงจร
    if (rawAdc < 50 || rawAdc > 4050) {
        return false; // เกิดปัญหาที่ตัวอุปกรณ์วัดค่า
    }
    
    // คำนวณแปลงค่าดิบตามข้อมูลผู้ผลิต:
    // แรงดันเซ็นเซอร์: Vout = (10mV/C) * T + 500mV -> Vout (mV) = 10 * T + 500
    // แรงดันรับเข้า ESP32: V_adc (mV) = rawAdc * (3100.0 / 4095.0)
    double vAdcMv = ((double)rawAdc * 3100.0) / 4095.0;
    tempCelsius = (vAdcMv - 500.0) / 10.0;
    return true; // การวัดค่าเสร็จสมบูรณ์
}

// ฟังก์ชันพิมพ์บันทึกการเปลี่ยนผ่านสถานะการทำงานออก Serial Monitor
const char* stateToString(State s) {
    switch (s) {
        case State::IDLE: return "IDLE";
        case State::PUMPING: return "PUMPING";
        case State::COOLDOWN_DELAY: return "COOLDOWN_DELAY";
        case State::FAULT: return "FAULT";
    }
    return "UNKNOWN";
}

void transitionTo(State newState) {
    Serial.print("[FSM] Transition: ");
    Serial.print(stateToString(currentState));
    Serial.print(" -> ");
    Serial.println(stateToString(newState));
    currentState = newState;
}

void setup() {
    Serial.begin(115200);
    
    pinMode(PUMP_PIN, OUTPUT);
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(RESET_BTN_PIN, INPUT_PULLUP);
    
    // ตั้งค่าความปลอดภัยล่วงหน้า
    digitalWrite(PUMP_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    
    Serial.println("[SYSTEM] Boiler Cooling Pump Controller Initialized.");
}

void loop() {
    double currentTemp = 0.0;
    bool isSensorHealthy = readTemperature(currentTemp);
    
    // -------------------------------------------------------------
    // กลไกคัดกรองหน้าสัมผัสสวิตช์ปุ่มกด (Software Debounce)
    // -------------------------------------------------------------
    int currentBtnReading = digitalRead(RESET_BTN_PIN);
    bool isResetActivated = false;
    
    if (currentBtnReading != lastButtonState) {
        lastDebounceTime = millis(); // เริ่มนับเวลาใหม่เมื่อพบการแกว่ง
    }
    
    if ((millis() - lastDebounceTime) > DEBOUNCE_DELAY) {
        if (currentBtnReading != buttonState) {
            buttonState = currentBtnReading;
            if (buttonState == LOW) { // กดปุ่มทำงาน (ลอจิกเป็น LOW เนื่องจากวงจร Pull-up)
                isResetActivated = true;
            }
        }
    }
    lastButtonState = currentBtnReading;
    
    // -------------------------------------------------------------
    // ส่วนประมวลผลเงื่อนไขสถานะ (Finite State Machine Execution)
    // -------------------------------------------------------------
    switch (currentState) {
        case State::IDLE:
            digitalWrite(PUMP_PIN, LOW);
            digitalWrite(BUZZER_PIN, LOW);
            
            if (!isSensorHealthy) {
                Serial.println("[CRITICAL] Sensor fault detected in IDLE!");
                transitionTo(State::FAULT);
            } else if (currentTemp > TEMP_PUMP_ON) {
                Serial.print("[TEMP ALERT] Temp: ");
                Serial.print(currentTemp);
                Serial.println(" C. Starting cooling.");
                transitionTo(State::PUMPING);
            }
            break;
            
        case State::PUMPING:
            digitalWrite(PUMP_PIN, HIGH); // สั่งปั๊มทำงานระบายความร้อน
            digitalWrite(BUZZER_PIN, LOW);
            
            if (!isSensorHealthy) {
                Serial.println("[CRITICAL] Sensor fault detected during PUMPING!");
                transitionTo(State::FAULT);
            } else if (currentTemp > TEMP_CRITICAL) {
                Serial.print("[CRITICAL] Boiler temperature exceeded threshold: ");
                Serial.print(currentTemp);
                Serial.println(" C!");
                transitionTo(State::FAULT);
            } else if (currentTemp < TEMP_PUMP_OFF) {
                Serial.print("[TEMP OK] Temp fell to ");
                Serial.print(currentTemp);
                Serial.println(" C. Entering post-cooling.");
                cooldownStart = millis(); // บันทึกเวลาก่อนหน่วงสถานะ
                transitionTo(State::COOLDOWN_DELAY);
            }
            break;
            
        case State::COOLDOWN_DELAY:
            digitalWrite(PUMP_PIN, HIGH); // ปั๊มรันต่อไปในระดับหน่วงเวลา
            digitalWrite(BUZZER_PIN, LOW);
            
            if (!isSensorHealthy) {
                Serial.println("[CRITICAL] Sensor fault detected in COOLDOWN!");
                transitionTo(State::FAULT);
            } else if (currentTemp > TEMP_CRITICAL) {
                Serial.println("[CRITICAL] Temperature spikes during COOLDOWN!");
                transitionTo(State::FAULT);
            } else if (currentTemp > TEMP_PUMP_ON) {
                // หากอุณหภูมิกลับขึ้นสูงก่อนชะลอเวลาสิ้นสุด ให้กระโดดไปรันเต็มตัวใหม่
                Serial.println("[WARN] Temperature rose again. Returning to PUMPING.");
                transitionTo(State::PUMPING);
            } else if (millis() - cooldownStart >= COOLDOWN_DURATION) {
                Serial.println("[INFO] Post-cooling finished. Pump stopped.");
                transitionTo(State::IDLE);
            }
            break;
            
        case State::FAULT:
            // โหมดความปลอดภัยสูงสุด: เปิดปั๊มเพื่อลดอุณหภูมิ, ส่งสัญญาณเตือน
            digitalWrite(PUMP_PIN, HIGH);
            digitalWrite(BUZZER_PIN, HIGH);
            
            // รอรับสัญญาณการกู้คืนเครื่องจากวิศวกรผู้ควบคุม
            if (isResetActivated) {
                if (!isSensorHealthy) {
                    Serial.println("[RESET REJECTED] Cannot reset system: Sensor is still faulty!");
                } else if (currentTemp >= TEMP_SAFE_RESET) {
                    Serial.print("[RESET REJECTED] Temperature is still unsafe (");
                    Serial.print(currentTemp);
                    Serial.print(" C >= ");
                    Serial.print(TEMP_SAFE_RESET);
                    Serial.println(" C)");
                } else {
                    Serial.println("[SYSTEM RESET] Fault cleared. System returning to IDLE.");
                    transitionTo(State::IDLE);
                }
            }
            break;
    }
}
```

---

### สรุปบทที่ 4

| หัวข้อสำคัญ | สาระการเรียนรู้ระดับวิศวกรรม |
|---|---|
| **MCU vs MPU** | MCU รวมหน่วยประมวลผล หน่วยความจำ และ I/O ในชิปเดียว เหมาะสำหรับงานควบคุมอุปกรณ์และ Embedded / MPU แยกหน่วยความจำภายนอก เหมาะสำหรับงานคอมพิวเตอร์ทั่วไป |
| **สถาปัตยกรรมบัส** | **Von Neumann:** แชร์บัสชุดเดียวกัน (คอขวดง่าย) / **Harvard:** แยกบัสหน่วยความจำและข้อมูลเด็ดขาด (เร็วกว่า) / **Modified Harvard:** รวมความยืดหยุ่นเข้าถึงข้อมูลในพื้นที่คำสั่ง |
| **โครงสร้างหน่วยประมวลผล** | ทำงานแบบวนรอบ **FDEW** (Fetch, Decode, Execute, Writeback) โดยใช้ประโยชน์จาก Registers เช่น PC (ตัวชี้คำสั่ง), SP (ตัวจัดการตำแหน่งสแต็ก) และ IR (ตัวพักคำสั่ง) |
| **สเปกและหน่วยความจำ ESP32** | Xtensa LX6 Dual-core (32-bit), SRAM 520 KB แบ่งเป็น SRAM0 (IRAM), SRAM1/2 (DRAM), มีระบบแคชเข้าถึง SPI Flash ภายนอกด้วยระบบ MMU |
| **Strapping Pins** | GPIO 0, 2, 5, 12, 15 ทำหน้าที่เลือกโหมดบูตของชิปขณะเกิด POR รีเซ็ต ต้องระมัดระวังเป็นพิเศษในการเลือกนำไปต่อกับเซ็นเซอร์ภายนอกเพื่อหลีกเลี่ยง Boot failure หรือ Boot loop |
| **GPIO registers** | การเขียน GPIO ตรงผ่าน `GPIO_OUT_W1TS_REG` (Set) และ `GPIO_OUT_W1TC_REG` (Clear) ทำงานแบบ Atomic ซึ่งช่วยเร่งการเขียนพินในระดับนาโนวินาที ปลอดภัยจากปัญหา Race Condition |
| **Non-blocking Program** | ยกเลิกการใช้ `delay()` ที่บล็อกการทำงานหลัก แล้วประมวลผลแบบเชิงตารางเวลาโดยเปรียบเทียบค่า `millis()` ภายใต้เลขคณิต Two's Complement ซึ่งป้องกันปัญหาระบบหลุดเวลาล้น (Rollover) ได้ |

---

### แบบฝึกหัดท้ายบทที่ 4 (Expanded Engineering Exercises)

#### ข้อที่ 1 (การคำนวณแบนด์วิดท์ของระบบบัส)
พิจารณาสถาปัตยกรรมแบบ Von Neumann เปรียบเทียบกับ Harvard ในการรันชุดคำสั่งจำนวน 1,000 คำสั่ง โดยแต่ละคำสั่งมีความกว้าง 32 บิต (4 ไบต์) และในจำนวนนี้มีคำสั่งที่ต้องอ่านหรือเขียนข้อมูลลงในหน่วยความจำ (Data memory operations) คิดเป็น 30% ของคำสั่งทั้งหมด (300 คำสั่ง) โดยข้อมูลแต่ละตัวที่ทำการเข้าถึงมีความกว้าง 32 บิตเช่นกัน
กำหนดให้:
- ความถี่สัญญาณนาฬิกาของระบบบัสทั้งสองแบบทำงานคงที่ที่ 10 MHz (10 ล้านรอบสัญญาณนาฬิกาต่อวินาที)
- บัสสามารถรับส่งข้อมูล/คำสั่งได้สูงสุดครั้งละ 32 บิต ต่อ 1 รอบสัญญาณนาฬิกา
- ให้สมมติว่าขั้นตอนการประมวลผลคำสั่งปกติใช้เวลา 1 รอบสัญญาณนาฬิกาสำหรับการประมวลผลคำสั่งที่ไม่มีการเข้าถึงข้อมูล (1 cycle per instruction) และคำสั่งที่มีการเข้าถึงข้อมูลจะใช้เวลาเพิ่มขึ้นในส่วนของการโอนย้ายข้อมูล

**คำถาม:**
1. จงคำนวณจำนวนรอบสัญญาณนาฬิกาทั้งหมดที่ต้องใช้ในการประมวลผลชุดคำสั่งนี้ และอัตราการถ่ายโอนข้อมูลผ่านบัสโดยเฉลี่ย (Bus Bandwidth) ในหน่วย Megabytes per second (MB/s) สำหรับระบบสถาปัตยกรรมแบบ **Von Neumann**
2. จงคำนวณจำนวนรอบสัญญาณนาฬิกาทั้งหมดที่ต้องใช้ และอัตราการถ่ายโอนข้อมูลโดยเฉลี่ยผ่านบัสคำสั่งและบัสข้อมูลแยกกันสำหรับระบบสถาปัตยกรรมแบบ **Harvard**
3. จากผลการประเมิน จงอธิบายว่าเพราะเหตุใดระบบ Harvard จึงมีปริมาณงาน (Throughput) ดีกว่าระบบ Von Neumann และระบุข้อจำกัดทางกายภาพที่เกิดขึ้นในขั้นตอนการผลิตและลากลายวงจรบนชิปจริง

---

#### ข้อที่ 2 (การออกแบบวงจรอิเล็กทรอนิกส์ป้องกันขาสภาพแวดล้อมบูต)
ในการออกแบบระบบ IoT อุตสาหกรรมด้วย ESP32 ขาเลือกโหมดเริ่มต้น (Strapping pins) เช่น GPIO 12 (MTDI) และ GPIO 0 เป็นพินที่ไวต่ออิมพีแดนซ์และการดึงกระแสภายนอกตอนเริ่มต้นบูตระบบมาก
- **โจทย์:** หากโครงการของท่านมีความจำเป็นต้องต่อวงจรสวิตช์กดติดปล่อยดับ (Push Button) ภายนอกเข้ากับ GPIO 0 เพื่อใช้ฟังก์ชันทริกเกอร์แอปพลิเคชัน และต้องต่อขาอินเตอร์เฟซ I2C (SDA) จากโมดูลเซ็นเซอร์ภายนอกเข้ากับขา GPIO 12 เพื่อประหยัดขาพินที่ขาดแคลน
1. จงออกแบบวงจรไฟฟ้าเพื่อใช้เชื่อมต่ออุปกรณ์ทั้งสองเข้ากับขา GPIO 0 และ GPIO 12 ของ ESP32 โดยให้ระบบสามารถรันงานอินพุตและอ่านค่าเซ็นเซอร์ได้ปกติเมื่อทำงาน แต่ในทางตรงกันข้าม **ต้องไม่ส่งสัญญาณรบกวนหรือขัดขวางระดับแรงดันไฟฟ้าบนขาทั้งสองนี้ขณะเริ่มต้นเปิดชิปบอร์ด (Power-on Reset)**
2. วาดแผนผังบล็อกวงจรเชื่อมต่อ โดยระบุขนาดตัวต้านทาน Pull-up / Pull-down หรือตัวช่วยระบบตัดต่อเชิงกล/ดิจิทัล (เช่น Three-state Buffer IC 74LVC1G125 หรือทรานซิสเตอร์แยกสัญญาณ) ที่จำเป็น พร้อมระบุว่าแต่ละอุปกรณ์มีบทบาทตัดต่อสัญญาณอย่างไรในจังหวะบูตและจังหวะรันปกติ

---

#### ข้อที่ 3 (การดำเนินการระดับรีจิสเตอร์ด้วย C++)
ในการควบคุมวงจรปั๊มน้ำแรงดันและโซลินอยด์ไฟฟ้าพร้อมกัน 3 ชุด ได้แก่ พินขา GPIO 18, GPIO 19, และ GPIO 21 หากใช้วิธีเรียกสั่งงาน `digitalWrite()` ทีละขาเรียงกันไป จะทำให้สัญญาณแต่ละขามีระยะเวลารวนเหลื่อมล้ำกัน (Clock skew/latency difference) และเกิดภาระการประมวลผลสูง
1. จงเขียนฟังก์ชันภาษา C++ บนโมดูล ESP32 Arduino เพื่อรับค่าทางลอจิกเป็นตัวแปรประเภท Boolean และสั่งให้สถานะขา **GPIO 18, 19, และ 21 ทำงานสลับเป็น HIGH หรือ LOW พร้อมกันทั้งหมดในรอบสัญญาณนาฬิกาเดียวกัน** ผ่านการเขียนข้อมูลแบบ Atomic ไปที่รีจิสเตอร์ `GPIO_OUT_W1TS_REG` และ `GPIO_OUT_W1TC_REG`
2. โค้ดโปรแกรมของท่านต้องใช้หลักการคำนวณระดับบิต (Bitwise Operations) และรับประกันว่าการแก้ไขค่าของสัญญาณขา GPIO 18, 19, 21 นี้ จะไม่รบกวนหรือทับสถานะค่าของขาเอาต์พุตตัวอื่น ๆ ในเครื่องที่อาจถูกใช้งานอยู่โดยบอร์ดตัวหลัก
3. อธิบายเปรียบเทียบในแง่ของจำนวนรอบการรันของสัญญาณนาฬิกา (Clock cycles) และมิติเรื่องความปลอดภัยจากการเกิดสภาวะแข่งขัน (Race Condition) เมื่อเทียบกับวิธีการเขียนแบบดั้งเดิมที่ใช้ Read-Modify-Write กับรีจิสเตอร์ `GPIO_OUT_REG`

---

#### ข้อที่ 4 (การคำนวณแปลงสัญญาณ ADC เป็นอุณหภูมิทางวิศวกรรม)
กำหนดให้เซ็นเซอร์วัดอุณหภูมิในระดับอุตสาหกรรมชิ้นหนึ่ง ให้แรงดันไฟฟ้าขาออกสัมพันธ์เป็นสมการเชิงเส้นกับค่าอุณหภูมิแวดล้อมดังนี้:
$$V_{out} = (10 \text{ mV/}^\circ\text{C}) \times T + 500\text{ mV}$$
โดยที่ $T$ คืออุณหภูมิในหน่วยองศาเซลเซียส ($^\circ\text{C}$)
วงจรอินพุตแอนะล็อกของเซ็นเซอร์นี้ถูกนำมาต่อเข้าช่อง ADC1 ของ ESP32 ซึ่งบอร์ดถูกกำหนดช่วงคำนวณแบบ 12-bit (ให้ค่าลอจิกดิบ 0 - 4095) และถูกตั้งความกว้างค่าลดทอนความเข้มสัญญาณ (Attenuation) ที่ระดับ 11dB ซึ่งเหมาะสำหรับการอ่านค่าแรงดันไฟฟ้าสัมบูรณ์ในช่วง 0.0V ถึง 3.1V

**คำถาม:**
1. จงพิสูจน์และแสดงสมการคณิตศาสตร์เชิงวิศวกรรมเพื่อแปลงค่าดิบแอนะล็อกที่อ่านได้ ($ADC_{raw}$) ให้ได้ผลลัพธ์เป็นอุณหภูมิ $T$ ในหน่วยองศาเซลเซียส โดยแสดงหน่วยการแปลงของสูตรให้ชัดเจน
2. หากบอร์ดไมโครคอนโทรลเลอร์ประมวลผลอ่านสัญญาณดิบ $ADC_{raw}$ มีค่าเท่ากับ $2048$ จงคำนวณอุณหภูมิขณะนั้นของหม้อต้ม
3. เนื่องจาก ADC ภายในชิป ESP32 มีลักษณะไม่เป็นเชิงเส้นในบริเวณขอบแรงดันระดับล่างและบน (Non-linearity) ซึ่งเป็นที่ทราบกันดีในกลุ่มผู้ออกแบบระบบ จงนำเสนอแนวทางเชิงวิศวกรรมอย่างน้อย 2 วิธีในการลดทอนข้อผิดพลาดเชิงระบบนี้เพื่อเพิ่มความเที่ยงตรงและความถูกต้องของการวัดค่าในงานจริง

---

#### ข้อที่ 5 (การออกแบบ Finite State Machine สำหรับ Autoclave)
จงออกแบบ FSM เพื่อควบคุมการทำงานของเครื่องนึ่งฆ่าเชื้อความดันสูง (Autoclave Sterilizer) ในโรงพยาบาล โดยระบบใช้เฟิร์มแวร์แบบไม่บล็อกเวลา (Non-blocking) ประกอบด้วย 5 สถานะ คือ:
- `DOOR_OPEN` (สแตนด์บาย/ประตูเปิด): รอรับอินพุตสัญญาณสวิตช์ประตูปิดสนิท (`doorClosed == true`) และวัดอุณหภูมิภายในต่ำกว่า 50°C จากนั้นเมื่อกดสวิตช์สัญญาณสตาร์ต (`startPressed == true`) ระบบจะขยับเข้าสู่สถานะ `HEATING`
- `HEATING` (เร่งทำความร้อน): ส่งเอาต์พุตไฟออกสำหรับเปิดฮีตเตอร์ (`heaterPin = HIGH`) เพื่อระดมทำความร้อน จนอุณหภูมิแตะระดับควบคุมที่ 121°C จึงขยับไปสถานะ `STERILIZING`
- `STERILIZING` (อบฆ่าเชื้อ): รักษาอุณหภูมิในถังช่วง 121°C - 123°C (โดยคอยเปิด/ปิดเอาต์พุตฮีตเตอร์ควบคุม) เป็นเวลานานต่อเนื่อง 20 นาที (ใช้กลไก `millis()`) หากอุณหภูมิต่ำกว่า 121°C ให้หยุดนับชั่วคราวจนกว่าความร้อนจะขึ้นมาใหม่ เมื่อทำงานครบ 20 นาทีแล้ว ย้ายไปสถานะ `EXHAUST`
- `EXHAUST` (ระบายความดัน): สั่งทำงานโซลินอยด์วาล์วระบายไอน้ำ (`valvePin = HIGH`) ดับฮีตเตอร์ รอจนสวิตช์ตรวจจับความดันต่ำรายงานว่าความดันในถังเป็นศูนย์บาร์ (`pressureLow == true`) ย้ายไปสถานะ `COMPLETE`
- `COMPLETE` (สิ้นสุดงาน): ทำงานเอาต์พุตร้องเตือน (`buzzerPin = HIGH`) ค้างไว้คงที่เป็นเวลา 5 วินาที (ใช้กลไก `millis()`) จากนั้นดับการเตือน ปลดล็อกประตู เพื่อก้าวกลับไปสถานะ `DOOR_OPEN`

**สิ่งที่ต้องทำ:**
1. จงวาดตารางความสัมพันธ์การสลับสับเปลี่ยนสถานะ (State Transition Table) ที่ระบุสถานะดั้งเดิม (Current State), เงื่อนไขอินพุต (Inputs / Events), สถานะปลายทาง (Next State) และเอาต์พุตควบคุมที่เกี่ยวข้อง
2. เขียนชุดโครงสร้างโปรแกรมโครงร่าง (Skeleton Code) ภาษา C++ สำหรับแพลตฟอร์ม Arduino ESP32 เพื่อขับเคลื่อน FSM ดังกล่าว โดยใช้กลไก `enum class` สำหรับจัดเก็บตัวแปรสถานะและไม่มีส่วนคำสั่ง `delay()` ในโค้ดเลย


---

## หัวข้อเพิ่มเติม: นวัตกรรมไมโครคอนโทรลเลอร์สำหรับ IoT สมัยใหม่

### สถาปัตยกรรม RISC-V
RISC-V (อ่านว่า ริสก์-ไฟว์) เป็นสถาปัตยกรรมชุดคำสั่งแบบเปิด (Open-source ISA) ที่กำลังเข้ามามีบทบาทอย่างมากในวงการไมโครคอนโทรลเลอร์ IoT (รวมถึงชิป ESP32-C3 ของ Espressif) เนื่องจากไม่มีค่าลิขสิทธิ์ ทำให้นักพัฒนาและผู้ผลิตสามารถนำไปออกแบบชิปเฉพาะทางได้ด้วยต้นทุนที่ต่ำและมีประสิทธิภาพสูง

### TinyML (Machine Learning on Microcontrollers)
TinyML คือการย่อส่วนโมเดล Machine Learning ให้สามารถทำงานได้บนไมโครคอนโทรลเลอร์ที่มีทรัพยากรจำกัด (เช่น RAM น้อยกว่า 1MB) ทำให้สามารถประมวลผล AI ได้ที่อุปกรณ์ปลายทาง (Edge AI) ทันที เช่น การตรวจจับเสียงคำสั่ง (Voice Wake-word) หรือการจำแนกรูปแบบการสั่นสะเทือนของตลับลูกปืน โดยไม่ต้องส่งข้อมูลดิบขึ้นคลาวด์
