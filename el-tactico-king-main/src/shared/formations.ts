import type { Position } from "./types";

export type ComfortMap = Partial<Record<Position, Partial<Record<string, number>>>>;

const NEUTRAL: ComfortMap = {};

export const FORMATION_COMFORT: Record<string, ComfortMap> = {
  "4-3-3": {
    DF: { "Wingback": 0.98, "Wide Fullback": 1.02 },
    MF: { "Box-to-Box": 1.02 },
    FW: { "Inside Forward": 1.02 }
  },
  "4-2-3-1": {
    DF: { "Wide Fullback": 1.02 },
    MF: { "Anchor": 1.02, "Advanced Playmaker": 1.02 },
    FW: { "False Nine": 1.02, "Inside Forward": 1.02 }
  },
  "4-4-2": {
    DF: { "Wingback": 0.98, "Wide Fullback": 1.02 },
    MF: { "Box-to-Box": 1.02 },
    FW: { "Target Man": 1.02, "Poacher": 1.02, "Inside Forward": 0.98, "False Nine": 0.98 }
  }
};

export function formationComfortMultiplier(formation: string, position: Position, role: string) {
  const posMap = FORMATION_COMFORT[formation]?.[position];
  return posMap?.[role] ?? 1.00; // small ±2% nudge
}
