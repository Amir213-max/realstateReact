import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DeveloperDetail() {
  const { id } = useParams();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#1e1e1e] mb-4">
          {language === 'ar' ? 'تفاصيل المطور' : 'Developer Details'}
        </h1>
        <p className="text-lg text-[#6D6D6D]">
          Developer ID: {id}
        </p>
      </div>
      <Footer />
    </div>
  );
}
