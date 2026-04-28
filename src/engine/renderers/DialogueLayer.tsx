'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useGameStateStore } from '../core/GameStateStore';
import type { DialogueScene } from '@/engine/types';
import { DialogueBox } from '../dialogue/DialogueBox';

interface DialogueLayerProps {
  dialogues?: Record<string, DialogueScene>;
}

export function DialogueLayer({ dialogues }: DialogueLayerProps) {
  const activeDialogueId = useGameStateStore((state) => state.activeDialogueId);

  if (!activeDialogueId) {
    return null;
  }

  if (!dialogues) {
    console.warn('[DialogueLayer] dialogues prop not provided');
    return null;
  }

  const dialogue = dialogues[activeDialogueId];

  if (!dialogue) {
    console.warn(`[DialogueLayer] Dialogue "${activeDialogueId}" not found`);
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-[var(--z-dialogue)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] border-t-4 border-black"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        >
          <DialogueBox dialogue={dialogue} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}