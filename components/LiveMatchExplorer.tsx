"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Activity = { id: string; title: string; format_name: string; starts_at: string; capacity: number; occupied: number };

export default function LiveMatchExplorer() {
  const [activities, setActivities] = useState<Activity[]>([]), [message, setMessage] = useState(""); const { isSignedIn } = useUser();
  const load = async () => { const response = await fetch("/api/activities", { cache: "no-store" }); const data = await response.json() as { activities?: Activity[] }; setActivities(data.activities ?? []); };
  useEffect(() => { void load(); }, []);
  const join = async (id: string) => { if (!isSignedIn) { window.location.href = "/iniciar-sesion"; return; } const response = await fetch(`/api/activities/${id}/registration`, { method: "POST" }); const data = await response.json() as { error?: string; completeProfile?: boolean }; if (!response.ok && data.completeProfile) { window.location.href = "/completar-perfil"; return; } setMessage(response.ok ? "Inscripción confirmada." : data.error ?? "No se pudo completar la inscripción."); await load(); };
  return <div className="mt-8 space-y-4">{message ? <p role="status" className="rounded-xl bg-lime-50 p-4 text-sm font-bold">{message}</p> : null}{activities.length ? activities.map((activity) => { const full = activity.occupied >= activity.capacity; return <article key={activity.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-200"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-black">{activity.title}</h2><p className="mt-1 text-sm text-gray-600">{new Date(activity.starts_at).toLocaleString("es-ES", { dateStyle: "full", timeStyle: "short" })}</p><p className="mt-2 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-bold">{activity.format_name}</p></div><div className="text-right"><p className={full ? "font-black text-red-700" : "font-black text-lime-800"}>{full ? "Partido lleno" : `${activity.occupied}/${activity.capacity} plazas`}</p><div className="mt-3 flex justify-end gap-2"><Link href={`/jugar/${activity.id}`} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-bold">Ver partido</Link>{!full ? <button type="button" onClick={() => void join(activity.id)} className="rounded-full bg-lime-500 px-4 py-2 text-sm font-bold text-black">Inscribirme</button> : null}</div></div></div></article>; }) : <p className="rounded-3xl bg-white p-8 text-center text-gray-600 ring-1 ring-gray-200">Aún no hay partidos publicados.</p>}</div>;
}
