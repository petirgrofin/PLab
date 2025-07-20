import VennDiagram from "./VennDiagram.jsx";
import { useState } from "react";
import { REGION_IDS, Universe, Union, ComplementA } from "../Constants/regions";
import { RegionInfo } from "../Constants/RegionInfo.jsx";

/* This is done manually because a two-set Venn diagram only has 2^4 = 16 combinations, which is a manageable amount. The situation is very different
for a three-set Venn diagram, which has 2^8 = 256 combinations */
function combineRegions(regions){

    if (!regions || regions.length === 0) return "empty";

    // Sort to make comparison order-independent
    const r = [...regions].sort().join(",");

    if (r in RegionInfo) return r;

    if (r === "AdB,AiB,BdA") return "AuB";
    if (r === "(AuB)',AdB,AiB,BdA") return "U";

    if (r === "AdB,AiB") return "A"; // A only (union of A parts)
    if (r === "AiB,BdA") return "B"; // B only (union of B parts)

    if (r === "(AuB)',AdB") return "B'";
    if (r === "(AuB)',BdA") return "A'";

    return "empty";

}

const VennDiagramInfo = () => {

    const [selectedRegions, setSelectedRegions] = useState([REGION_IDS.Intersection]);
    const combinedRegion = combineRegions(selectedRegions)
    const selectedRegionInfo = RegionInfo[combinedRegion]
    
    const PresetButton = ({regionArray, text}) => {
        return (
            <button className="rounded-md border-2 border-b-4 p-2 cursor-pointer hover:bg-gray-200 active:border-b-2 active:bg-gray-300" onClick={() => {setSelectedRegions(regionArray)}}>{text}</button>
        )
    }

    return (
        <div className='flex flex-col gap-2'>
            <VennDiagram selectedRegions={selectedRegions} setSelectedRegions={setSelectedRegions}></VennDiagram>
            <div className="flex flex-row gap-2 justify-center">
                <PresetButton regionArray={Universe} text={"Universo"}/>
                <PresetButton regionArray={Union} text={"Unión"}/>
                <PresetButton regionArray={[REGION_IDS.Intersection]} text={"Intersección"}/>
                <PresetButton regionArray={[REGION_IDS.OnlyA]} text={"Diferencia"}/>
                <PresetButton regionArray={ComplementA} text={"Complemento"}/>
            </div>
            <div className="mt-8 flex flex-col gap-2">
                <span><b>Región:</b> {selectedRegionInfo.notation}</span>
                <p><b>Explicación:</b> {selectedRegionInfo.explanation}</p>
            </div>
        </div>
    )
}

export default VennDiagramInfo