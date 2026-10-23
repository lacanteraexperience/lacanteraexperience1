import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AdministrationDashboard from "@/components/AdministrationDashboard";
import { currentProfile } from "@/lib/current-profile";

export const metadata = { title: "Administración | La Cantera Experience" };

export default async function AdministrationPage() {
  const profile = await currentProfile();
  if (!profile) redirect("/iniciar-sesion");
  if (profile.role !== "admin") redirect("/jugar");

  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[.2em] text-lime-700">Administración</p><h1 className="mt-3 text-4xl font-black tracking-tight">Panel de La Cantera</h1><p className="mt-3 max-w-2xl text-gray-600">Gestioná la operativa desde un único panel. No hay información de prueba cargada.</p><AdministrationDashboard /></section><Footer /></main>;
}
