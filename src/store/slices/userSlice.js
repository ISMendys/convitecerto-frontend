import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  changeUserPassword 
} from '../actions/userActions';

const initialState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  passwordLoading: false,
  passwordError: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
      state.updateError = null;
      state.passwordError = null;
    },
    clearUserProfile: (state) => {
      state.profile = null;
    }
  },
  extraReducers: (builder) => {
    // Buscar perfil do usuário
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Atualizar perfil do usuário
    builder.addCase(updateUserProfile.pending, (state) => {
      state.updateLoading = true;
      state.updateError = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.updateLoading = false;
      state.profile = action.payload;
      // Atualizar também o usuário no authSlice se necessário
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.updateLoading = false;
      state.updateError = action.payload;
    });
    
    // Alterar senha do usuário
    builder.addCase(changeUserPassword.pending, (state) => {
      state.passwordLoading = true;
      state.passwordError = null;
    });
    builder.addCase(changeUserPassword.fulfilled, (state) => {
      state.passwordLoading = false;
    });
    builder.addCase(changeUserPassword.rejected, (state, action) => {
      state.passwordLoading = false;
      state.passwordError = action.payload;
    });
  }
});

export const { clearUserError, clearUserProfile } = userSlice.actions;

export default userSlice.reducer;

