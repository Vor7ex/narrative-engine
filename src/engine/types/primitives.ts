export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height?: number;
};

export type Hitbox = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export type AssetSource =
  | { kind: 'image'; src: string }
  | { kind: 'lottie'; src: string; loop?: boolean; autoplay?: boolean };