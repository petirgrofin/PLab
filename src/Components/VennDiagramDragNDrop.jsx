import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  pointerWithin,
} from "@dnd-kit/core";

import { useComponentContext } from "../lessons/ComponentContext";

import { REGION_IDS } from "../Constants/regions";
import { DRAG_AND_DROP_VENN_CONFIG } from "../Constants/vennConfig";
import { constructVennDiagram } from "../utils/vennUtils";
import { VennRegion } from "./VennRegion";

import 'katex/dist/katex.min.css';
import {InlineMath} from 'react-katex';

/* ---------------------------
   Utility for label positions
--------------------------- */
function getLabelCoords(config) {
  const { width, height, radius, overlap } = config;
  const cxA = width / 2 - overlap;
  const cxB = width / 2 + overlap;
  const cy = height / 2;

  return {
    [REGION_IDS.Outside]: { x: 30, y: 30 },
    [REGION_IDS.OnlyA]: { x: cxA - radius / 4 - 40, y: cy - 60},
    [REGION_IDS.OnlyB]: { x: cxB + radius / 4 - 20, y: cy - 60 },
    [REGION_IDS.Intersection]: { x: (cxA + cxB) / 2 - 25, y: cy - 50 },
  };
}

function getRegionColor(region_id){
  switch (region_id){
    case REGION_IDS.OnlyA:
      return "lightgreen"
    case REGION_IDS.Intersection:
      return "lightblue"
    case REGION_IDS.OnlyB:
      return "#FFD580"
    default:
      return "white"
  }
}

export function DraggableChipPool({id}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({id});

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.6 : 1,
    touchAction: 'none'
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="px-1 w-[50px] text-sm text-center bg-white cursor-grab active:cursor-grabbing select-none"
    >
      {id}
    </div>
  );
}

/* ---------------------------
   Region Drop Zone
--------------------------- */
function RegionDropZone({ shape, interactive, selected, onSelect, setHoveredRegion, fillColor }) {
  const { id, type, d, width, height } = shape;
  const { setNodeRef, isOver } = useDroppable({ id });
  const hoverSelected = selected || isOver;

  useEffect(() => {
    if (hoverSelected){
      setHoveredRegion(id)
    }
  })

  return (
    <g ref={setNodeRef}>
      <VennRegion
        regionId={id}
        d={d}
        fillColor={fillColor}
        width={width}
        height={height}
        selected={hoverSelected}
        interactive={interactive}
        onSelect={onSelect}
      />
    </g>
  );
}

function computeExerciseResponse(assignments) {
  const map = Object.fromEntries(Object.values(REGION_IDS).map((id) => [id, []]));
  for (const [name, regionId] of Object.entries(assignments)) {
    if (regionId && map[regionId]) {
      map[regionId].push(name);
    }
  }
  return map;
}

/* ---------------------------
   VennDiagramDragNDrop
--------------------------- */
export function VennDiagramDragNDrop({
  names = ["Lucas", "Carlos", "Mateo", "Felipe", "Luis"],
  config = DRAG_AND_DROP_VENN_CONFIG,
  selectedRegions,
  setSelectedRegions,
  interactive = false,
}) {

  const controlled = Array.isArray(selectedRegions) && typeof setSelectedRegions === "function";
  const [internalSel, setInternalSel] = useState([]);
  const sel = controlled ? selectedRegions : internalSel;
  const updateSel = controlled ? setSelectedRegions : setInternalSel;

  const { setExerciseResponse } = useComponentContext();

  const [hoveredRegion, setHoveredRegion] = useState(null);

  const [assignments, setAssignments] = useState(
    () => Object.fromEntries(names.map((n) => [n, null]))
  );

  const unplaced = names.filter((n) => assignments[n] == null);

  const shapes = useMemo(() => constructVennDiagram(config), [config]);

  const shapesOrdered = useMemo(() => {
    if (!hoveredRegion || hoveredRegion === REGION_IDS.Outside) return shapes;

    const outside = shapes.find((s) => s.id === REGION_IDS.Outside);
    const others = shapes.filter((s) => s.id !== REGION_IDS.Outside);

    const hovered = others.find((s) => s.id === hoveredRegion);
    const remaining = others.filter((s) => s.id !== hoveredRegion);

    return hovered ? [outside, hovered, ...remaining].filter(Boolean) : shapes;
  }, [shapes, hoveredRegion]);
  
  const labelCoords = useMemo(() => getLabelCoords(config), [config]);

    const regionNamesMap = useMemo(() => {
      const map = Object.fromEntries(
          Object.values(REGION_IDS).map((id) => [id, []])
      );
      for (const [name, regionId] of Object.entries(assignments)) {
          if (regionId && map[regionId]) {
          map[regionId].push(name);
          }
      }
      return map;
    }, [assignments]);

  const handleSelect = useCallback(
    (regionId) => {
      if (!interactive) return;
      updateSel(sel.includes(regionId) ? sel.filter((r) => r !== regionId) : [...sel, regionId]);
    },
    [interactive, sel, updateSel]
  );

  const [activeId, setActiveId] = useState(null);
  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({active, over}) => {

    setActiveId(null);

    const map = !over ? {...assignments, [active.id]: null} : {...assignments, [active.id]: over.id}

    setExerciseResponse({"vennDiagramDND": true, response: computeExerciseResponse(map)});
    setAssignments(map);

    console.log(computeExerciseResponse(map))

  };

  const { width, height } = config;

return (
  <DndContext
    collisionDetection={pointerWithin}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    onDragCancel={() => setActiveId(null)}
  >
    <div className="flex flex-col items-center justify-center">
      {/* Pool of unassigned names */}
      <div className="flex gap-2 justify-center mb-4">
          {unplaced.map((name) => (
            <DraggableChipPool key={name} id={name} />
          ))}
          {unplaced.length === 0 && (
              <div className="text-xs italic text-gray-500">No hay nombres sin asignar.</div>
          )}
      </div>

      <div className="flex justify-center items-center">
        <svg width={width} height={height} className="select-none">
          {shapesOrdered.map((shape) => (
            <g key={shape.id}>
              <RegionDropZone
                shape={shape}
                fillColor={getRegionColor(shape.id)}
                interactive={interactive}
                selected={sel.includes(shape.id)}
                onSelect={handleSelect}
                setHoveredRegion={setHoveredRegion}
              />
              {regionNamesMap[shape.id]?.map((name, index) => {
                const offset = index * 25;
                const pos = labelCoords[shape.id] || {x: 0, y: 0};
                return (
                <foreignObject key={name} x={pos.x} y={pos.y + offset} width={60} height={30}>
                  <DraggableChipPool id={name} />
                </foreignObject>
                );
              })}
            </g>
          ))}
        <foreignObject x={100} y={30} width={30} height={30}>
          <InlineMath math={"A"}/>
        </foreignObject>
        <foreignObject x={380} y={30} width={30} height={30}>
          <InlineMath math={"B"}/>
        </foreignObject>
        </svg>
      </div>
    </div>

  <DragOverlay>
    {activeId ? <DraggableChipPool id={activeId} /> : null}
  </DragOverlay>

  </DndContext>
);

}