const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class D3LineChart extends D3Component {
  initialize(node, props) {
    // console.log('Initializing custom D3 component. This component requires that the author is responsible for updating the DOM as properties change.');
    const svg = (this.svg = d3.select(node).append('svg'));

    let data_85 = [];
    let data_3 = [];
    let data_6 = [];
    let data_45 = [];

    var parseTime = d3.timeParse("%Y");
    
    props.data.forEach( d => {
      data_85.push({
        date: parseTime(d.years),
        co2: +d['CO2EQ']
      })
    })

    props.scenario3.forEach( d => {
      data_3.push({
        date: parseTime(d.years),
        co2: +d['CO2EQ']
      })
    })

    props.scenario6.forEach( d => {
      data_6.push({
        date: parseTime(d.years),
        co2: +d['CO2EQ']
      })
    })

    props.scenario45.forEach( d => {
      data_45.push({
        date: parseTime(d.years),
        co2: +d['CO2EQ']
      })
    })

    this.drawChart(data_85, data_45, data_6, data_3)

  }
  drawChart(d85, d45, d6, data3) { 
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 650 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
    
    const svg = d3.select('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.co2); });

      x.domain(d3.extent(d85, function(d) { return d.date; }));
      y.domain(d3.extent(d85, function(d) { return d.co2; }));

      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
      .select(".domain")
        .remove();

      g.append("g")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("CO2 Equivalent");

      g.append("path")
          .datum(d85)
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line);

      g.append("path")
          .datum(d45)
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line);

      g.append("path")
          .datum(d6)
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line);

      g.append("path")
          .datum(data3)
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line);
  }

  update(props, oldProps) {
    console.log('Updating component properties', props, oldProps);
    // this.svg
    //   .selectAll('circle')
    //   .transition()
    //   .duration(750)
    //   .attr('cx', Math.random() * sizeX)
    //   .attr('cy', Math.random() * sizeY);
  }
}

module.exports = D3LineChart;
