'use client';

import { LanguageProvider } from '../context/LanguageContext';
import { Toaster } from 'react-hot-toast';
import DirectionSetter from './DirectionSetter';

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <DirectionSetter />
      {children}
      <Toaster position="top-center" />
    </LanguageProvider>
  );
}
