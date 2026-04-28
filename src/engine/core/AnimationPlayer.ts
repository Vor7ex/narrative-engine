import type { AnimationSequence } from '../types';
import { getAnimationControls } from './AnimationRegistry';

export async function playAnimationSequence(sequence: AnimationSequence): Promise<void> {
  const { steps, onComplete } = sequence;

  for (const step of steps) {
    const controls = getAnimationControls(step.target) as {
      start: (target: unknown, options?: unknown) => Promise<void>;
    } | null;

    if (!controls) {
      console.warn(`[AnimationPlayer] No controls found for target: ${step.target}`);
      continue;
    }

    const { to, duration = 0.4, ease, delay = 0 } = step;

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        controls.start(to, { duration, ease, delay })
          .then(() => resolve())
          .catch(() => resolve());
      }, delay * 1000);
    });
  }

  if (onComplete) {
    const { triggerSystem } = await import('./TriggerSystem');
    triggerSystem.dispatch(onComplete);
  }
}