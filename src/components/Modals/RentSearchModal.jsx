'use client';

import { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useLanguage } from '@/context/LanguageContext';
import { useRegions, useProjects } from '@/hooks/useGraphQL';
import ImageWithLoader from '@/components/ui/ImageWithLoader';
import 'swiper/css';
import 'swiper/css/pagination';

export const RENT_BAND_IDS = {
  ANY: '',
  R25_50: '25-50',
  R50_80: '50-80',
  R80_120: '80-120',
  R120_PLUS: '120+',
};

export function getRentBandRange(bandId) {
  switch (bandId) {
    case RENT_BAND_IDS.R25_50:
      return { min: 25000, max: 50000 };
    case RENT_BAND_IDS.R50_80:
      return { min: 50000, max: 80000 };
    case RENT_BAND_IDS.R80_120:
      return { min: 80000, max: 120000 };
    case RENT_BAND_IDS.R120_PLUS:
      return { min: 120000, max: null };
    default:
      return { min: null, max: null };
  }
}

export default function RentSearchModal({ isOpen, onClose, onApply, carouselImages = [] }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const { regions, loading: regionsLoading } = useRegions();
  const [regionId, setRegionId] = useState('');
  const { projects, loading: projectsLoading } = useProjects(regionId || null, { first: 60, page: 1 });
  const [projectId, setProjectId] = useState('');
  const [rentBandId, setRentBandId] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setProjectId('');
  }, [regionId, isOpen]);

  const slides = useMemo(() => {
    const urls = carouselImages.filter(Boolean);
    if (urls.length > 0) return urls;
    return [];
  }, [carouselImages]);

  const translations = {
    title: { ar: 'ما الذي تبحث عنه؟', en: 'What are you looking for?' },
    region: { ar: 'المنطقة', en: 'Region' },
    compound: { ar: 'الكمبوند', en: 'Compound' },
    rent: { ar: 'الإيجار المرغوب', en: 'Desired rent' },
    rooms: { ar: 'عدد الغرف', en: 'Number of rooms' },
    roomsPh: { ar: 'مثال: 3', en: 'e.g. 3' },
    search: { ar: 'بحث', en: 'Search' },
    close: { ar: 'إغلاق', en: 'Close' },
    allRegions: { ar: 'كل المناطق', en: 'All regions' },
    allCompounds: { ar: 'كل الكمبوندات', en: 'All compounds' },
    anyRent: { ar: 'أي مبلغ', en: 'Any' },
  };

  const rentOptions = [
    { id: RENT_BAND_IDS.ANY, ar: translations.anyRent.ar, en: translations.anyRent.en },
    { id: RENT_BAND_IDS.R25_50, ar: '25,000 - 50,000', en: '25,000 - 50,000' },
    { id: RENT_BAND_IDS.R50_80, ar: '50,000 - 80,000', en: '50,000 - 80,000' },
    { id: RENT_BAND_IDS.R80_120, ar: '80,000 - 120,000', en: '80,000 - 120,000' },
    { id: RENT_BAND_IDS.R120_PLUS, ar: '+120,000', en: '+120,000' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const brRaw = bedrooms.trim() === '' ? null : parseInt(bedrooms, 10);
    const br = brRaw != null && !Number.isNaN(brRaw) ? brRaw : null;
    onApply?.({
      regionId: regionId || null,
      projectId: projectId || null,
      rentBandId: rentBandId || null,
      bedrooms: br,
    });
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (ev) => {
      if (ev.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rent-search-title"
      >
        <div className="relative w-full aspect-[16/10] bg-primary-muted rounded-t-2xl overflow-hidden">
          {slides.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={0}
              slidesPerView={1}
              className="h-full w-full rent-modal-swiper"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {slides.map((src, i) => (
                <SwiperSlide key={`${src}-${i}`}>
                  <div className="relative w-full h-full min-h-[200px]">
                    <ImageWithLoader src={src} alt="" fill className="object-cover" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-soft to-primary-muted" />
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <h2 id="rent-search-title" className="text-xl font-bold text-center text-textPrimary">
            {t(translations.title)}
          </h2>

          <div>
            <label className="block text-sm font-semibold text-textPrimary mb-1.5">{t(translations.region)}</label>
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              disabled={regionsLoading}
              className="w-full px-4 py-3 border border-borderColor-strong rounded-xl text-textPrimary bg-white"
            >
              <option value="">{t(translations.allRegions)}</option>
              {regions.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {t({ ar: r.name_ar, en: r.name_en })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-textPrimary mb-1.5">{t(translations.compound)}</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              disabled={projectsLoading || !regionId}
              className="w-full px-4 py-3 border border-borderColor-strong rounded-xl text-textPrimary bg-white"
            >
              <option value="">{t(translations.allCompounds)}</option>
              {projects.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {t({ ar: p.name_ar, en: p.name_en })}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-textPrimary mb-1.5">{t(translations.rent)}</label>
              <select
                value={rentBandId}
                onChange={(e) => setRentBandId(e.target.value)}
                className="w-full px-4 py-3 border border-borderColor-strong rounded-xl text-textPrimary bg-white"
              >
                {rentOptions.map((opt) => (
                  <option key={opt.id || 'any'} value={opt.id}>
                    {language === 'ar' ? opt.ar : opt.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-textPrimary mb-1.5">{t(translations.rooms)}</label>
              <input
                type="number"
                min={0}
                max={20}
                inputMode="numeric"
                placeholder={t(translations.roomsPh)}
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-3 border border-borderColor-strong rounded-xl text-textPrimary"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-borderColor-strong font-semibold text-textPrimary hover:bg-bgSection"
            >
              {t(translations.close)}
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {t(translations.search)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
