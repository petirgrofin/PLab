import React, { useState, useMemo, useRef } from "react";
import { REGION_IDS } from "../Constants/regions";
import { VennRegion } from "./VennRegion"; // adjust path if different
import { constructVennDiagram } from "../utils/vennUtils"; // adjust path if different

/** ********************************************************************
 * TwoSetVennCardinality
 * --------------------------------------------------------------------
 * Renders a 2‑set Venn diagram (A, B) with 4 disjoint regions:
 *   Outside = (A ∪ B)'
 *   OnlyA   = A \ B
 *   OnlyB   = B \ A
 *   Intersection = A ∩ B
 *
 * Each region has an overlaid <input type="number"> for entering the
 * cardinality (number of elements) *in that exact region*.
 *
 * Props ---------------------------------------------------------------
 * width, height, radius, overlap : numbers forwarded to constructVennDiagram
 * initialCounts : { [regionId]: number }
 * onCountsChange?: (counts, derived) => void  // derived = {A, B, union, universe}
 * showTotals?: boolean (default true)  // show derived table under diagram
 * className?: string                    // tailwind classes on wrapper
 * inputClassName?: string               // tailwind classes merged onto each input
 * showRegionOutlines?: boolean          // if false, hides svg stroke
 *
 * Behavior ------------------------------------------------------------
 * • Clicking a region highlights it and focuses its input.
 * • Counts are clamped to >= 0 (empty string allowed while editing).
 * • Derived totals recompute on every change:
 *     A = OnlyA + Intersection
 *     B = OnlyB + Intersection
 *     union = OnlyA + OnlyB + Intersection
 *     universe = union + Outside
 * • All numbers are integers; non‑numeric -> 0 in derived.
 */
