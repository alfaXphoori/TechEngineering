---
layout: default
title: "บทที่ 6: การแสดงผลข้อมูลและการเชื่อมต่อเซนเซอร์ด้วยโพรโทคอลสื่อสาร"
permalink: /chapters/ch06-display-sensors/
---

# Chapter 6: การแสดงผลข้อมูลและการเชื่อมต่อเซนเซอร์ด้วยโพรโทคอลสื่อสาร

## Display & Sensor Interfacing (I2C, SPI, UART, OLED, LCD, Dot Matrix, Seven Segment, DHT22, BMP280)

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

> ### 🎯 ผลลัพธ์การเรียนรู้และการเชื่อมโยง (Constructive Alignment)
>
> - **สัปดาห์การเรียนรู้:** สัปดาห์ที่ 6 — การแสดงผลข้อมูลผ่านจอภาพและระบบเซนเซอร์ (Display & Sensor Interfacing)
> - **ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs):**
>   - **CLO3:** ออกแบบและพัฒนาระบบ IoT ที่เชื่อมต่อเซนเซอร์/ตัวกระทำ สื่อสารข้อมูล และแสดงผลผ่านโปรแกรมของผู้ใช้ได้
>   - **CLO4:** ปฏิบัติการสร้าง ทดสอบ และประยุกต์ใช้ระบบ IoT พร้อมการเรียนรู้ของเครื่องเบื้องต้น และทำงานเป็นทีมอย่างรับผิดชอบ
> - **ผลลัพธ์การเรียนรู้ระดับบทเรียน (LLOs):**
>   - **LLO6.1:** ต่อและทดสอบการสื่อสาร I2C/SPI/UART กับเซนเซอร์และจอแสดงผลได้ (CLO4)
>   - **LLO6.2:** อ่านเซนเซอร์ดิจิทัล, แสดงผลค่าทางจอภาพ (Display) และควบคุมตัวกระทำตามเงื่อนไขได้ (CLO3, CLO4)
>
---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 6.1 โพรโทคอลการสื่อสารอนุกรมบนบอร์ด (On-board Serial Communication Protocols)

ในงานวิศวกรรมเมคคาทรอนิกส์และไอโอที ไมโครคอนโทรลเลอร์จำเป็นต้องแลกเปลี่ยนข้อมูลกับอุปกรณ์ภายนอกจำนวนมาก เช่น เซนเซอร์วัดความดัน จอแสดงผลกราฟิก และไอซีควบคุมมอเตอร์ หากใช้ขา Digital I/O แบบขนาน (Parallel) ขาของไมโครคอนโทรลเลอร์จะหมดลงอย่างรวดเร็วและเกิดสัญญาณรบกวน (Crosstalk) สูง ดังนั้น อุตสาหกรรมจึงใช้ **โพรโทคอลการสื่อสารอนุกรม (Serial Bus Protocols)** ซึ่งส่งข้อมูลทีละบิตผ่านสายสัญญาณเพียง 2 ถึง 4 เส้น

### 6.1.1 ตารางเปรียบเทียบโพรโทคอล I2C, SPI และ UART

| คุณลักษณะทางวิศวกรรม | I2C (Inter-Integrated Circuit) | SPI (Serial Peripheral Interface) | UART (Universal Asynchronous Receiver-Transmitter) |
|---|---|---|---|
| **โครงสร้างสถาปัตยกรรม** | Multi-Master / Multi-Slave (บัสร่วม) | Single-Master / Multi-Slave | Point-to-Point (ต่อตรง 2 อุปกรณ์) |
| **สายสัญญาณหลัก** | **2 เส้น:** SDA (Data), SCL (Clock) | **4 เส้น:** MOSI, MISO, SCK, CS/SS | **2 เส้น:** TX (Transmit), RX (Receive) |
| **สัญญาณนาฬิกา (Clock)** | มี (Synchronous - SCL) | มี (Synchronous - SCK) | ไม่มี (Asynchronous - อ้างอิง Baud Rate) |
| **ความเร็วการถ่ายโอนข้อมูล** | Standard: 100 kbps<br>Fast: 400 kbps<br>High-speed: 3.4 Mbps | สูงมาก: 10 Mbps – 80 Mbps+ | ต่ำ-ปานกลาง: 9600 – 921600 bps |
| **โหมดการส่งข้อมูล** | Half-Duplex (สลับกันรับ-ส่ง) | Full-Duplex (รับ-ส่งพร้อมกัน) | Full-Duplex (รับ-ส่งพร้อมกัน) |
| **การระบุตัวตนอุปกรณ์** | Address ประจำตัวขนาด 7-bit หรือ 10-bit | ใช้สาย Chip Select (CS) แยกเฉพาะตัว | ไม่มีการระบุ Address (ต่อตรงข้ามสาย TX-RX) |
| **วงจรทางกายภาพ** | Open-Drain / Open-Collector (ต้องมี Pull-up) | Push-Pull | Push-Pull (TTL/CMOS หรือ RS-232/RS-485) |
| **การใช้งานในระบบ IoT** | จอ OLED, LCD, เซนเซอร์ BMP280, MPU6050 | จอ TFT สี, SD Card Module, RFID RC522 | GPS Module, Bluetooth HC-05, GSM/NB-IoT |

