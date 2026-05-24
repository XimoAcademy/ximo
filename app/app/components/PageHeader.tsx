export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-5">
      <h1 className="text-xl font-black tracking-tight text-[#0B1F33] sm:text-2xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-[#5E7080] sm:text-[15px]">{subtitle}</p>
      )}
    </header>
  );
}
