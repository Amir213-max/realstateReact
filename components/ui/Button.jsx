import { clsx } from 'clsx';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-[#1e1e1e] text-[#efefef] hover:bg-[#353535]',
    secondary: 'bg-[#f0cb8e] text-[#1e1e1e] hover:bg-[#d8b280]',
    outline: 'border-2 border-[#1e1e1e] text-[#1e1e1e] hover:bg-[#1e1e1e] hover:text-[#efefef]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={clsx(
        'font-semibold rounded-lg transition-colors duration-200',
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
