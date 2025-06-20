import { toast } from 'react-hot-toast';

const defaultOptions = {
  position: 'top-right',
  duration: 4000,
  style: {
    background: '#333',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '0.95rem',
    fontFamily: 'Montserrat, sans-serif',
  },
};

export const showSuccess = (message) =>
  toast.success(message, defaultOptions);

export const showError = (message) =>
  toast.error(message, defaultOptions);

export const showInfo = (message) =>
  toast(message, defaultOptions);
