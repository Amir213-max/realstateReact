'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Seo from '@/components/Seo';
import EmptyState from '@/components/EmptyState';
import RentalUnitCard from '@/components/Cards/RentalUnitCard';
import RentSearchModal, { getRentBandRange } from '@/components/Modals/RentSearchModal';
import { useUnits, useRegions, useProjects } from '@/hooks/useGraphQL';
import ImageWithLoader from '@/components/ui/ImageWithLoader';
import { BrandPageClosing } from '@/components/ui/BrandAtmosphere';
import 'swiper/css';
import 'swiper/css/pagination';

const PAGE_SIZE = 12;

export default function RentalsPage() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  const navHandled = useRef(false);

  const [availabilityTab, setAvailabilityTab] = useState('all');
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [unitType, setUnitType] = useState('');
  const [rentBandId, setRentBandId] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState(null);
  const [sortPrice, setSortPrice] = useState('');
  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState([]);

  const { regions, loading: regionsLoading } = useRegions();
  const { projects: projectsInRegion, loading: projectsLoading } = useProjects(selectedRegionId || null, {
    first: 80,
    page: 1,
  });

  const isAvailableParam =
    availabilityTab === 'all' ? undefined : availabilityTab === 'available' ? true : false;

  const { units, loading, error, paginatorInfo } = useUnits({
    isRentable: true,
    isAvailable: isAvailableParam,
    type: unitType || undefined,
    projectId: selectedProjectId || undefined,
    first: PAGE_SIZE,
    page,
  });

  useEffect(() => {
    if (navHandled.current) return;
    if (location.state?.openRentSearch) {
      navHandled.current = true;
      setRentModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, location.pathname]);

  useEffect(() => {
    setPage(1);
  }, [availabilityTab, selectedProjectId, unitType]);

  useEffect(() => {
    if (page === 1) setAccumulated(units);
    else setAccumulated((prev) => [...prev, ...units]);
  }, [units, page]);

  useEffect(() => {
    setSelectedProjectId('');
  }, [selectedRegionId]);

  const lastPage = paginatorInfo?.lastPage ?? 1;
  const canLoadMore = page < lastPage;

  const carouselUrls = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const u of accumulated) {
      const src = u.images?.[0];
      if (src && !seen.has(src)) {
        seen.add(src);
        out.push(src);
      }
      if (out.length >= 12) break;
    }
    return out;
  }, [accumulated]);

  const filteredUnits = useMemo(() => {
    let list = [...accumulated];
    if (selectedRegionId && !selectedProjectId) {
      list = list.filter((u) => String(u.project?.region?.id) === String(selectedRegionId));
    }
    const { min, max } = getRentBandRange(rentBandId);
    if (min != null || max != null) {
      list = list.filter((u) => {
        const p = u.price;
        if (p == null) return false;
        if (min != null && p < min) return false;
        if (max != null && p > max) return false;
        return true;
      });
    }
    if (bedroomsFilter != null && !Number.isNaN(bedroomsFilter)) {
      list = list.filter((u) => u.bedrooms != null && Number(u.bedrooms) >= bedroomsFilter);
    }
    if (sortPrice === 'asc') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortPrice === 'desc') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }
    return list;
  }, [accumulated, selectedRegionId, selectedProjectId, rentBandId, bedroomsFilter, sortPrice]);

  const handleModalApply = ({ regionId, projectId, rentBandId: band, bedrooms }) => {
    setSelectedRegionId(regionId ? String(regionId) : '');
    setSelectedProjectId(projectId ? String(projectId) : '');
    setRentBandId(band || '');
    setBedroomsFilter(bedrooms != null && !Number.isNaN(bedrooms) ? bedrooms : null);
    setPage(1);
  };

  const translations = {
    brandLine: { ar: 'يافل كيز', en: 'YAFEL KEYS' },
    heroTitle: { ar: 'استكشف الإيجارات الراقية', en: 'Explore upscale rentals' },
    pageTitle: { ar: 'وحدات للإيجار', en: 'Rental units' },
    subtitle: { ar: 'وحدات إيجار مختارة لتناسب احتياجك', en: 'Rental units tailored to your needs' },
    tabAll: { ar: 'الكل', en: 'All' },
    tabAvail: { ar: 'متاح', en: 'Available' },
    tabRented: { ar: 'مستأجرة', en: 'Rented' },
    region: { ar: 'المنطقة', en: 'Region' },
    compound: { ar: 'كمبوندات', en: 'Compounds' },
    unitType: { ar: 'نوع الوحدة', en: 'Unit type' },
    allRegions: { ar: 'كل المناطق', en: 'All regions' },
    allCompounds: { ar: 'كل الكمبوندات', en: 'All compounds' },
    allTypes: { ar: 'كل الأنواع', en: 'All types' },
    filter: { ar: 'تصفية', en: 'Filter' },
    sort: { ar: 'ترتيب', en: 'Sort' },
    sortNone: { ar: 'بدون', en: 'None' },
    sortAsc: { ar: 'السعر: الأقل', en: 'Price: low to high' },
    sortDesc: { ar: 'السعر: الأعلى', en: 'Price: high to low' },
    loadMore: { ar: 'تحميل المزيد', en: 'Load more' },
    loadingMore: { ar: 'جاري التحميل...', en: 'Loading...' },
    fab: { ar: 'ملء النموذج', en: 'Fill the form' },
    results: { ar: 'نتيجة', en: 'results' },
    emptyTitle: { ar: 'لا توجد وحدات مطابقة', en: 'No matching units' },
    emptyDesc: {
      ar: 'جرّب تغيير الفلاتر أو البحث من جديد.',
      en: 'Try changing filters or search again.',
    },
    homeCta: { ar: 'الرئيسية', en: 'Home' },
    closingTitle: { ar: 'تحتاج مساعدة في اختيار إيجارك؟', en: 'Need help choosing a rental?' },
    closingDesc: {
      ar: 'تواصل معنا لترشيح وحدات تناسب ميزانيتك وجدولك.',
      en: 'We can shortlist units that fit your budget and timeline.',
    },
    closingCta: { ar: 'تواصل معنا', en: 'Contact us' },
  };

  if (loading && page === 1 && accumulated.length === 0) {
    return (
      <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
        <Seo title={t(translations.pageTitle)} description={t(translations.subtitle)} />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4" />
              <p className="text-textSecondary">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <Seo title={t(translations.pageTitle)} description={t(translations.subtitle)} />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
      <section className="pt-8 pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <p className="text-center text-sky-500 font-semibold tracking-wide text-sm mb-2">
          {t(translations.brandLine)}
        </p>
        <h1 className="text-center text-2xl md:text-4xl font-bold text-textPrimary mb-8">
          {t(translations.heroTitle)}
        </h1>

        <div className="relative rounded-3xl overflow-hidden mb-4">
          {carouselUrls.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1.15}
              centeredSlides
              dir={isRTL ? 'rtl' : 'ltr'}
              breakpoints={{
                640: { slidesPerView: 1.25, spaceBetween: 20 },
                1024: { slidesPerView: 1.35, spaceBetween: 24 },
              }}
              className="rentals-hero-swiper !pb-10"
            >
              {carouselUrls.map((src, i) => (
                <SwiperSlide key={`${src}-${i}`}>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
                    <ImageWithLoader src={src} alt="" fill className="object-cover" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-bgSection to-borderColor" />
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-textPrimary">{t(translations.pageTitle)}</h2>
            <p className="text-textSecondary mt-1">{t(translations.subtitle)}</p>
          </div>
        </div>

        <div className="flex border-b border-borderColor mb-6 gap-6">
          {[
            { id: 'all', label: translations.tabAll },
            { id: 'available', label: translations.tabAvail },
            { id: 'rented', label: translations.tabRented },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAvailabilityTab(tab.id)}
              className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                availabilityTab === tab.id
                  ? 'border-primary text-textPrimary'
                  : 'border-transparent text-textSecondary hover:text-textPrimary'
              }`}
            >
              {t(tab.label)}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-3 flex-1">
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              disabled={regionsLoading}
              className="px-4 py-2.5 border border-borderColor-strong rounded-xl text-sm text-textPrimary bg-white min-w-[140px]"
            >
              <option value="">{t(translations.allRegions)}</option>
              {regions.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {t({ ar: r.name_ar, en: r.name_en })}
                </option>
              ))}
            </select>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={projectsLoading || !selectedRegionId}
              className="px-4 py-2.5 border border-borderColor-strong rounded-xl text-sm text-textPrimary bg-white min-w-[160px]"
            >
              <option value="">{t(translations.allCompounds)}</option>
              {projectsInRegion.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {t({ ar: p.name_ar, en: p.name_en })}
                </option>
              ))}
            </select>
            <select
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              className="px-4 py-2.5 border border-borderColor-strong rounded-xl text-sm text-textPrimary bg-white min-w-[140px]"
            >
              <option value="">{t(translations.allTypes)}</option>
              <option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
              <option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
              <option value="penthouse">{language === 'ar' ? 'بنتهاوس' : 'Penthouse'}</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-textSecondary inline-flex items-center gap-1">
              <FilterIcon />
              {t(translations.filter)}
            </span>
            <select
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="px-4 py-2.5 border border-borderColor-strong rounded-xl text-sm text-textPrimary bg-white"
            >
              <option value="">{t(translations.sortNone)}</option>
              <option value="asc">{t(translations.sortAsc)}</option>
              <option value="desc">{t(translations.sortDesc)}</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="text-red-600 mb-4 text-center" role="alert">
            {error}
          </p>
        )}

        <p className="text-sm text-textSecondary mb-4">
          {filteredUnits.length} {t(translations.results)}
        </p>

        {filteredUnits.length === 0 && !loading ? (
          <EmptyState
            title={t(translations.emptyTitle)}
            description={t(translations.emptyDesc)}
            actionLabel={t(translations.homeCta)}
            actionTo="/"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <RentalUnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}

        {canLoadMore && filteredUnits.length > 0 && (
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
      </section>

      <BrandPageClosing>
        <h2 className="text-xl font-bold text-textPrimary sm:text-2xl">{t(translations.closingTitle)}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-textSecondary sm:text-base">{t(translations.closingDesc)}</p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-gold hover:text-primary"
        >
          {t(translations.closingCta)}
        </Link>
      </BrandPageClosing>

      </main>
      <Footer />

      <button
        type="button"
        onClick={() => setRentModalOpen(true)}
        className={`fixed bottom-24 z-40 flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-sky-600 ${
          isRTL ? 'left-4 md:left-8' : 'right-4 md:right-8'
        }`}
      >
        <FormIcon />
        {t(translations.fab)}
      </button>

      <RentSearchModal
        isOpen={rentModalOpen}
        onClose={() => setRentModalOpen(false)}
        onApply={handleModalApply}
        carouselImages={carouselUrls}
      />
    </div>
  );
}

function FilterIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    </svg>
  );
}

function FormIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  );
}
