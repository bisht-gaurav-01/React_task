import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productsApi } from '../../api/client'
import {
  loadStoredProductOverrides,
  saveStoredProductOverrides,
} from '../../utils/productStorage'

function matchesQuery(product, rawQuery) {
  const query = rawQuery?.trim().toLowerCase()

  if (!query) {
    return true
  }

  return [product.title, product.category, product.brand, product.description]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(query))
}

function buildVisibleState(state) {
  const deletedIds = new Set(state.deletedIds)
  const createdIds = new Set(state.createdItems.map((item) => item.id))
  const query = state.request.query ?? ''

  const mergedServerItems = state.serverItems
    .map((item) =>
      state.updatedItems[item.id] ? { ...item, ...state.updatedItems[item.id] } : item,
    )
    .filter((item) => !deletedIds.has(item.id))
    .filter((item) => matchesQuery(item, query))

  const mergedCreatedItems = state.createdItems
    .map((item) =>
      state.updatedItems[item.id] ? { ...item, ...state.updatedItems[item.id] } : item,
    )
    .filter((item) => !deletedIds.has(item.id))
    .filter((item) => matchesQuery(item, query))

  const combinedItems =
    state.request.skip === 0 ? [...mergedCreatedItems, ...mergedServerItems] : mergedServerItems

  const dedupedItems = combinedItems.filter(
    (item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index,
  )

  const pagedItems =
    typeof state.request.limit === 'number' && state.request.limit > 0
      ? dedupedItems.slice(0, state.request.limit)
      : dedupedItems

  const deletedServerMatches = Object.values(state.deletedItems).filter(
    (item) => !createdIds.has(item.id) && matchesQuery(item, query),
  ).length

  const total = Math.max(0, state.serverTotal + mergedCreatedItems.length - deletedServerMatches)

  return {
    items: pagedItems,
    total,
  }
}

function saveProductOverrides(state) {
  saveStoredProductOverrides({
    createdItems: state.createdItems,
    updatedItems: state.updatedItems,
    deletedIds: state.deletedIds,
    deletedItems: state.deletedItems,
  })
}

function getBaseProduct(state, id) {
  return (
    state.createdItems.find((item) => item.id === id) ||
    state.serverItems.find((item) => item.id === id) ||
    state.items.find((item) => item.id === id) ||
    state.deletedItems[id] ||
    null
  )
}

function getNextProductId(state) {
  const allIds = [
    ...state.serverItems.map((item) => Number(item.id) || 0),
    ...state.createdItems.map((item) => Number(item.id) || 0),
    ...state.items.map((item) => Number(item.id) || 0),
  ]

  return Math.max(194, ...allIds) + 1
}

const storedOverrides = loadStoredProductOverrides()

const initialState = {
  items: [],
  total: 0,
  serverItems: [],
  serverTotal: 0,
  createdItems: storedOverrides?.createdItems ?? [],
  updatedItems: storedOverrides?.updatedItems ?? {},
  deletedIds: storedOverrides?.deletedIds ?? [],
  deletedItems: storedOverrides?.deletedItems ?? {},
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
    const state = thunkApi.getState().products
    const localProduct = {
      id: getNextProductId(state),
      ...payload,
      isLocalOnly: true,
    }

    try {
      const createdProduct = await productsApi.createProduct(payload, thunkApi.signal)

      return {
        ...createdProduct,
        ...localProduct,
        ...payload,
        serverId: createdProduct.id ?? null,
        isLocalOnly: true,
      }
    } catch {
      return localProduct
    }
  },
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, payload }, thunkApi) => {
    const state = thunkApi.getState().products
    const baseProduct = getBaseProduct(state, id)
    const mergedLocalProduct = {
      ...(baseProduct || {}),
      ...payload,
      id,
      isLocalOnly: true,
    }

    try {
      const localCreatedProduct = state.createdItems.find((item) => item.id === id)

      if (localCreatedProduct?.isLocalOnly) {
        return {
          ...localCreatedProduct,
          ...payload,
          id,
          isLocalOnly: true,
        }
      }

      const updatedProduct = await productsApi.updateProduct(id, payload, thunkApi.signal)

      return {
        ...(baseProduct || {}),
        ...updatedProduct,
        ...payload,
        id,
      }
    } catch {
      return mergedLocalProduct
    }
  },
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, thunkApi) => {
    const state = thunkApi.getState().products
    const localProduct = getBaseProduct(state, id)

    try {
      const localProduct = state.createdItems.find((item) => item.id === id)

      if (localProduct) {
        return {
          ...localProduct,
          id,
          isDeleted: true,
          isLocalOnly: true,
        }
      }

      return await productsApi.deleteProduct(id, thunkApi.signal)
    } catch {
      return {
        ...(localProduct || {}),
        id,
        isDeleted: true,
        isLocalOnly: true,
      }
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
        state.serverItems = action.payload.items
        state.serverTotal = action.payload.total
        state.request = action.payload.request
        const visibleState = buildVisibleState(state)
        state.items = visibleState.items
        state.total = visibleState.total
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
        state.createdItems = [
          action.payload,
          ...state.createdItems.filter((item) => item.id !== action.payload.id),
        ]
        const visibleState = buildVisibleState(state)
        state.items = visibleState.items
        state.total = visibleState.total
        saveProductOverrides(state)
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
        const createdItem = state.createdItems.find((item) => item.id === action.payload.id)
        const serverItem = state.serverItems.find((item) => item.id === action.payload.id)
        const deletedItem = state.deletedItems[action.payload.id]

        if (createdItem) {
          state.createdItems = state.createdItems.map((item) =>
            item.id === action.payload.id ? { ...item, ...action.payload } : item,
          )
          delete state.updatedItems[action.payload.id]
        } else {
          state.updatedItems[action.payload.id] = {
            ...(deletedItem || serverItem || {}),
            ...state.updatedItems[action.payload.id],
            ...action.payload,
          }
          state.serverItems = state.serverItems.map((item) =>
            item.id === action.payload.id ? { ...item, ...action.payload } : item,
          )
        }

        const visibleState = buildVisibleState(state)
        state.items = visibleState.items
        state.total = visibleState.total
        saveProductOverrides(state)
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
        const createdItemToRemove = state.createdItems.find((item) => item.id === action.payload.id)
        const deletedItem =
          createdItemToRemove ||
          state.serverItems.find((item) => item.id === action.payload.id) ||
          state.items.find((item) => item.id === action.payload.id) ||
          action.payload

        if (createdItemToRemove) {
          state.createdItems = state.createdItems.filter((item) => item.id !== action.payload.id)
          delete state.updatedItems[action.payload.id]
        }

        state.deletedIds = [...new Set([...state.deletedIds, action.payload.id])]
        state.deletedItems[action.payload.id] = deletedItem
        const visibleState = buildVisibleState(state)
        state.items = visibleState.items
        state.total = visibleState.total
        saveProductOverrides(state)
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
