// llmNode.js

import { createNodeClass } from './baseNode';

export const LLMNode = createNodeClass({
  headerText: 'LLM',
  handles: (props) => [
    {
      type: 'target',
      position: 'left',
      id: `${props.id}-system`,
      style: { top: `${100/3}%` }
    },
    {
      type: 'target',
      position: 'left',
      id: `${props.id}-prompt`,
      style: { top: `${200/3}%` }
    },
    {
      type: 'source',
      position: 'right',
      id: `${props.id}-response`
    }
  ],
  renderContent: function(props) {
    return (
      <div style={{
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        This is a LLM.
      </div>
    );
  }
});
