'use client';

import { AnimatePresence, motion } from 'framer-motion';

export const SCENE_TRANSITION_DURATION = 0.4;

interface SceneTransitionProps {
  children: React.ReactNode;
  sceneId: string;
}

export function SceneTransition({ children, sceneId }: SceneTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sceneId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: SCENE_TRANSITION_DURATION, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}