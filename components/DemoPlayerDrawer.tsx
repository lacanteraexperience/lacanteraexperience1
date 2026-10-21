"use client";

import { useRouter } from "next/navigation";
import { HiXMark } from "react-icons/hi2";
import { type DemoView, useDemoSession } from "@/components/DemoSessionProvider";

export default function DemoPlayerDrawer({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { endDemo, demoView, setDemoView } = useDemoSession();
  const select = (view: DemoView) => { setDemoView(view); router.push("/jugar"); onClose(); };
  return <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Menú de jugadora">
    <button type="button" onClick={onClose} aria-label="Cerrar menú" className="absolute inset-0 bg-black/55" />
    <aside className="relative flex h-full w-[85vw] max-w-sm flex-col bg-stone-50 p-6 shadow-2xl">
      <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-700">Área de jugadora</p><button type="button" onClick={onClose} aria-label="Cerrar panel" className="rounded-full p-2 text-gray-700"><HiXMark className="h-6 w-6" /></button></div>
      <nav className="mt-8 space-y-2"><MenuButton active={demoView === "partidos"} onClick={() => select("partidos")}>Partidos</MenuButton><MenuButton active={demoView === "mis-partidos"} onClick={() => select("mis-partidos")}>Mis partidos</MenuButton><MenuButton active={demoView === "notificaciones"} onClick={() => select("notificaciones")}>Notificaciones</MenuButton><MenuButton active={demoView === "packs"} onClick={() => select("packs")}>Comprá tu pack</MenuButton><MenuButton active={demoView === "perfil"} onClick={() => select("perfil")}>Mi perfil</MenuButton></nav>
      <button type="button" onClick={() => { endDemo(); onClose(); }} className="mt-auto w-full rounded-full border border-red-200 px-4 py-3 text-sm font-bold text-red-700">Cerrar sesión de prueba</button>
    </aside>
  </div>;
}

function MenuButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className={`w-full rounded-xl px-4 py-3 text-left font-bold ${active ? "bg-lime-200 text-gray-950" : "text-gray-700 hover:bg-white"}`}>{children}</button>; }
