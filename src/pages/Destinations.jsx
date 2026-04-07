import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/Cards/DestinationCard';
import { useRegions, useCountries } from '@/hooks/useGraphQL';

export default function DestinationsPage() {
  const { language, t } = useLanguage();
  const [countryId, setCountryId] = useState('');
  const { regions: destinationsData, loading } = useRegions(countryId || null);
  const { countries } = useCountries();
  const isRTL = language === 'ar';

  const translations = {
    title: { ar: 'جميع الوجهات', en: 'All Destinations' },
    subtitle: { ar: 'اكتشف جميع الوجهات العقارية المتاحة', en: 'Discover all available real estate destinations' },
    allCountries: { ar: 'كل الدول', en: 'All countries' },
    filterCountry: { ar: 'الدولة', en: 'Country' },
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-textSecondary">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-bgSection via-white to-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary-soft to-primary-muted overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t(translations.title)}
          </h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto">
            {t(translations.subtitle)}
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-8 flex flex-wrap items-end gap-4 ${isRTL ? 'justify-end' : 'justify-start'}`}>
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-textPrimary mb-1.5">{t(translations.filterCountry)}</label>
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="w-full px-4 py-2.5 border border-borderColor-strong rounded-xl bg-white text-textPrimary text-sm focus:ring-2 focus:ring-gold"
              >
                <option value="">{t(translations.allCountries)}</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t({ ar: c.name_ar, en: c.name_en })}
                  </option>
                ))}
              </select>
            </div>
          </div>
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

