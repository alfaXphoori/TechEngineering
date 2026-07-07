# Chapter 6: การแสดงผลและการอ่านค่าเซนเซอร์ด้วยโปรโตคอลสื่อสาร
## Display & Sensor Interfacing (I2C, SPI, UART, OLED, LCD, Dot Matrix, Seven Segment, DHT22, BMP280)

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

จอแสดงผลเป็นองค์ประกอบหลักในระบบปฏิสัมพันธ์ระหว่างมนุษย์กับเครื่องจักร (Human-Machine Interface: HMI) ระดับอุปกรณ์ ช่วยให้อุปกรณ์ไอโอทีสามารถรายงานสถานะ ตัวแปรทางวิศวกรรม หรือข้อความเตือนภัยได้ทันทีโดยไม่ต้องผ่านคลาวด์แดชบอร์ด

### 6.2.1 ตารางเปรียบเทียบโมดูลจอแสดงผลแต่ละประเภท

| โมดูลจอแสดงผล | ประเภทตัวแสดงผล | อินเตอร์เฟส/โปรโตคอล | แรงดันไฟฟ้า (V) | จุดเด่น |
| :--- | :--- | :--- | :--- | :--- |
| **LCD 1602** | ตัวอักษร (16 ตัว x 2 บรรทัด) | I2C (ผ่านบอร์ดแปลง) / Parallel | 5V | ราคาประหยัด อ่านง่ายในที่สว่าง |
| **LCD 2004** | ตัวอักษร (20 ตัว x 4 บรรทัด) | I2C (ผ่านบอร์ดแปลง) / Parallel | 5V | แสดงผลข้อมูลข้อความ/ตัวเลขได้มากบรรทัด |
| **SSD1306 OLED** | กราฟิกสีเดียว (128x64 พิกเซล) | I2C / SPI | 3.3V - 5V | คอนทราสต์สูงมาก คมชัดสูง ปิดพิกเซลสีดำสนิท |
| **SH1107 OLED** | กราฟิกสีเดียว (128x128 พิกเซล) | I2C / SPI | 3.3V - 5V | พื้นที่แสดงผลรูปสี่เหลี่ยมจัตุรัสขนาดใหญ่ขึ้น |
| **MAX7219 Dot Matrix** | ไฟ LED 8x8 ต่อพ่วงได้ | SPI | 5V | มองเห็นได้จากระยะไกล ทำข้อความวิ่งได้ง่าย |
| **Seven Segment (1-4 Digits)** | ตัวเลข 7 ส่วน (แบบต่อตรง) | Parallel GPIO (Direct Drive) | 3.3V - 5V | ความหน่วงต่ำมาก ตัวเลขสว่างชัดเจน |
| **TM1637 Seven Segment** | ตัวเลข 7 ส่วน 4 หลัก (มีชิปขับ) | 2-Wire Serial (CLK, DIO) | 3.3V - 5V | ใช้ GPIO เพียง 2 ขา มีวงจรควบคุมกระแสในตัว |

---

### 6.2.2 รายละเอียดและการต่อใช้งานของหน้าจอแต่ละประเภท

#### 1) LCD 1602 (Liquid Crystal Display 16x2)
หน้าจอ LCD ยอดนิยม แสดงผลเฉพาะตัวอักษรและสัญลักษณ์ทั่วไปจำนวน 2 บรรทัด บรรทัดละ 16 ตัวอักษร เมื่อติดตั้งโมดูลแปลง I2C Backpack (ชิป PCF8574) จะทำให้เชื่อมต่อสายสัญญาณเพียง 4 เส้น
*   **การเชื่อมต่อ:** VCC (5V), GND, SDA, SCL
*   **ตัวอย่างโค้ด (LiquidCrystal_I2C Library):**
    ```cpp
    #include <Wire.h>
    #include <LiquidCrystal_I2C.h>

    LiquidCrystal_I2C lcd(0x27, 16, 2); // แอดเดรส I2C 0x27

    void setup() {
      lcd.init();
      lcd.backlight();
      lcd.setCursor(0, 0);
      lcd.print("IoT Engineering");
      lcd.setCursor(0, 1);
      lcd.print("Temp: 25.4 C");
    }
    void loop() {}
    ```

