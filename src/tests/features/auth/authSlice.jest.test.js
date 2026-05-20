import authReducer, { login, logout } from '../../../features/auth/authSlice.js'

describe('authSlice with Jest', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('creates an authenticated session', () => {
    const state = authReducer(
      undefined,
      login({ email: 'usuario@liverpool.com', password: 'liverpool123' }),
    )

    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual({
      email: 'usuario@liverpool.com',
      name: 'Usuario Liverpool',
      role: 'viewer',
    })
  })

  test('rejects an empty login form', () => {
    const state = authReducer(undefined, login({ email: '', password: '' }))

    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBe('Ingresa correo y contrasena para continuar.')
  })

  test('rejects invalid credentials', () => {
    const state = authReducer(
      undefined,
      login({ email: 'usuario@liverpool.com', password: 'wrong' }),
    )

    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.error).toBe('Correo o contrasena incorrectos.')
  })

  test('logs out the current user', () => {
    const authenticatedState = authReducer(
      undefined,
      login({ email: 'usuario@liverpool.com', password: 'liverpool123' }),
    )

    const state = authReducer(authenticatedState, logout())

    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
  })
})
