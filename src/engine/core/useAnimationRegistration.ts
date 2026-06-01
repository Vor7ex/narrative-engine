import { useEffect } from 'react';
import { useAnimationControls } from 'framer-motion';
import { registerAnimation, unregisterAnimation } from './AnimationRegistry';
import type { EngineAnimationControls } from '@/engine/types';

export function useAnimationRegistration(id: string): EngineAnimationControls {
  const controls = useAnimationControls();

  useEffect(() => {
    if (!id) {
      console.warn('[useAnimationRegistration] Intentando registrar sin ID');
      return;
    }
    registerAnimation(id, controls as EngineAnimationControls);
    return () => unregisterAnimation(id);
  }, [id, controls]);

  return controls;
}