import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useModal } from '../../hooks/useModal';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

export default function ContactUsModal({ isOpen, onClose }) {
  const { language, t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const isRTL = language === 'ar';

  const translations = {
    title: { ar: 'اتصل بنا', en: 'Contact Us' },
    subtitle: { ar: 'نحن هنا لمساعدتك', en: 'We are here to help you' },
    phone: { ar: 'رقم الهاتف', en: 'Phone Number' },
    comment: { ar: 'تعليق', en: 'Comment' },
    send: { ar: 'إرسال', en: 'Send' },
    cancel: { ar: 'إلغاء', en: 'Cancel' },
    success: { ar: 'تم إرسال طلبك بنجاح', en: 'Your request has been sent successfully' },
    phonePlaceholder: { ar: '05xxxxxxxx', en: '05xxxxxxxx' },
    commentPlaceholder: { ar: 'اكتب تعليقك هنا...', en: 'Write your comment here...' },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      toast.success(t(translations.success));
      setPhone('');
      setComment('');
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full  mx-auto max-h-[90vh] overflow-y-auto animate-slideUp ${isRTL ? 'rtl' : 'ltr'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#efefef]">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1e1e1e] mb-1">
                {t(translations.title)}
              </h2>
              <p className="text-sm sm:text-base text-[#6D6D6D]">
                {t(translations.subtitle)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#6D6D6D] hover:text-[#1e1e1e] transition-all duration-200 p-2 hover:bg-[#efefef] rounded-lg flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1e1e1e] mb-2 sm:mb-3">
                {t(translations.phone)}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t(translations.phonePlaceholder)}
                className="w-full px-4 py-3 sm:py-3.5 border border-[#cfcfcf] rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] text-base sm:text-lg transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1e1e1e] mb-2 sm:mb-3">
                {t(translations.comment)}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t(translations.commentPlaceholder)}
                rows={5}
                className="w-full px-4 py-3 sm:py-3.5 border border-[#cfcfcf] rounded-xl focus:ring-2 focus:ring-[#f0cb8e] focus:border-transparent text-[#1e1e1e] text-base sm:text-lg resize-none transition-all duration-200"
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
                className="flex-1 w-full sm:w-auto"
                size="lg"
              >
                {t(translations.send)}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
