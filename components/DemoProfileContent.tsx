"use client";

import Image from "next/image";
import { useState } from "react";

export default function DemoProfileContent() {
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("Gabi");
  const [club, setClub] = useState("FC Barcelona");
  const [level, setLevel] = useState("Intermedio");
  const [saved, setSaved] = useState(false);

  function saveProfile() {
    setEditing(false);
    setSaved(true);
  }

  return <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-200 sm:p-10">
    <div className="flex flex-wrap items-center justify-between gap-5"><div className="flex items-center gap-5"><Image src="/images/galeria-comunidad.jpg" alt="Foto de ejemplo de Gabriela Marty" width={88} height={88} className="h-[88px] w-[88px] rounded-full object-cover" /><div><h1 className="text-3xl font-black">Gabriela Marty</h1><p className="mt-1 text-gray-600">Perfil de demostración local</p></div></div><button type="button" onClick={() => { setEditing((current) => !current); setSaved(false); }} className="rounded-full border border-lime-600 px-4 py-2 text-sm font-bold text-lime-800 hover:bg-lime-50">{editing ? "Cancelar edición" : "Editar perfil"}</button></div>
    {editing ? <div className="mt-9 grid gap-5 sm:grid-cols-2"><Field label="Apodo" value={nickname} onChange={setNickname} /><Field label="Equipo del que eres aficionada" value={club} onChange={setClub} /><label className="grid gap-2 text-sm font-semibold text-gray-600">Nivel autoasignado<select value={level} onChange={(event) => setLevel(event.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base font-bold text-gray-950"><option>Principiante</option><option>Intermedio</option><option>Avanzado</option></select></label><div><p className="text-sm font-semibold text-gray-500">Cantidad de partidos jugados</p><p className="mt-2 text-lg font-bold">18</p></div><div><p className="text-sm font-semibold text-gray-500">Cantidad de partidos organizados</p><p className="mt-2 text-lg font-bold">24</p></div><div className="sm:col-span-2"><button type="button" onClick={saveProfile} className="rounded-full bg-lime-500 px-5 py-3 text-sm font-bold text-black hover:bg-lime-400">Guardar cambios de prueba</button></div></div> : <dl className="mt-9 grid gap-6 sm:grid-cols-2"><Info label="Apodo" value={nickname} /><Info label="Equipo del que eres aficionada" value={club} /><Info label="Nivel autoasignado" value={level} /><Info label="Cantidad de partidos jugados" value="18" /><Info label="Cantidad de partidos organizados" value="24" /></dl>}
    {saved && <p className="mt-6 rounded-xl bg-lime-50 p-4 text-sm font-medium text-lime-900" role="status">Cambios guardados solo en esta demostración local.</p>}
    {!saved && <p className="mt-8 rounded-xl bg-lime-50 p-4 text-sm text-gray-700">Datos ficticios, disponibles solo durante esta demostración local.</p>}
  </div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="grid gap-2 text-sm font-semibold text-gray-600">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-gray-300 px-3 py-2.5 text-base font-bold text-gray-950" /></label>; }
function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-sm font-semibold text-gray-500">{label}</dt><dd className="mt-1 text-lg font-bold text-gray-950">{value}</dd></div>; }
