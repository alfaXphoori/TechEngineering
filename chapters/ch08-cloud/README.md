# Chapter 8: เทคโนโลยีคลาวด์และแพลตฟอร์ม IoT
## Cloud Technologies & IoT Platforms
---

ในรายวิชาเทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering) สำหรับนักศึกษาวิศวกรรมเครื่องกลชั้นปีที่ 1 หลังจากที่เราได้เรียนรู้เกี่ยวกับการทำงานของไมโครคอนโทรลเลอร์ ESP32 การเชื่อมต่อเซนเซอร์เพื่อวัดค่าทางฟิสิกส์ และการควบคุมอุปกรณ์เอาต์พุตในระดับท้องถิ่น (Local Area) ผ่านโปรแกรมจำลอง Wokwi ไปแล้ว ในบทนี้เราจะก้าวเข้าสู่หัวใจสำคัญที่เปลี่ยนอุปกรณ์สมังฝังตัวทั่วไปให้กลายเป็นระบบอัจฉริยะ นั่นคือ **"เทคโนโลยีคลาวด์" (Cloud Technology)** และ **"แพลตฟอร์ม IoT" (IoT Platforms)**

เทคโนโลยีคลาวด์ทำหน้าที่เป็นศูนย์กลางในการรวบรวม ประมวลผล จัดเก็บ และแสดงผลข้อมูลที่ส่งมาจากอุปกรณ์ IoT จำนวนมาก การนำข้อมูลขึ้นสู่ระบบคลาวด์ทำให้นักออกแบบและวิศวกรสามารถควบคุมและตรวจสอบสถานะของเครื่องจักรหรือระบบต่างๆ ได้จากทุกที่ทั่วโลกตลอด 24 ชั่วโมง ซึ่งเป็นทักษะหลักที่สำคัญอย่างยิ่งในยุคอุตสาหกรรม 4.0 (Industry 4.0) และอินเทอร์เน็ตของสรรพสิ่งในภาคอุตสาหกรรม (Industrial IoT - IIoT)

---

## 8.1 คลาวด์คอมพิวติงคืออะไรและประโยชน์สำหรับ IoT

**คลาวด์คอมพิวติง (Cloud Computing)** คือการให้บริการทรัพยากรระบบคอมพิวเตอร์ผ่านเครือข่ายอินเทอร์เน็ตตามความต้องการของผู้ใช้ (On-demand) โดยผู้ใช้ไม่จำเป็นต้องบริหารจัดการทรัพยากรฮาร์ดแวร์เหล่านั้นโดยตรง ทรัพยากรเหล่านี้ครอบคลุมตั้งแต่ หน่วยประมวลผล (Compute), พื้นที่จัดเก็บข้อมูล (Storage), ระบบฐานข้อมูล (Databases), โครงข่ายเครือข่าย (Networking) ไปจนถึงซอฟต์แวร์สำเร็จรูป โดยคิดค่าใช้จ่ายตามปริมาณการใช้งานจริง (Pay-as-you-go)

ตามนิยามมาตรฐานของ NIST (National Institute of Standards and Technology) ระบบคลาวด์คอมพิวติงมีลักษณะเด่น 5 ประการ ได้แก่:
1. **On-demand self-service:** ผู้ใช้สามารถร้องขอใช้งานบริการได้ด้วยตนเองทันทีผ่านระบบอัตโนมัติ
2. **Broad network access:** เข้าถึงบริการได้จากทุกที่ผ่านโครงข่ายเครือข่ายมาตรฐาน (เช่น อินเทอร์เน็ต หรือ VPN)
3. **Resource pooling:** การใช้ทรัพยากรฮาร์ดแวร์ร่วมกันของผู้ใช้หลายรายโดยมีระบบแยกความเป็นส่วนตัวอย่างปลอดภัย
4. **Rapid elasticity:** ความยืดหยุ่นสูง สามารถขยายหรือลดขนาดทรัพยากร (เช่น เพิ่มจำนวน RAM/CPU หรือพื้นที่เก็บข้อมูล) ได้ทันที
5. **Measured service:** มีระบบตรวจวัดปริมาณการใช้งานอย่างละเอียดและคิดค่าบริการตามจริง

> 💡 **ข้อสังเกตสำหรับวิศวกรเครื่องกล:** ในอดีต หากเราต้องการเก็บข้อมูลอุณหภูมิและการสั่นสะเทือนของเครื่องจักรในโรงงาน เราต้องใช้เครื่องบันทึกข้อมูล (Data Logger) ที่ต่อสายสัญญาณเข้ากับคอมพิวเตอร์ตั้งโต๊ะในพื้นที่ผลิต เมื่อต้องการดูข้อมูล วิศวกรต้องเดินไปคัดลอกไฟล์ผ่านแฟลชไดรฟ์ แต่ด้วยเทคโนโลยีคลาวด์และการประยุกต์ใช้ IoT เราสามารถส่งข้อมูลจากบอร์ด ESP32 ผ่านเครือข่าย Wi-Fi หรือโครงข่ายไร้สาย 4G/5G ขึ้นไปยังเซิร์ฟเวอร์บนอินเทอร์เน็ตได้โดยตรง ทำให้เราสามารถตรวจสอบสุขภาพเครื่องจักรได้จากระยะไกลและรวมศูนย์ข้อมูลของทั้งโรงงานเข้าด้วยกัน

