import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MatchSessionDetails from "@/components/MatchSessionDetails";
import ShareMatchButton from "@/components/ShareMatchButton";
import { matches } from "@/lib/matches";

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = matches.find((item) => item.id === id);
  if (!match) notFound();

  const isFull = match.occupied >= match.capacity;

  return (
    <main className="min-h-screen bg-stone-50 pt-28 text-gray-950">
      <Navbar dark />
      <section className="jugar-page-content mx-auto max-w-3xl px-6 pb-20 pt-12 lg:px-8">
        <Link href="/jugar" className="text-sm font-semibold text-lime-700 underline underline-offset-4">← Volver a partidos</Link>
        <article className="mt-6 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-200 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">{match.field}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{match.dateTime}</h1>
          <p className="mt-4 text-lg text-gray-600">Formato: {match.format}</p>
          <p className={`mt-3 font-bold ${isFull ? "text-red-600" : "text-gray-900"}`}>
            {isFull ? "Partido lleno" : `${match.occupied} de ${match.capacity} plazas ocupadas`}
          </p>
          <p className="mt-6 rounded-2xl bg-lime-50 px-4 py-3 text-sm font-medium text-gray-700">
            <Link href="/iniciar-sesion" className="font-bold text-lime-800 underline underline-offset-4">
              Activa la sesión de prueba
            </Link>{" "}
            para ver la información completa e inscribirte
          </p>
          <div className="mt-7"><ShareMatchButton matchId={match.id} /></div>
          <MatchSessionDetails match={match} />
        </article>
      </section>
      <Footer />
    </main>
  );
}
