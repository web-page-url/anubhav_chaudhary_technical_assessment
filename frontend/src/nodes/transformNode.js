// transformNode.js

import { createNodeClass } from './baseNode';

export const TransformNode = createNodeClass({
  headerText: 'Transform',
  initialState: (props) => ({
    transformation: props.data?.transformation || 'uppercase'
  }),
  nodeStyle: {
    backgroundColor: 'var(--node-transform)',
    borderColor: 'var(--primary-light)'
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
      id: `${props.id}-output`
    }
  ],
  renderContent: function (props) {
    const handleTransformationChange = (e) => {
      this.setState({ transformation: e.target.value });
    };

    const transformations = [
      { value: 'uppercase', label: 'UPPERCASE' },
      { value: 'lowercase', label: 'lowercase' },
      { value: 'capitalize', label: 'Capitalize' },
      { value: 'reverse', label: 'Reverse' },
      { value: 'trim', label: 'Trim Spaces' },
      { value: 'length', label: 'Get Length' }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <select
          value={this.state.transformation}
          onChange={handleTransformationChange}
          className="node-input-field"
        >
          {transformations.map(trans => (
            <option key={trans.value} value={trans.value}>{trans.label}</option>
          ))}
        </select>
        <div style={{
          fontSize: '10px',
          color: '#666',
          textAlign: 'center',
          padding: '4px',
          backgroundColor: '#f8f9fa',
          borderRadius: '3px',
          width: '100%'
        }}>
          {transformations.find(t => t.value === this.state.transformation)?.label}
        </div>
      </div>
    );
  }
});