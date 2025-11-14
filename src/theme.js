import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black
      light: '#424242', // Dark Gray
      dark: '#000000', // Black
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#60a5fa', // Blue
      light: '#93c5fd', // Light Blue
      dark: '#3b82f6', // Dark Blue
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669'
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706'
    },
    background: {
      default: 'transparent',
      paper: '#ffffff'
    },
    text: {
      primary: '#000000',
      secondary: '#6b7280'
    }
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13,
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.75rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1.1rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8rem' },
    caption: { fontSize: '0.75rem' },
    button: { fontSize: '0.8rem', fontWeight: 500 }
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
          padding: '8px 12px',
          border: '1px solid #e0e0e0'
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#90ee90',
          color: '#000000'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          height: '24px'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
          textTransform: 'none',
          backgroundColor: '#4caf50',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#45a049'
          }
        },
        outlined: {
          backgroundColor: 'transparent',
          color: '#4caf50',
          borderColor: '#4caf50',
          '&:hover': {
            backgroundColor: '#f0f8f0',
            borderColor: '#45a049'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      }
    }
  }
});

export const formatCurrency = (amount) => {
  return `KSh ${parseFloat(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export default theme;