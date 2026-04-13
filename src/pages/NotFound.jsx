import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { BrandAtmosphere, BrandGlassPanel } from '@/components/ui/BrandAtmosphere';

const btnPrimary =
  'inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-gold hover:text-primary';

export default function NotFound() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const translations = {
    title: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
    description: {
      ar: 'الرابط الذي طلبته غير متوفر أو تم نقله.',
      en: 'The page you are looking for does not exist or has been moved.',
    },
    home: { ar: 'العودة للرئيسية', en: 'Back to home' },
    browse: { ar: 'تصفح العقارات', en: 'Browse properties' },
    seoTitle: { ar: 'صفحة غير موجودة', en: 'Page not found' },
    seoDesc: {
      ar: 'يافيل — الصفحة غير موجودة.',
      en: 'Yafel — The requested page could not be found.',
    },
  };

  return (
    <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Seo title={t(translations.seoTitle)} description={t(translations.seoDesc)} />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <BrandAtmosphere className="flex min-h-[65vh] flex-col">
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-20">
            <BrandGlassPanel className="w-full max-w-lg px-6 py-10 text-center sm:px-10 sm:py-12">
              <p className="text-7xl font-black leading-none text-gold/30 sm:text-8xl" aria-hidden>
                404
              </p>
              <h1 className="mt-4 text-2xl font-bold text-textPrimary sm:text-3xl md:text-4xl">{t(translations.title)}</h1>
              <p className="mx-auto mt-4 max-w-md text-textSecondary">{t(translations.description)}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/" className={btnPrimary}>
                  {t(translations.home)}
                </Link>
              </div>
              <Link
                to="/properties"
                className="mt-6 inline-block text-sm font-semibold text-gold-deep underline-offset-4 hover:underline"
              >
                {t(translations.browse)}
              </Link>
            </BrandGlassPanel>
          </div>
        </BrandAtmosphere>
      </main>
      <Footer />
    </div>
  );
}
