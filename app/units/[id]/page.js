'use client';

import { useState } from 'react';
import { use } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import Map from '@/components/Map';
import ContactUsModal from '@/components/Modals/ContactUsModal';
import WhatsAppConsultantModal from '@/components/Modals/WhatsAppConsultantModal';
import { useModal } from '@/hooks/useModal';
import { formatPrice } from '@/lib/utils';
import unitsData from '@/data/units.json';
import projectsData from '@/data/projects.json';

export default function UnitDetailPage({ params }) {
  const { language, t } = useLanguage();
  const resolvedParams = use(params);
  const unitId = parseInt(resolvedParams.id);
  const unit = unitsData.find((u) => u.id === unitId);
  const project = unit ? projectsData.find((p) => p.id === unit.projectId) : null;
  const contactModal = useModal();
  const whatsappModal = useModal();
  const isRTL = language === 'ar';

  if (!unit) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'الوحدة غير موجودة' : 'Unit not found'}
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  const translations = {
    price: { ar: 'السعر', en: 'Price' },
    area: { ar: 'المساحة', en: 'Area' },
    floor: { ar: 'الدور', en: 'Floor' },
    bedrooms: { ar: 'الغرف', en: 'Bedrooms' },
    bathrooms: { ar: 'الحمامات', en: 'Bathrooms' },
    description: { ar: 'الوصف', en: 'Description' },
    location: { ar: 'الموقع', en: 'Location' },
    contactUs: { ar: 'اتصل بنا', en: 'Contact Us' },
    legalConsultant: { ar: 'استشارة قانونية', en: 'Legal Consultant' },
    project: { ar: 'المشروع', en: 'Project' },
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Unit Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                  {formatPrice(unit.price)}
                </h1>
                {project && (
                  <p className="text-lg text-gray-600">
                    {t(translations.project)}: {t({ ar: project.name_ar, en: project.name_en })}
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={contactModal.open}
                  className="px-6 py-3 bg-neutral-900 text-white rounded-md hover:bg-neutral-700 transition-colors font-semibold"
                >
                  {t(translations.contactUs)}
                </button>
                {project && (
                  <button
                    onClick={whatsappModal.open}
                    className="px-6 py-3 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors font-semibold"
                  >
                    {t(translations.legalConsultant)}
                  </button>
                )}
              </div>
            </div>

            {/* Unit Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">{t(translations.area)}</div>
                <div className="text-xl font-bold text-gray-900">
                  {unit.area} {language === 'ar' ? 'م²' : 'm²'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">{t(translations.floor)}</div>
                <div className="text-xl font-bold text-gray-900">{unit.floor}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">{t(translations.bedrooms)}</div>
                <div className="text-xl font-bold text-gray-900">{unit.bedrooms}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">{t(translations.bathrooms)}</div>
                <div className="text-xl font-bold text-gray-900">{unit.bathrooms}</div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <ImageGallery images={unit.images} />
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(translations.description)}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t({ ar: unit.description_ar, en: unit.description_en })}
            </p>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(translations.location)}</h2>
            <Map
              latitude={unit.latitude}
              longitude={unit.longitude}
              address={project ? t({ ar: project.address_ar, en: project.address_en }) : ''}
            />
          </div>
        </div>
      </section>

      <ContactUsModal isOpen={contactModal.isOpen} onClose={contactModal.close} />

      {project && (
        <WhatsAppConsultantModal
          isOpen={whatsappModal.isOpen}
          onClose={whatsappModal.close}
          whatsappNumber={project.whatsappNumber}
          projectName={t({ ar: project.name_ar, en: project.name_en })}
        />
      )}

      <Footer />
    </div>
  );
}

