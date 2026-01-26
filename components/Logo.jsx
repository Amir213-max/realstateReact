import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

export default function Logo({ 
  variant = 'horizontal', 
  dark = false,
  className = '' 
}) {
  const { language } = useLanguage();
  
  const getLogoPath = () => {
    if (variant === 'emblem') {
      return '/assets/brand/images/Layer-1.png';
    }
    return language === 'ar' 
      ? '/assets/logo/ar logo.png'
      : '/assets/logo/en logo.png';
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={getLogoPath()}
        alt="Yafel Real Estate"
        className="object-contain"
        style={{ width: variant === 'emblem' ? 100 : 100, height: variant === 'emblem' ? 40 : 40 }}
      />
    </div>
  );
}
