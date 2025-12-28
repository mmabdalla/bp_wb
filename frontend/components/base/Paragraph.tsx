import React from 'react';

export interface ParagraphProps {
  text?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({ text = 'Paragraph' }) => {
  return <p>{text}</p>;
};

