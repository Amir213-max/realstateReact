import { clsx } from 'clsx';

export default function Badge({
  children,
  variant = 'primary',
  className = '',
}) {
  const variants = {
    primary: 'bg-primary text-white',
    secondary: 'bg-gold text-gold-foreground',
    light: 'bg-bgSection text-textPrimary',
    sand: 'bg-gold/90 text-gold-foreground',
    success: 'bg-emerald-600 text-white',
    muted: 'bg-textSecondary text-white',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
