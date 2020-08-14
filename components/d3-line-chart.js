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
    
    this.drawChart(
      this.formatData(props.data, data_85),
      this.formatData(props.scenario45, data_45),
      this.formatData(props.scenario6, data_6),
      this.formatData(props.scenario3, data_3)
    )

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
    var margin = {top: 30, right: 30, bottom: 30, left: 40},
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
          .attr("stroke", "#245100")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line)
          .attr("class", "first-line");

      g.append("text")
          .attr("transform", "translate(" + (width-50) + "," + (y(d85[d85.length - 1].co2) - 10) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .style("fill", "#245100")
          .text("RCP 85");

      g.append("path")
          .datum(d45)
          .attr("fill", "none")
          .attr("stroke", "#5e8736")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line);

      g.append("text")
          .attr("transform", "translate(" + (width-50) + "," + (y(d45[d45.length - 1].co2) - 10) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .style("fill", "#5e8736")
          .text("RCP 4.5");

      g.append("path")
          .datum(d6)
          .attr("fill", "none")
          .attr("stroke", "#9ac26a")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line);

      g.append("text")
          .attr("transform", "translate(" + (width-50) + "," + (y(d6[d6.length - 1].co2) - 10) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .style("fill", "#9ac26a")
          .text("RCP 6");

      g.append("path")
          .datum(data3)
          .attr("fill", "none")
          .attr("stroke", "#d9ffa2")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line);

      g.append("text")
          .attr("transform", "translate(" + (width-50) + "," + (y(data3[data3.length - 1].co2) - 10) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .style("fill", "#d9ffa2")
          .text("RCP 2.6");
    
  }
  isolateLine(data) {
    console.log('new line')

    var margin = {top: 30, right: 40, bottom: 30, left: 40},
      width = 650 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    // var line = d3.line()
    //     .x(function(d) { return x(d.date); })
    //     .y(function(d) { return y(d.co2); });

      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain(d3.extent(data, function(d) { return d.co2; }));

    d3.select('.first-line')
        .datum(data)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.co2); })
        )
  }

  update(props, oldProps) {
    console.log('Updating component properties', props, oldProps);
    let data_85 = []

    if (props.selectedScenario == "All scenarios") {
      // this.drawChart(data_85, data_45, data_6, data_3)
    } else {
      this.isolateLine(this.formatData(props.data, data_85))
    }
    // this.svg
    //   .selectAll('circle')
    //   .transition()
    //   .duration(750)
    //   .attr('cx', Math.random() * sizeX)
    //   .attr('cy', Math.random() * sizeY);
  }
}

module.exports = D3LineChart;