#### 2) LCD 2004 (Liquid Crystal Display 20x4)
หน้าจอ LCD ขนาดใหญ่ขึ้น แสดงผลได้ 4 บรรทัด บรรทัดละ 20 ตัวอักษร เหมาะสำหรับการมอนิเตอร์ตัวแปรวิศวกรรมหลายตัวพร้อมกัน เช่น การแสดงค่าเซนเซอร์อุณหภูมิ ความชื้น ความดัน และสถานะโหลดไปพร้อมกัน
*   **การเชื่อมต่อ:** VCC (5V), GND, SDA, SCL
*   **ตัวอย่างโค้ด (LiquidCrystal_I2C Library):**
    ```cpp
    #include <Wire.h>
    #include <LiquidCrystal_I2C.h>

    LiquidCrystal_I2C lcd(0x27, 20, 4); // แอดเดรส I2C 0x27 ขนาด 20x4

    void setup() {
      lcd.init();
      lcd.backlight();
      lcd.setCursor(0, 0);
      lcd.print("BOILER MONITOR SYSTEM");
      lcd.setCursor(0, 1);
      lcd.print("Temp: 28.5 C");
      lcd.setCursor(0, 2);
      lcd.print("Pres: 1.01 atm");
      lcd.setCursor(0, 3);
      lcd.print("Pump Status: RUNNING");
    }
    void loop() {}
    ```

#### 3) SSD1306 OLED (Monochrome 128x64 OLED)
จอภาพเทคโนโลยี OLED แสดงผลกราฟิกและอักษรสีเดียวขนาด 0.96 นิ้ว มีความละเอียด 128x64 พิกเซล เปล่งแสงได้เองโดยไม่ต้องมีไฟหลัง (Backlight) คอนทราสต์สูงและประหยัดพลังงาน
*   **การเชื่อมต่อ:** VCC (3.3V/5V), GND, SDA, SCL
*   **ตัวอย่างโค้ด (Adafruit SSD1306 Library):**
    ```cpp
    #include <Wire.h>
    #include <Adafruit_GFX.h>
    #include <Adafruit_SSD1306.h>

    #define SCREEN_WIDTH 128
    #define SCREEN_HEIGHT 64
    Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

    void setup() {
      display.begin(SSD1306_SWITCHCAPVCC, 0x3C); // แอดเดรส I2C 0x3C
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SSD1306_WHITE);
      display.setCursor(0, 10);
      display.println("SSD1306 OLED 128x64");
      display.display();
    }
    void loop() {}
    ```

#### 4) SH1107 OLED (Monochrome 128x128 OLED)
หน้าจอ OLED ที่ใช้ตัวชิปขับคุมรุ่น SH1107 ให้ความละเอียดสูงในระดับสี่เหลี่ยมจัตุรัส 128x128 พิกเซล ช่วยเพิ่มเนื้อหาพื้นที่แสดงผลเชิงกราฟิก เส้นกราฟวิเคราะห์แนวโน้ม หรือไอคอนเมนูสั่งงาน
*   **การเชื่อมต่อ:** VCC (3.3V/5V), GND, SDA, SCL
*   **ตัวอย่างโค้ด (Adafruit SH110X Library):**
    ```cpp
    #include <Wire.h>
    #include <Adafruit_GFX.h>
    #include <Adafruit_SH110X.h>

    #define SCREEN_WIDTH 128
    #define SCREEN_HEIGHT 128
    Adafruit_SH1107 display = Adafruit_SH1107(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

    void setup() {
      display.begin(0x3C, true); // แอดเดรส I2C 0x3C
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(0, 10);
      display.println("SH1107 OLED 128x128");
      display.display();
    }
    void loop() {}
    ```

#### 5) MAX7219 LED Dot Matrix
โมดูลแสดงผลแบบจุดต่อพ่วงไฟ LED ขนาด 8x8 จุด ควบคุมผ่านชิปขับ MAX7219 โดยส่งข้อมูลทางโปรโตคอล SPI ใช้สำหรับการแสดงผลข้อความ ตัวเลข หรือกราฟิกขนาดใหญ่มองเห็นระยะไกล สามารถนำมาเชื่อมต่ออนุกรม (Cascade/Daisy-chain) ร่วมกันหลายโมดูลได้
*   **การเชื่อมต่อ:** VCC (5V), GND, DIN (Data Input), CS (Chip Select), CLK (Clock Input)
*   **ตัวอย่างโค้ด (LedControl Library):**
    ```cpp
    #include "LedControl.h"

    // พิน DIN->12, CLK->11, CS->10, จำนวน 1 โมดูล
    LedControl lc = LedControl(12, 11, 10, 1);

    void setup() {
      lc.shutdown(0, false);       // เปิดการทำงานโมดูลที่ 0
      lc.setIntensity(0, 8);       // กำหนดความสว่าง (0-15)
      lc.clearDisplay(0);          // เคลียร์จอภาพ
      
      // แสดงอักษร 'E' บน Dot Matrix
      byte charE[8] = {0xFF,0x80,0x80,0xF8,0x80,0x80,0xFF,0x00};
      for(int i=0; i<8; i++) {
        lc.setRow(0, i, charE[i]);
      }
    }
    void loop() {}
    ```

