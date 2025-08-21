// Minimal CSV parser for headered, quoted CSVs
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQ = false;
  const pushCell = () => { row.push(cur); cur = ""; };
  const pushRow = () => { rows.push(row); row = []; };

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i+1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") pushCell();
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i+1] === "\n") i++;
        pushCell(); pushRow();
      } else cur += c;
    }
  }
  pushCell(); if (row.length) pushRow();
  return rows;
}
export function csvToObjects(text: string): Record<string,string>[] {
  const rows = parseCSV(text);
  if (!rows.length) return [];
  const header = rows[0].map(h => h.trim());
  const out: Record<string,string>[] = [];
  for (let i=1;i<rows.length;i++){
    const r = rows[i]; if (!r.length) continue;
    const o: Record<string,string> = {};
    for (let j=0;j<header.length;j++) o[header[j]] = (r[j] ?? "").trim();
    out.push(o);
  }
  return out;
}
