"use client";

import { FormEvent, useEffect, useState } from "react";

type Pitch = { id: string; name: string; address: string; maps_url: string | null; rental_cost_cents: number; internal_note: string | null };
type Draft = { name: string; address: string; mapsUrl: string; rentalCost: string; internalNote: string };
const emptyDraft: Draft = { name: "", address: "", mapsUrl: "", rentalCost: "0", internalNote: "" };

function toCents(value: string) {
  const amount = Number(value.replace(",", "."));
  return Number.isFinite(amount) ? Math.round(amount * 100) : -1;
}

export default function PitchAdministration() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/pitches", { cache: "no-store" });
    const data = await response.json() as { pitches?: Pitch[]; error?: string };
    setPitches(data.pitches ?? []);
    if (!response.ok) setMessage(data.error ?? "No se pudieron cargar las pistas.");
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const set = (key: keyof Draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const edit = (pitch: Pitch) => {
    setEditing(pitch.id);
    setDraft({ name: pitch.name, address: pitch.address, mapsUrl: pitch.maps_url ?? "", rentalCost: (pitch.rental_cost_cents / 100).toFixed(2), internalNote: pitch.internal_note ?? "" });
    setMessage("");
  };
  const cancel = () => { setEditing(null); setDraft(emptyDraft); setMessage(""); };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true); setMessage("");
    const response = await fetch(editing ? `/api/admin/pitches/${editing}` : "/api/admin/pitches", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, rentalCostCents: toCents(draft.rentalCost) }),
    });
    const data = await response.json() as { error?: string };
    if (!response.ok) setMessage(data.error ?? "No se pudo guardar la pista.");
    else { setMessage(editing ? "Pista actualizada." : "Pista creada."); setEditing(null); setDraft(emptyDraft); await load(); }
    setSaving(false);
  };

  return <div className="mt-7 grid gap-7 lg:grid-cols-[.9fr_1.1fr]">
    <form onSubmit={save} className="rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200">
      <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-black">{editing ? "Editar pista" : "Nueva pista"}</h3><p className="mt-1 text-sm text-gray-600">Los datos se guardan para crear futuros partidos.</p></div>{editing ? <button type="button" onClick={cancel} className="text-sm font-bold text-gray-700 underline">Cancelar</button> : null}</div>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-1 text-sm font-bold text-gray-700">Nombre de la pista<input required value={draft.name} onChange={(event) => set("name", event.target.value)} placeholder="Ej.: CEM JÚPITER" className="rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal" /></label>
        <label className="grid gap-1 text-sm font-bold text-gray-700">Dirección<input required value={draft.address} onChange={(event) => set("address", event.target.value)} placeholder="Calle, número, ciudad" className="rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal" /></label>
        <label className="grid gap-1 text-sm font-bold text-gray-700">Enlace de Google Maps <span className="font-normal text-gray-500">(opcional)</span><input type="url" value={draft.mapsUrl} onChange={(event) => set("mapsUrl", event.target.value)} placeholder="https://maps.google.com/..." className="rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal" /></label>
        <label className="grid gap-1 text-sm font-bold text-gray-700">Coste de alquiler (€)<input required min="0" step="0.01" inputMode="decimal" value={draft.rentalCost} onChange={(event) => set("rentalCost", event.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal" /></label>
        <label className="grid gap-1 text-sm font-bold text-gray-700">Nota interna <span className="font-normal text-gray-500">(opcional)</span><textarea value={draft.internalNote} onChange={(event) => set("internalNote", event.target.value)} className="min-h-24 rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal" /></label>
        <button disabled={saving} className="rounded-full bg-lime-500 px-5 py-3 font-bold text-black disabled:opacity-50">{saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear pista"}</button>
        {message ? <p role="status" className="rounded-xl bg-lime-50 p-3 text-sm font-bold text-lime-950">{message}</p> : null}
      </div>
    </form>
    <section className="rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200"><h3 className="text-xl font-black">Pistas cargadas</h3>{loading ? <p className="mt-5 text-sm text-gray-600">Cargando pistas…</p> : pitches.length === 0 ? <p className="mt-5 rounded-xl bg-white p-4 text-sm text-gray-600 ring-1 ring-gray-200">Todavía no cargaste ninguna pista.</p> : <div className="mt-5 space-y-3">{pitches.map((pitch) => <article key={pitch.id} className="rounded-xl bg-white p-4 ring-1 ring-gray-200"><div className="flex flex-wrap items-start justify-between gap-3"><div><h4 className="font-black text-gray-950">{pitch.name}</h4><p className="mt-1 text-sm text-gray-600">{pitch.address}</p><p className="mt-2 text-sm font-semibold text-lime-800">Alquiler: {(pitch.rental_cost_cents / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p>{pitch.maps_url ? <a href={pitch.maps_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-bold text-lime-800 underline">Ver en Maps</a> : null}</div><button type="button" onClick={() => edit(pitch)} className="rounded-full border border-gray-300 px-3 py-2 text-sm font-bold">Editar</button></div></article>)}</div>}</section>
  </div>;
}
