import Link from "next/link";
import Navbar from "@/components/Navbar";
import PartidoCard from "@/components/PartidoCard";
import { partidos } from "@/lib/partidos";

export const metadata = { title: "JUGAR | La Cantera Experience" };

export default async function JugarPage({ searchParams }: { searchParams: Promise<{ vista?: string }> }) {
  const { vista } = await searchParams;
  const sessionPreview = vista === "sesion";

  return (
    <main className="min-h-screen bg-[#f7f7f3] text-zinc-900">
      <Navbar />
      <section className="bg-zinc-950 px-6 pb-20 pt-40 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold tracking-[0.25em] text-lime-400">LA CANTERA · JUGAR</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] md:text-7xl">Tu próximo partido empieza acá.</h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-300">Elegí partido, compartilo con tu equipo y sumate a la cancha. Esta primera etapa es una demo navegable.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-bold tracking-[0.18em] text-lime-700">PARTIDOS DISPONIBLES</p><h2 className="mt-2 text-3xl font-black">Próximas fechas</h2></div>
          {sessionPreview ? <span className="rounded-full bg-lime-200 px-4 py-2 text-sm font-bold text-lime-950">Sesión de prueba · demo</span> : <Link href="/jugar?vista=sesion" className="text-sm font-bold text-zinc-700 underline decoration-lime-500 decoration-2 underline-offset-4">Ver sesión de prueba</Link>}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{partidos.map((partido) => <PartidoCard key={partido.slug} partido={partido} />)}</div>
      </section>
    </main>
  );
}
