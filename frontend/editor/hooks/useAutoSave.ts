import { useEffect, useRef, useCallback } from 'react';

interface UseAutoSaveOptions {
  onSave: () => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

export const useAutoSave = ({
  onSave,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(0);

  const triggerSave = useCallback(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave();
        lastSaveRef.current = Date.now();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, debounceMs);
  }, [onSave, debounceMs, enabled]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { triggerSave, lastSaveTime: lastSaveRef.current };
};

