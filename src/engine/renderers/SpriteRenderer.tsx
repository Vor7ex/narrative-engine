'use client';

import { motion } from 'framer-motion';
import type { Sprite } from '@/engine/types';
import { useHitboxDetection, DEFAULT_HITBOX } from '@/engine/core/useHitboxDetection';
import { useAnimationRegistration } from '@/engine/core/useAnimationRegistration';
import { ImageRenderer } from './ImageRenderer';
import { LottieRenderer } from './LottieRenderer';
import { DebugHitbox } from './DebugHitbox';

interface SpriteRendererProps {
  sprite: Sprite;
  debug?: boolean;
}

export function SpriteRenderer({ sprite, debug }: SpriteRendererProps) {
  useAnimationRegistration(sprite.id);

  const { position, size, zIndex, onTap, onHover } = sprite;
  const width = size.width;
  const height = size.height;
  const objectFit = height ? 'fill' : 'contain';
  const hitbox = sprite.hitbox ?? DEFAULT_HITBOX;
  const { handlePointerDown, handlePointerEnter } = useHitboxDetection(hitbox, onTap, onHover);
  const isInteractive = !!(onTap || onHover);

  return (
    <motion.div
      className={`absolute ${isInteractive ? 'cursor-pointer' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${width}%`,
        height: height ? `${height}%` : 'auto',
        aspectRatio: height ? undefined : '1/1',
        zIndex,
      }}
      initial={sprite.initial}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
    >
      {sprite.asset.kind === 'image' ? (
        <ImageRenderer src={sprite.asset.src} className="w-full h-full" objectFit={objectFit} />
      ) : (
        <LottieRenderer
          src={sprite.asset.src}
          loop={sprite.asset.loop}
          autoplay={sprite.asset.autoplay}
          className="w-full h-full"
          objectFit={objectFit}
        />
      )}
      {debug && <DebugHitbox hitbox={hitbox} />}
    </motion.div>
  );
}