### 8.1.1 ประโยชน์ของ Cloud Computing สำหรับ IoT ในงานวิศวกรรม
1. **Scalability (ความสามารถในการขยายตัว):** ระบบคลาวด์สามารถรองรับอุปกรณ์เซนเซอร์จากหลักสิบไปจนถึงนับหมื่นตัวได้พร้อมกันโดยไม่ต้องกังวลเรื่องการตั้งค่าเซิร์ฟเวอร์ใหม่ หากโรงงานขยายเครื่องจักรและต้องการเพิ่มจำนวน ESP32 เข้าสู่ระบบ ก็สามารถทำได้อย่างรวดเร็ว
2. **Accessibility (การเข้าถึงได้อย่างอิสระ):** ข้อมูลที่ถูกส่งขึ้นสู่ระบบคลาวด์สามารถเข้าถึงได้ผ่านสมาร์ทโฟน แท็บเล็ต หรือเว็บเบราว์เซอร์ ช่วยให้การเฝ้าระวังระบบ (System Monitoring) ทำได้ตลอดเวลาและปลอดภัย
3. **Cost-effectiveness (ความคุ้มค่าเชิงต้นทุน):** ผู้ใช้งานไม่ต้องกังวลกับต้นทุนฮาร์ดแวร์เซิร์ฟเวอร์ ไม่ต้องเสียค่าบำรุงรักษา หรือจ้างเจ้าหน้าที่ดูแลระบบเครือข่ายขั้นสูง ทำให้การริเริ่มโปรเจกต์ IoT ในยุคนี้เข้าถึงง่ายขึ้นมาก
4. **Reliability (ความน่าเชื่อถือระดับสูง):** ผู้ให้บริการคลาวด์มักมีศูนย์ข้อมูล (Data Center) ที่มีระบบไฟฟ้าสำรองและการทำสำเนาข้อมูล (Data Replication) ป้องกันไม่ให้ข้อมูลสูญหาย
5. **Data Integration & Analytics (การรวมและวิเคราะห์ข้อมูลอัจฉริยะ):** คลาวด์คอมพิวติงมักมาพร้อมกับเครื่องมือประมวลผลข้อมูลปริมาณมหาศาล (Big Data) และปัญญาประดิษฐ์ (AI) ทำให้นักวิศวกรสามารถนำข้อมูลดิบมาวิเคราะห์หาแนวโน้ม เช่น การทำ Predictive Maintenance หรือการทำนายเวลาที่ชิ้นส่วนเครื่องจักรจะเสื่อมสภาพ

### 8.1.2 การเปรียบเทียบและการตัดสินใจเลือกระหว่าง Edge Computing และ Cloud Computing (Edge vs. Cloud Trade-offs)
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

### 8.1.3 ตัวชี้วัดประสิทธิภาพระบบเครือข่ายสำหรับวิศวกร (Network QoS Metrics)
การเชื่อมต่ออุปกรณ์ IoT เข้ากับคลาวด์ขึ้นอยู่กับคุณภาพของบริการเครือข่าย (Quality of Service - QoS) ซึ่งวิศวกรต้องทำความเข้าใจตัวชี้วัดสำคัญ 5 ประการดังนี้:
1. **Latency (ความหน่วงเวลา):** เวลาที่ใช้ในการเดินทางของข้อมูลจากต้นทางไปยังปลายทาง มักวัดเป็น RTT (Round Trip Time) หรือเวลาเดินทางไป-กลับ ส่งผลโดยตรงต่อการตอบสนองของระบบควบคุมเชิงกลระยะไกล
2. **Bandwidth (แบนด์วิดท์):** ความกว้างของช่องสัญญาณในการส่งข้อมูล (บิตต่อวินาที - bps) ซึ่งเป็นข้อจำกัดหลักในอุตสาหกรรมที่ต้องแชร์เครือข่ายร่วมกัน
3. **Jitter (ความแปรปรวนของความหน่วง):** ความไม่สม่ำเสมอของเวลาในการรับส่งแพ็กเกจข้อมูล หาก Jitter สูง จะส่งผลกระทบต่อเสถียรภาพของระบบควบคุมแบบเรียลไทม์
4. **Packet Loss (อัตราสูญหายของแพ็กเกจ):** เปอร์เซ็นต์ของแพ็กเกจข้อมูลที่สูญหายระหว่างทาง ซึ่งโปรโตคอล TCP จะทำการส่งซ้ำ (Retransmission) ทำให้ความหน่วงเพิ่มขึ้น ขณะที่ UDP จะยอมรับข้อมูลสูญหายเพื่อรักษาความเร็ว
5. **Availability & SLA (ข้อตกลงระดับบริการ):** การรับประกันเสถียรภาพของระบบจากผู้ให้บริการคลาวด์ เช่น SLA 99.9% (Three Nines) ยอมให้ระบบขัดข้องรวมกันได้ไม่เกิน 8.76 ชั่วโมงต่อปี

### 8.1.4 การลดความละเอียดและการดึงคุณลักษณะเด่นของข้อมูลที่ขอบ (Data Downsampling & Feature Extraction)
ในการประยุกต์ใช้งานเชิงวิศวกรรมเครื่องกล เช่น การตรวจสอบสุขภาพตลับลูกปืน (Bearing Health Monitoring) ด้วยเซนเซอร์วัดความเร่ง 3 แกน (Accelerometer) ที่มีอัตราสุ่มวัดข้อมูลความถี่สูง (เช่น 5 kHz) หากเราส่งข้อมูลดิบ $a_x, a_y, a_z$ ทั้งหมดขึ้นระบบคลาวด์ จะสร้างปริมาณทราฟฟิกข้อมูลสูงถึง:
$$\text{Data Rate} = 3 \text{ แกน} \times 5,000 \text{ ตัวอย่าง/วินาที} \times 4 \text{ ไพต์ (Float)} = 60,000 \text{ ไพต์/วินาที} \approx 5.18 \text{ GB ต่อวัน}$$
ซึ่งการส่งข้อมูลปริมาณนี้จากอุปกรณ์นับร้อยตัวจะทำให้อินเทอร์เน็ตโรงงานเกิดคอขวดและเสียค่าใช้จ่ายคลาวด์มหาศาล

