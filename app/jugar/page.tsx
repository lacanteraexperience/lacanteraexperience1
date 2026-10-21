import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoJugarDashboard from "@/components/DemoJugarDashboard";
import SharedMatchExplorer from "@/components/SharedMatchExplorer";

export const metadata = { title: "Jugar | La Cantera Experience" };

export default function JugarPage() {
  return (
    <main className="min-h-screen bg-stone-50 pt-28 text-gray-950">
      <Navbar dark />
      <section className="public-jugar-content mx-auto max-w-6xl px-6 pb-20 pt-12 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Jugar</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">Encuentra tu próximo partido</h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">Únete a los partidos de La Cantera. Elige pista, horario y formato.</p>
        <SharedMatchExplorer />
      </section>
      <DemoJugarDashboard />
      <Footer />
    </main>
  );
}
