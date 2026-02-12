'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Logo from './Logo';
import { useRegions, useProjects, useDevelopers } from '@/hooks/useGraphQL';

export default function Footer() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  
  // Fetch data for footer sections
  const { regions: regionsData = [] } = useRegions();
  const { projects: projectsData = [] } = useProjects();
  const { developers: developersData = [] } = useDevelopers();
  
  // Get most searched (top 10 projects by unitsCount)
  const mostSearchedItems = (projectsData || [])
    .sort((a, b) => (b.unitsCount || 0) - (a.unitsCount || 0))
    .slice(0, 10);

  const translations = {
    about: { ar: 'من نحن', en: 'About Us' },
    contact: { ar: 'اتصل بنا', en: 'Contact Us' },
    properties: { ar: 'العقارات', en: 'Properties' },
    privacy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    terms: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
    rights: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
    tagline: {
      ar: 'مستوحى من البحر الأحمر - ربط مصر والمملكة العربية السعودية',
      en: 'Inspired by the Red Sea - Connecting Egypt & KSA',
    },
    downloadApp: { ar: 'حمل تطبيقنا', en: 'Download our app' },
    home: { ar: 'الرئيسية', en: 'Home' },
    search: { ar: 'بحث', en: 'Search' },
    blog: { ar: 'مدونة', en: 'Blog' },
    howItWorks: { ar: 'كيف يعمل', en: 'How it works' },
    newProjects: { ar: 'المشروعات الجديدة', en: 'New Projects' },
    yafelNow: { ar: 'Yafel Now', en: 'Yafel Now' },
    realEstateCompany: { ar: 'شركة عقارات', en: 'Real Estate Company' },
    regions: { ar: 'مناطق', en: 'Regions' },
    compounds: { ar: 'كمبوندات', en: 'Compounds' },
    developers: { ar: 'مطورين', en: 'Developers' },
    mostSearched: { ar: 'الأكثر بحثا', en: 'Most Searched' },
  };

  return (
    <footer className={`bg-[#1e1e1e] text-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-[#2a2a2a] border-b border-[#353535]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-white">
                {t(translations.downloadApp)}
              </span>
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex items-center gap-2 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm-.01-4.24L6.05 2.66l10.76 6.22-2.27 2.27zM6.05 2.66L3.84 4.87l8.49 8.49 2.27-2.27L6.05 2.66z"/>
                </svg>
                <span className="text-sm font-medium">Get it on Google Play</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="text-sm font-medium">Available on the App Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo Section */}
          <div className="lg:col-span-1">
            <Logo variant="horizontal" dark={true} className="mb-4" />
            <p className="text-[#cfcfcf] text-sm mt-4 leading-relaxed">
              {t(translations.tagline)}
            </p>
          </div>
          
          {/* Regions Section */}
          <div>
            <h4 className="font-semibold mb-6 text-[#f0cb8e] text-base">{t(translations.regions)}</h4>
            <ul className="space-y-3 text-sm text-[#cfcfcf]">
              {(regionsData || []).slice(0, 10).map((region) => (
                <li key={region.id}>
                  <Link 
                    href={`/destinations/${region.id}`} 
                    className="hover:text-[#f0cb8e] transition-colors block"
                  >
                    {region ? t({ ar: region.name_ar || region.name, en: region.name_en || region.name }) : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Compounds Section */}
          <div>
            <h4 className="font-semibold mb-6 text-[#f0cb8e] text-base">{t(translations.compounds)}</h4>
            <ul className="space-y-3 text-sm text-[#cfcfcf]">
              {(projectsData || []).slice(0, 10).map((project) => (
                <li key={project.id}>
                  <Link 
                    href={`/projects/${project.id}`} 
                    className="hover:text-[#f0cb8e] transition-colors block"
                  >
                    {project ? t({ ar: project.name_ar || project.name, en: project.name_en || project.name }) : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Developers Section */}
          <div>
            <h4 className="font-semibold mb-6 text-[#f0cb8e] text-base">{t(translations.developers)}</h4>
            <ul className="space-y-3 text-sm text-[#cfcfcf]">
              {(developersData || []).slice(0, 10).map((developer) => (
                <li key={developer.id}>
                  <Link 
                    href={`/developers/${developer.id}`} 
                    className="hover:text-[#f0cb8e] transition-colors block"
                  >
                    {developer ? t({ ar: developer.name_ar || developer.name, en: developer.name_en || developer.name }) : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Most Searched Section */}
          <div>
            <h4 className="font-semibold mb-6 text-[#f0cb8e] text-base">{t(translations.mostSearched)}</h4>
            <ul className="space-y-3 text-sm text-[#cfcfcf]">
              {mostSearchedItems.map((project) => (
                <li key={project.id}>
                  <Link 
                    href={`/projects/${project.id}`} 
                    className="hover:text-[#f0cb8e] transition-colors block"
                  >
                    <span className="text-[#6D6D6D] text-xs mr-2">{project.unitsCount || 0}</span>
                    {project ? t({ ar: project.name_ar || project.name, en: project.name_en || project.name }) : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#353535]">
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <Link href="/" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
              {t(translations.home)}
            </Link>
            <Link href="/properties" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
              {t(translations.search)}
            </Link>
            <Link href="/blog" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
              {t(translations.blog)}
            </Link>
            <Link href="/about" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
              {t(translations.about)}
            </Link>
            <Link href="/contact" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
              {t(translations.contact)}
            </Link>
            <a href="#" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
              {t(translations.terms)}
            </a>
            <a href="#" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
              {t(translations.privacy)}
            </a>
            <Link href="/how-it-works" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
              {t(translations.howItWorks)}
            </Link>
            <Link href="/projects" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
              {t(translations.newProjects)}
            </Link>
            <Link href="/now" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
              {t(translations.yafelNow)}
            </Link>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#353535]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <Logo variant="horizontal" dark={true} className="mb-2" />
              <p className="text-[#cfcfcf] text-sm">
                {t(translations.realEstateCompany)}
              </p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-[#cfcfcf] hover:text-[#f0cb8e] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-[#cfcfcf]">
            <p>&copy; Copyright {new Date().getFullYear()} - Yafel. {t(translations.rights)}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
