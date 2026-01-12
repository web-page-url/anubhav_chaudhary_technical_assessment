// inputNode.js

import { createNodeClass } from './baseNode';

export const InputNode = createNodeClass({
  headerText: 'Input',
  initialState: (props) => ({
    currName: props.data?.inputName || props.id.replace('customInput-', 'input_'),
    inputType: props.data?.inputType || 'Text'
  }),
  handles: (props) => [
    {
      type: 'source',
      position: 'right',
      id: `${props.id}-value`
    }
  ],
  renderContent: function(props) {
    const handleNameChange = (e) => {
      this.setState({ currName: e.target.value });
    };

    const handleTypeChange = (e) => {
      this.setState({ inputType: e.target.value });
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
            value={this.state.inputType}
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
            <option value="File">File</option>
          </select>
        </label>
      </div>
    );
  }
});
