// NOTES:
// - base map from this repo: https://github.com/visgl/react-map-gl/blob/5.2-release/examples/get-started/classic/app.js


import * as React from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmNvb2xleSIsImEiOiJja2RkbHIycTIxODlhMnhsMGNxOHd5dHZmIn0.78wTRiX8siEWCrNq4W90Vg';

class CustomMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          viewport: {
            latitude: 0,
            longitude: -122.4,
            zoom: 2,
            bearing: 0,
            pitch: 0
          }
        };
      }

      render() {
        return (
          <MapGL
            {...this.state.viewport}
            width="100vw"
            height="100vh"
            mapStyle="mapbox://styles/mapbox/dark-v9"
            onViewportChange={viewport => this.setState({viewport})}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          >
            
          </MapGL>
        );
      }
}

module.exports = CustomMap;