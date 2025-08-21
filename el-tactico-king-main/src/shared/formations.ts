import type { Position } from "./types";

/**
 * VERY SMALL multipliers by position per formation (position-based comfort).
 * Keep subtle (1.00–1.03) to avoid double counting with SynergyCore.
 */
export const FORMATION_POSITION_COMFORT: Record<string, Partial<Record<Position, number>>> = {
  "4-3-3": { GK: 1.00, DF: 1.02, MF: 1.03, FW: 1.02 },
  "4-2-3-1": { GK: 1.00, DF: 1.02, MF: 1.03, FW: 1.02 },
  "4-4-2":  { GK: 1.00, DF: 1.02, MF: 1.02, FW: 1.03 },
  "3-5-2":  { GK: 1.00, DF: 1.02, MF: 1.04, FW: 1.02 },
  "3-4-3":  { GK: 1.00, DF: 1.02, MF: 1.03, FW: 1.03 },
  "4-1-4-1":{ GK: 1.00, DF: 1.02, MF: 1.04, FW: 1.02 },
};

export function formationPositionMultiplier(formation: string, position: Position): number {
  return FORMATION_POSITION_COMFORT[formation]?.[position] ?? 1.0;
}

/**
 * IMPORTANT POSITIONS PER FORMATION (your “4 slots”)
 * Define how many of the 4 critical slots come from each position bucket.
 * Example: 4-3-3 → MF:2, FW:1, DF:1  (total must equal 4)
 */
export const IMPORTANT_POSITION_SLOTS: Record<string, Partial<Record<Position, number>>> = {
  "4-3-3":  { MF: 2, FW: 1, DF: 1 },
  "4-2-3-1":{ MF: 2, FW: 1, DF: 1 },
  "4-4-2":  { FW: 2, MF: 1, DF: 1 },
  "3-5-2":  { MF: 2, FW: 1, DF: 1 },   // wingbacks counted under DF bucket
  "3-4-3":  { FW: 2, MF: 1, DF: 1 },
  "4-1-4-1":{ MF: 2, FW: 1, DF: 1 },
};
