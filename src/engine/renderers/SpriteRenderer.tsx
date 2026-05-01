'use client';

import { motion, useAnimationControls } from 'framer-motion';
import type { Sprite } from '../types';
import { ImageRenderer } from './ImageRenderer';
import { LottieRenderer } from './LottieRenderer';
import { registerAnimation, unregisterAnimation } from '../core/AnimationRegistry';
import { useEffect } from 'react';

interface SpriteRendererProps {
  sprite: Sprite;
}

export function SpriteRenderer({ sprite }: SpriteRendererProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    registerAnimation(sprite.id, controls);
    return () => unregisterAnimation(sprite.id);
  }, [sprite.id, controls]);

  const { position, size, initial } = sprite;
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
        zIndex: sprite.zIndex,
      }}
      initial={initial}
      animate={controls}
    >
      {sprite.asset.kind === 'image' ? (
        <ImageRenderer src={sprite.asset.src} className="w-full h-full" sizes={`${width}vw`} />
      ) : (
        <LottieRenderer src={sprite.asset.src} loop={sprite.asset.loop} autoplay={sprite.asset.autoplay} className="w-full h-full" />
      )}
    </motion.div>
  );
}