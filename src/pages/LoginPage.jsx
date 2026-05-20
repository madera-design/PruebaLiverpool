import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage.jsx'
import {
  clearAuthError,
  login,
  selectAuthError,
  selectIsAuthenticated,
  validateCredentials,
} from '../features/auth/authSlice.js'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const error = useSelector(selectAuthError)
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const redirectTo = location.state?.from?.pathname || '/products'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    dispatch(clearAuthError())
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const isValidLogin = validateCredentials(
      formValues.email,
      formValues.password,
    )

    dispatch(login(formValues))
    if (isValidLogin) {
      navigate(redirectTo, { replace: true })
    }
  }

  return (
    <section className="login-page" aria-labelledby="login-title">
      <div className="login-card">
        <div className="login-copy">
          <p className="eyebrow">Pokedex</p>
          <h1 id="login-title">Lista de Pokemones</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <label htmlFor="password">Contraseña</label>
          <div className="password-field">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formValues.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((currentValue) => !currentValue)}
              aria-label={showPassword ? 'Ocultar contrasena' : 'Ver contrasena'}
              aria-pressed={showPassword}
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="20"
                viewBox="0 0 24 24"
                width="20"
              >
                {showPassword ? (
                  <>
                    <path
                      d="M3 3L21 21"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M10.6 10.6A2 2 0 0 0 13.4 13.4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M9.2 5.4A9.9 9.9 0 0 1 12 5C17 5 20.6 9 22 12C21.5 13.1 20.7 14.3 19.7 15.3"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M16.8 18.6A10 10 0 0 1 12 19C7 19 3.4 15 2 12C2.8 10.2 4.4 8.2 6.5 6.9"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M2 12C3.4 9 7 5 12 5C17 5 20.6 9 22 12C20.6 15 17 19 12 19C7 19 3.4 15 2 12Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 15A3 3 0 1 0 12 9A3 3 0 0 0 12 15Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>

          {error ? (
            <StatusMessage
              message={error}
              title="No pudimos iniciar sesion"
              variant="error"
            />
          ) : null}

          <button type="submit">Entrar</button>
        </form>
      </div>
    </section>
  )
}

export default LoginPage
