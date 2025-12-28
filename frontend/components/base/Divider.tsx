import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
}) => {
  return <hr className={`divider divider-${orientation}`} />;
};

