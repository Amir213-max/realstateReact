'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import Card from '../ui/Card';
import Badge from '../Badge';

export default function PropertyCard({ property }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Link href={`/properties/${property.id}`}>
      <Card hover className={`${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={property.image || 'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2256037689_mc4cxv'}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          {property.featured && (
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
              <Badge variant="secondary">
                {language === 'ar' ? 'مميز' : 'Featured'}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#1e1e1e] mb-2">
            {property.name}
          </h3>
          <p className="text-[#6D6D6D] text-sm mb-4 line-clamp-2 leading-relaxed">
            {property.description}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-[#efefef]">
            <div className="flex flex-col">
              {property.price && (
                <span className="text-lg font-bold text-[#1e1e1e]">
                  {property.price}
                </span>
              )}
              {property.location && (
                <span className="text-sm text-[#6D6D6D] mt-1">
                  {property.location}
                </span>
              )}
            </div>
            <span className="text-[#f0cb8e] font-semibold text-sm">
              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'} →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
