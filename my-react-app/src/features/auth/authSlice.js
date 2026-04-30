import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authApi } from '../../api/client'
import {
  clearStoredSession,
  loadStoredSession,
  saveStoredSession,
} from '../../utils/authStorage'

const storedSession = loadStoredSession()

const initialState = {
  user: storedSession?.user ?? null,
  accessToken: storedSession?.accessToken ?? null,
  refreshToken: storedSession?.refreshToken ?? null,
  isAuthenticated: Boolean(storedSession?.accessToken),
  loginStatus: 'idle',
  registerStatus: 'idle',
  bootstrapStatus: storedSession?.accessToken ? 'pending' : 'succeeded',
  error: null,
  registerError: null,
  registerMessage: '',
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkApi) => {
    try {
      return await authApi.login(credentials, thunkApi.signal)
    } catch (error) {
      return thunkApi.rejectWithValue(error.message)
    }
  },
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, thunkApi) => {
    try {
      return await authApi.register(payload, thunkApi.signal)
    } catch (error) {
      return thunkApi.rejectWithValue(error.message)
    }
  },
)

export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrapAuth',
  async (_, thunkApi) => {
    const token = thunkApi.getState().auth.accessToken

    if (!token) {
      return null
    }

    try {
      return await authApi.getCurrentUser(token, thunkApi.signal)
    } catch (error) {
      return thunkApi.rejectWithValue(error.message)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.loginStatus = 'idle'
      state.error = null
      clearStoredSession()
    },
    clearRegisterState(state) {
      state.registerStatus = 'idle'
      state.registerError = null
      state.registerMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = 'pending'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = 'succeeded'
        state.isAuthenticated = true
        state.user = {
          id: action.payload.id,
          username: action.payload.username,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          image: action.payload.image,
        }
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.bootstrapStatus = 'succeeded'

        saveStoredSession({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        })
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = 'failed'
        state.error = action.payload || 'Unable to sign in with those credentials.'
      })
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'pending'
        state.registerError = null
        state.registerMessage = ''
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = 'succeeded'
        state.registerMessage = `Account created for ${action.payload.username}. DummyJSON simulates registration, so use a sample login account to access protected routes.`
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed'
        state.registerError = action.payload || 'Unable to register right now.'
      })
      .addCase(bootstrapAuth.pending, (state) => {
        state.bootstrapStatus = 'pending'
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.bootstrapStatus = 'succeeded'

        if (action.payload) {
          state.user = action.payload
          state.isAuthenticated = true

          saveStoredSession({
            user: state.user,
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
          })
        }
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.bootstrapStatus = 'failed'
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        clearStoredSession()
      })
  },
})

export const { logout, clearRegisterState } = authSlice.actions

export const selectAuthState = (state) => state.auth

export default authSlice.reducer
