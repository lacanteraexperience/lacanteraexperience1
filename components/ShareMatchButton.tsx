"use client";

import { useState } from "react";
import { HiOutlineShare } from "react-icons/hi2";

export default function ShareMatchButton({ matchId }: { matchId: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/jugar/${matchId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-full border border-lime-600 px-4 py-2 text-sm font-semibold text-lime-800 transition hover:bg-lime-50"
    >
      <HiOutlineShare className="h-4 w-4" />
      {copied ? "Enlace copiado" : "Compartir"}
    </button>
  );
}
