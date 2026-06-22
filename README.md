# เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)

> รายวิชา **3(2-2-5)** — ทฤษฎี 2 ชม. / ปฏิบัติ 2 ชม. / ศึกษาด้วยตนเอง 5 ชม. ต่อสัปดาห์
> หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมเครื่องกล — ชั้นปีที่ 1 ภาคการศึกษาที่ 2/2568
>
> 📋 ดูแผนการจัดการเรียนรู้รายสัปดาห์ฉบับเต็ม (CLO/LLO, การวัดประเมินผล): **[weekly-lesson-plan.md](weekly-lesson-plan.md)**

## แผนการสอน (15 สัปดาห์)

| สัปดาห์ที่ | หัวข้อการเรียน | รายละเอียดเนื้อหา | ไฟล์อ้างอิง |
|:---:|:---|:---|:---|
| **1** | **บทนำรายวิชาและอินเทอร์เน็ตของสรรพสิ่ง (IoT)** | ความหมายและพัฒนาการของ IoT, สถาปัตยกรรมระบบ IoT, องค์ประกอบ, การประยุกต์ในงานวิศวกรรม | [IoT Introduction](chapters/ch01-iot-introduction/) |
| **2** | **ตัวรับรู้ (Sensors)** | ประเภทและหลักการของเซนเซอร์, คุณลักษณะ (ช่วงวัด/ความไว/ความละเอียด), สัญญาณดิจิทัล/แอนะล็อก | [Sensors](chapters/ch02-sensors/) |
| **3** | **ตัวกระทำและการเชื่อมต่อ** | LED, รีเลย์, มอเตอร์, เซอร์โว, การขับโหลดด้วยทรานซิสเตอร์/รีเลย์, การแยกกราวด์ | [Actuators](chapters/ch03-actuators/) |
| **4** | **ไมโครคอนโทรลเลอร์เบื้องต้น (ESP32/Arduino)** | สถาปัตยกรรม MCU, GPIO, โครงสร้างโปรแกรม, การจำลองด้วย Wokwi | [Microcontroller](chapters/ch04-microcontroller/) |
| **5** | **การเชื่อมต่อสัญญาณดิจิทัลและแอนะล็อก** | Digital I/O, ADC, PWM, การแปลงและปรับขนาดสัญญาณ | [I/O Interfacing](chapters/ch05-io-interfacing/) |
| **6** | **อ่านเซนเซอร์และควบคุมตัวกระทำด้วยไมโครคอนโทรลเลอร์** | โพรโทคอล I2C/SPI/UART, อ่าน DHT22/BMP280, ตรรกะควบคุมตามเงื่อนไข | [Microcontroller](chapters/ch04-microcontroller/) · [I/O](chapters/ch05-io-interfacing/) |
| **7** | **เทคโนโลยีไร้สายสำหรับ IoT — Wi-Fi** | คลื่นความถี่และมาตรฐานไร้สาย, Wi-Fi, การต่อ ESP32 เข้าเครือข่ายและ Web Server | [Wireless](chapters/ch06-wireless/) |
| **8** | **เทคโนโลยีไร้สาย — BLE, LoRa, Zigbee** | เปรียบเทียบ BLE/Zigbee/LoRa/NB-IoT ด้านระยะ พลังงาน อัตราข้อมูล, การเลือกใช้ | [Wireless](chapters/ch06-wireless/) |
| **—** | **🟧 สอบกลางภาค (Midterm Exam)** | **ครอบคลุมเนื้อหาสัปดาห์ที่ 1–8 \| สัดส่วน 20%** | - |
| **9** | **โพรโทคอลการสื่อสาร HTTP/REST** | Client/Server, HTTP Methods, REST API, รูปแบบข้อมูล JSON | [Protocols](chapters/ch07-protocols/) |
| **10** | **โพรโทคอล MQTT** | Publish/Subscribe, Broker, Topic, QoS, การส่งข้อมูลเซนเซอร์ผ่าน MQTT | [Protocols](chapters/ch07-protocols/) |
| **11** | **เทคโนโลยีคลาวด์และแพลตฟอร์ม IoT** | บริการคลาวด์ (IaaS/PaaS/SaaS), แพลตฟอร์ม IoT, การเชื่อมต่ออุปกรณ์กับคลาวด์ | [Cloud](chapters/ch08-cloud/) |
| **12** | **การประยุกต์ใช้คลาวด์และการจัดเก็บข้อมูล** | การส่งข้อมูลขึ้น ThingSpeak, ฐานข้อมูลและ API, การตั้งการแจ้งเตือน | [Cloud](chapters/ch08-cloud/) |
| **13** | **เทคนิคการแสดงผลข้อมูล (Data Visualization)** | หลักการนำเสนอข้อมูล, ชนิดกราฟ, แดชบอร์ดเรียลไทม์ด้วย Node-RED | [Data Visualization](chapters/ch09-data-visualization/) |
| **14** | **การเชื่อมต่อกับโปรแกรมของผู้ใช้ (User Interface)** | การออกแบบ UI, แดชบอร์ดและโมบายแอป, การควบคุมอุปกรณ์ผ่าน Blynk | [Data Visualization](chapters/ch09-data-visualization/) |
| **15** | **พื้นฐานการเรียนรู้ของเครื่อง (Machine Learning) สำหรับ IoT** | แนวคิด ML, ประเภทการเรียนรู้, การจำแนกข้อมูลเซนเซอร์, TinyML/Edge AI | [Machine Learning](chapters/ch10-machine-learning/) |
| **—** | **🟧 สอบปลายภาค (Final Exam)** | **ครอบคลุมเนื้อหาสัปดาห์ที่ 9–15 \| สัดส่วน 25%** | [summary.md](chapters/summary.md) |

