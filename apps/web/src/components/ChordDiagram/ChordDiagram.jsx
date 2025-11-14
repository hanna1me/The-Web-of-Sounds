import { useRef, useEffect } from "react";

export function ChordDiagram({ data, width = 600, height = 600 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = svgRef.current;
    svg.innerHTML = "";

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
    data.forEach(({ source, target, value }) => {
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

      // Add hover effects
      path.addEventListener("mouseenter", () => {
        path.setAttribute("opacity", "1");
        path.setAttribute("stroke-width", Math.max(2, value));
      });
      path.addEventListener("mouseleave", () => {
        path.setAttribute("opacity", "0.6");
        path.setAttribute("stroke-width", Math.max(1, value / 2));
      });

      svg.appendChild(path);
    });
  }, [data, width, height]);

  return (
    <div className="flex justify-center">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-700 rounded-lg bg-gray-800"
      ></svg>
    </div>
  );
}
