'use client';

import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import DeveloperCard from '@/components/Cards/DeveloperCard';
import ProjectCard from '@/components/Cards/ProjectCard';
import ImageWithLoader from '@/components/ui/ImageWithLoader';
import { useRegion, useProjects } from '@/hooks/useGraphQL';

export default function DestinationDetailPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const destinationId = parseInt(id, 10);
  const { region: destination, loading: regionLoading } = useRegion(destinationId);
  const { projects: regionProjects, loading: projectsLoading } = useProjects(destinationId);
  const isRTL = language === 'ar';

  const developers = [];

  if (regionLoading || projectsLoading) {
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

  if (!destination) {
    return (
      <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-textPrimary">
            {language === 'ar' ? 'الوجهة غير موجودة' : 'Destination not found'}
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-bgSection via-white to-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      <section className="relative bg-gradient-to-br from-primary via-primary-soft to-primary-muted py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-full md:w-96 h-80 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <ImageWithLoader
                src={destination.image || '/destinations/default.jpg'}
                alt={t({ ar: destination.name_ar, en: destination.name_en })}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className="flex-1 text-center md:text-left rtl:md:text-right">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {t({ ar: destination.name_ar, en: destination.name_en })}
              </h1>
              <p className="text-xl text-white/75 mb-8 leading-relaxed">
                {t({ ar: destination.description_ar, en: destination.description_en })}
              </p>
              <div className="flex items-center justify-center md:justify-start rtl:md:justify-end gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-gold mb-1">
                    {destination.developersCount || 0}
                  </div>
                  <div className="text-white/70 text-sm font-medium">
                    {language === 'ar' ? 'مطور' : 'Developers'}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-gold mb-1">
                    {destination.projectsCount || regionProjects.length || 0}
                  </div>
                  <div className="text-white/70 text-sm font-medium">
                    {language === 'ar' ? 'مشروع' : 'Projects'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {regionProjects && regionProjects.length > 0 && (
        <section className="py-16 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={language === 'ar' ? 'المشاريع في هذه الوجهة' : 'Projects in this Destination'}
              subtitle={language === 'ar' ? 'اكتشف جميع المشاريع المتاحة' : 'Discover all available projects'}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {regionProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={language === 'ar' ? 'المطورون في هذه الوجهة' : 'Developers in this Destination'}
            subtitle={language === 'ar' ? 'اكتشف أفضل المطورين' : 'Discover the best developers'}
          />
          {developers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {developers.map((developer, index) => (
                <div
                  key={developer.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <DeveloperCard developer={developer} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-borderColor">
              <svg className="w-16 h-16 text-textSecondary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-textSecondary text-lg">
                {language === 'ar' ? 'لا يوجد مطورون متاحون حالياً' : 'No developers available at the moment'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
