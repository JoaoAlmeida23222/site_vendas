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

export const confirmAction = ({ message, onConfirm }) => {
    toast.custom((t) => (
      <div
        style={{
          background: '#1a1a1a',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '10px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          fontFamily: 'Montserrat, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '280px',
        }}
      >
        <strong>{message}</strong>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'transparent',
              border: '1px solid #555',
              color: '#ccc',
              padding: '6px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm(); 
            }}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };