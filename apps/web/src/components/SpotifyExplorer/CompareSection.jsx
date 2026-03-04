import { X, Users, TrendingUp } from "lucide-react";

const FONT = 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SLOTS = 3;

export function CompareSection({ compareItems, removeFromCompare }) {
  if (compareItems.length === 0) return null;

  // Always render 3 columns; null = empty slot
  const cols = [
    ...compareItems,
    ...Array.from({ length: SLOTS - compareItems.length }, () => null),
  ];

  const cellBase = {
    padding: "12px 14px",
    borderBottom: "1px solid rgba(64,0,116,0.08)",
    fontFamily: FONT,
  };

  return (
    <div className="glass p-6 flex flex-col gap-4">
      {/* Section title */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 rounded-full" style={{ background: "#400074" }} />
        <h3 className="text-base font-semibold" style={{ color: "#000000", fontFamily: FONT }}>
          Compare Artists
          <span style={{ marginLeft: "8px", fontSize: "0.875rem", fontWeight: 400, color: "#6b7280" }}>
            {compareItems.length}/3
          </span>
        </h3>
      </div>

      {/* Comparison table */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 1fr 1fr",
          border: "1px solid rgba(64,0,116,0.13)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* ── Row 1: Artist headers ── */}
        <div style={{ ...cellBase, background: "rgba(64,0,116,0.03)" }} />
        {cols.map((item, i) =>
          item ? (
            <div
              key={item.id}
              style={{
                ...cellBase,
                background: "rgba(64,0,116,0.03)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                borderLeft: "1px solid rgba(64,0,116,0.08)",
              }}
            >
              <img
                src={item.image || "/api/placeholder/56/56"}
                alt={item.name}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid rgba(64,0,116,0.2)",
                }}
              />
              <span
                className="font-semibold text-sm text-center leading-tight"
                style={{ color: "#000000", fontFamily: FONT }}
              >
                {item.name}
              </span>
              <button
                onClick={() => removeFromCompare(i)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  color: "#9ca3af",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(64,0,116,0.08)";
                  e.currentTarget.style.color = "#400074";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <div
              key={`empty-h-${i}`}
              style={{
                ...cellBase,
                background: "rgba(64,0,116,0.015)",
                borderLeft: "1px solid rgba(64,0,116,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                minHeight: 110,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(64,0,116,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users size={12} style={{ color: "rgba(64,0,116,0.3)" }} />
              </div>
              <span style={{ fontSize: "0.7rem", color: "#9ca3af", fontFamily: FONT }}>
                Empty slot
              </span>
            </div>
          )
        )}

        {/* ── Row 2: Popularity ── */}
        <div
          style={{
            ...cellBase,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#6b7280",
            fontSize: "0.75rem",
          }}
        >
          <TrendingUp size={12} />
          <span>Popularity</span>
        </div>
        {cols.map((item, i) => (
          <div
            key={`pop-${i}`}
            style={{
              ...cellBase,
              borderLeft: "1px solid rgba(64,0,116,0.08)",
              textAlign: "center",
              fontWeight: 600,
              color: item ? "#1DB954" : "#d1d5db",
              fontSize: "0.9rem",
            }}
          >
            {item ? `${item.popularity}/100` : "—"}
          </div>
        ))}

        {/* ── Row 3: Followers ── */}
        <div
          style={{
            ...cellBase,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#6b7280",
            fontSize: "0.75rem",
          }}
        >
          <Users size={12} />
          <span>Followers</span>
        </div>
        {cols.map((item, i) => (
          <div
            key={`fol-${i}`}
            style={{
              ...cellBase,
              borderLeft: "1px solid rgba(64,0,116,0.08)",
              textAlign: "center",
              color: item ? "#000000" : "#d1d5db",
              fontSize: "0.8rem",
              fontWeight: 500,
            }}
          >
            {item ? (item.followers?.toLocaleString() ?? 0) : "—"}
          </div>
        ))}

        {/* ── Row 4: Genres ── */}
        <div
          style={{
            ...cellBase,
            display: "flex",
            alignItems: "flex-start",
            paddingTop: 14,
            color: "#6b7280",
            fontSize: "0.75rem",
            borderBottom: "none",
          }}
        >
          Genres
        </div>
        {cols.map((item, i) => (
          <div
            key={`gen-${i}`}
            style={{
              ...cellBase,
              borderLeft: "1px solid rgba(64,0,116,0.08)",
              borderBottom: "none",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              justifyContent: "center",
            }}
          >
            {item?.genres?.length > 0 ? (
              item.genres.map((g) => (
                <span
                  key={g}
                  style={{
                    background: "#400074",
                    color: "#ffffff",
                    fontFamily: FONT,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    borderRadius: "30px",
                    padding: "3px 8px",
                  }}
                >
                  {g}
                </span>
              ))
            ) : (
              <span style={{ color: "#d1d5db", fontSize: "0.8rem" }}>—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
