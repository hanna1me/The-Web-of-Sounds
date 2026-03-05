import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";

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
    <aside
      className="flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden"
      style={{
        width: expandedSidebar ? "288px" : "56px",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(64,0,116,0.02)",
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpandedSidebar(!expandedSidebar)}
        className="flex-shrink-0 flex items-center justify-center h-12 transition-colors"
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          color: "#400074",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(64,0,116,0.06)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent";
        }}
        title={expandedSidebar ? "Collapse sidebar" : "Expand sidebar"}
      >
        {expandedSidebar ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Collapsed icon hints */}
      {!expandedSidebar && (
        <div className="flex flex-col items-center gap-4 pt-5">
          <div title="Year range" style={{ color: "#400074", opacity: 0.5 }}>
            <SlidersHorizontal size={16} />
          </div>
          {activeTab === "explorer" && (
            <div title="Artist search" style={{ color: "#400074", opacity: 0.5, fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              <Search size={16} />
            </div>
          )}
        </div>
      )}

      {/* Expanded content */}
      {expandedSidebar && (
        <div className="flex flex-col gap-6 p-4 overflow-y-auto flex-1">
          {/* Year Range */}
          <section className="flex flex-col gap-3">
            <p className="section-heading" style={{ color: "#400074", fontFamily:
              'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Year Range</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: "#6b7280", fontFamily:
              'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>From</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-md"
                    style={{ background: "#400074", color: "#ffffff",
                      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                  >
                    {yearRange[0]}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="2025"
                  value={yearRange[0]}
                  onChange={(e) =>
                    setYearRange([parseInt(e.target.value), yearRange[1]])
                  }
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: "#6b7280", fontFamily:
              'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>To</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-md"
                    style={{ background: "#400074", color: "#ffffff", fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                  >
                    {yearRange[1]}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="2025"
                  value={yearRange[1]}
                  onChange={(e) =>
                    setYearRange([yearRange[0], parseInt(e.target.value)])
                  }
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* Artist Search - Explorer tab */}
          {activeTab === "explorer" && (
            <section className="flex flex-col gap-3">
              <p className="section-heading">Artist Search</p>
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#400074", opacity: 0.5 }}
                />
                <input
                  type="text"
                  placeholder="Search artists…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm transition-all"
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.1)",
                    color: "#000000",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.border = "1px solid rgba(64,0,116,0.5)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(64,0,116,0.1)";
                  }}
                  onBlur={e => {
                    e.currentTarget.style.border = "1px solid rgba(0,0,0,0.1)";
                    e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
                  }}
                />
              </div>

              {searchResults?.artists?.items?.length > 0 && (
                <div
                  className="flex flex-col rounded-xl overflow-hidden max-h-52 overflow-y-auto"
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(64,0,116,0.12)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  }}
                >
                  {searchResults.artists.items.map((artist) => (
                    <button
                      key={artist.id}
                      onClick={() => {
                        setSelectedArtist(artist.id);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors"
                      style={{ color: "#000000", fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(64,0,116,0.06)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <img
                        src={artist.images[0]?.url || "/api/placeholder/20/20"}
                        alt={artist.name}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          flexShrink: 0,
                          objectFit: "cover",
                          border: "1px solid rgba(64,0,116,0.15)",
                        }}
                      />
                      <span className="truncate">{artist.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      )}
    </aside>
  );
}
