import type { Metadata } from 'next'

import { Google_Sans } from 'next/font/google'

import { Providers } from './providers'

import './globals.css'

const googleSans = Google_Sans({
  subsets: ['latin'],
  variable: '--font-google-sans',
  display: 'swap',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: 'DevFest Ilorin 2026',
  description: 'DevFest Ilorin 2026',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${googleSans.variable} h-full antialiased`} lang="en">
      <body className="min-h-full flex flex-col bg-[#fcf4f4]">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
