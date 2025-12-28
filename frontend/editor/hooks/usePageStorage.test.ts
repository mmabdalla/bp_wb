import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { usePageStorage } from './usePageStorage';

describe('usePageStorage hook', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it('should save page config successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', page_config: { components: [] } }),
    });

    const { result } = renderHook(() => usePageStorage());

    await result.current.savePage('1', { components: [] });

    expect(global.fetch).toHaveBeenCalledWith('/api/pages/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_config: { components: [] } }),
    });
    expect(result.current.error).toBeNull();
  });

  it('should load page config successfully', async () => {
    const mockConfig = { components: [{ type: 'Button', properties: {} }] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', page_config: mockConfig }),
    });

    const { result } = renderHook(() => usePageStorage());

    const config = await result.current.loadPage('1');

    expect(global.fetch).toHaveBeenCalledWith('/api/pages/1');
    expect(config).toEqual(mockConfig);
    expect(result.current.error).toBeNull();
  });

  it('should return null when page not found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => usePageStorage());

    const config = await result.current.loadPage('999');

    expect(config).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle save errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => usePageStorage());

    await expect(
      result.current.savePage('1', { components: [] })
    ).rejects.toThrow('Network error');
    expect(result.current.error).toBe('Network error');
  });

  it('should handle load errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => usePageStorage());

    const config = await result.current.loadPage('1');

    expect(config).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('should set loading state during save', async () => {
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    (global.fetch as jest.Mock).mockReturnValueOnce(fetchPromise);

    const { result } = renderHook(() => usePageStorage());

    const savePromise = result.current.savePage('1', { components: [] });

    expect(result.current.isLoading).toBe(true);

    resolveFetch!({
      ok: true,
      json: async () => ({}),
    });

    await savePromise;

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should set loading state during load', async () => {
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    (global.fetch as jest.Mock).mockReturnValueOnce(fetchPromise);

    const { result } = renderHook(() => usePageStorage());

    const loadPromise = result.current.loadPage('1');

    expect(result.current.isLoading).toBe(true);

    resolveFetch!({
      ok: true,
      json: async () => ({ page_config: {} }),
    });

    await loadPromise;

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});

