import type { Metadata } from 'next'

import { DpGenerator } from '@/components/dp-generator'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import SubpageHero from '@/components/subpage-hero'
import config from '@/config'

export const metadata: Metadata = {
  title: `Get your DP - ${config.appName}`,
  description: `Make your own ${config.appName} poster: add your photo and name, then download it and share that you'll be there on November 6th and 7th.`,
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
