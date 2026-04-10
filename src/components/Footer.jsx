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
    aliases: ['facebook', 'fb', 'فيسبوك'],
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    fallback: 'https://facebook.com',
  },
  tiktok: {
    label: 'TikTok',
    aliases: ['tiktok', 'tik_tok'],
    path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.88-2.89c.16 0 .32.02.47.05V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 5 15.66a6.34 6.34 0 0 0 10.27 4.95v-7a8.16 8.16 0 0 0 4.32 1.24V9.9a4.85 4.85 0 0 1-2-.21z',
    fallback: 'https://tiktok.com',
  },
  snapchat: {
    label: 'Snapchat',
    aliases: ['snapchat', 'snap'],
    path: 'M12.206.793c.99 0 4.347.276 5.524 3.204.829 2.1.352 5.569-1.097 6.795 2.597.87 4.16 3.183.247 6.605-.995.904-2.425 1.315-4.293 1.315-2.25-.02-3.65-.598-4.888-1.503-1.433.905-3.347 1.503-5.597 1.503-1.868 0-3.298-.411-4.293-1.315-3.914-3.422-2.35-5.735.247-6.605-1.45-1.226-1.926-4.695-1.097-6.795C7.86 1.07 11.217.793 12.206.793z',
    fallback: 'https://snapchat.com',
  },
  whatsapp: {
    label: 'WhatsApp',
    aliases: ['whatsapp', 'wa', 'واتساب', 'واتس'],
    path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
    fallback: 'https://whatsapp.com',
  },
  telegram: {
    label: 'Telegram',
    aliases: ['telegram', 'tg'],
    path: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
    fallback: 'https://telegram.org',
  },
  pinterest: {
    label: 'Pinterest',
    aliases: ['pinterest', 'pin'],
    path: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z',
    fallback: 'https://pinterest.com',
  },
  generic: {
    label: 'Link',
    aliases: [],
    path: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4.9v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1s1.39-3.1 3.1-3.1h8.2V12H3.9zm16.1 0c0 1.71-1.39 3.1-3.1 3.1H13v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5H13v2h4c1.71 0 3.1 1.39 3.1 3.1z',
    fallback: '',
  },
};

function normalizeSocialName(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, '_').trim();
}

function looksLikeHttpUrl(str) {
  return /^https?:\/\//i.test(String(str || '').trim());
}

function resolveSocialHref(s) {
  const link = String(s?.link || '').trim();
  const val = String(s?.value || '').trim();
  if (looksLikeHttpUrl(link)) return link;
  if (looksLikeHttpUrl(val)) return val;
  return '';
}

/** اسم المنصة للمطابقة: لو value رابط نستخدم key، وإلا value ثم key */
function resolvePlatformToken(s) {
  const val = String(s?.value || '').trim();
  const key = String(s?.key || '').trim();
  if (looksLikeHttpUrl(val)) return normalizeSocialName(key);
  return normalizeSocialName(val || key);
}

function mergeSocialSettingRows(primary, fallback) {
  const merged = [];
  const seenId = new Set();
  const seenContent = new Set();

  for (const s of [...(Array.isArray(primary) ? primary : []), ...(Array.isArray(fallback) ? fallback : [])]) {
    if (!s) continue;

    if (s.id != null) {
      const k = `id:${s.id}`;
      if (seenId.has(k)) continue;
      seenId.add(k);
      merged.push(s);
      continue;
    }

    const key = String(s.key ?? '').trim();
    const value = String(s.value ?? '').trim();
    const link = String(s.link ?? '').trim();
    const contentKey = `${key}|${value}|${link}`;

    // صفوف من الـ API فيها group فقط (باقي الحقول فاضية) — ما ندمجهاش في صف واحد
    if (contentKey === '||') {
      merged.push(s);
      continue;
    }

    if (seenContent.has(contentKey)) continue;
    seenContent.add(contentKey);
    merged.push(s);
  }

  return merged;
}

