import { useState, useCallback } from 'react';

interface PageConfig {
  components?: any[];
}

interface UsePageStorageReturn {
  savePage: (pageId: string, config: PageConfig) => Promise<void>;
  loadPage: (pageId: string) => Promise<PageConfig | null>;
  isLoading: boolean;
  error: string | null;
}

export const usePageStorage = (): UsePageStorageReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePage = useCallback(async (pageId: string, config: PageConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_config: config }),
      });

      if (!response.ok) {
        throw new Error('Failed to save page');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPage = useCallback(async (pageId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pages/${pageId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to load page');
      }
      const data = await response.json();
      return data.page_config;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { savePage, loadPage, isLoading, error };
};

