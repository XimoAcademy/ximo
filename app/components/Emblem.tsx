/**
 * Ximo emblem. The source PNG is a small mark centred on a large transparent
 * canvas, so rendered raw it looks tiny. We crop past the whitespace with
 * background-size/position (same technique as the sidebar) so the emblem
 * fills its box at any size.
 */
export default function Emblem({
  size = 64,
  rounded = false,
  className = "",
  style,
}: {
  size?: number;
  rounded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      role="img"
      aria-label="Ximo"
      className={className}
      style={{
        width: size,
        height: size,
        backgroundImage: "url(/brand/ximo-logo.png)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 46%",
        backgroundSize: "480%",
        borderRadius: rounded ? "9999px" : undefined,
        // Glow so the mark stays legible on any background (light or dark).
        filter: "drop-shadow(0 0 8px rgba(30,206,206,0.45)) drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
        ...style,
      }}
    />
  );
}
