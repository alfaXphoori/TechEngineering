import { levelOf } from '@/lib/config'

// เกจครึ่งวงกลม: ช่วงแกนคงที่ (min–max) เพื่อไม่ให้การเปลี่ยนแปลงเล็กน้อยดูรุนแรง
export default function Gauge({ title, value, spec }) {
  const R = 50
  const ARC = Math.PI * R                                   // ความยาวครึ่งวงกลม
  const f = value == null ? 0 : Math.min(Math.max((value - spec.min) / (spec.max - spec.min), 0), 1)
  const level = levelOf(value, spec)

  // ตำแหน่งขีดเกณฑ์เหลือง/แดงบนเส้นโค้ง
  const tick = (v) => {
    const a = Math.PI * (1 - (v - spec.min) / (spec.max - spec.min))
    return { x: 60 + R * Math.cos(a), y: 62 - R * Math.sin(a) }
  }
  const warn = tick(spec.warn)
  const alarm = tick(spec.alarm)

  return (
    <div className={`card gauge level-${level}`}>
      <div className="card-title">{title}</div>
      <svg viewBox="0 0 120 72" role="img" aria-label={`${title} ${value ?? '-'} ${spec.unit}`}>
        <path d="M 10 62 A 50 50 0 0 1 110 62" className="gauge-track" />
        <path d="M 10 62 A 50 50 0 0 1 110 62" className="gauge-value"
              strokeDasharray={`${f * ARC} ${ARC}`} />
        <circle cx={warn.x} cy={warn.y} r="2.2" className="tick-warn" />
        <circle cx={alarm.x} cy={alarm.y} r="2.2" className="tick-alarm" />
        <text x="60" y="56" textAnchor="middle" className="gauge-number">
          {value == null ? '–' : value.toFixed(1)}
        </text>
        <text x="60" y="70" textAnchor="middle" className="gauge-unit">{spec.unit}</text>
      </svg>
      <div className="gauge-scale"><span>{spec.min}</span><span>{spec.max}</span></div>
    </div>
  )
}
