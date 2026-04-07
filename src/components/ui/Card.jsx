import { clsx } from 'clsx';

export default function Card({
  children,
  className = '',
  hover = false,
  ...props
}) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-borderColor shadow-sm overflow-hidden',
        hover &&
          'transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-borderColor-strong',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
