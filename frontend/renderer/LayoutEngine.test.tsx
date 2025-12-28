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

  it('should handle missing components array', () => {
    const pageConfig = {};
    render(<LayoutEngine pageConfig={pageConfig} />);
    expect(screen.getByTestId('layout-engine')).toBeInTheDocument();
  });

  it('should render multiple root components', () => {
    const pageConfig = {
      components: [
        {
          type: 'Heading',
          properties: { text: 'Title', level: 1 },
        },
        {
          type: 'Paragraph',
          properties: { text: 'Description' },
        },
      ],
    };
    render(<LayoutEngine pageConfig={pageConfig} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should handle complex nested structure', () => {
    const pageConfig = {
      components: [
        {
          type: 'Section',
          children: [
            {
              type: 'Container',
              children: [
                {
                  type: 'Heading',
                  properties: { text: 'Section Title', level: 2 },
                },
                {
                  type: 'Button',
                  properties: { text: 'Action' },
                },
              ],
            },
          ],
        },
      ],
    };
    render(<LayoutEngine pageConfig={pageConfig} />);
    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

