---
layout: default
title: "สรุปภาพรวมรายวิชาและการเชื่อมโยงบทเรียน"
permalink: /chapters/summary/
---

# 📚 สรุปภาพรวมรายวิชาและการเชื่อมโยงบทเรียน (Course Summary & Alignment)

## รายวิชา เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)
**หลักสูตร:** วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมเครื่องกล ชั้นปีที่ 1  
**อาจารย์ผู้สอน:** นายภูริ จันทิมา  

---

> ### 🎯 ผลลัพธ์การเรียนรู้ระดับรายวิชา (Course Learning Outcomes: CLOs)
>
> | รหัส CLO | คำอธิบายผลลัพธ์การเรียนรู้ |
> |:---:|---|
> | **CLO1** | **อธิบายหลักการและสถาปัตยกรรม** ของระบบ IoT ตัวรับรู้ ตัวกระทำ และไมโครคอนโทรลเลอร์ได้ |
> | **CLO2** | **เลือกใช้และอธิบาย** เทคโนโลยีไร้สาย โพรโทคอลการสื่อสาร และเทคโนโลยีคลาวด์สำหรับ IoT ได้ |
> | **CLO3** | **ออกแบบและพัฒนาระบบ IoT** ที่เชื่อมต่อเซนเซอร์/ตัวกระทำ สื่อสารข้อมูล และแสดงผลผ่านโปรแกรมของผู้ใช้ได้ |
> | **CLO4** | **ปฏิบัติการสร้าง ทดสอบ และประยุกต์ใช้** ระบบ IoT พร้อมการเรียนรู้ของเครื่องเบื้องต้น และทำงานเป็นทีมอย่างรับผิดชอบ |

---

## 🗺️ ตารางแผนที่การเรียนรู้ 13 บทเรียนและ 15 สัปดาห์ (Learning Matrix)

