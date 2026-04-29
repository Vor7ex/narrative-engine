'use client';

import { useCurrentScene } from './GameStateStore';
import { BackgroundLayer } from '../renderers/BackgroundLayer';
import { SpriteLayer } from '../renderers/SpriteLayer';
import { UILayer } from '../renderers/UILayer';
import { DialogueLayer } from '../renderers/DialogueLayer';
import { useSyncExternalStore } from 'react';
import type { Scene } from '../types';
import type { DialogueScene } from '../types';
import type { ReactNode } from 'react';

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

export function SceneEngine({ scenes, dialogues, children }: SceneEngineProps) {
  const currentSceneId = useCurrentScene();
  const currentScene = scenes[currentSceneId];
  const isPortrait = useSyncExternalStore(
    (callback) => subscribeToMedia('(max-aspect-ratio: 9/16)', callback),
    getSnapshot,
    getServerSnapshot
  );

  if (!currentScene) {
    return null;
  }

  return (
    <div
      className="scene-engine relative overflow-hidden"
      style={isPortrait
        ? { width: 'min(100vw, calc(100vh * 9 / 16))', height: 'auto', aspectRatio: '9 / 16' }
        : { aspectRatio: '9 / 16', height: '100vh' }
      }
    >
      <BackgroundLayer background={currentScene.background} />

      {currentScene.sprites && (
        <SpriteLayer sprites={currentScene.sprites} />
      )}

      {currentScene.ui && (
        <UILayer elements={currentScene.ui} />
      )}

      <DialogueLayer dialogues={dialogues} />

      {children}
    </div>
  );
}