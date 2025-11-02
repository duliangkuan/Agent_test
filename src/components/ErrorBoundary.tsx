import { Component, ErrorInfo, ReactNode } from 'react'
import { Result, Button } from 'antd'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    // Print detailed info to console
    console.error('Error component stack:', errorInfo.componentStack)
    console.error('Error stack:', error.stack)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <Result
            status="500"
            title="500"
            subTitle={
              <div>
                <p>Sorry, something went wrong with the page.</p>
                {this.state.error && (
                  <details style={{ marginTop: '20px', textAlign: 'left', maxWidth: '800px', margin: '20px auto' }}>
                    <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>Error Details (Click to expand)</summary>
                    <pre style={{ 
                      background: '#f5f5f5', 
                      padding: '15px', 
                      borderRadius: '4px',
                      overflow: 'auto',
                      fontSize: '12px'
                    }}>
                      {this.state.error.toString()}
                      {this.state.error.stack && `\n\n${this.state.error.stack}`}
                    </pre>
                  </details>
                )}
                <p style={{ marginTop: '20px', color: '#999', fontSize: '14px' }}>
                  Please check the browser console (F12) for more information
                </p>
              </div>
            }
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
