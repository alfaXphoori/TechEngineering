---
layout: default
title: "บทที่ 10: แพลตฟอร์มคลาวด์และการจัดการข้อมูล IoT"
permalink: /chapters/ch10-cloud/
---

# Chapter 10: แพลตฟอร์มคลาวด์และการจัดการข้อมูล IoT

## IoT Cloud Platforms & Rule Engines (ThingsBoard, Time-Series Databases, Telemetry, RPC, Alerts)

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

> ### 🎯 ผลลัพธ์การเรียนรู้และการเชื่อมโยง (Constructive Alignment)
>
> - **สัปดาห์การเรียนรู้:** สัปดาห์ที่ 11 & 12 — แพลตฟอร์มคลาวด์ การจัดการข้อมูล และระบบจัดการกฎ (Cloud Platforms & Rule Engine)
> - **ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs):**
>   - **CLO2:** เลือกใช้และอธิบายเทคโนโลยีไร้สาย โพรโทคอลการสื่อสาร และเทคโนโลยีคลาวด์สำหรับ IoT ได้
>   - **CLO3:** ออกแบบและพัฒนาระบบ IoT ที่เชื่อมต่อเซนเซอร์/ตัวกระทำ สื่อสารข้อมูล และแสดงผลผ่านโปรแกรมของผู้ใช้ได้
>   - **CLO4:** ปฏิบัติการสร้าง ทดสอบ และประยุกต์ใช้ระบบ IoT พร้อมการเรียนรู้ของเครื่องเบื้องต้น และทำงานเป็นทีมอย่างรับผิดชอบ
> - **ผลลัพธ์การเรียนรู้ระดับบทเรียน (LLOs):**
>   - **LLO11.1:** อธิบายรูปแบบบริการคลาวด์ (IaaS/PaaS/SaaS) และองค์ประกอบของแพลตฟอร์ม IoT ได้ (CLO2)
>   - **LLO11.2:** เชื่อมต่ออุปกรณ์ IoT เข้ากับบริการคลาวด์ ThingsBoard เพื่อส่งข้อมูล Telemetry และ Attributes ได้ (CLO3, CLO4)
>   - **LLO12.1:** ส่งและจัดเก็บข้อมูลเซนเซอร์บนฐานข้อมูลอนุกรมเวลา (Time-series Database) บนคลาวด์ได้ (CLO3)
>   - **LLO12.2:** ตั้งค่าระบบประมวลผลกฎ (Rule Engine) เพื่อแจ้งเตือนอัตโนมัติ และดึงข้อมูลผ่าน REST API ได้ (CLO3, CLO4)
>
---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 10.1 คลาวด์คอมพิวติงคืออะไรและประโยชน์สำหรับ IoT

**คลาวด์คอมพิวติง (Cloud Computing)** คือการให้บริการทรัพยากรระบบคอมพิวเตอร์ผ่านเครือข่ายอินเทอร์เน็ตตามความต้องการของผู้ใช้ (On-demand) โดยผู้ใช้ไม่จำเป็นต้องบริหารจัดการทรัพยากรฮาร์ดแวร์เหล่านั้นโดยตรง ทรัพยากรเหล่านี้ครอบคลุมตั้งแต่ หน่วยประมวลผล (Compute), พื้นที่จัดเก็บข้อมูล (Storage), ระบบฐานข้อมูล (Databases), โครงข่ายเครือข่าย (Networking) ไปจนถึงซอฟต์แวร์สำเร็จรูป โดยคิดค่าใช้จ่ายตามปริมาณการใช้งานจริง (Pay-as-you-go)

ตามนิยามมาตรฐานของ NIST (National Institute of Standards and Technology) ระบบคลาวด์คอมพิวติงมีลักษณะเด่น 5 ประการ ได้แก่:
1. **On-demand self-service:** ผู้ใช้สามารถร้องขอใช้งานบริการได้ด้วยตนเองทันทีผ่านระบบอัตโนมัติ
2. **Broad network access:** เข้าถึงบริการได้จากทุกที่ผ่านโครงข่ายเครือข่ายมาตรฐาน (เช่น อินเทอร์เน็ต หรือ VPN)
3. **Resource pooling:** การใช้ทรัพยากรฮาร์ดแวร์ร่วมกันของผู้ใช้หลายรายโดยมีระบบแยกความเป็นส่วนตัวอย่างปลอดภัย
4. **Rapid elasticity:** ความยืดหยุ่นสูง สามารถขยายหรือลดขนาดทรัพยากร (เช่น เพิ่มจำนวน RAM/CPU หรือพื้นที่เก็บข้อมูล) ได้ทันที
5. **Measured service:** มีระบบตรวจวัดปริมาณการใช้งานอย่างละเอียดและคิดค่าบริการตามจริง

> 💡 **ข้อสังเกตสำหรับวิศวกรเครื่องกล:** ในอดีต หากเราต้องการเก็บข้อมูลอุณหภูมิและการสั่นสะเทือนของเครื่องจักรในโรงงาน เราต้องใช้เครื่องบันทึกข้อมูล (Data Logger) ที่ต่อสายสัญญาณเข้ากับคอมพิวเตอร์ตั้งโต๊ะในพื้นที่ผลิต เมื่อต้องการดูข้อมูล วิศวกรต้องเดินไปคัดลอกไฟล์ผ่านแฟลชไดรฟ์ แต่ด้วยเทคโนโลยีคลาวด์และการประยุกต์ใช้ IoT เราสามารถส่งข้อมูลจากบอร์ด ESP32 ผ่านเครือข่าย Wi-Fi หรือโครงข่ายไร้สาย 4G/5G ขึ้นไปยังเซิร์ฟเวอร์บนอินเทอร์เน็ตได้โดยตรง ทำให้เราสามารถตรวจสอบสุขภาพเครื่องจักรได้จากระยะไกลและรวมศูนย์ข้อมูลของทั้งโรงงานเข้าด้วยกัน

### 10.1.1 ประโยชน์ของ Cloud Computing สำหรับ IoT ในงานวิศวกรรม
1. **Scalability (ความสามารถในการขยายตัว):** ระบบคลาวด์สามารถรองรับอุปกรณ์เซนเซอร์จากหลักสิบไปจนถึงนับหมื่นตัวได้พร้อมกันโดยไม่ต้องกังวลเรื่องการตั้งค่าเซิร์ฟเวอร์ใหม่ หากโรงงานขยายเครื่องจักรและต้องการเพิ่มจำนวน ESP32 เข้าสู่ระบบ ก็สามารถทำได้อย่างรวดเร็ว
2. **Accessibility (การเข้าถึงได้อย่างอิสระ):** ข้อมูลที่ถูกส่งขึ้นสู่ระบบคลาวด์สามารถเข้าถึงได้ผ่านสมาร์ทโฟน แท็บเล็ต หรือเว็บเบราว์เซอร์ ช่วยให้การเฝ้าระวังระบบ (System Monitoring) ทำได้ตลอดเวลาและปลอดภัย
3. **Cost-effectiveness (ความคุ้มค่าเชิงต้นทุน):** ผู้ใช้งานไม่ต้องกังวลกับต้นทุนฮาร์ดแวร์เซิร์ฟเวอร์ ไม่ต้องเสียค่าบำรุงรักษา หรือจ้างเจ้าหน้าที่ดูแลระบบเครือข่ายขั้นสูง ทำให้การริเริ่มโปรเจกต์ IoT ในยุคนี้เข้าถึงง่ายขึ้นมาก
4. **Reliability (ความน่าเชื่อถือระดับสูง):** ผู้ให้บริการคลาวด์มักมีศูนย์ข้อมูล (Data Center) ที่มีระบบไฟฟ้าสำรองและการทำสำเนาข้อมูล (Data Replication) ป้องกันไม่ให้ข้อมูลสูญหาย
5. **Data Integration & Analytics (การรวมและวิเคราะห์ข้อมูลอัจฉริยะ):** คลาวด์คอมพิวติงมักมาพร้อมกับเครื่องมือประมวลผลข้อมูลปริมาณมหาศาล (Big Data) และปัญญาประดิษฐ์ (AI) ทำให้นักวิศวกรสามารถนำข้อมูลดิบมาวิเคราะห์หาแนวโน้ม เช่น การทำ Predictive Maintenance หรือการทำนายเวลาที่ชิ้นส่วนเครื่องจักรจะเสื่อมสภาพ

### 10.1.2 การเปรียบเทียบและการตัดสินใจเลือกระหว่าง Edge Computing และ Cloud Computing (Edge vs. Cloud Trade-offs)
ในการออกแบบระบบ IoT สำหรับงานอุตสาหกรรม วิศวกรต้องตัดสินใจเลือกว่าควรประมวลผลข้อมูลที่ส่วนใดระหว่าง **Edge Computing** (ประมวลผลที่ขอบเครือข่าย/ระดับฮาร์ดแวร์ปลายทาง) หรือ **Cloud Computing** (ประมวลผลบนเซิร์ฟเวอร์คลาวด์ส่วนกลาง) ซึ่งมีข้อพิจารณาทางวิศวกรรมดังต่อไปนี้:

*   **ความหน่วงเวลา (Latency):** 
    *   *Edge:* เหมาะกับระบบที่ต้องการเวลาตอบสนองในระดับมิลลิวินาที (Real-time loops) เช่น การควบคุมความเร็วรอบมอเตอร์ หรือระบบขัดจังหวะความปลอดภัยฉุกเฉิน (Safety Interlock) หากรอส่งข้อมูลขึ้นคลาวด์และรอคำสั่งกลับมา (Round-trip latency) ซึ่งใช้เวลา 100–500 ms อาจทำให้เครื่องจักรเสียหายได้
    *   *Cloud:* เหมาะกับงานที่ไม่จำกัดเรื่องเวลาตอบสนองแบบทันทีทันใด เช่น การจัดเก็บข้อมูลประวัติรายชั่วโมง การวิเคราะห์แนวโน้มการประหยัดพลังงาน
*   **แบนด์วิดท์เครือข่าย (Bandwidth & Data Volume):**
    *   *Edge:* ช่วยลดแบนด์วิดท์โดยการแปลงและกรองข้อมูลขั้นต้น (Preprocessing) เช่น เซนเซอร์วัดการสั่นสะเทือนสุ่มวัดความเร่งที่ความถี่ 5 kHz ซึ่งสร้างข้อมูลดิบขนาดมหาศาล บอร์ด Edge (ESP32) จะคำนวณหาค่าเฉลี่ย RMS และส่งขึ้นคลาวด์เฉพาะผลลัพธ์ทุกๆ 5 วินาที
    *   *Cloud:* รับข้อมูลที่ผ่านการกรองแล้วเพื่อประหยัดพื้นที่จัดเก็บและลดค่าใช้จ่ายการส่งข้อมูลผ่านเครือข่ายเซลลูลาร์
*   **ความน่าเชื่อถือในการทำงานออฟไลน์ (Offline Reliability):**
    *   *Edge:* อุปกรณ์ต้องสามารถทำงานควบคุมระดับท้องถิ่นที่วิกฤตได้แม้ไม่มีสัญญาณอินเทอร์เน็ต โดยระบบจะไม่ล่มและมีบัฟเฟอร์เก็บข้อมูลชั่วคราว
    *   *Cloud:* ขึ้นอยู่กับความเสถียรของเครือข่ายอินเทอร์เน็ต 100%

| ตัวชี้วัดเปรียบเทียบ | Edge Computing | Cloud Computing |
| :--- | :--- | :--- |
| **ตำแหน่งการประมวลผล** | ตัวไมโครคอนโทรลเลอร์ (เช่น ESP32) หรือเกตเวย์ท้องถิ่น | เซิร์ฟเวอร์บนอินเทอร์เน็ตระยะไกล |
| **เวลาในการตอบสนอง** | ต่ำมาก (ระดับไมโครวินาที - มิลลิวินาที) | ปานกลาง-สูง (100 ms ขึ้นไป ขึ้นกับเครือข่าย) |
| **ขีดความสามารถการคำนวณ**| จำกัดด้วยสเปกฮาร์ดแวร์ขนาดเล็ก | สูงมากและขยายได้ไม่จำกัด |
| **ความทนทานต่อเน็ตล่ม** | ทำงานต่อได้ปกติในระบบควบคุมท้องถิ่น | หยุดการแสดงผลและการตอบสนองระยะไกล |

