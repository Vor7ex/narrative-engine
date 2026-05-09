'use client';

import { motion } from 'framer-motion';
import type { Sprite } from '@/engine/types';
import { triggerSystem } from '@/engine/core/TriggerSystem';
import { ImageRenderer } from './ImageRenderer';
import { LottieRenderer } from './LottieRenderer';

interface SpriteRendererProps {
  sprite: Sprite;
  debug?: boolean;
}

type HitboxRect = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

const DEFAULT_HITBOX: HitboxRect = { offsetX: 0, offsetY: 0, width: 100, height: 100 };

function isPointInHitbox(
  clientX: number,
  clientY: number,
  hitbox: HitboxRect,
  spriteRect: DOMRect
): boolean {
  const hitboxLeft = spriteRect.left + (hitbox.offsetX / 100) * spriteRect.width;
  const hitboxTop = spriteRect.top + (hitbox.offsetY / 100) * spriteRect.height;
  const hitboxWidth = (hitbox.width / 100) * spriteRect.width;
  const hitboxHeight = (hitbox.height / 100) * spriteRect.height;

  return (
    clientX >= hitboxLeft &&
    clientX <= hitboxLeft + hitboxWidth &&
    clientY >= hitboxTop &&
    clientY <= hitboxTop + hitboxHeight
  );
}

export function SpriteRenderer({ sprite, debug }: SpriteRendererProps) {
  const { position, size, zIndex } = sprite;
  const width = size.width;
  const height = size.height;
  const objectFit = height ? 'fill' : 'contain';
  const hitbox = sprite.hitbox ?? DEFAULT_HITBOX;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sprite.onTap) return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();

    if (isPointInHitbox(e.clientX, e.clientY, hitbox, rect)) {
      triggerSystem.dispatchConditional(sprite.onTap);
    }
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sprite.onHover) return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();

    if (isPointInHitbox(e.clientX, e.clientY, hitbox, rect)) {
      triggerSystem.dispatchConditional(sprite.onHover);
    }
  };

  return (
    <motion.div
      className={`absolute ${(sprite.onHover || sprite.onTap) ? 'cursor-pointer' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${width}%`,
        height: height ? `${height}%` : 'auto',
        aspectRatio: height ? undefined : '1/1',
        zIndex,
      }}
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
      {debug && (
        <div
          className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none"
          style={{
            left: `${hitbox.offsetX}%`,
            top: `${hitbox.offsetY}%`,
            width: `${hitbox.width}%`,
            height: `${hitbox.height}%`,
          }}
        />
      )}
    </motion.div>
  );
}
