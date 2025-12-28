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
});

