import type { Background } from './background';
import type { Sprite } from './sprite';
import type { UIElement } from './ui';
import type { Trigger } from './trigger';

export type SceneTransition = 'fade' | 'slide-left' | 'slide-right' | 'zoom-in' | 'dissolve';

export type SceneAudio = {
  ambient?: string;
  music?: string;
  onEnterSfx?: string;
};

export type Scene = {
  id: string;
  background: Background;
  sprites?: Sprite[];
  ui?: UIElement[];
  transition?: SceneTransition;
  audio?: SceneAudio;
  onEnter?: Trigger;
};