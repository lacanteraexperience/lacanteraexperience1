import { SignIn } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Iniciar sesión | La Cantera Experience" };

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-stone-50 pt-28 text-gray-950">
      <Navbar dark />
      <section className="mx-auto flex min-h-[55vh] max-w-2xl justify-center px-6 py-12 lg:px-8">
        <SignIn signUpUrl="/registrate" />
      </section>
      <Footer />
    </main>
  );
}
