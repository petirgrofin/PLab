import { InlineMath } from "react-katex";

/**
 * VennDiagramMutuallyExclusive
 * 
 * Props:
 * - leftSet: label for the left set (e.g., "A")
 * - rightSet: label for the right set (e.g., "B")
 * - cardinalities: object with counts per region: { A: number, B: number, Outside?: number }
 * - highlightedRegions: array of region ids to highlight: ["A", "B", "Outside"]
 */
export default function VennDiagramMutuallyExclusive({
  leftSet = "A",
  rightSet = "B",
  cardinalities = {},
  highlightedRegions = []
}) {
  const width = 500;
  const height = 300;
  const radius = 100;
  const cxA = 130;
  const cxB = 370;
  const cy = 150;

  const regionCenters = {
    A: { x: cxA, y: cy },
    B: { x: cxB, y: cy },
    Outside: { x: width / 2, y: height - 30 }
  };

  const isHighlighted = (region) =>
    highlightedRegions.includes(region)
      ? "fill-blue-200 stroke-blue-600"
      : "fill-white stroke-black stroke-2";

  return (
    <svg
      className="ml-auto mr-auto block"
      width={width}
      height={height}
    >
      {/* Outside background */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        className={isHighlighted("Outside")}
      />

      {/* Left circle (Set A) */}
      <circle
        cx={cxA}
        cy={cy}
        r={radius}
        className={isHighlighted("A")}
      />
      {/* Right circle (Set B) */}
      <circle
        cx={cxB}
        cy={cy}
        r={radius}
        className={isHighlighted("B")}
      />

      {/* Set labels */}
      <foreignObject x={cxA - 8} y={cy - 10} width={30} height={30}>
        <InlineMath math={leftSet} />
      </foreignObject>
      <foreignObject x={cxB - 8} y={cy - 10} width={30} height={30}>
        <InlineMath math={rightSet} />
      </foreignObject>

      {/* Cardinalities */}
      {Object.entries(cardinalities).map(([regionId, count]) => {
        const pos = regionCenters[regionId];
        if (!pos) return null;
        return (
          <text
            key={`card-${regionId}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            alignmentBaseline="central"
            className="fill-black text-sm"
          >
            {count}
          </text>
        );
      })}
    </svg>
  );
}
