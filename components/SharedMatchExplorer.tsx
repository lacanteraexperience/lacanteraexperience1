"use client";

import { useEffect, useState } from "react";
import MatchExplorer from "@/components/MatchExplorer";
import { matches as defaultMatches, rulesForFormat, type Match } from "@/lib/matches";

type SharedActivity = { id: string; field: Match["field"]; date: string; dateISO: string; endISO: string; format: Match["format"]; capacity: number; confirmedPaid: number; tags?: string[]; level?: Match["level"]; cancelled?: boolean; completed?: boolean };
const storageKey = "la-cantera-demo-activities";

function readActivities() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return defaultMatches;
    const saved = JSON.parse(raw) as SharedActivity[];
    return saved.filter((item) => !item.cancelled && !item.completed).map((item) => ({
      id: item.id, field: item.field, dateTime: item.date, format: item.format, occupied: item.confirmedPaid, capacity: item.capacity,
      address: defaultMatches.find((match) => match.field === item.field)?.address ?? "Barcelona", mapsUrl: "https://maps.google.com", start: item.dateISO,
      durationMinutes: Math.max(30, (new Date(item.endISO).getTime() - new Date(item.dateISO).getTime()) / 60_000), level: item.level, tags: item.tags, rules: rulesForFormat(item.format),
    } satisfies Match));
  } catch { return defaultMatches; }
}

export default function SharedMatchExplorer() {
  const [sharedMatches, setSharedMatches] = useState<Match[]>(defaultMatches);
  useEffect(() => {
    const refresh = () => setSharedMatches(readActivities());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("la-cantera-demo-activities", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("la-cantera-demo-activities", refresh); };
  }, []);
  return <MatchExplorer matches={sharedMatches} />;
}
