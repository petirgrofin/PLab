import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { REGION_IDS } from "../Constants/regions";
import { constructVennDiagram } from "../utils/vennUtils";
import { VennRegion } from "./VennRegion";
import { InlineMath } from "react-katex";
import { useComponentContext } from "../lessons/ComponentContext";

// import all responsive configs
import {
  DEFAULT_VENN_CONFIG,
  SMALL_VENN_CONFIG,
  EXTRA_SMALL_VENN_CONFIG,
} from "../Constants/vennConfig";

/********************************************
 * VennDiagram 
 * ------------------------------------------
 * Automatically responsive via useMediaQuery
 ********************************************/
export default function VennDiagram({
  selectedRegions: controlledSelectedRegions,
  setSelectedRegions: controlledSetSelectedRegions,
  leftSet = "A",
  rightSet = "B",
  interactive = true,
}) {
  const [internalSelected, setInternalSelected] = useState([]);
  const isControlled =
    controlledSelectedRegions !== undefined &&
    controlledSetSelectedRegions !== undefined;

  const selectedRegions = isControlled
    ? controlledSelectedRegions
    : internalSelected;
  const setSelectedRegions = isControlled
    ? controlledSetSelectedRegions
    : setInternalSelected;

  const { setExerciseResponse } = useComponentContext();

  // 🔎 pick config based on screen size
  const isExtraSmall = useMediaQuery({ maxWidth: 480 });
  const isSmall = useMediaQuery({ minWidth: 481, maxWidth: 768 });

  const config = isExtraSmall
    ? EXTRA_SMALL_VENN_CONFIG
    : isSmall
    ? SMALL_VENN_CONFIG
    : DEFAULT_VENN_CONFIG;

  // generate diagram with chosen config
  const shapes = constructVennDiagram(config);

  function onRegionClick(regionId) {
    if (!interactive) return;

    const updatedRegion = selectedRegions.includes(regionId)
      ? selectedRegions.filter((r) => r !== regionId)
      : [...selectedRegions, regionId];

    setSelectedRegions(updatedRegion);
    setExerciseResponse({
      vennDiagramSelect: true,
      response: updatedRegion,
    });
  }

  return (
    <svg
      className="mx-auto"
      width={config.width}
      height={config.height}
    >
      <VennRegion
        regionId={REGION_IDS.Outside}
        width={config.width}
        height={config.height}
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
            <foreignObject
              x={
                config === DEFAULT_VENN_CONFIG
                  ? 100
                  : config === SMALL_VENN_CONFIG
                  ? 60
                  : 60 // extra small label position
              }
              y={40}
              width={30}
              height={30}
            >
              <InlineMath math={leftSet} />
            </foreignObject>
            <foreignObject
              x={
                config === DEFAULT_VENN_CONFIG
                  ? 380
                  : config === SMALL_VENN_CONFIG
                  ? 330
                  : 230 // extra small label position
              }
              y={40}
              width={30}
              height={30}
            >
              <InlineMath math={rightSet} />
            </foreignObject>
    </svg>
  );
}
