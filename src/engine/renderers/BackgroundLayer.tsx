'use client';

import { motion } from 'framer-motion';
import type { Background } from '@/engine/types';
import { ImageRenderer } from './ImageRenderer';
import { LottieRenderer } from './LottieRenderer';

interface BackgroundLayerProps {
  background: Background;
}

export function BackgroundLayer({ background }: BackgroundLayerProps) {
  if (background.asset.kind === 'image') {
    return (
      <motion.div
        className="absolute inset-0 z-[var(--z-background)]"
        initial={background.initial}
      >
        <ImageRenderer asset={background.asset} className="w-full h-full object-cover" priority={true} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 z-[var(--z-background)]"
      initial={background.initial}
    >
      <LottieRenderer asset={background.asset} className="w-full h-full" />
    </motion.div>
  );
}