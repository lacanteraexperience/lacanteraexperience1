import Footer from "@/components/Footer";
import MyMatches from "@/components/MyMatches";
import Navbar from "@/components/Navbar";
import { currentProfile, profileNeedsOnboarding } from "@/lib/current-profile";
import { redirect } from "next/navigation";

export const metadata = { title: "Mis partidos | La Cantera Experience" };

export default async function MyMatchesPage() {
  const profile = await currentProfile(); if (!profile) redirect("/iniciar-sesion"); if (profileNeedsOnboarding(profile)) redirect("/completar-perfil");
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-5xl px-6 pb-20 pt-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Tu agenda</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Mis partidos</h1><p className="mt-4 max-w-xl text-lg text-gray-600">Consultá tus inscripciones y gestioná una baja cuando la necesites.</p><MyMatches /></section><Footer /></main>;
}
