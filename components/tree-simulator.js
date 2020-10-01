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
      simulationMessage: "Let's eat up this CO₂!",
      readyToSimulate: true
    }
  };

  updateTrees = e => {
    // this.branchList = this.createBranches(this.NUM_OF_BRANCHES);
    // this.setState({ branches: this.branchList });
    d3.selectAll(".svg-trees").remove();
      
    for (let i = 0; i < this.props.numtrees; i++) {
      let randX = Math.floor(Math.random()*399) + 1;
      let randY = (Math.floor(Math.random()*49) + 1)+70;
      this.drawSvgTree(randX, randY)  
    }
  };

  drawSvgTree(x, y) {
    const width = 600,
      height = 300;

    d3.select("#treelandscape").append("svg:image")
      .attr("xlink:href", "static/images/svg-tree-stroke.svg")
      .attr("class", "svg-trees")
      .attr("width", 60)
      .attr("height", 60)
      .attr("x", (width/6) + x)
      .attr("y",height - y);
  }

  componentDidMount() {
    this.NUM_OF_BRANCHES = 10;
    this.updateTrees();
    this.startNodeSimulation(); 
  }

  startNodeSimulation() {
    const width = 600,
      height = 300,
      radius = 2;

    let nodes = [],
        counter = 0,
        int;

    let svg = d3.select("#treelandscape")
        .attr("width", width)
        .attr("height", height);

    let simulation = d3.forceSimulation()
          .force("x", d3.forceX().x(width/2))
          .force("y", d3.forceY().y(80))
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
    
    d3.select("#start-btn").on("click", () => {

        if (!this.state.readyToSimulate) {
          this.setState({ 
            simulationMessage: "You need to reset the simulation first!"
          })
        } else {
          // this.updateTrees()
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

              // add dot by the trees for every carbon removed
              d3.select("#treelandscape")
                  .append('rect')
                  .attr("x", 270+(this.state.yearCount*10))
                  .attr("y", 255 - (i*10))
                  .attr('rx', 10)
                  .attr('ry', 10)
                  .attr('width', 5)
                  .attr('height', 5)
                  .attr('fill', '#9BBBD8')
                  .attr('opacity', 0)
                  .attr('class', 'removed-carbon')
                  .transition()
                  .delay(300)
                  .attr('opacity', 1);
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
              
              // remove # of carbon that tree has sequestered
              let selec = d3.selectAll('.removed-carbon');
              let lastNode = selec.nodes()[selec.nodes().length - 1]
              
              lastNode.remove();
              
              console.log(lastNode)
            }
            updateSim();

            d3.select(".svg-trees")
                .remove();

            this.props.updateProps({
              numtrees: this.props.numtrees - 1
            })

            this.setState({ 
              disasterCount: this.state.disasterCount + 1,
              simulationMessage: 'We lost a tree! Removing CO₂...'
            })

            if (this.props.numtrees < 1) {
              clearInterval(counterForTrees)
              this.setState({
                simulationState: 'waitingForRestart',
                simulationMessage: 'We ran out of trees...😔',
                readyToSimulate: false
              });

            } else if (this.state.yearCount > 29) {
              clearInterval(counterForTrees)
              this.setState({
                simulationState: 'waitingForRestart',
                simulationMessage: "It's been 30 yrs. We ran out of time...😔",
                readyToSimulate: false
              });
            }
          }, 3000);
        }
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
      simulationMessage: "Drag the slider to plant more trees.",
      yearCount: 0,
      disasterCount: 0,
      readyToSimulate: true
    });

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
          { this.state.simulationState == 'beforeFirstStart'  ? <h4>Let's plant a forest of { this.props.numtrees * 1000 } trees</h4> : null }
          { this.state.simulationState == 'beforeFirstStart'  ? <p>Each 🌲 represents 1,000 trees</p> : null }
        </div>
        <div >
          { this.state.simulationState == 'running' || this.state.simulationState == 'waitingForRestart' ? <h4>{this.state.simulationMessage}</h4> : null }
          { this.state.simulationState == 'running' || this.state.simulationState == 'waitingForRestart'  ? <p>Trees lost: {this.state.disasterCount}</p> : null }
          { this.state.simulationState == 'running' || this.state.simulationState == 'waitingForRestart'  ? <p>CO₂ sequestered: {this.state.disasterCount}</p> : null }
          { this.state.simulationState == 'running' || this.state.simulationState == 'waitingForRestart'  ? <p>CO₂ released: {this.state.disasterCount}</p> : null }
        </div>
      
        <div className="content column">
          <svg id="treelandscape" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="440" cy="7" rx="3" fill="#F09989"></ellipse>
            <text class="co2-legend" x="450" y="10">= 10kg CO₂</text>
            <text class="co2-type" x="250" y="10">Atmospheric CO₂</text>
            <text class="co2-type" x="250" y="290">Sequestered CO₂</text>
          </svg>
        </div>

        <div className="flex-container">
          <div class="flex-child">
            <button id="start-btn">Start Simulation</button>
            { this.state.simulationState == 'waitingForRestart'  ? <button id="restart-btn" onClick={() => this.resetTheSim()}>Reset</button> : null }
          </div>
          <div class="flex-child-3">
            <div class='progress-bar-outer'>
                <div class='progress-bar-inner' style={{width: (this.state.yearCount * 3.333) + '%'}}></div>
            </div>
            <p>Years elapsed: {this.state.yearCount}</p>
          </div>
        </div>

        <div>
        <span class="simulation-citation">The data for this simulation is based on a few estimates, but is mainly meant to illustrate a wider problem. Rate of CO₂ removal assumes that a mature tree absorbs 48 lbs/yr (estimate from the <a href="http://www.tenmilliontrees.org/trees/" target="_blank">10 Million Trees project</a>), but these estimates vary greatly by region, type of tree, and age of tree. The rate of deforestation assumes that deforestation rates will stay the same or increase in the future.</span>
        </div>
      </div>
    );
  }
}

export default treeSimulator;