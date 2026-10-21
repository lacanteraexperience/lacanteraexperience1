"use client";

import { useState } from "react";
import Link from "next/link";
import type { Match } from "@/lib/matches";
import { useDemoSession } from "@/components/DemoSessionProvider";
import AddToCalendarButton from "@/components/AddToCalendarButton";

export default function MatchSessionDetails({ match }: { match: Match }) {
  const { hasDemoSession, cancelRegistration, isRegistered, registerForMatch, registerWithPack, packBalance, assignedLevel } = useDemoSession();
  const [message, setMessage] = useState("");
  const [confirmingCancellation, setConfirmingCancellation] = useState(false);
  const [refundEligible, setRefundEligible] = useState(false);
  if (!hasDemoSession) return null;
  const registered = isRegistered(match.id);

  function confirmCancellation() {
    cancelRegistration(match.id, refundEligible);
    setConfirmingCancellation(false);
    setMessage(refundEligible ? "Demostración: tu inscripción se ha cancelado. Si usaste un pack, recuperaste un partido en tu saldo; si pagaste individualmente, se tramitaría el reembolso." : "Demostración: tu inscripción se ha cancelado y la plaza queda liberada. Al faltar 12 horas o menos, no se repone el saldo del pack ni correspondería reembolso.");
  }

  function openCancellation() {
    setRefundEligible(new Date(match.start).getTime() - Date.now() > 12 * 60 * 60 * 1000);
    setConfirmingCancellation(true);
  }

  return (
    <section className="mt-8 border-t border-gray-200 pt-6 text-gray-700">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-lime-700">Modo demostración</p>
      <h2 className="mt-2 text-xl font-bold text-gray-950">Información completa del partido</h2>
      <a
        href={match.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block font-semibold text-lime-700 underline underline-offset-4"
      >
        {match.address} · Ver en Maps
      </a>
      <div className="mt-5 grid gap-7 xl:grid-cols-[1.35fr_0.9fr]">
        <div>
          <h3 className="font-bold text-gray-950">Reglas</h3>
          <div className="mt-4 space-y-6 text-sm leading-6">
            {match.rules.map((section, index) => <section key={section.title ?? index}>
              {section.title && <h4 className="font-bold text-gray-950">{section.title}</h4>}
              {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-2">{paragraph}</p>)}
              {section.highlight && <p className="mt-4 rounded-xl border border-lime-200 bg-lime-50 p-4 font-semibold text-gray-800">👟 {section.highlight}</p>}
              {section.items && <ul className="mt-3 list-disc space-y-2 pl-5">{section.items.map((rule) => <li key={rule}>{rule}</li>)}</ul>}
            </section>)}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-950">Jugadoras inscritas</h3>
          <ul className="mt-3 space-y-2">
            {match.players.map((player, index) => (
              <li key={player.name} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-stone-50 p-2.5">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${index % 3 === 0 ? "bg-lime-700" : index % 3 === 1 ? "bg-sky-700" : "bg-violet-700"}`} aria-label={`Avatar de ejemplo de ${player.name}`}>
                  {player.name.split(" ").map((part) => part[0]).join("")}
                </span>
                <span className="min-w-0"><Link href={`/jugadoras/${player.name.toLocaleLowerCase("es-ES").replaceAll(" ", "-")}`} className="block truncate text-sm font-semibold text-gray-900 underline-offset-4 hover:text-lime-700 hover:underline">{player.name}</Link>{player.nickname && <span className="block text-xs text-gray-500">{player.nickname}</span>}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-500">Tocá el nombre para ver el perfil de demostración. Con registro real, cada jugadora podrá usar su propia foto.</p>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-3">{registered ? <><span className="rounded-full bg-lime-100 px-4 py-2.5 text-sm font-bold text-lime-800">Inscrita</span><button type="button" onClick={openCancellation} className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50">Cancelar inscripción</button></> : <><button type="button" onClick={() => { if (match.level === "Avanzado" && assignedLevel === "Principiante") { setMessage("No puedes inscribirte: tu nivel asignado es Principiante y esta actividad es de nivel Avanzado."); return; } registerForMatch(match.id); setMessage("Demostración: inscripción registrada. En la versión real solo quedará confirmada tras el pago individual."); }} className="rounded-full bg-lime-500 px-6 py-3 font-semibold text-black transition hover:bg-lime-400">Pagar partido</button>{packBalance > 0 && <button type="button" onClick={() => { if (registerWithPack(match.id)) setMessage("Inscripción confirmada usando 1 partido de tu pack."); }} className="rounded-full border border-lime-600 px-6 py-3 font-semibold text-lime-800">Usar pack · saldo {packBalance}</button>}</>}<AddToCalendarButton match={match} /></div>
      {confirmingCancellation && <aside className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5" aria-live="polite"><h3 className="font-bold text-gray-950">¿Quieres cancelar tu inscripción?</h3><p className="mt-2 text-sm leading-6 text-gray-700">{refundEligible ? "Faltan más de 12 horas para el partido. En la versión real se tramitaría el reembolso y se liberaría tu plaza." : "Faltan 12 horas o menos para el partido. Puedes liberar tu plaza, pero en la versión real no correspondería reembolso."}</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={confirmCancellation} className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">Sí, cancelar inscripción</button><button type="button" onClick={() => setConfirmingCancellation(false)} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-bold text-gray-800 hover:bg-white">Volver</button></div></aside>}
      {message && <p className="mt-3 text-sm font-medium text-gray-600" role="status">{message}</p>}
    </section>
  );
}
