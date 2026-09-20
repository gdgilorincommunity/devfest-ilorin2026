import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Scrollable from '@/components/scrollable'
import EventTracks from '@/components/EventTracks'
import Venues from '@/components/Venues'
import Tickets from '@/components/Tickets'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <Hero />
      <Scrollable />
      <EventTracks />
      <Venues />
      <Tickets />
    </main>
  )
}
