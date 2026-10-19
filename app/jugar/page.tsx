import Link from "next/link";
import Navbar from "@/components/Navbar";
import PartidoCard from "@/components/PartidoCard";
import { partidos } from "@/lib/partidos";

export const metadata = { title: "JUGAR | La Cantera Experience" };

const sessionContent = {
  "mis-partidos": { title: "Mis partidos", text: "Todavía no tenés partidos reservados en esta sesión de prueba." },
  notificaciones: { title: "Notificaciones", text: "No tenés notificaciones nuevas." },
  perfil: { title: "Mi perfil", text: "Perfil de prueba. Más adelante podrás completar tus datos y preferencias." },
} as const;

export default async function JugarPage({ searchParams }: { searchParams: Promise<{ vista?: string; seccion?: string }> }) {
  const { vista, seccion } = await searchParams;
  const sessionPreview = vista === "sesion";
  const selectedSection = sessionPreview ? seccion : undefined;

  return (
    <main className="min-h-screen bg-[#f7f7f3] text-zinc-900">
      <Navbar />
      <section className="bg-zinc-950 px-5 pb-16 pt-28 text-white sm:px-6 sm:pb-20 sm:pt-32 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold tracking-[0.25em] text-lime-400">LA CANTERA · JUGAR</p>
          <h1 className="max-w-3xl text-4xl font-black leading-[0.98] sm:text-5xl md:text-7xl">Tu próximo partido empieza acá.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:mt-7 sm:text-lg">Elige tu pista, únete al equipo y disfruta del juego.</p>
        </div>
      </section>
      <section id="partidos" className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14">
        {selectedSection === "pack" && (
          <section className="mb-10 rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
            <p className="text-xs font-bold tracking-[0.18em] text-lime-400">COMPRA PACK · SESIÓN DE PRUEBA</p>
            <h2 className="mt-3 text-3xl font-black">Elegí cómo querés jugar</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {["Partido individual", "Pack de 4 partidos", "Pack de 8 partidos"].map((pack) => (
                <div key={pack} className="rounded-2xl bg-white p-5 text-zinc-900">
                  <h3 className="font-black">{pack}</h3>
                  <p className="mt-2 text-sm text-zinc-600">La compra estará disponible en la próxima etapa.</p>
                  <button type="button" className="mt-5 w-full rounded-full bg-lime-500 px-4 py-3 text-sm font-black">Próximamente</button>
                </div>
              ))}
            </div>
          </section>
        )}
        {selectedSection && selectedSection !== "pack" && selectedSection in sessionContent && (
          <section className="mb-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold tracking-[0.18em] text-lime-700">SESIÓN DE PRUEBA</p>
            <h2 className="mt-3 text-3xl font-black">{sessionContent[selectedSection as keyof typeof sessionContent].title}</h2>
            <p className="mt-3 max-w-2xl text-zinc-600">{sessionContent[selectedSection as keyof typeof sessionContent].text}</p>
          </section>
        )}
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-bold tracking-[0.18em] text-lime-700">PARTIDOS DISPONIBLES</p><h2 className="mt-2 text-3xl font-black">Próximas fechas</h2></div>
          {sessionPreview ? <span className="rounded-full bg-lime-200 px-4 py-2 text-sm font-bold text-lime-950">Sesión de prueba · demo</span> : <Link href="/jugar?vista=sesion" className="text-sm font-bold text-zinc-700 underline decoration-lime-500 decoration-2 underline-offset-4">Ver sesión de prueba</Link>}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{partidos.map((partido) => <PartidoCard key={partido.slug} partido={partido} />)}</div>
      </section>
    </main>
  );
}
