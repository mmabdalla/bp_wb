import React from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutEngine } from './LayoutEngine';

interface PageConfig {
  components?: Array<{
    id?: string;
    type: string;
    properties?: Record<string, any>;
    children?: any[];
  }>;
  styles?: Record<string, any>;
}

// Get page config from window
const pageConfig: PageConfig = (window as any).__PAGE_CONFIG__ || {
  components: [],
};

const root = document.getElementById('root');
if (root) {
  const reactRoot = createRoot(root);
  reactRoot.render(<LayoutEngine pageConfig={pageConfig} />);
}

