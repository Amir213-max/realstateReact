import { useLanguage } from '@/context/LanguageContext';

export default function SectionHeader({ title, subtitle }) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className={`text-center mb-12 animate-fadeInUp ${isRTL ? 'rtl' : 'ltr'}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl md:text-2xl text-textSecondary mb-6 leading-tight">
          {subtitle}
        </p>
      )}
    </div>
  );
}

