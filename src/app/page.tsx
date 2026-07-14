import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main className="flex h-dvh flex-col items-center overflow-hidden">
      <Navbar />
      <Hero />
    </main>
  )
}
