// submit.js

import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    try {
      // 1. Identify Input Nodes
      // We look for nodes that have 'Input' in their type or id as a heuristic
      // In the provided inputNode.js, the type seems to be 'customInput' (or we check the react flow type)
      // Let's filter by checking if the id starts with 'customInput' or type includes 'Input'
      const inputNodes = nodes.filter(node => 
        node.type.includes('customInput') || node.id.includes('customInput') || node.data?.nodeType === 'Input'
      );

      const inputValues = {};
      
      // 2. Prompt user for each input
      for (const node of inputNodes) {
        const label = node.data?.inputName || node.id;
        const userInput = prompt(`Enter value for Input Node "${label}":`);
        if (userInput === null) {
          return; // User cancelled
        }
        inputValues[node.id] = userInput;
      }

      const pipelineData = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle
        })),
        inputs: inputValues // Add inputs to the payload
      };

      // 3. Send to Execute Endpoint
      const response = await fetch('http://localhost:8000/pipelines/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          pipeline: JSON.stringify(pipelineData)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        alert(`❌ Error: ${result.error}`);
        return;
      }

      // 4. Display Results
      // Format the results prettily
      let resultMessage = '✅ Pipeline Executed Successfully!\n\n';
      
      // Show explicit Output Node results first
      const outputNodes = nodes.filter(node => node.type.includes('Output') || node.id.includes('output'));
      if (outputNodes.length > 0) {
        resultMessage += '🏁 Output Nodes:\n';
        outputNodes.forEach(node => {
           resultMessage += `   - ${node.data.label || node.id}: ${result.results[node.id]}\n`;
        });
        resultMessage += '\n';
      }

      // Show specific node results for debugging/visibility
      resultMessage += '🔍 All Node Results:\n';
      for (const [nodeId, output] of Object.entries(result.results)) {
         resultMessage += `   • ${nodeId}: ${output}\n`;
      }

      alert(resultMessage);

    } catch (error) {
      console.error('Error submitting pipeline:', error);
      alert(`❌ Error submitting pipeline: ${error.message}\n\nMake sure the backend server is running on http://localhost:8000`);
    }
  };

  return (
    <div style={{
      padding: 'var(--space-lg)',
      backgroundColor: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-light)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'var(--space-md)'
    }}>
      <div style={{
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        textAlign: 'center'
      }}>
        <div>Nodes: {nodes.length} | Edges: {edges.length}</div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={nodes.length === 0}
        style={{
          backgroundColor: nodes.length === 0 ? 'var(--text-muted)' : 'var(--primary-color)',
          color: 'var(--text-white)',
          border: 'none',
          padding: 'var(--space-md) var(--space-xl)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--font-size-md)',
          fontWeight: 'var(--font-weight-medium)',
          cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease-in-out',
          minWidth: '140px'
        }}
        onMouseEnter={(e) => {
          if (nodes.length > 0) {
            e.target.style.backgroundColor = 'var(--primary-dark)';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = 'var(--shadow-md)';
          }
        }}
        onMouseLeave={(e) => {
          if (nodes.length > 0) {
            e.target.style.backgroundColor = 'var(--primary-color)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'var(--shadow-sm)';
          }
        }}
      >
        ▶️ Run Pipeline
      </button>
    </div>
  );
}
