

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


window.onload = init 

function init() {
    var tv_button = document.getElementById("TV_button");
    tv_button.addEventListener("click", function() {
        if(document.getElementById("TV_button").classList.contains("button_pressed")) {
            document.getElementById("TV_button").classList.remove("button_pressed")
        } else {
            document.getElementById("TV_button").classList.add("button_pressed")
        }
    })
    var movie_button = document.getElementById("movie_button");
    movie_button.addEventListener("click", function() {
        if(document.getElementById("movie_button").classList.contains("button_pressed")) {
            document.getElementById("movie_button").classList.remove("button_pressed")
        } else {
            document.getElementById("movie_button").classList.add("button_pressed")
        }
    })
}

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
  , width = window.innerWidth - margin.left - margin.right // Use the window's width
  , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height
n=5

// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([1, n]) // input
    .range([0, width]); // output

// 6. Y scale will use the randomly generate number
var yScale = d3.scaleLinear()
    .domain([0, 30000]) // input
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
    d.overall = d.overall+Math.random();
    d.reviewLength = +d.reviewLength;
});
console.log(data)
// 1. Add the SVG to the page and employ #2
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator
svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator

// 12. Appends a circle for each datapoint
svg.selectAll(".dot")
    .data(data)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d) { return xScale(d.overall) })
    .attr("cy", function(d) { return yScale(d.reviewLength) })
    .attr("r", 5);
})
})