---

## 📊 เกณฑ์การวัดและประเมินผล

| รายการประเมิน | สัดส่วน (%) | CLO ที่สัมพันธ์ |
|:---|:---:|:---|
| จิตพิสัย การเข้าเรียนและการมีส่วนร่วมในชั้นเรียน | 10 | CLO4 |
| ใบงานและแบบฝึกหัด | 30 | CLO1, CLO2, CLO3 |
| สอบปฏิบัติ / โครงงาน IoT | 15 | CLO3, CLO4 |
| สอบกลางภาค | 20 | CLO1, CLO2 |
| สอบปลายภาค | 25 | CLO2, CLO3 |
| **รวม** | **100** | |

---

## 🛠️ เครื่องมือและแพลตฟอร์มที่ใช้ในวิชา

| เครื่องมือ | ลิงก์ | ใช้สำหรับ |
|:---|:---|:---|
| **Wokwi Simulator** | [wokwi.com](https://wokwi.com/) | จำลอง ESP32/Arduino พร้อมเซนเซอร์ — Lab หลักของวิชา |
| **Arduino IDE** | [arduino.cc/software](https://www.arduino.cc/en/software) | เขียน/อัปโหลดโปรแกรมลงบอร์ดจริง (ESP32 Core) |
| **ThingSpeak** | [thingspeak.com](https://thingspeak.com/) | แพลตฟอร์มคลาวด์ IoT รับ-แสดงข้อมูลเซนเซอร์ (Lab 11–12) |
| **Node-RED** | [nodered.org](https://nodered.org/) | สร้างแดชบอร์ดและโฟลว์ข้อมูลแบบลาก-วาง (Lab 13–14) |
| **Blynk** | [blynk.io](https://blynk.io/) | สร้างโมบายแอป/แดชบอร์ดควบคุมอุปกรณ์ (Lab 14) |
| **Google Colab** | [colab.research.google.com](https://colab.research.google.com/) | ฝึก Machine Learning เบื้องต้นด้วย Python (Lab 15) |

---