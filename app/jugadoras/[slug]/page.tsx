import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const profiles: Record<string, { name: string; nickname: string; club: string; level: string; organizer?: boolean; played: number; organized?: number }> = {
  "aurora-muestra": { name: "Aurora Muestra", nickname: "Auri", club: "FC Barcelona", level: "Intermedio", played: 12 },
  "brisa-muestra": { name: "Brisa Muestra", nickname: "Brisa", club: "RCD Espanyol", level: "Intermedio", played: 9 },
  "cielo-muestra": { name: "Cielo Muestra", nickname: "Cie", club: "FC Barcelona", level: "Avanzado", played: 18 },
  "duna-muestra": { name: "Duna Muestra", nickname: "Duna", club: "CE Europa", level: "Intermedio", played: 7 },
  "estela-muestra": { name: "Estela Muestra", nickname: "Este", club: "FC Barcelona", level: "Principiante", played: 5 },
  "flora-muestra": { name: "Flora Muestra", nickname: "Flo", club: "RCD Espanyol", level: "Intermedio", played: 11 },
  "gabriela-marty": { name: "Gabriela Marty", nickname: "Gabi", club: "FC Barcelona", level: "Intermedio", organizer: true, played: 18, organized: 24 },
};

export default async function PlayerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = profiles[slug] ?? { name: "Jugadora de demostración", nickname: "", club: "—", level: "—", played: 0 };
  const initials = profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2);

  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950">
    <Navbar dark />
    <section className="jugar-page-content mx-auto max-w-3xl px-6 pb-20 pt-12 lg:px-8">
      <Link href="/jugar" className="text-sm font-bold text-lime-800 underline underline-offset-4">Volver a Partidos</Link>
      <article className="mt-6 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-200 sm:p-10">
        <div className="flex items-center gap-5"><span className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-xl font-black text-white">{initials}</span><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-lime-700">Perfil de demostración</p><h1 className="mt-1 text-3xl font-black">{profile.name}</h1>{profile.organizer && <span className="mt-2 inline-flex rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-800">Organizadora</span>}</div></div>
        <dl className="mt-9 grid gap-6 sm:grid-cols-2"><Info label="Apodo" value={profile.nickname || "—"} /><Info label="Equipo del que es aficionada" value={profile.club} /><Info label="Nivel autoasignado" value={profile.level} /><Info label="Cantidad de partidos jugados" value={String(profile.played)} />{profile.organizer && <Info label="Cantidad de partidos organizados" value={String(profile.organized ?? 0)} />}</dl>
        <p className="mt-9 rounded-xl bg-lime-50 p-4 text-sm text-gray-700">Los datos mostrados son ficticios y solo existen en esta vista local de prueba.</p>
      </article>
    </section>
    <Footer />
  </main>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-sm font-semibold text-gray-500">{label}</dt><dd className="mt-1 text-lg font-bold">{value}</dd></div>; }
