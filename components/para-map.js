// NOTE:
// - using the template from previous edition
// - tree loss data is being loaded in successfully as a geojson file in this.props.geoJSON
import React, { Component } from 'react';
import MapGL, { FlyToInterpolator } from 'react-map-gl';
import DeckGL, { GeoJsonLayer, TextLayer } from 'deck.gl';

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoibWF0aGlzb25pYW4iLCJhIjoiY2l5bTA5aWlnMDAwMDN1cGZ6Y3d4dGl6MSJ9.JZaRAfZOZfAnU2EAuybfsg';

let initialViewport;

class App extends Component {
  constructor(props) {
    super(props);

    this.getViewport = v => {
      let vp = Object.assign({}, asiaVP);
      if (this.props.isMobile) {
        vp.zoom = vp.zoom - 1;
      }
      return vp;
    };

    initialViewport = Object.assign({
      latitude: 0,
      longitude: 0,
      zoom: 1,
      maxZoom: 16,
      pitch: 0,
      bearing: 0,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator()
    }, this.props.initialViewport);

    this.state = {
      viewport: initialViewport,
      initialized: false,
      transitioning: false
    };
  }

  _resize() {
    this._onChangeViewport({
      width: Math.min(window.innerWidth, 1440),
      height: window.innerHeight * (2/3)
    });
  }

  _onChangeViewport(viewport) {
    this.setState({
      viewport: Object.assign({}, this.state.viewport, viewport)
    });
  }

  componentDidMount() {
    if (!this.ref) {
      return;
    }
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
    // console.log(this.props.geoJSON)
  }

  _renderTooltip() {
    const { hoveredObject, pointerX, pointerY } = this.state || {};
    return hoveredObject && (
      <div style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none', left: pointerX, top: pointerY }}>
        {hoveredObject.message}
      </div>
    );
  }

  getLayers(data) {

    
    const layer = new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      pickable: true,
      stroked: false,
      filled: true,
      extruded: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [160, 160, 180, 100],
      getLineColor: d => [30,30,30],
      getRadius: 100,
      getLineWidth: 1,
      getElevation: 30
    });

    return layer;


  }

  _initialize(gl) {
    // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE);
    // gl.blendEquation(gl.FUNC_ADD);
    // this.props.updateProps({ stepperIndex: this.props.stepperIndex + 1  });
    this.props.updateProps({ isLoaded: true });
  }

  handleRef(_ref) {
    if (!_ref) {
      return;
    }
    this.ref = _ref;
    // this._resize();
  }

  render() {
    const { viewport, initialized, transitioning, hoveredObject, pointerX, pointerY } = this.state;

    return (
      <div key={'map'} ref={this.handleRef.bind(this)} style={{width: '100%', maxWidth: 1440}}>
        <MapGL
          {...viewport}
          // {...tweenedViewport}
          onClick={() => this.props.updateProps({ zoomEnabled: !this.props.zoomEnabled })}
          mapStyle={this.props.map === 'apts' ? 'mapbox://styles/mathisonian/cjv2tiyabes041fnuap89nfrt' : 'mapbox://styles/mathisonian/cjurw8owq15tb1fomkfgdvycn'}
          dragRotate={this.props.zoomEnabled}
          scrollZoom={this.props.zoomEnabled}
          onViewportChange={this._onChangeViewport.bind(this)}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        >
          <DeckGL
            {...viewport} /*{...tweenedViewport}*/
            layers={this.getLayers(this.props.geoJSON)}
            onWebGLInitialized={this._initialize.bind(this)}
            /*{this._renderTooltip()}*/
          />
        </MapGL>
        {/* {
          hoveredObject ? <div className="parametric-map-tooltip" style={{position: 'fixed', top: pointerY + 15, left: pointerX + 15 }}>
            <div><b>{hoveredObject.properties.apt_name}</b></div>
            <div>Location: {hoveredObject.properties.city}</div>
            <div>Est. Population: {hoveredObject.properties.est_pop10}</div>
            <div>Year Demolished: {hoveredObject.properties.yr_dem}</div>
          </div>: null
        } */}
      </div>
    );
  }
}

module.exports = App;