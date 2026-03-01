'use client';

import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import DestinationCard from '@/components/Cards/DestinationCard';
import { useRegions } from '@/hooks/useGraphQL';

export default function DestinationsPage() {
  const { language, t } = useLanguage();
  const { regions: destinationsData, loading } = useRegions();
  const isRTL = language === 'ar';

  const translations = {
    title: { ar: 'جميع الوجهات', en: 'All Destinations' },
    subtitle: { ar: 'اكتشف جميع الوجهات العقارية المتاحة', en: 'Discover all available real estate destinations' },
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
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
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1e1e1e] via-[#2d2d2d] to-[#1e1e1e] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#f0cb8e] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t(translations.title)}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t(translations.subtitle)}
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinationsData.map((destination, index) => (
              <div
                key={destination.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <DestinationCard destination={destination} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

