import React from 'react';
import { useDraggableComponent } from '../hooks/useDragDrop';

interface ComponentPaletteProps {
  onComponentSelect?: (componentType: string) => void;
}

const DraggableComponentItem: React.FC<{
  componentType: string;
  icon?: string;
  label?: string;
  onSelect?: (type: string) => void;
}> = ({ componentType, icon, label, onSelect }) => {
  const { drag, isDragging } = useDraggableComponent(componentType);

  return (
    <div
      ref={drag}
      data-testid={`palette-item-${componentType.toLowerCase()}`}
      className={`palette-item ${isDragging ? 'dragging' : ''}`}
      onClick={() => onSelect?.(componentType)}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
    >
      {icon && <span className="palette-icon">{icon}</span>}
      <span className="palette-label">{label || componentType}</span>
    </div>
  );
};

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  onComponentSelect,
}) => {
  const components = [
    { type: 'Button', icon: '🔘', label: 'Button' },
    { type: 'Heading', icon: '📝', label: 'Heading' },
    { type: 'Paragraph', icon: '📄', label: 'Paragraph' },
    { type: 'Image', icon: '🖼️', label: 'Image' },
    { type: 'Container', icon: '📦', label: 'Container' },
    { type: 'Section', icon: '📑', label: 'Section' },
    { type: 'Row', icon: '↔️', label: 'Row' },
    { type: 'Column', icon: '↕️', label: 'Column' },
    { type: 'Divider', icon: '➖', label: 'Divider' },
    { type: 'Spacer', icon: '⬜', label: 'Spacer' },
  ];

  return (
    <div data-testid="component-palette" className="component-palette">
      <h3>Components</h3>
      <div className="component-list">
        {components.map((comp) => (
          <DraggableComponentItem
            key={comp.type}
            componentType={comp.type}
            icon={comp.icon}
            label={comp.label}
            onSelect={onComponentSelect}
          />
        ))}
      </div>
    </div>
  );
};

