import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import AppRoutes from './router'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('AppRoutes', () => {
  it('renders the home page at /', () => {
    renderAt('/')

    expect(
      screen.getByRole('heading', { name: 'Get started' }),
    ).toBeInTheDocument()
  })

  it('renders the 404 page for unknown paths', () => {
    renderAt('/tidak-ada')

    expect(
      screen.getByRole('heading', { name: /404/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /kembali ke beranda/i }),
    ).toHaveAttribute('href', '/')
  })
})
