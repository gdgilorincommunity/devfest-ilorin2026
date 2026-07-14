import type { Metadata } from 'next'

import { Google_Sans } from 'next/font/google'

import config from '@/config'

import { Providers } from './providers'

import './globals.css'

const googleSans = Google_Sans({
  subsets: ['latin'],
  variable: '--font-google-sans',
  display: 'swap',
  adjustFontFallback: false,
})

const appName = config.appName
const appUrl = config.appUrl
const appMetaTitle = `${appName} - The Biggest Tech Conference In North Central`
const imageAlt = 'Google Developer Group Ilorin'
const appMetaDescription = `The official ${appName}. Mark your calendars for November 2026. Join Ilorin's biggest tech conference for innovation, networking, and learning. Register now: ${config.ticketUrl} #devfestilorin26 #DevFest2026 #devfest`

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: appMetaTitle,
  description: appMetaDescription,
  authors: {
    url: appUrl,
    name: appName,
  },
  openGraph: {
    type: 'website',
    url: appUrl,
    title: appMetaTitle,
    description: appMetaDescription,
    images: [
      {
        url: '/devfest-social-meta.png',
        width: 1200,
        height: 630,
        alt: imageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: appMetaTitle,
    description: appMetaDescription,
    images: [
      {
        url: '/devfest-social-meta.png',
        width: 1200,
        height: 630,
        alt: imageAlt,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
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
