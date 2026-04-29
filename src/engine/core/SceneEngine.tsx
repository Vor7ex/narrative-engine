'use client';

import { useCurrentScene } from './GameStateStore';
import { BackgroundLayer } from '../renderers/BackgroundLayer';
import { SpriteLayer } from '../renderers/SpriteLayer';
import { UILayer } from '../renderers/UILayer';
import { DialogueLayer } from '../renderers/DialogueLayer';
import type { Scene } from '../types';
import type { DialogueScene } from '../types';
import type { ReactNode } from 'react';

interface SceneEngineProps {
  scenes: Record<string, Scene>;
  dialogues?: Record<string, DialogueScene>;
  children?: ReactNode;
}

export function SceneEngine({ scenes, dialogues, children }: SceneEngineProps) {
  const currentSceneId = useCurrentScene();
  const currentScene = scenes[currentSceneId];

  if (!currentScene) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: '9 / 16', height: '100vh' }}
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