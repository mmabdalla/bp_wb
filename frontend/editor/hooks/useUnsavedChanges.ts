import { useEffect, useRef } from 'react';

interface UseUnsavedChangesOptions {
  hasChanges: boolean;
  onBeforeUnload?: () => boolean;
}

export const useUnsavedChanges = ({
  hasChanges,
  onBeforeUnload,
}: UseUnsavedChangesOptions) => {
  const hasChangesRef = useRef(hasChanges);

  useEffect(() => {
    hasChangesRef.current = hasChanges;
  }, [hasChanges]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChangesRef.current) {
        if (onBeforeUnload) {
          const shouldWarn = onBeforeUnload();
          if (!shouldWarn) return;
        }
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [onBeforeUnload]);

  return { hasUnsavedChanges: hasChanges };
};

