# 🔬 Lab 12: จัดเก็บข้อมูลและการแจ้งเตือนบน Blynk

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1
**แพลตฟอร์มที่ใช้:** Wokwi Simulator และ Blynk Cloud (blynk.io)

---

## 🎯 วัตถุประสงค์
1. เพื่อให้นักศึกษาสามารถส่งข้อมูลจากเซนเซอร์ขึ้นไปเก็บบันทึกบน Blynk Cloud ได้อย่างต่อเนื่อง
2. สามารถเรียกดูแนวโน้มข้อมูลย้อนหลัง (History) ผ่านวิดเจ็ต SuperChart หรือ History Graph
3. สามารถกำหนดค่า Event และ Notification (Email/Push Notification) บนเว็บคอนโซลของ Blynk
4. สามารถใช้คำสั่ง `Blynk.logEvent()` ในการเขียนโปรแกรม ESP32 เพื่อสร้างเงื่อนไขแจ้งเตือนเมื่อค่าผิดปกติ (เช่น อุณหภูมิสูงเกินกำหนด)

---

## ⏱️ ส่วนที่ 1: การเตรียม Event และ Template บน Blynk (30 นาที)

ก่อนที่จะเขียนโปรแกรมแจ้งเตือน เราจำเป็นต้องสร้าง Event ใน Blynk Template เพื่อรองรับการเรียกใช้ฟังก์ชัน `Blynk.logEvent()`

**ขั้นตอนปฏิบัติ:**
1. เข้าสู่ระบบ **Blynk.Console** (blynk.cloud)
2. ไปที่เมนู **Templates** เลือก Template ของนักศึกษาที่เคยสร้างไว้ใน Lab ที่แล้ว
3. ไปที่แท็บ **Events** คลิก **+ Edit** และเลือก **+ Add New Event**
4. กำหนดค่า Event ดังนี้:
   - **Event Name:** `high_temperature`
   - **Event Code:** `high_temp` *(สำคัญ: ต้องใช้ชื่อนี้ในโค้ด)*
   - **Type:** Warning
   - **Description:** แจ้งเตือนเมื่ออุณหภูมิสูงเกิน 35 องศาเซลเซียส
5. ในส่วนของ **Notifications** ให้เปิดใช้งาน:
   - **Send Event to Notifications tab:** เปิด
   - **Push Notifications:** เปิด (ส่งไปยัง Device Owner)
   - **Email:** เปิด (ส่งไปยัง Device Owner)
   - **Limit Period:** ตั้งค่าจำกัดการส่งเป็น 1 นาที (ป้องกันการแจ้งเตือนรัวเกินไป)
6. ไปที่แท็บ **Web Dashboard** หรือ **Mobile App** เพิ่มวิดเจ็ต **SuperChart** และผูกเข้ากับ Datastream ของอุณหภูมิและความชื้น เพื่อดูกราฟย้อนหลัง
7. กด **Save** เพื่อบันทึกการตั้งค่า Template

---

## ⏱️ ส่วนที่ 2: การเขียนโปรแกรมส่งข้อมูลและสร้างทริกเกอร์ (60 นาที)

ในส่วนนี้นักศึกษาจะได้ต่อวงจรจำลองใน **Wokwi** โดยใช้ **ESP32** ร่วมกับเซนเซอร์ **DHT22** เพื่ออ่านค่าอุณหภูมิและความชื้น จากนั้นส่งขึ้น Blynk ทุก ๆ 2 วินาที พร้อมกับการตรวจสอบเงื่อนไข หากอุณหภูมิสูงกว่า 35 องศาเซลเซียส จะสั่งให้ Blynk แจ้งเตือน

**อุปกรณ์ใน Wokwi:**
- ESP32
- เซนเซอร์ DHT22 (ต่อขา Data เข้ากับ GPIO 15 ของ ESP32)

**โค้ดโปรแกรม:**

```cpp
/* 
 * Lab 12: Blynk Data Storage and Notifications
 * Board: ESP32
 * Sensor: DHT22
 */

// แทนที่ด้วยข้อมูลจาก Blynk Console (Device Info)
#define BLYNK_TEMPLATE_ID "TMPLxxxxxx"
#define BLYNK_TEMPLATE_NAME "MechEng IoT Lab"
#define BLYNK_AUTH_TOKEN "Your_Blynk_Auth_Token"

// ตั้งค่าให้แสดง Log ใน Serial Monitor
#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>
#include <DHT.h>

// ข้อมูล WiFi สำหรับ Wokwi
char ssid[] = "Wokwi-GUEST";
char pass[] = "";

// กำหนดขาและชนิดของ DHT Sensor
#define DHTPIN 15
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);
BlynkTimer timer;

// ตัวแปรสำหรับเช็คสถานะเพื่อไม่ให้แจ้งเตือนซ้ำซ้อนติดๆ กัน
bool isHighTempAlerted = false;

// ฟังก์ชันสำหรับอ่านค่าเซนเซอร์และส่งขึ้น Blynk
void sendSensorData() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // ส่งข้อมูลไปที่ Virtual Pin (สมมติ V0=อุณหภูมิ, V1=ความชื้น)
  Blynk.virtualWrite(V0, t);
  Blynk.virtualWrite(V1, h);
  
  Serial.print("Temp: ");
  Serial.print(t);
  Serial.print(" C, Humidity: ");
  Serial.print(h);
  Serial.println(" %");

  // ตรวจสอบเงื่อนไขสำหรับการแจ้งเตือน (Event Trigger)
  if (t > 35.0) {
    if (!isHighTempAlerted) {
      Serial.println("⚠️ อุณหภูมิสูงผิดปกติ! ส่งการแจ้งเตือน...");
      // เรียกใช้ Event ที่ตั้งค่าไว้ใน Blynk Console
      // อาร์กิวเมนต์ที่ 1 คือ Event Code, อาร์กิวเมนต์ที่ 2 คือข้อความเพิ่มเติม
      Blynk.logEvent("high_temp", String("อุณหภูมิขณะนี้: " + String(t) + " C"));
      isHighTempAlerted = true; // ล็อกสถานะไว้
    }
  } else {
    // รีเซ็ตสถานะเมื่ออุณหภูมิกลับมาเป็นปกติ ต่ำกว่าหรือเท่ากับ 35.0
    if (isHighTempAlerted) {
      Serial.println("✅ อุณหภูมิกลับสู่สภาวะปกติ");
      isHighTempAlerted = false;
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Starting Blynk IoT Lab...");

  dht.begin();
  
  // เชื่อมต่อ Blynk ผ่าน WiFi
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);

  // ตั้งเวลาให้เรียกฟังก์ชัน sendSensorData ทุกๆ 2000 มิลลิวินาที (2 วินาที)
  timer.setInterval(2000L, sendSensorData);
}

void loop() {
  Blynk.run();
  timer.run();
}
```

