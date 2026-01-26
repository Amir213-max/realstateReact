'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/Cards/PropertyCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/Badge';

export default function PropertiesPage() {
  const { language, t } = useLanguage();
  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    location: '',
  });

  const isRTL = language === 'ar';

  // Sample properties data - replace with actual data
  const properties = [
    {
      id: 1,
      name: language === 'ar' ? 'فيلا فاخرة في الرياض' : 'Luxury Villa in Riyadh',
      description: language === 'ar' 
        ? 'فيلا حديثة بتصميم عصري وحدائق واسعة' 
        : 'Modern villa with contemporary design and spacious gardens',
      price: 'SAR 2,500,000',
      location: 'Riyadh, Al Olaya',
      image: 'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2256037689_mc4cxv',
      featured: true,
    },
    {
      id: 2,
      name: language === 'ar' ? 'شقة في جدة' : 'Apartment in Jeddah',
      description: language === 'ar'
        ? 'شقة أنيقة مع إطلالة على البحر'
        : 'Elegant apartment with sea view',
      price: 'SAR 1,200,000',
      location: 'Jeddah, Corniche',
      image: 'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2209394407_uuurxb',
      featured: false,
    },
    {
      id: 3,
      name: language === 'ar' ? 'منزل عائلي في الدمام' : 'Family Home in Dammam',
      description: language === 'ar'
        ? 'منزل واسع مناسب للعائلات الكبيرة'
        : 'Spacious home perfect for large families',
      price: 'SAR 1,800,000',
      location: 'Dammam, Al Faisaliyah',
      image: '/assets/brand/images/shutterstock_2558087881.jpg',
      featured: true,
    },
    {
      id: 4,
      name: language === 'ar' ? 'بنتهاوس في الرياض' : 'Penthouse in Riyadh',
      description: language === 'ar'
        ? 'بنتهاوس فاخر مع إطلالة بانورامية'
        : 'Luxury penthouse with panoramic views',
      price: 'SAR 3,500,000',
      location: 'Riyadh, Al Nakheel',
      image: 'https://png.pngtree.com/thumb_back/fw800/background/20240601/pngtree-real-estate-luxury-building-sale-property-background-images-image_15851318.jpg',
      featured: false,
    },
    {
      id: 5,
      name: language === 'ar' ? 'شقة استوديو في جدة' : 'Studio Apartment in Jeddah',
      description: language === 'ar'
        ? 'شقة حديثة ومناسبة للشباب'
        : 'Modern apartment perfect for young professionals',
      price: 'SAR 450,000',
      location: 'Jeddah, Al Zahra',
      image: 'https://th.bing.com/th/id/OIP.Jy16vSGLOrlRWJ-2BrVMrgHaFj?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
      featured: false,
    },
    {
      id: 6,
      name: language === 'ar' ? 'فيلا على الشاطئ' : 'Beachfront Villa',
      description: language === 'ar'
        ? 'فيلا فاخرة مباشرة على الشاطئ'
        : 'Luxury villa directly on the beach',
      price: 'SAR 4,200,000',
      location: 'Jeddah, Corniche',
      image: 'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2124196751_rvwrt0',
      featured: true,
    },
  ];

  const translations = {
    title: { ar: 'جميع العقارات', en: 'All Properties' },
    subtitle: { ar: 'اكتشف مجموعة واسعة من العقارات الفاخرة', en: 'Discover a wide range of luxury properties' },
    filters: { ar: 'الفلاتر', en: 'Filters' },
    propertyType: { ar: 'نوع العقار', en: 'Property Type' },
    priceRange: { ar: 'نطاق السعر', en: 'Price Range' },
    location: { ar: 'الموقع', en: 'Location' },
    allTypes: { ar: 'جميع الأنواع', en: 'All Types' },
    allPrices: { ar: 'جميع الأسعار', en: 'All Prices' },
    allLocations: { ar: 'جميع المواقع', en: 'All Locations' },
    results: { ar: 'نتائج البحث', en: 'Search Results' },
    propertiesFound: { ar: 'عقار موجود', en: 'property found' },
  };

  return (
    <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#1e1e1e] to-[#353535] text-[#efefef] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t(translations.title)}
          </h1>
          <p className="text-xl text-[#cfcfcf]">
            {t(translations.subtitle)}
          </p>
        </div>
      </section>

      {/* Filters and Properties */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold text-[#1e1e1e] mb-6">
                  {t(translations.filters)}
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1e1e1e] mb-2">
                      {t(translations.propertyType)}
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-4 py-2 border border-[#cfcfcf] rounded-lg focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e]"
                    >
                      <option value="">{t(translations.allTypes)}</option>
                      <option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                      <option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                      <option value="penthouse">{language === 'ar' ? 'بنتهاوس' : 'Penthouse'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1e1e1e] mb-2">
                      {t(translations.priceRange)}
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                      className="w-full px-4 py-2 border border-[#cfcfcf] rounded-lg focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e]"
                    >
                      <option value="">{t(translations.allPrices)}</option>
                      <option value="0-1m">{language === 'ar' ? 'حتى 1 مليون' : 'Up to 1M'}</option>
                      <option value="1-2m">{language === 'ar' ? '1-2 مليون' : '1M - 2M'}</option>
                      <option value="2-3m">{language === 'ar' ? '2-3 مليون' : '2M - 3M'}</option>
                      <option value="3m+">{language === 'ar' ? 'أكثر من 3 مليون' : '3M+'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1e1e1e] mb-2">
                      {t(translations.location)}
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full px-4 py-2 border border-[#cfcfcf] rounded-lg focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e]"
                    >
                      <option value="">{t(translations.allLocations)}</option>
                      <option value="riyadh">{language === 'ar' ? 'الرياض' : 'Riyadh'}</option>
                      <option value="jeddah">{language === 'ar' ? 'جدة' : 'Jeddah'}</option>
                      <option value="dammam">{language === 'ar' ? 'الدمام' : 'Dammam'}</option>
                    </select>
                  </div>

                  <Button variant="outline" className="w-full">
                    {language === 'ar' ? 'إعادة تعيين' : 'Reset Filters'}
                  </Button>
                </div>
              </div>
            </aside>

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1e1e1e]">
                  {t(translations.results)} ({properties.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

