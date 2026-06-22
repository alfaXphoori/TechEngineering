# 🔬 Lab 8: การสื่อสารไร้สายด้วย BLE

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**เครื่องมือ:** ESP32 บน Wokwi Simulator + แอป nRF Connect (มือถือ)  
**ระยะเวลา:** ประมาณ 90 นาที

---

## วัตถุประสงค์

- อธิบายหลักการทำงานของ Bluetooth Low Energy (BLE) และความแตกต่างจาก Wi-Fi ได้
- ตั้งค่า ESP32 เป็น BLE Server/Peripheral และสร้าง Service/Characteristic สำหรับส่งค่าเซนเซอร์ได้
- ใช้แอป BLE Scanner (เช่น nRF Connect) บนมือถือเพื่ออ่านค่าจาก ESP32 ได้
- เปรียบเทียบข้อดี-ข้อเสียของ BLE กับ Wi-Fi ในบริบทงาน IoT ด้านพลังงานและระยะทางได้

---

## ส่วนที่ 1: ทำความเข้าใจ BLE เบื้องต้น (15 นาที)

### ความรู้พื้นฐาน

BLE (Bluetooth Low Energy) เป็นโปรโตคอลสื่อสารไร้สายที่ออกแบบมาเพื่อใช้พลังงานต่ำ เหมาะกับอุปกรณ์ IoT ที่ใช้แบตเตอรี่ โครงสร้างสำคัญมีดังนี้:

| คำศัพท์ | ความหมาย |
|---|---|
| **Peripheral (Server)** | อุปกรณ์ที่ประกาศตัว (advertise) และให้บริการข้อมูล เช่น ESP32 |
| **Central (Client)** | อุปกรณ์ที่สแกนหาและเชื่อมต่อเพื่ออ่านข้อมูล เช่น มือถือ |
| **Service** | กลุ่มของข้อมูลที่เกี่ยวข้องกัน ระบุด้วย UUID |
| **Characteristic** | หน่วยข้อมูลย่อยภายใน Service เช่น ค่าอุณหภูมิ |

### แบบฝึกหัดส่วนที่ 1

1. BLE ย่อมาจากอะไร? → ______________________________
2. ในสถาปัตยกรรม BLE อุปกรณ์ที่ประกาศตัวเองเรียกว่า ____________ ส่วนอุปกรณ์ที่สแกนหาเรียกว่า ____________
3. UUID คืออะไร ทำหน้าที่อะไรใน BLE? → ______________________________

---

## ส่วนที่ 2: สร้าง BLE Server บน ESP32 (30 นาที)

### ขั้นตอนปฏิบัติ

