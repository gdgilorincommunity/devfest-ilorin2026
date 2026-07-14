import { Button } from '@/components/ui/button'
import { HeroImages } from '@/components/hero-images'

export default function Hero() {
  return (
    <section className="relative flex flex-col w-full max-w-[1512px] mx-auto min-h-[500px] lg:h-[850px] px-4 lg:px-0 py-16 lg:py-0 overflow-hidden">
      <div className="lg:absolute lg:inset-0 flex flex-col items-center justify-center w-full z-10 pointer-events-none gap-8 lg:gap-[32px] mt-8 lg:-mt-[60px]">
        <div className="flex items-center justify-center w-full max-w-[1018px] pointer-events-auto">
          <h1 className="w-full lg:w-[1010px] font-sans font-bold text-5xl lg:text-[74px] leading-[110%] lg:leading-[100%] text-center text-[#1E1E1E]">
            November
            <span className="block lg:inline">2026</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 pointer-events-auto">
          <Button showArrow size="pill" variant="gradient">
            Sponsor Us
          </Button>

          <Button
            showArrow
            render={
              <a
                href="https://gdg.community.dev/events/details/google-gdg-ilorin-presents-devfest-ilorin-2026/"
                rel="noopener noreferrer"
                target="_blank"
              />
            }
            size="pill"
            variant="black"
          >
            Register
          </Button>
        </div>
      </div>

      <HeroImages />
    </section>
  )
}
