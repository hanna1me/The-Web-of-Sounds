import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

/**
 * Props:
 * - nodes: [{ name: string, genre?: string, ... }]
 * - links: [{ source: string, target: string, weight?: number, track?: string, ... }]
 * - title: string
 * - heightVh: number (optional) -> how tall the viz should be in viewport height
 */
export function D3ChordVisualization({
  nodes = [],
  links = [],
  title = " ",
  heightVh = 80,
}) {
  const hostRef = useRef(null);

  const hasData = useMemo(() => {
    if (!Array.isArray(nodes) || nodes.length === 0) return false;
    if (!Array.isArray(links) || links.length === 0) return false;
    return nodes.every((n) => typeof n?.name === "string" && n.name.length > 0);
  }, [nodes, links]);

  useEffect(() => {
    if (!hostRef.current) return;

    // Clear previous render
    hostRef.current.innerHTML = "";
    if (!hasData) return;

    // Measure container
    const rect = hostRef.current.getBoundingClientRect();
    const containerW = Math.max(300, rect.width || 0);
    const containerH = Math.max(300, rect.height || 0);

    // Use the smaller dimension so the chord stays circular and fits
    const size = Math.min(containerW, containerH);

    // Radii relative to container
    const innerRadius = size * 0.34;
    const outerRadius = size * 0.38;

    // Responsive SVG
    const svg = d3
      .create("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [-size / 2, -size / 2, size, size].join(" "))
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background", "transparent")
      .style("font-family", "Inter, system-ui, sans-serif");

    // Title (positioned near top inside the viewBox)
    svg
      .append("text")
      .text(title)
      .attr("x", 0)
      .attr("y", -size / 2 + 28)
      .attr("text-anchor", "middle")
      .style("fill", "#E5E7EB")
      .style("font-size", "18px")
      .style("font-weight", 700);

    // Build index map + matrix
    const nodesToIndex = new Map(
        nodes.map((d, i) => [d.id ?? d.name, i])
    );
    const matrix = Array.from({ length: nodes.length }, () =>
      Array(nodes.length).fill(0)
    );

    links.forEach((link) => {
      const i = nodesToIndex.get(link.source);
      const j = nodesToIndex.get(link.target);
      if (i === undefined || j === undefined) return;

      const w = Number(link.weight ?? 1);
      matrix[i][j] += w;
      matrix[j][i] += w;
    });

    const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);
    const chords = chord(matrix);

    // Spotify green (you can swap this for a real genre palette later)
    const color = () => "#1DB954";

    // Tooltip (create once per render, remove on cleanup)
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("data-chord-tooltip", "true")
      .style("position", "absolute")
      .style("z-index", 1000)
      .style("padding", "8px 10px")
      .style("background", "rgba(17, 24, 39, 0.95)")
      .style("color", "#F9FAFB")
      .style("border", "1px solid rgba(255,255,255,0.08)")
      .style("border-radius", "10px")
      .style("font-size", "12px")
      .style("box-shadow", "0 10px 20px rgba(0,0,0,0.35)")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Groups (arcs + labels)
    const group = svg
      .append("g")
      .selectAll("g")
      .data(chords.groups)
      .join("g");

    const arcPaths = group
      .append("path")
      .attr("fill", (d) => color(nodes[d.index]?.genre))
      .attr("stroke", "#0B1220")
      .attr("stroke-width", 1)
      .attr("d", d3.arc().innerRadius(innerRadius).outerRadius(outerRadius));

    // Labels
    group
      .append("text")
      .each((d) => {
        d.angle = (d.startAngle + d.endAngle) / 2;
      })
      .attr("dy", "0.35em")
      .attr(
        "transform",
        (d) => `
          rotate(${(d.angle * 180) / Math.PI - 90})
          translate(${outerRadius + 10})
          ${d.angle > Math.PI ? "rotate(180)" : ""}
        `
      )
      .attr("text-anchor", (d) => (d.angle > Math.PI ? "end" : "start"))
      .style("fill", "#E5E7EB")
      .style("font-size", "11px")
      .style("font-weight", 500)
      .style("pointer-events", "none")
      .each(function (d) {
        const nameMap = new Map([["YoungBoy Never Broke Again", "YoungBoy NBA"]]);
        const raw = nodes[d.index]?.name ?? "";
        const name = nameMap.get(raw) ?? raw;

        const maxLength = 17;
        const lines = [];
        for (let i = 0; i < name.length; i += maxLength) {
          lines.push(name.slice(i, i + maxLength));
        }

        const text = d3.select(this);
        lines.forEach((line, i) => {
          text
            .append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? 0 : "1.1em")
            .text(line);
        });
      });

    // Ribbons (keep reference for hover fades)
    const ribbons = svg
      .append("g")
      .attr("fill-opacity", 0.6)
      .selectAll("path")
      .data(chords)
      .join("path")
      .attr("d", d3.ribbon().radius(innerRadius))
      .style("fill", (d) => color(nodes[d.source.index]?.genre))
      .style("stroke", "#111827")
      .style("stroke-width", 0.5);

    // Ribbon tooltip + hover fade
    ribbons
    ribbons.on("mouseover", (event, d) => {
        const sourceId = nodes[d.source.index]?.id ?? nodes[d.source.index]?.name;
        const targetId = nodes[d.target.index]?.id ?? nodes[d.target.index]?.name;

        const sourceName = nodes[d.source.index]?.name ?? "";
        const targetName = nodes[d.target.index]?.name ?? "";

        const link =
            links.find((l) => l.source === sourceId && l.target === targetId) ??
            links.find((l) => l.source === targetId && l.target === sourceId);

        tooltip
            .style("opacity", 1)
            .html(`
                <div style="font-weight:600; margin-bottom:2px;">${sourceName} × ${targetName}</div>
                ${
                    link?.track
                    ? `<div style="color:#D1D5DB;">Track: <span style="color:#F9FAFB;">${link.track}</span></div>`
                    : `<div style="color:#9CA3AF;">Shared collaborations</div>`
                }
            `);

        ribbons.style("opacity", (r) => (r === d ? 0.9 : 0.08));
    })

    //   .on("mouseover", (event, d) => {
    //     const source = nodes[d.source.index]?.name ?? "";
    //     const target = nodes[d.target.index]?.name ?? "";

    //     const link =
    //       links.find((l) => l.source === source && l.target === target) ??
    //       links.find((l) => l.source === target && l.target === source);

    //     tooltip
    //       .style("opacity", 1)
    //       .html(`
    //         <div style="font-weight:600; margin-bottom:2px;">${source} × ${target}</div>
    //         ${
    //           link?.track
    //             ? `<div style="color:#D1D5DB;">Track: <span style="color:#F9FAFB;">${link.track}</span></div>`
    //             : `<div style="color:#9CA3AF;">Shared collaborations</div>`
    //         }
    //       `);

    //     ribbons.style("opacity", (r) => (r === d ? 0.9 : 0.08));
    //   })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
        ribbons.style("opacity", 0.6);
      });

    // Optional: hover arcs to highlight connected ribbons
    arcPaths
      .on("mouseover", (event, d) => {
        const idx = d.index;
        ribbons.style("opacity", (r) =>
          r.source.index === idx || r.target.index === idx ? 0.9 : 0.06
        );
      })
      .on("mouseout", () => {
        ribbons.style("opacity", 0.6);
      });

    // Mount into DOM
    hostRef.current.appendChild(svg.node());

    // Cleanup
    return () => {
      if (hostRef.current) hostRef.current.innerHTML = "";
      tooltip.remove();
    };
  }, [hasData, nodes, links, title]);

  return (
    <div className="w-full overflow-auto">
      {!hasData ? (
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          No chord data to display.
        </div>
      ) : (
        <div
          ref={hostRef}
          className="w-full"
          style={{ height: `${heightVh}vh` }}
        />
      )}
    </div>
  );
}
