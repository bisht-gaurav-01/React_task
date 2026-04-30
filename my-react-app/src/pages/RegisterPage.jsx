import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  clearRegisterState,
  registerUser,
  selectAuthState,
} from '../features/auth/authSlice'

const initialFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
}

function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { registerStatus, registerError, registerMessage } = useAppSelector(selectAuthState)
  const [formValues, setFormValues] = useState(initialFormValues)

  useEffect(() => {
    return () => {
      dispatch(clearRegisterState())
    }
  }, [dispatch])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const result = await dispatch(registerUser(formValues))

    if (registerUser.fulfilled.match(result)) {
      navigate('/login', {
        replace: true,
        state: { registeredUser: formValues.username },
      })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2 }}>
      <Container maxWidth="md">
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
              <Typography variant="h4">Register account</Typography>
              <Typography sx={{ mt: 1, color: 'text.secondary', maxWidth: 680 }}>
                This screen uses DummyJSON&apos;s simulated user creation endpoint. It proves
                the register workflow, validation flow, and API integration even though the
                backend will not persist a real account.
              </Typography>
            </Box>

            <Alert severity="info">
              The API will return a created user object, but it will not create a permanent
              account you can use for future authentication.
            </Alert>

            {registerError ? <Alert severity="error">{registerError}</Alert> : null}
            {registerMessage ? <Alert severity="success">{registerMessage}</Alert> : null}

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="First name"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Last name"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                required
                fullWidth
              />
            </Stack>

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              required
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<PersonAddAltRoundedIcon />}
                disabled={registerStatus === 'pending'}
              >
                {registerStatus === 'pending' ? 'Creating account...' : 'Create account'}
              </Button>
              <Button component={Link} to="/login" variant="outlined" size="large">
                Back to login
              </Button>
            </Stack>

            <Typography sx={{ color: 'text.secondary' }}>
              Want to return to the sample login instead?{' '}
              <MuiLink component={Link} to="/login" underline="hover">
                Sign in here
              </MuiLink>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default RegisterPage
