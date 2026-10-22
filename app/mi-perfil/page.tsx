import { redirect } from "next/navigation";

export const metadata = { title: "Mi perfil | La Cantera Experience" };

export default function ProfilePage() {
  redirect("/jugar");
}
