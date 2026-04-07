'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ar');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('lang');
    if (stored) setLanguage(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', language);
    }
  }, [language]);

  const toggleLanguage = () => setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));

  const t = (obj) => (language === 'ar' ? obj.ar : obj.en);

  const value = useMemo(() => ({ language, toggleLanguage, t }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

