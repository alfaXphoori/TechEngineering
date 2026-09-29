import './globals.css'

export const metadata = {
  title: 'MCC Monitor',
  description: 'แดชบอร์ดตู้ควบคุมมอเตอร์ปั๊ม: ESP32-S3 → Supabase → Vercel',
}

export const viewport = { width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
