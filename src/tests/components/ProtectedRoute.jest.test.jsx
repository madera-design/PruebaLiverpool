import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithJest } from '../renderWithJest.jsx'
import ProtectedRoute from '../../components/ProtectedRoute.jsx'

describe('ProtectedRoute with Jest', () => {
  test('redirects guests to login', () => {
    renderWithJest(
      <Routes>
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <div>Catalogo protegido</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login requerido</div>} />
      </Routes>,
      { route: '/products' },
    )

    expect(screen.getByText('Login requerido')).toBeInTheDocument()
    expect(screen.queryByText('Catalogo protegido')).not.toBeInTheDocument()
  })

  test('renders protected content for authenticated users', () => {
    renderWithJest(
      <Routes>
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <div>Catalogo protegido</div>
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

    expect(screen.getByText('Catalogo protegido')).toBeInTheDocument()
  })
})