| สัปดาห์ | บทเรียน (Chapter) | หัวข้อหลัก | CLOs ที่สอดคล้อง | LLOs ประจำสัปดาห์ |
|:---:|---|---|:---:|---|
| **1** | [บทที่ 1: อินเทอร์เน็ตของสรรพสิ่ง]({{ '/chapters/ch01-iot-introduction/' | relative_url }}) | ความหมาย, พัฒนาการ, ประโยชน์ และสถาปัตยกรรม IoT 4 ชั้น | **CLO1** | LLO1.1, LLO1.2, LLO1.3 |
| **2** | [บทที่ 2: การเชื่อมต่อสัญญาณ I/O]({{ '/chapters/ch02-io-interfacing/' | relative_url }}) | Digital I/O, Pull-up/down, การแปลง ADC, และการขับสัญญาณ PWM | **CLO3, CLO4** | LLO2.1, LLO2.2 |
| **3** | [บทที่ 3: ตัวรับรู้ (Sensors)]({{ '/chapters/ch03-sensors/' | relative_url }}) | คุณลักษณะเซนเซอร์, ความไว, ความละเอียด, และการอ่าน Datasheet | **CLO1** | LLO3.1, LLO3.2, LLO3.3 |
| **4** | [บทที่ 4: ตัวกระทำและการเชื่อมต่อ]({{ '/chapters/ch04-actuators/' | relative_url }}) | Relay, DC Motor, Servo, Stepper, วงจรขับโหลด, และ Flyback Diode | **CLO1, CLO3** | LLO4.1, LLO4.2 |
| **5** | [บทที่ 5: ไมโครคอนโทรลเลอร์ ESP32]({{ '/chapters/ch05-microcontroller/' | relative_url }}) | สถาปัตยกรรม ESP32, ขา GPIO, โครงสร้างโค้ด, และการจำลอง Wokwi | **CLO1, CLO4** | LLO5.1, LLO5.2 |
| **6** | [บทที่ 6: การแสดงผลและเซนเซอร์]({{ '/chapters/ch06-display-sensors/' | relative_url }}) | I2C/SPI/UART, จอ OLED/LCD, BMP280/DHT22, ตรรกะ Hysteresis | **CLO3, CLO4** | LLO6.1, LLO6.2 |
| **7** | [บทที่ 7: เครือข่ายและการสื่อสารไร้สาย]({{ '/chapters/ch07-wireless/' | relative_url }}) | คลื่นความถี่, มาตรฐาน Wi-Fi, โหมด STA/AP, และ ESP32 Web Server | **CLO2, CLO3, CLO4** | LLO7.1, LLO7.2 |
| **8** | [บทที่ 7: เทคโนโลยีไร้สายเฉพาะทาง]({{ '/chapters/ch07-wireless/' | relative_url }}) | Bluetooth/BLE, Zigbee Mesh, LoRa/LoRaWAN, NB-IoT, Link Budget | **CLO2** | LLO8.1, LLO8.2 |
| 🟧 | **สอบกลางภาค (Midterm Exam)** | ครอบคลุมเนื้อหาสัปดาห์ที่ 1–8 | **CLO1, CLO2** | — |
| **9** | [บทที่ 8: สถาปัตยกรรมเว็บ & HTTP]({{ '/chapters/ch08-http/' | relative_url }}) | Client/Server, HTTP Methods, Status Codes, REST API, JSON | **CLO2, CLO3, CLO4** | LLO9.1, LLO9.2 |
| **10** | [บทที่ 9: โพรโทคอล MQTT]({{ '/chapters/ch09-mqtt/' | relative_url }}) | Publish/Subscribe, Broker, Topics, Wildcards, QoS 0/1/2, LWT | **CLO2, CLO3, CLO4** | LLO10.1, LLO10.2 |
| **11** | [บทที่ 10: แพลตฟอร์มคลาวด์ IoT]({{ '/chapters/ch10-cloud/' | relative_url }}) | IaaS/PaaS/SaaS, ThingsBoard, Telemetry, Client/Server Attributes | **CLO2, CLO3, CLO4** | LLO11.1, LLO11.2 |
| **12** | [บทที่ 10: ระบบจัดการกฎและแจ้งเตือน]({{ '/chapters/ch10-cloud/' | relative_url }}) | Time-Series Database, Rule Engine, Alarm Triggers, REST API | **CLO3, CLO4** | LLO12.1, LLO12.2 |
| **13** | [บทที่ 11: ฐานข้อมูล & Node-RED]({{ '/chapters/ch11-node-red/' | relative_url }}) | Edge Gateway, Node-RED Dashboard, Flow Programming, Chart UI | **CLO3, CLO4** | LLO13.1, LLO13.2 |
| **14** | [บทที่ 12: ระบบ IoT สู่คลาวด์และแดชบอร์ด]({{ '/chapters/ch12-hmi-visualization/' | relative_url }}) | ESP32-S3 + AHT25, Arduino Cloud (Thing, Cloud Variables, MQTT), Dashboard & Remote Control | **CLO3, CLO4** | LLO14.1, LLO14.2 |
| **15** | [บทที่ 13: การเรียนรู้ของเครื่องและ TinyML]({{ '/chapters/ch13-machine-learning/' | relative_url }}) | ML Pipeline, การสกัดฟีเจอร์การสั่นสะเทือน, TinyML บน ESP32 | **CLO1, CLO4** | LLO15.1, LLO15.2 |
| 🟧 | **สอบปลายภาค (Final Exam)** | ครอบคลุมเนื้อหาสัปดาห์ที่ 9–15 (สัดส่วนคะแนน 30%) | **CLO2, CLO3, CLO4** | — |

---

## ⚙️ สรุปสถาปัตยกรรม IoT 4 ชั้น (4-Layer IoT Architecture Cheatsheet)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. APPLICATION LAYER: ThingsBoard, Node-RED UI, Arduino Cloud Dashboard     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API / WebSocket / MQTT
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 3. CLOUD & PROCESSING LAYER: ThingsBoard Server, Rule Engine, Time-Series DB│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Wi-Fi / Cellular / LoRaWAN
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 2. NETWORK & PROTOCOL LAYER: HTTP/REST (JSON), MQTT (Pub/Sub), BLE, Zigbee  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ I2C / SPI / UART / GPIO / ADC / PWM
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ 1. PERCEPTION & DEVICE LAYER: ESP32 MCU, DHT22, BMP280, OLED, Relay, Motor  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ แหล่งเครื่องมือและเอกสารประกอบการเรียน

- **เครื่องมือจำลองและการเขียนโปรแกรม:**
  - [Wokwi Simulator Web](https://wokwi.com/)
  - [คู่มือติดตั้ง Wokwi ใน VS Code (Step-by-Step)]({{ '/chapters/ch05-microcontroller/wokwi-vscode-guide.html' | relative_url }})
  - [ThingsBoard Cloud Demo](https://thingsboard.cloud/)
  - [Node-RED Documentation](https://nodered.org/docs/)
  - [Google Colaboratory (Python ML)](https://colab.research.google.com/)
