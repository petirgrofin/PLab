import VennDiagram from "./VennDiagram.jsx";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

import {
  REGION_IDS,
  Universe,
  Union,
  ComplementA,
} from "../Constants/regions";
import { RegionInfo } from "../Constants/RegionInfo.jsx";

/* This is done manually because a two-set Venn diagram only has 2^4 = 16 combinations */
function combineRegions(regions) {
  if (!regions || regions.length === 0) return "empty";

  const r = [...regions].sort().join(",");

  console.log(r)

  if (r in RegionInfo) return r;

  // Full set
  if (r === "AdB,AiB,BdA") return "AuB";
  if (r === "(AuB)',AdB,AiB,BdA") return "U";

  // Singles
  if (r === "AdB,AiB") return "A";
  if (r === "AiB,BdA") return "B";
  if (r === "(AuB)',AdB") return "B'";
  if (r === "(AuB)',BdA") return "A'";

  // Complements
  if (r === "(AuB)',AdB,BdA") return "(AiB)'";
  if (r === "(AuB)',AiB,BdA") return "(AdB)'"; 
  if (r === "(AuB)',AdB,AiB") return "(BdA)'";

  // Intersections / differences (already atomic)
  if (r === "AiB") return "AiB";
  if (r === "AdB") return "AdB";
  if (r === "BdA") return "BdA";
  if (r === "(AuB)'") return "(AuB)'";

  // Fallback
  return "empty";
}


const VennDiagramInfo = () => {
  const [selectedRegions, setSelectedRegions] = useState([
    REGION_IDS.Intersection,
  ]);
  const combinedRegion = combineRegions(selectedRegions);
  const selectedRegionInfo = RegionInfo[combinedRegion];

  const PresetButton = ({ regionArray, text }) => (
    <button
      className="rounded-md border-2 border-b-4 p-2 cursor-pointer hover:bg-gray-200 active:border-b-2 active:bg-gray-300"
      onClick={() => {
        setSelectedRegions(regionArray);
      }}
    >
      {text}
    </button>
  );

  return (
    <div className="flex flex-col gap-2">
      <VennDiagram
        selectedRegions={selectedRegions}
        setSelectedRegions={setSelectedRegions}
      />
      <div className="flex flex-row gap-2 justify-center flex-wrap">
        <PresetButton regionArray={Universe} text={"Universo"} />
        <PresetButton regionArray={Union} text={"Unión"} />
        <PresetButton
          regionArray={[REGION_IDS.Intersection]}
          text={"Intersección"}
        />
        <PresetButton regionArray={[REGION_IDS.OnlyA]} text={"Diferencia"} />
        <PresetButton regionArray={ComplementA} text={"Complemento"} />
      </div>
      <div className="mt-8 flex flex-col gap-2 text-sm sm:text-base">
        <span>
          <b>Región:</b> {selectedRegionInfo.notation}
        </span>
        <p>
          <b>Explicación:</b> {selectedRegionInfo.explanation}
        </p>
      </div>
    </div>
  );
};

export default VennDiagramInfo;
