const natural = require('natural')

// CONSTANTS
const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';
const unimportantTags = new Set(['IN', 'CC', 'CD', 'DT', 'EX', 'LS', 'MD', 'PDT', 'POS', 'PRP', 'PRP$', 'TO', 'WP', 'WP$', 'WRB']);

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
    console.log(reviewTexts);
    // Step 3. POS tag each word
    var taggedReviews = [];
    reviewTexts.forEach(function(r) {
        var tokenizer = new natural.WordTokenizer();
        var review_array = tokenizer.tokenize("your dog has fleas.");
        var tagged_words = tagger.tag(review_array);
        console.log(tagged_words);
        taggedReviews.push(tagged_words);
    });
    // Step 4. Throw out inconsequential words
    // Step 5. create a dictionary of word --> count
    var word_count = {}
    // taggedReviews.forEach(function(r) {
    // })
    // Step 6. call drawWordCloud() with the dictionary.
},

function drawWordCloud(word_entries) {
    var svg_location = "#wordcloud";
    // width and height?
    var width = $(document).width();
    var height = $(document).height();
    var fill = d3.scale.category20();
    var word_entries = d3.entries(word_entries);var xScale = d3.scale.linear()
    .domain([0, d3.max(word_entries, function(d) {
       return d.value;
     })
    ])
    .range([10,100]); // may need to change ths range? unclear what this is for
    d3.layout.cloud().size([width, height])
          .timeInterval(20) // check what this does
          .words(word_entries)
          .fontSize(function(d) { return xScale(+d.value); })
          .text(function(d) { return d.key; })
          .rotate(function() { return ~~(Math.random() * 2) * 90; }) // optional - 
                                                                    // may look better w/o
                                                                    // rotation.
          .font("Impact")
          .on("end", draw)
          .start();
          // call draw with wor
})}