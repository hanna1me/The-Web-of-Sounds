import { useMemo } from "react";

export function useChartData(artistData, yearRange) {
  // Genre distribution data for circular viz
  const genreData = useMemo(() => {
    if (!artistData?.related?.artists) return {};

    return artistData.related.artists.reduce((acc, artist) => {
      artist.genres.forEach((genre) => {
        const firstLetter = genre.charAt(0).toUpperCase();
        acc[firstLetter] = (acc[firstLetter] || 0) + 1;
      });
      return acc;
    }, {});
  }, [artistData]);

  const pieData = useMemo(() => {
    return Object.entries(genreData).map(([letter, count], index) => ({
      name: letter,
      value: count,
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
