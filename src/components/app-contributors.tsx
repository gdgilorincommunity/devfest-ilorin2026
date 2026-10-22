'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'

import {
  type AppContributor,
  githubAvatarUrl,
  githubProfileUrl,
} from '@/lib/apps'

const chip =
  'inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white py-0.5 pr-3 pl-0.5 font-semibold text-[#1E1E1E] transition-colors hover:bg-black/5'

/**
 * One person reads "By {name}"; several collapse into "Contributors" with
 * their avatars, and a tap shows who did what.
 */
export function AppContributors({
  contributors,
}: {
  contributors: AppContributor[]
}) {
  if (contributors.length === 0) return null
  if (contributors.length === 1) {
    const person = contributors[0]

    return (
      <p className="relative z-10 mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-[#1E1E1E]/60">
        <span>By</span>
        <a
          className={chip}
          href={githubProfileUrl(person)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt=""
            className="size-6 rounded-full"
            height={24}
            src={githubAvatarUrl(person)}
            width={24}
          />
          {person.name}
        </a>
      </p>
    )
  }

  return <ContributorsPopover contributors={contributors} />
}

function ContributorsPopover({
  contributors,
}: {
  contributors: AppContributor[]
}) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  // Closes on a click outside or Escape, returning focus to the button.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }

    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={box} className="relative z-10 mt-2 text-sm font-medium">
      <button
        ref={button}
        aria-controls={panelId}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white py-0.5 pr-3 pl-0.5 font-semibold text-[#1E1E1E] transition-colors hover:bg-black/5"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex -space-x-2">
          {contributors.map((person) => (
            <Image
              key={person.github}
              alt=""
              className="size-6 rounded-full border-2 border-white"
              height={24}
              src={githubAvatarUrl(person)}
              width={24}
            />
          ))}
        </span>
        Contributors
      </button>

      {open && (
        <div
          aria-label="Contributors"
          className="absolute bottom-full left-0 mb-2 w-72 max-w-[calc(100vw-4rem)] rounded-2xl border border-black/10 bg-white p-2"
          id={panelId}
          role="dialog"
        >
          <ul className="flex flex-col">
            {contributors.map((person) => (
              <li key={person.github}>
                <a
                  className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-black/5"
                  href={githubProfileUrl(person)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    alt=""
                    className="size-9 rounded-full"
                    height={36}
                    src={githubAvatarUrl(person)}
                    width={36}
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold text-[#1E1E1E]">
                      {person.name}
                    </span>
                    {person.role && (
                      <span className="text-[#1E1E1E]/60">{person.role}</span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
