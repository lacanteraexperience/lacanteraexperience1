"use client";

import type { Match } from "@/lib/matches";

const icsDate = (date: Date) => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}00`;
const escapeIcs = (value: string) => value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export default function AddToCalendarButton({ match }: { match: Match }) {
  function downloadEvent() {
    const start = new Date(match.start);
    const end = new Date(start.getTime() + match.durationMinutes * 60_000);
    const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//La Cantera//Partidos//ES", "BEGIN:VEVENT", `UID:${match.id}@lacanteraexperience`, `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`, `SUMMARY:${escapeIcs(`La Cantera · ${match.field} · ${match.format}`)}`, `LOCATION:${escapeIcs(match.address)}`, `DESCRIPTION:${escapeIcs(`Partido de La Cantera. Más información: ${window.location.href}`)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `la-cantera-${match.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return <button type="button" onClick={downloadEvent} className="rounded-full border border-lime-600 px-5 py-2.5 text-sm font-bold text-lime-800 transition hover:bg-lime-50">Añadir al calendario</button>;
}
