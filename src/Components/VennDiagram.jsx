import { useState } from "react";
import { REGION_IDS } from "../Constants/regions";
import { DEFAULT_VENN_CONFIG } from "../Constants/vennConfig";
import { constructVennDiagram } from "../utils/vennUtils";
import { VennRegion } from "./VennRegion";
import { InlineMath } from "react-katex";
import { useComponentContext } from "../lessons/ComponentContext";

/********************************************
 * VennDiagram 
 * ------------------------------------------
 *
 * Props:
 *   selectedRegions?: string[]                // optional external control
 *   setSelectedRegions?: (ids:string[])=>void // optional external updater
 *   interactive?: boolean = true              // allow user clicks?
 */
export default function VennDiagram({
  selectedRegions: controlledSelectedRegions,
  setSelectedRegions: controlledSetSelectedRegions,
  leftSet = "A",
  rightSet = "B",
  interactive = true
}) {
  const [internalSelected, setInternalSelected] = useState([]);
  const isControlled = controlledSelectedRegions !== undefined && controlledSetSelectedRegions !== undefined;

  const selectedRegions = isControlled ? controlledSelectedRegions : internalSelected;
  const setSelectedRegions = isControlled ? controlledSetSelectedRegions : setInternalSelected;

  const { setExerciseResponse } = useComponentContext();

  const shapes = constructVennDiagram(DEFAULT_VENN_CONFIG);

  function onRegionClick(regionId) {
    if (!interactive) return;

    const updatedRegion = selectedRegions.includes(regionId) ? 
    selectedRegions.filter((r) => r !== regionId) : [...selectedRegions, regionId]

    setSelectedRegions(updatedRegion);
    setExerciseResponse({"vennDiagramSelect": true, "response": updatedRegion})
  }

  return (
    <svg className="ml-auto mr-auto" width={DEFAULT_VENN_CONFIG.width} height={DEFAULT_VENN_CONFIG.height}>
      <VennRegion
        regionId={REGION_IDS.Outside}
        width={DEFAULT_VENN_CONFIG.width}
        height={DEFAULT_VENN_CONFIG.height}
        selected={selectedRegions.includes(REGION_IDS.Outside)}
        interactive={interactive}
        onSelect={onRegionClick}
      />
      {shapes.map(({ id, d }) => (
        <VennRegion
          key={id}
          regionId={id}
          d={d}
          selected={selectedRegions.includes(id)}
          interactive={interactive}
          onSelect={onRegionClick}
        />
      ))}
      <foreignObject x={100} y={30} width={30} height={30}>
        <InlineMath math={leftSet} />
      </foreignObject>
      <foreignObject x={380} y={30} width={30} height={30}>
        <InlineMath math={rightSet} />
      </foreignObject>
    </svg>
  );
}
