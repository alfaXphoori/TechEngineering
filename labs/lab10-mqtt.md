# 🔬 Lab 10: MQTT Publish/Subscribe

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**เครื่องมือ:** ESP32 บน Wokwi Simulator + HiveMQ Web Client  
**เวลา:** 3 ชั่วโมง

---

## วัตถุประสงค์

- อธิบายรูปแบบการสื่อสารแบบ Publish/Subscribe ของ MQTT และเปรียบเทียบกับ HTTP ได้
- เชื่อมต่อ ESP32 เข้ากับ MQTT Broker สาธารณะและ publish ค่าเซนเซอร์ได้
- subscribe หัวข้อ (topic) เพื่อรับคำสั่งควบคุมอุปกรณ์ได้
- อธิบายความหมายของ QoS, Retained Message และ Last Will and Testament (LWT) ได้
- ออกแบบโครงสร้าง Topic ที่เหมาะสมสำหรับระบบ IoT ได้

---

## ส่วนที่ 1: แนวคิด MQTT และการเตรียมเครื่องมือ (30 นาที)

### ความรู้เบื้องต้น

**MQTT (Message Queuing Telemetry Transport)** ถูกออกแบบมาสำหรับอุปกรณ์ IoT ที่มีทรัพยากรจำกัด ทำงานแบบ **Publish/Subscribe (Pub/Sub)** ซึ่งต่างจาก HTTP ที่ต้องถามซ้ำทุกรอบ (polling) — ใน MQTT อุปกรณ์บอกรับ (subscribe) topic แล้วรอข้อมูลเข้าเองทันทีที่มีการเปลี่ยนแปลง

| องค์ประกอบ | บทบาท |
|:---|:---|
| **Broker** | เซิร์ฟเวอร์ตัวกลางรับ-กระจายข้อความ (เช่น HiveMQ, Mosquitto) |
| **Publisher** | อุปกรณ์ที่ "ส่ง" ข้อมูลไปยัง topic (เช่น ESP32 ส่งอุณหภูมิ) |
| **Subscriber** | อุปกรณ์ที่ "สมัครรับ" ข้อมูลจาก topic ที่สนใจ |
| **Topic** | ชื่อช่องทางข้อมูล จัดลำดับชั้นด้วย `/` เช่น `ksu/me/room1/temp` |
| **QoS** | ระดับการรับประกันการส่ง: 0 = ส่งครั้งเดียวไม่มี ACK, 1 = รับประกันถึงปลายทาง (อาจซ้ำ), 2 = ถึงครั้งเดียวแน่นอน |

**Retained Message** — Broker เก็บข้อความล่าสุดของ topic ไว้ เมื่อมี Subscriber ใหม่จะได้รับค่าล่าสุดทันที  
**Last Will and Testament (LWT)** — ข้อความที่ Client ฝากไว้ตั้งแต่ตอน connect หาก Client หลุดโดยไม่ปกติ Broker จะส่งข้อความนี้แจ้งเตือน subscriber อื่น

| โพรโทคอล | รูปแบบ | Overhead | เหมาะกับ |
|:---|:---|:---|:---|
| HTTP | Request/Response | สูง (300–1000 ไบต์/ครั้ง) | ดาวน์โหลดข้อมูลขนาดใหญ่ |
| MQTT | Publish/Subscribe | ต่ำมาก (เริ่มต้น 2 ไบต์) | ส่งค่าเซนเซอร์บ่อย ๆ |

### ขั้นตอนปฏิบัติ — เตรียมเครื่องมือ

