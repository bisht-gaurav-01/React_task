import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout, selectAuthState } from '../features/auth/authSlice'

const navigationItems = [
  {
    label: 'Product Table',
    icon: <TableRowsRoundedIcon fontSize="small" />,
    to: '/products',
  },
]

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
                <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
                  <Chip
                    icon={<Inventory2RoundedIcon />}
                    label="Redux + DummyJSON product workspace"
                    sx={{
                      alignSelf: 'flex-start',
                      color: '#ffe5d4',
                      borderColor: 'rgba(255,255,255,0.24)',
                    }}
                    variant="outlined"
                  />
                  <Typography variant="h3">Northstar Inventory Desk</Typography>
                  <Typography sx={{ color: 'rgba(255, 247, 239, 0.8)', maxWidth: 620 }}>
                    A polished interview build with guarded authentication and a Redux-managed
                    product table that supports read, add, edit, and delete flows on top of
                    DummyJSON.
                  </Typography>
                </Stack>

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

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    startIcon={item.icon}
                    sx={{
                      justifyContent: 'flex-start',
                      px: 2.5,
                      py: 1.25,
                      borderRadius: 999,
                      color: '#fff7ef',
                      border: '1px solid rgba(255,255,255,0.16)',
                      '&.active': {
                        bgcolor: 'rgba(255,255,255,0.16)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
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
