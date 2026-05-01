import Image from 'next/image';

interface ImageRendererProps {
  src: string;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill';
  priority?: boolean;
  sizes?: string;
}

export function ImageRenderer({ src, className, objectFit = 'contain', priority = false, sizes }: ImageRendererProps) {
  return (
    <div className="relative w-full h-full pointer-events-none">
      <Image
        src={src}
        alt=""
        fill
        className={`object-${objectFit} ${className || ''}`}
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
}
