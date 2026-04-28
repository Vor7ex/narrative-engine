import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, AudioState } from '../types';

const initialAudioState: AudioState = {
  ambientSrc: null,
  musicSrc: null,
  muted: false,
};

interface GameStateWithActions extends GameState {
  set: (partial: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => void;
  reset: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const createInitialState = () => ({
  currentSceneId: '',
  activeDialogueId: null,
  flags: {},
  visitedScenes: [] as string[],
  audio: initialAudioState,
  _hasHydrated: false,
});

export const useGameStateStore = create<GameStateWithActions>()(
  persist(
    (set) => ({
      ...createInitialState(),
      set: (partial) =>
        set((prev) =>
          typeof partial === 'function' ? { ...prev, ...partial(prev) } : { ...prev, ...partial }
        ),
      reset: () => set(createInitialState()),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'narrative-engine-state',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useGameState = () => useGameStateStore();
export const useCurrentScene = () => useGameStateStore((s) => s.currentSceneId);
export const useActiveDialogue = () => useGameStateStore((s) => s.activeDialogueId);
export const useFlags = () => useGameStateStore((s) => s.flags);
export const hasHydrated = () => useGameStateStore.getState()._hasHydrated;
export const setGameState = (partial: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) =>
  useGameStateStore.getState().set(partial);
export const resetGameState = () => useGameStateStore.getState().reset();