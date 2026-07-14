import { render, screen } from '@testing-library/react'

import Home from './page'

describe('Home', () => {
  it('renders the hello world heading', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { name: /November 2026/i }),
    ).toBeInTheDocument()
  })
})
