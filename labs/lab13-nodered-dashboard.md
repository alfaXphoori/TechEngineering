# 🔬 Lab 13: แดชบอร์ดด้วย Node-RED

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**เครื่องมือ:** Wokwi Simulator + Node-RED (localhost หรือ Cloud) + HiveMQ  
**เวลา:** 3 ชั่วโมง

---

## วัตถุประสงค์

- อธิบายหลักการ Flow-Based Programming ของ Node-RED และบทบาทของ `msg.payload` ได้
- เขียนโปรแกรม ESP32 บน Wokwi ส่งข้อมูล JSON ผ่าน MQTT ได้
- สร้าง Flow ใน Node-RED เชื่อม `mqtt in` → `json` → `function` → `ui_gauge` / `ui_chart` ได้
- เขียน JavaScript ในโหนด `function` เพื่อคัดกรองและแปลงข้อมูลได้
- ออกแบบหน้าแดชบอร์ด Node-RED พร้อม Tab/Group/Widget ได้

---

## ส่วนที่ 1: ติดตั้ง Node-RED Dashboard และทำความเข้าใจโครงสร้าง (20 นาที)

### ความรู้เบื้องต้น

**Node-RED** ใช้แนวคิด **Flow-Based Programming** — โปรแกรมสร้างจากโหนด (Node) ที่เชื่อมกันด้วยเส้น (Wire) ข้อมูลไหลผ่านเส้นในรูปแบบวัตถุ JavaScript ที่เรียกว่า **Message Object (`msg`)** โดยค่าหลักอยู่ใน `msg.payload`

Node-RED มีโหนด 3 ประเภท:

| ประเภท | ตัวอย่างโหนด | หน้าที่ |
|:---|:---|:---|
| **Input** | `mqtt in`, `inject` | รับข้อมูลจากภายนอก ส่งเข้าโฟลว์ |
| **Processing** | `function`, `json`, `change`, `switch` | ประมวลผล แปลง หรือกรองข้อมูล |
| **Output** | `mqtt out`, `debug`, `ui_gauge`, `ui_chart` | ส่งข้อมูลออก หรือแสดงผล |

โครงสร้าง Dashboard ของ `node-red-dashboard`:
- **Tab** — หน้าหลัก เช่น "ห้องเครื่อง" และ "สิ่งแวดล้อม"
- **Group** — กลุ่ม Widget ภายใน Tab เช่น "เซนเซอร์อุณหภูมิ"
- **Widget** — ชิ้นส่วนแสดงผล เช่น Gauge, Chart, Text

### ขั้นตอนปฏิบัติ

1. เปิด Node-RED (`node-red` ใน Terminal หรือผ่านระบบ Cloud ตามที่อาจารย์กำหนด)
2. เข้าหน้า Editor: `http://localhost:1880`
3. เมนู (ขีดสามขีด มุมขวาบน) → **Manage palette** → แท็บ **Install**
4. ค้นหา `node-red-dashboard` → กด **Install** → รอจนเสร็จ
5. ตรวจสอบว่าแถบซ้ายมือมีหมวด **dashboard** เพิ่มมาแล้ว

### ตารางบันทึกผล — ส่วนที่ 1

| รายการ | สถานะ |
|:---|:---|
| Node-RED เปิดใช้ได้ที่ localhost:1880 | ________ |
| node-red-dashboard ติดตั้งสำเร็จ | ________ |
| เห็นหมวด dashboard ในแถบโหนดซ้ายมือ | ________ |

---

## ส่วนที่ 2: ตั้งค่า ESP32 บน Wokwi ให้ส่งข้อมูล JSON (45 นาที)

### ความรู้เบื้องต้น

ESP32 จะส่งข้อมูลเซนเซอร์เป็น **JSON (JavaScript Object Notation)** เพราะ JSON อ่านง่ายทั้งสำหรับคนและเครื่อง โครงสร้างง่าย ๆ:

```json
{"temp": 32.5, "hum": 65.2}
```

เมื่อ Node-RED รับข้อมูลนี้ผ่าน `mqtt in` ค่าจะเป็นสตริงก่อน (`msg.payload = '{"temp":32.5,"hum":65.2}'`) — โหนด `json` จะแปลงสตริงนี้เป็น JavaScript Object ทำให้เข้าถึงค่าได้ด้วย `msg.payload.temp` และ `msg.payload.hum`

