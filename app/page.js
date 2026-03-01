'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ProjectCard from '@/components/Cards/ProjectCard';
import DestinationCard from '@/components/Cards/DestinationCard';
import Button from '@/components/ui/Button';
import ImageWithLoader from '@/components/ui/ImageWithLoader';
import { useProjects, useRegions, useProjectsSimple } from '@/hooks/useGraphQL';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const { language, t } = useLanguage();
  const { projects: allProjects, loading: projectsLoading } = useProjects();
  const { projects: simpleProjects, loading: simpleProjectsLoading } = useProjectsSimple();
  const { regions: destinationsData, loading: regionsLoading } = useRegions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [searchTab, setSearchTab] = useState('compounds'); // 'compounds' or 'units'
  const [unitType, setUnitType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
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
    heroTitle: {
      ar: 'ابحث عن منزلك',
      en: 'Search for your home',
    },
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
    returnBeforeTax: { ar: 'عائد قبل الضرائب', en: 'return before taxes' },
    months: { ar: 'شهور', en: 'months' },
    all: { ar: 'الكل', en: 'All' },
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
  };

  // Search For Cards Data
  const searchForCards = [
    {
      id: 2,
      image: 'https://prod-images.nawy.com/processed/pathway/image/3/medium.webp',
      title: { ar: 'بيع وحدتك', en: 'Sell Your Unit' },
      link: '/sell',
    },
    {
      id: 4,
      image: 'https://prod-images.nawy.com/processed/pathway/image/5/medium.webp',
      title: { ar: 'عروض', en: 'Offers' },
      link: '/offers',
    },
    {
      id: 5,
      image: 'https://prod-images.nawy.com/processed/pathway/image/2/medium.webp',
      title: { ar: 'وحدات اعادة بيع', en: 'Resale Units' },
      link: '/resale',
    },
    {
      id: 6,
      image: 'https://prod-images.nawy.com/processed/pathway/image/1/medium.webp',
      title: { ar: 'وحدات المطور', en: 'Developer Units' },
      link: '/developer-units',
    },
  ];

  // Use simple projects query for homepage display
  const displayProjects = simpleProjects.length > 0 ? simpleProjects : allProjects;
  const featuredProjects = displayProjects.slice(0, 6);
  const newProjects = displayProjects.slice(0, 7);
  const mostSearchedProjects = displayProjects.slice(0, 6);
  
  // Log projects output to console
  useEffect(() => {
    if (simpleProjects.length > 0) {
      console.group('🏠 HOME PAGE - Projects Display');
      console.log('Total Projects:', simpleProjects.length);
      console.log('Featured Projects (first 6):', featuredProjects);
      console.log('New Projects (first 7):', newProjects);
      console.log('Most Searched Projects (first 6):', mostSearchedProjects);
      console.log('Full Projects Array:', simpleProjects);
      console.groupEnd();
    }
  }, [simpleProjects, featuredProjects, newProjects, mostSearchedProjects]);

  // Update swiper when language changes
  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      const direction = isRTL ? 'rtl' : 'ltr';
      
      // Stop autoplay
      if (swiper.autoplay && typeof swiper.autoplay.stop === 'function') {
        try {
          swiper.autoplay.stop();
        } catch (error) {
          console.warn('Error stopping autoplay:', error);
        }
      }
      
      // Change direction
      if (swiper.changeDirection && typeof swiper.changeDirection === 'function') {
        swiper.changeDirection(direction);
      }
      
      // Update swiper
      swiper.update();
      if (swiper.updateSlides && typeof swiper.updateSlides === 'function') {
        swiper.updateSlides();
      }
      if (swiper.updateSlidesClasses && typeof swiper.updateSlidesClasses === 'function') {
        swiper.updateSlidesClasses();
      }
      
      // Restart autoplay
      if (swiper.autoplay && typeof swiper.autoplay.start === 'function') {
        setTimeout(() => {
          try {
            if (swiper.autoplay && swiper.autoplay.start) {
              swiper.autoplay.start();
            }
          } catch (error) {
            console.warn('Error starting autoplay:', error);
          }
        }, 300);
      }
    }
  }, [isRTL, language]);

  // Update most searched swiper when language changes
  useEffect(() => {
    if (mostSearchedSwiperRef.current) {
      const swiper = mostSearchedSwiperRef.current;
      const direction = isRTL ? 'rtl' : 'ltr';
      
      // Stop autoplay
      if (swiper.autoplay && typeof swiper.autoplay.stop === 'function') {
        try {
          swiper.autoplay.stop();
        } catch (error) {
          console.warn('Error stopping autoplay:', error);
        }
      }
      
      // Change direction
      if (swiper.changeDirection && typeof swiper.changeDirection === 'function') {
        swiper.changeDirection(direction);
      }
      
      // Update swiper
      swiper.update();
      if (swiper.updateSlides && typeof swiper.updateSlides === 'function') {
        swiper.updateSlides();
      }
      if (swiper.updateSlidesClasses && typeof swiper.updateSlidesClasses === 'function') {
        swiper.updateSlidesClasses();
      }
      
      // Restart autoplay
      if (swiper.autoplay && typeof swiper.autoplay.start === 'function') {
        setTimeout(() => {
          try {
            if (swiper.autoplay && swiper.autoplay.start) {
              swiper.autoplay.start();
            }
          } catch (error) {
            console.warn('Error starting autoplay:', error);
          }
        }, 300);
      }
    }
  }, [isRTL, language]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsFilterModalOpen(false);
      }
    };
    if (isFilterModalOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isFilterModalOpen]);
  
  const heroImages = [
    'https://png.pngtree.com/thumb_back/fw800/background/20240601/pngtree-real-estate-luxury-building-sale-property-background-images-image_15851318.jpg',
    'https://www.nawy.com/_next/static/media/landing-new-background.5e086e5d.webp',
    '/assets/brand/images/shutterstock_2558087881.jpg',
  ];

  // Show loading state without affecting layout
  if (projectsLoading || regionsLoading) {
    return (
      <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f0cb8e] mx-auto mb-4"></div>
            <p className="text-[#6D6D6D]">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen  bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Enhanced Hero Section with Tabs */}
      <section className="relative min-h-[70vh] flex flex-col pb-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 h-[73vh]">
          <ImageWithLoader
            src={heroImages[1]}
            alt="Yafel Real Estate"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e1e]/50 via-[#1e1e1e]/30 to-[#1e1e1e]/50"></div>
        </div>

        {/* Enhanced Search Bar with Tabs - Half on background, half below */}
        <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-12" style={{ bottom: '0vh' }}>
          {/* Text Content - Above form, on the right */}
          <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
              {t(translations.heroTitle)}
            </h1>
            <p className="text-lg md:text-xl text-white max-w-4xl leading-relaxed">
              {t(translations.heroSubtitle)}
            </p>
          </div>

          {/* Mobile Simplified Form */}
          <div className="block sm:hidden">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4">
                <div className="mb-3">
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t(translations.searchPlaceholder)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#1e1e1e] text-base rtl:pl-4 rtl:pr-10"
                      />
                      <svg
                        className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button
                      onClick={() => setIsFilterModalOpen(true)}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      aria-label={t(translations.advancedSearch)}
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  {t(translations.search)}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Full Form */}
          <div className="hidden sm:block">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setSearchTab('units')}
                  className={`flex-1 px-6 py-4 font-semibold text-lg transition-all ${
                    searchTab === 'units'
                      ? 'text-[#1e1e1e] border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-[#1e1e1e]'
                  }`}
                >
                  {t(translations.units)}
                </button>
                <button
                  onClick={() => setSearchTab('compounds')}
                  className={`flex-1 px-6 py-4 font-semibold text-lg transition-all ${
                    searchTab === 'compounds'
                      ? 'text-[#1e1e1e] border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-[#1e1e1e]'
                  }`}
                >
                  {t(translations.compounds)}
                </button>
              </div>

              {/* Search Form */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t(translations.searchPlaceholder)}
                      className="w-full px-6 py-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#1e1e1e] text-lg rtl:pl-6 rtl:pr-12"
                    />
                    <svg
                      className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filters Row - 3 dropdowns + Search Button */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <select
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#1e1e1e] bg-white appearance-none cursor-pointer"
                    >
                      <option value="">{t(translations.unitTypes)}</option>
                      <option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                      <option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                      <option value="townhouse">{language === 'ar' ? 'تاون هاوس' : 'Townhouse'}</option>
                      <option value="duplex">{language === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                    </select>
                    <svg className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="relative">
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#1e1e1e] bg-white appearance-none cursor-pointer"
                    >
                      <option value="">{t(translations.bedroomsBathrooms)}</option>
                      <option value="1">{language === 'ar' ? '1+ غرف' : '1+ Bedrooms'}</option>
                      <option value="2">{language === 'ar' ? '2+ غرف' : '2+ Bedrooms'}</option>
                      <option value="3">{language === 'ar' ? '3+ غرف' : '3+ Bedrooms'}</option>
                      <option value="4">{language === 'ar' ? '4+ غرف' : '4+ Bedrooms'}</option>
                    </select>
                    <svg className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="relative">
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#1e1e1e] bg-white appearance-none cursor-pointer"
                    >
                      <option value="">{t(translations.priceRange)}</option>
                      <option value="0-500000">{language === 'ar' ? 'حتى 500,000' : 'Up to 500,000'}</option>
                      <option value="500000-1000000">{language === 'ar' ? '500,000 - 1,000,000' : '500,000 - 1,000,000'}</option>
                      <option value="1000000-2000000">{language === 'ar' ? '1,000,000 - 2,000,000' : '1,000,000 - 2,000,000'}</option>
                      <option value="2000000+">{language === 'ar' ? 'أكثر من 2,000,000' : 'More than 2,000,000'}</option>
                    </select>
                    <svg className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {/* Search Button */}
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    {t(translations.search)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Search Modal */}
      {isFilterModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={() => setIsFilterModalOpen(false)}
          />
          
          {/* Modal */}
          <div className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-all duration-300 ease-out ${
            isFilterModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="text-xl font-bold text-[#1e1e1e]">
                {t(translations.advancedSearch)}
              </h2>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setSearchTab('units')}
                  className={`flex-1 px-4 py-3 font-semibold text-base transition-all ${
                    searchTab === 'units'
                      ? 'text-[#1e1e1e] border-b-2 border-blue-500'
                      : 'text-gray-500'
                  }`}
                >
                  {t(translations.units)}
                </button>
                <button
                  onClick={() => setSearchTab('compounds')}
                  className={`flex-1 px-4 py-3 font-semibold text-base transition-all ${
                    searchTab === 'compounds'
                      ? 'text-[#1e1e1e] border-b-2 border-blue-500'
                      : 'text-gray-500'
                  }`}
                >
                  {t(translations.compounds)}
                </button>
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t(translations.searchPlaceholder)}
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#1e1e1e] text-base rtl:pl-4 rtl:pr-11"
                  />
                  <svg
                    className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t(translations.unitTypes)}
                  </label>
                  <select
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#1e1e1e] bg-white appearance-none cursor-pointer"
                  >
                    <option value="">{t(translations.unitTypes)}</option>
                    <option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                    <option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                    <option value="townhouse">{language === 'ar' ? 'تاون هاوس' : 'Townhouse'}</option>
                    <option value="duplex">{language === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                  </select>
                  <svg className={`absolute top-[2.75rem] transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t(translations.bedroomsBathrooms)}
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#1e1e1e] bg-white appearance-none cursor-pointer"
                  >
                    <option value="">{t(translations.bedroomsBathrooms)}</option>
                    <option value="1">{language === 'ar' ? '1+ غرف' : '1+ Bedrooms'}</option>
                    <option value="2">{language === 'ar' ? '2+ غرف' : '2+ Bedrooms'}</option>
                    <option value="3">{language === 'ar' ? '3+ غرف' : '3+ Bedrooms'}</option>
                    <option value="4">{language === 'ar' ? '4+ غرف' : '4+ Bedrooms'}</option>
                  </select>
                  <svg className={`absolute top-[2.75rem] transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t(translations.priceRange)}
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#1e1e1e] bg-white appearance-none cursor-pointer"
                  >
                    <option value="">{t(translations.priceRange)}</option>
                    <option value="0-500000">{language === 'ar' ? 'حتى 500,000' : 'Up to 500,000'}</option>
                    <option value="500000-1000000">{language === 'ar' ? '500,000 - 1,000,000' : '500,000 - 1,000,000'}</option>
                    <option value="1000000-2000000">{language === 'ar' ? '1,000,000 - 2,000,000' : '1,000,000 - 2,000,000'}</option>
                    <option value="2000000+">{language === 'ar' ? 'أكثر من 2,000,000' : 'More than 2,000,000'}</option>
                  </select>
                  <svg className={`absolute top-[2.75rem] transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-4 rounded-lg transition-colors duration-200 text-base"
              >
                {t(translations.search)}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Search For Section */}
      <section className="py-16 bg-white mt-24 " style={{ marginTop: "150px" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-[#1e1e1e] mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t(translations.searchFor)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {searchForCards.map((card, index) => (
              <Link
                key={card.id}
                href={card.link}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 group flex flex-col items-center text-center animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ImageWithLoader
                    src={card.image}
                    alt={t(card.title)}
                    fill
                    sizes="48px"
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-base font-medium text-[#1e1e1e] group-hover:text-blue-600 transition-colors">
                  {t(card.title)}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner 1 - Exclusive Offers */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  {t(translations.exclusiveOffers)}
                </h3>
                <Button variant="secondary" size="md">
                  {t(translations.allOffers)}
                </Button>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </div>

            {/* Banner 2 - Yafel Keys */}
            <div className="bg-black rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{t(translations.lookingForRent)}</h3>
                  <Button variant="secondary" size="sm" className="mt-4">
                    {t(translations.startHere)}
                  </Button>
                </div>
                <div className="text-6xl">🔑</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Projects Section with Slider */}
      <section className="py-9 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold text-[#1e1e1e] ${isRTL ? 'text-right' : 'text-left'}`}>
              {t(translations.newProjects)}
            </h2>
            <Link href="/projects" className={`text-[#f0cb8e] font-semibold hover:text-[#d8b280] transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              {t(translations.viewAll)}
              <span>{isRTL ? '←' : '→'}</span>
            </Link>
          </div>
          
          {newProjects.length > 0 && (
            <div className="relative">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={14}
                slidesPerView={1}
                speed={800}
                navigation={{
                  nextEl: '.swiper-button-next-new-projects',
                  prevEl: '.swiper-button-prev-new-projects',
                }}
                pagination={{
                  clickable: true,
                  el: '.swiper-pagination-new-projects',
                }}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 12,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  1440: {
                    slidesPerView: 3,
                    spaceBetween: 28,
                  },
                }}
                className="new-projects-swiper"
                dir={isRTL ? 'rtl' : 'ltr'}
                key={`swiper-${language}`}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  const direction = isRTL ? 'rtl' : 'ltr';
                  if (swiper.changeDirection) {
                    swiper.changeDirection(direction);
                  }
                  swiper.update();
                }}
              >
                {newProjects.map((project, index) => (
                  <SwiperSlide key={project.id} className="h-auto">
                    <Link 
                      href={`/projects/${project.id}`}
                      className="block w-full h-full group"
                    >
                      <div
                        className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2"
                        style={{ aspectRatio: '391 / 219', paddingBottom: '56%' }}
                      >
                        <ImageWithLoader
                          src={project.images?.[0] || project.main_image || 'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2256037689_mc4cxv'}
                          alt={t({ ar: project.name_ar, en: project.name_en })}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Custom Navigation Buttons */}
              <button 
                type="button"
                className="swiper-button-prev-new-projects"
                aria-label={isRTL ? 'التالي' : 'Previous'}
              >
                <svg className={`w-6 h-6 text-[#1e1e1e] ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                type="button"
                className="swiper-button-next-new-projects"
                aria-label={isRTL ? 'السابق' : 'Next'}
              >
                <svg className={`w-6 h-6 text-[#1e1e1e] ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Custom Pagination */}
              <div className="swiper-pagination-new-projects"></div>
            </div>
          )}
        </div>
      </section>

      {/* Most Searched Compounds Section */}
      <section className={`py-9 bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1e1e] mb-2">
                {t(translations.mostSearched)}
              </h2>
              <p className="text-lg text-gray-600">
                {mostSearchedProjects.length} {t(translations.results)}
              </p>
            </div>
          </div>
          
          {mostSearchedProjects.length > 0 && (
            <div className="relative">
              <Swiper
                ref={mostSearchedSwiperRef}
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next-most-searched',
                  prevEl: '.swiper-button-prev-most-searched',
                }}
                pagination={{
                  clickable: true,
                  el: '.swiper-pagination-most-searched',
                }}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1.5,
                    spaceBetween: 24,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 2.5,
                    spaceBetween: 28,
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 32,
                  },
                  1440: {
                    slidesPerView: 3.5,
                    spaceBetween: 36,
                  },
                }}
                className="new-projects-swiper"
                dir={isRTL ? 'rtl' : 'ltr'}
                key={`most-searched-swiper-${language}`}
                onSwiper={(swiper) => {
                  mostSearchedSwiperRef.current = swiper;
                  const direction = isRTL ? 'rtl' : 'ltr';
                  if (swiper.changeDirection) {
                    swiper.changeDirection(direction);
                  }
                  swiper.update();
                }}
              >
                {mostSearchedProjects.map((project, index) => (
                  <SwiperSlide key={project.id} className="h-auto">
                    <Link 
                      href={`/projects/${project.id}`}
                      className="block w-full h-full group animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative w-full h-64 md:h-72 lg:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                        <ImageWithLoader
                          src={project.images?.[0] || project.main_image || 'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2256037689_mc4cxv'}
                          alt={t({ ar: project.name_ar, en: project.name_en })}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          loading="lazy"
                        />
                        {/* Overlay with gradient from black to lighter */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-80"></div>
                        
                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-0 group-hover:translate-y-0 transition-all duration-500 ease-out">
                          <div className="rounded-xl p-4 md:p-5 transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 drop-shadow-lg group-hover:text-[#f0cb8e] transition-colors duration-500 ease-out transform group-hover:scale-105">
                              {t({ ar: project.name_ar, en: project.name_en })}
                            </h3>
                            <div className="flex items-center gap-2 transform translate-y-1 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75">
                              <span className="text-base md:text-lg font-semibold text-white drop-shadow-md">
                                {project.unitsCount || 0}
                              </span>
                              <span className="text-sm md:text-base text-white/90 drop-shadow-md">
                                {language === 'ar' ? 'وحدات' : 'Units'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Custom Navigation Buttons */}
              <button 
                type="button"
                className="swiper-button-prev-most-searched"
                aria-label={isRTL ? 'التالي' : 'Previous'}
              >
                <svg className={`w-6 h-6 text-[#1e1e1e] ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                type="button"
                className="swiper-button-next-most-searched"
                aria-label={isRTL ? 'السابق' : 'Next'}
              >
                <svg className={`w-6 h-6 text-[#1e1e1e] ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Custom Pagination */}
              <div className="swiper-pagination-most-searched"></div>
            </div>
          )}
        </div>
      </section>

      {/* Most Important Areas Section */}
      <section className="py-9 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1e1e] mb-2">
              {t(translations.mostImportantAreas)}
            </h2>
            <p className="text-lg text-gray-600">
              {destinationsData.length} {t(translations.results)}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {destinationsData.map((destination) => (
              <Link
                key={destination.id}
                href={`/destinations/${destination.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group p-4 border border-gray-300"
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
                <h3 className="text-center text-base font-semibold text-[#1e1e1e] group-hover:text-[#f0cb8e] transition-colors">
                  {t({ ar: destination.name_ar, en: destination.name_en })}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended For You Section */}
      <section className="py-9 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-4xl md:text-5xl font-bold text-[#1e1e1e] mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'نرشح لك' : 'Recommended For You'}
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Property Image */}
              <div className="relative h-96 lg:h-[500px]">
                <ImageWithLoader
                  src={featuredProjects[0]?.images?.[0] || '/assets/brand/images/shutterstock_2558087881.jpg'}
                  alt={t({ ar: featuredProjects[0]?.name_ar, en: featuredProjects[0]?.name_en })}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Image Overlays */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    {language === 'ar' ? 'ابدأ المقارنة' : 'Start Comparison'}
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                  <span className="text-sm">{language === 'ar' ? 'التسليم في' : 'Delivery in'}</span>
                  <span className="text-lg font-bold ml-2">2030</span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-1">
                      {featuredProjects[0]?.address_ar || featuredProjects[0]?.address_en || 'مدينة المستقبل، مصر'}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1e1e1e]">
                      {language === 'ar' 
                        ? `شقة - ${featuredProjects[0]?.name_ar || 'مشروع فاخر'}`
                        : `Apartment - ${featuredProjects[0]?.name_en || 'Luxury Project'}`
                      }
                    </h3>
                  </div>

                  {/* Property Features */}
                  <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#f0cb8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-gray-700 font-medium">
                        {language === 'ar' ? '1 غرف نوم' : '1 Bedroom'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#f0cb8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700 font-medium">
                        {language === 'ar' ? '2 حمامات' : '2 Bathrooms'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#f0cb8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="text-gray-700 font-medium">
                        75 {language === 'ar' ? 'م²' : 'm²'}
                      </span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">
                      {language === 'ar' ? '44,856 شهريا / 10 سنوات' : '44,856 monthly / 10 years'}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <p className="text-4xl md:text-5xl font-bold text-[#1e1e1e]">
                      {language === 'ar' ? '5,666,000 جم' : '5,666,000 EGP'}
                    </p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-4">
                  <a
                    href={`https://wa.me/${featuredProjects[0]?.whatsappNumber || '966501234567'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.239-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${featuredProjects[0]?.whatsappNumber || '966501234567'}`}
                    className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {language === 'ar' ? 'اتصل' : 'Call'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-9 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t(translations.featuredProperties)}
            subtitle={
              language === 'ar'
                ? 'عقارات فاخرة مختارة بعناية'
                : 'Carefully selected luxury properties'
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <Button variant="outline" size="lg" className="hover-lift">
              {t(translations.viewAll)}
            </Button>
          </div>
        </div>
      </section>

      {/* Real Estate Assistance Form Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[520px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[rgb(228,235,242)] rounded-lg py-8 px-4 w-full flex flex-col items-center gap-2 mb-4">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="relative w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  {/* Envelope Icon */}
                  <svg className="w-10 h-10 text-white transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  {/* Phone Icon Overlay */}
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                    <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className={`text-lg sm:text-xl font-bold text-blue-700 mb-2 text-center`}>
              {t(translations.needAssistance)}
            </h2>

            {/* Subtitle */}
            <p className={`text-xs sm:text-sm text-gray-700 mb-6 text-center`}>
              {t(translations.assistanceSubtitle)}
            </p>

            {/* Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log('Form submitted:', assistanceForm);
              // Handle form submission here
            }} className="space-y-3 w-full">
              {/* Name Field */}
              <div className="w-full">
                <label className={`block text-xs font-semibold text-gray-700 mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(translations.nameLabel)} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={assistanceForm.name}
                  onChange={(e) => setAssistanceForm({ ...assistanceForm, name: e.target.value })}
                  placeholder={t(translations.nameLabel)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-[#1e1e1e] bg-white transition-all duration-200"
                />
              </div>

              {/* Location Field */}
              <div className="w-full">
                <label className={`block text-xs font-semibold text-gray-700 mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(translations.locationLabel)} <span className="text-red-500">*</span>
                </label>
                <div className="relative w-full">
                  <select
                    value={assistanceForm.location}
                    onChange={(e) => setAssistanceForm({ ...assistanceForm, location: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-[#1e1e1e] bg-white transition-all duration-200 appearance-none cursor-pointer pr-8"
                  >
                    <option value="">{t(translations.preferredLocation)}</option>
                    {destinationsData.map((dest) => (
                      <option key={dest.id} value={dest.id}>
                        {t({ ar: dest.name_ar, en: dest.name_en })}
                      </option>
                    ))}
                  </select>
                  <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'left-0 pl-2' : 'right-0 pr-2'}`}>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Phone Field */}
              <div className="w-full">
                <label className={`block text-xs font-semibold text-gray-700 mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(translations.phoneLabel)} <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <div className="relative w-full sm:w-auto">
                    <select
                      value={assistanceForm.phoneCode}
                      onChange={(e) => setAssistanceForm({ ...assistanceForm, phoneCode: e.target.value })}
                      className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-[#1e1e1e] bg-white transition-all duration-200 appearance-none cursor-pointer sm:min-w-[100px] pr-8"
                    >
                      <option value="+20">🇪🇬 +20</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+965">🇰🇼 +965</option>
                      <option value="+974">🇶🇦 +974</option>
                      <option value="+973">🇧🇭 +973</option>
                      <option value="+968">🇴🇲 +968</option>
                    </select>
                    <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'left-0 pl-2' : 'right-0 pr-2'}`}>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <input
                    type="tel"
                    value={assistanceForm.phone}
                    onChange={(e) => setAssistanceForm({ ...assistanceForm, phone: e.target.value })}
                    placeholder={t(translations.phoneLabel)}
                    required
                    className="flex-1 w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-[#1e1e1e] bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="w-full">
                <label className={`block text-xs font-semibold text-gray-700 mb-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(translations.messageLabel)}
                </label>
                <textarea
                  value={assistanceForm.message}
                  onChange={(e) => setAssistanceForm({ ...assistanceForm, message: e.target.value })}
                  placeholder={t(translations.yourMessage)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-[#1e1e1e] bg-white resize-none transition-all duration-200"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 w-full">
                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  {t(translations.send)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
