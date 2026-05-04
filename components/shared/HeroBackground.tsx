/**
 * Full-bleed hero background — dawn over the Ganges in Rishikesh, with a
 * slow Ken Burns drift and two layered ink gradients so foreground text
 * stays legible at any viewport.
 *
 * Drop inside any `relative` parent; absolute inset-0 makes it fill.
 */
export default function HeroBackground() {
  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-traveler.jpg"
        alt="A woman watching dawn over the Ganges in Rishikesh"
        className="h-full w-full object-cover object-center animate-ken"
      />
      {/* Layered overlays for depth + text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/40" />
    </div>
  );
}
