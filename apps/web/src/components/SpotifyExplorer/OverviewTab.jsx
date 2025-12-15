import { useMemo } from "react";
import { createChords } from "@/components/ChordDiagram/ChordHelper";
import { D3ChordVisualization } from "../ChordDiagram/D3ChordVisualization";

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

  const artistsInGraph = useMemo(() => {
    if (!globalArtists?.length || !collaborationData?.length) return [];

    const idsInGraph = new Set();
    for (const c of collaborationData) {
      if (c.sourceId) idsInGraph.add(c.sourceId);
      if (c.targetId) idsInGraph.add(c.targetId);
    }
    return globalArtists.filter((a) => idsInGraph.has(a.id));
  }, [globalArtists, collaborationData]);

  const hasChordData = nodes.length > 0 && links.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded text-sm text-gray-300">
        <p><strong>Debug Info:</strong></p>
        <p>Global Artists: {globalArtists ? globalArtists.length : "Loading..."}</p>
        <p>Artists in Graph: {artistsInGraph.length}</p>
        <p>Collaborations: {collaborationData ? collaborationData.length : "None"}</p>
        <p>Chord Nodes: {nodes.length}</p>
        <p>Chord Links: {links.length}</p>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-green-400">
          Artist Collaboration Network ({yearRange[0]} - {yearRange[1]})
        </h3>

        {hasChordData ? (
          <D3ChordVisualization nodes={nodes} links={links} />
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            Processing collaboration data...
          </div>
        )}
      </div>
    </div>
  );
}
