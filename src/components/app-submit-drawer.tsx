'use client'

import { useId, useRef, useState } from 'react'
import { Drawer } from '@base-ui/react/drawer'
import { ArrowUpRight, CircleCheck, LoaderCircle, X } from 'lucide-react'

import config from '@/config'
import {
  APP_CATEGORIES,
  APP_CONFIRMATIONS,
  APP_STAGES,
  type AppShowcaseField,
  type AppStage,
  OTHER_CATEGORY,
  TAGLINE_MAX_LENGTH,
  validateSubmission,
} from '@/lib/app-showcase-form'
import { cn } from '@/lib/utils'

type Errors = Partial<Record<AppShowcaseField, string>>
type Status = 'idle' | 'sending' | 'sent' | 'failed'

const inputClass =
  'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-[#1E1E1E] placeholder:text-[#1E1E1E]/35 outline-none transition-colors focus:border-black/40 aria-invalid:border-[#EA4335]'

/**
 * The App Showcase Google Form, rebuilt in a drawer so visitors never leave
 * /apps. The answers are posted to /api/app-showcase, which submits them to
 * the same Google Form, so they still land in its responses sheet.
 */
export function AppSubmitDrawer() {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<AppStage | ''>('')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [failure, setFailure] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  function reset() {
    setStage('')
    setCategory('')
    setErrors({})
    setStatus('idle')
    setFailure('')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const payload = {
      ...Object.fromEntries(form),
      confirmed: form.getAll('confirm').length === APP_CONFIRMATIONS.length,
    }
    const check = validateSubmission(payload)

    if (!check.ok) {
      setErrors(check.errors)
      focusFirstError(check.errors)

      return
    }

    setErrors({})
    setFailure('')
    setStatus('sending')

    try {
      const response = await fetch('/api/app-showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = (await response.json().catch(() => ({}))) as {
        errors?: Errors
        error?: string
      }

      if (response.ok) {
        setStatus('sent')

        return
      }

      if (body.errors) {
        setErrors(body.errors)
        focusFirstError(body.errors)
      }
      setFailure(body.error ?? 'Please check the highlighted answers.')
      setStatus('failed')
    } catch {
      setFailure('Could not send. Check your connection and try again.')
      setStatus('failed')
    }
  }

  function focusFirstError(found: Errors) {
    const first = Object.keys(found)[0]

    formRef.current
      ?.querySelector<HTMLElement>(
        `[name="${first === 'confirmed' ? 'confirm' : first}"]`,
      )
      ?.focus()
  }

  return (
    <Drawer.Root
      open={open}
      swipeDirection="right"
      onOpenChange={(next) => {
        setOpen(next)
        if (next && status === 'sent') reset()
      }}
    >
      <Drawer.Trigger className="ease-out-strong inline-flex cursor-pointer items-center gap-3 rounded-full bg-black px-7 py-4 text-base font-bold text-white transition-transform duration-150 hover:not-active:scale-[1.03] active:scale-[0.97]">
        <span>Submit your app</span>
        <span className="flex size-7 items-center justify-center rounded-full bg-white text-black">
          <ArrowUpRight className="size-4 stroke-[2.5]" />
        </span>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-black opacity-[calc(0.3*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-stretch justify-end">
          <Drawer.Popup className="flex h-full w-full max-w-136 flex-col overflow-y-auto overscroll-contain bg-[#FDF8F8] text-[#1E1E1E] outline-none [transform:translateX(var(--drawer-swipe-movement-x))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:[transform:translateX(100%)] data-starting-style:[transform:translateX(100%)] data-swiping:select-none sm:border-l sm:border-black/10">
            <Drawer.Content className="flex min-h-full flex-col">
              <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-black/5 bg-[#FDF8F8]/90 px-6 py-5 backdrop-blur sm:px-8">
                <div className="flex flex-col gap-1">
                  <Drawer.Title className="text-2xl font-bold tracking-tight">
                    Submit your app
                  </Drawer.Title>
                  <Drawer.Description className="text-sm font-medium text-[#1E1E1E]/60">
                    Feature it in the {config.appName} App Gallery. The GDG
                    Ilorin team reviews every submission.
                  </Drawer.Description>
                </div>
                <Drawer.Close
                  aria-label="Close"
                  className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white transition-colors hover:bg-black/5"
                >
                  <X className="size-5" />
                </Drawer.Close>
              </header>

              {status === 'sent' ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center sm:px-8">
                  <CircleCheck className="size-14 text-[#34A853]" />
                  <h3 className="text-2xl font-bold tracking-tight">
                    Thanks, we got it!
                  </h3>
                  <p className="max-w-80 text-base font-medium text-[#1E1E1E]/60">
                    The GDG Ilorin team will review your submission and reach
                    out by email. Approved apps appear in the App Gallery.
                  </p>
                  <Drawer.Close className="mt-2 cursor-pointer rounded-full bg-black px-7 py-3 text-base font-bold text-white">
                    Done
                  </Drawer.Close>
                </div>
              ) : (
                <form
                  ref={formRef}
                  noValidate
                  className="flex flex-1 flex-col gap-8 px-6 py-6 sm:px-8"
                  onSubmit={handleSubmit}
                >
                  {/* Hidden from people; bots that fill it are dropped. */}
                  <input
                    aria-hidden
                    autoComplete="off"
                    className="hidden"
                    name="website"
                    tabIndex={-1}
                  />

                  <Section title="About you">
                    <Field required error={errors.email} label="Email">
                      {(props) => (
                        <input
                          {...props}
                          autoComplete="email"
                          className={inputClass}
                          name="email"
                          type="email"
                        />
                      )}
                    </Field>
                    <Field required error={errors.fullName} label="Full name">
                      {(props) => (
                        <input
                          {...props}
                          autoComplete="name"
                          className={inputClass}
                          name="fullName"
                        />
                      )}
                    </Field>
                    <Field
                      hint="Optional. Only used if we need to reach you quickly."
                      label="WhatsApp number"
                    >
                      {(props) => (
                        <input
                          {...props}
                          autoComplete="tel"
                          className={inputClass}
                          name="whatsapp"
                          type="tel"
                        />
                      )}
                    </Field>
                    <Field
                      hint="Optional. For example: GDG Ilorin, Unilorin, a startup."
                      label="Community, school or company"
                    >
                      {(props) => (
                        <input
                          {...props}
                          autoComplete="organization"
                          className={inputClass}
                          name="community"
                        />
                      )}
                    </Field>

                    <Choices
                      error={errors.stage}
                      label="Where is your app at?"
                      name="stage"
                      options={Object.entries(APP_STAGES).map(
                        ([value, label]) => ({ value, label }),
                      )}
                      value={stage}
                      onChange={(value) => setStage(value as AppStage)}
                    />
                  </Section>

                  {stage === 'live' && (
                    <>
                      <Section
                        description="This is what we show on the app card if it is approved."
                        title="Your app"
                      >
                        <Field required error={errors.appName} label="App name">
                          {(props) => (
                            <input
                              {...props}
                              className={inputClass}
                              name="appName"
                            />
                          )}
                        </Field>
                        <Field
                          required
                          error={errors.tagline}
                          hint={`Shown under the app name on the card. ${TAGLINE_MAX_LENGTH} characters max.`}
                          label="One-line description"
                        >
                          {(props) => (
                            <input
                              {...props}
                              className={inputClass}
                              maxLength={TAGLINE_MAX_LENGTH}
                              name="tagline"
                            />
                          )}
                        </Field>
                        <Field
                          required
                          error={errors.appUrl}
                          hint="Where people open and use the app."
                          label="App link"
                        >
                          {(props) => (
                            <input
                              {...props}
                              className={inputClass}
                              name="appUrl"
                              placeholder="https://"
                              type="url"
                            />
                          )}
                        </Field>
                        <Field
                          error={errors.sourceUrl}
                          hint="Optional. GitHub, GitLab or similar."
                          label="Source code link"
                        >
                          {(props) => (
                            <input
                              {...props}
                              className={inputClass}
                              name="sourceUrl"
                              placeholder="https://"
                              type="url"
                            />
                          )}
                        </Field>

                        <Choices
                          error={errors.category}
                          label="What kind of app is it?"
                          name="category"
                          options={[...APP_CATEGORIES, OTHER_CATEGORY].map(
                            (value) => ({ value, label: value }),
                          )}
                          value={category}
                          onChange={setCategory}
                        />
                        {category === OTHER_CATEGORY && (
                          <Field
                            required
                            error={errors.categoryOther}
                            label="Other kind of app"
                          >
                            {(props) => (
                              <input
                                {...props}
                                className={inputClass}
                                name="categoryOther"
                              />
                            )}
                          </Field>
                        )}

                        <Field
                          required
                          error={errors.github}
                          hint="One per line. Each builder is credited on the card with their GitHub photo and a link to their profile."
                          label="GitHub usernames of everyone who built it"
                        >
                          {(props) => (
                            <textarea
                              {...props}
                              className={cn(inputClass, 'min-h-24 resize-y')}
                              name="github"
                              rows={3}
                            />
                          )}
                        </Field>
                      </Section>

                      <Section title="Last step">
                        <fieldset
                          aria-describedby={
                            errors.confirmed ? 'confirm-error' : undefined
                          }
                          className="flex flex-col gap-3"
                        >
                          <legend className="mb-3 text-sm font-semibold">
                            Please confirm{' '}
                            <span className="text-[#EA4335]">*</span>
                          </legend>
                          {APP_CONFIRMATIONS.map((statement) => (
                            <label
                              key={statement}
                              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium has-checked:border-black/40"
                            >
                              <input
                                className="mt-0.5 size-4 shrink-0 accent-black"
                                name="confirm"
                                type="checkbox"
                                value={statement}
                              />
                              {statement}
                            </label>
                          ))}
                          {errors.confirmed && (
                            <p
                              className="text-sm font-medium text-[#EA4335]"
                              id="confirm-error"
                            >
                              {errors.confirmed}
                            </p>
                          )}
                        </fieldset>
                        <Field label="Anything else we should know?">
                          {(props) => (
                            <textarea
                              {...props}
                              className={cn(inputClass, 'min-h-24 resize-y')}
                              name="notes"
                              rows={3}
                            />
                          )}
                        </Field>
                      </Section>
                    </>
                  )}

                  <div className="mt-auto flex flex-col gap-4 border-t border-black/5 pt-6">
                    {failure && (
                      <p
                        className="rounded-2xl bg-[#EA4335]/10 px-4 py-3 text-sm font-medium text-[#B3261E]"
                        role="alert"
                      >
                        {failure}
                      </p>
                    )}
                    <button
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-base font-bold text-white transition-opacity disabled:cursor-wait disabled:opacity-70"
                      disabled={status === 'sending'}
                      type="submit"
                    >
                      {status === 'sending' && (
                        <LoaderCircle className="size-5 animate-spin" />
                      )}
                      {status === 'sending' ? 'Sending…' : 'Send submission'}
                    </button>
                    <p className="text-center text-sm font-medium text-[#1E1E1E]/50">
                      Prefer Google Forms?{' '}
                      <a
                        className="underline underline-offset-2 hover:text-[#1E1E1E]"
                        href={config.appSubmitUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Open it there
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm font-medium text-[#1E1E1E]/60">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

type ControlProps = {
  id: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  'aria-required'?: boolean
}

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: (props: ControlProps) => React.ReactNode
}) {
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold" htmlFor={id}>
        {label} {required && <span className="text-[#EA4335]">*</span>}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy || undefined,
        'aria-required': required || undefined,
      })}
      {hint && (
        <p className="text-sm text-[#1E1E1E]/55" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-sm font-medium text-[#EA4335]" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

function Choices({
  label,
  name,
  options,
  value,
  error,
  onChange,
}: {
  label: string
  name: string
  options: { value: string; label: string }[]
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const id = useId()

  return (
    <fieldset
      aria-describedby={error ? `${id}-error` : undefined}
      className="flex flex-col gap-3"
    >
      <legend className="mb-3 text-sm font-semibold">
        {label} <span className="text-[#EA4335]">*</span>
      </legend>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-base font-medium has-checked:border-black/40"
        >
          <input
            checked={value === option.value}
            className="size-4 shrink-0 accent-black"
            name={name}
            type="radio"
            value={option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
      {error && (
        <p className="text-sm font-medium text-[#EA4335]" id={`${id}-error`}>
          {error}
        </p>
      )}
    </fieldset>
  )
}

export default AppSubmitDrawer
