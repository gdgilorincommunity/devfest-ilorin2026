import { render, screen, within } from '@testing-library/react'

import { APPS } from '@/lib/apps'

import AppsPage from './page'

describe('AppsPage', () => {
  it('renders the page heading', () => {
    render(<AppsPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Apps/i }),
    ).toBeInTheDocument()
  })

  it('links every app to its own route with its preview image', () => {
    render(<AppsPage />)
    const grid = screen.getByRole('region', { name: /All apps/i })

    for (const app of APPS) {
      const link = within(grid).getByRole('link', {
        name: new RegExp(app.name),
      })

      expect(link).toHaveAttribute('href', app.href)
      expect(within(link).getByAltText(app.imageAlt)).toBeInTheDocument()
    }
  })
})
