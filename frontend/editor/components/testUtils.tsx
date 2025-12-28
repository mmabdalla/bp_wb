import React from 'react';

// Mock DndProvider for tests - components don't need drag-drop in renderer tests
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

