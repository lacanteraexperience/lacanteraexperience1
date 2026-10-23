"use client";

import { useState } from "react";
import CreditAdministration from "@/components/CreditAdministration";

type SectionId = "partidos" | "pistas" | "formatos" | "jugadoras" | "inscripciones" | "avisos" | "sanciones" | "packs" | "economia";

const sections: Array<{ id: SectionId; label: string; eyebrow: string; title: string; description: string }> = [
  { id: "partidos", label: "Partidos", eyebrow: "Calendario", title: "Partidos", description: "Creá, editá y consultá el estado de los próximos encuentros." },
  { id: "pistas", label: "Pistas", eyebrow: "Configuración", title: "Pistas", description: "Administrá campos, direcciones, enlaces de Maps y costes de alquiler." },
  { id: "formatos", label: "Formatos", eyebrow: "Configuración", title: "Formatos", description: "Definí formatos, plazas y mínimos de cada actividad." },
  { id: "jugadoras", label: "Jugadoras", eyebrow: "Comunidad", title: "Jugadoras", description: "Consultá perfiles, altas manuales, niveles y datos de contacto." },
  { id: "inscripciones", label: "Inscripciones", eyebrow: "Operativa", title: "Inscripciones", description: "Revisá confirmaciones, plazas disponibles y lista de espera." },
  { id: "avisos", label: "Avisos", eyebrow: "Comunicación", title: "Avisos", description: "Prepará comunicaciones para jugadoras y participantes de cada partido." },
  { id: "sanciones", label: "Sanciones", eyebrow: "Convivencia", title: "Sanciones", description: "Registrá incidencias, alertas y suspensiones de manera interna." },
  { id: "packs", label: "Packs", eyebrow: "Economía", title: "Packs y partidos habilitados", description: "Asigná partidos habilitados una vez confirmado el pago fuera de la web." },
  { id: "economia", label: "Economía", eyebrow: "Economía", title: "Economía", description: "Consultá la operativa de cobros, costes y saldos de la organización." },
];

export default function AdministrationDashboard() {
  const [activeId, setActiveId] = useState<SectionId>("partidos");
  const active = sections.find((section) => section.id === activeId) ?? sections[0];

  return <>
    <nav className="mt-8 flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-200" aria-label="Secciones de administración">
      {sections.map((section) => <button key={section.id} type="button" onClick={() => setActiveId(section.id)} className={`shrink-0 rounded-xl px-4 py-3 text-sm font-bold transition ${section.id === activeId ? "bg-lime-400 text-gray-950" : "text-gray-700 hover:bg-stone-100"}`}>
        {section.label}
      </button>)}
    </nav>

    <section className="mt-7 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:p-7">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-lime-700">{active.eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950">{active.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">{active.description}</p>

      {activeId === "packs" ? <CreditAdministration /> : <EmptySection section={active} />}
    </section>
  </>;
}

function EmptySection({ section }: { section: (typeof sections)[number] }) {
  return <div className="mt-7 grid gap-4 md:grid-cols-2">
    <article className="rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200">
      <h3 className="font-black text-gray-950">Sin datos de prueba</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">No recuperamos perfiles, partidos ni cobros ficticios. Los registros reales se mostrarán aquí cuando se carguen desde la administración.</p>
    </article>
    <article className="rounded-2xl bg-lime-50 p-5 ring-1 ring-lime-200">
      <h3 className="font-black text-gray-950">Módulo preparado</h3>
      <p className="mt-2 text-sm leading-6 text-gray-700">Esta sección ya es navegable en ordenador y móvil. La siguiente etapa es conectar sus acciones a los datos reales, una por una.</p>
    </article>
  </div>;
}
