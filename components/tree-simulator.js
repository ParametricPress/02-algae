// NOTES ON CODE INSPO
// - d3 nodes simulation from here: https://bl.ocks.org/madams1/920e92fb2923ab789057abb67047f0bb
// - SVG recursive tree from here: https://www.markhorsell.com/category/generative-art/

import React, { Component } from 'react';
const d3 = require('d3');

let gridHeightStart = 240;
let gridWidthStart = 160;
let spacing = 20;

let width = 500;
let height = 350;

const treeLocations = [
  {loc: {
    x: 120,
    y: 80
  }},
  {loc: {
    x: 140,
    y: 90
  }},
  {loc: {
    x: 70,
    y: 100
  }},
  {loc: {
    x: 100,
    y: 110
  }},
  {loc: {
    x: 240,
    y: 90
  }},
  {loc: {
    x: 150,
    y: 140
  }},
  {loc: {
    x: 180,
    y: 70
  }},
  {loc: {
    x: 200,
    y: 110
  }},
  {loc: {
    x: 20,
    y: 90
  }},
  {loc: {
    x: 260,
    y: 80
  }}
]

class treeSimulator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      branches: [],
      yearCount: 0,
      disasterCount: 0,
      simulationState: 'beforeFirstStart',
      simulationMessage: "Let's eat up this CO₂!",
      readyToSimulate: true,
      carbonDots: 0
    }
  };

  updateTrees = e => {
    d3.selectAll('.svg-trees').remove()

    // for # of trees
    for (let i = 0; i < this.props.numtrees; i++) {
      this.drawSvgTree(treeLocations[i].loc.x, treeLocations[i].loc.y)
    }
  };

  drawSvgTree(x, y) {

    d3.select("#treelandscape").append("svg:image")
      .attr("xlink:href", "static/images/svg-tree-stroke-2.svg")
      .attr("class", "svg-trees")
      .attr("width", 60)
      .attr("height", 60)
      .attr("x", (width/6) + x)
      .attr("y",(height - y)+20);
  }

  componentDidMount() {
    this.NUM_OF_BRANCHES = 10;
    this.updateTrees();
    this.startNodeSimulation();
  }

  startNodeSimulation() {
    let radius = 2;

    let nodes = [],
        counter = 0,
        int;

    let svg = d3.select("#treelandscape")
        .attr("width", width)
        .attr("height", height);

    let simulation = d3.forceSimulation()
          .force("x", d3.forceX().x(width/2))
          .force("y", d3.forceY().y(100))
          .force("gravity", d3.forceManyBody().strength(-radius - 2))
          .force("collide", d3.forceCollide()
              .radius(d => d.radius + 0.1)
              .iterations(2)
          )
          .on("tick", () => {
            svg.selectAll("circle")
              .attr("cx", d => d.x)
              .attr("cy", d => d.y)
              // .attr("stroke", "#D9FFA2")
          });

    startSimulation();

    function startSimulation() {
      int = d3.interval(() => {
            addNode("red");
            updateSim();
            if (counter > 150) {
                int.stop();
            }
        }, 30);
    }

    function addNode(color) {
      let cfill;
      if (color == "blue") {
        cfill = "#9BBBD8"
      } else {
        cfill="#F09989"
      }
        nodes.push(
            {
                radius,
                x: width/2,
                y: height/1.5,
                fill: cfill
            }
        );

        counter += 1;
    }

    function removeNode() {
        nodes.pop()
    }

    this._startHandler = () => {

        if (!this.state.readyToSimulate) {
          this.setState({
            simulationMessage: "You need to reset the simulation first!",
            simulationMessageColor: '#ffffff'
          })
        } else {
          // this.updateTrees()
          this.setState({
            simulationState: 'running',
            simulationMessage: 'The trees are removing CO₂ from the atmosphere.',
            simulationMessageColor: '#9CBBD7'
          });

          d3.select('.tooltip')
              .attr('opacity', 1)

          let counterForYears = setInterval(() => {
            let treeCarbonCount = this.props.numtrees * 1;
            for (let i = 0; i < treeCarbonCount; i++) {
              removeNode();
              this.state.carbonDots = this.state.carbonDots + 1;
              // console.log(this.state.carbonDots)
              // console.log(this.state.carbonDots*10)

              // add dot by the trees for every carbon removed
              d3.select("#treelandscape")
                  .append('rect')
                  .attr("x", ()=> {
                    if (this.state.carbonDots < 20) {
                      return gridWidthStart+(this.state.carbonDots*10) // row 1
                    } else if (this.state.carbonDots >= 20 && this.state.carbonDots <39) {
                      return gridWidthStart-190+(this.state.carbonDots*10) //  row 2
                    } else if (this.state.carbonDots >= 40 && this.state.carbonDots <59) {
                      return gridWidthStart-390+(this.state.carbonDots*10) // row 3
                    } else if (this.state.carbonDots >= 60 && this.state.carbonDots <79) {
                      return gridWidthStart-590+(this.state.carbonDots*10) // row 4
                    } else if (this.state.carbonDots >= 80 && this.state.carbonDots <99) {
                      return gridWidthStart-790+(this.state.carbonDots*10) // row 5
                    } else {
                      return gridWidthStart-990+(this.state.carbonDots*10) // row 6
                    }
                  })
                  .attr("y", () => {
                    if (this.state.carbonDots < 20) {
                      return gridHeightStart;
                    } else if (this.state.carbonDots >= 20 && this.state.carbonDots <39) {
                      return gridHeightStart+10;
                    } else if (this.state.carbonDots >= 40 && this.state.carbonDots <59) {
                      return gridHeightStart+20;
                    } else if (this.state.carbonDots >= 60 && this.state.carbonDots <79) {
                      return gridHeightStart+30;
                    } else if (this.state.carbonDots >= 80 && this.state.carbonDots <100) {
                      return gridHeightStart+40; // row 5
                    } else {
                      return -50;
                    }
                  })
                  .attr('rx', 10)
                  .attr('ry', 10)
                  .attr('width', 5)
                  .attr('height', 5)
                  .attr('fill', '#9BBBD8')
                  .attr('opacity', 0)
                  .attr('class', 'removed-carbon')
                  .transition()
                  .delay(300)
                  .attr('opacity', 0.9);
            }
            updateSim();

            this.setState({
              yearCount: this.state.yearCount + 1
            })

            if ((this.state.yearCount > 29) || (this.props.numtrees < 1)) {
              clearInterval(counterForYears)
              this.setState({
                simulationState: 'waitingForRestart',
              });
            }

          }, 1000);

          let counterForTrees = setInterval(() => {
            // for every tree killed, release all carbon from tree
            for (let i = 0; i < this.state.yearCount * 1; i++) {
              addNode("blue");
              this.state.carbonDots = this.state.carbonDots - 1;

              // remove # of carbon that tree has sequestered
              let selec = d3.selectAll('.removed-carbon');
              let lastNode = selec.nodes()[selec.nodes().length - 1];
              lastNode.remove();
            }
            updateSim();

            d3.select(".svg-trees")
                .remove();

            this.props.updateProps({
              numtrees: this.props.numtrees - 1
            })

            this.setState({
              disasterCount: this.state.disasterCount + 1,
              simulationMessage: 'Trees have died! CO₂ has been released into the atmosphere.',
              simulationMessageColor: '#EE998B'
            })

            if (this.props.numtrees < 1) {
              clearInterval(counterForTrees)
              this.setState({
                simulationState: 'waitingForRestart',
                simulationMessage: 'We ran out of trees. 😔',
                simulationMessageColor: '#EE998B',
                readyToSimulate: false
              });

            } else if (this.state.yearCount > 29) {
              clearInterval(counterForTrees)
              this.setState({
                simulationState: 'waitingForRestart',
                simulationMessage: "It's been 30 years, we ran out of time. 😔",
                simulationMessageColor: '#EE998B',
                readyToSimulate: false
              });
            }
          }, 3000);
        }
      }

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
      simulationMessage: "Drag the slider to plant more trees.",
      yearCount: 0,
      disasterCount: 0,
      readyToSimulate: true
    });

    d3.selectAll('.removed-carbon').remove()

    this.NUM_OF_BRANCHES = 10;
    this.updateTrees();
    console.log('restart the sim')
    this.startNodeSimulation();
  }
  componentDidUpdate(prevProps) {
    if (this.props.numtrees !== prevProps.numtrees) {
      if (this.state.simulationState != "running") {
        this.updateTrees()
      }

    }
  }
  render() {
    const viewHeight = 15;
    return (
      <div className="app row tree-sim">
        <div>
          { this.state.simulationState == 'beforeFirstStart'  ? <h3>Let's plant a forest of { this.props.numtrees * 1000 } trees</h3> : null }
          { this.state.simulationState == 'running' || this.state.simulationState == 'waitingForRestart' ? <h3 style={{color: this.state.simulationMessageColor || '#D8FFA2'}}>{this.state.simulationMessage}</h3> : null }
          { this.state.simulationState == 'running' || this.state.simulationState == 'waitingForRestart'  ? <p>Trees lost: {this.state.disasterCount * 1000}</p> : null }
          { this.state.simulationState == 'running' || this.state.simulationState == 'waitingForRestart'  ? <p>CO₂ sequestered: {this.state.carbonDots *10}kg CO₂</p> : null }
          {/* { this.state.simulationState == 'running' || this.state.simulationState == 'waitingForRestart'  ? <p>CO₂ released: {50 - this.state.carbonDots}</p> : null } */}
        </div>
        {this.state.simulationState == 'beforeFirstStart' ? this.props.children : null}
        <div className="flex-container">
          <div class="flex-child">
            {this.state.simulationState == 'beforeFirstStart' ? <button id="start-btn" onClick={() => this._startHandler()}>Start Simulation</button> : null}
            { this.state.simulationState == 'waitingForRestart'  ? <button id="restart-btn" onClick={() => this.resetTheSim()}>Reset</button> : null }
          </div>
          <div class="flex-child-3">
            <div class='progress-bar-outer'>
                <div class='progress-bar-inner' style={{width: (this.state.yearCount * 3.333) + '%'}}></div>
            </div>
            {this.state.simulationState == 'running' ? <p>Years elapsed: {this.state.yearCount}</p> : null}
          </div>
        </div>

        <div className="content column">
          <svg id="treelandscape" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="310" cy="7" rx="3" fill="#F09989"></ellipse>
            <text class="co2-legend" x="320" y="10">= 10kg CO₂</text>
            <text class="co2-type" x="30" y="110">Atmospheric CO₂</text>
            <text class="co2-type" x="30" y="260">Sequestered CO₂</text>
          </svg>
        </div>

        <div>
        { this.state.simulationState == 'beforeFirstStart'  ? <p>Each 🌲 represents 1,000 trees</p> : null }
        <div class="simulation-citation">The data for this simulation is based on a few estimates, but is mainly meant to illustrate a wider problem. Rate of CO₂ removal assumes that a mature tree absorbs 48 lbs/yr (estimate from the <a href="http://www.tenmilliontrees.org/trees/" target="_blank">10 Million Trees project</a>), but these estimates vary greatly by region, type of tree, and age of tree. The rate of deforestation assumes that deforestation rates will stay the same or increase in the future for an area of untouched forest (ie no more trees planted).</div>
        </div>
      </div>
    );
  }
}

export default treeSimulator;