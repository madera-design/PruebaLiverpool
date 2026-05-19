import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  fetchDefaultProducts,
  fetchProductByName,
  fetchProductsPage,
} from '../../services/pokeApi.js'

export const loadDefaultProducts = createAsyncThunk(
  'products/loadDefaultProducts',
  async (_, { getState }) => {
    const { defaultProductNames, entities } = getState().products

    if (defaultProductNames.length > 0) {
      return defaultProductNames.map((name) => entities[name]).filter(Boolean)
    }

    return fetchDefaultProducts()
  },
)

export const searchProductByName = createAsyncThunk(
  'products/searchProductByName',
  async (query, { getState }) => {
    const normalizedQuery = query.toLowerCase().trim()
    const cachedProduct = getState().products.entities[normalizedQuery]

    return cachedProduct || fetchProductByName(normalizedQuery)
  },
)

export const loadMoreProducts = createAsyncThunk(
  'products/loadMoreProducts',
  async (_, { getState }) => {
    const { items, pageSize } = getState().products

    return fetchProductsPage(pageSize, items.length)
  },
  {
    condition: (_, { getState }) => {
      const { hasMore, pagingStatus, query, status } = getState().products

      return !query && hasMore && pagingStatus !== 'loading' && status === 'succeeded'
    },
  },
)

export const loadProductDetail = createAsyncThunk(
  'products/loadProductDetail',
  async (productName, { getState }) => {
    const normalizedProductName = productName.toLowerCase().trim()
    const existingProduct = getState().products.entities[normalizedProductName]

    if (existingProduct?.species) {
      return existingProduct
    }

    return fetchProductByName(normalizedProductName)
  },
)

const initialState = {
  items: [],
  entities: {},
  defaultProductNames: [],
  selectedProduct: null,
  query: '',
  status: 'idle',
  detailStatus: 'idle',
  pagingStatus: 'idle',
  error: null,
  detailError: null,
  lastUpdated: null,
  hasMore: true,
  pageSize: 20,
}

function cacheProducts(state, products) {
  products.forEach((product) => {
    state.entities[product.name] = product
  })
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload
    },
    clearProductsError: (state) => {
      state.error = null
      state.detailError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDefaultProducts.pending, (state) => {
        state.status = 'loading'
        state.pagingStatus = 'idle'
        state.error = null
      })
      .addCase(loadDefaultProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.defaultProductNames = action.payload.map((product) => product.name)
        state.hasMore = action.payload.length >= state.pageSize
        state.lastUpdated = Date.now()
        cacheProducts(state, action.payload)
      })
      .addCase(loadDefaultProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(searchProductByName.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(searchProductByName.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = [action.payload]
        state.hasMore = false
        state.lastUpdated = Date.now()
        cacheProducts(state, [action.payload])
      })
      .addCase(searchProductByName.rejected, (state, action) => {
        state.status = 'failed'
        state.items = []
        state.hasMore = false
        state.error = action.error.message
      })
      .addCase(loadMoreProducts.pending, (state) => {
        state.pagingStatus = 'loading'
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        state.pagingStatus = 'succeeded'
        state.items = [...state.items, ...action.payload.products]
        state.hasMore = action.payload.hasMore
        state.lastUpdated = Date.now()
        cacheProducts(state, action.payload.products)
      })
      .addCase(loadMoreProducts.rejected, (state, action) => {
        state.pagingStatus = 'failed'
        state.error = action.error.message
      })
      .addCase(loadProductDetail.pending, (state) => {
        state.detailStatus = 'loading'
        state.selectedProduct = null
        state.detailError = null
      })
      .addCase(loadProductDetail.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.selectedProduct = action.payload
        state.lastUpdated = Date.now()
        cacheProducts(state, [action.payload])
      })
      .addCase(loadProductDetail.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.selectedProduct = null
        state.detailError = action.error.message
      })
  },
})

export const { clearProductsError, setQuery } = productsSlice.actions

export const selectProducts = (state) => state.products.items
export const selectProductsQuery = (state) => state.products.query
export const selectProductsStatus = (state) => state.products.status
export const selectProductsPagingStatus = (state) => state.products.pagingStatus
export const selectSelectedProduct = (state) => state.products.selectedProduct
export const selectProductDetailStatus = (state) => state.products.detailStatus
export const selectProductsError = (state) => state.products.error
export const selectProductDetailError = (state) => state.products.detailError
export const selectCachedProductsCount = (state) =>
  Object.keys(state.products.entities).length
export const selectProductsLastUpdated = (state) => state.products.lastUpdated
export const selectProductsHasMore = (state) => state.products.hasMore

export default productsSlice.reducer
