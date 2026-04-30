import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productsApi } from '../../api/client'

const initialState = {
  items: [],
  total: 0,
  request: {
    limit: 10,
    skip: 0,
    query: '',
  },
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
  mutationError: null,
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, thunkApi) => {
    try {
      const payload = await productsApi.getProducts(params, thunkApi.signal)

      return {
        items: payload.products ?? [],
        total: payload.total ?? 0,
        request: params,
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.message)
    }
  },
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (payload, thunkApi) => {
    try {
      return await productsApi.createProduct(payload, thunkApi.signal)
    } catch (error) {
      return thunkApi.rejectWithValue(error.message)
    }
  },
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, payload }, thunkApi) => {
    try {
      return await productsApi.updateProduct(id, payload, thunkApi.signal)
    } catch (error) {
      return thunkApi.rejectWithValue(error.message)
    }
  },
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, thunkApi) => {
    try {
      return await productsApi.deleteProduct(id, thunkApi.signal)
    } catch (error) {
      return thunkApi.rejectWithValue(error.message)
    }
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsFeedback(state) {
      state.error = null
      state.mutationError = null
      state.mutationStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.total = action.payload.total
        state.request = action.payload.request
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load products.'
      })
      .addCase(createProduct.pending, (state) => {
        state.mutationStatus = 'pending'
        state.mutationError = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = [action.payload, ...state.items]
        state.total += 1
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.payload || 'Unable to create product.'
      })
      .addCase(updateProduct.pending, (state) => {
        state.mutationStatus = 'pending'
        state.mutationError = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item,
        )
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.payload || 'Unable to update product.'
      })
      .addCase(deleteProduct.pending, (state) => {
        state.mutationStatus = 'pending'
        state.mutationError = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        state.items = state.items.filter((item) => item.id !== action.payload.id)
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.mutationError = action.payload || 'Unable to delete product.'
      })
  },
})

export const { clearProductsFeedback } = productsSlice.actions
export const selectProductsState = (state) => state.products

export default productsSlice.reducer
