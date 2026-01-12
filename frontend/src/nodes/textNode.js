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
  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.currText !== this.state.currText) {
      this.detectVariables();
    }
  },
  detectVariables: function () {
    // Matches valid JS variable names inside {{ }}
    // A valid JS variable name starts with a letter, $, or _, followed by letters, digits, $, or _
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

    // Dynamic height based on lines
    const lines = text.split('\n');
    const lineCount = lines.length;
    const longestLine = Math.max(...lines.map(l => l.length), 0);

    // Estimate height: base + (lines * line-height) + padding + footer
    const dynamicHeight = Math.max(120, 100 + lineCount * 22 + (this.state.variables.length > 0 ? 30 : 0));

    // Estimate width: base + (longest-line * char-width)
    const dynamicWidth = Math.max(250, Math.min(600, 150 + longestLine * 8));

    return {
      ...baseStyle,
      height: dynamicHeight,
      width: dynamicWidth,
      backgroundColor: 'var(--node-text)',
      borderColor: 'var(--border-medium)'
    };
  },
  renderContent: function (props) {
    const handleTextChange = (e) => {
      const newText = e.target.value;
      this.setState({ currText: newText }, () => {
        this.detectVariables();
      });
    };

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
          height: '100%'
        }}>
          Text:
          <textarea
            value={this.state.currText}
            onChange={handleTextChange}
            placeholder="Enter your text here. Use {{variable}} syntax for dynamic inputs."
            style={{
              marginTop: 'var(--space-xs)',
              padding: 'var(--space-sm)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontFamily: 'inherit',
              resize: 'none',
              height: 'calc(100% - 40px)',
              width: '100%',
              lineHeight: 1.4,
              outline: 'none',
              transition: 'border-color 0.2s ease'
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
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            right: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px'
          }}>
            {this.state.variables.map((variable, index) => (
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
