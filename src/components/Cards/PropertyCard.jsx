'use client';

import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/Badge';
import ImageWithLoader from '@/components/ui/ImageWithLoader';

export default function PropertyCard({ property }) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Link to={`/properties/${property.id}`} className="block group/card">
      <Card hover className={`transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-0.5 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="relative h-56 w-full overflow-hidden">
          <ImageWithLoader
            src={property.image || ''}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
          />
          <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex flex-col gap-2 items-end">
            {property.featured && (
              <Badge variant="secondary">
                {language === 'ar' ? 'مميز' : 'Featured'}
              </Badge>
            )}
            {property.viewsCount > 0 && (
              <Badge variant="secondary" className="inline-flex items-center gap-1 text-xs font-normal">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {property.viewsCount}
              </Badge>
            )}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-textPrimary mb-2">
            {property.name}
          </h3>
          <p className="text-textSecondary text-sm mb-4 line-clamp-2 leading-relaxed">
            {property.description}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-borderColor">
            <div className="flex flex-col">
              {property.price && (
                <span className="text-lg font-bold text-gold">
                  {property.price}
                </span>
              )}
              {property.location && (
                <span className="text-sm text-textSecondary mt-1">
                  {property.location}
                </span>
              )}
            </div>
            <span className="text-gold font-semibold text-sm">
              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'} →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

