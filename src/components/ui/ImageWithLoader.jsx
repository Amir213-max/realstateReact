'use client';

import { useState, useEffect } from 'react';

export default function ImageWithLoader({ 
  src, 
  alt, 
  fill = false,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  loading = 'lazy',
  onError,
  unoptimized: _unoptimized,
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(false);
    } else {
      setIsLoading(true);
      setHasError(false);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <div className={fill ? 'absolute inset-0' : `relative ${className}`}>
      {isLoading && !hasError && src && (
        <div className="absolute inset-0 bg-gradient-to-r from-bgSection via-borderColor to-bgSection animate-shimmer">
          <div className="absolute inset-0 bg-bgSection opacity-50"></div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 bg-bgSection flex items-center justify-center">
          <svg className="w-12 h-12 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {!src && !hasError && (
        <div className="absolute inset-0 bg-bgSection flex items-center justify-center">
          <svg className="w-12 h-12 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {src && (
        <img
          src={src}
          alt={alt || ''}
          loading={priority ? undefined : loading}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${fill ? className : ''} ${fill ? 'w-full h-full object-cover' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
}

