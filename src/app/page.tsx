import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import EventStatus from '@/components/EventStatus'
import Scrollable from '@/components/scrollable'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center">
      <Navbar />
      <Hero />
      <EventStatus />
      <Scrollable />
    </main>
  )
}
