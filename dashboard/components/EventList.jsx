import { DEVICES } from '@/lib/config'

const nameOf = (key) => DEVICES.find((d) => d.key === key)?.label ?? key

// ประวัติการสั่ง (จากตาราง events ที่ trigger บันทึกให้)
export default function EventList({ events }) {
  return (
    <div className="card">
      <div className="card-title">ประวัติการสั่ง (ล่าสุด {events.length} รายการ)</div>
      {events.length === 0 && <p className="muted">ยังไม่มีการสั่ง</p>}
      {events.length > 0 && (
        <table className="events">
          <thead>
            <tr><th>เวลา</th><th>อุปกรณ์</th><th>สถานะ</th><th>ผู้สั่ง</th></tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.created_at).toLocaleTimeString('th-TH')}</td>
                <td>{nameOf(e.event)}</td>
                <td><span className={`badge ${e.state ? 'on' : 'off'}`}>{e.state ? 'เปิด' : 'ปิด'}</span></td>
                <td>{e.source === 'button' ? 'ปุ่มหน้าตู้' : 'แดชบอร์ด'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