แนวทางปฏิบัติที่ถูกต้องคือการทำ **Feature Extraction** ที่ตัว ESP32 โดยเก็บตัวอย่างข้อมูลดิบในเวลา 1 วินาที นำมาคำนวณหาค่ารากเฉลี่ยกำลังสอง (Root Mean Square - RMS) เพื่อวัดความรุนแรงความสั่นสะเทือนสะสม:
$$a_{RMS} = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (a_{x,i}^2 + a_{y,i}^2 + a_{z,i}^2)}$$
และส่งเพียงค่า $a_{RMS}$ ชุดเดียวขึ้นสู่คลาวด์ในทุกๆ 5 วินาที ทำให้ปริมาณข้อมูลลดลงเหลือเพียง 4 ไพต์ต่อ 5 วินาที หรือลดลงกว่า 99.99%

---

## 8.2 รูปแบบบริการ IaaS/PaaS/SaaS

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

## 8.3 รูปแบบการติดตั้ง Public/Private/Hybrid

นอกจากจะแบ่งตามระดับบริการแล้ว ระบบคลาวด์ยังจัดประเภทตาม "รูปแบบการติดตั้ง" (Deployment Models) ซึ่งเกี่ยวข้องกับระดับความเป็นส่วนตัว งบประมาณ และความปลอดภัยของข้อมูลเครื่องจักรเชิงกลในระบบอุตสาหกรรม:

*   **Public Cloud (คลาวด์สาธารณะ):** เป็นโครงสร้างพื้นฐานที่ผู้ให้บริการคลาวด์รายใหญ่ (เช่น AWS, Google, Microsoft หรือ ThingsBoard) สร้างขึ้นเพื่อเปิดให้บุคคลทั่วไปและองค์กรต่างๆ เช่าใช้งานร่วมกันบนเครือข่ายอินเทอร์เน็ตสาธารณะ มีข้อดีคือไม่มีต้นทุนฮาร์ดแวร์เริ่มต้น เริ่มใช้งานได้ทันที แต่ข้อมูลจะแชร์พื้นที่จัดเก็บทางฮาร์ดแวร์ร่วมกับผู้ใช้อื่น
*   **Private Cloud (คลาวด์ส่วนตัว):** เป็นระบบคลาวด์ที่สร้างขึ้นมาโดยเฉพาะเพื่อใช้งานภายในองค์กรเดียวเท่านั้น อาจตั้งเซิร์ฟเวอร์อยู่ในอาคารโรงงานของบริษัท (On-premises) หรือเช่าพื้นที่ปิดในศูนย์ข้อมูล มีความปลอดภัยและรักษาความลับของข้อมูลสูงสุด ป้องกันไม่ให้ความลับทางการค้า (Trade Secrets) เช่น สูตรการผลิต หรือปริมาณการเดินเครื่องจักร รั่วไหลออกไป แต่มีค่าใช้จ่ายในการลงทุนโครงสร้างพื้นฐานและทีมดูแลรักษาสูงมาก
*   **Hybrid Cloud (คลาวด์แบบผสมผสาน):** เป็นการทำงานร่วมกันระหว่าง Public Cloud และ Private Cloud โดยจัดเก็บข้อมูลกระบวนการผลิตที่มีความวิกฤตและความลับสูงไว้ใน Private Cloud แต่ใช้ความสามารถของ Public Cloud ในการแสดงผลแดชบอร์ดที่ไม่เป็นความลับ หรือใช้ในการวิเคราะห์ข้อมูลสถิติระยะยาวเพื่อประหยัดต้นทุน

สำหรับรายวิชานี้เพื่อการศึกษาสู่การสร้างโครงงานต้นแบบ (IoT Prototype) เราจะเลือกใช้ **Public Cloud** ของ ThingsBoard เนื่องจากมีความสะดวก ปลอดภัย และมีบริการขั้นพื้นฐานที่ไม่มีค่าใช้จ่ายสำหรับนักศึกษา

---

## 8.4 องค์ประกอบแพลตฟอร์ม IoT

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

### 8.4.1 สถาปัตยกรรมท่อส่งข้อมูลการวัดคลาวด์ในอุตสาหกรรม (Industrial Telemetry Pipeline)
การเดินทางของข้อมูลจากฟิสิกส์สู่หน้าจอแดชบอร์ดใช้ท่อส่งข้อมูล (Telemetry Pipeline) ดังนี้:
$$\text{Physical Sensor} \rightarrow \text{Edge MCU (ESP32)} \rightarrow \text{Local Gateway (เช่น Raspberry Pi)} \rightarrow \text{Cloud IoT Core/Broker} \rightarrow \text{Stream Processor} \rightarrow \text{Time-Series Database} \rightarrow \text{Dashboard}$$

### 8.4.2 แนวคิด Digital Twin (Device Shadow)
ในแพลตฟอร์มระดับอุตสาหกรรม จะมีกลไก **Digital Twin** (หรือ Device Shadow บน AWS IoT) ซึ่งเป็นการบันทึกจำลองสถานะล่าสุดและโครงสร้างของฮาร์ดแวร์จริงไว้บนคลาวด์ตลอดเวลา แม้อุปกรณ์จริงจะอยู่ในโหมดประหยัดพลังงาน (Deep Sleep) หรือขาดการเชื่อมต่ออินเทอร์เน็ตชั่วคราว ผู้ใช้งานหรือแอปพลิเคชันยังคงสามารถส่งคำสั่งสั่งการทิ้งไว้บนคลาวด์ได้ และเมื่อบอร์ด ESP32 ตื่นขึ้นมาเชื่อมต่อเครือข่ายอีกครั้ง มันจะดึงความต้องการควบคุมล่าสุดนั้นไปอัปเดตตัวเองโดยอัตโนมัติ

---

## 8.5 แพลตฟอร์ม IoT ยอดนิยม

ในภาคการศึกษาและอุตสาหกรรม มีผู้ให้บริการแพลตฟอร์ม IoT หลากหลายระดับ เพื่อให้นักศึกษาเข้าใจบริบทของตลาดวิศวกรรม เราสามารถเปรียบเทียบ ThingsBoard และแพลตฟอร์มระดับองค์กร (Enterprise) ดังนี้:

**ตารางที่ 2: เปรียบเทียบแพลตฟอร์ม IoT สำหรับการเรียนรู้และระดับองค์กร (Enterprise)**

