import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { PropertyPanel } from './PropertyPanel';

describe('PropertyPanel', () => {
  it('should render property panel', () => {
    render(<PropertyPanel />);
    expect(screen.getByTestId('property-panel')).toBeInTheDocument();
  });

  it('should show "No component selected" when no component is selected', () => {
    render(<PropertyPanel />);
    expect(screen.getByText('No component selected')).toBeInTheDocument();
  });

  it('should display component properties when component is selected', () => {
    const selectedComponent = {
      id: 'comp-1',
      type: 'Button',
      properties: { text: 'Click me', variant: 'primary' },
    };
    render(<PropertyPanel selectedComponent={selectedComponent} />);
    expect(screen.getByText(/Properties: Button/i)).toBeInTheDocument();
    expect(screen.getByTestId('property-editors')).toBeInTheDocument();
  });
});

