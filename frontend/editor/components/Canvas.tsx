import React from 'react';
import { useDroppableCanvas, DragItem } from '../hooks/useDragDrop';

interface CanvasProps {
  components?: Array<{ id: string; type: string; [key: string]: any }>;
  onComponentDrop?: (item: DragItem) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  components = [],
  onComponentDrop,
}) => {
  const { drop, isOver } = useDroppableCanvas((item: DragItem) => {
    onComponentDrop?.(item);
  });

  return (
    <div
      ref={drop}
      data-testid="canvas"
      className={`canvas ${isOver ? 'drag-over' : ''}`}
      style={{
        backgroundColor: isOver ? '#f0f8ff' : '#ffffff',
        transition: 'background-color 0.2s',
      }}
    >
      {components.length === 0 ? (
        <div data-testid="canvas-empty" className="canvas-empty">
          Drop components here
        </div>
      ) : (
        <div data-testid="canvas-components">
          {components.map((comp) => (
            <div key={comp.id} data-testid={`canvas-component-${comp.id}`}>
              {comp.type}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

