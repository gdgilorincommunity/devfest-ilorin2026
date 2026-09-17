import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import EventTracks from '@/components/EventTracks'
import EventStatus from '@/components/EventStatus'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <Hero />
      <EventTracks />
      <EventStatus />
    </main>
  )
}