---

### 6.1.2 เจาะลึกโพรโทคอล I2C (Inter-Integrated Circuit)

I2C ได้รับการพัฒนาโดย Philips Semiconductors (NXP ในปัจจุบัน) ออกแบบมาสำหรับการเชื่อมต่ออุปกรณ์ความเร็วปานกลางบนแผงวงจรพิมพ์ (PCB) เดียวกัน

#### 1) วงจรทางกายภาพและตัวต้านทาน Pull-up (Physical Layer & Pull-up Resistors)
ขา SDA และ SCL ของอุปกรณ์ I2C ทุกตัวเป็นวงจรแบบ **Open-Drain** (หรือ Open-Collector) หมายความว่าอุปกรณ์สามารถดึงสายสัญญาณลงสู่กราวด์ (Logic 0 / LOW) ได้เท่านั้น แต่ไม่สามารถจ่ายแรงดันไฟฟ้า HIGH ได้ด้วยตนเอง จึงจำเป็นต้องต่อ **ตัวต้านทาน Pull-up ($R_p$)** เข้ากับแหล่งจ่ายไฟ $V_{CC}$ (ปกติคือ 3.3V หรือ 5V)

ค่าความต้านทาน Pull-up ($R_p$) มีความสำคัญอย่างยิ่งต่อความสมบูรณ์ของสัญญาณ (Signal Integrity):
- **ค่า $R_p$ ต่ำเกินไป:** กระแสไหลลงกราวด์มากเกินไปเมื่อ Logic เป็น LOW ทำให้เกิดความร้อนและแรงดัน Logic 0 ไม่ลงต่ำถึงศูนย์โวลต์ ($V_{OL} > 0.4V$)
- **ค่า $R_p$ สูงเกินไป:** สัญญาณขอบขาขึ้น (Rise Time, $t_r$) ช้าเกินไปเนื่องจากความจุไฟฟ้าแฝงของสาย ($C_b$) ทำให้รูปคลื่นเพี้ยนและสื่อสารล้มเหลวที่ความถี่สูง

สูตรการคำนวณค่า $R_p$ สูงสุดตามมาตรฐาน I2C:
$$R_{p(max)} = rac{t_r}{0.8473 	imes C_b}$$

*โดยทั่วไปสำหรับบอร์ด ESP32 และโมดูลเซนเซอร์ระยะสั้น นิยมใช้ตัวต้านทาน Pull-up ขนาด **$2.2\text{ k}\Omega$ ถึง $4.7\text{ k}\Omega$***

#### 2) ลำดับการสื่อสารของ I2C Frame (Communication Sequence)
1. **START Condition:** ขา SDA เปลี่ยนสถานะจาก HIGH เป็น LOW ในขณะที่ SCL ยังคงเป็น HIGH
2. **Address Frame (7-bit Address + R/W bit):** Master ส่งแอดเดรส 7 บิต ตามด้วยบิตที่ 8 กำหนดทิศทาง (0 = Write, 1 = Read)
3. **ACK/NACK Bit:** อุปกรณ์ Slave ที่มีแอดเดรสตตรงกันจะดึงสาย SDA ลง LOW เพื่อตอบรับ (Acknowledge: ACK)
4. **Data Frame:** การส่งข้อมูลทีละไบต์ (8 บิต) ตามด้วยบิต ACK จากผู้รับ
5. **STOP Condition:** ขา SDA เปลี่ยนสถานะจาก LOW เป็น HIGH ในขณะที่ SCL เป็น HIGH เพื่อสิ้นสุดการสื่อสาร

---

### 6.1.3 เจาะลึกโพรโทคอล SPI (Serial Peripheral Interface)

