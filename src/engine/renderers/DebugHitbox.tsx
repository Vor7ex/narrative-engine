'use client';

import type { HitboxRect } from '@/engine/core/useHitboxDetection';

interface DebugHitboxProps {
  hitbox: HitboxRect;
}

export function DebugHitbox({ hitbox }: DebugHitboxProps) {
  return (
    <div
      className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none"
      style={{
        left: `${hitbox.offsetX}%`,
        top: `${hitbox.offsetY}%`,
        width: `${hitbox.width}%`,
        height: `${hitbox.height}%`,
      }}
    />
  );
}