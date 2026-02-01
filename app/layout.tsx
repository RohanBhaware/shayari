import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import PlayGuard from '@/components/play-guard'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Shayari - Where Words Dance',
  description: 'A poetic social platform for sharing and discovering beautiful Shayaris. Express your emotions through the art of poetry.',
  keywords: ['shayari', 'poetry', 'urdu poetry', 'hindi poetry', 'social media', 'creative writing'],
  authors: [{ name: 'Shayari' }],
  openGraph: {
    title: 'Shayari - Where Words Dance',
    description: 'A poetic social platform for sharing and discovering beautiful Shayaris.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1625',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        <PlayGuard />
        {children}
      </body>
    </html>
  )
}
