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

var exeptions = [
    /^сво((и[хм])|(его)|(ей)|й)$/,
    /^сказа((ть)|(л)|(ли))$/,
    /^которы*/, 'после',
    /^мож((ет)|(но))/, 'некоторые',
    'когда', 'между', 'более', 'однако',
    'только', 'нибудь', 'конечно', 
    'перед', 'такой', 'среди', 'через', 'наших',
    'всякий', 'теперь',
    'чтобы', 'какой', 'тогда', 'долго',
    'здесь', 'больше', 'будет', 'именно',
    'также', 'этого', 'пусть', 'вдруг'
]

var equals = [
    { reg: /^самолет*/, to: 'самолет' },
    { reg: /^врем[яе]*/, to: 'время' },
    { reg: /^хребт*/, to: 'хребты' },
    { reg: /^старц*/, to: 'старцы' },
    { reg: /^земл*/, to: 'земля' },
    { reg: /^голов*/, to: 'голова' },
    { reg: /^((страх*)|(ужас*))/, to: 'страх'},
    { reg: /^безуми*/, to: 'безумие'}
];

$limit.on('change', function(){
    draw(null, Number(this.value));
});

$.ajax({
    method: 'GET',
    url: 'lovecraft.txt',
    dataType: 'text',
    success: function(text){
        draw(text, $limit.val());
    },
    error: function (error){
        alert('error');
    }
});

function notInExceptions(word){
    return exeptions.every(function(exeption){
        return typeof exeption == 'string' ? word !== exeption : !exeption.test(word);
    });
}

function parse(text, limit){
    var table = [];

    if(!cache.cached){
        var words = text.replace(/[\.,\?\!\;\:\-«»\"\'\\(]/g, '').split(/\s/);
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

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    bar_width = 50,
    width = 1024 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

var chart = d3.select("svg")
    .attr("height", height + margin.top + margin.bottom);

var svg = chart
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



function draw(text, limit){
    var data = parse(text, limit);
    
    chart.attr("width", bar_width * data.length + margin.left + margin.right);
    svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x = x.rangeRoundBands([0, bar_width * data.length], .1);
    xAxis = xAxis.scale(x);

    svg.html('');    
    
    x.domain(data.map(getWord));
    y.domain([0, d3.max(data, getCount)]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .attr('transform', "translate(-6, 0)")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr('font-size', "12px")
      .style("text-anchor", "end")
      .text("Количество сочетаний");

    var bars = svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.word); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.count); })
      .attr("height", function(d) { return height - y(d.count); });
}