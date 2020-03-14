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
}

var button2 = document.getElementById("populate1");
button2.onclick = function() {
    url = "";
    url += "landing-page.html?name=";
    interesting_movies = ["B000WC39VS", "B000WC39VS", "B000093FHC", "B010GJM7BE", "B00JOMGFRC", "B0000DKMK0", "B0074JOCMC", "B00JF8YLNA"]
    x = getRandomInt(0, interesting_movies.length);
    console.log(x);
    url += interesting_movies[x];
    document.location.href = url;

}

var button3 = document.getElementById("populate2");
button3.onclick = function() {
    url = "";
    url += "landing-page.html?name=";
    interesting_tv = ["B0001NBNIY", "B00EZWKCVG", "B003L77GE2", "B000X25F7I", "B01936Q064", "B00ICR6SBI", "B00005JLF3", "B000A0GP1S", "B001RTSPVY", "B0007QS22K"]
    x = getRandomInt(0, interesting_tv.length);
    url += interesting_tv[x];
    document.location.href = url;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
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
        const result = document.createElement("li");
        result.setAttribute("class", "no_result");
        result.setAttribute("tabindex", "1");
        result.innerHTML = "No Results";
        document.querySelector("#autoComplete_list").appendChild(result);
    },
    onSelection: feedback => {
    	console.log(index_asin_map.get(title_index_map.get(feedback.selection.value)))
      var b = index_asin_map.get(title_index_map.get(feedback.selection.value)),
          url = 'landing-page.html?name=' + encodeURIComponent(b);
      document.location.href = url;

    }
});