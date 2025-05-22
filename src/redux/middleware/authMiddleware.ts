import { AppDispatch, RootState } from '@redux/store';
import axios from 'axios';
import { logout } from '@redux/slices/authSlice';

export const authMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.type === 'auth/loginSuccess' || action.type === 'auth/logout') {
    // ตรวจสอบว่า token ถูกเก็บใน Redux หรือไม่
    const { token } = store.getState().auth;

    if (token) {
      axios.defaults.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers['Authorization'];
    }
  }

  return next(action);
};
