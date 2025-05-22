import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setTokenExpiration: (state, action: PayloadAction<boolean>) => {
      if (!action.payload) {
        state.token = null;
        state.isAuthenticated = false;
        state.error = 'Token has expired. Please log in again.';
      }
    }
  },
});

export const { loginSuccess, loginFailure, logout, setTokenExpiration } = authSlice.actions;

export default authSlice.reducer;
