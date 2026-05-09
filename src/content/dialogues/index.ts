import type { DialogueScene } from '@/engine/types';
import { d01Intro } from './d01-intro';
import { d02Cat } from './d02-cat';

export const dialogues: Record<string, DialogueScene> = {
  'd01-intro': d01Intro,
  'd02-cat': d02Cat,
};