var cache = (function () {
  var store;
  return {
    cached: false,
    get: function () {
      return store;
    },
    set: function (x) {
      store = x;

      if (x === undefined){
        this.cached = false;
      } else {
        this.cached = true;
      }
    }
  };
})();

var $limit = $('#limit');

$limit.on('change', function () {
  draw(null, Number(this.value));
});

$.ajax({
  method: 'GET',
  url: 'lovecraft.txt',
  dataType: 'text',
  success: function (text) {
    draw(text, $limit.val());
  },
  error: function (error) {
    alert('error');
  }
});

function notInExceptions(word) {
  return exeptions.every(function (exeption) {
    return typeof exeption == 'string' ? word !== exeption : !exeption.test(word);
  });
}

function parse(text, limit) {
  var table = [];

  if (!cache.cached){
    var words = text.replace(/[\.,\?\!\;\:\-«»\"\'\\(]/g, ' ').split(/\s/);
    var dict = words.map(function (word) {
      return word.toLowerCase();
    }).filter(function (word) {
      return word.length > 4 && notInExceptions(word);
    }).map(function (word) {
      var match = equals.filter(function (matcher) {
        return matcher.reg.test(word);
      });

      if (match.length){
        word = match[0].to;
      }

      return word;
    })
        .reduce(function (sum, word) {
          if (sum[word]){
            sum[word] += 1;
          } else {
            sum[word] = 1;
          }
          return sum;
        }, {});

    for (var word in dict){
      table.push({
        word: word,
        count: dict[word]
      });
    }

    table.sort(function (a, b) {
      return b.count - a.count;
    });

    cache.set(table);
  }else {
    table = cache.get();
  }

  return table.slice(0, limit);
}

function prop(x) {
  return function (d) {
    return d[x];
  };
}

var getCount = prop('count');
var getWord = prop('word');

var PADDING = 5;
var BAR_WIDTH = 40;
//var MARGIN = PADDING + BAR_WIDTH;

var CHART = {
  height: 500
};

var margin = {
  left: 20,
  top: 20,
  right: 20,
  bottom: 20,
  bar: 5
};

var y = d3.scale.linear().range([CHART.height, 0]);

var chart = d3.select('.chart')
            .attr('height', CHART.height);

function draw(text, limit) {
  var words = parse(text, limit);

  CHART.width = words.length * BAR_WIDTH;

  chart = chart.attr('width', CHART.width);

  var x = d3.scale.ordinal()
      .domain(words.map(getWord))
      .rangeRoundBands([0, CHART.width], 0.1);

  y.domain([
      d3.min(words, getCount),
      d3.max(words, getCount),
  ]);

  chart.html('');

  var bar = chart.selectAll('g')
      .data(words)
          .enter().append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + i * BAR_WIDTH + ',0)';
        });

  bar.append('rect')
        .attr('y', function (d) {
          return y(d.count);
        })
        .attr('height', function (d) {
          return CHART.height - y(d.count);
        })
        .attr('width', x.rangeBand());

  bar.append('text')
      .attr('x', x.rangeBand() / 2)
        .attr('y', function (d) {
          return y(d.count) + 3;
        })
        .attr('dy', '.75em')
        .text(function (d) {
          return d.word + '(' + d.count + ')';
        });

  // bar.append("text")
  //     .attr("x", x.rangeBand() / 2)
  //     .attr("y", function(d) {
  //         return y(d.count) + 3;
  //     })
  //     .attr("dy", ".75em")
  //     .text(function(d) {
  //         return d.count;
  //     });

  // var xAxis = d3.svg.axis()
  //     .scale(x)
  //     .orient("bottom");

  // var yAxis = d3.svg.axis()
  //     .scale(y)
  //     .orient("left");

  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + CHART_HEIGHT + ")")
  //     .call(xAxis);

  // svg.append("g")
  //     .attr("class", "x axis")
  //     .call(yAxis);

  // var bar = svg
  //     .selectAll("g")
  //     .data(words)
  //     .enter().append("g")
  //     .attr("transform", function(d, i) {
  //         return "translate(" + (i *  MARGIN) + ",0)";
  //     });

  // bar .append("rect")
  //     .attr('y', function(d) {
  //         return CHART_HEIGHT - y(d.count);
  //     })
  //     .attr("height", function(d){
  //         return y(d.count);
  //     })
  //     .attr("width", x.rangeBand())

  // var rects = bar.selectAll('rect');

  // rects.on('mouseover', function(data){
  //  var popup = d3  .select('body')
  //                  .append('div')
  //                  .attr('class', 'popup');

  //  popup.append('span').text('Word:' + data.word);
  //  popup.append('span').text('Count:' + data.count);
  // }).on('mouseout', function(){
  //  d3.select('div.popup').remove();
  // })
}