SPI พัฒนาโดย Motorola เป็นโพรโทคอลแบบ Synchronous ความเร็วสูงมาก เหมาะสำหรับการส่งผ่านข้อมูลปริมาณมาก เช่น การสตรีมภาพขึ้นจอ TFT หรือการบันทึกข้อมูลเซนเซอร์ลง SD Card

#### 1) สายสัญญาณ 4 เส้นของ SPI
- **MOSI (Master Out Slave In):** สายส่งข้อมูลจากไมโครคอนโทรลเลอร์ไปยังอุปกรณ์ปลายทาง
- **MISO (Master In Slave Out):** สายรับข้อมูลจากอุปกรณ์ปลายทางกลับมายังไมโครคอนโทรลเลอร์
- **SCK / SCLK (Serial Clock):** สัญญาณนาฬิกากำหนดจังหวะการส่งข้อมูล ควบคุมโดย Master
- **CS / SS (Chip Select / Slave Select):** สายสั่งเลือกอุปกรณ์ Active-LOW (เมื่อ Master ดึงขา CS ลง LOW อุปกรณ์ตัวนั้นจะเริ่มสื่อสาร)

#### 2) โหมดการทำงานของ SPI (SPI Modes: CPOL & CPHA)
SPI มี 4 โหมด ขึ้นอยู่กับการตั้งค่า Clock Polarity (CPOL) และ Clock Phase (CPHA):

| SPI Mode | CPOL (สถานะ SCLK เมื่อไม่ได้ส่งข้อมูล) | CPHA (จังหวะการสุ่มอ่านข้อมูล) | คำอธิบายจังหวะสัญญาณ |
|:---:|:---:|:---:|:---|
| **Mode 0** | 0 (LOW) | 0 (First Edge) | Clock เริ่มที่ LOW, อ่านข้อมูลที่ขอบขาขึ้น (Rising Edge) |
| **Mode 1** | 0 (LOW) | 1 (Second Edge) | Clock เริ่มที่ LOW, อ่านข้อมูลที่ขอบขาลง (Falling Edge) |
| **Mode 2** | 1 (HIGH) | 0 (First Edge) | Clock เริ่มที่ HIGH, อ่านข้อมูลที่ขอบขาลง (Falling Edge) |
| **Mode 3** | 1 (HIGH) | 1 (Second Edge) | Clock เริ่มที่ HIGH, อ่านข้อมูลที่ขอบขาขึ้น (Rising Edge) |

*อุปกรณ์เซนเซอร์และจอภาพส่วนใหญ่ทำงานที่ **SPI Mode 0** หรือ **Mode 3***

---

## 6.2 จอแสดงผลสำหรับระบบ IoT (Display Interfacing)

จอแสดงผลทำหน้าที่เป็น **Human-Machine Interface (HMI)** ในระดับกายภาพ ช่วยให้ผู้ดูแลระบบและวิศวกรสามารถตรวจสอบสถานะการทำงาน อุณหภูมิ ความดัน ค่าการสั่นสะเทือน หรือรหัสความผิดพลาด (Error Codes) ได้ทันทีหน้าตู้ควบคุม

### 6.2.1 รายละเอียดโมดูลจอแสดงผลยอดนิยม

#### 1) จอแสดงผล LCD 1602 / 2004 (Liquid Crystal Display)
- **สถาปัตยกรรม:** ใช้ชิปควบคุม HD44780 แสดงผลตัวอักษรแบบ Dot Matrix $5\times8$ พิกเซลต่อหนึ่งตัวอักษร
- **โมดูลแปลง I2C Backpack (ชิป PCF8574):** แปลงการเชื่อมต่อขนาน 16 ขา ให้เหลือเพียงสาย I2C 2 เส้น (SDA, SCL) + ไฟเลี้ยง 5V และ GND
- **การปรับ Contrast:** ใช้ตัวต้านทานปรับค่าได้ (Trimpot) ด้านหลังโมดูลเพื่อปรับความเข้มของตัวอักษร
- **แอดเดรส I2C:** โดยทั่วไปคือ `0x27` หรือ `0x3F`

#### 2) จอแสดงผลกราฟิก SSD1306 OLED (128x64 Pixels)
- **เทคโนโลยี:** Organic Light Emitting Diode เปล่งแสงได้ในตัวเองทุกพิกเซล ไม่ต้องใช้ Backlight ทำให้ได้สีดำสนิท (True Black) และอัตราส่วนคอนทราสต์ (Contrast Ratio) สูงมาก
- **ความละเอียด:** 128 พิกเซลแนวนอน $\times$ 64 พิกเซลแนวตั้ง (รวม 8,192 พิกเซล)
- **การใช้พลังงาน:** ใช้พลังงานแปรผันตามจำนวนพิกเซลที่สว่าง ประหยัดไฟมากสำหรับอุปกรณ์ใส่ถ่าน (Battery-powered IoT)
- **แอดเดรส I2C:** ค่าเริ่มต้นคือ `0x3C` (หรือ `0x3D` เมื่อต่อจัมเปอร์เปลี่ยนขา)