1. เปิด [Wokwi](https://wokwi.com) → สร้างโปรเจกต์ **ESP32** ใหม่
2. ไปที่แท็บ **Library Manager** → กดปุ่ม `+` → เพิ่มไลบรารี **`PubSubClient`**
3. เปิด MQTT test client ผ่านเว็บ: [HiveMQ Web Client](http://www.hivemq.com/demos/websocket-client/)
   - Host: `broker.hivemq.com` · Port: `8000` (WebSocket) → กด **Connect**

| รายการ | ค่าที่ใช้ในแล็บ |
|:---|:---|
| MQTT Broker | `broker.hivemq.com` |
| Port (ESP32 TCP) | `1883` |
| Topic ส่งข้อมูล | `ksu/me/<รหัสนักศึกษา>/sensor` |
| Topic รับคำสั่ง | `ksu/me/<รหัสนักศึกษา>/cmd` |

> หมายเหตุ: ใส่รหัสนักศึกษาจริงแทน `<รหัสนักศึกษา>` เพื่อป้องกัน topic ชนกับเพื่อน

### ตารางบันทึกผล — ส่วนที่ 1

| รายการตรวจสอบ | สถานะ |
|:---|:---|
| HiveMQ Web Client เชื่อมต่อสำเร็จ (แสดงสถานะ Connected) | ________ |
| ไลบรารี PubSubClient ถูกเพิ่มใน Wokwi แล้ว | ________ |
| กำหนด topic ของตนเองแล้ว (ใส่รหัสนักศึกษา) | ________ |

---

## ส่วนที่ 2: เขียนโปรแกรม Publish ค่าเซนเซอร์ (45 นาที)

### ความรู้เบื้องต้น

เมื่อ ESP32 publish ข้อมูล กระบวนการมีดังนี้:
1. ESP32 เชื่อมต่อ Wi-Fi → สร้าง TCP socket ไปยัง broker (`broker.hivemq.com:1883`)
2. ส่ง CONNECT packet พร้อม Client ID ที่ไม่ซ้ำกัน
3. Broker ตอบ CONNACK → เชื่อมต่อสำเร็จ
4. ESP32 publish ข้อมูลพร้อมชื่อ topic และ payload

ฟังก์ชัน `client.loop()` ต้องเรียกบ่อย ๆ ในลูปหลัก เพื่อให้ PubSubClient รับข้อมูลขาเข้า (subscribe) และส่ง keepalive ไม่ให้ Broker ตัดการเชื่อมต่อ

### ขั้นตอนปฏิบัติ

ต่อวงจรเพิ่ม LED เพื่อรับคำสั่งผ่าน MQTT:

| อุปกรณ์ | ขา ESP32 |
|:---|:---|
| LED ขายาว (Anode) | GPIO 2 (ผ่านตัวต้านทาน 220Ω) |
| LED ขาสั้น (Cathode) | GND |

เขียนโค้ดต่อไปนี้ในไฟล์ `sketch.ino`:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid        = "Wokwi-GUEST";
const char* password    = "";
const char* mqtt_server = "broker.hivemq.com";
const int   mqtt_port   = 1883;

// เปลี่ยน 6500000000 เป็นรหัสนักศึกษาของตนเอง
const char* TOPIC_SENSOR = "ksu/me/6500000000/sensor";
const char* TOPIC_CMD    = "ksu/me/6500000000/cmd";

#define LED_PIN 2

WiFiClient   espClient;
PubSubClient client(espClient);

// ฟังก์ชัน callback รับข้อมูลจาก topic ที่ subscribe ไว้
void callback(char* topic, byte* payload, unsigned int length) {
  String msg = "";
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];
  Serial.printf("[รับ] topic=%s | msg=%s\n", topic, msg.c_str());

  if (msg == "LED_ON")  { digitalWrite(LED_PIN, HIGH); Serial.println("LED: ON"); }
  if (msg == "LED_OFF") { digitalWrite(LED_PIN, LOW);  Serial.println("LED: OFF"); }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("เชื่อมต่อ MQTT...");
    // Client ID ต้องไม่ซ้ำกัน ใช้ random() ช่วย
    String clientId = "esp32-ksu-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("สำเร็จ!");
      client.subscribe(TOPIC_CMD);    // บอกรับ topic คำสั่ง
      Serial.printf("Subscribe: %s\n", TOPIC_CMD);
    } else {
      Serial.printf("ล้มเหลว (rc=%d) ลองใหม่ใน 3 วินาที\n", client.state());
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  // เชื่อมต่อ Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Wi-Fi กำลังเชื่อมต่อ");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi: Connected! IP = " + WiFi.localIP().toString());

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();   // จำเป็น: ให้ PubSubClient รับข้อมูลขาเข้า

  // Publish ข้อมูลเซนเซอร์จำลองทุก 5 วินาที
  static unsigned long lastPublish = 0;
  if (millis() - lastPublish >= 5000) {
    lastPublish = millis();

    float temp = 25.0 + random(0, 150) / 10.0;   // จำลอง 25.0–40.0 °C
    float hum  = 50.0 + random(0, 300) / 10.0;   // จำลอง 50.0–80.0 %RH

    // สร้าง JSON payload
    char payload[64];
    snprintf(payload, sizeof(payload),
             "{\"temp\":%.1f,\"hum\":%.1f}", temp, hum);

    bool ok = client.publish(TOPIC_SENSOR, payload);
    Serial.printf("[ส่ง] %s → %s (%s)\n",
                  TOPIC_SENSOR, payload, ok ? "OK" : "FAIL");
  }
}
```

### ขั้นตอนทดสอบ

1. กด **Start Simulation** บน Wokwi → ดู Serial Monitor เห็น `Wi-Fi: Connected!` แล้วตาม `สำเร็จ!`
2. Serial จะพิมพ์ข้อมูลที่ส่งทุก 5 วินาที เช่น `[ส่ง] ksu/me/6500000000/sensor → {"temp":31.5,"hum":63.2} (OK)`
3. ที่ HiveMQ Web Client → Subscribe topic `ksu/me/6500000000/sensor` → ดูข้อมูล JSON เข้ามา

### สังเกต/วิเคราะห์

- Client ID แต่ละครั้งที่เชื่อมต่อจะต่างกัน — ทำไมจึงต้องเป็นเช่นนี้?
- ถ้ารัน Wokwi 2 ตัวพร้อมกันด้วย Client ID เดียวกัน จะเกิดอะไรขึ้น?

### ตารางบันทึกผล — ส่วนที่ 2

| การทดสอบ | ผลที่สังเกตได้บน Serial Monitor | ผลบน HiveMQ Web Client |
|:---|:---|:---|
| Wi-Fi เชื่อมต่อสำเร็จ | ________ | — |
| MQTT เชื่อมต่อสำเร็จ | ________ | — |
| Publish ครั้งแรก | ________ | ________ |
| Publish ครั้งที่ 2 (5 วินาทีถัดไป) | ________ | ________ |

---

## ส่วนที่ 3: Subscribe รับคำสั่งควบคุม LED (30 นาที)

### ความรู้เบื้องต้น

การ subscribe ใน MQTT ทำให้อุปกรณ์รับข้อมูลได้แบบ Push — ไม่ต้องถามซ้ำ ซึ่งต่างจาก HTTP polling อย่างสิ้นเชิง เมื่อมีผู้ publish ข้อมูลมาที่ topic ที่เรา subscribe ไว้ Broker จะส่งข้อมูลมาหาเราทันทีผ่าน callback function

ในโค้ดของเรา ฟังก์ชัน `callback()` จะถูกเรียกโดยอัตโนมัติเมื่อมีข้อมูลเข้า — นี่คือแก่นของ event-driven programming ที่ประหยัด CPU และพลังงานมาก

### ขั้นตอนปฏิบัติ

โค้ดในส่วนที่ 2 รองรับ subscribe อยู่แล้ว ให้ทดสอบโดย:

1. ที่ HiveMQ Web Client → แท็บ **Publish**:
   - Topic: `ksu/me/6500000000/cmd`
   - Message: `LED_ON`
   - กด **Publish** → สังเกต LED บน Wokwi และข้อความบน Serial Monitor
2. Publish ข้อความ `LED_OFF` → สังเกตผล
3. ทดลอง publish ข้อความอื่นที่ไม่ใช่ `LED_ON` หรือ `LED_OFF` (เช่น `hello`) → ดูว่าเกิดอะไรขึ้น

### สังเกต/วิเคราะห์

- เวลาตั้งแต่กด Publish ที่ HiveMQ จนถึง LED ติด/ดับ ประมาณเท่าไร?
- ทำไมเราจึงใส่ `client.subscribe(TOPIC_CMD)` ในฟังก์ชัน `reconnect()` ไม่ใช่ใน `setup()`?

### ตารางบันทึกผล — ส่วนที่ 3

| คำสั่งที่ส่ง | ผลบน Serial Monitor | สถานะ LED |
|:---|:---|:---|
| `LED_ON` | ________ | ________ |
| `LED_OFF` | ________ | ________ |
| ข้อความอื่น (ระบุ: ______) | ________ | ________ |

---

## ส่วนที่ 4: สำรวจ QoS และออกแบบโครงสร้าง Topic (40 นาที)

### ความรู้เบื้องต้น

MQTT มี 3 ระดับ QoS (Quality of Service):

| QoS | ชื่อเรียก | กลไก | เหมาะกับ |
|:---:|:---|:---|:---|
| 0 | At most once | ส่งครั้งเดียว ไม่มี ACK ("ยิงแล้วลืม") | ค่าเซนเซอร์ที่ส่งบ่อย เช่น อุณหภูมิรายวินาที |
| 1 | At least once | ส่งซ้ำจน Broker ตอบ PUBACK — อาจมาซ้ำ | คำสั่งเปิด-ปิดที่ห้ามสูญหาย |
| 2 | Exactly once | Handshake 4 ขั้น (PUBLISH→PUBREC→PUBREL→PUBCOMP) | ระบบที่ห้ามซ้ำและห้ามสูญหายเด็ดขาด |

**โครงสร้าง Topic** ที่ดีควรจัดลำดับชั้นจากใหญ่ไปเล็ก เช่น:
```
<บริษัท>/<อาคาร>/<ชั้น>/<ห้อง>/<อุปกรณ์>/<ค่าที่ส่ง>
ksu/mechengg/building-a/floor2/room201/temp
```

Wildcard ที่ใช้ใน subscribe: `+` แทน 1 ระดับ, `#` แทนหลายระดับ  
ตัวอย่าง: `ksu/mechengg/+/floor2/#` จะรับข้อมูลจากทุกอาคาร ชั้น 2 ทุกห้องและทุกค่า

### ขั้นตอนปฏิบัติ — ออกแบบ Topic

ออกแบบ topic สำหรับ **โรงงานผลิตชิ้นส่วนยานยนต์** ที่มี 2 สายการผลิต (Line A และ Line B) แต่ละสายมีเซนเซอร์อุณหภูมิ ความสั่นสะเทือน และสวิตช์หยุดฉุกเฉิน:

| อุปกรณ์/ค่า | Topic ที่ออกแบบ |
|:---|:---|
| อุณหภูมิสายการผลิต A | _______________________________ |
| ความสั่นสะเทือนสายการผลิต A | _______________________________ |
| สวิตช์หยุดฉุกเฉิน สาย B | _______________________________ |
| รับค่าทั้งหมดจาก Line A | _______________________________ |
| รับค่าทั้งหมดจากโรงงาน | _______________________________ |

### ตารางบันทึกผล — ส่วนที่ 4

จดบันทึก QoS ที่เหมาะสมสำหรับแต่ละงาน:

| งาน | QoS ที่เลือก | เหตุผล |
|:---|:---:|:---|
| ส่งค่าอุณหภูมิทุก 1 วินาที | ________ | ________ |
| คำสั่งเปิดปั๊มน้ำ | ________ | ________ |
| ระบบหยุดฉุกเฉินสายการผลิต | ________ | ________ |

---

## แบบฝึกหัดท้ายใบงาน

1. **MQTT vs HTTP**: ถ้าต้องส่งค่าอุณหภูมิจากเซนเซอร์บนเครื่องจักรทุก 2 วินาที เป็นเวลา 8 ชั่วโมง โดยใช้ซิมการ์ด 4G ที่คิดค่าบริการตามปริมาณข้อมูล — ระหว่าง MQTT (QoS 0) กับ HTTP POST แบบใดประหยัดแบนด์วิดท์กว่า เพราะเหตุใด?

   > คำตอบ: _______________________________________________________________

2. **Last Will and Testament**: ESP32 ติดตั้งบนสายพานลำเลียงและส่งสัญญาณ heartbeat ทุก 10 วินาที ออกแบบ LWT message ที่เหมาะสมสำหรับระบบนี้ (ระบุ topic, payload, และ QoS ที่จะใช้)

   > คำตอบ: _______________________________________________________________

3. **Retained Message**: ในระบบตรวจวัดสภาพแวดล้อมโรงงาน ทำไม Retained Message จึงมีประโยชน์เมื่อมีหน้าจอแดชบอร์ดใหม่เปิดขึ้น? ถ้าไม่ใช้ Retained Message จะเกิดปัญหาอะไร?

   > คำตอบ: _______________________________________________________________

4. **ประยุกต์ใช้**: ออกแบบระบบ MQTT สำหรับตรวจวัดสภาพน้ำมันไฮดรอลิกในระบบกด (hydraulic press) ที่ต้องวัดความดัน อุณหภูมิ และระดับน้ำมัน — ระบุจำนวน Broker ที่ต้องการ, โครงสร้าง topic, QoS สำหรับแต่ละค่า และว่าค่าใดควรใช้ Retained Message

   > คำตอบ: _______________________________________________________________

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จากอาจารย์ผู้สอน)**

