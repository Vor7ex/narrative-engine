import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, AudioState } from '../types';

const initialAudioState: AudioState = {
  ambientSrc: null,
  musicSrc: null,
  muted: false,
};

const initialState: GameState = {
  currentSceneId: '',
  activeDialogueId: null,
  flags: {},
  visitedScenes: [],
  audio: initialAudioState,
};

interface GameStateActions {
  set: (partial: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => void;
  reset: () => void;
}

export const useGameStateStore = create<GameState & GameStateActions>()(
  persist(
    (set) => ({
      ...initialState,
      set: (partial) =>
        set((prev) =>
          typeof partial === 'function' ? { ...prev, ...partial(prev) } : { ...prev, ...partial }
        ),
      reset: () => set(initialState),
    }),
    {
      name: 'narrative-engine-state',
    }
  )
);

export const useGameState = () => useGameStateStore();
export const useCurrentScene = () => useGameStateStore((s) => s.currentSceneId);
export const useActiveDialogue = () => useGameStateStore((s) => s.activeDialogueId);
export const useFlags = () => useGameStateStore((s) => s.flags);
export const setGameState = (partial: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => 
  useGameStateStore.getState().set(partial);
export const resetGameState = () => useGameStateStore.getState().reset();