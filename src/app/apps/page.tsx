import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import RevealObserver from '@/components/reveal-observer'
import SubpageHero from '@/components/subpage-hero'
import config from '@/config'
import { APPS } from '@/lib/apps'

export const metadata: Metadata = {
  title: `Apps - ${config.appName}`,
  description: `Apps built by GDG Ilorin for ${config.appName}. Open one and play.`,
  alternates: { canonical: '/apps' },
}

export default function AppsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <RevealObserver />
      <Navbar />

      <SubpageHero
        description="Things we built for DevFest. Open one, play with it and share it."
        eyebrow={`${APPS.length} apps`}
        title="Apps"
      />

      <section
        aria-label="All apps"
        className="w-full bg-[#FDF2F1] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-full max-w-378 px-4 md:px-16 lg:px-32">
          <ul className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            {APPS.map((app, index) => (
              <li
                key={app.id}
                data-reveal
                style={
                  {
                    '--reveal-delay': `${(index % 2) * 70}ms`,
                  } as React.CSSProperties
                }
              >
                <Link
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition-colors hover:border-black/25"
                  href={app.href}
                >
                  <div className="relative aspect-[1200/630] w-full overflow-hidden border-b border-black/10 bg-black/5">
                    <Image
                      fill
                      alt={app.imageAlt}
                      className="ease-out-strong object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                      priority={index < 2}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      src={app.image}
                    />
                  </div>

                  <div className="flex flex-1 items-start justify-between gap-6 p-6 sm:p-8">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-2xl font-bold tracking-tight text-[#1E1E1E]">
                        {app.name}
                      </h2>
                      <p className="text-base font-medium text-[#1E1E1E]/60">
                        {app.tagline}
                      </p>
                    </div>

                    <span
                      aria-hidden
                      className="ease-out-strong flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-150 group-hover:scale-[1.06]"
                    >
                      <ArrowUpRight className="size-5 stroke-[2.5]" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  )
}
