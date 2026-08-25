---
layout: default
title: "บทที่ 13: การเรียนรู้ของเครื่องและการประมวลผลอัจฉริยะที่ปลายขอบ"
permalink: /chapters/ch13-machine-learning/
---

# Chapter 13: การเรียนรู้ของเครื่องและการประมวลผลอัจฉริยะที่ปลายขอบ

## Machine Learning & TinyML/Edge AI (Vibration Anomaly Detection, TensorFlow Lite, Colab, Edge Inference)

---

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**ผู้เรียบเรียง:** คณะวิศวกรรมศาสตร์  

---

> ### 🎯 ผลลัพธ์การเรียนรู้และการเชื่อมโยง (Constructive Alignment)
>
> - **สัปดาห์การเรียนรู้:** สัปดาห์ที่ 15 — การเรียนรู้ของเครื่องและการประมวลผลอัจฉริยะที่ปลายขอบ (Machine Learning & TinyML)
> - **ผลลัพธ์การเรียนรู้ระดับรายวิชา (CLOs):**
>   - **CLO1:** อธิบายหลักการและสถาปัตยกรรมของระบบ IoT ตัวรับรู้ ตัวกระทำ และไมโครคอนโทรลเลอร์ได้
>   - **CLO4:** ปฏิบัติการสร้าง ทดสอบ และประยุกต์ใช้ระบบ IoT พร้อมการเรียนรู้ของเครื่องเบื้องต้น และทำงานเป็นทีมอย่างรับผิดชอบ
> - **ผลลัพธ์การเรียนรู้ระดับบทเรียน (LLOs):**
>   - **LLO15.1:** อธิบายแนวคิดและประเภทของการเรียนรู้ของเครื่อง (Supervised/Unsupervised, TinyML) ได้ (CLO1)
>   - **LLO15.2:** ฝึกและทดสอบแบบจำลองจำแนกข้อมูลเซนเซอร์/ตรวจจับความผิดปกติด้วย ML บน Google Colab และ TinyML บน ESP32 ได้ (CLO4)
>
---

<div class="chapter-tab-content" data-tab-name="Concept" data-tab-icon="💡" id="concept" markdown="1">

## 13.1 ML คืออะไร และเทียบกับการเขียนกฎแบบดั้งเดิม

### แนวทางดั้งเดิม (Rule-Based)

ในโปรแกรมทั่วไป เราเขียน **กฎ (Rules)** ไว้ตายตัว เช่น

```cpp
if (temperature > 40) {
  turnOnFan();
}
```

วิธีนี้ใช้ได้ดีเมื่อเรารู้เงื่อนไขชัดเจน แต่ถ้าปัจจัยมีหลายตัวและซับซ้อน (เช่น อุณหภูมิ + ความชื้น + แรงสั่นสะเทือน) การเขียนกฎจะยุ่งยากและไม่ยืดหยุ่น

### แนวทาง Machine Learning

ML ให้คอมพิวเตอร์ **เรียนรู้รูปแบบ (Pattern) จากข้อมูลตัวอย่าง** แทนที่จะเขียนกฎเอง เราป้อนข้อมูลจำนวนมากพร้อมคำตอบ แล้วให้อัลกอริทึม "ค้นพบ" กฎเอง

> 💡 **เปรียบเทียบง่าย ๆ**: การเขียนกฎเหมือนสอนเด็กว่า "ถ้าเห็นสี่ขาและหางยาว → สุนัข" แต่ ML เหมือนให้เด็กดูรูปสุนัขหลายร้อยรูปจนจำแนกได้เอง

### ความสัมพันธ์ AI / ML / DL

| ระดับ | คำเต็ม | ความหมาย |
|-------|--------|----------|
| AI | Artificial Intelligence | ศาสตร์กว้างที่ทำให้เครื่องจักรแสดงพฤติกรรมอัจฉริยะ |
| ML | Machine Learning | สาขาย่อยของ AI ที่เรียนรู้จากข้อมูล ไม่ต้องเขียนกฎตายตัว |
| DL | Deep Learning | สาขาย่อยของ ML ที่ใช้โครงข่ายประสาทเทียมหลายชั้น (Neural Networks) |

ความสัมพันธ์คือ **AI ⊃ ML ⊃ DL** — Deep Learning เป็นส่วนหนึ่งของ ML และ ML เป็นส่วนหนึ่งของ AI

---

## 13.2 ประเภทการเรียนรู้ (Types of Learning)

### ตารางเปรียบเทียบ 3 ประเภทหลัก

| ประเภท | ภาษาอังกฤษ | ลักษณะข้อมูล | ตัวอย่างงาน IoT |
|--------|-----------|-------------|----------------|
| การเรียนรู้แบบมีผู้สอน | Supervised Learning | มีคำตอบ (Label) กำกับ | จำแนกสภาพเครื่องจักร: ปกติ/ผิดปกติ |
| การเรียนรู้แบบไม่มีผู้สอน | Unsupervised Learning | ไม่มีคำตอบกำกับ | จัดกลุ่มรูปแบบการใช้พลังงาน |
| การเรียนรู้แบบเสริมกำลัง | Reinforcement Learning | เรียนรู้จากรางวัล/โทษ | หุ่นยนต์เรียนรู้เส้นทางหลบสิ่งกีดขวาง |

### Supervised Learning

- **Classification (การจำแนกประเภท)**: ผลลัพธ์เป็นหมวดหมู่ เช่น "เครื่องจักรปกติ" หรือ "เครื่องจักรผิดปกติ"
- **Regression (การถดถอย)**: ผลลัพธ์เป็นตัวเลขต่อเนื่อง เช่น "คาดว่าอุณหภูมิจะเป็น 38.5 °C ในอีก 10 นาที"

### Unsupervised Learning

- **Clustering (การจัดกลุ่ม)**: จัดข้อมูลที่คล้ายกันเข้ากลุ่มเดียวกัน เช่น จัดกลุ่มพฤติกรรมการสั่นของมอเตอร์ออกเป็น 3 กลุ่ม โดยไม่ต้องบอกล่วงหน้าว่ากลุ่มไหนคืออะไร

