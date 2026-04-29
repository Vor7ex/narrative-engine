'use client';

import { SceneEngine, useCurrentScene } from '@/engine';
import { BackgroundAmbient } from '@/engine';
import { scenes } from '@/content/scenes';
import { dialogues } from '@/content/dialogues';

export default function GamePage() {
  const currentSceneId = useCurrentScene();
  const currentScene = scenes[currentSceneId];

  return (
    <>
      {currentScene && (
        <BackgroundAmbient background={currentScene.background.asset} />
      )}
      <main className="flex items-center justify-center w-full h-screen">
        <SceneEngine scenes={scenes} dialogues={dialogues} />
      </main>
    </>
  );
}