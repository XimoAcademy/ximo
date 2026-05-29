export default function AppLoading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center"
      style={{ background: "transparent" }}
    >
      {/* Circular glow ring */}
      <div className="relative mb-7 flex h-28 w-28 items-center justify-center">

        {/* Outer glow */}
        <div
          className="ximo-ring-glow absolute inset-0 rounded-full"
          style={{ background: "transparent" }}
        />

        {/* Static ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1.5px solid rgba(30,206,206,0.25)" }}
        />

        {/* Spinning arc */}
        <div
          className="ximo-ring-spin absolute inset-0 rounded-full"
          style={{
            border: "1.5px solid transparent",
            borderTopColor: "rgba(30,206,206,0.8)",
            borderRightColor: "rgba(30,206,206,0.3)",
          }}
        />

        {/* Inner ring */}
        <div
          className="absolute rounded-full"
          style={{ inset: "8px", border: "0.5px solid rgba(30,206,206,0.12)" }}
        />

        {/* Center teal dot */}
        <div
          className="ximo-glow-pulse h-2 w-2 rounded-full"
          style={{ background: "#1ECECE" }}
        />
      </div>

      <p className="text-sm font-bold" style={{ color: "#F5F5F0" }}>
        Cargando Ximo…
      </p>
      <p className="mt-1.5 text-xs" style={{ color: "rgba(245,245,240,0.35)" }}>
        Preparando tu centro de mando deportivo.
      </p>
    </div>
  );
}
