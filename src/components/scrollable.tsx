'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface ScrollItem {
  id: string
  image: string // Original image URL / path
  label?: string // Optional accessible label
}

export interface TagItem {
  id: string
  label: string
  className: string
}

export interface ScrollableProps {
  /**
   * Array of items to display in the horizontal scroller.
   * Defaults to all 12 original DevFest recap images.
   */
  items?: ScrollItem[]
  /**
   * Section title displayed centered above the gallery.
   * @default 'Previous Devfest Recaps:'
   */
  title?: string
  /**
   * Category/pill tags displayed horizontally above the gallery.
   */
  tags?: TagItem[]
  /**
   * Optional CTA button rendered below the gallery.
   */
  ctaButton?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /**
   * Card auto-scroll speed in pixels per second.
   * @default 45
   */
  speed?: number
  /**
   * Direction for the card gallery movement.
   * @default 'right'
   */
  imageDirection?: 'left' | 'right'
  /**
   * Tailwind class for individual item width.
   * @default 'w-[270px] sm:w-[300px]'
   */
  itemWidthClass?: string
  /**
   * Tailwind class for individual item height.
   * @default 'h-[317px] sm:h-[352px]'
   */
  itemHeightClass?: string
  /**
   * Tailwind class for gap spacing between items.
   * @default 'gap-5'
   */
  gapClass?: string
  /**
   * Additional custom classes for the outer container.
   */
  className?: string
}

export const DEFAULT_RECAP_ITEMS: ScrollItem[] = [
  {
    id: 'speaker-frame-1',
    image: '/images/recap-images/Speaker-frame-1.svg',
    label: 'DevFest Recap Speaker Frame 1',
  },
  {
    id: 'speaker-frame-2',
    image: '/images/recap-images/Speaker-frame-2.svg',
    label: 'DevFest Recap Speaker Frame 2',
  },
  {
    id: 'speaker-frame-3',
    image: '/images/recap-images/Speaker-frame-3.svg',
    label: 'DevFest Recap Speaker Frame 3',
  },
  {
    id: 'speaker-frame-4',
    image: '/images/recap-images/Speaker-frame-4.svg',
    label: 'DevFest Recap Speaker Frame 4',
  },
  {
    id: 'speaker-frame-5',
    image: '/images/recap-images/Speaker-frame-5.svg',
    label: 'DevFest Recap Speaker Frame 5',
  },
  {
    id: 'speaker-frame-6',
    image: '/images/recap-images/Speaker-frame-6.svg',
    label: 'DevFest Recap Speaker Frame 6',
  },
  {
    id: 'speaker-frame-7',
    image: '/images/recap-images/Speaker-frame-7.svg',
    label: 'DevFest Recap Speaker Frame 7',
  },
  {
    id: 'speaker-frame-8',
    image: '/images/recap-images/Speaker-frame-8.svg',
    label: 'DevFest Recap Speaker Frame 8',
  },
  {
    id: 'speaker-frame-9',
    image: '/images/recap-images/Speaker-frame-9.svg',
    label: 'DevFest Recap Speaker Frame 9',
  },
  {
    id: 'speaker-frame-10',
    image: '/images/recap-images/Speaker-frame-10.svg',
    label: 'DevFest Recap Speaker Frame 10',
  },
  {
    id: 'speaker-frame-11',
    image: '/images/recap-images/Speaker-frame-11.svg',
    label: 'DevFest Recap Speaker Frame 11',
  },
  {
    id: 'speaker-frame-12',
    image: '/images/recap-images/Speaker-frame-12.svg',
    label: 'DevFest Recap Speaker Frame 12',
  },
  {
    id: 'speaker-frame-13',
    image: '/images/recap-images/Speaker-frame-13.svg',
    label: 'DevFest Recap Speaker Frame 13',
  },
]

