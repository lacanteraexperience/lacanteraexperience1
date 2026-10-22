import { SignUp } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Registrate | La Cantera Experience" };

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-stone-50 pt-28 text-gray-950">
      <Navbar dark />
      <section className="mx-auto flex min-h-[55vh] max-w-2xl justify-center px-6 py-12 lg:px-8">
        <SignUp path="/registrate" routing="path" signInUrl="/iniciar-sesion" fallbackRedirectUrl="/jugar" />
      </section>
      <Footer />
    </main>
  );
}
