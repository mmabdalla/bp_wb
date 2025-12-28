import React from 'react';

export interface ContainerProps {
  children?: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div data-testid="container" className={`container ${className}`}>
      {children}
    </div>
  );
};

