'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../lib/utils';

export default function UnitCard({ unit }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Link href={`/units/${unit.id}`}>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="relative h-48 w-full">
          <Image
            src={unit.images?.[0] || '/units/default.jpg'}
            alt={`Unit ${unit.id}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-blue-600">
              {formatPrice(unit.price)}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">{language === 'ar' ? 'المساحة:' : 'Area:'}</span>{' '}
              {unit.area} {language === 'ar' ? 'م²' : 'm²'}
            </div>
            <div>
              <span className="font-semibold">{language === 'ar' ? 'الدور:' : 'Floor:'}</span> {unit.floor}
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
