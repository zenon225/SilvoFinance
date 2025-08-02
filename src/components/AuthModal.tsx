import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  setAuthMode: (mode: 'login' | 'register') => void;
  successMessage: string;
  setSuccessMessage: (msg: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  if (!isOpen) return null;

  return (
    <>
      {mode === 'login' ? (
        <Login 
          onSwitchToRegister={() => setMode('register')}
          onClose={onClose}
        />
      ) : (
        <Register 
          onSwitchToLogin={() => setMode('login')}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default AuthModal;