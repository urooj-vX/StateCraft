import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Element } from '../types';

interface Props {
  element: Element;
  isOverlay?: boolean;
  dragId?: string;
}

export function ElementCard({ element, isOverlay, dragId }: Props) {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: dragId || `sidebar-${element.id}`,
    data: {
      type: dragId?.startsWith('canvas') ? 'canvas-element' : 'sidebar-element',
      element,
      id: dragId,
    },
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: dragId || `sidebar-drop-${element.id}`,
    disabled: !dragId || isOverlay, // Only valid for canvas items, not overlay/sidebar
    data: {
        type: 'element-target',
        id: dragId
    }
  });

  // Merge refs
  const setNodeRef = (node: HTMLElement | null) => {
      setDragRef(node);
      if (dragId && !isOverlay) {
          setDropRef(node);
      }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        relative select-none cursor-pointer active:cursor-grabbing
        inline-flex items-center gap-2 px-4 py-2 
        bg-white dark:bg-slate-800
        border border-slate-300 dark:border-slate-600
        shadow-[2px_2px_0px_rgba(0,0,0,0.1)]
        hover:bg-slate-50 dark:hover:bg-slate-700
        transition-all duration-75
        text-slate-900 dark:text-slate-100 font-medium text-base rounded
        whitespace-nowrap
        ${isDragging ? 'opacity-0' : 'opacity-100'}
        ${isOverlay ? 'scale-105 z-50 cursor-grabbing shadow-lg' : ''}
        ${element.isNew ? 'ring-2 ring-yellow-400' : ''}
      `}
    >
      <span className="text-2xl leading-none">{element.emoji}</span>
      <span className="leading-none pt-0.5">{element.name}</span>
    </div>
  );
}
