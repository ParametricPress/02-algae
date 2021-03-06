// NOTES ON CODE INSPO
// - d3 nodes simulation from here: https://bl.ocks.org/madams1/920e92fb2923ab789057abb67047f0bb
// - SVG recursive tree from here: https://www.markhorsell.com/category/generative-art/

import React, { Component } from 'react';
const d3 = require('d3');

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
      carbonDots: 0,
      gridHeightStart: 240,
      gridWidthStart: 160
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
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "auto")
        .style('max-width', '600px');

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
                      return this.state.gridWidthStart+(this.state.carbonDots*10) // row 1
                    } else if (this.state.carbonDots >= 20 && this.state.carbonDots <39) {
                      return this.state.gridWidthStart-190+(this.state.carbonDots*10) //  row 2
                    } else if (this.state.carbonDots >= 40 && this.state.carbonDots <59) {
                      return this.state.gridWidthStart-390+(this.state.carbonDots*10) // row 3
                    } else if (this.state.carbonDots >= 60 && this.state.carbonDots <79) {
                      return this.state.gridWidthStart-590+(this.state.carbonDots*10) // row 4
                    } else if (this.state.carbonDots >= 80 && this.state.carbonDots <99) {
                      return this.state.gridWidthStart-790+(this.state.carbonDots*10) // row 5
                    } else {
                      return this.state.gridWidthStart-990+(this.state.carbonDots*10) // row 6
                    }
                  })
                  .attr("y", () => {
                    if (this.state.carbonDots < 20) {
                      return this.state.gridHeightStart;
                    } else if (this.state.carbonDots >= 20 && this.state.carbonDots <39) {
                      return this.state.gridHeightStart+10;
                    } else if (this.state.carbonDots >= 40 && this.state.carbonDots <59) {
                      return this.state.gridHeightStart+20;
                    } else if (this.state.carbonDots >= 60 && this.state.carbonDots <79) {
                      return this.state.gridHeightStart+30;
                    } else if (this.state.carbonDots >= 80 && this.state.carbonDots <100) {
                      return this.state.gridHeightStart+40; // row 5
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
          }, 4000);
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
      readyToSimulate: true,
      carbonDots: 0,
      gridHeightStart: 240,
      gridWidthStart: 160

    });

    d3.selectAll('.removed-carbon').remove();

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
        <div class="simulation-citation parametric-caption" style={{marginLeft: "0px"}}>The data for this simulation is based on a few estimates, but is meant to illustrate a wider problem. Rate of CO₂ removal assumes that a mature tree absorbs 48 lbs/yr (estimate from the <a href="http://www.tenmilliontrees.org/trees/" target="_blank">10 Million Trees project</a>), but these estimates vary greatly by region, type of tree, and age of tree. The rate of deforestation also varies greatly by location, and assumes that deforestation rates will stay the same or increase in the future for an area of untouched forest (i.e. no more trees planted). Our best estimates for global tree loss are <a target="_blank" href="https://news.yale.edu/2015/09/02/seeing-forest-and-trees-all-3-trillion-them">15 billion per year</a>. Deforestation rates for this simulation were inspired by <a target="_blank" href="https://www.globalforestwatch.org/dashboards/country/USA/5/?category=forest-change&dashboardPrompts=eyJzaG93UHJvbXB0cyI6dHJ1ZSwicHJvbXB0c1ZpZXdlZCI6WyJ2aWV3TmF0aW9uYWxEYXNoYm9hcmRzIiwiZG93bmxvYWREYXNoYm9hcmRTdGF0cyIsImRhc2hib2FyZEFuYWx5c2VzIl0sInNldHRpbmdzIjp7InNob3dQcm9tcHRzIjp0cnVlLCJwcm9tcHRzVmlld2VkIjpbInZpZXdOYXRpb25hbERhc2hib2FyZHMiLCJkb3dubG9hZERhc2hib2FyZFN0YXRzIl0sInNldHRpbmdzIjp7Im9wZW4iOmZhbHNlLCJzdGVwSW5kZXgiOjAsInN0ZXBzS2V5IjoiIn0sIm9wZW4iOnRydWUsInN0ZXBJbmRleCI6MCwic3RlcHNLZXkiOiJkYXNoYm9hcmRBbmFseXNlcyJ9LCJzdGVwc0tleSI6ImRhc2hib2FyZEFuYWx5c2VzIiwiZm9yY2UiOnRydWV9&gladAlerts=eyJpbnRlcmFjdGlvbiI6e319&location=WyJjb3VudHJ5IiwiVVNBIiwiNSJd&map=eyJjZW50ZXIiOnsibGF0IjozNy40MjAwOTM1MTMyNTk0MiwibG5nIjotMTE5LjI2OTY0OTk5OTk5MjMxfSwiem9vbSI6NC43MDM2ODk4MjMwMjI4MjYsImNhbkJvdW5kIjpmYWxzZSwiZGF0YXNldHMiOlt7Im9wYWNpdHkiOjAuNywidmlzaWJpbGl0eSI6dHJ1ZSwiZGF0YXNldCI6ImZlOGI1ZjAzLTBmZjktNGMxOC1iYTM5LTc3ZGNmZTY5OTA4ZiIsImxheWVycyI6WyI0MTA4NjU1NC01Y2E1LTQ1NmMtODBkZC1mNmJlZTYxYmM0NWYiXX0seyJkYXRhc2V0IjoiMGIwMjA4YjYtYjQyNC00YjU3LTk4NGYtY2FkZGZhMjViYTIyIiwibGF5ZXJzIjpbImNjMzU0MzJkLTM4ZDctNGEwMy04NzJlLTNhNzFhMmY1NTVmYyIsImI0NTM1MGUzLTVhNzYtNDRjZC1iMGE5LTUwMzhhMGQ4YmZhZSJdLCJib3VuZGFyeSI6dHJ1ZSwib3BhY2l0eSI6MSwidmlzaWJpbGl0eSI6dHJ1ZX0seyJkYXRhc2V0IjoiYjU4NDk1NGMtMGQ4ZC00MGM2LTg1OWMtZjNmZGYzYzJjNWRmIiwibGF5ZXJzIjpbIjQ5YTgwZTcwLWVjNTItNGVmOC1iY2M2LWZiMjc3MWQ5NWIyYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlLCJ0aW1lbGluZVBhcmFtcyI6eyJzdGFydERhdGUiOiIyMDAyLTAxLTAxIiwiZW5kRGF0ZSI6IjIwMTktMTItMzEiLCJ0cmltRW5kRGF0ZSI6IjIwMTktMTItMzEifSwicGFyYW1zIjp7InRocmVzaCI6MzAsInZpc2liaWxpdHkiOnRydWV9fV19&treeLoss=eyJpbnRlcmFjdGlvbiI6e319&treeLossPct=eyJpbnRlcmFjdGlvbiI6e319&treeLossPlantations=eyJpbnRlcmFjdGlvbiI6e319&treeLossTsc=eyJpbnRlcmFjdGlvbiI6e319">Global Forest Watch</a> tree loss rates for California, at 19% decline over the past 20 years. Due to the simplification of numbers (each tree equals one thousand) and time scale the figures represented should be treated as illustrative rather than exact.</div>
        </div>
      </div>
    );
  }
}

export default treeSimulator;