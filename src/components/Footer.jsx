'use client';

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';
import {
  useRegions,
  useProjectsSimple,
  useDevelopers,
  useMostBrowsedProjects,
  useSettingsGroup,
} from '@/hooks/useGraphQL';

function urlFromSettings(settings, keys, fallback) {
  if (!Array.isArray(settings) || !settings.length) return fallback;
  const by = {};
  for (const s of settings) {
    const k = String(s.key || '')
      .toLowerCase()
      .replace(/\s+/g, '_');
    const u = (s.link || s.value || '').trim();
    if (u && /^https?:\/\//i.test(u)) by[k] = u;
  }
  for (const key of keys) {
    const hit = by[key.toLowerCase()];
    if (hit) return hit;
  }
  return fallback;
}

const COLUMN_LIMIT = 12;

const SOCIAL_PLATFORMS = {
  twitter: {
    label: 'Twitter',
    aliases: ['twitter', 'x'],
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    fallback: 'https://twitter.com',
  },
  instagram: {
    label: 'Instagram',
    aliases: ['instagram', 'ig'],
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    fallback: 'https://instagram.com',
  },
  youtube: {
    label: 'YouTube',
    aliases: ['youtube', 'yt'],
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    fallback: 'https://youtube.com',
  },
  linkedin: {
    label: 'LinkedIn',
    aliases: ['linkedin'],
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    fallback: 'https://linkedin.com',
  },
  facebook: {
    label: 'Facebook',
    aliases: ['facebook', 'fb'],
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    fallback: 'https://facebook.com',
  },
};

function normalizeSocialName(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, '_').trim();
}

function ColumnLinks({ title, loading, children }) {
  const { t } = useLanguage();
  return (
    <div className="min-w-0">
      <div className="mb-4">
        <h3 className="text-textPrimary font-semibold text-sm tracking-wide">{t(title)}</h3>
        <span className="mt-2 block h-px w-10 bg-gold" aria-hidden />
      </div>
      {loading ? (
        <ul className="space-y-2 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="h-4 bg-borderColor rounded w-3/4" />
          ))}
        </ul>
      ) : (
        <ul className="space-y-2 text-[13px] leading-relaxed text-textSecondary">{children}</ul>
      )}
    </div>
  );
}

