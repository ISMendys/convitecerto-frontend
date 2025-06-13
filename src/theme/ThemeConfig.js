// src/theme/ThemeConfig.js
import React, { useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  alpha
} from '@mui/material/styles';
import { useSelector } from 'react-redux';

// Cores base para tema roxo (customizado)
const purplePrimaryColor   = '#5e35b1';
const purpleSecondaryColor = '#7e57c2';
const purpleTertiaryColor  = '#9575cd';

const purpleDarkPrimaryColor    = '#9575cd';
const purpleDarkSecondaryColor  = '#b39ddb';
const purpleDarkTertiaryColor   = '#d1c4e9';

// Cores base para tema azul (Material-UI padrão)
const bluePrimaryColor   = '#1976d2';
const blueSecondaryColor = '#42a5f5';
const blueTertiaryColor  = '#64b5f6';

const blueDarkPrimaryColor    = '#42a5f5';
const blueDarkSecondaryColor  = '#64b5f6';
const blueDarkTertiaryColor   = '#90caf9';

// Criar tema roxo claro
const createPurpleLightTheme = () => {
  let theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: purplePrimaryColor,
        light: purpleSecondaryColor,
        dark: '#3c1f80',
        contrastText: '#ffffff',
      },
      secondary: {
        main: purpleSecondaryColor,
        light: purpleTertiaryColor,
        dark: '#4d2c91',
        contrastText: '#ffffff',
      },
      background: {
        default: '#f8f9fa',
        paper: '#ffffff',
        secondary: '#f0f2f5',
      },
      text: {
        primary: '#212121',
        secondary: '#424242',
        tertiary: '#757575',
      },
      success: {
        main: '#4caf50',
        light: '#80e27e',
        dark: '#087f23',
        lighter: '#e8f5e9',
      },
      warning: {
        main: '#ff9800',
        light: '#ffc947',
        dark: '#c66900',
        lighter: '#fff3e0',
      },
      error: {
        main: '#f44336',
        light: '#ff7961',
        dark: '#ba000d',
        lighter: '#ffebee',
      },
      info: {
        main: '#2196f3',
        light: '#6ec6ff',
        dark: '#0069c0',
        lighter: '#e3f2fd',
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        'Montserrat',
        'Playfair Display',
        'Dancing Script',
        'Oswald',
        'Poppins',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 700, letterSpacing: '-0.5px' },
      h2: { fontWeight: 700, letterSpacing: '-0.5px' },
      h3: { fontWeight: 700, letterSpacing: '-0.5px' },
      h4: { fontWeight: 700, letterSpacing: '-0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.08)' },
      h5: { fontWeight: 700, letterSpacing: '-0.5px' },
      h6: { fontWeight: 600, letterSpacing: '-0.3px' },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600, color: '#424242' },
      body1: { lineHeight: 1.6 },
      body2: { color: 'text.secondary' },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 16px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)' },
          },
          containedPrimary: {
            background: `linear-gradient(45deg, ${purplePrimaryColor} 30%, ${purpleSecondaryColor} 90%)`,
            boxShadow: '0 4px 12px rgba(94, 53, 177, 0.3)',
            '&:hover': { boxShadow: '0 6px 16px rgba(94, 53, 177, 0.4)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'box-shadow 0.3s ease',
            '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            borderBottom: '1px solid #e0e0e0',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(to right, ${purplePrimaryColor}, ${purpleSecondaryColor}, ${purpleTertiaryColor})`
            }
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: 'linear-gradient(to bottom, #f8f9fa, #f0f2f5)',
            minHeight: '100vh',
          },
        },
      },
    },
  });
  return responsiveFontSizes(theme);
};

