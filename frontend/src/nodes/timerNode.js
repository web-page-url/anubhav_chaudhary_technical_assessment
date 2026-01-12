// timerNode.js

import { createNodeClass } from './baseNode';

export const TimerNode = createNodeClass({
  headerText: 'Timer',
  initialState: (props) => ({
    delay: props.data?.delay || 1000,
    unit: props.data?.unit || 'ms'
  }),
  nodeStyle: {
    backgroundColor: 'var(--node-timer)',
    borderColor: 'var(--accent-color)'
  },
  handles: (props) => [
    {
      type: 'target',
      position: 'left',
      id: `${props.id}-trigger`
    },
    {
      type: 'source',
      position: 'right',
      id: `${props.id}-output`
    }
  ],
  renderContent: function (props) {
    const handleDelayChange = (e) => {
      this.setState({ delay: parseInt(e.target.value) || 0 });
    };

    const handleUnitChange = (e) => {
      this.setState({ unit: e.target.value });
    };

    const units = [
      { value: 'ms', label: 'ms', multiplier: 1 },
      { value: 's', label: 'seconds', multiplier: 1000 },
      { value: 'min', label: 'minutes', multiplier: 60000 }
    ];

    const selectedUnit = units.find(u => u.value === this.state.unit);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ fontSize: '10px', color: '#666' }}>Delay</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="number"
            min="0"
            value={this.state.delay}
            onChange={handleDelayChange}
            style={{
              width: '50px',
              padding: '2px 4px',
              border: '1px solid #e91e63',
              borderRadius: '3px',
              fontSize: '11px',
              textAlign: 'center'
            }}
          />
          <select
            value={this.state.unit}
            onChange={handleUnitChange}
            style={{
              padding: '2px 4px',
              border: '1px solid #e91e63',
              borderRadius: '3px',
              fontSize: '10px',
              backgroundColor: '#fce4ec'
            }}
          >
            {units.map(unit => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
        </div>
        <div style={{
          fontSize: '9px',
          color: '#999',
          textAlign: 'center'
        }}>
          {this.state.delay} {selectedUnit?.label}
        </div>
      </div>
    );
  }
});