| คุณสมบัติของแพลตฟอร์ม | ThingsBoard (thingsboard.io) | AWS IoT Core (Amazon) | Azure IoT Hub (Microsoft) |
| :--- | :--- | :--- | :--- |
| **กลุ่มผู้ใช้งานหลัก** | นักศึกษา, เมกเกอร์, โครงงานต้นแบบ และโรงงานอุตสาหกรรมขนาดกลาง-ใหญ่ | วิศวกรซอฟต์แวร์คลาวด์, โรงงานขนาดใหญ่ที่มีอุปกรณ์นับล้านตัว | องค์กรที่ใช้งานระบบเครือข่ายโครงสร้างพื้นฐานของ Microsoft เป็นหลัก |
| **การสร้างหน้าแดชบอร์ด** | ลากวางวิดเจ็ตผ่านเว็บและแชร์ให้สมาร์ทโฟนได้ง่าย มีวิดเจ็ตหลากหลายแบบอุตสาหกรรม | ไม่มีแดชบอร์ดในตัว ต้องเขียนพัฒนาขึ้นเองหรือส่งต่อข้อมูลไป Power BI | ไม่มีแดชบอร์ดในตัว ต้องดึงข้อมูลเชื่อมต่อระบบหน้าบ้านอื่นๆ |
| **ความยากในการเรียนรู้** | ปานกลาง (ต้องเข้าใจการส่งข้อมูลแบบ JSON, MQTT Telemetry และ RPC) | สูงมาก (ต้องมีความเข้าใจสถาปัตยกรรมบริการต่างๆ ของคลาวด์อย่างละเอียด) | สูงมาก (ต้องมีความเข้าใจลูปความปลอดภัยและฐานข้อมูลเชิงอุตสาหกรรม) |
| **ความเหมาะสมในวิชานี้** | **เหมาะสมที่สุดในการศึกษาสถาปัตยกรรมระดับอุตสาหกรรม** | เหมาะสำหรับการประยุกต์ใช้งานจริงในอนาคตระดับสูง | เหมาะสำหรับการทำงานระดับโรงงานขนาดใหญ่ในอนาคต |

---

## 8.6 การเขียนโปรแกรมเชื่อมต่อ ESP32 เข้ากับ ThingsBoard Cloud

การทำให้อุปกรณ์ฮาร์ดแวร์เชื่อมต่อกับแพลตฟอร์ม ThingsBoard คลาวด์ได้อย่างปลอดภัยและมีเสถียรภาพ ต้องเข้าใจการไหลของข้อมูลการเชื่อมต่อและโครงสร้างซอฟต์แวร์ดังต่อไปนี้:

