import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '@/components/Register';
import axios from 'axios';
import { SweetAlert } from '../utils/SweetAlert';
import { useDispatch } from 'react-redux';

jest.mock('axios');
jest.mock('../utils/SweetAlert');
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('Register Component', () => {
  const dispatch = jest.fn();
  
  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
    (SweetAlert as jest.Mock).mockResolvedValue(undefined);
  });

  test('renders form fields correctly', () => {
    render(<Register />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Passport OR ID CARD/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Bank/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
  });

  test('should show validation errors when form is submitted with invalid data', async () => {
    render(<Register />);
    const submitButton = screen.getByText(/Register/i);

    // Click submit without filling out any fields
    userEvent.click(submitButton);

    // Wait for the validation error messages
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Passport or ID card is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
      expect(screen.getByText('Account Bank is required')).toBeInTheDocument();
    });
  });

  test('should call SweetAlert on successful registration', async () => {
    render(<Register />);
    
    // Mocking API responses
    (axios.post as jest.Mock).mockResolvedValueOnce({
      status: 200,
    });

    const data = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      passportOrId: '123456',
      phoneNumber: '123-456-7890',
      address: '123 Main St',
      account: '9876543210',
      agreed: true,
    };

    // Fill the form with valid data
    userEvent.type(screen.getByLabelText(/Email/i), data.email);
    userEvent.type(screen.getByLabelText(/Password/i), data.password);
    userEvent.type(screen.getByLabelText(/First name/i), data.firstName);
    userEvent.type(screen.getByLabelText(/Last name/i), data.lastName);
    userEvent.type(screen.getByLabelText(/Passport OR ID CARD/i), data.passportOrId);
    userEvent.type(screen.getByLabelText(/Phone number/i), data.phoneNumber);
    userEvent.type(screen.getByLabelText(/Account Bank/i), data.account);
    userEvent.type(screen.getByLabelText(/Address/i), data.address);
    
    // Submit the form
    userEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(SweetAlert).toHaveBeenCalledWith({
        title: 'Registration Successful!',
        message: 'Your account has been created successfully. You can now log in',
        type: 'success',
      });
    });
  });

  test('should handle API error during registration', async () => {
    render(<Register />);
    
    // Mocking API response for registration failure
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Registration failed'));

    const data = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      passportOrId: '123456',
      phoneNumber: '123-456-7890',
      address: '123 Main St',
      account: '9876543210',
      agreed: true,
    };

    // Fill the form with valid data
    userEvent.type(screen.getByLabelText(/Email/i), data.email);
    userEvent.type(screen.getByLabelText(/Password/i), data.password);
    userEvent.type(screen.getByLabelText(/First name/i), data.firstName);
    userEvent.type(screen.getByLabelText(/Last name/i), data.lastName);
    userEvent.type(screen.getByLabelText(/Passport OR ID CARD/i), data.passportOrId);
    userEvent.type(screen.getByLabelText(/Phone number/i), data.phoneNumber);
    userEvent.type(screen.getByLabelText(/Account Bank/i), data.account);
    userEvent.type(screen.getByLabelText(/Address/i), data.address);
    
    // Submit the form
    userEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(SweetAlert).toHaveBeenCalledWith({
        title: 'Error!',
        message: 'Register failed: Error: Registration failed',
        type: 'error',
      });
    });
  });
});
