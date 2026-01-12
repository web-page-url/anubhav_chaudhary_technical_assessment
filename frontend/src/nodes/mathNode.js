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

    const handleOperand1Change = (e) => {
      this.setState({ operand1: parseFloat(e.target.value) || 0 });
    };

    const handleOperand2Change = (e) => {
      this.setState({ operand2: parseFloat(e.target.value) || 0 });
    };

    const operations = [
      { value: 'add', label: '+' },
      { value: 'subtract', label: '-' },
      { value: 'multiply', label: '×' },
      { value: 'divide', label: '÷' },
      { value: 'power', label: '^' }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
        <select
          value={this.state.operation}
          onChange={handleOperationChange}
          style={{
            padding: '2px 4px',
            border: '1px solid #4caf50',
            borderRadius: '3px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#f1f8e9'
          }}
        >
          {operations.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <input
            type="number"
            value={this.state.operand1}
            onChange={handleOperand1Change}
            style={{
              width: '40px',
              padding: '2px 4px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              fontSize: '11px',
              textAlign: 'center'
            }}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>
            {operations.find(op => op.value === this.state.operation)?.label}
          </span>
          <input
            type="number"
            value={this.state.operand2}
            onChange={handleOperand2Change}
            style={{
              width: '40px',
              padding: '2px 4px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              fontSize: '11px',
              textAlign: 'center'
            }}
          />
        </div>
      </div>
    );
  }
});