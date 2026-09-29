'use client'
import { useState } from 'react'

// เข้าสู่ระบบด้วยบัญชีที่ผู้ดูแลสร้างไว้ใน Supabase (Authentication → Users → Add user)
export default function Login({ supabase }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <form className="card login" onSubmit={handleSubmit}>
      <div className="card-title">เข้าสู่ระบบแดชบอร์ด</div>
      <label>อีเมล
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
      </label>
      <label>รหัสผ่าน
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="primary" disabled={loading}>{loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}</button>
    </form>
  )
}
