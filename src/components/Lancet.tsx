import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A photo framed in a pointed Gothic (lancet) window with a hairline tracery outline.
 * Size it with className (e.g. "aspect-[3/5] w-full"). Muted until its `group` parent is hovered.
 */
export default function Lancet({
  src,
  alt,
  sizes,
  className,
  imgClassName,
  priority,
  alive = false,
  children,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Show the photo in full colour instead of muted */
  alive?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="lancet absolute inset-0 overflow-hidden bg-vault">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("specimen-img object-cover group-hover:scale-105", alive && "is-alive", imgClassName)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-crypt/70 via-transparent to-transparent" />
        {children}
      </div>
      {/* Tracery outline, inset slightly from the mask edge */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)] text-bone/30 transition-colors duration-700 group-hover:text-blood-400/80"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 100V34C0 14 22 4 50 0c28 4 50 14 50 34v66z"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
