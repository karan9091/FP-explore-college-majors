// You can require libraries
const d3 = require('d3');
const autoComplete = require("@tarekraafat/autocomplete.js/dist/js/autoComplete");

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();


// You can load JSON files directly via require.
// Note this does not add a network request, it adds
// the data directly to your JavaScript bundle.
const exampleData = require('./example-data.json');


window.onload = init 
var index_asin_map = new Map();
var asin_index_map = new Map();
var index_title_map = new Map();
var title_index_map = new Map();
var category_title_map = new Map();
var all_titles = []

function init() {
    // read in asin csv into memory
    var index = 0;
    d3.csv('metadata_asin.csv', function(data) {
        asin_index_map.set(data['asin'], index++);
        index_asin_map.set(index - 1, data['asin']);
    })
    // read in title csv into memory
    var index_1 = 0;
    d3.csv('metadata_title.csv', function(data) {
        index_title_map.set(index_1++, data['title']);
        title_index_map.set(data['title'], index_1-1);
        all_titles.push(data['title']);
    })
    // create category map with titles
    var index_2 = 0;
    d3.csv('metadata_category.csv', function(data) {
        categories = data['category'].substring(1, data['category'].length - 1);
        sep_categories = categories.split(', ');
        if(sep_categories.includes("'TV'")) {
            var key = 'TV';
        } else {
            var key = 'Movies';
        }
        category_title_map[key] = category_title_map[key] || [];
        category_title_map[key].push(index_title_map.get(index_2));
        index_2++;
    })
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
// console.log(all_titles);

// console.log(category_title_map);

function plot_asin(asin){
    document.getElementById("graph1").innerHTML = "";
	var margin = {top: 30, right: 50, bottom: 50, left: 55}
	width = window.innerWidth - 100; // Use the window's width
	height = 475; // Use the window's height
    margin_height = height - margin.top
    var double_margin = {top: 100, right: 100, bottom: 100, left: 100}
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
	    .y(function(d) { return yScale(d); }) // set the y values for the line generator
	 
	// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
	d3.csv('asin/'+asin+'.csv')
	    .then((data) => {
	var sum_list = [0, 0, 0, 0, 0];
	var count_list = [0, 0, 0, 0, 0];
	console.log(data)
	data.forEach(function(d) {
	    sum_list[d.overall-1] += parseInt(d.reviewLength, 10);
	    count_list[d.overall-1] += 1;
	    d.overall = +d.overall;
	    d.overall = d.overall + (Math.random() - .5) * .25
	    d.reviewLength = +d.reviewLength
	});
	console.log(sum_list)
	console.log(count_list)
	var avg_list = [];
	for(i = 0; i < 5; i++){
	    if(count_list[i] == 0) {
	        avg_list.push(0.0)
	    } else {
	        avg_list.push((sum_list[i]+0.0)/(count_list[i] + 0.0));
	    }
	}
    console.log(avg_list)
	var svg = d3.select("#graph1").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	    // .attr("width", document.getElementById("graph1").offsetWidth)
	    // .attr("height", document.getElementById("graph1").offsetHeight)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// 3. Call the x axis in a group tag
	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(xScale).ticks(5)); // Create an axis component with d3.axisBottom

	svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Review Length");

	// 4. Call the y axis in a group tag
	svg.append("g")
	    .attr("class", "y axis")
	    .call(d3.axisLeft(yScale).ticks(10)); // Create an axis component with d3.axisLeft

	svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Score");

	// 9. Append the path, bind the data, and call the line generator
	svg.append("path")
	    .datum(avg_list) // 10. Binds data to the line
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
	    .attr("r", 8)
	    .on("mouseover", function (d) {
	         div.transition()
	             .duration(200)
	             .style("opacity", .9);
	         div.html("Review Length: " + d.reviewLength + "<br> Review: " + d.reviewText)
	             .style("left", (d3.event.pageX) + "px")
	             .style("top", (d3.event.pageY - 28) + "px");
	     })

	// // 9. Append the path, bind the data, and call the line generator
	// svg.append("path")
	//     .datum(data) // 10. Binds data to the line
	//     .attr("class", "line") // Assign a class for styling
	//     .attr("d", line) // 11. Calls the line generator
	//     .attr("r", 5)
	//     .on("mouseover", function (d) {
	//         div.transition()
	//             .duration(200)
	//             .style("opacity", .9);
	//         div.text(d.reviewText)
	//             .style("left", (d3.event.pageX) + "px")
	//             .style("top", (d3.event.pageY - 28) + "px");
	//     })
	//     .on("mouseout", function (d) {
	//         div.transition()
	//             .duration(500)
	//             .style("opacity", 0);
	//     });
	})
}


/*    To load the asin from search on landing page      */