#### 3) จอแสดงผลไฟ LED ดอตเมทริกซ์ MAX7219 (8x8 Dot Matrix)
- **เทคโนโลยี:** LED Array ความสว่างสูง ควบคุมด้วยไดรเวอร์ MAX7219 ผ่านอินเตอร์เฟส SPI
- **จุดเด่น:** สามารถต่อพ่วง (Cascade) กันได้หลายชุด เช่น โมดูล 4-in-1 (32x8 พิกเซล) เหมาะสำหรับการแสดงข้อความตัววิ่งเตือนภัยในโรงงานระยะมองเห็น 5–10 เมตร

#### 4) จอแสดงผล 7 ส่วน TM1637 (4-Digit Seven-Segment Display)
- **เทคโนโลยี:** โมดูลตัวเลข 7 ส่วน 4 หลัก มีไอซี TM1637 ควบคุมกระแสและมัลติเพล็กซ์ในตัว
- **การเชื่อมต่อ:** ใช้สายกึ่งอนุกรม 2 เส้น (CLK, DIO) ใช้แรงดัน 3.3V ถึง 5V เหมาะสำหรับแสดงเวลานับถอยหลัง อุณหภูมิ หรือค่ารอบความเร็ว (RPM)

---

## 6.3 เซนเซอร์ดิจิทัลอัจฉริยะ (Smart Digital Sensors)

### 6.3.1 เซนเซอร์วัดอุณหภูมิและความชื้นสัมพัทธ์ DHT22 (AM2302)
- **หลักการทำงาน:** ใช้เซนเซอร์ความชื้นแบบคาปาซิทีฟ (Capacitive Humidity Sensor) และเทอร์มิสเตอร์ NTC ความเที่ยงตรงสูง พร้อมชิปแปลงสัญญาณอนาล็อกเป็นดิจิทัล 8 บิตในตัว
- **โพรโทคอล:** Custom Single-Wire Bi-directional Protocol (ส่งแพ็กเก็ตข้อมูล 40 บิต ประกอบด้วย ความชื้น 16 บิต + อุณหภูมิ 16 บิต + Checksum 8 บิต)
- **ช่วงการวัด:** อุณหภูมิ $-40^\circ\text{C}$ ถึง $+80^\circ\text{C}$ ($\pm 0.5^\circ\text{C}$), ความชื้น $0\%$ ถึง $100\%\text{ RH}$ ($\pm 2\%\text{ RH}$)
- **อัตราการสุ่มอ่าน (Sampling Rate):** สูงสุด 0.5 Hz (อ่านได้ทุก ๆ 2 วินาที)

### 6.3.2 เซนเซอร์วัดความดันบรรยากาศและอุณหภูมิ BMP280
- **หลักการทำงาน:** เซนเซอร์ความดันแบบเพียโซรีซิสทีฟ (Piezoresistive Pressure Sensor) ความแม่นยำสูง พัฒนาโดย Bosch Sensortec เชื่อมต่อผ่าน I2C หรือ SPI
- **การประยุกต์ใช้งาน:** วัดความดันบรรยากาศแบบสัมบูรณ์ (Absolute Barometric Pressure), ความดันในห้องคลีนรูม, และการคำนวณความสูงจากระดับน้ำทะเล (Altimeter)
- **ช่วงการวัดความดัน:** $300\text{ hPa}$ ถึง $1100\text{ hPa}$ (ความแม่นยำ $\pm 0.12\text{ hPa}$ เทียบเท่าความสูง $\pm 1\text{ เมตร}$)
- **สมการคำนวณความสูงจากความดันบรรยากาศ (Hypsometric Formula):**
$$h = 44330 \times \left[ 1 - \left( \frac{P}{P_0} \right)^{\frac{1}{5.255}} \right]$$
*เมื่อ $P$ คือความดันที่วัดได้ (hPa), $P_0$ คือความดันอ้างอิงที่ระดับน้ำทะเล ($1013.25\text{ hPa}$), และ $h$ คือความสูงในหน่วยเมตร (m)*

---

## 6.4 ตรรกะการควบคุมแบบวงปิดและการป้องกันการกระเพื่อม (Hysteresis Control Logic)

