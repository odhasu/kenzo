'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class CanvasErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '14px',
          gap: '12px',
          padding: '48px 24px',
        }}>
          <span style={{ fontSize: '32px' }}>⚠</span>
          <span>Something went wrong rendering the canvas.</span>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {this.state.error && (
            <details style={{ marginTop: '8px', maxWidth: '500px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>
                Error details
              </summary>
              <pre style={{
                marginTop: '6px',
                padding: '10px',
                borderRadius: '6px',
                background: 'rgba(0,0,0,0.4)',
                color: '#ef4444',
                fontSize: '11px',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
              }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
