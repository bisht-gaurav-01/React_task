import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#a64b2a',
      dark: '#7f381f',
      light: '#d07a55',
    },
    secondary: {
      main: '#285943',
      dark: '#17392a',
      light: '#4f7d67',
    },
    background: {
      default: '#f5efe6',
      paper: 'rgba(255, 252, 247, 0.9)',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#b7791f',
    },
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    h1: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(14px)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.78)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
        },
      },
    },
  },
})
