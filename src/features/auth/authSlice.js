import { createSlice } from '@reduxjs/toolkit'

function getStoredSession() {
  try {
    return JSON.parse(localStorage.getItem('liverpoolSession') || 'null')
  } catch {
    return null
  }
}

const storedSession = getStoredSession()

const VALID_USERS = [
  {
    email: 'usuario@liverpool.com',
    name: 'Usuario Liverpool',
    password: 'liverpool123',
    role: 'viewer',
  },
]

export function validateCredentials(email, password) {
  const normalizedEmail = email.trim().toLowerCase()

  return VALID_USERS.find(
    (user) => user.email === normalizedEmail && user.password === password,
  )
}

function validateStoredUser(user) {
  return VALID_USERS.some((validUser) => validUser.email === user?.email)
}

const storedUser = validateStoredUser(storedSession?.user)
  ? storedSession.user
  : null

const initialState = {
  user: storedUser,
  isAuthenticated: Boolean(storedUser),
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const email = action.payload.email.trim().toLowerCase()
      const { password } = action.payload

      if (!email || !password) {
        state.user = null
        state.isAuthenticated = false
        state.error = 'Ingresa correo y contrasena para continuar.'
        return
      }

      const validUser = validateCredentials(email, password)

      if (!validUser) {
        state.user = null
        state.isAuthenticated = false
        state.error = 'Correo o contrasena incorrectos.'
        return
      }

      const user = {
        email: validUser.email,
        name: validUser.name,
        role: validUser.role,
      }

      state.user = user
      state.isAuthenticated = true
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
})

export const { clearAuthError, login, logout } = authSlice.actions

export const selectAuthError = (state) => state.auth.error
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

export default authSlice.reducer