ในการนำค่าเซนเซอร์มาสั่งงานตัวกระทำ (เช่น การเปิดพัดลมระบายความร้อนเมื่ออุณหภูมิเกินเกณฑ์) หากใช้เงื่อนไขแบบจุดเดียว (Single Threshold) รีเลย์จะตัด-ต่ออย่างรวดเร็วหลายครั้งต่อวินาที (**Relay Chattering**) ซึ่งส่งผลให้หน้าสัมผัสของรีเลย์ไหม้เสียหาย เกิดคลื่นสัญญาณรบกวน EMI และมอเตอร์พัดลมพังเสียหาย

### การแก้ปัญหาด้วย Hysteresis Band (Schmitt Trigger Logic)
กำหนดค่าขอบเขตบน (High Threshold: $T_{high}$) และขอบเขตล่าง (Low Threshold: $T_{low}$):

```cpp
// ✅ รูปแบบที่ถูกต้อง (มีแถบ Hysteresis ป้องกัน Chattering)
const float TEMP_HIGH_SETPOINT = 35.0; // อุณหภูมิสั่งเปิดพัดลม
const float TEMP_LOW_SETPOINT  = 32.0; // อุณหภูมิสั่งปิดพัดลม

if (temperature >= TEMP_HIGH_SETPOINT) {
  digitalWrite(RELAY_FAN, HIGH); // เปิดพัดลมระบายความร้อน
} else if (temperature <= TEMP_LOW_SETPOINT) {
  digitalWrite(RELAY_FAN, LOW);  // ปิดพัดลมเมื่ออุณหภูมิลดลงเพียงพอแล้ว
}
```

</div>

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">

## 6.5 การทดลองและจำลองวงจรบน Wokwi Simulator

การทดลองนี้เป็นการรวมระบบวัดค่าสิ่งแวดล้อม (DHT22 และ BMP280) แสดงผลข้อมูลผ่านจอ SSD1306 OLED (I2C) และควบคุมการทำงานของพัดลมระบายอากาศผ่าน Relay พร้อมไฟแจ้งเตือนสถานะ

### 6.5.1 แผนผังการต่อวงจร (Wiring Diagram)

| อุปกรณ์ | ขาอุปกรณ์ | ขาบนบอร์ด ESP32 DevKit | หน้าที่ / หมายเหตุ |
|---|---|---|---|
| **SSD1306 OLED** | VCC | 3V3 | แหล่งจ่ายไฟ 3.3V |
| | GND | GND | กราวด์ร่วม |
| | SCL | **GPIO 22** | I2C Clock Bus |
| | SDA | **GPIO 21** | I2C Data Bus (Address: `0x3C`) |
| **BMP280 Sensor** | VCC | 3V3 | แหล่งจ่ายไฟ 3.3V |
| | GND | GND | กราวด์ร่วม |
| | SCL | **GPIO 22** | I2C Clock Bus (แชร์บัสร่วมกับ OLED) |
| | SDA | **GPIO 21** | I2C Data Bus (Address: `0x76` หรือ `0x77`) |
| **DHT22 Sensor** | VCC | 3V3 / 5V | แหล่งจ่ายไฟ |
| | GND | GND | กราวด์ร่วม |
| | DATA | **GPIO 15** | สัญญาณดิจิทัล Single-Wire (มี Pull-up 10k) |
| **Relay (Fan Driver)** | IN | **GPIO 13** | สัญญาณสั่งตัด-ต่อรีเลย์พัดลม |
| | VCC / GND | 5V / GND | ไฟเลี้ยงวงจรขับคอยล์รีเลย์ |
| **Status LED** | Anode (+) | **GPIO 12** | ต่อผ่านตัวต้านทาน $330\Omega$ แสดงสถานะ Alarm |

---

### 6.5.2 โค้ดโปรแกรม Arduino C++ ฉบับสมบูรณ์

