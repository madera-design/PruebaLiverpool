import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '../renderWithProviders.jsx'
import ProtectedRoute from '../../components/ProtectedRoute.jsx'

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <div>Catalogo privado</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>,
      { route: '/products' },
    )

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Catalogo privado')).not.toBeInTheDocument()
  })

  it('renders children for authenticated users', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <div>Catalogo privado</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      {
        route: '/products',
        preloadedState: {
          auth: {
            user: { email: 'usuario@liverpool.com' },
            isAuthenticated: true,
            error: null,
          },
        },
      },
    )

    expect(screen.getByText('Catalogo privado')).toBeInTheDocument()
  })
})
