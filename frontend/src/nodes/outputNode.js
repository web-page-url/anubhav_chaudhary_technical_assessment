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
  renderContent: function(props) {
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
            style={{
              marginTop: '2px',
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
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
            style={{
              marginTop: '2px',
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value="Text">Text</option>
            <option value="File">Image</option>
          </select>
        </label>
      </div>
    );
  }
});
