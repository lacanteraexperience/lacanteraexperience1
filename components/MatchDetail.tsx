"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Activity = { id: string; title: string; starts_at: string; capacity: number; occupied: number; rules?: string | null; address?: string | null; maps_url?: string | null; format_name: string };
type Player = { first_name: string; last_name: string; avatar_url?: string | null };
const initials = (player: Player) => `${player.first_name.slice(0, 1)}${player.last_name.slice(0, 1)}`.trim().toUpperCase() || "LC";

export default function MatchDetail({ id }: { id: string }) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [message, setMessage] = useState("");
  const [joining, setJoining] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch(`/api/activities/${id}`, { cache: "no-store" });
    const data = await response.json() as { activity?: Activity; players?: Player[]; signedIn?: boolean; registered?: boolean; error?: string };
    setActivity(data.activity ?? null); setPlayers(data.players ?? []); setSignedIn(Boolean(data.signedIn)); setRegistered(Boolean(data.registered)); setMessage(data.error ?? "");
  }, [id]);
  useEffect(() => { void load(); }, [load]);
  const share = async () => { try { await navigator.clipboard.writeText(window.location.href); setMessage("Enlace copiado."); } catch { setMessage("Copiá el enlace desde la barra del navegador."); } };
  const join = async () => { if (!signedIn) { window.location.href = "/iniciar-sesion"; return; } setJoining(true); setMessage(""); const response = await fetch(`/api/activities/${id}/registration`, { method: "POST" }); const data = await response.json() as { error?: string; completeProfile?: boolean }; if (!response.ok && data.completeProfile) { window.location.href = "/completar-perfil"; return; } setMessage(response.ok ? "Inscripción confirmada." : data.error ?? "No se pudo completar la inscripción."); setJoining(false); await load(); };
  const leave = async () => { if (!window.confirm("¿Querés darte de baja? Si faltan 24 horas o más, se te devuelve el partido habilitado. Dentro de las 24 horas se libera la plaza, sin devolución.")) return; setJoining(true); setMessage(""); const response = await fetch(`/api/activities/${id}/registration`, { method: "DELETE" }); const data = await response.json() as { error?: string; refunded?: boolean }; setMessage(response.ok ? data.refunded ? "Baja confirmada: tu partido habilitado fue devuelto." : "Baja confirmada: la plaza fue liberada, sin devolución por estar dentro de las 24 horas." : data.error ?? "No se pudo procesar la baja."); setJoining(false); await load(); };
  if (!activity) return <p className="mt-8 rounded-2xl bg-white p-5 text-gray-600 ring-1 ring-gray-200">{message || "Cargando partido…"}</p>;
  const full = activity.occupied >= activity.capacity;

  return <article className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-10">
    <Link href="/jugar" className="text-sm font-semibold text-lime-700 underline underline-offset-4">← Volver a partidos</Link>
    <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Partido</p>
    <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{activity.title}</h1>
    <p className="mt-4 text-lg text-gray-600">{new Date(activity.starts_at).toLocaleString("es-ES", { dateStyle: "full", timeStyle: "short" })}</p>
    <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-gray-500">Formato</p><p className="mt-1 font-black">{activity.format_name}</p></div><div className="rounded-2xl bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-gray-500">Plazas</p><p className={full ? "mt-1 font-black text-red-700" : "mt-1 font-black text-lime-800"}>{full ? "Partido lleno" : `${activity.occupied} / ${activity.capacity}`}</p></div></div>
    {signedIn ? <>{registered ? <button type="button" onClick={() => void leave()} disabled={joining} className="mt-6 w-full rounded-full border border-red-300 px-5 py-3 font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-50">{joining ? "Procesando baja…" : "Darme de baja"}</button> : <button type="button" onClick={() => void join()} disabled={full || joining} className="mt-6 w-full rounded-full bg-lime-500 px-5 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50">{full ? "Partido lleno" : joining ? "Inscribiendo…" : "Inscribirme al partido"}</button>}<div className="mt-8 grid gap-7 border-t border-gray-200 pt-7 sm:grid-cols-2"><section><h2 className="text-lg font-black">Dónde jugamos</h2><p className="mt-3 text-gray-600">{activity.address || "La dirección se confirmará próximamente."}</p>{activity.maps_url ? <a href={activity.maps_url} target="_blank" rel="noreferrer" className="mt-2 inline-block font-bold text-lime-700 underline underline-offset-4">Ver en Maps</a> : null}</section><details className="group rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-lg font-black text-gray-950"><span>Reglas del partido</span><span aria-hidden="true" className="text-2xl font-normal text-lime-700 transition-transform group-open:rotate-180">⌄</span></summary><p className="mt-4 whitespace-pre-line border-t border-stone-200 pt-4 text-gray-600">{activity.rules || "No hay reglas adicionales para este partido."}</p></details><section className="sm:col-span-2"><h2 className="text-lg font-black">Jugadoras inscriptas</h2>{players.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{players.map((player, index) => <article key={`${player.first_name}-${player.last_name}-${index}`} className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3 ring-1 ring-stone-200">{player.avatar_url ? <img src={player.avatar_url} alt={`Foto de ${player.first_name} ${player.last_name}`} className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-lime-400" /> : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-500 text-sm font-black text-black">{initials(player)}</span>}<p className="min-w-0 truncate font-bold text-gray-950">{player.first_name} {player.last_name}</p></article>)}</div> : <p className="mt-3 text-gray-600">Todavía no hay jugadoras inscriptas.</p>}</section></div></> : <p className="mt-8 rounded-2xl bg-lime-50 px-4 py-3 text-sm font-medium text-gray-700">Iniciá sesión para ver dirección, reglas y jugadoras inscriptas.</p>}
    <button type="button" onClick={() => void share()} className="mt-8 rounded-full border border-lime-600 px-5 py-3 font-bold text-lime-800">Compartir</button>
    {message ? <p role="status" className="mt-3 text-sm font-bold text-lime-800">{message}</p> : null}
  </article>;
}
