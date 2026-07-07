# Chapter 6: การแสดงผลและการอ่านค่าเซนเซอร์ด้วยโปรโตคอลสื่อสาร
## Display & Sensor Interfacing (I2C, SPI, UART, OLED, LCD, DHT22, BMP280)

---

## 6.1 โปรโตคอลการสื่อสารอนุกรมภายในบอร์ด (On-board Serial Communication Protocols)

ในการพัฒนาวิศวกรรมไอโอที นอกเหนือจากการขับสัญญาณผ่านขา Digital I/O แบบตรง ๆ แล้ว การติดต่อสื่อสารกับเซนเซอร์อัจฉริยะ (Smart Sensors) และจอแสดงผล (Displays) จำเป็นต้องอาศัยโปรโตคอลสื่อสารอนุกรม เพื่อลดจำนวนสายสัญญาณและรองรับการรับส่งข้อมูลที่มีความซับซ้อน

### 6.1.1 เปรียบเทียบ I2C, SPI และ UART

| คุณลักษณะ | UART (Universal Asynchronous Receiver-Transmitter) | I2C (Inter-Integrated Circuit) | SPI (Serial Peripheral Interface) |
|---|---|---|---|
| **ประเภทการเชื่อมต่อ** | Point-to-Point (ต่อตรง 2 อุปกรณ์) | Multi-Master / Multi-Slave (บัสร่วม) | Single-Master / Multi-Slave |
| **สายสัญญาณที่ใช้** | **2 เส้น** (TX, RX) + GND | **2 เส้น** (SDA, SCL) + GND | **4 เส้น** (MOSI, MISO, SCK, CS) + GND |
| **สัญญาณนาฬิกา** | Asynchronous (ไม่มีสาย Clock, อ้างอิง Baud Rate) | Synchronous (ใช้สาย SCL) | Synchronous (ใช้สาย SCK) |
| **ความเร็วการรับส่ง** | ต่ำ (ปกติ 9600 bps - 115200 bps) | ปานกลาง (100 kbps - 400 kbps สูงสุด 3.4 Mbps) | สูงมาก (10 Mbps - 100 Mbps+) |
| **การรับส่งข้อมูล** | Full Duplex | Half Duplex | Full Duplex |
| **ตัวอย่างการใช้งาน** | การโปรแกรมบอร์ด, GPS Module, Bluetooth HC-05 | จอ OLED/LCD, เซนเซอร์ BMP280/MPU6050 | จอสี TFT, โมดูล SD Card, โมดูล RFID RC522 |

---

## 6.2 การแสดงผลข้อมูลด้วยหน้าจอแสดงผล (Display Interfacing)

จอภาพมีบทบาทสำคัญอย่างมากในระบบ HMI (Human-Machine Interface) ระดับอุปกรณ์ เพื่อใช้ในการแสดงผลสถานะการทำงาน อุณหภูมิ ข้อความแจ้งเตือน หรือค่าการปรับปรุงตำแหน่งของระบบวิศวกรรม

### 6.2.1 หน้าจอ OLED SSD1306 (I2C)
หน้าจอแสดงผลแบบ OLED (Organic Light-Emitting Diode) ขนาด 0.96 นิ้ว ความละเอียด 128x64 พิกเซล นิยมใช้อย่างแพร่หลายเนื่องจากใช้สายสัญญาณ I2C เพียง 2 เส้นหลัก และกินพลังงานต่ำมากเนื่องจากเม็ดพิกเซลจะเปล่งแสงได้เองโดยไม่ต้องมีไฟ Backlight

```cpp
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128 // ความกว้างจอพิกเซล
#define SCREEN_HEIGHT 64 // ความสูงจอพิกเซล

// ประกาศออบเจกต์หน้าจอเชื่อมต่อผ่าน I2C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setup() {
  Serial.begin(115200);
  
  // เริ่มต้นหน้าจอที่แอดเดรส I2C 0x3C
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  
  display.clearDisplay(); // เคลียร์หน้าจอ
  display.setTextSize(1); // กำหนดขนาดตัวอักษร
  display.setTextColor(SSD1306_WHITE); // สีตัวอักษร
  display.setCursor(0, 10); // ตั้งตำแหน่งเคอร์เซอร์ (x, y)
  display.println("IoT Engineering");
  display.display(); // แสดงผลบนหน้าจอจริง
}

void loop() {
  // รันโค้ดแสดงผลแบบเรียลไทม์
}
```

---

## 6.3 การอ่านค่าเซนเซอร์แบบสื่อสารโปรโตคอล (Sensor Communication)

### 6.3.1 เซนเซอร์อุณหภูมิและความชื้น DHT22
DHT22 เป็นเซนเซอร์วัดอุณหภูมิและความชื้นแบบสายสัญญาณเส้นเดียว (Single-Bus Custom Protocol) ที่ส่งสัญญาณแบบดิจิทัลเพื่อป้องกันการรบกวนสัญญาณในระยะสายทางไกล

### 6.3.2 เซนเซอร์วัดความดันอากาศและอุณหภูมิ BMP280
BMP280 เป็นเซนเซอร์ความแม่นยำสูง วัดความดันบรรยากาศและอุณหภูมิ เชื่อมต่อผ่าน I2C/SPI นิยมนำมาใช้ในการคำนวณความสูง (Altitude) และตรวจจับสภาพแวดล้อมทางวิศวกรรม

---

## 6.4 ใบงานปฏิบัติการ: ระบบควบคุมอัตโนมัติแสดงผลด้วย OLED
ออกแบบระบบควบคุมสภาพแวดล้อมโดยการจำลองการทำงานบน Wokwi:
- **โจทย์:** อ่านค่าอุณหภูมิและความชื้นจาก **DHT22** หากอุณหภูมิสูงกว่า **30°C** ให้สั่งงาน **Relay** เพื่อเปิดพัดลมระบายความร้อน พร้อมแสดงผลสถานะอุณหภูมิและข้อความการทำงานบน **OLED Display**
