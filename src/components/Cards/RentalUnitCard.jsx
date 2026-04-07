'use client';

import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Badge from '@/components/Badge';
import ImageWithLoader from '@/components/ui/ImageWithLoader';
import { formatMonthlyRent } from '@/lib/utils';

const TYPE_LABELS = {
  ar: { apartment: 'شقة', villa: 'فيلا', penthouse: 'بنتهاوس' },
  en: { apartment: 'Apartment', villa: 'Villa', penthouse: 'Penthouse' },
};

function typeLabel(type, lang) {
  const t = (TYPE_LABELS[lang] || TYPE_LABELS.en)[type];
  return t || type || (lang === 'ar' ? 'وحدة' : 'Unit');
}

export default function RentalUnitCard({ unit }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const project = unit.project;
  const region = project?.region;
  const title = `${typeLabel(unit.type, language)} — ${t({ ar: project?.name_ar, en: project?.name_en })}`;
  const location = region
    ? t({ ar: region.name_ar, en: region.name_en })
    : t({ ar: project?.address_ar, en: project?.address_en });

  const logo = unit.developerLogo || project?.developers?.[0]?.logo || '';

  return (
    <Link to={`/properties/${unit.id}`} className="block group">
      <article
        className={`bg-white rounded-2xl shadow-md overflow-hidden border border-borderColor hover:shadow-xl transition-shadow ${isRTL ? 'rtl' : 'ltr'}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <ImageWithLoader
            src={unit.images?.[0] || ''}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
            <Badge variant={unit.isAvailable ? 'success' : 'muted'}>
              {unit.isAvailable
                ? language === 'ar'
                  ? 'متاح'
                  : 'Available'
                : language === 'ar'
                  ? 'مستأجرة'
                  : 'Rented'}
            </Badge>
          </div>
          {logo ? (
            <div
              className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} w-12 h-12 rounded-full border-2 border-white bg-white shadow-md overflow-hidden`}
            >
              <img src={logo} alt="" className="w-full h-full object-cover" />
            </div>
          ) : null}
        </div>
        <div className="p-4 md:p-5">
          <h3 className="text-lg font-bold text-textPrimary mb-1 line-clamp-2">{title}</h3>
          {location ? <p className="text-sm text-textSecondary mb-4 line-clamp-1">{location}</p> : null}

          <div className="flex flex-wrap gap-4 text-sm text-textPrimary mb-4">
            {unit.bedrooms != null ? (
              <span className="inline-flex items-center gap-1">
                <BedIcon />
                {unit.bedrooms} {language === 'ar' ? 'غرف نوم' : 'beds'}
              </span>
            ) : null}
            {unit.bathrooms != null ? (
              <span className="inline-flex items-center gap-1">
                <BathIcon />
                {unit.bathrooms} {language === 'ar' ? 'حمامات' : 'baths'}
              </span>
            ) : null}
            {unit.area != null ? (
              <span className="inline-flex items-center gap-1">
                <AreaIcon />
                {unit.area} {language === 'ar' ? 'م²' : 'm²'}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2 pt-3 border-t border-borderColor">
            <div>
              <p className="text-xs text-textSecondary mb-0.5">{language === 'ar' ? 'السعر' : 'Price'}</p>
              <p className="text-lg font-bold text-textPrimary">
                {unit.price != null ? formatMonthlyRent(unit.price, language) : '—'}
              </p>
            </div>
            <div className="text-end">
              <p className="text-xs text-textSecondary mb-0.5">{language === 'ar' ? 'متاح من' : 'Available from'}</p>
              <p className="text-sm font-semibold text-textPrimary">
                {unit.isAvailable ? (language === 'ar' ? 'الآن' : 'Now') : '—'}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function BedIcon() {
  return (
    <svg className="w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 8h18v8H3V8z" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg className="w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m8-3v3M5 9h14l-1 12H6L5 9z" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg className="w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M16 4h4v4M4 16v4h4M16 20h4v-4" />
    </svg>
  );
}
