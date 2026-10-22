import { redirect } from "next/navigation";

export const metadata = { title: "Administración | La Cantera Experience" };

export default function AdminDemoPage() {
  redirect("/administracion/creditos");
}