เซนเซอร์ DHT22 วัดอุณหภูมิและความชื้นสัมพัทธ์ ใช้โปรโตคอล One-Wire ส่งข้อมูล 40 บิตต่อรอบ (16 บิตความชื้น + 16 บิตอุณหภูมิ + 8 บิต checksum)

### ขั้นตอนปฏิบัติ

**ต่อวงจร:**

| อุปกรณ์ | ขา ESP32 |
|:---|:---|
| DHT22 ขา VCC | 3.3V |
| DHT22 ขา GND | GND |
| DHT22 ขา DATA | GPIO 15 |

เพิ่มไลบรารีใน Wokwi Library Manager: **`PubSubClient`** และ **`DHT sensor library`**

เขียนโค้ดในไฟล์ `sketch.ino`:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

const char* ssid        = "Wokwi-GUEST";
const char* password    = "";
const char* mqtt_server = "broker.hivemq.com";

// เปลี่ยน YOUR_STUDENT_ID เป็นรหัสนักศึกษาจริง
const char* mqtt_topic = "ksumech/lab13/YOUR_STUDENT_ID/data";

#define DHTPIN  15
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);
WiFiClient   espClient;
PubSubClient client(espClient);

void reconnect() {
  while (!client.connected()) {
    Serial.print("MQTT connecting...");
    String clientId = "ESP32-Lab13-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected!");
    } else {
      Serial.printf("failed (rc=%d), retry in 5s\n", client.state());
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  Serial.print("Wi-Fi connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected! IP: " + WiFi.localIP().toString());

  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  static unsigned long lastSend = 0;
  if (millis() - lastSend >= 5000) {
    lastSend = millis();

    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (!isnan(t) && !isnan(h)) {
      // สร้าง JSON payload ด้วย snprintf (ปลอดภัยกว่า String concatenation)
      char payload[64];
      snprintf(payload, sizeof(payload),
               "{\"temp\":%.1f,\"hum\":%.1f}", t, h);

      bool ok = client.publish(mqtt_topic, payload);
      Serial.printf("Publish [%s]: %s (%s)\n",
                    mqtt_topic, payload, ok ? "OK" : "FAIL");
    } else {
      Serial.println("DHT อ่านค่าไม่ได้ (NaN) — ตรวจสอบการต่อวงจร");
    }
  }
}
```

กด **Start Simulation** → Serial Monitor ควรแสดง:
```
Wi-Fi connected! IP: 10.13.52.xx
MQTT connecting...connected!
Publish [ksumech/lab13/.../data]: {"temp":28.3,"hum":62.1} (OK)
```

### สังเกต/วิเคราะห์

- ลองแก้ `delay` ระหว่างรอ Wi-Fi จาก 500 ms เป็น 100 ms — มีผลอะไรบ้าง?
- ทำไมจึงตรวจสอบ `isnan(t)` ก่อน publish?

### ตารางบันทึกผล — ส่วนที่ 2

| การทดสอบ | ผลที่สังเกตได้ |
|:---|:---|
| Serial แสดง "Wi-Fi connected!" | ________ |
| Serial แสดง "connected!" (MQTT) | ________ |
| Payload JSON ที่ส่ง (บันทึกตัวอย่าง 1 ค่า) | ________ |
| ค่า temp ที่ DHT22 รายงาน | ________ °C |
| ค่า hum ที่ DHT22 รายงาน | ________ %RH |

---

## ส่วนที่ 3: สร้าง Flow และ Dashboard ใน Node-RED (60 นาที)

### ความรู้เบื้องต้น

ข้อมูลไหลใน Node-RED ตามลำดับโหนดที่เชื่อมกัน:

```
[mqtt in] → [json] → [function] → [ui_gauge]
                    ↘ [ui_chart]