```cpp
/**
 * Chapter 6: Display & Multi-Sensor Interfacing with Closed-Loop Control
 * Hardware: ESP32 + SSD1306 OLED (I2C) + BMP280 (I2C) + DHT22 + Relay
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_BMP280.h>
#include <DHT.h>

// กำหนดขนาดหน้าจอ OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// กำหนดขาเซนเซอร์และตัวกระทำ
#define DHTPIN        15
#define DHTTYPE       DHT22
DHT dht(DHTPIN, DHTTYPE);

Adafruit_BMP280 bmp; // ใช้บัส I2C เริ่มต้น (SDA=21, SCL=22)

#define RELAY_FAN_PIN 13
#define LED_ALARM_PIN 12

// กำหนดเกณฑ์อุณหภูมิควบคุมแบบ Hysteresis
const float TEMP_HIGH_LIMIT = 35.0; // อุณหภูมิเปิดพัดลม (°C)
const float TEMP_LOW_LIMIT  = 31.0; // อุณหภูมิปิดพัดลม (°C)
const float HUMID_ALARM     = 75.0; // ความชื้นสัมพัทธ์แจ้งเตือน (%)

bool fanState = false;
unsigned long lastReadTime = 0;
const unsigned long READ_INTERVAL = 2000; // อ่านค่าทุก 2 วินาที

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_FAN_PIN, OUTPUT);
  pinMode(LED_ALARM_PIN, OUTPUT);
  digitalWrite(RELAY_FAN_PIN, LOW);
  digitalWrite(LED_ALARM_PIN, LOW);

  // เริ่มต้น I2C และจอแสดงผล OLED
  Wire.begin(21, 22);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("[ERROR] SSD1306 OLED initialization failed!"));
    while (true);
  }

  // เริ่มต้นเซนเซอร์ BMP280
  if (!bmp.begin(0x76)) {
    Serial.println(F("[WARNING] BMP280 not found at 0x76, checking 0x77..."));
    if (!bmp.begin(0x77)) {
      Serial.println(F("[ERROR] BMP280 initialization failed!"));
    }
  }

  // เริ่มต้นเซนเซอร์ DHT22
  dht.begin();

  // แสดงหน้าจอ Splash Screen
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(10, 15);
  display.println(F("KSU TechEngineering"));
  display.setCursor(18, 30);
  display.println(F("IoT Climate Node"));
  display.setCursor(25, 45);
  display.println(F("Initializing..."));
  display.display();
  delay(1500);
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - lastReadTime >= READ_INTERVAL) {
    lastReadTime = currentMillis;

    // 1. อ่านค่าจากเซนเซอร์
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    float pressure = bmp.readPressure() / 100.0F; // แปลงเป็น hPa
    float altitude = bmp.readAltitude(1013.25);   // ความสูงเหนือระดับน้ำทะเล (m)

    // ตรวจสอบความถูกต้องของข้อมูล
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println(F("[ERROR] Failed to read from DHT22!"));
      return;
    }

    // 2. ตรรกะควบคุมวงปิด (Hysteresis Closed-loop Control)
    if (temperature >= TEMP_HIGH_LIMIT) {
      fanState = true;
    } else if (temperature <= TEMP_LOW_LIMIT) {
      fanState = false;
    }
    digitalWrite(RELAY_FAN_PIN, fanState ? HIGH : LOW);

    // ตรรกะแจ้งเตือนความชื้นสูง
    bool alarmState = (humidity >= HUMID_ALARM);
    digitalWrite(LED_ALARM_PIN, alarmState ? HIGH : LOW);

    // 3. แสดงผลออกทาง Serial Monitor
    Serial.printf("[DATA] Temp: %.1f C | Humidity: %.1f %% | Pres: %.1f hPa | Alt: %.1f m | Fan: %s\n",
                  temperature, humidity, pressure, altitude, fanState ? "ON" : "OFF");

    // 4. อัปเดตการแสดงผลบนจอ OLED
    display.clearDisplay();

    // หัวข้อบาร์ด้านบน
    display.fillRect(0, 0, 128, 12, SSD1306_WHITE);
    display.setTextColor(SSD1306_BLACK, SSD1306_WHITE);
    display.setCursor(4, 2);
    display.println(F("CLIMATE MONITOR NODE"));

    // แสดงค่าอุณหภูมิและความชื้น
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 16);
    display.printf("Temp:  %.1f C", temperature);

    display.setCursor(0, 28);
    display.printf("Humid: %.1f %%", humidity);

    display.setCursor(0, 40);
    display.printf("Pres:  %.0f hPa", pressure);

    // แสดงสถานะพัดลมและการแจ้งเตือน
    display.setCursor(0, 52);
    display.printf("FAN:[%s]  ALM:[%s]", fanState ? "ON " : "OFF", alarmState ? "YES" : "NO ");

    display.display();
  }
}
```

---

### 6.5.3 ไฟล์จำลอง `diagram.json` สำหรับ Wokwi

