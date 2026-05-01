import Image from 'next/image';

interface ImageRendererProps {
  src: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function ImageRenderer({ src, className, priority = false, sizes }: ImageRendererProps) {
  return (
    <div className="relative w-full h-full pointer-events-none">
      <Image
        src={src}
        alt=""
        fill
        className={className}
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
}
