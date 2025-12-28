import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ComponentRenderer } from './ComponentRenderer';
import { TestWrapper } from '../editor/components/testUtils';

describe('ComponentRenderer', () => {
  it('should render component from config', () => {
    const config = {
      type: 'Button',
      properties: { text: 'Click me' },
    };
    render(
      <TestWrapper>
        <ComponentRenderer config={config} />
      </TestWrapper>
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle nested components', () => {
    const config = {
      type: 'Container',
      children: [
        {
          type: 'Button',
          properties: { text: 'Button 1' },
        },
      ],
    };
    render(
      <TestWrapper>
        <ComponentRenderer config={config} />
      </TestWrapper>
    );
    expect(screen.getByText('Button 1')).toBeInTheDocument();
  });

  it('should apply basic styles', () => {
    const config = {
      type: 'Button',
      properties: { text: 'Test', variant: 'primary' },
    };
    render(
      <TestWrapper>
        <ComponentRenderer config={config} />
      </TestWrapper>
    );
    const button = screen.getByText('Test');
    expect(button).toHaveClass('btn', 'btn-primary');
  });

  it('should handle unknown component types gracefully', () => {
    const config = {
      type: 'UnknownComponent',
      properties: {},
    };
    render(
      <TestWrapper>
        <ComponentRenderer config={config} />
      </TestWrapper>
    );
    expect(screen.getByText(/Unknown component/i)).toBeInTheDocument();
  });

  it('should handle deeply nested components', () => {
    const config = {
      type: 'Container',
      children: [
        {
          type: 'Section',
          children: [
            {
              type: 'Row',
              children: [
                {
                  type: 'Column',
                  children: [
                    {
                      type: 'Button',
                      properties: { text: 'Nested Button' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    render(
      <TestWrapper>
        <ComponentRenderer config={config} />
      </TestWrapper>
    );
    expect(screen.getByText('Nested Button')).toBeInTheDocument();
  });

  it('should handle components without properties', () => {
    const config = {
      type: 'Spacer',
    };
    render(
      <TestWrapper>
        <ComponentRenderer config={config} />
      </TestWrapper>
    );
    expect(screen.getByTestId('spacer')).toBeInTheDocument();
  });

  it('should handle components with empty children array', () => {
    const config = {
      type: 'Container',
      children: [],
    };
    render(
      <TestWrapper>
        <ComponentRenderer config={config} />
      </TestWrapper>
    );
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });
});

