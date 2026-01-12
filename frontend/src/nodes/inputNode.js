// inputNode.js

import { createNodeClass, BaseNode } from './baseNode';

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
  nodeStyle: {
    backgroundColor: 'var(--node-input)',
    borderColor: 'var(--primary-light)'
  },
  getNodeStyle: function () {
    const baseStyle = BaseNode.prototype.getNodeStyle.call(this);
    const nameLength = this.state.currName ? this.state.currName.length : 0;
    const dynamicWidth = Math.max(200, 150 + nameLength * 8);

    return {
      ...baseStyle,
      width: dynamicWidth,
    };
  },
  renderContent: function (props) {
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
            value={this.state.inputType}
            onChange={handleTypeChange}
            className="node-input-field"
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
    );
  }
});
