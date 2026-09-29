import { DEVICES } from '@/lib/config'

// ฟอร์มสั่งการ: แสดงสถานะที่สั่งอยู่ และกดเพื่อสั่งสถานะใหม่ (ต้องยืนยันก่อนทุกครั้ง)
export default function ControlPanel({ controls, busy, onCommand }) {
  return (
    <div className="card">
      <div className="card-title">สั่งการอุปกรณ์</div>
      {!controls && <p className="muted">ไม่พบแถวของอุปกรณ์นี้ในตาราง controls</p>}
      {controls && (
        <>
          <div className="controls">
            {DEVICES.map((d) => {
              const on = Boolean(controls[d.key])
              return (
                <button key={d.key} type="button"
                        className={`switch ${on ? 'on' : 'off'}`}
                        disabled={busy !== null}
                        aria-pressed={on}
                        onClick={() => onCommand(d, !on)}>
                  <span className="switch-icon">{d.icon}</span>
                  <span className="switch-label">{d.label}</span>
                  <span className="switch-state">
                    {busy === d.key ? 'กำลังส่ง…' : on ? 'เปิด' : 'ปิด'}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="muted small">
            สั่งล่าสุดโดย <b>{controls.updated_by === 'button' ? 'ปุ่มหน้าตู้' : 'แดชบอร์ด'}</b>{' '}
            เมื่อ {new Date(controls.updated_at).toLocaleString('th-TH')} · ESP32 จะทำตามภายในราว 2 วินาที
          </p>
        </>
      )}
    </div>
  )
}
