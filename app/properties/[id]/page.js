'use client';

import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/Badge';
import PropertyImageGallery from '@/components/PropertyImageGallery';

export default function PropertyDetailsPage() {
  const params = useParams();
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  // Sample property data - replace with actual data fetching
  const property = {
    id: params.id,
    name: language === 'ar' ? 'فيلا فاخرة في الرياض' : 'Luxury Villa in Riyadh',
    description: language === 'ar'
      ? 'فيلا حديثة بتصميم عصري وحدائق واسعة. تتكون من 4 غرف نوم، 3 حمامات، صالة واسعة، مطبخ مجهز بالكامل، وحديقة خاصة. الموقع ممتاز في حي راقي مع إطلالة جميلة.'
      : 'Modern villa with contemporary design and spacious gardens. Features 4 bedrooms, 3 bathrooms, large living room, fully equipped kitchen, and private garden. Excellent location in an upscale neighborhood with beautiful views.',
    price: 'SAR 2,500,000',
    location: 'Riyadh, Al Olaya',
    images: [
      'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2256037689_mc4cxv',
      'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2209394407_uuurxb',
      '/assets/brand/images/shutterstock_2558087881.jpg',
      'https://png.pngtree.com/thumb_back/fw800/background/20240601/pngtree-real-estate-luxury-building-sale-property-background-images-image_15851318.jpg',
    ],
    features: [
      { ar: '4 غرف نوم', en: '4 Bedrooms' },
      { ar: '3 حمامات', en: '3 Bathrooms' },
      { ar: 'صالة واسعة', en: 'Large Living Room' },
      { ar: 'مطبخ مجهز', en: 'Fully Equipped Kitchen' },
      { ar: 'حديقة خاصة', en: 'Private Garden' },
      { ar: 'موقف سيارات', en: 'Parking Space' },
    ],
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

