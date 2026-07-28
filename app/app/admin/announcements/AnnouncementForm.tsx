import { FieldLabel } from "../../components/ui";

const TIMEZONES = [
  { value: "America/New_York", label: "Este de EE. UU. (America/New_York)" },
  { value: "America/Chicago", label: "Central de EE. UU. (America/Chicago)" },
  { value: "America/Denver", label: "Montaña de EE. UU. (America/Denver)" },
  { value: "America/Los_Angeles", label: "Pacífico de EE. UU. (America/Los_Angeles)" },
  { value: "America/Mexico_City", label: "Ciudad de México (America/Mexico_City)" },
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
  title: string;
  description: string;
  date: string;
  time: string;
  timezone: string;
  discord_link: string;
}

export default function AnnouncementForm({
  action,
  defaults,
  hiddenId,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: AnnouncementFormDefaults;
  hiddenId?: string;
}) {
  return (
    <form action={action} className="space-y-4">
      {hiddenId && <input type="hidden" name="id" value={hiddenId} />}

      <div>
        <FieldLabel>Título</FieldLabel>
        <input
          name="title"
          defaultValue={defaults?.title}
          required
          placeholder="Sesión en vivo: dudas de recruiting"
          className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
          style={inputStyle}
        />
      </div>

      <div>
        <FieldLabel>Descripción</FieldLabel>
        <textarea
          name="description"
          defaultValue={defaults?.description}
          required
          rows={4}
          placeholder="De qué trata la sesión, quién la da y qué se puede preguntar."
          className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
          style={inputStyle}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <FieldLabel>Fecha</FieldLabel>
          <input
            type="date"
            name="date"
            defaultValue={defaults?.date}
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
            defaultValue={defaults?.timezone ?? "America/New_York"}
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

      <div>
        <FieldLabel>Link de Discord</FieldLabel>
        <input
          type="url"
          name="discord_link"
          defaultValue={defaults?.discord_link}
          required
          placeholder="https://discord.gg/..."
          className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
          style={inputStyle}
        />
      </div>

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
          Publicar avisa a todos los usuarios de inmediato.
        </p>
      </div>
    </form>
  );
}
