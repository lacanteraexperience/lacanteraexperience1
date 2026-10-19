import Link from "next/link";
import { Partido, plazasTotales } from "@/lib/partidos";
import ShareButton from "./ShareButton";

export default function PartidoCard({ partido }: { partido: Partido }) {
  const total = plazasTotales(partido);
  const lleno = partido.ocupadas >= total;
  const url = `/jugar/${partido.slug}`;

  return (
    <article className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold tracking-[0.18em] text-lime-700">PRÓXIMO PARTIDO</p>
          <h2 className="text-2xl font-black text-zinc-900">{partido.campo}</h2>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">{partido.formato}</span>
      </div>
      <div className="space-y-3 border-y border-zinc-100 py-5 text-sm text-zinc-700">
        <p><span className="font-semibold text-zinc-950">Día y hora:</span> {partido.fecha}, {partido.hora}</p>
        <p><span className="font-semibold text-zinc-950">Plazas:</span> {partido.ocupadas} / {total}</p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        {lleno ? <span className="text-sm font-bold text-red-600">Partido lleno</span> : <span className="text-sm font-bold text-lime-700">{total - partido.ocupadas} plazas disponibles</span>}
        <ShareButton url={url} />
      </div>
      <Link href={url} className="mt-5 rounded-full bg-zinc-950 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-lime-500 hover:text-zinc-950">Ver partido</Link>
    </article>
  );
}
