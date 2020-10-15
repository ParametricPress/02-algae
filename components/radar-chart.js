const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class RadarChart extends D3Component {
  initialize(node) {
    // console.log('Initializing custom D3 component. This component requires that the author is responsible for updating the DOM as properties change.');
    // const svg = (this.svg = d3.select(node).append('svg'));
    const parent = d3.select(node);

    	//////////////////////////////////////////////////////////////
		//////////////////////// Set-Up //////////////////////////////
		//////////////////////////////////////////////////////////////

		const margin = { top: 80, right: 120, bottom: 50, left: 80 },
		width = Math.min(700, window.innerWidth / 6) - margin.left - margin.right,
		height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

        //////////////////////////////////////////////////////////////
        ////////////////////////// Data //////////////////////////////
        //////////////////////////////////////////////////////////////

        const data = [
			{ name: 'DAC + Soy',
			summary: 'Expensive and energy inefficient',
                axes: [
                    {axis: 'Land use (ha)', value: 0.667},
                    {axis: 'CO₂ Seq (t CO₂/yr)', value: 0.963},
                    {axis: 'Cost ($/t CO₂)', value: 1},
                    {axis: 'Energy returned', value: 0.129},
                    // {axis: 'GHG impact (kg CO₂e/t)', value: 1},
                    {axis: 'Water footprint (m3/t)', value: 0.614}
                ]
            },
			{ name: 'BECCS + Soy',
			summary: 'Energy efficient but big land/water footprint',
                axes: [
                    {axis: 'Land use (ha)', value: 1},
                    {axis: 'CO₂ Seq (t CO₂/yr)', value: 1},
                    {axis: 'Cost ($/t CO₂)', value: 0.511},
                    {axis: 'Energy returned', value: 1},
                    // {axis: 'GHG impact', value: 1},
                    {axis: 'Water footprint (m3/t)', value: 1}
                ]
            },
			{ name: 'ABECCS',
			summary: 'Small, energy positive and cost effective',
                axes: [
                    {axis: 'Land use (ha)', value: 0.667},
                    {axis: 'CO₂ Seq (t CO₂/yr)', value: 0.899},
                    {axis: 'Cost ($/t CO₂)', value: 0.329},                    
                    {axis: 'Energy returned', value: 0.64},
                    // {axis: 'GHG impact (kg CO₂e/t)', value: 1},
                    {axis: 'Water footprint (m3/t)', value: 0.61}
                ]
            }
        ];

        //////////////////////////////////////////////////////////////
        ////// Radar spec /////////////////////////////////////////
  		///// //////////////////////////////////
        //////////////////////////////////////////////////////////////
        var radarChartOptions = {
          w: 290,
          h: 350,
          margin: margin,
          levels: 5,
          roundStrokes: true,
          color: d3.scaleOrdinal().range(["#F09989", "#9BBBD8", "#D8FFA2"]),
            format: '.0f',
            legend: { title: 'Methods', translateX: 110, translateY: 20 },
            // unit: '$'
        };

        // Draw the chart, get a reference the created svg element :
        this.drawRadarChart("#radarChart", data, radarChartOptions, parent);
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateWidth);
  }
  updateWidth(node) {
	let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
	let newWidth;
	
    // console.log(windowWidth)
    // if (windowWidth < 700) {
	// 	d3.select(".radar").remove()
	// 	radarChartOptions.w = 300;
	// 	this.drawRadarChart("#radarChart", data, radarChartOptions, parent);
    // } else {
	// 	d3.select(".radar").remove()
	// 	radarChartOptions.w = 650;
	// 	this.drawRadarChart("#radarChart", data, radarChartOptions, parent);
    // }
  }
  drawRadarChart(id, data, options, parent) {
    const max = Math.max;
    const sin = Math.sin;
    const cos = Math.cos;
    const HALF_PI = Math.PI / 2;
    
	//Wraps SVG text - Taken from http://bl.ocks.org/mbostock/7555321
	const wrap = (text, width) => {
	  text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

			while (word = words.pop()) {
			  line.push(word);
			  tspan.text(line.join(" "));
			  if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			  }
			}
	  });
	}//wrap

	const cfg = {
	 w: 650,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 80, right: 25, bottom: 20, left: 10}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.35, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
	 format: '.2%',
	 unit: '',
	 legend: false
	};

	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if

	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	// var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	let maxValue = 0;
	for (let j=0; j < data.length; j++) {
		for (let i = 0; i < data[j].axes.length; i++) {
			data[j].axes[i]['id'] = data[j].name;
			if (data[j].axes[i]['value'] > maxValue) {
				maxValue = data[j].axes[i]['value'];
			}
		}
	}
	maxValue = max(cfg.maxValue, maxValue);

	const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format(cfg.format),			 	//Formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

	//Scale for the radius
	const rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);

	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	parent.select("svg").remove();

	//Initiate the radar chart SVG
	let svg = parent.append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar");

	//Append a g element
	let g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left + 50) + "," + (cfg.h/2 + cfg.margin.top) + ")")
			.style('position', 'relative');

	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////

	//Filter for the outside glow
	// let filter = g.append('defs').append('filter').attr('id','glow'),
	// 	feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
	// 	feMerge = filter.append('feMerge'),
	// 	feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
	// 	feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////

	//Wrapper for the grid & axes
	let axisGrid = g.append("g").attr("class", "axisWrapper");

	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", d => radius / cfg.levels * d)
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		// .style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", d => -d * radius / cfg.levels)
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "white")
	   .text(d => Format(maxValue * d / cfg.levels) + cfg.unit);

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////

	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => rScale(maxValue *1.1) * cos(angleSlice * i - HALF_PI))
		.attr("y2", (d, i) => rScale(maxValue* 1.1) * sin(angleSlice * i - HALF_PI))
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
        .style("font-size", "14px")
        .style("fill", "white")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", (d,i) => rScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI))
		.attr("y", (d,i) => rScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI))
		.text(d => d)
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////

	//The radial line function
	const radarLine = d3.radialLine()
		.curve(d3.curveLinearClosed)
		.radius(d => rScale(d.value))
		.angle((d,i) => i * angleSlice);

	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed.tension(0.5))
	}

	//Create a wrapper for the blobs
	const blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");

	const tooltipBox = g.append("rect")
		.attr("x", -265)
		.attr("y", -205)
		.attr('width', 200)
		.attr('height', 80)
		.attr('rx', 10)
		.attr('ry', 10)
		.attr('class', 'tooltip-box');

	const tooltipPreviewText = g.append("text")
		.attr('x', -165)
		.attr('y', -165)
		.style('fill', 'white')
		.style('font-family', 'Graphik Web')
		.style('font-size', '16px')
		.style('opacity', 0.5)
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.text('Hover for summary');
	
	const tooltip = g.append("text")
		.attr("class", "tooltip")
		.style('fill', 'white')
		.style('font-family', 'Graphik Web')
		.style('font-size', '16px')
		.style('opacity', 0)
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em");


	//Append the backgrounds
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", d => radarLine(d.axes))
		.style("fill", (d,i) => cfg.color(i))
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function(d, i) {
			//Dim all blobs
			parent.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1);
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);

			tooltipPreviewText.style('opacity', 0)
			// tooltip.transition().duration(50)

			tooltip
				.style('opacity', '1');

			
		})
		.on('mousemove', function(d) {
			tooltip
				.attr('x', -165)
				.attr('y', -175)			
				.text(d.summary)
				.call(wrap, 200);
		})
		.on('mouseout', () => {
			//Bring back all blobs
			parent.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);

			tooltip
				// .transition().duration(50)
				.style('opacity', 0)

			tooltipPreviewText.style('opacity', 0.5)
		});

	//Create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d.axes); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", (d,i) => cfg.color(i))
		.style("fill", "none")
		// .style("filter" , "url(#glow)");

	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(d => d.axes)
		.enter()
		.append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice * i - HALF_PI))
		.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
		.style("fill", (d) => cfg.color(d.id))
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////

	//Wrapper for the invisible circles on top
	const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");

	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(d => d.axes)
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius * 1.5)
		.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice*i - HALF_PI))
		.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice*i - HALF_PI))
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			// tooltip
			// 	.attr('x', 100)
			// 	.attr('y', 100)
			// 	.transition()
			// 	.style('display', 'block')				
			// 	.text(Format(d.value) + cfg.unit);
		})
		.on("mouseout", function(){
			// tooltip.transition()
			// 	.style('display', 'none').text('');
		});

	if (cfg.legend !== false && typeof cfg.legend === "object") {
		let legendZone = svg.append('g');
		let names = data.map(el => el.name);
		if (cfg.legend.title) {
			let title = legendZone.append("text")
				.attr("class", "title")
				.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
				.attr("x", cfg.w - 70)
				.attr("y", -10)
				.attr("font-size", "14px")
				.attr("fill", "white")
				.text(cfg.legend.title);
		}
		let legend = legendZone.append("g")
			.attr("class", "legend")
			.attr("height", 100)
			.attr("width", 200)
			.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`);
		// Create rectangles markers
		legend.selectAll('rect')
		  .data(names)
		  .enter()
		  .append("rect")
		  .attr("x", cfg.w - 55)
		  .attr("y", (d,i) => i * 20 - 20)
		  .attr("width", 10)
		  .attr("height", 10)
		  .style("fill", (d,i) => cfg.color(i));
		// Create labels
		legend.selectAll('text')
		  .data(names)
		  .enter()
		  .append("text")
		  .attr("x", cfg.w - 40)
		  .attr("y", (d,i) => i * 20 - 10)
		  .attr("font-size", "14px")
		  .attr("fill", "white")
		  .text(d => d);
	}
	return svg;
}

  update(props, oldProps) {
    // console.log('Updating component properties', props, oldProps);
  }
}

module.exports = RadarChart;
