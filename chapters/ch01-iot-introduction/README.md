# Chapter 1: อินเทอร์เน็ตของสรรพสิ่งและสถาปัตยกรรม IoT

## Internet of Things & IoT Architecture

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

## 1.1 บทนำ: IoT คืออะไร

**อินเทอร์เน็ตของสรรพสิ่ง (Internet of Things: IoT)** คือแนวคิดที่อุปกรณ์ทางกายภาพ (Physical Objects) ทุกชนิด ไม่ว่าจะเป็นเครื่องจักร ยานพาหนะ เครื่องใช้ไฟฟ้า หรือเซนเซอร์ สามารถ **เชื่อมต่อเข้ากับเครือข่ายอินเทอร์เน็ต** เพื่อเก็บข้อมูล แลกเปลี่ยนข้อมูล และสั่งการทำงานได้โดยอัตโนมัติ โดยมีการแทรกแซงจากมนุษย์น้อยที่สุดหรือไม่มีเลย

คำว่า "Internet of Things" ถูกบัญญัติขึ้นครั้งแรกโดย **Kevin Ashton** ในปี ค.ศ. 1999 ขณะทำงานที่ Procter & Gamble โดยเสนอแนวคิดการใช้ RFID เพื่อติดตามสินค้าในห่วงโซ่อุปทาน (Supply Chain)

### แนวคิดหลักของ IoT

หัวใจสำคัญของ IoT ตั้งอยู่บนหลักการ **"ทุกสิ่งเชื่อมต่อกัน" (Everything is Connected)** ซึ่งประกอบด้วย 3 มิติ:

1. **ทุกสิ่ง (Any Thing)** — อุปกรณ์ทุกประเภทสามารถเชื่อมต่อได้ ตั้งแต่เซนเซอร์วัดอุณหภูมิขนาดเล็กไปจนถึงเครื่องจักรอุตสาหกรรมขนาดใหญ่
2. **ทุกที่ (Any Place)** — การเชื่อมต่อไม่ถูกจำกัดด้วยสถานที่ ไม่ว่าจะเป็นโรงงาน บ้าน หรือพื้นที่ห่างไกล
3. **ทุกเวลา (Any Time)** — ข้อมูลถูกส่งและรับได้ตลอด 24 ชั่วโมง ทำให้เกิดการตรวจสอบและควบคุมแบบเรียลไทม์ (Real-time Monitoring & Control)

> 💡 **เกร็ดความรู้:** ในปี ค.ศ. 2025 มีอุปกรณ์ IoT ที่เชื่อมต่ออยู่ทั่วโลกมากกว่า **18,000 ล้านเครื่อง** และคาดว่าจะเพิ่มขึ้นเป็นกว่า 25,000 ล้านเครื่องภายในปี ค.ศ. 2030 ซึ่งมากกว่าจำนวนประชากรโลกหลายเท่า

---

## 1.2 พัฒนาการของ IoT

IoT ไม่ได้เกิดขึ้นในชั่วข้ามคืน แต่เป็นวิวัฒนาการจากเทคโนโลยีหลายยุค ดังสรุปในตารางที่ 1.1

**ตารางที่ 1.1** พัฒนาการของเทคโนโลยีจากอินเทอร์เน็ตสู่ IoT

| ยุค | ช่วงเวลาโดยประมาณ | ลักษณะสำคัญ | ตัวอย่าง |
|---|---|---|---|
| **อินเทอร์เน็ต (Internet)** | ค.ศ. 1990–2000 | คอมพิวเตอร์เชื่อมต่อกันผ่านเครือข่าย เน้นการสื่อสารระหว่างคนกับคน | เว็บไซต์, อีเมล |
| **M2M (Machine-to-Machine)** | ค.ศ. 2000–2010 | เครื่องจักรสื่อสารกันโดยตรงผ่านเครือข่ายเฉพาะ ไม่จำเป็นต้องผ่านอินเทอร์เน็ต | ระบบ SCADA ในโรงงาน, ตู้ ATM |
| **IoT (Internet of Things)** | ค.ศ. 2010–ปัจจุบัน | อุปกรณ์หลากหลายเชื่อมต่อผ่านอินเทอร์เน็ต เน้นการเก็บและวิเคราะห์ข้อมูลบนคลาวด์ | บ้านอัจฉริยะ, สายรัดข้อมือสุขภาพ |
| **IIoT (Industrial IoT)** | ค.ศ. 2015–ปัจจุบัน | IoT ที่ออกแบบเฉพาะสำหรับอุตสาหกรรม เน้นความน่าเชื่อถือ ความปลอดภัย และการทำงานแบบเรียลไทม์ | โรงงานอัจฉริยะ, การบำรุงรักษาเชิงพยากรณ์ |

### 1.2.1 IIoT (Industrial IoT) คืออะไร?

**IIoT (อินเทอร์เน็ตของสรรพสิ่งสำหรับอุตสาหกรรม):** คือการนำเทคโนโลยี IoT มาใช้งานในภาคอุตสาหกรรม การผลิต โลจิสติกส์ และพลังงาน เพื่อเชื่อมต่อเครื่องจักร เซนเซอร์ และระบบควบคุมในระดับองค์กรเข้าด้วยกัน

**ข้อแตกต่างสำคัญระหว่าง IIoT และ IoT ตามบ้านเรือน (Consumer IoT):**
1. **ความเสถียรสูงสุด (High Reliability):** ระบบ IIoT ต้องสามารถทำงานต่อเนื่องตลอด 24 ชั่วโมง 7 วัน ห้ามเกิดระบบล่มเด็ดขาด (Zero Downtime) เนื่องจากการหยุดชะงักของสายการผลิตอาจหมายถึงความสูญเสียทางการเงินมหาศาล
2. **ความหน่วงต่ำ (Low Latency):** การควบคุมเครื่องจักรและหุ่นยนต์ต้องการการตัดสินใจและสั่งการแบบ Real-time ในระดับเสี้ยววินาที (มิลลิวินาที) หากข้อมูลส่งล่าช้าอาจทำให้ชิ้นงานเสียหายหรือเกิดอุบัติเหตุ
3. **ความปลอดภัยทางไซเบอร์ (Cybersecurity):** ข้อมูลในโรงงานอุตสาหกรรมเป็นความลับทางการค้าและเกี่ยวข้องกับความปลอดภัยด้านชีวิตของพนักงาน ระบบจึงต้องมีการเข้ารหัส (Encryption) และการป้องกันการแฮ็กเกอร์ขั้นสูงสุดในทุกจุดเชื่อมต่อ

**ตัวอย่างการใช้งาน:** โครงข่ายไฟฟ้าอัจฉริยะ (Smart Grid) ที่ปรับการจ่ายไฟอัตโนมัติ, ระบบหุ่นยนต์ประกอบรถยนต์อัตโนมัติ, หรือการใช้เซนเซอร์วัดความสั่นสะเทือนเพื่อทำ Predictive Maintenance

### 1.2.2 ปัญญาประดิษฐ์ในสรรพสิ่ง (AIoT - Artificial Intelligence of Things)

แนวโน้มที่สำคัญที่สุดในปัจจุบันคือการรวม AI เข้ากับ IoT (AIoT) ทำให้ระบบไม่เพียงแต่เก็บข้อมูลและแสดงผล แต่ยังสามารถเรียนรู้ คาดการณ์ และตัดสินใจด้วยตัวเองได้อย่างชาญฉลาดมากขึ้น ลดการพึ่งพามนุษย์ในการวิเคราะห์ข้อมูล

### 1.2.3 ฝาแฝดดิจิทัล (Digital Twin)

Digital Twin คือการสร้างโมเดลเสมือนของวัตถุหรือระบบทางกายภาพ (เช่น เครื่องจักรในโรงงาน) ขึ้นมาในรูปแบบดิจิทัล โดยรับข้อมูลอัปเดตสถานะแบบเรียลไทม์จากเซนเซอร์ IoT ทำให้วิศวกรสามารถจำลอง ทดสอบ และวิเคราะห์ปัญหาที่อาจเกิดขึ้นได้ล่วงหน้าโดยไม่ต้องหยุดการทำงานของเครื่องจักรจริง

### 1.2.4 จุดเปลี่ยนสำคัญ

- **RFID & Sensor Networks (1999–2005):** การระบุตัวตนวัตถุอัตโนมัติ ถือเป็นรากฐานของ IoT
- **สมาร์ตโฟนแพร่หลาย (2007–2012):** ทำให้ทุกคนมีอุปกรณ์เชื่อมต่ออินเทอร์เน็ตติดตัว
- **Cloud Computing ราคาถูกลง (2010–):** การประมวลผลและจัดเก็บข้อมูลจำนวนมหาศาลทำได้ง่ายขึ้น
- **AI & Edge Computing (2018–):** การประมวลผลข้อมูล ณ จุดเก็บข้อมูล ลดความล่าช้า เพิ่มประสิทธิภาพ

---

## 1.3 สถาปัตยกรรม IoT 4 ชั้น

### 1.3.1 ทฤษฎีและการไหลของข้อมูลระหว่างชั้น (Data Flow & Data Formatting)

ในการออกแบบระบบ IoT สิ่งสำคัญคือต้องเข้าใจวิธีที่ข้อมูลถูกแปลงรูปแบบ (Data Formatting) และส่งผ่าน (Data Flow) จากโลกกายภาพขึ้นไปยังแอปพลิเคชัน:

1. **ชั้นที่ 1: Perception Layer (ชั้นรับรู้/อุปกรณ์)**
   - **การแปลงสัญญาณ:** ข้อมูลเริ่มต้นจากการตรวจวัดค่าทางฟิสิกส์ (เช่น ความเร่ง, แรงดัน, อุณหภูมิ) ผ่านเซนเซอร์ ซึ่งจะแปลงการเปลี่ยนแปลงทางกายภาพเป็นสัญญาณไฟฟ้าแบบอนาล็อก (เช่น 0-10V, 4-20mA) หรือสัญญาณดิจิทัลระดับต่ำ
   - **การจัดรูปแบบข้อมูล:** ไมโครคอนโทรลเลอร์ (MCU) จะทำการแปลงสัญญาณอนาล็อกเป็นดิจิทัล (Analog-to-Digital Conversion: ADC) และอ่านค่าผ่านบัสสื่อสารความเร็วต่ำ เช่น **I2C** (Inter-Integrated Circuit), **SPI** (Serial Peripheral Interface) หรือ **UART** ข้อมูลในชั้นนี้จะอยู่ในรูปของสัญญาณดิบ (Raw Hex/Binary) หรือตัวแปรประเภททศนิยม (Float/Double) ในหน่วยความจำของ MCU
2. **ชั้นที่ 2: Network Layer (ชั้นเครือข่าย/การเชื่อมต่อ)**
   - **การจัดส่งข้อมูล:** อุปกรณ์ MCU หรือ Gateway ทำการแปลงและบรรจุ (Encapsulate) ข้อมูลดิบจากชั้นที่ 1 ให้อยู่ในรูปแบบโปรโตคอลระดับแอปพลิเคชัน (Application Layer Protocols) เช่น **MQTT (Message Queuing Telemetry Transport)**, **HTTP (Hypertext Transfer Protocol)** หรือ **CoAP**
   - **การจัดรูปแบบข้อมูลเครือข่าย:** ข้อมูลจะถูกแปลงเป็นสายอักขระ (String), ไบนารีบีบอัด (เช่น Protocol Buffers, CBOR) หรือข้อความ **JSON (JavaScript Object Notation)** จากนั้นจะถูกห่อหุ้มด้วย Transport Layer Header (TCP/UDP) และ Network Layer Header (IP Address ของต้นทางและปลายทาง) เพื่อส่งผ่านตัวกลางสื่อสาร เช่น Wi-Fi, Ethernet, Cellular หรือ LoRaWAN
