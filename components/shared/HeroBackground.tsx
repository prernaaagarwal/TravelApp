import Image from "next/image";

/**
 * Full-bleed hero background — dawn over the Ganges in Rishikesh, with a
 * slow Ken Burns drift and two layered ink gradients so foreground text
 * stays legible at any viewport.
 *
 * Drop inside any `relative` parent; absolute inset-0 makes it fill.
 *
 * Uses next/image with `priority` because this is the LCP element on the
 * landing page — Next will preload, optimize (AVIF/WebP), and serve a
 * responsive size based on `sizes`. The raw 1.3 MB JPEG used to ship to
 * every viewport.
 */
export default function HeroBackground() {
  return (
    <div className="absolute inset-0">
      <Image
        src="/images/22178E5F-2A28-48B8-B747-7D0A5BE4E76B_1_105_c_2.JPEG"
        alt="A woman standing above the clouds at sunrise in the mountains"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center animate-ken"
      />
      {/* Layered overlays for depth + text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/40" />
    </div>
  );
}
