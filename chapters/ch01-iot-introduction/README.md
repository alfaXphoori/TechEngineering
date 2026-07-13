---
layout: default
title: "บทที่ 1: อินเทอร์เน็ตของสรรพสิ่งและสถาปัตยกรรม IoT"
permalink: /chapters/ch01-iot-introduction/
---

# Chapter 1: อินเทอร์เน็ตของสรรพสิ่งและสถาปัตยกรรม IoT

## Internet of Things & IoT Architecture

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

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
  <text x="380" y="432" class="footer-text" text-anchor="middle">แผนภาพที่ 1.1 สถาปัตยกรรม IoT 4 ชั้น แสดงการไหลของข้อมูลสองทิศทาง (Bi-directional Data Flow)</text>
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
| **6. คลาวด์ (Cloud Platform)** | แพลตฟอร์มสำหรับจัดเก็บ ประมวลผล และวิเคราะห์ข้อมูล | AWS IoT Core, Azure IoT Hub, ThingsBoard, Google Cloud IoT |
| **7. แอปพลิเคชัน (Application)** | ซอฟต์แวร์ที่ผู้ใช้งานโต้ตอบด้วย เพื่อดูข้อมูลและควบคุมระบบ | แดชบอร์ดบนเว็บ, แอปมือถือ, ระบบแจ้งเตือนอัตโนมัติ |

### ตัวอย่างสถานการณ์จริง

ลองนึกภาพระบบ IoT สำหรับ **ตรวจสอบสภาพปั๊มน้ำในโรงงาน**:

1. **เซนเซอร์ความสั่นสะเทือน (Vibration Sensor)** ติดที่ตัวปั๊ม ตรวจวัดความสั่นทุก 1 วินาที
2. **ESP32** อ่านค่าความสั่น ส่งข้อมูลผ่าน **Wi-Fi** ด้วยโปรโตคอล **MQTT**
3. **MQTT Broker** (เช่น Mosquitto) บนคลาวด์รับข้อมูลแล้วส่งต่อไปยัง **ฐานข้อมูล InfluxDB**
4. **Grafana Dashboard** แสดงกราฟความสั่นสะเทือนแบบเรียลไทม์
5. หากค่าเกินขีดจำกัด → ระบบ **แจ้งเตือนอัตโนมัติ** ผ่าน LINE Notify ไปยังวิศวกรซ่อมบำรุง

