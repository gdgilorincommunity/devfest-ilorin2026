'use client'

import Image from 'next/image'

import { HeroImageScroller } from '@/components/hero-image-scroller'

type HeroImageConfig = {
  alt: string
  height: number
  id: string
  src: string
  width: number
}

const HERO_IMAGE_SIZE = {
  mobile: 300,
  desktop: 330,
} as const

const heroImageConfigs: HeroImageConfig[] = [
  {
    id: 'one',
    alt: 'DevFest Ilorin 2026 highlight one',
    src: '/images/one.png',
    width: 1342,
    height: 1342,
  },
  {
    id: 'two',
    alt: 'DevFest Ilorin 2026 highlight three',
    src: '/images/three.png',
    width: 1729,
    height: 1729,
  },
  {
    id: 'three',
    alt: 'DevFest Ilorin 2026 highlight two',
    src: '/images/two.png',
    width: 2252,
    height: 2224,
  },
  {
    id: 'four',
    alt: 'DevFest Ilorin 2026 highlight four',
    src: '/images/four.png',
    width: 1777,
    height: 1522,
  },
]

function HeroImage({
  config,
  priority = false,
  variant,
}: {
  config: HeroImageConfig
  priority?: boolean
  variant: 'desktop' | 'mobile'
}) {
  const size = HERO_IMAGE_SIZE[variant]

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ height: size, width: size }}
    >
      <Image
        alt={config.alt}
        className="h-full w-full object-contain"
        height={config.height}
        priority={priority}
        quality={90}
        sizes={
          variant === 'mobile'
            ? `(max-width: 1023px) ${HERO_IMAGE_SIZE.mobile}px, ${HERO_IMAGE_SIZE.desktop}px`
            : `${HERO_IMAGE_SIZE.desktop}px`
        }
        src={config.src}
        width={config.width}
      />
    </div>
  )
}

export function HeroImages() {
  return (
    <>
      <div className="relatives w-full pb-4 lg:hidden">
        {' '}
        {/*Removed the mt-auto to reduce the excess space on the images top in mobile version */}
        <HeroImageScroller direction="left" speed="medium">
          {heroImageConfigs.map((config, index) => (
            <li
              key={config.id}
              className="relative flex shrink-0 items-center justify-center"
              style={{
                height: HERO_IMAGE_SIZE.mobile,
                width: HERO_IMAGE_SIZE.mobile,
              }}
            >
              <HeroImage
                config={config}
                priority={index === 0}
                variant="mobile"
              />
            </li>
          ))}
        </HeroImageScroller>
      </div>

      <div className="relative mt-8 hidden h-full w-full flex-col items-center justify-between gap-16 lg:mt-6 lg:flex lg:flex-row lg:items-stretch lg:gap-0 lg:px-0">
        <div className="flex w-full flex-col items-center gap-16 lg:w-auto lg:items-start lg:gap-0 lg:pl-[65px] lg:pt-[31px]">
          <div className="relative mx-auto w-fit lg:mx-0">
            <HeroImage
              priority
              config={heroImageConfigs[0]}
              variant="desktop"
            />
          </div>

          <div className="relative mx-auto mt-16 w-fit lg:mx-0 lg:mt-[10px] lg:ml-[85px]">
            <HeroImage config={heroImageConfigs[1]} variant="desktop" />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-16 lg:w-auto lg:items-start lg:gap-0 lg:pr-[92px] lg:pt-0">
          <div className="relative mx-auto w-fit lg:mx-0 lg:-mt-[50px]">
            <HeroImage config={heroImageConfigs[2]} variant="desktop" />
          </div>

          <div className="relative mx-auto w-fit lg:mx-0 lg:-ml-[70px] lg:mt-[80px]">
            <HeroImage config={heroImageConfigs[3]} variant="desktop" />
          </div>
        </div>
      </div>
    </>
  )
}
