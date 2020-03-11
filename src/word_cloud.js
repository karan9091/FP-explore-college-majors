const natural = require('natural');
const fs = require('fs');
const d3 = require('d3');

// CONSTANTS
const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';
const unimportantTags = new Set(['IN', 'CC', 'CD', 'DT', 'EX', 'LS', 'MD', 'PDT', 'POS', 'PRP', 'PRP$', 'TO', 'WP', 'WP$', 'WRB', 'N']);

var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
var ruleSet = new natural.RuleSet('EN');
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

createWordEntries('0005019281');

function createWordEntries(asin) {
    // Step 1. open csv corresponding to that asin
    // Step 2. collect 'reviewText' field from each review in the csv
    var reviewTexts = [];
    d3.csv('asin/'+asin+'.csv')
	    .then((data) => {
	data.forEach(function(d) {
	    reviewTexts.push(d.reviewText);
    });
    // Step 3. POS tag each word
    var taggedReviews = [];
    reviewTexts.forEach(function(r) {
        var tokenizer = new natural.WordTokenizer();
        var review_array = tokenizer.tokenize(r);
        var tagged_words = tagger.tag(review_array);
        taggedReviews.push(tagged_words);
    });
    // Step 4. Throw out inconsequential words
    // Step 5. create a dictionary of word --> count
    var word_count = new Map();
    var num_words = 0;
    var counted = 0;
    taggedReviews.forEach(function(r) {
        r.taggedWords.forEach(function(w) {
            if(!unimportantTags.has(w.tag) && w.token.length > 1) {
                let token = w.token.toLowerCase();
                num_words += 1;
                if (word_count[token]) {
                    word_count[token]++;
                } else {
                    word_count[token] = 1;
                }
            }
        });
    });
})}


//     var svg_location = "#wordcloud";
//     var width = 400;
//     var height = 400;

//     // var fill = d3.scale.category20();

//     var word_entries = d3.entries(word_count);

//     var xScale = d3.scaleLinear()
//         .domain([0, d3.max(word_entries, function(d) {
//             return d.value;
//         })
//         ])
//         .range([10,100]);

//     d3.layout.cloud().size([width, height])
//         .timeInterval(20)
//         .words(word_entries)
//         .fontSize(function(d) { return xScale(+d.value); })
//         .text(function(d) { return d.key; })
//         .rotate(function() { return ~~(Math.random() * 2) * 90; })
//         .font("Impact")
//         .on("end", draw)
//         .start();

//     function draw(words) {
//     d3.select(svg_location).append("svg")
//         .attr("width", width)
//         .attr("height", height)
//         .append("g")
//         .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
//         .selectAll("text")
//         .data(words)
//         .enter().append("text")
//         .style("font-size", function(d) { return xScale(d.value) + "px"; })
//         .style("font-family", "Impact")
//         .style("fill", function(d, i) { return fill(i); })
//         .attr("text-anchor", "middle")
//         .attr("transform", function(d) {
//             return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
//         })
//         .text(function(d) { return d.key; });
//     }

//     d3.layout.cloud().stop();
// })}