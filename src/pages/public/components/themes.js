import { createTheme, alpha } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

// Helper function to determine if a color is light or dark
// (Used to decide text color on colored backgrounds)
const isColorLight = (hexColor) => {
  if (!hexColor) return true; // Default to light if no color provided
  const color = hexColor.charAt(0) === '#' ? hexColor.substring(1, 7) : hexColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179; // Threshold for perceived lightness
};

// --- Minimalist Theme Generator --- //

export const generateMinimalThemeConfig = (personalization = {}) => {
  const { bgColor = '#121212', textColor = '#FFFFFF', accentColor = '#BB86FC', fontFamily = '"Montserrat", "Helvetica Neue", Arial, sans-serif' } = personalization;

  const isBgLight = isColorLight(bgColor);
  const primaryText = isBgLight ? grey[900] : textColor; // Use provided textColor or dark grey on light bg
  const secondaryText = isBgLight ? grey[700] : alpha(textColor, 0.7);
  const paperBg = isBgLight ? grey[50] : alpha(grey[900], 0.6); // Slightly off-white paper on light, dark translucent on dark
  const dividerColor = isBgLight ? alpha(grey[900], 0.12) : alpha(textColor, 0.12);

  // Determine text color for accent button
  const accentButtonTextColor = isColorLight(accentColor) ? grey[900] : '#FFFFFF';
  // Determine text/border color for decline button
  const declineButtonColor = isBgLight ? grey[600] : grey[400];

  return {
    palette: {
      mode: isBgLight ? 'light' : 'dark',
      primary: {
        main: bgColor, // Use invite's bg as primary (though not used much directly)
      },
      secondary: {
        main: accentColor, // Use invite's accent color
      },
      text: {
        primary: primaryText,
        secondary: secondaryText,
      },
      background: {
        default: bgColor, // Main page background
        paper: paperBg, // Background for Paper components (cards, etc.)
      },
      divider: dividerColor,
      // Define button colors explicitly, not relying on success/error semantic names
      button: {
          confirmBg: accentColor,
          confirmText: accentButtonTextColor,
          declineBorder: declineButtonColor,
          declineText: declineButtonColor,
          declineHoverBg: alpha(declineButtonColor, 0.08),
      },
      common: { black: '#000000', white: '#ffffff' },
      grey: grey,
    },
    typography: {
      fontFamily: fontFamily,
      // Define basic hierarchy, can be customized further
      h1: { fontFamily: fontFamily, fontWeight: 700, fontSize: '3.5rem', color: accentColor, letterSpacing: '0.01em' },
      h2: { fontFamily: fontFamily, fontWeight: 600, fontSize: '2.5rem', letterSpacing: '0em' },
      h3: { fontFamily: fontFamily, fontWeight: 500, fontSize: '2.0rem', letterSpacing: '0.01em', color: accentColor }, // Use accent for H3 as well
      h4: { fontFamily: fontFamily, fontWeight: 500, fontSize: '1.5rem', letterSpacing: '0.01em' },
      h5: { fontFamily: fontFamily, fontWeight: 600, fontSize: '1.2rem' },
      h6: { fontFamily: fontFamily, fontWeight: 500, fontSize: '1.0rem' },
      body1: { fontFamily: fontFamily, fontSize: '1rem', lineHeight: 1.6, fontWeight: 400 },
      body2: { fontFamily: fontFamily, fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 400, color: secondaryText },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.05em', fontSize: '0.9rem' }, // No uppercase, slightly larger
      // Add other typography styles if needed
    },
    shape: {
      borderRadius: 12, // Reduced border radius for a more modern look
    },
    spacing: 8,
    components: {
      MuiPaper: {
        styleOverrides: {
          root: ({
            backgroundColor: paperBg,
            backgroundImage: 'none', // Ensure no gradient override
            border: `1px solid ${dividerColor}`, // Subtle border
            boxShadow: 'none', // Remove shadows for minimalism
            // backdropFilter: 'none', // Remove blur
            borderRadius: '12px', // Match shape.borderRadius
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({
            borderRadius: 8, // Slightly less rounded buttons
            padding: '10px 24px',
            transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease',
            boxShadow: 'none', // No shadow on buttons
            '&:hover': {
              transform: 'translateY(-2px)', // Subtle lift on hover
              boxShadow: 'none',
            }
          }),
          // Style for the 'Confirm' button (using custom palette)
          contained: ({
            backgroundColor: accentColor,
            color: accentButtonTextColor,
            '&:hover': {
              backgroundColor: alpha(accentColor, 0.85),
            }
          }),
          // Style for the 'Decline' button (using custom palette)
          outlined: ({
            borderColor: declineButtonColor,
            color: declineButtonColor,
            '&:hover': {
              borderColor: declineButtonColor,
              backgroundColor: alpha(declineButtonColor, 0.08),
            }
          }),
        }
      },
      MuiAlert: {
        styleOverrides: {
          root: ({
            borderRadius: 8,
            border: 'none',
            // Use standard alert colors based on mode
          }),
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: ({
            borderColor: dividerColor,
            margin: '48px 0', // Reduced margin
          }),
        },
      },
      // Add specific styles for DetailCard, CountdownRenderer, HostMessage if needed
      // to ensure they use the minimalist theme
    },
  };
};

// Function to create the theme instance
// export const createMinimalTheme = (personalization) => createTheme(generateMinimalThemeConfig(personalization));

// Fallback theme if personalization data is missing
export const fallbackMinimalTheme = createTheme(generateMinimalThemeConfig());

