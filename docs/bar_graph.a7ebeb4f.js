// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"uEgO":[function(require,module,exports) {
var margin = {
  top: 35,
  right: 20,
  bottom: 70,
  left: 60
},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom; // set the ranges

var x = d3.scaleBand().range([0, width]).padding(0.1);
var y = d3.scaleLinear().range([height, 0]); // append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin

var svg = d3.select("#bargraph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).attr("class", "bar-background").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // get the data

d3.csv("Maximums_reviewCount_by_year.csv", function (error, data) {
  if (error) throw error; // format the data

  data.forEach(function (d) {
    d.reviewCount = +d.reviewCount;
  }); // Scale the range of the data in the domains

  x.domain(data.map(function (d) {
    return d.year;
  }));
  y.domain([0, d3.max(data, function (d) {
    return d.reviewCount;
  })]); // append the rectangles for the bar chart

  svg.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("x", function (d) {
    return x(d.year);
  }).attr("width", x.bandwidth()).attr("y", function (d) {
    return y(d.reviewCount);
  }).attr("height", function (d) {
    return height - y(d.reviewCount);
  }); // add the x Axis

  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(5)); // add the y Axis

  svg.append("g").call(d3.axisLeft(y).ticks(5));
  svg.append("text").attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")").style("text-anchor", "middle").text("Year");
  svg.append("text").attr("x", width / 2).attr("y", 0 - margin.top / 2).attr("text-anchor", "middle").style("font-size", "16px").style("text-decoration", "underline").text("Maximum Review Count for a Movie vs. Year");
  svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - height / 2).attr("dy", "1em").style("text-anchor", "middle").text("Maximum Review Count");
});
},{}]},{},["uEgO"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-explore-college-majors/bar_graph.a7ebeb4f.js.map