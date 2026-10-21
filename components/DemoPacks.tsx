"use client";

import { useState } from "react";
import { useDemoSession } from "@/components/DemoSessionProvider";

const packs = [
  { matches: 4, price: 23 },
  { matches: 6, price: 35 },
  { matches: 8, price: 46 },
];

export default function DemoPacks() {
  const { packBalance, buyPack } = useDemoSession();
  const [message, setMessage] = useState("");
  return <section className="mt-6"><div className="rounded-3xl border border-lime-200 bg-lime-50 p-6"><p className="text-sm font-bold uppercase tracking-[.18em] text-lime-700">Tu saldo</p><p className="mt-2 text-4xl font-black">{packBalance} {packBalance === 1 ? "partido" : "partidos"}</p><p className="mt-2 text-sm text-gray-700">Podés usarlo en Partidos y Amistosos. No aplica a entrenamientos ni entrenamientos técnicos.</p></div><div className="mt-6 grid gap-4 md:grid-cols-3">{packs.map((pack) => <article key={pack.matches} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200"><p className="text-sm font-bold uppercase tracking-[.16em] text-lime-700">Pack</p><h2 className="mt-2 text-2xl font-black">{pack.matches} partidos</h2><p className="mt-4 text-3xl font-black">{pack.price} €</p><p className="mt-3 text-sm text-gray-600">Saldo utilizable en toda la plataforma para partidos y amistosos.</p><button type="button" onClick={() => { buyPack(pack.matches); setMessage(`Pack de ${pack.matches} partidos añadido al saldo de prueba.`); }} className="mt-6 w-full rounded-full bg-lime-500 px-4 py-3 text-sm font-bold text-black">Comprar pack</button></article>)}</div><section className="mt-6 rounded-2xl bg-stone-100 p-5 text-sm text-gray-700"><b>Cancelaciones con pack:</b> si cancelás con más de 12 horas, recuperás un partido en tu saldo. Dentro de las 12 horas se libera la plaza, pero no se repone el saldo.</section>{message && <p className="mt-4 rounded-xl bg-lime-50 p-3 text-sm font-bold text-lime-900" role="status">{message}</p>}</section>;
}
