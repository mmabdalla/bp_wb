import { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export interface DragItem {
  type: string;
  id?: string;
}

export const useDraggableComponent = (componentType: string, onDragEnd?: () => void) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type: componentType } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      onDragEnd?.();
    },
  });

  return { drag, isDragging };
};

export const useDroppableCanvas = (onDrop: (item: DragItem) => void) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: DragItem) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return { drop, isOver };
};

