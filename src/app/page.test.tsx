import { render, screen } from '@testing-library/react'

import Home from './page'

describe('Home', () => {
  it('renders the hero heading', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Devfest Ilorin\s*2026/i }),
    ).toBeInTheDocument()
  })

  it('renders every landing section', () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', { name: /Our speakers/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /^Sponsors$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /^Partners$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Community Partners/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('exposes the primary navigation links', () => {
    render(<Home />)

    for (const label of ['Speakers', 'Schedule', 'Sponsors', 'Team']) {
      expect(
        screen.getAllByRole('link', { name: label }).length,
      ).toBeGreaterThan(0)
    }
  })
})
