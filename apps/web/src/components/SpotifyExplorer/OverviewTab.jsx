import { useMemo, useEffect, useRef, useState } from "react";
import { createChords } from "@/components/ChordDiagram/ChordHelper";
import { D3ChordVisualization } from "../ChordDiagram/D3ChordVisualization";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const numericTarget = typeof value === "number" ? value : null;

  useEffect(() => {
    if (numericTarget === null) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 1100;
    const from = 0;
    const to = numericTarget;

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [numericTarget]);

  return <>{numericTarget !== null ? display : value}</>;
}

export function OverviewTab({ collaborationData, yearRange, globalArtists }) {
  const artistIndex = useMemo(() => {
    return new Map(
      (globalArtists ?? []).map((a) => [
        a.id,
        { id: a.id, name: a.name, genre: a.genres?.[0] ?? "Not Specified" },
      ])
    );
  }, [globalArtists]);

  const { nodes, links } = useMemo(() => {
    if (!collaborationData?.length) return { nodes: [], links: [] };
    return createChords(collaborationData, artistIndex);
  }, [collaborationData, artistIndex]);

  const hasChordData = nodes.length > 0 && links.length > 0;

  const stats = [
    { value: globalArtists ? globalArtists.length : "—", label: "Artists" },
    { value: collaborationData ? collaborationData.length : "—", label: "Collaborations" },
    { value: `${yearRange[0]}–${yearRange[1]}`, label: "Period" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 fade-in">
        {stats.map(({ value, label }, i) => (
          <div
            key={label}
            className={`glass card-hover flex flex-col items-center justify-center py-5 gap-1 fade-in-${i + 1}`}
          >
            <span className="text-2xl font-bold tracking-tight" style={{ color: "#400074" }}>
              <AnimatedNumber value={value} />
            </span>
            <span className="text-xs font-medium" style={{ color: "#6b7280" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Chord diagram */}
      <div className="glass card-hover p-6 flex flex-col gap-4 fade-in-2">
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: "#400074" }}
          />
          <h3 className="text-base font-semibold" style={{ color: "#000000" }}>
            Artist Collaboration Network
            <span style={{ marginLeft: "8px", fontSize: "0.875rem", fontWeight: 400, color: "#6b7280" }}>
              {yearRange[0]}–{yearRange[1]}
            </span>
          </h3>
        </div>

        {hasChordData ? (
          <D3ChordVisualization nodes={nodes} links={links} />
        ) : (
          <div className="h-96 flex flex-col items-center justify-center gap-3" style={{ color: "#6b7280" }}>
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "rgba(64,0,116,0.2)", borderTopColor: "#400074" }}
            />
            <span className="text-sm">Loading collaboration network…</span>
          </div>
        )}
      </div>
    </div>
  );
}
