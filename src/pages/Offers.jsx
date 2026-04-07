'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/Cards/ProjectCard';
import { useLanguage } from '@/context/LanguageContext';
import { useOfferProjects } from '@/hooks/useGraphQL';

export default function OffersPage() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const { projects, loading, error } = useOfferProjects();

  const translations = {
    title: { ar: 'عروض الحصر', en: 'Exclusive Offers' },
    subtitle: {
      ar: 'مشاريع مختارة عليها عروض وخصومات مميزة',
      en: 'Selected projects with special offers and discounts',
    },
    results: { ar: 'نتائج', en: 'results' },
    empty: { ar: 'لا توجد عروض حالياً', en: 'No offers available right now' },
    loadError: { ar: 'تعذر تحميل العروض', en: 'Could not load offers' },
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4" />
            <p className="text-textSecondary">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <section className="bg-gradient-to-br from-primary to-primary-soft text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{t(translations.title)}</h1>
          <p className="text-lg md:text-xl text-white/70">{t(translations.subtitle)}</p>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <p className="text-center text-red-600 mb-6" role="alert">
              {t(translations.loadError)}
            </p>
          )}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-textPrimary">
              {projects.length} {t(translations.results)}
            </h2>
          </div>
          {projects.length === 0 ? (
            <p className="text-center text-textSecondary py-12">{t(translations.empty)}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProjectCard project={project} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
