import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/SectionHeader';
import ProjectCard from '@/components/Cards/ProjectCard';
import Seo from '@/components/Seo';
import EmptyState from '@/components/EmptyState';
import { BrandPageClosing } from '@/components/ui/BrandAtmosphere';
import { useProjects } from '@/hooks/useGraphQL';

export default function ProjectsPage() {
  const { language, t } = useLanguage();
  const { projects: projectsData, loading } = useProjects();
  const isRTL = language === 'ar';

  const translations = {
    title: { ar: 'جميع المشاريع', en: 'All Projects' },
    subtitle: { ar: 'اكتشف جميع المشاريع العقارية المتاحة', en: 'Discover all available real estate projects' },
    emptyTitle: { ar: 'لا توجد مشاريع', en: 'No projects yet' },
    emptyDesc: {
      ar: 'لا توجد مشاريع منشورة حالياً. عد لاحقاً.',
      en: 'There are no published projects right now. Please check back later.',
    },
    emptyCta: { ar: 'الرئيسية', en: 'Home' },
    closingTitle: { ar: 'تبحث عن مشروع بمواصفات معينة؟', en: 'Looking for a project with specific criteria?' },
    closingDesc: {
      ar: 'خبراؤنا يساعدونك في اختيار الكمبوند أو الوحدة الأنسب.',
      en: 'Our consultants help you choose the right compound or unit.',
    },
    closingCta: { ar: 'تواصل معنا', en: 'Contact us' },
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
        <Seo title={t(translations.title)} description={t(translations.subtitle)} />
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

  return (
    <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Seo title={t(translations.title)} description={t(translations.subtitle)} />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title={t(translations.title)} subtitle={t(translations.subtitle)} />
            {!projectsData?.length ? (
              <EmptyState
                title={t(translations.emptyTitle)}
                description={t(translations.emptyDesc)}
                actionLabel={t(translations.emptyCta)}
                actionTo="/"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsData.map((project) => (
                  <ProjectCard key={project.id} project={project} />
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
