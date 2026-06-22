# 🔬 Lab 10: MQTT Publish/Subscribe

## วัตถุประสงค์

- อธิบายรูปแบบการสื่อสารแบบ Publish/Subscribe ของ MQTT ได้
- เชื่อมต่อ ESP32 เข้ากับ MQTT Broker สาธารณะและ publish ค่าเซนเซอร์ได้
- subscribe หัวข้อ (topic) เพื่อรับคำสั่งควบคุมอุปกรณ์ได้
- ออกแบบโครงสร้าง Topic สำหรับระบบ IoT ได้

---

## ส่วนที่ 1: ทบทวนแนวคิด MQTT (10 นาที)

MQTT (Message Queuing Telemetry Transport) เป็นโพรโทคอลแบบ **Publish/Subscribe** ที่เบาและเหมาะกับ IoT

| องค์ประกอบ | หน้าที่ |
|:---|:---|
| **Broker** | ตัวกลางรับ-ส่งข้อความ (เช่น HiveMQ, Mosquitto) |
| **Publisher** | อุปกรณ์ที่ "ส่ง" ข้อความไปยัง topic |
| **Subscriber** | อุปกรณ์ที่ "รับ" ข้อความจาก topic ที่สมัครไว้ |
| **Topic** | ชื่อช่องทาง เช่น `ksu/me/room1/temp` |
| **QoS** | ระดับการรับประกันการส่ง (0, 1, 2) |

> 💡 ต่างจาก HTTP ที่ client ต้องถาม server ตลอด (polling) — MQTT ใช้การ "บอกรับ" ทำให้ได้ข้อมูลทันทีที่มีการเปลี่ยนแปลง และประหยัดพลังงานกว่ามาก

---

## ส่วนที่ 2: เตรียมเครื่องมือ (10 นาที)

1. เปิด Wokwi → สร้างโปรเจกต์ ESP32 ใหม่
2. เพิ่มไลบรารีใน Wokwi (แท็บ **Library Manager**): `PubSubClient`
3. เปิด MQTT client สำหรับทดสอบฝั่งเรา: เว็บ [HiveMQ Web Client](http://www.hivemq.com/demos/websocket-client/)
   - Host: `broker.hivemq.com` · Port: `8000` (WebSocket) → กด **Connect**

| รายการ | ค่าที่ใช้ |
|:---|:---|
| Broker | `broker.hivemq.com` |
| Port (ESP32) | `1883` |
| Topic ส่งข้อมูล | `ksu/me/<รหัสนักศึกษา>/temp` |
| Topic รับคำสั่ง | `ksu/me/<รหัสนักศึกษา>/led` |

---

## ส่วนที่ 3: เขียนโปรแกรม Publish ค่าเซนเซอร์ (20 นาที)

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);

const char* TOPIC_TEMP = "ksu/me/6500000000/temp";
const char* TOPIC_LED  = "ksu/me/6500000000/led";
const int LED_PIN = 2;

void callback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];
  Serial.printf("รับจาก [%s]: %s\n", topic, msg.c_str());
  if (msg == "ON")  digitalWrite(LED_PIN, HIGH);
  if (msg == "OFF") digitalWrite(LED_PIN, LOW);
}

void reconnect() {
  while (!client.connected()) {
    String id = "esp32-" + String(random(0xffff), HEX);
    if (client.connect(id.c_str())) {
      client.subscribe(TOPIC_LED);          // บอกรับ topic คำสั่ง
      Serial.println("MQTT connected");
    } else {
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  static unsigned long t = 0;
  if (millis() - t > 5000) {            // publish ทุก 5 วินาที
    t = millis();
    float temp = 25.0 + random(0, 100) / 10.0;   // จำลองค่าอุณหภูมิ
    char buf[16];
    dtostrf(temp, 4, 1, buf);
    client.publish(TOPIC_TEMP, buf);
    Serial.printf("ส่ง temp = %s\n", buf);
  }
}
```

---

## ส่วนที่ 4: ทดสอบ (15 นาที)

1. กด **Start Simulation** บน Wokwi → ดู Serial เห็น `MQTT connected` และค่า temp ที่ส่ง
2. ที่ HiveMQ Web Client → **Subscribe** หัวข้อ `ksu/me/6500000000/temp` → ควรเห็นค่าอุณหภูมิเข้ามาทุก 5 วินาที
3. ที่ HiveMQ Web Client → **Publish** ข้อความ `ON` / `OFF` ไปยัง `ksu/me/6500000000/led` → สังเกต LED บน ESP32 ติด/ดับ

### บันทึกผล

| การทดสอบ | ผลที่สังเกตได้ |
|:---|:---|
| Subscribe topic temp | |
| Publish "ON" ไป topic led | |
| Publish "OFF" ไป topic led | |

---

## ส่วนที่ 5: ออกแบบโครงสร้าง Topic (10 นาที)

ออกแบบ topic สำหรับระบบฟาร์มอัจฉริยะที่มี 2 โรงเรือน แต่ละโรงมีเซนเซอร์อุณหภูมิ ความชื้น และปั๊มน้ำ

| อุปกรณ์ | Topic ที่ออกแบบ |
|:---|:---|
| อุณหภูมิ โรงเรือน 1 | |
| ความชื้น โรงเรือน 1 | |
| ปั๊มน้ำ โรงเรือน 2 | |

**คำถามท้ายใบงาน**
1. QoS 0, 1, 2 ต่างกันอย่างไร และควรเลือกใช้ระดับใดกับการส่งค่าอุณหภูมิ เพราะเหตุใด
2. ถ้า ESP32 หลุดการเชื่อมต่อกลางคัน ข้อความที่ publisher ส่งระหว่างนั้นจะเป็นอย่างไร (เกริ่นถึง Retained message / LWT)
3. เปรียบเทียบ MQTT กับ HTTP สำหรับงานส่งค่าเซนเซอร์ทุก 5 วินาที — แบบใดเหมาะกว่า เพราะอะไร

---

## การส่งงาน

> 📋 **ส่งงานผ่าน Google Form**

### Checklist ก่อนกด Submit

- [ ] Screenshot Serial Monitor แสดง `MQTT connected` และค่าที่ส่ง
- [ ] Screenshot HiveMQ Web Client แสดงค่า temp ที่ subscribe ได้
- [ ] Screenshot LED ติด/ดับ จากการ publish คำสั่ง
- [ ] ตารางออกแบบ Topic ฟาร์มอัจฉริยะ
- [ ] ตอบคำถามท้ายใบงานครบทุกข้อ
