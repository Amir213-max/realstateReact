import { clsx } from 'clsx';

/**
 * Soft brand wash + warm gold glow (reference: Home assistance / contact identity).
 * Gold emphasis sits at the physical top-left so it matches marketing screenshots in LTR and RTL.
 */
const RADIAL_OVERLAY_STYLE = {
  backgroundImage: `radial-gradient(ellipse 75% 55% at 12% 0%, rgba(201, 169, 110, 0.2), transparent 58%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(17, 17, 17, 0.04), transparent 50%),
    radial-gradient(ellipse 50% 35% at 50% 100%, rgba(201, 169, 110, 0.06), transparent 45%)`,
};

/**
 * @param {{
 *   children: React.ReactNode;
 *   className?: string;
 *   as?: 'section' | 'div';
 * }} props
 */
export function BrandAtmosphere({ children, className, as }) {
  const Tag = as === 'div' ? 'div' : 'section';
  return (
    <Tag className={clsx('relative isolate overflow-hidden', className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-bgSection via-white to-bgSection" aria-hidden />
      {/* Primary identity glow — top-left (viewport), matches brand reference art */}
      <div
        className="pointer-events-none absolute -left-[18%] -top-32 h-[22rem] w-[22rem] rounded-full bg-gold/35 blur-3xl sm:-left-[12%] sm:h-[26rem] sm:w-[26rem]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 end-[-8%] h-72 w-72 rounded-full bg-primary/15 blur-3xl sm:h-96 sm:w-96"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.92]"
        style={RADIAL_OVERLAY_STYLE}
        aria-hidden
      />
      {children}
    </Tag>
  );
}

/**
 * @param {{ children: React.ReactNode; className?: string; variant?: 'solid' | 'glass' }} props
 * `solid` — opaque white card (default), matches printed-style brand panels.
 * `glass` — frosted glass for hero-style overlays.
 */
export function BrandGlassPanel({ children, className, variant = 'solid' }) {
  const base =
    variant === 'glass'
      ? 'rounded-2xl border border-white/80 bg-white/55 shadow-[0_25px_60px_-12px_rgba(17,17,17,0.14)] backdrop-blur-xl ring-1 ring-black/[0.04]'
      : 'rounded-2xl border border-borderColor/40 bg-white shadow-[0_25px_60px_-12px_rgba(17,17,17,0.12)] ring-1 ring-black/[0.03]';
  return <div className={clsx(base, className)}>{children}</div>;
}

/**
 * Reusable closing strip: brand atmosphere + centered panel (contact CTAs, cross-links).
 */
export function BrandPageClosing({ children, className }) {
  return (
    <BrandAtmosphere className={clsx('py-14 sm:py-20', className)}>
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <BrandGlassPanel variant="solid" className="px-6 py-10 text-center sm:px-10 sm:py-12">
          {children}
        </BrandGlassPanel>
      </div>
    </BrandAtmosphere>
  );
}
