'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  // Note: Content should be extracted from company-profile.pdf
  // This is a placeholder structure that can be updated with actual content
  const translations = {
    title: { ar: 'من نحن', en: 'About Us' },
    subtitle: {
      ar: 'مستوحى من البحر الأحمر - ربط مصر والمملكة العربية السعودية',
      en: 'Inspired by the Red Sea - Connecting Egypt & Saudi Arabia',
    },
    ourStory: { ar: 'قصتنا', en: 'Our Story' },
    ourStoryText: {
      ar: 'يافل هي علامة تجارية عقارية فاخرة مستوحاة من جمال البحر الأحمر وروح الاتصال بين مصر والمملكة العربية السعودية. نحن نؤمن ببناء مجتمعات مستدامة وخلق قيمة حقيقية للمستثمرين والمقيمين على حد سواء.',
      en: 'Yafel is a premium real estate brand inspired by the beauty of the Red Sea and the spirit of connection between Egypt and Saudi Arabia. We believe in building sustainable communities and creating real value for both investors and residents.',
    },
    mission: { ar: 'مهمتنا', en: 'Our Mission' },
    missionText: {
      ar: 'تقديم حلول عقارية مبتكرة وعالية الجودة تلبي احتياجات عملائنا وتتجاوز توقعاتهم، مع التركيز على الاستدامة والتميز في كل ما نقوم به.',
      en: 'To deliver innovative and high-quality real estate solutions that meet our clients\' needs and exceed their expectations, with a focus on sustainability and excellence in everything we do.',
    },
    vision: { ar: 'رؤيتنا', en: 'Our Vision' },
    visionText: {
      ar: 'أن نكون الرائد في صناعة العقارات الفاخرة في المنطقة، معترف بنا كعلامة تجارية موثوقة ومبتكرة تربط بين الثقافات وتخلق مجتمعات مستدامة.',
      en: 'To be the leader in the luxury real estate industry in the region, recognized as a trusted and innovative brand that bridges cultures and creates sustainable communities.',
    },
    values: { ar: 'قيمنا', en: 'Our Values' },
    excellence: { ar: 'التميز', en: 'Excellence' },
    excellenceText: {
      ar: 'نسعى للتميز في كل مشروع ننفذه',
      en: 'We strive for excellence in every project we undertake',
    },
    integrity: { ar: 'النزاهة', en: 'Integrity' },
    integrityText: {
      ar: 'نلتزم بأعلى معايير النزاهة والأخلاقيات',
      en: 'We commit to the highest standards of integrity and ethics',
    },
    innovation: { ar: 'الابتكار', en: 'Innovation' },
    innovationText: {
      ar: 'نتبنى أحدث التقنيات والتصاميم المبتكرة',
      en: 'We embrace the latest technologies and innovative designs',
    },
    sustainability: { ar: 'الاستدامة', en: 'Sustainability' },
    sustainabilityText: {
      ar: 'نبني للمستقبل مع التركيز على الاستدامة البيئية',
      en: 'We build for the future with a focus on environmental sustainability',
    },
    contactUs: { ar: 'اتصل بنا', en: 'Contact Us' },
  };

  const values = [
    {
      title: translations.excellence,
      text: translations.excellenceText,
      icon: '⭐',
    },
    {
      title: translations.integrity,
      text: translations.integrityText,
      icon: '🤝',
    },
    {
      title: translations.innovation,
      text: translations.innovationText,
      icon: '💡',
    },
    {
      title: translations.sustainability,
      text: translations.sustainabilityText,
      icon: '🌱',
    },
  ];

  return (
    <div className={`min-h-screen bg-[#efefef] ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#1e1e1e] to-[#353535] text-[#efefef] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t(translations.title)}
          </h1>
          <p className="text-xl text-[#cfcfcf]">
            {t(translations.subtitle)}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1e1e] mb-6">
                {t(translations.ourStory)}
              </h2>
              <p className="text-lg text-[#6D6D6D] leading-relaxed mb-6">
                {t(translations.ourStoryText)}
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dqqmswaf7/image/upload/shutterstock_2209394407_uuurxb"
                alt="Yafel Real Estate"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[#efefef] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[#1e1e1e] mb-4">
                {t(translations.mission)}
              </h3>
              <p className="text-[#6D6D6D] leading-relaxed">
                {t(translations.missionText)}
              </p>
            </div>
            <div className="bg-[#efefef] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[#1e1e1e] mb-4">
                {t(translations.vision)}
              </h3>
              <p className="text-[#6D6D6D] leading-relaxed">
                {t(translations.visionText)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e1e1e] text-center mb-12">
            {t(translations.values)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-[#1e1e1e] mb-3">
                  {t(value.title)}
                </h3>
                <p className="text-[#6D6D6D] text-sm leading-relaxed">
                  {t(value.text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#1e1e1e] to-[#353535] text-[#efefef]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'ar'
              ? 'جاهزون لبدء رحلتك العقارية؟'
              : 'Ready to Start Your Real Estate Journey?'}
          </h2>
          <p className="text-xl text-[#cfcfcf] mb-8">
            {language === 'ar'
              ? 'تواصل معنا اليوم واكتشف كيف يمكننا مساعدتك'
              : 'Contact us today and discover how we can help you'}
          </p>
          <Button variant="secondary" size="lg">
            {t(translations.contactUs)}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

