import type { Player, Position } from "./types";
import { formationPositionMultiplier, IMPORTANT_POSITION_SLOTS } from "./formations";
import { getPlayerRoleFit } from "./data";

const clamp = (min: number, v: number, max: number) => Math.max(min, Math.min(max, v));
export type Starter = { player: Player; role: string };

// Per-player: convert role fit 0..5 → small multiplier around 1.00
function roleFitToMultiplier(fit: number): number {
  // Keep per-player effect subtle (≈ ±3%) so team smooth modifier matters more
  const table = [0.94, 0.955, 0.97, 0.985, 1.0, 1.03];
  const i = Math.max(0, Math.min(5, Math.round(fit)));
  return table[i];
}

// 1) Adjusted rating = base × (per-player role fit) × (formation position comfort)
export function adjustedRating(p: Player, role: string, formation: string) {
  const fit = getPlayerRoleFit(p.id, role);
  const roleMult = roleFitToMultiplier(fit ?? 2); // unknown role → treat as weak fit (2)
  const posMult  = formationPositionMultiplier(formation, p.position); // tiny ±
  const adj = p.baseRating * roleMult * posMult;
  return clamp(30, adj, 99);
}

// 2) Equal-weight team average of adjusted ratings
export function avgAdjusted(starters: Starter[], formation: string) {
  const vals = starters.map(s => adjustedRating(s.player, s.role, formation));
  return vals.reduce((a,b)=>a+b,0) / vals.length;
}

// Helper for line grouping
function lineOf(position: Position): "DEF"|"MID"|"ATT"|"GK" {
  if (position === "DF") return "DEF";
  if (position === "MF") return "MID";
  if (position === "FW") return "ATT";
  return "GK";
}

// 3) TacticScore via 4 important slots per formation (best fits in each bucket)
export function tacticScore(starters: Starter[], formation: string) {
  const need = IMPORTANT_POSITION_SLOTS[formation];
  if (!need) return 1.0;

  type Cand = { idx:number; pos:Position; fit:number };
  const cands: Cand[] = starters.map((s,i) => ({
    idx: i,
    pos: s.player.position,
    fit: getPlayerRoleFit(s.player.id, s.role) ?? 2 // 0..5
  }));

  const used = new Set<number>();
  const qualities: number[] = [];

  const pickTop = (pos: Position, count: number) => {
    if (!count) return;
    const avail = cands.filter(c => c.pos === pos && !used.has(c.idx))
                       .sort((a,b)=> b.fit - a.fit);
    for (let k=0; k<count && k<avail.length; k++) {
      const c = avail[k];
      used.add(c.idx);
      // Smooth around baseline 4: 4 -> 1.00, 5 -> ~1.07, 3 -> ~0.93
      const q = clamp(0.85, 1 + 0.07 * (c.fit - 4), 1.14);
      qualities.push(q);
    }
    // missing slots → slight below-neutral contribution
    for (let k=avail.length; k<count; k++) qualities.push(0.97);
  };

  (["MF","FW","DF","GK"] as Position[]).forEach(pos => pickTop(pos, need[pos] ?? 0));

  if (!qualities.length) return 1.0;
  const avgQ = qualities.reduce((a,b)=>a+b,0) / qualities.length;
  return clamp(0.9, avgQ, 1.1);
}

// 4) Smooth team fit (team-wide avg(fit) vs baseline 4)
export function smoothFitMultiplier(starters: Starter[]) {
  const fits = starters.map(s => getPlayerRoleFit(s.player.id, s.role) ?? 2);
  const avgFit = fits.reduce((a,b)=>a+b,0) / fits.length; // 0..5
  const mult = 1 + 0.07 * (avgFit - 4); // “1.07 boost per +1 above baseline”
  return clamp(0.90, mult, 1.10);
}

// 5) Bottleneck across DEF/MID/ATT using adjusted ratings
export function bottleneck(starters: Starter[], formation: string) {
  const by: Record<"DEF"|"MID"|"ATT", number[]> = { DEF:[], MID:[], ATT:[] };
  for (const s of starters) {
    const line = lineOf(s.player.position);
    if (line !== "GK") by[line].push(adjustedRating(s.player, s.role, formation));
  }
  const avg = (xs:number[]) => xs.length ? xs.reduce((a,b)=>a+b,0)/xs.length : 0;
  const d = avg(by.DEF), m = avg(by.MID), a = avg(by.ATT);
  const vals = [d,m,a].filter(x => x>0);
  if (vals.length < 2) return 1.0;
  const ratio = clamp(0.5, Math.min(...vals) / Math.max(...vals), 1.0);
  return Math.pow(ratio, 0.6);
}

// 6) Synergy & Team Strength
export function synergyCore(starters: Starter[], formation: string) {
  const t = tacticScore(starters, formation);
  const f = smoothFitMultiplier(starters);
  const b = bottleneck(starters, formation);
  return t * f * b;
}

export function teamStrength(starters: Starter[], formation: string) {
  const avgAdj = avgAdjusted(starters, formation);
  const syn    = synergyCore(starters, formation);
  // Your blend: 0.6 × AvgAdjusted + 0.4 × (AvgAdjusted × SynergyCore)
  return 0.6 * avgAdj + 0.4 * (avgAdj * syn);
}

// ==== downstream match model (unchanged) ====
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
