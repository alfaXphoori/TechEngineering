# 📖 คู่มือลำดับการสอน: ESP32-S3 IoT Console & Web Server Dashboard

> **สำหรับ:** ผู้สอนและผู้ช่วยสอน (Teaching Guide)  
> **วิชา:** เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)  
> **เนื้อหา:** ลำดับการอธิบายโค้ดตั้งแต่ควบคุม LED ไปจนถึงระบบ Web Dashboard และ Wi-Fi SoftAP

---

## สรุปภาพรวมและวัตถุประสงค์การสอน

โครงงานนี้เชื่อมโยงทักษะสำคัญ 4 ด้าน:
1. **Hardware I/O:** การขับกระแสหลอด LED (GPIO 15, 16, 17) และการเชื่อมต่อบัส I2C กับ AHT25 (GPIO 9, 8)
2. **Wi-Fi Architecture:** การเปิด Access Point (SoftAP) และการดักจับเหตุการณ์ด้วย `WiFi.onEvent()`
3. **Embedded Web Server:** สถาปัตยกรรม Routing บน `WebServer.h` และการสร้าง JSON REST API
4. **Client-Side SPA:** การออกแบบหน้าเว็บ Single Page Application, Real-time Canvas Graph, และ Asynchronous Polling ผ่าน `fetch()`

---

## ลำดับการสอน 6 ขั้นตอน (Step-by-Step Teaching Flow)

```
[ขั้น 1: ฮาร์ดแวร์] ──► [ขั้น 2: Backend Handlers] ──► [ขั้น 3: JSON Payload]
                                                              │
[ขั้น 6: End-to-End] ◄── [ขั้น 5: Frontend JS/UI] ◄── [ขั้น 4: WebServer Routing]
```

---

### ขั้นที่ 1: การกำหนดขาฮาร์ดแวร์และตัวแปรสถานะ (Hardware & State Tracking)
- **จุดเน้น:** การควบคุมอุปกรณ์แบบ Toggle ต้องมีตัวแปรระดับ Global ในหน่วยความจำเพื่อบันทึกสถานะปัจจุบัน (State Memory)
- **โค้ด:**
  ```cpp
  #define LED1 15
  #define LED2 16
  #define LED3 17

  bool led1State = false;
  bool led2State = false;
  bool led3State = false;
  ```
- **ใน `setup()`:**
  - `pinMode(LEDx, OUTPUT);`
  - `digitalWrite(LEDx, LOW);` (รับประกันว่าหลอดไฟดับเมื่อเริ่มต้นเสมอ)

---

### ขั้นที่ 2: ฟังก์ชันประมวลผลคำสั่งฝั่ง Backend (Server-Side Logic Handlers)
- **จุดเน้น:** การแกะค่า Query Parameters จากคำขอ HTTP และการสลับสถานะ (Invert boolean logic)
- **2.1 สลับสถานะรายดวง (`handleToggle()`):**
  - อ่านพารามิเตอร์ `server.hasArg("led")` และ `server.arg("led").toInt()`
  - สลับบูลีน `led1State = !led1State;` แล้วสั่ง `digitalWrite(LED1, led1State ? HIGH : LOW);`
  - พิมพ์ล็อกผ่าน Serial Monitor ยืนยันคำสั่ง
- **2.2 สั่งงานพร้อมกันทั้งหมด (`handleSetAll()`):**
  - อ่านพารามิเตอร์ `state=1` (เปิดหมด) หรือ `state=0` (ปิดหมด)
  - สั่ง `digitalWrite()` พร้อมกันทั้ง 3 ขา

---

### ขั้นที่ 3: การสร้าง JSON Payload ส่งกลับหน้าเว็บ (Data Serialization)
- **จุดเน้น:** สถาปัตยกรรมแบบ Single Page Application (SPA) ไม่ส่งโครงสร้าง HTML ซ้ำ แต่ส่งเฉพาะข้อมูลดิบขนาดเล็ก (< 100 bytes) ผ่าน JSON
- **โค้ด:**
  ```cpp
  String getJsonPayload() {
    String json = "{";
    json += "\"temp\":" + String(lastTemp, 2) + ",";
    json += "\"hum\":" + String(lastHum, 2) + ",";
    json += "\"led1\":" + String(led1State ? "true" : "false") + ",";
    json += "\"led2\":" + String(led2State ? "true" : "false") + ",";
    json += "\"led3\":" + String(led3State ? "true" : "false");
    json += "}";
    return json;
  }

  void handleData() {
    readSensors();
    server.send(200, "application/json", getJsonPayload());
  }
  ```
- เรียก `handleData()` ต่อท้าย `handleToggle()` และ `handleSetAll()` เสมอเพื่อให้ได้ข้อมูลล่าสุดทันที (Atomic Response)

---

### ขั้นที่ 4: การลงทะเบียน Routing บน WebServer (Endpoint Mapping)
- **จุดเน้น:** การจับคู่ URL Path กับฟังก์ชัน Handler ของ C++
- **โค้ดใน `setup()`:**
  ```cpp
  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.on("/toggle", handleToggle);
  server.on("/setall", handleSetAll);
  server.begin();
  ```

---

### ขั้นที่ 5: ส่วนหน้าเว็บ UI และ JavaScript (Frontend Interactivity)
- **จุดเน้น:** การส่งคำขอเบื้องหลังผ่าน Asynchronous `fetch()` เพื่อให้หน้าจอไม่กะพริบ
- **HTML:**
  - ปุ่ม Master: `<button onclick="setAllLED(1)">` และ `<button onclick="setAllLED(0)">`
  - ปุ่มรายดวง: `<button id="btn1" class="led-btn" onclick="toggle(1)">`
- **JavaScript:**
  ```javascript
  function toggle(num) {
    fetch('/toggle?led=' + num)
      .then(res => res.json())
      .then(data => applyData(data))
      .catch(e => console.error(e));
  }

  function setAllLED(state) {
    fetch('/setall?state=' + state)
      .then(res => res.json())
      .then(data => applyData(data))
      .catch(e => console.error(e));
  }

  function setButton(id, state) {
    const el = document.getElementById(id);
    if (state) el.classList.add('active');
    else el.classList.remove('active');
  }
  ```

---

### ขั้นที่ 6: การเชื่อมต่อระบบจนเสร็จสมบูรณ์ (End-to-End Execution Loop)
- **จุดเน้น:** ความสัมพันธ์และการทำงานแบบคู่ขนานของ Wi-Fi SoftAP, Event Callback, และ Server Loop
- **ใน `loop()`:**
  - `server.handleClient();` ทำงานวนรอบดักรับคำขอตลอดเวลา
- **Wi-Fi Event:**
  - `WiFi.onEvent(WiFiEvent);` ทำงานแบบ Interrupt-driven แจ้งเตือนเมื่อมีอุปกรณ์ใหม่เชื่อมต่อเข้า Hotspot พร้อม MAC Address
