import type { DialogueScene } from '@/engine/types';

export const d01Intro: DialogueScene = {
  id: 'd01-intro',
  rootNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      lines: [
        {
          text: 'Welcome to the Narrative Engine.',
          speed: 30,
        },
        {
          text: 'This is a visual novel engine powered by Next.js 16.',
          speed: 30,
        },
      ],
      onComplete: {
        type: 'set-flag',
        key: 'intro-complete',
        value: true,
      },
    },
  },
};