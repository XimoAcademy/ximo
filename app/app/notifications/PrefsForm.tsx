"use client";

import { useRef, useState } from "react";
import { saveNotificationPrefsAction } from "./actions";

function Toggle({ name, label, desc, defaultOn }: { name: string; label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
      <span className="min-w-0">
        <span className="block text-sm font-bold" style={{ color: "var(--text)" }}>{label}</span>
        <span className="block text-[11px]" style={{ color: "var(--text-label)" }}>{desc}</span>
      </span>
      <input type="checkbox" name={name} checked={on} onChange={(e) => setOn(e.target.checked)} className="hidden" />
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
        style={{ background: on ? "var(--teal)" : "var(--border-strong)" }}>
        <span className="absolute h-4.5 w-4.5 rounded-full bg-white transition-transform"
          style={{ width: 18, height: 18, transform: on ? "translateX(22px)" : "translateX(3px)" }} />
      </span>
    </label>
  );
}

export default function PrefsForm({ email, community }: { email: boolean; community: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [saved, setSaved] = useState(false);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await saveNotificationPrefsAction(fd);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }}
      className="space-y-2.5"
    >
      <Toggle name="email_notifications" label="Notificaciones por correo" desc="Recibe avisos importantes en tu correo." defaultOn={email} />
      <Toggle name="community_notifications" label="Notificaciones de comunidad" desc="Avisos sobre novedades de la comunidad Ximo." defaultOn={community} />
      <div className="flex items-center gap-3 pt-1">
        <button type="submit" className="ximo-glass-btn teal text-xs">Guardar preferencias</button>
        {saved && <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>Guardado ✓</span>}
      </div>
    </form>
  );
}
