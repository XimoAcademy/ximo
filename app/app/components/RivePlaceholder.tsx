"use client";

// app/app/components/RivePlaceholder.tsx
// Rive-ready placeholder — pure React/Tailwind, no external deps.
// Later: swap inner content for <RiveComponent src={src} /> from @rive-app/react-canvas
// Install when ready: npm install @rive-app/react-canvas

interface RivePlaceholderProps {
  title?: string;
  description?: string;
  variant?: "teal" | "gold" | "dark" | "glass";
  height?: string;
  className?: string;
  /** Future: pass the .riv file path here */
  // src?: string;
}

const VARIANT_STYLES = {
  teal: {
    bg:    "bg-gradient-to-br from-[#0B1F33] via-[#1F5F66] to-[#2F7F86]",
    glow:  "rgba(47,127,134,0.35)",
    ring:  "rgba(127,175,178,0.25)",
    dot:   "#7FAFB2",
    label: "text-[#7FAFB2]",
    orb1:  "bg-[#2F7F86]/30",
    orb2:  "bg-[#7FAFB2]/15",
  },
  gold: {
    bg:    "bg-gradient-to-br from-[#07131F] via-[#1a1400] to-[#2a1e00]",
    glow:  "rgba(201,168,76,0.3)",
    ring:  "rgba(201,168,76,0.2)",
    dot:   "#C9A84C",
    label: "text-[#C9A84C]",
    orb1:  "bg-[#C9A84C]/20",
    orb2:  "bg-[#C9A84C]/10",
  },
  dark: {
    bg:    "bg-gradient-to-br from-[#07131F] to-[#112538]",
    glow:  "rgba(47,127,134,0.2)",
    ring:  "rgba(47,127,134,0.15)",
    dot:   "#2F7F86",
    label: "text-white/40",
    orb1:  "bg-[#2F7F86]/15",
    orb2:  "bg-[#C9A84C]/8",
  },
  glass: {
    bg:    "bg-white/4 backdrop-blur-xl",
    glow:  "rgba(47,127,134,0.15)",
    ring:  "rgba(47,127,134,0.12)",
    dot:   "#2F7F86",
    label: "text-white/35",
    orb1:  "bg-white/8",
    orb2:  "bg-[#2F7F86]/10",
  },
};

export default function RivePlaceholder({
  title = "Animación interactiva",
  description = "Animación Rive próximamente",
  variant = "teal",
  height = "h-48",
  className = "",
}: RivePlaceholderProps) {
  const v = VARIANT_STYLES[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/8 ${v.bg} ${height} ${className}`}
      style={{ boxShadow: `0 0 40px ${v.glow}, inset 0 1px 0 ${v.ring}` }}
    >
      {/* Orbs */}
      <div className={`absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl ${v.orb1} ximo-glow-pulse`} />
      <div className={`absolute -bottom-4 -left-4 h-16 w-16 rounded-full blur-xl ${v.orb2} ximo-glow-pulse delay-300`} />

      {/* Floating ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-20 w-20 rounded-full border-2 border-dashed ximo-float"
          style={{ borderColor: v.dot, opacity: 0.3 }}
        />
        <div
          className="absolute h-12 w-12 rounded-full border"
          style={{ borderColor: v.dot, opacity: 0.5 }}
        />
        {/* Center dot */}
        <div className="absolute h-3 w-3 rounded-full" style={{ backgroundColor: v.dot }} />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(127,175,178,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(127,175,178,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Label */}
      <div className="absolute bottom-0 inset-x-0 p-4 text-center">
        {title && (
          <p className="text-xs font-bold text-white/60 mb-0.5">{title}</p>
        )}
        <p className={`text-[10px] font-semibold tracking-wider uppercase ${v.label}`}>
          ✦ {description}
        </p>
      </div>

      {/* Top-right badge */}
      <div className="absolute top-3 right-3">
        <span
          className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold backdrop-blur-sm"
          style={{ borderColor: `${v.dot}40`, color: v.dot, backgroundColor: `${v.dot}12` }}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: v.dot }} />
          Rive
        </span>
      </div>
    </div>
  );
}
