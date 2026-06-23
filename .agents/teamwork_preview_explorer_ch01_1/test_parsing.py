import json

raw_mqtt_payload = """
{
  "device_id": "VIB-SENS-PUMP003",
  "timestamp": "2026-06-22T12:59:47.125Z",
  "sequence_number": 10452,
  "telemetry": {
    "vibration_x_rms": 2.45,
    "vibration_y_rms": 1.89,
    "vibration_z_rms": 4.12,
    "peak_acceleration_g": 1.25,
    "temperature_celsius": 68.30
  },
  "diagnostics": {
    "battery_percent": 94.5,
    "wifi_rssi_dbm": -67,
    "system_status": "NORMAL"
  }
}
"""

def process_sensor_data(raw_payload):
    try:
        data = json.loads(raw_payload)
        device_id = data["device_id"]
        timestamp = data["timestamp"]
        vib_z = data["telemetry"]["vibration_z_rms"]
        temp = data["telemetry"]["temperature_celsius"]
        
        print(f"📊 Received data from device: {device_id} at: {timestamp}")
        print(f"   > Z-axis vibration: {vib_z} mm/s | Temp: {temp} C")
        
        VIBRATION_LIMIT = 4.5
        TEMPERATURE_LIMIT = 75.0
        
        if vib_z > VIBRATION_LIMIT:
            print(f"⚠️ [WARNING] Device {device_id} high vibration: {vib_z} mm/s (limit {VIBRATION_LIMIT} mm/s)")
            
        if temp > TEMPERATURE_LIMIT:
            print(f"🔥 [CRITICAL] Bearing temperature high: {temp} C (limit {TEMPERATURE_LIMIT} C)")
            
        if vib_z <= VIBRATION_LIMIT and temp <= TEMPERATURE_LIMIT:
            print("✅ Machine status: NORMAL")
            return True
            
    except json.JSONDecodeError as e:
        print(f"❌ JSON Decode Error: {e}")
        return False
    except KeyError as e:
        print(f"❌ Missing key: {e}")
        return False

assert process_sensor_data(raw_mqtt_payload) == True
print("Parsing verification passed!")
