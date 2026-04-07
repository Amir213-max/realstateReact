import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettingsGroup } from '@/hooks/useGraphQL';
import { fixImageUrl } from '@/lib/dataTransform';

export default function Logo({ 
  variant = 'horizontal', 
  dark = false,
  className = '' 
}) {
  const { language } = useLanguage();
  const { settings: logoSettings } = useSettingsGroup('logo');

  const logoPath = useMemo(() => {
    const langKey = language === 'ar' ? 'ar' : 'en';
    const list = Array.isArray(logoSettings) ? logoSettings : [];

    const match = list.find((s) => {
      const v = String(s?.value || '').toLowerCase().trim();
      const k = String(s?.key || '').toLowerCase().trim();
      return v === langKey || k === langKey;
    });

    const raw = match?.image || match?.link;
    if (raw && String(raw).trim()) {
      return fixImageUrl(String(raw).trim());
    }
    return '/logo.png';
  }, [logoSettings, language]);

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoPath}
        alt="Yafel Real Estate"
        className="object-contain"
        style={{ width: variant === 'emblem' ? 200 : 200, height: variant === 'emblem' ? 70 : 70 }}
      />
    </div>
  );
}

