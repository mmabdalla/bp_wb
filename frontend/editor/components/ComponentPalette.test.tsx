import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentPalette } from './ComponentPalette';
import { TestWrapper } from './testUtils';

describe('ComponentPalette', () => {
  const renderPalette = (props = {}) => {
    return render(
      <TestWrapper>
        <ComponentPalette {...props} />
      </TestWrapper>
    );
  };

  it('should render component palette with all base components', () => {
    renderPalette();
    expect(screen.getByTestId('component-palette')).toBeInTheDocument();
    expect(screen.getByTestId('palette-item-button')).toBeInTheDocument();
    expect(screen.getByTestId('palette-item-heading')).toBeInTheDocument();
    expect(screen.getByTestId('palette-item-paragraph')).toBeInTheDocument();
  });

  it('should call onComponentSelect when component is clicked', () => {
    const onSelect = jest.fn();
    renderPalette({ onComponentSelect: onSelect });
    fireEvent.click(screen.getByTestId('palette-item-button'));
    expect(onSelect).toHaveBeenCalledWith('Button');
  });
});