```

**โหนด `function`** ให้เขียน JavaScript อิสระ ควบคุม `msg.payload` ได้เต็มที่:
```javascript
// ตัวอย่าง: แยกเฉพาะ temp ออกมา และเพิ่ม warning flag
let temp = msg.payload.temp;
msg.payload = temp;
msg.label = temp > 35 ? "HOT!" : "Normal";
return msg;
```
ฟังก์ชัน return `msg` ส่งข้อมูลต่อไปยังโหนดถัดไป, return `null` หมายถึงหยุดโฟลว์

### ขั้นตอนปฏิบัติ

**ขั้นที่ 1: สร้าง Tab และ Group สำหรับ Dashboard**

1. คลิกไอคอนแท็บ **Dashboard** (ขวามือ) → กด **+ tab** → ตั้งชื่อ `Smart Factory`
2. กด **+ group** ในแท็บ Smart Factory → ตั้งชื่อ `Environment Data`

**ขั้นที่ 2: สร้าง Flow**

3. ลากโหนด **`mqtt in`** มาใน Workspace → ดับเบิลคลิกตั้งค่า:
   - Server: เพิ่ม Server ใหม่ → Host: `broker.hivemq.com`, Port: `1883`
   - Topic: `ksumech/lab13/YOUR_STUDENT_ID/data` (ให้ตรงกับโค้ด ESP32 ทุกตัวอักษร)
   - QoS: 0

4. ลากโหนด **`json`** มาวางต่อจาก `mqtt in` → ลากเส้นเชื่อม (Wire)
   > โหนด `json` แปลงสตริง JSON เป็น JavaScript Object ให้เข้าถึงค่าด้วย `.temp` และ `.hum` ได้

5. ลากโหนด **`function`** มา 2 ตัว → ต่อจาก `json` (แตก 2 เส้น):
   - ตัวที่ 1 (แยก temp): ดับเบิลคลิก → แท็บ **On Message** → ใส่โค้ด:
     ```javascript
     // แยกค่าอุณหภูมิ และเพิ่มการแจ้งเตือนถ้าสูงเกิน 35°C
     let temp = msg.payload.temp;
     if (typeof temp === 'number') {
         msg.payload = temp;
         msg.topic = "อุณหภูมิ";
         // ส่ง warning ไปยัง debug node ด้วย
         if (temp > 35) {
             node.warn("⚠️ อุณหภูมิสูง: " + temp + " °C");
         }
         return msg;
     }
     return null;  // กรองข้อมูลผิดรูปแบบออก
     ```
   - ตัวที่ 2 (แยก hum): ใส่โค้ด:
     ```javascript
     // แยกค่าความชื้น
     let hum = msg.payload.hum;
     if (typeof hum === 'number') {
         msg.payload = hum;
         msg.topic = "ความชื้น";
         return msg;
     }
     return null;
     ```

6. ต่อจากโหนด function (temp):
   - ลากโหนด **`ui_gauge`** → ดับเบิลคลิกตั้งค่า:
     - Group: `Environment Data`
     - Label: `อุณหภูมิ`
     - Units: `°C`
     - Range: 0 ถึง 50
     - Colour Gradient: เพิ่มสีแดงที่ > 35
   - ลากโหนด **`ui_chart`** → ดับเบิลคลิกตั้งค่า:
     - Group: `Environment Data`
     - Label: `กราฟอุณหภูมิ`
     - Type: Line chart
     - X-axis: Last 10 minutes

7. ต่อจากโหนด function (hum):
   - ลากโหนด **`ui_text`** → ตั้งค่า Group: `Environment Data`, Label: `ความชื้น`, Format: `{{msg.payload}} %RH`

8. เพิ่มโหนด **`debug`** ต่อจาก `json` อีก 1 ตัว เพื่อดูข้อมูลดิบใน Debug panel

9. กดปุ่ม **Deploy** (แดง มุมขวาบน)

10. เปิด Dashboard: `http://localhost:1880/ui`

### ตารางบันทึกผล — ส่วนที่ 3

| รายการ | ผลที่สังเกตได้ |
|:---|:---|
| Flow deploy สำเร็จ (ไม่มี Error node สีแดง) | ________ |
| Debug panel แสดง JSON Object จาก mqtt in | ________ |
| Gauge แสดงค่าอุณหภูมิ | ________ °C |
| Chart วาดเส้นกราฟ | ________ |
| Text แสดงค่าความชื้น | ________ %RH |

---

## ส่วนที่ 4: ปรับแต่ง Dashboard และเพิ่ม Logic (25 นาที)

### โจทย์ออกแบบ

เพิ่มระบบแจ้งเตือนง่าย ๆ เข้าไปใน Dashboard:

