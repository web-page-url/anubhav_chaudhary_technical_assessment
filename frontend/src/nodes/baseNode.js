// baseNode.js - Base abstraction for all node types

import React from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export class BaseNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.initializeState();
  }

  // Override this method in subclasses to set initial state
  initializeState() {
    // Default empty state
  }

  // Override this method in subclasses to render node content
  renderContent() {
    return <div>Base Node Content</div>;
  }

  // Override this method in subclasses to define handles
  getHandles() {
    return [];
  }

  // Override this method in subclasses to customize styling
  getNodeStyle() {
    return {
      minWidth: 200,
      maxWidth: 600,
      minHeight: 80,
      height: 'auto',
      border: '2px solid var(--border-medium)',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: this.getNodeBackgroundColor(),
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-md)',
      transition: 'all 0.2s ease-in-out',
      position: 'relative'
    };
  }

  // Get node-specific background color - override in subclasses
  getNodeBackgroundColor() {
    return 'var(--bg-primary)';
  }

  // Override this method in subclasses to customize header
  getHeaderText() {
    return 'Node';
  }

  render() {
    const { id } = this.props;
    const nodeStyle = this.getNodeStyle();
    const handles = this.getHandles();

    return (
      <div style={nodeStyle}>
        <button
          onClick={() => useStore.getState().deleteNode(id)}
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: '1',
            color: 'var(--text-secondary, #666)',
            opacity: 0.5,
            padding: '4px',
            zIndex: 100,
            transition: 'all 0.2s',
            borderRadius: '50%'
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '1';
            e.target.style.color = '#ff4d4f';
            e.target.style.backgroundColor = 'rgba(255, 77, 79, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '0.5';
            e.target.style.color = 'var(--text-secondary, #666)';
            e.target.style.backgroundColor = 'transparent';
          }}
          title="Delete Node"
        >
          ✕
        </button>
        {handles.map(handle => (
          <Handle
            key={handle.id}
            type={handle.type}
            position={handle.position}
            id={handle.id}
            style={handle.style}
          />
        ))}
        <div style={{
          fontSize: 'var(--font-size-md)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--space-sm)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          {this.getHeaderText()}
        </div>
        <div style={{ width: '100%' }}>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

// Factory function to create node classes
export const createNodeClass = (config) => {
  return class extends BaseNode {
    constructor(props) {
      super(props);
      // Bind custom methods from config to the instance
      for (const [key, value] of Object.entries(config)) {
        if (typeof value === 'function' && !this[key]) {
          this[key] = value.bind(this);
        }
      }
    }

    initializeState() {
      if (config.initialState) {
        this.state = { ...config.initialState(this.props) };
      }
    }

    getHeaderText() {
      return config.headerText || 'Node';
    }

    getNodeStyle() {
      if (config.getNodeStyle) {
        return config.getNodeStyle.call(this);
      }
      return { ...super.getNodeStyle(), ...config.nodeStyle };
    }

    getHandles() {
      return config.handles ? config.handles.call(this, this.props) : [];
    }

    renderContent() {
      if (config.renderContent) {
        return config.renderContent.call(this, this.props);
      }
      return super.renderContent();
    }

    // Allow custom methods to be added
    componentDidMount() {
      if (config.componentDidMount) {
        config.componentDidMount.call(this);
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (config.componentDidUpdate) {
        config.componentDidUpdate.call(this, prevProps, prevState);
      }
    }
  };
};