#### 6) Seven Segment Display (ต่อตรง 1 - 4 หลัก)
อุปกรณ์แสดงผลตัวเลข 7 ส่วนดั้งเดิม ใช้การเปิด-ปิดหลอดไฟ LED แต่ละส่วน (a ถึง g และจุด dp) หากมีหลายหลัก (เช่น 4 หลัก) จะต้องทำการสแกนสลับหลักอย่างรวดเร็ว (Multiplexing) เพื่อคงแสงที่มองเห็นด้วยตาเปล่าโดยประหยัดการเชื่อมต่อ GPIO
*   **การเชื่อมต่อ:** ต่อเข้ากับ GPIO ของ MCU โดยตรงผ่านตัวต้านทานจำกัดกระแส (ปกติใช้สาย 8 ถึง 12 เส้น)
*   **ตัวอย่างโค้ด (SevSeg Library สำหรับแสดงเลข 4 หลัก):**
    ```cpp
    #include "SevSeg.h"
    SevSeg sevseg;

    void setup() {
      byte numDigits = 4;
      byte digitPins[] = {2, 3, 4, 5};             // พินควบคุมแต่ละหลัก
      byte segmentPins[] = {6, 7, 8, 9, 10, 11, 12, 13}; // พิน a,b,c,d,e,f,g,dp
      
      sevseg.begin(COMMON_ANODE, numDigits, digitPins, segmentPins);
      sevseg.setBrightness(90);
    }
    
    void loop() {
      sevseg.setNumber(2026, 0); // แสดงตัวเลข 2026
      sevseg.refreshDisplay();   // ต้องเรียกทำงานลูปแสดงผลอย่างต่อเนื่อง
    }
    ```

#### 7) TM1637 Seven Segment Display
โมดูลตัวแสดงเลข 7 ส่วน 4 หลัก สำเร็จรูปที่ติดตั้งชิปขับไดรเวอร์ TM1637 ช่วยลดพอร์ตเชื่อมต่อ GPIO เหลือเพียงสายส่งสัญญาณข้อมูล 2 เส้น มีวงจรควบคุมความสว่างและสลับเฟรมให้เสร็จสรรพ
*   **การเชื่อมต่อ:** VCC (3.3V/5V), GND, CLK, DIO
*   **ตัวอย่างโค้ด (TM1637Display Library):**
    ```cpp
    #include <TM1637Display.h>

    #define CLK 2
    #define DIO 3
    TM1637Display display(CLK, DIO);

    void setup() {
      display.setBrightness(0x0f); // ความสว่างสูงสุด
      
      // แสดงผลคำว่า "PLAY" ผ่านเซกเมนต์
      uint8_t play[] = {
        0x73, // P
        0x38, // L
        0x77, // A
        0x6e  // Y
      };
      display.setSegments(play);
    }
    void loop() {}
    ```

---

## 6.3 การอ่านค่าเซนเซอร์แบบสื่อสารโปรโตคอล (Sensor Communication)

### 6.3.1 เซนเซอร์อุณหภูมิและความชื้น DHT22
DHT22 เป็นเซนเซอร์วัดอุณหภูมิและความชื้นแบบดิจิทัลที่ใช้สายสัญญาณส่งข้อมูลเส้นเดียว (Single-Bus Custom Protocol) มีการส่งสัญญาณแบบเฟรมข้อมูลความยาว 40 บิต ช่วยลดการรบกวนสัญญาณในระยะสายส่งข้อมูลยาว
*   **การเชื่อมต่อ:** VCC (3.3V/5V), GND, SDA/DATA (เชื่อมเข้ากับขา GPIO ของ MCU เช่น Pin 23)
*   **ตัวอย่างโค้ด (DHT sensor library):**
    ```cpp
    #include <DHT.h>

    #define DHTPIN 23       // ขาสัญญาณ Data ของ DHT22 ต่อเข้ากับ GPIO23
    #define DHTTYPE DHT22   // ชนิดเซนเซอร์ DHT22

    DHT dht(DHTPIN, DHTTYPE);

    void setup() {
      Serial.begin(115200);
      Serial.println(F("DHT22 Temperature & Humidity Sensor Test"));
      dht.begin(); // เริ่มต้นทำงานเซนเซอร์
    }

    void loop() {
      delay(2000); // พักการทำงาน 2 วินาที (เซนเซอร์ต้องการคาบเวลาการอ่านห่างอย่างน้อย 2 วินาที)

      float h = dht.readHumidity();    // อ่านค่าความชื้นสัมพัทธ์ (%)
      float t = dht.readTemperature(); // อ่านค่าอุณหภูมิ (องศาเซลเซียส)

      // ตรวจสอบความถูกต้องของการอ่านค่า (หากอ่านไม่ได้ค่าจะเป็น NaN)
      if (isnan(h) || isnan(t)) {
        Serial.println(F("Failed to read from DHT sensor!"));
        return;
      }

      Serial.print(F("Humidity: "));
      Serial.print(h);
      Serial.print(F(" %t | Temperature: "));
      Serial.print(t);
      Serial.println(F(" *C"));
    }
    ```

