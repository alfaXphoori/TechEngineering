'use client'
import { useCallback, useEffect, useState } from 'react'
import { REFRESH_MS, TEMP, HUM, STALE_SECONDS, RANGES, levelOf } from '@/lib/config'
import Gauge from './Gauge'
import LineChart from './LineChart'
import ControlPanel from './ControlPanel'
import EventList from './EventList'

// เวลาเที่ยงคืนของวันนี้ตามเวลาไทย (UTC+7) ในรูป ISO สำหรับกรองข้อมูล
function startOfThaiDay() {
  const bkk = new Date(Date.now() + 7 * 3600 * 1000)
  bkk.setUTCHours(0, 0, 0, 0)
  return new Date(bkk.getTime() - 7 * 3600 * 1000).toISOString()
}

export default function Dashboard({ supabase, deviceId, userEmail, onReset }) {
  const DEVICE_ID = deviceId
  const [minutes, setMinutes] = useState(RANGES[0].minutes)
  const [latest, setLatest]   = useState(null)   // แถวล่าสุดของ telemetry
  const [history, setHistory] = useState([])     // ข้อมูลสำหรับกราฟ
  const [controls, setControls] = useState(null) // สถานะที่สั่ง (ตาราง controls)
  const [events, setEvents]   = useState([])     // ประวัติการสั่ง (ตาราง events)
  const [fanToday, setFanToday] = useState(null) // จำนวนครั้งที่เปิดพัดลมวันนี้
  const [error, setError]     = useState('')
  const [busy, setBusy]       = useState(null)   // อุปกรณ์ที่กำลังส่งคำสั่ง
  const [now, setNow]         = useState(Date.now())

  // ===== อ่านข้อมูลทั้งหมด (เส้นทางอ่าน) =====
  const load = useCallback(async () => {
    const since = new Date(Date.now() - minutes * 60 * 1000).toISOString()
    const [lat, hist, ctl, evt, fan] = await Promise.all([
      supabase.from('telemetry').select('created_at, temp, hum')
        .eq('device_id', DEVICE_ID).order('created_at', { ascending: false }).limit(1),
      supabase.from('telemetry').select('created_at, temp, hum')
        .eq('device_id', DEVICE_ID).gte('created_at', since)
        .order('created_at', { ascending: true }).limit(1000),
      supabase.from('controls').select('light, pump, fan, updated_by, updated_at')
        .eq('device_id', DEVICE_ID).maybeSingle(),
      supabase.from('events').select('id, created_at, event, state, source')
        .eq('device_id', DEVICE_ID).order('created_at', { ascending: false }).limit(20),
      supabase.from('events').select('id', { count: 'exact', head: true })
        .eq('device_id', DEVICE_ID).eq('event', 'fan').eq('state', true)
        .gte('created_at', startOfThaiDay()),
    ])
    const firstError = [lat, hist, ctl, evt, fan].find((r) => r.error)?.error
    setError(firstError ? firstError.message : '')
    if (!lat.error)  setLatest(lat.data[0] ?? null)
    if (!hist.error) setHistory(hist.data)
    if (!ctl.error)  setControls(ctl.data)
    if (!evt.error)  setEvents(evt.data)
    if (!fan.error)  setFanToday(fan.count)
  }, [supabase, DEVICE_ID, minutes])

  // ดึงข้อมูลใหม่ทุก REFRESH_MS และนับวินาทีทุก 1 วินาที
  useEffect(() => {
    load()
    const poll = setInterval(load, REFRESH_MS)
    const clock = setInterval(() => setNow(Date.now()), 1000)
    return () => { clearInterval(poll); clearInterval(clock) }
  }, [load])

  // ===== สั่งการ (เส้นทางสั่งการ): แก้ตาราง controls ในนาม dashboard =====
  async function command(device, value) {
    const verb = value ? 'เปิด' : 'ปิด'
    if (!window.confirm(`ยืนยัน${verb}${device.label} ของ ${DEVICE_ID}?`)) return
    setBusy(device.key)
    const { data, error } = await supabase.from('controls')
      .update({ [device.key]: value, updated_by: 'dashboard' })
      .eq('device_id', DEVICE_ID)
      .select()
    if (error) setError(error.message)
    else if (data.length === 0) setError('สั่งไม่สำเร็จ: ไม่พบแถวของอุปกรณ์นี้ใน controls หรือไม่มีสิทธิ์แก้ไข')
    setBusy(null)
    load()
  }

  const ageSec = latest ? Math.round((now - new Date(latest.created_at).getTime()) / 1000) : null
  const stale = ageSec == null || ageSec > STALE_SECONDS
  const tempAlarm = latest && levelOf(latest.temp, TEMP) === 'alarm'

  const tempPoints = history.map((r) => ({ t: new Date(r.created_at).getTime(), v: r.temp }))
  const humPoints  = history.map((r) => ({ t: new Date(r.created_at).getTime(), v: r.hum }))
  const fanMarkers = events.filter((e) => e.event === 'fan').map((e) => ({
    t: new Date(e.created_at).getTime(), state: e.state, label: e.state ? 'เปิดพัดลม' : 'ปิดพัดลม',
  }))

  return (
    <main>
      <header className="topbar">
        <div>
          <h1>MCC Monitor</h1>
          <p className="muted small">อุปกรณ์ <b>{DEVICE_ID}</b> · ผู้ใช้ {userEmail}</p>
        </div>
        <div className="actions">
          {onReset && <button type="button" onClick={onReset}>เปลี่ยนโปรเจกต์</button>}
          <button type="button" onClick={() => supabase.auth.signOut()}>ออกจากระบบ</button>
        </div>
      </header>

      {error && <div className="banner alarm">⚠️ {error}</div>}
      {tempAlarm && <div className="banner alarm">🔥 อุณหภูมิในตู้สูงเกิน {TEMP.alarm} °C</div>}
      {!error && stale && <div className="banner warn">📡 ไม่ได้รับข้อมูลจาก ESP32 เกิน {STALE_SECONDS} วินาที</div>}

      {/* แถว 1: ภาพรวม */}
      <section className="row four">
        <Gauge title="อุณหภูมิ" value={latest?.temp} spec={TEMP} />
        <Gauge title="ความชื้น" value={latest?.hum} spec={HUM} />
        <div className={`card stat level-${stale ? 'alarm' : 'ok'}`}>
          <div className="card-title">สถานะการเชื่อมต่อ</div>
          <div className="stat-number">{ageSec ?? '–'}</div>
          <div className="stat-unit">วินาทีที่แล้ว</div>
        </div>
        <div className="card stat">
          <div className="card-title">เปิดพัดลมวันนี้</div>
          <div className="stat-number">{fanToday ?? '–'}</div>
          <div className="stat-unit">ครั้ง</div>
        </div>
      </section>

      {/* แถว 2: แนวโน้ม */}
      <section className="range">
        {RANGES.map((r) => (
          <button key={r.minutes} type="button"
                  className={r.minutes === minutes ? 'primary' : ''}
                  onClick={() => setMinutes(r.minutes)}>{r.label}</button>
        ))}
      </section>
      <section className="row two">
        <LineChart title="อุณหภูมิ" points={tempPoints} spec={TEMP} color="#ea580c"
                   minutes={minutes} markers={fanMarkers} />
        <LineChart title="ความชื้น" points={humPoints} spec={HUM} color="#2563eb" minutes={minutes} />
      </section>

      {/* แถว 3: สั่งการและเหตุการณ์ */}
      <section className="row two">
        <ControlPanel controls={controls} busy={busy} onCommand={command} />
        <EventList events={events} />
      </section>
    </main>
  )
}
