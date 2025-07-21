import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MyBroApp',
  description: 'Tu compañero emocional impulsado por IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