```json
{
  "version": 1,
  "author": "KSU Digital Technology",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-ssd1306", "id": "oled1", "top": -160, "left": 10, "attrs": { "i2cAddress": "0x3c" } },
    { "type": "wokwi-dht22", "id": "dht1", "top": -160, "left": 160, "attrs": { "temperature": "36.5", "humidity": "65" } },
    { "type": "wokwi-bmp280", "id": "bmp1", "top": -160, "left": -120, "attrs": { "i2cAddress": "0x76" } },
    { "type": "wokwi-relay-module", "id": "relay1", "top": 120, "left": 160, "attrs": {} },
    { "type": "wokwi-led", "id": "led1", "top": 120, "left": -80, "attrs": { "color": "red" } },
    { "type": "wokwi-resistor", "id": "r1", "top": 170, "left": -80, "attrs": { "value": "330" } }
  ],
  "connections": [
    [ "esp:3V3", "oled1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "oled1:GND", "black", [ "v0" ] ],
    [ "esp:21", "oled1:SDA", "green", [ "v0" ] ],
    [ "esp:22", "oled1:SCL", "yellow", [ "v0" ] ],

    [ "esp:3V3", "bmp1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "bmp1:GND", "black", [ "v0" ] ],
    [ "esp:21", "bmp1:SDA", "green", [ "v0" ] ],
    [ "esp:22", "bmp1:SCL", "yellow", [ "v0" ] ],

    [ "esp:3V3", "dht1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "dht1:GND", "black", [ "v0" ] ],
    [ "esp:15", "dht1:SDA", "blue", [ "v0" ] ],

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

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

## 6.6 สรุปเนื้อหาและตารางอ้างอิงทางวิศวกรรม

### 6.6.1 แอดเดรส I2C ยอดนิยมในงานไอโอที (Common I2C Addresses)

| อุปกรณ์ / โมดูล | ชิปหลัก (IC) | I2C Address (7-bit Hex) | หมายเหตุ / วิธีเปลี่ยนแอดเดรส |
|---|---|:---:|---|
| **SSD1306 OLED (0.96")** | SSD1306 | `0x3C` (Default) / `0x3D` | ย้ายตัวต้านทาน 0 โอห์มด้านหลังจอ |
| **SH1106 OLED (1.3")** | SH1106 | `0x3C` / `0x3D` | สถาปัตยกรรมใกล้เคียง SSD1306 |
| **LCD 1602/2004 Backpack** | PCF8574 (NXP) | `0x27` | ชอร์ตจัมเปอร์ A0, A1, A2 เพื่อเลือก `0x20`–`0x27` |
| **LCD 1602/2004 Backpack** | PCF8574A (TI) | `0x3F` | ชอร์ตจัมเปอร์ A0, A1, A2 เพื่อเลือก `0x38`–`0x3F` |
| **BMP280 / BME280** | BMP280 | `0x76` (Default) / `0x77` | ต่อขา SDO เข้า GND (`0x76`) หรือ VCC (`0x77`) |
| **MPU6050 Accelerometer** | MPU6050 | `0x68` (Default) / `0x69` | ต่อขา AD0 เข้า GND (`0x68`) หรือ VCC (`0x69`) |
| **DS3231 RTC Real-time Clock** | DS3231 | `0x68` | นาฬิกาความเที่ยงตรงสูง พร้อม EEPROM `0x57` |
| **ADS1115 16-bit ADC** | ADS1115 | `0x48` | ต่อขา ADDR เข้า GND, VDD, SDA หรือ SCL |

---

### 6.6.2 I2C Scanner Code (โปรแกรมค้นหาแอดเดรสอุปกรณ์บนบัส I2C)

หากต่ออุปกรณ์แล้วไม่ทราบแอดเดรส ให้ใช้โค้ดสแกนเนอร์นี้เพื่อตรวจหาแอดเดรสของทุกอุปกรณ์ที่ต่ออยู่บนบัส:

```cpp
#include <Wire.h>

void setup() {
  Wire.begin(21, 22); // SDA = GPIO21, SCL = GPIO22
  Serial.begin(115200);
  while (!Serial);
  Serial.println("\n--- Scanning I2C Bus Devices ---");
}

