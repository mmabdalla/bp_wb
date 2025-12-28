import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from './Toolbar';

describe('Toolbar Component', () => {
  it('should render toolbar with save, preview, exit buttons', () => {
    render(<Toolbar />);
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
    expect(screen.getByTestId('preview-btn')).toBeInTheDocument();
    expect(screen.getByTestId('exit-btn')).toBeInTheDocument();
  });

  it('should call onSave when save button is clicked', () => {
    const onSave = jest.fn();
    render(<Toolbar onSave={onSave} />);
    fireEvent.click(screen.getByTestId('save-btn'));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('should call onPreview when preview button is clicked', () => {
    const onPreview = jest.fn();
    render(<Toolbar onPreview={onPreview} />);
    fireEvent.click(screen.getByTestId('preview-btn'));
    expect(onPreview).toHaveBeenCalledTimes(1);
  });

  it('should call onExit when exit button is clicked', () => {
    const onExit = jest.fn();
    render(<Toolbar onExit={onExit} />);
    fireEvent.click(screen.getByTestId('exit-btn'));
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('should show loading indicator when isLoading is true', () => {
    render(<Toolbar isLoading={true} />);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should disable buttons when loading', () => {
    render(<Toolbar isLoading={true} />);
    expect(screen.getByTestId('save-btn')).toBeDisabled();
    expect(screen.getByTestId('preview-btn')).toBeDisabled();
    expect(screen.getByTestId('exit-btn')).toBeDisabled();
  });
});

