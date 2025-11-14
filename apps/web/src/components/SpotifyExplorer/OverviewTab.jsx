import { ChordDiagram } from "@/components/ChordDiagram/ChordDiagram";

export function OverviewTab({ collaborationData, yearRange, globalArtists }) {
  // Debug info
  console.log("OverviewTab - globalArtists:", globalArtists);
  console.log("OverviewTab - collaborationData:", collaborationData);

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <div className="bg-gray-800 p-4 rounded text-sm text-gray-300">
        <p>
          <strong>Debug Info:</strong>
        </p>
        <p>
          Global Artists: {globalArtists ? globalArtists.length : "Loading..."}
        </p>
        <p>
          Collaborations:{" "}
          {collaborationData ? collaborationData.length : "None"}
        </p>
      </div>

      {/* Chord Diagram */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-green-400">
          Artist Collaboration Network ({yearRange[0]} - {yearRange[1]})
        </h3>
        <p className="text-gray-400 mb-4 text-sm">
          This chord diagram shows potential collaborations between top artists
          based on genre similarities and popularity patterns.
        </p>
        {collaborationData && collaborationData.length > 0 ? (
          <ChordDiagram data={collaborationData} width={700} height={700} />
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            {globalArtists
              ? globalArtists.length > 0
                ? "Processing collaboration data..."
                : "No artists found. Using fallback data."
              : "Loading artists data..."}
          </div>
        )}
      </div>

      {/* Top Artists Grid */}
      {globalArtists && globalArtists.length > 0 && (
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-green-400">
            Top Artists ({yearRange[0]} - {yearRange[1]})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {globalArtists.slice(0, 20).map((artist) => (
              <div key={artist.id} className="text-center">
                <img
                  src={artist.images[0]?.url || "/api/placeholder/60/60"}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full mx-auto mb-1"
                />
                <p className="text-xs truncate" title={artist.name}>
                  {artist.name}
                </p>
                <p className="text-xs text-gray-400">{artist.popularity}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show message if no data */}
      {(!globalArtists || globalArtists.length === 0) && (
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-green-400">
            Loading Artist Data...
          </h3>
          <p className="text-gray-400">
            Fetching popular artists from Spotify API. If this takes too long,
            we'll show fallback data.
          </p>
        </div>
      )}
    </div>
  );
}
