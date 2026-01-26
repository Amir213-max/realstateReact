'use client';

import { use } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import DeveloperCard from '@/components/Cards/DeveloperCard';
import Image from 'next/image';
import { useRegion, useProjects } from '@/hooks/useGraphQL';
import { transformDeveloper } from '@/lib/dataTransform';

export default function DestinationDetailPage({ params }) {
  const { language, t } = useLanguage();
  const resolvedParams = use(params);
  const destinationId = parseInt(resolvedParams.id);
  const { region: destination, loading: regionLoading } = useRegion(destinationId);
  const { projects: regionProjects, loading: projectsLoading } = useProjects(destinationId);
  const isRTL = language === 'ar';

  // Get unique developers from projects
  // Note: We need to fetch developers separately or get them from a different source
  // For now, we'll use an empty array and let the user know we need to implement developer fetching
  const developers = [];

  if (regionLoading || projectsLoading) {
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
          {developers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {developers.map((developer) => (
                <DeveloperCard key={developer.id} developer={developer} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">
              {language === 'ar' ? 'لا يوجد مطورون متاحون حالياً' : 'No developers available at the moment'}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

