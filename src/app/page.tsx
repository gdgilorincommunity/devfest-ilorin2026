import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Scrollable from '@/components/scrollable'
import EventTracks from '@/components/event-tracks'
import Venues from '@/components/venues'
import Tickets from '@/components/Tickets'
import Speakers from '@/components/speakers'
import Sponsors from '@/components/sponsors'
import CommunityPartners from '@/components/community-partners'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <Hero />
      <Scrollable />
      <EventTracks />
      <Venues />
      <Speakers />
      <Sponsors />
      <CommunityPartners />
      <Tickets />
      <Footer />
    </main>
  )
}
