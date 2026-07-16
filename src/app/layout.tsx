import type { Metadata, Viewport } from 'next'
import './globals.css'
import Footer from '@/components/Footer'
import { montserrat } from '@/lib/font-family'

export const metadata: Metadata = {
  title: 'ISIDE - Menu Digitale',
  description: 'Scopri il menu di ISIDE - Events | Lounge | Living',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#004F71',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${montserrat.className} min-h-screen flex flex-col overflow-x-hidden`} suppressHydrationWarning>
        {children}
        <Footer />
      </body>
    </html>
  )
}
