import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loginUser, selectAuthState } from '../features/auth/authSlice'

const defaultCredentials = {
  username: 'emilys',
  password: 'emilyspass',
}

function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loginStatus, error } = useAppSelector(selectAuthState)
  const [credentials, setCredentials] = useState(defaultCredentials)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((currentValues) => ({ ...currentValues, [name]: value }))
  }

  console.log("credentials",credentials)
  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await dispatch(loginUser(credentials))

    if (loginUser.fulfilled.match(result)) {
      navigate('/products', { replace: true })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              border: '1px solid rgba(31, 24, 18, 0.08)',
              background:
                'linear-gradient(140deg, rgba(24,29,27,0.95), rgba(74,45,31,0.9))',
              color: '#fff7ef',
            }}
          >
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'inherit',
                  border: '1px solid rgba(255,255,255,0.16)',
                }}
              >
                <Stack spacing={1.25}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TaskAltRoundedIcon color="inherit" />
                    <Typography fontWeight={700}>Recommended demo credentials</Typography>
                  </Stack>
                  <Typography variant="body2">Username: emilys</Typography>
                  <Typography variant="body2">Password: emilyspass</Typography>
                </Stack>
              </Paper>
            </Stack>
          </Paper>

          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              border: '1px solid rgba(31, 24, 18, 0.08)',
            }}
          >
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h4">Sign in</Typography>
            
              </Box>

              {location.state?.registeredUser ? (
                <Alert severity="success">
                  Registration was simulated for {location.state.registeredUser}. DummyJSON does
                  not persist that account, so keep using the sample credentials for login.
                </Alert>
              ) : null}

              {error ? <Alert severity="error">{error}</Alert> : null}

              <TextField
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                size="large"
                variant="contained"
                startIcon={<LoginRoundedIcon />}
                disabled={loginStatus === 'pending'}
              >
                {loginStatus === 'pending' ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default LoginPage
