"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type DemoView = "inicio" | "partidos" | "mis-partidos" | "notificaciones" | "packs" | "perfil";
const initialRegisteredMatchIds = ["cem-jupiter-5v5", "trinitat-vella-7v7", "mundet-l3-6v6"];
type DemoSessionContextValue = {
  hasDemoSession: boolean;
  startDemo: () => void;
  endDemo: () => void;
  demoView: DemoView;
  setDemoView: (view: DemoView) => void;
  registeredMatchIds: string[];
  isRegistered: (matchId: string) => boolean;
  cancelRegistration: (matchId: string, returnPackCredit?: boolean) => void;
  registerForMatch: (matchId: string) => void;
  registerWithPack: (matchId: string) => boolean;
  packBalance: number;
  buyPack: (matches: number) => void;
  assignedLevel: "Principiante" | "Intermedio" | "Avanzado";
};
const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

export default function DemoSessionProvider({ children }: { children: React.ReactNode }) {
  const [hasDemoSession, setHasDemoSession] = useState(false);
  const [demoView, setDemoView] = useState<DemoView>("inicio");
  const [registeredMatchIds, setRegisteredMatchIds] = useState(initialRegisteredMatchIds);
  const [packBalance, setPackBalance] = useState(0);
  const [packRegistrations, setPackRegistrations] = useState<string[]>([]);
  const assignedLevel: "Principiante" | "Intermedio" | "Avanzado" = "Intermedio";
  const pathname = usePathname();
  useEffect(() => {
    const timer = window.setTimeout(() => setHasDemoSession(window.localStorage.getItem("lacantera-demo-session") === "active"), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const startDemo = () => {
    window.localStorage.setItem("lacantera-demo-session", "active");
    setHasDemoSession(true);
    setDemoView("inicio");
    setRegisteredMatchIds(initialRegisteredMatchIds);
    setPackBalance(0);
    setPackRegistrations([]);
  };
  const endDemo = () => {
    window.localStorage.removeItem("lacantera-demo-session");
    setHasDemoSession(false);
    setRegisteredMatchIds(initialRegisteredMatchIds);
    setPackBalance(0);
    setPackRegistrations([]);
  };
  useEffect(() => {
    document.documentElement.classList.toggle("demo-session-in-jugar", hasDemoSession && (pathname.startsWith("/jugar") || pathname === "/mis-partidos" || pathname === "/mi-perfil"));
    return () => document.documentElement.classList.remove("demo-session-in-jugar");
  }, [hasDemoSession, pathname]);
  const cancelRegistration = (matchId: string, returnPackCredit = false) => {
    const usesPack = packRegistrations.includes(matchId);
    if (usesPack && returnPackCredit) setPackBalance((current) => current + 1);
    setPackRegistrations((current) => current.filter((id) => id !== matchId));
    setRegisteredMatchIds((current) => current.filter((id) => id !== matchId));
  };
  const registerForMatch = (matchId: string) => setRegisteredMatchIds((current) => current.includes(matchId) ? current : [...current, matchId]);
  const registerWithPack = (matchId: string) => {
    if (packBalance < 1 || registeredMatchIds.includes(matchId)) return false;
    setPackBalance((current) => current - 1);
    setPackRegistrations((current) => [...current, matchId]);
    setRegisteredMatchIds((current) => [...current, matchId]);
    return true;
  };
  const isRegistered = (matchId: string) => registeredMatchIds.includes(matchId);
  return <DemoSessionContext.Provider value={{ hasDemoSession, startDemo, endDemo, demoView, setDemoView, registeredMatchIds, isRegistered, cancelRegistration, registerForMatch, registerWithPack, packBalance, buyPack: (amount) => setPackBalance((current) => current + amount), assignedLevel }}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (!context) throw new Error("useDemoSession debe usarse dentro de DemoSessionProvider");
  return context;
}
