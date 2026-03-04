import { useEffect, useRef, useState } from "react";
import { vl } from "@/lib/vegaLiteClient";


export function TopTracksChart({ topTracks = [] }) {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0].contentRect.width);
      if (w > 0) setContainerWidth(w);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!Array.isArray(topTracks) || topTracks.length === 0) return;
    if (!vl) return;

    // Subtract y-axis label column width so the plot area + labels fit the container
    const w = Math.max(200, Math.floor(containerWidth) - 200);
    if (!Number.isFinite(w) || w <= 0) return;

    let element;

    const renderChart = async () => {
      try {
        const chart = vl
          .markBar({ cornerRadiusEnd: 5 })
          .data(topTracks)
          .encode(
            vl
              .y()
              .fieldN("name")
              .title(null)
              .sort("-x")
              .axis({
                labelColor: "#6b7280",
                titleColor: "#6b7280",
                domainColor: "rgba(0,0,0,0.08)",
                tickColor: "transparent",
                grid: false,
                labelLimit: 190,
                labelFontSize: 14,
              }),
            vl
              .x()
              .fieldQ("popularity")
              .scale({ domain: [0, 100] })
              .title("Popularity score")
              .axis({
                labelColor: "#9ca3af",
                titleColor: "#9ca3af",
                domainColor: "rgba(0,0,0,0.08)",
                tickColor: "transparent",
                grid: true,
                gridColor: "rgba(0,0,0,0.08)",
                gridDash: [3, 3],
                labelFontSize: 14,
                titleFontSize: 13,
                values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
              }),
            vl.color().value("#1DB954"),
            vl.tooltip([
              vl.fieldN("name"),
              vl.fieldQ("popularity"),
              vl.fieldQ("duration_min"),
            ]),
          )
          .width(w)
          .height({ step: 22 })
          .config({
            background: "transparent",
            view: { stroke: null },
            bar: { opacity: 0.85 },
            font: "Inter, system-ui, sans-serif",
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
    <div className="glass card-hover p-6 mb-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-5 rounded-full"
          style={{ background: "#400074" }}
        />
        <h3
          className="text-base font-semibold"
          style={{
            color: "#000000",
            fontFamily:
              'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          Top Tracks
        </h3>
      </div>

      {hasData ? (
        <div ref={containerRef} style={{ width: "100%", overflow: "hidden" }}>
          <div ref={chartRef} />
        </div>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-sm" style={{ color: "#9ca3af" }}>
          Select an artist with a valid Spotify token to see top tracks.
        </div>
      )}
    </div>
  );
}
