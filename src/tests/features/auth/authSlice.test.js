import authReducer, { login, logout } from '../../../features/auth/authSlice.js'

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('authenticates a user with email and password', () => {
    const state = authReducer(
      undefined,
      login({ email: 'usuario@liverpool.com', password: 'liverpool123' }),
    )

    expect(state.isAuthenticated).toBe(true)
    expect(state.user.email).toBe('usuario@liverpool.com')
    expect(state.error).toBeNull()
  })

  it('stores an error when login data is incomplete', () => {
    const state = authReducer(undefined, login({ email: '', password: '' }))

    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBe('Ingresa correo y contrasena para continuar.')
  })

  it('rejects invalid credentials', () => {
    const state = authReducer(
      undefined,
      login({ email: 'usuario@liverpool.com', password: 'incorrecta' }),
    )

    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.error).toBe('Correo o contrasena incorrectos.')
  })

  it('clears the current session on logout', () => {
    const loggedState = authReducer(
      undefined,
      login({ email: 'usuario@liverpool.com', password: 'liverpool123' }),
    )
    const state = authReducer(loggedState, logout())

    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
  })
})
