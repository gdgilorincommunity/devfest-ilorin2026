/* eslint-disable prettier/prettier */
import Image from 'next/image'

import { cn } from '@/lib/utils'

/**
 * lucide-react v1 no longer ships brand marks, so the social glyphs are
 * inlined here. All four share a 24x24 viewBox.
 */
const socialIconPaths = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z',
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z',
  facebook:
    'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM.02 8h4.96v14H.02V8Zm7.98 0h4.75v1.914h.068c.662-1.2 2.278-2.466 4.69-2.466 5.015 0 5.94 3.3 5.94 7.594V22h-4.96v-6.06c0-1.445-.026-3.304-2.013-3.304-2.016 0-2.325 1.574-2.325 3.2V22H8V8Z',
} as const

export interface SocialLink {
  id: keyof typeof socialIconPaths
  label: string
  href: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  { id: 'x', label: 'X', href: 'https://x.com/gdgilorin' },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://instagram.com/gdgilorin',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/gdgilorin',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/gdg-ilorin',
  },
]

export interface FooterProps {
  socials?: SocialLink[]
  className?: string
}

export function Footer({ socials = SOCIAL_LINKS, className }: FooterProps) {
  return (
    <footer
      className={cn(
        'w-full bg-[#1E1E1E] px-4 py-16 text-white sm:py-20',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-378 flex-col items-center gap-8 lg:gap-10">
        <div className="flex items-center gap-4 lg:gap-6">
          <Image
            aria-hidden
            alt=""
            className="h-12 w-auto lg:h-22"
            height={88}
            src="/svg/gdg-logo.svg"
            width={158}
          />
          <span className="font-sans text-3xl font-normal text-white lg:text-[44px]">
            GDG Ilorin
          </span>
        </div>

        {/* Decorative DevFest lanyard rule */}
        <Image
          aria-hidden
          alt=""
          className="h-auto w-full max-w-[320px] opacity-90 lg:max-w-118"
          height={45}
          src="/svg/footer-lanyard.svg"
          width={472}
        />

        <ul className="flex items-center gap-4 sm:gap-6 lg:gap-8">
          {socials.map((social) => (
            <li key={social.id}>
              <a
                aria-label={`GDG Ilorin on ${social.label}`}
                className="flex size-14 items-center justify-center rounded-full bg-white text-[#1E1E1E] transition-transform duration-300 hover:scale-110 sm:size-16 lg:size-35.5"
                href={social.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden
                  className="size-6 lg:size-14.5"
                  fill="currentColor"
                  focusable="false"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={socialIconPaths[social.id]} />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-2 text-center text-xs text-white/50 lg:text-sm">
          &copy; {new Date().getFullYear()} GDG Ilorin. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
