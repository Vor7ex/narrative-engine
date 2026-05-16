'use client';

import { motion } from 'framer-motion';
import type { Background } from '@/engine/types';
import { useAnimationRegistration } from '@/engine/core/useAnimationRegistration';
import { ImageRenderer } from './ImageRenderer';
import { LottieRenderer } from './LottieRenderer';

interface BackgroundLayerProps {
  background: Background;
}

export function BackgroundLayer({ background }: BackgroundLayerProps) {
  useAnimationRegistration(background.id);

  const content = background.asset.kind === 'image'
    ? <ImageRenderer src={background.asset.src} className="w-full h-full object-cover" priority={true} sizes="(max-width: 430px) 100vw, (max-width: 1024px) 75vw, 50vw" />
    : <LottieRenderer src={background.asset.src} loop={background.asset.loop} autoplay={background.asset.autoplay} className="w-full h-full" />;

  return (
    <motion.div
      className="absolute inset-0 z-[var(--z-background)]"
      initial={background.initial}
    >
      {content}
    </motion.div>
  );
}