"use client";

import { useEffect, useState } from "react";

type Incident = { id: string; playerId: string; matchId: string; type: string; createdAt: string };
type Activity = { id: string; field: string; dateISO: string; cancelled?: boolean };
type Announcement = { id: string; audience: string; recipient: string; message: string; createdAt: string; matchId?: string };
const playerId = "gabriela";
const registeredIds = ["cem-jupiter-5v5", "trinitat-vella-7v7", "mundet-l3-6v6", "historial-demo"];

function readJson<T>(key: string, fallback: T): T { try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }

export default function DemoPlayerNotifications() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    const refresh = () => {
      setIncidents(readJson<{ incidents?: Incident[] }>("la-cantera-demo-player-alerts", {}).incidents ?? []);
      setAnnouncements(readJson<Announcement[]>("la-cantera-demo-player-notices", []));
      setActivities(readJson<Activity[]>("la-cantera-demo-activities", []));
    };
    refresh();
    const keys = ["storage", "la-cantera-demo-player-alerts", "la-cantera-demo-player-notices", "la-cantera-demo-activities"];
    keys.forEach((key) => window.addEventListener(key, refresh));
    return () => keys.forEach((key) => window.removeEventListener(key, refresh));
  }, []);
  const myIncidents = incidents.filter((incident) => incident.playerId === playerId);
  const cancellationNotices = activities.filter((activity) => activity.cancelled && registeredIds.includes(activity.id));
  const notices = [
    ...myIncidents.map((incident) => ({ id: incident.id, title: "Aviso en un partido", detail: `Tienes un aviso privado en el partido correspondiente. Consúltalo en Mis partidos · Historial.`, tone: "amber" })),
    ...announcements.filter((announcement) => announcement.audience !== "Organizadora" || announcement.recipient === playerId).map((announcement) => ({ id: announcement.id, title: announcement.matchId ? "Aviso de un partido" : "Anuncio de La Cantera", detail: announcement.message, tone: "blue" })),
    ...cancellationNotices.map((activity) => ({ id: `cancel-${activity.id}`, title: "Partido cancelado", detail: `${activity.field} fue cancelado. Revisá los detalles del partido.`, tone: "red" })),
  ];
  return <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200"><p className="text-sm text-gray-600">Aquí recibirás anuncios, cambios, cancelaciones y recordatorios. Tus llamadas de atención se muestran además en el partido del historial donde ocurrieron.</p><div className="mt-5 grid gap-3">{notices.length ? notices.map((notice) => <article key={notice.id} className={(notice.tone === "red" ? "bg-red-50 text-red-900" : notice.tone === "blue" ? "bg-blue-50 text-blue-950" : "bg-amber-50 text-amber-950") + " rounded-2xl p-4"}><b>{notice.title}</b><p className="mt-1 text-sm">{notice.detail}</p></article>) : <p className="rounded-2xl bg-stone-50 p-4 text-sm text-gray-600">No tienes notificaciones nuevas.</p>}</div></section>;
}
