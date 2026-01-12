// filterNode.js

import { createNodeClass } from './baseNode';

export const FilterNode = createNodeClass({
  headerText: 'Filter',
  initialState: (props) => ({
    condition: props.data?.condition || 'contains',
    filterValue: props.data?.filterValue || ''
  }),
  nodeStyle: {
    backgroundColor: 'var(--node-filter)',
    borderColor: 'var(--accent-color)'
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
      id: `${props.id}-pass`,
      style: { top: '30%' }
    },
    {
      type: 'source',
      position: 'right',
      id: `${props.id}-fail`,
      style: { top: '70%' }
    }
  ],
  renderContent: function (props) {
    const handleConditionChange = (e) => {
      this.setState({ condition: e.target.value });
    };

    const handleFilterValueChange = (e) => {
      this.setState({ filterValue: e.target.value });
    };

    const conditions = [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'startsWith', label: 'Starts With' },
      { value: 'endsWith', label: 'Ends With' },
      { value: 'greaterThan', label: '>' },
      { value: 'lessThan', label: '<' }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <select
          value={this.state.condition}
          onChange={handleConditionChange}
          className="node-input-field"
        >
          {conditions.map(cond => (
            <option key={cond.value} value={cond.value}>{cond.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter value"
          value={this.state.filterValue}
          onChange={handleFilterValueChange}
          className="node-input-field"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#666' }}>
          <span>Pass →</span>
          <span>Fail →</span>
        </div>
      </div>
    );
  }
});