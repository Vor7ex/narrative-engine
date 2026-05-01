'use client';

import { motion } from 'framer-motion';
import type { Sprite } from '@/engine/types';
import { ImageRenderer } from './ImageRenderer';
import { LottieRenderer } from './LottieRenderer';

interface SpriteRendererProps {
  sprite: Sprite;
}

export function SpriteRenderer({ sprite }: SpriteRendererProps) {
  const { position, size, zIndex } = sprite;
  const width = size.width;
  const height = size.height ?? (width * 1.5);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${width}%`,
        height: `${height}%`,
        zIndex,
      }}
    >
      {sprite.asset.kind === 'image' ? (
        <ImageRenderer src={sprite.asset.src} className="w-full h-full" />
      ) : (
        <LottieRenderer
          src={sprite.asset.src}
          loop={sprite.asset.loop}
          autoplay={sprite.asset.autoplay}
          className="w-full h-full"
        />
      )}
    </motion.div>
  );
}
