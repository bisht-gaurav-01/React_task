import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout, selectAuthState } from '../features/auth/authSlice'

function AppLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector(selectAuthState)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 5 }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              overflow: 'hidden',
              border: '1px solid rgba(31, 24, 18, 0.08)',
              background:
                'linear-gradient(135deg, rgba(24, 29, 27, 0.94), rgba(53, 39, 28, 0.9))',
              color: '#fff7ef',
            }}
          >
            <Stack
              spacing={3}
              sx={{
                p: { xs: 3, md: 4 },
                background:
                  'radial-gradient(circle at top right, rgba(255, 201, 167, 0.16), transparent 28%)',
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                spacing={3}
              >
              
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    minWidth: { xs: '100%', md: 280 },
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'inherit',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={user?.image} alt={user?.username}>
                      {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={700}>
                        {user?.firstName
                          ? `${user.firstName} ${user.lastName || ''}`.trim()
                          : user?.username}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                        {user?.email || 'Authenticated session'}
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<LogoutRoundedIcon />}
                    onClick={handleLogout}
                    sx={{ mt: 2 }}
                  >
                    Logout
                  </Button>
                </Paper>
              </Stack>

            </Stack>
          </Paper>

          <Outlet />
        </Stack>
      </Container>
    </Box>
  )
}

export default AppLayout
