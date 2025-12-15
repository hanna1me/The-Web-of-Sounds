import { useEffect, useRef, useState } from "react";
import { vl } from "@/lib/vegaLiteClient";

export function TopTracksChart({ topTracks = [] }) {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = Math.floor(el.getBoundingClientRect().width);
      if (w > 0) setContainerWidth(w);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!Array.isArray(topTracks) || topTracks.length === 0) return;
    if (!vl) return;

    const w = Math.max(320, Math.floor(containerWidth));
    if (!Number.isFinite(w) || w <= 0) return;

    let element;

    const renderChart = async () => {
      try {
        const chart = vl
          .markBar({ cornerRadiusEnd: 4 })
          .data(topTracks)
          .encode(
            vl
              .y()
              .fieldN("name")
              .title("Track")
              .sort("-x")
              .axis({
                labelColor: "#9CA3AF",
                titleColor: "#9CA3AF",
                domainColor: "#374151",
                tickColor: "#374151",
                grid: false,
                labelLimit: 220,
              }),
            vl
              .x()
              .fieldQ("popularity")
              .title("Popularity")
              .axis({
                labelColor: "#9CA3AF",
                titleColor: "#9CA3AF",
                domainColor: "#374151",
                tickColor: "#374151",
                grid: true,
                gridColor: "#374151",
                gridDash: [3, 3],
              }),
            vl.color().value("#10B981"),
            vl.tooltip([
              vl.fieldN("name"),
              vl.fieldQ("popularity"),
              vl.fieldQ("duration_min"),
            ]),
          )
          .width(w)
          .height({ step: 20 })
          .config({
            background: "#111827",
            view: { stroke: null },
          });

        element = await chart.render();

        if (!chartRef.current) return;
        chartRef.current.innerHTML = "";
        chartRef.current.appendChild(element);
      } catch (error) {
        console.error("Error rendering Vega-Lite top tracks chart:", error);
      }
    };

    renderChart();

    return () => {
      if (element && element.parentNode) element.parentNode.removeChild(element);
    };
  }, [topTracks, containerWidth]);

  const hasData = Array.isArray(topTracks) && topTracks.length > 0;

  return (
    <div className="bg-gray-900 p-6 rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-4 text-green-400">
        Top Tracks Popularity
      </h3>

      {hasData ? (
        <div ref={containerRef} className="w-full h-[300px] overflow-auto">
          <div ref={chartRef} />
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          Select an artist (with a valid Spotify token) to see their top tracks.
        </div>
      )}
    </div>
  );
}
