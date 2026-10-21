import { redirect } from "next/navigation";
import CreditAdministration from "@/components/CreditAdministration";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { currentProfile } from "@/lib/current-profile";

export const metadata = { title: "Créditos | Administración La Cantera" };

export default async function CreditsPage() {
  const profile = await currentProfile();
  if (!profile) redirect("/iniciar-sesion");
  if (profile.role !== "admin") redirect("/jugar");
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-6xl px-6 pb-20 pt-12 lg:px-8"><CreditAdministration /></section><Footer /></main>;
}
