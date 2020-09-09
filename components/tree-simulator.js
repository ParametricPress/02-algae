// NOTES ON CODE INSPO
// - d3 nodes simulation from here: https://bl.ocks.org/madams1/920e92fb2923ab789057abb67047f0bb
// - SVG recursive tree from here: https://www.markhorsell.com/category/generative-art/

import React, { Component } from 'react';
const d3 = require('d3');

class treeSimulator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      branches: [],
      yearCount: 0,
      disasterCount: 0,
      simulationState: 'beforeFirstStart',
      simulationMessage: "Let's eat up this CO₂!"
    }
  };

  updateTrees = e => {
    this.branchList = this.createBranches(this.NUM_OF_BRANCHES);
    this.setState({ branches: this.branchList });
  };
  setColor(r) {
    //hue based on r : 0 -60 red to yellow
    var s = 10;
    var l = 100;
    var c = this.hslToHex(r * 2, s, l);
    return c;
  }
  createBranches(num) {

    var deg_to_rad = Math.PI / 180.0;
    var depth = 6;
    let length=4+Math.random()*.8;
    let branches = [];
    let _self=this;
    function drawTree(x1, y1, angle, depth){
        angle+=10-Math.random()*20;

      if (depth !== 0){
        var x2 = x1 + (Math.cos(angle * deg_to_rad) * depth * length);
        var y2 = y1 + (Math.sin(angle * deg_to_rad) * depth * length);
        // let color=_self.setColor(12+(2*depth));
        let color=_self.setColor(Math.random()*2*depth);
        let branch={x1:x1,y1: y1, x2:x2, y2:y2, depth:depth,color:color};
        branches.push(branch);

        drawTree(x2, y2, angle - 25, depth - 1);
        drawTree(x2, y2, angle , depth - 1);
        drawTree(x2, y2, angle + 25, depth - 1);
      }
    }

    let angle=-100+Math.random()*25;

    for (let i = 0; i < this.props.numtrees; i++) {
      drawTree((Math.random() * 150) + 1, 100, angle, depth);
    }   
    
    return branches;
  }
  
  hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  componentDidMount() {
    this.NUM_OF_BRANCHES = 20;
    this.updateTrees();
    this.startNodeSimulation(); 
  }

  startNodeSimulation() {
    const width = 700,
      height = 400,
      radius = 2;

    let nodes = [],
        counter = 0,
        int;

    let svg = d3.select("#treelandscape")
        .attr("width", width)
        .attr("height", height);

    let simulation = d3.forceSimulation()
          .force("x", d3.forceX().x(width/2))
          .force("y", d3.forceY().y(160))
          .force("gravity", d3.forceManyBody().strength(-radius - 2))
          .force("collide", d3.forceCollide()
              .radius(d => d.radius + 0.1)
              .iterations(2)
          )
          .on("tick", () => {
            svg.selectAll("circle")
              .attr("cx", d => d.x)
              .attr("cy", d => d.y);
          });

    startSimulation();

    function startSimulation() {
      int = d3.interval(() => {
            addNode();
            updateSim();
            if (counter > 150) {
                int.stop();
            }
        }, 30);
    }

    function addNode() {
        nodes.push(
            {
                radius,
                x: width/2,
                y: height/1.5,
                fill: '#D9FFA2'
            }
        );

        counter += 1;
    }

    function removeNode() {
        nodes.pop()
    }
    
    d3.select("#start-btn").on("click", () => {
        this.updateTrees()
        this.setState({
          simulationState: 'running',
          simulationMessage: 'Removing CO₂...'
        });

        d3.select('.tooltip')
            .attr('opacity', 1)

        let counterForYears = setInterval(() => {
          let treeCarbonCount = this.props.numtrees * 1;
          for (let i = 0; i < treeCarbonCount; i++) {
            removeNode();
          }
          updateSim();

          this.setState({ 
            yearCount: this.state.yearCount + 1
          })

          if ((this.state.yearCount > 30) || (this.props.numtrees < 1)) {
            clearInterval(counterForYears)
            this.setState({
              simulationState: 'waitingForRestart',
            });
          }

        }, 1000);

        let counterForTrees = setInterval(() => {
          // for every tree killed, release all carbon from tree
          for (let i = 0; i < this.state.yearCount * 1; i++) {
            addNode();
          }
          updateSim();

          this.props.updateProps({
            numtrees: this.props.numtrees - 1
          })

          this.setState({ 
            disasterCount: this.state.disasterCount + 1,
            simulationMessage: 'Tree down: carbon escaped!'
          })

          if (this.props.numtrees < 1) {
            clearInterval(counterForTrees)
            this.setState({
              simulationState: 'waitingForRestart',
              simulationMessage: 'We ran out of trees...😔'
            });
          }
        }, 3000);
      }
    );

    function updateSim() {
        simulation.nodes(nodes);

        let bubs = svg.selectAll("circle")
            .data(nodes);

        bubs.exit()
          .transition()
          .duration(400)
          .attr("cy", 370)
          .remove();

        bubs.enter().append("circle")
        .attr("r", function(d) { return d.radius; })
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("stroke", d => d3.rgb(d.fill).darker())
        .attr("stroke-width", 1)
        .style("fill", function(d) { return d.fill; })
        .style("opacity", 0.6)
        .merge(bubs);

        simulation.alphaTarget(0.5);
    }
  }
  resetTheSim() {
    this.setState({
      simulationState: 'beforeFirstStart',
      simulationMessage: "Try planting more trees this",
      yearCount: 0,
      disasterCount: 0
    });

    this.NUM_OF_BRANCHES = 20;
      this.updateTrees();
      console.log('restart the sim')
      this.startNodeSimulation(); 
  }
  componentDidUpdate(prevProps) {
    if (this.props.numtrees !== prevProps.numtrees) {
      
      // do not redraw trees until start button pressed
      if (this.state.simulationState != 'beforeFirstStart') {
        this.updateTrees()
      } 
    }
  }
  render() {
    const viewHeight = 15;
    return (
      <div className="app row">
        <div className="column sim-controls">
          <div class='progress-bar-outer'>
            <div class='progress-bar-inner' style={{width: (((this.props.numtrees - 1) / (this.props.maxTrees - 1))*100) + '%'}}></div>
          </div>
          <p>Trees in forest: {this.props.numtrees}</p>

          <div class='progress-bar-outer'>
              <div class='progress-bar-inner' style={{width: (this.state.yearCount * 3.333) + '%'}}></div>
          </div>
          <p>Years elapsed: {this.state.yearCount}</p>
          
          <div class='progress-bar-outer'>
              <div class='progress-bar-inner' style={{width: ((this.state.disasterCount*10)) + '%'}}></div>
          </div>
          <p>Deforestation events: {this.state.disasterCount}</p>
          
          { (this.state.simulationState == 'waitingForRestart') || (this.state.simulationState == 'beforeFirstStart') ? <button id="start-btn">Start Simulation</button> : null }
          { this.props.numtrees < 1 ? <p style={{ textAlign: 'center' }}>Plant more trees to try again.</p> : null }
          { this.state.simulationState == 'waitingForRestart'  ? <button id="restart-btn" onClick={() => this.resetTheSim()}>Reset</button> : null }
        </div>
        
        <div className="content column">
          <svg id="treelandscape" xmlns="http://www.w3.org/2000/svg">
            <rect class='tooltip-box' x='200' y='10' width='300' height='60' rx='10' ry='10'></rect>
            <text class='tooltip-text' x='270' y='45'>
              {this.state.simulationMessage}
            </text>
        
            {this.state.branches.map((b, i) => (
              <g id="svg_1" 
              key={i}
              transform="translate(300,300)"
              >             
             <line id="svg_2" x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
                  strokeWidth=".3"
                  stroke={b.color}
                 
                />
              </g>))}
          </svg>
        </div>
        <div>
        <span class="simulation-citation">The data for this simulation is based on a few estimates. Rate of removal is based on x, rate of deforestation based on <a href="">y</a>.</span>
        </div>
      </div>
    );
  }
}

export default treeSimulator;