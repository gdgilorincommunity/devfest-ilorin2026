import { fireEvent, render, screen, within } from '@testing-library/react'

import config from '@/config'
import { APPS } from '@/lib/apps'

import AppsPage from './page'

describe('AppsPage', () => {
  it('renders the page heading', () => {
    render(<AppsPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'App Gallery' }),
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
      expect(within(grid).getByAltText(app.imageAlt)).toBeInTheDocument()
    }
  })

  it('credits every author with a link to their GitHub profile', () => {
    render(<AppsPage />)
    const grid = screen.getByRole('region', { name: /All apps/i })

    for (const app of APPS) {
      const card = within(grid)
        .getByRole('heading', { level: 2, name: app.name })
        .closest('article') as HTMLElement

      for (const author of app.authors) {
        expect(
          within(card).getByRole('link', { name: author.name }),
        ).toHaveAttribute('href', `https://github.com/${author.github}`)
      }
    }
  })

  it('opens the submission form in a drawer, with Google Forms as a fallback', async () => {
    render(<AppsPage />)
    fireEvent.click(screen.getByRole('button', { name: /Submit your app/i }))

    const drawer = await screen.findByRole('dialog')

    expect(within(drawer).getByLabelText(/Full name/)).toBeInTheDocument()
    expect(
      within(drawer).getByRole('link', { name: /Open it there/i }),
    ).toHaveAttribute('href', config.appSubmitUrl)
  })
})
