import {
  autoPlace,
  fitCircle,
  fitText,
  parseFaceBox,
  posterFileName,
  zoomPlacement,
} from './compose'
import { DP_TEMPLATES } from './templates'

// Every character is as wide as the font size is tall, at half scale: easy
// to reason about, and close enough to real glyph widths.
const measure = (text: string, size: number) => text.length * size * 0.5

const slot = { maxWidth: 200, maxFontSize: 40, minFontSize: 20, maxLines: 1 }

describe('fitText', () => {
  it('keeps the largest size when the text fits', () => {
    expect(fitText('Ada Byron', slot, measure)).toEqual({
      fontSize: 40,
      lines: ['Ada Byron'],
    })
  })

  it('shrinks long text until it fits', () => {
    // 15 characters fit in 200px at size 26 (195px) but not at 27 (202.5px).
    expect(fitText('Abdul Odewolemi', slot, measure)).toEqual({
      fontSize: 26,
      lines: ['Abdul Odewolemi'],
    })
  })

  it('wraps over the allowed lines before shrinking further', () => {
    const fitted = fitText(
      'Senior Software Engineer, Fincra',
      { ...slot, maxLines: 2 },
      measure,
    )

    expect(fitted.lines).toEqual(['Senior Software', 'Engineer, Fincra'])
    expect(fitted.fontSize).toBe(25)
  })

  it('cuts text that cannot fit at the smallest size', () => {
    const fitted = fitText(
      'An extraordinarily long name that will never fit',
      slot,
      measure,
    )

    expect(fitted.fontSize).toBe(20)
    expect(fitted.lines).toHaveLength(1)
    expect(fitted.lines[0]).toMatch(/…$/)
    expect(measure(fitted.lines[0], 20)).toBeLessThanOrEqual(200)
  })

  it('collapses whitespace and ignores empty text', () => {
    expect(fitText('  Ada   Byron ', slot, measure).lines).toEqual([
      'Ada Byron',
    ])
    expect(fitText('   ', slot, measure).lines).toEqual([])
  })
})

describe('autoPlace', () => {
  const template = DP_TEMPLATES[0]
  const { photo } = template

  it('lines the face up with the slot', () => {
    const placement = autoPlace(
      {
        width: 1000,
        height: 1600,
        face: { x: 400, y: 300, width: 200, height: 200 },
      },
      template,
    )

    expect(placement.scale).toBeCloseTo(photo.faceWidth / 200)
    expect(placement.x + 500 * placement.scale).toBeCloseTo(photo.faceX)
    expect(placement.y + 400 * placement.scale).toBeCloseTo(photo.faceY)
  })

  it('fills the poster from the head line with a tight headshot', () => {
    const subject = {
      width: 800,
      height: 800,
      face: { x: 200, y: 200, width: 400, height: 400 },
    }
    const placement = autoPlace(subject, template)

    expect(placement.scale).toBeGreaterThan(photo.faceWidth / 400)
    expect(placement.y).toBeCloseTo(photo.headTop)
    expect(placement.y + subject.height * placement.scale).toBeCloseTo(
      photo.minBottom,
    )
    // Still centred on the face.
    expect(placement.x + 400 * placement.scale).toBeCloseTo(photo.faceX)
  })

  it('fills the poster from the head line without a face', () => {
    const placement = autoPlace(
      { width: 600, height: 900, face: null },
      template,
    )

    expect(placement.y).toBe(photo.headTop)
    expect(placement.y + 900 * placement.scale).toBeCloseTo(photo.minBottom)
    expect(placement.x + 300 * placement.scale).toBeCloseTo(photo.faceX)
  })
})

describe('zoomPlacement', () => {
  it('keeps the anchor point still', () => {
    const before = { x: 100, y: 50, scale: 1 }
    const after = zoomPlacement(before, 2, 300, 250)

    expect(after).toEqual({ x: -100, y: -150, scale: 2 })
    // The photo pixel under (300, 250) is (200, 200) before and after.
    expect((300 - after.x) / after.scale).toBe((300 - before.x) / before.scale)
  })
})

describe('parseFaceBox', () => {
  it('reads x, y, width and height', () => {
    expect(parseFaceBox('10,20,30,40')).toEqual({
      x: 10,
      y: 20,
      width: 30,
      height: 40,
    })
  })

  it.each([null, '', '1,2,3', 'a,b,c,d', '1,2,0,4'])('rejects %p', (header) => {
    expect(parseFaceBox(header)).toBeNull()
  })
})

describe('posterFileName', () => {
  it('slugs the name', () => {
    expect(posterFileName('Abdul-Jemeel Odéwole')).toBe(
      'devfest-ilorin-2026-abdul-jemeel-odewole.png',
    )
  })

  it('falls back when the name has nothing usable', () => {
    expect(posterFileName('  ')).toBe('devfest-ilorin-2026-dp.png')
  })
})

describe('fitCircle', () => {
  const { circle } = DP_TEMPLATES[0]

  it('covers the circle with a portrait photo, centred', () => {
    const placement = fitCircle({ width: 800, height: 1200 }, circle)

    // The short side spans the circle exactly.
    expect(800 * placement.scale).toBeCloseTo(circle.radius * 2)
    expect(placement.x + 400 * placement.scale).toBeCloseTo(circle.x)
    expect(placement.y + 600 * placement.scale).toBeCloseTo(circle.y)
  })

  it('covers the circle with a landscape photo', () => {
    const placement = fitCircle({ width: 1600, height: 900 }, circle)

    expect(900 * placement.scale).toBeCloseTo(circle.radius * 2)
  })
})
