import { Plus, Users, TrendingUp } from "lucide-react";

export function ArtistStats({ artistData, addToCompare, compareItems }) {
  if (!artistData?.artist) return null;

  const { artist } = artistData;
  const alreadyAdded = compareItems.some((item) => item.id === artist.id);
  const compareFull = compareItems.length >= 3;
  const canAdd = !alreadyAdded && !compareFull;

  return (
    <div className="glass card-hover p-6 mb-6 flex flex-col gap-5">
      {/* Artist identity row */}
      <div className="flex items-center gap-5">
        <div
          className="relative flex-shrink-0 rounded-full overflow-hidden"
          style={{
            width: 64,
            height: 64,
            border: "2px solid rgba(64,0,116,0.3)",
            boxShadow: "0 0 16px rgba(64,0,116,0.12)",
          }}
        >
          <img
            src={artist.images[0]?.url || "/api/placeholder/64/64"}
            alt={artist.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-tight truncate" style={{ color: "#000000" }}>
            {artist.name}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users size={13} style={{ color: "#6b7280" }} />
              <span className="text-sm" style={{ color: "#6b7280" }}>
                {artist.followers.total.toLocaleString()} followers
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={13} style={{ color: "#1DB954" }} />
              <span className="text-sm font-semibold" style={{ color: "#1DB954" }}>
                {artist.popularity}/100
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={addToCompare}
          disabled={!canAdd}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: canAdd ? "#400074" : "rgba(0,0,0,0.04)",
            color: canAdd ? "#ffffff" : "#9ca3af",
            border: canAdd ? "none" : "1px solid rgba(0,0,0,0.08)",
            boxShadow: canAdd ? "0 2px 12px rgba(64,0,116,0.3)" : "none",
            cursor: canAdd ? "pointer" : "not-allowed",
          }}
          onMouseEnter={e => {
            if (canAdd) {
              e.currentTarget.style.background = "#2d0054";
              e.currentTarget.style.color = "#CDF35F";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(64,0,116,0.4)";
            }
          }}
          onMouseLeave={e => {
            if (canAdd) {
              e.currentTarget.style.background = "#400074";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(64,0,116,0.3)";
            }
          }}
        >
          <Plus size={14} />
          {alreadyAdded ? "Added" : compareFull ? "Full" : "Compare"}
        </button>
      </div>

      {/* Genre tags */}
      {artist.genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {artist.genres.map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "#400074",
                color: "#ffffff",
              }}
            >
              {genre}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
