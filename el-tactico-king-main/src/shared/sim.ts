import type { Player, Position } from "./types";
import { isRoleValidForPosition, getDefaultRoleFit, roleFitToMultiplier } from "./roles";
import { formationComfortMultiplier } from "./formations";

const clamp = (min: number, v: number, max: number) => Math.max(min, Math.min(max, v));
export type Starter = { player: Player; role: string };

export function adjustedRating(p: Player, role: string, formation: string) {
  if (!isRoleValidForPosition(p.position, role)) return p.baseRating * 0.95;
  const fit = getDefaultRoleFit(p.position as Position, role);
  const roleMult = roleFitToMultiplier(fit);          // ± ~3%
  const formMult = formationComfortMultiplier(formation, p.position as Position, role); // ±2%
  const adj = p.baseRating * roleMult * formMult;
  return clamp(30, adj, 99);
}

export function teamStrength(starters: Starter[], formation: string) {
  const vals = starters.map(s => adjustedRating(s.player, s.role, formation));
  return vals.reduce((a,b)=>a+b,0) / vals.length;
}

export function possessionPct(strA: number, strB: number) {
  const ALPHA = 0.35;
  const delta = strA - strB;
  const a = clamp(30, 50 + ALPHA * delta, 70);
  return { a, b: 100 - a };
}

export function shotsFromPossession(posPct: number) {
  const BASE_TOTAL = 22;
  const shots = Math.round(BASE_TOTAL * (posPct / 100));
  return clamp(3, shots, 20);
}

function chanceQuality(strSelf: number, strOpp: number) {
  const base = 0.10, GAP = 0.07;
  const gap = (strSelf - strOpp) / 100;
  return clamp(0.05, base + GAP * gap, 0.18);
}

function rng16() { return (Math.random() - 0.5) * 0.33; } // [-0.165,+0.165]

export function goalsFromShots(shots: number, strSelf: number, strOpp: number) {
  const p = chanceQuality(strSelf, strOpp);
  const noisyP = clamp(0.03, p * (1 + rng16()), 0.22);
  const expected = shots * noisyP;
  const jittered = expected * (1 + rng16() / 2);
  return Math.max(0, Math.round(jittered));
}

export function simulateMatch(teamA: Starter[], teamB: Starter[], formationA: string, formationB: string) {
  const strA = teamStrength(teamA, formationA);
  const strB = teamStrength(teamB, formationB);
  const { a: posA, b: posB } = possessionPct(strA, strB);
  const shotsA = shotsFromPossession(posA);
  const shotsB = shotsFromPossession(posB);
  const goalsA = goalsFromShots(shotsA, strA, strB);
  const goalsB = goalsFromShots(shotsB, strB, strA);
  return {
    strengths: { A: Math.round(strA*10)/10, B: Math.round(strB*10)/10 },
    possession: { A: posA, B: posB },
    shots: { A: shotsA, B: shotsB },
    score: { A: goalsA, B: goalsB }
  };
}
