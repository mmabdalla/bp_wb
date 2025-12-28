import React from 'react';
import { ComponentRenderer } from './ComponentRenderer';

interface PageConfig {
  components?: Array<{
    id?: string;
    type: string;
    properties?: Record<string, any>;
    children?: any[];
  }>;
}

interface LayoutEngineProps {
  pageConfig: PageConfig;
}

export const LayoutEngine: React.FC<LayoutEngineProps> = ({ pageConfig }) => {
  const components = pageConfig.components || [];

  return (
    <div data-testid="layout-engine" className="layout-engine">
      {components.map((comp, index) => (
        <ComponentRenderer key={comp.id || index} config={comp} />
      ))}
    </div>
  );
};

