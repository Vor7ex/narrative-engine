import type { AssetSource } from './primitives';
import type { Trigger } from './trigger';

export type DialogueLine = {
  id?: string;
  text: string;
  avatarAsset?: AssetSource;
  speed?: number;
};

export function resolveLineId(
  line: DialogueLine,
  dialogueId: string,
  nodeId: string,
  lineIndex: number
): string {
  return line.id ?? `${dialogueId}-${nodeId}-${lineIndex}`;
}

export type DialogueNode = {
  id: string;
  lines: DialogueLine[];
  responses?: DialogueResponse[];
  onComplete?: Trigger;
};

export type DialogueResponse = {
  label: string;
  nextNodeId?: string;
  onSelect?: Trigger;
};

export type DialogueScene = {
  id: string;
  background?: import('./background').Background;
  avatar?: import('./sprite').Sprite;
  rootNodeId: string;
  nodes: Record<string, DialogueNode>;
};