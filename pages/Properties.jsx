import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyCard from '../components/Cards/PropertyCard';
import Button from '../components/ui/Button';

export default function Properties() {
  const { language, t } = useLanguage();
  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    location: '',
  });
  const isRTL = language === 'ar';

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
  ];

  const translations = {
    title: { ar: 'جميع العقارات', en: 'All Properties' },
    subtitle: { ar: 'اكتشف مجموعة واسعة من العقارات الفاخرة', en: 'Discover a wide range of luxury properties' },
    filters: { ar: 'الفلاتر', en: 'Filters' },
    results: { ar: 'نتائج البحث', en: 'Search Results' },
  };

  return (
    <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

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

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </section>

      <Footer />
    </div>
  );
}
