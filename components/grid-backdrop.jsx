// The suite's fixed grid wash, masked to the top of the viewport.
// "default" is the landing-page strength; "subtle" is the quieter one the
// account pages use so a dense card layout doesn't fight the grid.
// `scrolls` pins it to the top of the page instead, so it scrolls away with the content.
const VARIANTS = {
  default:
    "bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]",
  subtle:
    "bg-[linear-gradient(to_right,#80808014_1px,transparent_1px),linear-gradient(to_bottom,#80808014_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_50%,transparent_100%)]",
};

export function GridBackdrop({ variant = "default", scrolls = false, className = "" }) {
  return (
    <div
      className={`pointer-events-none z-0 bg-[size:24px_24px] ${
        scrolls ? "absolute inset-x-0 top-0 h-screen" : "fixed inset-0"
      } ${
        VARIANTS[variant] || VARIANTS.default
      } ${className}`}
    />
  );
}

export default GridBackdrop;
