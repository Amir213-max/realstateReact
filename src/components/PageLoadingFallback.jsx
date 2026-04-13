const STORAGE_LANG = 'lang';

function getStoredLang() {
  if (typeof window === 'undefined') return 'ar';
  try {
    const v = window.localStorage.getItem(STORAGE_LANG);
    return v === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
}

export default function PageLoadingFallback() {
  const lang = getStoredLang();
  const label = lang === 'en' ? 'Loading page…' : 'جاري تحميل الصفحة…';

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center bg-bgSection px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-borderColor border-t-gold" />
      <p className="text-sm font-medium text-textSecondary">{label}</p>
    </div>
  );
}