### Reinforcement Learning

ตัวแทน (Agent) ลองทำสิ่งต่าง ๆ ในสภาพแวดล้อม รับ **รางวัล (Reward)** เมื่อทำถูก รับ **โทษ (Penalty)** เมื่อทำผิด แล้วปรับพฤติกรรมไปเรื่อย ๆ เช่น ระบบ HVAC เรียนรู้การปรับอุณหภูมิให้ประหยัดพลังงานที่สุด

---

## 13.3 ขั้นตอนการพัฒนาโมเดล (ML Pipeline)

```
เก็บข้อมูล → เตรียม/ทำความสะอาด → แบ่ง Train/Test → ฝึกโมเดล → ประเมินผล
```

1. **เก็บข้อมูล (Data Collection)** — อ่านค่าจากเซนเซอร์ บันทึกลง CSV หรือฐานข้อมูล
2. **เตรียมและทำความสะอาดข้อมูล (Data Preprocessing)** — ลบค่าผิดปกติ (Outliers), แทนค่าที่หายไป (Missing Values), ปรับสเกล (Normalization)
3. **แบ่งชุดข้อมูล (Train/Test Split)** — ปกติแบ่ง 80% สำหรับฝึก (Training Set) และ 20% สำหรับทดสอบ (Test Set)
4. **ฝึกโมเดล (Model Training)** — ป้อนชุดฝึกให้อัลกอริทึมเรียนรู้
5. **ประเมินผล (Evaluation)** — วัดประสิทธิภาพกับชุดทดสอบ ดูค่า **Accuracy** (ความถูกต้อง) หรือค่าอื่น ๆ

> 💡 **ทำไมต้องแบ่ง Train/Test?** ถ้าเราใช้ข้อมูลชุดเดียวกันทั้งฝึกและทดสอบ โมเดลอาจ "จำ" คำตอบได้แต่ไม่สามารถ "ทำนาย" ข้อมูลใหม่ได้ เรียกปัญหานี้ว่า **Overfitting**

---

## 13.4 ฟีเจอร์จากข้อมูลเซนเซอร์ (Feature Engineering)

ข้อมูลดิบจากเซนเซอร์ (เช่น ค่าความเร่ง 1,000 จุดต่อวินาที) มักมีมากเกินไปที่จะใส่โมเดลโดยตรง เราจึงต้อง **สกัดฟีเจอร์ (Features)** ที่มีความหมายออกมา

### ฟีเจอร์พื้นฐานที่นิยมใช้

| ฟีเจอร์ | สูตร/แนวคิด | ตัวอย่างการใช้ |
|---------|-------------|---------------|
| ค่าเฉลี่ย (Mean) | ผลรวมทุกค่า ÷ จำนวนค่า | ระดับอุณหภูมิเฉลี่ยใน 1 นาที |
| ส่วนเบี่ยงเบนมาตรฐาน (Std Dev) | วัดการกระจายของข้อมูล | ความสั่นสะเทือนที่ไม่สม่ำเสมอ → ค่า Std สูง |
| ค่ามากสุด/น้อยสุด (Max/Min) | ค่ายอดสูงสุดและต่ำสุดในช่วงเวลา | ตรวจจับค่าพีค (Spike) |
| พิสัย (Range) | Max − Min | ช่วงกว้างของแรงดันไฟฟ้า |
| RMS (Root Mean Square) | รากที่สองของค่าเฉลี่ยกำลังสอง | วัดพลังงานของสัญญาณสั่นสะเทือน |
| จำนวนจุดตัดศูนย์ (Zero-Crossing Rate) | จำนวนครั้งที่สัญญาณข้ามค่าศูนย์ | จำแนกประเภทเสียง |

### ตัวอย่างแนวคิด

สมมติเราอ่านค่าความเร่ง (Accelerometer) จากมอเตอร์ทุก ๆ 10 มิลลิวินาที เป็นเวลา 1 วินาที ได้ข้อมูล 100 จุด แทนที่จะส่ง 100 ค่าเข้าโมเดล เราคำนวณ:

- Mean = 0.12 g
- Std = 0.45 g
- Max = 1.8 g
- RMS = 0.52 g

แล้วส่ง **4 ฟีเจอร์** เข้าโมเดลแทน ซึ่งกระชับกว่าและยังคงข้อมูลสำคัญไว้

---

## 13.5 ตัวอย่างอัลกอริทึมเบื้องต้น

### k-Nearest Neighbors (k-NN)

- **แนวคิด**: เมื่อได้ข้อมูลใหม่ ให้ดูข้อมูลที่ "ใกล้เคียง" ที่สุด k ตัว แล้วโหวตเสียงข้างมาก
- **ข้อดี**: เข้าใจง่าย ไม่ต้องฝึกล่วงหน้า
- **ข้อเสีย**: ช้าเมื่อข้อมูลมาก เพราะต้องคำนวณระยะทางทุกจุด
- **ตัวอย่าง IoT**: จำแนกท่าทาง (Gesture) จากข้อมูล Accelerometer

### Decision Tree (ต้นไม้ตัดสินใจ)

- **แนวคิด**: สร้างกฎเป็นโครงสร้างต้นไม้ ถามคำถามทีละข้อแล้วแยกสาขาไปเรื่อย ๆ เช่น "อุณหภูมิ > 50? → ใช่ → ความสั่น > 2g? → ใช่ → ผิดปกติ"
- **ข้อดี**: อ่านผลลัพธ์ได้ง่าย อธิบายเหตุผลการตัดสินใจได้
- **ข้อเสีย**: อาจ Overfit ถ้าต้นไม้ลึกเกินไป
- **ตัวอย่าง IoT**: ตัดสินใจว่าควรเปิด/ปิดปั๊มน้ำจากข้อมูลความชื้นดินหลายจุด

### Linear Regression (การถดถอยเชิงเส้น)

