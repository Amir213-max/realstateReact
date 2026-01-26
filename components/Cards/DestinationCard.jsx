'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumber } from '../../lib/utils';

export default function DestinationCard({ destination }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Link href={`/destinations/${destination.id}`}>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="relative h-48 w-full">
          <Image
            src={destination.image || '/destinations/default.jpg'}
            alt={t({ ar: destination.name_ar, en: destination.name_en })}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t({ ar: destination.name_ar, en: destination.name_en })}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {t({ ar: destination.description_ar, en: destination.description_en })}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {formatNumber(destination.developersCount || 0)} {language === 'ar' ? 'مطور' : 'Developers'}
            </span>
            <span>
              {formatNumber(destination.projectsCount || 0)} {language === 'ar' ? 'مشروع' : 'Projects'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
