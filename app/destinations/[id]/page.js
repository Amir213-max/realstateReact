'use client';

import { use } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import DeveloperCard from '@/components/Cards/DeveloperCard';
import Image from 'next/image';
import destinationsData from '@/data/destinations.json';
import developersData from '@/data/developers.json';

export default function DestinationDetailPage({ params }) {
  const { language, t } = useLanguage();
  const resolvedParams = use(params);
  const destinationId = parseInt(resolvedParams.id);
  const destination = destinationsData.find((d) => d.id === destinationId);
  const developers = developersData.filter((d) => d.destinationId === destinationId);
  const isRTL = language === 'ar';

  if (!destination) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'الوجهة غير موجودة' : 'Destination not found'}
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Destination Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-full md:w-96 h-64 rounded-lg overflow-hidden">
              <Image
                src={destination.image || '/destinations/default.jpg'}
                alt={t({ ar: destination.name_ar, en: destination.name_en })}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 text-center md:text-right rtl:md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t({ ar: destination.name_ar, en: destination.name_en })}
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                {t({ ar: destination.description_ar, en: destination.description_en })}
              </p>
              <div className="flex items-center justify-center md:justify-end rtl:md:justify-start gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{destination.developersCount || 0}</div>
                  <div className="text-blue-100">
                    {language === 'ar' ? 'مطور' : 'Developers'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{destination.projectsCount || 0}</div>
                  <div className="text-blue-100">
                    {language === 'ar' ? 'مشروع' : 'Projects'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={language === 'ar' ? 'المطورون في هذه الوجهة' : 'Developers in this Destination'}
            subtitle={language === 'ar' ? 'اكتشف أفضل المطورين' : 'Discover the best developers'}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((developer) => (
              <DeveloperCard key={developer.id} developer={developer} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

