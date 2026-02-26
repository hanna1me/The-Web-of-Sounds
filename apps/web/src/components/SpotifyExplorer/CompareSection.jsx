import { X, Users, TrendingUp } from "lucide-react";

export function CompareSection({ compareItems, removeFromCompare }) {
  if (compareItems.length === 0) return null;

  return (
    <div className="glass p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-5 rounded-full"
          style={{ background: "#400074" }}
        />
        <h3 className="text-base font-semibold" style={{ color: "#000000" }}>
          Compare Artists
          <span style={{ marginLeft: "8px", fontSize: "0.875rem", fontWeight: 400, color: "#6b7280" }}>
            {compareItems.length}/3
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {compareItems.map((item, index) => (
          <div
            key={item.id}
            className="card-hover relative flex flex-col items-center gap-3 p-5 rounded-xl"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(64,0,116,0.15)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <button
              onClick={() => removeFromCompare(index)}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: "#9ca3af" }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(64,0,116,0.08)";
                e.currentTarget.style.color = "#400074";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#9ca3af";
              }}
            >
              <X size={12} />
            </button>

            <img
              src={item.image || "/api/placeholder/64/64"}
              alt={item.name}
              className="w-16 h-16 rounded-full object-cover"
              style={{
                border: "2px solid rgba(64,0,116,0.25)",
                boxShadow: "0 0 12px rgba(64,0,116,0.1)",
              }}
            />
            <h4 className="font-semibold text-center text-sm leading-tight" style={{ color: "#000000" }}>
              {item.name}
            </h4>

            <div className="w-full flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1" style={{ color: "#6b7280" }}>
                  <TrendingUp size={11} />
                  <span>Popularity</span>
                </div>
                <span className="font-semibold" style={{ color: "#1DB954" }}>
                  {item.popularity}/100
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1" style={{ color: "#6b7280" }}>
                  <Users size={11} />
                  <span>Followers</span>
                </div>
                <span className="font-medium" style={{ color: "#6b7280" }}>
                  {item.followers.toLocaleString()}
                </span>
              </div>
              {item.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.genres.map((g) => (
                    <span
                      key={g}
                      className="px-1.5 py-0.5 rounded-md text-[10px] font-medium"
                      style={{
                        background: "#400074",
                        color: "#ffffff",
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl min-h-[200px]"
            style={{
              border: "1.5px dashed rgba(64,0,116,0.2)",
              background: "rgba(64,0,116,0.02)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(64,0,116,0.06)" }}
            >
              <Users size={16} style={{ color: "rgba(64,0,116,0.3)" }} />
            </div>
            <span className="text-xs" style={{ color: "#9ca3af" }}>
              Empty slot {compareItems.length + i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
