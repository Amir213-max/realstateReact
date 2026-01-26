'use client';

import { useState } from 'react';
import { use } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import Map from '@/components/Map';
import UnitCard from '@/components/Cards/UnitCard';
import WhatsAppConsultantModal from '@/components/Modals/WhatsAppConsultantModal';
import { useModal } from '@/hooks/useModal';
import projectsData from '@/data/projects.json';
import unitsData from '@/data/units.json';
import Link from 'next/link';

export default function ProjectDetailPage({ params }) {
  const { language, t } = useLanguage();
  const resolvedParams = use(params);
  const projectId = parseInt(resolvedParams.id);
  const project = projectsData.find((p) => p.id === projectId);
  const units = unitsData.filter((u) => u.projectId === projectId);
  const whatsappModal = useModal();
  const isRTL = language === 'ar';

  if (!project) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'المشروع غير موجود' : 'Project not found'}
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  const translations = {
    description: { ar: 'الوصف', en: 'Description' },
    location: { ar: 'الموقع', en: 'Location' },
    availableUnits: { ar: 'الوحدات المتاحة', en: 'Available Units' },
    legalConsultant: { ar: 'استشارة قانونية', en: 'Legal Consultant' },
    contactWhatsApp: { ar: 'اتصل عبر واتساب', en: 'Contact via WhatsApp' },
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t({ ar: project.name_ar, en: project.name_en })}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {t({ ar: project.address_ar, en: project.address_en })}
            </p>
            <button
              onClick={whatsappModal.open}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors font-semibold"
            >
              {t(translations.legalConsultant)}
            </button>
          </div>

          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <ImageGallery images={project.images} />
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(translations.description)}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t({ ar: project.description_ar, en: project.description_en })}
            </p>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(translations.location)}</h2>
            <Map
              latitude={project.latitude}
              longitude={project.longitude}
              address={t({ ar: project.address_ar, en: project.address_en })}
            />
          </div>

          {/* Units */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t(translations.availableUnits)}</h2>
            {units.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {units.map((unit) => (
                  <UnitCard key={unit.id} unit={unit} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                {language === 'ar' ? 'لا توجد وحدات متاحة حالياً' : 'No units available at the moment'}
              </p>
            )}
          </div>
        </div>
      </section>

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

