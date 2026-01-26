'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Default context value to prevent errors if used outside provider
const defaultContextValue = {
  language: 'ar',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (translations) => translations?.ar || '',
};

const LanguageContext = createContext(defaultContextValue);

// Completely safe localStorage access - never throws errors
// This function is only called from client-side code (useEffect or event handlers)
function getLocalStorageItem(key) {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    if (window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // Silently fail
  }
  return null;
}

function setLocalStorageItem(key, value) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    if (window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Silently fail
  }
}

export function LanguageProvider({ children }) {
  // Initialize with default value - never access localStorage during initial render
  const [language, setLanguage] = useState('ar');
  const [isMounted, setIsMounted] = useState(false);

  // Only access localStorage after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
    // This only runs on client side after mount
    const saved = getLocalStorageItem('language');
    if (saved === 'ar' || saved === 'en') {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    // Only save to localStorage on client side
    if (isMounted) {
      setLocalStorageItem('language', newLang);
    }
  }, [language, isMounted]);

  const setLanguageSafe = useCallback((lang) => {
    if (lang === 'ar' || lang === 'en') {
      setLanguage(lang);
      if (isMounted) {
        setLocalStorageItem('language', lang);
      }
    }
  }, [isMounted]);

  const t = useCallback((translations) => {
    if (!translations) return '';
    return translations[language] || translations.ar || '';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageSafe, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context || defaultContextValue;
}
