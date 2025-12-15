import { useMemo } from "react";

export function useChartData(artistData, yearRange) {
  // Genre distribution data for circular viz
  const genreData = useMemo(() => {
    if (!artistData) return {};

    const counts = {};
    const formatGenreName = (genre) =>
      genre
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    const addGenre = (genre) => {
      if (!genre) return;
      const normalized = genre.trim().toLowerCase();
      if (!normalized) return;
      if (!counts[normalized]) {
        counts[normalized] = {
          label: formatGenreName(genre),
          value: 0,
        };
      }
      counts[normalized].value += 1;
    };

    artistData.related?.artists?.forEach((artist) => {
      (artist.genres || []).forEach(addGenre);
    });

    // Fallback: use the selected artist's own genres if related artists are missing genre info
    if (Object.keys(counts).length === 0) {
      (artistData.artist?.genres || []).forEach(addGenre);
    }

    return counts;
  }, [artistData]);

  const pieData = useMemo(() => {
    return Object.values(genreData).map((entry, index) => ({
      name: entry.label,
      value: entry.value,
      fill: `hsl(${index * 14}, 70%, 60%)`,
    }));
  }, [genreData]);

  // Album timeline data
  const timelineData = useMemo(() => {
    if (!artistData?.albums?.items) return {};

    return artistData.albums.items
      .filter((album) => {
        const year = new Date(album.release_date).getFullYear();
        return year >= yearRange[0] && year <= yearRange[1];
      })
      .reduce((acc, album) => {
        const year = new Date(album.release_date).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {});
  }, [artistData, yearRange]);

  const chartData = useMemo(() => {
    return Object.entries(timelineData).map(([year, count]) => ({
      year: year,
      albums: count,
    }));
  }, [timelineData]);

  return {
    pieData,
    chartData,
  };
}
