import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register"; // Optionnel avec valeur par défaut
  successMessage?: string;
  setSuccessMessage?: (msg: string) => void;
  onAuthSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
  successMessage,
  setSuccessMessage,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Réinitialise le mode quand le modal s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  return (
    <>
      {mode === "login" ? (
        <Login
          onSwitchToRegister={() => setMode("register")}
          onClose={onClose}
          onAuthSuccess={onAuthSuccess}
          successMessage={successMessage}
        />
      ) : (
        <Register
          onSwitchToLogin={(msg?: string) => {
            setMode("login");
            if (msg && setSuccessMessage) {
              setSuccessMessage(msg);
            }
          }}
          onClose={onClose}
          onAuthSuccess={onAuthSuccess}
        />
      )}
    </>
  );
};

export default AuthModal;
