'use client';

import type { AssetSource } from '@/engine/types';

interface BackgroundAmbientProps {
  background: AssetSource;
}

export function BackgroundAmbient({ background }: BackgroundAmbientProps) {
  const isImage = background.kind === 'image';
  const src = isImage ? background.src : '';

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: isImage ? `url(${src})` : undefined,
        backgroundSize: 'auto 100vh',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(8px)',
      }}
    />
  );
}