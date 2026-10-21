"use client";

import { useEffect, useState } from "react";

type PlayerAlert = { id: string; playerId: string; matchId: string; type: "Llegada tarde" | "Ausencia sin baja" | "Conflicto" | "Lesionada"; createdAt: string };
type SharedAlerts = { incidents?: PlayerAlert[]; players?: { id: string; suspensionUntil?: string }[] };
const storageKey = "la-cantera-demo-player-alerts";
const currentPlayerId = "gabriela";

function readAlerts(): SharedAlerts {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) as SharedAlerts : {};
  } catch {
    return {};
  }
}

export default function DemoPlayerAlerts() {
  const [data, setData] = useState<SharedAlerts>({});
  const [now] = useState(() => Date.now());
  useEffect(() => {
    const refresh = () => setData(readAlerts());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(storageKey, refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener(storageKey, refresh); };
  }, []);
  const alerts = (data.incidents ?? []).filter((alert) => alert.playerId === currentPlayerId);
  const suspensionUntil = data.players?.find((player) => player.id === currentPlayerId)?.suspensionUntil;
  const suspended = Boolean(suspensionUntil && new Date(suspensionUntil).getTime() > now);
  if (!alerts.length && !suspended) return null;
  return <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4" aria-label="Tus avisos privados">
    <h2 className="font-black text-amber-950">Avisos de La Cantera</h2>
    <p className="mt-1 text-sm text-amber-900">Estos avisos son privados: solo tú y administración pueden verlos.</p>
    {suspended && <p className="mt-3 rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-800">Tu acceso está suspendido temporalmente hasta {new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(new Date(suspensionUntil!))}.</p>}
    <ul className="mt-3 grid gap-2">{alerts.map((alert) => <li key={alert.id} className={(alert.type === "Lesionada" ? "bg-red-50 text-red-900" : "bg-white text-amber-950") + " rounded-xl px-3 py-2 text-sm"}><b>{alert.type === "Lesionada" ? "Seguimiento de lesión" : "Llamado de atención"}:</b> {alert.type}{alert.type === "Lesionada" ? ". No afecta a tus suspensiones." : ". Queda registrado en tu historial privado."}</li>)}</ul>
  </section>;
}
