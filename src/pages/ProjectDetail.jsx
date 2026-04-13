'use client';

import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import EmptyState from '@/components/EmptyState';
import ImageGallery from '@/components/ImageGallery';
import Map from '@/components/Map';
import UnitCard from '@/components/Cards/UnitCard';
import WhatsAppConsultantModal from '@/components/Modals/WhatsAppConsultantModal';
import { useModal } from '@/hooks/useModal';
import { useProject, useUnits } from '@/hooks/useGraphQL';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const projectId = parseInt(id, 10);
  const { project: projectData, loading: projectLoading } = useProject(projectId);
  const { units: unitsData, loading: unitsLoading } = useUnits({ projectId });
  const whatsappModal = useModal();
  const isRTL = language === 'ar';

  const loadingTitle = language === 'ar' ? 'تفاصيل المشروع' : 'Project details';
  const loadingDesc = language === 'ar' ? 'يافيل — عقارات فاخرة.' : 'Yafel — premium real estate.';

  if (projectLoading) {
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

  const project = projectData;

  if (!project) {
    return (
      <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
        <Seo
          title={language === 'ar' ? 'المشروع غير موجود' : 'Project not found'}
          description={loadingDesc}
        />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-2xl font-bold text-textPrimary">
              {language === 'ar' ? 'المشروع غير موجود' : 'Project not found'}
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const translations = {
    description: { ar: 'الوصف', en: 'Description' },
    location: { ar: 'الموقع', en: 'Location' },
    availableUnits: { ar: 'الوحدات المتاحة', en: 'Available Units' },
    legalConsultant: { ar: 'استشارة قانونية', en: 'Legal Consultant' },
    emptyUnitsTitle: { ar: 'لا توجد وحدات', en: 'No units available' },
    emptyUnitsDesc: {
      ar: 'لا توجد وحدات مدرجة لهذا المشروع حالياً.',
      en: 'There are no units listed for this project at the moment.',
    },
    browseCta: { ar: 'تصفح العقارات', en: 'Browse properties' },
  };

  const pageTitle = t({ ar: project.name_ar, en: project.name_en });
  const pageDesc = t({ ar: project.description_ar || '', en: project.description_en || '' })
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return (
    <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Seo title={pageTitle} description={pageDesc || loadingDesc} />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold text-textPrimary mb-4">
              {t({ ar: project.name_ar, en: project.name_en })}
            </h1>
            <p className="text-lg text-textSecondary mb-6">
              {t({ ar: project.address_ar, en: project.address_en })}
            </p>
            <button
              type="button"
              onClick={whatsappModal.open}
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-soft transition-colors font-semibold"
            >
              {t(translations.legalConsultant)}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <ImageGallery images={project.images} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">{t(translations.description)}</h2>
            <p className="text-textSecondary leading-relaxed">
              {t({ ar: project.description_ar, en: project.description_en })}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">{t(translations.location)}</h2>
            <Map
              latitude={project.latitude}
              longitude={project.longitude}
              address={t({ ar: project.address_ar, en: project.address_en })}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-textPrimary mb-6">{t(translations.availableUnits)}</h2>
            {!unitsLoading && unitsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unitsData.map((unit) => (
                  <UnitCard key={unit.id} unit={unit} />
                ))}
              </div>
            ) : unitsLoading ? (
              <p className="text-textSecondary text-center py-8">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </p>
            ) : (
              <EmptyState
                title={t(translations.emptyUnitsTitle)}
                description={t(translations.emptyUnitsDesc)}
                actionLabel={t(translations.browseCta)}
                actionTo="/properties"
              />
            )}
          </div>
        </div>
      </section>

      </main>
      <WhatsAppConsultantModal
        isOpen={whatsappModal.isOpen}
        onClose={whatsappModal.close}
        whatsappNumber={project.whatsappNumber}
        projectName={t({ ar: project.name_ar, en: project.name_en })}
      />

      <Footer />
    </div>
  );
}
