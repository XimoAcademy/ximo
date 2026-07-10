"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "../../providers/ThemeProvider";
import { signOutAction } from "@/lib/auth/actions";
import { getUserSettings, saveUserSettings, getAccountSummary } from "@/lib/settings/actions";
import { saveNotificationPrefsAction } from "@/app/app/notifications/actions";
import DeleteAccountButton from "./DeleteAccountButton";
import ExportDataButton from "./ExportDataButton";

const LANGUAGES = ["Español", "English"];
const LANG_TO_CODE: Record<string, string> = { Español: "es", English: "en" };
const CODE_TO_LANG: Record<string, string> = { es: "Español", en: "English" };

const T = {
  es: {
    title: "Configuración",
    subtitle: "Ajustes de la app",
    themeTitle: "Tema visual",
    themeDesc: "Elige cómo se ve Ximo en tu pantalla. Se aplica a toda la app al instante.",
    dark: "Oscuro",
    light: "Claro",
    followSystem: "Seguir el sistema",
    active: "· activo",
    langTitle: "Preferencias de idioma",
    langDesc: "Idioma de la interfaz. Aplica al guardar cambios y recargar la página.",
    langNote: "The app will switch to US English after saving and reloading.",
    notifTitle: "Notificaciones",
    notifDesc: "Controla qué avisos recibes. Los cambios se guardan al hacer clic en «Guardar cambios».",
    pushLabel: "Notificaciones del navegador",
    pushGranted: "Permitidas · el navegador puede enviarte alertas push al instante.",
    pushDenied: "Bloqueadas · actívalas desde Configuración del navegador → Privacidad → Notificaciones.",
    pushDefault: "¿Nos permites enviarte notificaciones del navegador al instante?",
    pushAllow: "Permitir notificaciones",
    pushOn: "✓ Activas",
    pushBlocked: "Bloqueadas",
    emailNotif: "Notificaciones por correo",
    emailNotifDesc: "Recibe avisos importantes en tu correo.",
    communityNotif: "Notificaciones de comunidad",
    communityNotifDesc: "Avisos sobre novedades de la comunidad Ximo.",
    accountTitle: "Cuenta",
    nameLabel: "Nombre",
    emailLabel: "Email",
    planLabel: "Plan",
    editProfile: "Editar perfil",
    billing: "Facturación",
    help: "Ayuda",
    subActive: "Suscripción activa",
    subDesc: "Tu acceso a Ximo está activo. Gestiona tu plan en cualquier momento.",
    managePlan: "Gestionar plan",
    saveHint: "Tema, idioma y notificaciones se guardan juntos.",
    save: "Guardar cambios",
    saving: "Guardando…",
    saved: "¡Guardado ✓",
    yourData: "Tus datos",
    yourDataDesc: "Descarga una copia de toda tu información (derecho de acceso ARCO). Consulta el",
    privacyNotice: "Aviso de Privacidad",
    signOut: "Cerrar sesión",
  },
  en: {
    title: "Settings",
    subtitle: "App preferences",
    themeTitle: "Visual theme",
    themeDesc: "Choose how Ximo looks on your screen. Applied instantly across the app.",
    dark: "Dark",
    light: "Light",
    followSystem: "Follow system",
    active: "· active",
    langTitle: "Language preferences",
    langDesc: "Interface language. Applied after saving and reloading.",
    langNote: "The app will switch to US English after saving and reloading.",
    notifTitle: "Notifications",
    notifDesc: "Control which alerts you receive. Changes save when you click «Save changes».",
    pushLabel: "Browser notifications",
    pushGranted: "Enabled · your browser can send instant push alerts.",
    pushDenied: "Blocked · enable them from Browser Settings → Privacy → Notifications.",
    pushDefault: "Allow us to send you instant browser notifications?",
    pushAllow: "Allow notifications",
    pushOn: "✓ Active",
    pushBlocked: "Blocked",
    emailNotif: "Email notifications",
    emailNotifDesc: "Receive important alerts by email.",
    communityNotif: "Community notifications",
    communityNotifDesc: "Replies to your posts and mentions.",
    accountTitle: "Account",
    nameLabel: "Name",
    emailLabel: "Email",
    planLabel: "Plan",
    editProfile: "Edit profile",
    billing: "Billing",
    help: "Help",
    subActive: "Active subscription",
    subDesc: "Your Ximo access is active. Manage your plan any time.",
    managePlan: "Manage plan",
    saveHint: "Theme, language, and notifications save together.",
    save: "Save changes",
    saving: "Saving…",
    saved: "Saved ✓",
    yourData: "Your data",
    yourDataDesc: "Download a copy of all your information (ARCO access right). See the",
    privacyNotice: "Privacy Notice",
    signOut: "Sign out",
  },
} as const;
type LangKey = keyof typeof T;

