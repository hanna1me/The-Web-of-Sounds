import { useRef, useEffect } from "react";

export function ChordDiagram({ data, width = 600, height = 600 }) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const container = svg.parentElement;
    if (!container) return;

    if (!data || data.length === 0) {
      svg.innerHTML = "";
      if (tooltipRef.current && tooltipRef.current.parentElement === container) {
        container.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
      return;
    }

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
    container.appendChild(tooltipEl);
    const cleanupFns = [];

    const radius = Math.min(width, height) / 2 - 40;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create matrix for chord diagram
    const artists = [
      ...new Set([...data.map((d) => d.source), ...data.map((d) => d.target)]),
    ];
    const matrix = Array(artists.length)
      .fill(0)
      .map(() => Array(artists.length).fill(0));

    data.forEach(({ source, target, value }) => {
      const sourceIndex = artists.indexOf(source);
      const targetIndex = artists.indexOf(target);
      matrix[sourceIndex][targetIndex] = value;
      matrix[targetIndex][sourceIndex] = value;
    });

    // Calculate angles for each artist
    const angleStep = (2 * Math.PI) / artists.length;
    const colors = artists.map(
      (_, i) => `hsl(${(i * 360) / artists.length}, 70%, 60%)`,
    );

    // Draw outer circle and labels
    artists.forEach((artist, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Artist dot
      const dot = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", "6");
      dot.setAttribute("fill", colors[i]);
      dot.setAttribute("stroke", "white");
      dot.setAttribute("stroke-width", "2");
      svg.appendChild(dot);

      // Artist label
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
      text.textContent =
        artist.length > 15 ? artist.substring(0, 12) + "..." : artist;
      svg.appendChild(text);
    });

    // Draw connections
    data.forEach(({ source, target, value, year, genres, song }) => {
      const sourceIndex = artists.indexOf(source);
      const targetIndex = artists.indexOf(target);

      const sourceAngle = sourceIndex * angleStep - Math.PI / 2;
      const targetAngle = targetIndex * angleStep - Math.PI / 2;

      const sourceX = centerX + radius * Math.cos(sourceAngle);
      const sourceY = centerY + radius * Math.sin(sourceAngle);
      const targetX = centerX + radius * Math.cos(targetAngle);
      const targetY = centerY + radius * Math.sin(targetAngle);

      // Create curved path
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      const midX = centerX;
      const midY = centerY;

      const d = `M ${sourceX} ${sourceY} Q ${midX} ${midY} ${targetX} ${targetY}`;
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", colors[sourceIndex]);
      path.setAttribute("stroke-width", Math.max(1, value / 2));
      path.setAttribute("opacity", "0.6");
      path.setAttribute("class", "chord-connection");

      const genreText = genres?.length ? genres.join(", ") : "Similar genre";
      const releaseYear = song?.releaseYear || year;
      const yearText = releaseYear ? `Year: ${releaseYear}` : "Year: Various";
      const songText = song?.title
        ? `Song: ${song.title}`
        : "Song: Collaborative session";
      const tooltipContent = `${source} ↔ ${target}\n${songText}\n${yearText}\nShared genres: ${genreText}`;

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
        path.setAttribute("stroke-width", Math.max(1, value / 2));
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
  }, [data, width, height]);

  return (
    <div className="relative flex justify-center">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-700 rounded-lg bg-gray-800"
      ></svg>
    </div>
  );
}
