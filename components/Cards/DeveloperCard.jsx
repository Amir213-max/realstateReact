'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import Badge from '../Badge';

export default function DeveloperCard({ developer }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Link href={`/developers/${developer.id}`}>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="flex items-start space-x-4 rtl:space-x-reverse">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={developer.logo || 'https://th.bing.com/th/id/OIP.Jy16vSGLOrlRWJ-2BrVMrgHaFj?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3'}
              alt={t({ ar: developer.name_ar, en: developer.name_en })}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                {t({ ar: developer.name_ar, en: developer.name_en })}
              </h3>
              {developer.isPrimary && <Badge />}
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {t({ ar: developer.description_ar, en: developer.description_en })}
            </p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
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
