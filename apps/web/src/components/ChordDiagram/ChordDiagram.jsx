import { useRef, useEffect } from "react";
import * as d3 from "d3";

export function ChordDiagram({ nodes, links, width = 700, height = 700 }) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const container = svg.parentElement;
    if (!container) return;

    // Clear + cleanup tooltip if no data
    if (!nodes || !links || nodes.length === 0 || links.length === 0) {
      svg.innerHTML = "";
      if (tooltipRef.current && tooltipRef.current.parentElement === container) {
        container.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
      return;
    }

    // Clear previous render
    svg.innerHTML = "";

    let tooltipEl = tooltipRef.current;
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipRef.current = tooltipEl;
    }
    tooltipEl.style.position = "absolute";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.backgroundColor = "rgba(17, 24, 39, 0.9)";
    tooltipEl.style.color = "white";
    tooltipEl.style.fontSize = "12px";
    tooltipEl.style.padding = "4px 8px";
    tooltipEl.style.borderRadius = "6px";
    tooltipEl.style.border = "1px solid rgba(75, 85, 99, 0.8)";
    tooltipEl.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
    tooltipEl.style.whiteSpace = "pre-line";
    tooltipEl.style.display = "none";
    container.style.position = "relative";
    if (!tooltipEl.parentElement) {
      container.appendChild(tooltipEl);
    }

    const cleanupFns = [];

    const radius = Math.min(width, height) / 2 - 60;
    const centerX = width / 2;
    const centerY = height / 2;

    // Data prep
    const artistNames = nodes.map((d) => d.name);

    // Color by genre
    const genreScale = d3
      .scaleOrdinal(d3.schemePaired)
      .domain([...new Set(nodes.map((d) => d.genre))]);

    const artistColorMap = new Map(
      nodes.map((d) => [d.name, genreScale(d.genre || "Not Specified")]),
    );

    // Aggregate counts per pair for line thickness
    const pairCount = new Map();
    links.forEach((l) => {
      const key =
        l.source < l.target
          ? `${l.source}|||${l.target}`
          : `${l.target}|||${l.source}`;
      pairCount.set(key, (pairCount.get(key) || 0) + 1);
    });

    const angleStep = (2 * Math.PI) / artistNames.length;

    // Artist dot
    artistNames.forEach((artist, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const color = artistColorMap.get(artist) || "#9CA3AF";

      // Dot
      const dot = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", "6");
      dot.setAttribute("fill", color);
      dot.setAttribute("stroke", "white");
      dot.setAttribute("stroke-width", "2");
      svg.appendChild(dot);

      // Label
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      const labelRadius = radius + 20;
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);
      text.setAttribute("x", labelX);
      text.setAttribute("y", labelY);
      text.setAttribute(
        "text-anchor",
        angle > Math.PI / 2 && angle < (3 * Math.PI) / 2 ? "end" : "start",
      );
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("font-size", "10");
      text.setAttribute("fill", "white");

      const labelText =
        artist.length > 18 ? artist.substring(0, 15) + "..." : artist;
      text.textContent = labelText;
      svg.appendChild(text);
    });

    // Links
    links.forEach((link) => {
      const { source, target, track, genre, targetGenre } = link;

      const sourceIndex = artistNames.indexOf(source);
      const targetIndex = artistNames.indexOf(target);
      if (sourceIndex === -1 || targetIndex === -1) return;

      const sourceAngle = sourceIndex * angleStep - Math.PI / 2;
      const targetAngle = targetIndex * angleStep - Math.PI / 2;

      const sourceX = centerX + radius * Math.cos(sourceAngle);
      const sourceY = centerY + radius * Math.sin(sourceAngle);
      const targetX = centerX + radius * Math.cos(targetAngle);
      const targetY = centerY + radius * Math.sin(targetAngle);

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      const midX = centerX;
      const midY = centerY;
      const d = `M ${sourceX} ${sourceY} Q ${midX} ${midY} ${targetX} ${targetY}`;
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute(
        "stroke",
        artistColorMap.get(source) || artistColorMap.get(target) || "#6B7280",
      );

      const key =
        source < target ? `${source}|||${target}` : `${target}|||${source}`;
      const value = pairCount.get(key) || 1;

      path.setAttribute("stroke-width", Math.max(1, value * 0.7));
      path.setAttribute("opacity", "0.6");
      path.setAttribute("class", "chord-connection");

      const tooltipContent = `${source} ↔ ${target}
Track: ${track || "Unknown track"}
Source genre: ${genre || "Not specified"}
Target genre: ${targetGenre || "Not specified"}`;

      const updateTooltipPosition = (event) => {
        const rect = container.getBoundingClientRect();
        tooltipEl.style.left = `${event.clientX - rect.left + 12}px`;
        tooltipEl.style.top = `${event.clientY - rect.top + 12}px`;
      };

      const handleEnter = (event) => {
        path.setAttribute("opacity", "1");
        path.setAttribute("stroke-width", Math.max(2, value));
        tooltipEl.textContent = tooltipContent;
        tooltipEl.style.display = "block";
        updateTooltipPosition(event);
      };

      const handleMove = (event) => {
        updateTooltipPosition(event);
      };

      const handleLeave = () => {
        path.setAttribute("opacity", "0.6");
        path.setAttribute("stroke-width", Math.max(1, value * 0.7));
        tooltipEl.style.display = "none";
      };

      path.addEventListener("mouseenter", handleEnter);
      path.addEventListener("mousemove", handleMove);
      path.addEventListener("mouseleave", handleLeave);

      cleanupFns.push(() => {
        path.removeEventListener("mouseenter", handleEnter);
        path.removeEventListener("mousemove", handleMove);
        path.removeEventListener("mouseleave", handleLeave);
      });

      svg.appendChild(path);
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
      if (tooltipEl && tooltipEl.parentElement === container) {
        container.removeChild(tooltipEl);
        tooltipRef.current = null;
      }
    };
  }, [nodes, links, width, height]);

  return (
    <div className="relative flex justify-center">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-700 rounded-lg bg-gray-800"
      />
    </div>
  );
}