<div style="text-align: center; margin: 25px 0;">
<svg viewBox="0 0 850 460" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>แผนภาพแสดงสถาปัตยกรรมการเชื่อมต่อของระบบ ThingsBoard IoT</title>
  <style>
    #tb-conn-svg .bg-main { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    #tb-conn-svg .box-esp32 { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    #tb-conn-svg .box-cloud { fill: #eff6ff; stroke: #2563eb; stroke-width: 2; rx: 8px; }
    #tb-conn-svg .box-app { fill: #f0fdf4; stroke: #16a34a; stroke-width: 2; rx: 8px; }
    #tb-conn-svg .box-sensor { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 4px; }
    
    #tb-conn-svg .lbl-main-title { font-size: 15px; font-weight: 700; fill: #1e293b; }
    #tb-conn-svg .lbl-title { font-size: 11px; font-weight: 700; fill: #0f172a; }
    #tb-conn-svg .lbl-sub { font-size: 8.5px; fill: #475569; font-weight: 500; }
    #tb-conn-svg .lbl-vpin { font-size: 9px; font-weight: bold; fill: #ffffff; }
    
    #tb-conn-svg .path-data-up { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.5; stroke-dasharray: 6 8; animation: tb-flowRight 2.5s linear infinite; }
    #tb-conn-svg .path-data-down { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.5; stroke-dasharray: 6 8; animation: tb-flowLeft 2.5s linear infinite; }
    
    @keyframes tb-flowRight {
      to { stroke-dashoffset: -28; }
    }
    @keyframes tb-flowLeft {
      to { stroke-dashoffset: 28; }
    }
    
    #tb-conn-svg .btn-glow { animation: tb-pulseGlow 2s infinite ease-in-out; }
    @keyframes tb-pulseGlow {
      0%, 100% { filter: drop-shadow(0 0 1px #eab30844); }
      50% { filter: drop-shadow(0 0 6px #eab308aa); }
    }
  </style>

  <defs>
    <marker id="arr-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#ef4444"/></marker>
    <marker id="arr-g" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#10b981"/></marker>
    <marker id="arr-y" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#eab308"/></marker>
    <marker id="arr-i" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#6366f1"/></marker>
  </defs>

  <g id="tb-conn-svg">
    <!-- Background -->
    <rect x="5" y="5" width="840" height="450" class="bg-main"/>

    <!-- Main Title -->
    <text x="425" y="32" text-anchor="middle" class="lbl-main-title">แผนภาพแสดงสถาปัตยกรรมการเชื่อมต่อของระบบ ThingsBoard IoT (Two-way MQTT/RPC)</text>

    <!-- ==================== LEFT: HARDWARE & SENSORS ==================== -->
    <!-- Sensors & Actuators -->
    <g>
      <!-- Temp Sensor -->
      <rect x="15" y="80" width="105" height="44" class="box-sensor"/>
      <text x="67.5" y="98" font-size="9.5" font-weight="700" fill="#334155" text-anchor="middle">Thermocouple K</text>
      <text x="67.5" y="112" font-size="8" fill="#64748b" text-anchor="middle">(MAX6675 SPI)</text>
      <path d="M 120 102 H 150" stroke="#475569" stroke-width="1.5" fill="none"/>
      <text x="135" y="97" font-size="7.5" fill="#64748b" text-anchor="middle">SPI</text>
      
      <!-- Pressure Sensor -->
      <rect x="15" y="150" width="105" height="44" class="box-sensor"/>
      <text x="67.5" y="168" font-size="9.5" font-weight="700" fill="#334155" text-anchor="middle">Pressure Sens</text>
      <text x="67.5" y="182" font-size="8" fill="#64748b" text-anchor="middle">(Analog 0-5V)</text>
      <path d="M 120 172 H 150" stroke="#475569" stroke-width="1.5" fill="none"/>
      <text x="135" y="167" font-size="7.5" fill="#64748b" text-anchor="middle">ADC1</text>
      
      <!-- Burner Relay -->
      <rect x="15" y="270" width="105" height="44" class="box-sensor"/>
      <text x="67.5" y="288" font-size="9.5" font-weight="700" fill="#334155" text-anchor="middle">Burner Relay</text>
      <text x="67.5" y="302" font-size="8" fill="#64748b" text-anchor="middle">(Control Valve)</text>
      <path d="M 120 292 H 150" stroke="#475569" stroke-width="1.5" fill="none"/>
      <text x="135" y="287" font-size="7.5" fill="#64748b" text-anchor="middle">GPIO25</text>
      
      <!-- Alarm LED -->
      <rect x="15" y="340" width="105" height="44" class="box-sensor"/>
      <text x="67.5" y="358" font-size="9.5" font-weight="700" fill="#334155" text-anchor="middle">Alarm LED</text>
      <text x="67.5" y="372" font-size="8" fill="#64748b" text-anchor="middle">(Local Warning)</text>
      <path d="M 120 362 H 150" stroke="#475569" stroke-width="1.5" fill="none"/>
      <text x="135" y="357" font-size="7.5" fill="#64748b" text-anchor="middle">GPIO26</text>
    </g>

    <!-- ESP32 Board Outer Box -->
    <g>
      <rect x="150" y="60" width="180" height="360" class="box-esp32"/>
      <text x="240" y="82" class="lbl-title" text-anchor="middle" fill="#7c3aed">บอร์ด ESP32 (Edge MCU)</text>
      
      <!-- ESP32 Graphic representation -->
      <rect x="170" y="100" width="140" height="190" rx="4" fill="#1e293b" stroke="#4c1d95" stroke-width="2"/>
      <!-- Chip -->
      <rect x="210" y="125" width="60" height="50" rx="2" fill="#334155" stroke="#94a3b8" stroke-width="1"/>
      <text x="240" y="155" font-size="8.5" fill="#ffffff" font-weight="bold" text-anchor="middle">ESP32-WROOM</text>
      <!-- Wi-Fi Antenna -->
      <rect x="220" y="108" width="40" height="15" fill="#0f172a" stroke="#cbd5e1" stroke-width="0.5"/>
      <line x1="225" y1="113" x2="255" y2="113" stroke="#cbd5e1" stroke-width="1"/>
      <line x1="225" y1="118" x2="255" y2="118" stroke="#cbd5e1" stroke-width="1"/>
      
      <!-- Code logic labels inside ESP32 board -->
      <rect x="175" y="195" width="130" height="85" rx="3" fill="#0f172a" stroke="#6d28d9" stroke-width="1"/>
      <text x="240" y="210" font-size="8.5" fill="#a78bfa" font-weight="bold" text-anchor="middle">Software Logic</text>
      <text x="182" y="228" font-size="8" fill="#e2e8f0">• Millis Timer (Non-blocking)</text>
      <text x="182" y="243" font-size="8" fill="#e2e8f0">• Local Safety Interlock</text>
      <text x="182" y="258" font-size="8" fill="#e2e8f0">• client.loop() &amp; Telemetry</text>

      <!-- Wi-Fi SSID Status text -->
      <text x="240" y="325" font-size="9" fill="#7c3aed" font-weight="bold" text-anchor="middle">📶 Wi-Fi: Wokwi-GUEST</text>
      <text x="240" y="342" font-size="8" fill="#64748b" text-anchor="middle">Auth: Access Token over MQTT</text>
      <rect x="170" y="360" width="140" height="42" rx="4" fill="#faf5ff" stroke="#ddd6fe" stroke-width="1"/>
      <text x="240" y="375" font-size="8" fill="#5b21b6" text-anchor="middle" font-weight="bold">Edge-Cloud Hybrid</text>
      <text x="240" y="388" font-size="7.5" fill="#6d28d9" text-anchor="middle">ควบคุมคีย์หลักได้แม้ออฟไลน์</text>
      
      <!-- Pins markers -->
      <circle cx="150" cy="102" r="3" fill="#cbd5e1"/>
      <circle cx="150" cy="172" r="3" fill="#cbd5e1"/>
      <circle cx="150" cy="292" r="3" fill="#cbd5e1"/>
      <circle cx="150" cy="362" r="3" fill="#cbd5e1"/>
    </g>

    <!-- ==================== MIDDLE: THINGSBOARD CLOUD ==================== -->
    <!-- ThingsBoard Cloud Box -->
    <g>
      <rect x="420" y="60" width="180" height="360" class="box-cloud"/>
      <text x="510" y="82" class="lbl-title" text-anchor="middle" fill="#2563eb">เซิร์ฟเวอร์ ThingsBoard Cloud</text>
      <text x="510" y="97" class="lbl-sub" text-anchor="middle">(Access Token &amp; MQTT Broker)</text>
      
      <!-- Telemetry Data Capsules -->
      <!-- Capsule V1 -->
      <rect x="445" y="115" width="130" height="32" rx="6" fill="#10b981"/>
      <text x="510" y="135" text-anchor="middle" class="lbl-vpin">"pressure" (Telemetry)</text>
      
      <!-- Capsule V2 -->
      <rect x="445" y="165" width="130" height="32" rx="6" fill="#10b981"/>
      <text x="510" y="185" text-anchor="middle" class="lbl-vpin">"temperature" (Telemetry)</text>
      
      <!-- Capsule V3 -->
      <rect x="445" y="215" width="130" height="32" rx="6" fill="#eab308"/>
      <text x="510" y="235" text-anchor="middle" class="lbl-vpin">"alarmLED" (Telemetry)</text>
      
      <!-- Capsule V4 -->
      <rect x="445" y="265" width="130" height="32" rx="6" fill="#ef4444"/>
      <text x="510" y="285" text-anchor="middle" class="lbl-vpin">"setBurner" (RPC Req)</text>
      
      <!-- Capsule V5 -->
      <rect x="445" y="315" width="130" height="32" rx="6" fill="#6366f1"/>
      <text x="510" y="335" text-anchor="middle" class="lbl-vpin">"statusMsg" (Telemetry)</text>
      
      <rect x="440" y="362" width="140" height="42" rx="4" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
      <text x="510" y="377" font-size="8.5" fill="#1e40af" text-anchor="middle" font-weight="bold">Digital Twin (Shadow)</text>
      <text x="510" y="390" font-size="7.5" fill="#1e3a8a" text-anchor="middle">เก็บสถานะล่าสุดบนคลาวด์ตลอดเวลา</text>
    </g>

    <!-- ==================== RIGHT: DASHBOARD WIDGETS ==================== -->
    <!-- ThingsBoard Dashboard -->
    <g>
      <rect x="660" y="60" width="165" height="360" class="box-app"/>
      <text x="742.5" y="82" class="lbl-title" text-anchor="middle" fill="#16a34a">หน้าจอแผงควบคุม (Web/App)</text>
      <text x="742.5" y="97" class="lbl-sub" text-anchor="middle">(ThingsBoard Dashboard)</text>
      
      <!-- Gauge Widget for V1 -->
      <rect x="680" y="115" width="125" height="32" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="686" y="129" font-size="9" fill="#475569" font-weight="700">Gauge: ความดัน</text>
      <text x="798" y="135" font-size="8" fill="#10b981" text-anchor="end" font-weight="bold">"pressure"</text>
      
      <!-- Value Display for V2 -->
      <rect x="680" y="165" width="125" height="32" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="686" y="179" font-size="9" fill="#475569" font-weight="700">Value: อุณหภูมิ</text>
      <text x="798" y="185" font-size="8" fill="#10b981" text-anchor="end" font-weight="bold">"temperature"</text>
      
      <!-- LED for V3 -->
      <rect x="680" y="215" width="125" height="32" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="686" y="229" font-size="9" fill="#475569" font-weight="700">LED: เตือนภัย</text>
      <circle cx="770" cy="231" r="5" fill="#eab308" class="btn-glow"/>
      <text x="798" y="235" font-size="8" fill="#eab308" text-anchor="end" font-weight="bold">"alarmLED"</text>
      
      <!-- Switch for V4 -->
      <rect x="680" y="265" width="125" height="32" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="686" y="279" font-size="9" fill="#475569" font-weight="700">Switch: เปิด/ปิด</text>
      <rect x="755" y="273" width="22" height="12" rx="6" fill="#ef4444"/>
      <circle cx="761" cy="279" r="4" fill="#ffffff"/>
      <text x="798" y="285" font-size="8" fill="#ef4444" text-anchor="end" font-weight="bold">"setBurner"</text>
      
      <!-- Terminal for V5 -->
      <rect x="680" y="315" width="125" height="42" rx="4" fill="#1e293b" stroke="#cbd5e1" stroke-width="1"/>
      <text x="686" y="329" font-size="8.5" fill="#38bdf8" font-weight="700">Terminal: สถานะ</text>
      <text x="686" y="341" font-size="7.5" fill="#94a3b8">Log: Boiler Running</text>
      <text x="798" y="350" font-size="8" fill="#6366f1" text-anchor="end" font-weight="bold">"statusMsg"</text>
      
      <!-- Users mobile phone display layout -->
      <rect x="680" y="368" width="125" height="38" rx="4" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
      <text x="742.5" y="382" font-size="8.5" fill="#166534" text-anchor="middle" font-weight="bold">ThingsBoard App</text>
      <text x="742.5" y="394" font-size="7.5" fill="#15803d" text-anchor="middle">แสดงผลและสั่งงานบนสมาร์ทโฟน</text>
    </g>

    <!-- ==================== CONNECTIONS AND DATA FLOWS ==================== -->
    <!-- ESP32 to ThingsBoard Cloud lines -->
    <g>
      <!-- V1 Telemetry (Pressure) -->
      <path d="M 330 131 H 439" class="path-data-up" stroke="#10b981"/>
      <path d="M 330 131 H 445" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.3" marker-end="url(#arr-g)"/>
      <text x="375" y="124" font-size="7px" fill="#10b981" text-anchor="middle" font-weight="bold">"pressure"</text>

      <!-- V2 Telemetry (Temp) -->
      <path d="M 330 181 H 439" class="path-data-up" stroke="#10b981"/>
      <path d="M 330 181 H 445" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.3" marker-end="url(#arr-g)"/>
      <text x="375" y="174" font-size="7px" fill="#10b981" text-anchor="middle" font-weight="bold">"temperature"</text>

      <!-- V3 Alarm State -->
      <path d="M 330 231 H 439" class="path-data-up" stroke="#eab308"/>
      <path d="M 330 231 H 445" fill="none" stroke="#eab308" stroke-width="1.5" opacity="0.3" marker-end="url(#arr-y)"/>
      <text x="375" y="224" font-size="7px" fill="#ca8a04" text-anchor="middle" font-weight="bold">"alarmLED"</text>

      <!-- V4 Command (Switch) -->
      <path d="M 445 281 H 336" class="path-data-down" stroke="#ef4444"/>
      <path d="M 445 281 H 330" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.3" marker-end="url(#arr-r)"/>
      <text x="375" y="274" font-size="7px" fill="#ef4444" text-anchor="middle" font-weight="bold">"setBurner"</text>

      <!-- V5 Status Msg -->
      <path d="M 330 331 H 439" class="path-data-up" stroke="#6366f1"/>
      <path d="M 330 331 H 445" fill="none" stroke="#6366f1" stroke-width="1.5" opacity="0.3" marker-end="url(#arr-i)"/>
      <text x="375" y="324" font-size="7px" fill="#6366f1" text-anchor="middle" font-weight="bold">"statusMsg"</text>
    </g>

    <!-- ThingsBoard Cloud to Dashboard lines -->
    <g>
      <!-- V1 Gauge -->
      <path d="M 575 131 H 674" class="path-data-up" stroke="#10b981"/>
      <path d="M 575 131 H 680" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.3" marker-end="url(#arr-g)"/>

      <!-- V2 Value -->
      <path d="M 575 181 H 674" class="path-data-up" stroke="#10b981"/>
      <path d="M 575 181 H 680" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.3" marker-end="url(#arr-g)"/>

      <!-- V3 LED -->
      <path d="M 575 231 H 674" class="path-data-up" stroke="#eab308"/>
      <path d="M 575 231 H 680" fill="none" stroke="#eab308" stroke-width="1.5" opacity="0.3" marker-end="url(#arr-y)"/>

      <!-- V4 Switch (Dashboard -> Cloud) -->
      <path d="M 680 281 H 581" class="path-data-down" stroke="#ef4444"/>
      <path d="M 680 281 H 575" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.3" marker-end="url(#arr-r)"/>

      <!-- V5 Terminal -->
      <path d="M 575 331 H 674" class="path-data-up" stroke="#6366f1"/>
      <path d="M 575 331 H 680" fill="none" stroke="#6366f1" stroke-width="1.5" opacity="0.3" marker-end="url(#arr-i)"/>
    </g>
  </g>
</svg>
</div>

### 8.6.1 กุญแจยืนยันตัวตน (Authentication Token) และแนวปฏิบัติความปลอดภัย
*   **Authentication Token (Auth Token):** เปรียบเสมือนรหัสผ่านเฉพาะประจำตัวของอุปกรณ์ฮาร์ดแวร์ตัวนั้น หาก Access Token นี้หลุดรอดไปอยู่บนอินเทอร์เน็ต ผู้ประสงค์ร้ายสามารถส่งข้อมูลปลอมหรือแย่งการควบคุมเอาต์พุตได้ทันที
*   **แนวทางการป้องกัน:** หลีกเลี่ยงการเขียน Access Token และ SSID รหัสผ่าน Wi-Fi ลงในโค้ดต้นฉบับตรงๆ เพื่ออัปโหลดขึ้น GitHub หรือส่งการบ้าน ให้แยกเก็บข้อมูลรหัสเหล่านี้ไว้ในไฟล์ต่างหาก (เช่น `secrets.h`) และทำการป้องกันผ่านไฟล์ `.gitignore` ไม่ให้อัปโหลดขึ้นคลาวด์สาธารณะ
*   *ระดับอุตสาหกรรม:* ระบบจะใช้เทคนิค **Dynamic Provisioning** (ThingsBoard Device Provisioning / Device Profiles) โดยในตอนแรกอุปกรณ์จะทำหน้าที่เป็น Wi-Fi Access Point (AP) ให้วิศวกรใช้สมาร์ทโฟนเชื่อมต่อเข้าไปกรอก Access Token และเลือกเชื่อมต่อ Wi-Fi จากแอพเพื่อบันทึกลงหน่วยความจำถาวร (NVS/EEPROM) ของบอร์ดโดยไม่ต้องแก้ไขโค้ดใหม่

### 8.6.2 ข้อมูลโทรมาตร (Telemetry) และคำสั่งควบคุมระยะไกล (RPC)
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

### 8.6.3 การจัดการการเชื่อมต่อแบบ Blocking vs Non-blocking
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

### 8.6.4 ทำไมคำสั่ง `delay()` เป็นอันตรายในงาน IoT และซอฟต์แวร์ไทม์เมอร์แบบ Non-blocking
*   **อันตรายของ `delay()`:** ในงาน IoT การเรียกใช้ฟังก์ชันบล็อกเวลา เช่น `delay(5000)` จะทำให้สแต็กโปรโตคอล TCP/IP และการทำงานของโมดูล MQTT ขาดตอน บอร์ดจะไม่สามารถตอบกลับสัญญาณตรวจสอบการมีชีวิต (Ping Request/Heartbeat) ของ ThingsBoard MQTT Broker ได้สำเร็จ โบรกเกอร์จะสั่งตัดการเชื่อมต่อทันทีเนื่องจากเกิดสภาวะไทม์เอาต์ (Keep-alive Timeout) ทำให้อุปกรณ์เกิดวงจรหลุดต่อใหม่ซ้ำซาก
*   **กลไกของซอฟต์แวร์ไทม์เมอร์อิงกลไก `millis()`:** วิศวกรจะใช้ตัวเก็บเวลาสะสมของระบบไมโครคอนโทรลเลอร์เพื่อตรวจวัดความต่างเชิงเวลาในลักษณะไม่บล็อกสัญญาณ (Cooperative Non-blocking Timers) ทำให้อุปกรณ์สามารถเรียกฟังก์ชันตรวจสอบสถานะอย่าง `client.loop()` ได้นับแสนครั้งต่อวินาที ช่วยให้ระบบสื่อสารเครือข่ายยังคงทำงานได้เสถียรและตอบสนองได้รวดเร็ว
*   **ข้อควรระวังในการเขียนโปรแกรมจัดสรรเวลา:**
    1. หลีกเลี่ยงการกำหนดให้งานย่อยทำงานที่จุดเวลาเดียวกันพร้อมกัน เพื่อป้องกันภาวะเครือข่ายแน่นขนัด (Timer Collision) ควรทำการเยื้องเวลา (Offset) เล็กน้อย เช่น:
       * `timer.setInterval(1000L, sendTemperature);`
       * `timer.setInterval(1015L, sendPressure);` (เยื้องเวลาออกไป 15 ms)
    2. จำกัดจำนวน Event สูงสุดไม่เกิน 16 งานต่อ 1 ออบเจกต์ของซอฟต์แวร์ไทม์เมอร์แบบปราศจากการใช้ delay()

### 8.6.5 การควบคุมอัตราการส่งข้อมูลและ Flood Error (Rate Limiting)
คลาวด์แพลตฟอร์มมีการตั้งค่าระบบจำกัดแบนด์วิดท์ (Rate Limiting) สำหรับแผนการใช้งานทั่วไป ThingsBoard Server ยอมรับการส่งข้อมูล `client.publish()` ไม่เกิน 10-20 ครั้งต่อวินาที หากส่งข้อมูลถี่เกินไป บอร์ดจะถูกบล็อกการเชื่อมต่อจากเซิร์ฟเวอร์เนื่องจากข้อผิดพลาด **"Flood Error"** แนวทางป้องกันคือการตั้งเวลาส่งข้อมูลให้เหมาะสมด้วยซอฟต์แวร์ไทม์เมอร์แบบปราศจากการใช้ delay() และทำการส่งเฉพาะเมื่อข้อมูลเกิดการเปลี่ยนแปลงที่เกินเกณฑ์กำหนด (Deadband Filtering) เท่านั้น

### 8.6.6 ตัวอย่างโค้ด: การส่งข้อมูลเซนเซอร์ผ่าน ESP32 ขึ้นสู่ ThingsBoard Cloud
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

## 8.7 ฐานข้อมูล time-series และการจัดเก็บข้อมูลเซนเซอร์

เมื่อข้อมูลการวัดจากบอร์ด ESP32 ถูกส่งถึงระบบคลาวด์ แพลตฟอร์มจำเป็นต้องบันทึกประวัติเพื่อแสดงเป็นกราฟหรือนำไปวิเคราะห์ การเก็บข้อมูล IoT มีข้อแตกต่างจากแอปพลิเคชันทั่วไป เนื่องจากข้อมูลเซนเซอร์มีลักษณะเป็นกระแสข้อมูลไหลเข้าต่อเนื่องตามเวลา (Continuous Streams)

### 8.7.1 ความแตกต่างระหว่างฐานข้อมูลแบบดั้งเดิม (SQL) และ Time-series Database (TSDB)
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

### 8.7.2 โครงสร้างและแนวคิดสำคัญของ InfluxDB (InfluxDB Core Concepts)

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

## 8.8 กรณีศึกษาเชิงวิศวกรรมเครื่องกล (Mechanical/Industrial Case Studies)

เพื่อเชื่อมโยงความรู้สู่การใช้งานจริงในโรงงานอุตสาหกรรม นักศึกษาควรศึกษา 3 กรณีศึกษาต้นแบบต่อไปนี้:

### 8.8.1 กรณีศึกษาที่ 1: ระบบตรวจติดตามความปลอดภัยของหม้อไอน้ำอุตสาหกรรม (Steam Boiler Safety Monitoring)
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

### 8.8.2 กรณีศึกษาที่ 2: ระบบตรวจสอบและวิเคราะห์การสั่นสะเทือนของแบริ่งมอเตอร์ขับในโรงงาน (CNC Spindle Bearing Monitoring)
*   **บริบทเชิงกล:** แบริ่งแกนหมุนของเครื่องจักรกลมักมีสัญญาณเสื่อมสภาพเกิดขึ้นก่อนความเสียหายจริงในรูปแรงสั่นสะเทือนตามความถี่รอบการทำงาน
*   **การประยุกต์ใช้งาน:** บอร์ด ESP32 เชื่อมต่อกับไอซีเซนเซอร์วัดความเร่ง 3 แกนแบบดั้งเดิม ADXL345 ผ่านเครือข่ายบัส I2C ทำการดึงค่าความเร่งความถี่สูงมาสะสมและถอดฟังก์ชันหาค่ารากเฉลี่ยกำลังสอง (RMS) ตามมาตรฐานการสั่นสะเทือน ISO 10816 จากนั้นส่งเพียงผลลัพธ์ $a_{RMS}$ ทุกๆ 5 วินาที ขึ้นไปเก็บที่ **คีย์ส่งโทรมาตร `vibration_rms` (Telemetry)** และพล็อตแนวโน้มสุขภาพแบริ่งในระยะยาวบนคลาวด์เพื่อการซ่อมบำรุงเชิงพยากรณ์

### 8.8.3 กรณีศึกษาที่ 3: ระบบตรวจติดตามการรั่วไหลและการประหยัดพลังงานในระบบลมอัด (Pneumatic System Air Leak Detection)
*   **บริบทเชิงกล:** ระบบลมอัดนิวแมติกส์ใช้กำลังไฟฟ้ารวมสูงมากในระบบอุตสาหกรรม จุดลมอัดรั่วไหลเป็นสาเหตุหลักของการสิ้นเปลืองพลังงานที่มองไม่เห็น
*   **การประยุกต์ใช้งาน:** ติดตั้งเซนเซอร์วัดอัตราการไหลของลม (Air Flow Sensor) และเซนเซอร์วัดความดันในท่อส่งลมรอบโรงงาน บอร์ด ESP32 ตรวจวัดค่าและใช้อัลกอริทึมวิเคราะห์ช่วงเวลาที่โรงงานหยุดเดินกระบวนการผลิต (Off-peak / Night-shift window) หากพบว่าอัตราการไหลของลมยังมีค่าสูงอยู่ แสดงว่าเกิดจุดรั่วไหลในระบบ และส่งคำสั่งแจ้งเตือนความผิดปกติไปยังวิศวกรผู้ดูแลอาคาร นอกจากนี้ยังตั้งค่าโหมดประหยัดพลังงาน **Deep Sleep** ให้กับอุปกรณ์เพื่อการประหยัดแบตเตอรี่ในกรณีที่ต้องการติดตั้งในพื้นที่ห่างไกล

---

## 8.9 ความปลอดภัยและความเป็นส่วนตัวเบื้องต้นของระบบ IoT

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
