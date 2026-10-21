"use client";

import { useEffect, useState } from "react";

type Player = { id: string; first_name: string; last_name: string; nickname: string | null; email: string | null; balance: number };

export default function CreditAdministration() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerId, setPlayerId] = useState("");
  const [amount, setAmount] = useState("1");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/credits", { cache: "no-store" });
    const data = await response.json() as { players?: Player[]; error?: string };
    if (!response.ok) setMessage(data.error ?? "No se pudieron cargar las jugadoras.");
    else setPlayers(data.players ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const assign = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, amount: Number(amount), note }),
    });
    const data = await response.json() as { balance?: number; error?: string };
    if (!response.ok) { setMessage(data.error ?? "No se pudo asignar el saldo."); return; }
    setMessage(`Partidos habilitados. Nuevo saldo: ${data.balance}.`);
    setAmount("1"); setNote("");
    await load();
  };

  return <section className="mt-8 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
    <form onSubmit={assign} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-lime-700">Créditos de partidos</p>
      <h1 className="mt-2 text-3xl font-black">Habilitar partidos</h1>
      <p className="mt-3 text-sm text-gray-600">Asigná partidos a una jugadora cuando se confirme su pago por fuera de la web. No se realiza ningún cobro desde aquí.</p>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm font-bold text-gray-700">Jugadora
          <select required value={playerId} onChange={(event) => setPlayerId(event.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal">
            <option value="">Elegir jugadora</option>
            {players.map((player) => <option key={player.id} value={player.id}>{player.first_name} {player.last_name}{player.nickname ? ` · ${player.nickname}` : ""}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold text-gray-700">Cantidad de partidos
          <input required min="1" step="1" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="rounded-xl border border-gray-300 px-3 py-3 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-bold text-gray-700">Nota interna <span className="font-normal text-gray-500">(opcional)</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ej.: transferencia recibida el 21/10" className="min-h-24 rounded-xl border border-gray-300 px-3 py-3 font-normal" />
        </label>
        <button disabled={!playerId || Number(amount) < 1} className="rounded-full bg-lime-500 px-5 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-40">Habilitar partidos</button>
        {message && <p className="rounded-xl bg-lime-50 p-3 text-sm font-bold text-lime-900" role="status">{message}</p>}
      </div>
    </form>
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-lime-700">Saldos actuales</p>
      <h2 className="mt-2 text-2xl font-black">Jugadoras habilitadas</h2>
      {loading ? <p className="mt-6 text-sm text-gray-600">Cargando jugadoras…</p> : players.length === 0 ? <p className="mt-6 rounded-2xl bg-stone-100 p-4 text-sm text-gray-600">Las jugadoras aparecerán aquí al crear una cuenta real e iniciar sesión por primera vez.</p> : <div className="mt-5 divide-y divide-gray-100">{players.map((player) => <article key={player.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-black">{player.first_name} {player.last_name}</p><p className="mt-1 text-sm text-gray-600">{player.email ?? player.nickname ?? "Sin correo"}</p></div><span className="rounded-full bg-lime-100 px-4 py-2 text-sm font-black text-lime-900">{player.balance} {player.balance === 1 ? "partido" : "partidos"}</span></article>)}</div>}
    </section>
  </section>;
}
