import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import destinationsData from '../data/destinations.json';

export default function DestinationDetail() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const destination = destinationsData.find(d => d.id === parseInt(id));
  const isRTL = language === 'ar';

  if (!destination) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'الوجهة غير موجودة' : 'Destination not found'}
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t({ ar: destination.name_ar, en: destination.name_en })}
        </h1>
        <p className="text-xl text-gray-600">
          {t({ ar: destination.description_ar, en: destination.description_en })}
        </p>
      </div>
      <Footer />
    </div>
  );
}
