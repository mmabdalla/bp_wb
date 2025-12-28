import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useAutoSave } from './useAutoSave';

describe('useAutoSave hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should debounce save calls', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useAutoSave({ onSave, debounceMs: 1000 })
    );

    result.current.triggerSave();
    result.current.triggerSave();
    result.current.triggerSave();

    expect(onSave).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });

  it('should not save when disabled', () => {
    const onSave = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useAutoSave({ onSave, enabled: false })
    );

    result.current.triggerSave();

    jest.advanceTimersByTime(2000);

    expect(onSave).not.toHaveBeenCalled();
  });

  it('should track last save time', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useAutoSave({ onSave }));

    result.current.triggerSave();
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(result.current.lastSaveTime).toBeGreaterThan(0);
    });
  });
});

