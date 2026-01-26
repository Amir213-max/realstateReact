'use client';

import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/Badge';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import { useUnit } from '@/hooks/useGraphQL';
import { formatPrice } from '@/lib/utils';

export default function PropertyDetailsPage() {
  const params = useParams();
  const { language, t } = useLanguage();
  const { unit, loading } = useUnit(params.id);
  const isRTL = language === 'ar';

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f0cb8e] mx-auto mb-4"></div>
            <p className="text-[#6D6D6D]">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!unit) {
    return (
      <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'العقار غير موجود' : 'Property not found'}
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  // Transform unit to property format
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
    propertyDetails: { ar: 'تفاصيل العقار', en: 'Property Details' },
    features: { ar: 'المميزات', en: 'Features' },
    location: { ar: 'الموقع', en: 'Location' },
    price: { ar: 'السعر', en: 'Price' },
  };

  return (
    <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Property Images Gallery */}
      <section className="relative bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PropertyImageGallery images={property.images} propertyName={property.name} />
        </div>
      </section>

      {/* Property Information */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-8 animate-fadeInUp">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-[#efefef]">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1e1e1e] mb-3">
                      {property.name}
                    </h1>
                    <p className="text-base sm:text-lg text-[#6D6D6D] flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#f0cb8e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.location}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-5 py-2.5 self-start">
                    {property.price}
                  </Badge>
                </div>

                <div className="prose max-w-none mb-8">
                  <p className="text-[#6D6D6D] leading-relaxed text-base sm:text-lg">
                    {property.description}
                  </p>
                </div>

                <div className="border-t border-[#efefef] pt-6 md:pt-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1e1e1e] mb-4 sm:mb-6">
                    {t(translations.features)}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {property.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 sm:p-4 bg-[#efefef] rounded-lg hover:bg-[#f0cb8e]/10 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-[#f0cb8e] rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#1e1e1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-[#1e1e1e] font-medium text-sm sm:text-base">
                          {t(feature)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Contact Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 sticky top-24 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1e1e1e] mb-6">
                  {t(translations.contactAgent)}
                </h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'الاسم' : 'Name'}
                      className="w-full px-4 py-3 border border-[#cfcfcf] rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      className="w-full px-4 py-3 border border-[#cfcfcf] rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                      className="w-full px-4 py-3 border border-[#cfcfcf] rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <textarea
                      rows="4"
                      placeholder={language === 'ar' ? 'رسالتك' : 'Your Message'}
                      className="w-full px-4 py-3 border border-[#cfcfcf] rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] resize-none transition-all duration-200"
                    ></textarea>
                  </div>
                  <Button className="w-full" size="lg">
                    {t(translations.scheduleViewing)}
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

