// app/app/components/BrandAdCard.tsx — THE sponsored-ad card shown to athletes
// in "Marcas y oportunidades". The advertiser preview reuses this exact
// component so what a brand previews is pixel-for-pixel what gets published.
import { formatLabel, type BrandAd } from "@/lib/data/brands";

const CARD = { background: "var(--surface)", border: "1px solid var(--border)" } as const;

export default function BrandAdCard({ b }: { b: BrandAd }) {
  return (
    <div className="flex h-full flex-col rounded-2xl p-4 sm:p-5 ximo-lift" style={CARD}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-black" style={{ background: "var(--border)", color: "var(--teal)" }}>
          {b.brandName.slice(0, 2).toUpperCase()}
        </div>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: "rgba(201,168,76,0.14)", color: "var(--gold)" }}>Publicidad</span>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-black" style={{ color: "var(--text)" }}>{b.brandName}</h3>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {b.category && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "var(--border-subtle)", color: "var(--text-label)" }}>{b.category}</span>}
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(30,206,206,0.1)", color: "var(--teal)" }}>{formatLabel(b.format)}</span>
        </div>
        {b.title && <p className="mt-3 text-sm font-bold" style={{ color: "var(--text)" }}>{b.title}</p>}
        {b.body && <p className="mt-1.5 whitespace-pre-wrap text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>{b.body}</p>}
        {b.target_audience && <p className="mt-2 text-[11px]" style={{ color: "var(--text-label)" }}>Para: {b.target_audience}</p>}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
        <span className="text-[10px] font-bold" style={{ color: "#6ee7b7" }}>✓ Revisado por Ximo</span>
        {b.media_url && (
          <a href={b.media_url} target="_blank" rel="noopener noreferrer" className="ximo-glass-btn teal text-[11px]" style={{ padding: "0.5rem 0.9rem" }}>
            Ver oportunidad ↗
          </a>
        )}
      </div>
    </div>
  );
}
