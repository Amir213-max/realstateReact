import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Seo from '@/components/Seo';
import { BrandAtmosphere, BrandGlassPanel } from '@/components/ui/BrandAtmosphere';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_TO = 'info@yafel.com';

export default function ContactPage() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
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
    sending: { ar: 'جاري الإرسال…', en: 'Sending…' },
    address: { ar: 'العنوان', en: 'Address' },
    addressValue: {
      ar: 'الرياض، المملكة العربية السعودية',
      en: 'Riyadh, Saudi Arabia',
    },
    emailValue: { ar: 'info@yafel.com', en: 'info@yafel.com' },
    phoneValue: { ar: '+966 50 123 4567', en: '+966 50 123 4567' },
    errName: { ar: 'يرجى إدخال الاسم', en: 'Please enter your name' },
    errEmail: { ar: 'يرجى إدخال بريد إلكتروني صالح', en: 'Please enter a valid email' },
    errSubject: { ar: 'يرجى إدخال موضوع الرسالة', en: 'Please enter a subject' },
    errMessage: { ar: 'يرجى كتابة رسالة (10 أحرف على الأقل)', en: 'Please write a message (at least 10 characters)' },
    success: {
      ar: 'سيتم فتح بريدك لإرسال الرسالة. شكراً لتواصلك معنا.',
      en: 'Your email app will open to send the message. Thank you for reaching out.',
    },
    seoDesc: {
      ar: 'تواصل مع يافيل للعقارات الفاخرة.',
      en: 'Contact Yafel for premium real estate support.',
    },
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = t(translations.errName);
    if (!EMAIL_REGEX.test(String(formData.email).trim())) next.email = t(translations.errEmail);
    if (!formData.subject.trim()) next.subject = t(translations.errSubject);
    if (formData.message.trim().length < 10) next.message = t(translations.errMessage);
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(language === 'ar' ? 'يرجى تصحيح الحقول المميزة' : 'Please fix the highlighted fields');
      return;
    }
    setSubmitting(true);
    const body = [
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      formData.phone.trim() ? `Phone: ${formData.phone.trim()}` : null,
      '',
      formData.message.trim(),
    ]
      .filter(Boolean)
      .join('\n');
    const mailto = `mailto:${CONTACT_TO}?subject=${encodeURIComponent(formData.subject.trim())}&body=${encodeURIComponent(body)}`;
    toast.success(t(translations.success));
    setTimeout(() => {
      window.location.href = mailto;
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className={`min-h-screen bg-bgSection ${isRTL ? 'rtl' : 'ltr'}`}>
      <Seo title={t(translations.title)} description={t(translations.seoDesc)} />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <section className="bg-gradient-to-br from-primary to-primary-soft py-20 text-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t(translations.title)}</h1>
            <p className="text-xl text-white/70">{t(translations.subtitle)}</p>
          </div>
        </section>

        <BrandAtmosphere className="py-16">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <BrandGlassPanel className="p-8">
                <h2 className="text-3xl font-bold text-textPrimary mb-8">{t(translations.getInTouch)}</h2>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-textPrimary mb-2">
                      {t(translations.name)}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setFieldErrors((p) => ({ ...p, name: undefined }));
                      }}
                      className="w-full px-4 py-3 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary"
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? 'contact-name-err' : undefined}
                    />
                    {fieldErrors.name ? (
                      <p id="contact-name-err" className="mt-1 text-sm text-red-600" role="alert">
                        {fieldErrors.name}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-textPrimary mb-2">
                      {t(translations.email)}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setFieldErrors((p) => ({ ...p, email: undefined }));
                      }}
                      className="w-full px-4 py-3 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary"
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? 'contact-email-err' : undefined}
                    />
                    {fieldErrors.email ? (
                      <p id="contact-email-err" className="mt-1 text-sm text-red-600" role="alert">
                        {fieldErrors.email}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-semibold text-textPrimary mb-2">
                      {t(translations.phone)}
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-semibold text-textPrimary mb-2">
                      {t(translations.subject)}
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        setFieldErrors((p) => ({ ...p, subject: undefined }));
                      }}
                      className="w-full px-4 py-3 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary"
                      aria-invalid={!!fieldErrors.subject}
                      aria-describedby={fieldErrors.subject ? 'contact-subject-err' : undefined}
                    />
                    {fieldErrors.subject ? (
                      <p id="contact-subject-err" className="mt-1 text-sm text-red-600" role="alert">
                        {fieldErrors.subject}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-textPrimary mb-2">
                      {t(translations.message)}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        setFieldErrors((p) => ({ ...p, message: undefined }));
                      }}
                      className="w-full px-4 py-3 border border-borderColor-strong rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary"
                      aria-invalid={!!fieldErrors.message}
                      aria-describedby={fieldErrors.message ? 'contact-message-err' : undefined}
                    />
                    {fieldErrors.message ? (
                      <p id="contact-message-err" className="mt-1 text-sm text-red-600" role="alert">
                        {fieldErrors.message}
                      </p>
                    ) : null}
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    {submitting ? t(translations.sending) : t(translations.send)}
                  </Button>
                </form>
              </BrandGlassPanel>

              <div>
                <BrandGlassPanel className="mb-8 p-8">
                  <h2 className="text-3xl font-bold text-textPrimary mb-8">{t(translations.contactInfo)}</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl" aria-hidden>
                          📍
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-textPrimary mb-1">{t(translations.address)}</h3>
                        <p className="text-textSecondary">{t(translations.addressValue)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl" aria-hidden>
                          ✉️
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-textPrimary mb-1">{t(translations.email)}</h3>
                        <a
                          href={`mailto:${CONTACT_TO}`}
                          className="text-textSecondary hover:text-gold transition-colors"
                        >
                          {translations.emailValue.en}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl" aria-hidden>
                          📞
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-textPrimary mb-1">{t(translations.phone)}</h3>
                        <a
                          href={`tel:${String(translations.phoneValue.en).replace(/\s/g, '')}`}
                          className="text-textSecondary hover:text-gold transition-colors"
                        >
                          {translations.phoneValue.en}
                        </a>
                      </div>
                    </div>
                  </div>
                </BrandGlassPanel>
              </div>
            </div>
          </div>
        </BrandAtmosphere>
      </main>

      <Footer />
    </div>
  );
}
