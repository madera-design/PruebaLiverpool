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
          <span>Liverpool Pokemon</span>
        </NavLink>

        {isAuthenticated ? (
          <div className="session-actions">
            <span>{user?.email}</span>
            <button type="button" onClick={() => setIsFormModalOpen(true)}>
              Formulario
            </button>
            <button type="button" onClick={handleLogout}>
              Salir
            </button>
          </div>
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
          title="Formulario dinamico"
          onClose={() => setIsFormModalOpen(false)}
        >
          <DynamicForm />
        </Modal>
      ) : null}
    </div>
  )
}

export default App
