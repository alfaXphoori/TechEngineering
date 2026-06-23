# Scope: Milestone 1: Fundamentals & Edge Devices

## Architecture
This milestone covers the foundational concepts of IoT (Chapter 1), edge sensing devices and analog-to-digital conversion (Chapter 2), and actuating mechanisms and interfacing electronics (Chapter 3).
- **Target Files**:
  - `chapters/ch01-iot-introduction/README.md`
  - `chapters/ch02-sensors/README.md`
  - `chapters/ch03-actuators/README.md`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Chapter 1 Expansion | Detail IoT architecture, data flow payloads, edge vs cloud trade-offs, and industrial case studies. | None | PLANNED |
| 2 | Chapter 2 Expansion | Expand on ADC mechanics (SAR, quantization, math), signal conditioning (voltage divider, Wheatstone bridge), and high-temp monitoring case study. | Chapter 1 Expansion | PLANNED |
| 3 | Chapter 3 Expansion | Detail inductive loads math ($V = L \frac{di}{dt}$), BJT/MOSFET gate-driver math, dead-time, and industrial motor/actuator case study. | Chapter 2 Expansion | PLANNED |

## Interface Contracts / Guidelines for Expansion
- **Language**: Standard, formal, educational Thai language suitable for first-year engineering students.
- **Formulas**: Render mathematical equations clearly (using Markdown/LaTeX or plain text mathematical formatting as appropriate).
- **Examples**: Include at least one detailed industrial or mechanical engineering case study per chapter.
- **Code Blocks**: Provide fully commented, syntactically correct code samples (C++ for Arduino/ESP32, JSON for payloads, etc.).
