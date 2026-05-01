'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface LottieRendererProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export function LottieRenderer({ src, loop = true, autoplay = true, className }: LottieRendererProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${src}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch((err) => console.error('[LottieRenderer]', err));

    return () => { cancelled = true; };
  }, [src]);

  if (!animationData) return null;

  return (
    <div className="relative w-full h-full pointer-events-none">
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        className={className}
      />
    </div>
  );
}