/** لو key/value مش متطابقين مع aliases، نخمّن المنصة من الرابط */
const HREF_PLATFORM_HINTS = [
  ['wa.me', 'whatsapp'],
  ['api.whatsapp', 'whatsapp'],
  ['whatsapp.com', 'whatsapp'],
  ['tiktok.com', 'tiktok'],
  ['snapchat.com', 'snapchat'],
  ['t.me', 'telegram'],
  ['telegram.me', 'telegram'],
  ['telegram.org', 'telegram'],
  ['pinterest.', 'pinterest'],
  ['linkedin.com', 'linkedin'],
  ['youtube.com', 'youtube'],
  ['youtu.be', 'youtube'],
  ['instagram.com', 'instagram'],
  ['facebook.com', 'facebook'],
  ['fb.com', 'facebook'],
  ['twitter.com', 'twitter'],
  ['x.com', 'twitter'],
];

function platformFromHref(href) {
  const u = String(href).toLowerCase();
  for (const [sub, key] of HREF_PLATFORM_HINTS) {
    if (u.includes(sub)) return SOCIAL_PLATFORMS[key];
  }
  return null;
}

function platformMatchesToken(platform, token) {
  if (!token) return false;
  if (platform.aliases.includes(token)) return true;
  return token.split('_').some((part) => platform.aliases.includes(part));
}

function resolvePlatformForRow(s, href) {
  const token = resolvePlatformToken(s);
  const named = Object.entries(SOCIAL_PLATFORMS)
    .filter(([k]) => k !== 'generic')
    .map(([, p]) => p)
    .find((p) => platformMatchesToken(p, token));
  if (named) return named;
  const fromHref = platformFromHref(href);
  if (fromHref) return fromHref;
  return SOCIAL_PLATFORMS.generic;
}

/** لو link فاضي لكن value = اسم منصة معروفة، نستخدم رابط المنصة الافتراضي (صفحة رئيسية) */
function resolveHrefWithPlatformFallback(s) {
  let href = resolveSocialHref(s);
  const platform = resolvePlatformForRow(s, href || '');
  if (!href && platform && platform !== SOCIAL_PLATFORMS.generic) {
    const fb = String(platform.fallback || '').trim();
    if (looksLikeHttpUrl(fb)) href = fb;
  }
  return { href, platform };
}

function socialRowLabel(s, platform) {
  if (platform !== SOCIAL_PLATFORMS.generic) return platform.label;
  const fromKey = String(s.key || '')
    .replace(/_/g, ' ')
    .trim();
  if (fromKey) return fromKey;
  const tok = resolvePlatformToken(s);
  if (tok) return tok.replace(/_/g, ' ');
  return platform.label;
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
    const normalized = mergeSocialSettingRows(socialSettingsPrimary, socialSettingsFallback);
    return normalized
      .map((s, index) => {
        const { href, platform } = resolveHrefWithPlatformFallback(s);
        if (!href) return null;
        // فهرس + id + href: يمنع تكرار مفتاح React لو الـ API رجّع نفس id لأكتر من رابط
        const id = `social-${index}-${s.id ?? 'noid'}-${href}`;
        return {
          id,
          label: socialRowLabel(s, platform),
          path: platform.path,
          href,
        };
      })
      .filter(Boolean);
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
                      role="region"
                      aria-label={t(translations.followUs)}
                      className={`mt-1 w-full min-w-0 rounded-xl border border-borderColor bg-white/90 p-4 shadow-sm ring-1 ring-black/5 sm:p-5 ${
                        isRTL ? 'text-center sm:text-end' : 'text-center sm:text-start'
                      }`}
                    >
                      <div className="mb-3 flex flex-col items-center gap-1 sm:mb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-textSecondary">
                          {t(translations.followUs)}
                        </p>
                        <span className="hidden h-px flex-1 bg-borderColor sm:block" aria-hidden />
                      </div>
                      <ul className="m-0 flex w-full list-none flex-wrap items-center justify-center gap-3 p-0 sm:justify-start sm:gap-x-4 sm:gap-y-3 md:gap-x-5">
                        {socialLinks.map((item) => (
                          <li key={item.id} className="shrink-0">
                            <SocialIcon href={item.href} label={item.label} path={item.path} />
                          </li>
                        ))}
                      </ul>
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
      className="flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full border border-borderColor bg-bgSection text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/80 hover:bg-white hover:text-gold-deep hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 active:shadow-sm"
    >
      <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d={path} />
      </svg>
    </a>
  );
}
