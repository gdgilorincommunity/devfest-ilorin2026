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

  it('links every app to its own site in a new tab with its preview image', () => {
    render(<AppsPage />)
    const grid = screen.getByRole('region', { name: /All apps/i })

    for (const app of APPS) {
      const link = within(grid).getByRole('link', {
        name: new RegExp(app.name),
      })

      expect(link).toHaveAttribute('href', app.href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(within(grid).getByAltText(app.imageAlt)).toBeInTheDocument()
    }
  })

  it('credits a single contributor by name, with a link to their GitHub profile', () => {
    render(<AppsPage />)
    const grid = screen.getByRole('region', { name: /All apps/i })

    for (const app of APPS.filter((a) => a.contributors.length === 1)) {
      const card = within(grid)
        .getByRole('heading', { level: 2, name: app.name })
        .closest('article') as HTMLElement
      const [person] = app.contributors

      expect(
        within(card).getByRole('link', { name: person.name }),
      ).toHaveAttribute('href', `https://github.com/${person.github}`)
    }
  })

  it('groups several contributors and shows who did what on tap', () => {
    render(<AppsPage />)
    const grid = screen.getByRole('region', { name: /All apps/i })

    for (const app of APPS.filter((a) => a.contributors.length > 1)) {
      const card = within(grid)
        .getByRole('heading', { level: 2, name: app.name })
        .closest('article') as HTMLElement
      const button = within(card).getByRole('button', { name: /Contributors/ })

      expect(button).toHaveAttribute('aria-expanded', 'false')
      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')

      for (const person of app.contributors) {
        const link = within(card).getByRole('link', {
          name: new RegExp(person.name.replace(/[()]/g, '\\$&')),
        })

        expect(link).toHaveAttribute(
          'href',
          `https://github.com/${person.github}`,
        )
        if (person.role) expect(link).toHaveTextContent(person.role)
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
