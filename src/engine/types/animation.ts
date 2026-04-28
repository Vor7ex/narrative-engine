import type { Trigger } from './trigger';

export type AnimatableProps = {
  x?: number | string;
  y?: number | string;
  scale?: number;
  opacity?: number;
  rotate?: number;
};

export type AnimationStep = {
  target: string;
  to: AnimatableProps;
  duration?: number;
  ease?: string;
  delay?: number;
};

export type AnimationSequence = {
  steps: AnimationStep[];
  onComplete?: Trigger;
};