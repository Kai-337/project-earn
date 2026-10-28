import React, { useId } from "react";

interface IdeaVaultLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "hero";
  className?: string;
}

const SIZE_MAP: Record<NonNullable<IdeaVaultLogoProps["size"]>, string> = {
  xs: "h-6 w-6",
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  hero: "h-20 w-20 sm:h-24 sm:w-24",
};

/**
 * IdeaVault Signature Emblem:
 * An octagonal precision steel-and-gold bank vault bezel housing a luminous
 * lightbulb chamber with a central vault keyhole & 4-point idea spark.
 */
export const IdeaVaultLogo: React.FC<IdeaVaultLogoProps> = ({
  size = "sm",
  className = "",
}) => {
  const uid = useId().replace(/:/g, "");
  const rimId = `iv-rim-${uid}`;
  const chamberId = `iv-chamber-${uid}`;
  const bulbId = `iv-bulb-${uid}`;
  const glowId = `iv-glow-${uid}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${SIZE_MAP[size]} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-[0_4px_14px_rgba(245,158,11,0.28)]"
      >
        <defs>
          <linearGradient id={rimId} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id={chamberId} x1="14" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1F2937" />
            <stop offset="45%" stopColor="#111827" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>
          <linearGradient id={bulbId} x1="20" y1="14" x2="44" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="48%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <radialGradient id={glowId} cx="32" cy="27" r="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Brushed-Gold Octagonal Vault Bezel */}
        <polygon
          points="21,3.5 43,3.5 60.5,21 60.5,43 43,60.5 21,60.5 3.5,43 3.5,21"
          fill={`url(#${rimId})`}
        />

        {/* Inner Obsidian Vault Door */}
        <polygon
          points="22.6,7.5 41.4,7.5 56.5,22.6 56.5,41.4 41.4,56.5 22.6,56.5 7.5,41.4 7.5,22.6"
          fill={`url(#${chamberId})`}
        />

        {/* Subtle Ambient Chamber Glow */}
        <circle cx="32" cy="29" r="19" fill={`url(#${glowId})`} />

        {/* Precision Combination Dial Ticks */}
        <circle
          cx="32"
          cy="31"
          r="20.5"
          stroke="#FBBF24"
          strokeOpacity="0.42"
          strokeWidth="1.35"
          strokeDasharray="2.6 3.1"
        />

        {/* 4 Heavy Vault Locking Bolts (N, S, E, W) */}
        <rect x="30.2" y="6" width="3.6" height="5.2" rx="1.2" fill="#FEF3C7" />
        <rect x="30.2" y="52.8" width="3.6" height="5.2" rx="1.2" fill="#D97706" />
        <rect x="6" y="29.2" width="5.2" height="3.6" rx="1.2" fill="#FBBF24" />
        <rect x="52.8" y="29.2" width="5.2" height="3.6" rx="1.2" fill="#FBBF24" />

        {/* Lightbulb Idea Dome Fused into the Vault Core */}
        <path
          d="M32 13.8C24.27 13.8 18 19.85 18 27.3C18 32.18 20.68 36.44 24.72 38.76C25.62 39.28 26.2 40.22 26.2 41.26V43C26.2 44 27 44.8 28 44.8H36C37 44.8 37.8 44 37.8 43V41.26C37.8 40.22 38.38 39.28 39.28 38.76C43.32 36.44 46 32.18 46 27.3C46 19.85 39.73 13.8 32 13.8Z"
          fill={`url(#${bulbId})`}
        />

        {/* Combination Tumbler Screw Threads at Bulb Base */}
        <rect x="27" y="46.6" width="10" height="2.2" rx="1.1" fill="#FBBF24" />
        <rect x="28.8" y="49.8" width="6.4" height="2" rx="1" fill="#D97706" />

        {/* Negative-Space Vault Keyhole Carved Inside the Idea Bulb */}
        <circle cx="32" cy="26.3" r="4.4" fill="#09090B" />
        <path d="M29.75 29L28.35 37.4H35.65L34.25 29H29.75Z" fill="#09090B" />

        {/* Luminous 4-Point Spark of Originality Inside the Keyhole */}
        <path
          d="M32 23.4L32.88 25.42L34.9 26.3L32.88 27.18L32 29.2L31.12 27.18L29.1 26.3L31.12 25.42L32 23.4Z"
          fill="#FEF3C7"
        />
      </svg>
    </div>
  );
};

