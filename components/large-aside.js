import * as React from 'react';

export default class LargeAside extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0
    }

    this.resizeBounce = null;
    this._size = this._size.bind(this);
  }

  _handleResize() {
    if (this.resizeBounce) {
      clearTimeout(this.resizeBounce);
    }

    this.resizeBounce = setTimeout(this._size, 100);
  }

  _size() {
    this.setState({
      width: Math.min(window.innerWidth, 1440),
    })
  }

  componentDidMount() {
    this._size();
    window.addEventListener('resize', this._handleResize.bind(this));
  }

  render() {
    const margin = this.state.width <= 1000 ? 50 : 100;
    return (
      <div className="large-aside-container" style={{
        width: this.state.width - margin,  // 50 = text margin
        maxWidth: this.state.width - margin
      }}>
        <div className="large-aside-wrapper">
          <div className="large-aside">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}