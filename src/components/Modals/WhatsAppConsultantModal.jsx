import { useState, useEffect, useId } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Button from '@/components/ui/Button';

export default function WhatsAppConsultantModal({ isOpen, onClose, whatsappNumber, projectName }) {
  const { language, t } = useLanguage();
  const [phone, setPhone] = useState('');
  const isRTL = language === 'ar';
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const translations = {
    title: { ar: 'استشارة قانونية', en: 'Legal Consultation' },
    subtitle: { ar: 'تواصل مع مستشارنا القانوني عبر واتساب', en: 'Contact our legal consultant via WhatsApp' },
    phone: { ar: 'رقم الهاتف', en: 'Phone Number' },
    send: { ar: 'فتح واتساب', en: 'Open WhatsApp' },
    cancel: { ar: 'إلغاء', en: 'Cancel' },
    phonePlaceholder: { ar: '05xxxxxxxx', en: '05xxxxxxxx' },
    message: { ar: 'أريد استشارة قانونية بخصوص', en: 'I need legal consultation regarding' },
    closeLabel: { ar: 'إغلاق', en: 'Close' },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const message = `${t(translations.message)} ${projectName || ''}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`bg-white rounded-2xl shadow-2xl w-full  mx-auto max-h-[90vh] overflow-y-auto animate-slideUp ${isRTL ? 'rtl' : 'ltr'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-borderColor">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 id={titleId} className="text-2xl sm:text-3xl font-bold text-textPrimary mb-1">
                  {t(translations.title)}
                </h2>
                <p className="text-sm sm:text-base text-textSecondary">
                  {t(translations.subtitle)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-textSecondary hover:text-textPrimary transition-all duration-200 p-2 hover:bg-bgSection rounded-lg flex-shrink-0"
              aria-label={t(translations.closeLabel)}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-textPrimary mb-2 sm:mb-3">
                {t(translations.phone)}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t(translations.phonePlaceholder)}
                className="w-full px-4 py-3 sm:py-3.5 border border-borderColor-strong rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent text-textPrimary text-base sm:text-lg transition-all duration-200"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 w-full sm:w-auto"
                size="lg"
              >
                {t(translations.cancel)}
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 w-full sm:w-auto bg-green-600 hover:bg-green-700 focus:ring-green-600"
                size="lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {t(translations.send)}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
