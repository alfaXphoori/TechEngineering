// กราฟเส้นตามเวลา 1 ซีรีส์ต่อ 1 หน่วย (°C กับ %RH ใช้คนละกราฟ ไม่ปนแกนกัน)
// markers = เส้นหมายเหตุ (Annotation) เช่น เวลาที่เปิด/ปิดพัดลม
export default function LineChart({ title, points, spec, color, minutes, markers = [] }) {
  const W = 640, H = 200, L = 44, R = 12, T = 12, B = 28
  const now = Date.now()
  const t0 = now - minutes * 60 * 1000

  const values = points.map((p) => p.v)
  let lo = values.length ? Math.min(...values) : spec.min
  let hi = values.length ? Math.max(...values) : spec.max
  if (hi - lo < 2) { lo -= 1; hi += 1 }                   // กันกราฟแบนเมื่อค่าแทบไม่เปลี่ยน
  const pad = (hi - lo) * 0.15
  lo -= pad; hi += pad

  const x = (t) => L + ((t - t0) / (now - t0)) * (W - L - R)
  const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B)

  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ')
  const yTicks = [0, 1, 2, 3].map((i) => lo + ((hi - lo) * i) / 3)
  const xTicks = [0, 1, 2, 3, 4].map((i) => t0 + ((now - t0) * i) / 4)
  const hhmm = (t) => new Date(t).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="card chart">
      <div className="card-title">{title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="grid" />
            <text x={L - 6} y={y(v) + 4} textAnchor="end" className="axis">{v.toFixed(1)}</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={H - 8} textAnchor="middle" className="axis">{hhmm(t)}</text>
        ))}
        {spec.alarm > lo && spec.alarm < hi && (
          <line x1={L} x2={W - R} y1={y(spec.alarm)} y2={y(spec.alarm)} className="alarm-line" />
        )}
        {markers.filter((m) => m.t >= t0).map((m) => (
          <g key={m.t}>
            <line x1={x(m.t)} x2={x(m.t)} y1={T} y2={H - B} className={`marker ${m.state ? 'on' : 'off'}`} />
            <text x={x(m.t) + 4} y={T + 10} className="marker-label">{m.label}</text>
          </g>
        ))}
        {points.length > 1 && <path d={path} fill="none" stroke={color} strokeWidth="2.5" />}
        {points.length === 0 && (
          <text x={W / 2} y={H / 2} textAnchor="middle" className="axis">ยังไม่มีข้อมูลในช่วงเวลานี้</text>
        )}
      </svg>
      <div className="chart-unit">หน่วย: {spec.unit}</div>
    </div>
  )
}
