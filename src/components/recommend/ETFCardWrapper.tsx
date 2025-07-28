"use client";

import ETFCard from "./ETFCard";
import { ETF } from "@/types";

interface ETFCardWrapperProps {
  etf: ETF;
}

export default function ETFCardWrapper({ etf }: ETFCardWrapperProps) {
  return <ETFCard etf={etf} />;
}