window.onload = function () {
    var url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
         tmp = params[i].split('=');
         data[tmp[0]] = tmp[1];
    }
    plot_asin(data.name);
    // document.getElementById('here').innerHTML = data.name;
}





// var margin = {top: 50, right: 50, bottom: 50, left: 50}
// width = 500; // Use the window's width
// height = 300; // Use the window's height

// // 5. X scale will use the index of our data
// var xScale2 = d3.scaleLinear()
//     .domain([1997.5, 2014.5]) // input
//     .range([0, width]); // output

// // 6. Y scale will use the randomly generate number
// var yScale2 = d3.scaleLinear()
//     .domain([0, 10000]) // input
//     .range([height, 0]); // output

// // 7. d3's line generator
// var line2 = d3.line()
//     .x(function(d, i) { return xScale2(i+1); }) // set the x values for the line generator
//     .y(function(d) { return yScale2(d.reviewLength); }) // set the y values for the line generator

// d3.csv('years/year_averages.csv')
//     .then((dataset2) => {
// d3.csv('length_and_year.csv')
//     .then((data2) => {
// data2.forEach(function(d) {
//     d.reviewYear = +d.reviewYear;
//     d.reviewLength = +d.reviewLength;
// });
// // console.log(dataset2)

// var svg = d3.select("#graph2").append("svg")
// 	.attr("width", 500 + margin.left + margin.right)
// 	.attr("height", 300 + margin.top + margin.bottom)
//     // .attr("width", document.getElementById("graph1").offsetWidth)
//     // .attr("height", document.getElementById("graph1").offsetHeight)
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // 3. Call the x axis in a group tag
// svg.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(xScale2).ticks(17)); // Create an axis component with d3.axisBottom

// // 4. Call the y axis in a group tag
// svg.append("g")
//     .attr("class", "y axis")
//     .call(d3.axisLeft(yScale2).ticks(10)); // Create an axis component with d3.axisLeft

// // 9. Append the path, bind the data, and call the line generator
// svg.append("path")
//     .datum(dataset2) // 10. Binds data to the line
//     .attr("class", "line") // Assign a class for styling
//     .attr("d", line2); // 11. Calls the line generator

// // Define the div for the tooltip
// var div = d3.select("body")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0)
//     .style("pointer-events", "none");

// // 12. Appends a circle for each datapoint
// svg.selectAll(".dot")
//     .data(data2)
//     .enter().append("circle") // Uses the enter().append() method
//     .attr("class", "dot") // Assign a class for styling
//     .attr("cx", function(d) { return xScale2(d.reviewYear) })
//     .attr("cy", function(d) { return yScale2(d.reviewLength) })
//     .attr("r", 3);

// // 9. Append the path, bind the data, and call the line generator
// svg.append("path")
//     .datum(dataset2) // 10. Binds data to the line
//     .attr("class", "line") // Assign a class for styling
//     .attr("d", line2) // 11. Calls the line generator
//     .attr("r", 5)
//     .on("mouseover", function (d) {
//         div.transition()
//             .duration(200)
//             .style("opacity", .9);
//         div.text(d.reviewText)
//             .style("left", (d3.event.pageX) + "px")
//             .style("top", (d3.event.pageY - 28) + "px");
//     })
//     .on("mouseout", function (d) {
//         div.transition()
//             .duration(500)
//             .style("opacity", 0);
//     });
// })
// })

new autoComplete({
    data: {
      src: all_titles,
      cache: true
    },
    query: {
          manipulate: (query) => {
            return query;
          }
    },
    sort: (a, b) => {
        if (a.match < b.match) return -1;
        if (a.match > b.match) return 1;
        return 0;
    },
    placeHolder: "Movies and Shows...",
    selector: "#autoComplete",
    threshold: 1,
    debounce: 300,
    searchEngine: "strict",
    resultsList: {
        render: true,
        container: source => {
            source.setAttribute("id", "media_list");
        },
        destination: document.querySelector("#autoComplete"),
        position: "afterend",
        element: "ul"
    },
    maxResults: 5,
    highlight: true,
    resultItem: {
        content: (data, source) => {
            source.innerHTML = data.match;
        },
        element: "li"
    },
    noResults: () => {
        const result = document.createElement("li");
        result.setAttribute("class", "no_result");
        result.setAttribute("tabindex", "1");
        result.innerHTML = "No Results";
        document.querySelector("#autoComplete_list").appendChild(result);
    },
    onSelection: feedback => {
    	console.log(index_asin_map.get(title_index_map.get(feedback.selection.value)))
            
        var b = index_asin_map.get(title_index_map.get(feedback.selection.value)),
            url = 'http://localhost:1234/index.html?name=' + encodeURIComponent(b);

        document.location.href = url;

        plot_asin(index_asin_map.get(title_index_map.get(feedback.selection.value)));
    }
});