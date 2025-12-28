import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toolbar } from './Toolbar';
import { ComponentPalette } from './ComponentPalette';
import { PropertyPanel } from './PropertyPanel';
import { Canvas } from './Canvas';
import { DragItem } from '../hooks/useDragDrop';
import { usePageStorage } from '../hooks/usePageStorage';
import './Editor.css';

interface EditorProps {
  pageId?: string;
}

export const Editor: React.FC<EditorProps> = ({ pageId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [canvasComponents, setCanvasComponents] = useState<any[]>([]);

  const { savePage, loadPage, isLoading: storageLoading } = usePageStorage();

  const handleSave = async () => {
    if (!pageId) return;
    try {
      await savePage(pageId, { components: canvasComponents });
      // Show success notification
    } catch (error) {
      // Show error notification
    }
  };

  React.useEffect(() => {
    if (pageId) {
      loadPage(pageId).then((config) => {
        if (config?.components) {
          setCanvasComponents(config.components);
        }
      });
    }
  }, [pageId, loadPage]);

  const handlePreview = () => {
    // TODO: Implement preview logic
  };

  const handleExit = () => {
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
          onSave={handleSave}
          onPreview={handlePreview}
          onExit={handleExit}
          isLoading={isLoading || storageLoading}
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
      </div>
    </DndProvider>
  );
};

