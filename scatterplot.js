// First, we will create some constants to define non-data-related parts of the visualization
var w = 700; // Width of our visualization
var h = 500; // Height of our visualization
var xOffset = 40; // Space for x-axis labels
var yOffset = 100; // Space for y-axis labels
var margin = 10; // Margin around visualization
//var vals = ['Rank', 'Frequency', 'TFIDF', 'Document Frequency']; // List of data attributes
var vals = ['x', 'y']; // List of data attributes

var xVal = vals[0]; // Value to plot on x-axis
var yVal = vals[1]; // Value to plot on y-axis
var transDur = 200;

// Next, we will load in our CSV of data
// d3.csv(filename, callback_function) where callback_function is 
// the code that runs after the data is uploaded. It's generally a 
// good idea to keep your vis code inside of this callback, like we
// do in this example below.
//d3.csv('shakespeare_top100.csv', function(csvData) {
d3.csv('./data/anscombe_I.csv', function(csvData) {

    var data = csvData;
    
    // Define scales that convert from the data domain to screen coordinates
    // This will define scales that convert values
	// from our data domain (.domain([min data value, max data value]) 
    // into screen coordinates (.range([min pixel value, max pixel value])).
    // Using linear scales maps the data directly to the pixel values using
    // pixel_val = c * data_val, where c is a constant computed by d3.
    var xScale = d3.scale.linear()
                    .domain([d3.min(data, function(d) { 
                        return parseFloat(d[xVal]);
                    })-1, d3.max(data, function(d) {
                        return parseFloat(d[xVal]);
                    })+1])
                    .range([xOffset + margin, w - margin]);
    
    var yScale = d3.scale.linear()
                    .domain([d3.min(data, function(d) {
                        return parseFloat(d[yVal]);
                    })-1, d3.max(data, function(d) {
                        return parseFloat(d[yVal]);
                    })+1])
                    .range([h - yOffset - margin, margin]);
    
    // Next, we will create an SVG element to contain our visualization.
    var svg = d3.select("#pointsSVG").append("svg:svg")
                                    .attr("width", w)
                                    .attr("height", h);
	

	// Build axes! (These are kind of annoying, actually...)
    // Specify the axis scale and general position
    var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom")
                      .ticks(5);
    
    // Add a graphics element to hold the axis we created above (xAxis)
    var xAxisG = svg.append('g')
                    .attr('class', 'axis')
                    .attr('transform', 'translate(0, ' + (h - yOffset) + ')')
                    .call(xAxis);
    
    // Add a label that shows the user what that axis represents
    var xLabel = svg.append("text")
                    .attr('class', 'label')
                    .attr('x', w/2)
                    .attr('y', h - margin/2)
                    .text(xVal);
    
    // Repeat for the y-axis
    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(5);
    
    var yAxisG = svg.append('g')
                    .attr('class', 'axis')
                    .attr('transform', 'translate(' + xOffset + ', 0)')
                    .call(yAxis);
    
    var yLabel = svg.append("text")
                    .attr('class', 'label')
                    .attr('x', xOffset/2)
                    .attr('y', h/2)
                    .text(yVal);

	// scatterplot!
	point = svg.selectAll('.point') 
				.data(data);		
	point.enter().append('svg:circle');	

	// Update our selection
	point
		.attr('class', 'point')									
		.attr('cx', function(d) { return xScale(d[xVal]); })	// x-coordinate
		.attr('cy', function(d) { return yScale(d[yVal]); })	// y-coordinate
		.style('fill','green')									// color
		.attr('r', 0)
		.transition()
		.duration(transDur)
		.attr('r', 5);											// radius
	point.append('svg:title')									// tooltip
		.text(function(d) { return d['Word']; });
    
   
});



// A function to retrieve the next value in the vals list
function getNextVal(val) {
	return vals[(vals.indexOf(val) + 1) % vals.length];
};

// A function to change what values we plot on the x-axis
function setXval(val) {
	// Update xVal
	xVal = val;
	// Update the axis
	xScale.domain([d3.min(data, function(d) { return parseFloat(d[xVal]); })-1,
				   d3.max(data, function(d) { return parseFloat(d[xVal]); })+1])
	xAxis.scale(xScale);
	xAxisG.call(xAxis);
	xLabel.text(xVal);
	// Update the points
	d3.selectAll('.point')
		.transition()
		.duration(transDur)
		.attr('cx', function(d) { return xScale(d[xVal]); });
}

// A function to change what values we plot on the y-axis
function setYval(val) {
	// Update yVal
	yVal = val;
	// Update the axis
	yScale.domain([d3.min(data, function(d) { return parseFloat(d[yVal]); })-1,
				   d3.max(data, function(d) { return parseFloat(d[yVal]); })+1])
	yAxis.scale(yScale);
	yAxisG.call(yAxis);
	yLabel.text(yVal);
	// Update the points
	d3.selectAll('.point')
		.transition()
		.duration(transDur)
		.attr('cy', function(d) { return yScale(d[yVal]); });
};