### 10.1.3 ตัวชี้วัดประสิทธิภาพระบบเครือข่ายสำหรับวิศวกร (Network QoS Metrics)
การเชื่อมต่ออุปกรณ์ IoT เข้ากับคลาวด์ขึ้นอยู่กับคุณภาพของบริการเครือข่าย (Quality of Service - QoS) ซึ่งวิศวกรต้องทำความเข้าใจตัวชี้วัดสำคัญ 5 ประการดังนี้:
1. **Latency (ความหน่วงเวลา):** เวลาที่ใช้ในการเดินทางของข้อมูลจากต้นทางไปยังปลายทาง มักวัดเป็น RTT (Round Trip Time) หรือเวลาเดินทางไป-กลับ ส่งผลโดยตรงต่อการตอบสนองของระบบควบคุมเชิงกลระยะไกล
2. **Bandwidth (แบนด์วิดท์):** ความกว้างของช่องสัญญาณในการส่งข้อมูล (บิตต่อวินาที - bps) ซึ่งเป็นข้อจำกัดหลักในอุตสาหกรรมที่ต้องแชร์เครือข่ายร่วมกัน
3. **Jitter (ความแปรปรวนของความหน่วง):** ความไม่สม่ำเสมอของเวลาในการรับส่งแพ็กเกจข้อมูล หาก Jitter สูง จะส่งผลกระทบต่อเสถียรภาพของระบบควบคุมแบบเรียลไทม์
4. **Packet Loss (อัตราสูญหายของแพ็กเกจ):** เปอร์เซ็นต์ของแพ็กเกจข้อมูลที่สูญหายระหว่างทาง ซึ่งโปรโตคอล TCP จะทำการส่งซ้ำ (Retransmission) ทำให้ความหน่วงเพิ่มขึ้น ขณะที่ UDP จะยอมรับข้อมูลสูญหายเพื่อรักษาความเร็ว
5. **Availability & SLA (ข้อตกลงระดับบริการ):** การรับประกันเสถียรภาพของระบบจากผู้ให้บริการคลาวด์ เช่น SLA 99.9% (Three Nines) ยอมให้ระบบขัดข้องรวมกันได้ไม่เกิน 8.76 ชั่วโมงต่อปี

### 10.1.4 การลดความละเอียดและการดึงคุณลักษณะเด่นของข้อมูลที่ขอบ (Data Downsampling & Feature Extraction)
ในการประยุกต์ใช้งานเชิงวิศวกรรมเครื่องกล เช่น การตรวจสอบสุขภาพตลับลูกปืน (Bearing Health Monitoring) ด้วยเซนเซอร์วัดความเร่ง 3 แกน (Accelerometer) ที่มีอัตราสุ่มวัดข้อมูลความถี่สูง (เช่น 5 kHz) หากเราส่งข้อมูลดิบ $a_x, a_y, a_z$ ทั้งหมดขึ้นระบบคลาวด์ จะสร้างปริมาณทราฟฟิกข้อมูลสูงถึง:
$$\text{Data Rate} = 3 \text{ แกน} \times 5,000 \text{ ตัวอย่าง/วินาที} \times 4 \text{ ไพต์ (Float)} = 60,000 \text{ ไพต์/วินาที} \approx 5.18 \text{ GB ต่อวัน}$$
ซึ่งการส่งข้อมูลปริมาณนี้จากอุปกรณ์นับร้อยตัวจะทำให้อินเทอร์เน็ตโรงงานเกิดคอขวดและเสียค่าใช้จ่ายคลาวด์มหาศาล

แนวทางปฏิบัติที่ถูกต้องคือการทำ **Feature Extraction** ที่ตัว ESP32 โดยเก็บตัวอย่างข้อมูลดิบในเวลา 1 วินาที นำมาคำนวณหาค่ารากเฉลี่ยกำลังสอง (Root Mean Square - RMS) เพื่อวัดความรุนแรงความสั่นสะเทือนสะสม:
$$a_{RMS} = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (a_{x,i}^2 + a_{y,i}^2 + a_{z,i}^2)}$$
และส่งเพียงค่า $a_{RMS}$ ชุดเดียวขึ้นสู่คลาวด์ในทุกๆ 5 วินาที ทำให้ปริมาณข้อมูลลดลงเหลือเพียง 4 ไพต์ต่อ 5 วินาที หรือลดลงกว่า 99.99%

---

## 10.2 รูปแบบบริการ IaaS/PaaS/SaaS

บริการคลาวด์คอมพิวติงสามารถแบ่งออกเป็น 3 รูปแบบหลักๆ ตามระดับความรับผิดชอบและขอบเขตการควบคุมที่ผู้ใช้จะได้รับ ซึ่งในฐานะวิศวกร เราต้องเลือกใช้งานให้เหมาะสมกับความซับซ้อนและเป้าหมายของโครงงาน:

1. **IaaS (Infrastructure as a Service - บริการโครงสร้างพื้นฐาน):**
   ผู้ให้บริการจะจัดเตรียมเฉพาะเซิร์ฟเวอร์เสมือน พื้นที่เก็บข้อมูล และระบบเครือข่ายไว้ให้ ผู้ใช้ต้องทำหน้าที่ติดตั้งระบบปฏิบัติการ (OS เช่น Linux), ระบบจัดการฐานข้อมูล (DBMS) และเขียนโค้ดหลังบ้านทั้งหมดเอง เหมาะสำหรับโครงการอุตสาหกรรมขนาดใหญ่ที่มีทีม DevOps ดูแลระบบเฉพาะตัว
2. **PaaS (Platform as a Service - บริการแพลตฟอร์ม):**
   ผู้ให้บริการจะจัดเตรียมเซิร์ฟเวอร์ ระบบปฏิบัติการ และชุดสภาพแวดล้อมสำหรับการรันแอปพลิเคชันไว้ให้ (Runtime environment) ผู้ใช้งานมีหน้าที่เพียงเขียนโค้ดและนำซอฟต์แวร์ที่พัฒนามาติดตั้งเพื่อใช้งาน (เช่น AWS Elastic Beanstalk, Heroku)
3. **SaaS (Software as a Service - บริการซอฟต์แวร์):**
   เป็นบริการสำเร็จรูปพร้อมใช้งานผ่านแอปพลิเคชันหรือเว็บเบราว์เซอร์ ผู้ใช้ไม่ต้องบริหารระบบหลังบ้านใดๆ เลย เพียงสมัครใช้งาน ปรับแต่งความต้องการ และใช้งานอินเทอร์เฟซเพื่อควบคุมระบบ (เช่น **ThingsBoard**) ซึ่งเป็นรูปแบบที่ง่ายและมีประสิทธิภาพสูงสุดสำหรับวิศวกรเครื่องกลในการเริ่มต้นทำต้นแบบ IoT

**ตารางที่ 1: เปรียบเทียบรูปแบบบริการ IaaS, PaaS และ SaaS สำหรับงานเทคโนโลยีดิจิทัลและ IoT**

| รูปแบบบริการคลาวด์ | คำอธิบายโดยสังเขป | ระดับภาระการจัดการของผู้ใช้ | ตัวอย่างผู้ให้บริการ / แพลตฟอร์ม | ความเหมาะสมสำหรับงาน IoT ในรายวิชานี้ |
| :--- | :--- | :--- | :--- | :--- |
| **IaaS** | ให้เช่าฮาร์ดแวร์คอมพิวเตอร์เสมือน | **สูงสุด** (ผู้ใช้ต้องลง OS, ติดตั้งฐานข้อมูล และสร้างระบบเองทั้งหมด) | Amazon EC2, Google Compute Engine, DigitalOcean | **ต่ำ** - ใช้เวลาตั้งค่าระบบนานเกินความจำเป็นสำหรับโครงงานเริ่มต้น |
| **PaaS** | ให้บริการรันไทม์และแพลตฟอร์มรันซอฟต์แวร์ | **ปานกลาง** (ผู้ใช้เขียนโค้ดควบคุมฝั่งแอปพลิเคชันและฐานข้อมูลเอง) | AWS Elastic Beanstalk, Heroku, Google App Engine | **ปานกลาง** - เหมาะสำหรับโครงงานที่ต้องการความยืดหยุ่นในการเขียนเว็บแอปพลิเคชันเอง |
| **SaaS** | ให้บริการซอฟต์แวร์สำเร็จรูปพร้อมใช้งานทันที | **ต่ำสุด** (ผู้ใช้ไม่ต้องตั้งค่าใดๆ ล็อกอินแล้วใช้งานแดชบอร์ดได้เลย) | **ThingsBoard**, Ubidots, Adafruit IO, Google Workspace | **สูงที่สุด** - พัฒนาได้ไว ได้หน้าแดชบอร์ดที่สวยงามบนสมาร์ทโฟนและเว็บ |

---

## 10.3 รูปแบบการติดตั้ง Public/Private/Hybrid

นอกจากจะแบ่งตามระดับบริการแล้ว ระบบคลาวด์ยังจัดประเภทตาม "รูปแบบการติดตั้ง" (Deployment Models) ซึ่งเกี่ยวข้องกับระดับความเป็นส่วนตัว งบประมาณ และความปลอดภัยของข้อมูลเครื่องจักรเชิงกลในระบบอุตสาหกรรม:

*   **Public Cloud (คลาวด์สาธารณะ):** เป็นโครงสร้างพื้นฐานที่ผู้ให้บริการคลาวด์รายใหญ่ (เช่น AWS, Google, Microsoft หรือ ThingsBoard) สร้างขึ้นเพื่อเปิดให้บุคคลทั่วไปและองค์กรต่างๆ เช่าใช้งานร่วมกันบนเครือข่ายอินเทอร์เน็ตสาธารณะ มีข้อดีคือไม่มีต้นทุนฮาร์ดแวร์เริ่มต้น เริ่มใช้งานได้ทันที แต่ข้อมูลจะแชร์พื้นที่จัดเก็บทางฮาร์ดแวร์ร่วมกับผู้ใช้อื่น
*   **Private Cloud (คลาวด์ส่วนตัว):** เป็นระบบคลาวด์ที่สร้างขึ้นมาโดยเฉพาะเพื่อใช้งานภายในองค์กรเดียวเท่านั้น อาจตั้งเซิร์ฟเวอร์อยู่ในอาคารโรงงานของบริษัท (On-premises) หรือเช่าพื้นที่ปิดในศูนย์ข้อมูล มีความปลอดภัยและรักษาความลับของข้อมูลสูงสุด ป้องกันไม่ให้ความลับทางการค้า (Trade Secrets) เช่น สูตรการผลิต หรือปริมาณการเดินเครื่องจักร รั่วไหลออกไป แต่มีค่าใช้จ่ายในการลงทุนโครงสร้างพื้นฐานและทีมดูแลรักษาสูงมาก
*   **Hybrid Cloud (คลาวด์แบบผสมผสาน):** เป็นการทำงานร่วมกันระหว่าง Public Cloud และ Private Cloud โดยจัดเก็บข้อมูลกระบวนการผลิตที่มีความวิกฤตและความลับสูงไว้ใน Private Cloud แต่ใช้ความสามารถของ Public Cloud ในการแสดงผลแดชบอร์ดที่ไม่เป็นความลับ หรือใช้ในการวิเคราะห์ข้อมูลสถิติระยะยาวเพื่อประหยัดต้นทุน

สำหรับรายวิชานี้เพื่อการศึกษาสู่การสร้างโครงงานต้นแบบ (IoT Prototype) เราจะเลือกใช้ **Public Cloud** ของ ThingsBoard เนื่องจากมีความสะดวก ปลอดภัย และมีบริการขั้นพื้นฐานที่ไม่มีค่าใช้จ่ายสำหรับนักศึกษา

---

## 10.4 องค์ประกอบแพลตฟอร์ม IoT

**IoT Platform (แพลตฟอร์ม IoT)** คือซอฟต์แวร์ระบบระดับกลาง (Middleware) บนระบบคลาวด์ที่ทำหน้าที่เป็นสะพานเชื่อมต่อระหว่างอุปกรณ์ฮาร์ดแวร์ปลายทาง (Edge Devices เช่น ESP32) กับผู้ใช้งานผ่านแอปพลิเคชัน แพลตฟอร์ม IoT ที่ได้มาตรฐานอุตสาหกรรมประกอบด้วยองค์ประกอบสำคัญ 5 ส่วนด้วยกัน:

