"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import DemoPlayerDrawer from "@/components/DemoPlayerDrawer";
import { type DemoView, useDemoSession } from "@/components/DemoSessionProvider";

export default function DemoPlayerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { hasDemoSession, endDemo, demoView, setDemoView } = useDemoSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPlayerArea = pathname.startsWith("/jugar") || pathname === "/mis-partidos" || pathname === "/mi-perfil";
  if (!hasDemoSession || !isPlayerArea) return null;
  const select = (view: DemoView) => { setDemoView(view); router.push("/jugar"); };

  return <>
    <aside className="fixed left-0 top-24 z-40 hidden h-[calc(100vh-6rem)] w-80 border-r border-gray-200 bg-stone-50 p-5 shadow-xl lg:flex lg:flex-col">
      <nav className="space-y-2">
        <SideButton active={demoView === "partidos"} onClick={() => select("partidos")}>Partidos</SideButton>
        <SideButton active={demoView === "mis-partidos"} onClick={() => select("mis-partidos")}>Mis partidos</SideButton>
        <SideButton active={demoView === "notificaciones"} onClick={() => select("notificaciones")}>Notificaciones</SideButton>
        <SideButton active={demoView === "packs"} onClick={() => select("packs")}>Comprá tu pack</SideButton>
        <SideButton active={demoView === "perfil"} onClick={() => select("perfil")}>Mi perfil</SideButton>
      </nav>
      <button type="button" onClick={endDemo} className="mt-auto w-full rounded-full border border-red-200 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50">Cerrar sesión de prueba</button>
    </aside>
    <button type="button" onClick={() => setMobileOpen(true)} className="fixed right-4 top-[calc(6.5rem+env(safe-area-inset-top))] z-50 rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white shadow-xl ring-2 ring-lime-300 lg:hidden">Abrir menú de jugadora</button>
    {mobileOpen && <DemoPlayerDrawer onClose={() => setMobileOpen(false)} />}
  </>;
}

function SideButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition ${active ? "bg-lime-200 text-gray-950" : "text-gray-700 hover:bg-white"}`}>{children}</button>;
}
