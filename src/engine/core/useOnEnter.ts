'use client';

import { useEffect, useRef } from 'react';
import type { Trigger } from '@/engine/types';
import { triggerSystem } from './TriggerSystem';
import { useCurrentScene } from './GameStateStore';

export function useOnEnter(trigger?: Trigger) {
  const currentSceneId = useCurrentScene();
  const hasEnteredRef = useRef<string | null>(null);

  useEffect(() => {
    if (!trigger || hasEnteredRef.current === currentSceneId) return;

    hasEnteredRef.current = currentSceneId;
    triggerSystem.dispatch(trigger);
  }, [currentSceneId, trigger]);
}