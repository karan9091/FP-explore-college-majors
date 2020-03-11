const natural = require('natural');
const fs = require('fs');
const d3 = require('d3');
const cloud = require('./d3.layout.cloud.js');

// CONSTANTS
const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';
const unimportantTags = new Set(['IN', 'CC', 'CD', 'DT', 'EX', 'LS', 'MD', 'PDT', 'POS', 'PRP', 'PRP$', 'TO', 'WP', 'WP$', 'WRB', 'N', 'WDT']);
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
            if(!unimportantTags.has(w.tag) && w.token.length > 2) {
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
    word_array = [];  
    Object.entries(word_count).forEach(([key, value]) => {
        new_word = [];
        new_word.push(key);
        // new_word.push(((1.0 * value) / (1.0 * num_words)));
        // new_word.push(value);
        new_word.push((1.0 * value) / 10);
        word_array.push(new_word);
     });
     cloud.cloud()
     .size([600, 600])
     .words(word_array
         .map(function(d) {
             return {text: d[0], size: d[1] * 100};}))
         .padding(5)
         .rotate(function() { return ~~(Math.random() * 0) * 90; })
         .font("Impact")
         .fontSize(function(d) { return d.size; })
         .on("end", draw)
         .start();
})}

function draw(words) {
    d3.select("#wordcloud").append("svg")
    .attr("width", 750)
    .attr("height", 750)
    .append("g")
    .attr("transform", "translate(300,300)")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .style("font-family", "Impact")
    // .style("fill", function(d, i) { return fill(i); })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
}
