import { GenreDistribution } from "./GenreDistribution";
import { AlbumTimeline } from "./AlbumTimeline";
import { ArtistStats } from "./ArtistStats";
import { CompareSection } from "./CompareSection";
import { TopTracksChart } from "./TopTracksChart";

export function ExplorerTab({
  pieData,
  chartData,
  artistData,
  addToCompare,
  compareItems,
  removeFromCompare,
}) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Circular Genre Visualization */}
        <GenreDistribution pieData={pieData} />

        {/* Album Timeline */}
        <AlbumTimeline chartData={chartData} />
      </div>

      {/* Artist Stats */}
      <ArtistStats
        artistData={artistData}
        addToCompare={addToCompare}
        compareItems={compareItems}
      />

      {/* Top Tracks Vega-Lite Chart */}
      {artistData?.topTracks && artistData.topTracks.length > 0 && (
        <TopTracksChart topTracks={artistData.topTracks} />
      )}

      {/* Compare Section */}
      <CompareSection
        compareItems={compareItems}
        removeFromCompare={removeFromCompare}
      />
    </div>
  );
}
