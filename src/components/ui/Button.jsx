import { clsx } from 'clsx';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary:
      'bg-primary text-white hover:bg-gold hover:text-primary transition-all duration-300',
    secondary:
      'bg-gold text-gold-foreground hover:bg-primary hover:text-white transition-all duration-300',
    outline:
      'border-2 border-primary text-textPrimary hover:bg-primary hover:text-white transition-all duration-300',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={clsx(
        'font-semibold rounded-lg',
        props.disabled && 'opacity-60 cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
