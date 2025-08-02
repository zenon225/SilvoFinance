// src/components/ScrollRestoration.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollRestorationProps {
  children: React.ReactNode;
}

const ScrollRestoration: React.FC<ScrollRestorationProps> = ({ children }) => {
  const location = useLocation();
  const scrollPositions = React.useRef<Record<string, number>>({});

  useEffect(() => {
    // Restaurer la position de défilement
    const savedPosition = scrollPositions.current[location.key] || 0;
    window.scrollTo(0, savedPosition);

    // Sauvegarder la position actuelle avant de quitter
    return () => {
      scrollPositions.current[location.key] = window.scrollY;
    };
  }, [location.key]);

  return <>{children}</>;
};

export default ScrollRestoration;