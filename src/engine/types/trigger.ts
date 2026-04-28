import type { AnimationSequence } from './animation';
import type { GameState } from './state';

export type Trigger =
  | { type: 'navigate-scene'; sceneId: string }
  | { type: 'navigate-dialogue'; dialogueId: string }
  | { type: 'play-animation'; animation: AnimationSequence }
  | { type: 'play-audio'; src: string; loop?: boolean }
  | { type: 'stop-audio' }
  | { type: 'set-flag'; key: string; value: boolean }
  | { type: 'composite'; sequence: Trigger[] };

export type ConditionalTrigger = {
  condition?: (state: GameState) => boolean;
  trigger: Trigger;
};