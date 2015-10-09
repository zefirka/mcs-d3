var cache = (function(){
	var store;
	return {
		cached: false,
		get: function(){
			return store;
		},
		set: function(x){
			store = x;

			if (x === undefined){
				this.cached = false;
			} else {
				this.cached = true;
			}
		}
	}
})();

var $limit = $('#limit');
var $origin = $('#origin');

$limit.on('change', function(){
	draw(null, Number(this.value));
});

$origin.on('keyup', function(){
	cache.set();
	draw(this.value, Number($limit.val()));
});

function notInExceptions(word){
	return exeptions.every(function(exeption){
		return typeof exeption == 'string' ? word !== exeption : !exeption.test(word);
	});
}

function parse(text, limit){
	var table = [];

	if(!cache.cached){
		var words = text.replace(/[\.,\?\!\;\:\-«»\"\'\\(]/g, ' ').split(/\s/);
		var dict = words.map(function(word){
			return word.toLowerCase();
		}).filter(function(word){
			return word.length > 4 && notInExceptions(word);
		}).map(function(word){
			var match = equals.filter(function(matcher){
				return matcher.reg.test(word);
			});

			if(match.length){
				word = match[0].to;
			}

			return word;
		})
		.reduce(function(sum, word){
			if (sum[word]){
				sum[word] += 1;
			} else {
				sum[word] = 1;
			}
			return sum;
		}, {});
		
		for(var word in dict){
			table.push({
				word: word,
				count: dict[word]
			});
		};
		
		table.sort(function(a, b){
			return b.count - a.count;
		});

		cache.set(table);
	}else{
		table = cache.get();
	}

	return table.slice(0, limit);
}

function prop(x){
	return function(d){
		return d[x];
	};
}

var getCount = prop('count');
var getWord = prop('word');

var PADDING = 5;
var BAR_WIDTH = 40;
var MARGIN = PADDING + BAR_WIDTH;
var CHART_HEIGHT = 500;

var y = d3.scale.linear().range([0, CHART_HEIGHT])

function draw(text, limit){
	var words = parse(text, limit);

	y.domain([
		d3.min(words, getCount),
		d3.max(words, getCount),
	]);

	d3.select('.chart').html('');

	var svg = d3.select('.chart')
				.attr('width', words.length * MARGIN)
				.attr('height', CHART_HEIGHT);

	var bar = svg 	
		.selectAll("g")
    	.data(words)
  		.enter().append("g")
    	.attr("transform", function(d, i) { 
    		return "translate(" + (i *  MARGIN) + ",0)"; 
    	});

    bar .append("rect")
    	.attr('y', function(d) {
    		return CHART_HEIGHT - y(d.count);
    	})
    	.attr("height", function(d){
    		return y(d.count);
    	})
    	.attr("width", BAR_WIDTH)

    var rects = bar.selectAll('rect');
    
    rects.on('mouseover', function(data){
    	var popup = d3	.select('body')
    					.append('div')
    					.attr('class', 'popup');

    	popup.append('span').text('Word:' + data.word);
    	popup.append('span').text('Count:' + data.count);
    }).on('mouseout', function(){
    	d3.select('div.popup').remove();
    })
}