'use client';

import { useState, useEffect } from 'react';
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
  };

  const mostSearchedItems = (projectsData || [])
    .sort((a, b) => (b.unitsCount || 0) - (a.unitsCount || 0))
    .slice(0, 10);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) setIsMenuOpen(false);
      if (openDropdown && !event.target.closest('.dropdown-container')) setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, openDropdown]);

  return (
    <nav
      className={`bg-white text-textPrimary shadow-sm sticky top-0 z-50 border-b border-borderColor backdrop-blur-sm ${isRTL ? 'rtl' : 'ltr'}`}
    >
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-textPrimary hover:bg-bgSection rounded-lg transition-all duration-300 mobile-menu-container"
              aria-label="Toggle menu"
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
    </nav>
  );
}

