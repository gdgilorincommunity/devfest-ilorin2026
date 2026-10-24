'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Drawer } from '@base-ui/react/drawer'
import { Check, Search, SlidersHorizontal, X } from 'lucide-react'

import { AppContributors } from '@/components/app-contributors'
import { APP_CATEGORIES, OTHER_CATEGORY } from '@/lib/app-showcase-form'
import {
  type App,
  type AppCategory,
  appGalleryUrl,
  isExternalApp,
} from '@/lib/apps'
import { cn } from '@/lib/utils'

const ALL = 'All'

type Filter = AppCategory | typeof ALL
type CategoryOption = { name: Filter; count: number }

function matches(app: App, query: string) {
  const haystack = [
    app.name,
    app.tagline,
    app.category,
    ...app.contributors.map((person) => person.name),
  ]
    .join(' ')
    .toLowerCase()

  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

/**
 * The /apps listing, laid out like an app store: a search box, a chip per
 * category that has apps, and compact rows of icon, name and pitch.
 */
export function AppBrowser({ apps }: { apps: App[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Filter>(ALL)

  // The form's own order, so the chips read the same as its dropdown; a
  // category only gets a chip once an app is filed under it.
  const options = useMemo<CategoryOption[]>(
    () => [
      { name: ALL, count: apps.length },
      ...([...APP_CATEGORIES, OTHER_CATEGORY] as AppCategory[])
        .map((name) => ({
          name,
          count: apps.filter((app) => app.category === name).length,
        }))
        .filter((c) => c.count > 0),
    ],
    [apps],
  )

  const trimmed = query.trim()
  const shown = apps.filter(
    (app) =>
      (category === ALL || app.category === category) &&
      (trimmed === '' || matches(app, trimmed)),
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 lg:w-full lg:max-w-sm">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search apps</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#1E1E1E]/40"
            />
            <input
              className="w-full rounded-full border border-black/10 bg-white py-3 pr-11 pl-12 text-base text-[#1E1E1E] transition-colors outline-none placeholder:text-[#1E1E1E]/40 focus:border-black/40 [&::-webkit-search-cancel-button]:appearance-none"
              placeholder="Search apps or makers"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                aria-label="Clear search"
                className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#1E1E1E]/50 transition-colors hover:bg-black/5 hover:text-[#1E1E1E]"
                type="button"
                onClick={() => setQuery('')}
              >
                <X className="size-4" />
              </button>
            )}
          </label>
          <CategorySheet
            current={category}
            options={options}
            onPick={setCategory}
          />
        </div>

        {/* On phones the sheet replaces the chips; the pick shows as a chip. */}
        {category !== ALL && (
          <button
            className="flex w-fit cursor-pointer items-center gap-2 rounded-full bg-black py-2 pr-3 pl-4 text-sm font-bold text-white lg:hidden"
            type="button"
            onClick={() => setCategory(ALL)}
          >
            {category}
            <X aria-hidden className="size-4" />
            <span className="sr-only">(clear category)</span>
          </button>
        )}

        <div
          aria-label="Categories"
          className="hidden gap-2 lg:flex"
          role="group"
        >
          {options.map((c) => (
            <button
              key={c.name}
              aria-pressed={category === c.name}
              className={cn(
                'flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors',
                category === c.name
                  ? 'border-black bg-black text-white'
                  : 'border-black/10 bg-white text-[#1E1E1E]/70 hover:text-[#1E1E1E]',
              )}
              type="button"
              onClick={() => setCategory(c.name)}
            >
              {c.name}
              <span
                className={cn(
                  'text-xs',
                  category === c.name ? 'text-white/60' : 'text-[#1E1E1E]/40',
                )}
              >
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {shown.length > 0 ? (
        <ul className="grid w-full grid-cols-1 gap-x-12 md:grid-cols-2 2xl:grid-cols-3">
          {shown.map((app, index) => (
            <li key={app.id} className="border-b border-black/10">
              <AppRow app={app} priority={index < 6} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-black/15 px-6 py-16 text-center">
          <p className="text-base font-medium text-[#1E1E1E]/60">
            No apps match
            {trimmed ? ` “${trimmed}”` : ''}
            {category !== ALL ? ` in ${category}` : ''}.
          </p>
          <button
            className="cursor-pointer rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-bold text-[#1E1E1E] transition-colors hover:bg-black/5"
            type="button"
            onClick={() => {
              setQuery('')
              setCategory(ALL)
            }}
          >
            Show all apps
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * The row is not one big link: the contributor credits are links of their
 * own, and links can't nest. The name's link stretches over the whole row
 * instead, and the credits sit above it.
 */
function AppRow({ app, priority }: { app: App; priority: boolean }) {
  return (
    <article className="group relative flex items-start gap-4 py-5">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-[22%] border border-black/10 bg-white sm:size-18">
        <Image
          fill
          alt={`${app.name} icon`}
          className={app.iconPadded ? 'object-contain p-2.5' : 'object-cover'}
          priority={priority}
          sizes="72px"
          src={app.icon}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 className="truncate text-base font-bold text-[#1E1E1E] sm:text-lg">
          <Link
            className="after:absolute after:inset-0"
            href={appGalleryUrl(app)}
            {...(isExternalApp(app) && {
              rel: 'noopener noreferrer',
              target: '_blank',
            })}
          >
            {app.name}
          </Link>
        </h2>
        <p className="text-xs font-bold tracking-wide text-[#1E1E1E]/45 uppercase">
          {app.category}
        </p>
        <p className="line-clamp-2 text-sm font-medium text-[#1E1E1E]/60">
          {app.tagline}
        </p>
        <AppContributors contributors={app.contributors} />
      </div>

      {/*
        Clicks pass through to the name's stretched link, so the pill is
        only a visual cue.
      */}
      <span
        aria-hidden
        className="pointer-events-none mt-1 inline-flex h-8 shrink-0 items-center rounded-full bg-black/5 px-4 text-sm font-bold text-[#1E1E1E] transition-colors duration-150 group-hover:bg-black group-hover:text-white"
      >
        Open
      </span>
    </article>
  )
}

/**
 * Phones get a filter button beside the search instead of a row of chips
 * to scroll sideways through: it opens a bottom sheet of every category,
 * and a pick filters the list and closes the sheet.
 */
function CategorySheet({
  current,
  options,
  onPick,
}: {
  current: Filter
  options: CategoryOption[]
  onPick: (category: Filter) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger
        aria-label="Filter by category"
        className={cn(
          'relative flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors lg:hidden',
          current === ALL
            ? 'border-black/10 bg-white text-[#1E1E1E]'
            : 'border-black bg-black text-white',
        )}
      >
        <SlidersHorizontal className="size-5" />
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-black opacity-[calc(0.3*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
          <Drawer.Popup className="flex max-h-[80dvh] w-full flex-col overflow-y-auto overscroll-contain rounded-t-3xl bg-[#FDF8F8] pb-[max(1rem,env(safe-area-inset-bottom))] text-[#1E1E1E] outline-none [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:[transform:translateY(100%)] data-starting-style:[transform:translateY(100%)] data-swiping:select-none">
            <Drawer.Content className="flex flex-col">
              <div
                aria-hidden
                className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-black/15"
              />
              <header className="flex items-center justify-between gap-4 px-6 pt-4 pb-2">
                <Drawer.Title className="text-xl font-bold tracking-tight">
                  Categories
                </Drawer.Title>
                <Drawer.Close
                  aria-label="Close"
                  className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white transition-colors hover:bg-black/5"
                >
                  <X className="size-5" />
                </Drawer.Close>
              </header>

              <ul className="flex flex-col px-3 pb-2">
                {options.map((c) => (
                  <li key={c.name}>
                    <button
                      aria-pressed={current === c.name}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-4 text-left text-base font-bold transition-colors hover:bg-black/5"
                      type="button"
                      onClick={() => {
                        onPick(c.name)
                        setOpen(false)
                      }}
                    >
                      <span className="flex-1">{c.name}</span>
                      <span className="text-sm font-semibold text-[#1E1E1E]/40">
                        {c.count}
                      </span>
                      <span className="flex size-5 items-center justify-center">
                        {current === c.name && (
                          <Check className="size-5 stroke-[2.5]" />
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
