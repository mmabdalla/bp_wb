import React from 'react';

export interface ColumnProps {
  children?: React.ReactNode;
  className?: string;
  span?: number;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  className = '',
  span,
}) => {
  return (
    <div className={`column ${className}`} style={{ flex: span }}>
      {children}
    </div>
  );
};

