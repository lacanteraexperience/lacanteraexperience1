import { redirect } from "next/navigation";

export const metadata = { title: "Mis partidos | La Cantera Experience" };

export default function MyMatchesPage() {
  redirect("/jugar");
}
