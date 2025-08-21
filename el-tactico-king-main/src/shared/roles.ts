import type { Position } from "./types";

export const ROLE_CATALOG: Record<Position, string[]> = {
  GK: ["Sweeper Keeper", "Shot Stopper", "Traditional"],
  DF: ["Ball-Playing", "Stopper", "Cover", "Wide Fullback", "Wingback"],
  MF: ["Deep-Lying Playmaker", "Box-to-Box", "Ball Winner", "Advanced Playmaker", "Anchor"],
  FW: ["Poacher", "Target Man", "Pressing Forward", "False Nine", "Inside Forward"]
};

export function isRoleValidForPosition(position: Position, role: string) {
  return ROLE_CATALOG[position]?.includes(role) ?? false;
}

// Optional: if your JSON has CB/LB/RW/etc., map to buckets
export function mapToBucketPosition(pos: string): Position {
  const p = pos.toUpperCase();
  if (p === "GK") return "GK";
  if (["CB","LB","RB","LWB","RWB","DF","FB"].includes(p)) return "DF";
  if (["DM","CM","AM","LM","RM","MF"].includes(p)) return "MF";
  return "FW"; // ST, CF, SS, LW, RW → forwards
}

/** 0–5 fit → tiny multiplier; 4 = neutral 1.00, 5 ≈ +3% */
export function roleFitToMultiplier(fit: number): number {
  const map = [0.94, 0.955, 0.97, 0.985, 1.0, 1.03];
  const c = Math.max(0, Math.min(5, Math.round(fit)));
  return map[c];
}

/** MVP default fits per position+role (use per-player fits later) */
export const DEFAULT_ROLE_FIT: Record<Position, Record<string, number>> = {
  GK: { "Sweeper Keeper": 4, "Shot Stopper": 5, "Traditional": 4 },
  DF: { "Ball-Playing": 4, "Stopper": 4, "Cover": 4, "Wide Fullback": 4, "Wingback": 3 },
  MF: { "Deep-Lying Playmaker": 4, "Box-to-Box": 4, "Ball Winner": 4, "Advanced Playmaker": 4, "Anchor": 4 },
  FW: { "Poacher": 4, "Target Man": 4, "Pressing Forward": 4, "False Nine": 3, "Inside Forward": 4 }
};

export function getDefaultRoleFit(position: Position, role: string): number {
  return DEFAULT_ROLE_FIT[position]?.[role] ?? 4;
}
