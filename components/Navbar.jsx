'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Logo from './Logo';
import Button from './ui/Button';
import VerifyConsultantModal from './Modals/VerifyConsultantModal';
import { useModal } from '@/hooks/useModal';
import { useRegions, useProjects, useDevelopers } from '@/hooks/useGraphQL';

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const isRTL = language === 'ar';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const verifyConsultantModal = useModal();
  
  // Fetch data for dropdowns
  const { regions: regionsData = [] } = useRegions();
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
  };

  const navLinks = [
    { href: '/', label: translations.home },
    { href: '/properties', label: translations.properties },
    { href: '/sell', label: translations.sell },
    { href: '/about', label: translations.about },
    { href: '/contact', label: translations.contact },
  ];

  // Get most searched (top 10 projects by unitsCount or most recent)
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
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, openDropdown]);

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50 border-b border-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo variant="horizontal" className="h-8 sm:h-10" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-1 rtl:gap-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-[#1e1e1e] bg-[#efefef]'
                    : 'text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef]'
                }`}
              >
                {t(link.label)}
              </Link>
            ))}
            
            {/* Regions Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'regions' ? null : 'regions')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef] flex items-center gap-1"
              >
                {t(translations.regions)}
                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'regions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'regions' && (
                <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 w-64 max-h-96 overflow-y-auto z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1e1e1e] mb-3 text-sm">{t(translations.regions)}</h3>
                    <div className="space-y-1">
                      {(regionsData || []).slice(0, 10).map((region) => (
                        <Link
                          key={region.id}
                          href={`/destinations/${region.id}`}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#efefef] hover:text-[#1e1e1e] rounded-lg transition-colors"
                        >
                          {region ? t({ ar: region.name_ar || region.name, en: region.name_en || region.name }) : ''}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compounds Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'compounds' ? null : 'compounds')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef] flex items-center gap-1"
              >
                {t(translations.compounds)}
                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'compounds' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'compounds' && (
                <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 w-64 max-h-96 overflow-y-auto z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1e1e1e] mb-3 text-sm">{t(translations.compounds)}</h3>
                    <div className="space-y-1">
                      {(projectsData || []).slice(0, 10).map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#efefef] hover:text-[#1e1e1e] rounded-lg transition-colors"
                        >
                          {project ? t({ ar: project.name_ar || project.name, en: project.name_en || project.name }) : ''}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Developers Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'developers' ? null : 'developers')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef] flex items-center gap-1"
              >
                {t(translations.developers)}
                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'developers' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'developers' && (
                <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 w-64 max-h-96 overflow-y-auto z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1e1e1e] mb-3 text-sm">{t(translations.developers)}</h3>
                    <div className="space-y-1">
                      {(developersData || []).slice(0, 10).map((developer) => (
                        <Link
                          key={developer.id}
                          href={`/developers/${developer.id}`}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#efefef] hover:text-[#1e1e1e] rounded-lg transition-colors"
                        >
                          {developer ? t({ ar: developer.name_ar || developer.name, en: developer.name_en || developer.name }) : ''}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Most Searched Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'mostSearched' ? null : 'mostSearched')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef] flex items-center gap-1"
              >
                {t(translations.mostSearched)}
                <svg className={`w-4 h-4 transition-transform ${openDropdown === 'mostSearched' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'mostSearched' && (
                <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 w-80 max-h-96 overflow-y-auto z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1e1e1e] mb-3 text-sm">{t(translations.mostSearched)}</h3>
                    <div className="space-y-1">
                      {mostSearchedItems.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#efefef] hover:text-[#1e1e1e] rounded-lg transition-colors"
                        >
                          <span className="text-gray-500 text-xs mr-2">{project.unitsCount || 0}</span>
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
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef] relative"
            >
              {t(translations.verifyConsultant)}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {language === 'ar' ? 'جديد' : 'New'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 rtl:gap-reverse">
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 text-sm font-medium text-[#1e1e1e] hover:bg-[#efefef] transition-colors rounded-lg border border-[#cfcfcf]"
            >
              {language === 'ar' ? 'EN' : 'AR'}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[#1e1e1e] hover:bg-[#efefef] rounded-lg transition-colors mobile-menu-container"
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden mobile-menu-container transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-[85vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#f0cb8e #efefef',
          }}
        >
          <div className="py-4 space-y-2 border-t border-[#efefef]">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 animate-slideInLeft ${
                  pathname === link.href
                    ? 'text-[#1e1e1e] bg-[#efefef]'
                    : 'text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef]'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {t(link.label)}
              </Link>
            ))}
            
            {/* Mobile Dropdowns */}
            <div className="space-y-2">
              {/* Regions Mobile */}
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'regions-mobile' ? null : 'regions-mobile')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef]"
                >
                  {t(translations.regions)}
                  <svg className={`w-5 h-5 transition-transform ${openDropdown === 'regions-mobile' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'regions-mobile' && (
                  <div className="mt-2 space-y-1 pl-4">
                    {(regionsData || []).slice(0, 10).map((region) => (
                      <Link
                        key={region.id}
                        href={`/destinations/${region.id}`}
                        onClick={() => {
                          setOpenDropdown(null);
                          setIsMenuOpen(false);
                        }}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#efefef] rounded-lg transition-colors"
                      >
                        {region ? t({ ar: region.name_ar || region.name, en: region.name_en || region.name }) : ''}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Compounds Mobile */}
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'compounds-mobile' ? null : 'compounds-mobile')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef]"
                >
                  {t(translations.compounds)}
                  <svg className={`w-5 h-5 transition-transform ${openDropdown === 'compounds-mobile' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'compounds-mobile' && (
                  <div className="mt-2 space-y-1 pl-4">
                    {(projectsData || []).slice(0, 10).map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        onClick={() => {
                          setOpenDropdown(null);
                          setIsMenuOpen(false);
                        }}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#efefef] rounded-lg transition-colors"
                      >
                        {project ? t({ ar: project.name_ar || project.name, en: project.name_en || project.name }) : ''}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Developers Mobile */}
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'developers-mobile' ? null : 'developers-mobile')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef]"
                >
                  {t(translations.developers)}
                  <svg className={`w-5 h-5 transition-transform ${openDropdown === 'developers-mobile' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'developers-mobile' && (
                  <div className="mt-2 space-y-1 pl-4">
                    {(developersData || []).slice(0, 10).map((developer) => (
                      <Link
                        key={developer.id}
                        href={`/developers/${developer.id}`}
                        onClick={() => {
                          setOpenDropdown(null);
                          setIsMenuOpen(false);
                        }}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#efefef] rounded-lg transition-colors"
                      >
                        {developer ? t({ ar: developer.name_ar || developer.name, en: developer.name_en || developer.name }) : ''}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Most Searched Mobile */}
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'mostSearched-mobile' ? null : 'mostSearched-mobile')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef]"
                >
                  {t(translations.mostSearched)}
                  <svg className={`w-5 h-5 transition-transform ${openDropdown === 'mostSearched-mobile' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'mostSearched-mobile' && (
                  <div className="mt-2 space-y-1 pl-4">
                    {mostSearchedItems.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        onClick={() => {
                          setOpenDropdown(null);
                          setIsMenuOpen(false);
                        }}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#efefef] rounded-lg transition-colors"
                      >
                        <span className="text-gray-500 text-xs mr-2">{project.unitsCount || 0}</span>
                        {project ? t({ ar: project.name_ar || project.name, en: project.name_en || project.name }) : ''}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={verifyConsultantModal.open}
              className="block w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef] relative animate-slideInLeft"
              style={{ animationDelay: `${navLinks.length * 0.1}s` }}
            >
              {t(translations.verifyConsultant)}
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {language === 'ar' ? 'جديد' : 'New'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Verify Consultant Modal */}
      <VerifyConsultantModal 
        isOpen={verifyConsultantModal.isOpen} 
        onClose={verifyConsultantModal.close} 
      />
    </nav>
  );
}
