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
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t(translations.title)}
            subtitle={t(translations.subtitle)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinationsData.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

