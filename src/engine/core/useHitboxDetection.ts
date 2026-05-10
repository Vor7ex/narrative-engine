'use client';

import { useCallback } from 'react';
import type { ConditionalTrigger } from '@/engine/types';
import { triggerSystem } from './TriggerSystem';

export type HitboxRect = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export const DEFAULT_HITBOX: HitboxRect = { offsetX: 0, offsetY: 0, width: 100, height: 100 };

function isPointInHitbox(clientX: number, clientY: number, hitbox: HitboxRect, spriteRect: DOMRect): boolean {
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

export function useHitboxDetection(
  hitbox: HitboxRect,
  onTap?: ConditionalTrigger,
  onHover?: ConditionalTrigger
) {
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!onTap) return;

      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();

      if (isPointInHitbox(e.clientX, e.clientY, hitbox, rect)) {
        void triggerSystem.dispatchConditional(onTap);
      }
    },
    [hitbox, onTap]
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!onHover) return;

      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();

      if (isPointInHitbox(e.clientX, e.clientY, hitbox, rect)) {
        void triggerSystem.dispatchConditional(onHover);
      }
    },
    [hitbox, onHover]
  );

  return { handlePointerDown, handlePointerEnter };
}