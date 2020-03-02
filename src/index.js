

// You can require libraries
const d3 = require('d3')

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();


// You can load JSON files directly via require.
// Note this does not add a network request, it adds
// the data directly to your JavaScript bundle.
const exampleData = require('./example-data.json');


// Anything you put in the static folder will be available
// over the network, e.g.
/*
d3.csv('length_and_score.csv')
    .then((data) => {
d3.csv('score_averages.csv')
    .then((avg_data) => {
    console.log(avg_data)
var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom(x)

var yAxis = d3.axisLeft(y)

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

data.forEach(function(d) {
    d.overall = +d.overall;
    d.reviewLength = +d.reviewLength;
});
var line = d3.line()
    .x(function(d) { return d.overall; }) // set the x values for the line generator
    .y(function(d) { return d.reviewLength; }) // set the y values for the line generator
    .curve(d3.curveMonotoneX)
x.domain(d3.extent(data, function(d) {
    return d.overall;
}));
y.domain(d3.extent(data, function(d) {
    return d.reviewLength;
}));

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("X-Value");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Y-Value")

svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function(d) {
        return x(d.overall);
    })
    .attr("cy", function(d) {
        return y(d.reviewLength);
    });
svg.append("path")
        .datum(avg_data)
        .attr("class", "line")
        .attr("d", line);

})
})
*/
var margin = {top: 50, right: 50, bottom: 50, left: 50}
width = 500; // Use the window's width
height = 300; // Use the window's height
n=5

// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([.5, 5.5]) // input
    .range([0, width]); // output

// 6. Y scale will use the randomly generate number
var yScale = d3.scaleLinear()
    .domain([0, 10000]) // input
    .range([height, 0]); // output

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i+1); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.reviewLength); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line
 
// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
d3.csv('score_averages.csv')
    .then((dataset) => {
d3.csv('length_and_score.csv')
    .then((data) => {
data.forEach(function(d) {
    d.overall = +d.overall;
    d.overall = d.overall+(Math.random() - .5);
    d.reviewLength = +d.reviewLength;
});
console.log(data)


var svg = d3.select("#graph1").append("svg")
	.attr("width", 500 + margin.left + margin.right)
	.attr("height", 300 + margin.top + margin.bottom)
    // .attr("width", document.getElementById("graph1").offsetWidth)
    // .attr("height", document.getElementById("graph1").offsetHeight)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).ticks(5)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator
svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator

// Define the div for the tooltip
var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("pointer-events", "none");

// 12. Appends a circle for each datapoint
svg.selectAll(".dot")
    .data(data)
    .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d) { return xScale(d.overall) })
    .attr("cy", function(d) { return yScale(d.reviewLength) })
    .attr("r", 3);

// 9. Append the path, bind the data, and call the line generator
svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line) // 11. Calls the line generator
    .attr("r", 5)
    .on("mouseover", function (d) {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.text(d.reviewText)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    });
})
})
