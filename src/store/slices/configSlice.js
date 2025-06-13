import { createSlice } from '@reduxjs/toolkit';
import { fetchUserConfig, updateUserConfig } from '../actions/configActions';

const initialState = {
  theme: localStorage.getItem('theme') || 'light', // light, dark, system
  themeStyle: localStorage.getItem('themeStyle') || 'purple', // purple, blue
  notifications: true,
  emailNotifications: true,
  interfaceDensity: 'default', // compact, default, comfortable
  fontSize: 16,
  language: 'pt-BR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h', // 12h, 24h
  // loading: false,
  // error: null
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setThemeStyle: (state, action) => {
      state.themeStyle = action.payload;
      localStorage.setItem('themeStyle', action.payload);
    },
    setInterfaceDensity: (state, action) => {
      state.interfaceDensity = action.payload;
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setEmailNotifications: (state, action) => {
      state.emailNotifications = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setDateFormat: (state, action) => {
      state.dateFormat = action.payload;
    },
    setTimeFormat: (state, action) => {
      state.timeFormat = action.payload;
    },
    resetConfig: (state) => {
      return {
        ...initialState,
        // loading: state.loading,
        // error: state.error
      };
    }
  },
  extraReducers: (builder) => {
    // Buscar configurações do usuário
    builder.addCase(fetchUserConfig.pending, (state) => {
      // state.loading = true;
      // state.error = null;
    });
    builder.addCase(fetchUserConfig.fulfilled, (state, action) => {
      // state.loading = false;
      return { ...state, ...action.payload };
    });
    builder.addCase(fetchUserConfig.rejected, (state, action) => {
      // state.loading = false;
      // state.error = action.payload;
    });
    
    // Atualizar configurações do usuário
    builder.addCase(updateUserConfig.pending, (state) => {
      // state.loading = true;
      // state.error = null;
    });
    builder.addCase(updateUserConfig.fulfilled, (state, action) => {
      // state.loading = false;
      return { ...state, ...action.payload };
    });
    builder.addCase(updateUserConfig.rejected, (state, action) => {
      // state.loading = false;
      // state.error = action.payload;
    });
  }
});

export const { 
  setTheme, 
  setThemeStyle,
  setInterfaceDensity, 
  setFontSize, 
  setNotifications, 
  setEmailNotifications,
  setLanguage,
  setDateFormat,
  setTimeFormat,
  resetConfig
} = configSlice.actions;

export default configSlice.reducer;

