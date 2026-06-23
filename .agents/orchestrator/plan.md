# Plan: TechEngineering IoT Chapter Expansion

## Objective
Expand and detail the `README.md` files for Chapters 1-10 in the TechEngineering repository. The content must be detailed, academically rigorous, enriched with practical examples, case studies, and code blocks in Thai, suitable for 1st-year mechanical engineering students studying Digital Technology.

## Decomposition
To satisfy the 3-7 milestone constraint, we decompose the 10 chapters into 4 compound milestones:
1. **Milestone 1: Fundamentals & Edge Devices (Chapters 1-3)**
   - ch01-iot-introduction: IoT Fundamentals and 4-Layer Architecture
   - ch02-sensors: Analog & Digital Sensors, Characteristics
   - ch03-actuators: Motors, Relays, Buzzers, and Drive Circuits
2. **Milestone 2: Microcontrollers & Interfacing (Chapters 4-5)**
   - ch04-microcontroller: MCU Architectures, ESP32 Pinout, GPIO, ADC, PWM
   - ch05-io-interfacing: I/O protocols (I2C, SPI, UART) and programming
3. **Milestone 3: Networking & Protocols (Chapters 6-7)**
   - ch06-wireless: Wi-Fi, BLE, LoRa, NB-IoT
   - ch07-protocols: HTTP/REST APIs, MQTT Pub/Sub
4. **Milestone 4: Cloud, Visualization & Intelligence (Chapters 8-10)**
   - ch08-cloud: Cloud Platforms (Blynk, AWS), Time-series databases
   - ch09-data-visualization: Real-time Dashboards, Node-RED
   - ch10-machine-learning: Machine Learning and TinyML concepts

## Workflow & Strategy
1. **Delegation**: We will spawn a Sub-Orchestrator for each milestone.
2. **Sub-Orchestrator Role**: The sub-orchestrators will divide their milestone into individual chapter sub-milestones, running the Explorer-Worker-Reviewer loop for each chapter to ensure content depth and quality.
3. **Verification**:
   - Verify that all chapter READMEs have been significantly expanded.
   - Verify that they include case studies, theoretical formulas/explanations, and code blocks where applicable.
   - Verify that the Thai content is natural and grammatically correct.
