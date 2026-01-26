import { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../components/Image';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SectionHeader from '../components/SectionHeader';
import ProjectCard from '../components/Cards/ProjectCard';
import DestinationCard from '../components/Cards/DestinationCard';
import Button from '../components/ui/Button';
import projectsData from '../data/projects.json';
import destinationsData from '../data/destinations.json';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function Home() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [searchTab, setSearchTab] = useState('compounds');
  const [unitType, setUnitType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [assistanceForm, setAssistanceForm] = useState({
    name: '',
    location: '',
    phone: '',
    phoneCode: '+20',
    message: '',
  });
  const isRTL = language === 'ar';

  const translations = {
    heroTitle: {
      ar: 'ابحث عن منزلك',
      en: 'Search for your home',
    },
    heroSubtitle: {
      ar: 'ابحث وقارن بين أكثر من 15000 عقار من بين +800 كمبوند أو اعرض عقارك للبيع',
      en: 'Search and compare over 15,000 properties from over 800 compounds or list your property for sale',
    },
    search: { ar: 'ابحث', en: 'Search' },
    allDestinations: { ar: 'جميع الوجهات', en: 'All Destinations' },
    featuredProperties: { ar: 'عقارات مميزة', en: 'Featured Properties' },
    viewAll: { ar: 'عرض الكل', en: 'View All' },
    exploreProperties: { ar: 'استكشف العقارات', en: 'Explore Properties' },
    searchPlaceholder: {
      ar: 'البحث بالكمبوند، الموقع، المطور العقاري',
      en: 'Search by compound, location, developer',
    },
    compounds: { ar: 'كمبوندات', en: 'Compounds' },
    units: { ar: 'وحدات', en: 'Units' },
    unitTypes: { ar: 'أنواع الوحدات', en: 'Unit Types' },
    bedroomsBathrooms: { ar: 'غرف نوم و حمامات', en: 'Bedrooms & Bathrooms' },
    priceRange: { ar: 'معدل السعر', en: 'Price Range' },
    searchFor: { ar: 'ابحث عن', en: 'Search For' },
    newProjects: { ar: 'المشاريع الجديدة', en: 'New Projects' },
    mostSearched: { ar: 'الكمبوندات الأكثر بحثا', en: 'Most Searched Compounds' },
    mostImportantAreas: { ar: 'أهم المناطق', en: 'Most Important Areas' },
    results: { ar: 'نتائج', en: 'results' },
    exclusiveOffers: { ar: 'عروض الحصر', en: 'Exclusive Offers' },
    allOffers: { ar: '+ كل عروض', en: '+ All Offers' },
    lookingForRent: { ar: 'بتدور علي بيت للإيجار', en: 'Looking for a house for rent' },
    startHere: { ar: 'ابدأ هنا', en: 'Start Here' },
    returnBeforeTax: { ar: 'عائد قبل الضرائب', en: 'return before taxes' },
    months: { ar: 'شهور', en: 'months' },
    all: { ar: 'الكل', en: 'All' },
    needAssistance: { ar: 'تحتاج إلى مساعدة عقارية؟', en: 'Do you need real estate assistance?' },
    assistanceSubtitle: {
      ar: 'املأ بياناتك و سوف يقوم خبير عقارى بالاتصال بك في اقرب وقت',
      en: 'Fill in your details and a real estate expert will contact you as soon as possible',
    },
    nameLabel: { ar: 'الاسم', en: 'Name' },
    locationLabel: { ar: 'الموقع', en: 'Location' },
    phoneLabel: { ar: 'رقم الهاتف', en: 'Phone Number' },
    messageLabel: { ar: 'رسالة', en: 'Message' },
    send: { ar: 'ارسال', en: 'Send' },
    preferredLocation: { ar: 'الموقع المفضل', en: 'Preferred Location' },
    yourMessage: { ar: 'رسالتك', en: 'Your Message' },
  };

  const searchForCards = [
    { id: 1, icon: '📊', title: { ar: 'Yafel Shares', en: 'Yafel Shares' }, link: '/shares' },
    { id: 2, icon: '📍', title: { ar: 'بيع وحدتك', en: 'Sell Your Unit' }, link: '/sell' },
    { id: 3, icon: '🏠', title: { ar: 'Yafel Now', en: 'Yafel Now' }, link: '/now' },
    { id: 4, icon: '🎯', title: { ar: 'عروض', en: 'Offers' }, link: '/offers' },
    { id: 5, icon: '🔄', title: { ar: 'وحدات اعادة بيع', en: 'Resale Units' }, link: '/resale' },
    { id: 6, icon: '🏢', title: { ar: 'وحدات المطور', en: 'Developer Units' }, link: '/developer-units' },
    { id: 7, icon: '🔔', title: { ar: 'Yafel Unlocked', en: 'Yafel Unlocked' }, link: '/unlocked' },
    { id: 8, icon: '🔑', title: { ar: 'Yafel Keys', en: 'Yafel Keys' }, link: '/keys' },
  ];

  const featuredProjects = projectsData.slice(0, 6);
  const newProjects = projectsData.slice(0, 3);
  const mostSearchedProjects = projectsData.slice(0, 6);
  const heroImages = [
    'https://png.pngtree.com/thumb_back/fw800/background/20240601/pngtree-real-estate-luxury-building-sale-property-background-images-image_15851318.jpg',
    'https://th.bing.com/th/id/OIP.Jy16vSGLOrlRWJ-2BrVMrgHaFj?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    '/assets/brand/images/shutterstock_2558087881.jpg',
  ];

  return (
    <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImages[1]}
            alt="Yafel Real Estate"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e1e]/85 via-[#1e1e1e]/75 to-[#1e1e1e]/85"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight animate-fadeInUp">
            {t(translations.heroTitle)}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {t(translations.heroSubtitle)}
          </p>

          <div className="max-w-5xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setSearchTab('compounds')}
                  className={`flex-1 px-6 py-4 font-semibold text-lg transition-all ${
                    searchTab === 'compounds'
                      ? 'text-[#1e1e1e] border-b-2 border-[#1e1e1e]'
                      : 'text-gray-500 hover:text-[#1e1e1e]'
                  }`}
                >
                  {t(translations.compounds)}
                </button>
                <button
                  onClick={() => setSearchTab('units')}
                  className={`flex-1 px-6 py-4 font-semibold text-lg transition-all ${
                    searchTab === 'units'
                      ? 'text-[#1e1e1e] border-b-2 border-[#1e1e1e]'
                      : 'text-gray-500 hover:text-[#1e1e1e]'
                  }`}
                >
                  {t(translations.units)}
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t(translations.searchPlaceholder)}
                      className="w-full px-6 py-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] text-lg rtl:pl-6 rtl:pr-12"
                    />
                    <svg
                      className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t(translations.unitTypes)}
                    </label>
                    <select
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] bg-white"
                    >
                      <option value="">{t(translations.all)}</option>
                      <option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                      <option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                      <option value="townhouse">{language === 'ar' ? 'تاون هاوس' : 'Townhouse'}</option>
                      <option value="duplex">{language === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t(translations.bedroomsBathrooms)}
                    </label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] bg-white"
                    >
                      <option value="">{t(translations.all)}</option>
                      <option value="1">{language === 'ar' ? '1+ غرف' : '1+ Bedrooms'}</option>
                      <option value="2">{language === 'ar' ? '2+ غرف' : '2+ Bedrooms'}</option>
                      <option value="3">{language === 'ar' ? '3+ غرف' : '3+ Bedrooms'}</option>
                      <option value="4">{language === 'ar' ? '4+ غرف' : '4+ Bedrooms'}</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t(translations.priceRange)}
                    </label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] bg-white"
                    >
                      <option value="">{t(translations.all)}</option>
                      <option value="0-500000">{language === 'ar' ? 'حتى 500,000' : 'Up to 500,000'}</option>
                      <option value="500000-1000000">{language === 'ar' ? '500,000 - 1,000,000' : '500,000 - 1,000,000'}</option>
                      <option value="1000000-2000000">{language === 'ar' ? '1,000,000 - 2,000,000' : '1,000,000 - 2,000,000'}</option>
                      <option value="2000000+">{language === 'ar' ? 'أكثر من 2,000,000' : 'More than 2,000,000'}</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t(translations.allDestinations)}
                    </label>
                    <select
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] bg-white"
                    >
                      <option value="">{t(translations.allDestinations)}</option>
                      {destinationsData.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {t({ ar: dest.name_ar, en: dest.name_en })}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button size="lg" className="w-full md:w-auto">
                  {t(translations.search)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl md:text-4xl font-bold text-[#1e1e1e] mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t(translations.searchFor)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {searchForCards.map((card) => (
              <Link
                key={card.id}
                to={card.link}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#f0cb8e] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1e1e1e] group-hover:text-[#f0cb8e] transition-colors">
                  {t(card.title)}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#efefef]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  {t(translations.exclusiveOffers)}
                </h3>
                <Button variant="secondary" size="md">
                  {t(translations.allOffers)}
                </Button>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
            </div>

            <div className="bg-black rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{t(translations.lookingForRent)}</h3>
                  <Button variant="secondary" size="sm" className="mt-4">
                    {t(translations.startHere)}
                  </Button>
                </div>
                <div className="text-6xl">🔑</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-green-500 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Yafel Shares</h3>
                  <div className={`text-right ${isRTL ? 'text-left' : 'text-right'}`}>
                    <div className="text-3xl font-bold">61%</div>
                    <div className="text-sm opacity-90">{t(translations.returnBeforeTax)}</div>
                    <div className="text-sm opacity-90">9 {t(translations.months)}</div>
                  </div>
                </div>
                <div className="text-sm opacity-90">{language === 'ar' ? 'التخارج الخامس' : 'Fifth Exit'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between mb-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1e1e]">
              {t(translations.newProjects)}
            </h2>
            <Link to="/projects" className="text-[#f0cb8e] font-semibold hover:text-[#d8b280] transition-colors flex items-center gap-2">
              {t(translations.viewAll)}
              <span>{isRTL ? '←' : '→'}</span>
            </Link>
          </div>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="new-projects-swiper"
          >
            {newProjects.map((project) => (
              <SwiperSlide key={project.id}>
                <ProjectCard project={project} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="py-24 bg-[#efefef]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1e1e] mb-2">
              {t(translations.mostSearched)}
            </h2>
            <p className="text-lg text-gray-600">
              {mostSearchedProjects.length} {t(translations.results)}
            </p>
          </div>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="most-searched-swiper"
          >
            {mostSearchedProjects.map((project) => (
              <SwiperSlide key={project.id}>
                <Link to={`/projects/${project.id}`}>
                  <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
                    <Image
                      src={project.images?.[0] || 'https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2256037689_mc4cxv'}
                      alt={t({ ar: project.name_ar, en: project.name_en })}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">
                        {t({ ar: project.name_ar, en: project.name_en })}
                      </h3>
                      <p className="text-sm opacity-90">
                        {project.unitsCount || 0} {language === 'ar' ? 'وحدات' : 'units'}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e1e1e] mb-2">
              {t(translations.mostImportantAreas)}
            </h2>
            <p className="text-lg text-gray-600">
              {destinationsData.length} {t(translations.results)}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {destinationsData.map((destination) => (
              <Link
                key={destination.id}
                to={`/destinations/${destination.id}`}
                className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative w-full h-32 mb-4 rounded-full overflow-hidden">
                  <Image
                    src={destination.image || '/destinations/default.jpg'}
                    alt={t({ ar: destination.name_ar, en: destination.name_en })}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-center text-lg font-semibold text-[#1e1e1e] group-hover:text-[#f0cb8e] transition-colors">
                  {t({ ar: destination.name_ar, en: destination.name_en })}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#efefef]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t(translations.featuredProperties)}
            subtitle={
              language === 'ar'
                ? 'عقارات فاخرة مختارة بعناية'
                : 'Carefully selected luxury properties'
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <Button variant="outline" size="lg" className="hover-lift">
              {t(translations.viewAll)}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
