import { cn } from "@/lib/utils";
import {
  SA_MAP_HEIGHT,
  SA_MAP_WIDTH,
  SA_OUTLINE_PATH,
  projectToSaMap,
} from "@/lib/sa-map";

/* Map-inspired graphics. Each variant is used in one place only, so no
   background repeats across the site:
   - SaMap: South Africa outline with optional pins (Why ACOSA experience
     section, property location card)
   - ContourTexture: topographic lines (property page header)
   - ReachRings: audience-reach rings (For Properties visibility section)
   All are decorative SVG (aria-hidden) and inherit currentColor. */

export type SaMapPin = { longitude: number; latitude: number; label?: string };

export const SaMap = ({
  pins = [],
  className,
}: {
  pins?: SaMapPin[];
  className?: string;
}) => (
  <svg
    viewBox={`-10 -10 ${SA_MAP_WIDTH + 20} ${SA_MAP_HEIGHT + 20}`}
    className={cn("h-auto w-full", className)}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d={SA_OUTLINE_PATH}
      fillRule="evenodd"
      fill="currentColor"
      fillOpacity="0.06"
      stroke="currentColor"
      strokeOpacity="0.5"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {pins.map((pin) => {
      const { x, y } = projectToSaMap(pin.longitude, pin.latitude);
      return (
        <g key={`${pin.longitude},${pin.latitude}`}>
          <circle
            cx={x}
            cy={y}
            r="9"
            className="fill-gold"
            fillOpacity="0.25"
          />
          <circle
            cx={x}
            cy={y}
            r="4.5"
            className="fill-gold stroke-white"
            strokeWidth="1.5"
          />
        </g>
      );
    })}
  </svg>
);

// Deterministic contour rings: distorted circles sampled around two peaks.
function contourPath(cx: number, cy: number, radius: number, seed: number) {
  const steps = 96;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r =
      radius *
      (1 +
        0.09 * Math.sin(3 * t + seed * 0.7) +
        0.05 * Math.sin(5 * t + seed * 1.3));
    const x = cx + r * Math.cos(t) * 1.35;
    const y = cy + r * Math.sin(t);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}Z`;
}

const CONTOURS = [
  ...Array.from({ length: 9 }, (_, k) => contourPath(980, 120, 40 + k * 46, k)),
  ...Array.from({ length: 6 }, (_, k) =>
    contourPath(140, 560, 50 + k * 52, k + 4),
  ),
];

export const ContourTexture = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 1200 600"
    preserveAspectRatio="xMidYMid slice"
    className={cn(
      "pointer-events-none absolute inset-0 h-full w-full",
      className,
    )}
    aria-hidden="true"
    focusable="false"
  >
    {CONTOURS.map((d, i) => (
      <path
        key={i}
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    ))}
  </svg>
);

// Audience dots on the rings, as [ring index, angle in degrees].
const REACH_DOTS: [number, number][] = [
  [0, 35],
  [0, 215],
  [1, 80],
  [1, 160],
  [1, 300],
  [2, 20],
  [2, 130],
  [2, 245],
  [2, 330],
];
const RING_RADII = [70, 125, 180];

export const ReachRings = ({ className }: { className?: string }) => (
  <svg
    viewBox="-200 -200 400 400"
    className={cn("h-auto w-full", className)}
    aria-hidden="true"
    focusable="false"
  >
    {RING_RADII.map((r) => (
      <circle
        key={r}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.22"
      />
    ))}
    <circle
      r={RING_RADII[0]}
      className="acosa-reach-pulse stroke-gold"
      fill="none"
      strokeWidth="1.5"
    />
    {REACH_DOTS.map(([ring, deg], i) => {
      const a = (deg * Math.PI) / 180;
      const r = RING_RADII[ring];
      return (
        <circle
          key={i}
          cx={(r * Math.cos(a)).toFixed(1)}
          cy={(r * Math.sin(a)).toFixed(1)}
          r={ring === 2 ? 5 : 6}
          className={ring === 0 ? "fill-gold" : "fill-current"}
          fillOpacity={ring === 0 ? 1 : 0.55}
        />
      );
    })}
  </svg>
);
