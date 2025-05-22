import { useState } from 'react';
import Swal from 'sweetalert2';

const SweetAlert = ({ title, message, type, fncallback }: any) => {
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = () => {
    Swal.fire({
      title: title || 'Something went wrong!',
      text: message || 'Please try again.',
      icon: type || 'error',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed && fncallback) {
        fncallback();
      }
      setIsVisible(false);
    });
  };

  const handleShowAlert = () => {
    setIsVisible(true);
  };

  if (isVisible) {
    showAlert();
  }

  return (
    <button onClick={handleShowAlert}>
      Show Alert
    </button>
  );
};

export default SweetAlert;
