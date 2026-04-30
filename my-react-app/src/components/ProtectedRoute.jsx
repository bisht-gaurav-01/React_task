import { Box, CircularProgress } from '@mui/material'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectAuthState } from '../features/auth/authSlice'

function ProtectedRoute() {
  const location = useLocation()
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
