'use client';

import { LanguageProvider } from '../context/LanguageContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      {children}
      <Toaster position="top-center" />
    </LanguageProvider>
  );
}
