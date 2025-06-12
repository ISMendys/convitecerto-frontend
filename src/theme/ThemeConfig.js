// src/theme/ThemeConfig.js
import React, { useState, useEffect, useMemo, createContext } from 'react';
import { CssBaseline } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { 
  ThemeProvider, 
  createTheme,
  responsiveFontSizes, 
  alpha 
} from '@mui/material/styles';
// Contexto para alternar o tema em qualquer lugar da app
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Cores base para claro e escuro
const lightPrimaryColor   = '#5e35b1';
const lightSecondaryColor = '#7e57c2';
const lightTertiaryColor  = '#9575cd';

const darkPrimaryColor    = '#9575cd';
const darkSecondaryColor  = '#b39ddb';
const darkTertiaryColor   = '#d1c4e9';

// Criar tema claro
const createLightTheme = () => {
  let theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: lightPrimaryColor,
        light: lightSecondaryColor,
        dark: '#3c1f80',
        contrastText: '#ffffff',
      },
      secondary: {
        main: lightSecondaryColor,
        light: lightTertiaryColor,
        dark: '#4d2c91',
        contrastText: '#ffffff',
      },
      background: {
        default: '#f8f9fa', // Fundo principal das diretrizes
        paper: '#ffffff',
        secondary: '#f0f2f5', // Fundo secundário das diretrizes
      },
      text: {
        primary: '#212121', // Texto principal das diretrizes
        secondary: '#424242', // Texto secundário das diretrizes
        tertiary: '#757575', // Texto terciário das diretrizes
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
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
        textShadow: '0 2px 4px rgba(0,0,0,0.08)',
      },
      h5: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.3px',
      },
      subtitle1: {
        fontWeight: 600,
      },
      subtitle2: {
        fontWeight: 600,
        color: '#424242',
      },
      body1: {
        lineHeight: 1.6,
      },
      body2: {
        color: 'text.secondary',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 10, // Padrão de bordas arredondadas das diretrizes
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10, // Padrão de botões das diretrizes
            padding: '8px 16px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          },
          containedPrimary: {
            background: `linear-gradient(45deg, ${lightPrimaryColor} 30%, ${lightSecondaryColor} 90%)`,
            boxShadow: '0 4px 12px rgba(94, 53, 177, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(94, 53, 177, 0.4)',
            },
          },
          containedSecondary: {
            '&:hover': {
              boxShadow: '0 6px 16px rgba(126, 87, 194, 0.4)',
            },
          },
          outlined: {
            '&:hover': {
              backgroundColor: alpha(lightPrimaryColor, 0.05),
            },
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
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
          elevation0: {
            border: '1px solid #e0e0e0',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              height: '56px',
              transition: 'all 0.2s ease',
              '&:hover': { 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 2px ${alpha(lightPrimaryColor, 0.2)}`
              }
            },
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
              background: `linear-gradient(to right, ${lightPrimaryColor}, ${lightSecondaryColor}, ${lightTertiaryColor})`
            }
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            boxShadow: '1px 0px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 500,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(lightPrimaryColor, 0.05)
            },
            '&.Mui-selected': {
              color: lightPrimaryColor,
            }
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: '3px 3px 0 0',
            backgroundColor: lightPrimaryColor,
          },
          root: {
            '& .MuiTabs-flexContainer': {
              borderBottom: `1px solid ${alpha(lightPrimaryColor, 0.1)}`
            }
          }
        }
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          },
          filledSuccess: {
            fontWeight: 500,
          },
          filledError: {
            fontWeight: 500,
          },
          filledInfo: {
            fontWeight: 500,
          },
          filledWarning: {
            fontWeight: 500,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 10,
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            padding: '16px 24px',
          }
        }
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: '16px 24px 24px',
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            margin: '16px 0',
          }
        }
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            backgroundColor: 'rgba(33, 33, 33, 0.9)',
            padding: '8px 12px',
            fontSize: '0.75rem',
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: 'linear-gradient(to bottom, #f8f9fa, #f0f2f5)',
            minHeight: '100vh',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: alpha(lightPrimaryColor, 0.3),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: alpha(lightPrimaryColor, 0.5),
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(lightPrimaryColor, 0.1),
              transform: 'scale(1.05)',
            }
          }
        }
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            minHeight: '42px',
          }
        }
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          }
        }
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            '& .MuiSnackbarContent-root': {
              borderRadius: 10,
            }
          }
        }
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    spacing: 8, // Base spacing unit
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
    shadows: [
      'none',
      '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)',
      '0px 3px 3px -2px rgba(0,0,0,0.06),0px 2px 6px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.06)',
      '0px 3px 4px -2px rgba(0,0,0,0.07),0px 3px 8px 0px rgba(0,0,0,0.05),0px 1px 12px 0px rgba(0,0,0,0.07)',
      '0 4px 20px rgba(0,0,0,0.08)', // Sombra padrão das diretrizes
      '0px 5px 6px -3px rgba(0,0,0,0.09),0px 8px 12px 1px rgba(0,0,0,0.06),0px 3px 16px 2px rgba(0,0,0,0.09)',
      '0px 6px 7px -4px rgba(0,0,0,0.1),0px 10px 15px 1px rgba(0,0,0,0.07),0px 4px 20px 3px rgba(0,0,0,0.1)',
      '0px 7px 9px -4px rgba(0,0,0,0.11),0px 12px 19px 2px rgba(0,0,0,0.08),0px 5px 24px 4px rgba(0,0,0,0.11)',
      '0 8px 30px rgba(0,0,0,0.12)', // Sombra hover das diretrizes
      '0px 9px 12px -6px rgba(0,0,0,0.13),0px 16px 24px 2px rgba(0,0,0,0.09),0px 7px 30px 5px rgba(0,0,0,0.13)',
      '0px 10px 14px -6px rgba(0,0,0,0.14),0px 18px 27px 2px rgba(0,0,0,0.1),0px 8px 34px 6px rgba(0,0,0,0.14)',
      '0px 11px 15px -7px rgba(0,0,0,0.15),0px 20px 30px 3px rgba(0,0,0,0.11),0px 9px 38px 7px rgba(0,0,0,0.15)',
      '0px 12px 17px -8px rgba(0,0,0,0.16),0px 22px 33px 3px rgba(0,0,0,0.12),0px 10px 42px 7px rgba(0,0,0,0.16)',
      '0px 13px 19px -8px rgba(0,0,0,0.17),0px 24px 36px 3px rgba(0,0,0,0.13),0px 11px 46px 8px rgba(0,0,0,0.17)',
      '0px 14px 21px -9px rgba(0,0,0,0.18),0px 26px 39px 4px rgba(0,0,0,0.14),0px 12px 50px 9px rgba(0,0,0,0.18)',
      '0px 15px 22px -9px rgba(0,0,0,0.19),0px 28px 42px 4px rgba(0,0,0,0.15),0px 13px 54px 9px rgba(0,0,0,0.19)',
      '0px 16px 24px -10px rgba(0,0,0,0.2),0px 30px 45px 5px rgba(0,0,0,0.16),0px 14px 58px 10px rgba(0,0,0,0.2)',
      '0px 17px 26px -11px rgba(0,0,0,0.21),0px 32px 48px 5px rgba(0,0,0,0.17),0px 15px 62px 11px rgba(0,0,0,0.21)',
      '0px 18px 28px -12px rgba(0,0,0,0.22),0px 34px 51px 5px rgba(0,0,0,0.18),0px 16px 66px 12px rgba(0,0,0,0.22)',
      '0px 19px 29px -12px rgba(0,0,0,0.23),0px 36px 54px 6px rgba(0,0,0,0.19),0px 17px 70px 12px rgba(0,0,0,0.23)',
      '0px 20px 31px -13px rgba(0,0,0,0.24),0px 38px 57px 6px rgba(0,0,0,0.2),0px 18px 74px 13px rgba(0,0,0,0.24)',
      '0px 21px 33px -13px rgba(0,0,0,0.25),0px 40px 60px 6px rgba(0,0,0,0.21),0px 19px 78px 14px rgba(0,0,0,0.25)',
      '0px 22px 35px -14px rgba(0,0,0,0.26),0px 42px 63px 7px rgba(0,0,0,0.22),0px 20px 82px 14px rgba(0,0,0,0.26)',
      '0px 23px 36px -14px rgba(0,0,0,0.27),0px 44px 66px 7px rgba(0,0,0,0.23),0px 21px 86px 15px rgba(0,0,0,0.27)',
      '0px 24px 38px -15px rgba(0,0,0,0.28),0px 46px 69px 7px rgba(0,0,0,0.24),0px 22px 90px 16px rgba(0,0,0,0.28)',
    ],
  });

  // Aplicar fontes responsivas
  return responsiveFontSizes(theme);
};

// Criar tema escuro
const createDarkTheme = () => {
  let theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: darkPrimaryColor,
        light: darkSecondaryColor,
        dark: '#7e57c2',
        contrastText: '#ffffff',
      },
      secondary: {
        main: darkSecondaryColor,
        light: darkTertiaryColor,
        dark: '#7e57c2',
        contrastText: '#ffffff',
      },
      background: {
        default: '#121212', // Fundo principal escuro
        paper: '#1e1e1e',   // Fundo de componentes escuro
        secondary: '#282828', // Fundo secundário escuro
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
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
        color: '#ffffff',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
        color: '#ffffff',
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
        color: '#ffffff',
      },
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        color: '#ffffff',
      },
      h5: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
        color: '#ffffff',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.3px',
        color: '#ffffff',
      },
      subtitle1: {
        fontWeight: 600,
        color: '#e0e0e0',
      },
      subtitle2: {
        fontWeight: 600,
        color: '#e0e0e0',
      },
      body1: {
        lineHeight: 1.6,
        color: '#e0e0e0',
      },
      body2: {
        color: '#bdbdbd',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 10, // Mantendo o padrão de bordas arredondadas
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 16px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          },
          containedPrimary: {
            background: `linear-gradient(45deg, #7e57c2 30%, ${darkPrimaryColor} 90%)`,
            boxShadow: '0 4px 12px rgba(126, 87, 194, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(126, 87, 194, 0.5)',
            },
          },
          containedSecondary: {
            '&:hover': {
              boxShadow: '0 6px 16px rgba(179, 157, 219, 0.5)',
            },
          },
          outlined: {
            borderColor: alpha(darkPrimaryColor, 0.5),
            '&:hover': {
              backgroundColor: alpha(darkPrimaryColor, 0.1),
              borderColor: darkPrimaryColor,
            },
          },
          text: {
            '&:hover': {
              backgroundColor: alpha(darkPrimaryColor, 0.1),
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.3s ease',
            backgroundColor: '#1e1e1e',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            backgroundColor: '#1e1e1e',
          },
          elevation0: {
            border: '1px solid rgba(255, 255, 255, 0.12)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              height: '56px',
              transition: 'all 0.2s ease',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: alpha(darkPrimaryColor, 0.7),
              },
              '&.Mui-focused fieldset': {
                borderColor: darkPrimaryColor,
              },
              '&:hover': { 
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)' 
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 2px ${alpha(darkPrimaryColor, 0.3)}`
              }
            },
            '& .MuiInputLabel-root': {
              color: '#bdbdbd',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: darkPrimaryColor,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: '#1a1a1a',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(to right, ${darkPrimaryColor}, ${darkSecondaryColor}, ${darkTertiaryColor})`
            }
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            boxShadow: '1px 0px 8px rgba(0, 0, 0, 0.5)',
            backgroundColor: '#1a1a1a',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 500,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            '&.MuiChip-colorPrimary': {
              backgroundColor: alpha(darkPrimaryColor, 0.2),
            },
            '&.MuiChip-colorSecondary': {
              backgroundColor: alpha(darkSecondaryColor, 0.2),
            },
          },
          outlined: {
            borderColor: 'rgba(255, 255, 255, 0.23)',
            '&.MuiChip-colorPrimary': {
              borderColor: alpha(darkPrimaryColor, 0.5),
            },
            '&.MuiChip-colorSecondary': {
              borderColor: alpha(darkSecondaryColor, 0.5),
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            color: '#bdbdbd',
            '&:hover': {
              backgroundColor: alpha(darkPrimaryColor, 0.1),
              color: '#e0e0e0',
            },
            '&.Mui-selected': {
              color: darkPrimaryColor,
            }
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: '3px 3px 0 0',
            backgroundColor: darkPrimaryColor,
          },
          root: {
            backgroundColor: '#1a1a1a',
            '& .MuiTabs-flexContainer': {
              borderBottom: `1px solid ${alpha(darkPrimaryColor, 0.2)}`
            }
          }
        }
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          },
          filledSuccess: {
            fontWeight: 500,
            backgroundColor: alpha('#4caf50', 0.9),
          },
          filledError: {
            fontWeight: 500,
            backgroundColor: alpha('#f44336', 0.9),
          },
          filledInfo: {
            fontWeight: 500,
            backgroundColor: alpha('#2196f3', 0.9),
          },
          filledWarning: {
            fontWeight: 500,
            backgroundColor: alpha('#ff9800', 0.9),
          },
          standardSuccess: {
            backgroundColor: alpha('#4caf50', 0.1),
          },
          standardError: {
            backgroundColor: alpha('#f44336', 0.1),
          },
          standardInfo: {
            backgroundColor: alpha('#2196f3', 0.1),
          },
          standardWarning: {
            backgroundColor: alpha('#ff9800', 0.1),
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 10,
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            backgroundColor: '#1e1e1e',
          }
        }
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            padding: '16px 24px',
            backgroundColor: '#282828',
          }
        }
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: '16px 24px 24px',
            backgroundColor: '#1e1e1e',
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            margin: '16px 0',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
          }
        }
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            backgroundColor: 'rgba(33, 33, 33, 0.95)',
            padding: '8px 12px',
            fontSize: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: 'linear-gradient(to bottom, #121212, #1a1a1a)',
            minHeight: '100vh',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#1a1a1a',
            },
            '&::-webkit-scrollbar-thumb': {
              background: alpha(darkPrimaryColor, 0.5),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: alpha(darkPrimaryColor, 0.7),
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s ease',
            color: '#e0e0e0',
            '&:hover': {
              backgroundColor: alpha(darkPrimaryColor, 0.15),
              transform: 'scale(1.05)',
              color: darkPrimaryColor,
            }
          }
        }
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            color: '#bdbdbd',
            '&.Mui-focused': {
              color: darkPrimaryColor,
            }
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            color: '#bdbdbd',
            '&.Mui-focused': {
              color: darkPrimaryColor,
            }
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            minHeight: '42px',
            '&:hover': {
              backgroundColor: alpha(darkPrimaryColor, 0.1),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(darkPrimaryColor, 0.2),
              '&:hover': {
                backgroundColor: alpha(darkPrimaryColor, 0.3),
              }
            }
          }
        }
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          icon: {
            color: '#bdbdbd',
          }
        }
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            '& .MuiSnackbarContent-root': {
              borderRadius: 10,
              backgroundColor: '#282828',
            }
          }
        }
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: darkPrimaryColor,
              '&:hover': {
                backgroundColor: alpha(darkPrimaryColor, 0.1),
              }
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: alpha(darkPrimaryColor, 0.5),
            }
          }
        }
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: '#bdbdbd',
            '&.Mui-checked': {
              color: darkPrimaryColor,
            }
          }
        }
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            color: '#bdbdbd',
            '&.Mui-checked': {
              color: darkPrimaryColor,
            }
          }
        }
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: alpha(darkPrimaryColor, 0.2),
              '&:hover': {
                backgroundColor: alpha(darkPrimaryColor, 0.3),
              }
            }
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          },
          head: {
            fontWeight: 600,
            backgroundColor: '#282828',
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            }
          }
        }
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          bar: {
            borderRadius: 4,
          }
        }
      },
      MuiCircularProgress: {
        styleOverrides: {
          circle: {
            strokeLinecap: 'round',
          }
        }
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    spacing: 8, // Base spacing unit
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
    shadows: [
      'none',
      '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
      '0px 3px 3px -2px rgba(0,0,0,0.2),0px 2px 6px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
      '0px 3px 4px -2px rgba(0,0,0,0.2),0px 3px 8px 0px rgba(0,0,0,0.14),0px 1px 12px 0px rgba(0,0,0,0.12)',
      '0 4px 20px rgba(0,0,0,0.4)', // Sombra padrão das diretrizes (adaptada para tema escuro)
      '0px 5px 6px -3px rgba(0,0,0,0.2),0px 8px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
      '0px 6px 7px -4px rgba(0,0,0,0.2),0px 10px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
      '0px 7px 9px -4px rgba(0,0,0,0.2),0px 12px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
      '0 8px 30px rgba(0,0,0,0.5)', // Sombra hover das diretrizes (adaptada para tema escuro)
      '0px 9px 12px -6px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 7px 30px 5px rgba(0,0,0,0.12)',
      '0px 10px 14px -6px rgba(0,0,0,0.2),0px 18px 27px 2px rgba(0,0,0,0.14),0px 8px 34px 6px rgba(0,0,0,0.12)',
      '0px 11px 15px -7px rgba(0,0,0,0.2),0px 20px 30px 3px rgba(0,0,0,0.14),0px 9px 38px 7px rgba(0,0,0,0.12)',
      '0px 12px 17px -8px rgba(0,0,0,0.2),0px 22px 33px 3px rgba(0,0,0,0.14),0px 10px 42px 7px rgba(0,0,0,0.12)',
      '0px 13px 19px -8px rgba(0,0,0,0.2),0px 24px 36px 3px rgba(0,0,0,0.14),0px 11px 46px 8px rgba(0,0,0,0.12)',
      '0px 14px 21px -9px rgba(0,0,0,0.2),0px 26px 39px 4px rgba(0,0,0,0.14),0px 12px 50px 9px rgba(0,0,0,0.12)',
      '0px 15px 22px -9px rgba(0,0,0,0.2),0px 28px 42px 4px rgba(0,0,0,0.14),0px 13px 54px 9px rgba(0,0,0,0.12)',
      '0px 16px 24px -10px rgba(0,0,0,0.2),0px 30px 45px 5px rgba(0,0,0,0.14),0px 14px 58px 10px rgba(0,0,0,0.12)',
      '0px 17px 26px -11px rgba(0,0,0,0.2),0px 32px 48px 5px rgba(0,0,0,0.14),0px 15px 62px 11px rgba(0,0,0,0.12)',
      '0px 18px 28px -12px rgba(0,0,0,0.2),0px 34px 51px 5px rgba(0,0,0,0.14),0px 16px 66px 12px rgba(0,0,0,0.12)',
      '0px 19px 29px -12px rgba(0,0,0,0.2),0px 36px 54px 6px rgba(0,0,0,0.14),0px 17px 70px 12px rgba(0,0,0,0.12)',
      '0px 20px 31px -13px rgba(0,0,0,0.2),0px 38px 57px 6px rgba(0,0,0,0.14),0px 18px 74px 13px rgba(0,0,0,0.12)',
      '0px 21px 33px -13px rgba(0,0,0,0.2),0px 40px 60px 6px rgba(0,0,0,0.14),0px 19px 78px 14px rgba(0,0,0,0.12)',
      '0px 22px 35px -14px rgba(0,0,0,0.2),0px 42px 63px 7px rgba(0,0,0,0.14),0px 20px 82px 14px rgba(0,0,0,0.12)',
      '0px 23px 36px -14px rgba(0,0,0,0.2),0px 44px 66px 7px rgba(0,0,0,0.14),0px 21px 86px 15px rgba(0,0,0,0.12)',
      '0px 24px 38px -15px rgba(0,0,0,0.2),0px 46px 69px 7px rgba(0,0,0,0.14),0px 22px 90px 16px rgba(0,0,0,0.12)',
    ],
  });

  return responsiveFontSizes(theme);
};

// Componente que envolve a app e fornece o tema e o contexto de troca
export default function ThemeConfig({ children }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  // Se o usuário mudar o modo do sistema, atualiza aqui
  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  // Função de alternância exposta via contexto
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prev => (prev === 'light' ? 'dark' : 'light'));
      }
    }),
    []
  );

  // Seleciona e cria o tema adequado
  const theme = useMemo(
    () => (mode === 'light' ? createLightTheme() : createDarkTheme()),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}