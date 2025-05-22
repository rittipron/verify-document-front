import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // ใช้ useNavigate
import { useDispatch, useSelector } from 'react-redux';
import { setTokenExpiration, logout } from '@redux/slices/authSlice'; // เพิ่ม logout action
import LoginPage from '@pages/LoginPage';
import Home from '@/pages/HomePage';
import FromEmailPage from '@pages/FromEmailPage';
import NotFound from '@pages/NotFound';
import { isTokenValid } from '@utils/JwtToken';
import Navbar from '@components/Navbar';
import RegisterPage from '@pages/RegisterPage';
import VerifyDocumentPage from '@pages/VerifyDocumentPage';
import HomePage from '@pages/HomePage';

// Component สำหรับตรวจสอบการเข้าถึง Auth
const ProtectedRoute = ({ children }: any) => {
  const token = localStorage?.getItem("token");
  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Component สำหรับตรวจสอบว่าไม่ต้องการ Auth
const PublicRoute = ({ children }: any) => {
  const token = localStorage?.getItem("token");
  if (token && isTokenValid(token)) {
    return <Navigate to="/" />; // หากมี token และ valid, ให้ไปที่หน้า Home
  }
  return children;
};

const AppRouter: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token); // เอา token จาก redux

  let _token = token;
  if (window) _token = localStorage?.getItem("token");

  useEffect(() => {
    if (_token) {
      const isToken = isTokenValid(_token);
      dispatch(setTokenExpiration(isToken)); // อัพเดทสถานะ token
      if (!isToken) {
        dispatch(logout()); // ถ้า Token หมดอายุ, ทำการ logout
        localStorage.removeItem('token'); // ลบ token จาก localStorage
        navigate('/login'); // Redirect ไปหน้า Login
      }
    }
  }, [dispatch, navigate]);

  const isLoggedIn = _token && isTokenValid(_token);

  return (
    <> 
      {isLoggedIn && <Navbar /> } {/* แสดง Navbar ที่เหมาะสม */}
      <Routes>
        {/* Routes ที่ไม่ต้องการการล็อกอิน */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        

        {/* Routes ที่ต้องการการล็อกอิน */}
        <Route path="/verify" element={<ProtectedRoute><VerifyDocumentPage /></ProtectedRoute>} />
        <Route path="/fromemail" element={<ProtectedRoute><FromEmailPage /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

        {/* Routes ที่ไม่พบ */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRouter;
