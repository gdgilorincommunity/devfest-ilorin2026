/**
 * The DevFest Ilorin 2026 App Showcase Google Form, submitted from our own
 * drawer on /apps instead of the Google Forms page. Responses still land in
 * the form's linked sheet.
 *
 * Every id and option label below is copied from the live form. If someone
 * edits a question or an option's wording in Google Forms, update it here
 * too, or that answer is rejected or dropped.
 */
export const APP_SHOWCASE_FORM_ID =
  '1FAIpQLSdn8G4UMeGbKXJgI0rI88zn9RAqYpibbhZZzpwECAgb99H6hw'

export const APP_SHOWCASE_RESPONSE_URL = `https://docs.google.com/forms/d/e/${APP_SHOWCASE_FORM_ID}/formResponse`

const ENTRY = {
  fullName: 'entry.916487673',
  whatsapp: 'entry.1543544734',
  community: 'entry.2067097663',
  stage: 'entry.241172565',
  appName: 'entry.907378593',
  tagline: 'entry.40303360',
  appUrl: 'entry.1793722439',
  sourceUrl: 'entry.754686805',
  category: 'entry.1450989321',
  github: 'entry.1645565120',
  confirm: 'entry.1121193514',
  notes: 'entry.1962877526',
} as const

export const APP_STAGES = {
  live: 'Live — people can use it today',
  idea: 'Just an idea',
} as const

export type AppStage = keyof typeof APP_STAGES

export const APP_CATEGORIES = [
  'Game',
  'Engagement tool',
  'Learning platform',
  'Utility',
] as const

export const OTHER_CATEGORY = 'Other'

export const APP_CONFIRMATIONS = [
  'I (or my team) built this or are building it, and attendees can use it for free.',
  "GDG Ilorin can show the app's name, description, image and builders' GitHub profiles on devfestilorin.com.",
] as const

export const TAGLINE_MAX_LENGTH = 120

export type AppShowcaseSubmission = {
  email: string
  fullName: string
  whatsapp: string
  community: string
  stage: AppStage
  appName: string
  tagline: string
  appUrl: string
  sourceUrl: string
  category: string
  categoryOther: string
  github: string
  confirmed: boolean
  notes: string
}

export type AppShowcaseField = keyof AppShowcaseSubmission

export type ValidationResult =
  | { ok: true; data: AppShowcaseSubmission }
  | { ok: false; errors: Partial<Record<AppShowcaseField, string>> }

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function isUrl(value: string) {
  try {
    const url = new URL(value)

    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * Mirrors the Google Form's own rules, so the visitor sees a problem next to
 * the field instead of Google rejecting the whole submission. The "Just an
 * idea" path ends after the first page on the form, so only those answers
 * are required for it.
 */
export function validateSubmission(input: unknown): ValidationResult {
  const raw = (input ?? {}) as Record<string, unknown>
  const stage = text(raw.stage) as AppStage

  const data: AppShowcaseSubmission = {
    email: text(raw.email),
    fullName: text(raw.fullName),
    whatsapp: text(raw.whatsapp),
    community: text(raw.community),
    stage,
    appName: text(raw.appName),
    tagline: text(raw.tagline),
    appUrl: text(raw.appUrl),
    sourceUrl: text(raw.sourceUrl),
    category: text(raw.category),
    categoryOther: text(raw.categoryOther),
    github: text(raw.github),
    confirmed: raw.confirmed === true,
    notes: text(raw.notes),
  }

  const errors: Partial<Record<AppShowcaseField, string>> = {}

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!data.fullName) errors.fullName = 'Enter your full name.'
  if (!(stage in APP_STAGES)) errors.stage = 'Choose where your app is at.'

  if (stage === 'live') {
    if (!data.appName) errors.appName = 'Enter the app name.'
    if (!data.tagline) {
      errors.tagline = 'Enter a one-line description.'
    } else if (data.tagline.length > TAGLINE_MAX_LENGTH) {
      errors.tagline = `Keep it to ${TAGLINE_MAX_LENGTH} characters or fewer.`
    }
    if (!isUrl(data.appUrl)) {
      errors.appUrl = 'Enter a full link, starting with https://'
    }
    if (data.sourceUrl && !isUrl(data.sourceUrl)) {
      errors.sourceUrl = 'Enter a full link, starting with https://'
    }
    if (data.category === OTHER_CATEGORY) {
      if (!data.categoryOther)
        errors.categoryOther = 'Say what kind of app it is.'
    } else if (!(APP_CATEGORIES as readonly string[]).includes(data.category)) {
      errors.category = 'Choose what kind of app it is.'
    }
    if (!data.github) {
      errors.github = 'Add at least one GitHub username.'
    }
    if (!data.confirmed) errors.confirmed = 'Please confirm both statements.'
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data }
}

/**
 * Builds the body Google Forms expects at `formResponse`. `pageHistory` lists
 * the pages the visitor went through; without it Google only reads the first
 * page and ignores the rest.
 */
export function toFormBody(data: AppShowcaseSubmission) {
  const body = new URLSearchParams()

  body.append('emailAddress', data.email)
  body.append(ENTRY.fullName, data.fullName)
  if (data.whatsapp) body.append(ENTRY.whatsapp, data.whatsapp)
  if (data.community) body.append(ENTRY.community, data.community)
  body.append(ENTRY.stage, APP_STAGES[data.stage])

  if (data.stage === 'idea') {
    body.append('pageHistory', '0')

    return body
  }

  body.append(ENTRY.appName, data.appName)
  body.append(ENTRY.tagline, data.tagline)
  body.append(ENTRY.appUrl, data.appUrl)
  if (data.sourceUrl) body.append(ENTRY.sourceUrl, data.sourceUrl)

  if (data.category === OTHER_CATEGORY) {
    body.append(ENTRY.category, '__other_option__')
    body.append(`${ENTRY.category}.other_option_response`, data.categoryOther)
  } else {
    body.append(ENTRY.category, data.category)
  }

  body.append(ENTRY.github, data.github)
  for (const statement of APP_CONFIRMATIONS) {
    body.append(ENTRY.confirm, statement)
  }
  if (data.notes) body.append(ENTRY.notes, data.notes)

  body.append('pageHistory', '0,1,2')

  return body
}

/**
 * Google's "response recorded" page carries no question ids; a page that
 * sends the form back to be filled in again lists every one of them.
 */
export function isFormSentBack(html: string) {
  return html.includes(ENTRY.fullName.replace('entry.', ''))
}
