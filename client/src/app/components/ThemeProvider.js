'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }) {
  // Suppress the React 19 inline script tag warning in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const origError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && (args[0].includes('Encountered a script tag') || args[0].includes('extra attributes from the server'))) {
        return;
      }
      origError.apply(console, args);
    };
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
