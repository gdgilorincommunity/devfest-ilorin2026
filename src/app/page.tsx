import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center overflow-hidden justify-center">
      {' '}
      {/* Changed from h-dvh to min-h-screen to remove scroll-lock */}
      <Navbar />
      <Hero />
    </main>
  )
}
