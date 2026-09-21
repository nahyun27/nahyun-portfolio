/**
 * Fixed gradient backdrop. Pure CSS on purpose: transform-only keyframes run on the compositor,
 * so they stay in sync with manual scrolling. Driving these orbs from JS (scroll-linked parallax
 * plus keyframes on the same axis) made them fight each other and flicker behind the glass cards.
 * Styles live in globals.css under .ambient / .orb.
 */
export default function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden>
      <span className="orb orb-a" />
      <span className="orb orb-b" />
      <span className="orb orb-c" />
      <span className="orb orb-d" />
    </div>
  );
}
