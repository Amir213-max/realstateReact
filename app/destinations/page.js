'use client';

import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import DestinationCard from '@/components/Cards/DestinationCard';
import destinationsData from '@/data/destinations.json';

export default function DestinationsPage() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const translations = {
    title: { ar: 'جميع الوجهات', en: 'All Destinations' },
    subtitle: { ar: 'اكتشف جميع الوجهات العقارية المتاحة', en: 'Discover all available real estate destinations' },
  };

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