สิ่งที่ต้องส่ง:
1. Screenshot Serial Monitor แสดง `Wi-Fi: Connected!`, `สำเร็จ!` และข้อมูลที่ publish
2. Screenshot HiveMQ Web Client แสดงค่า JSON ที่ subscribe ได้จาก topic sensor
3. Screenshot HiveMQ Web Client ขณะ publish คำสั่ง `LED_ON` / `LED_OFF` และ Serial Monitor แสดงผล
4. ตารางออกแบบ Topic โรงงาน (ส่วนที่ 4)
5. คำตอบแบบฝึกหัดท้ายใบงานครบทุกข้อ

### Checklist ก่อนส่ง

- [ ] Screenshot Serial Monitor แสดง MQTT connected และข้อมูลที่ publish
- [ ] Screenshot HiveMQ แสดงค่า JSON ที่รับจาก topic sensor
- [ ] Screenshot LED ติด/ดับ จากการ publish คำสั่ง (ส่วนที่ 3)
- [ ] กรอกตารางบันทึกผลครบทุกส่วน
- [ ] ตารางออกแบบ Topic สำหรับโรงงาน (ส่วนที่ 4)
- [ ] ตอบแบบฝึกหัดท้ายใบงานครบ 4 ข้อ
- [ ] ระบุชื่อ-นามสกุล และรหัสนักศึกษาในฟอร์ม
