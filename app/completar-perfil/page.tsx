import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import OnboardingProfileForm from "@/components/OnboardingProfileForm";
import { currentProfile, profileNeedsOnboarding } from "@/lib/current-profile";

export const metadata = { title: "Completá tu perfil | La Cantera Experience" };

export default async function CompleteProfilePage() {
  const profile = await currentProfile();
  if (!profile) redirect("/iniciar-sesion");
  if (!profileNeedsOnboarding(profile)) redirect("/jugar");
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-2xl px-6 pb-20 pt-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[.2em] text-lime-700">La Cantera Play</p><h1 className="mt-3 text-4xl font-black tracking-tight">Completá tu perfil</h1><p className="mt-4 max-w-xl text-gray-600">Necesitamos estos datos para organizar los partidos, conocer tu nivel y poder contactarte ante una modificación.</p><OnboardingProfileForm initial={{ firstName: profile.firstName === "Jugadora" ? "" : profile.firstName, lastName: profile.lastName, nickname: profile.nickname ?? "", phone: profile.phone ?? "", club: profile.club ?? "", autoLevel: profile.autoLevel ?? "" }} /></section><Footer /></main>;
}
