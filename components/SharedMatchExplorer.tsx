"use client";

import MatchExplorer from "@/components/MatchExplorer";
import { matches } from "@/lib/matches";

export default function SharedMatchExplorer() {
  return <MatchExplorer matches={matches} />;
}
