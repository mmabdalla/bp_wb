import React from 'react';

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export const Image: React.FC<ImageProps> = ({
  src = '',
  alt = 'Image',
  width,
  height,
}) => {
  return <img src={src} alt={alt} width={width} height={height} />;
};

