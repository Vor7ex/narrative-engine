'use client';

import type { Sprite } from '@/engine/types';
import { SpriteRenderer } from './SpriteRenderer';

interface SpriteLayerProps {
  sprites: Sprite[];
}

export function SpriteLayer({ sprites }: SpriteLayerProps) {
  return (
    <div className="absolute inset-0 z-[var(--z-sprite)]">
      {sprites.map((sprite) => (
        <SpriteRenderer key={sprite.id} sprite={sprite} />
      ))}
    </div>
  );
}