'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ProjectCard from '@/components/Cards/ProjectCard';
import UnitCard from '@/components/Cards/UnitCard';
import Button from '@/components/ui/Button';
import ImageWithLoader from '@/components/ui/ImageWithLoader';
import FadeInSection from '@/components/FadeInSection';
import DestinationCard from '@/components/Cards/DestinationCard';
import Seo from '@/components/Seo';
import { BrandAtmosphere, BrandGlassPanel } from '@/components/ui/BrandAtmosphere';
import {
  useRegions,
  useProjectsSimple,
  useMostBrowsedProjects,
  useMostBrowsedUnits,
  useSiteSetting,
  useSettingsGroup,
} from '@/hooks/useGraphQL';
import { fixImageUrl } from '@/lib/dataTransform';
import sellSearchIcon from '@/assets/search-icons/sell.webp';
import offersSearchIcon from '@/assets/search-icons/offers.webp';
import resaleSearchIcon from '@/assets/search-icons/resale.webp';
import developerSearchIcon from '@/assets/search-icons/developer.webp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/** Bundled via webpack from `src/assets/search-icons` (avoids broken URLs from spaces/Arabic paths in `public`). */
const SEARCH_ABOUT_URLS = {
  sell: sellSearchIcon,
  offers: offersSearchIcon,
  resale: resaleSearchIcon,
  developer: developerSearchIcon,
};

function SearchCategoryIcon({ type }) {
  const src = SEARCH_ABOUT_URLS[type];
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      width={40}
      height={40}
      className="w-10 h-10 object-contain pointer-events-none select-none"
      draggable={false}
      loading="lazy"
      aria-hidden
    />
  );
}

function RentKeyGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M28 78 L78 28 L95 45 L45 95 Z"
        fill="#C9A96E"
        opacity={0.95}
        transform="rotate(-12 60 60)"
      />
      <circle cx="34" cy="86" r="10" stroke="#C9A96E" strokeWidth="4" fill="none" />
      <path d="M52 68 L68 52" stroke="#a88b52" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const { language, t } = useLanguage();
  const { projects: simpleProjects, loading: simpleLoading } = useProjectsSimple({
    first: 36,
    page: 1,
  });
  const { projects: mostBrowsedRaw, loading: mbLoading } = useMostBrowsedProjects(8);
  const { regions: destinationsData, loading: regionsLoading } = useRegions();
  const { regions: featuredRegions, loading: featuredRegionsLoading } = useRegions(null, true);
  const { units: mostBrowsedUnits, loading: mostBrowsedUnitsLoading } = useMostBrowsedUnits(8);
  const { settings: homepageBannerSettings } = useSettingsGroup('homepage baner');
  const { setting: heroSetting } = useSiteSetting('site', 'hero_image');
  const homepageBannerSrc = useMemo(() => {
    const list = Array.isArray(homepageBannerSettings) ? homepageBannerSettings : [];
    const preferred = list.find((s) => {
      const key = String(s?.key || '').toLowerCase().trim();
      return key === 'hero_image' || key === 'banner_image' || key === 'image';
    });
    const source = preferred || list[0];
    const raw = source?.image || source?.link || source?.value;
    return raw && String(raw).trim() ? fixImageUrl(String(raw).trim()) : '';
  }, [homepageBannerSettings]);

  const heroSrc = useMemo(() => {
    if (homepageBannerSrc) return homepageBannerSrc;
    const raw = heroSetting?.image || heroSetting?.link || heroSetting?.value;
    if (raw && String(raw).trim()) {
      return fixImageUrl(String(raw).trim());
    }
    const p = mostBrowsedRaw[0];
    return p?.main_image || p?.images?.[0] || '';
  }, [homepageBannerSrc, heroSetting, mostBrowsedRaw]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTab, setSearchTab] = useState('compounds');
  const [unitType, setUnitType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [assistanceForm, setAssistanceForm] = useState({
    name: '',
    location: '',
    phone: '',
    phoneCode: '+20',
    message: '',
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const isRTL = language === 'ar';
  const swiperRef = useRef(null);
  const mostSearchedSwiperRef = useRef(null);

  const translations = {
    heroTitle: { ar: 'ابحث عن منزلك', en: 'Search for your home' },
    heroSubtitle: {
      ar: 'ابحث وقارن بين أكثر من 15000 عقار من بين +800 كمبوند أو اعرض عقارك للبيع',
      en: 'Search and compare over 15,000 properties from over 800 compounds or list your property for sale',
    },
    search: { ar: 'ابحث', en: 'Search' },
    allDestinations: { ar: 'جميع الوجهات', en: 'All Destinations' },
    featuredProperties: { ar: 'عقارات مميزة', en: 'Featured Properties' },
    viewAll: { ar: 'عرض الكل', en: 'View All' },
    exploreProperties: { ar: 'استكشف العقارات', en: 'Explore Properties' },
    searchPlaceholder: {
      ar: 'البحث بالكمبوند، الموقع، المطور العقاري',
      en: 'Search by compound, location, developer',
    },
    compounds: { ar: 'كمبوندات', en: 'Compounds' },
    units: { ar: 'وحدات', en: 'Units' },
    unitTypes: { ar: 'أنواع الوحدات', en: 'Unit Types' },
    bedroomsBathrooms: { ar: 'غرف نوم و حمامات', en: 'Bedrooms & Bathrooms' },
    priceRange: { ar: 'معدل السعر', en: 'Price Range' },
    advancedSearch: { ar: 'بحث متقدم', en: 'Advanced Search' },
    searchFor: { ar: 'ابحث عن', en: 'Search For' },
    newProjects: { ar: 'المشاريع الجديدة', en: 'New Projects' },
    mostSearched: { ar: 'الكمبوندات الأكثر بحثا', en: 'Most Searched Compounds' },
    mostImportantAreas: { ar: 'أهم المناطق', en: 'Most Important Areas' },
    results: { ar: 'نتائج', en: 'results' },
    exclusiveOffers: { ar: 'عروض الحصر', en: 'Exclusive Offers' },
    allOffers: { ar: '+ كل عروض', en: '+ All Offers' },
    lookingForRent: { ar: 'بتدور علي بيت للإيجار', en: 'Looking for a house for rent' },
    startHere: { ar: 'ابدأ هنا', en: 'Start Here' },
    recommendedForYou: { ar: 'نرشح لك', en: 'Recommended For You' },
    needAssistance: { ar: 'تحتاج إلى مساعدة عقارية؟', en: 'Do you need real estate assistance?' },
    assistanceSubtitle: {
      ar: 'املأ بياناتك و سوف يقوم خبير عقارى بالاتصال بك في اقرب وقت',
      en: 'Fill in your details and a real estate expert will contact you as soon as possible',
    },
    nameLabel: { ar: 'الاسم', en: 'Name' },
    locationLabel: { ar: 'الموقع', en: 'Location' },
    phoneLabel: { ar: 'رقم الهاتف', en: 'Phone Number' },
    messageLabel: { ar: 'رسالة', en: 'Message' },
    send: { ar: 'ارسال', en: 'Send' },
    preferredLocation: { ar: 'الموقع المفضل', en: 'Preferred Location' },
    yourMessage: { ar: 'رسالتك', en: 'Your Message' },
    startComparison: { ar: 'ابدأ المقارنة', en: 'Start Comparison' },
    deliveryIn: { ar: 'التسليم في', en: 'Delivery in' },
    close: { ar: 'إغلاق', en: 'Close' },
    call: { ar: 'اتصل', en: 'Call' },
    mostBrowsedUnits: { ar: 'الوحدات الأكثر مشاهدة', en: 'Most viewed units' },
    featuredRegions: { ar: 'مناطق مميزة', en: 'Featured areas' },
  };

  const searchForCards = [
    { id: 'sell', title: { ar: 'بيع وحدتك', en: 'Sell Your Unit' }, to: '/sell', icon: 'sell' },
    { id: 'offers', title: { ar: 'عروض', en: 'Offers' }, to: '/offers', icon: 'offers' },
    { id: 'resale', title: { ar: 'وحدات اعادة بيع', en: 'Resale Units' }, to: '/properties', icon: 'resale' },
    { id: 'developer', title: { ar: 'وحدات المطور', en: 'Developer Units' }, to: '/properties', icon: 'developer' },
  ];

  const featuredProjects = simpleProjects.slice(0, 6);
  const newProjects = simpleProjects.slice(0, 7);
  const mostSearchedProjects = mostBrowsedRaw.slice(0, 6);
  const featured = mostBrowsedRaw[0] || simpleProjects[0];

  useEffect(() => {
    const run = (swiper) => {
      if (!swiper) return;
      const direction = isRTL ? 'rtl' : 'ltr';
      try {
        if (swiper.autoplay?.stop) swiper.autoplay.stop();
        if (swiper.changeDirection) swiper.changeDirection(direction);
        swiper.update?.();
        swiper.updateSlides?.();
        swiper.updateSlidesClasses?.();
        setTimeout(() => swiper.autoplay?.start?.(), 300);
      } catch {
        /* ignore */
      }
    };
    run(swiperRef.current);
  }, [isRTL, language]);

  useEffect(() => {
    const run = (swiper) => {
      if (!swiper) return;
      const direction = isRTL ? 'rtl' : 'ltr';
      try {
        if (swiper.autoplay?.stop) swiper.autoplay.stop();
        if (swiper.changeDirection) swiper.changeDirection(direction);
        swiper.update?.();
        setTimeout(() => swiper.autoplay?.start?.(), 300);
      } catch {
        /* ignore */
      }
    };
    run(mostSearchedSwiperRef.current);
  }, [isRTL, language]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsFilterModalOpen(false);
    };
    if (isFilterModalOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isFilterModalOpen]);

  if (simpleLoading || regionsLoading || mbLoading) {
    return (
      <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        <Seo title={t(translations.heroTitle)} description={t(translations.heroSubtitle)} />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4" />
              <p className="text-textSecondary">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filterSelectClass =
    'w-full px-4 py-3 border border-borderColor rounded-xl focus:ring-2 focus:ring-gold focus:border-gold text-textPrimary bg-white appearance-none cursor-pointer text-sm md:text-base';

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <Seo title={t(translations.heroTitle)} description={t(translations.heroSubtitle)} />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
      <section className="relative min-h-[72vh] flex flex-col pb-28 md:pb-32">
        <div className="absolute inset-0 z-0 min-h-[78vh]">
          <ImageWithLoader
            src={heroSrc}
            alt="Yafel Real Estate"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/55 via-primary/35 to-primary/60" />
        </div>

        <div
          className="absolute left-1/2 -translate-x-1/2 translate-y-1/3 z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
          style={{ bottom: '0' }}
        >
          <div className="mb-8  px-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-md">
              {t(translations.heroTitle)}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-white/95 max-w-3xl  leading-relaxed drop-shadow">
              {t(translations.heroSubtitle)}
            </p>
          </div>

          <div className="block sm:hidden">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-borderColor/80">
              <div className="flex border-b border-borderColor">
                <button
                  type="button"
                  onClick={() => setSearchTab('units')}
                  className={`flex-1 px-4 py-3 font-semibold text-sm transition-all ${
                    searchTab === 'units'
                      ? 'text-textPrimary border-b-2 border-gold'
                      : 'text-textSecondary'
                  }`}
                >
                  {t(translations.units)}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab('compounds')}
                  className={`flex-1 px-4 py-3 font-semibold text-sm transition-all ${
                    searchTab === 'compounds'
                      ? 'text-textPrimary border-b-2 border-gold'
                      : 'text-textSecondary'
                  }`}
                >
                  {t(translations.compounds)}
                </button>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t(translations.searchPlaceholder)}
                        className="w-full px-4 py-3 pl-10 border border-borderColor rounded-xl focus:ring-2 focus:ring-gold focus:border-gold text-textPrimary text-base rtl:pl-4 rtl:pr-10"
                      />
                      <svg
                        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary ${isRTL ? 'right-3' : 'left-3'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFilterModalOpen(true)}
                      className="p-3 bg-bgSection hover:bg-bgSection rounded-xl transition-colors flex items-center justify-center shrink-0"
                      aria-label={t(translations.advancedSearch)}
                    >
                      <svg className="w-5 h-5 text-textPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full bg-primary hover:bg-primary-soft text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
                >
                  {t(translations.search)}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-borderColor/80">
              <div className="flex border-b border-borderColor">
                <button
                  type="button"
                  onClick={() => setSearchTab('units')}
                  className={`flex-1 px-6 py-4 font-semibold text-lg transition-all ${
                    searchTab === 'units'
                      ? 'text-textPrimary border-b-2 border-gold'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  {t(translations.units)}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab('compounds')}
                  className={`flex-1 px-6 py-4 font-semibold text-lg transition-all ${
                    searchTab === 'compounds'
                      ? 'text-textPrimary border-b-2 border-gold'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  {t(translations.compounds)}
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-5">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t(translations.searchPlaceholder)}
                      className="w-full px-5 py-4 border border-borderColor rounded-xl focus:ring-2 focus:ring-gold focus:border-gold text-textPrimary text-base md:text-lg rtl:pr-14 rtl:pl-5 pl-14"
                    />
                    <svg
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary ${isRTL ? 'right-4' : 'left-4'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <select
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value)}
                      className={`${filterSelectClass} ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'}`}
                    >
                      <option value="">{t(translations.unitTypes)}</option>
                      <option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                      <option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                      <option value="townhouse">{language === 'ar' ? 'تاون هاوس' : 'Townhouse'}</option>
                      <option value="duplex">{language === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                    </select>
                    <svg
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="relative">
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className={`${filterSelectClass} ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'}`}
                    >
                      <option value="">{t(translations.bedroomsBathrooms)}</option>
                      <option value="1">{language === 'ar' ? '1+ غرف' : '1+ Bedrooms'}</option>
                      <option value="2">{language === 'ar' ? '2+ غرف' : '2+ Bedrooms'}</option>
                      <option value="3">{language === 'ar' ? '3+ غرف' : '3+ Bedrooms'}</option>
                      <option value="4">{language === 'ar' ? '4+ غرف' : '4+ Bedrooms'}</option>
                    </select>
                    <svg
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="relative">
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className={`${filterSelectClass} ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'}`}
                    >
                      <option value="">{t(translations.priceRange)}</option>
                      <option value="0-500000">{language === 'ar' ? 'حتى 500,000' : 'Up to 500,000'}</option>
                      <option value="500000-1000000">500,000 - 1,000,000</option>
                      <option value="1000000-2000000">1,000,000 - 2,000,000</option>
                      <option value="2000000+">{language === 'ar' ? 'أكثر من 2,000,000' : 'More than 2,000,000'}</option>
                    </select>
                    <svg
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="w-full md:w-auto bg-primary hover:bg-primary-soft text-white font-semibold px-6 py-3.5 rounded-xl transition-colors min-h-[48px]"
                  >
                    {t(translations.search)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isFilterModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsFilterModalOpen(false)}
            aria-hidden
          />
          <div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="sticky top-0 bg-white border-b border-borderColor px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-xl font-bold text-textPrimary">{t(translations.advancedSearch)}</h2>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 hover:bg-bgSection rounded-full"
                aria-label={t(translations.close)}
              >
                <svg className="w-6 h-6 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex border-b border-borderColor mb-6">
                <button
                  type="button"
                  onClick={() => setSearchTab('units')}
                  className={`flex-1 px-4 py-3 font-semibold ${
                    searchTab === 'units' ? 'text-textPrimary border-b-2 border-gold' : 'text-textSecondary'
                  }`}
                >
                  {t(translations.units)}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab('compounds')}
                  className={`flex-1 px-4 py-3 font-semibold ${
                    searchTab === 'compounds' ? 'text-textPrimary border-b-2 border-gold' : 'text-textSecondary'
                  }`}
                >
                  {t(translations.compounds)}
                </button>
              </div>
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t(translations.searchPlaceholder)}
                    className="w-full px-4 py-3 border border-borderColor rounded-xl focus:ring-2 focus:ring-gold rtl:pr-11 rtl:pl-4 pl-11"
                  />
                  <svg
                    className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary ${isRTL ? 'right-3' : 'left-3'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-textPrimary mb-2">{t(translations.unitTypes)}</label>
                  <select
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                    className={`${filterSelectClass} ${isRTL ? 'pl-10' : 'pr-10'}`}
                  >
                    <option value="">{t(translations.unitTypes)}</option>
                    <option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                    <option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                  </select>
                  <svg
                    className={`absolute top-[2.35rem] -translate-y-1/2 w-5 h-5 text-textSecondary pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-textPrimary mb-2">{t(translations.bedroomsBathrooms)}</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className={`${filterSelectClass} ${isRTL ? 'pl-10' : 'pr-10'}`}
                  >
                    <option value="">{t(translations.bedroomsBathrooms)}</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                  <svg
                    className={`absolute top-[2.35rem] -translate-y-1/2 w-5 h-5 text-textSecondary pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-textPrimary mb-2">{t(translations.priceRange)}</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className={`${filterSelectClass} ${isRTL ? 'pl-10' : 'pr-10'}`}
                  >
                    <option value="">{t(translations.priceRange)}</option>
                    <option value="0-500000">{language === 'ar' ? 'حتى 500,000' : 'Up to 500,000'}</option>
                    <option value="2000000+">{language === 'ar' ? 'أكثر من 2,000,000' : '2M+'}</option>
                  </select>
                  <svg
                    className={`absolute top-[2.35rem] -translate-y-1/2 w-5 h-5 text-textSecondary pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-full bg-primary hover:bg-primary-soft text-white font-semibold py-4 rounded-xl"
              >
                {t(translations.search)}
              </button>
            </div>
          </div>
        </>
      )}

      <FadeInSection className="pt-8 pb-12 md:pb-16 bg-white" style={{ marginTop: 'clamp(5rem, 12vw, 9rem)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-2xl md:text-3xl font-bold text-textPrimary mb-8 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {t(translations.searchFor)}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {searchForCards.map((card, index) => (
              <Link
                key={card.id}
                to={card.to}
                className="bg-white border border-borderColor rounded-xl p-4 md:p-6 hover:border-gold/40 hover:shadow-md transition-all flex flex-col items-center text-center gap-3 min-h-[140px] justify-center"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 group-hover:scale-105 transition-transform">
                  <SearchCategoryIcon type={card.icon} />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-textPrimary leading-snug">{t(card.title)}</h3>
              </Link>
            ))}
          </div>
        </div>
      </FadeInSection>

      <section className={`py-8 bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary-soft to-primary-muted p-8 md:p-10 text-white min-h-[200px] flex flex-col justify-center">
              <div
                className={`relative z-10 w-fit max-w-md text-start ${isRTL ? 'me-auto' : ''}`}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-6">{t(translations.exclusiveOffers)}</h3>
                <Link
                  to="/offers"
                  className="inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 bg-gold text-gold-foreground hover:bg-gold/90 transition-colors shadow-sm"
                >
                  {t(translations.allOffers)}
                </Link>
              </div>
              <div className="absolute bottom-0 end-0 w-40 h-40 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black p-8 md:p-10 text-white min-h-[200px]">
              <div className="relative z-10 flex flex-row items-center justify-between gap-4">
                <div className="min-w-0 flex-1 text-start">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 leading-snug">
                    {t(translations.lookingForRent)}
                  </h3>
                  <Link
                    to="/rentals"
                    state={{ openRentSearch: true }}
                    className="inline-flex font-semibold rounded-xl px-6 py-3 bg-gold text-gold-foreground hover:bg-gold/90 transition-colors"
                  >
                    {t(translations.startHere)}
                  </Link>
                </div>
                <RentKeyGraphic className="w-24 h-24 md:w-32 md:h-32 shrink-0 opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FadeInSection className="py-9 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold text-textPrimary ${isRTL ? 'text-right' : 'text-left'}`}>
              {t(translations.newProjects)}
            </h2>
            <Link
              to="/projects"
              className={`text-gold font-semibold hover:text-gold/90 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {t(translations.viewAll)}
              <span>{isRTL ? '←' : '→'}</span>
            </Link>
          </div>
          {newProjects.length > 0 && (
            <div className="relative">
              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={14}
                slidesPerView={1}
                speed={800}
                navigation={{
                  nextEl: '.swiper-button-next-new-projects',
                  prevEl: '.swiper-button-prev-new-projects',
                }}
                pagination={{ clickable: true, el: '.swiper-pagination-new-projects' }}
                autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{
                  640: { slidesPerView: 1, spaceBetween: 12 },
                  768: { slidesPerView: 2, spaceBetween: 16 },
                  1024: { slidesPerView: 3, spaceBetween: 20 },
                  1280: { slidesPerView: 3, spaceBetween: 24 },
                }}
                className="new-projects-swiper"
                dir={isRTL ? 'rtl' : 'ltr'}
                key={`swiper-${language}`}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  const direction = isRTL ? 'rtl' : 'ltr';
                  swiper.changeDirection?.(direction);
                  swiper.update();
                }}
              >
                {newProjects.map((project) => (
                  <SwiperSlide key={project.id} className="h-auto">
                    <Link to={`/projects/${project.id}`} className="block w-full h-full group">
                      <div
                        className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-bgSection to-borderColor/60 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2"
                        style={{ aspectRatio: '391 / 219', paddingBottom: '56%' }}
                      >
                        <ImageWithLoader
                          src={project.images?.[0] || project.main_image || ''}
                          alt={t({ ar: project.name_ar, en: project.name_en })}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                type="button"
                className="swiper-button-prev-new-projects absolute top-1/2 z-10 -translate-y-1/2 start-0 md:-start-4 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center border border-borderColor/80 hover:bg-gold/25"
                aria-label={isRTL ? 'التالي' : 'Previous'}
              >
                <svg className={`w-6 h-6 text-textPrimary ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="swiper-button-next-new-projects absolute top-1/2 z-10 -translate-y-1/2 end-0 md:-end-4 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center border border-borderColor/80 hover:bg-gold/25"
                aria-label={isRTL ? 'السابق' : 'Next'}
              >
                <svg className={`w-6 h-6 text-textPrimary ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="swiper-pagination-new-projects mt-6 flex justify-center" />
            </div>
          )}
        </div>
      </FadeInSection>

      <section className={`py-9 bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-2">{t(translations.mostSearched)}</h2>
            <p className="text-lg text-textSecondary">
              {mostSearchedProjects.length} {t(translations.results)}
            </p>
          </div>
          {mostSearchedProjects.length > 0 && (
            <div className="relative">
              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next-most-searched',
                  prevEl: '.swiper-button-prev-most-searched',
                }}
                pagination={{ clickable: true, el: '.swiper-pagination-most-searched' }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 1.5, spaceBetween: 24 },
                  768: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 2.5, spaceBetween: 28 },
                  1280: { slidesPerView: 3, spaceBetween: 32 },
                }}
                className="new-projects-swiper"
                dir={isRTL ? 'rtl' : 'ltr'}
                key={`most-searched-${language}`}
                onSwiper={(swiper) => {
                  mostSearchedSwiperRef.current = swiper;
                  swiper.changeDirection?.(isRTL ? 'rtl' : 'ltr');
                  swiper.update();
                }}
              >
                {mostSearchedProjects.map((project, index) => (
                  <SwiperSlide key={project.id} className="h-auto">
                    <Link
                      to={`/projects/${project.id}`}
                      className="block w-full h-full group"
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <div className="relative w-full h-64 md:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all">
                        <ImageWithLoader
                          src={project.images?.[0] || project.main_image || ''}
                          alt={t({ ar: project.name_ar, en: project.name_en })}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 inset-x-0 p-5 md:p-6">
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                            {t({ ar: project.name_ar, en: project.name_en })}
                          </h3>
                          <div className="flex items-center gap-2 text-white/95">
                            <span className="text-base font-semibold">{project.unitsCount || 0}</span>
                            <span className="text-sm">{language === 'ar' ? 'وحدات' : 'Units'}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                type="button"
                className="swiper-button-prev-most-searched absolute top-1/2 z-10 -translate-y-1/2 start-0 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center"
                aria-label={isRTL ? 'التالي' : 'Previous'}
              >
                <svg className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="swiper-button-next-most-searched absolute top-1/2 z-10 -translate-y-1/2 end-0 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center"
                aria-label={isRTL ? 'السابق' : 'Next'}
              >
                <svg className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="swiper-pagination-most-searched mt-6 flex justify-center" />
            </div>
          )}
        </div>
      </section>

      {!mostBrowsedUnitsLoading && mostBrowsedUnits.length > 0 && (
        <FadeInSection className="py-9 bg-bgSection/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-row flex-wrap items-center justify-between gap-3 gap-y-2">
              <h2 className="min-w-0 flex-1 text-3xl md:text-4xl font-bold text-textPrimary text-start">
                {t(translations.mostBrowsedUnits)}
              </h2>
              <Link
                to="/properties"
                className={`shrink-0 text-gold font-semibold hover:text-gold/90 transition-colors inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {t(translations.viewAll)}
                <span>{isRTL ? '←' : '→'}</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mostBrowsedUnits.map((u) => (
                <UnitCard key={u.id} unit={u} to={`/properties/${u.id}`} />
              ))}
            </div>
          </div>
        </FadeInSection>
      )}

      {!featuredRegionsLoading && featuredRegions.length > 0 && (
        <FadeInSection className="py-9 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-2">{t(translations.featuredRegions)}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRegions.map((destination, index) => (
                <div key={destination.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.06}s` }}>
                  <DestinationCard destination={destination} featuredBadge />
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      )}

      <section className="py-9 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-2">{t(translations.mostImportantAreas)}</h2>
            <p className="text-lg text-textSecondary">
              {destinationsData.length} {t(translations.results)}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinationsData.map((destination) => (
              <Link
                key={destination.id}
                to={`/destinations/${destination.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all group p-4 border border-borderColor"
              >
                <div className="flex justify-center mb-3">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <ImageWithLoader
                      src={destination.image || '/destinations/default.jpg'}
                      alt={t({ ar: destination.name_ar, en: destination.name_en })}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                </div>
                <h3 className="text-center text-base font-semibold text-textPrimary group-hover:text-gold transition-colors">
                  {t({ ar: destination.name_ar, en: destination.name_en })}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured && (
        <section className="py-9 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl md:text-4xl font-bold text-textPrimary mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t(translations.recommendedForYou)}
            </h2>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-borderColor/80">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-80 lg:h-[480px]">
                  <ImageWithLoader
                    src={featured.images?.[0] || featured.main_image || ''}
                    alt={t({ ar: featured.name_ar, en: featured.name_en })}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-4 start-4">
                    <Link
                      to={`/projects/${featured.id}`}
                      className="inline-block bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-soft transition-colors text-sm"
                    >
                      {t(translations.startComparison)}
                    </Link>
                  </div>
                  <div className="absolute bottom-4 end-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                    <span>{t(translations.deliveryIn)} </span>
                    <span className="font-bold ms-1">2030</span>
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-between gap-6">
                  <div>
                    <p className="text-textSecondary text-sm mb-2">
                      {featured.address_ar || featured.address_en || (language === 'ar' ? 'مصر' : 'Egypt')}
                    </p>
                    <h3 className="text-2xl font-bold text-textPrimary">
                      {language === 'ar'
                        ? `شقة - ${featured.name_ar || 'مشروع فاخر'}`
                        : `Apartment - ${featured.name_en || 'Luxury project'}`}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={`https://wa.me/${featured.whatsappNumber || '201000000000'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[140px] bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 text-center text-sm"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${featured.whatsappNumber || '+201000000000'}`}
                      className="flex-1 min-w-[140px] bg-primary text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-soft text-center text-sm"
                    >
                      {t(translations.call)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <FadeInSection className="py-9 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t(translations.featuredProperties)}
            subtitle={language === 'ar' ? 'عقارات فاخرة مختارة بعناية' : 'Carefully selected luxury properties'}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {featuredProjects.map((project, index) => (
              <div key={project.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/projects">
              <Button variant="outline" size="lg" className="hover-lift">
                {t(translations.viewAll)}
              </Button>
            </Link>
          </div>
        </div>
      </FadeInSection>

      <BrandAtmosphere className="py-14 sm:py-20">
        <div className="relative z-10 mx-auto max-w-[520px] px-4 sm:px-6 lg:px-8">
          <BrandGlassPanel className="mb-4 flex w-full flex-col items-center gap-2 px-5 py-8 sm:px-8 sm:py-10">
            <div className="mb-4 flex justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-deep shadow-lg shadow-gold/25 ring-2 ring-white/90">
                <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <div className="absolute -bottom-1 -end-1 rounded-full bg-white p-1.5 shadow-md ring-1 ring-borderColor">
                  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="mb-2 text-center text-lg font-bold text-textPrimary sm:text-xl">{t(translations.needAssistance)}</h2>
            <p className="mb-6 max-w-sm text-center text-xs text-textSecondary sm:text-sm">{t(translations.assistanceSubtitle)}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-3 w-full"
            >
              <div className="w-full">
                <label className={`block text-xs font-semibold text-textPrimary mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(translations.nameLabel)} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={assistanceForm.name}
                  onChange={(e) => setAssistanceForm({ ...assistanceForm, name: e.target.value })}
                  placeholder={t(translations.nameLabel)}
                  required
                  className="w-full px-3 py-2 border border-borderColor rounded-lg focus:ring-2 focus:ring-gold text-sm text-textPrimary bg-white"
                />
              </div>
              <div className="w-full">
                <label className={`block text-xs font-semibold text-textPrimary mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(translations.locationLabel)} <span className="text-red-500">*</span>
                </label>
                <select
                  value={assistanceForm.location}
                  onChange={(e) => setAssistanceForm({ ...assistanceForm, location: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-borderColor rounded-lg focus:ring-2 focus:ring-gold text-sm text-textPrimary bg-white appearance-none"
                >
                  <option value="">{t(translations.preferredLocation)}</option>
                  {destinationsData.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {t({ ar: dest.name_ar, en: dest.name_en })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label className={`block text-xs font-semibold text-textPrimary mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(translations.phoneLabel)} <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={assistanceForm.phoneCode}
                    onChange={(e) => setAssistanceForm({ ...assistanceForm, phoneCode: e.target.value })}
                    className="w-full sm:w-auto px-3 py-2 border border-borderColor rounded-lg text-sm bg-white"
                  >
                    <option value="+20">+20</option>
                    <option value="+966">+966</option>
                    <option value="+971">+971</option>
                  </select>
                  <input
                    type="tel"
                    value={assistanceForm.phone}
                    onChange={(e) => setAssistanceForm({ ...assistanceForm, phone: e.target.value })}
                    placeholder={t(translations.phoneLabel)}
                    required
                    className="flex-1 rounded-lg border border-borderColor bg-white px-3 py-2 text-sm text-textPrimary"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className={`block text-xs font-semibold text-textPrimary mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(translations.messageLabel)}
                </label>
                <textarea
                  value={assistanceForm.message}
                  onChange={(e) => setAssistanceForm({ ...assistanceForm, message: e.target.value })}
                  placeholder={t(translations.yourMessage)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-borderColor bg-white px-3 py-2 text-sm text-textPrimary"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                {t(translations.send)}
              </button>
            </form>
          </BrandGlassPanel>
        </div>
      </BrandAtmosphere>

      </main>
      <Footer />
    </div>
  );
}