// Criar tema azul claro (Material-UI padrão)
const createBlueLightTheme = () => {
  let theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: bluePrimaryColor,
        light: blueSecondaryColor,
        dark: '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: blueSecondaryColor,
        light: blueTertiaryColor,
        dark: '#1976d2',
        contrastText: '#ffffff',
      },
      background: {
        default: '#fafafa',
        paper: '#ffffff',
        secondary: '#f5f5f5',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
        tertiary: '#9e9e9e',
      },
      success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
        lighter: '#e8f5e9',
      },
      warning: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
        lighter: '#fff3e0',
      },
      error: {
        main: '#f44336',
        light: '#e57373',
        dark: '#d32f2f',
        lighter: '#ffebee',
      },
      info: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
        lighter: '#e3f2fd',
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 300, letterSpacing: '-1.5px' },
      h2: { fontWeight: 300, letterSpacing: '-0.5px' },
      h3: { fontWeight: 400, letterSpacing: '0px' },
      h4: { fontWeight: 400, letterSpacing: '0.25px' },
      h5: { fontWeight: 400, letterSpacing: '0px' },
      h6: { fontWeight: 500, letterSpacing: '0.15px' },
      subtitle1: { fontWeight: 400, letterSpacing: '0.15px' },
      subtitle2: { fontWeight: 500, letterSpacing: '0.1px' },
      body1: { fontWeight: 400, letterSpacing: '0.5px' },
      body2: { fontWeight: 400, letterSpacing: '0.25px' },
      button: { fontWeight: 500, letterSpacing: '1.25px', textTransform: 'uppercase' },
    },
    shape: { borderRadius: 4 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            padding: '6px 16px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '1.25px',
          },
          containedPrimary: {
            backgroundColor: bluePrimaryColor,
            '&:hover': { backgroundColor: '#1565c0' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: bluePrimaryColor,
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#fafafa',
            minHeight: '100vh',
          },
        },
      },
    },
  });
  return responsiveFontSizes(theme);
};

// Criar tema roxo escuro
const createPurpleDarkTheme = () => {
  let theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: purpleDarkPrimaryColor,
        light: purpleDarkSecondaryColor,
        dark: '#7e57c2',
        contrastText: '#ffffff',
      },
      secondary: {
        main: purpleDarkSecondaryColor,
        light: purpleDarkTertiaryColor,
        dark: '#7e57c2',
        contrastText: '#ffffff',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
        secondary: '#282828',
      },
      text: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        tertiary: '#bdbdbd',
      },
      success: {
        main: '#81c784',
        light: '#a5d6a7',
        dark: '#4caf50',
        lighter: 'rgba(129, 199, 132, 0.1)',
      },
      warning: {
        main: '#ffb74d',
        light: '#ffcc80',
        dark: '#ff9800',
        lighter: 'rgba(255, 183, 77, 0.1)',
      },
      error: {
        main: '#e57373',
        light: '#ef9a9a',
        dark: '#f44336',
        lighter: 'rgba(229, 115, 115, 0.1)',
      },
      info: {
        main: '#64b5f6',
        light: '#90caf9',
        dark: '#2196f3',
        lighter: 'rgba(100, 181, 246, 0.1)',
      },
      divider: 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
      fontFamily: [
        'Roboto',
        'Montserrat',
        'Playfair Display',
        'Dancing Script',
        'Oswald',
        'Poppins',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 700, letterSpacing: '-0.5px', color: '#ffffff' },
      h2: { fontWeight: 700, letterSpacing: '-0.5px', color: '#ffffff' },
      h3: { fontWeight: 700, letterSpacing: '-0.5px', color: '#ffffff' },
      h4: { fontWeight: 700, letterSpacing: '-0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)', color: '#ffffff' },
      h5: { fontWeight: 700, letterSpacing: '-0.5px', color: '#ffffff' },
      h6: { fontWeight: 600, letterSpacing: '-0.3px', color: '#ffffff' },
      subtitle1: { fontWeight: 600, color: '#e0e0e0' },
      subtitle2: { fontWeight: 600, color: '#e0e0e0' },
      body1: { lineHeight: 1.6, color: '#e0e0e0' },
      body2: { color: '#bdbdbd' },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 16px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)' },
          },
          containedPrimary: {
            background: `linear-gradient(45deg, ${purpleDarkPrimaryColor} 30%, ${purpleDarkSecondaryColor} 90%)`,
            boxShadow: '0 4px 12px rgba(149, 117, 205, 0.3)',
            '&:hover': { boxShadow: '0 6px 16px rgba(149, 117, 205, 0.4)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'box-shadow 0.3s ease',
            '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.4)' },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e1e1e',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(to right, ${purpleDarkPrimaryColor}, ${purpleDarkSecondaryColor}, ${purpleDarkTertiaryColor})`
            }
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#121212',
            minHeight: '100vh',
          },
        },
      },
    },
  });
  return responsiveFontSizes(theme);
};

