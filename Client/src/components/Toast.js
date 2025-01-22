import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toast({ message, type }) {
  useEffect(() => {
    if (message) {
      if (type === 'success') {
        toast.success(message, {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
      if (type === 'error') {
        toast.error(message, {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
    }
  }, [message, type]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
}

export default Toast;
