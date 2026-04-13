import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'Yafel — Premium Real Estate';
const DEFAULT_DESC =
  'Discover premium real estate projects, units, and destinations with Yafel. اكتشف العقارات الفاخرة مع يافيل.';

/**
 * @param {{ title?: string; description?: string }} props
 * Title/description should already match the active UI language when applicable.
 */
export default function Seo({ title, description }) {
  const { pathname } = useLocation();
  const pageTitle = title?.trim() ? `${title.trim()} | Yafel` : DEFAULT_TITLE;
  const pageDesc = description?.trim() ? description.trim() : DEFAULT_DESC;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonical = origin ? `${origin}${pathname}` : '';

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
