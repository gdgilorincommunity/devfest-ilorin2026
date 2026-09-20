import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import EventTracks from '@/components/EventTracks'
import Scrollable from '@/components/scrollable'
import Speakers from '@/components/Speakers'
import Sponsors from '@/components/Sponsors'
import CommunityPartners from '@/components/CommunityPartners'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <Hero />
      <Scrollable />
      <EventTracks />
      <Speakers />
      <Sponsors />
      <CommunityPartners />
      <Footer />
    </main>
  )
}
