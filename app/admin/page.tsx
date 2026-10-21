import Navbar from "@/components/Navbar";
import AdminDashboard from "@/components/AdminDashboard";
import { partidos } from "@/lib/partidos";

export const metadata = { title: "Administración | La Cantera Experience" };

export default function AdminPage() {
  return <main className="min-h-screen bg-[#f7f7f3] text-zinc-900"><Navbar /><AdminDashboard initialPartidos={partidos} /></main>;
}
