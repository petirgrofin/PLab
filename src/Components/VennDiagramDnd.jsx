import { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

const DraggableItem = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    width: 60,
    height: 60,
    backgroundColor: "skyblue",
    borderRadius: 6,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    position: "relative",
    top: 10,
    left: 10,
    cursor: "grab",
    zIndex: 10
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      Drag Me
    </div>
  );
};

const VennRegion = ({ id, d, fill, selectedRegion, overId, onClick }) => {
  const { setNodeRef } = useDroppable({ id });

  const isOver = overId === id;

  return (
    <path
      ref={setNodeRef}
      d={d}
      fill={fill}
      fillOpacity={selectedRegion === id ? 1 : isOver ? 0.75 : 0.5}
      stroke={"black"}
      // stroke={selectedRegion === id ? "black" : "none"}
      strokeWidth={selectedRegion === id ? 2 : 1}
      onClick={() => onClick(id)}
      style={{ cursor: "pointer" }}
    />
  );
};

const VennDiagramDnD = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [overId, setOverId] = useState(null);
  const [droppedOn, setDroppedOn] = useState(null);

  const width = 500;
  const height = 300;
  const radius = 100;
  const overlap = 60;

  const cxA = width / 2 - overlap;
  const cxB = width / 2 + overlap;
  const cy = height / 2;

  function makeLensShapes(cxA, cxB, cy, r) {
    const dx = cxB - cxA;
    const a = dx / 2;

    if (dx >= 2 * r) return { lens: "", left: "", right: "" };

    const h = Math.sqrt(r * r - a * a);
    const px = (cxA + cxB) / 2;
    const py = cy;

    const intersection1 = { x: px, y: py + h };
    const intersection2 = { x: px, y: py - h };

    const lensPath = `
      M ${intersection1.x} ${intersection1.y}
      A ${r} ${r} 0 0 1 ${intersection2.x} ${intersection2.y}
      A ${r} ${r} 0 0 1 ${intersection1.x} ${intersection1.y}
      Z
    `;

    const leftPath = `
      M ${intersection2.x} ${intersection2.y}
      A ${r} ${r} 0 1 0 ${intersection1.x} ${intersection1.y}
      A ${r} ${r} 0 0 1 ${intersection2.x} ${intersection2.y}
      Z
    `;

    const rightPath = `
      M ${intersection1.x} ${intersection1.y}
      A ${r} ${r} 0 1 0 ${intersection2.x} ${intersection2.y}
      A ${r} ${r} 0 0 1 ${intersection1.x} ${intersection1.y}
      Z
    `;

    return {
      lens: lensPath.trim(),
      left: leftPath.trim(),
      right: rightPath.trim()
    };
  }

  const { lens, left, right } = makeLensShapes(cxA, cxB, cy, radius);

  const shapes = [
    { id: "A", d: left, fill: "lightblue" },
    { id: "B", d: right, fill: "lightgreen" },
    { id: "AB", d: lens, fill: "orange" }
  ];

  const orderedShapes = selectedRegion
    ? [...shapes.filter(s => s.id !== selectedRegion), shapes.find(s => s.id === selectedRegion)]
    : shapes;

  return (
    <DndContext
      onDragOver={({ over }) => setOverId(over?.id || null)}
      onDragEnd={({ over }) => {
        if (over) {
          setDroppedOn(over.id);
          alert(`Dropped on region ${over.id}`);
        }
        setOverId(null);
      }}
    >
      <DraggableItem id="drag-1" />

      <svg width={width} height={height} style={{ border: "1px solid gray", marginTop: 80 }}>
        {orderedShapes.map(({ id, d, fill }) => (
          <VennRegion
            key={id}
            id={id}
            d={d}
            fill={fill}
            selectedRegion={selectedRegion}
            overId={overId}
            onClick={(clickedId) =>
              setSelectedRegion(clickedId === selectedRegion ? "" : clickedId)
            }
          />
        ))}
      </svg>

      <div style={{ marginTop: 20 }}>
        {droppedOn ? `Last drop: ${droppedOn}` : "Drop the box onto a region"}
      </div>
    </DndContext>
  );
};

export default VennDiagramDnD;
