'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Button from '../ui/Button';

export default function VerifyConsultantModal({ isOpen, onClose }) {
  const { language, t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const isRTL = language === 'ar';

  const translations = {
    title: { ar: 'تحقق من مستشارك العقاري', en: 'Verify Your Real Estate Consultant' },
    description: { 
      ar: 'تأكد إن ممثلك هو مستشار رسمي لـ Yafel من خلال التحقق من رقم تليفونه', 
      en: 'Make sure your representative is an official Yafel consultant by verifying their phone number' 
    },
    phoneLabel: { ar: 'رقم هاتف مستشارك العقاري', en: 'Your Real Estate Consultant\'s Phone Number' },
    phonePlaceholder: { ar: '0100123456', en: '0100123456' },
    verify: { ar: 'تحقق', en: 'Verify' },
    cancel: { ar: 'إلغاء', en: 'Cancel' },
    verifying: { ar: 'جاري التحقق...', en: 'Verifying...' },
    verified: { ar: 'تم التحقق بنجاح', en: 'Verified Successfully' },
    notVerified: { ar: 'المستشار غير مسجل', en: 'Consultant Not Registered' },
    verifiedMessage: { 
      ar: 'المستشار مسجل رسمياً لدى Yafel', 
      en: 'The consultant is officially registered with Yafel' 
    },
    notVerifiedMessage: { 
      ar: 'هذا الرقم غير مسجل كـ مستشار رسمي', 
      en: 'This number is not registered as an official consultant' 
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll randomly verify
      // In production, this would call your API
      const isVerified = Math.random() > 0.3; // 70% chance of verification
      setVerificationResult(isVerified);
      setIsVerifying(false);
    }, 1500);
  };

  const handleClose = () => {
    setPhone('');
    setVerificationResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-slideUp ${isRTL ? 'rtl' : 'ltr'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[#1e1e1e] mb-3 text-center">
            {t(translations.title)}
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6 text-center text-sm leading-relaxed">
            {t(translations.description)}
          </p>

          {/* Verification Result */}
          {verificationResult !== null && (
            <div className={`mb-6 p-4 rounded-xl ${
              verificationResult 
                ? 'bg-green-50 border-2 border-green-200' 
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {verificationResult ? (
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <div>
                  <p className={`font-semibold ${
                    verificationResult ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {verificationResult ? t(translations.verified) : t(translations.notVerified)}
                  </p>
                  <p className={`text-sm ${
                    verificationResult ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {verificationResult ? t(translations.verifiedMessage) : t(translations.notVerifiedMessage)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-semibold text-[#1e1e1e] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t(translations.phoneLabel)}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t(translations.phonePlaceholder)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[#1e1e1e] bg-white transition-all duration-200"
                required
                disabled={isVerifying}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
              >
                {t(translations.cancel)}
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? t(translations.verifying) : t(translations.verify)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
