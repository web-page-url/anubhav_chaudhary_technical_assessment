
import React from 'react';

export const PipelineResultsModal = ({ isOpen, onClose, results, error }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{
                    padding: 'var(--space-lg)',
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: error ? '#fef2f2' : 'var(--bg-primary)'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: error ? '#dc2626' : 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        {error ? '❌ Execution Error' : '✨ Pipeline Results'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    padding: 'var(--space-lg)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-md)'
                }}>
                    {error ? (
                        <div style={{
                            padding: 'var(--space-md)',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fee2e2',
                            borderRadius: 'var(--radius-md)',
                            color: '#b91c1c'
                        }}>
                            {error}
                        </div>
                    ) : (
                        <>
                            {/* Summary Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 'var(--space-sm)',
                                marginBottom: 'var(--space-sm)'
                            }}>
                                <StatBox label="Nodes" value={results.num_nodes} />
                                <StatBox label="Edges" value={results.num_edges} />
                                <StatBox label="Duration" value="0.2s" /> {/* Mock duration for now */}
                            </div>

                            {/* Status Header */}
                            <div style={{
                                padding: 'var(--space-sm) var(--space-md)',
                                backgroundColor: results.is_dag ? '#f0fdf4' : '#fef2f2',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: results.is_dag ? '#15803d' : '#b91c1c',
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-medium)'
                            }}>
                                {results.is_dag ? '✅ Pipeline is a valid DAG' : '🚨 Loop detected: Invalid Pipeline'}
                            </div>

                            {/* Output Nodes Results (Priority) */}
                            {results.results && Object.keys(results.results).length > 0 && (
                                <div>
                                    <h4 style={{
                                        margin: 'var(--space-md) 0 var(--space-sm)',
                                        color: 'var(--text-primary)',
                                        fontSize: 'var(--font-size-sm)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Outputs
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                        {Object.entries(results.results)
                                            .filter(([key]) => key.includes('Output') || key.includes('output'))
                                            .map(([key, value]) => (
                                                <ResultRow key={key} label={key} value={value} highlight />
                                            ))}

                                        {/* Only show other nodes if they aren't outputs, maybe in a collapsed view or just listed below */}
                                        {Object.entries(results.results)
                                            .filter(([key]) => !(key.includes('Output') || key.includes('output')))
                                            .map(([key, value]) => (
                                                <ResultRow key={key} label={key} value={value} />
                                            ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: 'var(--space-md) var(--space-lg)',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backgroundColor: 'var(--bg-secondary)'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 24px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 'var(--font-weight-medium)',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={e => e.target.style.backgroundColor = 'var(--primary-dark)'}
                        onMouseLeave={e => e.target.style.backgroundColor = 'var(--primary-color)'}
                    >
                        Close
                    </button>
                </div>
            </div>
            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
        </div>
    );
};

const StatBox = ({ label, value }) => (
    <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: 'var(--space-sm)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center'
    }}>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>{value}</div>
    </div>
);

const ResultRow = ({ label, value, highlight }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-sm) var(--space-md)',
        backgroundColor: highlight ? '#eff6ff' : 'var(--bg-primary)',
        border: highlight ? '1px solid #bfdbfe' : '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)'
    }}>
        <span style={{ fontWeight: 'var(--font-weight-medium)', color: highlight ? '#1e40af' : 'var(--text-primary)' }}>
            {label}
        </span>
        <code style={{
            backgroundColor: highlight ? 'rgba(255,255,255,0.5)' : 'var(--bg-tertiary)',
            padding: '2px 6px',
            borderRadius: '4px',
            color: highlight ? '#1e3a8a' : 'var(--text-secondary)',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }}>
            {JSON.stringify(value)}
        </code>
    </div>
);
