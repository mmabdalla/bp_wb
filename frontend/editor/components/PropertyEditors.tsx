import React from 'react';

interface PropertyEditorsProps {
  properties: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const PropertyEditors: React.FC<PropertyEditorsProps> = ({
  properties,
  onChange,
}) => {
  return (
    <div data-testid="property-editors" className="property-editors">
      {Object.entries(properties).map(([key, value]) => (
        <div key={key} className="property-editor">
          <label>{key}</label>
          {typeof value === 'boolean' ? (
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(key, e.target.checked)}
            />
          ) : typeof value === 'number' ? (
            <input
              type="number"
              value={value}
              onChange={(e) => onChange(key, Number(e.target.value))}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