- **แนวคิด**: หาเส้นตรงที่ "พอดี" กับข้อมูลมากที่สุด (y = mx + b)
- **ใช้สำหรับ**: ทำนายค่าต่อเนื่อง เช่น คาดการณ์อุณหภูมิจากเวลาของวัน
- **ตัวอย่าง IoT**: ทำนายระดับน้ำในถังจากอัตราการไหล

### Logistic Regression (การถดถอยโลจิสติก)

- **แนวคิด**: คล้าย Linear Regression แต่ผลลัพธ์ถูกบีบให้อยู่ระหว่าง 0 ถึง 1 (ความน่าจะเป็น) เหมาะสำหรับงาน Classification
- **ตัวอย่าง IoT**: ทำนายโอกาสที่เครื่องจักรจะเสีย (0 = ปกติ, 1 = จะเสีย)

---

</div>

<div class="chapter-tab-content" data-tab-name="Interactive Sim" data-tab-icon="🎮" id="sim" markdown="1">
## 13.6 ปฏิบัติการ Wokwi Lab 15: การตรวจจับความผิดปกติของแรงสั่นสะเทือนมอเตอร์ด้วยการเรียนรู้ของเครื่อง (TinyML / Edge AI)

**รหัสปฏิบัติการ:** LAB-13 | **เวลาปฏิบัติการ:** 2 ชั่วโมง  
**เป้าหมายการเรียนรู้:** LLO15.1, LLO15.2 (CLO1, CLO4)  
**เครื่องมือที่ใช้:** Wokwi Simulator, Google Colab (Python ML), ESP32, Potentiometer (Vibration sensor sim), Relay, LEDs (Normal/Anomaly)

---

### 13.6.1 วัตถุประสงค์เชิงปฏิบัติการ
1. รวบรวมชุดข้อมูลอนุกรมเวลาและเขียนฟังก์ชันสกัดฟีเจอร์ทางสถิติ (Mean, RMS, Peak-to-Peak, Variance) บน ESP32
2. พัฒนาและทดสอบแบบจำลองตรวจจับความผิดปกติ (Anomaly Detection / Threshold-Classifier) บน Google Colab
3. ฝังแบบจำลองลงบนชิปไมโครคอนโทรลเลอร์ (On-Device Inference) เพื่อตัดสินใจสั่งตัดการทำงานของเครื่องจักรภายใน $50\text{ ms}$

---

### 13.6.2 แผนผังการต่อวงจร (Wiring Table)

| อุปกรณ์ | ขาของอุปกรณ์ | ขาบนบอร์ด ESP32 | หน้าที่ในระบบ TinyML |
|---|---|---|---|
| **Vibration Sensor Sim (Potentiometer)** | SIG | **GPIO 34** (ADC1) | สัญญาณความเร่งการสั่นสะเทือนต่อเนื่อง |
| **Normal Status LED (สีเขียว)** | Anode (+) | **GPIO 18** (ผ่าน R 330Ω) | ติดเมื่อโมเดลทำนายสถานะ: NORMAL |
| **Anomaly Alarm LED (สีแดง)** | Anode (+) | **GPIO 19** (ผ่าน R 330Ω) | ติดเมื่อโมเดลทำนายสถานะ: ANOMALY |
| **Safety Trip Relay** | IN | **GPIO 13** | สั่งตัดกระแสไฟเมื่อเครื่องจักรผิดปกติ |

---

### 13.6.3 ไฟล์โครงสร้างวงจร `diagram.json` สำหรับ Wokwi

```json
{
  "version": 1,
  "author": "KSU TechEngineering",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": 0, "attrs": {} },
    { "type": "wokwi-potentiometer", "id": "pot1", "top": -140, "left": -100, "attrs": { "value": "2048" } },
    { "type": "wokwi-led", "id": "led_norm", "top": -140, "left": 80, "attrs": { "color": "green" } },
    { "type": "wokwi-resistor", "id": "r1", "top": -90, "left": 80, "attrs": { "value": "330" } },
    { "type": "wokwi-led", "id": "led_anom", "top": -140, "left": 140, "attrs": { "color": "red" } },
    { "type": "wokwi-resistor", "id": "r2", "top": -90, "left": 140, "attrs": { "value": "330" } },
    { "type": "wokwi-relay-module", "id": "relay1", "top": 120, "left": 100, "attrs": {} }
  ],
  "connections": [
    [ "esp:3V3", "pot1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "pot1:GND", "black", [ "v0" ] ],
    [ "esp:34", "pot1:SIG", "green", [ "v0" ] ],

    [ "esp:18", "r1:1", "orange", [ "v0" ] ],
    [ "r1:2", "led_norm:A", "orange", [ "v0" ] ],
    [ "led_norm:C", "esp:GND", "black", [ "v0" ] ],

    [ "esp:19", "r2:1", "orange", [ "v0" ] ],
    [ "r2:2", "led_anom:A", "orange", [ "v0" ] ],
    [ "led_anom:C", "esp:GND", "black", [ "v0" ] ],

    [ "esp:5V", "relay1:VCC", "red", [ "v0" ] ],
    [ "esp:GND", "relay1:GND", "black", [ "v0" ] ],
    [ "esp:13", "relay1:IN", "purple", [ "v0" ] ]
  ],
  "dependencies": {}
}
```

---

### 13.6.4 ซอร์สโค้ดภาษา C++ (On-Device Feature Extraction & TinyML Inference)

