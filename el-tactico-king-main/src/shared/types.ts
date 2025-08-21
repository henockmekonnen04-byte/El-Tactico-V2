export type Position = "GK" | "DF" | "MF" | "FW";

export type Player = {
  id: string;
  name: string;
  team: string;
  position: Position;   // If your JSON has CB/LW/etc., we’ll map it
  baseRating: number;   // 0–100
};

export type RoleAssignment = { playerId: string; role: string };

export type SimulateRequest = {
  teamId: string;
  formation: string;            // e.g., "4-3-3", "4-2-3-1"
  assignments: RoleAssignment[]; // exactly 11 starters with roles
};

export type SimulateResponse = {
  strengths: { A: number; B: number };
  possession: { A: number; B: number };
  shots: { A: number; B: number };
  score: { A: number; B: number };
  meta: { teamId: string; formation: string; validatedRoles: boolean };
  debug?: any;
};
