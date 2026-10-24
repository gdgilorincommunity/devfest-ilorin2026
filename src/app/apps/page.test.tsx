import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'

import config from '@/config'
import { APPS, appGalleryUrl } from '@/lib/apps'

import AppsPage from './page'

describe('AppsPage', () => {
  it('renders the page heading', () => {
    render(<AppsPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'App Gallery' }),
    ).toBeInTheDocument()
  })

  it('links every app to its own site in a new tab with its icon', () => {
    render(<AppsPage />)
    const grid = screen.getByRole('region', { name: /All apps/i })

    for (const app of APPS) {
      const link = within(grid).getByRole('link', {
        name: new RegExp(app.name),
      })

      expect(link).toHaveAttribute('href', appGalleryUrl(app))
      expect(link).toHaveAttribute('target', '_blank')
      expect(within(grid).getByAltText(`${app.name} icon`)).toBeInTheDocument()
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

  it('searches by name, pitch or contributor, and says when nothing matches', () => {
    render(<AppsPage />)
    const grid = screen.getByRole('region', { name: /All apps/i })
    const search = within(grid).getByRole('searchbox', { name: /Search apps/i })

    fireEvent.change(search, { target: { value: 'globe' } })
    expect(within(grid).getAllByRole('article')).toHaveLength(1)
    expect(
      within(grid).getByRole('heading', { level: 2, name: 'DevFest Map' }),
    ).toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'zzzz' } })
    expect(within(grid).queryAllByRole('article')).toHaveLength(0)
    fireEvent.click(
      within(grid).getByRole('button', { name: /Show all apps/i }),
    )
    expect(within(grid).getAllByRole('article')).toHaveLength(APPS.length)
  })

  it('filters by category, with a chip only for categories that have apps', () => {
    render(<AppsPage />)
    const grid = screen.getByRole('region', { name: /All apps/i })
    const games = APPS.filter((app) => app.category === 'Game')

    fireEvent.click(within(grid).getByRole('button', { name: /^Game/ }))
    expect(within(grid).getAllByRole('article')).toHaveLength(games.length)
    for (const app of games) {
      expect(
        within(grid).getByRole('heading', { level: 2, name: app.name }),
      ).toBeInTheDocument()
    }

    if (!APPS.some((app) => app.category === 'Learning platform')) {
      expect(
        within(grid).queryByRole('button', { name: /Learning platform/ }),
      ).not.toBeInTheDocument()
    }
  })

  it('filters from a bottom sheet on phones, which closes on a pick', async () => {
    render(<AppsPage />)
    const grid = screen.getByRole('region', { name: /All apps/i })
    const games = APPS.filter((app) => app.category === 'Game')

    fireEvent.click(
      within(grid).getByRole('button', { name: /Filter by category/i }),
    )
    const sheet = await screen.findByRole('dialog')

    fireEvent.click(within(sheet).getByRole('button', { name: /^Game/ }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
    expect(within(grid).getAllByRole('article')).toHaveLength(games.length)

    fireEvent.click(
      within(grid).getByRole('button', { name: /clear category/i }),
    )
    expect(within(grid).getAllByRole('article')).toHaveLength(APPS.length)
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
