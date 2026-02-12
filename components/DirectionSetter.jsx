'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function DirectionSetter() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      html.setAttribute('lang', language);
      
      // Update body class for RTL support
      document.body.classList.remove('rtl', 'ltr');
      document.body.classList.add(isRTL ? 'rtl' : 'ltr');
    }
  }, [language, isRTL]);

  return null;
}