3. **ชั้นที่ 3: Processing / Cloud Layer (ชั้นประมวลผล/คลาวด์)**
   - **การรับและคัดแยกข้อมูล:** โบรกเกอร์ (เช่น MQTT Broker) หรือระบบ Ingestion (เช่น Apache Kafka, AWS IoT Core) ทำการแกะแพ็กเก็ตข่ายงานเพื่อดึงข้อมูล Payload (เช่น JSON) ออกมา
   - **การประมวลผลและจัดเก็บ:** ข้อมูลจะถูกดึงโครงสร้าง (Parsed) และส่งไปยังเครื่องยนต์ประมวลผล (Stream/Batch Processing Engine) เพื่อทำการปรับสเกลค่า (Scaling), กรองข้อมูลที่ผิดพลาด (Filtering), และแปลงหน่วย จากนั้นจัดเก็บลงใน **Time-series Database** (เช่น InfluxDB, TimescaleDB) ซึ่งจัดรูปแบบโครงสร้างข้อมูลในรูปของ Time-stamp, Measurement Name, Tag Sets (ข้อมูลเมตา เช่น device_id) และ Field Sets (ค่าที่วัดได้)
4. **ชั้นที่ 4: Application Layer (ชั้นประยุกต์ใช้งาน)**
   - **การนำไปใช้:** ระบบจะนำเสนอข้อมูลผ่าน RESTful APIs หรือ WebSockets ไปยังแดชบอร์ดแสดงผล (Dashboard) หรือส่งต่อไปยังโมเดล AI/ML เพื่อการวิเคราะห์ขั้นสูง
   - **วงจรป้อนกลับ (Feedback Loop):** ข้อมูลตัดสินใจจากชั้นนี้สามารถส่งคำสั่งควบคุม (Control Command) ในรูปแบบ JSON หรือ Binary Payload ไหลย้อนกลับลงมาตามชั้นสถาปัตยกรรม (Application -> Cloud -> Network -> Actuator ใน Perception layer) เพื่อสั่งการทำงานของอุปกรณ์ (เช่น ปิดวาล์วฉุกเฉิน, ปรับความเร็วรอบมอเตอร์)

สถาปัตยกรรม IoT (IoT Architecture) เป็นกรอบแนวคิดที่อธิบายโครงสร้างการทำงานของระบบ IoT ทั้งหมด โดยรูปแบบที่นิยมใช้กันอย่างแพร่หลายคือ **สถาปัตยกรรม 4 ชั้น (4-Layer Architecture)** ซึ่งแบ่งตามหน้าที่การทำงานจากล่างขึ้นบน ดังนี้:

