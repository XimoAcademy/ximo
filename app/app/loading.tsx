import Image from "next/image";

export default function AppLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      {/* Medallion loader */}
      <div className="relative mb-7 flex h-[152px] w-[152px] items-center justify-center">

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

        {/* Logo medallion — sized to fill the ring (ring interior ≈ 142px) */}
        <div className="overflow-hidden rounded-full"
          style={{ width: 138, height: 138, boxShadow: "0 0 24px rgba(30,206,206,0.25)" }}>
          <Image
            src="/brand/ximo-logo.png"
            alt="Ximo"
            width={138}
            height={138}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>

      <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Cargando Ximo</p>
      <p className="mt-1.5 text-xs" style={{ color: "var(--text-2)" }}>
        Preparando tu centro de mando deportivo
      </p>
    </div>
  );
}
