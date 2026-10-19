import {
  APP_CONFIRMATIONS,
  APP_STAGES,
  toFormBody,
  validateSubmission,
} from './app-showcase-form'

const live = {
  email: 'ada@example.com',
  fullName: 'Ada Lovelace',
  stage: 'live',
  appName: 'Quiz Night',
  tagline: 'Live trivia for the hall.',
  appUrl: 'https://quiz.example.com',
  category: 'Game',
  github: 'ada\nbabbage',
  confirmed: true,
}

describe('validateSubmission', () => {
  it('accepts a complete live app', () => {
    expect(validateSubmission(live).ok).toBe(true)
  })

  it('only needs the first page for an idea', () => {
    expect(
      validateSubmission({
        email: 'ada@example.com',
        fullName: 'Ada',
        stage: 'idea',
      }).ok,
    ).toBe(true)
  })

  it('mirrors the Google Form rules', () => {
    const result = validateSubmission({
      ...live,
      email: 'nope',
      tagline: 'x'.repeat(121),
      appUrl: 'quiz.example.com',
      confirmed: false,
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ['appUrl', 'confirmed', 'email', 'tagline'].sort(),
      )
    }
  })

  it('needs the other answer when the category is Other', () => {
    const result = validateSubmission({ ...live, category: 'Other' })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.categoryOther).toBeDefined()
  })
})

describe('toFormBody', () => {
  it('posts every page of a live app with the matching page history', () => {
    const result = validateSubmission({
      ...live,
      category: 'Other',
      categoryOther: 'Quiz',
    })

    if (!result.ok) throw new Error('expected valid')
    const body = toFormBody(result.data)

    expect(body.get('emailAddress')).toBe('ada@example.com')
    expect(body.get('entry.241172565')).toBe(APP_STAGES.live)
    expect(body.get('entry.1450989321')).toBe('__other_option__')
    expect(body.get('entry.1450989321.other_option_response')).toBe('Quiz')
    expect(body.getAll('entry.1121193514')).toEqual([...APP_CONFIRMATIONS])
    expect(body.get('pageHistory')).toBe('0,1,2')
  })

  it('stops after the first page for an idea', () => {
    const result = validateSubmission({
      email: 'ada@example.com',
      fullName: 'Ada',
      stage: 'idea',
      appName: 'ignored',
    })

    if (!result.ok) throw new Error('expected valid')
    const body = toFormBody(result.data)

    expect(body.get('entry.241172565')).toBe(APP_STAGES.idea)
    expect(body.get('entry.907378593')).toBeNull()
    expect(body.get('pageHistory')).toBe('0')
  })
})
