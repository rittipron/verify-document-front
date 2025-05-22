import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyDocument from '@/components/VerifyDocument';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { SweetAlert } from '../utils/SweetAlert';
import { useDropzone } from 'react-dropzone';

// Mocking Dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('axios');
jest.mock('../utils/SweetAlert');
jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(),
}));

describe('VerifyDocument', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (useSelector as unknown as jest.Mock).mockReturnValue('dummy-token');
    (SweetAlert as jest.Mock).mockResolvedValue(undefined);
  });

  test('renders without crashing', () => {
    render(<VerifyDocument />);
    expect(screen.getByText('Applicant Information')).toBeInTheDocument();
  });

  test('should show error when no file is selected and upload button is clicked', async () => {
    render(<VerifyDocument />);
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(SweetAlert).toHaveBeenCalledWith({
        title: 'Error!',
        message: 'Please upload a file!',
        type: 'error',
      });
    });
  });

  test('should show error when invalid file type is uploaded', async () => {
    render(<VerifyDocument />);
    // Simulate an invalid file type upload
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const dropzone = screen.getByText('Click to Upload');
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [invalidFile] },
    });
    await waitFor(() => {
      expect(SweetAlert).toHaveBeenCalledWith({
        title: 'Error!',
        message: 'Please upload a PNG or JPG file.',
        type: 'error',
      });
    });
  });

  test('should resize image and set preview when valid image is uploaded', async () => {
    render(<VerifyDocument />);
    const validImage = new File(['test'], 'image.jpg', { type: 'image/jpeg' });
    const dropzone = screen.getByText('Click to Upload');
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [validImage] },
    });

    await waitFor(() => {
      expect(screen.getByText('image.jpg')).toBeInTheDocument();
    });
  });

  test('should call SweetAlert with success message when file upload is successful', async () => {
    render(<VerifyDocument />);
    const validImage = new File(['test'], 'image.jpg', { type: 'image/jpeg' });
    const dropzone = screen.getByText('Click to Upload');
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [validImage] },
    });

    // Mock axios POST request
    (axios.post as jest.Mock).mockResolvedValue({ status: 200 });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(SweetAlert).toHaveBeenCalledWith({
        title: 'Success!',
        message: 'Your document has been uploaded successfully.',
        type: 'success',
      });
    });
  });

  test('should handle API error during file upload', async () => {
    render(<VerifyDocument />);
    const validImage = new File(['test'], 'image.jpg', { type: 'image/jpeg' });
    const dropzone = screen.getByText('Click to Upload');
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [validImage] },
    });

    // Mock axios POST request to fail
    (axios.post as jest.Mock).mockRejectedValue(new Error('Upload failed'));

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(SweetAlert).toHaveBeenCalledWith({
        title: 'Error!',
        message: 'Upload failed: Upload failed',
        type: 'error',
      });
    });
  });
});
