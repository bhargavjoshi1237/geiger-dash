// The suite's fixed grid wash, masked to the top of the viewport.
// "default" is the landing-page strength; "subtle" is the quieter one the
// account pages use so a dense card layout doesn't fight the grid.
const VARIANTS = {
  default:
    "bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]",
  subtle:
    "bg-[linear-gradient(to_right,#80808014_1px,transparent_1px),linear-gradient(to_bottom,#80808014_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_50%,transparent_100%)]",
};

export function GridBackdrop({ variant = "default" }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 bg-[size:24px_24px] ${
        VARIANTS[variant] || VARIANTS.default
      }`}
    />
  );
}

export default GridBackdrop;
