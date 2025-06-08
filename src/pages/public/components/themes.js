import { createTheme } from '@mui/material/styles';

// Função para gerar configuração de tema minimalista com base nas cores do convite
export const generateMinimalThemeConfig = (personalization) => {
  // Extrair cores e fonte do objeto de personalização
  const {
    bgColor = '#6a1b9a', // Roxo escuro como padrão
    textColor = '#ffffff', // Branco como padrão
    accentColor = '#e91e63', // Rosa como padrão
    fontFamily = 'Roboto, sans-serif', // Roboto como padrão
  } = personalization || {};

  // Calcular cores complementares
  const isLightText = getLuminance(textColor) > 0.5;
  const contrastText = isLightText ? '#121212' : '#ffffff';
  
  // Configuração do tema
  return {
    palette: {
      mode: isLightText ? 'light' : 'dark',
      primary: {
        main: bgColor,
        contrastText: textColor,
      },
      secondary: {
        main: accentColor,
        contrastText: getContrastText(accentColor),
      },
      background: {
        default: bgColor,
        paper: 'rgba(255, 255, 255, 0.1)',
      },
      text: {
        primary: textColor,
        secondary: adjustAlpha(textColor, 0.7),
      },
      button: {
        confirmBg: '#4caf50', // Verde para confirmação
        confirmText: '#ffffff',
        declineBg: 'transparent',
        declineText: '#f44336', // Vermelho para recusa
      },
    },
    typography: {
      fontFamily,
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 50,
            padding: '10px 24px',
            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)',
            },
          },
          containedPrimary: {
            backgroundColor: bgColor,
            color: textColor,
            '&:hover': {
              backgroundColor: adjustBrightness(bgColor, -15),
            },
          },
          containedSecondary: {
            backgroundColor: accentColor,
            color: getContrastText(accentColor),
            '&:hover': {
              backgroundColor: adjustBrightness(accentColor, -15),
            },
          },
          outlinedPrimary: {
            borderColor: bgColor,
            color: textColor,
            '&:hover': {
              borderColor: adjustBrightness(bgColor, -15),
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          },
          outlinedSecondary: {
            borderColor: accentColor,
            color: accentColor,
            '&:hover': {
              borderColor: adjustBrightness(accentColor, -15),
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
            backgroundImage: 'none',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  };
};

// Tema minimalista padrão para fallback
export const fallbackMinimalTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6a1b9a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e91e63',
      contrastText: '#ffffff',
    },
    background: {
      default: '#6a1b9a',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    button: {
      confirmBg: '#4caf50',
      confirmText: '#ffffff',
      declineBg: 'transparent',
      declineText: '#f44336',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '10px 24px',
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
          backgroundImage: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Funções utilitárias para manipulação de cores

// Calcular luminância de uma cor
function getLuminance(hexColor) {
  // Converter hex para RGB
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;
  
  // Calcular luminância
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Obter cor de texto contrastante
function getContrastText(hexColor) {
  return getLuminance(hexColor) > 0.5 ? '#121212' : '#ffffff';
}

// Ajustar transparência de uma cor
function adjustAlpha(hexColor, alpha) {
  // Converter hex para RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Retornar cor com alpha
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Ajustar brilho de uma cor
function adjustBrightness(hexColor, percent) {
  // Converter hex para RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);
  
  // Ajustar brilho
  r = Math.max(0, Math.min(255, r + percent));
  g = Math.max(0, Math.min(255, g + percent));
  b = Math.max(0, Math.min(255, b + percent));
  
  // Converter de volta para hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

