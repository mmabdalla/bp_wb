import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { LayoutEngine } from './LayoutEngine';

describe('LayoutEngine', () => {
  it('should parse and render page config', () => {
    const pageConfig = {
      components: [
        {
          type: 'Button',
          properties: { text: 'Test Button' },
        },
      ],
    };
    render(<LayoutEngine pageConfig={pageConfig} />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should handle empty page config', () => {
    const pageConfig = { components: [] };
    render(<LayoutEngine pageConfig={pageConfig} />);
    expect(screen.getByTestId('layout-engine')).toBeInTheDocument();
  });
});

