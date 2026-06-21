'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  errorMessage: string
}

export class PreviewErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : 'Unknown render error',
    }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('PreviewErrorBoundary caught:', error.message, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '48px 24px',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '13px',
            textAlign: 'center',
            fontFamily: "'Inter', system-ui, sans-serif",
            background: 'rgba(239,68,68,0.04)',
            borderRadius: '12px',
            border: '1px solid rgba(239,68,68,0.12)',
            minHeight: '200px',
          }}
        >
          <span style={{ fontSize: '28px' }}>⚡</span>
          <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
            Preview failed to render
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', maxWidth: '320px' }}>
            Something in the funnel draft broke the preview. Keep chatting to rebuild — the next
            AI response will regenerate the blocks.
          </span>
          {this.state.errorMessage && (
            <code
              style={{
                marginTop: '4px',
                fontSize: '10px',
                color: 'rgba(239,68,68,0.5)',
                background: 'rgba(0,0,0,0.3)',
                padding: '4px 8px',
                borderRadius: '4px',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {this.state.errorMessage}
            </code>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
