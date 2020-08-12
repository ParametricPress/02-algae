// NOTES
// - d3 nodes simulation from here: https://bl.ocks.org/madams1/920e92fb2923ab789057abb67047f0bb
// - SVG recursive tree from here: https://www.markhorsell.com/category/generative-art/

import React, { Component } from 'react';
const d3 = require('d3');

class treeSimulator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      branches: []
    }
  };
  restart = e => {
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

    let angle=-100+Math.random()*20;

    for (let i = 0; i < this.props.numtrees; i++) {
      drawTree((Math.random() * 100) + 1, 100, angle, depth);
    }   
    
    return branches;
  }
  pressMe = (e) => {
    e.preventDefault();
    this.restart();
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
    this.NUM_OF_BRANCHES = 80;

    this.restart();
    const width = 700,
      height = 400,
      radius = 3,
      color = d3.schemePaired;

    let nodes = [],
        counter = 0,
        int;

    let svg = d3.select("#treelandscape")
        .attr("width", width)
        .attr("height", height);

    let simulation = d3.forceSimulation()
          .force("x", d3.forceX().x(width/2))
          .force("y", d3.forceY().y(height/2))
          .force("gravity", d3.forceManyBody().strength(-radius))
          .force("collide", d3.forceCollide()
              .radius(d => d.radius + 1.1)
              .iterations(5)
          )
          .on("tick", () => {
            svg.selectAll("circle")
              .attr("cx", d => d.x)
              .attr("cy", d => d.y);
          });

    startSimulation();

    function startSimulation() {
      console.log('start')
      int = d3.interval(() => {
            addNode();
            updateSim();
            if (counter > 50) {
                int.stop();
            }
        }, 80);
    }

    function addNode() {

        let offenseGroup = Math.floor(d3.randomUniform(7)()) + 1;

        nodes.push(
            {
                radius,
                x: width/2,
                y: height/1.5,
                offenseGroup,
                fill: 'green'
            }
        );

        counter += 1;
    }

    function removeNode() {
        nodes.pop()
        console.log(nodes.length)
    }

    d3.select("#remove-btn").on("click", () => removeCarbon());
    d3.select("#add-btn").on("click", () => addCarbon());
    d3.select("#kill-tree-btn").on("click", () => killTree());
    d3.select("#restart-btn").on("click", () => restart());

    function restart() {
      nodes = [];
      counter = 0;
      int.stop();
      simulation.restart();
      updateSim();
      startSimulation();
    }

    function killTree() {
      for (let i = 0; i < 15; i++) {
        addNode();
      }
        updateSim();
    }

    function addCarbon() {
        simulation.force("x", d3.forceX().x(width/2));
        simulation.force("y", d3.forceY().y(100));
        addNode();
        addNode();
        updateSim();
        // updateSim();      
    }

    function removeCarbon() {
        simulation.force("x", d3.forceX().x(width/2));

        removeNode();
        updateSim();
    }

    function updateSim() {

        simulation.nodes(nodes);

        let bubs = svg.selectAll("circle")
            .data(nodes);

        bubs.exit()
          .transition()
          .duration(1000)
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

    // timer for removing carbon with trees
    // window.setInterval(function(){
    //   /// call your functions here
    //   removeNode();
    //   updateSim();
    // }, 2000);

  }
  
  removeTree = (e) => {
    e.preventDefault();
    this.props.numtrees = this.props.numtrees - 1;
    this.restart();
  }

  startTimers() {
    
  }
  componentDidUpdate(prevProps) {
    if (this.props.numtrees !== prevProps.numtrees) {
      console.log('draw again')
      this.restart()
      // this.setState({
      //   color: `rgba(
      //     ${Math.round(Math.random() * 255)},
      //     ${Math.round(Math.random() * 255)},
      //     ${Math.round(Math.random() * 255)},
      //     ${Math.random()}
      //   )`
      // })
    }
  }
  render() {
    const viewHeight = 15;
    return (
      <div className="app">
        <button id="remove-btn">Remove</button>
        <button id="add-btn">Add</button>
        <button id="restart-btn">Restart</button>
        
        <div className="content">
          {/* omitting width and height should cause scale to window */}
          <svg id="treelandscape" xmlns="http://www.w3.org/2000/svg" onClick={this.pressMe}
            >
            {this.state.branches.map((b, i) => (
              <g id="svg_1" 
              key={i}
              transform="translate(250,300)"
              >             
             <line id="svg_2" x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
                  strokeWidth=".3"
                  stroke={b.color}
                 
                />
              </g>))}
          </svg>
        </div>
      </div>
    );
  }
}

export default treeSimulator;