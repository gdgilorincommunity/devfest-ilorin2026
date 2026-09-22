'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import config from '@/config'
import { cn } from '@/lib/utils'

export type NavLink = {
  href: string
  label: string
}

// Absolute paths so the links resolve from the inner pages too, not just
// from the homepage.
export const NAV_LINKS: NavLink[] = [
  { label: 'Speakers', href: '/speakers' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Sponsors', href: '/#sponsors' },
  { label: 'Team', href: '/#team' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page while the mobile menu is open so the sheet can't scroll away.
  useEffect(() => {
    if (!isOpen) return

    const previous = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-300',
        isScrolled || isOpen
          ? 'border-b border-black/5 bg-[#FDF4F5]/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex w-full max-w-378 shrink-0 items-center justify-between px-4 py-4 md:px-16 md:py-5 lg:px-32">
        <Link
          aria-label="DevFest Ilorin 2026 home"
          className={cn(
            // Scale rather than resize so the bar's height never changes and
            // the work stays on the compositor.
            'ease-out-strong origin-left transition-transform duration-300 motion-reduce:transition-none',
            isScrolled && 'scale-[0.82]',
          )}
          href="/"
        >
          <Logo priority />
        </Link>

        <div className="flex items-center gap-4 lg:gap-10">
          <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  className="text-[16px] font-medium text-[#1E1E1E] transition-opacity hover:opacity-60"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/*
            At the top the CTA points back at last year; once the visitor is
            scrolling it becomes the ticket link. Both sit in the same grid
            cell so the swap cross-fades without the bar reflowing, and the
            hidden one is inert for pointer, keyboard and assistive tech.
          */}
          <div className="hidden grid-cols-1 grid-rows-1 sm:grid">
            <Link
              aria-hidden={isScrolled}
              className={cn(
                'ease-out-strong col-start-1 row-start-1 justify-self-end transition-[opacity,transform] duration-300 motion-reduce:transition-none',
                isScrolled
                  ? 'pointer-events-none -translate-y-1 opacity-0'
                  : 'translate-y-0 opacity-100',
              )}
              href="https://2025.devfestilorin.com"
              rel="noopener noreferrer"
              tabIndex={isScrolled ? -1 : undefined}
              target="_blank"
            >
              <Button showArrow size="pill" variant="black">
                View 2025
              </Button>
            </Link>

            <Link
              aria-hidden={!isScrolled}
              className={cn(
                'ease-out-strong col-start-1 row-start-1 justify-self-end transition-[opacity,transform] duration-300 motion-reduce:transition-none',
                isScrolled
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-1 opacity-0',
              )}
              href={config.ticketUrl}
              rel="noopener noreferrer"
              tabIndex={isScrolled ? undefined : -1}
              target="_blank"
            >
              <Button showArrow size="pill" variant="gradient">
                Get Tickets
              </Button>
            </Link>
          </div>

          <button
            aria-controls="mobile-nav"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#1E1E1E] transition-colors hover:bg-white lg:hidden"
            type="button"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          'mx-4 overflow-hidden rounded-3xl border border-black/10 bg-white/90 backdrop-blur transition-all duration-300 md:mx-16 lg:hidden',
          isOpen ? 'mb-4 max-h-96 opacity-100' : 'max-h-0 border-0 opacity-0',
        )}
        id="mobile-nav"
      >
        <ul className="flex flex-col p-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                className="block rounded-2xl px-4 py-3 text-base font-medium text-[#1E1E1E] transition-colors hover:bg-black/5"
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="p-2 sm:hidden">
            <Link
              href="https://2025.devfestilorin.com"
              rel="noopener noreferrer"
              target="_blank"
              onClick={() => setIsOpen(false)}
            >
              <Button showArrow className="w-full" size="pill" variant="black">
                View 2025
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