void loop() {
  byte error, address;
  int nDevices = 0;

  for (address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0) {
      Serial.printf("[FOUND] I2C device found at address 0x%02X !\n", address);
      nDevices++;
    } else if (error == 4) {
      Serial.printf("[ERROR] Unknown error at address 0x%02X\n", address);
    }
  }

  if (nDevices == 0) Serial.println("No I2C devices found.\n");
  else Serial.printf("Scan complete. Found %d device(s).\n\n", nDevices);

  delay(5000);
}
```

---

### 6.6.3 ขั้นตอนการวิเคราะห์และแก้ไขปัญหา (Troubleshooting Checklist)

1. **หน้าจอ OLED / LCD ไม่แสดงผล:**
   - ตรวจสอบว่าแอดเดรส I2C ในโค้ดตรงกับฮาร์ดแวร์จริงหรือไม่ (รัน I2C Scanner เพื่อยืนยัน)
   - ตรวจสอบว่าต่อสลับสาย SDA (GPIO 21) และ SCL (GPIO 22) หรือไม่
   - หากเป็นจอ LCD 1602 ให้ใช้ไขควงปรับตัวต้านทานปรับค่าได้ (Contrast Trimpot) ด้านหลังโมดูล
2. **เซนเซอร์ DHT22 ขึ้นค่า `nan` (Not a Number):**
   - ตรวจสอบว่าตั้งหน่วงเวลาการอ่านค่าอย่างน้อย 2 วินาทีหรือไม่ (ห้ามอ่านถี่กว่า 0.5 Hz)
   - ตรวจสอบว่ามีตัวต้านทาน Pull-up ขนาด $4.7\text{k}\Omega - 10\text{k}\Omega$ ต่อระหว่างขา Data และ VCC หรือไม่
3. **บัส I2C ค้าง (I2C Bus Lockup):**
   - มักเกิดจากสัญญาณรบกวนเหนี่ยวนำจากโหลดเหนี่ยวนำ (เช่น รีเลย์หรือมอเตอร์)
   - แก้ไขโดยการต่อตัวต้านทาน Pull-up ขนาด $2.2\text{k}\Omega$ ขนานเพิ่มเติม และใส่ไดโอด Flyback คร่อมคอยล์รีเลย์

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## 6.7 โจทย์ท้าทายวิศวกรรม (Engineering Challenges)

### 🏆 โจทย์: ระบบควบคุมสภาวะแวดล้อมห้องทดสอบความเที่ยงตรงสูง (Industrial Environmental Chamber)

โรงงานผลิตชิ้นส่วนยานยนต์ต้องการสร้างตู้ทดสอบชิ้นงานควบคุมอุณหภูมิและความชื้น (Environmental Chamber) โดยมีข้อกำหนดการทำงานดังนี้:

#### เงื่อนไขการทำงาน (Specifications):
1. **การแสดงผลทางหน้าจอ SSD1306 OLED:**
   - บรรทัดที่ 1: ชื่อห้อง `"CHAMBER 01: ACTIVE"`
   - บรรทัดที่ 2: แสดงอุณหภูมิปัจจุบันพร้อมเกจระดับแท่ง (Bar Graph) กราฟิกแสดงสัดส่วนอุณหภูมิช่วง $20^\circ\text{C} - 50^\circ\text{C}$
   - บรรทัดที่ 3: แสดงค่าความชื้นสัมพัทธ์และความดันบรรยากาศ
   - บรรทัดที่ 4: แสดงสถานะการทำงานของระบบระบายความร้อน `COOLING: [ON/OFF]`
2. **ระบบควบคุมวงปิด (Closed-loop Control):**
   - เมื่ออุณหภูมิ $T \ge 38.0^\circ\text{C}$ ให้สั่งเปิดพัดลมระบายความร้อน (Relay ON)
   - เมื่ออุณหภูมิลดลงจนถึง $T \le 33.0^\circ\text{C}$ ให้สั่งปิดพัดลมระบายความร้อน (Relay OFF)
3. **ระบบรักษาความปลอดภัยและการเตือนภัย (Safety & Alarm Interlock):**
   - หากความดันบรรยากาศในตู้ลดต่ำกว่า $950\text{ hPa}$ (แสดงว่าตู้เกิดการรั่วไหลหรือพัดลมดูดอากาศแรงเกินไป) ให้สั่งตัดการทำงานของพัดลมทันทีเพื่อความปลอดภัย (Safety Interlock) และกะพริบไฟ LED สีแดงเตือนภัยด้วยความถี่ 2 Hz

#### สิ่งที่ต้องส่งและประเมินผล:
- [ ] แผนผังการต่อวงจรและไฟล์ `diagram.json`
- [ ] ซอร์สโค้ดภาษา C++ ที่มีฟังก์ชันคำนวณ Hysteresis และวาดแถบกราฟิก Bar Graph บน OLED
- [ ] ผลการจำลองการทำงานบน Wokwi พร้อมบันทึกภาพหน้าจอขณะระบบทำงานปกติและขณะติด Safety Interlock

</div>
