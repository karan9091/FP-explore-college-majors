// You can require libraries
const d3 = require('d3');
const autoComplete = require("@tarekraafat/autocomplete.js/dist/js/autoComplete");
const createCloud = require('./word_cloud.js');
// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();


// You can load JSON files directly via require.
// Note this does not add a network request, it adds
// the data directly to your JavaScript bundle.
const exampleData = require('./example-data.json');


window.onload = init ;
document.addEventListener('DOMContentLoaded', (event) => {
    //the event occurred
    populate();
  });

var index_asin_map = new Map();
var asin_index_map = new Map();
var index_title_map = new Map();
var title_index_map = new Map();
var all_titles = []
var asin = "";

function init() {
    var url = document.location.href,
    params = url.split('?')[1].split('&'),
    data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    plot_asin(data.name, "score", "reviewLength");
    createCloud.createWordEntries(data.name);
    asin = data.name;
    var textBox = document.getElementById('reviewBox');
    textBox.innerHTML = "Hover over a point to read the Review!";
    parseMetadata(data.name);

}

function plot_asin(asin, x_axis, y_axis){	 
	// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number

    d3.csv('new_asin/' + asin + '.csv')
	    .then((data) => {
	var sum_list = [0, 0, 0, 0, 0];
	var count_list = [0, 0, 0, 0, 0];
    max_review = 0;
    avg_score = 0;
    num_reviews = 0;
	data.forEach(function(d) {
	    sum_list[d.overall-1] += parseInt(d.reviewLength, 10);
	    count_list[d.overall-1] += 1;
	    d.overall = +d.overall;
	    d.overall = d.overall + (Math.random() - .5) * .25
        avg_score += +d.overall;
        num_reviews++;
	    d.reviewLength = +d.reviewLength
        var a = new Date(d.unixReviewTime * 1000);
        year = a.getFullYear();
        d.unixReviewTime = year;
        // We cut out outliers over 10000 characters, squashed the rest of the data more than we wanted
        if (d.reviewLength > max_review && d.reviewLength < 10000) {
            max_review = +d.reviewLength;
        }
	});

    avg_score = avg_score / num_reviews;
    stars = "";
    for (i = 1; i <= 5; i++) {
        if (i > avg_score + .5) {
            stars += "&#9734;";
        } else {
            stars += "&#9733;";
        }
    }
    document.getElementById("stars-header-text").innerHTML = "<span class='stars-header-text1'>" + stars + "</span>";

    score_axis = [.5, 5.5];
    year_axis = [2000, 2015]; // TODO make sure to grab the actual years
    review_axis = [0, max_review + 50]
    x_axis_labels = [];
    y_axis_labels = [];
    if (x_axis == "score") {
        x_axis_labels = [.5, 5.5, "Score"];
    } else if (x_axis == "reviewLength") {
        x_axis_labels = [0, max_review + 50, "Review Length"];
    } else { // Year
        x_axis_labels = [2000, 2019, "Year"];
    }

    if (y_axis == "score") {
        y_axis_labels = [.5, 5.5, "Score"];
    } else if (y_axis == "reviewLength") {
        y_axis_labels = [0, max_review + 50, "Review Length"];
    } else { // Year
        y_axis_labels = [2000, 2019, "Year"];
    }   

    document.getElementById("graph1").innerHTML = "";
    var margin = {top: 30, right: 50, bottom: 50, left: 55}
    width = window.innerWidth - 100; // Use the window's width
    height = 475; // Use the window's height
    margin_height = height - margin.top
    var double_margin = {top: 100, right: 100, bottom: 100, left: 100}
    // 5. X scale will use the index of our data

    var xScale = d3.scaleLinear()
        .domain([x_axis_labels[0], x_axis_labels[1]]) // input
        .range([0, width]); // output

    var yScale = d3.scaleLinear()
        .domain([y_axis_labels[0], y_axis_labels[1]]) // input
        .range([height, 0]); // output

    // 7. d3's line generator
    var line = d3.line()
        .x(function(d, i) { return xScale(i+1); }) // set the x values for the line generator
        .y(function(d) { return yScale(d); }) // set the y values for the line generator

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
      .text(x_axis_labels[2]);

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
      .text(y_axis_labels[2]);

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
	    .attr("cx", function(d) { return add_point(x_axis_labels, d, true, xScale, yScale) })
	    .attr("cy", function(d) { return add_point(y_axis_labels, d, false, xScale, yScale) })
	    .attr("r", 8)
	    .on("mouseover", function (d) {
            var textBox = document.getElementById("reviewBox");
            textBox.innerHTML = "Review Text: <br/>" + d.reviewText;
	     })

        yScale = d3.scaleLinear()
        .domain([0, ]) // input
        .range([height, 0]); // output

	})
}

