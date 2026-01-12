// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div style={{
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <h3 style={{
                margin: '0 0 var(--space-lg) 0',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)'
            }}>
                Node Library
            </h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-md)'
            }}>
                {/* Original nodes */}
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />

                {/* New nodes */}
                <DraggableNode type='math' label='Math' />
                <DraggableNode type='filter' label='Filter' />
                <DraggableNode type='transform' label='Transform' />
                <DraggableNode type='timer' label='Timer' />
                <DraggableNode type='condition' label='Condition' />
            </div>
            <p style={{
                margin: 0,
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
            }}>
                Drag nodes onto the canvas to build your pipeline. Connect them by dragging from output handles to input handles.
            </p>
        </div>
    );
};
