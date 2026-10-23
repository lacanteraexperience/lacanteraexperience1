"use client";

import { FormEvent, useEffect, useState } from "react";

type Format = { id: string; name: string; capacity: number; minimum: number; rules_group: string };
type Draft = { name: string; capacity: string; minimum: string; rulesGroup: string };
const blank: Draft = { name: "", capacity: "10", minimum: "10", rulesGroup: "Pista pequeña" };

export default function FormatAdministration() {
  const [formats, setFormats] = useState<Format[]>([]);
  const [draft, setDraft] = useState<Draft>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const response = await fetch("/api/admin/formats", { cache: "no-store" });
    const data = await response.json() as { formats?: Format[]; error?: string };
    setFormats(data.formats ?? []);
    if (!response.ok) setMessage(data.error ?? "No se pudieron cargar los formatos.");
  };
  useEffect(() => { void load(); }, []);

  const set = (key: keyof Draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const cancel = () => { setDraft(blank); setEditing(null); setMessage(""); };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true); setMessage("");
    const response = await fetch(editing ? `/api/admin/formats/${editing}` : "/api/admin/formats", {
      method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: draft.name, capacity: Number(draft.capacity), minimum: Number(draft.minimum), rulesGroup: draft.rulesGroup }),
    });
    const data = await response.json() as { error?: string };
    if (!response.ok) setMessage(data.error ?? "No se pudo guardar.");
    else { setMessage(editing ? "Formato actualizado." : "Formato creado."); setDraft(blank); setEditing(null); await load(); }
    setSaving(false);
  };

  const edit = (format: Format) => {
    setEditing(format.id);
    setDraft({ name: format.name, capacity: String(format.capacity), minimum: String(format.minimum), rulesGroup: format.rules_group });
    setMessage("");
  };

  const remove = async (format: Format) => {
    if (!window.confirm(`¿Eliminar el formato “${format.name}”? Esta acción no se puede deshacer.`)) return;
    setMessage("");
    const response = await fetch(`/api/admin/formats/${format.id}`, { method: "DELETE" });
    const data = await response.json() as { error?: string };
    if (!response.ok) setMessage(data.error ?? "No se pudo eliminar el formato.");
    else { setMessage("Formato eliminado."); if (editing === format.id) cancel(); await load(); }
  };

  return <div className="mt-7 grid gap-7 lg:grid-cols-2">
    <form onSubmit={submit} className="rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200">
      <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-black">{editing ? "Editar formato" : "Nuevo formato"}</h3><p className="mt-1 text-sm text-gray-600">Definí las plazas y el mínimo operativo.</p></div>{editing ? <button type="button" onClick={cancel} className="text-sm font-bold underline">Cancelar</button> : null}</div>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-1 text-sm font-bold">Nombre<input required value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej.: 7vs7 + suplentes" className="rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal" /></label>
        <div className="grid grid-cols-2 gap-3"><label className="grid gap-1 text-sm font-bold">Máximo<input required min="1" type="number" value={draft.capacity} onChange={(e) => set("capacity", e.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal" /></label><label className="grid gap-1 text-sm font-bold">Mínimo<input required min="1" type="number" value={draft.minimum} onChange={(e) => set("minimum", e.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal" /></label></div>
        <label className="grid gap-1 text-sm font-bold">Grupo de reglas<select value={draft.rulesGroup} onChange={(e) => set("rulesGroup", e.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal"><option>Pista pequeña</option><option>Pista grande</option><option>Personalizado</option></select></label>
        <button disabled={saving} className="rounded-full bg-lime-500 px-5 py-3 font-bold disabled:opacity-50">{saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear formato"}</button>
        {message ? <p role="status" className="rounded-xl bg-lime-50 p-3 text-sm font-bold">{message}</p> : null}
      </div>
    </form>
    <section className="rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200"><h3 className="text-xl font-black">Formatos cargados</h3><div className="mt-5 space-y-3">{formats.length ? formats.map((format) => <article key={format.id} className="rounded-xl bg-white p-4 ring-1 ring-gray-200"><div className="flex flex-wrap items-start justify-between gap-3"><div><b>{format.name}</b><p className="mt-1 text-sm text-gray-600">Mínimo {format.minimum} · máximo {format.capacity} · {format.rules_group}</p></div><div className="flex gap-2"><button type="button" onClick={() => edit(format)} className="rounded-full border border-gray-300 px-3 py-2 text-sm font-bold">Editar</button><button type="button" onClick={() => void remove(format)} className="rounded-full border border-red-200 px-3 py-2 text-sm font-bold text-red-700">Eliminar</button></div></div></article>) : <p className="rounded-xl bg-white p-4 text-sm text-gray-600 ring-1 ring-gray-200">Todavía no hay formatos cargados.</p>}</div></section>
  </div>;
}
