import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PlayerCreditBalance from "@/components/PlayerCreditBalance";
import { currentProfile, profileNeedsOnboarding } from "@/lib/current-profile";

export const metadata = { title: "Mis partidos habilitados | La Cantera" };

export default async function MyCreditsPage() {
  const profile = await currentProfile(); if (!profile) redirect("/iniciar-sesion"); if (profileNeedsOnboarding(profile)) redirect("/completar-perfil");
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-2xl px-6 pb-20 pt-12 lg:px-8"><h1 className="text-4xl font-black tracking-tight">Mi saldo</h1><p className="mt-3 text-gray-600">Usá tus partidos habilitados al inscribirte en próximas actividades.</p><div className="mt-8"><PlayerCreditBalance /></div></section><Footer /></main>;
}
