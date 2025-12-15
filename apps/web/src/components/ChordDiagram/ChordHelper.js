export function createChords(collaborations, artistIndex) {
  const nodeIds = new Set();
  const nameFallback = new Map();

  for (const d of collaborations ?? []) {
    if (d?.sourceId) nodeIds.add(d.sourceId);
    if (d?.targetId) nodeIds.add(d.targetId);

    if (d?.sourceId && d?.sourceName) nameFallback.set(d.sourceId, d.sourceName);
    if (d?.targetId && d?.targetName) nameFallback.set(d.targetId, d.targetName);
  }

  const nodes = Array.from(nodeIds).map((id) => {
    const meta = artistIndex?.get(id);
    return {
      id,
      name: meta?.name ?? nameFallback.get(id) ?? "(Unknown artist)",
      genre: meta?.genre ?? "Not Specified",
    };
  });

  // Aggregate links
  const linkAgg = new Map();
  for (const d of collaborations ?? []) {
    if (!d?.sourceId || !d?.targetId) continue;
    if (d.sourceId === d.targetId) continue;

    const a = d.sourceId;
    const b = d.targetId;
    const key = a < b ? `${a}__${b}` : `${b}__${a}`;

    const prev = linkAgg.get(key) ?? {
      source: a < b ? a : b,
      target: a < b ? b : a,
      weight: 0,
      tracks: new Set(),
      years: new Set(),
    };

    prev.weight += Number(d.weight ?? 1);
    if (d.track) prev.tracks.add(d.track);
    if (d.year) prev.years.add(d.year);

    linkAgg.set(key, prev);
  }

  const links = Array.from(linkAgg.values()).map((d) => ({
    source: d.source,
    target: d.target,
    weight: d.weight,
    track: Array.from(d.tracks).slice(0, 3).join(", "),
    year: Array.from(d.years).sort().at(-1) ?? null,
  }));

  return { nodes, links };
}
