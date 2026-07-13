# Chapter 9: โปรโตคอล MQTT สำหรับงานด้านไอโอที (MQTT Messaging Protocol)

> บทนี้จะอธิบายสถาปัตยกรรมการสื่อสารแบบกระจายข้อความ Publish-Subscribe ผ่านโปรโตคอล MQTT ซึ่งออกแบบมาสำหรับอุปกรณ์ฝังตัวที่มีหน่วยความจำจำกัดและแบนด์วิดท์เครือข่ายต่ำ รวมถึงอธิบายระดับคุณภาพความมั่นคงในการรับส่ง (QoS) และการเขียนโปรแกรม MQTT Client บนบอร์ดไมโครคอนโทรลเลอร์

---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 9.1 MQTT: รูปแบบ Publish/Subscribe

**MQTT (Message Queuing Telemetry Transport)** ถูกออกแบบมาเพื่ออุปกรณ์ IoT โดยเฉพาะ มีขนาดเล็ก (Lightweight) และใช้แบนด์วิดท์ต่ำ

### 9.1.1 องค์ประกอบหลัก

MQTT ทำงานแบบ **Publish/Subscribe (Pub/Sub)** ซึ่งต่างจาก HTTP ตรงที่ไม่ต้องร้องขอโดยตรง:

- **Broker** — เซิร์ฟเวอร์ตัวกลางที่รับและกระจายข้อความ (เช่น Mosquitto, HiveMQ)
- **Publisher** — อุปกรณ์ที่ "เผยแพร่" ข้อมูลไปยัง Topic เช่น ESP32 ส่งค่าอุณหภูมิ
- **Subscriber** — อุปกรณ์ที่ "สมัครรับ" ข้อมูลจาก Topic ที่สนใจ

