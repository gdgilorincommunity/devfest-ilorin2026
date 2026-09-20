import Image from 'next/image'

import { Marquee } from '@/components/ui/marquee'
import { cn } from '@/lib/utils'

export interface CommunityPartner {
  id: string
  name: string
  href?: string
  /**
   * Chapters render as the GDG glyph plus a wordmark; organisations that
   * shipped their own lockup render that image instead.
   */
  logo?: {
    src: string
    width: number
    height: number
  }
}

export interface CommunityPartnersProps {
  title?: string
  partners?: CommunityPartner[]
  className?: string
}

export const DEFAULT_COMMUNITY_PARTNERS: CommunityPartner[] = [
  { id: 'gdsc-unilorin', name: 'GDSC University of Ilorin' },
  { id: 'gdsc-kwasu', name: 'GDSC Kwara State University' },
  { id: 'gdsc-kwarapoly', name: 'GDSC Kwara State Polytechnic' },
  { id: 'gdsc-alhikmah', name: 'GDSC Al-Hikmah University' },
  {
    id: 'open-designers',
    name: 'Open Designers',
    logo: { src: '/svg/partners/open-designers.svg', width: 195, height: 37 },
  },
  {
    id: 'kwarabuild',
    name: 'Kwarabuild',
    logo: { src: '/svg/partners/kwarabuild.svg', width: 170, height: 47 },
  },
]

/**
 * Community partner strip — an auto-scrolling row of chapter and
 * organisation lockups over the section's soft pink wash.
 */
export function CommunityPartners({
  title = 'Community Partners',
  partners = DEFAULT_COMMUNITY_PARTNERS,
  className,
}: CommunityPartnersProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        'w-full overflow-hidden bg-[linear-gradient(to_bottom,#FFFFFF_0%,#FDF2F1_45%,#FBD9D6_100%)] py-16 sm:py-20 lg:py-24',
        className,
      )}
      id="community-partners"
    >
      <h2 className="mb-10 px-4 text-center font-sans text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl lg:mb-12 lg:text-[44px]">
        {title}
      </h2>

      <Marquee
        maskEdges
        direction="left"
        gapClass="gap-10 sm:gap-14 lg:gap-16"
        speed="normal"
      >
        {partners.map((partner) => (
          <li key={partner.id} className="flex shrink-0 items-center">
            {partner.logo ? (
              <Image
                alt={partner.name}
                className="h-8 w-auto object-contain lg:h-10"
                height={partner.logo.height}
                src={partner.logo.src}
                width={partner.logo.width}
              />
            ) : (
              <span className="flex items-center gap-3">
                <Image
                  aria-hidden
                  alt=""
                  className="h-6 w-auto shrink-0 lg:h-[38px]"
                  height={38}
                  src="/svg/partners/gdg-icon.svg"
                  width={69}
                />
                <span className="font-sans text-base font-medium whitespace-nowrap text-[#1E1E1E] lg:text-xl">
                  {partner.name}
                </span>
              </span>
            )}
          </li>
        ))}
      </Marquee>
    </section>
  )
}

export default CommunityPartners
