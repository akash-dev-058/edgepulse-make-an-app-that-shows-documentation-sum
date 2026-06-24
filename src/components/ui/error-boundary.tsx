import { Component, ErrorInfo, ReactNode } from 'react';
import Button from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Something went wrong.</h2>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="bg-gray-100 p-4 rounded text-left text-sm overflow-x-auto mb-4">
              {this.state.error.message}
            </pre>
          )}
          <Button onClick={this.handleRetry}>Try again</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
