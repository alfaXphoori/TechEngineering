# 🔬 Lab 15: Machine Learning สำหรับข้อมูลเซนเซอร์

**รายวิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
**หลักสูตร:** วิศวกรรมเครื่องกล ชั้นปีที่ 1  
**เครื่องมือ:** Wokwi Simulator + Google Colab (Python / scikit-learn)  
**เวลา:** 3 ชั่วโมง

---

## วัตถุประสงค์

- อธิบายแนวคิด Supervised Learning และ ML Pipeline (เก็บข้อมูล → เตรียม → ฝึก → ประเมิน) ได้
- เขียนโค้ด ESP32 บน Wokwi เพื่อเก็บข้อมูลเซนเซอร์สำหรับสร้าง Dataset ได้
- สร้างและประเมินโมเดล Classification ด้วย Python บน Google Colab ได้
- เปรียบเทียบอัลกอริทึม k-NN และ Decision Tree ได้
- อธิบายแนวคิด TinyML / Edge AI และประโยชน์สำหรับงานวิศวกรรมได้

---

## ส่วนที่ 1: เก็บข้อมูลเซนเซอร์ความสั่นสะเทือน (45 นาที)

### ความรู้เบื้องต้น

ในงานวิศวกรรมเครื่องกล **การตรวจสอบสภาพเครื่องจักร (Condition Monitoring)** จากความสั่นสะเทือนเป็นแนวทางสำคัญที่ช่วยทำนายความเสื่อมสภาพก่อนที่เครื่องจะเสีย (Predictive Maintenance)

เซนเซอร์ **HC-SR04 (Ultrasonic)** ในแล็บนี้ใช้จำลองการวัดระยะทางระหว่างเครื่องจักรกับชิ้นงาน ซึ่งเป็นสัญญาณที่สะท้อนสภาวะการทำงาน 2 สภาวะ:
- **สภาวะ A (Label = 0)**: ระยะใกล้ (< 50 cm) — จำลองสภาวะ "เครื่องจักรปกติ กำลังทำงานกับชิ้นงาน"
- **สภาวะ B (Label = 1)**: ระยะไกล (> 100 cm) — จำลองสภาวะ "ไม่มีชิ้นงาน หรือชิ้นงานเยื้อง"

Machine Learning จะ "เรียน" ว่าค่าระยะทางใดบ่งบอกสภาวะใด จากข้อมูลตัวอย่างที่เราป้อนให้ (Supervised Learning — เพราะเราบอก Label ไว้)

หลัก **Train/Test Split**: แบ่งข้อมูลออกเป็น 2 ส่วน — ส่วน Train ใช้สอนโมเดล, ส่วน Test ใช้ทดสอบว่าโมเดล "ทำนาย" ข้อมูลใหม่ได้ดีแค่ไหน ไม่ควรใช้ข้อมูลชุดเดียวกันทั้งสอง เพราะโมเดลจะ "จำ" แทน "เรียนรู้" (Overfitting)

### ขั้นตอนปฏิบัติ

**ต่อวงจร HC-SR04 บน Wokwi:**

| ขา HC-SR04 | ขา ESP32 |
|:---|:---|
| VCC | 5V |
| GND | GND |
| TRIG | GPIO 5 |
| ECHO | GPIO 18 |

เขียนโค้ดอ่านค่าระยะทางใน `sketch.ino`:

```cpp
#define TRIG_PIN 5
#define ECHO_PIN 18

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.println("=== เก็บข้อมูล HC-SR04 ===");
  Serial.println("ระยะทาง (cm)");
}

void loop() {
  // สร้างสัญญาณ Trigger 10 µs
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // อ่านเวลา Echo และคำนวณระยะทาง
  // สูตร: distance = duration × speed_of_sound / 2
  // speed_of_sound ≈ 0.034 cm/µs (ที่อุณหภูมิห้อง 25°C)
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2.0;

  // พิมพ์เฉพาะตัวเลขเพื่อให้คัดลอกสะดวก
  if (distance > 2 && distance < 400) {
    Serial.println(distance, 1);
  } else {
    Serial.println("ERROR"); // ค่าอยู่นอกช่วงวัด
  }
  delay(300); // ส่งข้อมูล ~3 ครั้ง/วินาที
}
```

