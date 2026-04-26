'use client';

import { useState } from 'react';

export function Avatar({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-muted">
        {fallback}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setErrored(true)}
    />
  );
}
