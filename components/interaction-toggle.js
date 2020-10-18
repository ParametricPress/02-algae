const React = require('react');

class CustomComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      enabled: false
    }
  }

  render() {
    const { hasError, idyll, updateProps, clickCount, ...props } = this.props;
    const { enabled } = this.state;
    return (
      <div style={{position: 'relative'}}>
        <div style={{pointerEvents: enabled ? 'auto' : 'none', opacity: enabled ? 1 : 0.6 }}>
          {props.children}
        </div>
        <div style={{position: 'absolute', bottom: '1em', left: 'calc(50% - 175px)', right: 'calc(50% - 175px)', width: 350, textAlign: 'center', background: enabled ? '#ADADAD': '#D8FFA2', cursor: 'pointer', color: '#222222', padding: '0.5em 0'}} onClick={() => this.setState({ enabled: !enabled })}>
          Click to {this.state.enabled ? 'disable' : 'enable'} map interactions.
        </div>
      </div>
    );
  }
}

module.exports = CustomComponent;
