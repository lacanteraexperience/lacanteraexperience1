import Footer from "@/components/Footer";
import MatchDetail from "@/components/MatchDetail";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Partido | La Cantera Experience" };

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-3xl px-6 pb-20 pt-12 lg:px-8"><MatchDetail id={id} /></section><Footer /></main>;
}
