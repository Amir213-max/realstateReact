'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';
import VerifyConsultantModal from '@/components/Modals/VerifyConsultantModal';
import { useModal } from '@/hooks/useModal';
import { useRegions, useProjects, useDevelopers, useCountries } from '@/hooks/useGraphQL';

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const pathname = location.pathname;
  const isRTL = language === 'ar';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [regionsCountryId, setRegionsCountryId] = useState('');
  const verifyConsultantModal = useModal();

  const { countries: navbarCountries = [] } = useCountries();
  const { regions: regionsData = [] } = useRegions(regionsCountryId || null);
  const { projects: projectsData = [] } = useProjects();
  const { developers: developersData = [] } = useDevelopers();

  const translations = {
    home: { ar: 'الرئيسية', en: 'Home' },
    regions: { ar: 'مناطق', en: 'Regions' },
    compounds: { ar: 'كمبوندات', en: 'Compounds' },
    developers: { ar: 'مطورين', en: 'Developers' },
    mostSearched: { ar: 'الأكثر بحثا', en: 'Most Searched' },
    properties: { ar: 'العقارات', en: 'Properties' },
    sell: { ar: 'بيع', en: 'Sell' },
    verifyConsultant: { ar: 'تحقق من مستشار', en: 'Verify Consultant' },
    about: { ar: 'من نحن', en: 'About Us' },
    contact: { ar: 'اتصل بنا', en: 'Contact' },
    allCountries: { ar: 'كل الدول', en: 'All countries' },
    filterByCountry: { ar: 'تصفية حسب الدولة', en: 'Filter by country' },
    mobileMenu: { ar: 'القائمة', en: 'Menu' },
    closeMenu: { ar: 'إغلاق', en: 'Close' },
  };

  const mostSearchedItems = (projectsData || [])
    .sort((a, b) => (b.unitsCount || 0) - (a.unitsCount || 0))
    .slice(0, 10);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) setMobileExpanded(null);
  }, [isMenuOpen]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) setIsMenuOpen(false);
      if (openDropdown && !event.target.closest('.dropdown-container')) setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, openDropdown]);

  useEffect(() => {
    if (!isMenuOpen || typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen || typeof document === 'undefined') return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const skipLabel = language === 'ar' ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content';

  return (
    <nav
      className={`bg-white text-textPrimary shadow-sm sticky top-0 z-50 border-b border-borderColor backdrop-blur-sm ${isRTL ? 'rtl' : 'ltr'}`}
      aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
    >
      <a
        href="#main-content"
        className="fixed start-2 top-2 z-[100] -translate-y-24 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-primary shadow-md transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {skipLabel}
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo variant="horizontal" className="h-8 sm:h-10" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-1 rtl:gap-reverse">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                pathname === '/'
                  ? 'text-primary bg-bgSection font-semibold ring-1 ring-borderColor/80'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSection'
              }`}
            >
              {t(translations.home)}
            </Link>

            {/* Regions */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'regions' ? null : 'regions')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-textSecondary hover:text-textPrimary hover:bg-bgSection flex items-center gap-1"
              >
                {t(translations.regions)}
                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'regions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'regions' && (
                <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-borderColor w-64 max-h-96 overflow-y-auto z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
                  <div className="p-4">
                    <h3 className="font-bold text-textPrimary mb-3 text-sm">{t(translations.regions)}</h3>
                    <label className="block text-xs text-textSecondary mb-1.5">{t(translations.filterByCountry)}</label>
                    <select
                      value={regionsCountryId}
                      onChange={(e) => setRegionsCountryId(e.target.value)}
                      className="w-full mb-3 px-2 py-2 text-sm border border-borderColor rounded-lg bg-white text-textPrimary"
                    >
                      <option value="">{t(translations.allCountries)}</option>
                      {navbarCountries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {t({ ar: c.name_ar, en: c.name_en })}
                        </option>
                      ))}
                    </select>
                    <div className="space-y-1">
                      {(regionsData || []).slice(0, 10).map((region) => (
                        <Link
                          key={region.id}
                          to={`/destinations/${region.id}`}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-3 py-2 text-sm text-textPrimary hover:bg-bgSection hover:text-textPrimary rounded-lg transition-colors"
                        >
                          {region ? t({ ar: region.name_ar || region.name, en: region.name_en || region.name }) : ''}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Developers */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'developers' ? null : 'developers')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-textSecondary hover:text-textPrimary hover:bg-bgSection flex items-center gap-1"
              >
                {t(translations.developers)}
                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'developers' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'developers' && (
                <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-borderColor w-64 max-h-96 overflow-y-auto z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
                  <div className="p-4">
                    <h3 className="font-bold text-textPrimary mb-3 text-sm">{t(translations.developers)}</h3>
                    <div className="space-y-1">
                      {(developersData || []).slice(0, 10).map((developer) => (
                        <Link
                          key={developer.id}
                          to={`/developers/${developer.id}`}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-3 py-2 text-sm text-textPrimary hover:bg-bgSection hover:text-textPrimary rounded-lg transition-colors"
                        >
                          {developer ? t({ ar: developer.name_ar || developer.name, en: developer.name_en || developer.name }) : ''}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compounds */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'compounds' ? null : 'compounds')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-textSecondary hover:text-textPrimary hover:bg-bgSection flex items-center gap-1"
              >
                {t(translations.compounds)}
                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'compounds' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'compounds' && (
                <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-borderColor w-64 max-h-96 overflow-y-auto z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
                  <div className="p-4">
                    <h3 className="font-bold text-textPrimary mb-3 text-sm">{t(translations.compounds)}</h3>
                    <div className="space-y-1">
                      {(projectsData || []).slice(0, 10).map((project) => (
                        <Link
                          key={project.id}
                          to={`/projects/${project.id}`}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-3 py-2 text-sm text-textPrimary hover:bg-bgSection hover:text-textPrimary rounded-lg transition-colors"
                        >
                          {project ? t({ ar: project.name_ar || project.name, en: project.name_en || project.name }) : ''}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={verifyConsultantModal.open}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-textSecondary hover:text-textPrimary hover:bg-bgSection relative"
            >
              {t(translations.verifyConsultant)}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {language === 'ar' ? 'جديد' : 'New'}
              </span>
            </button>

            <Link
              to="/sell"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                pathname === '/sell'
                  ? 'text-primary bg-bgSection font-semibold ring-1 ring-borderColor/80'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSection'
              }`}
            >
              {t(translations.sell)}
            </Link>

            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                pathname === '/contact'
                  ? 'text-primary bg-bgSection font-semibold ring-1 ring-borderColor/80'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-bgSection'
              }`}
            >
              {t(translations.contact)}
            </Link>
          </div>

          <div className="flex items-center gap-3 rtl:gap-reverse">
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 text-sm font-medium text-textPrimary border border-borderColor-strong hover:bg-bgSection transition-all duration-300 rounded-lg"
            >
              {language === 'ar' ? 'EN' : 'AR'}
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-container lg:hidden rounded-lg p-2 text-textPrimary transition-all duration-300 hover:bg-bgSection"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <VerifyConsultantModal 
        isOpen={verifyConsultantModal.isOpen} 
        onClose={verifyConsultantModal.close} 
      />

      {typeof document !== 'undefined' &&
        isMenuOpen &&
        createPortal(
          <div className={`fixed inset-0 z-[200] lg:hidden ${isRTL ? 'rtl' : 'ltr'}`}>
            <button
              type="button"
              className="absolute inset-0 z-0 animate-mobile-nav-backdrop bg-black/50 backdrop-blur-md motion-reduce:animate-none motion-reduce:opacity-100"
              aria-label={t(translations.closeMenu)}
              onClick={() => setIsMenuOpen(false)}
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-label={t(translations.mobileMenu)}
              className={`mobile-menu-container absolute inset-y-0 z-10 flex w-[min(100%,20rem)] flex-col bg-white shadow-2xl will-change-transform ${
                isRTL
                  ? 'start-0 border-e border-borderColor animate-mobile-nav-drawer-start motion-reduce:animate-none motion-reduce:translate-x-0 motion-reduce:opacity-100'
                  : 'end-0 border-s border-borderColor animate-mobile-nav-drawer-end motion-reduce:animate-none motion-reduce:translate-x-0 motion-reduce:opacity-100'
              }`}
            >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-borderColor px-4">
                  <span className="text-sm font-semibold text-textPrimary">{t(translations.mobileMenu)}</span>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg p-2 text-textSecondary hover:bg-bgSection hover:text-textPrimary"
                    aria-label={t(translations.closeMenu)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      pathname === '/' ? 'bg-bgSection text-primary ring-1 ring-borderColor' : 'text-textPrimary hover:bg-bgSection'
                    }`}
                  >
                    {t(translations.home)}
                  </Link>
                  <div className="overflow-hidden rounded-xl border border-borderColor">
                    <button
                      type="button"
                      aria-expanded={mobileExpanded === 'regions'}
                      onClick={() => setMobileExpanded((prev) => (prev === 'regions' ? null : 'regions'))}
                      className="flex w-full items-center justify-between gap-2 px-4 py-3 text-start text-sm font-medium text-textPrimary transition-colors hover:bg-bgSection"
                    >
                      <span>{t(translations.regions)}</span>
                      <svg
                        className={`h-4 w-4 shrink-0 transition-transform ${mobileExpanded === 'regions' ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileExpanded === 'regions' && (
                      <div className="space-y-3 border-t border-borderColor bg-bgSection/60 px-3 py-3">
                        <div>
                          <label className="mb-1.5 block text-xs text-textSecondary">{t(translations.filterByCountry)}</label>
                          <select
                            value={regionsCountryId}
                            onChange={(e) => setRegionsCountryId(e.target.value)}
                            className="w-full rounded-lg border border-borderColor bg-white px-2 py-2 text-sm text-textPrimary"
                          >
                            <option value="">{t(translations.allCountries)}</option>
                            {navbarCountries.map((c) => (
                              <option key={c.id} value={c.id}>
                                {t({ ar: c.name_ar, en: c.name_en })}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="max-h-60 space-y-0.5 overflow-y-auto">
                          {(regionsData || []).slice(0, 10).map((region) => (
                            <Link
                              key={region.id}
                              to={`/destinations/${region.id}`}
                              onClick={() => setIsMenuOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm text-textPrimary transition-colors hover:bg-white hover:text-textPrimary"
                            >
                              {region ? t({ ar: region.name_ar || region.name, en: region.name_en || region.name }) : ''}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden rounded-xl border border-borderColor">
                    <button
                      type="button"
                      aria-expanded={mobileExpanded === 'developers'}
                      onClick={() => setMobileExpanded((prev) => (prev === 'developers' ? null : 'developers'))}
                      className="flex w-full items-center justify-between gap-2 px-4 py-3 text-start text-sm font-medium text-textPrimary transition-colors hover:bg-bgSection"
                    >
                      <span>{t(translations.developers)}</span>
                      <svg
                        className={`h-4 w-4 shrink-0 transition-transform ${mobileExpanded === 'developers' ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileExpanded === 'developers' && (
                      <div className="max-h-60 space-y-0.5 overflow-y-auto border-t border-borderColor bg-bgSection/60 px-2 py-2">
                        {(developersData || []).slice(0, 10).map((developer) => (
                          <Link
                            key={developer.id}
                            to={`/developers/${developer.id}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-textPrimary transition-colors hover:bg-white"
                          >
                            {developer ? t({ ar: developer.name_ar || developer.name, en: developer.name_en || developer.name }) : ''}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden rounded-xl border border-borderColor">
                    <button
                      type="button"
                      aria-expanded={mobileExpanded === 'compounds'}
                      onClick={() => setMobileExpanded((prev) => (prev === 'compounds' ? null : 'compounds'))}
                      className="flex w-full items-center justify-between gap-2 px-4 py-3 text-start text-sm font-medium text-textPrimary transition-colors hover:bg-bgSection"
                    >
                      <span>{t(translations.compounds)}</span>
                      <svg
                        className={`h-4 w-4 shrink-0 transition-transform ${mobileExpanded === 'compounds' ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileExpanded === 'compounds' && (
                      <div className="max-h-60 space-y-0.5 overflow-y-auto border-t border-borderColor bg-bgSection/60 px-2 py-2">
                        {(projectsData || []).slice(0, 10).map((project) => (
                          <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-textPrimary transition-colors hover:bg-white"
                          >
                            {project ? t({ ar: project.name_ar || project.name, en: project.name_en || project.name }) : ''}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link
                    to="/properties"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-textPrimary transition-colors hover:bg-bgSection"
                  >
                    {t(translations.properties)}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      verifyConsultantModal.open();
                    }}
                    className="rounded-xl px-4 py-3 text-start text-sm font-medium text-textPrimary transition-colors hover:bg-bgSection"
                  >
                    {t(translations.verifyConsultant)}
                  </button>
                  <Link
                    to="/sell"
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      pathname === '/sell' ? 'bg-bgSection text-primary ring-1 ring-borderColor' : 'text-textPrimary hover:bg-bgSection'
                    }`}
                  >
                    {t(translations.sell)}
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      pathname === '/contact' ? 'bg-bgSection text-primary ring-1 ring-borderColor' : 'text-textPrimary hover:bg-bgSection'
                    }`}
                  >
                    {t(translations.contact)}
                  </Link>
                </nav>
            </aside>
          </div>,
          document.body
        )}
    </nav>
  );
}

