import type { Trigger } from './trigger';

export type AnimatableProps = {
  x?: number | string;
  y?: number | string;
  scale?: number;
  opacity?: number;
  rotate?: number;
};

export interface AnimationOptions {
  duration?: number;
  ease?: unknown;
  delay?: number;
}

export interface EngineAnimationControls {
  start(target: unknown, options?: AnimationOptions): Promise<void>;
  stop(): void;
}

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