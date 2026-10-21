import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminDemoDashboard from "@/components/AdminDemoDashboard";

export const metadata = { title: "Administración demo | La Cantera Experience" };

export default function AdminDemoPage() {
  return <main className="admin-demo min-h-screen bg-stone-50 pt-24 text-gray-950 sm:pt-28"><Navbar dark /><section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8"><AdminDemoDashboard /></section><Footer /></main>;
}
