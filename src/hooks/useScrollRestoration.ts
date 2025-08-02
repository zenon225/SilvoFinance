// hooks/useScrollRestoration.ts
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollRestoration = () => {
  const scrollPositions = useRef<Record<string, number>>({});
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Sauvegarder la position avant de quitter
    return () => {
      scrollPositions.current[currentPath] = window.scrollY;
    };
  }, [location.pathname]);

  useEffect(() => {
    const savedPosition = scrollPositions.current[location.pathname] || 0;
    window.scrollTo(0, savedPosition);
  }, [location.key]);
};