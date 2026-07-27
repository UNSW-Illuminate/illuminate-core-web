/**
 * Film-grain texture layered over the shader gradient.
 *
 * Sits at z-1: above the shader canvas (which has no stacking order of its own)
 * and below page content, which is z-10. The texture itself lives in
 * globals.css so the SVG noise source stays out of the render path.
 */
export default function GrainOverlay() {
  return <div aria-hidden="true" className="grain-overlay pointer-events-none fixed inset-0 z-[1]" />;
}