แผนภาพเคลื่อนไหวด้านล่างนี้แสดงกลไกการแลกเปลี่ยนข้อมูลแบบ Publish/Subscribe โดยมี Broker เป็นศูนย์กลางในการกระจายข้อมูลอุณหภูมิไปยังผู้รับหลายรายพร้อมกัน:

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 270" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .pub-box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .broker-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .sub-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .dashboard-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .wire-pub { fill: none; stroke: #f59e0b; stroke-width: 2.5; stroke-dasharray: 6 4; stroke-linecap: round; animation: flowPub 3s linear infinite; }
    .wire-sub1 { fill: none; stroke: #16a34a; stroke-width: 2.5; stroke-dasharray: 6 4; stroke-linecap: round; animation: flowSub1 3s linear infinite; }
    .wire-sub2 { fill: none; stroke: #16a34a; stroke-width: 2.5; stroke-dasharray: 6 4; stroke-linecap: round; animation: flowSub2 3s linear infinite; }
    
    .msg-pub { fill: #ffffff; stroke: #f59e0b; stroke-width: 2; rx: 3px; animation: mqttPubCycle 6s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    .msg-sub1 { fill: #ffffff; stroke: #16a34a; stroke-width: 2; rx: 3px; animation: mqttSub1Cycle 6s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    .msg-sub2 { fill: #ffffff; stroke: #16a34a; stroke-width: 2; rx: 3px; animation: mqttSub2Cycle 6s infinite cubic-bezier(0.4, 0, 0.2, 1); }
    
    .text-main { font-size: 13px; font-weight: 700; fill: #334155; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-family: monospace; font-size: 11px; fill: #7c3aed; font-weight: bold; }
    .text-title { font-size: 14px; font-weight: 800; fill: #0f172a; }
    
    @keyframes flowPub {
      0% { stroke-dashoffset: 20; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes flowSub1 {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 20; }
    }
    @keyframes flowSub2 {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 20; }
    }
    
    @keyframes mqttPubCycle {
      0% { transform: translate(190px, 135px); opacity: 0; }
      5%, 30% { opacity: 1; }
      35%, 100% { transform: translate(320px, 135px); opacity: 0; }
    }
    @keyframes mqttSub1Cycle {
      0%, 40% { transform: translate(440px, 110px); opacity: 0; }
      45%, 70% { opacity: 1; }
      75%, 100% { transform: translate(570px, 72px); opacity: 0; }
    }
    @keyframes mqttSub2Cycle {
      0%, 40% { transform: translate(440px, 160px); opacity: 0; }
      45%, 70% { opacity: 1; }
      75%, 100% { transform: translate(570px, 198px); opacity: 0; }
    }
  </style>
  <rect x="5" y="5" width="750" height="260" class="bg"/>
  <text x="380" y="32" class="text-title" text-anchor="middle">สถาปัตยกรรม MQTT (Publish / Subscribe)</text>
  
  <!-- Publisher Box -->
  <rect x="25" y="85" width="150" height="100" class="pub-box"/>
  <text x="100" y="110" class="text-main" text-anchor="middle" fill="#7c3aed">ESP32 Publisher</text>
  <text x="100" y="130" class="text-sub" text-anchor="middle">ผู้เผยแพร่ข้อมูลอุณหภูมิ</text>
  <text x="100" y="150" class="text-sub" text-anchor="middle">Topic: home/temp</text>
  <text x="100" y="170" class="text-code" text-anchor="middle">temp: 32.5</text>
  
  <!-- MQTT Broker Box (Center) -->
  <rect x="305" y="85" width="150" height="100" class="broker-box"/>
  <text x="380" y="110" class="text-main" text-anchor="middle">MQTT Broker</text>
  <text x="380" y="130" class="text-sub" text-anchor="middle">ตัวกลางคัดแยกข้อมูล</text>
  <text x="380" y="150" class="text-sub" text-anchor="middle">ตาม Topic</text>
  <text x="380" y="170" class="text-code" text-anchor="middle" fill="#334155">Mosquitto / HiveMQ</text>
  
  <!-- Subscriber 1 (Web Dashboard) -->
  <rect x="585" y="30" width="150" height="85" class="dashboard-box"/>
  <text x="660" y="55" class="text-main" text-anchor="middle">Web Dashboard</text>
  <text x="660" y="75" class="text-sub" text-anchor="middle">Sub: home/temp</text>
  <text x="660" y="98" class="text-code" text-anchor="middle" fill="#16a34a">Temp: 32.5 °C</text>
  
  <!-- Subscriber 2 (Mobile App) -->
  <rect x="585" y="155" width="150" height="85" class="sub-box"/>
  <text x="660" y="180" class="text-main" text-anchor="middle">Mobile App</text>
  <text x="660" y="200" class="text-sub" text-anchor="middle">Sub: home/temp</text>
  <text x="660" y="223" class="text-code" text-anchor="middle" fill="#16a34a">Temp: 32.5 °C</text>
  
  <!-- Paths -->
  <!-- Pub to Broker -->
  <line x1="175" y1="135" x2="305" y2="135" class="wire"/>
  <line x1="175" y1="135" x2="305" y2="135" class="wire-pub"/>
  <path d="M 297 130 L 305 135 L 297 140 Z" fill="#f59e0b"/>
  
  <!-- Broker to Sub 1 (Web Dashboard) -->
  <line x1="455" y1="110" x2="585" y2="72" class="wire"/>
  <line x1="455" y1="110" x2="585" y2="72" class="wire-sub1"/>
  <path d="M 577 69 L 585 72 L 579 78 Z" fill="#16a34a"/>
  
  <!-- Broker to Sub 2 (Mobile App) -->
  <line x1="455" y1="160" x2="585" y2="198" class="wire"/>
  <line x1="455" y1="160" x2="585" y2="198" class="wire-sub2"/>
  <path d="M 579 192 L 585 198 L 577 201 Z" fill="#16a34a"/>
  
  <!-- Message Envelope Icons -->
  <!-- Pub Envelope -->
  <g class="msg-pub">
    <rect x="-12" y="-8" width="24" height="16" rx="2" />
    <path d="M -12 -8 L 0 0 L 12 -8" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
  </g>
  
  <!-- Sub 1 Envelope -->
  <g class="msg-sub1">
    <rect x="-12" y="-8" width="24" height="16" rx="2" />
    <path d="M -12 -8 L 0 0 L 12 -8" fill="none" stroke="#16a34a" stroke-width="1.5"/>
  </g>
  
  <!-- Sub 2 Envelope -->
  <g class="msg-sub2">
    <rect x="-12" y="-8" width="24" height="16" rx="2" />
    <path d="M -12 -8 L 0 0 L 12 -8" fill="none" stroke="#16a34a" stroke-width="1.5"/>
  </g>
  
</svg>
</div>

### 9.1.2 โครงสร้าง Topic

Topic ใน MQTT จัดเป็นลำดับชั้น (Hierarchy) คล้ายโครงสร้างโฟลเดอร์:

```
building/floor1/room101/temperature
building/floor1/room101/humidity
building/floor2/room201/temperature
```

**Wildcard (ตัวแทน):**
- `+` แทนระดับเดียว — `building/+/room101/temperature` จะรับข้อมูลจากทุกชั้น
- `#` แทนหลายระดับ — `building/floor1/#` จะรับข้อมูลทั้งหมดของชั้น 1

### 9.1.3 ระดับ QoS (Quality of Service)

MQTT มีกลไกการรับประกันการรับส่งข้อมูลผ่านระดับ **QoS (Quality of Service)** 3 ระดับ เพื่อรองรับเสถียรภาพเครือข่ายและข้อจำกัดของอุปกรณ์ที่แตกต่างกัน:

| ระดับ QoS | ชื่อเรียก | คำอธิบาย | การแลกเปลี่ยนแพ็กเก็ตคีย์หลัก | เหมาะกับงาน |
|-----------|------|----------|---------------------------|------------|
| **0** | At most once | ส่งข้อมูลครั้งเดียว ไม่รอการยืนยัน | `PUBLISH` ➔ จบงานทันที | ข้อมูลเซ็นเซอร์ทั่วไปที่ส่งถี่ ๆ (เช่น อุณหภูมิรายวินาที) |
| **1** | At least once | มั่นใจว่าถึงปลายทาง แต่อาจมีข้อมูลซ้ำ | `PUBLISH` ➔ `PUBACK` | คำสั่งเปิด-ปิดไฟ หรือข้อมูลที่ห้ามสูญหายเด็ดขาด |
| **2** | Exactly once | ข้อมูลถึงผู้รับครั้งเดียวแน่นอน ไม่ซ้ำ | `PUBLISH` ➔ `PUBREC` ➔ `PUBREL` ➔ `PUBCOMP` | ระบบการเงิน, การหักยอดสินค้า หรือคำสั่งที่ห้ามเกิดซ้ำซ้อน |

#### ลำดับขั้นตอนการแลกเปลี่ยนแพ็กเก็ตควบคุม (Packet Flow Sequence)

เพื่อให้เข้าใจเชิงลึกว่าแต่ละระดับ QoS จัดการข้อมูลอย่างไรในระดับ TCP Payload ด้านล่างนี้คือลำดับแพ็กเก็ตควบคุมที่แลกเปลี่ยนกันระหว่างผู้ส่ง (Client/Publisher) และผู้รับ (Broker):

##### 1. ลำดับของ QoS 0 (At most once - อย่างมากหนึ่งครั้ง)
ส่งแบบ **"ยิงแล้วลืม" (Fire and Forget)** ไม่มีการเก็บสถานะ ไม่มีการรอแพ็กเก็ตตอบกลับใด ๆ
<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 600 130" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>QoS 0 Sequence Diagram</title>
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1.5; rx: 8px; }
    .lifeline { stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4 4; }
    .node-box { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 4px; }
    .txt-node { font-size: 12px; font-weight: bold; fill: #1e293b; }
    
    .msg-line { fill: none; stroke: #94a3b8; stroke-width: 2; }
    .msg-flow { fill: none; stroke: #3b82f6; stroke-width: 2; stroke-dasharray: 6 6; animation: msg-march 1.5s linear infinite; }
    .msg-text { font-size: 11.5px; font-weight: bold; fill: #2563eb; }
    .note-text { font-size: 11px; fill: #64748b; }
    
    @keyframes msg-march {
      to { stroke-dashoffset: -12; }
    }
  </style>

  <rect x="5" y="5" width="590" height="120" class="bg"/>
  
  <defs>
    <marker id="arrow-seq" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#3b82f6"/>
    </marker>
  </defs>

  <!-- Lifelines -->
  <line x1="150" y1="45" x2="150" y2="105" class="lifeline"/>
  <line x1="450" y1="45" x2="450" y2="105" class="lifeline"/>
  
  <rect x="90" y="20" width="120" height="26" class="node-box"/>
  <text x="150" y="37" text-anchor="middle" class="txt-node">Publisher</text>

  <rect x="390" y="20" width="120" height="26" class="node-box"/>
  <text x="450" y="37" text-anchor="middle" class="txt-node">Broker</text>

  <!-- Message 1 -->
  <line x1="150" y1="75" x2="450" y2="75" class="msg-line" marker-end="url(#arrow-seq)"/>
  <line x1="150" y1="75" x2="445" y2="75" class="msg-flow"/>
  <text x="300" y="68" text-anchor="middle" class="msg-text">1. PUBLISH</text>
  <text x="462" y="80" text-anchor="start" class="note-text">(ได้รับข้อมูลและประมวลผลทันที)</text>
</svg>
</div>
- **ขั้นตอน:** ผู้ส่งทำการส่งแพ็กเก็ต `PUBLISH` เพียงครั้งเดียว และไม่มีการติดตามการตอบรับ
- **ข้อดี:** ความหน่วงต่ำมาก (Latency ต่ำสุด) ใช้แบนด์วิดท์และพลังงานน้อยที่สุด
- **ความเสี่ยง:** หากสัญญาณเครือข่ายมีปัญหาระหว่างส่ง ข้อมูลจะสูญหายทันทีโดยไม่มีการรับรู้

##### 2. ลำดับของ QoS 1 (At least once - อย่างน้อยหนึ่งครั้ง)
รับประกันข้อมูลถึงปลายทางแน่นอน แต่อาจได้รับข้อความซ้ำได้หากตัวส่งเข้าใจผิดว่าข้อความหล่นหาย
<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 600 170" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>QoS 1 Sequence Diagram</title>
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1.5; rx: 8px; }
    .lifeline { stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4 4; }
    .node-box { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 4px; }
    .txt-node { font-size: 12px; font-weight: bold; fill: #1e293b; }
    
    .msg-line { fill: none; stroke: #94a3b8; stroke-width: 2; }
    .msg-flow-right { fill: none; stroke: #3b82f6; stroke-width: 2; stroke-dasharray: 6 6; animation: march-r 1.5s linear infinite; }
    .msg-flow-left { fill: none; stroke: #10b981; stroke-width: 2; stroke-dasharray: 6 6; animation: march-l 1.5s linear infinite; }
    
    .msg-text-blue { font-size: 11.5px; font-weight: bold; fill: #2563eb; }
    .msg-text-green { font-size: 11.5px; font-weight: bold; fill: #059669; }
    .note-text { font-size: 11px; fill: #64748b; }
    
    @keyframes march-r {
      to { stroke-dashoffset: -12; }
    }
    @keyframes march-l {
      to { stroke-dashoffset: 12; }
    }
  </style>

  <rect x="5" y="5" width="590" height="160" class="bg"/>
  
  <defs>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#3b82f6"/>
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#10b981"/>
    </marker>
  </defs>

  <!-- Lifelines -->
  <line x1="150" y1="45" x2="150" y2="145" class="lifeline"/>
  <line x1="450" y1="45" x2="450" y2="145" class="lifeline"/>
  
  <rect x="90" y="20" width="120" height="26" class="node-box"/>
  <text x="150" y="37" text-anchor="middle" class="txt-node">Publisher</text>

  <rect x="390" y="20" width="120" height="26" class="node-box"/>
  <text x="450" y="37" text-anchor="middle" class="txt-node">Broker</text>

  <!-- Message 1 -->
  <line x1="150" y1="75" x2="450" y2="75" class="msg-line" marker-end="url(#arrow-blue)"/>
  <line x1="150" y1="75" x2="445" y2="75" class="msg-flow-right"/>
  <text x="300" y="68" text-anchor="middle" class="msg-text-blue">1. PUBLISH (PacketID: 1)</text>
  <text x="462" y="80" text-anchor="start" class="note-text">(ได้รับและบันทึกข้อความ)</text>

  <!-- Message 2 -->
  <line x1="450" y1="115" x2="150" y2="115" class="msg-line" marker-end="url(#arrow-green)"/>
  <line x1="450" y1="115" x2="155" y2="115" class="msg-flow-left"/>
  <text x="300" y="108" text-anchor="middle" class="msg-text-green">2. PUBACK (PacketID: 1)</text>
  <text x="138" y="120" text-anchor="end" class="note-text">(ลบข้อความออกจากหน่วยความจำ)</text>
</svg>
</div>
- **ขั้นตอน:**
  1. ผู้ส่งบันทึกข้อความไว้ใน Memory เครื่อง และส่ง `PUBLISH` พร้อมตัวระบุเลขแพ็กเก็ต (`Packet ID`)
  2. ผู้รับบันทึกข้อความลงระบบ ประมวลผล และส่งแพ็กเก็ต `PUBACK` (Publish Acknowledgement) กลับไปหาผู้ส่ง
  3. เมื่อผู้ส่งได้รับ `PUBACK` ตรงกับ `Packet ID` จึงลบข้อความนั้นออกจาก Memory
- **การจัดการกรณีเครือข่ายขัดข้อง:** หากผู้ส่งไม่ได้ส่ง `PUBACK` กลับมาภายในเวลาที่กำหนด (Timeout) ผู้ส่งจะส่ง `PUBLISH` ซ้ำอีกครั้งโดยเพิ่มแฟล็ก `DUP: 1` (Duplicate) เพื่อเตือนผู้รับ

##### 3. ลำดับของ QoS 2 (Exactly once - ครั้งเดียวและแน่นอน)
การันตีความถูกต้องสูงสุด ป้องกันปัญหากรณีข้อมูลซ้ำซ้อนอย่างสมบูรณ์แบบโดยใช้ระบบ Handshake 4 ขั้นตอน:
<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 600 250" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>QoS 2 Sequence Diagram</title>
  <style>
    .bg { fill: #f8fafc; stroke: #e2e8f0; stroke-width: 1.5; rx: 8px; }
    .lifeline { stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4 4; }
    .node-box { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 4px; }
    .txt-node { font-size: 12px; font-weight: bold; fill: #1e293b; }
    
    .msg-line { fill: none; stroke: #94a3b8; stroke-width: 2; }
    .msg-flow-right { fill: none; stroke: #3b82f6; stroke-width: 2; stroke-dasharray: 6 6; animation: march-r 1.5s linear infinite; }
    .msg-flow-left { fill: none; stroke: #10b981; stroke-width: 2; stroke-dasharray: 6 6; animation: march-l 1.5s linear infinite; }
    .msg-flow-purple-right { fill: none; stroke: #8b5cf6; stroke-width: 2; stroke-dasharray: 6 6; animation: march-r 1.5s linear infinite; }
    .msg-flow-purple-left { fill: none; stroke: #8b5cf6; stroke-width: 2; stroke-dasharray: 6 6; animation: march-l 1.5s linear infinite; }
    
    .msg-text-blue { font-size: 11px; font-weight: bold; fill: #2563eb; }
    .msg-text-green { font-size: 11px; font-weight: bold; fill: #059669; }
    .msg-text-purple { font-size: 11px; font-weight: bold; fill: #6d28d9; }
    .note-text { font-size: 10.5px; fill: #64748b; }
    
    @keyframes march-r {
      to { stroke-dashoffset: -12; }
    }
    @keyframes march-l {
      to { stroke-dashoffset: 12; }
    }
  </style>

  <rect x="5" y="5" width="590" height="240" class="bg"/>
  
  <defs>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#3b82f6"/>
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#10b981"/>
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="#8b5cf6"/>
    </marker>
  </defs>

  <!-- Lifelines -->
  <line x1="150" y1="45" x2="150" y2="225" class="lifeline"/>
  <line x1="450" y1="45" x2="450" y2="225" class="lifeline"/>
  
  <rect x="90" y="20" width="120" height="26" class="node-box"/>
  <text x="150" y="37" text-anchor="middle" class="txt-node">Publisher</text>

  <rect x="390" y="20" width="120" height="26" class="node-box"/>
  <text x="450" y="37" text-anchor="middle" class="txt-node">Broker</text>

  <!-- Message 1 -->
  <line x1="150" y1="70" x2="450" y2="70" class="msg-line" marker-end="url(#arrow-blue)"/>
  <line x1="150" y1="70" x2="445" y2="70" class="msg-flow-right"/>
  <text x="300" y="63" text-anchor="middle" class="msg-text-blue">1. PUBLISH (PacketID: 2)</text>
  <text x="462" y="74" text-anchor="start" class="note-text">(จำ Packet ID ไว้ชั่วคราว)</text>

  <!-- Message 2 -->
  <line x1="450" y1="110" x2="150" y2="110" class="msg-line" marker-end="url(#arrow-green)"/>
  <line x1="450" y1="110" x2="155" y2="110" class="msg-flow-left"/>
  <text x="300" y="103" text-anchor="middle" class="msg-text-green">2. PUBREC (PacketID: 2)</text>
  <text x="138" y="114" text-anchor="end" class="note-text">(รับทราบและบล็อกข้อมูลซ้ำ)</text>

  <!-- Message 3 -->
  <line x1="150" y1="150" x2="450" y2="150" class="msg-line" marker-end="url(#arrow-purple)"/>
  <line x1="150" y1="150" x2="445" y2="150" class="msg-flow-purple-right"/>
  <text x="300" y="143" text-anchor="middle" class="msg-text-purple">3. PUBREL (PacketID: 2)</text>
  <text x="462" y="154" text-anchor="start" class="note-text">(ส่งข้อมูลหาผู้รับ / ปลดล็อก)</text>

  <!-- Message 4 -->
  <line x1="450" y1="190" x2="150" y2="190" class="msg-line" marker-end="url(#arrow-purple)"/>
  <line x1="450" y1="190" x2="155" y2="190" class="msg-flow-purple-left"/>
  <text x="300" y="183" text-anchor="middle" font-size="11px" font-weight="bold" fill="#6d28d9">4. PUBCOMP (PacketID: 2)</text>
  <text x="138" y="194" text-anchor="end" class="note-text">(เสร็จสิ้นกระบวนการแลกเปลี่ยน)</text>
</svg>
</div>
- **ขั้นตอน:**
  1. **PUBLISH (ส่ง):** ผู้ส่งส่งข้อความระบุ `Packet ID`
  2. **PUBREC (ตอบรับว่าได้รับ):** ผู้รับรับทราบการส่งและบันทึกข้อมูลไว้ แต่จะยังไม่กระจายไปยัง Subscriber โดยตอบรับด้วยแพ็กเก็ต `PUBREC` (Publish Received) กลับไป
  3. **PUBREL (แจ้งลบสถานะตัวส่ง):** เมื่อผู้ส่งได้รับ `PUBREC` จะตอบกลับด้วย `PUBREL` (Publish Release) เพื่อบอกให้ผู้รับเตรียมเผยแพร่ข้อความและลบเลขแพ็กเก็ตที่บันทึกไว้ได้
  4. **PUBCOMP (ยืนยันสิ้นสุดงาน):** ผู้รับกระจายข้อความเสร็จแล้ว ส่งสัญญาณ `PUBCOMP` (Publish Complete) กลับไปเพื่อบอกผู้ส่งว่าเสร็จสมบูรณ์ร้อยเปอร์เซ็นต์

### 9.1.4 คุณสมบัติพิเศษ

- **Retained Message** — Broker เก็บข้อความล่าสุดไว้ เมื่อมี Subscriber ใหม่จะได้รับข้อมูลทันทีโดยไม่ต้องรอ Publisher ส่งใหม่
- **Last Will and Testament (LWT)** — ข้อความที่ Client ฝากไว้กับ Broker ตั้งแต่ตอนเชื่อมต่อ หาก Client หลุดโดยไม่ปกติ Broker จะส่งข้อความนี้แจ้งเตือน เช่น `"ESP32-001 offline"`

> 💡 **LWT เหมาะมากสำหรับ IoT** — เพราะอุปกรณ์ในภาคสนามอาจหลุดเชื่อมต่อได้ตลอดเวลา การแจ้งเตือนอัตโนมัติช่วยให้ระบบรู้สถานะอุปกรณ์แม้ไม่ได้รับข้อมูล

---


## 9.2 ตารางเปรียบเทียบแบบเจาะลึก: HTTP/REST ปะทะ MQTT

การเลือกโพรโทคอลที่เหมาะสมมีผลโดยตรงต่อการเลือกแบตเตอรี่ ขนาดหน่วยความจำบอร์ด และค่าใช้จ่ายอินเทอร์เน็ตของโครงการ IoT ตารางด้านล่างเป็นการเปรียบเทียบเชิงวิศวกรรมระหว่าง HTTP/REST และ MQTT:

| เกณฑ์การพิจารณา | HTTP/REST | MQTT |
| :--- | :--- | :--- |
| **รูปแบบสถาปัตยกรรม (Architecture)** | **Request-Response (ดึง/ส่งแบบทิศทางเดียว)**<br>Client ต้องร้องขอก่อน เซิร์ฟเวอร์จึงตอบกลับ | **Publish-Subscribe (กระจายตามหัวข้อ)**<br>Broker เป็นตัวกลางจัดการข้อมูลผ่าน Topic |
| **ขนาดเมตาดาต้า (Header Overhead)** | **สูงมาก (300 - 1,000 ไบต์ต่อครั้ง)**<br>เนื่องจากใช้ข้อความ Text เช่น HTTP Headers, User-Agent | **ต่ำมาก (เริ่มต้นเพียง 2 ไบต์)**<br>จัดเก็บในรูปแบบไบนารีฟอร์แมตขนาดเล็กพิเศษ |
| **ความคงอยู่ของการเชื่อมต่อ (Persistence)** | **ไม่คงอยู่ (Stateless)**<br>สร้างและปิดการเชื่อมต่อ TCP บ่อยครั้ง (ยกเว้นใช้ Keep-Alive) | **คงอยู่ตลอดเวลา (Persistent)**<br>รักษาการเชื่อมต่อไว้ด้วยการส่งแพ็กเก็ต Ping ประหยัดเวลา Handshake |
| **ความหน่วงเวลา (Latency)** | **สูงปานกลาง**<br>ต้องเสียเวลาสร้าง TCP handshake และแลกเปลี่ยน Header ใหม่ทุกรอบ | **ต่ำมาก (Real-time)**<br>เนื่องจากท่อเชื่อมต่อ TCP เปิดค้างไว้แล้ว ส่งข้อมูลถึงทันที |
| **คุณภาพการบริการ (QoS Support)** | **ไม่มีในระดับแอปพลิเคชัน**<br>อาศัยการรับประกันของ TCP ด้านล่างเท่านั้น หากแอปหลุดต้องเขียนซ้ำเอง | **มี 3 ระดับในตัว (QoS 0, 1, 2)**<br>เลือกระดับความน่าเชื่อถือของการส่งข้อมูลได้อิสระ |
| **การใช้พลังงาน (Power Consumption)** | **สูง**<br>ต้องใช้ CPU ประมวลผลและเปิดวิทยุรับส่งบ่อยครั้งเนื่องจากข้อมูลมีขนาดใหญ่ | **ต่ำมาก**<br>ลด Overhead ส่งผลให้ชิปอยู่ในโหมด Deep Sleep ได้ยาวนานกว่า |
| **การส่งข้อมูลจาก Server ➔ Client** | **ทำได้ยาก**<br>ต้องใช้เทคนิค Polling (ถามซ้ำ ๆ) หรือเปลี่ยนไปใช้ WebSockets | **ทำได้ง่ายและเร็ว**<br>เซิร์ฟเวอร์สามารถ Publish ไปยัง Topic ที่อุปกรณ์ Subscribe ไว้ได้ทันที |
| **ปริมาณแบนด์วิดท์ (Bandwidth)** | **ใช้ปริมาณข้อมูลมาก**<br>ไม่เหมาะกับอุปกรณ์ที่ส่งผ่านซิมการ์ด 4G/5G ที่คิดตามปริมาณการรับส่งข้อมูล | **ใช้ข้อมูลน้อยมาก (ประหยัดสุด)**<br>เหมาะอย่างยิ่งกับการรับส่งข้อมูลที่นับเป็นกิโลไบต์/เดือน |
| **ความซับซ้อนของโครงสร้างระบบ** | **ต่ำ**<br>ไม่ต้องใช้ Broker เพิ่มเติม สามารถเรียกใช้ URL API ได้โดยตรง | **ปานกลาง**<br>ต้องติดตั้งและดูแลรักษาเซิร์ฟเวอร์ MQTT Broker (เช่น Mosquitto) |
| **ความเหมาะสมของหน้างาน** | 1. การร้องขอข้อมูลขนาดใหญ่เป็นรอบ ๆ<br>2. การเรียกใช้ Web Service API ภายนอก<br>3. การอัปโหลดเฟิร์มแวร์อุปกรณ์ (OTA) | 1. บอร์ดแบตเตอรี่ต่ำในพื้นที่ห่างไกล<br>2. ระบบแจ้งเตือนเซ็นเซอร์แบบ Real-time<br>3. มีอุปกรณ์รับส่งข้อมูลหลักร้อยถึงล้านตัวพร้อม ๆ กัน |

---


</div>

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">

## 9.3 Publish/Subscribe ผ่าน MQTT

โค้ดนี้เชื่อมต่อ MQTT Broker แบบสาธารณะ ส่งค่าอุณหภูมิ (Publish) และรับคำสั่งเปิด-ปิด LED (Subscribe) — ใช้ได้กับ Wokwi

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHTesp.h>

// --- ตั้งค่า Wi-Fi และ MQTT ---
const char* ssid        = "Wokwi-GUEST";
const char* password    = "";
const char* mqttBroker  = "broker.hivemq.com";
const int   mqttPort    = 1883;

// --- Topic ---
const char* pubTopic    = "ksu/me/lab301/temperature";
const char* subTopic    = "ksu/me/lab301/led";

WiFiClient   espClient;
PubSubClient mqtt(espClient);
DHTesp       dht;

const int DHT_PIN = 15;
const int LED_PIN = 2;

// --- Callback เมื่อได้รับข้อความ ---
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println("Received [" + String(topic) + "]: " + message);

  if (message == "ON")  digitalWrite(LED_PIN, HIGH);
  if (message == "OFF") digitalWrite(LED_PIN, LOW);
}

void reconnect() {
  while (!mqtt.connected()) {
    Serial.print("Connecting to MQTT...");
    // ตั้ง LWT: แจ้ง "offline" หากหลุด
    if (mqtt.connect("ESP32-ME-001", NULL, NULL,
                     "ksu/me/lab301/status", 1, true, "offline")) {
      Serial.println("connected!");
      mqtt.subscribe(subTopic);
      mqtt.publish("ksu/me/lab301/status", "online", true);
    } else {
      Serial.print("failed, rc=");
      Serial.println(mqtt.state());
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  dht.setup(DHT_PIN, DHTesp::DHT22);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  Serial.println("WiFi connected");

  mqtt.setServer(mqttBroker, mqttPort);
  mqtt.setCallback(mqttCallback);
}

void loop() {
  if (!mqtt.connected()) reconnect();
  mqtt.loop();

  static unsigned long lastSend = 0;
  if (millis() - lastSend > 5000) {
    float temp = dht.getTemperature();
    String payload = String(temp, 1);
    mqtt.publish(pubTopic, payload.c_str());
    Serial.println("Published: " + payload + " °C");
    lastSend = millis();
  }
}
```

#### อธิบายการทำงานของโค้ด PubSubClient MQTT (คำอธิบายรายบรรทัด)
- **การประกาศตัวแปรไคลเอนต์และตัวนำทางเครือข่าย:**
  ```cpp
  WiFiClient espClient;
  PubSubClient mqtt(espClient);
  ```
  เนื่องจาก `PubSubClient` จำเป็นต้องใช้ออบเจกต์เครือข่ายพื้นฐานในการจัดการ TCP Stream เราจึงสร้าง `WiFiClient` ส่งผ่านเข้าไปในคอนสตรัคเตอร์ของ MQTT ไคลเอนต์
- **ฟังก์ชันตอบกลับข้อความ (`void mqttCallback(char* topic, byte* payload, unsigned int length)`):**
  เป็นฟังก์ชัน Event Handler ที่ Broker จะเรียกใช้เมื่อมีข้อความใหม่ถูก Publish เข้ามาใน Topic ที่ ESP32 สมัครรับข้อมูล (`Subscribe`) ไว้ ตัวฟังก์ชันจะทำการวนลูปแปลงข้อมูลจาก byte array ในตัวแปร `payload` ออกมาเป็น String เพื่อเอาไปตรวจสอบเงื่อนไข เช่น เปิด-ปิดไฟ LED
- **การเชื่อมต่อและรักษาการทำงาน (`reconnect()`):**
  ```cpp
  mqtt.connect("ESP32-ME-001", NULL, NULL, "ksu/me/lab301/status", 1, true, "offline")
  ```
  ฟังก์ชันนี้จะเชื่อมต่อเข้ากับ Broker โดยมีการฝากข้อความ **Last Will and Testament (LWT)** ไว้กับเซิร์ฟเวอร์:
  - ชื่อหัวข้อแจ้งสถานะ: `ksu/me/lab301/status`
  - QoS: 1
  - Retain: true
  - ข้อความเมื่อหลุดกะทันหัน: `"offline"`
  - เมื่อสามารถเชื่อมต่อ Broker สำเร็จ บอร์ดจะส่งคำขอ `mqtt.subscribe(subTopic)` ทันที และส่งข้อความ `"online"` ไปยัง Topic สถานะเพื่อระบุว่าบอร์ดพร้อมทำงานแล้ว
- **ฟังก์ชันลูปการรันงานหลัก (`mqtt.loop()`):**
  ต้องเรียกใช้คำสั่งนี้ในฟังก์ชัน `loop()` เสมอ เนื่องจากทำหน้าที่จัดการการรับส่งข้อความในบัฟเฟอร์ คอยส่งสัญญาณ `PINGREQ` ไปยัง Broker เพื่อบอกว่าอุปกรณ์ยังทำงานอยู่ (Keep-Alive) และคอยกระตุ้นฟังก์ชัน `mqttCallback` เมื่อมีข้อความเข้า
- **การส่งข้อมูลแบบไม่หน่วงลูปหลัก (`millis() - lastSend > 5000`):**
  หลีกเลี่ยงการใช้คำสั่ง `delay()` ในลูปหลัก เพื่อไม่ให้โปรแกรมหยุดการทำงานชั่วขณะ ซึ่งจะขัดขวางการรับข้อความด่วนผ่านคำสั่ง `mqtt.loop()` โดยใช้การเช็คเวลารูปแบบ Millis ในการสั่งส่งข้อมูลอุณหภูมิ (Publish) ทุก ๆ 5 วินาทีแทน

---

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

## 9.4 สรุปประจำบทที่ 9 (Summary)

1. **สถาปัตยกรรม Publish-Subscribe** มีจุดเด่นคือการลดการผูกติดกัน (Decoupling) ของอุปกรณ์ส่งและรับข้อมูล โดยทำงานร่วมกันผ่านตัวกลางประสานข้อมูลกลางที่เรียกว่า **MQTT Broker**
2. **Topic (หัวข้อ)** เป็นกลไกหลักในการจำแนกเส้นทางการไหลของข้อความ มีรูปแบบโครงสร้างเป็นลำดับชั้นแบ่งระดับด้วยเครื่องหมายทับ `/` และรองรับการใช้สัญลักษณ์ Wildcard (`+` และ `#`) ในการฟิลเตอร์ดักจับหลายหัวข้อพร้อมกัน
3. **QoS (Quality of Service)** มี 3 ระดับช่วยรับประกันความเชื่อมั่นในการส่งข้อมูลตามลักษณะความสำคัญและคุณสมบัติแบนด์วิดท์เครือข่าย ได้แก่ QoS 0 (ส่งรอบเดียวไม่การันตี), QoS 1 (การันตีถึงอย่างน้อย 1 ครั้ง), และ QoS 2 (การันตีถึงเป๊ะ 1 ครั้งถ้วน)
4. **LWT (Last Will and Testament)** เป็นคุณสมบัติในการกำหนดฝากข้อความแจ้งเตือนสถานะขาดการเชื่อมต่อเอาไว้ล่วงหน้า ทำให้แอปพลิเคชันส่วนบนสามารถดักทราบสภาวะที่เกิดความล้มเหลวทางเครือข่ายของอุปกรณ์ปลายสนามได้รวดเร็ว

---

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 9.5 แบบฝึกหัดท้ายบทที่ 9 (Exercises)

**ข้อ 1:** จงอธิบายกลไกการทำหน้าที่ของ **MQTT Broker** ในการประมวลผลข้อความและส่งต่อให้กับ **Subscribers**
**ข้อ 2:** หากท่านกำหนด Topic การส่งสัญญาณเป็น `factory/buildingA/line1/sensor/temp` จงหาว่าหัวข้อดักสัญญาณ (Subscribed Topic) ต่อไปนี้สามารถดักจับข้อความได้หรือไม่ (ตอบ ได้ / ไม่ได้):
*   `factory/buildingA/+/sensor/temp`
*   `factory/buildingA/line1/sensor/#`
*   `factory/+/+/temp`
*   `factory/#`
**ข้อ 3:** ระดับคุณภาพบริการ QoS 1 และ QoS 2 มีกระบวนการส่งสัญญาณที่แตกต่างกันอย่างไร และแบบใดส่งผลให้ปริมาณการรับส่งสัญญาณในเครือข่ายแออัดมากกว่ากัน?
**ข้อ 4:** เพราะเหตุใดการเขียนโปรแกรมฝั่งผู้ใช้งาน (เช่น โค้ด ESP32) สำหรับรับข้อความจากภายนอกผ่าน MQTT จึงจำเป็นต้องอาศัยฟังก์ชันประเภท Callback (เช่น `mqttCallback`)?

</div>
