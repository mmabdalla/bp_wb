import React from 'react';
import {
  Button,
  Heading,
  Paragraph,
  Image,
  Container,
  Section,
  Row,
  Column,
  Divider,
  Spacer,
} from '../components/base';

interface ComponentConfig {
  id?: string;
  type: string;
  properties?: Record<string, any>;
  children?: ComponentConfig[];
}

interface ComponentRendererProps {
  config: ComponentConfig;
}

const componentMap: Record<string, React.ComponentType<any>> = {
  Button,
  Heading,
  Paragraph,
  Image,
  Container,
  Section,
  Row,
  Column,
  Divider,
  Spacer,
};

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  config,
}) => {
  const Component = componentMap[config.type];

  if (!Component) {
    return <div>Unknown component: {config.type}</div>;
  }

  const props = config.properties || {};
  const children = config.children?.map((child, index) => (
    <ComponentRenderer key={child.id || index} config={child} />
  ));

  return <Component {...props}>{children}</Component>;
};

