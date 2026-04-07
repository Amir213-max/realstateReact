'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/Cards/PropertyCard';
import Button from '@/components/ui/Button';
import { useUnits } from '@/hooks/useGraphQL';
import { formatPrice } from '@/lib/utils';

const PAGE_SIZE = 12;

export default function PropertiesPage() {
  const { language, t } = useLanguage();
  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    location: '',
    isAvailable: true,
  });
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState([]);

  const { units, loading, error, paginatorInfo } = useUnits({
    isAvailable: filters.isAvailable,
    type: filters.type || undefined,
    first: PAGE_SIZE,
    page,
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    setPage(1);
  }, [filters.type, filters.isAvailable]);

  useEffect(() => {
    if (page === 1) setAccumulated(units);
    else setAccumulated((prev) => [...prev, ...units]);
  }, [units, page]);

  const properties = accumulated.map((unit) => ({
    id: unit.id,
    name: t({ ar: unit.name_ar, en: unit.name_en }),
    description: t({ ar: unit.description_ar, en: unit.description_en }),
    price: formatPrice(unit.price),
    location: unit.project ? t({ ar: unit.project.address_ar, en: unit.project.address_en }) : '',
    image: unit.images?.[0] || '',
    featured: !!unit.isFeatured,
    viewsCount: unit.viewsCount ?? 0,
  }));

  const lastPage = paginatorInfo?.lastPage ?? 1;
  const canLoadMore = page < lastPage;

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
    loadMore: { ar: 'تحميل المزيد', en: 'Load more' },
    loadingMore: { ar: 'جاري التحميل...', en: 'Loading...' },
  };

  if (loading && page === 1) {
    return (
      <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4" />
            <p className="text-textSecondary">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <section className="bg-gradient-to-br from-primary to-primary-soft text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t(translations.title)}</h1>
          <p className="text-xl text-white/70">{t(translations.subtitle)}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <p className="text-red-600 mb-4 text-center" role="alert">
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold text-textPrimary mb-6">{t(translations.filters)}</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-textPrimary mb-2">
                      {t(translations.propertyType)}
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-4 py-2 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary"
                    >
                      <option value="">{t(translations.allTypes)}</option>
                      <option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                      <option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                      <option value="penthouse">{language === 'ar' ? 'بنتهاوس' : 'Penthouse'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-textPrimary mb-2">
                      {t(translations.priceRange)}
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                      className="w-full px-4 py-2 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary"
                    >
                      <option value="">{t(translations.allPrices)}</option>
                      <option value="0-1m">{language === 'ar' ? 'حتى 1 مليون' : 'Up to 1M'}</option>
                      <option value="1-2m">{language === 'ar' ? '1-2 مليون' : '1M - 2M'}</option>
                      <option value="2-3m">{language === 'ar' ? '2-3 مليون' : '2M - 3M'}</option>
                      <option value="3m+">{language === 'ar' ? 'أكثر من 3 مليون' : '3M+'}</option>
                    </select>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => setFilters({ type: '', priceRange: '', location: '', isAvailable: true })}
                  >
                    {language === 'ar' ? 'إعادة تعيين' : 'Reset Filters'}
                  </Button>
                </div>
              </div>
            </aside>
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-textPrimary">
                  {t(translations.results)} ({paginatorInfo?.total ?? properties.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              {canLoadMore && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="outline"
                    type="button"
                    disabled={loading && page > 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {loading && page > 1 ? t(translations.loadingMore) : t(translations.loadMore)}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
