import type { Scene } from '@/engine/types';
import { s01Forest } from './s01-forest';
import { s02Cave } from './s02-cave';

export const scenes: Record<string, Scene> = {
  's01-forest': s01Forest,
  's02-cave': s02Cave,
};