**เก็บข้อมูล 2 สภาวะ:**

1. กด **Start Simulation** → เปิด Serial Monitor
2. **สภาวะ A**: คลิกที่ HC-SR04 ใน Wokwi → ปรับแถบระยะทางเป็น **20–40 cm** → คัดลอกตัวเลขจาก Serial Monitor **30 ค่า** บันทึกไว้
3. **สภาวะ B**: ปรับแถบระยะทางเป็น **150–300 cm** → คัดลอกอีก **30 ค่า**
4. เปิด Google Sheets → สร้างตาราง 2 คอลัมน์:
   - คอลัมน์ A: `Distance` — ใส่ค่าทั้งหมด (สภาวะ A ก่อน แล้วตามด้วยสภาวะ B)
   - คอลัมน์ B: `Label` — ใส่ `0` สำหรับสภาวะ A และ `1` สำหรับสภาวะ B
5. ดาวน์โหลดเป็น CSV ตั้งชื่อ `sensor_data.csv`

### สังเกต/วิเคราะห์

- ค่า `duration` (microseconds) ที่อ่านได้สำหรับระยะ 20 cm ควรเท่าใด? (คำนวณจากสูตร)
- ถ้าค่าที่อ่านได้มีความผันผวน (เช่น 22.5, 21.8, 23.1) ควรเก็บทุกค่าหรือ filter ก่อน? ทำไม?

### ตารางบันทึกผล — ส่วนที่ 1

| สภาวะ | ช่วงระยะทางที่ตั้ง (cm) | ค่าเฉลี่ยโดยประมาณ | จำนวนค่าที่เก็บได้ |
|:---|:---:|:---:|:---:|
| สภาวะ A (Label=0) | ______ | ______ | ______ |
| สภาวะ B (Label=1) | ______ | ______ | ______ |

---

## ส่วนที่ 2: สร้างโมเดล ML บน Google Colab — k-NN (40 นาที)

### ความรู้เบื้องต้น

**k-Nearest Neighbors (k-NN)** เป็นอัลกอริทึมที่เข้าใจง่ายที่สุด: เมื่อได้ข้อมูลใหม่ มองหา k เพื่อนบ้านที่ใกล้ที่สุดในชุดข้อมูล Train แล้วโหวตเสียงข้างมาก เช่น ถ้า k=3 และเพื่อนบ้าน 2 ใน 3 คือ Label=0 → ทำนายว่า Label=0

ความแม่นยำ (Accuracy) คือสัดส่วนที่โมเดลทำนายถูกต้อง:

$$\text{Accuracy} = \frac{\text{จำนวนที่ทำนายถูก}}{\text{จำนวนทั้งหมดในชุด Test}} \times 100\%$$

**Classification Report** แสดงรายละเอียดเพิ่มเติม:
- **Precision**: จากที่ทำนายว่าเป็น Class X มีถูกต้องกี่ %
- **Recall**: จากที่เป็น Class X จริง ทำนายถูกกี่ %
- **F1-score**: ค่าเฉลี่ยฮาร์โมนิกของ Precision และ Recall

### ขั้นตอนปฏิบัติ

