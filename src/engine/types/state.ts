export type AudioState = {
  ambientSrc: string | null;
  musicSrc: string | null;
  muted: boolean;
};

export type GameState = {
  currentSceneId: string;
  activeDialogueId: string | null;
  flags: Record<string, boolean>;
  visitedScenes: string[];
  audio: AudioState;
};