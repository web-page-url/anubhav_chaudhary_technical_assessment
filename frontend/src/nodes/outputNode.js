// outputNode.js

import { createNodeClass } from './baseNode';

export const OutputNode = createNodeClass({
  headerText: 'Output',
  initialState: (props) => ({
    currName: props.data?.outputName || props.id.replace('customOutput-', 'output_'),
    outputType: props.data?.outputType || 'Text'
  }),
  handles: (props) => [
    {
      type: 'target',
      position: 'left',
      id: `${props.id}-value`
    }
  ],
  nodeStyle: {
    backgroundColor: 'var(--node-output)',
    borderColor: 'var(--primary-light)'
  },
  renderContent: function (props) {
    const handleNameChange = (e) => {
      this.setState({ currName: e.target.value });
    };

    const handleTypeChange = (e) => {
      this.setState({ outputType: e.target.value });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '12px',
          color: '#666'
        }}>
          Name:
          <input
            type="text"
            value={this.state.currName}
            onChange={handleNameChange}
            className="node-input-field"
          />
        </label>
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '12px',
          color: '#666'
        }}>
          Type:
          <select
            value={this.state.outputType}
            onChange={handleTypeChange}
            className="node-input-field"
          >
            <option value="Text">Text</option>
            <option value="File">Image</option>
          </select>
        </label>
      </div>
    );
  }
});
