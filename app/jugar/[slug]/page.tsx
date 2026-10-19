import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ShareButton from "@/components/ShareButton";
import { partidos, plazasTotales } from "@/lib/partidos";

type PartidoPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ vista?: string }>;
};

export default async function PartidoPage({ params, searchParams }: PartidoPageProps) {
  const [{ slug }, { vista }] = await Promise.all([params, searchParams]);
  const partido = partidos.find((item) => item.slug === slug);

  if (!partido) notFound();

  const sesionDePrueba = vista === "sesion";
  const total = plazasTotales(partido);
  const lleno = partido.ocupadas >= total;
  const url = `/jugar/${partido.slug}`;

  return (
    <main className="min-h-screen bg-[#f7f7f3] text-zinc-900">
      <Navbar />

      <section className="bg-zinc-950 px-5 pb-12 pt-32 text-white sm:px-6 sm:pt-40 md:pb-16">
        <div className="mx-auto max-w-5xl">
          <Link href="/jugar" className="text-sm font-bold text-lime-400 hover:text-lime-300">
            ← Volver a partidos
          </Link>
          <p className="mt-8 text-xs font-bold tracking-[0.22em] text-lime-400 sm:mt-10 sm:text-sm">
            PARTIDO {sesionDePrueba ? "· SESIÓN DE PRUEBA" : "PÚBLICO"}
          </p>
          <h1 className="mt-3 text-4xl font-black leading-none sm:text-5xl md:text-6xl">{partido.campo}</h1>
          <p className="mt-5 text-base text-zinc-300 sm:text-xl">
            {partido.fecha} <span className="hidden sm:inline">·</span><span className="sm:hidden"><br /></span> {partido.hora} · {partido.formato}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-5 py-8 sm:px-6 sm:py-12 md:grid-cols-[minmax(0,1.3fr)_minmax(15rem,.7fr)] md:gap-8">
        <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-lime-700">INFORMACIÓN DEL PARTIDO</p>
              <h2 className="mt-2 text-2xl font-black">{partido.campo}</h2>
            </div>
            {lleno && <span className="w-fit rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">Partido lleno</span>}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-[11px] font-bold tracking-wider text-zinc-500">FORMATO</p>
              <p className="mt-1 text-sm font-bold sm:text-base">{partido.formato}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-[11px] font-bold tracking-wider text-zinc-500">PLAZAS</p>
              <p className="mt-1 text-sm font-bold sm:text-base">{partido.ocupadas} / {total}</p>
            </div>
          </div>

          {sesionDePrueba ? (
            <div className="mt-7 border-t border-zinc-100 pt-7">
              <p className="text-xs font-bold tracking-[0.18em] text-lime-700">MODO DEMOSTRACIÓN</p>
              <h2 className="mt-2 text-xl font-black sm:text-2xl">Información completa del partido</h2>

              <a
                className="mt-5 block text-sm font-bold leading-relaxed text-lime-700 underline decoration-lime-500 underline-offset-4 sm:text-base"
                href={partido.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                {partido.direccion} · Ver en Maps
              </a>

              <div className="mt-7 grid gap-8 border-t border-zinc-100 pt-6 sm:grid-cols-2 sm:gap-10">
                <div>
                  <h3 className="font-black">Reglas</h3>
                  <ul className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600">
                    {partido.reglas.map((regla) => <li key={regla}>{regla}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-black">Jugadoras inscriptas</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-700">
                    {partido.jugadoras.join(" · ")}
                  </p>
                </div>
              </div>

              {!lleno && (
                <button type="button" className="mt-8 w-full rounded-full bg-lime-500 px-5 py-3.5 text-sm font-black text-zinc-950 transition hover:bg-lime-400 sm:w-auto sm:px-7">
                  Próximamente: inscribirme
                </button>
              )}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-zinc-300 p-5">
              <p className="font-bold">Información completa para jugadoras</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                La dirección, las reglas y las jugadoras inscriptas no se muestran en un enlace público.
              </p>
              <Link href={`/jugar/${partido.slug}?vista=sesion`} className="mt-4 inline-block text-sm font-bold text-lime-700 underline">
                Abrir sesión de prueba
              </Link>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold tracking-[0.14em] text-lime-700">COMPARTÍ EL PARTIDO</p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">Mandá este enlace a quienes quieran conocer la fecha.</p>
          <div className="mt-5"><ShareButton url={url} /></div>
        </aside>
      </section>
    </main>
  );
}
