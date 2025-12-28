import React from 'react';

export interface RowProps {
  children?: React.ReactNode;
  className?: string;
}

export const Row: React.FC<RowProps> = ({ children, className = '' }) => {
  return <div className={`row ${className}`}>{children}</div>;
};