**การทดสอบการทำงาน:**
1. นำโค้ดด้านบนไปใส่ใน Wokwi
2. ใส่ `BLYNK_TEMPLATE_ID`, `BLYNK_TEMPLATE_NAME` และ `BLYNK_AUTH_TOKEN` ของนักศึกษา
3. กด Run Simulation
4. คลิกที่ตัวเซนเซอร์ DHT22 ใน Wokwi แล้วลองปรับแถบเลื่อนอุณหภูมิ (Temperature slider) ให้เกิน 35°C
5. สังเกตที่ Serial Monitor และตรวจสอบในมือถือ (Blynk App) หรืออีเมล ว่าได้รับการแจ้งเตือนหรือไม่
6. ดูหน้า Dashboard ของ Blynk เพื่อสังเกตกราฟเส้นที่บันทึกข้อมูลอย่างต่อเนื่อง

---

## ⏱️ ส่วนที่ 3: ตารางออกแบบกฎการแจ้งเตือน (Alert Rules) (20 นาที)

ในฐานะวิศวกรเครื่องกล การกำหนดเกณฑ์แจ้งเตือนต้องสอดคล้องกับความปลอดภัยของระบบ ให้นักศึกษาออกแบบเงื่อนไขจำลองสำหรับการเฝ้าระวังเครื่องจักร โดยเติมข้อมูลลงในตารางด้านล่างให้สมบูรณ์

| ลำดับ | พารามิเตอร์ที่ตรวจจับ | เงื่อนไข (Condition) | ระดับความรุนแรง (Level) | ช่องทางการแจ้งเตือนหลัก | การดำเนินการ (Action) |
| :---: | :--- | :--- | :---: | :--- | :--- |
| 1 | อุณหภูมิของมอเตอร์ | T > 35°C | Warning | Push Notification | ตรวจสอบระบบระบายความร้อน |
| 2 | อุณหภูมิของมอเตอร์ | T > 80°C | Critical | Email & Push Notification | ........................................................ |
| 3 | ................................... | ................................... | .......................... | ................................... | ........................................................ |
| 4 | ................................... | ................................... | .......................... | ................................... | ........................................................ |

---

## 📝 คำถามท้ายการทดลอง
1. คำสั่ง `Blynk.logEvent("event_code", "description");` มีหน้าที่อะไร และ "event_code" นำมาจากส่วนใดของ Blynk Console?
2. เพราะเหตุใดในโปรแกรมจึงต้องมีการใช้ตัวแปร `isHighTempAlerted` ร่วมกับเงื่อนไข `if (!isHighTempAlerted)` ก่อนส่งการแจ้งเตือน?
3. หากนักศึกษาต้องการให้ส่งการแจ้งเตือนอีกครั้ง (ส่งซ้ำ) หากอุณหภูมิยังคงสูงต่อเนื่องเกิน 5 นาที จะต้องปรับปรุงแนวคิดของโค้ดในฟังก์ชัน `sendSensorData` อย่างไร? (อธิบายเชิงตรรกะ)
4. วิดเจ็ต SuperChart มีความสำคัญอย่างไรในการวิเคราะห์ข้อมูลทางวิศวกรรม?

---

## 📥 การส่งงาน

> 📋 **Google Form:** [ลิงก์สำหรับส่งงาน Lab 12] (รอรับลิงก์จากอาจารย์ผู้สอน)

### Checklist ก่อนส่งงาน
- [ ] ทดสอบส่งข้อมูลขึ้น Blynk เรียบร้อยและมีข้อมูลกราฟโชว์บน SuperChart
- [ ] ทดสอบปรับค่าเซนเซอร์จำลองให้เกินเกณฑ์ที่กำหนด และได้รับการแจ้งเตือนผ่าน Email หรือ Mobile App สำเร็จ
- [ ] แคปเจอร์หน้าจอ (Screenshot) มือถือหรืออีเมลที่ได้รับการแจ้งเตือน
- [ ] แคปเจอร์หน้าจอกราฟ SuperChart ที่แสดงการเปลี่ยนแปลงของอุณหภูมิและความชื้น
- [ ] ตอบคำถามท้ายการทดลองและเติมข้อมูลในตารางออกแบบกฎแจ้งเตือนครบถ้วน
- [ ] รวบรวมรูปภาพ โค้ด และคำตอบจัดทำเป็นไฟล์ PDF เดียวกันเพื่ออัปโหลดลง Google Form
