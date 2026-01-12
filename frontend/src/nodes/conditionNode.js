// conditionNode.js

import { createNodeClass } from './baseNode';

export const ConditionNode = createNodeClass({
  headerText: 'Condition',
  initialState: (props) => ({
    operator: props.data?.operator || 'equals',
    compareValue: props.data?.compareValue || ''
  }),
  nodeStyle: {
    backgroundColor: 'var(--node-condition)',
    borderColor: 'var(--secondary-color)',
    // Removed fixed height to allow content to fit
  },
  handles: (props) => [
    {
      type: 'target',
      position: 'left',
      id: `${props.id}-input`
    },
    {
      type: 'source',
      position: 'right',
      id: `${props.id}-true`,
      style: { top: '35%' }
    },
    {
      type: 'source',
      position: 'right',
      id: `${props.id}-false`,
      style: { top: '75%' }
    }
  ],
  renderContent: function (props) {
    const handleOperatorChange = (e) => {
      this.setState({ operator: e.target.value });
    };

    const handleCompareValueChange = (e) => {
      this.setState({ compareValue: e.target.value });
    };

    const operators = [
      { value: 'equals', label: '==' },
      { value: 'notEquals', label: '!=' },
      { value: 'greaterThan', label: '>' },
      { value: 'lessThan', label: '<' },
      { value: 'greaterEqual', label: '>=' },
      { value: 'lessEqual', label: '<=' },
      { value: 'contains', label: 'contains' },
      { value: 'notContains', label: 'not contains' }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <div style={{ fontSize: '10px', color: '#666' }}>If input</div>
        <select
          value={this.state.operator}
          onChange={handleOperatorChange}
          style={{
            padding: '2px 6px',
            border: '1px solid #9c27b0',
            borderRadius: '3px',
            fontSize: '11px',
            backgroundColor: '#f8f5ff',
            width: '100%'
          }}
        >
          {operators.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Value"
          value={this.state.compareValue}
          onChange={handleCompareValueChange}
          style={{
            padding: '2px 4px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            fontSize: '11px',
            width: '100%',
            textAlign: 'center'
          }}
        />


      </div>
    );
  }
});