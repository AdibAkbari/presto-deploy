import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
