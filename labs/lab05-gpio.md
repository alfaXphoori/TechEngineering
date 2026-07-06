# 🔬 Lab 5: GPIO เบื้องต้นด้วย ESP32 + Wokwi

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**เครื่องมือ:** Wokwi Simulator ([https://wokwi.com](https://wokwi.com))  
**ระยะเวลา:** 3 ชั่วโมง  

---

## วัตถุประสงค์

- อธิบายหลักการทำงานของ GPIO (General Purpose Input/Output) บนบอร์ด ESP32 ได้
- ใช้ฟังก์ชัน `pinMode()`, `digitalWrite()` และ `digitalRead()` ควบคุมอุปกรณ์อินพุต/เอาต์พุตได้
- ออกแบบวงจรบนโปรแกรมจำลอง Wokwi เชื่อมต่อ LED และปุ่มกด (Push Button) ได้
- เขียนโปรแกรมควบคุม LED หลายดวงในรูปแบบต่าง ๆ เช่น Blink, Toggle และ LED Chaser ได้

---

## ส่วนที่ 1: LED Blink — สัญญาณไฟกะพริบ (20 นาที)

1. เปิด Wokwi แล้วสร้างโปรเจกต์ใหม่ เลือกบอร์ด **ESP32**
2. ต่อวงจร: LED ขาบวก (Anode) → ตัวต้านทาน 220Ω → **GPIO 2** และขาลบ (Cathode) → **GND**
3. เขียนโค้ดด้านล่างลงในเอดิเตอร์ของ Wokwi

```cpp
#define LED_PIN 2

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
  Serial.println("=== Lab 4: Blink Start ===");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED ON");
  delay(1000);

  digitalWrite(LED_PIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}
```

4. กดปุ่ม **Start Simulation** แล้วสังเกตผล
5. ทดลองเปลี่ยนค่า `delay()` เป็น 250, 500 และ 2000 มิลลิวินาที บันทึกผลในตาราง

| ค่า delay (ms) | LED กะพริบเร็ว/ช้า | จำนวนครั้งที่กะพริบใน 10 วินาที |
|:-:|:-:|:-:|
| 250 | | |
| 500 | | |
| 1000 | | |
| 2000 | | |

---

## ส่วนที่ 2: ควบคุม LED ด้วยปุ่มกด — Toggle (30 นาที)

1. เพิ่ม **Push Button** เข้าวงจร: ขาหนึ่งต่อ **GPIO 4** อีกขาต่อ **GND**
2. LED ยังคงต่ออยู่ที่ **GPIO 2** เหมือนส่วนที่ 1
3. แนวคิด: กดปุ่มครั้งแรก → LED ติด, กดอีกครั้ง → LED ดับ (Toggle)

```cpp
#define LED_PIN    2
#define BUTTON_PIN 4

bool ledState = false;
bool lastButtonState = HIGH;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(115200);
}

void loop() {
  bool currentButtonState = digitalRead(BUTTON_PIN);

  // ตรวจจับขอบขาลง (Falling Edge) = ปุ่มถูกกด
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    ledState = !ledState;
    digitalWrite(LED_PIN, ledState);
    Serial.print("Toggle -> LED ");
    Serial.println(ledState ? "ON" : "OFF");
    delay(50); // debounce
  }

  lastButtonState = currentButtonState;
}
```

4. รันจำลองแล้วทดสอบกดปุ่มหลาย ๆ ครั้ง บันทึกผล

| ครั้งที่กด | สถานะ LED (ON/OFF) | ค่า Serial Monitor |
|:-:|:-:|:-:|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |

5. **คำถาม:** ทำไมจึงต้องใช้ `INPUT_PULLUP` แทน `INPUT` ธรรมดา?  
   **ตอบ:** .....................................................

---

## ส่วนที่ 3: ไฟวิ่ง — LED Chaser (40 นาที)

1. ต่อ LED 4 ดวง พร้อมตัวต้านทาน 220Ω ที่ **GPIO 2, 4, 5, 18**
2. เขียนโปรแกรมให้ LED ติดทีละดวงเรียงจากซ้ายไปขวาแล้ววนกลับ

```cpp
const int ledPins[] = {2, 4, 5, 18};
const int NUM_LEDS  = 4;

void setup() {
  for (int i = 0; i < NUM_LEDS; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
  Serial.begin(115200);
  Serial.println("=== LED Chaser Start ===");
}

void loop() {
  // วิ่งไปทางขวา
  for (int i = 0; i < NUM_LEDS; i++) {
    digitalWrite(ledPins[i], HIGH);
    delay(200);
    digitalWrite(ledPins[i], LOW);
  }
  // วิ่งกลับทางซ้าย
  for (int i = NUM_LEDS - 2; i > 0; i--) {
    digitalWrite(ledPins[i], HIGH);
    delay(200);
    digitalWrite(ledPins[i], LOW);
  }
}
```

3. รันจำลองแล้วสังเกตลำดับการติดของ LED
4. **ทดลองเพิ่มเติม:** ปรับค่า `delay()` เป็น 100 ms แล้วเปรียบเทียบความเร็ว

| ค่า delay (ms) | ความเร็วที่สังเกตได้ | ครบรอบใช้เวลาประมาณ (วินาที) |
|:-:|:-:|:-:|
| 100 | | |
| 200 | | |
| 500 | | |

---

## ส่วนที่ 4: อ่านสถานะปุ่มหลายปุ่ม (30 นาที)

1. ต่อ **Push Button 3 ตัว** ที่ **GPIO 12, 13, 14** (ต่อกับ GND)
2. ต่อ **LED 1 ดวง** ที่ **GPIO 2**
3. เขียนโปรแกรมอ่านสถานะปุ่มทั้ง 3 แล้วแสดงผลใน Serial Monitor

```cpp
#define LED_PIN 2
const int btnPins[] = {12, 13, 14};
const int NUM_BTNS  = 3;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  for (int i = 0; i < NUM_BTNS; i++) {
    pinMode(btnPins[i], INPUT_PULLUP);
  }
  Serial.begin(115200);
}

void loop() {
  int pressedCount = 0;

  for (int i = 0; i < NUM_BTNS; i++) {
    bool state = digitalRead(btnPins[i]);
    Serial.print("BTN");
    Serial.print(i + 1);
    Serial.print(state == LOW ? ":PRESSED " : ":RELEASED ");

    if (state == LOW) pressedCount++;
  }
  Serial.println();

  // LED ติดเมื่อกดปุ่มครบทั้ง 3 ตัวพร้อมกัน
  digitalWrite(LED_PIN, pressedCount == NUM_BTNS ? HIGH : LOW);

  delay(200);
}
```

4. ทดสอบกดปุ่มทีละตัวและกดพร้อมกัน บันทึกผล

| สถานะปุ่ม (กด = ✓) | BTN1 | BTN2 | BTN3 | LED ติด? |
|:-:|:-:|:-:|:-:|:-:|
| กดปุ่ม 1 อย่างเดียว | ✓ | | | |
| กดปุ่ม 2 อย่างเดียว | | ✓ | | |
| กดปุ่ม 1 + 3 | ✓ | | ✓ | |
| กดครบ 3 ปุ่ม | ✓ | ✓ | ✓ | |

---

## แบบฝึกหัดท้ายใบงาน

1. ฟังก์ชัน `pinMode()` มีโหมดการตั้งค่ากี่แบบ? ระบุชื่อและอธิบายสั้น ๆ  
   **ตอบ:** .....................................................

2. จงอธิบายความแตกต่างระหว่าง `INPUT` กับ `INPUT_PULLUP` พร้อมวาดแผนภาพวงจรประกอบ  
   **ตอบ:** .....................................................

3. ถ้าต้องการให้ LED Chaser (ส่วนที่ 3) วิ่งเฉพาะทางเดียว (ซ้ายไปขวา) แล้ววนซ้ำ ต้องแก้โค้ดตรงไหน? เขียนโค้ดที่แก้ไข  
   **ตอบ:** .....................................................

4. ในส่วนที่ 4 ถ้าต้องการเปลี่ยนเงื่อนไขเป็น "LED ติดเมื่อกดปุ่ม **อย่างน้อย 1 ตัว**" ต้องแก้เงื่อนไขอย่างไร?  
   **ตอบ:** .....................................................

5. **โจทย์ท้าทาย:** จงเขียนโปรแกรมบน Wokwi ให้ปุ่มกดเลือกรูปแบบไฟวิ่ง — กดครั้งแรก: วิ่งซ้าย-ขวา, กดครั้งที่สอง: กะพริบพร้อมกันทุกดวง วาง URL โปรเจกต์ Wokwi ในช่องด้านล่าง  
   **URL:** .....................................................

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **[ลิงก์ Google Form ของรายวิชา]**

**สิ่งที่ต้องส่ง:**
1. ภาพหน้าจอ (Screenshot) ผลการทดลองแต่ละส่วน พร้อม Serial Monitor
2. ลิงก์โปรเจกต์ Wokwi ที่ตั้งเป็น Public แต่ละส่วน (คลิก Share → Copy Link)
3. ใบงานที่กรอกตาราง คำตอบ และแบบฝึกหัดครบถ้วน

### Checklist ก่อนส่ง

- [ ] ส่วนที่ 1: โค้ด Blink ทำงานได้ + กรอกตารางค่า delay ครบ
- [ ] ส่วนที่ 2: Toggle LED ด้วยปุ่มทำงานถูกต้อง + กรอกตาราง + ตอบคำถาม
- [ ] ส่วนที่ 3: LED Chaser วิ่งไป-กลับ + กรอกตารางความเร็ว
- [ ] ส่วนที่ 4: อ่านปุ่ม 3 ตัว + กรอกตารางสถานะครบ
- [ ] ตอบแบบฝึกหัดท้ายใบงานครบทุกข้อ
- [ ] แนบ Screenshot + ลิงก์ Wokwi ทุกส่วน
- [ ] ตรวจสอบลิงก์ Wokwi ว่าเปิดได้ (ตั้งเป็น Public)
