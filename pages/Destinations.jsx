import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DestinationCard from '../components/Cards/DestinationCard';
import destinationsData from '../data/destinations.json';

export default function Destinations() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#1e1e1e] mb-8">
          {language === 'ar' ? 'جميع الوجهات' : 'All Destinations'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinationsData.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