/**
 * Canvas 2D renderer for the signature IdeaVault Vault-Bulb Keyhole logo,
 * used in the HD Promo Video Studio so exported videos carry the exact brand mark.
 */
export function drawIdeaVaultLogoOnCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void {
  ctx.save();
  const scale = size / 64;
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Outer Octagonal Gold Bezel
  const rimGrad = ctx.createLinearGradient(4, 4, 60, 60);
  rimGrad.addColorStop(0, "#FDE68A");
  rimGrad.addColorStop(0.5, "#F59E0B");
  rimGrad.addColorStop(1, "#B45309");
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.moveTo(21, 3.5);
  ctx.lineTo(43, 3.5);
  ctx.lineTo(60.5, 21);
  ctx.lineTo(60.5, 43);
  ctx.lineTo(43, 60.5);
  ctx.lineTo(21, 60.5);
  ctx.lineTo(3.5, 43);
  ctx.lineTo(3.5, 21);
  ctx.closePath();
  ctx.fill();

  // Inner Obsidian Chamber
  ctx.fillStyle = "#09090B";
  ctx.beginPath();
  ctx.moveTo(22.6, 7.5);
  ctx.lineTo(41.4, 7.5);
  ctx.lineTo(56.5, 22.6);
  ctx.lineTo(56.5, 41.4);
  ctx.lineTo(41.4, 56.5);
  ctx.lineTo(22.6, 56.5);
  ctx.lineTo(7.5, 41.4);
  ctx.lineTo(7.5, 22.6);
  ctx.closePath();
  ctx.fill();

  // Cardinal Vault Bolts
  ctx.fillStyle = "#FDE68A";
  ctx.fillRect(30.2, 6, 3.6, 5);
  ctx.fillRect(30.2, 53, 3.6, 5);
  ctx.fillRect(6, 29.2, 5, 3.6);
  ctx.fillRect(53, 29.2, 5, 3.6);

  // Golden Lightbulb Dome + Base
  const bulbGrad = ctx.createLinearGradient(20, 14, 44, 45);
  bulbGrad.addColorStop(0, "#FEF3C7");
  bulbGrad.addColorStop(0.5, "#FBBF24");
  bulbGrad.addColorStop(1, "#D97706");
  ctx.fillStyle = bulbGrad;
  ctx.beginPath();
  ctx.arc(32, 27.2, 13.8, Math.PI * 0.82, Math.PI * 0.18, false);
  ctx.lineTo(37.8, 44.5);
  ctx.lineTo(26.2, 44.5);
  ctx.closePath();
  ctx.fill();

  // Bulb Screw Ridges
  ctx.fillStyle = "#FBBF24";
  ctx.fillRect(27, 46.6, 10, 2.2);
  ctx.fillStyle = "#D97706";
  ctx.fillRect(28.8, 49.8, 6.4, 2);

  // Negative-Space Keyhole
  ctx.fillStyle = "#09090B";
  ctx.beginPath();
  ctx.arc(32, 26.3, 4.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(29.75, 29);
  ctx.lineTo(28.35, 37.4);
  ctx.lineTo(35.65, 37.4);
  ctx.lineTo(34.25, 29);
  ctx.closePath();
  ctx.fill();

  // Ivory Spark Inside Keyhole
  ctx.fillStyle = "#FEF3C7";
  ctx.beginPath();
  ctx.moveTo(32, 23.4);
  ctx.lineTo(32.9, 25.4);
  ctx.lineTo(34.9, 26.3);
  ctx.lineTo(32.9, 27.2);
  ctx.lineTo(32, 29.2);
  ctx.lineTo(31.1, 27.2);
  ctx.lineTo(29.1, 26.3);
  ctx.lineTo(31.1, 25.4);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
