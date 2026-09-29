'use client'
import { useState } from 'react'

// หน้าตั้งค่า: กรอกครั้งเดียว ค่าจะถูกเก็บไว้ในเบราว์เซอร์นี้ (localStorage)
export default function Settings({ initial, onSave }) {
  const [url, setUrl] = useState(initial?.url ?? '')
  const [key, setKey] = useState(initial?.key ?? '')
  const [deviceId, setDeviceId] = useState(initial?.deviceId ?? '')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(url.trim())) {
      setError('Project URL ต้องมีรูปแบบ https://xxxx.supabase.co (ไม่ต้องมี /rest/v1/ ต่อท้าย)')
      return
    }
    if (!key.trim().startsWith('sb_publishable_') && !key.trim().startsWith('eyJ')) {
      setError('ต้องใช้ Publishable key (ขึ้นต้นด้วย sb_publishable_) ห้ามใช้ Secret key')
      return
    }
    onSave({ url: url.trim().replace(/\/$/, ''), key: key.trim(), deviceId: deviceId.trim() })
  }

  return (
    <form className="card login" onSubmit={handleSubmit}>
      <div className="card-title">ตั้งค่าการเชื่อมต่อ Supabase</div>
      <p className="muted small">กรอกครั้งเดียว ค่าจะถูกเก็บไว้ในเบราว์เซอร์นี้เท่านั้น</p>
      <label>Project URL
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://xxxx.supabase.co" required />
      </label>
      <label>Publishable key
        <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="sb_publishable_..." required />
      </label>
      <label>DEVICE_ID (ต้องตรงกับในโปรแกรม ESP32)
        <input value={deviceId} onChange={(e) => setDeviceId(e.target.value)} placeholder="mcc-1234" required />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="primary">บันทึก</button>
    </form>
  )
}
