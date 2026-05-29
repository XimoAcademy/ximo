export default function AppLoading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ background: "#07131F" }}
    >
      {/* Spinner */}
      <div className="relative mb-8 h-14 w-14">
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1.5px solid rgba(47,127,134,0.1)" }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1.5px solid transparent",
            borderTopColor: "#2F7F86",
            borderRightColor: "rgba(201,168,76,0.5)",
            animation: "ximo-spin-slow 1.4s cubic-bezier(0.4,0,0.6,1) infinite",
          }}
        />
        <div
          className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full"
          style={{ background: "#2F7F86", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        />
      </div>

      <p className="text-sm font-bold" style={{ color: "#F5F5F0" }}>
        Cargando Ximo…
      </p>
      <p className="mt-1.5 text-xs" style={{ color: "rgba(245,245,240,0.35)" }}>
        Preparando tu centro de mando deportivo.
      </p>

      {/* Progress shimmer */}
      <div
        className="mt-6 h-px w-32 overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="ximo-shimmer h-full w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(47,127,134,0.6), transparent)" }}
        />
      </div>
    </div>
  );
}
