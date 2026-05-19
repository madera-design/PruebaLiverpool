import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import productsReducer from '../features/products/productsSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
})