```cpp
/**
 * LAB 13: Edge AI / TinyML Motor Vibration Anomaly Detection
 * Course: Digital Technology for Engineering, KSU
 */

#include <math.h>

const int VIB_SENSOR_PIN = 34;
const int LED_NORMAL_PIN = 18;
const int LED_ANOMALY_PIN = 19;
const int RELAY_TRIP_PIN = 13;

const int SAMPLE_WINDOW = 64; // สุ่มเก็บข้อมูล 64 จุดต่อรอบการวิเคราะห์
float rawBuffer[SAMPLE_WINDOW];

const float RMS_ANOMALY_THRESHOLD = 2.85; // ค่าเกิน 2.85 G ถือว่าผิดปกติ
const float P2P_ANOMALY_THRESHOLD = 4.20; // Peak-to-Peak เกิน 4.20 G

void extractFeatures(float* buffer, int size, float& mean, float& rms, float& p2p) {
  float sum = 0;
  float sumSq = 0;
  float minVal = 999.0;
  float maxVal = -999.0;

  for (int i = 0; i < size; i++) {
    sum += buffer[i];
    sumSq += (buffer[i] * buffer[i]);
    if (buffer[i] < minVal) minVal = buffer[i];
    if (buffer[i] > maxVal) maxVal = buffer[i];
  }

  mean = sum / size;
  rms = sqrt(sumSq / size);
  p2p = maxVal - minVal;
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_NORMAL_PIN, OUTPUT);
  pinMode(LED_ANOMALY_PIN, OUTPUT);
  pinMode(RELAY_TRIP_PIN, OUTPUT);

  digitalWrite(RELAY_TRIP_PIN, HIGH); // เริ่มต้นจ่ายไฟให้มอเตอร์
  digitalWrite(LED_NORMAL_PIN, HIGH);
  digitalWrite(LED_ANOMALY_PIN, LOW);

  Serial.println("\n--- LAB 13: TinyML On-Device Vibration Inference Engine Initialized ---");
}

void loop() {
  // 1. สุ่มเก็บข้อมูลการสั่นสะเทือนที่ความถี่ 500 Hz
  for (int i = 0; i < SAMPLE_WINDOW; i++) {
    int raw = analogRead(VIB_SENSOR_PIN);
    rawBuffer[i] = ((raw - 2048) / 2048.0) * 5.0; // แปลงเป็นค่าความเร่ง -5.0 ถึง +5.0 G
    delayMicroseconds(2000); // Sampling interval 2ms
  }

  // 2. สกัดฟีเจอร์ในหน่วยความจำของ MCU
  float mean, rms, p2p;
  extractFeatures(rawBuffer, SAMPLE_WINDOW, mean, rms, p2p);

  // 3. ทำการอนุมาน (Edge Inference)
  bool isAnomaly = (rms > RMS_ANOMALY_THRESHOLD) || (p2p > P2P_ANOMALY_THRESHOLD);

  // 4. แสดงผลและตัดการทำงานเพื่อความปลอดภัย
  if (isAnomaly) {
    digitalWrite(LED_NORMAL_PIN, LOW);
    digitalWrite(LED_ANOMALY_PIN, HIGH);
    digitalWrite(RELAY_TRIP_PIN, LOW); // ตัดไฟมอเตอร์ฉุกเฉิน
    Serial.printf("[EDGE AI ALERT] *** ANOMALY DETECTED! *** | RMS: %4.2f G | P2P: %4.2f G -> Motor TRIPPED\n", rms, p2p);
  } else {
    digitalWrite(LED_NORMAL_PIN, HIGH);
    digitalWrite(LED_ANOMALY_PIN, LOW);
    digitalWrite(RELAY_TRIP_PIN, HIGH);
    Serial.printf("[EDGE AI STATUS] NORMAL OPERATION | Mean: %+4.2f | RMS: %4.2f G | P2P: %4.2f G\n", mean, rms, p2p);
  }

  delay(500);
}
```
</div>
</div>

---

### 13.6.3 โค้ดตัวอย่างการตรวจจับความผิดปกติ (Local Anomaly Detection on ESP32)

เมื่อเราคอมไพล์และติดตั้งโมเดลจาก Edge Impulse ออกมาเป็นไลบรารีสำหรับ C++ (Arduino format) แล้ว ชิป ESP32 จะสามารถอ่านข้อมูลจากเซนเซอร์ตรวจวัดความสั่นสะเทือน (เช่น MPU6050 Accelerometer ผ่านโปรโตคอล I2C) นำมาเก็บลงบัฟเฟอร์สัญญาณ และเรียกใช้อัลกอริทึมทำนายความผิดปกติได้ภายในตัวบอร์ดเองโดยไม่ต้องเชื่อมต่อระบบภายนอก ดังตัวอย่างโค้ดด้านล่าง:

