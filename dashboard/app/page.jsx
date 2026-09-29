'use client'
import { useEffect, useMemo, useState } from 'react'
import { HAS_ENV, loadConfig, saveConfig, clearConfig, makeClient } from '@/lib/supabase'
import Settings from '@/components/Settings'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const [config, setConfig] = useState(undefined)     // undefined = กำลังอ่านค่าตั้ง
  const [editing, setEditing] = useState(false)
  const [session, setSession] = useState(undefined)   // undefined = กำลังตรวจสอบการ login

  useEffect(() => { setConfig(loadConfig()) }, [])

  const supabase = useMemo(() => (config ? makeClient(config) : null), [config])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  function handleSave(c) {
    saveConfig(c)
    setSession(undefined)
    setConfig(c)
    setEditing(false)
  }

  async function handleReset() {
    if (supabase) await supabase.auth.signOut()
    clearConfig()
    setConfig(null)
    setEditing(false)
  }

  if (config === undefined) return <main className="center"><p className="muted">กำลังโหลด…</p></main>
  if (!config || editing) {
    return <main className="center"><Settings initial={config} onSave={handleSave} /></main>
  }
  if (session === undefined) return <main className="center"><p className="muted">กำลังโหลด…</p></main>
  if (!session) {
    return (
      <main className="center">
        <div className="stack">
          <Login supabase={supabase} />
          {!HAS_ENV && (
            <button type="button" onClick={() => setEditing(true)}>แก้ค่าตั้ง Supabase / DEVICE_ID</button>
          )}
        </div>
      </main>
    )
  }
  return (
    <Dashboard supabase={supabase} deviceId={config.deviceId} userEmail={session.user.email}
               onReset={HAS_ENV ? null : handleReset} />
  )
}
