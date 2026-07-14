import { Button } from '@/components/ui/button'
import { HeroImages } from '@/components/hero-images'

export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-0 w-full max-w-[1512px] flex-1 flex-col overflow-hidden px-4 lg:px-0">
      <div className="pointer-events-none z-10 mt-6 flex w-full flex-col items-center justify-center gap-6 lg:absolute lg:inset-0 lg:-mt-[60px] lg:gap-[32px]">
        <div className="pointer-events-auto flex w-full max-w-[1018px] items-center justify-center">
          <h1 className="w-full text-center font-sans text-5xl leading-[110%] font-bold text-[#1E1E1E] lg:w-[1010px] lg:text-[74px] lg:leading-[100%]">
            November
            <span className="block lg:inline"> 2026</span>
          </h1>
        </div>

        <div className="pointer-events-auto flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
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
