import fs from "node:fs";
import path from "node:path";
import { csvToObjects } from "./csv";
import type { Player, Position } from "./types";

const PLAYERS_CSV = path.join(process.cwd(), "data", "private", "players_standardized.csv");
const FITS_CSV    = path.join(process.cwd(), "data", "private", "playerfitsfinal.csv");

// Warm caches across requests
let _playersById: Map<string, Player> | null = null;
let _fitsByPlayer: Map<string, Map<string, number>> | null = null; // playerId -> (role -> fit 0..5)

function bucket(posRaw: string): Position {
  const p = (posRaw || "").trim().toUpperCase();
  if (p === "GK") return "GK";
  if (["CB","LB","RB","LWB","RWB","DF","FB","CBK"].includes(p)) return "DF";
  if (["DM","CM","AM","LM","RM","MF"].includes(p)) return "MF";
  return "FW"; // ST, CF, SS, LW, RW, etc.
}

export function loadPlayers(): Map<string, Player> {
  if (_playersById) return _playersById;
  const text = fs.readFileSync(PLAYERS_CSV, "utf8");
  const rows = csvToObjects(text);
  const map = new Map<string, Player>();
  for (const r of rows) {
    const id = (r.player_id ?? r.playerId ?? r.id ?? "").trim();
    const name = r.name ?? "";
    const team = r.team ?? "";
    const pos0 = r.position ?? "";
    const br0  = r.base_rating ?? r.baseRating ?? "70";
    if (!id || !name || !pos0) continue;
    const position = bucket(pos0);
    const baseRating = Math.max(30, Math.min(99, Number(br0) || 70));
    map.set(id, { id, name, team, position, baseRating });
  }
  _playersById = map;
  return map;
}

export function loadFits(playersById?: Map<string, Player>): Map<string, Map<string, number>> {
  if (_fitsByPlayer) return _fitsByPlayer;
  const text = fs.readFileSync(FITS_CSV, "utf8");
  const rows = csvToObjects(text);
  const pmap = playersById ?? loadPlayers();
  const out = new Map<string, Map<string, number>>();

  for (const r of rows) {
    const pid = (r.player_id_text ?? r.player_id ?? r.id ?? "").trim();
    const role = (r.role_id ?? r.role ?? "").trim();
    const fit0 = r.fit ?? r.fit_score ?? r.score;
    if (!pid || !role || fit0 == null) continue;
    if (!pmap.has(pid)) continue; // unknown player in CSV

    const fit = Math.max(0, Math.min(5, Math.round(Number(fit0))));
    if (!out.has(pid)) out.set(pid, new Map());
    out.get(pid)!.set(role, fit);
  }

  _fitsByPlayer = out;
  return out;
}

export function getPlayerById(id: string): Player | undefined {
  return loadPlayers().get(id);
}

export function getPlayerRoleFit(playerId: string, role: string): number | undefined {
  const m = loadFits().get(playerId);
  return m?.get(role);
}

export function bestRoleForPlayer(playerId: string): string | null {
  const m = loadFits().get(playerId);
  if (!m || m.size === 0) return null;
  let bestRole = null as string | null;
  let best = -1;
  for (const [role, fit] of m.entries()) {
    if (fit > best) { best = fit; bestRole = role; }
  }
  return bestRole;
}

export function allowedRolesForPlayer(playerId: string): string[] {
  const m = loadFits().get(playerId);
  return m ? Array.from(m.keys()) : [];
}
