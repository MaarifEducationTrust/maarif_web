import React, { useState } from 'react';
import { getOptimizedImageUrl } from '../../lib/media';
import { ImageOff, ExternalLink } from 'lucide-react';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  fallbackText?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackText = 'Image unavailable',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const optimizedUrl = getOptimizedImageUrl(src);

  if (!optimizedUrl || hasError) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 rounded-lg border border-stone-200/60 ${containerClassName || className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="w-8 h-8 mb-2 opacity-50 text-stone-500" />
        <span className="text-xs text-stone-500 text-center font-medium">{alt || fallbackText}</span>
        {src && (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 hover:underline"
          >
            <span>Open Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <img
        src={optimizedUrl}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse" />
      )}
    </div>
  );
};
