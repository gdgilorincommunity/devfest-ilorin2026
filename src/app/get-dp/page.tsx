import type { Metadata } from 'next'

import { DpGenerator } from '@/components/dp-generator'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import SubpageHero from '@/components/subpage-hero'
import config from '@/config'

const title = `Get your DP - ${config.appName}`
const description = `Make your own ${config.appName} poster: add your photo and name, then download it and share that you'll be there on November 6th and 7th.`

const ogImage = {
  url: '/images/og/get-dp-sample.png',
  width: 1200,
  height: 630,
  alt: 'Get your DP at devfestilorin.com/get-dp: two sample DevFest Ilorin 2026 "I’ll be attending!" posters, one with the background removed and one in a round frame.',
}

/**
 * As on /typerace: the root layout declares site-wide `openGraph` and
 * `twitter` blocks, so this page declares its own, or sharing /get-dp would
 * surface the homepage's card.
 */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/get-dp' },
  openGraph: {
    type: 'website',
    url: '/get-dp',
    title,
    description,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
}

export default function GetDpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />

      <SubpageHero
        description="Add your photo and name to make your own DevFest Ilorin poster, then share it so everyone knows you'll be there."
        eyebrow="Get DP · November 6 – 7"
        title="Get your DP"
      />

      <DpGenerator />

      <Footer />
    </main>
  )
}