1. **เพิ่มโหนด `switch`** ต่อจากโหนด function (temp) เพื่อแยกเส้น:
   - เส้นที่ 1: `msg.payload >= 35` → ต่อไปยังโหนด `ui_text` ที่ตั้งค่าแสดงข้อความสีแดง `⚠️ อุณหภูมิสูง!`
   - เส้นที่ 2: `msg.payload < 35` → ต่อไปยังโหนด `ui_text` ที่แสดงสีเขียว `✅ ปกติ`

2. **ทดสอบ**: ปรับค่าจำลองใน Wokwi (แก้โค้ดให้ temp = 40.0 คงที่) → Deploy → ดูว่าแจ้งเตือนสีแดงปรากฏบน Dashboard

### ตารางบันทึกผล — ส่วนที่ 4

| เงื่อนไขทดสอบ | สถานะที่แสดงบน Dashboard |
|:---|:---|
| อุณหภูมิจำลอง = 40 °C | ________ |
| อุณหภูมิจำลอง = 28 °C | ________ |

---

## แบบฝึกหัดท้ายใบงาน

1. **บทบาทของโหนด `json`**: ถ้าลบโหนด `json` ออกจาก Flow แล้วต่อ `mqtt in` → `function` โดยตรง และพยายามเขียน `msg.payload.temp` ใน function node จะเกิดอะไรขึ้น? ทำไม?

   > คำตอบ: _______________________________________________________________

2. **msg.payload คืออะไร**: ในโหนด `function` ทดลองเพิ่มบรรทัด `node.log(typeof msg.payload)` ก่อน return — บันทึกผลที่เห็นใน Debug console ก่อนและหลังโหนด `json` เปรียบเทียบกัน

   > ก่อนโหนด json: ________ | หลังโหนด json: ________

3. **ประยุกต์ใช้งานเครื่องกล**: สมมติต้องสร้างแดชบอร์ดสำหรับระบบน้ำมันหล่อลื่นเครื่องกด (hydraulic press) ที่ต้องแสดงความดัน (bar), อุณหภูมิน้ำมัน (°C), และระดับน้ำมัน (%) พร้อมแจ้งเตือนเมื่อความดันเกิน 200 bar — ออกแบบ Flow ของ Node-RED (ระบุโหนดที่ใช้ตามลำดับ และ JavaScript ใน function node ที่จำเป็น)

   > คำตอบ: _______________________________________________________________

4. **ThingsBoard vs Node-RED**: เปรียบเทียบข้อดีและข้อจำกัดของ Node-RED และ ThingsBoard สำหรับใช้เป็น Dashboard ในงานโรงงานขนาดกลาง (50 เครื่องจักร) — ควรเลือกใช้อะไร เพราะเหตุใด?

   > คำตอบ: _______________________________________________________________

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จากอาจารย์ผู้สอน)**

สิ่งที่ต้องส่ง:
1. Screenshot Serial Monitor ของ Wokwi แสดงข้อมูล JSON ที่ publish สำเร็จ
2. Screenshot โครงสร้าง Flow ใน Node-RED (ต้องเห็นโหนดทั้งหมดและเส้นเชื่อม)
3. Screenshot หน้า Dashboard (`localhost:1880/ui`) แสดง Gauge, Chart, และ Text
4. Screenshot Debug panel แสดง JSON Object ที่รับจาก MQTT
5. คำตอบแบบฝึกหัดท้ายใบงานครบทุกข้อ

### Checklist ก่อนส่ง

- [ ] เปลี่ยน `YOUR_STUDENT_ID` เป็นรหัสนักศึกษาจริงในโค้ด ESP32 และ Node-RED แล้ว
- [ ] Wokwi simulate ผ่าน และ Serial แสดง "Publish ... OK"
- [ ] Node-RED Flow deploy สำเร็จ ไม่มีโหนดแสดง Error
- [ ] Dashboard แสดง Gauge วัดอุณหภูมิ, Chart กราฟเส้น, และ Text ความชื้น
- [ ] ระบบแจ้งเตือน (ส่วนที่ 4) ทำงานได้ถูกต้อง
- [ ] กรอกตารางบันทึกผลครบทุกส่วน
- [ ] ตอบแบบฝึกหัดท้ายใบงานครบ 4 ข้อ
- [ ] ระบุชื่อ-นามสกุล และรหัสนักศึกษาในฟอร์ม
