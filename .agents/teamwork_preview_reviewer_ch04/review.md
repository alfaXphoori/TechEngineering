# Chapter 4 Review Report

This report evaluates the expanded Chapter 4 material (README.md) for the TechEngineering course, assessing its completeness, factual accuracy, code correctness, language quality, and Markdown structure.

---

# Part 1: Quality Review

## Review Summary

**Verdict**: REQUEST_CHANGES

The expanded content is exceptionally detailed, well-structured, and written in a highly professional academic Thai style suitable for engineering students. It matches the expansion plan thoroughly. However, two major technical/compilation issues and a few minor typos must be resolved before approval.

## Findings

### [Major] Finding 1: Missing Required Headers for Register Access
- **What**: The C++ code block in Section 4.2.5 (Direct Register Control) uses macros like `REG_WRITE`, `GPIO_OUT_W1TS_REG`, and `GPIO_OUT_W1TC_REG` without specifying the necessary header files.
- **Where**: `/chapters/ch04-microcontroller/README.md` (Lines 285–315)
- **Why**: Copy-pasting this code into the Arduino IDE will result in compilation errors (e.g., `'REG_WRITE' was not declared in this scope`) because the compiler does not know about these ESP-IDF-specific macros unless they are explicitly included.
- **Suggestion**: Add the following includes at the top of the code snippet or add a note:
  ```cpp
  #include <soc/soc.h>
  #include <soc/gpio_reg.h>
  ```

### [Major] Finding 2: Incorrect Stack Size Units in FreeRTOS Pinned Task
- **What**: The comment regarding the stack size parameter of `xTaskCreatePinnedToCore` states that it is measured in words.
- **Where**: `/chapters/ch04-microcontroller/README.md` (Line 210)
  ```cpp
  2048,            // ขนาด Stack (คำนวณเป็นหน่วย Words)
  ```
- **Why**: On ESP32 (under ESP-IDF and the Arduino ESP32 core), the stack size parameter is allocated in **bytes**, not words (unlike vanilla FreeRTOS). Passing `2048` allocates 2048 bytes (512 words). Misrepresenting this can cause students to severely miscalculate stack usage and lead to stack overflows or wasted memory.
- **Suggestion**: Modify the comment to:
  ```cpp
  2048,            // ขนาด Stack (หน่วย Bytes)
  ```

### [Minor] Finding 3: Spelling Typo in Exercise 2 Heading
- **What**: The heading of Exercise 2 contains the word "ขาสภาพแวดล้อมบูต".
- **Where**: `/chapters/ch04-microcontroller/README.md` (Line 911)
  ```markdown
  #### ข้อที่ 2 (การออกแบบวงจรอิเล็กทรอนิกส์ป้องกันขาสภาพแวดล้อมบูต)
  ```
- **Why**: "ขาสภาพแวดล้อมบูต" is likely a literal translation of "boot environment pins" or "boot strapping pins", but in Thai context, "ขาเลือกโหมดเริ่มต้นระบบ" or "ขา Strapping Pins" is much clearer and technically accurate.
- **Suggestion**: Change the heading to:
  ```markdown
  #### ข้อที่ 2 (การออกแบบวงจรอิเล็กทรอนิกส์ป้องกันขาเลือกโหมดเริ่มต้นระบบ / Strapping Pins)
  ```

---

## Verified Claims

- **ESP32 Dual-Core Architecture (Core 0/Core 1)** $\rightarrow$ verified via Espressif Datasheet & reference manuals $\rightarrow$ PASS
- **Strapping Pins (GPIO 0, 2, 5, 12, 15) Boot Logic** $\rightarrow$ verified via ESP32 Hardware Design Guidelines $\rightarrow$ PASS
- **GPIO Direct Register Bit Manipulation (W1TS / W1TC)** $\rightarrow$ verified via ESP32 Technical Reference Manual (GPIO Matrix section) $\rightarrow$ PASS
- **Two's Complement Rollover Math (8-bit representation)** $\rightarrow$ verified mathematically $\rightarrow$ PASS
- **Boiler FSM Logic & Compilation** $\rightarrow$ verified via mock compilation under `clang++ -std=c++11 -Wall -Wextra -Werror` $\rightarrow$ PASS