<div style="text-align: center; margin: 25px 0;">
<svg viewBox="0 0 820 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>องค์ประกอบของแพลตฟอร์ม IoT และการไหลของข้อมูล</title>
  <style>
    .bg-main { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .wire { fill: none; stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .telemetry-flow { fill: none; stroke: #16a34a; stroke-width: 3.5; stroke-dasharray: 10 12; stroke-linecap: round; animation: flowMarch 2.6s linear infinite; }
    .control-flow { fill: none; stroke: #dc2626; stroke-width: 3.5; stroke-dasharray: 10 12; stroke-linecap: round; animation: flowMarch 2.6s linear infinite; }
    .text-main { font-size: 13.5px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; font-weight: 500; }
    .mcu-box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .comp-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    @keyframes flowMarch {
      to { stroke-dashoffset: -44; }
    }
  </style>

  <rect x="5" y="5" width="810" height="390" class="bg-main"/>

  <!-- Static Wire Paths -->
  <path d="M 180 75 L 240 75" class="wire"/>
  <path d="M 400 75 L 460 75" class="wire"/>
  <path d="M 620 75 L 680 75" class="wire"/>
  <path d="M 540 110 L 540 150 L 415 150 L 415 195" class="wire"/>
  <path d="M 415 255 L 415 295" class="wire"/>
  <path d="M 540 110 L 540 150 L 615 150 L 615 195" class="wire"/>
  <path d="M 615 255 L 615 295" class="wire"/>

  <!-- Flow Animations -->
  <path d="M 180 75 L 240 75" class="telemetry-flow"/>
  <path d="M 400 75 L 460 75" class="telemetry-flow"/>
  <path d="M 620 75 L 680 75" class="telemetry-flow"/>
  <path d="M 540 110 L 540 150 L 615 150 L 615 195" class="telemetry-flow"/>
  <path d="M 615 255 L 615 295" class="telemetry-flow"/>
  
  <path d="M 540 110 L 540 150 L 415 150 L 415 195" class="control-flow"/>
  <path d="M 415 255 L 415 295" class="control-flow"/>

  <!-- Nodes -->
  <!-- 1. เซนเซอร์ / ฮาร์ดแวร์ (MCU) -->
  <rect x="20" y="40" width="160" height="70" class="mcu-box"/>
  <text x="100" y="68" class="text-main" text-anchor="middle">เซนเซอร์ / ฮาร์ดแวร์</text>
  <text x="100" y="88" class="text-sub" text-anchor="middle">(ESP32, Sensor)</text>

  <!-- 2. การรับเข้าข้อมูล (Component) -->
  <rect x="240" y="40" width="160" height="70" class="comp-box"/>
  <text x="320" y="68" class="text-main" text-anchor="middle">การรับเข้าข้อมูล</text>
  <text x="320" y="88" class="text-sub" text-anchor="middle">(Ingestion: MQTT/HTTP)</text>

  <!-- 3. แพลตฟอร์ม IoT (MCU/Platform Core) -->
  <rect x="460" y="40" width="160" height="70" class="mcu-box"/>
  <text x="540" y="68" class="text-main" text-anchor="middle">แพลตฟอร์ม IoT</text>
  <text x="540" y="88" class="text-sub" text-anchor="middle">(ThingsBoard Cloud Core)</text>

  <!-- 4. คลังข้อมูลอนุกรมเวลา (Component) -->
  <rect x="680" y="40" width="120" height="70" class="comp-box"/>
  <text x="740" y="68" class="text-main" text-anchor="middle">คลังข้อมูล</text>
  <text x="740" y="88" class="text-sub" text-anchor="middle">(Storage: TSDB)</text>

  <!-- 5. จัดการอุปกรณ์ (Component) -->
  <rect x="330" y="195" width="170" height="60" class="comp-box"/>
  <text x="415" y="223" class="text-main" text-anchor="middle">ระบบจัดการอุปกรณ์</text>
  <text x="415" y="241" class="text-sub" text-anchor="middle">(Device Management)</text>

  <!-- 6. จัดการบอร์ด (MCU side) -->
  <rect x="330" y="295" width="170" height="60" class="mcu-box"/>
  <text x="415" y="323" class="text-main" text-anchor="middle">ลงทะเบียนบอร์ด / OTA</text>
  <text x="415" y="341" class="text-sub" text-anchor="middle">(Board Provisioning)</text>

  <!-- 7. การแสดงผลข้อมูล (Component) -->
  <rect x="530" y="195" width="170" height="60" class="comp-box"/>
  <text x="615" y="223" class="text-main" text-anchor="middle">ส่วนแสดงผลข้อมูล</text>
  <text x="615" y="241" class="text-sub" text-anchor="middle">(Visualization)</text>

  <!-- 8. หน้าจอควบคุม (Component) -->
  <rect x="530" y="295" width="170" height="60" class="comp-box"/>
  <text x="615" y="323" class="text-main" text-anchor="middle">หน้าจอควบคุม</text>
  <text x="615" y="341" class="text-sub" text-anchor="middle">(Dashboard / App)</text>
</svg>
</div>

1. **Device Management (ระบบจัดการอุปกรณ์):** ทำหน้าที่ลงทะเบียน คืนสิทธิ์ ตรวจสอบสถานะการเชื่อมต่อ (Online/Offline) และอำนวยความสะดวกในการอัปเดตเฟิร์มแวร์อุปกรณ์ระยะไกลผ่านอากาศ (Over-The-Air: OTA)
2. **Data Ingestion (ช่องทางรับเข้าข้อมูล):** รับข้อมูลจากอุปกรณ์เซนเซอร์ผ่านโปรโตคอลสำหรับการสื่อสาร IoT เช่น MQTT, HTTP หรือ CoAP โดยต้องรองรับทราฟฟิกข้อมูลที่ไหลเข้าหนาแน่นพร้อมๆ กันได้ดี
3. **Data Storage (คลังพื้นที่จัดเก็บข้อมูล):** ฐานข้อมูลสำหรับบันทึกค่าที่ได้จากเซนเซอร์ มักใช้ฐานข้อมูลประเภทอนุกรมเวลา (Time-series Database) เพื่อจัดเรียงข้อมูลตามแกนเวลาได้อย่างรวดเร็ว
4. **Visualization (การแสดงผลข้อมูลเป็นภาพ):** เครื่องมือสร้างแผงควบคุมระบบ (Dashboard) ในรูปแบบลากวาง (Drag-and-drop) เพื่อให้ผู้ใช้เฝ้าระวังสัญญาณเชิงกลผ่านวิดเจ็ตต่างๆ เช่น Gauge, Chart, LED
5. **Rule Engine & Alerts (ระบบกฎเกณฑ์อัตโนมัติและการแจ้งเตือน):** การกำหนดตรรกะเงื่อนไขล่วงหน้าเพื่อตอบสนองต่อค่าวิกฤต เช่น หากความดันลมเกินเกณฑ์ ให้ส่งสัญญาณเตือน (Push Alert/Email) หรือตัดระบบความร้อนทันที

### 10.4.1 สถาปัตยกรรมท่อส่งข้อมูลการวัดคลาวด์ในอุตสาหกรรม (Industrial Telemetry Pipeline)
การเดินทางของข้อมูลจากฟิสิกส์สู่หน้าจอแดชบอร์ดใช้ท่อส่งข้อมูล (Telemetry Pipeline) ดังนี้:
$$\text{Physical Sensor} \rightarrow \text{Edge MCU (ESP32)} \rightarrow \text{Local Gateway (เช่น Raspberry Pi)} \rightarrow \text{Cloud IoT Core/Broker} \rightarrow \text{Stream Processor} \rightarrow \text{Time-Series Database} \rightarrow \text{Dashboard}$$

### 10.4.2 แนวคิด Digital Twin (Device Shadow)
ในแพลตฟอร์มระดับอุตสาหกรรม จะมีกลไก **Digital Twin** (หรือ Device Shadow บน AWS IoT) ซึ่งเป็นการบันทึกจำลองสถานะล่าสุดและโครงสร้างของฮาร์ดแวร์จริงไว้บนคลาวด์ตลอดเวลา แม้อุปกรณ์จริงจะอยู่ในโหมดประหยัดพลังงาน (Deep Sleep) หรือขาดการเชื่อมต่ออินเทอร์เน็ตชั่วคราว ผู้ใช้งานหรือแอปพลิเคชันยังคงสามารถส่งคำสั่งสั่งการทิ้งไว้บนคลาวด์ได้ และเมื่อบอร์ด ESP32 ตื่นขึ้นมาเชื่อมต่อเครือข่ายอีกครั้ง มันจะดึงความต้องการควบคุมล่าสุดนั้นไปอัปเดตตัวเองโดยอัตโนมัติ

---

## 10.5 แพลตฟอร์ม IoT ยอดนิยม

ในภาคการศึกษาและอุตสาหกรรม มีผู้ให้บริการแพลตฟอร์ม IoT หลากหลายระดับ เพื่อให้นักศึกษาเข้าใจบริบทของตลาดวิศวกรรม เราสามารถเปรียบเทียบ ThingsBoard และแพลตฟอร์มระดับองค์กร (Enterprise) ดังนี้:

**ตารางที่ 2: เปรียบเทียบแพลตฟอร์ม IoT สำหรับการเรียนรู้และระดับองค์กร (Enterprise)**

| คุณสมบัติของแพลตฟอร์ม | ThingsBoard (thingsboard.io) | AWS IoT Core (Amazon) | Azure IoT Hub (Microsoft) |
| :--- | :--- | :--- | :--- |
| **กลุ่มผู้ใช้งานหลัก** | นักศึกษา, เมกเกอร์, โครงงานต้นแบบ และโรงงานอุตสาหกรรมขนาดกลาง-ใหญ่ | วิศวกรซอฟต์แวร์คลาวด์, โรงงานขนาดใหญ่ที่มีอุปกรณ์นับล้านตัว | องค์กรที่ใช้งานระบบเครือข่ายโครงสร้างพื้นฐานของ Microsoft เป็นหลัก |
| **การสร้างหน้าแดชบอร์ด** | ลากวางวิดเจ็ตผ่านเว็บและแชร์ให้สมาร์ทโฟนได้ง่าย มีวิดเจ็ตหลากหลายแบบอุตสาหกรรม | ไม่มีแดชบอร์ดในตัว ต้องเขียนพัฒนาขึ้นเองหรือส่งต่อข้อมูลไป Power BI | ไม่มีแดชบอร์ดในตัว ต้องดึงข้อมูลเชื่อมต่อระบบหน้าบ้านอื่นๆ |
| **ความยากในการเรียนรู้** | ปานกลาง (ต้องเข้าใจการส่งข้อมูลแบบ JSON, MQTT Telemetry และ RPC) | สูงมาก (ต้องมีความเข้าใจสถาปัตยกรรมบริการต่างๆ ของคลาวด์อย่างละเอียด) | สูงมาก (ต้องมีความเข้าใจลูปความปลอดภัยและฐานข้อมูลเชิงอุตสาหกรรม) |
| **ความเหมาะสมในวิชานี้** | **เหมาะสมที่สุดในการศึกษาสถาปัตยกรรมระดับอุตสาหกรรม** | เหมาะสำหรับการประยุกต์ใช้งานจริงในอนาคตระดับสูง | เหมาะสำหรับการทำงานระดับโรงงานขนาดใหญ่ในอนาคต |

---

</div>

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">
## 10.6 ปฏิบัติการ Wokwi Lab 11 & 12: การส่งข้อมูลขึ้นคลาวด์ ThingsBoard และระบบประมวลผลกฎ

**รหัสปฏิบัติการ:** LAB-11, LAB-12 | **เวลาปฏิบัติการ:** 4 ชั่วโมง  
**เป้าหมายการเรียนรู้:** LLO11.1, LLO11.2, LLO12.1, LLO12.2 (CLO2, CLO3, CLO4)  
**เครื่องมือที่ใช้:** Wokwi Simulator, ThingsBoard Cloud Account, ESP32, DHT22, Potentiometer, Relay

---

### 10.6.1 วัตถุประสงค์เชิงปฏิบัติการ
1. สร้างอุปกรณ์ (Device Profile) บน ThingsBoard Cloud และรับ Access Token ประจำอุปกรณ์
2. ส่งข้อมูล Telemetry (อุณหภูมิ, ความชื้น, การสั่นสะเทือน) และ Client Attributes ผ่านโพรโทคอล MQTT
3. ออกแบบ Rule Engine บน ThingsBoard เพื่อสร้างการแจ้งเตือน (Create Alarm) อัตโนมัติเมื่อค่าเกินเกณฑ์วิกฤต

---

### 10.6.2 แผนผังการต่อวงจร (Wiring Table)

| อุปกรณ์ | ขาของอุปกรณ์ | ขาบนบอร์ด ESP32 DevKit | หน้าที่ / หมายเหตุ |
|---|---|---|---|
| **DHT22 Climate Sensor** | DATA | **GPIO 15** | สัญญาณอุณหภูมิและความชื้น |
| **Potentiometer (Vibration Sim)** | SIG | **GPIO 34** (ADC1) | จำลองแรงสั่นสะเทือน (0.0 - 5.0 G) |
| **Relay Module (Cooling Fan)** | IN | **GPIO 13** | สั่งเปิด-ปิดพัดลมระบายความร้อน |
| **Status LED** | Anode (+) | **GPIO 12** (ผ่าน R 330Ω) | แสดงสถานะเชื่อมต่อคลาวด์ |

---

### 10.6.3 ไฟล์โครงสร้างวงจร `diagram.json` สำหรับ Wokwi

```json
{
  "version": 1,
  "author": "KSU TechEngineering",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-dht22", "id": "dht1", "top": -140, "left": 120, "attrs": { "temperature": "32.4", "humidity": "64" } },
    { "type": "wokwi-potentiometer", "id": "pot1", "top": -140, "left": -100, "attrs": { "value": "1800" } },
    { "type": "wokwi-relay-module", "id": "relay1", "top": 120, "left": 120, "attrs": {} },
    { "type": "wokwi-led", "id": "led1", "top": 120, "left": -80, "attrs": { "color": "green" } },
    { "type": "wokwi-resistor", "id": "r1", "top": 170, "left": -80, "attrs": { "value": "330" } }
  ],
  "connections": [
    [ "esp:3V3", "dht1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "dht1:GND", "black", [ "v0" ] ],
    [ "esp:15", "dht1:SDA", "blue", [ "v0" ] ],

    [ "esp:3V3", "pot1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "pot1:GND", "black", [ "v0" ] ],
    [ "esp:34", "pot1:SIG", "green", [ "v0" ] ],

    [ "esp:5V", "relay1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "relay1:GND", "black", [ "v0" ] ],
    [ "esp:13", "relay1:IN", "purple", [ "v0" ] ],

    [ "esp:12", "led1:A", "orange", [ "v0" ] ],
    [ "led1:C", "r1:1", "black", [ "v0" ] ],
    [ "r1:2", "esp:GND", "black", [ "v0" ] ]
  ],
  "dependencies": {}
}
```

---

### 10.6.4 ซอร์สโค้ดภาษา C++ สำหรับเชื่อมต่อ ThingsBoard Cloud

```cpp
/**
 * LAB 10: ThingsBoard IoT Cloud Telemetry & Attributes Client
 * Course: Digital Technology for Engineering, KSU
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASS = "";

const char* TB_SERVER = "thingsboard.cloud";
const int   TB_PORT   = 1883;
const char* TB_TOKEN  = "YOUR_ACCESS_TOKEN_HERE";

const char* TB_TELEMETRY_TOPIC = "v1/devices/me/telemetry";
const char* TB_ATTRIBUTES_TOPIC = "v1/devices/me/attributes";

#define DHTPIN 15
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define POT_VIB_PIN 34
#define RELAY_PIN 13
#define LED_PIN 12

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastSend = 0;

void reconnectThingsBoard() {
  while (!client.connected()) {
    Serial.print("[ThingsBoard] Connecting with Access Token...");
    if (client.connect("ESP32_Device", TB_TOKEN, NULL)) {
      Serial.println("CONNECTED!");
      digitalWrite(LED_PIN, HIGH);

      JsonDocument attrDoc;
      attrDoc["firmware_version"] = "v2.1.0";
      attrDoc["machine_model"] = "CNC-SPINDLE-4500";
      attrDoc["ip_address"] = WiFi.localIP().toString();

      String attrPayload;
      serializeJson(attrDoc, attrPayload);
      client.publish(TB_ATTRIBUTES_TOPIC, attrPayload.c_str());
    } else {
      digitalWrite(LED_PIN, LOW);
      Serial.printf("FAILED, rc=%d. Retrying in 3s...\n", client.state());
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LED_PIN, LOW);

  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  client.setServer(TB_SERVER, TB_PORT);
}

void loop() {
  if (!client.connected()) reconnectThingsBoard();
  client.loop();

  if (millis() - lastSend >= 3000) {
    lastSend = millis();

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int rawVib = analogRead(POT_VIB_PIN);
    float vibG = (rawVib / 4095.0) * 5.0; // 0.0 - 5.0 G

    if (!isnan(t) && !isnan(h)) {
      JsonDocument doc;
      doc["temperature"] = t;
      doc["humidity"] = h;
      doc["vibration"] = vibG;
      doc["fan_running"] = digitalRead(RELAY_PIN) == HIGH;

      String payload;
      serializeJson(doc, payload);

      client.publish(TB_TELEMETRY_TOPIC, payload.c_str());
      Serial.printf("[TELEMETRY -> ThingsBoard] %s\n", payload.c_str());
    }
  }
}
```
</div>

### 10.6.1 กุญแจยืนยันตัวตน (Authentication Token) และแนวปฏิบัติความปลอดภัย
*   **Authentication Token (Auth Token):** เปรียบเสมือนรหัสผ่านเฉพาะประจำตัวของอุปกรณ์ฮาร์ดแวร์ตัวนั้น หาก Access Token นี้หลุดรอดไปอยู่บนอินเทอร์เน็ต ผู้ประสงค์ร้ายสามารถส่งข้อมูลปลอมหรือแย่งการควบคุมเอาต์พุตได้ทันที
*   **แนวทางการป้องกัน:** หลีกเลี่ยงการเขียน Access Token และ SSID รหัสผ่าน Wi-Fi ลงในโค้ดต้นฉบับตรงๆ เพื่ออัปโหลดขึ้น GitHub หรือส่งการบ้าน ให้แยกเก็บข้อมูลรหัสเหล่านี้ไว้ในไฟล์ต่างหาก (เช่น `secrets.h`) และทำการป้องกันผ่านไฟล์ `.gitignore` ไม่ให้อัปโหลดขึ้นคลาวด์สาธารณะ
*   *ระดับอุตสาหกรรม:* ระบบจะใช้เทคนิค **Dynamic Provisioning** (ThingsBoard Device Provisioning / Device Profiles) โดยในตอนแรกอุปกรณ์จะทำหน้าที่เป็น Wi-Fi Access Point (AP) ให้วิศวกรใช้สมาร์ทโฟนเชื่อมต่อเข้าไปกรอก Access Token และเลือกเชื่อมต่อ Wi-Fi จากแอพเพื่อบันทึกลงหน่วยความจำถาวร (NVS/EEPROM) ของบอร์ดโดยไม่ต้องแก้ไขโค้ดใหม่

### 10.6.2 ข้อมูลโทรมาตร (Telemetry) และคำสั่งควบคุมระยะไกล (RPC)
*   **Telemetry & RPC Keys (โทรมาตรและคำสั่งควบคุม):** ใน ThingsBoard จะไม่มีระบบ "พินเสมือน" แบบเจาะจง แต่จะใช้โครงสร้างคีย์สตริง (String Key) ในการส่งและรับข้อมูล เช่น คีย์ `temperature` หรือ `pressure` สำหรับส่งข้อมูล และรับคำสั่งผ่านรูปแบบข้อความ JSON (RPC) เพื่อระบุแชนเนลข้อมูล ทำให้ระบบเป็นอิสระจากขาพินกายภาพของบอร์ดโดยตรงตามมาตรฐานอุตสาหกรรม
*   **ทิศทางการสื่อสาร:**
    1.  **Hardware-to-Cloud (Telemetry - ทิศทางจากบอร์ดขึ้นคลาวด์):** ส่งข้อมูลในรูปแบบ JSON ผ่านโปรโตคอล MQTT ไปยังหัวข้อ (Topic) `v1/devices/me/telemetry` เช่น จัดส่งแพ็กเกจ `{"temperature": 25.5}`
    2.  **Cloud-to-Hardware (Command & Control - ทิศทางรับคำสั่ง):** ใช้การตอบสนองต่อคำสั่งควบคุมระยะไกล (Remote Procedure Call - RPC) โดยบอร์ดจะสมัครรับข้อมูล (Subscribe) ที่หัวข้อ `v1/devices/me/rpc/request/+` เมื่อผู้ใช้งานคลิกปุ่มบนแดชบอร์ด เซิร์ฟเวอร์จะส่งคำสั่งในรูปแบบ JSON มายังบอร์ด เช่น `{"method": "setBurner", "params": true}` ให้บอร์ดแยกข้อมูลมาควบคุมอินเทอร์เฟซฮาร์ดแวร์:

```cpp
// ฟังก์ชันจัดการคำสั่ง RPC ที่ถูกเรียกใช้อัตโนมัติเมื่อได้รับข้อความจาก Broker
void onRpcCommand(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload, length);
  
  const char* method = doc["method"];
  if (strcmp(method, "setBurner") == 0) {
    bool switchState = doc["params"];       // อ่านค่าตัวแปรลоจิก (true หรือ false)
    digitalWrite(PIN_BURNER_RELAY, switchState ? HIGH : LOW); // สั่งงานเอาต์พุตกายภาพจริง
    
    // ส่งข้อมูลตอบกลับคลาวด์เพื่อยืนยันว่าทำงานสำเร็จ (RPC Response)
    String topicStr = String(topic);
    String requestId = topicStr.substring(topicStr.lastIndexOf("/") + 1);
    String responseTopic = "v1/devices/me/rpc/response/" + requestId;
    client.publish(responseTopic.c_str(), "{\"success\":true}");
  }
}
```

*   **การซิงโครไนซ์สถานะอุปกรณ์ (State Synchronization):**
    เมื่อบอร์ด ESP32 ขาดการเชื่อมต่อเครือข่ายชั่วคราวหรือระบบจ่ายไฟขัดข้อง เมื่อการเชื่อมต่อกลับมาเป็นปกติ บอร์ดสามารถอ่านค่าความต้องการควบคุมล่าสุดที่ค้างอยู่บนคลาวด์ได้โดยการส่งคำขอข้อมูลคุณลักษณะ (Shared Attributes Request) ไปยังหัวข้อ `v1/devices/me/attributes/request/1` เพื่อนำค่าสถานะที่คลาวด์จำลองเก็บไว้ (Digital Twin) มาปรับปรุงสถานะฮาร์ดแวร์ให้ตรงกันโดยอัตโนมัติ

### 10.6.3 การจัดการการเชื่อมต่อแบบ Blocking vs Non-blocking
*   **การเชื่อมต่อแบบ Blocking (MQTT Connection Loop):** 
    การใช้โครงสร้างการเชื่อมต่อแบบวนลูป `while (!client.connected())` ในลูปหลักของโค้ดโปรแกรมจะสร้างสภาวะบล็อกการทำงาน (Blocking) อุปกรณ์จะไม่ประมวลผลบรรทัดถัดไปหากยังเชื่อมต่อกับโบรกเกอร์ไม่สำเร็จ ซึ่งเป็นอันตรายอย่างยิ่งในงานอุตสาหกรรมเครื่องกลเนื่องจากลูปความปลอดภัยทางกายภาพจะหยุดทำงานทันที
*   **การเชื่อมต่อแบบ Non-blocking (Asynchronous / Non-blocking Connect):**
    วิศวกรควรเขียนโปรแกรมตรวจเช็กการเชื่อมต่อแบบอิงเวลาของรอบสุ่มตรวจ (เช่น ใช้กลไก `millis()` เช็คสถานะทุกๆ 5 วินาที) เพื่อแยกฟังก์ชันพยายามเชื่อมต่อให้ออกจากลูปทำงานปกติ ทำให้อุปกรณ์สามารถรันระบบตรวจวัดนิรภัยระดับท้องถิ่นได้ปกติแม้อินเทอร์เน็ตจะตัดขาด:

```cpp
unsigned long lastReconnectAttempt = 0;

void reconnectNonBlocking() {
  // พยายามเชื่อมต่อโบรกเกอร์ทุกๆ 5 วินาทีโดยไม่มีการวนลูปบล็อก
  if (millis() - lastReconnectAttempt > 5000) {
    lastReconnectAttempt = millis();
    Serial.println("Attempting MQTT connection...");
    if (client.connect("ESP32_Boiler", access_token, NULL)) {
      Serial.println("Connected to ThingsBoard!");
      client.subscribe("v1/devices/me/rpc/request/+");
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnectNonBlocking();
  } else {
    client.loop(); // รักษาการสื่อสารกับคลาวด์
  }
  
  // ลูปควบคุมความปลอดภัยในระดับท้องถิ่น (Local Safety Loop) ทำงานตอบสนองได้ทันที
  checkBoilerPressureAndTemperature();
}
```

### 10.6.4 ทำไมคำสั่ง `delay()` เป็นอันตรายในงาน IoT และซอฟต์แวร์ไทม์เมอร์แบบ Non-blocking
*   **อันตรายของ `delay()`:** ในงาน IoT การเรียกใช้ฟังก์ชันบล็อกเวลา เช่น `delay(5000)` จะทำให้สแต็กโปรโตคอล TCP/IP และการทำงานของโมดูล MQTT ขาดตอน บอร์ดจะไม่สามารถตอบกลับสัญญาณตรวจสอบการมีชีวิต (Ping Request/Heartbeat) ของ ThingsBoard MQTT Broker ได้สำเร็จ โบรกเกอร์จะสั่งตัดการเชื่อมต่อทันทีเนื่องจากเกิดสภาวะไทม์เอาต์ (Keep-alive Timeout) ทำให้อุปกรณ์เกิดวงจรหลุดต่อใหม่ซ้ำซาก
*   **กลไกของซอฟต์แวร์ไทม์เมอร์อิงกลไก `millis()`:** วิศวกรจะใช้ตัวเก็บเวลาสะสมของระบบไมโครคอนโทรลเลอร์เพื่อตรวจวัดความต่างเชิงเวลาในลักษณะไม่บล็อกสัญญาณ (Cooperative Non-blocking Timers) ทำให้อุปกรณ์สามารถเรียกฟังก์ชันตรวจสอบสถานะอย่าง `client.loop()` ได้นับแสนครั้งต่อวินาที ช่วยให้ระบบสื่อสารเครือข่ายยังคงทำงานได้เสถียรและตอบสนองได้รวดเร็ว
*   **ข้อควรระวังในการเขียนโปรแกรมจัดสรรเวลา:**
    1. หลีกเลี่ยงการกำหนดให้งานย่อยทำงานที่จุดเวลาเดียวกันพร้อมกัน เพื่อป้องกันภาวะเครือข่ายแน่นขนัด (Timer Collision) ควรทำการเยื้องเวลา (Offset) เล็กน้อย เช่น:
       * `timer.setInterval(1000L, sendTemperature);`
       * `timer.setInterval(1015L, sendPressure);` (เยื้องเวลาออกไป 15 ms)
    2. จำกัดจำนวน Event สูงสุดไม่เกิน 16 งานต่อ 1 ออบเจกต์ของซอฟต์แวร์ไทม์เมอร์แบบปราศจากการใช้ delay()

### 10.6.5 การควบคุมอัตราการส่งข้อมูลและ Flood Error (Rate Limiting)
คลาวด์แพลตฟอร์มมีการตั้งค่าระบบจำกัดแบนด์วิดท์ (Rate Limiting) สำหรับแผนการใช้งานทั่วไป ThingsBoard Server ยอมรับการส่งข้อมูล `client.publish()` ไม่เกิน 10-20 ครั้งต่อวินาที หากส่งข้อมูลถี่เกินไป บอร์ดจะถูกบล็อกการเชื่อมต่อจากเซิร์ฟเวอร์เนื่องจากข้อผิดพลาด **"Flood Error"** แนวทางป้องกันคือการตั้งเวลาส่งข้อมูลให้เหมาะสมด้วยซอฟต์แวร์ไทม์เมอร์แบบปราศจากการใช้ delay() และทำการส่งเฉพาะเมื่อข้อมูลเกิดการเปลี่ยนแปลงที่เกินเกณฑ์กำหนด (Deadband Filtering) เท่านั้น

### 10.6.6 ตัวอย่างโค้ด: การส่งข้อมูลเซนเซอร์ผ่าน ESP32 ขึ้นสู่ ThingsBoard Cloud
โค้ดด้านล่างแสดงการใช้บอร์ด ESP32 เชื่อมต่อเครือข่ายและจัดส่งชุดข้อมูลโทรมาตรจำลองอุณหภูมิและความดันขึ้นสู่ ThingsBoard Cloud ในรูปแบบข้อความ JSON ผ่านโปรโตคอล MQTT แบบปราศจากการบล็อกเวลา (Non-blocking):

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// รายละเอียดการเชื่อมต่อ Wi-Fi
const char* ssid = "Wokwi-GUEST";
const char* pass = "";

// รายละเอียดการเชื่อมต่อ ThingsBoard MQTT Broker
const char* tb_server = "thingsboard.cloud";
const int tb_port = 1883;
const char* access_token = "Your_Access_Token_Here"; // ใส่ Device Access Token ที่ได้จาก ThingsBoard

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 2000; // รอบการทำงานส่งข้อมูลทุกๆ 2 วินาที (2000 ms)

// ฟังก์ชันสำหรับส่งข้อมูลโทรมาตรขึ้นระบบคลาวด์
void sendSensorData() {
  float simulatedTemperature = random(200, 350) / 10.0; // สุ่มจำลองอุณหภูมิ 20.0 - 35.0 °C
  float simulatedPressure = random(10, 50) / 10.0;      // สุ่มจำลองความดัน 1.0 - 5.0 Bar
  
  // จัดเตรียมชุดข้อมูลในรูปแบบ JSON Document
  StaticJsonDocument<128> doc;
  doc["temperature"] = simulatedTemperature;
  doc["pressure"] = simulatedPressure;
  
  char payload[128];
  serializeJson(doc, payload);
  
  Serial.print("Publishing Telemetry payload: ");
  Serial.println(payload);
  
  // จัดส่งข้อความไปยังหัวข้อสำหรับโทรมาตรของ ThingsBoard
  client.publish("v1/devices/me/telemetry", payload);
}

// ฟังก์ชันเชื่อมต่อเครือข่ายอินเทอร์เน็ตและ MQTT โบรกเกอร์ใหม่
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting to connect to ThingsBoard...");
    // เชื่อมต่อโบรกเกอร์โดยกำหนด Username เป็น Access Token และไม่มีการใช้รหัสผ่าน
    if (client.connect("ESP32_Device", access_token, NULL)) {
      Serial.println(" Connected successfully!");
    } else {
      Serial.print(" Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, pass);
  client.setServer(tb_server, tb_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); // ประมวลผลคิวสื่อสาร MQTT และ Keep-alive
  
  // จัดส่งข้อมูลตามรอบสัญญาณเวลาโดยไม่บล็อกโค้ดในลูปหลัก
  if (millis() - lastSendTime >= sendInterval) {
    lastSendTime = millis();
    sendSensorData();
  }
}
```

---

## 10.7 ฐานข้อมูล time-series และการจัดเก็บข้อมูลเซนเซอร์

เมื่อข้อมูลการวัดจากบอร์ด ESP32 ถูกส่งถึงระบบคลาวด์ แพลตฟอร์มจำเป็นต้องบันทึกประวัติเพื่อแสดงเป็นกราฟหรือนำไปวิเคราะห์ การเก็บข้อมูล IoT มีข้อแตกต่างจากแอปพลิเคชันทั่วไป เนื่องจากข้อมูลเซนเซอร์มีลักษณะเป็นกระแสข้อมูลไหลเข้าต่อเนื่องตามเวลา (Continuous Streams)

### 10.7.1 ความแตกต่างระหว่างฐานข้อมูลแบบดั้งเดิม (SQL) และ Time-series Database (TSDB)
*   **โครงสร้างและการทำงานของ Relational Database (SQL เช่น MySQL, PostgreSQL):**
    *   เก็บข้อมูลในรูปแบบตารางเชื่อมโยงความสัมพันธ์ (Table structure) และจัดทำดัชนี (Indexing) ด้วยโครงสร้าง B-Tree 
    *   เมื่อมีเซนเซอร์นับพันตัวส่งข้อมูลเข้ามาพร้อมกันในระดับวินาที การเขียนข้อมูลลงตาราง SQL จะทำให้เกิดปัญหาขวดคอเนื่องจากระบบต้องใช้ทรัพยากรล็อกตารางและเรียงดัชนีใหม่ตลอดเวลา (ACID properties) อีกทั้งการดึงข้อมูลย้อนหลังตามช่วงเวลายังทำได้ช้ามาก
*   **โครงสร้างและการทำงานของ Time-series Database (TSDB เช่น InfluxDB, TimescaleDB):**
    *   จัดเก็บข้อมูลเรียงลำดับตามแกนหลักของเวลาอย่างต่อเนื่อง (Timestamp-driven) โดยใช้สถาปัตยกรรมแบบ Append-only (เขียนต่อท้ายบันทึกเดิมเสมอโดยไม่มีการแก้ไขข้อมูลในอดีต) 
    *   ความเร็วในการเขียนข้อมูลคงที่สม่ำเสมอไม่ขึ้นกับขนาดของฐานข้อมูลที่สะสม และมีประสิทธิภาพในการบีบอัดข้อมูลสูง เช่น อัลกอริทึม Double-Delta Compression เพื่อลดการใช้เนื้อที่บันทึกข้อมูลได้มากกว่า 90%
    *   มีคุณลักษณะในตัวสำหรับการคำนวณและลดความละเอียดของข้อมูล (Downsampling) เพื่อเปลี่ยนข้อมูลระดับวินาทีที่หมดความจำจำเป็นในอดีตให้เหลือค่าเฉลี่ยรายชั่วโมง และลบข้อมูลดิบทิ้งตามนโยบายอายุข้อมูล (Retention Policies) เพื่อป้องกันฐานข้อมูลล้น

**ตารางที่ 3: ความแตกต่างระหว่างฐานข้อมูลแบบดั้งเดิม (SQL) และ Time-series Database สำหรับโปรเจกต์ IoT**

| คุณลักษณะเด่น | Relational Database (SQL ดั้งเดิม) | Time-series Database (TSDB สำหรับ IoT) |
| :--- | :--- | :--- |
| **โครงสร้างการบันทึก** | ตารางเชื่อมโยงความสัมพันธ์ ดัชนี B-Tree | อิงเวลาเป็นหลัก (Timestamp index), LSM/TSM-Tree |
| **พฤติกรรมการบันทึก** | มีการ Insert, Update, Delete ที่ซับซ้อน | เขียนต่อท้ายอย่างเดียว (Append-only write) |
| **ประสิทธิภาพการดึงข้อมูลตามช่วงเวลา** | ช้าลงเรื่อยๆ เมื่อปริมาณแถวข้อมูลเพิ่มขึ้น | **เร็วคงที่** เนื่องจากแบ่งพาร์ทิชันตามหน้าต่างเวลา |
| **การจัดการพื้นที่จัดเก็บ** | ขนาดใหญ่ขึ้นตามข้อมูลดิบ ไม่บีบอัดเป็นพิเศษ | บีบอัดได้สูงมาก มีระบบ Downsampling อัตโนมัติ |

สำหรับ ThingsBoard คลาวด์ได้ทำการรวมระบบ TSDB ไว้หลังบ้านเรียบร้อยแล้ว ทำให้นักศึกษาดึงประวัติมาวาดกราฟเส้นย้อนหลัง (SuperChart) ได้ง่ายโดยไม่ต้องเขียนโค้ดคิวรีข้อมูลด้วยตนเอง

### 10.7.2 โครงสร้างและแนวคิดสำคัญของ InfluxDB (InfluxDB Core Concepts)

ในระบบ IoT คลาวด์ ฐานข้อมูลอนุกรมเวลาที่ได้รับความนิยมสูงสุดตัวหนึ่งคือ **InfluxDB** เพื่อที่จะใช้งานและเขียนโปรแกรมคิวรีข้อมูลในระดับสูงได้อย่างถูกต้อง วิศวกรต้องเข้าใจองค์ประกอบพื้นฐาน 4 ประการในการจัดเก็บข้อมูลของ InfluxDB:

1. **Measurement (การวัด):**
   เปรียบเสมือน "ชื่อตาราง" (Table) ในฐานข้อมูลเชิงสัมพันธ์ทั่วไป ใช้สำหรับบ่งบอกประเภทหรือกลุ่มของข้อมูลที่วัดจากแหล่งเดียวกัน ตัวอย่างเช่น `boiler_telemetry` (ข้อมูลโทรมาตรหม้อไอน้ำ) หรือ `bearing_vibration` (ความสั่นสะเทือนของตลับลูกปืน)
   
2. **Tag (แท็ก):**
   ข้อมูลระบุคุณลักษณะหรือคำอธิบาย (Metadata) ของข้อมูลการวัด โดยค่าของ Tag จะจัดเก็บในรูปแบบคู่ Key-Value ที่เป็นสตริง (String) และ**ถูกทำดัชนี (Indexed)** โดยระบบเสมอ ทำให้คิวรีค้นหา คัดกรอง หรือจัดกลุ่มได้รวดเร็วมาก ข้อเสียคือไม่ควรใช้ข้อมูลที่มีความหลากหลายสูงมากเกินไป (High Cardinality) เป็น Tag ตัวอย่างเช่น `device_id="esp32-01"`, `location="factory-floor-a"`, `sensor_type="thermocouple"`
   
3. **Field (ฟิลด์):**
   ข้อมูลผลลัพธ์จากการวัดจริงตามเวลา (Telemetry Data) เก็บเป็นคู่ Key-Value ที่**ไม่ถูกทำดัชนี (Non-indexed)** โดยค่าของ Field สามารถเป็นได้ทั้งตัวเลขจำนวนเต็ม (Integer) ทศนิยม (Float) บูลีน (Boolean) หรือสตริง (String) ตัวอย่างเช่น `temperature=124.5`, `pressure=8.2`, `vibration_rms=1.85`
   
4. **Timestamp (แกนเวลา):**
   เวลาที่ระบุจุดเกิดเหตุการณ์หรือเวลาที่ทำการวัดจริง (Time of entry) ซึ่งเป็นแกนหลักที่ระบุความเป็นอนุกรมเวลา โดย InfluxDB จะจัดเก็บในรูปแบบ UNIX Epoch time ที่มีความละเอียดสูงถึงระดับนาโนวินาที (Nanoseconds) ซึ่งจะนำมาใช้เป็นคีย์หลักอัตโนมัติในการบันทึกและสืบค้นข้อมูลเสมอ

---

## 10.8 กรณีศึกษาเชิงวิศวกรรมเครื่องกล (Mechanical/Industrial Case Studies)

เพื่อเชื่อมโยงความรู้สู่การใช้งานจริงในโรงงานอุตสาหกรรม นักศึกษาควรศึกษา 3 กรณีศึกษาต้นแบบต่อไปนี้:

### 10.8.1 กรณีศึกษาที่ 1: ระบบตรวจติดตามความปลอดภัยของหม้อไอน้ำอุตสาหกรรม (Steam Boiler Safety Monitoring)
*   **บริบทเชิงกล:** หม้อไอน้ำ (Factory Steam Boiler) เป็นอุปกรณ์ความดันสูงที่เสี่ยงต่อการระเบิดครั้งรุนแรงหากความดันเกินขีดจำกัด การวัดค่าต้องทำด้วยความรวดเร็วและน่าเชื่อถือ
*   **การเชื่อมต่อฮาร์ดแวร์:**
    *   วัดอุณหภูมิห้องเผาต้มน้ำด้วยหัววัด Thermocouple K-Type เชื่อมต่อบอร์ดตัวแปลงสัญญาณ MAX6675 ผ่านอินเทอร์เฟซ SPI
    *   วัดความดันไอน้ำด้วยเซนเซอร์ความดันเกจ (Pressure Transducer) เอาต์พุตแอนะล็อก 0-5V แปลงเป็นมาตราส่วน 0.0 - 15.0 Bar
    *   ควบคุมระบบไฟจ่ายของรีเลย์หัวเผาไหม้ (Burner Relay) เพื่อสั่งเปิด-ปิดแก๊สเชื้อเพลิง
*   **ตรรกะแบบไฮบริด (Edge-Cloud Hybrid Control):**
    *   *ตรรกะความปลอดภัยที่ Edge (Local Interlock):* ตัวบอร์ด ESP32 อ่านค่าความดันในพื้นที่ผลิตตลอดเวลา หากแรงดันไอน้ำเกิน **10.0 Bar** หรืออุณหภูมิห้องต้มสูงเกิน **200.0 °C** บอร์ดจะทำการตัดไฟปล่อยรีเลย์ของหัวเผาทันทีในระดับโค้ดของบอร์ดเพื่อตัดความร้อนทันทีโดยไม่นำเอาเครือข่ายอินเทอร์เน็ตเข้ามาเกี่ยว จากนั้นค่อยส่งสัญญาณแจ้งเตือนขึ้นคลาวด์และส่งแจ้งเตือนด่วน (Push Notification)
    *   *ตรรกะการคุมจากคลาวด์ (Cloud Control):* วิศวกรสามารถส่งคำสั่งเปิด-ปิดหัวเผาแบบแมนนวลผ่านหน้าจอแดชบอร์ดด้วยปุ่มควบคุมคำสั่งระยะไกล (RPC Key: `setBurner`) ได้ แต่การรับคำสั่งควบคุมระยะไกลนี้จะได้รับอนุมัติจากตรรกะในบอร์ด ESP32 ก็ต่อเมื่อค่าแรงดันและอุณหภูมิในหน้างานจริงมีความปลอดภัยเท่านั้น

### ตัวอย่างโค้ด: ระบบตรวจวัดและควบคุมความปลอดภัยหม้อไอน้ำ (Non-blocking & Local Safety Interlock)
```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// กำหนดขาพิน GPIO ของ ESP32
#define PIN_PRESSURE_ADC 34    // ขาเซนเซอร์ความดันอนาล็อก
#define PIN_TEMP_ADC 35        // ขาเซนเซอร์อุณหภูมิอนาล็อก
#define PIN_BURNER_RELAY 25    // ขารีเลย์ควบคุมหัวเผา
#define PIN_ALARM_LED 26       // ขาหลอดไฟเตือนภัยของบอร์ด

// เกณฑ์จำกัดความปลอดภัยเชิงกล
const float LIMIT_MAX_PRESSURE = 10.0; // บาร์ (Bar)
const float LIMIT_MAX_TEMP = 200.0;    // องศาเซลเซียส (C)

// รายละเอียดการเชื่อมต่อ Wi-Fi และ ThingsBoard Cloud
const char* ssid = "Wokwi-GUEST";
const char* pass = "";
const char* tb_server = "thingsboard.cloud";
const int tb_port = 1883;
const char* access_token = "Your_Boiler_Access_Token"; // โทเค็นคีย์ประจำอุปกรณ์

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 2000; // รอบการอ่านค่าและส่งข้อมูลขึ้นคลาวด์ทุก 2 วินาที
bool burnerState = false; // สถานะการทำงานของหัวเผาที่ได้รับอนุญาต

// ฟังก์ชันอ่านและแปลงค่าความดันจากเซนเซอร์อนาล็อก
float readPressure() {
  int rawAdc = analogRead(PIN_PRESSURE_ADC);
  float voltage = (rawAdc / 4095.0) * 3.3;
  return (voltage / 3.3) * 15.0; // แปลงมาตราส่วนช่วงแรงดัน 0.0 - 15.0 Bar
}

// ฟังก์ชันอ่านและแปลงค่าอุณหภูมิห้องต้ม
float readTemperature() {
  int rawAdc = analogRead(PIN_TEMP_ADC);
  return (rawAdc / 4095.0) * 250.0; // แปลงช่วงอุณหภูมิ 0.0 - 250.0 °C
}

// ลูปความปลอดภัยในพื้นที่ (Local Safety Interlock) และส่งรายงานโทรมาตร
void monitorAndControlSystem() {
  float currentPressure = readPressure();
  float currentTemp = readTemperature();
  bool alarmActive = false;
  
  Serial.print("Pressure: "); Serial.print(currentPressure); Serial.print(" Bar | ");
  Serial.print("Temp: "); Serial.print(currentTemp); Serial.println(" C");

  // --- ตรรกะระดับ Edge (Local Interlock Safety Trip) ---
  // หากค่าความดันหรืออุณหภูมิเกินเกณฑ์ปลอดภัย ระบบสั่งตัดวงจรกายภาพทันทีโดยไม่พึ่งพาเครือข่ายอินเทอร์เน็ต
  if (currentPressure > LIMIT_MAX_PRESSURE || currentTemp > LIMIT_MAX_TEMP) {
    digitalWrite(PIN_BURNER_RELAY, LOW); 
    digitalWrite(PIN_ALARM_LED, HIGH);
    burnerState = false;
    alarmActive = true;
    Serial.println("!!! DANGER: Safety limit exceeded. Interlock tripped burner off.");
  } else {
    // หากสภาวะปกติ ให้ทำงานตามคำสั่งควบคุมล่าสุด
    digitalWrite(PIN_BURNER_RELAY, burnerState ? HIGH : LOW);
    digitalWrite(PIN_ALARM_LED, LOW);
  }

  // รวบรวมข้อมูลและส่งรายงานขึ้น ThingsBoard
  if (client.connected()) {
    StaticJsonDocument<256> doc;
    doc["pressure"] = currentPressure;
    doc["temperature"] = currentTemp;
    doc["burnerState"] = burnerState;
    doc["alarmLED"] = alarmActive;
    doc["statusMsg"] = alarmActive ? "ALARM: Limits Exceeded! Boiler Safety Tripped." : "Boiler System Running Normally.";

    char payload[256];
    serializeJson(doc, payload);
    client.publish("v1/devices/me/telemetry", payload);
  }
}

// ฟังก์ชัน Callback รองรับคำสั่งควบคุม RPC จากทางโบรกเกอร์ (ThingsBoard)
void callback(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error) return;

  const char* method = doc["method"];
  if (strcmp(method, "setBurner") == 0) {
    bool remoteCommand = doc["params"]; // คำสั่งสวิตช์เปิด/ปิดจากหน้าจอแดชบอร์ด (true = เปิด, false = ปิด)
    
    float currentPressure = readPressure();
    float currentTemp = readTemperature();

    if (remoteCommand == true) {
      // ตรวจเช็กระบบนิรภัยความร้อนและความดันก่อนอนุมัติรันหัวเผา
      if (currentPressure < LIMIT_MAX_PRESSURE && currentTemp < LIMIT_MAX_TEMP) {
        burnerState = true;
        digitalWrite(PIN_BURNER_RELAY, HIGH);
        Serial.println("Burner turned ON via Cloud RPC.");
      } else {
        burnerState = false;
        digitalWrite(PIN_BURNER_RELAY, LOW);
        Serial.println("RPC rejected: Boiler status is in unsafe range.");
      }
    } else {
      burnerState = false;
      digitalWrite(PIN_BURNER_RELAY, LOW);
      Serial.println("Burner turned OFF via Cloud RPC.");
    }

    // ตอบกลับ RPC Response เพื่อรายงานสถานะปัจจุบันกลับสู่แดชบอร์ด
    String topicStr = String(topic);
    String requestId = topicStr.substring(topicStr.lastIndexOf("/") + 1);
    String responseTopic = "v1/devices/me/rpc/response/" + requestId;
    
    StaticJsonDocument<128> responseDoc;
    responseDoc["success"] = true;
    responseDoc["burnerState"] = burnerState; // อัปเดตสถานะปุ่มกลับคืนไปที่สวิตช์แดชบอร์ด (UI Sync)
    
    char responsePayload[128];
    serializeJson(responseDoc, responsePayload);
    client.publish(responseTopic.c_str(), responsePayload);
  }
}

// ฟังก์ชันต่อเชื่อม MQTT Broker
void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to ThingsBoard...");
    if (client.connect("ESP32_Boiler", access_token, NULL)) {
      Serial.println(" Connected!");
      // สมัครรับ RPC Request ทันทีที่เชื่อมต่อเสร็จสิ้น
      client.subscribe("v1/devices/me/rpc/request/+");
    } else {
      Serial.print(" Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  pinMode(PIN_BURNER_RELAY, OUTPUT);
  pinMode(PIN_ALARM_LED, OUTPUT);
  digitalWrite(PIN_BURNER_RELAY, LOW);
  digitalWrite(PIN_ALARM_LED, LOW);

  WiFi.begin(ssid, pass);
  client.setServer(tb_server, tb_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // รอบสุ่มส่งข้อมูลและตรวจสอบลูปควบคุมภายในท้องถิ่นแบบไม่บล็อกเวลา
  if (millis() - lastSendTime >= sendInterval) {
    lastSendTime = millis();
    monitorAndControlSystem();
  }
}
```

### 10.8.2 กรณีศึกษาที่ 2: ระบบตรวจสอบและวิเคราะห์การสั่นสะเทือนของแบริ่งมอเตอร์ขับในโรงงาน (CNC Spindle Bearing Monitoring)
*   **บริบทเชิงกล:** แบริ่งแกนหมุนของเครื่องจักรกลมักมีสัญญาณเสื่อมสภาพเกิดขึ้นก่อนความเสียหายจริงในรูปแรงสั่นสะเทือนตามความถี่รอบการทำงาน
*   **การประยุกต์ใช้งาน:** บอร์ด ESP32 เชื่อมต่อกับไอซีเซนเซอร์วัดความเร่ง 3 แกนแบบดั้งเดิม ADXL345 ผ่านเครือข่ายบัส I2C ทำการดึงค่าความเร่งความถี่สูงมาสะสมและถอดฟังก์ชันหาค่ารากเฉลี่ยกำลังสอง (RMS) ตามมาตรฐานการสั่นสะเทือน ISO 10816 จากนั้นส่งเพียงผลลัพธ์ $a_{RMS}$ ทุกๆ 5 วินาที ขึ้นไปเก็บที่ **คีย์ส่งโทรมาตร `vibration_rms` (Telemetry)** และพล็อตแนวโน้มสุขภาพแบริ่งในระยะยาวบนคลาวด์เพื่อการซ่อมบำรุงเชิงพยากรณ์

### 10.8.3 กรณีศึกษาที่ 3: ระบบตรวจติดตามการรั่วไหลและการประหยัดพลังงานในระบบลมอัด (Pneumatic System Air Leak Detection)
*   **บริบทเชิงกล:** ระบบลมอัดนิวแมติกส์ใช้กำลังไฟฟ้ารวมสูงมากในระบบอุตสาหกรรม จุดลมอัดรั่วไหลเป็นสาเหตุหลักของการสิ้นเปลืองพลังงานที่มองไม่เห็น
*   **การประยุกต์ใช้งาน:** ติดตั้งเซนเซอร์วัดอัตราการไหลของลม (Air Flow Sensor) และเซนเซอร์วัดความดันในท่อส่งลมรอบโรงงาน บอร์ด ESP32 ตรวจวัดค่าและใช้อัลกอริทึมวิเคราะห์ช่วงเวลาที่โรงงานหยุดเดินกระบวนการผลิต (Off-peak / Night-shift window) หากพบว่าอัตราการไหลของลมยังมีค่าสูงอยู่ แสดงว่าเกิดจุดรั่วไหลในระบบ และส่งคำสั่งแจ้งเตือนความผิดปกติไปยังวิศวกรผู้ดูแลอาคาร นอกจากนี้ยังตั้งค่าโหมดประหยัดพลังงาน **Deep Sleep** ให้กับอุปกรณ์เพื่อการประหยัดแบตเตอรี่ในกรณีที่ต้องการติดตั้งในพื้นที่ห่างไกล

---

## 10.9 ความปลอดภัยและความเป็นส่วนตัวเบื้องต้นของระบบ IoT

ความปลอดภัยไซเบอร์ (Cybersecurity) เป็นประเด็นวิกฤตที่ละเลยไม่ได้ในการเชื่อมต่อฮาร์ดแวร์ระบบกายภาพ-ไซเบอร์ (Cyber-Physical Systems) เข้ากับโลกอินเทอร์เน็ต เนื่องจากวิศวกรเครื่องกลต้องรับผิดชอบการทำงานของอุปกรณ์ในพื้นที่จริง

1. **การปกป้องกุญแจยืนยันตัวตน (Auth Token Safety):**
   อย่างที่กล่าวข้างต้น Access Token เป็นคีย์ลับที่ใช้ระบุตัวตนของบอร์ด ESP32 การเปิดเผยโทเค็นสาธารณะจะเปิดโอกาสให้เกิดการโจมตีหรือขโมยข้อมูลได้ง่าย แนวทางปฏิบัติคือไม่ควรฮาร์ดโค้ดรหัสผ่านไว้ในโค้ดดิบและใช้ไฟล์แยกต่างหาก
2. **การเข้ารหัสข้อมูลที่ชั้นขนส่งเครือข่าย (Transport Layer Security - TLS/SSL):**
   การสื่อสารแบบไม่มีการเข้ารหัส (HTTP หรือ Plain MQTT) จะทำให้ข้อความที่รับส่งถูกดักจับและอ่านค่าออกได้ง่ายด้วยโปรแกรม Packet Sniffer ภัยคุกคามนี้แก้ปัญหาได้โดยการใช้โปรโตคอลเข้ารหัสอย่าง **HTTPS** หรือ **MQTTS** ซึ่งจะจัดส่งข้อมูลผ่านท่อร่วมเครือข่ายที่เข้ารหัสปลอดภัย
   *   *ข้อพิจารณาสำหรับ ESP32:* การเปิดใช้ไลบรารีเข้ารหัสอย่าง `WiFiClientSecure` แทน `WiFiClient` ปกติ เพื่อต่อ ThingsBoard ผ่านพอร์ตเข้ารหัส SSL (พอร์ต 443 หรือ 9443) ต้องแลกมาด้วยทรัพยากรการประมวลผลทางคณิตศาสตร์เข้ารหัสที่ซับซ้อน ทำให้เกิด **CPU Overhead** และใช้เนื้อที่ของหน่วยความจำ **RAM เพิ่มขึ้น 20 - 30 KB** ในการเก็บบัฟเฟอร์แลกเปลี่ยนคีย์ ซึ่งวิศวกรออกแบบระบบต้องตรวจสอบหน่วยความจำคงเหลือให้รัดกุมก่อนเปิดใช้งาน
3. **ความปลอดภัยของการอัปเดตระบบระยะไกล (Secure OTA Updates):**
   การดาวน์โหลดโค้ดเฟิร์มแวร์เพื่อแก้ไขและอัปเดตอุปกรณ์ผ่านอากาศ (Over-The-Air) เสี่ยงต่อภัยคุกคามการแทรกโค้ดอันตราย (Malicious Firmware Injection) จากภายนอก แพลตฟอร์มมาตรฐานอุตสาหกรรมจึงมักใช้หลักการ **Firmware Signing** โดยการลงชื่อดิจิทัลให้กับโค้ดใหม่ผ่านกุญแจส่วนตัว (Private Key) และมีกุญแจสาธารณะ (Public Key) ฝังอยู่ในบอร์ดเพื่อตรวจสอบความถูกต้องร่วมกับการเช็คค่าแฮช (SHA-256 Checksum) เพื่อยืนยันว่าเฟิร์มแวร์ไม่ถูกแก้ไขระหว่างทางก่อนอนุมัติให้เขียนทับ
4. **วิธีการยืนยันตัวตนของ MQTT Broker (MQTT Broker Authentication Methods):**
   ในการรับส่งข้อมูลผ่านโปรโตคอล MQTT เพื่อความปลอดภัย นอกจากการเข้ารหัสช่องทางสื่อสารด้วย TLS/SSL แล้ว MQTT Broker จะต้องตรวจสอบสิทธิ์ในการเข้าถึงของไคลเอนต์ (ESP32) เพื่อกำหนดสิทธิ์ในการ Publish หรือ Subscribe โดยมีวิธีการหลัก 2 วิธีดังนี้:
   *   **การยืนยันตัวตนด้วยใบรับรองความปลอดภัย TLS/SSL (TLS/SSL Client Certificates / Mutual TLS):**
       เป็นมาตรฐานความปลอดภัยสูงสุด (mTLS) โดยแทนที่จะใช้ Username และ Password โบรกเกอร์และไคลเอนต์ (ESP32) ต่างฝ่ายต่างส่งใบรับรองดิจิทัล (X.509 Certificate) เพื่อยืนยันตัวตนของกันและกัน ไคลเอนต์จะต้องบันทึกใบรับรองความปลอดภัยและคีย์ลับเฉพาะตัว (Private Key & Client Certificate) ลงในหน่วยความจำแฟลชภายใน เพื่อใช้ยืนยันความถูกต้องในขั้นตอน Handshake วิธีนี้ช่วยป้องกันภัยคุกคามจากการดักฟังและแอบอ้างสิทธิ์ (Spoofing) ได้ 100% แต่ต้องการทรัพยากรประมวลผลสูงมาก
   *   **การยืนยันตัวตนด้วยโทเค็น (Token-based Authentication / JWT):**
       เป็นกระบวนการยืนยันสิทธิ์โดยการใช้โทเค็น (Token) ชั่วคราวหรือโทเค็นเฉพาะของอุปกรณ์ (เช่น ThingsBoard Access Token หรือ JSON Web Token - JWT) แทนการเปิดเผยรหัสผ่านจริงทางกายภาพ โดยไคลเอนต์จะส่งโทเค็นนี้ไปในฟิลด์ Username หรือ Password เมื่อเชื่อมต่อกับ MQTT Broker ข้อดีคือวิศวกรผู้ควบคุมระบบคลาวด์สามารถสั่งยกเลิกสิทธิ์การทำงานของอุปกรณ์เฉพาะตัว (Revoke Token) ได้ทันทีเมื่อบอร์ดถูกขโมยหรือเสียหาย โดยไม่ต้องเปลี่ยนรหัสผ่านของระบบทั้งหมด และยังสามารถกำหนดช่วงอายุของโทเค็นให้หมดอายุอัตโนมัติได้

---

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

## สรุปท้ายบท

เทคโนโลยีคลาวด์และแพลตฟอร์ม IoT ทำหน้าที่เป็นสะพานและคลังจัดเก็บข้อมูลส่วนกลาง ช่วยให้วิศวกรเครื่องกลยุคปัจจุบันเปลี่ยนกระบวนการมอนิเตอร์ในสถานที่ผลิตเป็นการดูสถานะเครื่องจักรร่วมควบคุมระยะไกลได้จากทุกที่ทั่วโลก การเข้าใจจุดสมดุลของการประมวลผลข้อมูลระหว่าง Edge Computing ที่ให้การตอบสนองที่ฉับไวและความทนทานเชิงควบคุม กับ Cloud Computing ที่เด่นในการบันทึกประวัติระยะยาวและการวิเคราะห์เชิงลึก เป็นหัวใจสำคัญของวิศวกร

การเลือกใช้สถาปัตยกรรมที่ประหยัดแบนด์วิดท์อย่างการดึงคุณลักษณะที่ Edge (Feature Extraction), การเลือกโปรโตคอลสื่อสาร IoT (เช่น MQTT) ที่ประหยัดแบนด์วิดท์ และการใช้ฐานข้อมูลอนุกรมเวลา (TSDB) ที่บันทึกประวัติการวัดตามเวลาได้อย่างรวดเร็ว คือรากฐานในการออกแบบระบบที่มีประสิทธิภาพและประหยัดค่าใช้จ่าย สุดท้ายนี้การตระหนักรู้และออกแบบระบบความปลอดภัยไซเบอร์ เช่น การเข้ารหัสข้อมูล (TLS) และการคุมสิทธิ์เข้าถึงอุปกรณ์ จะช่วยสร้างความมั่นใจในการพัฒนาโครงงานในวิชาชีพวิศวกรรมสืบไป

---

## แบบฝึกหัด

**ส่วนที่ 1: คำถามทบทวนความเข้าใจเชิงทฤษฎีและการคำนวณ**

1. จงอธิบายความแตกต่างที่สำคัญในแง่หน้าที่และความเหมาะสมในการนำไปใช้งานของรูปแบบบริการคลาวด์แบบ IaaS, PaaS และ SaaS ในงาน IoT
2. เหตุใดระบบจัดเก็บข้อมูลในแพลตฟอร์ม IoT ส่วนใหญ่จึงนิยมเลือกใช้ฐานข้อมูลแบบอนุกรมเวลา (Time-series Database) มากกว่าการใช้ฐานข้อมูลเชิงสัมพันธ์ (SQL Database) แบบดั้งเดิม จงอภิปรายโดยยกเหตุผลทางสถาปัตยกรรมมาประกอบอย่างน้อย 3 ข้อ
3. จงยกตัวอย่างเงื่อนไขที่วิศวกรเครื่องกลควรเลือกประมวลผลข้อมูลในระดับ Edge Computing และกรณีใดควรประมวลผลบน Cloud Computing
4. จงบอกหน้าที่หลักขององค์ประกอบ "Device Management" ในแพลตฟอร์ม IoT และระบบ Digital Twin ช่วยแก้ไขปัญหาการทำงานอย่างไรในกรณีที่ฮาร์ดแวร์ออฟไลน์ชั่วคราว
5. จากความรู้เรื่องการเขียนโปรแกรมเชื่อมต่อ ThingsBoard เหตุใดผู้พัฒนาจึงต้องหลีกเลี่ยงการใช้คำสั่ง `delay()` ในลูปหลักของโค้ดโปรแกรม และหากเรามีความจำเป็นต้องหน่วงการส่งข้อมูลทุกๆ 3 วินาที จะต้องออกแบบโค้ดโปรแกรมอย่างไรให้ไม่ขัดต่อระบบ Keep-alive ของ ThingsBoard Server
6. การส่งข้อมูลด้วยโปรโตคอล HTTPS หรือ MQTTS บน ESP32 เพื่อเพิ่มความมั่นคงปลอดภัยในการรับส่งข้อมูล มีผลกระทบต่อทรัพยากรการประมวลผลและหน่วยความจำของไมโครคอนโทรลเลอร์อย่างไรบ้าง
7. **แบบฝึกหัดการคำนวณปริมาณการใช้งานข้อมูลเครือข่าย (Bandwidth Calculation):**
   สถานีตรวจวัดทางวิศวกรรมแห่งหนึ่งติดตั้งอุปกรณ์เซนเซอร์วัดค่าความดันและอุณหภูมิ 5 ตัว อุปกรณ์ทำหน้าที่รวบรวมข้อมูลดิบขนาดรวม 60 ไพต์ (Bytes) และต้องจัดส่งข้อมูลชุดนี้ไปบันทึกบนคลาวด์ในทุกๆ 10 วินาที ตลอด 24 ชั่วโมง
   *   **กรณีที่ 1:** ส่งข้อมูลผ่านโปรโตคอล **HTTP POST** ซึ่งมี Overhead ของเอกสารส่วนหัวโปรโตคอลเฉลี่ย 350 ไพต์ ต่อการร้องขอส่งข้อมูลหนึ่งครั้ง
   *   **กรณีที่ 2:** ส่งข้อมูลผ่านโปรโตคอล **MQTT Publish** ซึ่งมี Overhead รวมเฉลี่ย 20 ไพต์ ต่อการส่งข้อมูลหนึ่งครั้ง (คิดเฉพาะการสื่อสารข้อมูลไม่รวมการตรวจสอบสถานะเชื่อมต่อคงค้าง)
   
   *คำถาม:*
   1. จงคำนวณหาปริมาณทราฟฟิกข้อมูลที่อุปกรณ์ใช้ส่งข้อมูลในระยะเวลา 30 วัน (1 เดือน) ของทั้งสองกรณีในหน่วย Megabytes (MB) โดยกำหนดให้คำนวณเทียบทั้งหน่วยฐาน 10 ($1\text{ MB} = 10^6\text{ Bytes}$) และหน่วยฐาน 2 ($1\text{ MiB} = 2^{20}\text{ Bytes}$)
   2. จากผลลัพธ์การคำนวณข้างต้น จงวิเคราะห์ความแตกต่างและสรุปเหตุผลในเชิงเครือข่ายสำหรับวิศวกรเครื่องกลหากต้องการขยายสเกลอุปกรณ์เพิ่มเป็น 100 สถานีทั่วประเทศ
8. **แบบฝึกหัดวิเคราะห์ปัญหาคอขวดเชิงเวลา (Execution Time Analysis):**
   นักศึกษาคนหนึ่งต้องการส่งค่าความดันหม้อไอน้ำขึ้น ThingsBoard Cloud โดยการทดลองเขียนโค้ดในลูปหลักดังนี้:
   ```cpp
   void loop() {
     client.loop();
     float pressure = analogRead(34) * (15.0 / 4095.0);
     
     StaticJsonDocument<50> doc;
     doc["pressure"] = pressure;
     char payload[64];
     serializeJson(doc, payload);
     client.publish("v1/devices/me/telemetry", payload);
     
     delay(5000); // หน่วงเวลา 5 วินาทีเพื่อให้อุปกรณ์ไม่ทำงานหนักเกินไป
   }
   ```
   *คำถาม:* จงวิเคราะห์ว่าโค้ดดังกล่าวจะส่งผลเสียต่อการเฝ้าสังเกตการณ์และการตอบสนองบน ThingsBoard Dashboard อย่างไรบ้าง และระบุสาเหตุทางทฤษฎี (ในแง่ของ Keep-alive Heartbeat และการรับสัญญาณ RPC Callbacks) พร้อมเสนอโค้ดการปรับปรุงระบบใหม่ที่ถูกต้องโดยใช้แนวคิดซอฟต์แวร์ไทม์เมอร์ที่ปราศจากการบล็อกเวลา
9. **แบบฝึกหัดวิเคราะห์สถาปัตยกรรมความปลอดภัยระดับ Edge vs Cloud:**
   สมมติว่าคุณกำลังออกแบบระบบนิรภัยป้องกันระเบิดของหม้อไอน้ำในโรงงาน หากเกิดกรณีแรงดันสูงเกินเกณฑ์จำกัด จงอภิปรายความแตกต่างของผลลัพธ์และความเสี่ยงหากคุณนำตรรกะความปลอดภัยในการตัดระบบหัวเผาไปประมวลผลบนคลาวด์ (Cloud Control) เทียบกับการออกแบบให้ตัดระบบในระดับท้องถิ่น (Edge Interlock) โดยพิจารณาสถานการณ์จริงหากระบบเครือข่ายอินเทอร์เน็ตขัดข้องเป็นเวลา 15 วินาที

---

**ส่วนที่ 2: ใบงานภาคปฏิบัติจำลองวงจรบน Wokwi**

### ใบงานที่ 8.1: ระบบควบคุมการตัดทำงานอัตโนมัติของหม้อไอน้ำผ่านโปรโตคอล MQTT ร่วมกับ ThingsBoard RPC
ให้นักศึกษาสร้างวงจรจำลองและเขียนโค้ดควบคุมระบบความปลอดภัยหม้อไอน้ำบนเว็บไซต์ Wokwi โดยมีรายละเอียดดังนี้:

1.  **การเชื่อมต่อฮาร์ดแวร์จำลอง:**
    *   ใช้บอร์ด **ESP32** เป็นตัวประมวลผลหลัก
    *   ต่อตัวต้านทานปรับค่าได้แบบสไลด์ (Slide Potentiometer) เข้ากับขา **GPIO34** (ADC) เพื่อจำลองการวัดความดันหม้อไอน้ำ (กำหนดมาตราส่วนให้ 0-3.3V แปลงเป็นแรงดัน 0.0 - 15.0 Bar)
    *   ต่อหลอดไฟ **LED สีเขียว** เข้ากับขา **GPIO12** เพื่อจำลองปั๊มน้ำป้อนระบบ (Water Feed Pump Relay)
    *   ต่อหลอดไฟ **LED สีแดง** เข้ากับขา **GPIO14** เพื่อจำลองวาล์วระบายแรงดันฉุกเฉิน (Solenoid Relief Valve)
2.  **การเชื่อมโยงข้อมูลกับระบบ ThingsBoard Cloud (Telemetry & RPC):**
    *   คีย์โทรมาตร `"pressure"` (Gauge/Chart): ส่งอัปเดตข้อมูลความดันไอน้ำจำลอง (bar)
    *   คีย์โทรมาตร `"alarmLED"` (LED Status): แสดงสถานะไฟสีแดงเตือนภัยอันตรายระดับวิกฤต
    *   คำสั่ง RPC คีย์ `"setRelief"` (Switch/Button Widget): ปุ่มรับคำสั่งสั่งปล่อยวาล์วระบายแรงดันระยะไกลจากแดชบอร์ด
    *   คีย์โทรมาตร `"statusMsg"` (Value/String Display): ส่งข้อความรายละเอียดประวัติล็อกสถานะจาก ESP32
3.  **ข้อกำหนดการเขียนโปรแกรม (C++):**
    *   โค้ดโปรแกรมต้องใช้รูปแบบ **Non-blocking connection** (`client.connect()` ในการตรวจจับรอบจังหวะเวลาที่ไม่บล็อกลูปการทำงานหลัก) เพื่อให้บอร์ดตรวจสอบความปลอดภัยได้แม้ไม่มีการเชื่อมต่อคลาวด์
    *   ใช้ **ซอฟต์แวร์ไทม์เมอร์แบบปราศจากการใช้ delay()** ในการอ่านค่าจากอินพุตและส่งข้อมูลขึ้นคลาวด์ทุกๆ 1 วินาที ห้ามใช้คำสั่ง `delay()` ในโค้ด
    *   *ตรรกะความปลอดภัย Edge Interlock:* หากอ่านความดันไอน้ำได้เกิน **8.0 Bar** ESP32 จะต้องสั่งตัดปั๊มน้ำทันที (LED สีเขียวดับ) สั่งเปิดวาล์วระบายไอน้ำ (LED สีแดงติดสว่าง) ในระดับบอร์ดทันที พร้อมส่งอัปเดตคีย์ `"alarmLED"` เป็น `true` และอัปเดตคีย์ `"statusMsg"` แจ้งสัญญาณภัยพิบัติ
    *   *ตรรกะควบคุมระยะไกล:* หากแรงดันปกติ (< 8.0 Bar) วิศวกรสามารถกดควบคุมเปิด-ปิดวาล์วระบายฉุกเฉิน (LED สีแดง) ผ่านคำสั่ง RPC คีย์ `"setRelief"` จากคลาวด์ได้ แต่ถ้าหากแรงดันสูงเกินเกณฑ์ปลอดภัยแล้ว ตรรกะของบอร์ดต้องบังคับเปิดค้างเพื่อระบายความดันทันที โดยปุ่มแมนนวลระยะไกลจะถูกบล็อกความสามารถในการปิดวาล์ว

### ใบงานที่ 8.2: ระบบส่งข้อมูลเซนเซอร์แบบแปรผันตามระดับสัญญาณอันตราย (Dynamic Telemetry Rate Controller)
ให้นักศึกษาสร้างวงจรจำลองบน Wokwi เพื่อเรียนรู้การจัดการแบนด์วิดท์เครือข่ายและการหลีกเลี่ยงข้อผิดพลาด Flood Error:

1.  **การเชื่อมต่อฮาร์ดแวร์จำลอง:**
    *   ใช้บอร์ด **ESP32** 
    *   ต่อเซนเซอร์วัดอุณหภูมิและความชื้น **DHT22** เข้ากับขา **GPIO15**
    *   ต่อปุ่มกดกายภาพ (Push Button) เข้ากับขา **GPIO13** (จำลองสวิตช์ร้องขออัปเดตข้อมูลฉุกเฉิน)
2.  **การเชื่อมโยง ThingsBoard Cloud:**
    *   คีย์โทรมาตร `"temperature"` (Gauge): แสดงอุณหภูมิสะสมของชิ้นส่วนกลจักร (°C)
    *   คีย์โทรมาตร `"humidity"` (Gauge): แสดงความชื้นสัมพัทธ์แวดล้อม (%)
    *   คีย์โทรมาตร `"telemetryInterval"` (Value Display): แสดงช่วงความถี่รอบจังหวะเวลาในการส่งโทรมาตรในวินาที
3.  **ข้อกำหนดการทำงาน:**
    *   **Normal State (สภาวะปกติ):** หากอุณหภูมิที่วัดได้ไม่เกิน **40.0 °C** ให้ทำการส่งข้อมูลอุณหภูมิและความชื้นขึ้นคลาวด์ทุกๆ **10 วินาที** เพื่อการประหยัดพลังงานและพื้นที่ฐานข้อมูล
    *   **Critical State (สภาวะวิกฤต):** หากเครื่องจักรเริ่มสะสมความร้อนจนอุณหภูมิสูงเกิน **40.0 °C** ให้โค้ดปรับระดับความถี่การส่งข้อมูลให้ละเอียดยิ่งขึ้นเป็นทุกๆ **2 วินาที** ทันทีแบบอัตโนมัติ เพื่อให้วิศวกรเฝ้าสังเกตพฤติกรรมอย่างใกล้ชิด และปรับกลับมาส่งทุก 10 วินาทีเมื่ออุณหภูมิลดลงต่ำกว่า 38.0 °C (เพื่อป้องกันสัญญาณแกว่งรอบขีดจำกัดด้วยเงื่อนไข Hysteresis)
    *   **On-Demand Update:** หากผู้ใช้อยู่ที่พื้นที่เดินเครื่องจักรและกดปุ่มกายภาพ (GPIO13) บอร์ด ESP32 จะต้องทำการส่งค่าข้อมูลเซนเซอร์ล่าสุดในตอนนั้นขึ้นคลาวด์ในทันที (Manual force push) 1 ครั้ง แต่ต้องเขียนโค้ดป้องกันการกดซ้ำซ้อนถี่เกินไป (Rate Limiter / Debouncing) โดยจำกัดสิทธิ์ให้ส่งได้ไม่เกิน 1 ครั้งในระยะเวลา 1 วินาที เพื่อไม่ให้ระบบเกิดข้อผิดพลาด อัตราจำกัดของโบรกเกอร์ (Rate Limiting)


---

## หัวข้อเพิ่มเติม: สถาปัตยกรรมคลาวด์ขั้นสูงสำหรับระบบ IoT

### Serverless Architecture สำหรับ IoT
Serverless Computing (เช่น AWS Lambda, Google Cloud Functions) กำลังเป็นที่นิยมในการประมวลผลข้อมูล IoT เนื่องจากนักพัฒนาสามารถเขียนโค้ดเพื่อตอบสนองต่อเหตุการณ์ (Event-driven) เช่น เมื่อมีข้อความ MQTT เข้ามา ก็จะทริกเกอร์ฟังก์ชันให้ทำงานทันที โดยระบบคลาวด์จะจัดการเรื่องทรัพยากรประมวลผลให้โดยอัตโนมัติ ช่วยลดภาระการดูแลเซิร์ฟเวอร์

### ความต่อเนื่องระหว่าง Edge กับ Cloud (Edge-Cloud Continuum)
ระบบ IoT สมัยใหม่ไม่ได้แยก Edge และ Cloud ออกจากกันอย่างเด็ดขาด แต่ทำงานสอดประสานกันเป็นผืนเดียว โดยงานที่ต้องการการตอบสนองทันทีแบบเรียลไทม์หรือต้องการรักษาความเป็นส่วนตัวของข้อมูลจะถูกจัดการที่ Edge ในขณะที่การวิเคราะห์ภาพรวม การฝึกโมเดล ML และการเก็บข้อมูลระยะยาวจะถูกส่งไปประมวลผลบน Cloud

---

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## แบบฝึกหัดท้ายบท

**ข้อ 1:** จงอธิบายบทบาทและหน้าที่สำคัญของ IoT Cloud Platform ในการจัดการอุปกรณ์ (Device Management) และการจัดการโทรมาตร (Telemetry Data Ingestion) พร้อมระบุว่า ThingsBoard ต่างจากระบบ Cloud ทั่วไป (เช่น AWS หรือ Azure) อย่างไร

**ข้อ 2:** ในระบบจัดเก็บข้อมูล IoT เหตุใด **Time-Series Database (InfluxDB)** จึงได้รับความนิยมในการจัดเก็บข้อมูลเซนเซอร์มากกว่าฐานข้อมูลเชิงสัมพันธ์แบบเดิม (เช่น MySQL) อธิบายคุณลักษณะสำคัญอย่างน้อย 2 ประการ

**ข้อ 3:** การส่งคำสั่งตัดสินใจจากระยะไกลผ่าน **RPC (Remote Procedure Call)** จากแดชบอร์ดลงมายัง ESP32 มีลักษณะการทำงานแบบสองทิศทางอย่างไร และข้อดีของการใช้ RPC เมื่อเทียบกับการประมวลผลการตัดสินใจเฉพาะบนบอร์ดอย่างเดียวคืออะไร

**ข้อ 4:** จาก **ใบงานที่ 8.2 (ระบบ Dynamic Telemetry Rate Controller)** จงอธิบายกลไกของบอร์ดในการหลีกเลี่ยงข้อผิดพลาด Flood Error จาก Broker เมื่อมีค่าความร้อนเข้าสู่สภาวะวิกฤต (Critical State) และความหมายของ Hysteresis ในกรณีนี้

**ข้อ 5:** จงเขียนรูปแบบโครงสร้าง JSON Payload ที่แสดงค่าอุณหภูมิน้ำหล่อเย็น อัตราการไหล และความดันของปั๊มน้ำอุตสาหกรรม เพื่อเตรียมส่งขึ้นไปยัง ThingsBoard Cloud

</div>
