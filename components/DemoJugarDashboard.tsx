"use client";

import Image from "next/image";
import { matches } from "@/lib/matches";
import { useDemoSession } from "@/components/DemoSessionProvider";
import MatchExplorer from "@/components/MatchExplorer";
import DemoMyMatchesList from "@/components/DemoMyMatchesList";
import DemoProfileContent from "@/components/DemoProfileContent";
import DemoPlayerNotifications from "@/components/DemoPlayerNotifications";
import DemoPacks from "@/components/DemoPacks";

export default function DemoJugarDashboard() {
  const { hasDemoSession, demoView } = useDemoSession();
  if (!hasDemoSession) return null;

  return <section className="demo-dashboard-content jugar-page-content mx-auto max-w-6xl px-6 pb-20 pt-12 lg:px-8">
    {demoView === "inicio" && <div className="relative overflow-hidden rounded-3xl bg-zinc-950 shadow-xl"><Image src="/images/hero.jpg" alt="Campo de fútbol" width={1600} height={900} priority className="h-[360px] w-full object-cover sm:h-[460px]" /><div className="absolute inset-0 bg-zinc-950/45" /><div className="absolute inset-0 flex max-w-2xl flex-col justify-end p-7 text-white sm:p-12"><p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">Demostración local</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Tu próximo partido empieza aquí.</h1><p className="mt-4 text-lg text-white/90">Elige tu pista, únete al equipo y disfruta del juego.</p></div></div>}
    {demoView === "partidos" && <DashboardMatches />}
    {demoView === "mis-partidos" && <MyMatches />}
    {demoView === "notificaciones" && <Notifications />}
    {demoView === "packs" && <Packs />}
    {demoView === "perfil" && <Profile />}
  </section>;
}

function DashboardMatches() { return <><p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Partidos</p><h1 className="mt-3 text-4xl font-black tracking-tight">Próximos partidos</h1><MatchExplorer matches={matches} /></>; }
function MyMatches() { return <><p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Mis partidos</p><h1 className="mt-3 text-4xl font-black tracking-tight">Tus próximos encuentros</h1><p className="mt-5 rounded-2xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-900">Tienes una valoración pendiente de MUNDET L3. La encontrarás en tu historial de partidos jugados.</p><DemoMyMatchesList /></>; }
function Notifications() { return <><p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Notificaciones</p><h1 className="mt-3 text-4xl font-black tracking-tight">Tus avisos</h1><DemoPlayerNotifications /></>; }
function Packs() { return <><p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Comprá tu pack</p><h1 className="mt-3 text-4xl font-black tracking-tight">Packs de partidos</h1><DemoPacks /></>; }
function Profile() { return <><p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Mi perfil</p><DemoProfileContent /></>; }
