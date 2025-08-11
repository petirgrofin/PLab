import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { useComponentContext } from "../lessons/ComponentContext";

const REGION_IDS = ["region1", "region2", "region3", "region4"];

const POOL_COINS = [
  { id: "source-E", side: "E" },
  { id: "source-C", side: "C" },
];

function DraggableCoin({ id, side }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { side, from: id.startsWith("source-") ? "pool" : "slot" },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`w-12 h-12 select-none flex items-center justify-center rounded-full border-2 text-lg font-bold cursor-grab active:cursor-grabbing ${
        side === "E" ? "bg-yellow-100 border-yellow-400 text-yellow-700" : "bg-gray-100 border-gray-400 text-gray-700"
      }`}
    >
      {side}
    </div>
  );
}

function Slot({ regionId, slotIndex, coin }) {
  const droppableId = `${regionId}:${slotIndex}`;
  const { isOver, setNodeRef } = useDroppable({ id: droppableId, data: { regionId, slotIndex } });

  return (
    <div
      ref={setNodeRef}
      className={`w-12 h-12 flex items-center justify-center rounded border-2 ${
        isOver
          ? "border-blue-500 bg-blue-50"
          : coin
          ? "border-slate-400 bg-slate-50"
          : "border-dashed border-slate-300 bg-white"
      }`}
    >
      {coin ? <DraggableCoin id={`${regionId}-coin-${slotIndex}`} side={coin} /> : null}
    </div>
  );
}

function Region({ id, slots, onClear }) {
  return (
    <div className="p-4 border rounded-lg flex flex-col items-center gap-3 w-full max-w-[140px] bg-white shadow-sm">
      <div className="flex gap-2">
        <Slot regionId={id} slotIndex={0} coin={slots[0]} />
        <Slot regionId={id} slotIndex={1} coin={slots[1]} />
      </div>
      <button
        onClick={() => onClear(id)}
        className="text-[10px] px-2 py-0.5 rounded border border-slate-300 hover:bg-slate-100"
      >
        Limpiar
      </button>
    </div>
  );
}

export default function CoinSampleSpaceDnD() {
  const [regionSlots, setRegionSlots] = useState(() => {
    const obj = {};
    REGION_IDS.forEach((r) => (obj[r] = [null, null]));
    return obj;
  });

  const [activeSide, setActiveSide] = useState(null);
  const originRef = useRef(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const { setExerciseResponse } = useComponentContext();

  function handleDragStart(event) {
    const { active } = event;
    const side = active?.data?.current?.side;
    setActiveSide(side ?? null);

    if (active?.data?.current?.from === "slot") {
      const [regionId, , slotIdxStr] = active.id.split("-");
      originRef.current = { regionId, slotIndex: Number(slotIdxStr) };
    } else {
      originRef.current = null;
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    const side = active?.data?.current?.side;
    const from = active?.data?.current?.from;

    setActiveSide(null);
    if (!over || !side) {
      originRef.current = null;
      return;
    }

    const overRegionId = over?.data?.current?.regionId;
    const overSlotIndex = over?.data?.current?.slotIndex;
    if (overRegionId == null || overSlotIndex == null) {
      originRef.current = null;
      return;
    }

    setRegionSlots((prev) => {
      const next = { ...prev };
      if (from === "slot" && originRef.current) {
        const { regionId: oR, slotIndex: oI } = originRef.current;
        next[oR] = [...next[oR]];
        next[oR][oI] = null;
      }
      next[overRegionId] = [...next[overRegionId]];
      next[overRegionId][overSlotIndex] = side;
      return next;
    });

    originRef.current = null;
  }

  function clearRegion(id) {
    setRegionSlots((prev) => ({ ...prev, [id]: [null, null] }));
  }

  function clearAll() {
    const cleared = {};
    REGION_IDS.forEach((r) => (cleared[r] = [null, null]));
    setRegionSlots(cleared);
  }

  useEffect(() => {
    const isComplete = REGION_IDS.every((r) => regionSlots[r][0] && regionSlots[r][1]);
    if (!isComplete) return;

    const completedCombos = REGION_IDS.map((r) => regionSlots[r].join(""));
    setExerciseResponse({"coinSampleSpace": true, "response": completedCombos});
  }, [regionSlots, setExerciseResponse]);

  const completed = REGION_IDS.filter((r) => regionSlots[r][0] && regionSlots[r][1]).length;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 font-nunito">
        {/*<p className="text-center text-sm text-slate-600 max-w-prose">
          Drag <span className="font-bold">H</span> or <span className="font-bold">T</span> from the pool into each outcome card to build the sample space of two coin tosses.
        </p>*/}

        <div className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
          {POOL_COINS.map((c) => (
            <DraggableCoin key={c.id} id={c.id} side={c.side} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {REGION_IDS.map((id) => (
            <Region key={id} id={id} slots={regionSlots[id]} onClear={clearRegion} />
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span>
            Completados: {completed}/4
          </span>
          <button
            onClick={clearAll}
            className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-100 text-xs"
          >
            Reiniciar
          </button>
        </div>

        <DragOverlay>
          {activeSide ? (
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full border-2 text-lg font-bold ${
                activeSide === "E"
                  ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                  : "bg-gray-100 border-gray-400 text-gray-700"
              }`}
            >
              {activeSide}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
