import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatPrice(price, currency = 'SAR') {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num) {
  return new Intl.NumberFormat('ar-SA').format(num);
}

/** Monthly rent label (EGP-style wording; amount uses locale grouping). */
export function formatMonthlyRent(price, language = 'ar') {
  if (price == null || Number.isNaN(Number(price))) return '';
  const n = Number(price);
  const formatted = formatNumber(n);
  if (language === 'ar') {
    return `${formatted} جنيه/شهر`;
  }
  return `${formatted} EGP/mo`;
}

/** Digits only: country code + national number (no +), for https://wa.me/... */
export function normalizeWhatsAppDigits(input) {
  if (input == null || input === '') return '';
  return String(input).replace(/\D/g, '');
}

/** Opens WhatsApp chat; optional prefilled message. */
export function buildWhatsAppChatUrl(digits, prefilledText) {
  const d = normalizeWhatsAppDigits(digits);
  if (!d) return '#';
  try {
    const u = new URL(`https://wa.me/${d}`);
    if (prefilledText) u.searchParams.set('text', prefilledText);
    return u.toString();
  } catch {
    return `https://wa.me/${d}${prefilledText ? `?text=${encodeURIComponent(prefilledText)}` : ''}`;
  }
}

/** Simple display for Egypt numbers starting with 20; otherwise +digits. */
export function formatWhatsAppDisplay(digits) {
  const d = normalizeWhatsAppDigits(digits);
  if (!d) return '';
  if (d.startsWith('20') && d.length >= 12) {
    const rest = d.slice(2);
    return `+20 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
  }
  return `+${d}`;
}

/**
 * Prepares user-typed phone for wa.me: strips formatting; if local Egypt style (0…), prefixes 20.
 */
export function toWhatsAppDigits(input) {
  let d = normalizeWhatsAppDigits(input);
  if (!d) return '';
  if (d.startsWith('0') && d.length >= 10 && d.length <= 11) {
    return `20${d.slice(1)}`;
  }
  return d;
}

