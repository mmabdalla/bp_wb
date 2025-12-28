import React, { ErrorInfo } from 'react';
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

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="component-error" data-testid="component-error">
          <p>Error rendering component</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre>{this.state.error.message}</pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
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
  if (!config || !config.type) {
    return (
      <div className="component-error" data-testid="component-error">
        Invalid component config
      </div>
    );
  }

  const Component = componentMap[config.type];

  if (!Component) {
    return (
      <div className="component-error" data-testid="component-error">
        Unknown component: {config.type}
      </div>
    );
  }

  const props = config.properties || {};
  const children = config.children?.map((child, index) => (
    <ComponentErrorBoundary key={child.id || `child-${index}`}>
      <ComponentRenderer config={child} />
    </ComponentErrorBoundary>
  ));

  return (
    <ComponentErrorBoundary>
      <Component {...props}>{children}</Component>
    </ComponentErrorBoundary>
  );
};