<div align="center" style="margin: 20px 0;">
<svg viewBox="0 0 760 450" width="100%" height="auto" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>สถาปัตยกรรม IoT 4 ชั้น: Perception, Network, Processing/Cloud และ Application</title>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&amp;display=swap');
      .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
      .layer { filter: drop-shadow(0 4px 6px rgba(15, 23, 42, 0.08)); transition: transform 0.2s ease-in-out; }
      .layer:hover { transform: scale(1.008); cursor: pointer; }
      .layer-1 { fill: url(#grad-perception); stroke: #0e7490; stroke-width: 1.5; }
      .layer-2 { fill: url(#grad-network); stroke: #0891b2; stroke-width: 1.5; }
      .layer-3 { fill: url(#grad-cloud); stroke: #0d9488; stroke-width: 1.5; }
      .layer-4 { fill: url(#grad-app); stroke: #10b981; stroke-width: 1.5; }
      .layer-title-text { font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 18px; font-weight: 700; fill: #ffffff; }
      .layer-desc-text { font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 13.5px; fill: #e2fbf0; opacity: 0.95; }
      .flow-line { fill: none; stroke: #cbd5e1; stroke-width: 2; stroke-dasharray: 4 6; }
      .flow-up { fill: none; stroke: #3b82f6; stroke-width: 3; stroke-dasharray: 10 10; animation: marchUp 1.5s linear infinite; }
      .flow-down { fill: none; stroke: #ef4444; stroke-width: 3; stroke-dasharray: 10 10; animation: marchDown 1.5s linear infinite; }
      .flow-label { font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }
      .footer-text { font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 12.5px; font-weight: 600; fill: #64748b; }
      @keyframes marchUp {
        to { stroke-dashoffset: -20; }
      }
      @keyframes marchDown {
        to { stroke-dashoffset: 20; }
      }
    </style>
    <linearGradient id="grad-app" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>
    <linearGradient id="grad-cloud" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
    <linearGradient id="grad-network" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0891b2" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <linearGradient id="grad-perception" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0e7490" />
      <stop offset="100%" stop-color="#0891b2" />
    </linearGradient>
  </defs>

  <rect x="5" y="5" width="750" height="440" class="bg"/>

  <!-- ลิงก์เชื่อมโยงกับ Motion Path -->
  <!-- เส้นทางการไหลของข้อมูลขึ้น (Data Uplink) -->
  <path id="path-data-up" d="M 35,385 L 35,45" fill="none" stroke="none"/>
  <path d="M 35,385 L 35,45" class="flow-line"/>
  <path d="M 35,385 L 35,45" class="flow-up"/>
  
  <circle r="4.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5">
    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 35,385 L 35,45" />
  </circle>
  <circle r="4.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" opacity="0.7">
    <animateMotion dur="2.5s" begin="0.8s" repeatCount="indefinite" path="M 35,385 L 35,45" />
  </circle>
  <circle r="4.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" opacity="0.4">
    <animateMotion dur="2.5s" begin="1.6s" repeatCount="indefinite" path="M 35,385 L 35,45" />
  </circle>
  <polygon points="35,35 31,47 39,47" fill="#3b82f6"/>
  <text x="22" y="215" fill="#3b82f6" class="flow-label" transform="rotate(-90 22 215)" text-anchor="middle">📡 ข้อมูลเซนเซอร์ส่งขึ้นคลาวด์ (Uplink Telemetry)</text>

  <!-- เส้นทางการสั่งการควบคุมลง (Control Downlink) -->
  <path id="path-control-down" d="M 725,45 L 725,385" fill="none" stroke="none"/>
  <path d="M 725,45 L 725,385" class="flow-line"/>
  <path d="M 725,45 L 725,385" class="flow-down"/>
  
  <circle r="4.5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5">
    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 725,45 L 725,385" />
  </circle>
  <circle r="4.5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" opacity="0.7">
    <animateMotion dur="2.5s" begin="1.25s" repeatCount="indefinite" path="M 725,45 L 725,385" />
  </circle>
  <polygon points="725,395 721,383 729,383" fill="#ef4444"/>
  <text x="738" y="215" fill="#ef4444" class="flow-label" transform="rotate(90 738 215)" text-anchor="middle">⚙️ คำสั่งควบคุมอุปกรณ์ไหลลง (Downlink Control)</text>

  <!-- ชั้นที่ 4: Application Layer -->
  <g class="layer" transform="translate(0, 0)">
    <rect x="60" y="25" width="640" height="80" rx="12" class="layer-4"/>
    <text x="85" y="58" class="layer-title-text">📱 ชั้นที่ 4: Application Layer (ชั้นประยุกต์ใช้งาน)</text>
    <text x="85" y="82" class="layer-desc-text" fill="#e0fdf4">แดชบอร์ดแสดงผล · เว็บแอปพลิเคชัน · ระบบแจ้งเตือนภัย (LINE Notify, Email)</text>
  </g>

  <!-- ชั้นที่ 3: Processing / Cloud Layer -->
  <g class="layer" transform="translate(0, 0)">
    <rect x="60" y="125" width="640" height="80" rx="12" class="layer-3"/>
    <text x="85" y="158" class="layer-title-text">☁️ ชั้นที่ 3: Processing / Cloud Layer (ชั้นประมวลผล)</text>
    <text x="85" y="182" class="layer-desc-text" fill="#e6fffa">การจัดเก็บฐานข้อมูลอนุกรมเวลา (InfluxDB) · การวิเคราะห์ด้วยแบบจำลอง AI/ML</text>
  </g>

  <!-- ชั้นที่ 2: Network / Connectivity Layer -->
  <g class="layer" transform="translate(0, 0)">
    <rect x="60" y="225" width="640" height="80" rx="12" class="layer-2"/>
    <text x="85" y="258" class="layer-title-text">📶 ชั้นที่ 2: Network Layer (ชั้นเครือข่ายและการสื่อสาร)</text>
    <text x="85" y="282" class="layer-desc-text" fill="#e0f7fc">โปรโตคอล (MQTT, HTTP, CoAP) · เครือข่ายไร้สาย Wi-Fi, LoRaWAN, Cellular, 5G</text>
  </g>

  <!-- ชั้นที่ 1: Perception / Device Layer -->
  <g class="layer" transform="translate(0, 0)">
    <rect x="60" y="325" width="640" height="80" rx="12" class="layer-1"/>
    <text x="85" y="358" class="layer-title-text">🔌 ชั้นที่ 1: Perception Layer (ชั้นรับรู้และอุปกรณ์)</text>
    <text x="85" y="382" class="layer-desc-text" fill="#e0f2fe">อุปกรณ์เซนเซอร์วัดค่ากายภาพ · ตัวกระทำ (Actuators, วาล์ว) · ไมโครคอนโทรลเลอร์</text>
  </g>

  <!-- คำบรรยายแผนภาพ -->
  <text x="380" y="428" class="footer-text" text-anchor="middle">แผนภาพที่ 1.1 สถาปัตยกรรม IoT 4 ชั้น แสดงการไหลของข้อมูลสองทิศทาง (Bi-directional Data Flow)</text>
</svg>
</div>

### 1.3.2 การเปรียบเทียบ Edge Computing กับ Cloud Computing

ในการออกแบบระบบ IIoT การเลือกว่าจะประมวลผลข้อมูลที่ใดระหว่าง Edge (ขอบเครือข่าย) กับ Cloud (ระบบคลาวด์ส่วนกลาง) มีผลกระทบอย่างมีนัยสำคัญต่อสมรรถนะของระบบ:

| คุณลักษณะ (Attributes) | Edge Computing (การประมวลผล ณ ขอบเครือข่าย) | Cloud Computing (การประมวลผลบนคลาวด์) |
| :--- | :--- | :--- |
| **ความหน่วงเวลา (Latency)** | **ต่ำมาก (1-10 ms)**<br>เนื่องจากวิเคราะห์และตัดสินใจภายในอุปกรณ์เกตเวย์หรือคอนโทรลเลอร์ที่ตั้งอยู่หน้างานโดยตรง เหมาะสำหรับระบบควบคุมแบบเรียลไทม์ (Closed-loop Control) | **สูงปานกลางถึงสูง (100-500+ ms)**<br>ขึ้นอยู่กับความเร็วการเชื่อมต่ออินเทอร์เน็ตและการส่งผ่านข้อมูลข้ามทวีป ไม่เหมาะกับงานที่ต้องตอบสนองในระดับมิลลิวินาที |
| **การใช้แถบความกว้าง (Bandwidth Use)** | **ต่ำมาก**<br>ส่งเฉพาะผลลัพธ์การประมวลผลหรือข้อมูลสรุป (เช่น ค่าเฉลี่ยรายนาติ) ไปยังคลาวด์ ไม่จำเป็นต้องส่งข้อมูลดิบความถี่สูงทั้งหมด ช่วยลดปริมาณการส่งข้อมูลอย่างมหาศาล | **สูงมาก**<br>จำเป็นต้องอัปโหลดข้อมูลดิบทั้งหมดจากอุปกรณ์เซนเซอร์ขึ้นคลาวด์อย่างต่อเนื่อง ทำให้เครือข่ายเกิดความหนาแน่นและมีค่าใช้จ่ายค่าแบนด์วิดท์อินเทอร์เน็ตที่สูง |
| **ความน่าเชื่อถือและการทำงานแบบออฟไลน์ (Reliability & Offline Operation)** | **สูงมาก**<br>ระบบยังคงสามารถประมวลผลและตัดสินใจควบคุมเครื่องจักรต่อไปได้ตามปกติแม้ว่าสัญญาณอินเทอร์เน็ตภายนอกจะขาดหายไป (Local Autonomy) | **ต่ำกว่า**<br>หากการเชื่อมต่ออินเทอร์เน็ตล่ม อุปกรณ์ปลายทางจะไม่สามารถส่งข้อมูลหรือรับคำสั่งตัดสินใจจากคลาวด์ได้ ซึ่งอาจทำให้ระบบหยุดทำงานทั้งหมด |
| **ความสามารถในการประมวลผลและจัดเก็บข้อมูล (Compute & Storage Capacity)** | **จำกัด**<br>อุปกรณ์เกตเวย์มีซีพียู แรม และพื้นที่จัดเก็บจำกัด ไม่สามารถเก็บข้อมูลย้อนหลังเป็นปี ๆ หรือประมวลผลโมเดล AI/ML ที่ซับซ้อนมาก ๆ ได้ | **ไม่จำกัด**<br>มีทรัพยากรประมวลผลระดับสูง (CPU/GPU/TPU) และระบบจัดเก็บข้อมูลขนาดใหญ่ รองรับการฝึกฝน (Training) โมเดล Machine Learning และการวิเคราะห์บิ๊กดาต้าย้อนหลัง |


**ตารางที่ 1.2** หน้าที่และเทคโนโลยีของสถาปัตยกรรม IoT แต่ละชั้น

| ชั้น (Layer) | หน้าที่หลัก | เทคโนโลยี / ตัวอย่าง |
|---|---|---|
| **ชั้นที่ 1: Perception / Device** | เก็บข้อมูลจากโลกกายภาพผ่านเซนเซอร์ และสั่งการอุปกรณ์ผ่านตัวกระทำ (Actuator) | เซนเซอร์อุณหภูมิ (DHT22), เซนเซอร์แรงดัน, เซนเซอร์ความสั่นสะเทือน, RFID, กล้อง, มอเตอร์, วาล์ว |
| **ชั้นที่ 2: Network / Connectivity** | ส่งข้อมูลจากอุปกรณ์ไปยังชั้นประมวลผลผ่านเครือข่ายสื่อสาร | Wi-Fi, Bluetooth, Zigbee, LoRa, NB-IoT, 5G, Ethernet, MQTT, HTTP |
| **ชั้นที่ 3: Processing / Cloud** | ประมวลผล วิเคราะห์ และจัดเก็บข้อมูลจำนวนมาก รวมถึง Edge Computing | AWS IoT, Azure IoT Hub, Google Cloud IoT, Apache Kafka, ฐานข้อมูล Time-series (InfluxDB) |
| **ชั้นที่ 4: Application** | แสดงผลข้อมูล ควบคุมอุปกรณ์ และให้บริการผู้ใช้งานผ่านอินเทอร์เฟซ | แดชบอร์ด (Grafana, Node-RED Dashboard), แอปมือถือ, ระบบแจ้งเตือน, ระบบ ERP |

### การไหลของข้อมูลในระบบ IoT

1. **เซนเซอร์** ตรวจวัดค่าทางกายภาพ (เช่น อุณหภูมิ ความสั่นสะเทือน)
2. **ไมโครคอนโทรลเลอร์** อ่านค่าจากเซนเซอร์ แปลงเป็นข้อมูลดิจิทัล
3. **เครือข่าย** ส่งข้อมูลไปยังเกตเวย์หรือคลาวด์
4. **คลาวด์/เซิร์ฟเวอร์** ประมวลผล วิเคราะห์ และจัดเก็บ
5. **แอปพลิเคชัน** แสดงผลให้ผู้ใช้ หรือสั่งการกลับไปยังอุปกรณ์ (Feedback Loop)

---

## 1.4 องค์ประกอบของระบบ IoT

ระบบ IoT ที่สมบูรณ์ประกอบด้วยองค์ประกอบหลัก 7 ส่วน ซึ่งทำงานร่วมกันเป็นห่วงโซ่ ดังตารางที่ 1.3

**ตารางที่ 1.3** องค์ประกอบของระบบ IoT

| องค์ประกอบ | คำอธิบาย | ตัวอย่าง |
|---|---|---|
| **1. เซนเซอร์ (Sensor)** | อุปกรณ์ตรวจวัดค่าทางกายภาพ แปลงเป็นสัญญาณไฟฟ้า | DHT22 (อุณหภูมิ/ความชื้น), MPU6050 (ความเร่ง/ไจโรสโคป), Load Cell (แรง/น้ำหนัก) |
| **2. ตัวกระทำ (Actuator)** | อุปกรณ์ที่รับคำสั่งแล้วทำให้เกิดการเปลี่ยนแปลงทางกายภาพ | มอเตอร์ไฟฟ้า, โซลินอยด์วาล์ว, รีเลย์, ฮีตเตอร์ |
| **3. ไมโครคอนโทรลเลอร์ (Microcontroller: MCU)** | หน่วยประมวลผลขนาดเล็กที่อ่านค่าเซนเซอร์ ประมวลผลเบื้องต้น และส่งข้อมูล | Arduino Uno, ESP32, STM32, Raspberry Pi Pico |
| **4. เกตเวย์ (Gateway)** | อุปกรณ์ตัวกลางที่เชื่อมต่อระหว่างเครือข่ายท้องถิ่นกับอินเทอร์เน็ต แปลงโปรโตคอล | Raspberry Pi, อุปกรณ์ LoRa Gateway, เราเตอร์อุตสาหกรรม |
| **5. เครือข่าย (Network)** | โครงสร้างพื้นฐานสำหรับรับ-ส่งข้อมูลระหว่างอุปกรณ์กับคลาวด์ | Wi-Fi, LoRaWAN, NB-IoT, 5G, Bluetooth LE |
| **6. คลาวด์ (Cloud Platform)** | แพลตฟอร์มสำหรับจัดเก็บ ประมวลผล และวิเคราะห์ข้อมูล | AWS IoT Core, Azure IoT Hub, Blynk, Google Cloud IoT |
| **7. แอปพลิเคชัน (Application)** | ซอฟต์แวร์ที่ผู้ใช้งานโต้ตอบด้วย เพื่อดูข้อมูลและควบคุมระบบ | แดชบอร์ดบนเว็บ, แอปมือถือ, ระบบแจ้งเตือนอัตโนมัติ |

### ตัวอย่างสถานการณ์จริง

ลองนึกภาพระบบ IoT สำหรับ **ตรวจสอบสภาพปั๊มน้ำในโรงงาน**:

1. **เซนเซอร์ความสั่นสะเทือน (Vibration Sensor)** ติดที่ตัวปั๊ม ตรวจวัดความสั่นทุก 1 วินาที
2. **ESP32** อ่านค่าความสั่น ส่งข้อมูลผ่าน **Wi-Fi** ด้วยโปรโตคอล **MQTT**
3. **MQTT Broker** (เช่น Mosquitto) บนคลาวด์รับข้อมูลแล้วส่งต่อไปยัง **ฐานข้อมูล InfluxDB**
4. **Grafana Dashboard** แสดงกราฟความสั่นสะเทือนแบบเรียลไทม์
5. หากค่าเกินขีดจำกัด → ระบบ **แจ้งเตือนอัตโนมัติ** ผ่าน LINE Notify ไปยังวิศวกรซ่อมบำรุง

### 1.4.1 ตัวอย่าง JSON Message Payload และโครงสร้างการส่งข้อมูล (Complete JSON Payload Example)

เพื่อความเข้าใจในการทำงานจริงในชั้น Network และ Processing ต่อไปนี้คือรูปแบบตัวอย่างข้อความ JSON ที่ใช้ส่งข้อมูลจากเซนเซอร์ตรวจวัดสภาพเครื่องจักรในอุตสาหกรรม

#### โครงสร้าง Payload
ตัวอย่างข้อความ JSON ที่ถูกส่งจากอุปกรณ์ตรวจวัดความสั่นสะเทือนอัจฉริยะ (Smart Vibration Sensor) ไปยังหัวข้อ MQTT `factory/line1/pump3/telemetry`:

```json
{
  "device_id": "VIB-SENS-PUMP003",
  "timestamp": "2026-06-22T12:59:47.125Z",
  "sequence_number": 10452,
  "telemetry": {
    "vibration_x_rms": 2.45,
    "vibration_y_rms": 1.89,
    "vibration_z_rms": 4.12,
    "peak_acceleration_g": 1.25,
    "temperature_celsius": 68.30
  },
  "diagnostics": {
    "battery_percent": 94.5,
    "wifi_rssi_dbm": -67,
    "system_status": "NORMAL"
  }
}
```

**คำอธิบายฟิลด์ข้อมูลใน JSON:**
*   `device_id`: รหัสประจำตัวที่ไม่ซ้ำกันของเซนเซอร์ สำหรับระบุว่าข้อมูลมาจากจุดใดในโรงงาน
*   `timestamp`: วันและเวลาที่ตรวจวัดข้อมูลจริง รูปแบบตามมาตรฐานสากล ISO 8601 ที่มีความละเอียดระดับมิลลิวินาทีและระบุเขตเวลาแบบ UTC (`Z`)
*   `sequence_number`: หมายเลขลำดับของข้อความเพื่อป้องกันและตรวจสอบกรณีข้อมูลสูญหายระหว่างส่ง
*   `telemetry`: กลุ่มข้อมูลทางวิศวกรรมที่ตรวจวัดได้จากอุปกรณ์
    *   `vibration_x_rms` / `y_rms` / `z_rms`: ค่าเฉลี่ยกำลังสอง (Root Mean Square) ของความเร็วในการสั่นสะเทือนใน 3 แนวแกน มีหน่วยเป็น มิลลิเมตรต่อวินาที (mm/s)
    *   `peak_acceleration_g`: ค่าความเร่งสูงสุดที่เซนเซอร์ตรวจวัดได้ มีหน่วยเป็นเท่าของแรงโน้มถ่วงโลก (g)
    *   `temperature_celsius`: อุณหภูมิของตัวตลับลูกปืนปั๊ม มีหน่วยเป็น องศาเซลเซียส (°C)
*   `diagnostics`: ข้อมูลสถานะของตัวอุปกรณ์เอง เพื่อการบำรุงรักษาอุปกรณ์ IoT เช่น แบตเตอรี่ ความแรงสัญญาณ และสถานะระบบ

#### โค้ดตัวอย่างการถอดรหัสและการประมวลผล (Python Parsing Script)
เมื่อข้อมูล JSON ถูกส่งมาถึงคลาวด์หรือเซิร์ฟเวอร์ด้วยโปรโตคอล MQTT โปรแกรมเมอร์จะใช้ภาษาคอมพิวเตอร์ในการแปลงข้อความตัวอักษรกลับมาเป็นวัตถุ (Parsing) และวิเคราะห์เงื่อนไขขีดจำกัดความปลอดภัย (Threshold Checking)

```python
import json

# สมมติว่าได้รับข้อความดิบผ่านโปรโตคอล MQTT (ข้อมูลอยู่ในรูปแบบ String)
raw_mqtt_payload = """
{
  "device_id": "VIB-SENS-PUMP003",
  "timestamp": "2026-06-22T12:59:47.125Z",
  "sequence_number": 10452,
  "telemetry": {
    "vibration_x_rms": 2.45,
    "vibration_y_rms": 1.89,
    "vibration_z_rms": 4.12,
    "peak_acceleration_g": 1.25,
    "temperature_celsius": 68.30
  },
  "diagnostics": {
    "battery_percent": 94.5,
    "wifi_rssi_dbm": -67,
    "system_status": "NORMAL"
  }
}
"""

def process_sensor_data(raw_payload):
    try:
        # 1. แปลงโครงสร้างข้อความ JSON String ให้เป็น Python Dictionary (Parsing)
        data = json.loads(raw_payload)
        
        # 2. ดึงค่าตัวแปรวิศวกรรมที่ต้องการตรวจสอบ
        device_id = data["device_id"]
        timestamp = data["timestamp"]
        vib_z = data["telemetry"]["vibration_z_rms"]
        temp = data["telemetry"]["temperature_celsius"]
        
        print(f"📊 ได้รับข้อมูลจากอุปกรณ์: {device_id} ณ เวลา: {timestamp}")
        print(f"   > ความสั่นแนวแกน Z: {vib_z} mm/s | อุณหภูมิ: {temp} °C")
        
        # 3. กำหนดขีดจำกัดความปลอดภัยเพื่อแจ้งเตือน (Threshold Rules)
        # อ้างอิงตามมาตรฐาน ISO 10816 (ความสั่นปั๊มไม่ควรเกิน 4.5 mm/s)
        VIBRATION_LIMIT = 4.5
        TEMPERATURE_LIMIT = 75.0
        
        # 4. การตัดสินใจเชิงตรรกะ (Logic Processing)
        if vib_z > VIBRATION_LIMIT:
            print(f"⚠️ [WARNING] อุปกรณ์ {device_id} สั่นสะเทือนสูงผิดปกติ: {vib_z} mm/s (ขีดจำกัด {VIBRATION_LIMIT} mm/s)")
            # ในระบบจริง จะส่ง API ไปยัง LINE Notify หรือระบบแจ้งซ่อมต่อที่นี่
            
        if temp > TEMPERATURE_LIMIT:
            print(f"🔥 [CRITICAL] อุณหภูมิตลับลูกปืนสูงเกินเกณฑ์: {temp} °C (ขีดจำกัด {TEMPERATURE_LIMIT} °C)")
            
        if vib_z <= VIBRATION_LIMIT and temp <= TEMPERATURE_LIMIT:
            print("✅ สถานะเครื่องจักร: ปกติ")
            
    except json.JSONDecodeError as e:
        print(f"❌ รูปแบบข้อมูล JSON ผิดพลาด: {e}")
    except KeyError as e:
        print(f"❌ ไม่พบฟิลด์ข้อมูลที่ต้องการ: {e}")

# เรียกใช้งานฟังก์ชัน
process_sensor_data(raw_mqtt_payload)
```

---

## 1.5 การประยุกต์ใช้ IoT ในงานวิศวกรรมเครื่องกลและอุตสาหกรรม

IoT มีบทบาทสำคัญอย่างยิ่งในวงการวิศวกรรมเครื่องกลและอุตสาหกรรมการผลิต โดยเฉพาะในบริบทของ **อุตสาหกรรม 4.0 (Industry 4.0)** ซึ่งเป็นการปฏิวัติอุตสาหกรรมครั้งที่ 4 ที่เน้นการบูรณาการระบบไซเบอร์-กายภาพ (Cyber-Physical Systems: CPS) เข้ากับการผลิต

### 1.5.1 โรงงานอัจฉริยะ (Smart Factory)

โรงงานอัจฉริยะคือโรงงานที่ใช้ IoT, AI และระบบอัตโนมัติทำงานร่วมกันเพื่อ:

- **ติดตามสายการผลิตแบบเรียลไทม์** — เซนเซอร์ติดตั้งตามจุดต่าง ๆ ของสายการผลิต ส่งข้อมูลสถานะเครื่องจักร อัตราการผลิต และคุณภาพชิ้นงาน
- **ปรับแต่งกระบวนการอัตโนมัติ** — ระบบ AI วิเคราะห์ข้อมูลจากเซนเซอร์แล้วปรับค่าพารามิเตอร์การผลิต (เช่น ความเร็วรอบ อุณหภูมิ) ให้เหมาะสม
- **ลดของเสีย (Waste Reduction)** — ตรวจจับชิ้นงานบกพร่องได้เร็วขึ้น ลดอัตราของเสียในกระบวนการ

### 1.5.2 การบำรุงรักษาเชิงพยากรณ์ (Predictive Maintenance)

เป็นหนึ่งในการประยุกต์ใช้ IoT ที่ทรงพลังที่สุดสำหรับวิศวกรเครื่องกล:

- **หลักการ:** ติดตั้งเซนเซอร์ (ความสั่น อุณหภูมิ เสียง กระแสไฟฟ้า) ที่เครื่องจักร → เก็บข้อมูลต่อเนื่อง → ใช้ Machine Learning วิเคราะห์แนวโน้ม → พยากรณ์ว่าชิ้นส่วนใดจะเสียหายเมื่อใด
- **ข้อดี:** ลดเวลาหยุดเครื่องที่ไม่ได้วางแผน (Unplanned Downtime) ได้ถึง 30-50% และลดค่าใช้จ่ายในการซ่อมบำรุงได้ 20-40%

**ตัวอย่างเป็นรูปธรรม:** โรงงานผลิตชิ้นส่วนยานยนต์ ติดเซนเซอร์ความสั่นสะเทือนที่ตลับลูกปืน (Bearing) ของมอเตอร์สายพานลำเลียง เมื่อค่าความสั่นเพิ่มขึ้นเกินเกณฑ์ปกติ ระบบจะวิเคราะห์แนวโน้มและแจ้งเตือนให้เปลี่ยนตลับลูกปืนล่วงหน้า 2 สัปดาห์ก่อนที่จะเสียหาย

#### กรณีศึกษาทางวิศวกรรม: การบำรุงรักษาเชิงพยากรณ์สำหรับปั๊มหอยโข่ง (Industrial Case Study: Predictive Maintenance for Centrifugal Pump)

ในการออกแบบระบบตรวจสอบตลับลูกปืนปั๊มหอยโข่ง (Centrifugal Pump Bearing Monitoring) ในโรงงานผลิตปิโตรเคมี มีปั๊มหอยโข่งขนาดใหญ่ที่ใช้ส่งผ่านสารเคมีเหลวอย่างต่อเนื่อง ความเสียหายของตลับลูกปืน (Bearing Failure) จะทำให้ปั๊มล็อกกะทันหัน ซึ่งก่อให้เกิดความเสียหายร้ายแรงต่อระบบท่อและเกิด Unplanned Downtime

การออกแบบระบบ IoT ตรวจสอบสภาพ:
1. **Perception Layer:** ติดตั้งเซนเซอร์วัดความสั่นความละเอียดสูงแบบ Piezoelectric Accelerometer บน Bearing Housing ทั้งฝั่งมอเตอร์และตัวปั๊ม และเซนเซอร์วัดอุณหภูมิ RTD PT100 สอดเข้ารูวัดอุณหภูมิของแบริ่ง
2. **Edge Processing Layer (อุปกรณ์ประมวลผลส่วนขอบ):** ใช้เกตเวย์อุตสาหกรรมที่มีชิปประมวลผล ARM Cortex-A (เช่น Raspberry Pi Compute Module 4 ในตัวถังเกรดอุตสาหกรรม) ต่อเชื่อมสายสัญญาณอะนาล็อกจากเซนเซอร์ผ่านการ์ดโมดูลแปลงสัญญาณความเร็วสูง (High-speed ADC Shield)
3. **Network Layer:** เกตเวย์สื่อสารกับเซิร์ฟเวอร์ของโรงงานผ่านระบบ Industrial Wi-Fi 2.4 GHz/5 GHz ครอบทับด้วยโปรโตคอลความปลอดภัย WPA3 Enterprise
4. **Processing / Cloud Layer:** ข้อมูลถูกเก็บลงในฐานข้อมูล InfluxDB บนคลาวด์ส่วนกลาง และเชื่อมต่อกับ Grafana เพื่อทำแดชบอร์ดติดตามค่าแนวโน้มสุขภาพเครื่องจักร
5. **Application Layer:** แสดงผลข้อมูลและแจ้งเตือนเมื่อตรวจพบความผิดปกติผ่านทางแดชบอร์ดและช่องทางการติดต่อสื่อสาร เช่น LINE Notify

<div align="center" style="margin: 20px 0;">
<svg viewBox="0 0 840 760" width="100%" height="auto" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>สถาปัตยกรรม IoT 5 ชั้น สำหรับการบำรุงรักษาเชิงพยากรณ์ปั๊มหอยโข่ง</title>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&amp;display=swap');
      .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
      .layer { filter: drop-shadow(0 4px 6px rgba(15, 23, 42, 0.08)); transition: transform 0.2s ease-in-out; }
      .layer:hover { transform: scale(1.005); cursor: pointer; }
      .layer-5 { fill: url(#grad5); stroke: #10b981; stroke-width: 1.5; }
      .layer-4 { fill: url(#grad4); stroke: #0d9488; stroke-width: 1.5; }
      .layer-3 { fill: url(#grad3); stroke: #0891b2; stroke-width: 1.5; }
      .layer-2 { fill: url(#grad2); stroke: #0e7490; stroke-width: 1.5; }
      .layer-1 { fill: url(#grad1); stroke: #0369a1; stroke-width: 1.5; }
      .layer-title { font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 15px; font-weight: 700; fill: #ffffff; }
      .layer-sub { font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 12px; fill: #ffffff; opacity: 0.9; }
      .box-rect { fill: rgba(255, 255, 255, 0.12); stroke: rgba(255, 255, 255, 0.25); stroke-width: 1.2; transition: fill 0.2s; }
      .box-rect:hover { fill: rgba(255, 255, 255, 0.22); }
      .box-text { font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 11px; font-weight: 600; fill: #ffffff; }
      .flow-text { font-family: 'IBM Plex Sans Thai', sans-serif; font-size: 11px; font-weight: 600; fill: #475569; }
      .pump-impeller { animation: spin 1.2s linear infinite; }
      .wifi-wave { fill: none; stroke: #0891b2; stroke-width: 1.5; opacity: 0.2; }
      .wifi-1 { animation: wifiFlash 1.5s infinite 0s; }
      .wifi-2 { animation: wifiFlash 1.5s infinite 0.3s; }
      .wifi-3 { animation: wifiFlash 1.5s infinite 0.6s; }
      .alarm-green { animation: greenGlow 2s infinite; }
      .alarm-green-ring { animation: ringPulse 2s infinite; transform-origin: 0px 0px; }
      .alarm-red { animation: redGlow 1s infinite; }
      .alarm-red-ring { animation: ringPulse 1s infinite; transform-origin: 0px 0px; }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes wifiFlash {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; stroke: #06b6d4; }
      }
      @keyframes greenGlow {
        0%, 100% { fill: #10b981; filter: drop-shadow(0 0 1px rgba(16,185,129,0.5)); }
        50% { fill: #34d399; filter: drop-shadow(0 0 5px rgba(52,211,153,0.9)); }
      }
      @keyframes redGlow {
        0%, 100% { fill: #ef4444; filter: drop-shadow(0 0 1px rgba(239,68,68,0.5)); }
        50% { fill: #f87171; filter: drop-shadow(0 0 7px rgba(248,113,113,0.9)); }
      }
      @keyframes ringPulse {
        0% { transform: scale(0.6); opacity: 1; }
        100% { transform: scale(1.4); opacity: 0; }
      }
    </style>
    <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#0f766e" />
    </linearGradient>
    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0891b2" />
      <stop offset="100%" stop-color="#0e7490" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0e7490" />
      <stop offset="100%" stop-color="#155e75" />
    </linearGradient>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#075985" />
    </linearGradient>
  </defs>

  <rect x="5" y="5" width="830" height="750" class="bg"/>

  <!-- ==================== ชั้นที่ 5: Application Layer ==================== -->
  <g class="layer">
    <rect x="60" y="20" width="720" height="110" rx="12" class="layer-5"/>
    <text x="90" y="46" class="layer-title">📱 ชั้นที่ 5: Application Layer</text>
    <text x="90" y="60" class="layer-sub">แสดงผลข้อมูลแบบเรียลไทม์และระบบแจ้งเตือนภัย</text>
    
    <!-- Alarm Lights -->
    <g transform="translate(670, 48)">
      <circle cx="0" cy="0" r="7" class="alarm-green"/>
      <circle cx="0" cy="0" r="12" fill="none" stroke="#10b981" stroke-width="1.5" class="alarm-green-ring"/>
      <text x="-12" y="3.5" font-size="10.5" fill="#ffffff" text-anchor="end" font-weight="700">ปกติ</text>
    </g>
    <g transform="translate(735, 48)">
      <circle cx="0" cy="0" r="7" class="alarm-red"/>
      <circle cx="0" cy="0" r="12" fill="none" stroke="#ef4444" stroke-width="1.5" class="alarm-red-ring"/>
      <text x="-12" y="3.5" font-size="10.5" fill="#ffffff" text-anchor="end" font-weight="700">เตือนภัย</text>
    </g>
    
    <!-- Grafana Box -->
    <rect x="80" y="74" width="330" height="36" rx="6" class="box-rect"/>
    <text x="245" y="96" class="box-text" text-anchor="middle">Grafana Dashboard (วิเคราะห์แนวโน้มความสั่นสะสม)</text>
    
    <!-- Notification Box -->
    <rect x="430" y="74" width="330" height="36" rx="6" class="box-rect"/>
    <text x="595" y="96" class="box-text" text-anchor="middle">LINE Notify / Email API (แจ้งเตือนเมื่อสุขภาพปั๊มต่ำกว่าเกณฑ์)</text>
  </g>

  <!-- ==================== ลูกศรเชื่อม 4 -> 5 ==================== -->
  <g stroke="#94a3b8" stroke-width="2" fill="#94a3b8">
    <line x1="410" y1="170" x2="410" y2="135"/>
    <polygon points="410,130 406,142 414,142"/>
  </g>
  <text x="425" y="153" class="flow-text">📊 คิวรีข้อมูลเรียลไทม์ (REST API / WebSockets)</text>
  <circle r="4" fill="#10b981" stroke="#ffffff" stroke-width="1">
    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 410,170 L 410,135" />
  </circle>

  <!-- ==================== ชั้นที่ 4: Processing / Cloud Layer ==================== -->
  <g class="layer">
    <rect x="60" y="170" width="720" height="110" rx="12" class="layer-4"/>
    <text x="90" y="196" class="layer-title">☁️ ชั้นที่ 4: Processing / Cloud Layer</text>
    <text x="90" y="210" class="layer-sub">จัดเก็บและประมวลผลข้อมูล Time-Series พร้อมวิเคราะห์ด้วย AI</text>
    
    <!-- MQTT & Parser Box -->
    <rect x="80" y="222" width="260" height="38" rx="6" class="box-rect"/>
    <text x="210" y="245" class="box-text" text-anchor="middle">MQTT Broker &amp; Parsing Engine (Python)</text>

    <!-- Split Arrow inside Layer 4 -->
    <g stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="rgba(255,255,255,0.4)">
      <line x1="340" y1="241" x2="365" y2="241"/>
      <line x1="365" y1="230" x2="365" y2="252"/>
      <line x1="365" y1="230" x2="385" y2="230"/>
      <polygon points="385,230 379,227 379,233"/>
      <line x1="365" y1="252" x2="385" y2="252"/>
      <polygon points="385,252 379,249 379,255"/>
    </g>

    <!-- InfluxDB Box -->
    <rect x="390" y="218" width="370" height="20" rx="4" class="box-rect"/>
    <text x="575" y="232" class="box-text" text-anchor="middle" font-size="10px">Time-Series DB (InfluxDB)</text>
    
    <!-- ML Model Box -->
    <rect x="390" y="242" width="370" height="20" rx="4" class="box-rect"/>
    <text x="575" y="256" class="box-text" text-anchor="middle" font-size="10px">ML Model (Anomaly Detection AI)</text>
  </g>

  <!-- ==================== ลูกศรเชื่อม 3 -> 4 ==================== -->
  <g stroke="#94a3b8" stroke-width="2" fill="#94a3b8">
    <line x1="410" y1="320" x2="410" y2="285"/>
    <polygon points="410,280 406,292 414,292"/>
  </g>
  <text x="425" y="303" class="flow-text">☁️ ส่งต่อแพ็กเก็ตข้อมูลอินเทอร์เน็ต (IP Packets)</text>
  <circle r="4" fill="#14b8a6" stroke="#ffffff" stroke-width="1">
    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 410,320 L 410,285" />
  </circle>

  <!-- ==================== ชั้นที่ 3: Network Layer ==================== -->
  <g class="layer">
    <rect x="60" y="320" width="720" height="110" rx="12" class="layer-3"/>
    <text x="90" y="346" class="layer-title">📶 ชั้นที่ 3: Network Layer</text>
    <text x="90" y="360" class="layer-sub">เครือข่ายสื่อสารไร้สายและความปลอดภัยเกรดอุตสาหกรรม</text>
    
    <!-- Wireless AP Box -->
    <rect x="80" y="374" width="200" height="36" rx="6" class="box-rect"/>
    <text x="180" y="396" class="box-text" text-anchor="middle">Wireless Access Point</text>

    <!-- Arrow AP -> Router -->
    <g stroke="rgba(255,255,255,0.4)" stroke-width="2" fill="rgba(255,255,255,0.4)">
      <line x1="280" y1="392" x2="310" y2="392"/>
      <polygon points="310,392 302,388 302,396"/>
    </g>

    <!-- Local Router Box -->
    <rect x="310" y="374" width="200" height="36" rx="6" class="box-rect"/>
    <text x="410" y="396" class="box-text" text-anchor="middle">Local Router</text>

    <!-- Arrow Router -> Firewall -->
    <g stroke="rgba(255,255,255,0.4)" stroke-width="2" fill="rgba(255,255,255,0.4)">
      <line x1="510" y1="392" x2="540" y2="392"/>
      <polygon points="540,392 532,388 532,396"/>
    </g>

    <!-- Firewall Box -->
    <rect x="540" y="374" width="220" height="36" rx="6" class="box-rect"/>
    <text x="650" y="396" class="box-text" text-anchor="middle">Industrial Firewall</text>
  </g>

  <!-- ==================== ลูกศรเชื่อม 2 -> 3 ==================== -->
  <g stroke="#94a3b8" stroke-width="2" fill="#94a3b8">
    <line x1="410" y1="470" x2="410" y2="435"/>
    <polygon points="410,430 406,442 414,442"/>
  </g>
  <text x="425" y="453" class="flow-text">📶 Wi-Fi / MQTT (Topic: pump3/telemetry)</text>
  
  <!-- Flashing Wi-Fi waves -->
  <g class="wifi-signal" transform="translate(410, 448)">
    <path d="M -4,-2 A 6,6 0 0,1 4,-2" class="wifi-wave wifi-1"/>
    <path d="M -8,-5 A 11,11 0 0,1 8,-5" class="wifi-wave wifi-2"/>
    <path d="M -12,-8 A 16,16 0 0,1 12,-8" class="wifi-wave wifi-3"/>
    <circle cx="0" cy="0" r="1.5" fill="#0891b2" />
  </g>
  
  <circle r="4" fill="#06b6d4" stroke="#ffffff" stroke-width="1">
    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 410,470 L 410,435" />
  </circle>

  <!-- ==================== ชั้นที่ 2: Edge Processing Layer ==================== -->
  <g class="layer">
    <rect x="60" y="470" width="720" height="110" rx="12" class="layer-2"/>
    <text x="90" y="496" class="layer-title">💻 ชั้นที่ 2: Edge Processing Layer</text>
    <text x="90" y="510" class="layer-sub">ประมวลผลคำนวณและแปลงพารามิเตอร์สัญญาณส่วนขอบ</text>
    
    <!-- ADC Box -->
    <rect x="80" y="524" width="280" height="36" rx="6" class="box-rect"/>
    <text x="220" y="546" class="box-text" text-anchor="middle">Industrial ADC Module (แปลงดิจิทัล 10 kHz)</text>

    <!-- Arrow ADC -> Gateway -->
    <g stroke="rgba(255,255,255,0.4)" stroke-width="2" fill="rgba(255,255,255,0.4)">
      <line x1="360" y1="542" x2="400" y2="542"/>
      <polygon points="400,542 392,538 392,546"/>
    </g>

    <!-- Gateway Box -->
    <rect x="400" y="524" width="360" height="36" rx="6" class="box-rect"/>
    <text x="580" y="546" class="box-text" text-anchor="middle">Industrial Edge Gateway (RMS / Peak / Kurtosis ➔ JSON)</text>
  </g>

  <!-- ==================== ลูกศรเชื่อม 1 -> 2 ==================== -->
  <g stroke="#94a3b8" stroke-width="2" fill="#94a3b8">
    <line x1="245" y1="620" x2="245" y2="585"/>
    <polygon points="245,580 241,592 249,592"/>
    
    <line x1="595" y1="620" x2="595" y2="585"/>
    <polygon points="595,580 591,592 599,592"/>
  </g>
  <text x="245" y="603" class="flow-text" text-anchor="middle">⚡ สัญญาณอนาล็อก</text>
  <text x="595" y="603" class="flow-text" text-anchor="middle">⚡ ค่าความต้านทาน (PT100 RTD)</text>
  <circle r="3.5" fill="#fbbf24" stroke="#ffffff" stroke-width="1">
    <animateMotion dur="2s" repeatCount="indefinite" path="M 245,620 L 245,585" />
  </circle>
  <circle r="3.5" fill="#f97316" stroke="#ffffff" stroke-width="1">
    <animateMotion dur="2s" repeatCount="indefinite" path="M 595,620 L 595,585" />
  </circle>

  <!-- ==================== ชั้นที่ 1: Perception Layer ==================== -->
  <g class="layer">
    <rect x="60" y="620" width="720" height="110" rx="12" class="layer-1"/>
    <text x="90" y="646" class="layer-title">🔌 ชั้นที่ 1: Perception Layer</text>
    <text x="90" y="660" class="layer-sub">ติดตั้งเซนเซอร์วัดค่าทางกายภาพของเครื่องจักร</text>
    
    <!-- Accelerometer Box (including Pump Animation) -->
    <rect x="80" y="674" width="330" height="36" rx="6" class="box-rect"/>
    <g transform="translate(108, 692)">
      <g class="pump-impeller" style="transform-origin: 0px 0px;">
        <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#ffffff" stroke-width="1.5" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#ffffff" stroke-width="1.5" />
        <path d="M 0,-8 Q 4,-4 0,0" fill="none" stroke="#ffffff" stroke-width="1.5" />
        <path d="M 0,8 Q -4,4 0,0" fill="none" stroke="#ffffff" stroke-width="1.5" />
        <path d="M 8,0 Q 4,4 0,0" fill="none" stroke="#ffffff" stroke-width="1.5" />
        <path d="M -8,0 Q -4,-4 0,0" fill="none" stroke="#ffffff" stroke-width="1.5" />
      </g>
      <circle cx="0" cy="0" r="10" fill="none" stroke="#ffffff" stroke-width="1.5" />
      <path d="M 0,-10 L 0,-15" stroke="#ffffff" stroke-width="1.5" />
      <rect x="-20" y="-3" width="10" height="6" fill="#ffffff" rx="1"/>
    </g>
    <text x="260" y="696" class="box-text" text-anchor="middle">ปั๊มหอยโข่ง ➔ IEPE Accelerometer (วัดความสั่น)</text>
    
    <!-- RTD Box -->
    <rect x="430" y="674" width="330" height="36" rx="6" class="box-rect"/>
    <text x="595" y="696" class="box-text" text-anchor="middle">ตลับลูกปืน ➔ PT100 RTD (วัดความร้อน)</text>
  </g>
</svg>
</div>

#### การวิเคราะห์ปริมาณข้อมูลและการเปรียบเทียบเชิงปริมาณ (Data Volume Calculations)

ในการบำรุงรักษาเชิงพยากรณ์โดยการวิเคราะห์ความสั่นสะเทือน จำเป็นต้องใช้ความถี่ในการสุ่มตรวจวัดข้อมูลสูงมากเพื่อจับการเกิดสัญญาณพัลส์สั้น ๆ จากตลับลูกปืนที่ชำรุดในระยะแรกเริ่ม ต่อไปนี้คือการเปรียบเทียบการคำนวณภาระงานเครือข่ายและระบบจัดเก็บข้อมูล (Storage & Network Load) ระหว่างสองแนวทาง:

#### กรณีศึกษา A: การส่งข้อมูลดิบทั้งหมดขึ้นคลาวด์โดยตรง (Raw Data Stream to Cloud)
* **พารามิเตอร์การวัด:** วัดความสั่น 3 แนวแกน (X, Y, Z) ด้วยความถี่สุ่มวัด (Sampling Rate) 10 kHz (10,000 ครั้งต่อวินาทีต่อแกน)
* **ความละเอียดข้อมูล (Resolution):** 16-bit (2 Bytes) ต่อค่าสัมบูรณ์
* **การคำนวณปริมาณข้อมูลต่อวินาที:**
  $$\text{Data Rate} = 10,000 \text{ samples/sec/axis} \times 3 \text{ axes} \times 2 \text{ Bytes/sample}$$
  $$\text{Data Rate} = 60,000 \text{ Bytes/sec} \approx 60 \text{ KB/s}$$
* **การคำนวณต่อชั่วโมง:**
  $$\text{Volume/hour} = 60 \text{ KB/s} \times 3600 \text{ s} = 216,000 \text{ KB} \approx 216 \text{ MB/hour}$$
* **การคำนวณต่อวัน (24 ชั่วโมง):**
  $$\text{Volume/day} = 216 \text{ MB/hour} \times 24 \text{ hours} \approx 5.18 \text{ GB/day/pump}$$
* **การประเมินผล:** หากโรงงานนี้มีปั๊มลักษณะเดียวกัน **50 เครื่อง** ปริมาณข้อมูลดิบที่จะไหลเข้าระบบเครือข่ายคือ **259 GB/วัน** ซึ่งจะทำให้ช่องทางสื่อสารไร้สายของโรงงานติดขัดและต้องเสียค่าบริการคลาวด์และฮาร์ดดิสก์ปริมาณมหาศาล

#### กรณีศึกษา B: การใช้ Edge Computing เพื่อสกัดลักษณะเด่น (Feature Extraction on the Edge)
* **การทำงานที่ Edge Gateway:** อุปกรณ์ที่หน้างานจะไม่ส่งข้อมูลดิบ 10,000 จุดต่อวินาทีขึ้นคลาวด์ แต่จะคำนวณและดึงพารามิเตอร์สถิติสำคัญจากสัญญาณดิบนั้นโดยใช้คณิตศาสตร์ประยุกต์ เช่น:
  1. **Velocity RMS** (บ่งบอกถึงระดับความสั่นสะเทือนรวม)
  2. **Peak Acceleration** (บ่งบอกถึงการชนกระแทกอย่างแรง)
  3. **Kurtosis** (บ่งบอกความคมชันของสัญญาณพัลส์จากความชำรุดของลูกปืน)
  4. **Temperature** (อุณหภูมิเฉลี่ยของแบริ่ง)
* **ช่วงเวลาการอัปเดต (Update Interval):** ประมวลผลและส่งข้อมูลสรุปนี้ทุก ๆ 10 วินาที
* **ขนาด Payload ต่อครั้ง:** อ้างอิงตาม JSON ตัวอย่างในหัวข้อ 1.4.1 (ขนาดประมาณ 300 Bytes)
* **การคำนวณปริมาณข้อมูลต่อนาที:**
  $$\text{Data Rate} = 300 \text{ Bytes} \times 6 \text{ messages/min} = 1,800 \text{ Bytes/min} \approx 1.8 \text{ KB/min}$$
* **การคำนวณต่อชั่วโมง:**
  $$\text{Volume/hour} = 1.8 \text{ KB/min} \times 60 \text{ min} = 108 \text{ KB/hour}$$
* **การคำนวณต่อวัน (24 ชั่วโมง):**
  $$\text{Volume/day} = 108 \text{ KB/hour} \times 24 \text{ hours} \approx 2.59 \text{ MB/day/pump}$$
* **การประเมินผล:** สำหรับปั๊ม **50 เครื่อง** ปริมาณข้อมูลรวมจะเหลือเพียง **129.5 MB/วัน** ซึ่งลดลงจากแนวทางแรกถึง **2,000 เท่า!** สามารถทำงานผ่านเครือข่ายอินเทอร์เน็ตความเร็วต่ำได้สบาย และเก็บข้อมูลย้อนหลังบนคลาวด์ได้หลายปีโดยเสียค่าใช้จ่ายน้อยมาก

### 1.5.3 การติดตามสภาพเครื่องจักร (Condition Monitoring)

- **การวัดความสั่นสะเทือน (Vibration Analysis):** ตรวจจับการเสียสมดุล การเยื้องศูนย์ (Misalignment) และความเสียหายของตลับลูกปืน
- **การวิเคราะห์ทางความร้อน (Thermal Analysis):** ใช้เซนเซอร์อุณหภูมิหรือกล้องอินฟราเรด ตรวจจับจุดร้อนผิดปกติ (Hot Spot) ที่อาจเกิดจากแรงเสียดทานมากเกินไปหรือฉนวนเสื่อม
- **การวิเคราะห์น้ำมันหล่อลื่น (Oil Analysis):** ตรวจสอบคุณภาพน้ำมันเครื่องจักรผ่านเซนเซอร์วัดอนุภาคโลหะ ความหนืด และความเป็นกรด

> 💡 **เกร็ดความรู้:** บริษัท SKF ผู้ผลิตตลับลูกปืนชั้นนำระดับโลก ใช้ระบบ IoT ที่เรียกว่า "SKF Insight" ติดเซนเซอร์ไร้สายขนาดเล็กไว้ในตลับลูกปืนโดยตรง สามารถส่งข้อมูลสภาพการทำงานแบบเรียลไทม์ไปยังคลาวด์เพื่อวิเคราะห์อายุการใช้งานที่เหลือ (Remaining Useful Life)

### 1.5.4 ตัวอย่างการประยุกต์ใช้อื่น ๆ

- **ระบบ HVAC อัจฉริยะ (Smart HVAC):** ควบคุมอุณหภูมิ ความชื้น และคุณภาพอากาศในอาคารหรือโรงงานโดยอัตโนมัติ ลดการใช้พลังงานได้ 15-30%
- **การจัดการพลังงาน (Energy Management):** มิเตอร์อัจฉริยะ (Smart Meter) วัดการใช้พลังงานของเครื่องจักรแต่ละตัว ระบุจุดสิ้นเปลืองพลังงาน
- **โลจิสติกส์อัจฉริยะ (Smart Logistics):** ติดตามตำแหน่งและสภาพสินค้าระหว่างขนส่ง (เช่น อุณหภูมิ ความชื้น แรงกระแทก) ด้วย GPS และเซนเซอร์
- **หุ่นยนต์อุตสาหกรรม (Industrial Robotics):** หุ่นยนต์ที่เชื่อมต่อ IoT สามารถรายงานสถานะ รับคำสั่งปรับเปลี่ยนโปรแกรม และทำนายเวลาที่ต้องเปลี่ยนชิ้นส่วนสึกหรอ

---

## 1.6 การวิเคราะห์เปรียบเทียบเชิงลึก: IoT vs IIoT และบทบาทในวิศวกรรมเครื่องกล (IoT vs IIoT & Mechanical Engineering Role)

เพื่อความเข้าใจที่ลึกซึ้งยิ่งขึ้นเกี่ยวกับการใช้งานอินเทอร์เน็ตของสรรพสิ่งในบริบทต่าง ๆ เราสามารถจำแนกความแตกต่างระหว่าง **IoT ทั่วไป (Consumer IoT)** และ **IoT สำหรับภาคอุตสาหกรรม (Industrial IoT: IIoT)** รวมถึงวิเคราะห์การนำไปใช้งานจริงในงานวิศวกรรมเครื่องกลผ่านพารามิเตอร์ทางเทคนิคและกรณีศึกษาที่เป็นรูปธรรม

### 1.6.1 ตารางเปรียบเทียบคุณลักษณะทางเทคนิคระหว่าง IoT และ IIoT

**ตารางที่ 1.4** การเปรียบเทียบคุณลักษณะทางวิศวกรรมระหว่าง IoT และ IIoT

| คุณลักษณะ (Key Features) | IoT ทั่วไป (Consumer/Commercial IoT) | IoT อุตสาหกรรม (Industrial IoT: IIoT) |
| :--- | :--- | :--- |
| **สภาพแวดล้อมที่ใช้งาน (Environment)** | ในร่ม, อาคารสำนักงาน, บ้านพักอาศัย (อุณหภูมิคงที่, ไม่มีฝุ่นและสารเคมี) | โรงงานอุตสาหกรรม, เหมืองแร่, แท่นขุดเจาะ (ทนอุณหภูมิสูง, แรงสั่นสะเทือนสูง, ฝุ่นละออง, สารเคมีกัดกร่อน) |
| **ความน่าเชื่อถือ (Reliability)** | ปานกลาง (ยอมรับการเชื่อมต่อหลุดชั่วคราวได้) | สูงมาก (Zero Downtime, 99.999% Availability) |
| **ความหน่วงเวลา (Latency)** | สูงปานกลาง (100 ms – 2 วินาที) | ต่ำมากระดับเรียลไทม์ (1 ms – 10 ms สำหรับระบบควบคุม) |
| **ความปลอดภัย (Security)** | ระดับพื้นฐาน (WPA2, HTTPS) | ระดับสูงมาก (WPA3 Enterprise, ISA/IEC 62443, VPN, HW-based Encryption) |
| **โปรโตคอลการสื่อสาร (Protocols)** | Wi-Fi, BLE, Zigbee, HTTP, MQTT | Modbus, OPC UA, EtherNet/IP, PROFINET, WirelessHART, LoRaWAN |
| **มาตรฐานอุตสาหกรรม (Standards)** | CE, RoHS, FCC | ATEX (พื้นที่ไวไฟ), IP67/IP68/IP69K, NEMA, ISO 10816 (ความสั่นสะเทือน) |

---

### 1.6.2 บทบาทและการประยุกต์ใช้งาน IoT ในงานวิศวกรรมเครื่องกล (Role of IoT in Mechanical Engineering)

ในงานวิศวกรรมเครื่องกล ยุคดิจิทัลได้เปลี่ยนเครื่องจักรกลแบบดั้งเดิม (Mechanical Systems) ให้กลายเป็น **ระบบไซเบอร์-กายภาพ (Cyber-Physical Systems: CPS)** โดยการผสานเซนเซอร์ ระบบสื่อสาร และหน่วยประมวลผล เพื่อทำหน้าที่หลัก 3 ประการดังนี้:

#### 1. การตรวจสอบสภาพเครื่องจักร (Condition Monitoring)
คือการเก็บข้อมูลสถานะการทำงานของเครื่องจักรกลแบบเรียลไทม์ เพื่อตรวจจับสัญญาณบ่งชี้ความผิดปกติก่อนที่เครื่องจักรจะเสียหายอย่างถาวร (Catastrophic Failure)
* **ตัวอย่างการตรวจวัด:** การติดตั้งเซนเซอร์วัดความเร่ง (Accelerometers) ชนิด Piezoelectric บน Bearing Housing ของปั๊มหรือมอเตอร์ เพื่อวิเคราะห์ความเร็วการสั่นสะเทือน (Vibration Velocity) ในหน่วย mm/s RMS
* **พารามิเตอร์ทางเทคนิคที่ใช้จริง:** 
  * **ย่านความถี่ตรวจวัด (Frequency Range):** 10 Hz – 10 kHz (ตามมาตรฐาน ISO 10816 สำหรับเครื่องจักรหมุน)
  * **ขีดจำกัดความปลอดภัย (Vibration Limit):** เครื่องจักรขนาดใหญ่ที่มีกำลังส่งมากกว่า 300 kW ไม่ควรมีความเร็วการสั่นสะเทือนเกิน **4.5 mm/s RMS** (อยู่ในสถานะพึงระวัง - Alert Level) และห้ามเกิน **7.1 mm/s RMS** (สถานะอันตรายต้องหยุดเครื่องทันที - Danger Level)

#### 2. การบำมรุงรักษาเชิงพยากรณ์ (Predictive Maintenance: PdM)
การใช้ข้อมูลจากเซนเซอร์ IoT ร่วมกับแบบจำลองทางคณิตศาสตร์หรือ AI เพื่อพยากรณ์ระยะเวลาที่ชิ้นส่วนเครื่องจักรกล (เช่น ตลับลูกปืน, สายพาน, เกียร์) จะเริ่มชำรุดและคาดการณ์อายุการใช้งานที่เหลืออยู่ (Remaining Useful Life: RUL)
* **ตัวอย่างการประยุกต์ใช้:** การเฝ้าตรวจติดตามความผิดปกติทางความร้อน (Thermal Monitoring) ในแบริ่งมอเตอร์ขับเคลื่อน โดยใช้เซนเซอร์วัดอุณหภูมิ RTD (PT100) ร่วมกับการตรวจจับรูปแบบความสั่นสะเทือนที่เปลี่ยนไป
* **พารามิเตอร์ทางเทคนิคที่ใช้จริง:**
  * **ช่วงอุณหภูมิทำงานปกติ (Normal Temp):** 40°C – 65°C
  * **ขีดจำกัดอุณหภูมิเตือนภัย (Threshold):** เมื่ออุณหภูมิตลับลูกปืนสูงขึ้นเกิน **75°C** (ระบบ IoT จะสร้าง Ticket แจ้งเตือนบำรุงรักษาเชิงพยากรณ์ล่วงหน้า เพื่อเตรียมอะไหล่และนัดวิศวกรซ่อมบำรุง) และหากสูงเกิน **85°C** (ระบบควบคุมจะตัดการทำงานของเครื่องจักรเพื่อความปลอดภัย)

#### 3. การติดตามทรัพย์สินและการสร้างระบบจำลองเสมือน (Asset Tracking & Digital Twin)
การติดตามพิกัด สภาพแวดล้อม และสถานะทางกายภาพของทรัพย์สินมูลค่าสูงในโรงงานหรือระหว่างการขนส่ง รวมถึงการจำลองการทำงานของเครื่องจักรกลในโลกดิจิทัล
* **ตัวอย่างการประยุกต์ใช้:** การใช้เทคโนโลยีระบุตำแหน่งไร้สายแบบ Ultra-Wideband (UWB) หรือ Bluetooth Low Energy (BLE) ร่วมกับเซนเซอร์วัดความเร่งแบบ 3 แกน (3-axis Accelerometer) เพื่อติดตามความเสียหายของโครงสร้างเครนยกของหนัก (Overhead Crane) และตรวจสอบการสั่นไหวที่ผิดปกติระหว่างการขนส่งชิ้นงาน
* **พารามิเตอร์ทางเทคนิคที่ใช้จริง:**
  * **ความแม่นยำในการระบุตำแหน่ง (Positioning Accuracy):** < 10 เซนติเมตร (ด้วย UWB) หรือ 1-2 เมตร (ด้วย BLE Beacons)
  * **เซนเซอร์วัดมุมเอียง (Tilt / Gyroscope Sensor):** ตรวจวัดมุมบิดหรือมุมเอียงของโครงสร้างเหล็กเครนด้วยความละเอียดระดับ **0.1 องศา** ป้องกันกรณีเครนเสียสมดุลเอียงเกินค่าความปลอดภัยที่กำหนดไว้ที่ 2 องศา

---

## 1.7 ความท้าทายและความปลอดภัยของ IoT

แม้ IoT จะมีศักยภาพมหาศาล แต่ยังคงมีความท้าทายหลายประการที่วิศวกรต้องตระหนักและรับมือ

### 1.6.1 ความปลอดภัยของข้อมูล (Data Security & Privacy)

- **ภัยคุกคาม:** อุปกรณ์ IoT จำนวนมากมีทรัพยากรจำกัด ทำให้ไม่สามารถติดตั้งระบบรักษาความปลอดภัยที่ซับซ้อนได้ ทำให้เป็นเป้าหมายของการโจมตี เช่น การดักจับข้อมูล (Eavesdropping) การโจมตีแบบ DDoS หรือการควบคุมอุปกรณ์จากระยะไกล
- **แนวทางป้องกัน:** เข้ารหัสข้อมูล (Encryption) ทั้งขณะส่ง (In Transit) และขณะเก็บ (At Rest), ใช้การยืนยันตัวตน (Authentication), อัปเดตเฟิร์มแวร์สม่ำเสมอ

### 1.6.2 พลังงาน (Power & Energy)

- อุปกรณ์ IoT จำนวนมากทำงานด้วย **แบตเตอรี่** หรืออยู่ในพื้นที่ที่เข้าถึงแหล่งพลังงานได้ยาก
- ความท้าทายคือทำอย่างไรให้อุปกรณ์ทำงานได้นาน **หลายเดือนถึงหลายปี** โดยไม่ต้องเปลี่ยนแบตเตอรี่
- แนวทาง: ใช้โปรโตคอลสื่อสารที่ประหยัดพลังงาน (เช่น LoRa, BLE), ออกแบบให้อุปกรณ์เข้าสู่โหมดหลับ (Sleep Mode) เมื่อไม่ได้ใช้งาน, ใช้ Energy Harvesting จากแสงอาทิตย์หรือความสั่นสะเทือน

### 1.6.3 การทำงานร่วมกัน (Interoperability)

- อุปกรณ์ IoT มาจากผู้ผลิตหลายราย ใช้โปรโตคอลและรูปแบบข้อมูลที่แตกต่างกัน
- การเชื่อมต่อระบบข้ามแพลตฟอร์มจึงเป็นปัญหาใหญ่
- แนวทาง: ใช้มาตรฐานเปิด (Open Standards) เช่น MQTT, CoAP, OPC UA และ API มาตรฐาน (RESTful API)

### 1.6.4 มาตรฐาน (Standardization)

- ยังไม่มีมาตรฐานสากลที่ครอบคลุมทุกด้านของ IoT อย่างสมบูรณ์
- องค์กรที่กำลังพัฒนามาตรฐาน ได้แก่ IEEE, IETF, ISO/IEC, oneM2M และ W3C
- สำหรับภาคอุตสาหกรรม มาตรฐาน **OPC UA (Open Platform Communications Unified Architecture)** เป็นที่ยอมรับอย่างกว้างขวางในการเชื่อมต่อระบบ IT กับ OT (Operational Technology)

### 1.6.5 ความท้าทายอื่น ๆ

- **ปริมาณข้อมูลมหาศาล (Big Data):** อุปกรณ์หลายล้านตัวสร้างข้อมูลจำนวนมาก ต้องมีระบบจัดเก็บและประมวลผลที่รองรับ
- **ความน่าเชื่อถือ (Reliability):** ระบบ IoT ในอุตสาหกรรมต้องทำงานได้ 24/7 โดยมีอัตราข้อผิดพลาดต่ำมาก
- **ความล่าช้าของเครือข่าย (Latency):** บางงานต้องการการตอบสนองภายในมิลลิวินาที เช่น การควบคุมหุ่นยนต์ ซึ่ง Edge Computing ช่วยแก้ปัญหานี้ได้

> 💡 **เกร็ดความรู้:** ในปี ค.ศ. 2016 มัลแวร์ **Mirai** เข้าควบคุมอุปกรณ์ IoT กว่า 600,000 เครื่อง (ส่วนใหญ่เป็นกล้องวงจรปิดและเราเตอร์ที่ใช้รหัสผ่านเริ่มต้น) แล้วใช้โจมตี DDoS จนทำให้บริการอินเทอร์เน็ตหลายแห่งในสหรัฐอเมริกาล่มเป็นวงกว้าง เหตุการณ์นี้ตอกย้ำความสำคัญของการรักษาความปลอดภัยอุปกรณ์ IoT

---

## สรุปท้ายบท

ในบทนี้ นักศึกษาได้เรียนรู้แนวคิดพื้นฐานของ **อินเทอร์เน็ตของสรรพสิ่ง (IoT)** ซึ่งเป็นเทคโนโลยีที่ทำให้อุปกรณ์ทางกายภาพสามารถเชื่อมต่อ สื่อสาร และแลกเปลี่ยนข้อมูลผ่านอินเทอร์เน็ตได้

**ประเด็นสำคัญที่ควรจดจำ:**

1. IoT ตั้งอยู่บนแนวคิด "ทุกสิ่ง ทุกที่ ทุกเวลา" (Any Thing, Any Place, Any Time)
2. พัฒนาการของ IoT มาจาก Internet → M2M → IoT → IIoT
3. สถาปัตยกรรม IoT 4 ชั้น ได้แก่ Perception, Network, Processing และ Application
4. ระบบ IoT ที่สมบูรณ์ประกอบด้วย เซนเซอร์ ตัวกระทำ ไมโครคอนโทรลเลอร์ เกตเวย์ เครือข่าย คลาวด์ และแอปพลิเคชัน
5. IoT มีบทบาทสำคัญในวิศวกรรมเครื่องกลและอุตสาหกรรม โดยเฉพาะด้านการตรวจจับสภาพเครื่องจักร (Condition Monitoring) การบำรุงรักษาเชิงพยากรณ์ (Predictive Maintenance) และการติดตามทรัพย์สิน (Asset Tracking)
6. ข้อแตกต่างสำคัญระหว่าง IoT และ IIoT คือระดับความเสถียร (Reliability) ความหน่วงเวลา (Latency) และสภาพแวดล้อมที่ใช้งานซึ่งต้องการมาตรฐานที่เข้มงวดกว่า
7. ความท้าทายหลักของ IoT ได้แก่ ความปลอดภัย พลังงาน การทำงานร่วมกัน และมาตรฐาน

---

## แบบฝึกหัดท้ายบท

**1.** จงอธิบายความหมายของ IoT และยกตัวอย่างอุปกรณ์ IoT ที่นักศึกษาใช้ในชีวิตประจำวันมาอย่างน้อย 3 อย่าง พร้อมระบุว่าแต่ละอุปกรณ์ใช้เซนเซอร์ชนิดใด

**2.** จงเปรียบเทียบความแตกต่างระหว่าง M2M กับ IoT มาอย่างน้อย 3 ประเด็น โดยใช้ตารางประกอบ

**3.** วาดแผนภาพสถาปัตยกรรม IoT 4 ชั้น สำหรับระบบตรวจสอบอุณหภูมิของเตาอบอุตสาหกรรม โดยระบุเทคโนโลยีที่ใช้ในแต่ละชั้น

**4.** หากนักศึกษาต้องออกแบบระบบ IoT เพื่อ **ตรวจสอบสภาพตลับลูกปืน** ของมอเตอร์ในโรงงาน จงระบุ:
   - (ก) เซนเซอร์ที่ต้องใช้ พร้อมเหตุผล
   - (ข) ไมโครคอนโทรลเลอร์ที่เหมาะสม
   - (ค) โปรโตคอลสื่อสารที่เลือกใช้ พร้อมเหตุผล
   - (ง) แพลตฟอร์มคลาวด์ที่เหมาะสม

**5.** จงอธิบายว่า Predictive Maintenance แตกต่างจาก Preventive Maintenance อย่างไร และ IoT มีบทบาทอย่างไรในการทำให้ Predictive Maintenance เป็นไปได้

**6.** เหตุการณ์มัลแวร์ Mirai ในปี ค.ศ. 2016 ให้บทเรียนอะไรเกี่ยวกับความปลอดภัยของอุปกรณ์ IoT และวิศวกรควรมีแนวปฏิบัติอย่างไรเพื่อป้องกันเหตุการณ์ในลักษณะเดียวกัน

**7.** จงอภิปรายข้อดีและข้อจำกัดของการใช้โปรโตคอลสื่อสารต่อไปนี้สำหรับงาน IoT ในโรงงาน: (ก) Wi-Fi (ข) LoRaWAN (ค) 5G

**8.** นักศึกษาคิดว่า Edge Computing มีความสำคัญอย่างไรต่อระบบ IoT ในงานวิศวกรรมเครื่องกล จงยกตัวอย่างสถานการณ์ที่การประมวลผล ณ ขอบเครือข่าย (Edge) มีความจำเป็นมากกว่าการส่งข้อมูลทั้งหมดไปยังคลาวด์

**9.** โรงอาหารของมหาวิทยาลัยต้องการติดตั้งระบบตรวจสอบอัจฉริยะกับเครื่องทำความเย็นอุตสาหกรรมจำนวน 10 เครื่อง โดยผู้รับเหมาเสนอนโยบายการเก็บข้อมูลดังนี้:
   * ติดตั้งเซนเซอร์วัดค่าความดันสารทำความเย็น 2 จุดต่อเครื่อง สุ่มอ่านข้อมูลด้วยความถี่ 100 Hz (100 ครั้งต่อวินาที) ความละเอียดข้อมูลขนาด 12-bit (ประเมินเป็น 2 Bytes ต่อการเก็บข้อมูลหนึ่งครั้ง)
   * ส่งข้อมูลดิบทั้งหมดจากอุปกรณ์เซนเซอร์ผ่านเครือข่ายไร้สาย Wi-Fi ขึ้นสู่เซิร์ฟเวอร์ตลอด 24 ชั่วโมง

   **จงคำนวณและแสดงวิธีทำเพื่อตอบคำถามต่อไปนี้:**
   1. ปริมาณข้อมูลดิบทั้งหมดที่เครื่องทำความเย็น 1 เครื่องสร้างขึ้นใน 1 นาที (หน่วยเป็น Kilobytes: KB)
   2. ปริมาณข้อมูลรวมทั้งหมดที่เซิร์ฟเวอร์ต้องจัดเก็บจากเครื่องทำความเย็นทั้ง 10 เครื่องภายใน 1 วัน (หน่วยเป็น Megabytes หรือ Gigabytes)
   3. หากระบบอินเทอร์เน็ตของหอพักมหาวิทยาลัยมีแถบความกว้าง (Upload Bandwidth) จำกัดอยู่ที่ 2 Mbps สำหรับระบบไอโอทีนี้ จงวิเคราะห์ว่าระบบส่งข้อมูลดิบข้างต้นจะสามารถทำงานได้โดยไม่เกิดข้อมูลค้างสะสมหรือไม่?
   4. หากนักศึกษาต้องออกแบบระบบใหม่โดยนำหลักการ Edge Computing มาปรับปรุงเพื่อลดการใช้งานแบนด์วิดท์ลง 99% นักศึกษาจะเสนอวิธีการประมวลผลที่ขอบเครือข่ายอย่างไร และจะส่งข้อมูลด้วยความถี่ใดแทน?

**10.** จงออกแบบระบบติดตามและเตือนภัยสำหรับเตาอบชุบเหล็กด้วยความร้อน (Industrial Heat Treatment Furnace) ในโรงงาน โดยเตาอบชุบนี้ต้องการรักษาอุณหภูมิคงที่ไว้ที่ 850°C และหากอุณหภูมิแกว่งเกิน ±20°C เป็นเวลามากกว่า 3 นาที ชิ้นงานเหล็กจะเสียโครงสร้างทางโลหะวิทยาและกลายเป็นของเสียทันที

   **ให้นักศึกษาวาดบล็อกไดอะแกรมสถาปัตยกรรม IoT 4 ชั้น พร้อมระบุรายละเอียดเทคโนโลยีดังนี้:**
   1. **Perception Layer:** ชนิดของเซนเซอร์วัดอุณหภูมิสูงที่ทนความร้อนระดับ 900°C ได้ดี พร้อมบอกโปรโตคอลที่ไมโครคอนโทรลเลอร์ใช้อ่านสัญญาณจากเซนเซอร์นี้
   2. **Network Layer:** โปรโตคอลการสื่อสารไร้สายที่เหมาะสมหากเตาอบนี้ติดตั้งอยู่ในพื้นที่ที่มีโครงสร้างเหล็กหนาแน่นบดบังสัญญาณวิทยุ พร้อมระบุรูปแบบข้อความแอปพลิเคชัน (เช่น JSON) และหัวข้อข่าวสาร (Topic MQTT) ที่ใช้
   3. **Processing Layer:** แนวทางการตั้งกฎเกณฑ์ตัดสินใจ (Rule Engine Logic) เพื่อคัดกรองข้อมูลอุณหภูมิ และบอกชื่อฐานข้อมูลที่เหมาะกับการบันทึกประวัติอุณหภูมิเครื่องจักรนี้
   4. **Application Layer:** การออกแบบวิธีการนำเสนอหน้าแดชบอร์ด และช่องทางการแจ้งเตือนเมื่อระบบเข้าสู่ภาวะวิกฤตให้กับวิศวกรโลหะการได้รับทราบทันท่วงที

**11.** อ้างอิงตาม JSON Payload ในหัวข้อ 1.4.1 หากมีเซนเซอร์วัดแรงดันลมในระบบนิวเมติกส์ (Pneumatic Pressure Sensor) ส่งข้อมูลอุณหภูมิระบบความดันและแรงดันลมเป็น JSON มาดังนี้:
   `{"sensor_id": "PRS-01", "pressure_bar": 6.8, "temp_c": 42.5, "valve_open": true}`

   1. จงเขียนฟังก์ชันภาษา Python สั้นๆ เพื่อรับค่าสตริง JSON นี้ เข้ามาแปลงเป็นพจนานุกรม (Dictionary)
   2. เพิ่มเงื่อนไขตรวจสอบว่า หากความดันระบบ (`pressure_bar`) เกินกว่า 8.0 bar หรือต่ำกว่า 4.0 bar ให้แสดงข้อความแจ้งเตือนสีแดง "🚨 [CRITICAL ALERT] Pressure anomaly!" หากยังอยู่ในช่วงดังกล่าวให้แสดง "Pressure status normal"

---

*สิ้นสุดบทที่ 1*



