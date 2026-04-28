import type { AssetSource, Position, Size, Hitbox } from './primitives';
import type { AnimatableProps } from './animation';
import type { ConditionalTrigger } from './trigger';

export type Sprite = {
  id: string;
  asset: AssetSource;
  position: Position;
  size: Size;
  zIndex: number;
  hitbox?: Hitbox;
  onTap?: ConditionalTrigger;
  onHover?: ConditionalTrigger;
  initial?: AnimatableProps;
};