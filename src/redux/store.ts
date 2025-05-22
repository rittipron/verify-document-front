import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@redux/slices/authSlice';
import { authMiddleware } from '@redux/middleware/authMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
