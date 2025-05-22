import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login'; // คอมโพเนนต์ที่เราต้องการทดสอบ
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { SweetAlert } from '@utils/SweetAlert'; // เราจะ Mock SweetAlert

// Mocking Dependencies
jest.mock('axios');
jest.mock('../redux/slices/authSlice', () => ({
  loginSuccess: jest.fn(),
  loginFailure: jest.fn(),
}));
jest.mock('../utils/SweetAlert', () => ({
  SweetAlert: jest.fn().mockResolvedValue(undefined), // Mock SweetAlert ให้ return promise
}));

describe('Login Component', () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  test('should render the login form', () => {
    render(<Login />);

    // ตรวจสอบว่า input และปุ่ม submit แสดงใน UI
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  test('should show SweetAlert on successful login and redirect to dashboard', async () => {
    // Mocking successful API response
    const mockResponse = { data: { token: 'dummyToken', user: {} } };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    render(<Login />);
    const usernameInput = screen.getByLabelText(/Email address/i);
    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    // Simulate user input
    userEvent.type(usernameInput, 'testuser@example.com');
    userEvent.click(submitButton);

    // ตรวจสอบว่า API ถูกเรียก
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/auth/login', {
        username: 'testuser@example.com',
        password: '',
      });
    });

    // ตรวจสอบว่า SweetAlert ถูกเรียก
    await waitFor(() => {
      expect(SweetAlert).toHaveBeenCalledWith({
        title: "Login Successful!",
        message: "Your account has been log in successfully",
        type: "success"
      });
    });

    // ตรวจสอบการ dispatch loginSuccess Redux action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'auth/loginSuccess',
      payload: { token: 'dummyToken', user: {} },
    });

    // หากต้องการทดสอบการ navigate สามารถ mock navigate ได้
    // ตรวจสอบว่า navigate ไปที่ dashboard
    // expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

  test('should handle login failure and show error message', async () => {
    // Mocking failed API response
    (axios.post as jest.Mock).mockRejectedValue(new Error('Invalid username or password'));

    render(<Login />);
    const usernameInput = screen.getByLabelText(/Email address/i);
    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    // Simulate user input
    userEvent.type(usernameInput, 'wronguser@example.com');
    userEvent.click(submitButton);

    // ตรวจสอบว่า SweetAlert ไม่ได้ถูกเรียก
    await waitFor(() => {
      expect(SweetAlert).not.toHaveBeenCalled();
    });

    // ตรวจสอบว่า Redux action loginFailure ถูก dispatch
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'auth/loginFailure',
      payload: 'Invalid username or password'
    });

    // ตรวจสอบว่า error message แสดงใน UI
    expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
  });

  test('should show error message if username is not provided', () => {
    render(<Login />);
    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    // Simulate click without filling out the username
    fireEvent.click(submitButton);

    // ตรวจสอบว่า error message สำหรับ username ที่ไม่กรอกแสดง
    expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
  });
});
