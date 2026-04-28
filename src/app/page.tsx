'use client';

import { SceneEngine } from '@/engine';
import { scenes } from '@/content/scenes';
import { dialogues } from '@/content/dialogues';

export default function GamePage() {
  return (
    <main className="flex items-center justify-center w-full h-screen bg-black">
      <SceneEngine scenes={scenes} dialogues={dialogues} />
    </main>
  );
}