### 1.4.1 ตัวอย่างโครงสร้างข้อมูล JSON Message Payload (JSON Message Payload Structure)

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
      .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
      .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
      .main-box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
      .sub-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
      .text-title { font-family: 'IBM Plex Sans Thai', system-ui, sans-serif; font-size: 13.5px; font-weight: 700; fill: #7c3aed; }
      .text-sub { font-family: 'IBM Plex Sans Thai', system-ui, sans-serif; font-size: 11px; font-weight: 600; fill: #334155; }
      .flow-text { font-family: 'IBM Plex Sans Thai', system-ui, sans-serif; font-size: 10.5px; font-weight: 700; fill: #475569; }
      .pump-impeller { animation: spin 1.2s linear infinite; }
      .wifi-wave { fill: none; stroke: #334155; stroke-width: 1.5; opacity: 0.25; }
      .wifi-1 { animation: wifiFlash 1.5s infinite 0s; }
      .wifi-2 { animation: wifiFlash 1.5s infinite 0.3s; }
      .wifi-3 { animation: wifiFlash 1.5s infinite 0.6s; }
      .alarm-green { fill: #16a34a; stroke: #ffffff; stroke-width: 1; animation: greenGlow 2s infinite; }
      .alarm-green-ring { fill: none; stroke: #16a34a; stroke-width: 1.5; animation: ringPulse 2s infinite; transform-origin: 0px 0px; }
      .alarm-red { fill: #dc2626; stroke: #ffffff; stroke-width: 1; animation: redGlow 1s infinite; }
      .alarm-red-ring { fill: none; stroke: #dc2626; stroke-width: 1.5; animation: ringPulse 1s infinite; transform-origin: 0px 0px; }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes wifiFlash {
        0%, 100% { opacity: 0.25; stroke: #334155; }
        50% { opacity: 1; stroke: #f59e0b; }
      }
      @keyframes greenGlow {
        0%, 100% { fill: #16a34a; }
        50% { fill: #4ade80; }
      }
      @keyframes redGlow {
        0%, 100% { fill: #dc2626; }
        50% { fill: #f87171; }
      }
      @keyframes ringPulse {
        0% { transform: scale(0.6); opacity: 1; }
        100% { transform: scale(1.4); opacity: 0; }
      }
    </style>
  </defs>

  <rect x="5" y="5" width="830" height="750" class="bg"/>

  <!-- ==================== ชั้นที่ 5: Application Layer ==================== -->
  <g class="layer">
    <rect x="60" y="20" width="720" height="110" rx="12" class="layer-5 main-box"/>
    <text x="90" y="44" class="text-title">📱 ชั้นที่ 5: Application Layer (ระบบแอปพลิเคชันและแจ้งเตือน)</text>
    <text x="90" y="58" class="text-sub" fill="#64748b">แสดงผลข้อมูลแบบเรียลไทม์และระบบแจ้งเตือนสถานะความผิดปกติ</text>
    
    <!-- Alarm Lights -->
    <g transform="translate(680, 42)">
      <circle cx="0" cy="0" r="7" class="alarm-green"/>
      <circle cx="0" cy="0" r="12" class="alarm-green-ring"/>
      <text x="-15" y="3.5" font-family="'IBM Plex Sans Thai', system-ui, sans-serif" font-size="10" fill="#334155" text-anchor="end" font-weight="700">ปกติ</text>
    </g>
    <g transform="translate(745, 42)">
      <circle cx="0" cy="0" r="7" class="alarm-red"/>
      <circle cx="0" cy="0" r="12" class="alarm-red-ring"/>
      <text x="-15" y="3.5" font-family="'IBM Plex Sans Thai', system-ui, sans-serif" font-size="10" fill="#334155" text-anchor="end" font-weight="700">เตือนภัย</text>
    </g>
    
    <!-- Grafana Box -->
    <rect x="80" y="74" width="330" height="42" class="sub-box"/>
    <text x="245" y="100" class="text-sub" text-anchor="middle">Grafana Dashboard (วิเคราะห์แนวโน้มสุขภาพปั๊มและมอเตอร์)</text>
    
    <!-- Notification Box -->
    <rect x="430" y="74" width="330" height="42" class="sub-box"/>
    <text x="595" y="100" class="text-sub" text-anchor="middle">LINE Notify / Email API (แจ้งเตือนสม่ำเสมอเมื่อค่าวิกฤต)</text>
  </g>

  <!-- ==================== ลูกศรเชื่อม 4 -> 5 ==================== -->
  <path d="M 410,170 L 410,132" class="wire"/>
  <polygon points="410,130 406,142 414,142" fill="#334155"/>
  <text x="425" y="152" class="flow-text">📊 คิวรีข้อมูลเรียลไทม์ (REST API / WebSockets)</text>
  <circle r="4.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.2">
    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 410,170 L 410,130" />
  </circle>

  <!-- ==================== ชั้นที่ 4: Processing / Cloud Layer ==================== -->
  <g class="layer">
    <rect x="60" y="170" width="720" height="110" rx="12" class="layer-4 main-box"/>
    <text x="90" y="194" class="text-title">☁️ ชั้นที่ 4: Processing / Cloud Layer (ชั้นประมวลผลคลาวด์)</text>
    <text x="90" y="208" class="text-sub" fill="#64748b">จัดเก็บข้อมูลประวัติและประมวลผลคาดการณ์ความเสียหายด้วย AI</text>
    
    <!-- MQTT & Parser Box -->
    <rect x="80" y="222" width="260" height="42" class="sub-box"/>
    <text x="210" y="248" class="text-sub" text-anchor="middle">MQTT Broker &amp; Parsing Engine (Python)</text>

    <!-- Split Arrow inside Layer 4 -->
    <g stroke="#334155" stroke-width="1.5" fill="#334155">
      <line x1="340" y1="243" x2="365" y2="243"/>
      <line x1="365" y1="232" x2="365" y2="254"/>
      <line x1="365" y1="232" x2="385" y2="232"/>
      <polygon points="385,232 379,229 379,235"/>
      <line x1="365" y1="254" x2="385" y2="254"/>
      <polygon points="385,254 379,251 379,257"/>
    </g>

    <!-- InfluxDB Box -->
    <rect x="390" y="218" width="370" height="20" rx="4" class="sub-box"/>
    <text x="575" y="232" class="text-sub" text-anchor="middle" font-size="10">ฐานข้อมูลอนุกรมเวลา (InfluxDB)</text>
    
    <!-- ML Model Box -->
    <rect x="390" y="242" width="370" height="20" rx="4" class="sub-box"/>
    <text x="575" y="256" class="text-sub" text-anchor="middle" font-size="10">แบบจำลอง AI ตรวจจับผิดปกติ (Anomaly Detection)</text>
  </g>

  <!-- ==================== ลูกศรเชื่อม 3 -> 4 ==================== -->
  <path d="M 410,320 L 410,282" class="wire"/>
  <polygon points="410,280 406,292 414,292" fill="#334155"/>
  <text x="425" y="302" class="flow-text">☁️ ส่งต่อแพ็กเก็ตข้อมูลผ่านอินเทอร์เน็ต (IP Packets)</text>
  <circle r="4.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.2">
    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 410,320 L 410,280" />
  </circle>

  <!-- ==================== ชั้นที่ 3: Network Layer ==================== -->
  <g class="layer">
    <rect x="60" y="320" width="720" height="110" rx="12" class="layer-3 main-box"/>
    <text x="90" y="344" class="text-title">📶 ชั้นที่ 3: Network Layer (ชั้นเครือข่ายและการสื่อสาร)</text>
    <text x="90" y="358" class="text-sub" fill="#64748b">เครือข่ายความปลอดภัยเกรดอุตสาหกรรมและการเชื่อมต่อไร้สาย</text>
    
    <!-- Wireless AP Box -->
    <rect x="80" y="374" width="200" height="42" class="sub-box"/>
    <text x="180" y="400" class="text-sub" text-anchor="middle">Wireless Access Point</text>

    <!-- Arrow AP -> Router -->
    <line x1="280" y1="395" x2="310" y2="395" class="wire"/>
    <polygon points="310,395 302,391 302,399" fill="#334155"/>

    <!-- Local Router Box -->
    <rect x="310" y="374" width="200" height="42" class="sub-box"/>
    <text x="410" y="400" class="text-sub" text-anchor="middle">Local Router</text>

    <!-- Arrow Router -> Firewall -->
    <line x1="510" y1="395" x2="540" y2="395" class="wire"/>
    <polygon points="540,395 532,391 532,399" fill="#334155"/>

    <!-- Firewall Box -->
    <rect x="540" y="374" width="220" height="42" class="sub-box"/>
    <text x="650" y="400" class="text-sub" text-anchor="middle">Industrial Firewall</text>
  </g>

  <!-- ==================== ลูกศรเชื่อม 2 -> 3 ==================== -->
  <path d="M 410,470 L 410,432" class="wire"/>
  <polygon points="410,430 406,442 414,442" fill="#334155"/>
  <text x="425" y="452" class="flow-text">📶 Wi-Fi / MQTT (Topic: factory/pump3/telemetry)</text>
  
  <!-- Flashing Wi-Fi waves -->
  <g class="wifi-signal" transform="translate(410, 446)">
    <path d="M -4,-2 A 6,6 0 0,1 4,-2" class="wifi-wave wifi-1"/>
    <path d="M -8,-5 A 11,11 0 0,1 8,-5" class="wifi-wave wifi-2"/>
    <path d="M -12,-8 A 16,16 0 0,1 12,-8" class="wifi-wave wifi-3"/>
    <circle cx="0" cy="0" r="1.5" fill="#334155" />
  </g>
  
  <circle r="4.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.2">
    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 410,470 L 410,430" />
  </circle>

  <!-- ==================== ชั้นที่ 2: Edge Processing Layer ==================== -->
  <g class="layer">
    <rect x="60" y="470" width="720" height="110" rx="12" class="layer-2 main-box"/>
    <text x="90" y="494" class="text-title">💻 ชั้นที่ 2: Edge Processing Layer (ชั้นประมวลผลส่วนขอบ)</text>
    <text x="90" y="508" class="text-sub" fill="#64748b">แปลงสัญญาณความถี่สูงและประมวลผลทางสถิติ (RMS / Peak / Kurtosis)</text>
    
    <!-- ADC Box -->
    <rect x="80" y="524" width="280" height="42" class="sub-box"/>
    <text x="220" y="550" class="text-sub" text-anchor="middle">Industrial ADC Module (ตัวแปลงสัญญาณ 10 kHz)</text>

    <!-- Arrow ADC -> Gateway -->
    <line x1="360" y1="545" x2="400" y2="545" class="wire"/>
    <polygon points="400,545 392,541 392,549" fill="#334155"/>

    <!-- Gateway Box -->
    <rect x="400" y="524" width="360" height="42" class="sub-box"/>
    <text x="580" y="550" class="text-sub" text-anchor="middle">Industrial Edge Gateway (สกัดคุณลักษณะส่งต่อเป็น JSON)</text>
  </g>

  <!-- ==================== ลูกศรเชื่อม 1 -> 2 ==================== -->
  <path d="M 245,620 L 245,582" class="wire"/>
  <polygon points="245,580 241,592 249,592" fill="#334155"/>
  <text x="235" y="602" class="flow-text" text-anchor="end">⚡ สัญญาณสั่นสะเทือนแบบอนาล็อก</text>

  <path d="M 595,620 L 595,582" class="wire"/>
  <polygon points="595,580 591,592 599,592" fill="#334155"/>
  <text x="605" y="602" class="flow-text" text-anchor="start">⚡ ค่าต้านทาน RTD (PT100)</text>

  <circle r="4" fill="#f59e0b" stroke="#ffffff" stroke-width="1.2">
    <animateMotion dur="2s" repeatCount="indefinite" path="M 245,620 L 245,580" />
  </circle>
  <circle r="4" fill="#dc2626" stroke="#ffffff" stroke-width="1.2">
    <animateMotion dur="2s" repeatCount="indefinite" path="M 595,620 L 595,580" />
  </circle>

  <!-- ==================== ชั้นที่ 1: Perception Layer ==================== -->
  <g class="layer">
    <rect x="60" y="620" width="720" height="110" rx="12" class="layer-1 main-box"/>
    <text x="90" y="644" class="text-title">🔌 ชั้นที่ 1: Perception Layer (ชั้นรับรู้/ตรวจวัดระดับอุปกรณ์)</text>
    <text x="90" y="658" class="text-sub" fill="#64748b">การตรวจวัดพารามิเตอร์ของมอเตอร์และปั๊มแบบเรียลไทม์</text>
    
    <!-- Accelerometer Box (including Pump Animation) -->
    <rect x="80" y="674" width="330" height="42" class="sub-box"/>
    <g transform="translate(108, 695)">
      <g class="pump-impeller" style="transform-origin: 0px 0px;">
        <circle cx="0" cy="0" r="2.5" fill="#334155" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#334155" stroke-width="1.5" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#334155" stroke-width="1.5" />
        <path d="M 0,-8 Q 4,-4 0,0" fill="none" stroke="#334155" stroke-width="1.5" />
        <path d="M 0,8 Q -4,4 0,0" fill="none" stroke="#334155" stroke-width="1.5" />
        <path d="M 8,0 Q 4,4 0,0" fill="none" stroke="#334155" stroke-width="1.5" />
        <path d="M -8,0 Q -4,-4 0,0" fill="none" stroke="#334155" stroke-width="1.5" />
      </g>
      <circle cx="0" cy="0" r="10" fill="none" stroke="#334155" stroke-width="1.5" />
      <path d="M 0,-10 L 0,-15" stroke="#334155" stroke-width="1.5" />
      <rect x="-20" y="-3" width="10" height="6" fill="#334155" rx="1"/>
    </g>
    <text x="260" y="700" class="text-sub" text-anchor="middle">ปั๊มหอยโข่ง ➔ IEPE Accelerometer (วัดความสั่น)</text>
    
    <!-- RTD Box -->
    <rect x="430" y="674" width="330" height="42" class="sub-box"/>
    <text x="595" y="700" class="text-sub" text-anchor="middle">ตลับลูกปืนมอเตอร์ ➔ PT100 RTD (วัดอุณหภูมิ)</text>
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

#### 2. การบำรุงรักษาเชิงพยากรณ์ (Predictive Maintenance: PdM)
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

### 1.7.1 ความปลอดภัยของข้อมูล (Data Security & Privacy)

- **ภัยคุกคาม:** อุปกรณ์ IoT จำนวนมากมีทรัพยากรจำกัด ทำให้ไม่สามารถติดตั้งระบบรักษาความปลอดภัยที่ซับซ้อนได้ ทำให้เป็นเป้าหมายของการโจมตี เช่น การดักจับข้อมูล (Eavesdropping) การโจมตีแบบ DDoS หรือการควบคุมอุปกรณ์จากระยะไกล
- **แนวทางป้องกัน:** เข้ารหัสข้อมูล (Encryption) ทั้งขณะส่ง (In Transit) และขณะเก็บ (At Rest), ใช้การยืนยันตัวตน (Authentication), อัปเดตเฟิร์มแวร์สม่ำเสมอ

### 1.7.2 พลังงาน (Power & Energy)

- อุปกรณ์ IoT จำนวนมากทำงานด้วย **แบตเตอรี่** หรืออยู่ในพื้นที่ที่เข้าถึงแหล่งพลังงานได้ยาก
- ความท้าทายคือทำอย่างไรให้อุปกรณ์ทำงานได้นาน **หลายเดือนถึงหลายปี** โดยไม่ต้องเปลี่ยนแบตเตอรี่
- แนวทาง: ใช้โปรโตคอลสื่อสารที่ประหยัดพลังงาน (เช่น LoRa, BLE), ออกแบบให้อุปกรณ์เข้าสู่โหมดหลับ (Sleep Mode) เมื่อไม่ได้ใช้งาน, ใช้ Energy Harvesting จากแสงอาทิตย์หรือความสั่นสะเทือน

### 1.7.3 การทำงานร่วมกัน (Interoperability)

- อุปกรณ์ IoT มาจากผู้ผลิตหลายราย ใช้โปรโตคอลและรูปแบบข้อมูลที่แตกต่างกัน
- การเชื่อมต่อระบบข้ามแพลตฟอร์มจึงเป็นปัญหาใหญ่
- แนวทาง: ใช้มาตรฐานเปิด (Open Standards) เช่น MQTT, CoAP, OPC UA และ API มาตรฐาน (RESTful API)

### 1.7.4 มาตรฐาน (Standardization)

- ยังไม่มีมาตรฐานสากลที่ครอบคลุมทุกด้านของ IoT อย่างสมบูรณ์
- องค์กรที่กำลังพัฒนามาตรฐาน ได้แก่ IEEE, IETF, ISO/IEC, oneM2M และ W3C
- สำหรับภาคอุตสาหกรรม มาตรฐาน **OPC UA (Open Platform Communications Unified Architecture)** เป็นที่ยอมรับอย่างกว้างขวางในการเชื่อมต่อระบบ IT กับ OT (Operational Technology)

### 1.7.5 ความท้าทายอื่น ๆ

- **ปริมาณข้อมูลมหาศาล (Big Data):** อุปกรณ์หลายล้านตัวสร้างข้อมูลจำนวนมาก ต้องมีระบบจัดเก็บและประมวลผลที่รองรับ
- **ความน่าเชื่อถือ (Reliability):** ระบบ IoT ในอุตสาหกรรมต้องทำงานได้ 24/7 โดยมีอัตราข้อผิดพลาดต่ำมาก
- **ความล่าช้าของเครือข่าย (Latency):** บางงานต้องการการตอบสนองภายในมิลลิวินาที เช่น การควบคุมหุ่นยนต์ ซึ่ง Edge Computing ช่วยแก้ปัญหานี้ได้

> 💡 **เกร็ดความรู้:** ในปี ค.ศ. 2016 มัลแวร์ **Mirai** เข้าควบคุมอุปกรณ์ IoT กว่า 600,000 เครื่อง (ส่วนใหญ่เป็นกล้องวงจรปิดและเราเตอร์ที่ใช้รหัสผ่านเริ่มต้น) แล้วใช้โจมตี DDoS จนทำให้บริการอินเทอร์เน็ตหลายแห่งในสหรัฐอเมริกาล่มเป็นวงกว้าง เหตุการณ์นี้ตอกย้ำความสำคัญของการรักษาความปลอดภัยอุปกรณ์ IoT

---

</div>

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">

## 1.8 การเขียนโปรแกรมและประมวลผลข้อมูลในระบบ IoT (Programming and Data Processing in IoT)

การเชื่อมต่อและสั่งงานอุปกรณ์ในระบบ IoT จำเป็นต้องอาศัยทักษะการพัฒนาโปรแกรม ทั้งในส่วนของอุปกรณ์ปลายทาง (Edge Devices) ที่มักทำงานอยู่บนฮาร์ดแวร์ขนาดเล็ก และในส่วนของระบบจัดการข้อมูล/คลาวด์ (Cloud/Server-side) ที่ทำหน้าที่รวบรวมและวิเคราะห์ข้อมูล

### 1.8.1 พื้นฐานการพัฒนาโปรแกรมด้วยภาษา C++ สำหรับไมโครคอนโทรลเลอร์ (C++ Programming Foundations for IoT)

เพื่อเตรียมความพร้อมสำหรับผู้เริ่มต้นในการเขียนโค้ดควบคุมไมโครคอนโทรลเลอร์ (เช่น ESP32 หรือ Arduino) ต่อไปนี้คือโครงสร้างพื้นฐานของภาษา C++ ที่สำคัญและพบเจอได้บ่อยที่สุดในงานด้าน IoT:

#### 1) ชนิดข้อมูลจำนวนเต็ม (`int`) และตัวแปรเบื้องต้น
การทำงานกับตัวแปรใน C++ จะต้องประกาศชนิดข้อมูล (Data Type) ก่อนเสมอ ตัวแปรประเภทจำนวนเต็ม (`int`) ใช้ในการเก็บข้อมูลตัวเลขที่ไม่มีเศษส่วน เช่น หมายเลขขาพินควบคุม อัตราสุ่มสัญญาณ หรือลำดับของข้อความส่งออก

```cpp
int sensorPin = 34;      // ประกาศตัวแปรจำนวนเต็มสำหรับขาเชื่อมต่อเซนเซอร์
int baudRate = 115200;   // อัตราบอดเรตสำหรับการสื่อสารแบบอนุกรม
int readInterval = 1000; // รอบเวลาการอ่านค่าเซนเซอร์ (มิลลิวินาที)
```

นอกจากจำนวนเต็ม `int` แล้ว ในงาน IoT ยังใช้ชนิดข้อมูลประเภทอื่นควบคู่ไปด้วย ได้แก่ `float` (ตัวเลขทศนิยม เช่น อุณหภูมิ 25.4) และ `bool` (สถานะลอจิกจริง/เท็จ เช่น `true` เพื่อสั่งเปิดรีเลย์)

#### 2) โครงสร้างการทำงานแบบทำซ้ำ `for` loop
ใช้สำหรับสั่งให้บล็อกคำสั่งวนทำงานซ้ำเป็นจำนวนรอบที่ทราบเงื่อนไขชัดเจนล่วงหน้า ตัวอย่างเช่น การหาค่าเฉลี่ยของเซนเซอร์โดยการสุ่มอ่านค่า 10 ครั้ง

```cpp
float totalValue = 0;
int readCount = 10; // จำนวนรอบที่ต้องการทำซ้ำ

for (int i = 0; i < readCount; i++) {
  // เริ่มต้น i = 0, ทำซ้ำจนกว่า i < 10, โดยบวกค่า i เพิ่มทีละ 1 ทุกครั้งที่จบรอบ (i++)
  totalValue += analogRead(sensorPin); // อ่านสัญญาณแอนะล็อกและนำมาบวกสะสม
  delay(10); // หน่วงเวลาสั้น ๆ ระหว่างการอ่านแต่ละครั้ง
}

float averageValue = totalValue / readCount; // คำนวณหาค่าเฉลี่ย
```

#### 3) โครงสร้างการทำงานแบบทำซ้ำ `while` loop
ใช้สำหรับสั่งให้วนลูปทำงานซ้ำตราบใดที่เงื่อนไขยังคงเป็นจริง และจะหลุดออกจากลูปเมื่อเงื่อนไขกลายเป็นเท็จ เหมาะสมอย่างยิ่งกับการรอคอยสถานะเหตุการณ์ที่ระบุเวลาเสร็จสิ้นไม่ได้ล่วงหน้า เช่น การรอคอยสัญญาณการเชื่อมต่อเครือข่าย Wi-Fi

```cpp
// สมมติ WiFi.status() เป็นฟังก์ชันตรวจสอบสถานะของ Wi-Fi
// และ WL_CONNECTED เป็นค่าคงที่แสดงสถานะว่าเชื่อมต่อสำเร็จแล้ว
while (WiFi.status() != WL_CONNECTED) {
  Serial.print(".");
  delay(500); // วนทำงานซ้ำทุก 0.5 วินาทีจนกว่าจะเชื่อมต่อสำเร็จ
}
Serial.println("เชื่อมต่ออินเทอร์เน็ตสำเร็จ!");
```

#### 4) การสร้างและเรียกใช้งานฟังก์ชัน (Function)
ฟังก์ชันคือการรวบรวมกลุ่มคำสั่งเข้าด้วยกันเป็นกลุ่มบล็อกย่อยที่มีชื่อเรียกชัดเจน ทำให้เราเรียกใช้งานซ้ำเพื่อประมวลผลข้อมูลเดิมได้สะดวกโดยไม่ต้องเขียนโค้ดซ้ำ

**ตัวอย่างฟังก์ชันคำนวณและประเมินผล:**
```cpp
// ฟังก์ชันตรวจสอบขีดจำกัดอุณหภูมิ (มีพารามิเตอร์ 2 ตัว และคืนค่าเป็น Boolean)
bool checkTemperatureAlarm(float temperature, float limit) {
  if (temperature > limit) {
    return true;  // ส่งค่ากลับเป็น true หากพบว่าค่าสูงเกินกว่าขีดจำกัด
  }
  return false;   // ส่งค่ากลับเป็น false หากอุณหภูมิยังปลอดภัย
}

void setup() {
  Serial.begin(115200);
  
  float currentTemp = 76.5;
  float maxLimit = 75.0;
  
  // เรียกใช้งานฟังก์ชัน
  bool isAlert = checkTemperatureAlarm(currentTemp, maxLimit);
  
  if (isAlert) {
    Serial.println("🔥 Warning: Over-Temperature detected!");
  } else {
    Serial.println("✅ Temperature status normal.");
  }
}

void loop() {
  // ละว่างไว้
}
```

### 1.8.2 โค้ดตัวอย่างการถอดรหัสและการประมวลผลข้อมูล (JSON Parsing Scripts)

เมื่อข้อมูล JSON ถูกส่งมาถึงระบบเครือข่ายหรือเซิร์ฟเวอร์ โปรแกรมเมอร์จะใช้ภาษาคอมพิวเตอร์ในการแปลงข้อความตัวอักษรกลับมาเป็นวัตถุ (Parsing) และวิเคราะห์เงื่อนไขขีดจำกัดความปลอดภัย (Threshold Checking) โดยเทียบระหว่างฝั่งผู้รับข้อมูลบนเซิร์ฟเวอร์ (เช่น การรันสคริปต์วิเคราะห์ด้วย Python) และฝั่งอุปกรณ์ปลายทาง/ไมโครคอนโทรลเลอร์ (เช่น การใช้ภาษา C++ บน ESP32)

#### ก) สคริปต์ฝั่งเซิร์ฟเวอร์ด้วยภาษา Python (Python Parsing Script)

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
            print(f"⚠️ [WARNING] อุปกรณ์ {device_id} สั่นสะเวือนสูงผิดปกติ: {vib_z} mm/s (ขีดจำกัด {VIBRATION_LIMIT} mm/s)")
            # ในระบบจริง จะส่ง API ไปยัง LINE Notify หรือระบบแจ้งซ่อมต่อที่นี่
            
        if temp > TEMPERATURE_LIMIT:
            print(f"🔥 [CRITICAL] อุณหภูมิตลับลูกปืนสูงเกินเกณฑ์: {temp} °C (ขีดจำกัด {TEMPERATURE_LIMIT} °C)")
            
        if vib_z <= VIBRATION_LIMIT and temp <= TEMPERATURE_LIMIT:
            print("✅ Status: Normal")
            
    except json.JSONDecodeError as e:
        print(f"❌ รูปแบบข้อมูล JSON ผิดพลาด: {e}")
    except KeyError as e:
        print(f"❌ ไม่พบฟิลด์ข้อมูลที่ต้องการ: {e}")

# เรียกใช้งานฟังก์ชัน
process_sensor_data(raw_mqtt_payload)
```

#### ข) โค้ดฝั่งอุปกรณ์ปลายทางด้วยภาษา C++ (C++ ArduinoJson Parsing Script)

ในฝั่งอุปกรณ์เครือข่ายปลายทาง (Edge Devices) เช่น ไมโครคอนโทรลเลอร์ ESP32 หรือระบบสมองกลฝังตัวที่พัฒนาด้วยภาษา C++ เมื่อได้รับข้อความ JSON (เช่น ผ่านโปรโตคอล MQTT) จะนิยมถอดรหัสโดยใช้ไลบรารี **ArduinoJson** ซึ่งเป็นไลบรารีที่ออกแบบมาสำหรับการทำงานบนอุปกรณ์ที่มีหน่วยความจำจำกัดได้อย่างรวดเร็วและมีประสิทธิภาพสูง

```cpp
#include <ArduinoJson.h>

// สมมติว่าได้รับข้อความดิบผ่านโปรโตคอล MQTT (ข้อมูลอยู่ในรูปแบบ String/char array)
const char* raw_mqtt_payload = R"({
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
})";

void processSensorData(const char* raw_payload) {
  // 1. กำหนดขนาดของ JsonDocument (คำนวณตามโครงสร้าง JSON)
  // ใช้ StaticJsonDocument สำหรับเก็บค่าบน Stack โดยไม่ต้องใช้ Dynamic Memory Heap
  StaticJsonDocument<512> doc;
  
  // 2. แปลงข้อความ JSON String ให้เป็นออบเจกต์ (Deserialization / Parsing)
  DeserializationError error = deserializeJson(doc, raw_payload);
  
  // ตรวจสอบความถูกต้องของรูปแบบข้อมูล (Error Handling)
  if (error) {
    Serial.print(F("❌ รูปแบบข้อมูล JSON ผิดพลาด: "));
    Serial.println(error.f_str());
    return;
  }
  
  // ตรวจสอบความมีอยู่ของฟิลด์หลักก่อนใช้งานเพื่อความปลอดภัย (Key Validation)
  if (!doc.containsKey("device_id") || !doc.containsKey("telemetry")) {
    Serial.println(F("❌ ไม่พบฟิลด์ข้อมูลที่ต้องการ (device_id หรือ telemetry)"));
    return;
  }
  
  // 3. ดึงค่าตัวแปรวิศวกรรมที่ต้องการตรวจสอบ
  const char* device_id = doc["device_id"];
  const char* timestamp = doc["timestamp"];
  float vib_z = doc["telemetry"]["vibration_z_rms"];
  float temp = doc["telemetry"]["temperature_celsius"];
  
  Serial.print(F("📊 ได้รับข้อมูลจากอุปกรณ์: "));
  Serial.println(device_id);
  Serial.print(F("   ณ เวลา: "));
  Serial.println(timestamp);
  Serial.print(F("   > ความสั่นแนวแกน Z: "));
  Serial.print(vib_z);
  Serial.print(F(" mm/s | อุณหภูมิ: "));
  Serial.print(temp);
  Serial.println(F(" °C"));
  
  // 4. กำหนดขีดจำกัดความปลอดภัยเพื่อแจ้งเตือน (Threshold Rules)
  // อ้างอิงตามมาตรฐาน ISO 10816 (ความสั่นปั๊มไม่ควรเกิน 4.5 mm/s)
  const float VIBRATION_LIMIT = 4.5;
  const float TEMPERATURE_LIMIT = 75.0;
  
  // 5. การตัดสินใจเชิงตรรกะ (Logic Processing)
  if (vib_z > VIBRATION_LIMIT) {
    Serial.print(F("⚠️ [WARNING] อุปกรณ์ "));
    Serial.print(device_id);
    Serial.print(F(" สั่นสะเทือนสูงผิดปกติ: "));
    Serial.print(vib_z);
    Serial.print(F(" mm/s (ขีดจำกัด "));
    Serial.print(VIBRATION_LIMIT);
    Serial.println(F(" mm/s)"));
  }
  
  if (temp > TEMPERATURE_LIMIT) {
    Serial.print(F("🔥 [CRITICAL] อุณหภูมิตลับลูกปืนสูงเกินเกณฑ์: "));
    Serial.print(temp);
    Serial.print(F(" °C (ขีดจำกัด "));
    Serial.print(TEMPERATURE_LIMIT);
    Serial.println(F(" °C)"));
  }
  
  if (vib_z <= VIBRATION_LIMIT && temp <= TEMPERATURE_LIMIT) {
    Serial.println(F("✅ สถานะเครื่องจักร: ปกติ"));
  }
}

void setup() {
  Serial.begin(115200);
  while (!Serial) continue; // รอพอร์ตซีเรียลเชื่อมต่อ
  
  Serial.println(F("--- เริ่มต้นโปรแกรมประมวลผลข้อมูล IoT (C++) ---"));
  
  // เรียกใช้งานฟังก์ชัน
  processSensorData(raw_mqtt_payload);
}

void loop() {
  // ไม่ทำซ้ำในรอบวงรอบหลัก
}
```

#### ค) การเปรียบเทียบความแตกต่างระหว่าง Python และ C++ (สำหรับอุปกรณ์ฝังตัว)

1. **การบริหารจัดการหน่วยความจำ (Memory Management):** Python ใช้กลไก Garbage Collector คืนพื้นที่หน่วยความจำให้อัตโนมัติ (แต่ใช้ RAM สูง) ส่วน C++ (ผ่านไลบรารี ArduinoJson) สามารถเลือกเก็บออบเจกต์ไว้บน Stack (ใช้ `StaticJsonDocument`) ได้โดยตรง ช่วยป้องกันปัญหาหน่วยความจำรั่วไหล (Memory Leak) และความหน่วงของการประมวลผลแบบไม่แน่นอน (Deterministic Latency)
2. **การป้องกันปัญหา RAM ไม่พอ (Flash Optimization):** ใน C++ มีการใช้มาโคร `F()` ครอบข้อความคงที่ (Literal Strings) เช่น `F("✅ สถานะเครื่องจักร: ปกติ")` เพื่อระบุให้คอมไพเลอร์จัดเก็บข้อความเหล่านี้ไว้ในหน่วยความจำโปรแกรม (Flash) แทนการย้ายขึ้นไปทำงานบนหน่วยความจำชั่วคราว (RAM) ทำให้ระบบเสถียรยิ่งขึ้น
3. **การเข้าถึงและการจัดการคีย์ (Key Access):** ทั้งสองภาษามีระบบป้องกันที่ดีเยี่ยม โดย Python สามารถจับโครงสร้างที่ไม่ถูกต้องผ่าน `KeyError` ส่วน C++ ใช้ฟังก์ชัน `containsKey()` หรือตรวจสอบประเภทข้อมูลจากตัวแปรปลายทางเพื่อป้องกันปัญหา Pointer ชี้ตำแหน่งว่างเปล่า (Null Pointer Dereference)

---

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

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

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## แบบฝึกหัดท้ายบท

**1.** จงอธิบายความหมายของ IoT และยกตัวอย่างอุปกรณ์ IoT ที่นักศึกษาใช้ในชีวิตประจำวันมาอย่างน้อย 3 อย่าง พร้อมระบุว่าแต่ละอุปกรณ์ใช้เซนเซอร์ชนิดใด

**2.** จงเปรียบเทียบความแตกต่างระหว่าง M2M กับ IoT มาอย่างน้อย 3 ประเด็น โดยใช้ตารางประกอบ

**3.** วาดแผนภาพสถาปัตยกรรม IoT 4 ชั้น สำหรับระบบตรวจสอบอุณหภูมิของเตาอบอุตสาหกรรม โดยระบุเทคโนโลยีที่ใช้ในแต่ละชั้น

**4.** หากนักศึกษาต้องออกแบบระบบ IoT เพื่อตรวจสอบสภาพตลับลูกปืนของมอเตอร์ในโรงงาน จงระบุ:
   - (ก) เซนเซอร์ที่ต้องใช้ พร้อมเหตุผล
   - (ข) ไมโครคอนโทรลเลอร์ที่เหมาะสม
   - (ค) โปรโตคอลสื่อสารที่เลือกใช้ พร้อมเหตุผล
   - (ง) แพลตฟอร์มคลาวด์ที่เหมาะสม

**5.** จงยกตัวอย่างการประยุกต์ใช้ระบบ IoT ในงานวิศวกรรมเครื่องกลมาอย่างน้อย 3 รูปแบบ พร้อมอธิบายองค์ประกอบของการเก็บข้อมูลเซนเซอร์และการควบคุมตัวกระทำ (Actuators) เพื่อเพิ่มประสิทธิภาพระบบ

*สิ้นสุดบทที่ 1*

</div>
