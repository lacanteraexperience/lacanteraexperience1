import Link from "next/link";
import Navbar from "@/components/Navbar";
import { partidos, plazasTotales } from "@/lib/partidos";

export const metadata = { title: "Administración | La Cantera Experience" };

export default function AdminPage() {
  const totalPlazas = partidos.reduce((total, partido) => total + plazasTotales(partido), 0);
  const plazasOcupadas = partidos.reduce((total, partido) => total + partido.ocupadas, 0);
  const partidosLlenos = partidos.filter((partido) => partido.ocupadas >= plazasTotales(partido)).length;

  return (
    <main className="min-h-screen bg-[#f7f7f3] text-zinc-900">
      <Navbar />

      <section className="bg-zinc-950 px-5 pb-12 pt-32 text-white sm:px-6 sm:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.22em] text-lime-400">PANEL INTERNO · DEMOSTRACIÓN</p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-black sm:text-5xl">Administración de partidos</h1>
              <p className="mt-3 max-w-2xl text-zinc-300">Vista de gestión para organizar fechas, plazas y jugadoras. No realiza cambios reales todavía.</p>
            </div>
            <Link href="/jugar" className="w-fit rounded-full border border-white/30 px-5 py-3 text-sm font-bold hover:border-lime-400 hover:text-lime-300">
              Ver vista de jugadora
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Partidos publicados" value={String(partidos.length)} detail="Próximas fechas" />
          <Metric label="Plazas ocupadas" value={`${plazasOcupadas} / ${totalPlazas}`} detail="En todos los partidos" />
          <Metric label="Plazas disponibles" value={String(totalPlazas - plazasOcupadas)} detail="Para nuevas inscripciones" />
          <Metric label="Partidos completos" value={String(partidosLlenos)} detail="Requieren lista de espera" warning={partidosLlenos > 0} />
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-lime-700">AGENDA</p>
            <h2 className="mt-2 text-3xl font-black">Partidos activos</h2>
          </div>
          <button type="button" className="w-fit rounded-full bg-lime-500 px-5 py-3 text-sm font-black text-zinc-950 hover:bg-lime-400">+ Crear partido</button>
        </div>

        <div className="mt-6 grid gap-4">
          {partidos.map((partido) => {
            const total = plazasTotales(partido);
            const lleno = partido.ocupadas >= total;

            return (
              <article key={partido.slug} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-lime-700">{partido.fecha.toUpperCase()} · {partido.hora}</p>
                    <h3 className="mt-2 text-2xl font-black">{partido.campo}</h3>
                    <p className="mt-1 text-sm text-zinc-600">{partido.formato} · {partido.ocupadas} de {total} plazas ocupadas</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1.5 text-sm font-bold ${lleno ? "bg-red-50 text-red-600" : "bg-lime-100 text-lime-800"}`}>
                      {lleno ? "Partido lleno" : `${total - partido.ocupadas} plazas libres`}
                    </span>
                    <Link href={`/jugar/${partido.slug}?vista=sesion`} className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-bold hover:border-lime-500">
                      Ver detalle
                    </Link>
                    <button type="button" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700">Gestionar</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-10 rounded-3xl border border-dashed border-zinc-300 bg-white p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.18em] text-lime-700">PRÓXIMA ETAPA</p>
          <h2 className="mt-2 text-2xl font-black">Acciones administrativas a conectar</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">Crear y editar partidos, confirmar pagos, mover jugadoras a lista de espera, enviar avisos y consultar inscripciones. Esta pantalla es visual y navegable; todavía no guarda datos.</p>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value, detail, warning = false }: { label: string; value: string; detail: string; warning?: boolean }) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold tracking-[0.12em] text-zinc-500">{label.toUpperCase()}</p>
      <p className={`mt-3 text-3xl font-black ${warning ? "text-red-600" : "text-zinc-950"}`}>{value}</p>
      <p className="mt-1 text-sm text-zinc-600">{detail}</p>
    </article>
  );
}
