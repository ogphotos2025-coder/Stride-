import './globals.css'
import type { Metadata } from 'next'
import { Inter, Barlow_Condensed } from 'next/font/google'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-barlow'
})

export const metadata: Metadata = {
  title: 'Stride & Soul',
  description: 'Discover the hidden link between your movement and mental well-being',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
