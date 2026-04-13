'use client';

import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import EmptyState from '@/components/EmptyState';
import SectionHeader from '@/components/SectionHeader';
import ProjectCard from '@/components/Cards/ProjectCard';
import Badge from '@/components/Badge';
import ImageWithLoader from '@/components/ui/ImageWithLoader';
import { BrandPageClosing } from '@/components/ui/BrandAtmosphere';
import { useDeveloper, useProjects } from '@/hooks/useGraphQL';

export default function DeveloperDetailPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const developerId = parseInt(id, 10);
  const { developer: developerData, loading: developerLoading } = useDeveloper(developerId);
  const { projects: allProjects, loading: projectsLoading } = useProjects();
  const isRTL = language === 'ar';

  const projects = allProjects.filter((p) => p.developerId === developerId);

  const loadingTitle = language === 'ar' ? 'المطور' : 'Developer';
  const loadingDesc = language === 'ar' ? 'يافيل — عقارات فاخرة.' : 'Yafel — premium real estate.';

  if (developerLoading || projectsLoading) {
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

  const developer = developerData;

  if (!developer) {
    return (
      <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
        <Seo
          title={language === 'ar' ? 'المطور غير موجود' : 'Developer not found'}
          description={loadingDesc}
        />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-2xl font-bold text-textPrimary">
              {language === 'ar' ? 'المطور غير موجود' : 'Developer not found'}
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const devTitle = t({ ar: developer.name_ar, en: developer.name_en });
  const devDesc = t({ ar: developer.description_ar || '', en: developer.description_en || '' })
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return (
    <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Seo title={devTitle} description={devDesc || loadingDesc} />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
      <section className="bg-white py-16 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-bgSection">
              <ImageWithLoader
                src={developer.logo || '/logos/default.png'}
                alt={t({ ar: developer.name_ar, en: developer.name_en })}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1 text-center md:text-right rtl:md:text-left">
              <div className="flex items-center justify-center md:justify-end rtl:md:justify-start gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-textPrimary">
                  {t({ ar: developer.name_ar, en: developer.name_en })}
                </h1>
                {developer.isPrimary && <Badge />}
              </div>
              <p className="text-lg text-textSecondary mb-6">
                {t({ ar: developer.description_ar, en: developer.description_en })}
              </p>
              <div className="flex items-center justify-center md:justify-end rtl:md:justify-start gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{developer.projectsCount || 0}</div>
                  <div className="text-textSecondary">
                    {language === 'ar' ? 'مشروع' : 'Projects'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{developer.unitsCount || 0}</div>
                  <div className="text-textSecondary">
                    {language === 'ar' ? 'وحدة متاحة' : 'Units Available'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={language === 'ar' ? 'مشاريع المطور' : 'Developer Projects'}
            subtitle={language === 'ar' ? 'اكتشف جميع المشاريع' : 'Discover all projects'}
          />
          {projects.length === 0 ? (
            <EmptyState
              title={language === 'ar' ? 'لا توجد مشاريع' : 'No projects yet'}
              description={
                language === 'ar'
                  ? 'لا توجد مشاريع مرتبطة بهذا المطور حالياً.'
                  : 'There are no projects linked to this developer yet.'
              }
              actionLabel={language === 'ar' ? 'تصفح المشاريع' : 'Browse projects'}
              actionTo="/projects"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <BrandPageClosing>
        <h2 className="text-xl font-bold text-textPrimary sm:text-2xl">
          {language === 'ar' ? 'مهتم بمشاريع هذا المطور؟' : 'Interested in this developer’s projects?'}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-textSecondary sm:text-base">
          {language === 'ar'
            ? 'تواصل معنا لترتيب جولة أو استشارة.'
            : 'Contact us to arrange a tour or a consultation.'}
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-gold hover:text-primary"
        >
          {language === 'ar' ? 'تواصل معنا' : 'Contact us'}
        </Link>
      </BrandPageClosing>

      </main>
      <Footer />
    </div>
  );
}
