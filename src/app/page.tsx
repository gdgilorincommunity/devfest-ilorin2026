import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import EventTracks from '@/components/EventTracks'
import EventStatus from '@/components/EventStatus'
import Scrollable from '@/components/scrollable'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <Hero />
      <Scrollable />
      <EventTracks />
      <EventStatus />
    </main>
  )
}
