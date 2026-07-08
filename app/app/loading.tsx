import Emblem from "../components/Emblem";

export default function AppLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      {/* Medallion loader — sized with clamp so it breathes on mobile too. */}
      <div
        className="relative mb-7 flex items-center justify-center"
        style={{ width: "clamp(140px, 38vw, 168px)", height: "clamp(140px, 38vw, 168px)" }}
      >

        {/* Diffused glow */}
        <div className="ximo-ring-glow absolute rounded-full" style={{ inset: "-4px" }} />

        {/* Spinning accent arc */}
        <div className="ximo-ring-spin absolute inset-0 rounded-full" style={{
          border: "2px solid transparent",
          borderTopColor: "#1ECECE",
          borderRightColor: "rgba(30,206,206,0.3)",
        }} />

        {/* Complete outer ring */}
        <div className="absolute rounded-full" style={{
          inset: "5px",
          border: "1.5px solid rgba(30,206,206,0.4)",
          boxShadow: "inset 0 0 18px rgba(30,206,206,0.12)",
        }} />

        {/* Logo medallion — Emblem crops past the PNG's transparent padding so
            the mark itself fills the ring (a raw <Image> renders it tiny). */}
        <div
          className="overflow-hidden rounded-full"
          style={{ width: "91%", height: "91%", boxShadow: "0 0 24px rgba(30,206,206,0.25)" }}
        >
          <Emblem size={168} rounded style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Cargando Ximo</p>
      <p className="mt-1.5 text-xs" style={{ color: "var(--text-2)" }}>
        Preparando tu centro de mando deportivo
      </p>
    </div>
  );
}
