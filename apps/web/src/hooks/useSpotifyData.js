import { useQuery } from "@tanstack/react-query";

export function useSpotifyData(spotifyToken) {
  // Fallback data function
  const getFallbackData = () => [
    {
      id: "1",
      name: "Taylor Swift",
      popularity: 100,
      genres: ["pop", "country"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "2",
      name: "Drake",
      popularity: 98,
      genres: ["hip-hop", "rap"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "3",
      name: "Billie Eilish",
      popularity: 95,
      genres: ["pop", "alternative"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "4",
      name: "The Weeknd",
      popularity: 94,
      genres: ["pop", "r&b"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "5",
      name: "Ariana Grande",
      popularity: 93,
      genres: ["pop", "r&b"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "6",
      name: "Ed Sheeran",
      popularity: 92,
      genres: ["pop", "folk"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "7",
      name: "Post Malone",
      popularity: 91,
      genres: ["hip-hop", "pop"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "8",
      name: "Dua Lipa",
      popularity: 90,
      genres: ["pop", "dance"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "9",
      name: "Harry Styles",
      popularity: 89,
      genres: ["pop", "rock"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "10",
      name: "Olivia Rodrigo",
      popularity: 88,
      genres: ["pop", "alternative"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "11",
      name: "Justin Bieber",
      popularity: 87,
      genres: ["pop", "r&b"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "12",
      name: "Doja Cat",
      popularity: 86,
      genres: ["pop", "hip-hop"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "13",
      name: "Lil Nas X",
      popularity: 85,
      genres: ["hip-hop", "pop"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "14",
      name: "Bad Bunny",
      popularity: 84,
      genres: ["reggaeton", "latin"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "15",
      name: "Travis Scott",
      popularity: 83,
      genres: ["hip-hop", "rap"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "16",
      name: "SZA",
      popularity: 82,
      genres: ["r&b", "alternative"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "17",
      name: "Kendrick Lamar",
      popularity: 81,
      genres: ["hip-hop", "rap"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "18",
      name: "Lorde",
      popularity: 80,
      genres: ["pop", "alternative"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "19",
      name: "The 1975",
      popularity: 79,
      genres: ["alternative", "pop"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "20",
      name: "Imagine Dragons",
      popularity: 78,
      genres: ["rock", "alternative"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "21",
      name: "Coldplay",
      popularity: 77,
      genres: ["rock", "alternative"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "22",
      name: "Rihanna",
      popularity: 76,
      genres: ["pop", "r&b"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "23",
      name: "Bruno Mars",
      popularity: 75,
      genres: ["pop", "funk"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "24",
      name: "Adele",
      popularity: 74,
      genres: ["pop", "soul"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
    {
      id: "25",
      name: "The Chainsmokers",
      popularity: 73,
      genres: ["electronic", "pop"],
      images: [{ url: "/api/placeholder/60/60" }],
    },
  ];

  // Get top 100 artists globally for chord diagram
  const { data: globalArtists } = useQuery({
    queryKey: ["globalArtists"],
    queryFn: async () => {
      console.log("Starting to fetch global artists...");

      try {
        // Check if token is provided
        if (!spotifyToken) {
          console.log("No Spotify token provided, using fallback data");
          return getFallbackData();
        }

        // Get popular artists from multiple sources
        const promises = [];

        // Method 1: Search for popular genres and get artists
        const popularGenres = ["pop", "rock", "hip-hop", "electronic", "indie"];

        for (const genre of popularGenres) {
          promises.push(
            fetch(
              `https://api.spotify.com/v1/search?q=genre:${genre}&type=artist&limit=20`,
              {
                headers: {
                  Authorization: `Bearer ${spotifyToken}`,
                },
              },
            )
              .then((response) => {
                if (!response.ok) {
                  console.log(
                    `Genre search failed for ${genre}:`,
                    response.status,
                  );
                  throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
              })
              .catch((error) => {
                console.log(`Error fetching genre ${genre}:`, error);
                return { artists: { items: [] } };
              }),
          );
        }

        // Method 2: Search for general popular terms
        const popularSearchTerms = [
          "taylor swift",
          "drake",
          "billie eilish",
          "the weeknd",
          "ariana grande",
        ];
        for (const term of popularSearchTerms) {
          promises.push(
            fetch(
              `https://api.spotify.com/v1/search?q=${encodeURIComponent(term)}&type=artist&limit=10`,
              {
                headers: {
                  Authorization: `Bearer ${spotifyToken}`,
                },
              },
            )
              .then((response) => {
                if (!response.ok) {
                  console.log(
                    `Artist search failed for ${term}:`,
                    response.status,
                  );
                  throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
              })
              .catch((error) => {
                console.log(`Error fetching artist ${term}:`, error);
                return { artists: { items: [] } };
              }),
          );
        }

        const results = await Promise.all(promises);
        const allArtists = results.flatMap(
          (result) => result.artists?.items || [],
        );

        // Remove duplicates and take top artists by popularity
        const uniqueArtists = allArtists
          .filter(
            (artist, index, self) =>
              index === self.findIndex((a) => a.id === artist.id),
          )
          .filter((artist) => artist && artist.popularity > 50) // Only include reasonably popular artists
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 50); // Limiting to 50 for better visualization

        console.log("Successfully fetched artists:", uniqueArtists.length);

        // If we got some data from API, return it, otherwise use fallback
        if (uniqueArtists.length > 0) {
          return uniqueArtists;
        } else {
          console.log("No artists returned from API, using fallback data");
          return getFallbackData();
        }
      } catch (error) {
        console.error("Error fetching global artists:", error);
        console.log("Using fallback data due to error");
        return getFallbackData();
      }
    },
  });

  // Search for artists
  const useArtistSearch = (searchQuery) => {
    return useQuery({
      queryKey: ["search", searchQuery],
      queryFn: async () => {
        if (!searchQuery) return { artists: { items: [] } };
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=artist&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${spotifyToken}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to search artists");
        }
        return response.json();
      },
      enabled: !!searchQuery && searchQuery.length > 2,
    });
  };

  // Get top artists
  const { data: topArtists, isLoading } = useQuery({
    queryKey: ["topArtists"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term",
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch top artists");
      }
      return response.json();
    },
  });

  // Get artist details when selected
  const useArtistDetails = (selectedArtist) => {
    return useQuery({
      queryKey: ["artist", selectedArtist],
      queryFn: async () => {
        if (!selectedArtist) return null;
        const [artistResponse, albumsResponse, relatedResponse] =
          await Promise.all([
            fetch(`https://api.spotify.com/v1/artists/${selectedArtist}`, {
              headers: { Authorization: `Bearer ${spotifyToken}` },
            }),
            fetch(
              `https://api.spotify.com/v1/artists/${selectedArtist}/albums?limit=50`,
              {
                headers: { Authorization: `Bearer ${spotifyToken}` },
              },
            ),
            fetch(
              `https://api.spotify.com/v1/artists/${selectedArtist}/related-artists`,
              {
                headers: { Authorization: `Bearer ${spotifyToken}` },
              },
            ),
          ]);

        const artist = await artistResponse.json();
        const albums = await albumsResponse.json();
        const related = await relatedResponse.json();

        return { artist, albums, related };
      },
      enabled: !!selectedArtist,
    });
  };

  return {
    globalArtists,
    topArtists,
    isLoading,
    useArtistSearch,
    useArtistDetails,
  };
}
