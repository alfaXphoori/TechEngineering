# Handoff Report — reviewer_ch08_2

## 1. Observation
- **Target File**: `/Users/phoori/phoori.ch@ksu.ac.th - Google Drive/My Drive/KSU/Git/TechEngineering/chapters/ch08-cloud/README.md` was inspected using the `view_file` tool.
- **Explorer Plan**: `/Users/phoori/phoori.ch@ksu.ac.th - Google Drive/My Drive/KSU/Git/TechEngineering/.agents/explorer_ch08_2/analysis.md` was inspected. It contains Section 1.3 ("กลไกการป้องกันข้อมูลสูญหายและการส่งต่อข้อมูลหลังเชื่อมต่อใหม่ (Store-and-Forward / Offline Buffering)") and Section 4.1 ("รายละเอียดโปรโตคอลการรับเข้าข้อมูลสำหรับ IoT (IoT Data Ingestion Protocols)", Table 4 comparative details).
- **Missing Sections**: A `grep_search` on `README.md` for "Store-and-Forward" returned "No results found". Searching for "CoAP" returned only one match on line 118, and "MQTT" returned only a few mentions, with no protocol details or comparative table.
- **Virtual Pin Mismatch**: 
  - Case Study 8.8.1 Text (lines 91-100) specifies V1 for Steam Pressure, V2 for Shell Temperature, V3 for Water Level, V4 for Emergency Steam Release Valve.
  - C++ Code Block (lines 101-221) uses:
    - Line 152: `Blynk.virtualWrite(V1, currentPressure);`
    - Line 153: `Blynk.virtualWrite(V2, currentTemp);`
    - Line 162: `Blynk.virtualWrite(V3, 255);` (Alarm LED)
    - Line 173: `BLYNK_WRITE(V4)` (Burner Control Switch Button)
    - Line 188: `Blynk.virtualWrite(V4, 0);`
    - Line 153/163: `Blynk.virtualWrite(V5, "...");` (Terminal Widget)
  - Lab 8.1 Text (lines 299-308) specifies V1 for Pressure, V2 for LED Widget (Alarm), V3 for Switch Button (Manual override), V5 for Terminal Widget.
- **Blocking Setup Call**: Line 211 of the C++ code block contains `Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);`.
- **Thai Typo**: Line 5 contains the word "สมังฝังตัว".

## 2. Logic Chain
1. **Omission of Planned Content**: The explorer plan proposed Section 1.3 (Store-and-Forward / local buffering) and Section 4.1 (MQTT, HTTP, CoAP details + Table 4 comparison). These are absent in the `README.md`. Therefore, the worker failed to address all target points outlined in the explorer plan.
2. **Virtual Pin Inconsistency**: The Case Study 8.8.1 text, C++ code block, and Lab 8.1 description map the same virtual pins (V2, V3, V4) to different, incompatible widgets and variables. For example, V3 is defined as "Water Level" in the text, "Alarm LED" in the code, and "Manual Switch Button" in the lab. This creates logical contradictions that will confuse students and prevent the lab from working properly if they follow the example code.
3. **Blocking Bug**: The C++ code block in section 8.8.1 is meant to demonstrate "Non-blocking & Local Safety Interlock." However, the code calls `Blynk.begin` in `setup()`. Because `Blynk.begin` blocks until a server connection is established, if the connection fails during boot (e.g., power outage recovery), the ESP32 will hang in `setup()`, and the local safety interlock will never run. This is a critical logical/safety bug.
4. **Spelling Bug**: The word "สมังฝังตัว" is not standard Thai and is a typo for "ระบบฝังตัว".

## 3. Caveats
- No physical hardware testing was conducted.
- The Blynk library functions were analyzed against official Blynk C++ library API documentation.
- Compile check was done conceptually.

## 4. Conclusion
The expanded Chapter 8 `README.md` requires changes (**REQUEST_CHANGES**). The implementer must:
1. Unified virtual pin mappings across Case Study 8.8.1, the code block, and Lab 8.1.
2. Replace blocking `Blynk.begin()` with non-blocking `WiFi.begin()` + `Blynk.config()` + `Blynk.connect()` in the boiler safety C++ code.
3. Add the missing sections for Store-and-Forward buffering (Section 1.3 of plan) and IoT Data Ingestion Protocols details with Table 4 (Section 4.1 of plan).
4. Correct the typo "สมังฝังตัว" to "ระบบฝังตัว".

## 5. Verification Method
- **Inspection**: Open `/Users/phoori/phoori.ch@ksu.ac.th - Google Drive/My Drive/KSU/Git/TechEngineering/chapters/ch08-cloud/README.md` and check:
  - Are MQTT, HTTP, and CoAP explained in detail with Table 4 comparing them?
  - Is Store-and-Forward/local buffering explained?
  - Do Case Study 8.8.1 text, code, and Lab 8.1 share the same virtual pin mappings?
  - Does the C++ setup function in 8.8.1 use non-blocking connection methods?
- **Spelling**: Verify that "สมังฝังตัว" is removed.