1. เปิด [Google Colab](https://colab.research.google.com) → สร้าง Notebook ใหม่
2. อัปโหลดไฟล์ `sensor_data.csv`: คลิกไอคอนโฟลเดอร์ซ้ายมือ → ปุ่มอัปโหลด
3. สร้างเซลล์โค้ดใหม่และรันโค้ดต่อไปนี้:

```python
# ====================================================
# Lab 15 — ส่วนที่ 2: จำแนกสภาวะด้วย k-NN
# ====================================================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. โหลด Dataset
df = pd.read_csv('sensor_data.csv')
print("=== ตัวอย่าง 5 แถวแรก ===")
print(df.head())
print(f"\nจำนวนข้อมูลทั้งหมด: {len(df)} แถว")
print(f"การกระจายของ Label:\n{df['Label'].value_counts()}")

# 2. แยก Feature (X) และ Target (y)
X = df[['Distance']]  # Feature: ระยะทาง
y = df['Label']       # Target: 0=สภาวะ A, 1=สภาวะ B

# 3. แบ่ง Train/Test (70% train, 30% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)
print(f"\nข้อมูล Train: {len(X_train)} ตัวอย่าง")
print(f"ข้อมูล Test:  {len(X_test)} ตัวอย่าง")

# 4. ฝึกโมเดล k-NN ด้วย k=3
model_knn3 = KNeighborsClassifier(n_neighbors=3)
model_knn3.fit(X_train, y_train)

# 5. ทำนายและประเมินผล
pred_knn3 = model_knn3.predict(X_test)
acc_knn3  = accuracy_score(y_test, pred_knn3)

print(f"\n=== ผลลัพธ์ k-NN (k=3) ===")
print(f"ความแม่นยำ (Accuracy): {acc_knn3 * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, pred_knn3,
      target_names=["สภาวะ A (ปกติ)", "สภาวะ B (ผิดปกติ)"]))

# 6. ทดสอบกับค่าใหม่ที่ไม่ได้อยู่ใน Dataset
new_readings = pd.DataFrame({'Distance': [25.0, 200.0, 45.0, 180.0]})
pred_new = model_knn3.predict(new_readings)
labels   = {0: "สภาวะ A (ปกติ)", 1: "สภาวะ B (ผิดปกติ)"}

print("\n=== ทำนายจากค่าใหม่ ===")
for dist, label_id in zip(new_readings['Distance'], pred_new):
    print(f"  ระยะ {dist:.1f} cm → {labels[label_id]}")
```

4. บันทึก Accuracy ของ k-NN (k=3) ลงตารางด้านล่าง
5. **ทดลองเพิ่ม**: สร้างเซลล์ใหม่ เปลี่ยน `n_neighbors=5` และ `n_neighbors=7` → บันทึกผล

### ตารางบันทึกผล — ส่วนที่ 2

| การทดลอง | จำนวนข้อมูล Train | จำนวนข้อมูล Test | k | Accuracy (%) |
|:---|:---:|:---:|:---:|:---:|
| k-NN (k=3) | ______ | ______ | 3 | ______ |
| k-NN (k=5) | ______ | ______ | 5 | ______ |
| k-NN (k=7) | ______ | ______ | 7 | ______ |

---

## ส่วนที่ 3: เปรียบเทียบโมเดล — Decision Tree (35 นาที)

### ความรู้เบื้องต้น

**Decision Tree** สร้างกฎการตัดสินใจเป็นโครงสร้างต้นไม้ สำหรับข้อมูลง่าย ๆ เช่นในแล็บนี้ (Feature เดียว) ต้นไม้จะถามคำถามเดียว เช่น:

```
"Distance <= 75 cm?"
├─ ใช่  → Label = 0 (สภาวะ A)
└─ ไม่ใช่ → Label = 1 (สภาวะ B)
```

ข้อดีของ Decision Tree: **อธิบายได้ (Explainable)** — วิศวกรสามารถตรวจสอบว่าโมเดลตัดสินใจอย่างไร ซึ่งสำคัญมากในงานอุตสาหกรรมที่ต้องการความน่าเชื่อถือ

### ขั้นตอนปฏิบัติ

สร้างเซลล์ใหม่ใน Colab รันโค้ด:

```python
# ====================================================
# Lab 15 — ส่วนที่ 3: Decision Tree + Visualization
# ====================================================

from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# ฝึกโมเดล Decision Tree (X_train, y_train จากส่วนที่ 2)
model_dt = DecisionTreeClassifier(max_depth=3, random_state=42)
model_dt.fit(X_train, y_train)

# ประเมินผล
pred_dt = model_dt.predict(X_test)
acc_dt  = accuracy_score(y_test, pred_dt)

print(f"=== Decision Tree (max_depth=3) ===")
print(f"ความแม่นยำ (Accuracy): {acc_dt * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, pred_dt,
      target_names=["สภาวะ A (ปกติ)", "สภาวะ B (ผิดปกติ)"]))

# แสดงโครงสร้างต้นไม้ (Explainability)
print("\n=== โครงสร้างการตัดสินใจของ Decision Tree ===")
tree_rules = export_text(model_dt, feature_names=['Distance'])
print(tree_rules)

# Confusion Matrix
cm = confusion_matrix(y_test, pred_dt)
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# กราฟที่ 1: Confusion Matrix
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=["ทำนาย: A", "ทำนาย: B"],
            yticklabels=["จริง: A", "จริง: B"],
            ax=axes[0])
axes[0].set_title('Confusion Matrix — Decision Tree')

# กราฟที่ 2: เปรียบเทียบ Accuracy
algorithms = ['k-NN (k=3)', 'k-NN (k=5)', 'Decision Tree']
# หมายเหตุ: ใส่ค่า accuracy จริงจากการทดลองของตนเอง
accuracies = [acc_knn3 * 100, 0.0, acc_dt * 100]  # แก้ 0.0 เป็น acc_knn5

bars = axes[1].bar(algorithms, accuracies, color=['#3b82f6', '#93c5fd', '#16a34a'])
axes[1].set_ylabel('Accuracy (%)')
axes[1].set_title('เปรียบเทียบ Accuracy')
axes[1].set_ylim(0, 110)
for bar, acc in zip(bars, accuracies):
    axes[1].text(bar.get_x() + bar.get_width()/2., bar.get_height() + 1,
                f'{acc:.1f}%', ha='center', va='bottom', fontweight='bold')

plt.tight_layout()
plt.savefig('ml_comparison.png', dpi=120, bbox_inches='tight')
plt.show()
print("บันทึกกราฟเป็น ml_comparison.png แล้ว")
```

### สังเกต/วิเคราะห์

- จากโครงสร้างต้นไม้ที่พิมพ์ออกมา จุดตัดสินใจ (threshold) ที่โมเดลเลือกคือระยะทางเท่าใด?
- ค่านี้สมเหตุสมผลหรือไม่ เมื่อเทียบกับที่เราตั้ง (สภาวะ A: < 50 cm, สภาวะ B: > 100 cm)?

### ตารางบันทึกผล — ส่วนที่ 3

| โมเดล | Accuracy (%) | Threshold ที่โมเดลเลือก (cm) |
|:---|:---:|:---:|
| Decision Tree (max_depth=3) | ______ | ______ |
| k-NN ที่ดีที่สุด (จากส่วนที่ 2) | ______ | — |

Confusion Matrix (กรอกค่าจาก Output):

| | ทำนาย: A | ทำนาย: B |
|:---|:---:|:---:|
| **จริง: A** | TP = _____ | FN = _____ |
| **จริง: B** | FP = _____ | TN = _____ |

---

## ส่วนที่ 4: แนวคิด TinyML / Edge AI (20 นาที)

### ความรู้เบื้องต้น

หลังจากที่เราฝึกโมเดลบน Google Colab แล้ว เราสามารถ **นำโมเดลไปรันบน ESP32 โดยตรง** โดยไม่ต้องส่งข้อมูลขึ้นคลาวด์ แนวคิดนี้เรียกว่า **TinyML (Tiny Machine Learning)** หรือ **Edge AI**

เปรียบเทียบสถาปัตยกรรม:

| | Cloud ML | Edge AI / TinyML |
|:---|:---|:---|
| ที่ประมวลผล | Server บนคลาวด์ | ESP32 / ไมโครคอนโทรลเลอร์ |
| ต้องการ Internet | ใช่ | ไม่ต้อง (Offline) |
| ความหน่วง (Latency) | 100–500 ms (ขึ้นกับเครือข่าย) | < 1 ms (ประมวลผลในชิป) |
| ความเป็นส่วนตัว | ข้อมูลส่งออกไปนอก | ข้อมูลอยู่ในอุปกรณ์ |
| ข้อจำกัด | ค่าบริการ, ต้องการ Internet | RAM/Flash น้อย, โมเดลต้องเล็ก |

สำหรับ Decision Tree ง่าย ๆ ที่ตรวจสภาวะจากระยะทาง เราสามารถแปลงเป็น C++ ได้ง่ายมาก:

```cpp
// โมเดล Decision Tree ที่ฝึกมาแล้ว — แปลงเป็น C++ โดยตรง
// (ค่า threshold มาจากโครงสร้างต้นไม้ที่ export_text() แสดง)

int predict_condition(float distance_cm) {
  // จากโครงสร้างต้นไม้: ถ้าระยะ <= threshold → สภาวะ A, ไม่งั้น → สภาวะ B
  float THRESHOLD = 75.0;  // แก้ค่านี้ตามผลการทดลองของตนเอง
  return (distance_cm <= THRESHOLD) ? 0 : 1;
}

// ใน loop():
float dist = measureDistance();  // ฟังก์ชันวัดระยะทาง
int condition = predict_condition(dist);
if (condition == 1) {
  Serial.println("⚠️ ตรวจพบสภาวะผิดปกติ!");
}
```

สำหรับโมเดลซับซ้อนกว่า (เช่น Neural Network) ใช้ไลบรารี TensorFlow Lite Micro หรือ Edge Impulse ในการแปลงและ deploy ลงบอร์ด

### ขั้นตอนปฏิบัติ — สำรวจ (ไม่จำเป็นต้องรัน)

ลองดูว่า threshold ที่ Decision Tree เลือกตรงกับค่าที่เราตั้งไหม:

1. จาก output `export_text()` ในส่วนที่ 3 — จดค่า threshold ลงในตาราง
2. แก้ค่า `THRESHOLD` ในโค้ด C++ ด้านบนให้ตรงกับโมเดลของตน
3. ตอบคำถาม: ถ้าเซนเซอร์ส่งค่า 80 cm และโมเดลใช้ threshold = 75 cm จะจำแนกเป็นสภาวะใด?

### ตารางบันทึกผล — ส่วนที่ 4

| รายการ | คำตอบ |
|:---|:---|
| Threshold ที่ Decision Tree เลือก (cm) | ______ |
| ระยะ 80 cm → โมเดลจะทำนายว่าสภาวะ ___? | ______ |
| ข้อดีที่สำคัญที่สุดของ Edge AI ในโรงงาน | ______ |

---

## เกณฑ์การประเมินใบงาน

| เกณฑ์ | คะแนน | รายละเอียด |
|:---|:---:|:---|
| Dataset (ส่วนที่ 1) | 25 | มีข้อมูลครบ 60 ค่าขึ้นไป, CSV ถูกต้อง, Label ครบ |
| โค้ด Python ถูกต้อง (ส่วนที่ 2-3) | 25 | รันบน Colab ได้ไม่มี Error |
| เปรียบเทียบโมเดล (ส่วนที่ 3) | 20 | บันทึกผลครบ, กราฟ Confusion Matrix, บาร์ชาร์ต |
| คำถามและการอภิปราย | 30 | ตอบถูกต้อง มีเหตุผล เชื่อมโยงกับงานวิศวกรรม |

---

## แบบฝึกหัดท้ายใบงาน

1. **Train/Test Split**: จากผลการทดลองของนักศึกษา ถ้าเปลี่ยน `test_size=0.3` เป็น `test_size=0.1` (แบ่งข้อมูล Test แค่ 10%) ความแม่นยำจะเปลี่ยนแปลงอย่างไร? และเหตุใดจึงไม่ควรใช้ test_size เล็กเกินไปหรือใหญ่เกินไป?

   > คำตอบ: _______________________________________________________________

2. **เปรียบเทียบอัลกอริทึม**: จากผลการทดลอง อัลกอริทึมใดให้ความแม่นยำสูงกว่า — k-NN หรือ Decision Tree? นักศึกษาคิดว่าสาเหตุที่ทำให้ต่างกัน (หรือเหมือนกัน) คืออะไร? และสำหรับข้อมูลที่มี Feature เดียวอย่างนี้ อัลกอริทึมใดเหมาะกว่า เพราะอะไร?

   > คำตอบ: _______________________________________________________________

3. **ประยุกต์ใช้งานวิศวกรรมเครื่องกล**: โรงงานผลิตลูกกลิ้งสายพาน (Conveyor Roller) ต้องการตรวจสอบว่าลูกกลิ้งมีสภาพ "ปกติ" หรือ "ลูกปืนสึกหรอ" จากข้อมูลเสียงและความสั่นสะเทือน — ออกแบบ ML Pipeline สำหรับระบบนี้โดยระบุ: (ก) เซนเซอร์ที่ใช้, (ข) Feature ที่จะสกัด (อย่างน้อย 3 Feature), (ค) ประเภท ML (Supervised/Unsupervised), (ง) อัลกอริทึมที่เลือก พร้อมเหตุผล

   > คำตอบ: _______________________________________________________________

4. **TinyML vs Cloud**: ถ้าต้องติดตั้งระบบตรวจสอบสภาพมอเตอร์ปั๊มน้ำในพื้นที่ห่างไกลที่ไม่มีสัญญาณ Internet — ทำไม TinyML จึงเหมาะกว่า Cloud ML? ระบุข้อดีอย่างน้อย 3 ประการ และข้อจำกัดอย่างน้อย 1 ประการ

   > คำตอบ: _______________________________________________________________

---

## การส่งงาน

> 📋 ส่งงานผ่าน Google Form: **(ลิงก์จากอาจารย์ผู้สอน)**

สิ่งที่ต้องส่ง:
1. ไฟล์ `sensor_data.csv` ที่เก็บข้อมูลจาก Wokwi
2. ลิงก์ Google Colab Notebook (เปิด Share → Anyone with link → Viewer)
   หรือดาวน์โหลดไฟล์ `.ipynb` แนบส่ง
3. Screenshot กราฟ Confusion Matrix และ Accuracy bar chart (ส่วนที่ 3)
4. ตารางบันทึกผลทั้ง 4 ส่วน พร้อมคำตอบแบบฝึกหัด

### Checklist ก่อนส่ง

- [ ] ไฟล์ `sensor_data.csv` มีข้อมูลครบ 2 สภาวะ อย่างน้อยสภาวะละ 20 ค่า
- [ ] โค้ด Python รันบน Colab ได้โดยไม่มี Error
- [ ] บันทึก Accuracy ของ k-NN (k=3, 5, 7) และ Decision Tree ครบ
- [ ] กราฟ Confusion Matrix และ Accuracy comparison มีครบ
- [ ] โครงสร้าง Decision Tree (export_text) บันทึกไว้
- [ ] กรอกตารางบันทึกผลครบทุกส่วน
- [ ] ตอบแบบฝึกหัดท้ายใบงานครบ 4 ข้อ
- [ ] ระบุชื่อ-นามสกุล และรหัสนักศึกษาในฟอร์ม