export const DEFAULT_TAGS: TagItem[] = [
  // Left side pills
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    className: 'bg-gradient-to-b from-[#2B7FFF] to-[#A5B4FC] text-white',
  },
  {
    id: 'hackathon',
    label: 'Hackathon',
    className: 'bg-gradient-to-b from-white to-[#DDE3FF] text-[#1E1E1E]',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    className: 'bg-gradient-to-b from-[#FFC700] to-[#FFA000] text-[#1E1E1E]',
  },
  {
    id: 'firebase-studio',
    label: 'Firebase studio',
    className: 'bg-gradient-to-b from-[#2B7FFF] to-[#A5B4FC] text-white',
  },
  {
    id: 'cloud',
    label: 'Cloud',
    className: 'bg-gradient-to-b from-[#FF3B30] to-[#FA709A] text-white',
  },
  {
    id: 'ai-enthusiast-1',
    label: 'AI Enthusiast',
    className: 'bg-gradient-to-b from-[#2B7FFF] to-[#A5B4FC] text-white',
  },
  // Center pills
  {
    id: 'web',
    label: 'Web',
    className: 'bg-gradient-to-b from-[#00C853] to-[#00B4D8] text-white',
  },
  {
    id: 'vibe-coding',
    label: 'Vibe coding',
    className: 'bg-gradient-to-b from-[#FF3B30] to-[#FA709A] text-white',
  },
  {
    id: 'vr-ar',
    label: 'VR & AR',
    className: 'bg-gradient-to-b from-[#FFC700] to-[#FFA000] text-[#1E1E1E]',
  },
  {
    id: 'ai-ml',
    label: 'AI/ML',
    className: 'bg-gradient-to-b from-[#00C853] to-[#00B4D8] text-white',
  },
  {
    id: 'web3',
    label: 'Web3 Enthusiasts',
    className: 'bg-gradient-to-b from-[#FF3B30] to-[#FA709A] text-white',
  },
  {
    id: 'ai-enthusiast-2',
    label: 'AI Enthusiast',
    className: 'bg-gradient-to-b from-[#00C853] to-[#00B4D8] text-white',
  },
  {
    id: 'ai-developers',
    label: 'AI Developers',
    className: 'bg-gradient-to-b from-[#00C853] to-[#00B4D8] text-white',
  },
  {
    id: 'product-design',
    label: 'Product Design',
    className: 'bg-gradient-to-b from-[#FFC700] to-[#FFA000] text-[#1E1E1E]',
  },
  // Right side pills
  {
    id: 'brand-designers',
    label: 'Brand Designers',
    className: 'bg-gradient-to-b from-[#FF3B30] to-[#FA709A] text-white',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    className: 'bg-gradient-to-b from-[#FFC700] to-[#FFA000] text-[#1E1E1E]',
  },
  {
    id: 'developers',
    label: 'Developers',
    className: 'bg-gradient-to-b from-white to-[#DDE3FF] text-[#1E1E1E]',
  },
  {
    id: 'techies',
    label: 'Techies',
    className: 'bg-gradient-to-b from-[#00C853] to-[#00B4D8] text-white',
  },
  {
    id: 'more',
    label: '+ more',
    className: 'bg-gradient-to-b from-[#2B7FFF] to-[#A5B4FC] text-white',
  },
]

/**
 * Horizontal Scroll Gallery Component
 *
 * Displays the original DevFest recap cards moving rightward, above a
 * static row of category pills.
 */
