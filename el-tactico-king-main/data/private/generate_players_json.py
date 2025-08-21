#!/usr/bin/env python3
"""
Generate data/private/players.json from players_standardized.csv.

Usage:
  python scripts/generate_players_json.py \
    --csv ./players_standardized.csv \
    --out ./data/private/players.json
"""

import argparse
import json
import os
import sys

try:
    import pandas as pd
except ImportError:
    print("This script requires pandas. Install with: pip install pandas", file=sys.stderr)
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", required=True, help="Path to players_standardized.csv")
    parser.add_argument("--out", required=True, help="Path to output players.json")
    args = parser.parse_args()

    # Expected columns: player_id, name, team, position, base_rating
    df = pd.read_csv(args.csv)

    rename_map = {
        "player_id": "id",
        "name": "name",
        "team": "team",
        "position": "position",
        "base_rating": "baseRating",
    }

    existing = [c for c in rename_map.keys() if c in df.columns]
    missing = [c for c in rename_map.keys() if c not in df.columns]

    if missing:
        print(f"Warning: Missing columns in CSV: {missing}. We'll include what we can.", file=sys.stderr)

    df = df[existing].rename(columns=rename_map)

    players = df.to_dict(orient="records")

    out_dir = os.path.dirname(os.path.abspath(args.out))
    os.makedirs(out_dir, exist_ok=True)

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(players, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(players)} players to {args.out}")


if __name__ == "__main__":
    main()
