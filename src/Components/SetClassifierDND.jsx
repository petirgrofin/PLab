// SetClassifierDndKit.jsx
// Requires: npm i @dnd-kit/core @dnd-kit/utilities

import React, { useState, useMemo } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const initialItems = {
  amethyst8:   { id: 'amethyst8', label: 'Amethyst crystal (8g)', mass: 8,  crystalline: true,  container: null },
  quartz5:     { id: 'quartz5',   label: 'Quartz crystal (5g)',   mass: 5,  crystalline: true,  container: null },
  topaz7:      { id: 'topaz7',    label: 'Topaz crystal (7g)',    mass: 7,  crystalline: true,  container: null },
  beryl12:     { id: 'beryl12',   label: 'Beryl crystal (12g)',   mass: 12, crystalline: true,  container: null },
  ruby14:      { id: 'ruby14',    label: 'Ruby crystal (14g)',    mass: 14, crystalline: true,  container: null },
  clayPebble:  { id: 'clayPebble',label: 'Clay pebble (non crystaline, 3g)', mass: 3, crystalline: false, container: null },
};

const containers = [
  { id: 'ge10', label: '≥ 10 grams' },
  { id: 'le10', label: '≤ 10 grams' },
  { id: 'nonCrystal', label: 'non crystaline objects' },
];

function DraggableItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({ id: item.id });
  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
  };
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`px-2 py-1 bg-white border border-gray-300 rounded shadow cursor-grab select-none text-sm ${isDragging ? 'opacity-60' : ''}`}
    >
      {item.label}
    </button>
  );
}

function DroppableContainer({ container, children }) {
  const { isOver, setNodeRef } = useDroppable({ id: container.id });
  return (
    <div
      ref={setNodeRef}
      className={`w-56 min-h-[160px] p-2 border-2 rounded transition-colors ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-indigo-50'}`}
    >
      <div className="font-bold mb-1 text-sm">{container.label}</div>
      <div className="flex flex-col gap-1 min-h-[110px]">{children}</div>
    </div>
  );
}

export default function SetClassifierDndKit() {
  const [items, setItems] = useState(initialItems);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const itemsByContainer = useMemo(() => {
    const map = {};
    containers.forEach(c => { map[c.id] = []; });
    Object.values(items).forEach(it => {
      if (it.container && map[it.container]) map[it.container].push(it);
    });
    return map;
  }, [items]);

  const activeItem = activeId ? items[activeId] : null;

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const overId = over.id;
    if (!containers.find(c => c.id === overId)) return;
    setItems(prev => ({ ...prev, [active.id]: { ...prev[active.id], container: overId } }));
  }

  const unclassified = Object.values(items).filter(it => !it.container);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Unclassified Objects</h3>
        <div className="flex flex-wrap gap-2 p-2 border-2 border-dashed rounded bg-gray-50">
          {unclassified.map(it => (<DraggableItem key={it.id} item={it} />))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {containers.map(c => (
          <DroppableContainer key={c.id} container={c}>
            {itemsByContainer[c.id].map(it => (<DraggableItem key={it.id} item={it} />))}
          </DroppableContainer>
        ))}
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="px-2 py-1 bg-yellow-50 border border-yellow-400 rounded shadow text-sm">
            {activeItem.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
