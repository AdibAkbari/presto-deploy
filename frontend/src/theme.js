import { createTheme } from '@mui/material/styles';
import '@fontsource/open-sans';
import '@fontsource/poppins';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Open Sans, sans-serif', // Use your preferred font here
  },
  palette: {
    error: {
      main: '#D12317'
    },
    secondary: {
      main: '#000000'
    }
  },
  breakpoints: {
    values: {
      xxs: 0,      
      xs: 650,
      sm: 800,
      md: 1100,
      lg: 1280,
      xl: 1920
    }
  }
});

export default theme;