export function Sidebar({
  expandedSidebar,
  setExpandedSidebar,
  yearRange,
  setYearRange,
  activeTab,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSelectedArtist,
  globalArtists,
  collaborationData,
}) {
  return (
    <div
      className={`${expandedSidebar ? "w-80" : "w-16"} bg-gray-900 p-4 transition-all duration-300`}
    >
      <button
        onClick={() => setExpandedSidebar(!expandedSidebar)}
        className="w-full mb-4 p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
      >
        {expandedSidebar ? "Collapse" : "Menu"}
      </button>

      {expandedSidebar && (
        <div>
          {/* Year Range */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-green-400">
              Year Range
            </h3>
            <div className="space-y-2">
              <label className="block">
                <span className="text-sm">From: {yearRange[0]}</span>
                <input
                  type="range"
                  min="2000"
                  max="2025"
                  value={yearRange[0]}
                  onChange={(e) =>
                    setYearRange([parseInt(e.target.value), yearRange[1]])
                  }
                  className="w-full mt-1"
                />
              </label>
              <label className="block">
                <span className="text-sm">To: {yearRange[1]}</span>
                <input
                  type="range"
                  min="2000"
                  max="2025"
                  value={yearRange[1]}
                  onChange={(e) =>
                    setYearRange([yearRange[0], parseInt(e.target.value)])
                  }
                  className="w-full mt-1"
                />
              </label>
            </div>
          </div>

          {/* Artist Search - Only show in explorer tab */}
          {activeTab === "explorer" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-green-400">
                Artist Search
              </h3>
              <input
                type="text"
                placeholder="Search for an artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-green-400 focus:outline-none"
              />

              {searchResults?.artists?.items && (
                <div className="mt-2 max-h-48 overflow-y-auto bg-gray-800 rounded border border-gray-700">
                  {searchResults.artists.items.map((artist) => (
                    <button
                      key={artist.id}
                      onClick={() => {
                        setSelectedArtist(artist.id);
                        setSearchQuery("");
                      }}
                      className="w-full p-2 text-left hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <img
                        src={artist.images[0]?.url || "/api/placeholder/32/32"}
                        alt={artist.name}
                        className="w-8 h-8 rounded"
                      />
                      <span className="truncate">{artist.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Overview Stats */}
          {activeTab === "overview" && globalArtists && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-green-400">
                Overview Stats
              </h3>
              <div className="space-y-2 text-sm">
                <p>Artists: {globalArtists.length}</p>
                <p>Collaborations: {collaborationData.length}</p>
                <p>
                  Time Period: {yearRange[0]} - {yearRange[1]}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
