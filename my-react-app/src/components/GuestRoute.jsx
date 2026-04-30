import { Box, CircularProgress } from '@mui/material'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectAuthState } from '../features/auth/authSlice'

function GuestRoute() {
  const { isAuthenticated, bootstrapStatus } = useAppSelector(selectAuthState)

  if (bootstrapStatus === 'pending') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  return <Outlet />
}

export default GuestRoute
