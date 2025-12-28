import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyEditors } from './PropertyEditors';

describe('PropertyEditors', () => {
  it('should render property editors for text properties', () => {
    const props = { text: 'Hello' };
    const onChange = jest.fn();
    render(<PropertyEditors properties={props} onChange={onChange} />);
    const input = screen.getByDisplayValue('Hello');
    fireEvent.change(input, { target: { value: 'World' } });
    expect(onChange).toHaveBeenCalledWith('text', 'World');
  });

  it('should render number input for number properties', () => {
    const props = { width: 100 };
    const onChange = jest.fn();
    render(<PropertyEditors properties={props} onChange={onChange} />);
    const input = screen.getByDisplayValue('100');
    fireEvent.change(input, { target: { value: '200' } });
    expect(onChange).toHaveBeenCalledWith('width', 200);
  });

  it('should render checkbox for boolean properties', () => {
    const props = { disabled: false };
    const onChange = jest.fn();
    render(<PropertyEditors properties={props} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith('disabled', true);
  });
});

