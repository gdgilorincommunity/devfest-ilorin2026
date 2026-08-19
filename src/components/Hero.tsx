import { Button } from '@/components/ui/button'
import { HeroImages } from '@/components/hero-images'

const SPONSOR_EMAIL = 'gdgilorincmty@gmail.com'
const SPONSOR_SUBJECT = 'Sponsorship Inquiry - DevFest Ilorin 2026'
const SPONSOR_BODY = `Hello GDG Ilorin Team,

I am interested in exploring sponsorship opportunities for DevFest Ilorin 2026.

Company/Organization:
Contact Person:
Phone Number:

Please share more details on sponsorship packages and next steps.

Thank you.`

const SPONSOR_MAILTO = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(SPONSOR_SUBJECT)}&body=${encodeURIComponent(SPONSOR_BODY)}`

export default function Hero() {
  return (
    <section className="relative flex min-h-0 w-full max-w-[1512px] flex-1 flex-col overflow-hidden px-4 lg:px-0 items-center justify-center gap-8">
      <div className="pointer-events-none z-10 mt-12 flex w-full flex-col items-center justify-center gap-6 lg:absolute lg:inset-0 lg:mt-0 lg:gap-[32px]">
        <div className="pointer-events-auto flex w-full max-w-[1018px] items-center justify-center">
          <h1 className="w-full text-center font-sans text-6xl leading-[110%] font-bold text-[#1E1E1E] lg:w-[1010px] lg:text-[50px] lg:leading-[100%]">
            November
            <span className="block lg:inline"> 2026</span>
          </h1>
        </div>

        <div className="pointer-events-auto flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#1E1E1E]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34A853] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34A853]" />
            </span>
            Registration is open
          </span>

          <div className="flex py-4 items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button
              showArrow
              render={<a href={SPONSOR_MAILTO} />}
              size="pill"
              variant="gradient"
            >
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

          <p className="max-w-[280px] text-center text-xs text-[#1E1E1E]/60">
            Register early. You&apos;ll get updates and event info from us
            before it goes out to everyone else.
          </p>
        </div>
      </div>

      <HeroImages />
    </section>
  )
}
