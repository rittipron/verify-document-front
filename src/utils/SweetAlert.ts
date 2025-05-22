import Swal from 'sweetalert2';

export const SweetAlert = ({ title, message, type }: any) => {
  return Swal.fire({
    title: title || 'Something went wrong!',
    text: message || 'Please try again.',
    icon: type || 'error',
    confirmButtonText: 'OK'
  });
};
