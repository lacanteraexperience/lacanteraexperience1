import { SignIn } from "@clerk/nextjs";
import DemoAccessPanel from "@/components/DemoAccessPanel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Iniciar sesión | La Cantera Experience" };

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-stone-50 pt-28 text-gray-950">
      <Navbar dark />
      <section className="mx-auto grid min-h-[55vh] max-w-5xl gap-10 px-6 py-12 lg:grid-cols-2 lg:px-8">
        <DemoAccessPanel />
        <div className="flex items-center justify-center">
          <SignIn signUpUrl="/registrate" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
