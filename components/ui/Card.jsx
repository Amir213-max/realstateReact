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
        'bg-white rounded-xl shadow-md overflow-hidden',
        hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
