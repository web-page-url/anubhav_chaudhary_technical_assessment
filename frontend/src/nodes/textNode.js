// textNode.js

import { createNodeClass, BaseNode } from './baseNode';

export const TextNode = createNodeClass({
  headerText: 'Text',
  initialState: (props) => ({
    currText: props.data?.text || '{{input}}',
    variables: []
  }),
  nodeStyle: {
    backgroundColor: 'var(--node-text)',
    borderColor: 'var(--border-medium)',
    minHeight: 120,
    width: 280
  },
  handles: function (props) {
    const handles = [
      {
        type: 'source',
        position: 'right',
        id: `${props.id}-output`
      }
    ];

    // Add variable handles on the left
    this.state.variables.forEach((variable, index) => {
      handles.push({
        type: 'target',
        position: 'left',
        id: `${props.id}-var-${variable}`,
        style: { top: `${(index + 1) * (100 / (this.state.variables.length + 1))}%` }
      });
    });

    return handles;
  },
  componentDidMount: function () {
    if (this.textareaRef) {
      this.textareaRef.style.height = 'auto';
      this.textareaRef.style.height = `${this.textareaRef.scrollHeight}px`;
    }
  },
  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.currText !== this.state.currText) {
      this.detectVariables();
      if (this.textareaRef) {
        this.textareaRef.style.height = 'auto';
        this.textareaRef.style.height = `${this.textareaRef.scrollHeight}px`;
      }
    }
  },
  detectVariables: function () {
    const variableRegex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
    const variables = [];
    let match;
    while ((match = variableRegex.exec(this.state.currText)) !== null) {
      const varName = match[1];
      if (!variables.includes(varName)) {
        variables.push(varName);
      }
    }
    this.setState({ variables });
  },
  getNodeStyle: function () {
    const baseStyle = BaseNode.prototype.getNodeStyle.call(this);
    const text = this.state.currText;

    // Estimate width based on characters, bounded
    const lines = text.split('\n');
    const longestLine = Math.max(...lines.map(l => l.length), 0);
    const dynamicWidth = Math.max(250, Math.min(600, 150 + longestLine * 8));

    return {
      ...baseStyle,
      width: dynamicWidth,
      // Remove fixed height to allow auto-expansion
      backgroundColor: 'var(--node-text)',
      borderColor: 'var(--border-medium)'
    };
  },
  renderContent: function (props) {
    const handleTextChange = (e) => {
      const newText = e.target.value;
      this.setState({ currText: newText });
      // Auto-resize
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
          width: '100%'
        }}>
          Text:
          <textarea
            ref={(el) => { this.textareaRef = el; }}
            value={this.state.currText}
            onChange={handleTextChange}
            placeholder="Enter your text here. Use {{variable}} syntax for dynamic inputs."
            style={{
              marginTop: 'var(--space-xs)',
              padding: 'var(--space-sm)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontFamily: 'inherit',
              resize: 'none',
              minHeight: '80px',
              width: '100%',
              lineHeight: 1.4,
              outline: 'none',
              transition: 'all 0.2s ease',
              overflow: 'hidden',
              backgroundColor: 'rgba(255, 255, 255, 0.4)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary-color)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-light)';
            }}
          />
        </label>

        {/* Variable indicators */}
        {this.state.variables.length > 0 && (
          <div style={{
            marginTop: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px'
          }}>
            {this.state.variables.map((variable) => (
              <span
                key={variable}
                style={{
                  fontSize: '10px',
                  color: 'var(--primary-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--primary-color)'
                }}
              >
                {variable}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
});
