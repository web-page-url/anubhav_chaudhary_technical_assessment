// mathNode.js

import { createNodeClass } from './baseNode';

export const MathNode = createNodeClass({
  headerText: 'Math',
  initialState: (props) => ({
    operation: props.data?.operation || 'add',
    operand1: props.data?.operand1 || 0,
    operand2: props.data?.operand2 || 0
  }),
  nodeStyle: {
    backgroundColor: 'var(--node-math)',
    borderColor: 'var(--primary-light)'
  },
  handles: (props) => [
    {
      type: 'target',
      position: 'left',
      id: `${props.id}-input1`,
      style: { top: '25%' }
    },
    {
      type: 'target',
      position: 'left',
      id: `${props.id}-input2`,
      style: { top: '75%' }
    },
    {
      type: 'source',
      position: 'right',
      id: `${props.id}-result`
    }
  ],
  renderContent: function (props) {
    const handleOperationChange = (e) => {
      this.setState({ operation: e.target.value });
    };

    const handleOperandChange = (key, e) => {
      this.setState({ [key]: e.target.value });
    };

    const adjustOperand = (key, amount) => {
      this.setState((prev) => {
        const val = parseFloat(prev[key]) || 0;
        return { [key]: val + amount };
      });
    };

    const operations = [
      { value: 'add', label: '+' },
      { value: 'subtract', label: '-' },
      { value: 'multiply', label: '×' },
      { value: 'divide', label: '÷' },
      { value: 'power', label: '^' }
    ];

    const buttonStyle = {
      padding: '4px 8px',
      cursor: 'pointer',
      backgroundColor: 'var(--bg-tertiary)',
      border: '1px solid var(--border-medium)',
      borderRadius: '4px',
      fontSize: '12px',
      color: 'var(--text-primary)',
      minWidth: '24px'
    };

    const inputStyle = {
      width: '60px',
      textAlign: 'center'
    };

    const renderInputRow = (label, key) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '60px' }}>{label}:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => adjustOperand(key, -1)} style={buttonStyle}>-</button>
          <input
            type="number"
            value={this.state[key]}
            onChange={(e) => handleOperandChange(key, e)}
            style={inputStyle}
            className="node-input-field"
          />
          <button onClick={() => adjustOperand(key, 1)} style={buttonStyle}>+</button>
        </div>
      </div>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Operation:</label>
          <select
            value={this.state.operation}
            onChange={handleOperationChange}
            className="node-input-field"
          >
            {operations.map(op => (
              <option key={op.value} value={op.value}>{op.label} ({op.value})</option>
            ))}
          </select>
        </div>

        {renderInputRow('Operand 1', 'operand1')}
        {renderInputRow('Operand 2', 'operand2')}

        <div style={{
          padding: '8px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '4px'
        }}>
          Result: <strong>
            {(() => {
              const a = parseFloat(this.state.operand1) || 0;
              const b = parseFloat(this.state.operand2) || 0;
              switch (this.state.operation) {
                case 'add': return a + b;
                case 'subtract': return a - b;
                case 'multiply': return a * b;
                case 'divide': return b !== 0 ? (a / b).toFixed(2) : 'Error';
                case 'power': return Math.pow(a, b);
                default: return 0;
              }
            })()}
          </strong>
        </div>
      </div>
    );
  }
});