import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useNotifications } from './useNotifications';

describe('useNotifications hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should show success notification', () => {
    const { result } = renderHook(() => useNotifications());

    result.current.success('Saved successfully');

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('success');
    expect(result.current.notifications[0].message).toBe('Saved successfully');
  });

  it('should show error notification', () => {
    const { result } = renderHook(() => useNotifications());

    result.current.error('Save failed');

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('error');
    expect(result.current.notifications[0].message).toBe('Save failed');
  });

  it('should auto-remove notification after duration', async () => {
    const { result } = renderHook(() => useNotifications());

    result.current.success('Test', 1000);

    expect(result.current.notifications).toHaveLength(1);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(result.current.notifications).toHaveLength(0);
    });
  });

  it('should remove notification manually', () => {
    const { result } = renderHook(() => useNotifications());

    const id = result.current.success('Test');

    expect(result.current.notifications).toHaveLength(1);

    result.current.removeNotification(id);

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should show multiple notifications', () => {
    const { result } = renderHook(() => useNotifications());

    result.current.success('Success 1');
    result.current.error('Error 1');
    result.current.info('Info 1');

    expect(result.current.notifications).toHaveLength(3);
  });
});

