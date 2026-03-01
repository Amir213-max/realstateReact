'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function DirectionSetter() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      const body = document.body;
      
      // Set direction and language attributes immediately
      const direction = isRTL ? 'rtl' : 'ltr';
      html.setAttribute('dir', direction);
      html.setAttribute('lang', language);
      
      // Update body class for RTL support
      body.classList.remove('rtl', 'ltr');
      body.classList.add(direction);
      
      // Force reflow to ensure changes take effect immediately
      void html.offsetHeight;
    }
  }, [language, isRTL]);

  return null;
}
