# Scope: Milestone 3 — Networking & Protocols

## Architecture
This milestone focuses on detailing and expanding the educational materials for Chapters 6 and 7 in the `TechEngineering` repository.
- **Chapter 6: Wireless Technologies (chapters/ch06-wireless/README.md)**: Expand on wireless fundamentals (RF, ISM band, RSSI/SNR, attenuation math), Wi-Fi (802.11 standards, Station vs AP, IP configuration), BLE (GATT, Services, Characteristics, advertising vs connection), Zigbee (Mesh networks, Coordinator/Router/End Device), LoRa/LoRaWAN (chirp modulation, LPWAN, Gateway vs Server, Class A/B/C), and Cellular IoT (NB-IoT, LTE-M, 5G). Add concrete industrial mechanical engineering case studies and compilable/syntactically correct code blocks.
- **Chapter 7: Communication Protocols (chapters/ch07-protocols/README.md)**: Expand on TCP vs UDP, Client-Server vs Pub-Sub, HTTP/REST (methods, headers, status codes, query parameters vs body), JSON schema/nesting, MQTT (Broker/Pub/Sub, Topic hierarchies/wildcards, QoS 0/1/2, Retain, LWT, Keep-Alive, Clean Session). Add concrete industrial mechanical engineering case studies and compilable/syntactically correct code blocks.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Milestone 3.1: Expand ch06-wireless | Detail and expand Chapter 6 (Wireless) README.md in Thai with deeper theory, industrial engineering examples, and complete code samples. | None | IN_PROGRESS |
| 2 | Milestone 3.2: Expand ch07-protocols | Detail and expand Chapter 7 (Protocols) README.md in Thai with deeper theory, TCP/UDP comparison, JSON manipulation, industrial engineering examples, and complete code samples. | M3.1 | PLANNED |

## Interface Contracts & Guidelines
- All chapter expansions must be written in a clear, academic, yet accessible Thai language.
- Maintain formatting of tables, code blocks, callouts (`> 💡`), and exercise sections.
- Code blocks must use correct Arduino C++ syntax, using libraries compatible with ESP32 (e.g., `WiFi.h`, `PubSubClient.h`, `DHTesp.h`, `HTTPClient.h`).
- Only edit files in the directories `chapters/ch06-wireless/` and `chapters/ch07-protocols/`.
