## 2026-06-22T13:16:50Z
You are the Chapter 4 Worker (Generation 2). Your workspace directory is /Users/phoori/phoori.ch@ksu.ac.th - Google Drive/My Drive/KSU/Git/TechEngineering/.agents/teamwork_preview_worker_ch04_2.

Your task is to fix three issues in /Users/phoori/phoori.ch@ksu.ac.th - Google Drive/My Drive/KSU/Git/TechEngineering/chapters/ch04-microcontroller/README.md identified in the Review Report:
1. Missing Required Headers for Register Access: Add the following headers to the top of the direct register control code blocks in Section 4.2.5 (or inside the code block as appropriate):
   #include <soc/soc.h>
   #include <soc/gpio_reg.h>
2. Incorrect Stack Size Units in FreeRTOS Pinned Task: Change the comment in the task creation code block (around line 210) from "ขนาด Stack (คำนวณเป็นหน่วย Words)" to "ขนาด Stack (หน่วย Bytes)" because ESP32 FreeRTOS allocates stack size in bytes.
3. Spelling/Translation Typo in Exercise 2 Heading: Change the heading from "ข้อที่ 2 (การออกแบบวงจรอิเล็กทรอนิกส์ป้องกันขาสภาพแวดล้อมบูต)" to "ข้อที่ 2 (การออกแบบวงจรอิเล็กทรอนิกส์ป้องกันขาเลือกโหมดเริ่มต้นระบบ / Strapping Pins)".

Also, please address the reviewer's feedback about sensor health checks debounce:
- In the Boiler Cooling Pump Controller code, add a simple check where the sensor reading must be out-of-bounds consecutively for 5 iterations (or a brief time window of 100ms) before transitioning to the FAULT state, to prevent electrical noise from causing false FAULT trips.

Make these changes directly to the file /Users/phoori/phoori.ch@ksu.ac.th - Google Drive/My Drive/KSU/Git/TechEngineering/chapters/ch04-microcontroller/README.md.

MANDATORY INTEGRITY WARNING:
> DO NOT CHEAT. All implementations must be genuine. DO NOT
> hardcode test results, create dummy/facade implementations, or
> circumvent the intended task. A Forensic Auditor will independently
> verify your work. Integrity violations WILL be detected and your
> work WILL be rejected.

Please write a handoff.md in your working directory when complete, and send a message back to me (conversation ID: ae03e976-fbd2-419b-9056-cc5625e9d1df) with a summary of the changes and the file path.
