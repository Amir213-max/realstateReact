import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import { useRegions } from '@/hooks/useGraphQL';

export default function SellPage() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const { regions: destinationsData } = useRegions();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phoneCode: '+20',
    location: '',
    area: '',
    unitType: '',
    description: '',
  });

  const [currentStep, setCurrentStep] = useState(1);

  const translations = {
    title: { ar: 'بيع وحدتك', en: 'Sell Your Unit' },
    step1Title: { ar: 'قم بإدراج تفاصيل الوحدات الخاصة بك', en: 'Enter your unit details' },
    step1Subtitle: { ar: 'أضف جميع المعلومات المتعلقة بوحدتك', en: 'Add all information related to your unit' },
    step2Title: { ar: 'سيتصل بك أحد وكلائنا', en: 'One of our agents will contact you' },
    step2Subtitle: { ar: 'سنساعدك في العثور على أفضل مشتري', en: 'We will help you find the best buyer' },
    step3Title: { ar: 'قابل المشترين الجادين', en: 'Meet serious buyers' },
    step3Subtitle: { ar: 'الخطوة الأخيرة لبيع وحدتك', en: 'The final step to sell your unit' },
    step: { ar: 'الخطوة', en: 'Step' },
    fillForm: { ar: 'املأ النموذج', en: 'Fill the form' },
    privacy: { ar: 'خصوصيتك مهمة بالنسبة لنا. لن ننشر أو نشارك معلوماتك مع أي شخص', en: 'Your privacy is important to us. We will not publish or share your information with anyone' },
    name: { ar: 'الاسم', en: 'Name' },
    phoneNumber: { ar: 'رقم الهاتف', en: 'Phone Number' },
    location: { ar: 'المحافظة', en: 'Governorate' },
    area: { ar: 'المنطقة', en: 'Area' },
    unitType: { ar: 'نوع الوحدة', en: 'Unit Type' },
    description: { ar: 'الوصف', en: 'Description' },
    submit: { ar: 'إرسال', en: 'Submit' },
    required: { ar: 'مطلوب', en: 'Required' },
  };

  const unitTypes = [
    { value: 'apartment', label: { ar: 'شقة', en: 'Apartment' } },
    { value: 'villa', label: { ar: 'فيلا', en: 'Villa' } },
    { value: 'townhouse', label: { ar: 'تاون هاوس', en: 'Townhouse' } },
    { value: 'duplex', label: { ar: 'دوبلكس', en: 'Duplex' } },
    { value: 'penthouse', label: { ar: 'بنتهاوس', en: 'Penthouse' } },
  ];

  const phoneCodes = [
    { code: '+20', country: '🇪🇬', label: 'Egypt' },
    { code: '+966', country: '🇸🇦', label: 'Saudi Arabia' },
    { code: '+971', country: '🇦🇪', label: 'UAE' },
    { code: '+965', country: '🇰🇼', label: 'Kuwait' },
  ];

  // Governorates (Egypt & Saudi Arabia)
  const governorates = [
    // Egyptian Governorates
    { value: 'cairo', label: { ar: 'القاهرة', en: 'Cairo' }, country: 'eg' },
    { value: 'giza', label: { ar: 'الجيزة', en: 'Giza' }, country: 'eg' },
    { value: 'alexandria', label: { ar: 'الإسكندرية', en: 'Alexandria' }, country: 'eg' },
    { value: 'sharm', label: { ar: 'شرم الشيخ', en: 'Sharm El Sheikh' }, country: 'eg' },
    { value: 'hurghada', label: { ar: 'الغردقة', en: 'Hurghada' }, country: 'eg' },
    { value: 'north_coast', label: { ar: 'الساحل الشمالي', en: 'North Coast' }, country: 'eg' },
    { value: 'new_cairo', label: { ar: 'القاهرة الجديدة', en: 'New Cairo' }, country: 'eg' },
    { value: '6_october', label: { ar: '6 أكتوبر', en: '6 October' }, country: 'eg' },
    { value: 'new_administrative', label: { ar: 'العاصمة الإدارية', en: 'New Administrative Capital' }, country: 'eg' },
    { value: 'madinet_nasr', label: { ar: 'مدينة نصر', en: 'Madinet Nasr' }, country: 'eg' },
    { value: 'zamalek', label: { ar: 'الزمالك', en: 'Zamalek' }, country: 'eg' },
    { value: 'maadi', label: { ar: 'المعادي', en: 'Maadi' }, country: 'eg' },
    { value: 'heliopolis', label: { ar: 'مصر الجديدة', en: 'Heliopolis' }, country: 'eg' },
    // Saudi Arabia Regions
    { value: 'riyadh', label: { ar: 'الرياض', en: 'Riyadh' }, country: 'sa' },
    { value: 'jeddah', label: { ar: 'جدة', en: 'Jeddah' }, country: 'sa' },
    { value: 'dammam', label: { ar: 'الدمام', en: 'Dammam' }, country: 'sa' },
    { value: 'madinah', label: { ar: 'المدينة المنورة', en: 'Madinah' }, country: 'sa' },
    { value: 'makkah', label: { ar: 'مكة المكرمة', en: 'Makkah' }, country: 'sa' },
    { value: 'khobar', label: { ar: 'الخبر', en: 'Khobar' }, country: 'sa' },
    { value: 'taif', label: { ar: 'الطائف', en: 'Taif' }, country: 'sa' },
    { value: 'abha', label: { ar: 'أبها', en: 'Abha' }, country: 'sa' },
    { value: 'jubail', label: { ar: 'الجبيل', en: 'Jubail' }, country: 'sa' },
    { value: 'yanbu', label: { ar: 'ينبع', en: 'Yanbu' }, country: 'sa' },
  ];

  // Areas within governorates
  const getAreasByGovernorate = (governorate) => {
    const areasMap = {
      // Saudi Arabia Areas
      riyadh: [
        { value: 'olaya', label: { ar: 'العليا', en: 'Olaya' } },
        { value: 'malaz', label: { ar: 'الملز', en: 'Malaz' } },
        { value: 'al_nakheel', label: { ar: 'النخيل', en: 'Al Nakheel' } },
        { value: 'al_wurud', label: { ar: 'الورود', en: 'Al Wurud' } },
        { value: 'al_hamra', label: { ar: 'الحمراء', en: 'Al Hamra' } },
        { value: 'al_rabwah', label: { ar: 'الربوة', en: 'Al Rabwah' } },
        { value: 'al_khaleej', label: { ar: 'الخليج', en: 'Al Khaleej' } },
        { value: 'al_suwaidi', label: { ar: 'السويدي', en: 'Al Suwaidi' } },
        { value: 'al_naseem', label: { ar: 'النسيم', en: 'Al Naseem' } },
        { value: 'al_malqa', label: { ar: 'الملكة', en: 'Al Malqa' } },
      ],
      jeddah: [
        { value: 'corniche', label: { ar: 'الكورنيش', en: 'Corniche' } },
        { value: 'al_hamra', label: { ar: 'الحمراء', en: 'Al Hamra' } },
        { value: 'al_shati', label: { ar: 'الشاطئ', en: 'Al Shati' } },
        { value: 'al_rawdah', label: { ar: 'الروضة', en: 'Al Rawdah' } },
        { value: 'al_balad', label: { ar: 'البلد', en: 'Al Balad' } },
        { value: 'al_salamah', label: { ar: 'السلامة', en: 'Al Salamah' } },
        { value: 'al_aziziyah', label: { ar: 'العزيزية', en: 'Al Aziziyah' } },
        { value: 'al_kandarah', label: { ar: 'الكندرة', en: 'Al Kandarah' } },
        { value: 'al_safa', label: { ar: 'الصفا', en: 'Al Safa' } },
        { value: 'al_nuzhah', label: { ar: 'النزهة', en: 'Al Nuzhah' } },
      ],
      dammam: [
        { value: 'corniche', label: { ar: 'الكورنيش', en: 'Corniche' } },
        { value: 'al_fanateer', label: { ar: 'الفناتير', en: 'Al Fanateer' } },
        { value: 'al_aziziyah', label: { ar: 'العزيزية', en: 'Al Aziziyah' } },
        { value: 'al_hamra', label: { ar: 'الحمراء', en: 'Al Hamra' } },
        { value: 'al_rabea', label: { ar: 'الربيع', en: 'Al Rabea' } },
        { value: 'al_nakheel', label: { ar: 'النخيل', en: 'Al Nakheel' } },
        { value: 'al_manar', label: { ar: 'المنار', en: 'Al Manar' } },
      ],
      madinah: [
        { value: 'al_haram', label: { ar: 'الحرم', en: 'Al Haram' } },
        { value: 'al_ansar', label: { ar: 'الأنصار', en: 'Al Ansar' } },
        { value: 'al_awali', label: { ar: 'العوالي', en: 'Al Awali' } },
        { value: 'al_aziziyah', label: { ar: 'العزيزية', en: 'Al Aziziyah' } },
        { value: 'al_ghamama', label: { ar: 'الغمامة', en: 'Al Ghamama' } },
      ],
      makkah: [
        { value: 'al_haram', label: { ar: 'الحرم', en: 'Al Haram' } },
        { value: 'al_aziziyah', label: { ar: 'العزيزية', en: 'Al Aziziyah' } },
        { value: 'al_shisha', label: { ar: 'الششة', en: 'Al Shisha' } },
        { value: 'al_hudda', label: { ar: 'الحدة', en: 'Al Hudda' } },
        { value: 'al_jarwal', label: { ar: 'الجاروال', en: 'Al Jarwal' } },
      ],
      khobar: [
        { value: 'corniche', label: { ar: 'الكورنيش', en: 'Corniche' } },
        { value: 'al_hamra', label: { ar: 'الحمراء', en: 'Al Hamra' } },
        { value: 'al_aziziyah', label: { ar: 'العزيزية', en: 'Al Aziziyah' } },
        { value: 'al_rabea', label: { ar: 'الربيع', en: 'Al Rabea' } },
        { value: 'al_nakheel', label: { ar: 'النخيل', en: 'Al Nakheel' } },
      ],
      taif: [
        { value: 'al_hawiyah', label: { ar: 'الحوية', en: 'Al Hawiyah' } },
        { value: 'al_shafa', label: { ar: 'الشفا', en: 'Al Shafa' } },
        { value: 'al_aziziyah', label: { ar: 'العزيزية', en: 'Al Aziziyah' } },
      ],
      abha: [
        { value: 'al_soudah', label: { ar: 'السودة', en: 'Al Soudah' } },
        { value: 'al_aziziyah', label: { ar: 'العزيزية', en: 'Al Aziziyah' } },
        { value: 'al_rabea', label: { ar: 'الربيع', en: 'Al Rabea' } },
      ],
      jubail: [
        { value: 'al_fanateer', label: { ar: 'الفناتير', en: 'Al Fanateer' } },
        { value: 'al_aziziyah', label: { ar: 'العزيزية', en: 'Al Aziziyah' } },
        { value: 'al_corniche', label: { ar: 'الكورنيش', en: 'Al Corniche' } },
      ],
      yanbu: [
        { value: 'al_balad', label: { ar: 'البلد', en: 'Al Balad' } },
        { value: 'al_aziziyah', label: { ar: 'العزيزية', en: 'Al Aziziyah' } },
        { value: 'al_corniche', label: { ar: 'الكورنيش', en: 'Al Corniche' } },
      ],
      // Egyptian Areas
      cairo: [
        { value: 'new_cairo', label: { ar: 'القاهرة الجديدة', en: 'New Cairo' } },
        { value: 'madinet_nasr', label: { ar: 'مدينة نصر', en: 'Madinet Nasr' } },
        { value: 'zamalek', label: { ar: 'الزمالك', en: 'Zamalek' } },
        { value: 'maadi', label: { ar: 'المعادي', en: 'Maadi' } },
        { value: 'heliopolis', label: { ar: 'مصر الجديدة', en: 'Heliopolis' } },
        { value: 'nasr_city', label: { ar: 'مدينة نصر', en: 'Nasr City' } },
        { value: 'downtown', label: { ar: 'وسط البلد', en: 'Downtown' } },
      ],
      giza: [
        { value: '6_october', label: { ar: '6 أكتوبر', en: '6 October' } },
        { value: 'sheikh_zayed', label: { ar: 'الشيخ زايد', en: 'Sheikh Zayed' } },
        { value: 'new_giza', label: { ar: 'نيو جيزة', en: 'New Giza' } },
        { value: 'pyramids', label: { ar: 'أهرامات', en: 'Pyramids' } },
        { value: 'dokki', label: { ar: 'الدقي', en: 'Dokki' } },
        { value: 'mohandessin', label: { ar: 'المهندسين', en: 'Mohandessin' } },
      ],
      alexandria: [
        { value: 'stanley', label: { ar: 'ستانلي', en: 'Stanley' } },
        { value: 'sidi_bishr', label: { ar: 'سيدي بشر', en: 'Sidi Bishr' } },
        { value: 'montaza', label: { ar: 'المنتزة', en: 'Montaza' } },
        { value: 'smouha', label: { ar: 'سموحة', en: 'Smouha' } },
        { value: 'gleem', label: { ar: 'جليم', en: 'Gleem' } },
      ],
      sharm: [
        { value: 'old_sharm', label: { ar: 'شرم الشيخ القديمة', en: 'Old Sharm' } },
        { value: 'naama_bay', label: { ar: 'خليج نعمة', en: 'Naama Bay' } },
        { value: 'hadaba', label: { ar: 'الهضبة', en: 'Hadaba' } },
      ],
      hurghada: [
        { value: 'dahar', label: { ar: 'الدahar', en: 'Dahar' } },
        { value: 'sakala', label: { ar: 'السقالة', en: 'Sakala' } },
        { value: 'village_road', label: { ar: 'طريق القرى', en: 'Village Road' } },
      ],
      north_coast: [
        { value: 'marina', label: { ar: 'مارينا', en: 'Marina' } },
        { value: 'hacienda', label: { ar: 'هاسييندا', en: 'Hacienda' } },
        { value: 'sidi_abdel_rahman', label: { ar: 'سيدي عبد الرحمن', en: 'Sidi Abdel Rahman' } },
      ],
    };
    return areasMap[governorate] || [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sell form submitted:', formData);
    // Handle form submission here
    alert(language === 'ar' ? 'تم إرسال النموذج بنجاح!' : 'Form submitted successfully!');
  };

  const availableAreas = formData.location ? getAreasByGovernorate(formData.location) : [];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary via-primary-soft to-primary-muted text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t(translations.title)}
          </h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'بيع وحدتك العقارية بسهولة وأمان مع أفضل الخدمات'
              : 'Sell your property unit easily and safely with the best services'}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Three Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Step 1 */}
            <div className={`bg-white rounded-2xl p-6 shadow-md transition-all duration-300 ${currentStep === 1 ? 'ring-4 ring-gold shadow-xl transform scale-105' : 'hover:shadow-lg'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 ${currentStep === 1 ? 'bg-gold scale-110' : 'bg-blue-600'}`}>
                  1
                </div>
                <div className={`font-semibold transition-colors ${currentStep === 1 ? 'text-gold' : 'text-blue-600'}`}>
                  {t(translations.step)}
                </div>
              </div>
              <h3 className="text-xl font-bold text-textPrimary mb-2">
                {t(translations.step1Title)}
              </h3>
              <p className="text-textSecondary text-sm leading-relaxed">
                {t(translations.step1Subtitle)}
              </p>
            </div>

            {/* Step 2 */}
            <div className={`bg-white rounded-2xl p-6 shadow-md transition-all duration-300 ${currentStep === 2 ? 'ring-4 ring-gold shadow-xl transform scale-105' : 'hover:shadow-lg'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 ${currentStep === 2 ? 'bg-gold scale-110' : 'bg-blue-600'}`}>
                  2
                </div>
                <div className={`font-semibold transition-colors ${currentStep === 2 ? 'text-gold' : 'text-blue-600'}`}>
                  {t(translations.step)}
                </div>
              </div>
              <h3 className="text-xl font-bold text-textPrimary mb-2">
                {t(translations.step2Title)}
              </h3>
              <p className="text-textSecondary text-sm leading-relaxed">
                {t(translations.step2Subtitle)}
              </p>
            </div>

            {/* Step 3 */}
            <div className={`bg-white rounded-2xl p-6 shadow-md transition-all duration-300 ${currentStep === 3 ? 'ring-4 ring-gold shadow-xl transform scale-105' : 'hover:shadow-lg'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 ${currentStep === 3 ? 'bg-gold scale-110' : 'bg-blue-600'}`}>
                  3
                </div>
                <div className={`font-semibold transition-colors ${currentStep === 3 ? 'text-gold' : 'text-blue-600'}`}>
                  {t(translations.step)}
                </div>
              </div>
              <h3 className="text-xl font-bold text-textPrimary mb-2">
                {t(translations.step3Title)}
              </h3>
              <p className="text-textSecondary text-sm leading-relaxed">
                {t(translations.step3Subtitle)}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-borderColor">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
                {t(translations.fillForm)}
              </h2>
              <div className="flex items-center gap-2 text-textSecondary mb-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm md:text-base">
                  {t(translations.privacy)}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-semibold text-textPrimary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t(translations.name)} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-gold text-textPrimary bg-white transition-all duration-200"
                    placeholder={t(translations.name)}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className={`block text-sm font-semibold text-textPrimary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t(translations.phoneNumber)} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.phoneCode}
                      onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                      className="px-3 py-3 border-2 border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-gold bg-white text-textPrimary transition-all duration-200"
                    >
                      {phoneCodes.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.country} {item.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="flex-1 px-4 py-3 border-2 border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-gold text-textPrimary bg-white transition-all duration-200"
                      placeholder={t(translations.phoneNumber)}
                    />
                  </div>
                </div>

                {/* Governorate */}
                <div>
                  <label className={`block text-sm font-semibold text-textPrimary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t(translations.location)} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value, area: '' })}
                    required
                    className="w-full px-4 py-3 border-2 border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-gold text-textPrimary bg-white transition-all duration-200"
                  >
                    <option value="">{t(translations.location)}</option>
                    <optgroup label={language === 'ar' ? '🇪🇬 مصر' : '🇪🇬 Egypt'}>
                      {governorates.filter(g => g.country === 'eg').map((gov) => (
                        <option key={gov.value} value={gov.value}>
                          {t(gov.label)}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={language === 'ar' ? '🇸🇦 السعودية' : '🇸🇦 Saudi Arabia'}>
                      {governorates.filter(g => g.country === 'sa').map((gov) => (
                        <option key={gov.value} value={gov.value}>
                          {t(gov.label)}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className={`block text-sm font-semibold text-textPrimary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t(translations.area)} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    required
                    disabled={!formData.location}
                    className="w-full px-4 py-3 border-2 border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-gold text-textPrimary bg-white disabled:bg-bgSection disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <option value="">{t(translations.area)}</option>
                    {availableAreas.map((area) => (
                      <option key={area.value} value={area.value}>
                        {t(area.label)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit Type */}
                <div>
                  <label className={`block text-sm font-semibold text-textPrimary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t(translations.unitType)} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.unitType}
                    onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-gold text-textPrimary bg-white transition-all duration-200"
                  >
                    <option value="">{t(translations.unitType)}</option>
                    {unitTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {t(type.label)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-semibold text-textPrimary mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(translations.description)}
                </label>
                <textarea
                  rows="6"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-gold text-textPrimary bg-white resize-none transition-all duration-200"
                  placeholder={t(translations.description)}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-16 py-4 text-lg font-semibold bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold text-gold-foreground transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {t(translations.submit)}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
