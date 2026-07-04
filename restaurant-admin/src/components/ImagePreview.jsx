import React, { useState, useEffect } from 'react';
import { Image, ImageOff } from 'lucide-react';

const ImagePreview = ({ src, alt = 'Preview', className = 'w-16 h-16 rounded-xl' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src) {
    return (
      <div className={`${className} bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-slate-650`} title="No Image Provided">
        <Image size={18} />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`${className} bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-rose-500/60`} title="Image Load Error">
        <ImageOff size={18} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={`${className} object-cover border border-slate-850 bg-slate-950`}
      loading="lazy"
    />
  );
};

export default ImagePreview;
