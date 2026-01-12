// submit.js

import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { PipelineResultsModal } from './PipelineResultsModal';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [modalState, setModalState] = useState({ isOpen: false, data: null, error: null });

  const handleSubmit = async () => {
    try {
      // 1. Identify Input Nodes
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
        inputs: inputValues
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
        setModalState({ isOpen: true, data: null, error: result.error });
        return;
      }

      // 4. Show Modal instead of Alert
      setModalState({ isOpen: true, data: result, error: null });

    } catch (error) {
      console.error('Error submitting pipeline:', error);
      setModalState({
        isOpen: true,
        data: null,
        error: `${error.message}. Make sure the backend server is running on http://localhost:8000`
      });
    }
  };

  return (
    <>
      <PipelineResultsModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        results={modalState.data}
        error={modalState.error}
      />
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
    </>
  );
}
