import type { DialogueScene } from '@/engine/types';

export const d02Cat: DialogueScene = {
  id: 'd02-cat',
  rootNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      lines: [
        { text: 'A mysterious black cat appears from the shadows!' },
        { text: 'It looks at you with knowing eyes.', speed: 40 },
      ],
      responses: [
        { label: 'Pet the cat', nextNodeId: 'n2-pet' },
        { label: 'Ignore it' },
      ],
    },
    'n2-pet': {
      id: 'n2-pet',
      lines: [{ text: 'The cat purrs contentedly and rubs against your leg.', speed: 30 }],
      onComplete: { type: 'set-flag', key: 'petCat', value: true },
    },
  },
};