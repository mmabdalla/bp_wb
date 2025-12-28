// WB-002: Basic Editor UI Layout - Tests First (TDD)
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Editor } from './Editor';
import { TestWrapper } from './testUtils';

describe('Editor Component', () => {
  const renderEditor = () => {
    return render(
      <TestWrapper>
        <Editor />
      </TestWrapper>
    );
  };

  it('should render main editor container', () => {
    renderEditor();
    expect(screen.getByTestId('editor-container')).toBeInTheDocument();
  });

  it('should render top toolbar with save, preview, exit buttons', () => {
    renderEditor();
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
    expect(screen.getByTestId('preview-btn')).toBeInTheDocument();
    expect(screen.getByTestId('exit-btn')).toBeInTheDocument();
  });

  it('should render left sidebar for component palette', () => {
    renderEditor();
    expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();
  });

  it('should render right sidebar for property panel', () => {
    renderEditor();
    expect(screen.getByTestId('right-sidebar')).toBeInTheDocument();
  });

  it('should render center canvas area', () => {
    renderEditor();
    expect(screen.getByTestId('canvas-container')).toBeInTheDocument();
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('should render ComponentPalette in left sidebar', () => {
    renderEditor();
    expect(screen.getByTestId('component-palette')).toBeInTheDocument();
  });

  it('should render PropertyPanel in right sidebar', () => {
    renderEditor();
    expect(screen.getByTestId('property-panel')).toBeInTheDocument();
  });
});

