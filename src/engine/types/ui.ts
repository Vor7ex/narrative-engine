import type { Position } from './primitives';
import type { ConditionalTrigger } from './trigger';
import type { GameState } from './state';

export type UIButton = {
  id: string;
  label: string;
  position: Position;
  onTap: ConditionalTrigger;
  style?: 'primary' | 'secondary' | 'ghost';
  visible?: (state: GameState) => boolean;
};

export type UIElement = UIButton;