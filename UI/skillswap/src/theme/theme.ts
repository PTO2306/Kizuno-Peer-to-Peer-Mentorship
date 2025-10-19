import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#6366f1', // Indigo - trustworthy and professional
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#10b981', // Emerald Green
      light: '#34d399',
      dark: '#059669',
      contrastText: '#fff',
    },
    success: {
      main: '#10b981', // Emerald - positive feedback
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444', // Red - clear errors
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b', // Amber
    },
    info: {
      main: '#3b82f6', // Blue - informative
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#f8fafc', // Very light gray-blue
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Slate - easy to read
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Less aggressive, more friendly
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Softer, more modern corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
