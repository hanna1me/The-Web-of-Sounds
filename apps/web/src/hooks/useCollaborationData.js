import { useMemo } from "react";

export function useCollaborationData(globalArtists) {
  // Generate collaboration data (simulated for demo - in real app you'd use actual collaboration data)
  const collaborationData = useMemo(() => {
    console.log("useCollaborationData - input globalArtists:", globalArtists);

    if (!globalArtists || globalArtists.length === 0) {
      console.log("useCollaborationData - no artists provided");
      return [];
    }

    const collaborations = [];
    const artistNames = globalArtists.map((a) => a.name);

    console.log(
      "useCollaborationData - processing",
      artistNames.length,
      "artists",
    );

    // Generate simulated collaboration data based on genre similarity
    for (let i = 0; i < artistNames.length; i++) {
      for (let j = i + 1; j < artistNames.length; j++) {
        const artist1 = globalArtists[i];
        const artist2 = globalArtists[j];

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
          // Create collaboration based on genre similarity and popularity
          const strength = commonGenres.length + Math.random() * 3;
          if (strength > 1.5) {
            collaborations.push({
              source: artist1.name,
              target: artist2.name,
              value: Math.round(strength),
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
  }, [globalArtists]);

  return collaborationData;
}
