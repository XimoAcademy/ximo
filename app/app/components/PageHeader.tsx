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
        className="text-2xl font-black sm:text-3xl"
        style={{ color: "var(--text)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm sm:text-[15px]" style={{ color: "var(--text-label)" }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