## Coverage Gaps

- **ADC Non-Linearity Details** — risk level: LOW — recommendation: The exercise covers how to mitigate non-linearity (e.g., lookup tables, multisegment calibration), but the main text doesn't provide a brief overview. Adding 1-2 sentences about the ESP32's built-in ADC calibration APIs (`esp_adc_cal_characterize()`) would enhance the chapter's value.

## Unverified Items

- **Physical execution of the FreeRTOS multitasking and Boiler code on physical ESP32 hardware** — reason not verified: Physical hardware is not attached to this agent workspace. Mock compilation is sufficient for logic and syntax validation.

---

# Part 2: Adversarial Review

## Challenge Summary

**Overall risk assessment**: LOW

The design of the Boiler Cooling Pump Controller FSM is resilient. The inclusion of a 20°C hysteresis gap between pump start (80°C) and stop (60°C), combined with the 10-second post-run cooldown, prevents chattering of the relay and pump wear. The software debouncing of the manual reset button is also robustly implemented.

## Challenges

### [Medium] Challenge 1: Lack of Debounce Logic for Sensor Failure Transitions (Failsafe)
- **Assumption challenged**: The FSM assumes that single erroneous ADC reads (e.g., $rawAdc < 50$ or $> 4050$) immediately indicate sensor failure, triggering the `FAULT` state.
- **Attack scenario**: In industrial environments, electrical noise (EMI) from high-power loads (like the cooling pump relay itself starting up) can couple onto the analog sensor lines, causing momentary spikes in the ADC reading. A single noisy read would immediately trip the system into the `FAULT` state (Failsafe ON, Buzzer Alarm, manual operator intervention required).
- **Blast radius**: Excessive false alarms and unnecessary manual resets, reducing operational efficiency.
- **Mitigation**: Introduce a simple counter-based debounce for the sensor health reading. The system should only transition to `FAULT` if the sensor reading is out of bounds for a consecutive number of loops (e.g., 5-10 iterations) or for a brief time window (e.g., 100 ms).

### [Low] Challenge 2: Single-Point-of-Failure on CPU Core 1
- **Assumption challenged**: The FSM assumes that running the control loop on Core 1 (default Arduino core) is safe.
- **Attack scenario**: If the user's application logic on Core 1 hangs (e.g., blocked by another third-party library or an infinite loop), the boiler pump controller will halt. Since Core 0 handles the communication stack, the device might still respond to network requests, giving a false sense of health while the physical safety controls are completely frozen.
- **Blast radius**: Boiler overheating, catastrophic system damage.
- **Mitigation**: A hardware Watchdog Timer (WDT) is automatically enabled on ESP32 Core 1. It is important to emphasize to students that they must not call long-blocking calls in `loop()` to avoid tripping the Task Watchdog, and to ensure safety-critical operations are either given dedicated RTOS tasks or backed by hardware interlocks.

## Stress Test Results

- **ADC Rollover Simulation** $\rightarrow$ expected: no state jumps $\rightarrow$ predicted: correct behavior due to unsigned subtract math $\rightarrow$ PASS
- **Rapid Button Chattering (50ms window)** $\rightarrow$ expected: single reset trigger $\rightarrow$ predicted: debouncer filters transitions $\rightarrow$ PASS
- **Simultaneous Overtemp & Sensor Failure** $\rightarrow$ expected: transition to `FAULT` $\rightarrow$ predicted: triggers `FAULT` $\rightarrow$ PASS

## Unchallenged Areas

- **FreeRTOS task priorities** — reason not challenged: The sample multitasking code is simple and runs only one low-priority task (priority 1) which yields using `vTaskDelay`. Real-world FreeRTOS applications would require strict priority profiling.
