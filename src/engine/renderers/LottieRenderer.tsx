'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import type { AssetSource } from '@/engine/types';

interface LottieRendererProps {
  asset: Extract<AssetSource, { kind: 'lottie' }>;
  className?: string;
}

export function LottieRenderer({ asset, className }: LottieRendererProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(asset.src)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${asset.src}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch((err) => console.error('[LottieRenderer]', err));

    return () => { cancelled = true; };
  }, [asset.src]);

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop={asset.loop ?? true}
      autoplay={asset.autoplay ?? true}
      className={className}
    />
  );
}
