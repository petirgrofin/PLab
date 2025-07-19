import React, { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';

const DraggableItem = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    width: 50,
    height: 50,
    backgroundColor: 'skyblue',
    borderRadius: 4,
    cursor: 'grab',
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      Drag Me
    </div>
  );
};

const DroppableCircle = ({ id, cx, cy, r, isOver }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <circle
      ref={setNodeRef}
      cx={cx}
      cy={cy}
      r={r}
      fill={isOver ? 'lightgreen' : 'lightgray'}
      stroke="black"
    />
  );
};

const DroppableRect = ({ id, x, y, width, height, isOver }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <rect
      ref={setNodeRef}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={isOver ? 'lightcoral' : 'lightgray'}
      stroke="black"
    />
  );
};

const DndSvgExample = () => {
  const [overId, setOverId] = useState(null);

  return (
    <div>
      <h2>Drag the box and drop it on SVG shapes!</h2>
      <DndContext
        onDragOver={({ over }) => setOverId(over?.id || null)}
        onDragEnd={({ over }) => {
          if (over) {
            alert(`Dropped on ${over.id}`);
          }
          setOverId(null);
        }}
      >
        <DraggableItem id="draggable-1" />

        <svg width="500" height="300" style={{ border: '1px solid black', marginTop: 20 }}>
          <DroppableCircle id="circle" cx={120} cy={150} r={50} isOver={overId === 'circle'} />
          <DroppableRect id="rectangle" x={250} y={100} width={100} height={100} isOver={overId === 'rectangle'} />
        </svg>
      </DndContext>
    </div>
  );
};

export default DndSvgExample;