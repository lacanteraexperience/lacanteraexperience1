import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProfileEditor from "@/components/ProfileEditor";
import ParticipationStatus from "@/components/ParticipationStatus";
import { currentProfile, profileNeedsOnboarding } from "@/lib/current-profile";

export const metadata = { title: "Mi perfil | La Cantera Experience" };

export default async function ProfilePage() {
  const profile = await currentProfile();
  if (!profile) redirect("/iniciar-sesion");
  const roleLabel = profile.role === "admin" ? "Administradora y jugadora" : profile.role === "organizer" ? "Organizadora y jugadora" : "Jugadora";
  const pendingApproval = !profileNeedsOnboarding(profile) && profile.membershipStatus === "pending";
  const isApproved = profile.membershipStatus === "approved";
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-2xl px-6 pb-20 pt-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Cuenta</p><h1 className="mt-3 text-4xl font-black tracking-tight">Mi perfil</h1><p className="mt-4 max-w-xl text-gray-600">Completá tus datos para participar en los partidos de La Cantera.</p>{pendingApproval ? <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><h2 className="font-black">Perfil enviado · pendiente de validación</h2><p className="mt-2">Ya recibimos tu declaración y los datos de tu perfil. Una administradora revisará y habilitará tu acceso para poder inscribirte a los partidos.</p></section> : null}{isApproved ? <section className="mt-6 rounded-2xl border border-lime-200 bg-lime-50 p-5 text-sm leading-6 text-lime-950"><h2 className="font-black">Perfil habilitado</h2><p className="mt-2">Tu acceso a La Cantera Play está activo.</p></section> : null}<ParticipationStatus /><ProfileEditor profile={{ firstName: profile.firstName, lastName: profile.lastName, nickname: profile.nickname, phone: profile.phone, autoLevel: profile.autoLevel, avatarUrl: profile.avatarUrl, email: profile.email, roleLabel }} /></section><Footer /></main>;
}
