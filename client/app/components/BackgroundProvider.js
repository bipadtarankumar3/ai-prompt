'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const BackgroundContext = createContext(undefined);

export function BackgroundProvider({ children }) {
  const [backgroundEffect, setBackgroundEffectState] = useState('atom');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read preference from localStorage once mounted on client
    const saved = localStorage.getItem('prompt-beast-bg-effect');
    if (saved === 'atom' || saved === 'bubble' || saved === 'none') {
      setBackgroundEffectState(saved);
    }
    setMounted(true);
  }, []);

  const setBackgroundEffect = (effect) => {
    if (effect === 'atom' || effect === 'bubble' || effect === 'none') {
      setBackgroundEffectState(effect);
      localStorage.setItem('prompt-beast-bg-effect', effect);
    }
  };

  return (
    <BackgroundContext.Provider value={{ backgroundEffect, setBackgroundEffect, mounted }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}
