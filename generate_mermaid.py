import urllib.request
import base64
import json

mermaid_code = """
flowchart TD
    classDef physical fill:#e2f0d9,stroke:#548235,stroke-width:2px;
    classDef device fill:#ddebf7,stroke:#2f5597,stroke-width:2px;
    classDef network fill:#fff2cc,stroke:#d6a300,stroke-width:2px;
    classDef cloud fill:#fce4d6,stroke:#c55a11,stroke-width:2px;
    classDef app fill:#eadaf2,stroke:#7030a0,stroke-width:2px;

    PhysicalEnv["โลกกายภาพ"]:::physical
    Sensor["Perception Layer (ADC / I2C)"]:::device
    Network["Network Layer (JSON / MQTT)"]:::network
    Cloud["Cloud Layer (InfluxDB / Processing)"]:::cloud
    App["Application Layer (Dashboard / Alert)"]:::app

    PhysicalEnv -- "สัญญาณอนาล็อก" --> Sensor
    Sensor -- "ตัวแปร / Float" --> Network
    Network -- "IP Packets" --> Cloud
    Cloud -- "REST API / WebSockets" --> App

    Gateway["Network Gateway"]:::network
    Actuator["Actuator Layer (Relay / Valve)"]:::device

    App -- "Control Topic (MQTT/JSON)" --> Gateway
    Gateway -- "GPIO Output" --> Actuator
    Actuator -- "ควบคุม / ตอบสนอง" --> PhysicalEnv
"""

# JSON stringify the state for mermaid.ink
state = {
    "code": mermaid_code,
    "mermaid": {"theme": "default"}
}
json_str = json.dumps(state)
b64 = base64.urlsafe_b64encode(json_str.encode('utf-8')).decode('utf-8')
url = f"https://mermaid.ink/img/{b64}"

print(f"Fetching from {url}")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response, open('chapters/ch01-iot-introduction/images/iot_architecture.png', 'wb') as out_file:
    out_file.write(response.read())
print("Done")
