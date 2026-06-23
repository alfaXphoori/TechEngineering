# Handoff Report — Explorer 2, Chapter 6, Round 2

## 1. Observation
We observed the following issues based on `/chapters/ch06-wireless/README.md` and the two reviewer reports:
- **Watchdog risk in Wi-Fi Server loop**: The original loop (lines 251-301) spent CPU cycles in a tight loop:
  `while (client.connected() && (millis() - clientConnectedTime < clientTimeoutLimit)) { if (client.available()) { ... } }`
  This did not yield, risking Task Watchdog Timer resets when data was unavailable.
- **Unsafe memory access in BLE Server**: Variables `isClientConnected` and `wasClientConnected` were updated across different execution threads/cores without `volatile` keywords (lines 405-406).
- **Serial blocking inside BLE callbacks**: Callbacks inside `ServerStatusCallbacks` and `CommandReceiverCallbacks` printed logs directly:
  `Serial.println("[BLE] Client เชื่อมต่อเข้าระบบแล้ว");` (line 414), `Serial.print("[BLE Control] ได้รับคำสั่งสั่งการ: ");` (line 430), which blocks the BLE stack context.
- **Redundant API calls**: `pAdvertising->setMinPreferred(0x12);` (line 494) wrote over `setMinPreferred(0x06);` (line 493), which should have been `setMaxPreferred(0x12);`.
- **Translations/terminology issues**:
  - "อักษรวิญญาณ" (line 512): `// ส่งข้อมูลด้วยขนาด 2 ไบต์ทางอักษรวิญญาณ`
  - "การเดินเรือข้อมูล" (line 577): `และสลับเส้นทางการเดินเรือข้อมูลเพื่อโยนข้ามทอดไปยังเครื่องอื่น`
  - "ค่าความปลอดภัย" (line 669): `สามารถปรับเพิ่มค่าความปลอดภัยให้บอร์ดได้สูงสุดถึง +20 dB`
  - "ความเร็วเครื่อง" (line 630): `และควบคุมสัญญาณความเร็วเครื่อง (Adaptive Data Rate - ADR)`
- **Misconceptions**:
  - Physics resonance of water at 2.4 GHz (line 32): `(เนื่องจากโมเลกุลของน้ำมี resonance frequency ในย่านความถี่นี้พอดี)`
  - FSPL definition with antenna gains (line 57): `\text{FSPL (dB)} = 20\log_{10}(d) + ... - G_t - G_r`
  - Spreading Factor sensitivity (lines 609-610): SF7 was described as requiring highly sensitive receivers, while SF12 is the one enabling highest sensitivity.

## 2. Logic Chain
- **Task Watchdog**: When `client.available()` is false, the loop spins continuously. By inserting `delay(1);` in the `else` block of `client.available()`, we yield CPU back to the FreeRTOS scheduler, preventing TWDT starvation.
- **Volatile shared variables**: Declaring variables modified in callback tasks (running in the BLE thread) and read in the main loop as `volatile` tells the compiler to reload the variables from memory instead of caching them in registers.
- **Non-blocking Callbacks**: Copying the received command into a global character array (`rxCommand`) and setting a flag (`commandReceived`) in the callback allows us to safely handle all Serial prints inside `loop()`, removing heavy synchronous operations from the BLE task.
- **Physics Correction**: 2.4 GHz is absorbed via dipole rotation/dielectric relaxation. Real water resonance is in the THz region. Fixing this provides scientific accuracy for engineering students.
- **FSPL Definition**: FSPL represents attenuation between isotropic antennas (0 dBi gains). Gains belong in the Link Budget / Friis equation separately. Defining them separately avoids confusing students.

## 3. Caveats
- Since this is a **read-only investigation**, we did not apply the changes directly to the actual files in `/chapters/ch06-wireless/`. Instead, we wrote the full proposed content into `analysis.md` in our workspace.
- The C++ compilation was verified syntactically, but actual deployment on ESP32 hardware was not performed due to the read-only and code-only environment constraints.

## 4. Conclusion
We have compiled a complete, fully revised expansion plan and chapter text in `analysis.md` that addresses every technical inaccuracy, compiler concern, code robustness issue (watchdog, race conditions, blocking I/O), and translation error raised by both reviewers.

## 5. Verification Method
1. Inspect the updated chapter text inside `analysis.md` at `/Users/phoori/phoori.ch@ksu.ac.th - Google Drive/My Drive/KSU/Git/TechEngineering/.agents/explorer_ch06_2_r2/analysis.md`.
2. Confirm that the C++ code blocks for Wi-Fi Server and BLE GATT Server include:
   - `delay(1);` in the `else` branch of `client.available()` checks.
   - `if (WiFi.status() == WL_CONNECTED)` wrapping `server.available()` checks.
   - `volatile bool` for shared connection variables.
   - Separate printing queue via `commandReceived` and `rxCommand` inside `loop()` for BLE command execution.
   - Correct call to `setMaxPreferred(0x12)`.
   - Explicit `public:` inheritances on callback class overrides.
3. Confirm that all technical explanations (water resonance, FSPL, Spreading Factor) and Thai translations match the correct technical standards.
