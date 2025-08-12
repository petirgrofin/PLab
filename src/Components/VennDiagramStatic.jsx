import { REGION_IDS } from "../Constants/regions";
import { DEFAULT_VENN_CONFIG } from "../Constants/vennConfig";
import { constructVennDiagram } from "../utils/vennUtils";
import { InlineMath } from "react-katex";
import { VennRegion } from "./VennRegion";

export default function VennDiagramStatic({
  leftSet = "A",
  rightSet = "B",
  cardinalities = {},
  highlightedRegions = []
}) {
  const shapes = constructVennDiagram(DEFAULT_VENN_CONFIG);
  const { width, height, overlap } = DEFAULT_VENN_CONFIG;

  const cxA = width / 2 - overlap;
  const cxB = width / 2 + overlap;
  const cy = height / 2;

  // Approximate coordinates for placing text
  const regionCenters = {
    [REGION_IDS.OnlyA]: { x: cxA - 30, y: cy },
    [REGION_IDS.OnlyB]: { x: cxB + 30, y: cy },
    [REGION_IDS.Intersection]: { x: (cxA + cxB) / 2, y: cy },
    [REGION_IDS.Outside]: { x: width / 2, y: height - 30 }
  };

  return (
    <svg
      className="ml-auto mr-auto"
      width={width}
      height={height}
    >
      {/* Outside region */}
      <VennRegion
        regionId={REGION_IDS.Outside}
        width={width}
        height={height}
        selected={highlightedRegions.includes(REGION_IDS.Outside)}
        interactive={false}
      />

      {/* Venn regions */}
      {shapes
        .filter((s) => s.type === "path")
        .map(({ id, d }) => (
          <VennRegion
            key={id}
            regionId={id}
            d={d}
            selected={highlightedRegions.includes(id)}
            interactive={false}
          />
        ))}

      {/* Set labels */}
      <foreignObject x={cxA - 10} y={cy - 80} width={30} height={30}>
        <InlineMath math={leftSet} />
      </foreignObject>
      <foreignObject x={cxB - 10} y={cy - 80} width={30} height={30}>
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