export default function Footer() {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const { regions, loading: regionsLoading } = useRegions();
  const { projects, loading: projectsLoading } = useProjectsSimple({ first: 36, page: 1 });
  const { developers, loading: developersLoading } = useDevelopers();
  const { projects: mostBrowsed, loading: mostLoading } = useMostBrowsedProjects(10);
  const { settings: footerSettings } = useSettingsGroup('footer');
  const { settings: socialSettingsPrimary } = useSettingsGroup('Social');
  const { settings: socialSettingsFallback } = useSettingsGroup('social');

  const playStoreHref = urlFromSettings(footerSettings, ['play_store', 'google_play', 'android'], 'https://play.google.com/store');
  const appStoreHref = urlFromSettings(footerSettings, ['app_store', 'ios', 'apple'], 'https://apps.apple.com');
  const socialLinks = useMemo(() => {
    const sourceSettings =
      Array.isArray(socialSettingsPrimary) && socialSettingsPrimary.length
        ? socialSettingsPrimary
        : socialSettingsFallback;
    const normalized = Array.isArray(sourceSettings) ? sourceSettings : [];
    const items = normalized
      .map((s) => {
        const name = normalizeSocialName(s.value || s.key);
        const platform = Object.values(SOCIAL_PLATFORMS).find((p) => p.aliases.includes(name));
        if (!platform) return null;
        const href = String(s.link || '').trim();
        if (!/^https?:\/\//i.test(href)) return null;
        return {
          id: `${name}-${s.id || href}`,
          label: platform.label,
          path: platform.path,
          href,
        };
      })
      .filter(Boolean);

    return items;
  }, [socialSettingsPrimary, socialSettingsFallback]);

  const regionSlice = regions.slice(0, COLUMN_LIMIT);
  const projectSlice = projects.slice(0, COLUMN_LIMIT);
  const developerSlice = developers.slice(0, COLUMN_LIMIT);

  const translations = {
    regions: { ar: 'مناطق', en: 'Regions' },
    compounds: { ar: 'كمبوندات', en: 'Compounds' },
    developers: { ar: 'مطورين', en: 'Developers' },
    mostSearched: { ar: 'الأكثر بحثاً', en: 'Most searched' },
    tagline: { ar: 'شركة عقارات', en: 'Real estate company' },
    downloadApp: { ar: 'حمل تطبيقنا', en: 'Download our app' },
    followUs: { ar: 'تابعنا', en: 'Follow us' },
    viewAll: { ar: 'عرض الكل', en: 'View all' },
  };

  return (
    <footer className={`bg-bgSection text-textPrimary border-t border-borderColor ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-10 lg:gap-x-12 pb-12 md:pb-14 border-b border-borderColor">
          <ColumnLinks title={translations.regions} loading={regionsLoading}>
            {regionSlice.map((r) => (
              <li key={r.id}>
                <Link to={`/destinations/${r.id}`} className="hover:text-gold-deep transition-colors line-clamp-2">
                  {t({ ar: r.name_ar, en: r.name_en })}
                </Link>
              </li>
            ))}
            {regions.length > COLUMN_LIMIT && (
              <li>
                <Link to="/destinations" className="text-gold-deep font-medium hover:underline text-xs">
                  {t(translations.viewAll)}
                </Link>
              </li>
            )}
          </ColumnLinks>

          <ColumnLinks title={translations.compounds} loading={projectsLoading}>
            {projectSlice.map((p) => (
              <li key={p.id}>
                <Link to={`/projects/${p.id}`} className="hover:text-gold-deep transition-colors line-clamp-2">
                  {t({ ar: p.name_ar, en: p.name_en })}
                </Link>
              </li>
            ))}
            {projects.length > COLUMN_LIMIT && (
              <li>
                <Link to="/projects" className="text-gold-deep font-medium hover:underline text-xs">
                  {t(translations.viewAll)}
                </Link>
              </li>
            )}
          </ColumnLinks>

          <ColumnLinks title={translations.developers} loading={developersLoading}>
            {developerSlice.map((d) => (
              <li key={d.id}>
                <Link to={`/developers/${d.id}`} className="hover:text-gold-deep transition-colors line-clamp-2">
                  {t({ ar: d.name_ar, en: d.name_en })}
                </Link>
              </li>
            ))}
          </ColumnLinks>

          <ColumnLinks title={translations.mostSearched} loading={mostLoading}>
            {mostBrowsed.map((p) => (
              <li key={p.id}>
                <Link to={`/projects/${p.id}`} className="hover:text-gold-deep transition-colors line-clamp-2">
                  <span className="text-textSecondary font-mono text-xs me-1">{p.id}</span>
                  {t({ ar: p.name_ar, en: p.name_en })}
                </Link>
              </li>
            ))}
          </ColumnLinks>
        </div>

        <div className="pt-10 md:pt-12">
          <div className="rounded-2xl border border-borderColor bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:justify-between lg:gap-12">
              <div className="grid w-full max-w-2xl grid-cols-1 justify-items-center gap-6 sm:max-w-none sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:justify-items-stretch sm:gap-x-8 sm:gap-y-0 lg:items-center">
                <Link
                  to="/"
                  className="flex h-[5.25rem] w-[5.25rem] shrink-0 items-center justify-center self-center rounded-full border border-borderColor bg-bgSection p-3 shadow-sm transition-shadow hover:shadow-md sm:self-start lg:self-center"
                >
                  <Logo className="[&_img]:h-11 [&_img]:w-auto [&_img]:max-w-[7.5rem]" />
                </Link>

                <div
                  className={`flex w-full min-w-0 flex-col gap-4 ${isRTL ? 'text-center sm:text-end' : 'text-center sm:text-start'}`}
                >
                  <div className="space-y-2.5">
                    <p className="text-[15px] font-medium leading-snug text-textPrimary">{t(translations.tagline)}</p>
                    <span className="inline-block h-px w-14 bg-gold" aria-hidden />
                  </div>

                  {socialLinks.length > 0 && (
                    <div
                      className={`flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2 ${
                        isRTL ? 'sm:justify-end' : 'sm:justify-start'
                      }`}
                      aria-label="Social"
                    >
                      <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-textSecondary">
                        {t(translations.followUs)}
                      </p>
                      <div
                        className={`flex flex-wrap items-center justify-center gap-2.5 ${isRTL ? 'sm:justify-end' : 'sm:justify-start'}`}
                      >
                        {socialLinks.map((item) => (
                          <SocialIcon key={item.id} href={item.href} label={item.label} path={item.path} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`relative flex min-w-0 flex-col gap-4 border-t border-borderColor pt-8 lg:border-t-0 lg:pt-0 ${
                  isRTL ? 'lg:border-e lg:pe-10' : 'lg:border-s lg:ps-10'
                }`}
              >
                <p
                  className={`text-center text-sm font-semibold tracking-wide text-textPrimary lg:text-start ${isRTL ? 'lg:text-end' : ''}`}
                >
                  {t(translations.downloadApp)}
                </p>
                <div
                  className={`flex flex-wrap items-stretch justify-center gap-3 ${isRTL ? 'lg:justify-end' : 'lg:justify-start'}`}
                >
                  <StoreButton href={playStoreHref} label="Google Play" variant="play" />
                  <StoreButton href={appStoreHref} label="App Store" variant="apple" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function StoreButton({ href, label, variant }) {
  const isPlay = variant === 'play';
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[44px] min-w-[140px] flex-1 items-center justify-center gap-2.5 rounded-xl border border-borderColor-strong bg-primary px-4 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-primary-soft sm:flex-initial sm:min-w-[158px]"
    >
      {isPlay ? (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333a1.497 1.497 0 0 1-1.524.043L14.5 12.707zm3.199-3.198l3.23 1.874a1.5 1.5 0 0 1 0 2.598l-3.23 1.874-2.58-2.58 2.58-2.58zM5.864 1.658L16.802 7.99l-2.302 2.302L5.864 1.658z"
          />
        </svg>
      ) : (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
          />
        </svg>
      )}
      <span className="leading-tight">{label}</span>
    </a>
  );
}

function SocialIcon({ href, label, path }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-borderColor bg-white text-primary transition-colors hover:border-gold hover:bg-bgSection hover:text-gold-deep"
    >
      <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d={path} />
      </svg>
    </a>
  );
}
