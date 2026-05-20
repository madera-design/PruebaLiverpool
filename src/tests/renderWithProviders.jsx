import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import authReducer from '../features/auth/authSlice.js'
import productsReducer from '../features/products/productsSlice.js'

export function renderWithProviders(
  ui,
  {
    preloadedState,
    route = '/',
    store = configureStore({
      reducer: {
        auth: authReducer,
        products: productsReducer,
      },
      preloadedState,
    }),
  } = {},
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    )
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  }
}
