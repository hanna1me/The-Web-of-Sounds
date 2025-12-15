import { useEffect, useRef } from "react";
import { vl } from "@/lib/vegaLiteClient";

export function TopTracksChart({ topTracks = [] }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!topTracks || topTracks.length === 0) return;
    if (!vl) return;

    let element;

    const renderChart = async () => {
      try {
        const chart = vl
          .markBar()
          .data(topTracks)
          .encode(
            vl.y().fieldN("name").title("Track").sort("-x"),
            vl.x().fieldQ("popularity").title("Popularity"),
            vl.tooltip([
              vl.fieldN("name"),
              vl.fieldQ("popularity"),
              vl.fieldQ("duration_min"),
            ]),
          )
          .width(500)
          .height({ step: 20 });

        element = await chart.render();

        if (!chartRef.current) return;
        chartRef.current.innerHTML = "";
        chartRef.current.appendChild(element);
      } catch (error) {
        // Fail silently in UI, but log for debugging
        console.error("Error rendering Vega-Lite top tracks chart:", error);
      }
    };

    renderChart();

    return () => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [topTracks]);

  const hasData = Array.isArray(topTracks) && topTracks.length > 0;

  return (
    <div className="bg-gray-900 p-6 rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4 text-green-400">
        Top Tracks Popularity
      </h3>
      {hasData ? (
        <div ref={chartRef} />
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          Select an artist (with a valid Spotify token) to see their top tracks.
        </div>
      )}
    </div>
  );
}
