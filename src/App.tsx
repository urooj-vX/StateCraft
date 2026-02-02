import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  DragStartEvent, 
  DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor,
  defaultDropAnimationSideEffects,
  pointerWithin // Optimized for mouse/pointer based DnD
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { Menu } from 'lucide-react';

import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { useGameStore } from './store/gameStore';
import { ElementCard } from './components/ElementCard';
import { MenuModal } from './components/MenuModal';
import { Element } from './types';
import { soundManager } from './lib/audio';

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

function App() {
  const [activeElement, setActiveElement] = useState<Element | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const addElementToCanvas = useGameStore((state) => state.addElementToCanvas);
  const updateCanvasItemPosition = useGameStore((state) => state.updateCanvasItemPosition);
  const combineElements = useGameStore((state) => state.combineElements);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    soundManager.playPop(); // Sound Effect
    const { active } = event;
    const element = active.data.current?.element as Element;
    if (element) {
        setActiveElement(element);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveElement(null);

    // Debugging
    console.log('Drag End:', { 
        activeId: active.id, 
        overId: over?.id, 
        type: active.data.current?.type 
    });

    if (!over) return;
    
    // Play snap sound on any valid drop interaction
    soundManager.playSnap(); // Sound Effect

    // Dropping on Canvas
    if (over.id === 'canvas-droppable') {
      const type = active.data.current?.type;
      const rect = active.rect.current.translated;
      if (!rect) return;

      if (type === 'sidebar-element') {
             addElementToCanvas(
              active.data.current?.element.id,
              rect.left + (rect.width / 2),
              rect.top + (rect.height / 2)
            );
      }
      
      if (type === 'canvas-element') {
        const id = active.data.current?.id; // dragId: canvas-{uuid}
        const uuid = id?.replace('canvas-', '');
         if (uuid) {
            updateCanvasItemPosition(
              uuid,
              rect.left + (rect.width / 2),
              rect.top + (rect.height / 2)
            );
         }
      }
    }
    // Dropping ONTO another element (Merging)
    else if (String(over.id).startsWith('canvas-')) {
        const targetId = String(over.id).replace('canvas-', '');
        const sourceId = active.data.current?.id?.replace('canvas-', '');
        const sourceType = active.data.current?.type;
        
        // Define rect again for this scope safely if needed, OR just use it if available
        // active.rect.current.translated is reliable.
        const rect = active.rect.current.translated;

        // Case 1: Dragging Sidebar Element -> Existing Canvas Element
        if (sourceType === 'sidebar-element' && rect) {
             // 1. Add item to canvas (store returns nothing, but generates ID internally usually)
             // 2. We need ID to merge.
             // Simplest approach: Add it, let user see it (stacked), they drag to merge.
             // Auto-merge requires complex async ID tracking.
             // Let's just ADD it ON TOP (using rect).
             addElementToCanvas(
                 active.data.current?.element.id,
                 rect.left + (rect.width / 2) + 10, // Slight offset to show overlap
                 rect.top + (rect.height / 2) + 10
             );
        }

        // Case 2: Dragging Canvas Element -> Canvas Element
        if (sourceType === 'canvas-element' && sourceId && sourceId !== targetId) {
            combineElements(sourceId, targetId);
        }
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={pointerWithin} // BETTER for small targets
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen w-full overflow-hidden font-sans bg-white dark:bg-slate-950 transition-colors duration-300">
        <Canvas />
        <Sidebar />
        
        {/* Menu Button Fixed Bottom Left */}
        <button
            onClick={() => setIsMenuOpen(true)}
            className="fixed bottom-4 left-4 z-40 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 font-medium"
        >
            <Menu className="w-4 h-4" />
            Menu
        </button>
      </div>

      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeElement ? (
            <ElementCard element={activeElement} isOverlay />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

export default App;
