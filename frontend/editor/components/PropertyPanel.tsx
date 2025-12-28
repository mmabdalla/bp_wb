import React from 'react';
import { PropertyEditors } from './PropertyEditors';

interface PropertyPanelProps {
  selectedComponent?: {
    id: string;
    type: string;
    properties: Record<string, any>;
  };
  onPropertyChange?: (id: string, key: string, value: any) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onPropertyChange,
}) => {
  if (!selectedComponent) {
    return (
      <div data-testid="property-panel" className="property-panel">
        <p>No component selected</p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    onPropertyChange?.(selectedComponent.id, key, value);
  };

  return (
    <div data-testid="property-panel" className="property-panel">
      <h3>Properties: {selectedComponent.type}</h3>
      <PropertyEditors
        properties={selectedComponent.properties}
        onChange={handleChange}
      />
    </div>
  );
};

