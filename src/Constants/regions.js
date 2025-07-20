/********************************************
 * Region ID constants 
 ********************************************/
export const REGION_IDS = {
  Outside: "(AuB)'",
  OnlyA: "AdB",   // A minus B
  OnlyB: "BdA",   // B minus A
  Intersection: "AiB",   // A intersect B (lens)
};

export const Universe = [REGION_IDS.OnlyA, REGION_IDS.OnlyB, REGION_IDS.Intersection, REGION_IDS.Outside]

export const Union = [REGION_IDS.OnlyA, REGION_IDS.OnlyB, REGION_IDS.Intersection]

export const ComplementA = [REGION_IDS.Outside, REGION_IDS.OnlyB]

export const VennPresetButtons = {
  
}