// Criar tema azul escuro
const createBlueDarkTheme = () => {
  let theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: blueDarkPrimaryColor,
        light: blueDarkSecondaryColor,
        dark: '#1976d2',
        contrastText: '#ffffff',
      },
      secondary: {
        main: blueDarkSecondaryColor,
        light: blueDarkTertiaryColor,
        dark: '#1976d2',
        contrastText: '#ffffff',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
        secondary: '#282828',
      },
      text: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        tertiary: '#bdbdbd',
      },
      success: {
        main: '#81c784',
        light: '#a5d6a7',
        dark: '#4caf50',
        lighter: 'rgba(129, 199, 132, 0.1)',
      },
      warning: {
        main: '#ffb74d',
        light: '#ffcc80',
        dark: '#ff9800',
        lighter: 'rgba(255, 183, 77, 0.1)',
      },
      error: {
        main: '#e57373',
        light: '#ef9a9a',
        dark: '#f44336',
        lighter: 'rgba(229, 115, 115, 0.1)',
      },
      info: {
        main: '#64b5f6',
        light: '#90caf9',
        dark: '#2196f3',
        lighter: 'rgba(100, 181, 246, 0.1)',
      },
      divider: 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
      fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 300, letterSpacing: '-1.5px', color: '#ffffff' },
      h2: { fontWeight: 300, letterSpacing: '-0.5px', color: '#ffffff' },
      h3: { fontWeight: 400, letterSpacing: '0px', color: '#ffffff' },
      h4: { fontWeight: 400, letterSpacing: '0.25px', color: '#ffffff' },
      h5: { fontWeight: 400, letterSpacing: '0px', color: '#ffffff' },
      h6: { fontWeight: 500, letterSpacing: '0.15px', color: '#ffffff' },
      subtitle1: { fontWeight: 400, letterSpacing: '0.15px', color: '#e0e0e0' },
      subtitle2: { fontWeight: 500, letterSpacing: '0.1px', color: '#e0e0e0' },
      body1: { fontWeight: 400, letterSpacing: '0.5px', color: '#e0e0e0' },
      body2: { fontWeight: 400, letterSpacing: '0.25px', color: '#bdbdbd' },
      button: { fontWeight: 500, letterSpacing: '1.25px', textTransform: 'uppercase' },
    },
    shape: { borderRadius: 4 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            padding: '6px 16px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '1.25px',
          },
          containedPrimary: {
            backgroundColor: blueDarkPrimaryColor,
            '&:hover': { backgroundColor: '#1976d2' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor: '#1e1e1e',
            boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: blueDarkPrimaryColor,
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#121212',
            minHeight: '100vh',
          },
        },
      },
    },
  });
  return responsiveFontSizes(theme);
};

export const ColorModeProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const config = useSelector((state) => state.config);
  const { theme: themeMode = 'light', themeStyle = 'purple' } = config || {};

  const theme = useMemo(() => {
    if (themeMode === 'dark') {
      if (themeStyle === 'blue') {
        return createBlueDarkTheme();
      } else {
        return createPurpleDarkTheme();
      }
    } else {
      if (themeStyle === 'blue') {
        return createBlueLightTheme();
      } else {
        return createPurpleLightTheme();
      }
    }
  }, [themeMode, themeStyle]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};


