'use client';

import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Badge from '@/components/Badge';
import ImageWithLoader from '@/components/ui/ImageWithLoader';

export default function DeveloperCard({ developer }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Link to={`/developers/${developer.id}`}>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="flex items-start space-x-4 rtl:space-x-reverse">
          <div className="relative w-20 h-20 flex-shrink-0">
            <ImageWithLoader
              src={developer.logo || ''}
              alt={t({ ar: developer.name_ar, en: developer.name_en })}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-textPrimary">
                {t({ ar: developer.name_ar, en: developer.name_en })}
              </h3>
              {developer.isPrimary && <Badge />}
            </div>
            <p className="text-textSecondary text-sm mb-3 line-clamp-2">
              {t({ ar: developer.description_ar, en: developer.description_en })}
            </p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-textSecondary">
              <span>
                {developer.projectsCount || 0} {language === 'ar' ? 'مشروع' : 'Projects'}
              </span>
              <span>
                {developer.unitsCount || 0} {language === 'ar' ? 'وحدة' : 'Units'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
