import Image from "next/image";

export default function AppLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      {/* Ring — 160px */}
      <div className="relative mb-7 flex h-[160px] w-[160px] items-center justify-center">
        <div className="absolute inset-0 rounded-full ximo-ring-glow"
          style={{ border: "1.5px solid rgba(30,206,206,0.22)" }} />
        <div className="ximo-ring-spin absolute inset-0 rounded-full" style={{
          border: "2px solid transparent",
          borderTopColor: "rgba(30,206,206,0.85)",
          borderRightColor: "rgba(30,206,206,0.3)",
        }} />
        <div className="absolute rounded-full" style={{ inset:"10px", border:"0.5px solid rgba(30,206,206,0.1)" }} />
        {/* Logo fills inner space (~140px wide) */}
        <div className="relative z-10 flex items-center justify-center px-5">
          <Image
            src="/brand/ximo-logo.png"
            alt="Ximo"
            width={120}
            height={40}
            className="w-[120px] h-auto object-contain"
            style={{ filter: "drop-shadow(0 0 14px rgba(30,206,206,0.5))" }}
            priority
          />
        </div>
      </div>
      <p className="text-sm font-bold" style={{ color:"#F5F5F0" }}>Cargando Ximo…</p>
      <p className="mt-1.5 text-xs" style={{ color:"rgba(245,245,240,0.35)" }}>
        Preparando tu centro de mando deportivo.
      </p>
    </div>
  );
}
