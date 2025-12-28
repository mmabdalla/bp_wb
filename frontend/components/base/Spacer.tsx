import React from 'react';

export interface SpacerProps {
  height?: number;
  width?: number;
}

export const Spacer: React.FC<SpacerProps> = ({ height = 20, width = 0 }) => {
  return <div style={{ height, width, minHeight: height, minWidth: width }} />;
};

