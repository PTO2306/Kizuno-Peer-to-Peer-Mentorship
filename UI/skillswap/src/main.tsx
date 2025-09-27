import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './theme/theme';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <StyledEngineProvider enableCssLayer>
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles styles='@layer theme, base, mui, components, utilities;' />
      <App />
    </ThemeProvider>
  </StyledEngineProvider>
  // </StrictMode>
);
