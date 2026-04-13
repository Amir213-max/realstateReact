'use client';

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import ImageGallery from '@/components/ImageGallery';
import Map from '@/components/Map';
import Button from '@/components/ui/Button';
import ContactUsModal from '@/components/Modals/ContactUsModal';
import WhatsAppConsultantModal from '@/components/Modals/WhatsAppConsultantModal';
import { useModal } from '@/hooks/useModal';
import { formatPrice } from '@/lib/utils';
import { useUnit } from '@/hooks/useGraphQL';
import { graphqlRequest } from '@/lib/graphql';
import { SUBMIT_UNIT_INQUIRY } from '@/lib/queries';

export default function UnitDetailPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { unit: unitData, loading: unitLoading } = useUnit(id);
  const contactModal = useModal();
  const whatsappModal = useModal();
  const isRTL = language === 'ar';
  const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);

  const loadingTitle = language === 'ar' ? 'تفاصيل الوحدة' : 'Unit details';
  const loadingDesc = language === 'ar' ? 'يافيل — عقارات فاخرة.' : 'Yafel — premium real estate.';

  if (unitLoading) {
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

  const unit = unitData;
  const project = unit?.project;

  if (!unit) {
    return (
      <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
        <Seo
          title={language === 'ar' ? 'الوحدة غير موجودة' : 'Unit not found'}
          description={loadingDesc}
        />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-2xl font-bold text-textPrimary">
              {language === 'ar' ? 'الوحدة غير موجودة' : 'Unit not found'}
            </h1>
          </div>
        </main>
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
    inquiryTitle: { ar: 'استفسار عن الوحدة', en: 'Inquire about this unit' },
    extraSpecs: { ar: 'مواصفات إضافية', en: 'Additional specifications' },
    inquirySuccess: { ar: 'تم إرسال استفسارك بنجاح', en: 'Your inquiry was sent successfully' },
    inquiryError: { ar: 'تعذر إرسال الاستفسار', en: 'Could not send inquiry' },
    sendInquiry: { ar: 'إرسال الاستفسار', en: 'Send inquiry' },
  };

  async function handleInquirySubmit(e) {
    e.preventDefault();
    if (!unit || inquirySubmitting) return;
    setInquirySubmitting(true);
    try {
      const developerId = unit.developerId ?? project?.developerId;
      await graphqlRequest(SUBMIT_UNIT_INQUIRY, {
        unitId: String(unit.id),
        developerId: developerId != null ? String(developerId) : undefined,
        name: inquiry.name.trim(),
        email: inquiry.email.trim(),
        phone: inquiry.phone.trim() || undefined,
        message: inquiry.message.trim() || undefined,
      });
      toast.success(t(translations.inquirySuccess));
      setInquiry({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err?.message || t(translations.inquiryError));
    } finally {
      setInquirySubmitting(false);
    }
  }

  const unitTitle = t({ ar: unit.name_ar, en: unit.name_en });
  const unitDesc = t({ ar: unit.description_ar || '', en: unit.description_en || '' })
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return (
    <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Seo title={unitTitle} description={unitDesc || loadingDesc} />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-textPrimary mb-2">
                  {formatPrice(unit.price)}
                </h1>
                {project && (
                  <p className="text-lg text-textSecondary">
                    {t(translations.project)}: {t({ ar: project.name_ar, en: project.name_en })}
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={contactModal.open}
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-soft transition-colors font-semibold"
                >
                  {t(translations.contactUs)}
                </button>
                {project && (
                  <button
                    type="button"
                    onClick={whatsappModal.open}
                    className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-soft transition-colors font-semibold"
                  >
                    {t(translations.legalConsultant)}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-bgSection rounded-lg p-4 text-center">
                <div className="text-sm text-textSecondary mb-1">{t(translations.area)}</div>
                <div className="text-xl font-bold text-textPrimary">
                  {unit.area} {language === 'ar' ? 'م²' : 'm²'}
                </div>
              </div>
              <div className="bg-bgSection rounded-lg p-4 text-center">
                <div className="text-sm text-textSecondary mb-1">{t(translations.floor)}</div>
                <div className="text-xl font-bold text-textPrimary">-</div>
              </div>
              <div className="bg-bgSection rounded-lg p-4 text-center">
                <div className="text-sm text-textSecondary mb-1">{t(translations.bedrooms)}</div>
                <div className="text-xl font-bold text-textPrimary">{unit.bedrooms}</div>
              </div>
              <div className="bg-bgSection rounded-lg p-4 text-center">
                <div className="text-sm text-textSecondary mb-1">{t(translations.bathrooms)}</div>
                <div className="text-xl font-bold text-textPrimary">{unit.bathrooms}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <ImageGallery images={unit.images} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">{t(translations.description)}</h2>
            <p className="text-textSecondary leading-relaxed">
              {t({ ar: unit.description_ar, en: unit.description_en })}
            </p>
          </div>

          {Array.isArray(unit.attributeValues) && unit.attributeValues.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-textPrimary mb-4">{t(translations.extraSpecs)}</h2>
              <div className="flex flex-wrap gap-2">
                {unit.attributeValues.map((av) => {
                  const label = av.attribute?.name || av.attribute?.slug || '—';
                  return (
                    <span
                      key={av.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bgSection text-textPrimary text-sm border border-borderColor"
                    >
                      <span className="font-medium text-textSecondary">{label}:</span>
                      <span>{av.value ?? '—'}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">{t(translations.inquiryTitle)}</h2>
            <form className="space-y-4 max-w-xl" onSubmit={handleInquirySubmit}>
              <input
                type="text"
                required
                value={inquiry.name}
                onChange={(e) => setInquiry((s) => ({ ...s, name: e.target.value }))}
                placeholder={language === 'ar' ? 'الاسم' : 'Name'}
                className="w-full px-4 py-3 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold"
              />
              <input
                type="email"
                required
                value={inquiry.email}
                onChange={(e) => setInquiry((s) => ({ ...s, email: e.target.value }))}
                placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                className="w-full px-4 py-3 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold"
              />
              <input
                type="tel"
                value={inquiry.phone}
                onChange={(e) => setInquiry((s) => ({ ...s, phone: e.target.value }))}
                placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                className="w-full px-4 py-3 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold"
              />
              <textarea
                rows={4}
                value={inquiry.message}
                onChange={(e) => setInquiry((s) => ({ ...s, message: e.target.value }))}
                placeholder={language === 'ar' ? 'رسالتك' : 'Your message'}
                className="w-full px-4 py-3 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold resize-none"
              />
              <Button type="submit" disabled={inquirySubmitting} className="w-full sm:w-auto">
                {inquirySubmitting
                  ? language === 'ar'
                    ? 'جاري الإرسال...'
                    : 'Sending...'
                  : t(translations.sendInquiry)}
              </Button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">{t(translations.location)}</h2>
            <Map
              latitude={unit.latitude}
              longitude={unit.longitude}
              address={project ? t({ ar: project.address_ar, en: project.address_en }) : ''}
            />
          </div>
        </div>
      </section>

      </main>
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
