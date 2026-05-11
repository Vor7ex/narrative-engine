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
  sprites: [
    {
      id: 'penguin-sprite',
      asset: {
        kind: 'image',
        src: '/assets/characters/penguin.png',
      },
      position: { x: -5, y: 0 },
      size: { width: 120 },
      zIndex: 8,
    },
    {
      id: 'lottie-penguin',
      asset: {
        kind: 'lottie',
        src: '/assets/lottie/penguin-with-binoculars.json',
        loop: true,
        autoplay: true,
      },
      position: { x: 0, y: 0 },
      size: { width: 100, height: 20 },
      zIndex: 15,
    },
  ],
  ui: [
    {
      id: 'scene-change-button',
      label: 'Scene 02',
      position: { x: 75, y: 5 },
      onTap: {
        trigger: { type: 'navigate-scene', sceneId: 's02-cave' },
      },
    },
  ],
  transition: 'dissolve',
  onEnter: {
    type: 'navigate-dialogue',
    dialogueId: 'd01-intro',
  },
};
