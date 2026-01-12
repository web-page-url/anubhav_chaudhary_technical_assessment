// draggableNode.js

// Node type to color mapping
const nodeTypeColors = {
  customInput: 'var(--node-input)',
  llm: 'var(--node-llm)',
  customOutput: 'var(--node-output)',
  text: 'var(--node-text)',
  math: 'var(--node-math)',
  filter: 'var(--node-filter)',
  transform: 'var(--node-transform)',
  timer: 'var(--node-timer)',
  condition: 'var(--node-condition)'
};

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType }
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      style={{
        cursor: 'grab',
        minWidth: '100px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: nodeTypeColors[type] || 'var(--bg-secondary)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: 'var(--space-sm)',
        position: 'relative'
      }}
      draggable
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = 'var(--primary-color)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <span style={{
        color: 'var(--text-primary)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        textAlign: 'center',
        userSelect: 'none'
      }}>
        {label}
      </span>

      {/* Drag indicator */}
      <div style={{
        position: 'absolute',
        top: '4px',
        right: '4px',
        width: '12px',
        height: '12px',
        backgroundColor: 'var(--text-muted)',
        borderRadius: '50%',
        opacity: 0.6
      }} />
    </div>
  );
};
