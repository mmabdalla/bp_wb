import React from 'react';
import { ComponentRenderer } from './ComponentRenderer';

interface PageConfig {
  components?: Array<{
    id?: string;
    type: string;
    properties?: Record<string, any>;
    children?: any[];
  }>;
  styles?: Record<string, any>;
}

interface LayoutEngineProps {
  pageConfig: PageConfig;
}

export const LayoutEngine: React.FC<LayoutEngineProps> = ({ pageConfig }) => {
  if (!pageConfig) {
    return (
      <div data-testid="layout-engine" className="layout-engine">
        <p>No page configuration provided</p>
      </div>
    );
  }

  const components = pageConfig.components || [];
  const styles = pageConfig.styles || {};

  return (
    <div
      data-testid="layout-engine"
      className="layout-engine"
      style={styles.container}
    >
      {components.length === 0 ? (
        <div className="empty-page">No components to display</div>
      ) : (
        components.map((comp, index) => (
          <ComponentRenderer key={comp.id || `comp-${index}`} config={comp} />
        ))
      )}
    </div>
  );
};

