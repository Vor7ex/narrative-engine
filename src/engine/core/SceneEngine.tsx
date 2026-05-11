'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BackgroundAmbient } from '../renderers/BackgroundAmbient';
import { BackgroundLayer } from '../renderers/BackgroundLayer';
import { SpriteLayer } from '../renderers/SpriteLayer';
import { UILayer } from '../renderers/UILayer';
import { DialogueLayer } from '../renderers/DialogueLayer';
import { useCurrentScene } from '../core/GameStateStore';
import { useOnEnter } from '../core/useOnEnter';
import { useSyncExternalStore } from 'react';
import type { Scene, DialogueScene } from '../types';
import type { ReactNode } from 'react';

export const SCENE_TRANSITION_DURATION = 0.4;

interface SceneEngineProps {
  scenes: Record<string, Scene>;
  dialogues?: Record<string, DialogueScene>;
  children?: ReactNode;
}

function subscribeToMedia(query: string, callback: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia('(max-aspect-ratio: 9/16)').matches;
}

function getServerSnapshot() {
  return true;
}

function SceneContent({ scene, dialogues }: { scene: Scene; dialogues?: Record<string, DialogueScene> }) {
  return (
    <>
      <BackgroundLayer background={scene.background} />
      {scene.sprites && <SpriteLayer sprites={scene.sprites} debugHitboxes />}
      {scene.ui && <UILayer elements={scene.ui} />}
      <DialogueLayer dialogues={dialogues} />
    </>
  );
}

export function SceneEngine({ scenes, dialogues, children }: SceneEngineProps) {
  const currentSceneId = useCurrentScene();
  const currentScene = scenes[currentSceneId];
  const isPortrait = useSyncExternalStore(
    (callback) => subscribeToMedia('(max-aspect-ratio: 9/16)', callback),
    getSnapshot,
    getServerSnapshot
  );

  useOnEnter(currentScene?.onEnter);

  if (!currentScene) return null;

  const viewportStyle = isPortrait
    ? { width: 'min(100vw, calc(100vh * 9 / 16))', height: 'auto', aspectRatio: '9 / 16' }
    : { aspectRatio: '9 / 16', height: '100vh' };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSceneId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: SCENE_TRANSITION_DURATION, ease: 'easeInOut' }}
          className="fixed inset-0"
        >
          <BackgroundAmbient background={currentScene.background.asset} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="scene-engine relative overflow-hidden" style={viewportStyle}>
              <SceneContent scene={currentScene} dialogues={dialogues} />
              {children}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}