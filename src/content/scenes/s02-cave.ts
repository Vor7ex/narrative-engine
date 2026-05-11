import type { Scene } from '@/engine/types';

export const s02Cave: Scene = {
  id: 's02-cave',
  background: {
    id: 'bg-cave',
    asset: {
      kind: 'image',
      src: '/assets/backgrounds/forest-night.jpg',
    },
  },
  sprites: [
    {
      id: 'cat-sprite',
      asset: {
        kind: 'image',
        src: '/assets/characters/cat.png',
      },
      position: { x: 55, y: 45 },
      size: { width: 30, height: 10 },
      zIndex: 10,
      hitbox: { offsetX: 0, offsetY: 0, width: 100, height: 100 },
      onTap: {
        trigger: { type: 'navigate-dialogue', dialogueId: 'd02-cat' },
      },
      onHover: {
        trigger: { type: 'set-flag', key: 'hovered-cat', value: true },
      },
    },
    {
      id: 'penguin-interactive',
      asset: {
        kind: 'lottie',
        src: '/assets/lottie/penguin-with-binoculars.json',
        loop: true,
        autoplay: true,
      },
      position: { x: 15, y: 40 },
      size: { width: 25, height: 10 },
      zIndex: 5,
      hitbox: { offsetX: 0, offsetY: 0, width: 100, height: 100 },
      onTap: {
        condition: (state) => state.flags.metPenguin === true,
        trigger: { type: 'navigate-dialogue', dialogueId: 'd01-intro' },
      },
      onHover: {
        trigger: { type: 'set-flag', key: 'hovered-penguin', value: true },
      },
    },
  ],
  ui: [
    {
      id: 'scene-change',
      label: 'Scene 01',
      position: { x: 85, y: 5 },
      onTap: {
        trigger: { type: 'navigate-scene', sceneId: 's01-forest' },
      },
    },
  ],
  transition: 'fade',
};