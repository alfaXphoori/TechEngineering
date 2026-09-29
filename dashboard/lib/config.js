// ===== ค่าที่ปรับได้ (ตรงกับเกณฑ์ในบทที่ 12) =====
export const REFRESH_MS = 5000          // ดึงข้อมูลใหม่ทุก 5 วินาที เท่ากับรอบส่งของ ESP32

export const TEMP = { min: 0, max: 60, warn: 30, alarm: 35, unit: '°C' }
export const HUM  = { min: 0, max: 100, warn: 60, alarm: 70, unit: '%RH' }

export const STALE_SECONDS = 30         // ไม่มีข้อมูลใหม่เกิน 30 วินาที = ขาดการเชื่อมต่อ

export const RANGES = [                 // ช่วงเวลาของกราฟ (ไม่เกิน 1 ชม. = 720 แถว)
  { label: '15 นาที', minutes: 15 },
  { label: '30 นาที', minutes: 30 },
  { label: '1 ชั่วโมง', minutes: 60 },
]

export const DEVICES = [                // อุปกรณ์ในตาราง controls
  { key: 'light', label: 'ไฟในตู้',          icon: '💡' },
  { key: 'pump',  label: 'ปั๊ม',             icon: '🛢️' },
  { key: 'fan',   label: 'พัดลมระบายอากาศ',  icon: '🌀' },
]

// สีบอกสถานะ: ปกติ / เฝ้าระวัง / ผิดปกติ
export function levelOf(value, spec) {
  if (value == null) return 'none'
  if (value >= spec.alarm) return 'alarm'
  if (value >= spec.warn) return 'warn'
  return 'ok'
}