```cpp
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
// รวมไฟล์ส่วนหัวของไลบรารีอินเฟอเรนซ์ที่ดาวน์โหลดมาจาก Edge Impulse
#include <vibration_anomaly_detection_inference.h>

// จองอาเรย์สำหรับรับค่านำเข้าโมเดล (มีขนาดตามที่ระบุในไลบรารีพารามิเตอร์ของ Edge Impulse)
float features[EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE];

Adafruit_MPU6050 mpu;

// กำหนดพอร์ตขา GPIO สำหรับต่อไฟ LED แสดงสถานะ
#define LED_NORMAL 12    // ไฟสีเขียว แสดงสถานะปกติ
#define LED_ANOMALY 14   // ไฟสีแดง แสดงสถานะผิดปกติ

void setup() {
    Serial.begin(115200);
    pinMode(LED_NORMAL, OUTPUT);
    pinMode(LED_ANOMALY, OUTPUT);
    
    // เริ่มต้นใช้งานโมดูลวัดความเร่งและแรงเฉื่อย MPU6050
    if (!mpu.begin()) {
        Serial.println("❌ ไม่สามารถค้นหาชิป MPU6050 ได้");
        while (1) { delay(10); }
    }
    
    // ตั้งขอบเขตการวัดความเร่งที่ ±4g (เหมาะสำหรับการตรวจจับความสั่นสะเทือนมอเตอร์)
    mpu.setAccelerometerRange(MPU6050_RANGE_4_G);
    
    Serial.println("🟢 เริ่มระบบตรวจจับความผิดปกติแบบ TinyML...");
}

void loop() {
    Serial.println("✍️ กำลังบันทึกข้อมูลสัญญาณเซนเซอร์...");
    
    // 1. อ่านข้อมูลสัญญาณดิบแบบ Time-series จากเซนเซอร์ใส่ในบัฟเฟอร์
    for (size_t ix = 0; ix < EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE; ix += 3) {
        // คำนวณช่วงเวลาการเก็บข้อมูลย่อยถัดไป (เช่น ความถี่ 100Hz = ทุก ๆ 10 มิลลิวินาที)
        uint64_t next_tick = micros() + (EI_CLASSIFIER_INTERVAL_MS * 1000);
        
        sensors_event_t a, g, temp;
        mpu.getEvent(&a, &g, &temp);
        
        // บันทึกค่าลงอาเรย์ฟีเจอร์ [แกน X, แกน Y, แกน Z] ในหน่วยเมตรต่อวินาทีกำลังสอง (m/s^2)
        features[ix + 0] = a.acceleration.x;
        features[ix + 1] = a.acceleration.y;
        features[ix + 2] = a.acceleration.z;
        
        // หน่วงเวลาอย่างเที่ยงตรงด้วยลูปตรวจสอบค่า micros()
        while (micros() < next_tick) { /* รอให้ถึงรอบเวลาถัดไป */ }
    }
    
    // 2. หุ้มข้อมูลด้วยออบเจกต์โครงสร้างข้อมูลของ Edge Impulse
    signal_t signal;
    int err = numpy::signal_from_buffer(features, EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE, &signal);
    if (err != 0) {
        Serial.print("❌ ผิดพลาดในการเตรียมสัญญาณข้อมูล: ");
        Serial.println(err);
        return;
    }
    
    // 3. เรียกกระบวนการรันโมเดลทำนายบนชิป (Inference)
    ei_impulse_result_t result = { 0 };
    EI_IMPULSE_ERROR r = run_classifier(&signal, &result, false);
    if (r != EI_IMPULSE_OK) {
        Serial.print("❌ ผิดพลาดในการอินเฟอเรนซ์โมเดล: ");
        Serial.println(r);
        return;
    }
    
    // 4. วิเคราะห์ผลการจำแนกประเภท (Classification Output)
    Serial.println("\n===== สรุปผลการประเมินสัญญาณ =====");
    for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
        Serial.print("  📌 ");
        Serial.print(result.classification[ix].label);
        Serial.print(": ");
        Serial.println(result.classification[ix].value, 5);
    }
    
    // แสดงคะแนนความผิดปกติ (Anomaly Score) ที่ได้จากโมเดล Unsupervised Learning
    Serial.print("  ⚠️ Anomaly score: ");
    Serial.println(result.anomaly, 5);
    
    // 5. ตัดสินใจสั่งงานควบคุมอุปกรณ์ปลายทาง
    // เกณฑ์มาตรฐานจากโมเดล: หากค่า Anomaly เกินกว่า 0.3 หมายถึงตรวจพบรูปคลื่นผิดปกติ
    if (result.anomaly > 0.3) {
        digitalWrite(LED_ANOMALY, HIGH);
        digitalWrite(LED_NORMAL, LOW);
        Serial.println("🚨 คำเตือน: พบความผิดปกติในการสั่นสะเทือน!");
    } else {
        digitalWrite(LED_ANOMALY, LOW);
        digitalWrite(LED_NORMAL, HIGH);
        Serial.println("✅ สัญญาณปกติ: เครื่องจักรทำงานได้ราบรื่น");
    }
    
    delay(2000); // พักการทำนาย 2 วินาทีก่อนเริ่มเก็บสัญญาณรอบใหม่
}
```

การประมวลผลของโมเดลในการจำแนกสัญญาณจากข้อมูลตัวตรวจจับ สามารถแสดงการตอบสนองได้ตามภาพจำลองด้านล่างนี้:

