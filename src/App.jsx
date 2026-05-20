import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import DynamicForm from './components/DynamicForm.jsx'
import Modal from './components/Modal.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import {
  logout,
  selectCurrentUser,
  selectIsAuthenticated,
} from './features/auth/authSlice.js'
import LoginPage from './pages/LoginPage.jsx'
import FormPage from './pages/FormPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProductListPage from './pages/ProductListPage.jsx'

function App() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('liverpoolSession', JSON.stringify({ user }))
      return
    }

    localStorage.removeItem('liverpoolSession')
  }, [isAuthenticated, user])

  function handleLogout() {
    setIsFormModalOpen(false)
    dispatch(logout())
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand" to="/products" aria-label="Ir al catalogo">
          <span className="brand-mark">L</span>
          <span>Lista de Pokemones</span>
        </NavLink>

        {isAuthenticated ? (
          <>
            <nav className="session-actions" aria-label="Navegacion de usuario">
              <span className="session-email">{user?.email}</span>
              <NavLink className="session-link" to="/products">
                Catalogo
              </NavLink>
              <button
                type="button"
                className="session-button"
                onClick={() => setIsFormModalOpen(true)}
              >
                Formulario
              </button>
              <button
                type="button"
                className="session-button session-button--primary"
                onClick={handleLogout}
              >
                Salir
              </button>
            </nav>

            <details className="session-menu">
              <summary>
                <span>{user?.email}</span>
              </summary>
              <div className="session-menu__panel">
                <NavLink to="/products">Catalogo</NavLink>
                <button type="button" onClick={() => setIsFormModalOpen(true)}>
                  Formulario
                </button>
                <button type="button" onClick={handleLogout}>
                  Salir
                </button>
              </div>
            </details>
          </>
        ) : null}
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:productName"
            element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/formulario"
            element={
              <ProtectedRoute>
                <FormPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {isFormModalOpen ? (
        <Modal
          title="Configuracion perfil"
          onClose={() => setIsFormModalOpen(false)}
        >
          <DynamicForm onCancel={() => setIsFormModalOpen(false)} />
        </Modal>
      ) : null}
    </div>
  )
}

export default App
