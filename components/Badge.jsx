import { clsx } from 'clsx';

export default function Badge({ 
  children, 
  variant = 'primary',
  className = '' 
}) {
  const variants = {
    primary: 'bg-[#1e1e1e] text-[#efefef]',
    secondary: 'bg-[#f0cb8e] text-[#1e1e1e]',
    light: 'bg-[#efefef] text-[#1e1e1e]',
    sand: 'bg-[#f0cb8e] text-[#1e1e1e]',
  };

  return (
    <span className={clsx(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
