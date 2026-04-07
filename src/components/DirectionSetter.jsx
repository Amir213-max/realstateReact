import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function DirectionSetter() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      const body = document.body;

      const direction = isRTL ? 'rtl' : 'ltr';
      html.setAttribute('dir', direction);
      html.setAttribute('lang', language);

      body.classList.remove('rtl', 'ltr');
      body.classList.add(direction);

      void html.offsetHeight;
    }
  }, [language, isRTL]);

  return null;
}
