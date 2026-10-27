"use client";
import { useEffect, useState } from "react";
type Status = { activeAlerts: number; suspension: { starts_on: string; ends_on: string; reason: string } | null };
export default function ParticipationStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => { void fetch("/api/sanctions/me", { cache: "no-store" }).then(async (response) => { const data = await response.json() as Status; if (response.ok) setStatus(data); }); }, []);
  if (!status) return null;
  if (status.suspension) return <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-950"><h2 className="font-black">Participación suspendida temporalmente</h2><p className="mt-2">No podés inscribirte a nuevos partidos hasta el {status.suspension.ends_on.slice(0, 10)}. {status.suspension.reason}</p><p className="mt-2">Si necesitás revisar esta medida, contactá a la administración.</p></section>;
  if (status.activeAlerts > 0) return <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><h2 className="font-black">Estado de participación</h2><p className="mt-2">Tenés {status.activeAlerts} alerta{status.activeAlerts === 1 ? "" : "s"} activa{status.activeAlerts === 1 ? "" : "s"}. Si querés revisarla{status.activeAlerts === 1 ? "" : "s"}, contactá a la administración.</p></section>;
  return null;
}
