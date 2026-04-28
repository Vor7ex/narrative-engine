import type { AssetSource } from '@/engine/types';
import Image from 'next/image';

interface ImageRendererProps {
  asset: Extract<AssetSource, { kind: 'image' }>;
  className?: string;
  priority?: boolean;
}

export function ImageRenderer({ asset, className, priority = false }: ImageRendererProps) {
  return (
    <Image
      src={asset.src}
      alt=""
      fill
      className={className}
      loading="lazy"
      priority={priority}
    />
  );
}