function add_point(labels, d, axis, xScale, yScale) {
    point = 0;
    if (labels[2] == "Year") {
        point = d.unixReviewTime;
    } else if (labels[2] == "Score") {
        point = d.overall;
    } else {
        point = d.reviewLength;
    }
    if (axis) {
        return xScale(point);
    } else {
        return yScale(point);
    }
}

var dropdown1 = document.getElementById("dropdown-1");
dropdown1.onclick = function() {
    var url = document.location.href,
    params = url.split('?')[1].split('&'),
    data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    plot_asin(data.name, "year", "reviewLength");
}

var dropdown2 = document.getElementById("dropdown-2");
dropdown2.onclick = function() {
    var url = document.location.href,
    params = url.split('?')[1].split('&'),
    data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    plot_asin(data.name, "score", "reviewLength");
}

var dropdown3 = document.getElementById("dropdown-3");
dropdown3.onclick = function() {
    var url = document.location.href,
    params = url.split('?')[1].split('&'),
    data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    plot_asin(data.name, "reviewLength", "year");
}

var dropdown4 = document.getElementById("dropdown-4");
dropdown4.onclick = function() {
    var url = document.location.href,
    params = url.split('?')[1].split('&'),
    data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    plot_asin(data.name, "reviewLength", "score");
}

var dropdown5 = document.getElementById("dropdown-5");
dropdown5.onclick = function() {
    var url = document.location.href,
    params = url.split('?')[1].split('&'),
    data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    plot_asin(data.name, "year", "score");
}

var dropdown6 = document.getElementById("dropdown-6");
dropdown6.onclick = function() {
    var url = document.location.href,
    params = url.split('?')[1].split('&'),
    data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    plot_asin(data.name, "score", "year");
}


function parseMetadata(asin) {
    console.log("given asin is ");
    console.log(asin);
    // read in asin csv into memory
    var index = 0;
    console.log("Started");
    d3.csv('metadata_asin.csv').then((d) => {
        d.forEach(function(data) {
            asin_index_map.set(data['asin'], index++);
            index_asin_map.set(index - 1, data['asin']);
        });

        // read in title csv into memory
        var index_1 = 0;
        d3.csv('metadata_title.csv').then((d) => {
            d.forEach(function(data) {
                index_title_map.set(index_1++, data['title']);
                title_index_map.set(data['title'], index_1-1);
                all_titles.push(data['title']);
            });
            var header = document.getElementById("main-header-text");
            header.innerHTML = "<span class='main-header-text1'>" + index_title_map.get(asin_index_map.get(asin)) + "</span>";

        });

    });


    

    /*
    var header = document.getElementById("main-header-text");
    console.log(index_title_map);
    header.innerHTML = index_title_map.get(asin_index_map.get(asin));
    */


    // console.log(asin_index_map.has("000073991X"));
    // console.log("trying something");
    // console.log(index_title_map.has('5'));
    // if (index_asin_map.has(asin)) {
    //     console.log("GOOD");
    // }
    // console.log()
    // console.log(asin);
}

function populate() {
    console.log("populate() asin=" + asin);
    var header = document.getElementById("main-header-text");
    //console.log(index_title_map);
    header.innerHTML = index_title_map.get(asin_index_map.get(asin));

}
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
        console.log(all_titles);
        const result = document.createElement("li");
        result.setAttribute("class", "no_result");
        result.setAttribute("tabindex", "1");
        result.innerHTML = "No Results";
        document.querySelector("#autoComplete_list").appendChild(result);
    },
    onSelection: feedback => {
        var asin = index_asin_map.get(title_index_map.get(feedback.selection.value));
        plot_asin(index_asin_map.get(title_index_map.get(feedback.selection.value)), "score", "reviewLength");
        createCloud.createWordEntries(asin);
        var textBox = document.getElementById('reviewBox');
        textBox.innerHTML = "Hover over a point to read the Review!";
        var header = document.getElementById("main-header-text");
        header.innerHTML = "<span class='main-header-text1'>" + feedback.selection.value + "</span>";
    }
});