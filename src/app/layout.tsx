import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ISIDE - Menu Digitale',
  description: 'Scopri il menu di ISIDE - Events | Lounge | Living',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${montserrat.className} min-h-screen bg-iside flex flex-col`} suppressHydrationWarning>
        {children}
        <Footer />
      </body>
    </html>
  )
}
