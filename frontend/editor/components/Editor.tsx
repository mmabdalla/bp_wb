import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toolbar } from './Toolbar';
import { ComponentPalette } from './ComponentPalette';
import { PropertyPanel } from './PropertyPanel';
import { Canvas } from './Canvas';
import { NotificationToast } from './NotificationToast';
import { DragItem } from '../hooks/useDragDrop';
import { usePageStorage } from '../hooks/usePageStorage';
import { useAutoSave } from '../hooks/useAutoSave';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { useNotifications } from '../hooks/useNotifications';
import './Editor.css';

interface EditorProps {
  pageId?: string;
}

export const Editor: React.FC<EditorProps> = ({ pageId }) => {
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [canvasComponents, setCanvasComponents] = useState<any[]>([]);
  const [initialComponents, setInitialComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  const { savePage, loadPage, isLoading: storageLoading } = usePageStorage();
  const notifications = useNotifications();

  // Track if there are unsaved changes
  const hasUnsavedChanges =
    JSON.stringify(canvasComponents) !== JSON.stringify(initialComponents);

  // Auto-save functionality
  const { triggerSave } = useAutoSave({
    onSave: async () => {
      if (!pageId || !hasUnsavedChanges) return;
      await handleSave(false); // false = don't show notification for auto-save
    },
    debounceMs: 2000,
    enabled: !!pageId && hasUnsavedChanges,
  });

  // Unsaved changes warning
  useUnsavedChanges({
    hasChanges: hasUnsavedChanges,
    onBeforeUnload: () => {
      if (hasUnsavedChanges) {
        return window.confirm(
          'You have unsaved changes. Are you sure you want to leave?'
        );
      }
      return false;
    },
  });

  // Load page on mount
  useEffect(() => {
    if (pageId && !hasLoadedRef.current) {
      setIsLoading(true);
      loadPage(pageId)
        .then((config) => {
          if (config?.components) {
            setCanvasComponents(config.components);
            setInitialComponents(config.components);
            hasLoadedRef.current = true;
          }
        })
        .catch((error) => {
          notifications.error(`Failed to load page: ${error.message}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [pageId, loadPage, notifications]);

  // Trigger auto-save when components change
  useEffect(() => {
    if (hasLoadedRef.current && hasUnsavedChanges) {
      triggerSave();
    }
  }, [canvasComponents, triggerSave, hasUnsavedChanges]);

  const handleSave = async (showNotification = true) => {
    if (!pageId) {
      notifications.warning('No page ID provided');
      return;
    }

    try {
      setIsLoading(true);
      await savePage(pageId, { components: canvasComponents });
      setInitialComponents(canvasComponents);
      if (showNotification) {
        notifications.success('Page saved successfully');
      }
    } catch (error: any) {
      notifications.error(`Failed to save page: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (!pageId) {
      notifications.warning('No page ID provided');
      return;
    }
    window.open(`/preview/${pageId}`, '_blank');
  };

  const handleExit = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to exit?'
      );
      if (!confirmed) return;
    }
    window.location.href = '/';
  };

  const handleComponentSelect = (componentType: string) => {
    // Component selection (not drag-drop)
  };

  const handleComponentDrop = (item: DragItem) => {
    const newComponent = {
      id: `comp-${Date.now()}`,
      type: item.type,
      properties: {},
    };
    setCanvasComponents((prev) => [...prev, newComponent]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div data-testid="editor-container" className="editor-container">
        <Toolbar
          onSave={() => handleSave(true)}
          onPreview={handlePreview}
          onExit={handleExit}
          isLoading={isLoading || storageLoading}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        <div className="editor-content">
          <div data-testid="left-sidebar" className="sidebar left">
            <ComponentPalette onComponentSelect={handleComponentSelect} />
          </div>
          <div data-testid="canvas-container" className="canvas-container">
            <Canvas
              components={canvasComponents}
              onComponentDrop={handleComponentDrop}
            />
          </div>
          <div data-testid="right-sidebar" className="sidebar right">
            <PropertyPanel selectedComponent={selectedComponent} />
          </div>
        </div>
        <div className="notifications-container" data-testid="notifications">
          {notifications.notifications.map((notif) => (
            <NotificationToast
              key={notif.id}
              notification={notif}
              onClose={() => notifications.removeNotification(notif.id)}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

