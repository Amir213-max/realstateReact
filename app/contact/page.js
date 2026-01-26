'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const isRTL = language === 'ar';

  const translations = {
    title: { ar: 'اتصل بنا', en: 'Contact Us' },
    subtitle: {
      ar: 'نحن هنا لمساعدتك في العثور على عقارك المثالي',
      en: 'We are here to help you find your perfect property',
    },
    getInTouch: { ar: 'تواصل معنا', en: 'Get in Touch' },
    contactInfo: { ar: 'معلومات الاتصال', en: 'Contact Information' },
    name: { ar: 'الاسم', en: 'Name' },
    email: { ar: 'البريد الإلكتروني', en: 'Email' },
    phone: { ar: 'رقم الهاتف', en: 'Phone' },
    subject: { ar: 'الموضوع', en: 'Subject' },
    message: { ar: 'رسالتك', en: 'Your Message' },
    send: { ar: 'إرسال', en: 'Send Message' },
    address: { ar: 'العنوان', en: 'Address' },
    addressValue: {
      ar: 'الرياض، المملكة العربية السعودية',
      en: 'Riyadh, Saudi Arabia',
    },
    emailValue: { ar: 'info@yafel.com', en: 'info@yafel.com' },
    phoneValue: { ar: '+966 50 123 4567', en: '+966 50 123 4567' },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

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

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-[#1e1e1e] mb-8">
                {t(translations.getInTouch)}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1e1e1e] mb-2">
                    {t(translations.name)}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-[#cfcfcf] rounded-lg focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1e1e1e] mb-2">
                    {t(translations.email)}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-[#cfcfcf] rounded-lg focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1e1e1e] mb-2">
                    {t(translations.phone)}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#cfcfcf] rounded-lg focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1e1e1e] mb-2">
                    {t(translations.subject)}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#cfcfcf] rounded-lg focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1e1e1e] mb-2">
                    {t(translations.message)}
                  </label>
                  <textarea
                    rows="6"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-[#cfcfcf] rounded-lg focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e]"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  {t(translations.send)}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                <h2 className="text-3xl font-bold text-[#1e1e1e] mb-8">
                  {t(translations.contactInfo)}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f0cb8e] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1e1e1e] mb-1">
                        {t(translations.address)}
                      </h3>
                      <p className="text-[#6D6D6D]">
                        {t(translations.addressValue)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f0cb8e] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1e1e1e] mb-1">
                        {t(translations.email)}
                      </h3>
                      <a
                        href={`mailto:${translations.emailValue.en}`}
                        className="text-[#6D6D6D] hover:text-[#f0cb8e] transition-colors"
                      >
                        {translations.emailValue.en}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f0cb8e] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1e1e1e] mb-1">
                        {t(translations.phone)}
                      </h3>
                      <a
                        href={`tel:${translations.phoneValue.en}`}
                        className="text-[#6D6D6D] hover:text-[#f0cb8e] transition-colors"
                      >
                        {translations.phoneValue.en}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

