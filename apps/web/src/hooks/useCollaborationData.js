import { useEffect, useMemo, useState } from "react";

function getYear(releaseDate) {
  if (!releaseDate) return null;
  const y = Number(String(releaseDate).slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

// Concurrency limiter
async function mapWithLimit(items, limit, fn) {
  const results = [];
  let i = 0;

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await fn(items[idx], idx);
      }
    }
  );

  await Promise.all(workers);
  return results;
}

async function fetchTopTracks(spotifyToken, artistId) {
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
    { headers: { Authorization: `Bearer ${spotifyToken}` } }
  );

  if (!res.ok) {
    console.warn("top-tracks failed", artistId, res.status);
    return [];
  }

  const json = await res.json();
  return Array.isArray(json.tracks) ? json.tracks : [];
}

/**
 * Build collaborations:
 * edges represent co-credited pairs on tracks
 * weight = count of shared tracks within yearRange
 * includes sourceName/targetName so you never see "(Unknown artist)"
 */
function buildCollaborationsFromTracks({ tracksByArtist, yearRange }) {
  const [startYear, endYear] = yearRange || [2000, 2025];

  // key "idLo|idHi" --> edge object
  const edgeMap = new Map();

  for (const tracks of tracksByArtist) {
    for (const track of tracks) {
      const y = getYear(track?.album?.release_date);
      if (!y || y < startYear || y > endYear) continue;

      const credited = (track.artists || [])
        .map((a) => ({ id: a?.id, name: a?.name }))
        .filter((a) => a.id && a.name);

      if (credited.length < 2) continue;

      for (let i = 0; i < credited.length; i++) {
        for (let j = i + 1; j < credited.length; j++) {
          const a = credited[i];
          const b = credited[j];

          const [lo, hi] = a.id < b.id ? [a, b] : [b, a];
          const key = `${lo.id}|${hi.id}`;

          const prev = edgeMap.get(key);
          if (!prev) {
            edgeMap.set(key, {
              sourceId: lo.id,
              sourceName: lo.name,
              targetId: hi.id,
              targetName: hi.name,
              weight: 1,
              tracks: track?.name ? [track.name] : [],
              years: y ? [y] : [],
            });
          } else {
            prev.weight += 1;

            // Keep a few sample track names for tooltips
            if (track?.name && prev.tracks.length < 5 && !prev.tracks.includes(track.name)) {
              prev.tracks.push(track.name);
            }
            if (y && prev.years.length < 5) prev.years.push(y);

            // Refresh names if somehow missing
            if (!prev.sourceName) prev.sourceName = lo.name;
            if (!prev.targetName) prev.targetName = hi.name;
          }
        }
      }
    }
  }

  return edgeMap;
}

export function useCollaborationData(globalArtists, yearRange, spotifyToken) {
  const [collaborationData, setCollaborationData] = useState([]);
  const [loading, setLoading] = useState(false);

  const seedArtists = useMemo(() => {
    if (!Array.isArray(globalArtists)) return [];
    return globalArtists.slice(0, 25);
  }, [globalArtists]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!spotifyToken || seedArtists.length === 0) {
        setCollaborationData([]);
        return;
      }

      setLoading(true);

      const tracksByArtist = await mapWithLimit(seedArtists, 5, async (artist) => {
        return fetchTopTracks(spotifyToken, artist.id);
      });

      if (cancelled) return;

      const edgeMap = buildCollaborationsFromTracks({ tracksByArtist, yearRange });

      const rows = Array.from(edgeMap.values()).map((edge) => ({
        sourceId: edge.sourceId,
        sourceName: edge.sourceName,
        targetId: edge.targetId,
        targetName: edge.targetName,
        weight: edge.weight,
        value: edge.weight,
        track: edge.tracks[0] || "",
        tracks: edge.tracks,
        year: edge.years[0] ?? null,
      }));

      rows.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
      const pruned = rows.slice(0, 120);

      if (!cancelled) {
        setCollaborationData(pruned);
        setLoading(false);
      }
    }

    run().catch((e) => {
      console.error("useCollaborationData error", e);
      if (!cancelled) {
        setCollaborationData([]);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [spotifyToken, seedArtists, yearRange]);

  return collaborationData;
}