### 6.3.2 เซนเซอร์วัดความดันอากาศและอุณหภูมิ BMP280
BMP280 เป็นเซนเซอร์วัดความกดอากาศและอุณหภูมิที่มีความแม่นยำสูง ออกแบบโดย Bosch สื่อสารผ่านโปรโตคอล I2C หรือ SPI นิยมนำไปใช้ในงานวัดความกดอากาศเพื่อระบุระดับความสูง (Altitude/Altimeter) หรือระบบควบคุมสิ่งแวดล้อมทางวิศวกรรม
*   **การเชื่อมต่อ (I2C):** VCC (3.3V/5V), GND, SDA (เชื่อมกับขา SDA ของ MCU เช่น Pin 21), SCL (เชื่อมกับขา SCL ของ MCU เช่น Pin 22)
*   **ตัวอย่างโค้ด (Adafruit BMP280 Library):**
    ```cpp
    #include <Wire.h>
    #include <Adafruit_BMP280.h>

    // ประกาศออบเจกต์ BMP280 แบบสื่อสาร I2C
    Adafruit_BMP280 bmp;

    void setup() {
      Serial.begin(115200);
      Serial.println(F("BMP280 Pressure & Temperature Sensor Test"));

      // เริ่มต้นทำงานเซนเซอร์ด้วยแอดเดรส I2C 0x76 (หรือ 0x77 ขึ้นอยู่กับฮาร์ดแวร์โมดูล)
      if (!bmp.begin(0x76)) {
        Serial.println(F("Could not find a valid BMP280 sensor, check wiring!"));
        while (1);
      }

      /* การกำหนดโหมด Over-sampling และตัวกรองความถี่ต่ำเพื่อลดสัญญาณรบกวน */
      bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* โหมดการทำงาน */
                      Adafruit_BMP280::SAMPLING_X2,     /* ค่าโอเวอร์แซมป์อุณหภูมิ */
                      Adafruit_BMP280::SAMPLING_X16,    /* ค่าโอเวอร์แซมป์ความดัน */
                      Adafruit_BMP280::FILTER_X16,      /* ตัวกรองค่ารบกวน (IIR Filter) */
                      Adafruit_BMP280::STANDBY_MS_500); /* ระยะเวลารอบสแตนด์บาย */
    }

    void loop() {
      float temp = bmp.readTemperature(); // อ่านค่าอุณหภูมิ (°C)
      float pressure = bmp.readPressure(); // อ่านค่าความดันบรรยากาศ (Pa)
      
      // คำนวณความสูงสัมพัทธ์โดยเทียบกับระดับความดันมาตรฐานที่ระดับน้ำทะเล 1013.25 hPa
      float altitude = bmp.readAltitude(1013.25);

      Serial.print(F("Temperature = "));
      Serial.print(temp);
      Serial.println(F(" *C"));

      Serial.print(F("Pressure = "));
      Serial.print(pressure / 100.0F); // แปลงหน่วยจาก Pascal เป็น hPascal (hPa)
      Serial.println(F(" hPa"));

      Serial.print(F("Approx altitude = "));
      Serial.print(altitude);
      Serial.println(F(" m"));
      Serial.println("--------------------");

      delay(2000);
    }
    ```

---

## 6.4 ใบงานปฏิบัติการ: ระบบควบคุมอัตโนมัติแสดงผลด้วย OLED
ออกแบบระบบควบคุมสภาพแวดล้อมโดยการจำลองการทำงานบน Wokwi:
- **โจทย์:** อ่านค่าอุณหภูมิและความชื้นจาก **DHT22** หากอุณหภูมิสูงกว่า **30°C** ให้สั่งงาน **Relay** เพื่อเปิดพัดลมระบายความร้อน พร้อมแสดงผลสถานะอุณหภูมิและข้อความการทำงานบน **OLED Display**
