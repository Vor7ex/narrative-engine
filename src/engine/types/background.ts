import type { AssetSource } from './primitives';
import type { AnimatableProps } from './animation';

export type Background = {
  id: string;
  asset: AssetSource;
  initial?: AnimatableProps;
};