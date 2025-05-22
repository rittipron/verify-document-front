import { jwtDecode } from 'jwt-decode';

// สร้างฟังก์ชันเพื่อตรวจสอบความถูกต้องของ token
export const isTokenValid = (token: string): boolean => {
  if (!token) {
    return false; // ถ้าไม่มี token ให้ถือว่าไม่ valid
  }

  try {
    // ถอดรหัส JWT Token
    const decoded: any = jwtDecode(token);

    // ตรวจสอบว่า token หมดอายุหรือยัง
    const currentTime = Math.floor(Date.now() / 1000); // เวลาปัจจุบันในรูปแบบ Unix Timestamp
    return decoded.exp > currentTime; // ถ้าเวลา expired > currentTime หมายความว่ายัง valid
  } catch (error) {
    console.error("Token decoding error:", error);
    return false; // ถ้าเกิดข้อผิดพลาดในการถอดรหัสถือว่าไม่ valid
  }
};

export const decodeJWT = () => {
  const token = localStorage.getItem('token'); // ดึง Token จาก localStorage

  if (!token) return null; // ถ้าไม่มี Token ให้ return null

  try {
    const decoded:any = jwtDecode(token); // ถอดรหัส JWT
    return decoded?.id || null; // คืนค่า userId ถ้ามี
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
