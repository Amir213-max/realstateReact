import { Component } from 'react';

function getStoredLang() {
  if (typeof window === 'undefined') return 'ar';
  try {
    return window.localStorage.getItem('lang') === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
}

const COPY = {
  ar: {
    heading: 'حدث خطأ غير متوقع',
    hint: 'يمكنك إعادة تحميل الصفحة أو العودة للرئيسية.',
    reload: 'إعادة التحميل',
    home: 'الرئيسية',
  },
  en: {
    heading: 'Something went wrong',
    hint: 'Try reloading the page or return to the home page.',
    reload: 'Reload page',
    home: 'Home',
  },
};

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const lang = getStoredLang();
      const c = COPY[lang];

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bgSection px-4 py-16">
          <div className="w-full max-w-md rounded-2xl border border-borderColor bg-canvas p-8 text-center shadow-lg">
            <div
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-gold"
              aria-hidden
            >
              !
            </div>
            <h1 className="text-xl font-bold text-textPrimary">{c.heading}</h1>
            <p className="mt-2 text-sm text-textSecondary">{c.hint}</p>
            {this.state.error?.message ? (
              <p className="mt-4 rounded-lg bg-bgSection p-3 text-left text-xs text-textSecondary break-words">
                {this.state.error.message}
              </p>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-primary"
              >
                {c.reload}
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 text-sm font-semibold text-textPrimary transition-colors hover:bg-primary hover:text-white"
              >
                {c.home}
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
