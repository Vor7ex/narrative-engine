import type { AssetSource } from '@/engine/types';
import Image from 'next/image';

interface ImageRendererProps {
  asset: Extract<AssetSource, { kind: 'image' }>;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function ImageRenderer({ asset, className, priority = false, sizes }: ImageRendererProps) {
  return (
    <Image
      src={asset.src}
      alt=""
      fill
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}