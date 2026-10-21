"use client";

import { useEffect, useState } from "react";

export default function PlayerCreditBalance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { void fetch("/api/credits/me", { cache: "no-store" }).then(async (response) => {
    const data = await response.json() as { balance?: number; error?: string };
    if (!response.ok) setError(data.error ?? "No se pudo consultar el saldo.");
    else setBalance(data.balance ?? 0);
  }).catch(() => setError("No se pudo consultar el saldo.")); }, []);
  if (error) return <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">{error}</p>;
  return <section className="rounded-3xl border border-lime-200 bg-lime-50 p-6"><p className="text-sm font-bold uppercase tracking-[.18em] text-lime-700">Tus partidos habilitados</p><p className="mt-2 text-4xl font-black text-gray-950">{balance === null ? "…" : balance}</p><p className="mt-2 text-sm text-gray-700">{balance === null ? "Consultando tu saldo…" : "Tu administración asigna este saldo tras confirmar el pago por fuera de la web."}</p></section>;
}
