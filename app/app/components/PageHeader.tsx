export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-5">
      <h1
        className="text-xl font-black tracking-tight sm:text-2xl"
        style={{ color: "#F5F5F0" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm sm:text-[15px]" style={{ color: "rgba(127,175,178,0.55)" }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
