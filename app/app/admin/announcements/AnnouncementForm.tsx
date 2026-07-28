import { FieldLabel, InnerTile } from "../../components/ui";
import { DIRECTO_TITULO, DIRECTO_DONDE } from "@/lib/announcements/text";

const TIMEZONES = [
  { value: "America/Mexico_City", label: "Ciudad de México (America/Mexico_City)" },
  { value: "America/New_York", label: "Este de EE. UU. (America/New_York)" },
  { value: "America/Chicago", label: "Central de EE. UU. (America/Chicago)" },
  { value: "America/Denver", label: "Montaña de EE. UU. (America/Denver)" },
  { value: "America/Los_Angeles", label: "Pacífico de EE. UU. (America/Los_Angeles)" },
  { value: "America/Bogota", label: "Bogotá (America/Bogota)" },
  { value: "America/Sao_Paulo", label: "São Paulo (America/Sao_Paulo)" },
  { value: "Europe/Madrid", label: "Madrid (Europe/Madrid)" },
  { value: "UTC", label: "UTC" },
];

const inputStyle: React.CSSProperties = {
  background: "var(--surface-hover)",
  border: "1px solid var(--border-subtle)",
  color: "var(--text)",
};

export interface AnnouncementFormDefaults {
  date: string;
  time: string;
  timezone: string;
}

export default function AnnouncementForm({
  action,
  defaults,
  hiddenId,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: AnnouncementFormDefaults;
  hiddenId?: string;
  error?: string;
}) {
  // Tope inferior del selector de fecha. Se usa AYER en UTC (no hoy) para no
  // bloquear una fecha legítima en zonas horarias por detrás de UTC; el
  // rechazo real de fechas pasadas ocurre en el servidor.
  const ayer = new Date(Date.now() - 24 * 60 * 60_000).toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-4">
      {hiddenId && <input type="hidden" name="id" value={hiddenId} />}

      {error === "pasado" && (
        <div
          className="rounded-xl px-4 py-3 text-sm font-semibold"
          style={{ background: "var(--error-bg)", color: "var(--error)", border: "1px solid var(--error)" }}
        >
          Esa fecha ya pasó. Elige una fecha y hora futuras: publicar un directo vencido avisaría a todos los
          atletas de algo que ya ocurrió.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <FieldLabel>Fecha</FieldLabel>
          <input
            type="date"
            name="date"
            defaultValue={defaults?.date}
            min={ayer}
            required
            className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <div>
          <FieldLabel>Hora de inicio</FieldLabel>
          <input
            type="time"
            name="time"
            defaultValue={defaults?.time}
            required
            className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <div>
          <FieldLabel>Zona horaria</FieldLabel>
          <select
            name="timezone"
            defaultValue={defaults?.timezone ?? "America/Mexico_City"}
            required
            className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
            style={inputStyle}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* El texto no se edita: se muestra para que sepas exactamente qué
          recibirán los atletas. Si hay que cambiarlo, se cambia en
          lib/announcements/text.ts y aplica a todos los avisos. */}
      <InnerTile className="px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>
          Lo que recibirán los atletas
        </p>
        <p className="mt-1.5 text-sm font-bold" style={{ color: "var(--text)" }}>
          🔴 {DIRECTO_TITULO} · <span style={{ color: "var(--teal)" }}>fecha y hora que elijas</span>
        </p>
        <p className="text-[12px]" style={{ color: "var(--text-2)" }}>
          {DIRECTO_DONDE}
        </p>
        <p className="mt-2 text-[10px]" style={{ color: "var(--text-3)" }}>
          El texto es siempre el mismo y no se edita. Solo cambia la fecha y la hora.
        </p>
      </InnerTile>

      <div className="flex flex-wrap items-center gap-2 border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <button
          type="submit"
          name="intent"
          value="draft"
          className="ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold"
          style={{ color: "var(--text-2)" }}
        >
          Guardar borrador
        </button>
        <button type="submit" name="intent" value="publish" className="ximo-glass-btn gold shiny text-xs">
          Publicar
        </button>
        <p className="w-full text-[10px] sm:ml-auto sm:w-auto" style={{ color: "var(--text-3)" }}>
          Publicar avisa a todos los atletas de inmediato.
        </p>
      </div>
    </form>
  );
}