export default function SettingsPage() {
  const { theme, setTheme, resolved } = useTheme();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState("Español");
  const [account, setAccount] = useState<{ name: string; email: string; plan: string; status: string } | null>(null);

  // Notification preferences (unsaved until user clicks Save)
  const [emailNotif, setEmailNotif] = useState(true);
  const [communityNotif, setCommunityNotif] = useState(true);
  const [pushGranted, setPushGranted] = useState<NotificationPermission | null>(null);

  const isLight = theme === "light" || (theme === "system" && resolved === "light");

  useEffect(() => {
    let cancelled = false;
    // Seed lang from localStorage first (immediate), then DB as source of truth.
    // Mount effect on purpose: reading localStorage during the first render
    // would desync from the server-rendered default and break hydration.
    try {
      const stored = localStorage.getItem("ximo-lang");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR hydration from an external store
      if (stored && CODE_TO_LANG[stored]) setLang(CODE_TO_LANG[stored]);
    } catch {}
    getUserSettings().then((s) => {
      if (cancelled || !s) return;
      if (s.language && CODE_TO_LANG[s.language]) setLang(CODE_TO_LANG[s.language]);
      if (typeof s.email_notifications === "boolean") setEmailNotif(s.email_notifications);
      if (typeof s.community_notifications === "boolean") setCommunityNotif(s.community_notifications);
    });
    getAccountSummary().then((a) => {
      if (!cancelled && a) setAccount(a);
    });
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushGranted(Notification.permission);
    }
    return () => { cancelled = true; };
  }, []);

  const requestPushPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPushGranted(result);
  };

  const handleSave = async () => {
    setSaving(true);
    const langCode = LANG_TO_CODE[lang] ?? "es";
    const fd = new FormData();
    fd.set("email_notifications", emailNotif ? "on" : "off");
    fd.set("community_notifications", communityNotif ? "on" : "off");
    await Promise.all([
      saveUserSettings({ theme, language: langCode }),
      saveNotificationPrefsAction(fd),
    ]);
    // Persist language to localStorage so the HTML lang attr updates on reload.
    try { localStorage.setItem("ximo-lang", langCode); } catch {}
    setSaving(false);
    setSaved(true);
    // Reload after a short delay so the lang attr flips immediately.
    setTimeout(() => { window.location.reload(); }, 800);
  };

  const panel = { background: "var(--surface)", border: "1px solid var(--border)" } as const;
  const t = T[lang === "English" ? "en" : "es" as LangKey];

  return (
    <div className="mx-auto max-w-[680px] space-y-6">

      {/* Header */}
      <div className="ximo-fade-up flex items-center gap-3">
        <Link href="/app/perfil"
          className="ximo-glass-btn dark flex h-9 w-9 items-center justify-center"
          style={{ padding: 0, borderRadius: 14 }}>
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>
            {t.title}
          </h1>
          <p className="text-xs" style={{ color: "var(--text-label)" }}>
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Theme section */}
      <div className="ximo-fade-up delay-100 rounded-2xl ximo-card-3d p-5 sm:p-6" style={panel}>
        <div className="mb-5">
          <h2 className="text-base font-black" style={{ color: "var(--text)" }}>{t.themeTitle}</h2>
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-label)" }}>
            {t.themeDesc}
          </p>
        </div>

        {/* Sliding toggle: Oscuro (left) ↔ Claro (right) */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full max-w-[240px]">
            <button
              type="button"
              role="switch"
              aria-checked={isLight}
              aria-label="Cambiar entre modo oscuro y claro"
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className="ximo-glass-chip relative flex h-12 w-full items-center rounded-full p-1.5"
            >
              {/* Sliding pill */}
              <span
                aria-hidden
                className="ximo-glass-chip active absolute top-1.5 bottom-1.5 left-1.5 rounded-full"
                style={{
                  width: "calc(50% - 6px)",
                  transform: isLight ? "translateX(100%)" : "translateX(0)",
                  transition: "transform 0.42s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
              {/* Dark label — LEFT */}
              <span
                className="relative z-10 flex flex-1 items-center justify-center text-sm font-bold transition-colors duration-300"
                style={{ color: isLight ? "var(--text-label)" : "#ffffff" }}
              >
                {t.dark}
              </span>
              {/* Light label — RIGHT */}
              <span
                className="relative z-10 flex flex-1 items-center justify-center text-sm font-bold transition-colors duration-300"
                style={{ color: isLight ? "#ffffff" : "var(--text-label)" }}
              >
                {t.light}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold ${theme === "system" ? "active" : ""}`}
          >
            {t.followSystem}
            {theme === "system" && (
              <span className="ml-1.5" style={{ color: "var(--gold)" }}>{t.active}</span>
            )}
          </button>
        </div>
      </div>

      {/* Language preference */}
      <div className="ximo-fade-up delay-150 rounded-2xl ximo-card-3d p-5" style={panel}>
        <h2 className="text-base font-black" style={{ color: "var(--text)" }}>{t.langTitle}</h2>
        <p className="mt-0.5 text-xs" style={{ color: "var(--text-label)" }}>
          {t.langDesc}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`ximo-glass-chip rounded-full px-4 py-2 text-xs font-semibold ${lang === l ? "active" : ""}`}
            >
              {l === "English" ? "🇺🇸 English" : "🇲🇽 Español"}
            </button>
          ))}
        </div>
        {lang === "English" && (
          <p className="mt-2 text-[11px]" style={{ color: "var(--text-label)" }}>
            {t.langNote}
          </p>
        )}
      </div>

      {/* Notifications */}
      <div className="ximo-fade-up delay-200 rounded-2xl ximo-card-3d p-5" style={panel}>
        <h2 className="mb-1 text-base font-black" style={{ color: "var(--text)" }}>{t.notifTitle}</h2>
        <p className="mb-4 text-xs" style={{ color: "var(--text-label)" }}>
          {t.notifDesc}
        </p>

        {/* Push notifications permission — always visible after mount */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
          style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{t.pushLabel}</p>
            <p className="text-[11px]" style={{ color: "var(--text-label)" }}>
              {pushGranted === "granted"
                ? t.pushGranted
                : pushGranted === "denied"
                ? t.pushDenied
                : t.pushDefault}
            </p>
          </div>
          {(pushGranted === "default" || pushGranted === null) && (
            <button
              type="button"
              onClick={requestPushPermission}
              className="ximo-glass-btn teal shrink-0 text-xs"
            >
              {t.pushAllow}
            </button>
          )}
          {pushGranted === "granted" && (
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: "var(--teal-bg)", color: "var(--teal)", border: "1px solid var(--teal-border)" }}>{t.pushOn}</span>
          )}
          {pushGranted === "denied" && (
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: "var(--error-bg)", color: "var(--error)", border: "1px solid var(--error)" }}>{t.pushBlocked}</span>
          )}
        </div>

        {/* Email and community toggles */}
        <div className="space-y-2.5">
          <NotifToggle
            label={t.emailNotif}
            desc={t.emailNotifDesc}
            on={emailNotif}
            onChange={setEmailNotif}
          />
          <NotifToggle
            label={t.communityNotif}
            desc={t.communityNotifDesc}
            on={communityNotif}
            onChange={setCommunityNotif}
          />
        </div>
      </div>

      {/* Account */}
      <div className="ximo-fade-up delay-300 rounded-2xl ximo-card-3d p-5" style={panel}>
        <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>{t.accountTitle}</h2>
        <div className="space-y-3">
          {[
            { label: t.nameLabel, value: account?.name ?? "—" },
            { label: t.emailLabel, value: account?.email ?? "—" },
            { label: t.planLabel, value: account ? `${account.plan} · ${account.status}` : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5"
              style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
              <span className="text-xs font-semibold" style={{ color: "var(--text-label)" }}>{label}</span>
              <span className="truncate text-xs font-bold" style={{ color: "var(--text)" }}>{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Link href="/app/perfil" className="ximo-glass-btn dark text-center text-xs">{t.editProfile}</Link>
          <Link href="/app/billing" className="ximo-glass-btn dark text-center text-xs">{t.billing}</Link>
          <Link href="/app/help" className="ximo-glass-btn dark text-center text-xs">{t.help}</Link>
        </div>
      </div>

      {/* Subscription */}
      <div className="ximo-fade-up delay-300 rounded-2xl ximo-card-3d p-5" style={{ background: "var(--surface)", border: "1px solid var(--border-gold)" }}>
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full ximo-glow-pulse" style={{ background: "var(--teal)" }} />
          <h2 className="text-sm font-black" style={{ color: "var(--text)" }}>{t.subActive}</h2>
        </div>
        <p className="text-xs" style={{ color: "var(--text-2)" }}>
          {t.subDesc}
        </p>
        <Link href="/app/billing" className="ximo-glass-btn gold mt-3 inline-block text-xs">
          {t.managePlan}
        </Link>
      </div>

      {/* Save all changes */}
      <div className="ximo-fade-up delay-300 flex items-center justify-between gap-4 rounded-2xl p-5" style={panel}>
        <p className="text-xs" style={{ color: "var(--text-label)" }}>
          {t.saveHint}
        </p>
        <button type="button" onClick={handleSave} disabled={saving} className="ximo-glass-btn teal shrink-0 text-sm">
          {saving ? t.saving : saved ? t.saved : t.save}
        </button>
      </div>

      {/* Your data (ARCO) */}
      <div className="ximo-fade-up delay-300 rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <p className="text-sm font-black" style={{ color: "var(--text)" }}>{t.yourData}</p>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
          {t.yourDataDesc}{" "}
          <Link href="/privacidad" className="font-semibold" style={{ color: "var(--teal)" }}>{t.privacyNotice}</Link>.
        </p>
        <div className="mt-4">
          <ExportDataButton />
        </div>
      </div>

      {/* Danger zone */}
      <div className="ximo-fade-up delay-300">
        <DeleteAccountButton />
      </div>

      {/* Sign out */}
      <div className="ximo-fade-up delay-300 flex justify-center pb-2">
        <form action={signOutAction}>
          <button type="submit" className="ximo-glass-chip rounded-full px-5 py-2 text-xs font-semibold" style={{ color: "var(--text-2)" }}>
            {t.signOut}
          </button>
        </form>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] font-medium">
        <Link href="/terminos" className="transition-opacity hover:opacity-70" style={{ color: "var(--teal)" }}>Términos y Condiciones</Link>
        <Link href="/privacidad" className="transition-opacity hover:opacity-70" style={{ color: "var(--teal)" }}>Aviso de Privacidad</Link>
        <Link href="/app/help" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-label)" }}>Ayuda</Link>
      </div>

      <p className="pb-4 text-center text-[10px]" style={{ color: "var(--text-3)" }}>
        Ximo · Hecho para atletas mexicanos · El futuro se entrena hoy.
      </p>
    </div>
  );
}

function NotifToggle({ label, desc, on, onChange }: { label: string; desc: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3"
      style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
      <span className="min-w-0">
        <span className="block text-sm font-bold" style={{ color: "var(--text)" }}>{label}</span>
        <span className="block text-[11px]" style={{ color: "var(--text-label)" }}>{desc}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
        style={{ background: on ? "var(--teal)" : "var(--border-strong)" }}
      >
        <span className="absolute rounded-full bg-white transition-transform"
          style={{ width: 18, height: 18, transform: on ? "translateX(22px)" : "translateX(3px)" }} />
      </button>
    </label>
  );
}
