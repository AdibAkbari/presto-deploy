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
  }
});

export default theme;