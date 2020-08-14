

import * as React from 'react';
import { loadModules } from 'esri-loader';

class ArcMap extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(['esri/Map', 'esri/views/MapView'], { css: true })
    .then(([Map, MapView]) => {
    this.webmap = new Map({
        portalItem: {
            id: "41281c51f9de45edaf1c8ed44bb10e30"
        }
    }); 

    this.view = new MapView({
        container: "viewDiv",
        //*** UPDATE ***//
        map: webmap
        //center: [-118.80500,34.02700],
        //zoom: 13
      });
    });
  }

  componentWillUnmount() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }

  render() {
    return (
        <div>
        <p>hello</p>
      <div className="webmap" ref={this.mapRef}> </div>
      </div>
    );
  }
}

module.exports = ArcMap;