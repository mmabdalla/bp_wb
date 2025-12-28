import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useUnsavedChanges } from './useUnsavedChanges';

describe('useUnsavedChanges hook', () => {
  let beforeUnloadEvent: BeforeUnloadEvent;

  beforeEach(() => {
    beforeUnloadEvent = new Event('beforeunload') as BeforeUnloadEvent;
    Object.defineProperty(beforeUnloadEvent, 'preventDefault', {
      value: jest.fn(),
    });
    Object.defineProperty(beforeUnloadEvent, 'returnValue', {
      writable: true,
      value: '',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should warn when there are unsaved changes', () => {
    const { result } = renderHook(() =>
      useUnsavedChanges({ hasChanges: true })
    );

    expect(result.current.hasUnsavedChanges).toBe(true);

    window.dispatchEvent(beforeUnloadEvent);

    expect(beforeUnloadEvent.preventDefault).toHaveBeenCalled();
    expect(beforeUnloadEvent.returnValue).toBe('');
  });

  it('should not warn when there are no changes', () => {
    const { result } = renderHook(() =>
      useUnsavedChanges({ hasChanges: false })
    );

    expect(result.current.hasUnsavedChanges).toBe(false);

    window.dispatchEvent(beforeUnloadEvent);

    expect(beforeUnloadEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should respect onBeforeUnload callback', () => {
    const onBeforeUnload = jest.fn().mockReturnValue(false);

    const { result } = renderHook(() =>
      useUnsavedChanges({ hasChanges: true, onBeforeUnload })
    );

    window.dispatchEvent(beforeUnloadEvent);

    expect(onBeforeUnload).toHaveBeenCalled();
    expect(beforeUnloadEvent.preventDefault).not.toHaveBeenCalled();
  });
});

