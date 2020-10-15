const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const margin = {top: 40, right: 30, bottom: 30, left: 40};
const height = 400 - margin.top - margin.bottom;
let width = 650 + margin.left + margin.right;

const x = d3.scaleTime()
    .rangeRound([0, width]);

const y = d3.scaleLinear()
    .rangeRound([height, 0]);

const line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.co2); });

let data_85 = [];
let data_3 = [];
let data_6 = [];
let data_45 = [];

const color1 = "#D8FFA2",
  color3 = "#9BBBD8",
  color2 = "#ADADAD",
  color4 = "#F09989";

class D3LineChart extends D3Component {
  initialize(node, props) {
    // console.log('Initializing custom D3 component. This component requires that the author is responsible for updating the DOM as properties change.');
    const svg = (this.svg = d3.select(node).append('svg').attr("id", "multiline-chart"));

    this.drawChart(
      this.formatData(props.data, data_85),
      this.formatData(props.scenario45, data_45),
      this.formatData(props.scenario6, data_6),
      this.formatData(props.scenario3, data_3)
    )
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWidth);
  }

  formatData(rawData, targetData) {
    var parseTime = d3.timeParse("%Y");

    rawData.forEach( d => {
      targetData.push({
        date: parseTime(d.years),
        co2: +d['CO2EQ']
      })
    })

    return targetData
  }
  drawChart(d85, d45, d6, data3) {
    const svg = d3.select('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "chartBase");

       // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg.append("defs").append("svg:clipPath")
       .attr("id", "clip")
       .append("svg:rect")
       .attr("width", width )
       .attr("height", height )
       .attr("x", 0)
       .attr("y", 0);

      x.domain(d3.extent(d85, function(d) { return d.date; }));
      y.domain(d3.extent(d85, function(d) { return d.co2; }));

      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("class", "x-axis")
      .select(".domain")
        .remove();

      g.append("g")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "white")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("class", "y-axis")
        .text("CO2 Equivalent");

      g.append("path")
          .datum(d85)
          .attr("fill", "none")
          .attr("stroke", color4)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line)
          .attr("class", "worst-line")
          .attr("clip-path", "url(#clip)");

      g.append("text")
          .attr("transform", "translate(" + (width-50) + "," + (y(d85[d85.length - 1].co2) - 10) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .attr("class", "plot-labels")
          .style("fill", color4)
          .text("RCP 8.5");

      g.append("path")
          .datum(d45)
          .attr("fill", "none")
          .attr("stroke", color3)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line)
          .attr("class", "bad-line")
          .attr("clip-path", "url(#clip)");

      g.append("text")
          .attr("transform", "translate(" + (width-50) + "," + (y(d45[d45.length - 1].co2) - 10) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .attr("class", "plot-labels")
          .style("fill", color3)
          .text("RCP 4.5");

      g.append("path")
          .datum(d6)
          .attr("fill", "none")
          .attr("stroke", color2)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line)
          .attr("class", "good-line")
          .attr("clip-path", "url(#clip)");

      g.append("text")
          .attr("transform", "translate(" + (width-50) + "," + (y(d6[d6.length - 1].co2) - 10) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .attr("class", "plot-labels")
          .style("fill", color2)
          .text("RCP 6");

      g.append("path")
          .datum(data3)
          .attr("fill", "none")
          .attr("stroke", color1)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line)
          .attr("class", "best-line")
          .attr("clip-path", "url(#clip)");

      g.append("text")
          .attr("transform", "translate(" + (width-50) + "," + (y(data3[data3.length - 1].co2) - 10) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .attr("class", "plot-labels")
          .style("fill", color1)
          .text("RCP 2.6");

  }
  updateWidth() {
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let newWidth;
    // console.log(windowWidth)
    if (windowWidth < 480) {
      newWidth = 300
    } else if (windowWidth < 600) {
      newWidth = 400
    } else if (windowWidth < 800) {
      newWidth = 550
    } else {
      newWidth = 650;
    }

    d3.select('#multiline-chart').attr("width", newWidth+margin.left + margin.right)
    x.rangeRound([0, newWidth]);

    d3.select('.x-axis').transition().duration(1000).call(d3.axisBottom(x));
    d3.select('.worst-line').transition().duration(1000).attr("d", line);
    d3.select('.bad-line').transition().duration(1000).attr("d", line);
    d3.select('.good-line').transition().duration(1000).attr("d", line);
    d3.select('.best-line').transition().duration(1000).attr("d", line);
    d3.selectAll('.plot-labels').transition().duration(1000)
        .attr("transform", function(d, i) {
          return "translate(" + (newWidth-50) + "," + ((i+1)*20) + ")"
        })
    
  }
  updateRange(newXDomain, newYDomain, data_85, data_45, data_6, data_3) {
    
    x.domain(newXDomain)
    y.domain(newYDomain)

    d3.select('.x-axis').transition().duration(2000).call(d3.axisBottom(x));
    d3.select('.y-axis').transition().duration(2000).call(d3.axisLeft(y));

    d3.select('.worst-line').datum(data_85).transition().duration(2000).attr("d", line);
    d3.select('.bad-line').datum(data_45).transition().duration(2000).attr("d", line);
    d3.select('.good-line').datum(data_6).transition().duration(2000).attr("d", line);
    d3.select('.best-line').datum(data_3).transition().duration(2000).attr("d", line);
  }

  update(props, oldProps) {
    // console.log('Updating component properties', props, oldProps);
    console.log(props.selectedScenario)
    if (props.selectedScenario == "Entire projection") {
      const newXDomain = [new Date(1765, 1, 1, 10, 30, 30, 0), new Date(2500, 1, 1, 10, 30, 30, 0)]
      const newYDomain = [277, 2650]
      this.updateRange(
        newXDomain,
        newYDomain,
        data_85,
        data_45,
        data_6,
        data_3
      )
    } else {
      const newXDomain = [new Date(2000, 1, 1, 10, 30, 30, 0), new Date(2050, 1, 1, 10, 30, 30, 0)]
      const newYDomain = [277, 600]
      this.updateRange(
        newXDomain,
        newYDomain,
        data_85,
        data_45,
        data_6,
        data_3
      )
    }
  }
}

module.exports = D3LineChart;
