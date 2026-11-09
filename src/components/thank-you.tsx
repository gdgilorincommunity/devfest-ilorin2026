import { Button } from '@/components/ui/button'
import config from '@/config'
import { cn } from '@/lib/utils'

export interface ThankYouProps {
  className?: string
}

/**
 * Closing call to action now the event is over: thanks everyone who came and
 * points them at the photo gallery. Stands where the ticket cards used to.
 */
export function ThankYou({ className }: ThankYouProps) {
  return (
    <section
      aria-label="Thank you"
      className={cn(
        'w-full border-t-[3px] border-black bg-[#FCF4F4] py-16 sm:py-20',
        className,
      )}
    >
      <div
        data-reveal
        className="mx-auto flex w-full max-w-378 flex-col items-center gap-6 px-4 text-center md:px-16"
      >
        <h2 className="font-sans text-3xl font-bold tracking-tight text-[#1E1E1E] sm:text-4xl lg:text-[44px]">
          Thank you for coming!
        </h2>
        <p className="max-w-130 text-base font-medium text-[#1E1E1E]/60">
          Two days of workshops, talks and panels in Ilorin. Find yourself in
          the photos from DevFest Ilorin 2026.
        </p>
        <Button
          showArrow
          render={
            <a
              href={config.photosUrl}
              rel="noopener noreferrer"
              target="_blank"
            />
          }
          size="pill"
          variant="gradient"
        >
          View Photos
        </Button>
      </div>
    </section>
  )
}

export default ThankYou
