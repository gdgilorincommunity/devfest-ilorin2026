import { cn } from '@/lib/utils'

export interface SubpageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

/**
 * Header band for inner pages, sharing the homepage hero's pink radial so a
 * visitor moving from `/` to `/speakers` reads it as the same site.
 */
export function SubpageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: SubpageHeroProps) {
  return (
    <section
      className={cn(
        'w-full bg-[#FCF4F4] bg-[radial-gradient(85.98%_85.98%_at_50%_17.07%,#FCF4F4_52%,#FFF7FA_76%,#FFC4C2_100%)] pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-378 flex-col items-center gap-5 px-4 text-center md:px-16 lg:px-32">
        {eyebrow && (
          <span
            className="hero-enter inline-flex items-center rounded-full border border-[#1E1E1E]/10 bg-white/70 px-4 py-1.5 font-sans text-xs font-bold tracking-wide text-[#1E1E1E]/70 uppercase backdrop-blur sm:text-sm"
            style={{ '--enter-delay': '40ms' } as React.CSSProperties}
          >
            {eyebrow}
          </span>
        )}

        <h1
          className="hero-enter font-sans text-5xl leading-[105%] font-bold tracking-tight text-[#1E1E1E] sm:text-6xl lg:text-[72px]"
          style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        >
          {title}
        </h1>

        {description && (
          <p
            className="hero-enter max-w-140 text-base font-medium text-[#1E1E1E]/60 lg:text-lg"
            style={{ '--enter-delay': '200ms' } as React.CSSProperties}
          >
            {description}
          </p>
        )}

        {children && (
          <div
            className="hero-enter mt-2 flex flex-wrap items-center justify-center gap-3"
            style={{ '--enter-delay': '280ms' } as React.CSSProperties}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  )
}

export default SubpageHero