export function Scrollable({
  items = DEFAULT_RECAP_ITEMS,
  title = 'Previous Devfest Recaps:',
  tags = DEFAULT_TAGS,
  ctaButton = { label: 'View 2025', href: 'https://2025.devfestilorin.com' },
  speed = 45,
  imageDirection = 'right',
  itemWidthClass = 'w-[270px] sm:w-[300px]',
  itemHeightClass = 'h-[317px] sm:h-[352px]',
  gapClass = 'gap-5',
  className,
}: ScrollableProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const scrollPosRef = useRef(0)

  // Duplicated array for seamless infinite looping
  const duplicatedItems = [...items, ...items]

  // Initialize card container scroll position for rightward scrolling
  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const halfWidth = container.scrollWidth / 2

    if (
      imageDirection === 'right' &&
      halfWidth > 0 &&
      container.scrollLeft === 0
    ) {
      container.scrollLeft = halfWidth
      scrollPosRef.current = halfWidth
    }
  }, [imageDirection, items])

  // Continuous auto-scrolling loop for cards using requestAnimationFrame
  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    let animationFrameId: number
    let lastTime: number | null = null

    const animateCards = (currentTime: number) => {
      if (lastTime !== null && !isHovered && container) {
        const delta = currentTime - lastTime
        const scrollStep = (speed * delta) / 1000
        const halfWidth = container.scrollWidth / 2

        if (imageDirection === 'right') {
          scrollPosRef.current = container.scrollLeft - scrollStep

          if (halfWidth > 0 && scrollPosRef.current <= 0) {
            scrollPosRef.current += halfWidth
          }
        } else {
          scrollPosRef.current = container.scrollLeft + scrollStep

          if (halfWidth > 0 && scrollPosRef.current >= halfWidth) {
            scrollPosRef.current -= halfWidth
          }
        }

        container.scrollLeft = scrollPosRef.current
      }

      lastTime = currentTime
      animationFrameId = requestAnimationFrame(animateCards)
    }

    animationFrameId = requestAnimationFrame(animateCards)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [imageDirection, isHovered, speed])

  // Sync scroll position if manual dragging occurs on the cards row
  const handleScrollSync = useCallback(() => {
    const container = containerRef.current

    if (!container) return

    scrollPosRef.current = container.scrollLeft
  }, [])

  return (
    <section
      aria-label={title}
      className={cn(
        'relative w-full overflow-hidden bg-[#121214] py-12 text-white sm:py-16',
        className,
      )}
    >
      {/* Centered Section Title */}
      {title && (
        <div data-reveal className="mb-6 text-center">
          <h2 className="font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h2>
        </div>
      )}

      {/* Static Pill Tags — one line, running past both edges of the viewport */}
      {tags && tags.length > 0 && (
        <div className="mb-8 flex w-full items-center gap-3.5 overflow-x-auto px-4 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={cn(
                'inline-flex shrink-0 items-center rounded-full px-6 py-2.5 text-xs font-semibold whitespace-nowrap sm:px-7 sm:py-3 sm:text-sm',
                tag.className,
              )}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Gallery Scroll Container */}
      <div className="relative w-full">
        {/* Continuous Horizontal Scroll Row (moving rightward, pauses when hovering on an image) */}
        <div
          ref={containerRef}
          className={cn(
            'flex w-full overflow-x-auto px-4 py-2 select-none scrollbar-none [&::-webkit-scrollbar]:hidden',
            gapClass,
          )}
          onScroll={handleScrollSync}
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={cn(
                'relative shrink-0 select-none cursor-pointer transition-opacity duration-200 hover:opacity-95',
                itemWidthClass,
                itemHeightClass,
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchEnd={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
            >
              <Image
                fill
                alt={item.label || `DevFest Recap ${item.id}`}
                className="object-contain"
                priority={index < 4}
                sizes="(max-width: 640px) 270px, 300px"
                src={item.image}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Button with generous padding */}
      {ctaButton && (
        <div className="mt-10 flex justify-center">
          {ctaButton.href ? (
            <Link
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 sm:px-9 sm:py-4 sm:text-base"
              href={ctaButton.href}
            >
              <span>{ctaButton.label}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </Link>
          ) : (
            <button
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 sm:px-9 sm:py-4 sm:text-base"
              type="button"
              onClick={ctaButton.onClick}
            >
              <span>{ctaButton.label}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default Scrollable
