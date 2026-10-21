"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Match } from "@/lib/matches";
import ShareMatchButton from "@/components/ShareMatchButton";
import { useDemoSession } from "@/components/DemoSessionProvider";

type Props = { matches: Match[]; showShare?: boolean };

const weekdays = ["Todos", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const weekdayLabels: Record<string, string> = { Todos: "Todos", LUN: "lunes", MAR: "martes", MIÉ: "miércoles", JUE: "jueves", VIE: "viernes", SÁB: "sábado", DOM: "domingo" };

function weekdayFor(match: Match) {
  return new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(new Date(`${match.start.slice(0, 10)}T12:00:00`));
}

export default function MatchExplorer({ matches, showShare = true }: Props) {
  const { hasDemoSession, isRegistered } = useDemoSession();
  const [weekday, setWeekday] = useState("Todos");
  const [field, setField] = useState("Todas las pistas");
  const [format, setFormat] = useState("Todos los formatos");
  const [hideFull, setHideFull] = useState(false);
  const filtered = useMemo(() => matches.filter((match) => {
    const isFull = match.occupied >= match.capacity;
    return (weekday === "Todos" || weekdayFor(match) === weekdayLabels[weekday])
      && (field === "Todas las pistas" || match.field === field)
      && (format === "Todos los formatos" || match.format === format)
      && (!hideFull || !isFull);
  }), [field, format, hideFull, matches, weekday]);
  const fields = [...new Set(matches.map((match) => match.field))];
  const formats = [...new Set(matches.map((match) => match.format))];
  const hasActiveFilters = weekday !== "Todos" || field !== "Todas las pistas" || format !== "Todos los formatos" || hideFull;
  const clearFilters = () => {
    setWeekday("Todos");
    setField("Todas las pistas");
    setFormat("Todos los formatos");
    setHideFull(false);
  };

  return <>
    <div className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Filtrar partidos por día de la semana">{weekdays.map((day) => <button key={day} type="button" onClick={() => setWeekday(day)} className={(weekday === day ? "bg-lime-300 text-gray-950" : "bg-white text-gray-600 ring-1 ring-gray-200") + " min-w-16 rounded-2xl px-4 py-3 text-sm font-black"}>{day}</button>)}</div>
    <div className="mt-4 grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:grid-cols-2 lg:grid-cols-4">
      <Filter label="Pista" value={field} onChange={setField} options={["Todas las pistas", ...fields]} />
      <Filter label="Formato" value={format} onChange={setFormat} options={["Todos los formatos", ...formats]} />
      <label className="flex min-h-12 items-center gap-3 self-end rounded-xl px-2 text-sm font-semibold text-gray-800">
        <input checked={hideFull} onChange={(event) => setHideFull(event.target.checked)} type="checkbox" className="h-4 w-4 accent-lime-600" />
        Excluir partidos llenos
      </label>
      <div className="col-span-full flex justify-end"><button type="button" onClick={clearFilters} disabled={!hasActiveFilters} className="rounded-full px-4 py-2 text-sm font-bold text-lime-800 underline underline-offset-4 disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline">Limpiar filtros</button></div>
    </div>
    <p className="mt-5 text-sm text-gray-600">{filtered.length} {filtered.length === 1 ? "partido encontrado" : "partidos encontrados"}</p>
    {filtered.length === 0 ? <div className="mt-6 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200"><h2 className="text-lg font-bold">No hay partidos con estos filtros</h2><p className="mt-2 text-gray-600">Prueba a cambiar algún filtro para ver más opciones.</p></div> :
      <div className="mt-5 grid gap-4">{filtered.map((match) => {
        const isFull = match.occupied >= match.capacity;
        return <article key={match.id} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200"><div className="grid grid-cols-[4.7rem_minmax(0,1fr)_auto] gap-4 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]"><div className="border-r border-stone-200 pr-3 pt-1 text-2xl font-black sm:text-3xl">{match.start.slice(11, 16)}</div><div className="min-w-0"><p className="text-lg font-black sm:text-xl">{match.field}</p><p className="mt-1 text-xs font-semibold text-gray-500">{match.dateTime}</p><div className="mt-2 flex flex-wrap gap-1"><span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-bold">{match.format}</span>{match.level && <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{match.level}</span>}{match.tags?.map((tag) => <span key={tag} className={(tag === "NEW" ? "bg-amber-200 text-amber-950" : "bg-lime-50 text-lime-800") + " rounded-full px-2 py-1 text-xs font-bold"}>{tag}</span>)}</div></div><div className="flex flex-col items-end justify-between"><span className={(isFull ? "bg-red-50 text-red-700" : "bg-lime-50 text-lime-800") + " rounded-full px-2 py-1 text-sm font-black"}>{isFull ? "Partido lleno" : `${match.occupied}/${match.capacity}`}</span><span className="text-lg font-black">8,00 €</span></div></div>{hasDemoSession && isRegistered(match.id) && <p className="mt-4 inline-flex rounded-full bg-lime-100 px-3 py-1 text-sm font-bold text-lime-800">Inscrita</p>}<div className="mt-4 flex items-center justify-between gap-3"><Link href={`/jugar/${match.id}`} className="text-sm font-bold text-gray-900 underline underline-offset-4">Ver partido</Link>{showShare && <ShareMatchButton matchId={match.id} />}</div></article>;
      })}</div>}
  </>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="grid gap-1 text-sm font-semibold text-gray-700">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-xl border border-gray-300 bg-white px-3 text-gray-900 outline-none ring-lime-500 focus:ring-2">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
