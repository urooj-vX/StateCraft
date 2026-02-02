import { useDroppable } from '@dnd-kit/core';
import { useGameStore } from '../store/gameStore';
import { ElementCard } from './ElementCard';
import { ParticleBackground } from './ParticleBackground';

export function Canvas() {
  const { setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  const canvasItems = useGameStore((state) => state.canvasItems);
  const library = useGameStore((state) => state.library);
  const isGenerating = useGameStore((state) => state.isGenerating);

  return (
    <div 
      ref={setNodeRef}
      className="flex-1 h-full relative overflow-hidden bg-transparent cursor-crosshair"
    >
      <ParticleBackground />
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
           <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              <span className="text-sm font-bold text-blue-600 tracking-wider uppercase">Crafting...</span>
           </div>
        </div>
      )}

      {canvasItems.map((item) => {
        const element = library.find(e => e.id === item.elementId);
        if (!element) return null;

        return (
          <div
            key={item.id}
            className="absolute z-20"
            style={{
              left: item.x,
              top: item.y,
              transform: 'translate3d(-50%, -50%, 0)', 
            }}
          >
             <ElementCard 
               element={element} 
               dragId={`canvas-${item.id}`}
             />
          </div>
        );
      })}
      
      {canvasItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-slate-300">
           {/* Minimal logo or instruction if desired, but user screenshot has clean canvas */}
           <span className="text-xl font-medium tracking-wide">Canvas</span>
        </div>
      )}
    </div>
  );
}
