# Summary of Changes - Chapter 8 Expansion

The file `chapters/ch08-cloud/README.md` was expanded and rewritten in Thai. Below is a detailed summary of the updates made.

## Files Modified
- `chapters/ch08-cloud/README.md`: Completely expanded with industrial cloud theory, Edge vs Cloud trade-offs, network QoS metrics, Blynk callback mechanism details, non-blocking connections, database differences (TSDB vs SQL), security concerns (TLS overhead, secure OTA), mechanical engineering case studies, and quantitative exercises.

## Detailed Changes

### 1. Theoretical Foundations (8.1 - 8.3)
- Expanded the definition of Cloud Computing using NIST's 5 characteristics.
- Added a comprehensive comparison of **Edge Computing vs. Cloud Computing** (Edge vs. Cloud Trade-offs: Latency, Bandwidth, Offline Reliability, Processing Power).
- Included detailed explanations of **Network Quality of Service (QoS) Metrics** (Latency/RTT, Bandwidth/Throughput, Jitter, Packet Loss, Availability/SLA with downtime calculation).
- Added details on **Data Downsampling and Feature Extraction** at the Edge using the example of vibration accelerometers and the $a_{RMS}$ equation.

### 2. Service and Deployment Models (8.2 & 8.3)
- Elaborated on IaaS, PaaS, SaaS in an IoT development context, with a detailed comparative table.
- Expanded the Public, Private, and Hybrid Cloud installation models, detailing security risks and Trade Secret protections for factories.

### 3. IoT Platform Architecture (8.4 & 8.5)
- Documented the 5 core elements of an IoT platform (Device Management, Data Ingestion, Data Storage, Visualization, Rule Engine).
- Added an **Industrial Cloud Telemetry Pipeline Diagram** and explained the concept of **Digital Twin (Device Shadow)**.
- Expanded on popular IoT platforms, adding a comparison table between Blynk and enterprise platforms (AWS IoT Core, Azure IoT Hub) in terms of target audience, learning curve, dashboards, and educational suitability.

### 4. ESP32 Interfacing & Programming (8.6)
- Described Auth Token security risks and provisioning techniques (Blynk Edgent).
- Detailed the Virtual Pin concept and bidirectional communication (Telemetry vs. Command & Control callbacks).
- Showed Event-driven Callback macros (`BLYNK_WRITE`, `BLYNK_CONNECTED`, `Blynk.syncAll`).
- Provided a comparison between **Blocking (`Blynk.begin`)** and **Non-blocking (`Blynk.config` + `Blynk.connect`)** connections to prevent machine lockups during internet downtime.
- Described CPU single-thread constraints, the danger of `delay()`, Heartbeat timeouts, and the mechanics of `BlynkTimer` (Non-blocking polling of `millis()`, offsetting timer intervals to avoid collisions, and task limits).
- Discussed rate limiting (Flood Errors) and mitigation strategies.
- Provided a fully compliant, non-blocking ESP32 C++ code snippet.

### 5. Time-Series Databases vs SQL (8.7)
- Explained the architectural differences: B-Tree index bottlenecks in SQL vs. LSM/TSM-Tree indexes in TSDB.
- Detailed TSDB write behaviors, data compression algorithms (Double-Delta, XOR), retention policies, and automatic downsampling.

### 6. Mechanical Engineering Case Studies (8.8)
- **Case Study 1: Steam Boiler Safety Monitoring:** Detailed temperature (MAX6675/SPI) and pressure (analog transducer) variables, local fail-safe override logic, and an entire compilable non-blocking C++ ESP32 safety interlock code example.
- **Case Study 2: CNC Spindle Bearing Health Monitoring:** Vibration measurement using ADXL345 (I2C) and $a_{RMS}$ calculation (ISO 10816) on ESP32 to reduce bandwidth.
- **Case Study 3: Pneumatic System Air Leak Detection:** Off-peak air flow rate tracking and the use of ESP32 Deep Sleep for battery-powered sensors.

### 7. Advanced IoT Security (8.9)
- Auth Token handling (config/secrets.h).
- Transport Layer Security (TLS/SSL) encryption on ESP32 using `WiFiClientSecure` and Root CA Certificates, discussing CPU and RAM overhead (20-30KB RAM footprint).
- Secure OTA Updates (HTTPS downloads, Firmware Signing via Private/Public keys, and SHA-256 Checksums).

### 8. Quantitative & Practical Exercises (Exercises)
- **Theoretical/Quantitative:** Added 9 questions, including:
  - **Bandwidth Calculation:** Calculating the monthly data usage in MB and MiB for a 60-byte payload sent every 10 seconds via HTTP POST (350B overhead) vs. MQTT (20B overhead), and analyzing scalable factory deployments.
  - **Execution Time Analysis:** Debugging a blocking `delay(5000)` loop on Blynk.
  - **Safety Logic Analysis:** Comparing Cloud vs. Edge decision latency under internet failure.
- **Practical Wokwi labs:**
  - **Lab 8.1:** Boiler Overpressure Safety Interlock (ESP32, Slide Potentiometer, Red/Green LEDs, Blynk V1, V2, V3, V5, Local safety overrides).
  - **Lab 8.2:** Dynamic Telemetry Rate Controller (ESP32, DHT22, Push Button, state transitions between 10s and 2s intervals, hysteresis filter, rate-limited on-demand button trigger).
