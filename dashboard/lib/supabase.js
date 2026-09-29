import { createClient } from '@supabase/supabase-js'

// ค่าตั้งต้นจาก Environment Variables (ถ้าผู้ Deploy กรอกไว้บน Vercel)
// ถ้าไม่ได้กรอก ผู้ใช้แต่ละคนจะกรอกเองในหน้า "ตั้งค่า" และเก็บไว้ในเบราว์เซอร์ของตนเอง
const ENV = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
  deviceId: process.env.NEXT_PUBLIC_DEVICE_ID || '',
}
export const HAS_ENV = Boolean(ENV.url && ENV.key)

const STORAGE_KEY = 'mcc-dashboard-config'

export function loadConfig() {
  if (HAS_ENV) return { ...ENV, deviceId: ENV.deviceId || 'mcc01' }
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved?.url && saved?.key && saved?.deviceId) return saved
  } catch {}
  return null
}

export function saveConfig(config) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)) } catch {}
}

export function clearConfig() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

// Publishable key ใส่ในหน้าเว็บได้ เพราะสิ่งที่ทำได้ถูกจำกัดด้วย RLS policy
// ผู้ใช้ต้อง login ก่อน จึงจะได้ role `authenticated` ที่อ่านข้อมูลและสั่งการได้
export function makeClient(config) {
  return createClient(config.url.trim(), config.key.trim())
}
