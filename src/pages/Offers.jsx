'use client';

import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BrandPageClosing } from '@/components/ui/BrandAtmosphere';
import ProjectCard from '@/components/Cards/ProjectCard';
import Seo from '@/components/Seo';
import EmptyState from '@/components/EmptyState';
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
    emptyDesc: {
      ar: 'تابعنا قريباً للعروض الحصرية على المشاريع.',
      en: 'Check back soon for exclusive project offers.',
    },
    homeCta: { ar: 'الرئيسية', en: 'Home' },
    loadError: { ar: 'تعذر تحميل العروض', en: 'Could not load offers' },
    closingTitle: { ar: 'تحتاج مساعدة في اختيار العرض المناسب؟', en: 'Need help choosing the right offer?' },
    closingDesc: {
      ar: 'فريق يافيل جاهز لمساعدتك في اختيار المشروع والوحدة الأنسب.',
      en: 'The Yafel team can help you pick the best project and unit.',
    },
    closingCta: { ar: 'تواصل معنا', en: 'Contact us' },
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        <Seo title={t(translations.title)} description={t(translations.subtitle)} />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div className="flex items-center justify-center min-h-[50vh]">
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

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <Seo title={t(translations.title)} description={t(translations.subtitle)} />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
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
            <EmptyState
              title={t(translations.empty)}
              description={t(translations.emptyDesc)}
              actionLabel={t(translations.homeCta)}
              actionTo="/"
            />
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

      <BrandPageClosing>
        <h2 className="text-xl font-bold text-textPrimary sm:text-2xl">{t(translations.closingTitle)}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-textSecondary sm:text-base">{t(translations.closingDesc)}</p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-gold hover:text-primary"
        >
          {t(translations.closingCta)}
        </Link>
      </BrandPageClosing>
      </main>
      <Footer />
    </div>
  );
}
