'use client';

import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { formatNumber } from '@/lib/utils';
import ImageWithLoader from '@/components/ui/ImageWithLoader';

export default function DestinationCard({ destination, featuredBadge = false }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Link to={`/destinations/${destination.id}`} className="block group">
      <div className={`group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="relative h-56 w-full overflow-hidden">
          {featuredBadge && (
            <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-10 rounded-full bg-gold text-textPrimary text-xs font-bold px-3 py-1 shadow-md">
              {language === 'ar' ? 'مميز' : 'Featured'}
            </div>
          )}
          <ImageWithLoader
            src={destination.image || '/destinations/default.jpg'}
            alt={t({ ar: destination.name_ar, en: destination.name_en })}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-xs font-semibold text-textPrimary">
                {formatNumber(destination.projectsCount || 0)} {language === 'ar' ? 'مشروع' : 'Projects'}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gradient-to-br from-white to-bgSection">
          <h3 className="text-xl font-bold text-textPrimary mb-2 group-hover:text-gold transition-colors duration-300">
            {t({ ar: destination.name_ar, en: destination.name_en })}
          </h3>
          <p className="text-textSecondary text-sm mb-4 line-clamp-2 leading-relaxed">
            {t({ ar: destination.description_ar, en: destination.description_en })}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-borderColor">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-medium text-textPrimary">
                {formatNumber(destination.developersCount || 0)} {language === 'ar' ? 'مطور' : 'Developers'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300">
              <span className="text-sm font-semibold">{language === 'ar' ? 'استكشف' : 'Explore'}</span>
              <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

