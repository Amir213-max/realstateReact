'use client';

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/Badge';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import { useUnit } from '@/hooks/useGraphQL';
import { formatPrice } from '@/lib/utils';
import { graphqlRequest } from '@/lib/graphql';
import { SUBMIT_UNIT_INQUIRY } from '@/lib/queries';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { unit, loading } = useUnit(id);
  const isRTL = language === 'ar';
  const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);

  if (loading) {
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

  if (!unit) {
    return (
      <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-textPrimary">
            {language === 'ar' ? 'العقار غير موجود' : 'Property not found'}
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  const property = {
    id: unit.id,
    name: t({ ar: unit.name_ar, en: unit.name_en }),
    description: t({ ar: unit.description_ar, en: unit.description_en }),
    price: formatPrice(unit.price),
    location: unit.project ? t({ ar: unit.project.address_ar, en: unit.project.address_en }) : '',
    images: unit.images || [],
    features: [
      unit.bedrooms ? { ar: `${unit.bedrooms} غرف نوم`, en: `${unit.bedrooms} Bedrooms` } : null,
      unit.bathrooms ? { ar: `${unit.bathrooms} حمامات`, en: `${unit.bathrooms} Bathrooms` } : null,
      unit.area ? { ar: `مساحة ${unit.area} م²`, en: `Area ${unit.area} m²` } : null,
      { ar: 'صالة واسعة', en: 'Large Living Room' },
      { ar: 'مطبخ مجهز', en: 'Fully Equipped Kitchen' },
      { ar: 'موقف سيارات', en: 'Parking Space' },
    ].filter(Boolean),
  };

  const translations = {
    contactAgent: { ar: 'اتصل بالوكيل', en: 'Contact Agent' },
    scheduleViewing: { ar: 'حجز معاينة', en: 'Schedule Viewing' },
    features: { ar: 'المميزات', en: 'Features' },
    location: { ar: 'الموقع', en: 'Location' },
    extraSpecs: { ar: 'مواصفات إضافية', en: 'Additional specifications' },
    views: { ar: 'مشاهدات', en: 'Views' },
    inquirySuccess: { ar: 'تم إرسال استفسارك بنجاح', en: 'Your inquiry was sent successfully' },
    inquiryError: { ar: 'تعذر إرسال الاستفسار', en: 'Could not send inquiry' },
  };

  async function handleInquirySubmit(e) {
    e.preventDefault();
    if (!unit || inquirySubmitting) return;
    setInquirySubmitting(true);
    try {
      const developerId = unit.developerId ?? unit.project?.developerId;
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

  return (
    <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      <section className="relative bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PropertyImageGallery images={property.images} propertyName={property.name} />
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-8 animate-fadeInUp">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-borderColor">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary mb-3">
                      {property.name}
                    </h1>
                    <p className="text-base sm:text-lg text-textSecondary flex items-center gap-2">
                      <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-stretch sm:items-end gap-2 self-start">
                    <Badge variant="secondary" className="text-lg px-5 py-2.5">
                      {property.price}
                    </Badge>
                    {unit.viewsCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-textSecondary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {unit.viewsCount} {t(translations.views)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="prose max-w-none mb-8">
                  <p className="text-textSecondary leading-relaxed text-base sm:text-lg">
                    {property.description}
                  </p>
                </div>

                <div className="border-t border-borderColor pt-6 md:pt-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-textPrimary mb-4 sm:mb-6">
                    {t(translations.features)}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {property.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 sm:p-4 bg-bgSection rounded-lg hover:bg-gold/10 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-textPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-textPrimary font-medium text-sm sm:text-base">
                          {t(feature)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {Array.isArray(unit.attributeValues) && unit.attributeValues.length > 0 && (
                  <div className="border-t border-borderColor pt-6 md:pt-8 mt-6 md:mt-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-textPrimary mb-4 sm:mb-6">
                      {t(translations.extraSpecs)}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {unit.attributeValues.map((av) => {
                        const label = av.attribute?.name || av.attribute?.slug || '—';
                        return (
                          <span
                            key={av.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-textPrimary text-sm border border-borderColor-strong/60"
                          >
                            <span className="font-medium text-textSecondary">{label}:</span>
                            <span>{av.value ?? '—'}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 sticky top-24 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl sm:text-2xl font-bold text-textPrimary mb-6">
                  {t(translations.contactAgent)}
                </h3>
                <form className="space-y-4" onSubmit={handleInquirySubmit}>
                  <div>
                    <input
                      type="text"
                      required
                      value={inquiry.name}
                      onChange={(e) => setInquiry((s) => ({ ...s, name: e.target.value }))}
                      placeholder={language === 'ar' ? 'الاسم' : 'Name'}
                      className="w-full px-4 py-3 border border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary transition-all duration-200"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={inquiry.email}
                      onChange={(e) => setInquiry((s) => ({ ...s, email: e.target.value }))}
                      placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      className="w-full px-4 py-3 border border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary transition-all duration-200"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={inquiry.phone}
                      onChange={(e) => setInquiry((s) => ({ ...s, phone: e.target.value }))}
                      placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                      className="w-full px-4 py-3 border border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary transition-all duration-200"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={4}
                      value={inquiry.message}
                      onChange={(e) => setInquiry((s) => ({ ...s, message: e.target.value }))}
                      placeholder={language === 'ar' ? 'رسالتك' : 'Your Message'}
                      className="w-full px-4 py-3 border border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary resize-none transition-all duration-200"
                    />
                  </div>
                  <Button className="w-full" size="lg" type="submit" disabled={inquirySubmitting}>
                    {inquirySubmitting
                      ? language === 'ar'
                        ? 'جاري الإرسال...'
                        : 'Sending...'
                      : t(translations.scheduleViewing)}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
