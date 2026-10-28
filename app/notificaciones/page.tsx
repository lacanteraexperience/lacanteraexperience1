import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NotificationCenter from "@/components/NotificationCenter";
import { currentProfile, profileNeedsOnboarding } from "@/lib/current-profile";

export const metadata = { title: "Avisos | La Cantera" };

export default async function NotificationsPage() {
  const profile = await currentProfile();
  if (!profile) redirect("/iniciar-sesion");
  if (profileNeedsOnboarding(profile)) redirect("/completar-perfil");
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-3xl px-6 pb-20 pt-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[.18em] text-lime-700">Comunidad</p><h1 className="mt-2 text-4xl font-black tracking-tight">Avisos</h1><p className="mt-3 text-gray-600">Consultá las comunicaciones generales y las relacionadas con tus partidos.</p><NotificationCenter /></section><Footer /></main>;
}
