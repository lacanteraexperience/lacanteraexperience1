import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProfileEditor from "@/components/ProfileEditor";
import { currentProfile } from "@/lib/current-profile";

export const metadata = { title: "Mi perfil | La Cantera Experience" };

export default async function ProfilePage() {
  const profile = await currentProfile();
  if (!profile) redirect("/iniciar-sesion");
  const roleLabel = profile.role === "admin" ? "Administradora y jugadora" : profile.role === "organizer" ? "Organizadora y jugadora" : "Jugadora";
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-2xl px-6 pb-20 pt-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Cuenta</p><h1 className="mt-3 text-4xl font-black tracking-tight">Mi perfil</h1><p className="mt-4 max-w-xl text-gray-600">Completá tus datos para participar en los partidos de La Cantera.</p><ProfileEditor profile={{ firstName: profile.firstName, lastName: profile.lastName, nickname: profile.nickname, phone: profile.phone, club: profile.club, autoLevel: profile.autoLevel, canteraLevel: profile.canteraLevel, email: profile.email, roleLabel }} /></section><Footer /></main>;
}
