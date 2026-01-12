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
        }))
      };

      const response = await fetch('http://localhost:8000/pipelines/parse', {
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

      // Display the results in a user-friendly alert
      const message = `
📊 Pipeline Analysis Results:

🔢 Number of Nodes: ${result.num_nodes}
🔗 Number of Edges: ${result.num_edges}
${result.is_dag ? '✅' : '❌'} DAG Status: ${result.is_dag ? 'Valid DAG' : 'Not a DAG'}

${result.is_dag
  ? 'Great! Your pipeline forms a valid directed acyclic graph.'
  : 'Warning: Your pipeline contains cycles and is not a valid DAG.'
}
      `.trim();

      alert(message);

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
        🚀 Submit Pipeline
      </button>
    </div>
  );
}
