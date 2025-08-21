// api/simulate.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadPlayers, loadFits, getPlayerById, bestRoleForPlayer } from "../src/shared/data";
import { simulateMatch } from "../src/shared/sim";
import type { SimulateRequest, SimulateResponse } from "../src/shared/types";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    const body = req.body as SimulateRequest;
    if (!body?.assignments || body.assignments.length !== 11) {
      res.status(400).json({ error: "Provide exactly 11 role assignments." }); return;
    }

    // Warm CSV caches (players + per-player role fits)
    const players = loadPlayers();
    loadFits(players);

    // Team A: user’s XI from request
    const startersA = body.assignments.map(a => {
      const p = getPlayerById(a.playerId);
      if (!p) throw new Error(`Unknown playerId: ${a.playerId}`);
      return { player: p, role: a.role };
    });

    // Team B: simple opponent XI (remaining players, each given their best-known role)
    const used = new Set(startersA.map(s => s.player.id));
    const pool = Array.from(players.values()).filter(p => !used.has(p.id));
    if (pool.length < 11) throw new Error("Not enough players to form opponent XI.");
    const startersB = pool.slice(0, 11).map(p => ({ player: p, role: bestRoleForPlayer(p.id) ?? "All-Around" }));

    const result = simulateMatch(startersA, startersB, body.formation, body.formation);

    const out: SimulateResponse = {
      ...result,
      meta: { teamId: body.teamId, formation: body.formation, validatedRoles: true },
      debug: { note: "Per-player CSV fits, position-based comfort, important positions + smooth + bottleneck" }
    };

    res.status(200).json(out);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || "Bad request" });
  }
}
