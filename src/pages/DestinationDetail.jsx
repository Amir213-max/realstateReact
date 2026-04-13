'use client';

import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import EmptyState from '@/components/EmptyState';
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

  const loadingTitle = language === 'ar' ? 'الوجهة' : 'Destination';
  const loadingDesc = language === 'ar' ? 'يافيل — عقارات فاخرة.' : 'Yafel — premium real estate.';

  if (regionLoading || projectsLoading) {
    return (
      <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
        <Seo title={loadingTitle} description={loadingDesc} />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-textSecondary">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
        <Seo
          title={language === 'ar' ? 'الوجهة غير موجودة' : 'Destination not found'}
          description={loadingDesc}
        />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-2xl font-bold text-textPrimary">
              {language === 'ar' ? 'الوجهة غير موجودة' : 'Destination not found'}
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const destTitle = t({ ar: destination.name_ar, en: destination.name_en });
  const destDesc = t({ ar: destination.description_ar || '', en: destination.description_en || '' })
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-bgSection via-white to-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Seo title={destTitle} description={destDesc || loadingDesc} />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
      <section className="relative bg-gradient-to-br from-primary via-primary-soft to-primary-muted py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
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

      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={language === 'ar' ? 'المشاريع في هذه الوجهة' : 'Projects in this Destination'}
            subtitle={language === 'ar' ? 'اكتشف جميع المشاريع المتاحة' : 'Discover all available projects'}
          />
          {regionProjects?.length > 0 ? (
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
          ) : (
            <div className="mt-12">
              <EmptyState
                title={language === 'ar' ? 'لا توجد مشاريع' : 'No projects in this destination'}
                description={
                  language === 'ar'
                    ? 'لا توجد مشاريع مدرجة لهذه الوجهة حالياً.'
                    : 'There are no projects listed for this destination yet.'
                }
                actionLabel={language === 'ar' ? 'تصفح المشاريع' : 'Browse projects'}
                actionTo="/projects"
              />
            </div>
          )}
        </div>
      </section>

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
            <div className="mt-12">
              <EmptyState
                title={language === 'ar' ? 'لا يوجد مطورون' : 'No developers yet'}
                description={
                  language === 'ar'
                    ? 'لا يوجد مطورون مدرجون لهذه الوجهة حالياً.'
                    : 'There are no developers listed for this destination yet.'
                }
                actionLabel={language === 'ar' ? 'الرئيسية' : 'Home'}
                actionTo="/"
              />
            </div>
          )}
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
}