1. เปิด [Wokwi Simulator](https://wokwi.com/) แล้วสร้างโปรเจกต์ใหม่เลือกบอร์ด **ESP32**
2. ต่อวงจรดังนี้:
   - **Potentiometer (โพเทนชิโอมิเตอร์)** ขา signal → GPIO 34 (ADC)
   - ใช้จำลองเป็นเซนเซอร์อุณหภูมิ (แปลงค่า ADC เป็นองศา)
3. คัดลอกโค้ดด้านล่างลงใน editor ของ Wokwi:

```cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// กำหนด UUID สำหรับ Service และ Characteristic
#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "abcdefab-1234-1234-1234-abcdefabcdef"

BLECharacteristic *pCharacteristic;
bool deviceConnected = false;

const int SENSOR_PIN = 34;  // ขา ADC สำหรับอ่านค่าเซนเซอร์

// Callback เมื่อมีอุปกรณ์เชื่อมต่อ/ตัดการเชื่อมต่อ
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println(">> อุปกรณ์เชื่อมต่อแล้ว!");
  }
  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println(">> อุปกรณ์ตัดการเชื่อมต่อ");
    BLEDevice::startAdvertising();  // เริ่มประกาศตัวใหม่
  }
};

void setup() {
  Serial.begin(115200);
  Serial.println("เริ่มต้น BLE Server...");

  // 1) สร้าง BLE Device ตั้งชื่อที่จะแสดงเวลาสแกน
  BLEDevice::init("ESP32-MechEng-Lab8");

  // 2) สร้าง BLE Server
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // 3) สร้าง Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // 4) สร้าง Characteristic (อ่านได้ + แจ้งเตือนได้)
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  pCharacteristic->addDescriptor(new BLE2902());

  // 5) เริ่ม Service และ Advertising
  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  Serial.println("BLE Server พร้อมใช้งาน - รอการเชื่อมต่อ...");
}

void loop() {
  if (deviceConnected) {
    int rawValue = analogRead(SENSOR_PIN);
    // แปลง ADC (0-4095) เป็นอุณหภูมิจำลอง (0-50 °C)
    float temperature = (rawValue / 4095.0) * 50.0;

    char tempStr[10];
    snprintf(tempStr, sizeof(tempStr), "%.1f", temperature);
    pCharacteristic->setValue(tempStr);
    pCharacteristic->notify();

    Serial.printf("ส่งค่าอุณหภูมิ: %s °C (ADC: %d)\n", tempStr, rawValue);
  }
  delay(2000);  // ส่งทุก 2 วินาที
}
```

4. ตั้งค่า `diagram.json` ใน Wokwi ให้มี ESP32 + Potentiometer ต่อที่ GPIO 34
5. กด **Run** แล้วสังเกตผลใน Serial Monitor

### บันทึกผลการทดลอง

| รายการ | ผลที่สังเกตได้ |
|---|---|
| ชื่อ BLE Device ที่ตั้ง | |
| ข้อความใน Serial Monitor เมื่อเริ่มต้น | |
| ค่า UUID ของ Service | |
| ค่า UUID ของ Characteristic | |

---

## ส่วนที่ 3: อ่านค่าด้วยแอป BLE Scanner (20 นาที)

> 💡 **หมายเหตุ:** ส่วนนี้ต้องใช้บอร์ด ESP32 จริง เนื่องจาก Wokwi ยังไม่รองรับการจำลอง BLE แบบเชื่อมต่อกับมือถือได้ หากไม่มีบอร์ดจริง ให้ศึกษาขั้นตอนและตอบคำถามจากความเข้าใจ

### ขั้นตอนปฏิบัติ

1. ติดตั้งแอป **nRF Connect** (Nordic Semiconductor) บนมือถือ — มีทั้ง Android และ iOS
2. อัปโหลดโค้ดจากส่วนที่ 2 ลงบอร์ด ESP32 จริง (ถ้ามี)
3. เปิดแอป nRF Connect แล้วกด **Scan**
4. มองหาอุปกรณ์ชื่อ `ESP32-MechEng-Lab8` แล้วกด **Connect**
5. เข้าไปที่ Service UUID → กดลูกศรลงที่ Characteristic เพื่ออ่านค่า
6. กดปุ่ม Notify (ไอคอนลูกศรสามอัน) เพื่อรับค่าอัตโนมัติ
7. ลองหมุน Potentiometer/ปรับเซนเซอร์ แล้วสังเกตค่าที่เปลี่ยน

### บันทึกผลการทดลอง

| ครั้งที่ | ค่า ADC (ถ้าทราบ) | ค่าอุณหภูมิที่แสดงในแอป (°C) | หมายเหตุ |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

---

## ส่วนที่ 4: เปรียบเทียบ BLE กับ Wi-Fi (15 นาที)

### ศึกษาและกรอกตารางเปรียบเทียบ

จากความรู้ที่ได้เรียนมาและการค้นคว้าเพิ่มเติม ให้กรอกตารางต่อไปนี้:

| หัวข้อเปรียบเทียบ | BLE | Wi-Fi |
|---|---|---|
| กำลังส่ง (Transmit Power) โดยประมาณ | | |
| ระยะทางสูงสุดโดยทั่วไป | | |
| อัตราการรับส่งข้อมูล (Data Rate) | | |
| ความเหมาะสมกับอุปกรณ์แบตเตอรี่ | | |
| ตัวอย่างการใช้งานในวิศวกรรมเครื่องกล | | |

---

## ส่วนที่ 5: แบบฝึกหัดและคำถามท้ายใบงาน (10 นาที)

1. ถ้าต้องการเพิ่ม Characteristic ตัวที่ 2 สำหรับส่งค่าความชื้น จะต้องแก้ไขโค้ดส่วนใดบ้าง? อธิบายพร้อมเขียนโค้ดเพิ่มเติม

   ```
   ตอบ:


   ```

2. เพราะเหตุใด BLE จึงเหมาะกับเซนเซอร์วัดแรงสั่นสะเทือน (Vibration Sensor) ของเครื่องจักรที่ใช้แบตเตอรี่มากกว่า Wi-Fi?

   ```
   ตอบ:


   ```

3. ค่า `delay(2000)` ในโค้ดหมายความว่าอะไร? ถ้าเปลี่ยนเป็น `delay(500)` จะส่งผลอย่างไรต่อพลังงานและความถี่ในการอัปเดตข้อมูล?

   ```
   ตอบ:


   ```

4. จงยกตัวอย่างการประยุกต์ใช้ BLE ในงานวิศวกรรมเครื่องกลมา 2 ตัวอย่าง พร้อมอธิบายสั้น ๆ

   ```
   ตอบ:


   ```

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จะประกาศใน Google Classroom)**

### Checklist ก่อนส่ง

- [ ] กรอกตารางบันทึกผลการทดลองครบทุกส่วน
- [ ] ตอบคำถามท้ายใบงานครบทุกข้อ (4 ข้อ)
- [ ] แคปหน้าจอ Serial Monitor จาก Wokwi ที่แสดงค่าอุณหภูมิ
- [ ] แคปหน้าจอแอป nRF Connect ที่แสดงค่า Characteristic (ถ้าใช้บอร์ดจริง) หรือเขียนอธิบายขั้นตอนแทน
- [ ] กรอกตารางเปรียบเทียบ BLE กับ Wi-Fi ครบทุกช่อง
- [ ] ตรวจสอบชื่อ-นามสกุล และรหัสนักศึกษาถูกต้อง
