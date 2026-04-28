import type { Scene } from '@/engine/types';

export const s01Forest: Scene = {
  id: 's01-forest',
  background: {
    id: 'bg-forest',
    asset: {
      kind: 'image',
      src: '/assets/backgrounds/forest-day.jpg',
    },
  },
  sprites: [],
  ui: [],
  transition: 'dissolve',
  onEnter: {
    type: 'navigate-dialogue',
    dialogueId: 'd01-intro',
  },
};