<div style="text-align: center; margin: 25px 0;">
<svg viewBox="0 0 820 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>ระบบจำแนกและตรวจจับความผิดปกติแบบเรียลไทม์ (Anomaly Detection Classifier)</title>
  <defs>
    <clipPath id="scope-clip">
      <rect x="37" y="82" width="216" height="146" rx="6" />
    </clipPath>
    <path id="pathNormal" d="M 255 155 L 300 155 L 410 155 L 490 135 L 560 112"/>
    <path id="pathAnomaly" d="M 255 155 L 300 155 L 410 155 L 490 175 L 560 197"/>
  </defs>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .component { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    .text-main { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .text-sub { font-size: 11px; fill: #64748b; }
    .text-code { font-size: 11px; font-weight: 700; fill: #7c3aed; font-family: monospace; }
    .grid-line { stroke: #1e293b; stroke-width: 0.5; stroke-dasharray: 2 4; }
    
    /* Waves animation */
    .wave-normal {
      stroke: #16a34a;
      stroke-width: 3;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      animation: scrollWaveNormal 1.2s linear infinite, normalPhase 8s step-end infinite;
    }
    .wave-anomaly {
      stroke: #dc2626;
      stroke-width: 3;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      animation: scrollWaveAnomaly 0.5s linear infinite, anomalyPhase 8s step-end infinite;
    }
    @keyframes scrollWaveNormal {
      from { transform: translate(0, 0); }
      to { transform: translate(-80px, 0); }
    }
    @keyframes scrollWaveAnomaly {
      from { transform: translate(0, 0); }
      to { transform: translate(-80px, 0); }
    }
    
    /* Global Sync Phases */
    @keyframes normalPhase {
      0%, 50% { opacity: 1; visibility: visible; }
      50.01%, 100% { opacity: 0; visibility: hidden; }
    }
    @keyframes anomalyPhase {
      0%, 50% { opacity: 0; visibility: hidden; }
      50.01%, 100% { opacity: 1; visibility: visible; }
    }
    
    /* Box highlighting */
    .box-normal-bg {
      fill: #ffffff;
      stroke: #334155;
      stroke-width: 2;
      rx: 4px;
      animation: normalBoxActive 8s step-end infinite;
    }
    .box-anomaly-bg {
      fill: #ffffff;
      stroke: #334155;
      stroke-width: 2;
      rx: 4px;
      animation: anomalyBoxActive 8s step-end infinite;
    }
    @keyframes normalBoxActive {
      0%, 50% { fill: #faf5ff; stroke: #16a34a; stroke-width: 2.5; }
      50.01%, 100% { fill: #ffffff; stroke: #334155; stroke-width: 2; }
    }
    @keyframes anomalyBoxActive {
      0%, 50% { fill: #ffffff; stroke: #334155; stroke-width: 2; }
      50.01%, 100% { fill: #faf5ff; stroke: #dc2626; stroke-width: 2.5; }
    }
    
    /* Light bulbs glowing */
    .lamp-normal {
      stroke: #334155;
      stroke-width: 2;
      animation: lampNormalActive 8s step-end infinite;
    }
    .lamp-anomaly {
      stroke: #334155;
      stroke-width: 2;
      animation: lampAnomalyActive 8s step-end infinite;
    }
    @keyframes lampNormalActive {
      0%, 50% { fill: #16a34a; }
      50.01%, 100% { fill: #cbd5e1; }
    }
    @keyframes lampAnomalyActive {
      0%, 50% { fill: #cbd5e1; }
      50.01%, 100% { fill: #dc2626; }
    }
    
    /* Routing connections */
    .conn-normal {
      fill: none;
      animation: connNormalActive 8s step-end infinite;
    }
    .conn-anomaly {
      fill: none;
      animation: connAnomalyActive 8s step-end infinite;
    }
    @keyframes connNormalActive {
      0%, 50% { stroke: #16a34a; stroke-width: 3; }
      50.01%, 100% { stroke: #334155; stroke-width: 2.5; }
    }
    @keyframes connAnomalyActive {
      0%, 50% { stroke: #334155; stroke-width: 2.5; }
      50.01%, 100% { stroke: #dc2626; stroke-width: 3; }
    }
    
    /* Sync flowing dots */
    .flow-dot-normal {
      fill: #16a34a;
      animation: normalPhase 8s step-end infinite;
    }
    .flow-dot-anomaly {
      fill: #dc2626;
      animation: anomalyPhase 8s step-end infinite;
    }
    
    /* Text colors dynamic */
    .label-g { fill: #16a34a; font-weight: bold; }
    .label-r { fill: #dc2626; font-weight: bold; }
  </style>
  <rect x="5" y="5" width="810" height="330" class="bg"/>
  
  <!-- Title -->
  <text x="410" y="42" font-size="16" font-weight="700" fill="#1e293b" text-anchor="middle">ภาพที่ 10.2: การวิเคราะห์สัญญาณและตรวจจับความผิดปกติแบบเรียลไทม์บนชิป</text>
  
  <!-- Panel 1: Input Sensor -->
  <rect x="35" y="80" width="220" height="150" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  <text x="145" y="70" class="text-main" text-anchor="middle">สัญญาณสั่นดิบ (Raw Sensor Input)</text>
  
  <!-- Grid inside Oscilloscope -->
  <g clip-path="url(#scope-clip)">
    <line x1="37" y1="117" x2="253" y2="117" class="grid-line"/>
    <line x1="37" y1="155" x2="253" y2="155" class="grid-line"/>
    <line x1="37" y1="193" x2="253" y2="193" class="grid-line"/>
    <line x1="73" y1="82" x2="73" y2="228" class="grid-line"/>
    <line x1="110" y1="82" x2="110" y2="228" class="grid-line"/>
    <line x1="147" y1="82" x2="147" y2="228" class="grid-line"/>
    <line x1="184" y1="82" x2="184" y2="228" class="grid-line"/>
    <line x1="221" y1="82" x2="221" y2="228" class="grid-line"/>
    
    <!-- Waves -->
    <path d="M -80 155 Q -60 120, -40 155 T 0 155 T 40 155 T 80 155 T 120 155 T 160 155 T 200 155 T 240 155 T 280 155 T 320 155" class="wave-normal"/>
    <path d="M -80 155 L -70 95 L -60 215 L -50 110 L -40 155 L -30 95 L -20 215 L -10 110 L 0 155 L 10 95 L 20 215 L 30 110 L 40 155 L 50 95 L 60 215 L 70 110 L 80 155 L 90 95 L 100 215 L 110 110 L 120 155 L 130 95 L 140 215 L 150 110 L 160 155 L 170 95 L 180 215 L 190 110 L 200 155 L 210 95 L 220 215 L 230 110 L 240 155 L 250 95 L 260 215 L 270 110 L 280 155 L 290 95 L 300 215 L 310 110 L 320 155" class="wave-anomaly"/>
  </g>
  
  <!-- Wave status Labels -->
  <text x="145" y="255" class="text-val-normal label-g" text-anchor="middle">สภาวะ: ปกติ (สัญญาณคงที่ 1.0g)</text>
  <text x="145" y="255" class="text-val-anomaly label-r" text-anchor="middle">สภาวะ: ผิดปกติ! (แกว่งตัวสูงถึง 3.2g)</text>
  
  <!-- Panel 2: TinyML Classifier Block -->
  <rect x="300" y="80" width="220" height="150" rx="8" class="box"/>
  <text x="410" y="70" class="text-main" text-anchor="middle">ตัวจำแนกประเภท (TinyML Classifier)</text>
  <text x="410" y="103" font-size="11" font-weight="700" fill="#7c3aed" text-anchor="middle">Neural Network (Int8)</text>
  
  <!-- Neural Net nodes inside the block -->
  <!-- Inputs -->
  <circle cx="335" cy="135" r="4.5" fill="#3b82f6"/>
  <circle cx="335" cy="175" r="4.5" fill="#3b82f6"/>
  <!-- Hiddens -->
  <circle cx="410" cy="120" r="4.5" fill="#a78bfa"/>
  <circle cx="410" cy="155" r="4.5" fill="#a78bfa"/>
  <circle cx="410" cy="190" r="4.5" fill="#a78bfa"/>
  <!-- Outputs -->
  <circle cx="485" cy="135" r="4.5" fill="#16a34a"/>
  <circle cx="485" cy="175" r="4.5" fill="#dc2626"/>
  
  <!-- Lines -->
  <line x1="335" y1="135" x2="410" y2="120" stroke="#334155" stroke-width="1.5"/>
  <line x1="335" y1="135" x2="410" y2="155" stroke="#334155" stroke-width="1.5"/>
  <line x1="335" y1="175" x2="410" y2="155" stroke="#334155" stroke-width="1.5"/>
  <line x1="335" y1="175" x2="410" y2="190" stroke="#334155" stroke-width="1.5"/>
  
  <line x1="410" y1="120" x2="485" y2="135" stroke="#334155" stroke-width="1.5"/>
  <line x1="410" y1="155" x2="485" y2="135" stroke="#334155" stroke-width="1.5"/>
  <line x1="410" y1="155" x2="485" y2="175" stroke="#334155" stroke-width="1.5"/>
  <line x1="410" y1="190" x2="485" y2="175" stroke="#334155" stroke-width="1.5"/>

  <!-- Connector routes -->
  <path d="M 520 155 C 535 155, 540 112, 560 112" class="conn-normal"/>
  <path d="M 520 155 C 535 155, 540 197, 560 197" class="conn-anomaly"/>
  
  <!-- Running dots -->
  <circle r="4.5" class="flow-dot-normal">
    <animateMotion dur="2s" repeatCount="indefinite">
      <mpath href="#pathNormal"/>
    </animateMotion>
  </circle>
  <circle r="4.5" class="flow-dot-anomaly">
    <animateMotion dur="1s" repeatCount="indefinite">
      <mpath href="#pathAnomaly"/>
    </animateMotion>
  </circle>

  <!-- Panel 3: Output Results -->
  <text x="670" y="70" class="text-main" text-anchor="middle">ผลการวิเคราะห์อินเฟอเรนซ์</text>
  
  <!-- Normal Result Box -->
  <g transform="translate(0, 0)">
    <rect x="560" y="80" width="220" height="65" class="box-normal-bg"/>
    <circle cx="585" cy="112.5" r="10" class="lamp-normal"/>
    <text x="608" y="112" class="text-main">สถานะปกติ (Normal)</text>
    <text x="608" y="130" class="text-sub">ความมั่นใจ: 98.4% | Anomaly Score: 0.05</text>
  </g>
  
  <!-- Anomaly Result Box -->
  <g transform="translate(0, 0)">
    <rect x="560" y="165" width="220" height="65" class="box-anomaly-bg"/>
    <circle cx="585" cy="197.5" r="10" class="lamp-anomaly"/>
    <text x="608" y="197" class="text-main">พบความผิดปกติ! (Anomaly)</text>
    <text x="608" y="215" class="text-sub">ความมั่นใจ: 95.1% | Anomaly Score: 0.85</text>
  </g>
</svg>
<div style="font-size: 12px; color: #64748b; margin-top: 8px;">ภาพที่ 10.2 แสดงการแยกสถานะเมื่อรับข้อมูลคลื่นความถี่จากเซนเซอร์ หากตรวจเจอการสั่นคลื่นความสั่นสะเทือนรุนแรงผิดปกติ ระบบจะปรับสัญญาณไฟแจ้งเตือนทันที</div>
</div>

---

## 13.7 ตัวอย่างการประยุกต์ใช้งาน

### 13.1 จำแนกสภาพเครื่องจักรจากความสั่นสะเทือน (Vibration-Based Machine Condition Monitoring)

**สถานการณ์**: โรงงานมีมอเตอร์ 50 ตัว ต้องการรู้ว่าตัวไหน "กำลังจะเสีย" ก่อนที่จะเสียจริง

**วิธีการ**:
1. ติด Accelerometer (เช่น ADXL345) ไว้ที่ตัวเรือนมอเตอร์
2. เก็บข้อมูลความสั่นสะเทือนตอนมอเตอร์ **ปกติ** และตอน **ผิดปกติ** (เช่น ลูกปืนสึกหรอ)
3. สกัดฟีเจอร์: Mean, Std, RMS, Peak Frequency
4. ฝึกโมเดล Decision Tree หรือ k-NN
5. Deploy ลง ESP32 → ตรวจสอบแบบเรียลไทม์

### 13.2 ตรวจจับความผิดปกติ (Anomaly Detection)

**สถานการณ์**: ระบบ IoT ในอาคาร ต้องการตรวจจับเหตุการณ์ผิดปกติ เช่น อุณหภูมิพุ่งสูงผิดธรรมชาติ

**วิธีการ**:
- ฝึกโมเดลด้วยข้อมูล "ปกติ" เท่านั้น (One-Class Classification)
- เมื่อข้อมูลใหม่เบี่ยงเบนจากรูปแบบปกติมาก → แจ้งเตือน
- ใช้เทคนิคง่าย ๆ เช่น ดูว่าค่าอยู่นอกช่วง Mean ± 3×Std หรือไม่ หรือใช้ Isolation Forest

---

## 13.8 ตัวอย่างโค้ด Python บน Google Colab

ตัวอย่างนี้สร้างข้อมูลเซนเซอร์จำลอง แล้วใช้ **Decision Tree** จำแนกสภาพเครื่องจักร (ปกติ / ผิดปกติ) ด้วย scikit-learn

```python
# ============================================================
# Chapter 13 Demo: จำแนกสภาพเครื่องจักรจากข้อมูลเซนเซอร์
# รันบน Google Colab ได้เลย (scikit-learn ติดตั้งไว้แล้ว)
# ============================================================

import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report

# --- 1. สร้างข้อมูลจำลอง (Simulated Sensor Data) ---
np.random.seed(42)
n_samples = 200

# เครื่องจักรปกติ: สั่นน้อย อุณหภูมิต่ำ
normal_vibration = np.random.normal(loc=0.5, scale=0.15, size=n_samples)
normal_temp      = np.random.normal(loc=45,  scale=5,    size=n_samples)

# เครื่องจักรผิดปกติ: สั่นมาก อุณหภูมิสูง
faulty_vibration = np.random.normal(loc=1.8, scale=0.3,  size=n_samples)
faulty_temp      = np.random.normal(loc=72,  scale=8,    size=n_samples)

# รวมข้อมูล
X = np.column_stack([
    np.concatenate([normal_vibration, faulty_vibration]),
    np.concatenate([normal_temp, faulty_temp])
])
y = np.array([0]*n_samples + [1]*n_samples)  # 0=ปกติ, 1=ผิดปกติ

# --- 2. แบ่งชุดข้อมูล Train / Test (80/20) ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# --- 3. ฝึกโมเดล Decision Tree ---
model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X_train, y_train)

# --- 4. ประเมินผล ---
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2%}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred,
      target_names=["ปกติ (Normal)", "ผิดปกติ (Faulty)"]))

# --- 5. ทดสอบกับข้อมูลใหม่ ---
new_data = np.array([[0.6, 47],    # น่าจะปกติ
                      [2.1, 78]])   # น่าจะผิดปกติ
predictions = model.predict(new_data)
labels = ["ปกติ" if p == 0 else "ผิดปกติ" for p in predictions]
print("\n--- ทดสอบข้อมูลใหม่ ---")
for i, (data, label) in enumerate(zip(new_data, labels)):
    print(f"  ตัวอย่างที่ {i+1}: vibration={data[0]:.1f}g, "
          f"temp={data[1]:.0f}°C → {label}")
```

**ผลลัพธ์ที่คาดหวัง** (ค่าอาจแตกต่างเล็กน้อย):

```
Accuracy: 98.75%

Classification Report:
                     precision    recall  f1-score   support
   ปกติ (Normal)        0.97      1.00      0.99        37
ผิดปกติ (Faulty)        1.00      0.98      0.99        43

--- ทดสอบข้อมูลใหม่ ---
  ตัวอย่างที่ 1: vibration=0.6g, temp=47°C → ปกติ
  ตัวอย่างที่ 2: vibration=2.1g, temp=78°C → ผิดปกติ
```

> 💡 **ลองต่อยอด**: เปลี่ยนจาก `DecisionTreeClassifier` เป็น `KNeighborsClassifier(n_neighbors=5)` แล้วเปรียบเทียบ Accuracy ดูว่าอัลกอริทึมไหนให้ผลดีกว่า

---

</div>

<div class="chapter-tab-content" data-tab-name="Reference / Summary" data-tab-icon="📊" id="waveform" markdown="1">

## สรุปประจำบท (Summary)

- **Machine Learning** คือการให้คอมพิวเตอร์เรียนรู้จากข้อมูลแทนการเขียนกฎ ซึ่งเป็นสาขาย่อยของ AI
- การเรียนรู้มี 3 ประเภทหลัก: **Supervised** (มีคำตอบกำกับ), **Unsupervised** (ไม่มีคำตอบ), และ **Reinforcement** (เรียนจากรางวัล/โทษ)
- ขั้นตอนสำคัญ: เก็บข้อมูล → เตรียมข้อมูล → แบ่ง Train/Test → ฝึก → ประเมินผล
- **Feature Engineering** ช่วยแปลงข้อมูลดิบจากเซนเซอร์ให้เป็นตัวแปรที่มีความหมาย เช่น Mean, Std, RMS
- อัลกอริทึมเบื้องต้น ได้แก่ k-NN, Decision Tree, Linear/Logistic Regression
- **TinyML** ทำให้สามารถรันโมเดล ML บน ESP32 หรือ Arduino ได้ โดยใช้ TensorFlow Lite Micro หรือ Edge Impulse
- การประยุกต์ใช้ในงานวิศวกรรม เช่น ตรวจสอบสภาพเครื่องจักร และ ตรวจจับความผิดปกติ

---

</div>

<div class="chapter-tab-content" data-tab-name="Challenge" data-tab-icon="🏆" id="challenge" markdown="1">

## แบบฝึกหัดท้ายบท (Exercises)

**ข้อ 1** (ทบทวนความเข้าใจ): จงอธิบายความแตกต่างระหว่างการเขียนโปรแกรมแบบ Rule-Based กับ Machine Learning พร้อมยกตัวอย่างสถานการณ์ IoT ที่ ML เหมาะกว่า

**ข้อ 2** (จำแนกประเภท): งานต่อไปนี้จัดเป็น Supervised, Unsupervised หรือ Reinforcement Learning? จงอธิบายเหตุผล
- (ก) จำแนกว่าสินค้าบนสายพานเป็น "ผ่าน" หรือ "ไม่ผ่าน" จากภาพถ่าย
- (ข) จัดกลุ่มลูกค้าที่ใช้ไฟฟ้ารูปแบบคล้ายกัน โดยไม่มีข้อมูลหมวดหมู่ล่วงหน้า
- (ค) หุ่นยนต์เรียนรู้จับชิ้นงานที่มีรูปร่างต่าง ๆ โดยได้คะแนนเมื่อจับสำเร็จ

**ข้อ 3** (Feature Engineering): สมมติท่านเก็บข้อมูลจากเซนเซอร์วัดกระแสไฟฟ้ามอเตอร์ ได้ค่า 500 จุดต่อวินาที ถ้าต้องสร้างฟีเจอร์เพื่อจำแนกสภาพมอเตอร์ ท่านจะเลือกฟีเจอร์ใดบ้าง อย่างน้อย 4 ตัว พร้อมอธิบายเหตุผล

**ข้อ 4** (ปฏิบัติ — Colab): นำโค้ดในหัวข้อ 13.8 ไปรันบน Google Colab จากนั้น:
- (ก) เปลี่ยนอัลกอริทึมเป็น `KNeighborsClassifier` แล้วเปรียบเทียบ Accuracy
- (ข) ลองเพิ่มฟีเจอร์ที่ 3 เช่น `vibration * temp` (interaction feature) แล้วดูว่า Accuracy เปลี่ยนแปลงหรือไม่

**ข้อ 5** (Train/Test Split): ถ้าเรามีข้อมูลเซนเซอร์ 1,000 ตัวอย่าง แล้วแบ่ง Train 95% / Test 5% กับ Train 50% / Test 50% แต่ละแบบมีข้อดี-ข้อเสียอย่างไร? อัตราส่วนที่นิยมคือเท่าไร เพราะอะไร?

</div>
