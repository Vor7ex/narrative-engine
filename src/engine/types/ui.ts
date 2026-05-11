import type { Position } from './primitives';
import type { ConditionalTrigger } from './trigger';
import type { GameState } from './state';

export type UIButtonStyle = 'primary' | 'secondary' | 'ghost';

export type UIButton = {
  id: string;
  label: string;
  position: Position;
  onTap: ConditionalTrigger;
  onHover?: ConditionalTrigger;
  style?: UIButtonStyle;
  visible?: (state: GameState) => boolean;
  disabled?: (state: GameState) => boolean;
};

export type UIElement = UIButton;