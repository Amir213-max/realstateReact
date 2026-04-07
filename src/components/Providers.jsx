'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from 'react-hot-toast';
import DirectionSetter from '@/components/DirectionSetter';

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <DirectionSetter />
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#111111',
            color: '#ffffff',
            borderRadius: '0.75rem',
          },
          success: {
            iconTheme: { primary: '#C9A96E', secondary: '#111111' },
          },
          error: {
            iconTheme: { primary: '#efefef', secondary: '#b91c1c' },
          },
        }}
      />
    </LanguageProvider>
  );
}

