import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import RevealObserver from '@/components/reveal-observer'
import SubpageHero from '@/components/subpage-hero'
import config from '@/config'
import { APPS, githubAvatarUrl, githubProfileUrl } from '@/lib/apps'

const title = `App Gallery - ${config.appName}`
const description = `Apps built by GDG Ilorin for ${config.appName}. Open one and play.`

const ogImage = {
  url: '/images/og/apps.png',
  width: 1200,
  height: 630,
  alt: `${config.appName} Apps: the DevFest CLI and DevFest Map side by side.`,
}

/**
 * As on /cli and /map: the root layout declares site-wide `openGraph` and
 * `twitter` blocks, so this page declares its own, or sharing /apps would
 * surface the homepage's card.
 */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/apps' },
  openGraph: {
    type: 'website',
    url: '/apps',
    title,
    description,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
}

export default function AppsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <RevealObserver />
      <Navbar />

      <SubpageHero
        description="Things we built for DevFest. Open one, play with it and share it."
        eyebrow={`${APPS.length} apps`}
        title="App Gallery"
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
                {/*
                  The card is not one big link: the author credits are links
                  of their own, and links can't nest. The title's link
                  stretches over the whole card instead, and the credits sit
                  above it.
                */}
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition-colors hover:border-black/25">
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
                        <Link
                          className="after:absolute after:inset-0 after:rounded-3xl"
                          href={app.href}
                        >
                          {app.name}
                        </Link>
                      </h2>
                      <p className="text-base font-medium text-[#1E1E1E]/60">
                        {app.tagline}
                      </p>

                      {app.authors.length > 0 && (
                        <p className="relative z-10 mt-2 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-medium text-[#1E1E1E]/60">
                          <span>By</span>
                          {app.authors.map((author) => (
                            <a
                              key={author.github}
                              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white py-0.5 pr-3 pl-0.5 font-semibold text-[#1E1E1E] transition-colors hover:bg-black/5"
                              href={githubProfileUrl(author)}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <Image
                                alt=""
                                className="size-6 rounded-full"
                                height={24}
                                src={githubAvatarUrl(author)}
                                width={24}
                              />
                              {author.name}
                            </a>
                          ))}
                        </p>
                      )}
                    </div>

                    {/*
                      The hover scale lifts the arrow above the title's
                      stretched link, so it would swallow the click; it lets
                      clicks through to the link instead.
                    */}
                    <span
                      aria-hidden
                      className="ease-out-strong pointer-events-none flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-150 group-hover:scale-[1.06]"
                    >
                      <ArrowUpRight className="size-5 stroke-[2.5]" />
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  )
}