export function TwoSetVennCardinality({
  width = 500,
  height = 300,
  radius = 100,
  overlap = 60,
  initialCounts = {},
  onCountsChange,
  showTotals = true,
  className = "",
  inputClassName = "",
  showRegionOutlines = true,
}) {
  // ------------------------------------------------------------------
  // Build the geometry once (stable for given dims).
  const config = { width, height, radius, overlap };
  const shapes = useMemo(() => constructVennDiagram(config), [width, height, radius, overlap]);

  // Precompute some geometry helpers for positioning inputs.
  const cxA = width / 2 - overlap;
  const cxB = width / 2 + overlap;
  const cy = height / 2;

  // Input positions (px, relative to wrapper). Tuned heuristically.
  const positions = useMemo(
    () => ({
      [REGION_IDS.Outside]: { left: 64, top: 32 },
      [REGION_IDS.OnlyA]: { left: cxA - radius * 0.45, top: cy },
      [REGION_IDS.OnlyB]: { left: cxB + radius * 0.45, top: cy },
      [REGION_IDS.Intersection]: { left: width / 2, top: cy },
    }),
    [cxA, cxB, cy, radius, width]
  );

  // State ----------------------------------------------------------------
  const [counts, setCounts] = useState(() => ({
    [REGION_IDS.Outside]: initialCounts[REGION_IDS.Outside] ?? 0,
    [REGION_IDS.OnlyA]: initialCounts[REGION_IDS.OnlyA] ?? 0,
    [REGION_IDS.OnlyB]: initialCounts[REGION_IDS.OnlyB] ?? 0,
    [REGION_IDS.Intersection]: initialCounts[REGION_IDS.Intersection] ?? 0,
  }));

  const [selectedRegion, setSelectedRegion] = useState(null);

  // Refs so clicking the svg region can focus input.
  const inputRefs = {
    [REGION_IDS.Outside]: useRef(null),
    [REGION_IDS.OnlyA]: useRef(null),
    [REGION_IDS.OnlyB]: useRef(null),
    [REGION_IDS.Intersection]: useRef(null),
  };

  // Derived totals -------------------------------------------------------
  const derived = useMemo(() => {
    const o = +counts[REGION_IDS.Outside] || 0;
    const aOnly = +counts[REGION_IDS.OnlyA] || 0;
    const bOnly = +counts[REGION_IDS.OnlyB] || 0;
    const i = +counts[REGION_IDS.Intersection] || 0;
    const A = aOnly + i;
    const B = bOnly + i;
    const union = aOnly + bOnly + i;
    const universe = union + o;
    return { A, B, union, universe };
  }, [counts]);

  // Notify parent whenever counts change.
  const emit = (nextCounts) => {
    if (onCountsChange) onCountsChange(nextCounts, {
      A: (+nextCounts[REGION_IDS.OnlyA] || 0) + (+nextCounts[REGION_IDS.Intersection] || 0),
      B: (+nextCounts[REGION_IDS.OnlyB] || 0) + (+nextCounts[REGION_IDS.Intersection] || 0),
      union: (+nextCounts[REGION_IDS.OnlyA] || 0) + (+nextCounts[REGION_IDS.OnlyB] || 0) + (+nextCounts[REGION_IDS.Intersection] || 0),
      universe: (+nextCounts[REGION_IDS.OnlyA] || 0) + (+nextCounts[REGION_IDS.OnlyB] || 0) + (+nextCounts[REGION_IDS.Intersection] || 0) + (+nextCounts[REGION_IDS.Outside] || 0),
    });
  };

  const handleInputChange = (regionId, value) => {
    // Allow empty string while editing; convert on blur.
    const numeric = value === "" ? "" : Math.max(0, parseInt(value, 10) || 0);
    setCounts((prev) => {
      const next = { ...prev, [regionId]: numeric };
      emit(next);
      return next;
    });
  };

  const handleInputBlur = (regionId) => {
    setCounts((prev) => {
      const v = +prev[regionId] || 0;
      const next = { ...prev, [regionId]: v };
      emit(next);
      return next;
    });
  };

  const handleSelect = (regionId) => {
    setSelectedRegion(regionId);
    const ref = inputRefs[regionId];
    ref?.current?.focus();
  };

  // Region label placeholders -------------------------------------------
  const placeholders = {
    [REGION_IDS.Outside]: "(A∪B)'",
    [REGION_IDS.OnlyA]: "A only",
    [REGION_IDS.OnlyB]: "B only",
    [REGION_IDS.Intersection]: "A∩B",
  };

  // Stroke toggle -------------------------------------------------------
  const strokeProps = showRegionOutlines
    ? {}
    : { stroke: "transparent", strokeWidth: 0 };

  // ------------------------------------------------------------------ UI
  return (
    <div className={"mx-auto relative inline-block select-none " + className} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
      >
        {shapes.map((s) => (
          <VennRegion
            key={s.id}
            regionId={s.id}
            d={s.d}
            width={s.width}
            height={s.height}
            selected={selectedRegion === s.id}
            onSelect={handleSelect}
            {...strokeProps}
          />
        ))}
      </svg>

      {Object.entries(positions).map(([rid, pos]) => (
        <input
          key={rid}
          ref={inputRefs[rid]}
          type="number"
          min={0}
          inputMode="numeric"
          value={counts[rid]}
          placeholder={placeholders[rid]}
          onChange={(e) => handleInputChange(rid, e.target.value)}
          onBlur={() => handleInputBlur(rid)}
          onFocus={() => setSelectedRegion(rid)}
          className={[
            "absolute -translate-x-1/2 -translate-y-1/2 w-16 px-1 py-0.5 text-center text-sm border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
            inputClassName,
          ].join(" ")}
          style={{ left: pos.left, top: pos.top }}
        />
      ))}

      {/*showTotals && (
        <div className="mt-2 w-full text-xs text-gray-700 font-medium flex flex-col gap-1">
          <TotalsTable derived={derived} />
        </div>
      )*/}
    </div>
  );
}

// ----------------------------------------------------------------------
// Totals mini-table
function TotalsTable({ derived }) {
  const { A, B, union, universe } = derived;
  return (
    <div className="grid grid-cols-4 gap-1 w-full max-w-xs mx-auto text-center">
      <div className="p-1 bg-gray-100 rounded">A: {A}</div>
      <div className="p-1 bg-gray-100 rounded">B: {B}</div>
      <div className="p-1 bg-gray-100 rounded">A∪B: {union}</div>
      <div className="p-1 bg-gray-100 rounded">U: {universe}</div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Convenience export of region list (optional)
export const TWO_SET_REGIONS = [
  REGION_IDS.Outside,
  REGION_IDS.OnlyA,
  REGION_IDS.OnlyB,
  REGION_IDS.Intersection,
];

// Example usage ---------------------------------------------------------
// <TwoSetVennCardinality
//   width={320}
//   height={200}
//   radius={70}
//   overlap={35}
//   initialCounts={{ [REGION_IDS.OnlyA]: 5, [REGION_IDS.Intersection]: 3 }}
//   onCountsChange={(counts, derived) => console.log(counts, derived)}
// />
