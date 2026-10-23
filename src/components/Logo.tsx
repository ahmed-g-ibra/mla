import Image from 'next/image';

/**
 * The MLA lockup.
 *
 * The compact variant — icon plus wordmark, no tagline — is what appears in
 * the chrome. The supplied full lockup needs about 350px of width before its
 * tagline stops being legible, which no header has to give; dropping the
 * tagline leaves the icon's own strokes as the limit, and those hold far
 * smaller. The brand line is set as live text beside it instead, so it stays
 * selectable, translatable and readable by a screen reader.
 *
 * `unoptimized` keeps the SVG out of the image pipeline — there is nothing for
 * a raster optimiser to do with vector art, and it avoids having to allow SVG
 * through the optimizer at all.
 */
export function Logo({
  variant = 'light',
  height = 40,
  className = '',
  priority = false,
}: {
  /** 'dark' is for the lapis footer: cream wordmark, lightened gold. */
  variant?: 'light' | 'dark';
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const src =
    variant === 'dark'
      ? '/brand/logo-compact-dark.svg'
      : '/brand/logo-compact.svg';

  // Native artboard is 573 × 283.
  const width = Math.round((height * 573) / 283);

  return (
    <Image
      src={src}
      alt="MLA"
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
