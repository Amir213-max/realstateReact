'use client';

import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import ImageWithLoader from '@/components/ui/ImageWithLoader';

export default function UnitCard({ unit, to }) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const href = to || `/units/${unit.id}`;

  return (
    <Link to={href} className="block h-full group">
      <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-0.5 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="relative h-48 w-full">
          <ImageWithLoader
            src={unit.images?.[0] || '/units/default.jpg'}
            alt={`Unit ${unit.id}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2 gap-2">
            <h3 className="text-xl font-bold text-blue-600">
              {formatPrice(unit.price)}
            </h3>
            {unit.viewsCount > 0 && (
              <span className="text-xs text-textSecondary shrink-0 inline-flex items-center gap-1" title={language === 'ar' ? 'مشاهدات' : 'Views'}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {unit.viewsCount}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-textSecondary">
            <div>
              <span className="font-semibold">{language === 'ar' ? 'المساحة:' : 'Area:'}</span>{' '}
              {unit.area} {language === 'ar' ? 'م²' : 'm²'}
            </div>
            <div>
              <span className="font-semibold">{language === 'ar' ? 'النوع:' : 'Type:'}</span> {unit.type || '-'}
            </div>
            <div>
              <span className="font-semibold">{language === 'ar' ? 'الغرف:' : 'Bedrooms:'}</span> {unit.bedrooms}
            </div>
            <div>
              <span className="font-semibold">{language === 'ar' ? 'الحمامات:' : 'Bathrooms:'}</span> {unit.bathrooms}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
