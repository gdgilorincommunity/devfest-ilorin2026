import type { Metadata } from 'next'

import { AppBrowser } from '@/components/app-browser'
import { AppSubmitDrawer } from '@/components/app-submit-drawer'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import RevealObserver from '@/components/reveal-observer'
import SubpageHero from '@/components/subpage-hero'
import config from '@/config'
import { APPS } from '@/lib/apps'

const title = `App Gallery - ${config.appName}`
const description = `Apps built by GDG Ilorin for ${config.appName}. Open one and play.`

const ogImage = {
  url: '/images/og/app-gallery.png',
  width: 1200,
  height: 630,
  alt: `${config.appName} App Gallery: the DevFest CLI and DevFest Map side by side.`,
}

/**
 * As on /cli and /map: the root layout declares site-wide `openGraph` and
 * `twitter` blocks, so this page declares its own, or sharing /apps would
 * surface the homepage's card.
 */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/apps' },
  openGraph: {
    type: 'website',
    url: '/apps',
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

export default function AppsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <RevealObserver />
      <Navbar />

      <SubpageHero
        description="Apps built by the community for DevFest. Open one, play with it and share it."
        eyebrow={`${APPS.length} apps`}
        title="App Gallery"
      >
        <AppSubmitDrawer />
      </SubpageHero>

      <section
        aria-label="All apps"
        className="w-full bg-[#FDF2F1] py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto w-full max-w-378 px-4 md:px-16 lg:px-32">
          <AppBrowser apps={APPS} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
