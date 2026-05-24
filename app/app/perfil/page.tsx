import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { Badge, Card, SectionHeader } from "../components/ui";

const profile = {
  name: "Manuel Zúñiga",
  country: "México",
  sport: "Natación",
  graduationYear: "2027",
  mainEvents: "50 libre, 100 libre, 100 mariposa",
  goal: "College athlete en Estados Unidos",
  recruitingStatus: "En proceso activo",
};

const athleticInfo = [
  ["Club", "Club Tiburones GDL"],
  ["Eventos principales", profile.mainEvents],
  ["50 libre", "26.0s"],
  ["100 libre", "58.0s"],
  ["100 mariposa", "63.0s"],
  ["Temporada", "2024–25"],
];

const academicInfo = [
  ["GPA", "3.8"],
  ["SAT", "1340 (practice)"],
  ["TOEFL", "En preparación"],
  ["Graduación", profile.graduationYear],
  ["Idiomas", "Español · Inglés intermedio"],
];

const goals = [
  "Competir NCAA Division I en sprint libre",
  "Obtener beca parcial o completa",
  "Estudiar ingeniería o negocios",
  "Representar a México con orgullo",
];

const social = [
  ["Instagram", "@manuelzuniga.swim"],
  ["YouTube", "Manuel Zúñiga — Natación"],
  ["LinkedIn", "Próximamente"],
];

const upcomingUpdates = [
  "Actualizar tiempos post-competencia",
  "Subir video de 50 libre",
  "Completar perfil SAT/TOEFL",
  "Agregar cartas de recomendación",
];

export default function PerfilPage() {
  return (
    <>
      <PageHeader
        title="Perfil del atleta"
        subtitle="Tu información deportiva, académica y personal organizada para recruiting."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-[#0B1F33] to-[#0A1C2E] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9A84C]/20 text-xl font-black text-[#C9A84C]">
                  MZ
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    {profile.name}
                  </h2>
                  <p className="mt-1 text-sm text-white/55">
                    {profile.sport} · {profile.country}
                  </p>
                  <Badge className="mt-2 border border-[#C9A84C]/30 bg-[#C9A84C]/15 text-[#C9A84C]">
                    {profile.recruitingStatus}
                  </Badge>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/50">
                Objetivo:{" "}
                <span className="font-semibold text-[#C9A84C]">
                  {profile.goal}
                </span>
              </p>
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <SectionHeader title="Información deportiva" />
            <div className="grid gap-3 sm:grid-cols-2">
              {athleticInfo.map(([label, value]) => (
                <div key={label} className="rounded-lg bg-[#F5F5F0] px-3 py-2">
                  <p className="text-[10px] font-bold tracking-wide text-[#5E7080] uppercase">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#0B1F33]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <SectionHeader title="Información académica" />
            <div className="grid gap-3 sm:grid-cols-2">
              {academicInfo.map(([label, value]) => (
                <div key={label} className="rounded-lg bg-[#F5F5F0] px-3 py-2">
                  <p className="text-[10px] font-bold tracking-wide text-[#5E7080] uppercase">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#0B1F33]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <SectionHeader title="Objetivos" />
            <ul className="space-y-2">
              {goals.map((goal) => (
                <li
                  key={goal}
                  className="flex items-start gap-2 text-sm text-[#0D1B2A]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A84C]" />
                  {goal}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 sm:p-5">
            <SectionHeader title="Redes sociales" />
            <div className="space-y-2">
              {social.map(([platform, handle]) => (
                <div
                  key={platform}
                  className="flex items-center justify-between rounded-lg border border-[#0B1F33]/6 px-3 py-2"
                >
                  <span className="text-sm font-semibold text-[#0B1F33]">
                    {platform}
                  </span>
                  <span className="text-sm text-[#1D4ED8]">{handle}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <SectionHeader
              title="Próximas actualizaciones"
              subtitle="Para completar tu perfil"
            />
            <ul className="space-y-2">
              {upcomingUpdates.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-[#5E7080]"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A84C]" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Visibilidad" subtitle="Perfil coach-shareable" />
            <p className="text-2xl font-black text-[#1D4ED8]">12</p>
            <p className="text-xs text-[#5E7080]">
              universidades con perfil activo
            </p>
            <button
              type="button"
              className="mt-3 w-full rounded-xl border border-[#0B1F33]/10 py-2 text-xs font-semibold text-[#0B1F33]"
            >
              Copiar link de perfil
            </button>
          </Card>

          <Card className="p-4">
            <p className="text-xs leading-relaxed text-[#5E7080]">
              Completa SAT, TOEFL y video para maximizar visibilidad ante
              coaches.
            </p>
            <Link
              href="/login"
              className="mt-3 block w-full rounded-xl bg-[#0B1F33] py-2.5 text-center text-xs font-bold text-white hover:bg-[#0A1C2E]"
            >
              Acceso privado →
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
