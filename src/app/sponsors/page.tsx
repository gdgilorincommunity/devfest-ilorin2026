import type { Metadata } from 'next'

import CommunityPartners from '@/components/community-partners'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import RevealObserver from '@/components/reveal-observer'
import Sponsors from '@/components/sponsors'
import SubpageHero from '@/components/subpage-hero'
import config from '@/config'

export const metadata: Metadata = {
  title: `Sponsors & partners - ${config.appName}`,
  description: `The sponsors, partners and communities making ${config.appName} happen on November 6th and 7th.`,
}

export default function SponsorsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <RevealObserver />
      <Navbar />

      <SubpageHero
        description="The companies and communities making two days of workshops, talks and panels possible."
        eyebrow="November 6 – 7"
        title="Sponsors & partners"
      />

      <Sponsors />
      <CommunityPartners />

      <Footer />
    </main>
  )
}
