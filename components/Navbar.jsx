'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Logo from './Logo';
import Button from './ui/Button';

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const isRTL = language === 'ar';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const translations = {
    home: { ar: 'الرئيسية', en: 'Home' },
    properties: { ar: 'العقارات', en: 'Properties' },
    about: { ar: 'من نحن', en: 'About Us' },
    contact: { ar: 'اتصل بنا', en: 'Contact' },
  };

  const navLinks = [
    { href: '/', label: translations.home },
    { href: '/properties', label: translations.properties },
    { href: '/about', label: translations.about },
    { href: '/contact', label: translations.contact },
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50 border-b border-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo variant="horizontal" className="h-8 sm:h-10" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1 rtl:gap-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-[#1e1e1e] bg-[#efefef]'
                    : 'text-[#6D6D6D] hover:text-[#1e1e1e] hover:bg-[#efefef]'
                }`}
              >
                {t(link.label)}
              </Link>
            ))}
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
              className="md:hidden p-2 text-[#1e1e1e] hover:bg-[#efefef] rounded-lg transition-colors mobile-menu-container"
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
          className={`md:hidden mobile-menu-container overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
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
          </div>
        </div>
      </div>
    </nav>
  );
}
