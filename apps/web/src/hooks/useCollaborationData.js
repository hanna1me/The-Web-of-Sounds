import { useMemo } from "react";

function clampYear(year) {
  if (!Number.isFinite(year)) return null;
  return Math.min(2025, Math.max(2000, Math.round(year)));
}

function hashString(value) {
  let hash = 0;
  if (!value) return hash;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const SONG_DESCRIPTORS = [
  "Echoes",
  "Pulse",
  "Horizons",
  "Mirage",
  "Spectrum",
  "Dreams",
  "Reflections",
  "Neon",
  "Aurora",
  "Voyage",
];

const SONG_FORMS = [
  "Session",
  "Anthem",
  "Chronicle",
  "Tapes",
  "Story",
  "Odyssey",
  "Prelude",
  "Saga",
];

export function estimateArtistYear(artist, index = 0) {
  if (!artist) return null;
  if (Number.isFinite(artist.activeYear)) {
    return clampYear(artist.activeYear);
  }

  const baseFromHash = 2000 + (hashString(artist.id || artist.name || String(index)) % 26);
  let popularityOffset = 0;

  if (typeof artist.popularity === "number") {
    const normalized = Math.max(0, Math.min(1, artist.popularity / 100));
    popularityOffset = Math.round((normalized - 0.5) * 8); // Spread +/-4 years
  }

  return clampYear(baseFromHash + popularityOffset);
}

function mapArtistsWithYear(artists) {
  if (!Array.isArray(artists)) return [];
  return artists.map((artist, index) => ({
    artist,
    year: estimateArtistYear(artist, index),
  }));
}

export function filterArtistsByYear(artists, yearRange) {
  const [start = 2000, end = 2025] = yearRange || [];
  return mapArtistsWithYear(artists)
    .filter(({ year }) => year && year >= start && year <= end)
    .map(({ artist }) => artist);
}

function toTitleCase(word = "") {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getGenreDescriptor(genres) {
  if (!genres || genres.length === 0) return "Fusion";
  return genres[0]
    .split(" ")
    .map((segment) => toTitleCase(segment))
    .join(" ");
}

function getArtistHandle(artist) {
  return artist?.name ? artist.name.split(" ")[0] : "Unknown";
}

function generateSongTitle(artist1, artist2, genres, year) {
  const baseHash = hashString(
    `${artist1?.id || artist1?.name}-${artist2?.id || artist2?.name}`,
  );
  const descriptor = SONG_DESCRIPTORS[baseHash % SONG_DESCRIPTORS.length];
  const form = SONG_FORMS[baseHash % SONG_FORMS.length];
  const genreLabel = getGenreDescriptor(genres);
  const suffix = year ? ` (${year})` : "";

  return `${getArtistHandle(artist1)} x ${getArtistHandle(artist2)} - ${genreLabel} ${descriptor}${suffix} ${form}`.trim();
}

export function useCollaborationData(globalArtists, yearRange) {
  // Generate collaboration data (simulated for demo - in real app you'd use actual collaboration data)
  const collaborationData = useMemo(() => {
    console.log("useCollaborationData - input globalArtists:", globalArtists);

    if (!globalArtists || globalArtists.length === 0) {
      console.log("useCollaborationData - no artists provided");
      return [];
    }

    const [startYear, endYear] = yearRange || [2000, 2025];
    const artistEntries = mapArtistsWithYear(globalArtists);
    const filteredEntries = artistEntries.filter(
      ({ year }) => year && year >= startYear && year <= endYear,
    );

    if (filteredEntries.length === 0) {
      console.log("useCollaborationData - no artists match year filter");
      return [];
    }

    const collaborations = [];
    const artistNames = filteredEntries.map((entry) => entry.artist.name);

    console.log(
      "useCollaborationData - processing",
      artistNames.length,
      "artists",
    );

    // Generate simulated collaboration data based on genre similarity
    for (let i = 0; i < filteredEntries.length; i++) {
      for (let j = i + 1; j < filteredEntries.length; j++) {
        const artist1Entry = filteredEntries[i];
        const artist2Entry = filteredEntries[j];
        const artist1 = artist1Entry.artist;
        const artist2 = artist2Entry.artist;

        if (!artist1 || !artist2 || !artist1.genres || !artist2.genres) {
          continue;
        }

        // Check for genre overlap
        const commonGenres = artist1.genres.filter((genre) =>
          artist2.genres.some(
            (g) =>
              g.includes(genre.split(" ")[0]) ||
              genre.includes(g.split(" ")[0]),
          ),
        );

        if (commonGenres.length > 0) {
          const artist1Year = artist1Entry.year;
          const artist2Year = artist2Entry.year;
          const collaborationYear = clampYear(
            (artist1Year + artist2Year) / 2,
          );

          // Create collaboration based on genre similarity and popularity
          const strength = commonGenres.length + Math.random() * 3;
          if (strength > 1.5) {
            const songTitle = generateSongTitle(
              artist1,
              artist2,
              commonGenres,
              collaborationYear,
            );
            collaborations.push({
              source: artist1.name,
              target: artist2.name,
              value: Math.round(strength),
              year: collaborationYear,
              genres: commonGenres.slice(0, 3),
              song: {
                title: songTitle,
                releaseYear: collaborationYear,
              },
            });
          }
        }
      }
    }

    const finalCollaborations = collaborations.slice(0, 100);
    console.log(
      "useCollaborationData - generated",
      finalCollaborations.length,
      "collaborations",
    );

    return finalCollaborations; // Limit connections for performance
  }, [globalArtists, yearRange]);

  return collaborationData;
}
