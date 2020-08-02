const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class D3LineChart extends D3Component {
  initialize(node, props) {
    // console.log('Initializing custom D3 component. This component requires that the author is responsible for updating the DOM as properties change.');
    const svg = (this.svg = d3.select(node).append('svg'));

    // console.log(props.data)
    
    var margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 550 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
    
      svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let data = [];

    var parseTime = d3.timeParse("%Y");
    
    props.data.forEach( d => {
      data.push({
        date: parseTime(d.years),
        co2: +d['CO2EQ']
      })
    })

    console.log(data)

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.co2); });

      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain(d3.extent(data, function(d) { return d.co2; }));

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
          .text("Price ($)");

      g.append("path")
          .datum(data)
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
