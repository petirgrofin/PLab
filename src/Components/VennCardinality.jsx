import React, { useState, useMemo, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { REGION_IDS } from "../Constants/regions";
import { VennRegion } from "./VennRegion"; 
import { constructVennDiagram } from "../utils/vennUtils"; 
import { useComponentContext } from "../lessons/ComponentContext";
import { InlineMath } from "react-katex";

// ✅ Import shared responsive configs
import {
  DEFAULT_VENN_CONFIG,
  SMALL_VENN_CONFIG,
  EXTRA_SMALL_VENN_CONFIG,
} from "../Constants/vennConfig";

export function TwoSetVennCardinality({
  initialCounts = {},
  onCountsChange,
  showTotals = true,
  leftSet = "C",
  rightSet = "T",
  className = "",
  inputClassName = "",
  showRegionOutlines = true,
}) {
  // 🔎 Pick config responsively
  const isExtraSmall = useMediaQuery({ maxWidth: 480 });
  const isSmall = useMediaQuery({ minWidth: 481, maxWidth: 768 });

  const config = isExtraSmall
    ? EXTRA_SMALL_VENN_CONFIG
    : isSmall
    ? SMALL_VENN_CONFIG
    : DEFAULT_VENN_CONFIG;

  const { width, height, radius, overlap } = config;

  // ------------------------------------------------------------------
  // Build the geometry once for this config
  const shapes = useMemo(() => constructVennDiagram(config), [config]);

  // Precompute circle centers for positioning inputs
  const cxA = width / 2 - overlap;
  const cxB = width / 2 + overlap;
  const cy = height / 2;

  // Input positions (px, relative to wrapper)
  const positions = useMemo(
    () => ({
      [REGION_IDS.Outside]: { left: 48, top: 28 }, // 🔧 may tweak per config if needed
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

  const { setExerciseResponse } = useComponentContext();

  // Refs for focusing inputs
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

  // Emit to parent
  const emit = (nextCounts) => {
    if (onCountsChange)
      onCountsChange(nextCounts, {
        A: (+nextCounts[REGION_IDS.OnlyA] || 0) + (+nextCounts[REGION_IDS.Intersection] || 0),
        B: (+nextCounts[REGION_IDS.OnlyB] || 0) + (+nextCounts[REGION_IDS.Intersection] || 0),
        union:
          (+nextCounts[REGION_IDS.OnlyA] || 0) +
          (+nextCounts[REGION_IDS.OnlyB] || 0) +
          (+nextCounts[REGION_IDS.Intersection] || 0),
        universe:
          (+nextCounts[REGION_IDS.OnlyA] || 0) +
          (+nextCounts[REGION_IDS.OnlyB] || 0) +
          (+nextCounts[REGION_IDS.Intersection] || 0) +
          (+nextCounts[REGION_IDS.Outside] || 0),
      });
  };

  const handleInputChange = (regionId, value) => {
    const numeric = value === "" ? "" : Math.max(0, parseInt(value, 10) || 0);
    const next = { ...counts, [regionId]: numeric };
    emit(next);
    setCounts(next);
    setExerciseResponse({ vennCardinality: true, response: next });
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

  const placeholders = {
    [REGION_IDS.Outside]: "Exterior'",
    [REGION_IDS.OnlyA]: "Solo C",
    [REGION_IDS.OnlyB]: "Solo T",
    [REGION_IDS.Intersection]: "Intersección",
  };

  const strokeProps = showRegionOutlines
    ? {}
    : { stroke: "transparent", strokeWidth: 0 };

  return (
    <div
      className={"mx-auto relative inline-block select-none " + className}
      style={{ width, height }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
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
        <foreignObject x={
                        config === DEFAULT_VENN_CONFIG
                          ? 100
                          : config === SMALL_VENN_CONFIG
                          ? 60
                          : 60 // extra small label position
                      } y={50} width={30} height={30}>
          <InlineMath math={leftSet} />
        </foreignObject>
        <foreignObject x={config === DEFAULT_VENN_CONFIG
                          ? 385
                          : config === SMALL_VENN_CONFIG
                          ? 330
                          : 230} y={50} width={30} height={30}>
          <InlineMath math={rightSet} />
        </foreignObject>
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
            "absolute -translate-x-1/2 -translate-y-1/2 w-12 sm:w-16 px-1 py-0.5 text-center text-sm border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
            inputClassName,
          ].join(" ")}
          style={{ left: pos.left, top: pos.top }}
        />
      ))}
    </div>
  );
}
